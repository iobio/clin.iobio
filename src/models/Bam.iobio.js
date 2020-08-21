//import BamFile  from '../third-party/bam.js'
//import bin      from '../third-party/bin.js'
//import inflate  from '../third-party/inflate.js'
//import binary   from '../third-party/binary.js'


// extending Thomas Down's original BAM js work

import { createHoster } from 'fibridge-host';


export default class Bam {
   constructor(globalApp, endpoint, bamUri, baiUri, options) {
      this.globalApp = globalApp;
      this.endpoint = endpoint;
      this.bamUri = bamUri;
      this.baiUri = baiUri;
      this.options = options; // *** add options mapper ***

      // test if file or url
      if (typeof(this.bamUri) == "object") {
         this.sourceType = "url";
          this.bamFile = null;
          this.baiFile = null;
         // this.bamFile = this.bamUri;
         // this.baiFile = this.options.bai;
         this.makeBamBlob();
      } else  {
         this.sourceType = "url";
         this.bamFile = null;
         this.baiFile = null;
      }
      this.promises = [];


      this.ignoreMessages =  [
        /samtools\sError:\s.*:\sstderr\s-\s\[M::test_and_fetch\]\sdownloading\sfile\s.*\sto\slocal\sdirectory/
      ];


      this.errorMessageMap =  {
        "samtools Could not load .bai": {
            regExp: /samtools\sError:\s.*:\sstderr\s-\sCould not load .bai.*/,
            message:  "Unable to load the index (.bai) file, which has to exist in same directory and be given the same name as the .bam with the file extension of .bam.bai."
        },
         "samtools [E::hts_open]": {
            regExp:  /samtools\sError:\s.*:\sstderr\s-\s\[E::hts_open\]\sfail\sto\sopen\sfile/,
            message: "Unable to access the file.  "
         },
         "samtools [E::hts_open_format]": {
            regExp:  /samtools\sError:\s.*:\sstderr\s-\s\[E::hts_open_format\]\sfail\sto\sopen\sfile/,
            message: "Unable to access the file. "
         }
      }

      this.headerStr = null;




      return this;
   }

   clear() {
    this.bamFile = null;
    this.baiFile = null;
    this.bamUri = null;
    this.baiUri = null;
    this.header = null;
    this.headerStr =  null;
   }

   isEmpty() {
    return this.bamFile == null && this.bamUri == null;
   }

   makeBamBlob(callback) {
     var me = this;
       const proxyAddress = 'lf-proxy.iobio.io';
       const port = 443;
       const secure = true;
       const protocol = secure ? 'https:' : 'http:';
       // TODO: shouldn't this be going out of scope and eventually garbage
       // collected, which could lead to race conditions?
       createHoster({ proxyAddress, port, secure }).then((hoster) => {
           const bamPath = '/' + me.bamFile.name;
           hoster.hostFile({ path: bamPath, file: me.bamFile });
           const baiPath = '/' + me.baiFile.name;
           hoster.hostFile({ path: baiPath, file: me.baiFile });
           const portStr = hoster.getPortStr();
           const baseUrl = `${protocol}//${proxyAddress}${portStr}`;
           me.bamUri = `${baseUrl}${hoster.getHostedPath(bamPath)}`;
           me.baiUri = `${baseUrl}${hoster.getHostedPath(baiPath)}`;
           me.sourceType = "url";
           me.bamFile = null;
           me.baiFile = null;

       });

          if (callback) {
            callback();
          }


     //
     // this.bamBlob = new BlobFetchable(this.bamFile);
     // this.baiBlob = new BlobFetchable(this.baiFile); // *** add if statement if here ***
     // makeBam(this.bamBlob, this.baiBlob, function(bam) {
     //    me.setHeader(bam.header);
     //    me.provide(bam);
     //    if (callback) {
     //      callback();
     //    }
     // });
   }

  checkBamUrl(url, baiUrl, callback) {
    var me = this;

    var cmd = this.endpoint.getBamHeader(url, baiUrl);

    var success = null;
    cmd.on('data', function(data) {
      if (data != undefined) {
        success = true;
      }
    });

    cmd.on('end', function() {
      if (success == null) {
        success = true;
      }
      if (success) {
        callback(success);
      }
    });

    cmd.on('error', function(error) {
      if (me.ignoreErrorMessage(error)) {
        success = true;
        callback(success)
      } else {
        if (success == null) {
          success = false;
          me.bamUri = url;
          callback(success, me.translateErrorMessage(error));
        }
      }

    });

    cmd.run();

  }



  ignoreErrorMessage(error) {
    var me = this;
    var ignore = false;
    me.ignoreMessages.forEach( function(regExp) {
      if (error.match(regExp)) {
        ignore = true;
      }
    });
    return ignore;

  }

  translateErrorMessage(error) {
    var me = this;
    var message = null;
    for (var key in me.errorMessageMap) {
      var errMsg = me.errorMessageMap[key];
      if (message == null && error.match(errMsg.regExp)) {
        message = errMsg.message;
      }
    }
    return message ? message : error;
  }

  openBamFile(fileSelection, callback) {
    var me = this;


    if (fileSelection.files.length != 2) {
       callback(false, 'must select 2 files, both a .bam and .bam.bai file');
       return;
    }

    if (me.globalApp.utility.endsWith(fileSelection.files[0].name, ".sam") ||
        me.globalApp.utility.endsWith(fileSelection.files[1].name, ".sam")) {
      callback(false, 'You must select a bam file, not a sam file');
      return;
    }

    var bamTokens0    = /([^.]*)\.(bam)$/.exec(fileSelection.files[0].name);
    var bamTokens1    = /([^.]*)\.(bam)$/.exec(fileSelection.files[1].name);

    var baiTokens0    = /([^.]*)\.(bai|bam.bai)?$/.exec(fileSelection.files[0].name);
    var baiTokens1    = /([^.]*)\.(bai|bam.bai)?$/.exec(fileSelection.files[1].name);


    var bamFile = null;
    var baiFile = null;
    var rootBamFile = null;
    var rootBaiFile = null
    if (bamTokens0 && bamTokens0.length > 1 && bamTokens0[bamTokens0.length-1] == 'bam' ) {
      bamFile     = fileSelection.files[0];
      rootBamFile = bamTokens0[1];
      if (baiTokens1 && baiTokens1.length > 1 && (baiTokens1[baiTokens1.length-1] == 'bai' || baiTokens1[baiTokens1.length-1] == 'bam.bai')) {
        baiFile     = fileSelection.files[1];
        rootBaiFile = baiTokens1[1];
      }

    } else if (bamTokens1 && bamTokens1.length > 1 && bamTokens1[bamTokens1.length-1] == 'bam') {
      bamFile     = fileSelection.files[1];
      rootBamFile = bamTokens1[1];
      if (baiTokens0 && baiTokens0.length > 1 && (baiTokens0[baiTokens0.length-1] == 'bai' || baiTokens0[baiTokens0.length-1] == 'bam.bai')) {
        baiFile     = fileSelection.files[0];
        rootBaiFile = baiTokens0[1];
      }
    }

    if (bamFile == null || baiFile == null) {
      callback(false, 'You must select BOTH  a compressed bam file  and an index (.bai)  file');
      return;
    }


    if (rootBamFile != rootBaiFile) {
      callback(false, 'The index file must be named ' +  rootBamFile + ".bam.bai" + " or " + rootBamFile + ".bai");
      return;
    }
    me.bamFile   = bamFile;
    me.baiFile   = baiFile;

    me.sourceType = "file";
    me.makeBamBlob( function() {
      callback(true);
    });
    return;
  }


  fetch( name, start, end, callback, options ) {
    var me = this;
    // handle bam has been created yet
    if(this.bam == undefined) // **** TEST FOR BAD BAM ***
       this.promise(function() { me.fetch( name, start, end, callback, options ); });
    else
       this.bam.fetch( name, start, end, callback, options );
  }

  promise( callback ) {
    this.promises.push( callback );
  }

  provide(bam) {
    this.bam = bam;
    while( this.promises.length != 0 )
       this.promises.shift()();
  }


  // *** bamtools functionality ***
  convert(format, name, start, end, callback, options) {
    // Converts between BAM and a number of other formats
    if (!format || !name || !start || !end)
       return "Error: must supply format, sequenceid, start nucleotide and end nucleotide"

    if (format.toLowerCase() != "sam")
       return "Error: format + " + options.format + " is not supported"
    var me = this;
    this.fetch(name, start, end, function(data,e) {
       if(options && options.noHeader)
          callback(data, e);
       else {
          me.getHeader(function(h) {
             callback(h.toStr + data, e);
          })
       }
    }, { 'format': format })
   }


   getHeaderStr(callback) {
    var me = this;

    if (me.headerStr) {
       callback(me.headerStr);
    }
    else if (me.sourceType == 'file') {
      console.log('Error: header not set for local bam file');
      callback(null);
    } else {

      var cmd = me.endpoint.getBamHeader(me.bamUri, me.baiUri);

      var success = null;
      var rawHeader = "";
      cmd.on('data', function(data) {
        if (data != undefined) {
          rawHeader += data;
        }
      });

      cmd.on('end', function() {
        me.setHeader(rawHeader);
        callback(me.headerStr);
      });

      cmd.on('error', function(error) {
        console.log(error);
      });
      cmd.run();


    }
  }

  getHeader(callback) {
    var me = this;

    if (me.header) {
       callback(me.header);
    }
    // else if (me.sourceType == 'file') {
    //   console.log('Error: header not set for local bam file');
    //   callback(null);
    // }
    else {

      var cmd = me.endpoint.getBamHeader(me.bamUri, me.baiUri);
      var success = null;
      var rawHeader = "";
      cmd.on('data', function(data) {
        if (data != undefined) {
          rawHeader += data;
        }
      });

      cmd.on('end', function() {
        me.setHeader(rawHeader);
        callback( me.header);
      });

      cmd.on('error', function(error) {
        console.log(error);
      });
      cmd.run();


    }
  }



   setHeader(headerStr) {
      this.headerStr = headerStr;
      var header = { sq:[], toStr : headerStr };
      var lines = headerStr.split("\n");
      for ( var i=0; i<lines.length > 0; i++) {
         var fields = lines[i].split("\t");
         if (fields[0] == "@SQ") {
            var fHash = {};
            fields.forEach(function(field) {
              var values = field.split(':');
              fHash[ values[0] ] = values[1]
            })
            header.sq.push({name:fHash["SN"], end:1+parseInt(fHash["LN"])});
            header.species = fHash["SP"];
            header.assembly = fHash["AS"];
         }
      }
      this.header = header;
   }



  transformRefName(refName, callback) {
    var found = false;
    this.getHeader(function(header) {
      header.sq.forEach(function(seq) {
        if (seq.name == refName || seq.name.split('chr')[1] == refName || seq.name == refName.split('chr')[1]) {
          found = true;
          callback(seq.name);
        }
      })
      if (!found) callback(refName); // not found
    })
  }

  _getServerCacheKey(service, refName, start, end, miscObject) {
    var me = this;
    var key =  "backend.gene.iobio"
      //+ "-" + cacheHelper.launchTimestamp
      + "-" + me.bamUri ? me.bamUri : (me.bamFile ? me.bamFile.name : "?")
      + "-" + service
      + "-" + refName
      + "-" + start.toString()
      + "-" + end.toString();
    if (miscObject) {
      for (var miscKey in miscObject) {
        key += "-" + miscKey + "=" + miscObject[miscKey];
      }
    }
    return key;
  }

  /*
  *  This method will return coverage as point data.  It takes the reference name along
  *  with the region start and end.  Optionally, the caller can provide an array of
  *  region objects to get the coverage at exact positions.  Also, this method takes an
  *  optional argument of maxPoints that will specify how many data points should be returned
  *  for the region.  If not specified, all data points are returned.  The callback method
  *  will send back to arrays; one for the coverage points, reduced down to the maxPoints, and
  *  the second for coverage of specific positions.  The latter can then be matched to vcf records
  *  , for example, to obtain the coverage for each variant.
  */
  getCoverageForRegion(refName, regionStart, regionEnd, regions, maxPoints, useServerCache, callback, callbackError) {
    var me = this;

    this.transformRefName(refName, function(trRefName){

      var bamSource = {};
      if (me.sourceType == 'url') {
        bamSource.bamUrl = me.bamUri;
        bamSource.baiUrl = me.baiUri;
      } else {
        bamSource.writeStream = function(stream) {
          stream.write(me.header.toStr);
          me.convert('sam', trRefName, regionStart, regionEnd, function(data,e) {
            stream.write(data);
            stream.end();
          },
          {noHeader:true});
        }
      }

      var serverCacheKey = me._getServerCacheKey("coverage", trRefName, regionStart, regionEnd, {maxPoints: maxPoints});

      var cmd = me.endpoint.getBamCoverage(bamSource, trRefName, regionStart, regionEnd, regions, maxPoints, useServerCache, serverCacheKey);

      var samData = "";
      cmd.on('data', function(data) {
        if (data == undefined) {
          return;
        }

        samData += data;
      });

      cmd.on('end', function() {

        if (samData != "") {
          var coverage = null;
          var coverageForPoints = [];
          var coverageForRegion = [];
          var lines = samData.split('\n');
          lines.forEach(function(line) {
            if (line.indexOf("#specific_points") == 0) {
              coverage = coverageForPoints;
            } else if (line.indexOf("#reduced_points") == 0 ) {
              coverage = coverageForRegion;
            } else {
              var fields = line.split('\t');
              var pos = -1;
              var depth = -1;
              if (fields[0] != null && fields[0] != '') {
                var pos   = +fields[0];
              }
              if (fields[1] != null && fields[1] != '') {
                var depth = +fields[1];
              }
              if (coverage){
                if (pos > -1  && depth > -1) {
                  coverage.push([pos, depth]);
                }
              }
            }
          });
        }
        callback(coverageForRegion, coverageForPoints);
      });

      cmd.on('error', function(error) {
        console.log(error);

      });

      cmd.run();
    });
  }



  freebayesJointCall(geneObject, transcript, bams, isRefSeq, fbArgs, vepAF, sampleNames, gnomADExtra=false, decompose=false, callback) {
    var me = this;

    var refName     = geneObject.chr;
    var regionStart = geneObject.start;
    var regionEnd   = geneObject.end;

    this.transformRefName(refName, function(trRefName){


      //  Once all bam sources have been established
      var index = 0;
      var bamSources = [];
      me._initializeBamSource(bams, trRefName, regionStart, regionEnd, bamSources, index, function() {


        var cmd = me.endpoint.freebayesJointCall(bamSources, trRefName, regionStart, regionEnd, isRefSeq, fbArgs, vepAF, sampleNames, gnomADExtra, decompose, callback);

        var variantData = "";
        cmd.on('data', function(data) {
            if (data == undefined) {
              return;
            }

            variantData += data;
        });

        cmd.on('end', function() {
          callback(variantData, trRefName, geneObject, transcript);
        });

        cmd.on('error', function(error) {
          console.log(error);
        });

        cmd.run();
      });


    });

  }

  /*
   * Sequentially examine each bam source, either specifying the bamUrl, or creating
   * a blob (for local files)
   */
  _initializeBamSource(bams, refName, regionStart, regionEnd, bamSources, idx, callback) {
    var me  = this;
    if (idx == bams.length) {
      callback();
    } else {
      var bam = bams[idx];
      if (bam.bamUri) {
        bamSources.push({'bamUrl': bam.bamUri, 'baiUrl': bam.baiUri});
        idx++;
        me._initializeBamSource(bams, refName, regionStart, regionEnd, bamSources, idx, callback);
      } else {
        bam.convert('sam', refName, regionStart, regionEnd,
          function(data,e) {
            var bamBlob = new Blob([bam.header.toStr + "\n" + data]);
            bamSources.push({'bamBlob': bamBlob});
            idx++;
            me._initializeBamSource(bams, refName, regionStart, regionEnd, bamSources, idx, callback);
          },
          {noHeader:true}
        );
      }
    }
  }




  getGeneCoverage(geneObject, transcript, bams, callback) {
    var me = this;

    var refName     = geneObject.chr;
    var regionStart = geneObject.start;
    var regionEnd   = geneObject.end;

    // Capture all of the exon regions from the transcript
    var regions = [];
    transcript.features.forEach(function(feature) {
      if (feature.feature_type.toUpperCase() == 'CDS') {
        regions.push({start: feature.start, end: feature.end});
      }
    });

    this.transformRefName(refName, function(trRefName){

      var index = 0;
      var bamSources = [];
      me._initializeBamSource(bams, trRefName, regionStart, regionEnd, bamSources, index, function() {
        var cmd = me.endpoint.getGeneCoverage(bamSources, trRefName, geneObject.gene_name, regionStart, regionEnd, regions);
        var geneCoverageData = "";
        cmd.on('data', function(data) {
            if (data == undefined) {
              return;
            }
            geneCoverageData += data;
        });

        cmd.on('end', function() {
          callback(geneCoverageData, trRefName, geneObject, transcript);
        });

        cmd.on('error', function(error) {
          console.log(error);
        });

        cmd.run();
      });


    });


  }


  reducePoints(data, factor, xvalue, yvalue) {
    if (!factor || factor <= 1 ) {
      return data;
    }
    var results = [];
    // Create a sliding window of averages
    for (var i = 0; i < data.length; i+= factor) {
      // Slice from i to factor
      var avgWindow = data.slice(i, i + factor);
      var sum = 0;
      avgWindow.forEach(function(point) {
        var y = yvalue(point);
        if (y) { sum += d3.round(y); }
      });
      var average = d3.round(sum / avgWindow.length);
      results.push([xvalue(data[i]), average])
    }
    return results;
  }

}


