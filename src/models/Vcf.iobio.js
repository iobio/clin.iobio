//
//  vcfiobio
//  Tony Di Sera
//  October 2014
//
//  This is a data manager class for variant data.
//
//  Two file are used to generate the variant data:
//    1. the bgzipped vcf (.vcf.gz)
//    2. its corresponding tabix file (.vcf.gz.tbi).
//

import { createHoster } from 'fibridge-host';

export default function vcfiobio(theGlobalApp) {
  var backendPath = "backend.iobio.io";
  var apiClient = new iobioApiClient.Client(backendPath, { secure: true });
  
  var globalApp = theGlobalApp;

  var debug =  false;

  var exports = {};

  var isEduMode = false;

  // var dispatch = d3.dispatch( 'dataReady', 'dataLoading');

  var SOURCE_TYPE_URL = "URL";
  var SOURCE_TYPE_FILE = "file";
  var sourceType = "url";

  var vcfURL;
  var tbiUrl;

  var vcfReader;
  var vcfFile;
  var tabixFile;

  var size16kb = Math.pow(2, 14);
  var refData = [];
  var refDensity = [];
  var refName = "";
  var infoFields =  {};

  var regions = [];
  var regionIndex = 0;
  var stream = null;

  var endpoint = null;
  var genericAnnotation = null;
  var genomeBuildHelper = null;

  var samples = [];


  var VEP_FIELDS_AF_1000G  = "AF|AFR_AF|AMR_AF|EAS_AF|EUR_AF|SAS_AF".split("|");
  var VEP_FIELDS_AF_ESP    = "AA_AF|EA_AF".split("|");
  var VEP_FIELDS_AF_GNOMAD = "gnomAD_AF|gnomAD_AFR_AF|gnomAD_AMR_AF|gnomAD_ASJ_AF|gnomAD_EAS_AF|gnomAD_FIN_AF|gnomAD_NFE_AF|gnomAD_OTH_AF|gnomAD_SAS_AF".split("|");
  var VEP_FIELDS_AF_MAX    = "MAX_AF|MAX_AF_POPS".split("|");


  var CLINVAR_CODES = {
    '0':   'not_provided',
    '1':   'not_provided',
    '2':   'benign',
    '3':   'likely_benign',
    '4':   'likely_pathogenic',
    '5':   'pathogenic',
    '6':   'drug_response',
    '7':   'other',
    '255': 'other'
  }

  var GNOMAD_TAGS = {
    'AF':          'af',
    'AC':          'altCount',
    'AN':          'totalCount',
    'nhomalt_raw': 'homCount',
    'AF_popmax':   'afPopMax',

    'AF_fin': ['pop', 'fin', 'af'],
    'AC_fin': ['pop', 'fin', 'altCount'],
    'AN_fin': ['pop', 'fin', 'totalCount'],

    'AF_nfe': ['pop', 'nfe', 'af'],
    'AC_nfe': ['pop', 'nfe', 'altCount'],
    'AN_nfe': ['pop', 'nfe', 'totalCount'],

    'AF_oth': ['pop', 'oth', 'af'],
    'AC_oth': ['pop', 'oth', 'altCount'],
    'AN_oth': ['pop', 'oth', 'totalCount'],

    'AF_amr': ['pop', 'amr', 'af'],
    'AC_amr': ['pop', 'amr', 'altCount'],
    'AN_amr': ['pop', 'amr', 'totalCount'],

    'AF_afr': ['pop', 'afr', 'af'],
    'AC_afr': ['pop', 'afr', 'altCount'],
    'AN_afr': ['pop', 'afr', 'totalCount'],

    'AF_asj': ['pop', 'asj', 'af'],
    'AC_asj': ['pop', 'asj', 'altCount'],
    'AN_asj': ['pop', 'asj', 'totalCount'],

    'AF_eas': ['pop', 'eas', 'af'],
    'AC_eas': ['pop', 'eas', 'altCount'],
    'AN_eas': ['pop', 'eas', 'totalCount'],

    'AF_sas': ['pop', 'sas', 'af'],
    'AC_sas': ['pop', 'sas', 'altCount'],
    'AN_sas': ['pop', 'sas', 'totalCount'],
  }


  var effectCategories = [
    ['coding_sequence_variant', 'coding'],
    ['chromosome' ,'chromosome'],
    ['inframe_insertion'  ,'indel'],
    ['disruptive_inframe_insertion' ,'indel'],
    ['inframe_deletion' ,'indel'],
    ['disruptive_inframe_deletion'  ,'indel'],
    ['downstream_gene_variant'  ,'other'],
    ['exon_variant' ,'other'],
    ['exon_loss_variant'  ,'exon_loss'],
    ['frameshift_variant' ,'frameshift'],
    ['gene_variant' ,'other'],
    ['intergenic_region'  ,'other'],
    ['conserved_intergenic_variant' ,'other'],
    ['intragenic_variant' ,'other'],
    ['intron_variant' ,'other'],
    ['conserved_intron_variant' ,'other'],
    ['miRNA','other'],
    ['missense_variant' ,'missense'],
    ['initiator_codon_variant'  ,'missense'],
    ['stop_retained_variant'  ,'missense'],
    ['rare_amino_acid_variant'  ,'rare_amino_acid'],
    ['splice_acceptor_variant'  ,'splice_acceptor'],
    ['splice_donor_variant' ,'splice_donor'],
    ['splice_region_variant'  ,'splice_region'],
    ['stop_lost'  ,'stop_lost'],
    ['5_prime_UTR_premature start_codon_gain_variant' ,'utr'],
    ['start_lost' ,'start_lost'],
    ['stop_gained'  ,'stop_gained'],
    ['synonymous_variant' ,'synonymous'],
    ['start_retained' ,'synonymous'],
    ['stop_retained_variant'  ,'synonymous'],
    ['transcript_variant' ,'other'],
    ['regulatory_region_variant'  ,'regulatory'],
    ['upstream_gene_variant'  ,'other'],
    ['3_prime_UTR_variant'  ,'utr'],
    ['3_prime_UTR_truncation +','utr'],
    ['5_prime_UTR_variant'  ,'utr'],
    ['5_prime_UTR_truncation +','utr']
  ];

  exports.isFile = function() {
    return sourceType != null && sourceType == SOURCE_TYPE_FILE;
  }

  exports.hasFileOrUrl = function() {
    return vcfURL != null || vcfFile !=null;
  }

  exports.clear = function() {
    vcfURL = null;
    tbiUrl = null;
    vcfFile = null;
  }

  exports.clearVcfURL = function() {
    vcfURL = null;
    tbiUrl = null;
  }

  exports.setEndpoint = function(theEndpoint) {
    endpoint = theEndpoint;
  }

  exports.getEndpoint = function() {
    return endpoint;
  }

  exports.setIsEduMode = function(flagIsEduMode) {
    isEduMode = flagIsEduMode;
  }


  exports.setGenericAnnotation = function(theGenericAnnotation) {
    genericAnnotation = theGenericAnnotation;
  }

  exports.getGenericAnnotation = function() {
    return genericAnnotation;
  }

  exports.setGenomeBuildHelper = function(theGenomeBuildHelper) {
    genomeBuildHelper = theGenomeBuildHelper;
  }

  exports.getGenomeBuildHelper = function() {
    return genomeBuildHelper;
  }
  exports.getAnnotators = function() {
    return this.infoFields ? Object.keys(this.infoFields) : [];
  }

  var errorMessageMap =  {
    "tabix Could not load .tbi": {
        regExp: /tabix\sError:\s.*:\sstderr\s-\sCould not load .tbi.*/,
        message:  "Unable to load the index (.tbi) file, which has to exist in same directory and be given the same name as the .vcf.gz with the file extension of .vcf.gz.tbi.  "
    },
     "tabix [E::hts_open]": {
        regExp:  /tabix\sError:\s.*:\sstderr\s-\s\[E::hts_open\]\sfail\sto\sopen\sfile/,
        message: "Unable to access the file.  "
     },
     "tabix [E::hts_open_format]": {
        regExp:  /tabix\sError:\s.*:\sstderr\s-\s\[E::hts_open_format\]\sfail\sto\sopen\sfile/,
        message: "Unable to access the file. "
     }
  }

  var ignoreMessages =  [
    /tabix\sError:\s.*:\sstderr\s-\s\[M::test_and_fetch\]\sdownloading\sfile\s.*/,
    /tabix\sError:\s.*:\sstderr\s-\s.*to local directory/
  ];



  exports.openVcfUrl = function(url, theTbiUrl, callback) {
    var me = this;
    sourceType = SOURCE_TYPE_URL;
    vcfURL = url;
    tbiUrl = theTbiUrl;


    this.checkVcfUrl(url, tbiUrl, function(success, message) {
        callback(success, message);
    });

  }

  exports.getHeader = function(callback) {
    var me = this;
    if (sourceType.toLowerCase() == SOURCE_TYPE_URL.toLowerCase() && vcfURL != null) {

      var buffer = "";
      var success = false;

      var cmd = me.getEndpoint().getVcfHeader(vcfURL, tbiUrl);

      cmd.on('data', function(data) {
        if (data != undefined) {
          success = true;
          buffer += data;
        }
      });

      cmd.on('end', function() {
        if (success == null) {
          success = true;
        }
        if (success && buffer.length > 0) {
          callback(buffer);
        }
      });

      cmd.on('error', function(error) {
        console.log(error);
      })
      cmd.run();

    } else if (vcfFile) {
        var vcfReader = new readBinaryVCF(tabixFile, vcfFile, function(tbiR) {
          vcfReader.getHeader( function(theHeader) {
            callback(theHeader);
          });
        });
    } else {
      callback(null);
    }

  }


  exports.checkVcfUrl = function(url, tbiUrl, callback) {
    var me = this;
    var success = null;
    var buffer = "";
    var recordCount = 0;

    var cmd = me.getEndpoint().getVcfHeader(url, tbiUrl);

    cmd.on('data', function(data) {
      if (data != undefined) {
        success = true;
        buffer += data;
      }
    });

    cmd.on('end', function() {
      if (success == null) {
        success = true;
      }
      if (success && buffer.length > 0) {
        buffer.split("\n").forEach( function(rec) {
          if (rec.indexOf("#") == 0) {
            me._parseHeaderForInfoFields(rec);
          }
        })
        callback(success);
      }
    });

    cmd.on('error', function(error) {
      if (me.ignoreErrorMessage(error)) {
      } else { //error message cannot be ignored
        if (success == null) {
          success = false;
          callback(success, me.translateErrorMessage(error));
        }
      }

    });

    cmd.run();
  }

  exports.ignoreErrorMessage = function(error) {
    var me = this;
    var ignore = false;
    ignoreMessages.forEach( function(regExp) {
      if (error.text.match(regExp)) {
        ignore = true;
      }
    });
    return ignore;

  }

  exports.translateErrorMessage = function(error) {
    var me = this;
    var message = null;
    for (var key in errorMessageMap) {
      var errMsg = errorMessageMap[key];
      if (message == null && error.text.match(errMsg.regExp)) {
        message = errMsg.message;
      }
    }
    return message ? message : error;
  }

  exports.clearVcfFile = function() {
    vcfReader = null;
    vcfFile = null;
    tabixFile = null;
  }

  exports.openVcfFile = function(fileSelection, callback) {
    sourceType = SOURCE_TYPE_FILE;

    console.log("inside openVcfFile");

    if (fileSelection.files.length != 2) {
       callback(false, 'must select 2 files, both a .vcf.gz and .vcf.gz.tbi file');
       return;
    }

    if (endsWith(fileSelection.files[0].name, ".vcf") ||
        endsWith(fileSelection.files[1].name, ".vcf")) {
      callback(false, 'You must select a compressed vcf file (.vcf.gz), not a vcf file');
      return;
    }

    var fileType0 = /([^.]*)\.(vcf\.gz(\.tbi)?)$/.exec(fileSelection.files[0].name);
    var fileType1 = /([^.]*)\.(vcf\.gz(\.tbi)?)$/.exec(fileSelection.files[1].name);

    var fileExt0 = fileType0 && fileType0.length > 1 ? fileType0[2] : null;
    var fileExt1 = fileType1 && fileType1.length > 1 ? fileType1[2] : null;

    var rootFileName0 = fileType0 && fileType0.length > 1 ? fileType0[1] : null;
    var rootFileName1 = fileType1 && fileType1.length > 1 ? fileType1[1] : null;


    if (fileType0 == null || fileType0.length < 3 || fileType1 == null || fileType1.length <  3) {
      callback(false, 'You must select BOTH  a compressed vcf file (.vcf.gz) and an index (.tbi)  file');
      return;
    }


    if (fileExt0 == 'vcf.gz' && fileExt1 == 'vcf.gz.tbi') {
      if (rootFileName0 != rootFileName1) {
        callback(false, 'The index (.tbi) file must be named ' +  rootFileName0 + ".tbi");
        return;
      } else {
        vcfFile   = fileSelection.files[0];
        tabixFile = fileSelection.files[1];
      }
    } else if (fileExt1 == 'vcf.gz' && fileExt0 == 'vcf.gz.tbi') {
      if (rootFileName0 != rootFileName1) {
        callback(false, 'The index (.tbi) file must be named ' +  rootFileName1 + ".tbi");
        return;
      } else {
        vcfFile   = fileSelection.files[1];
        tabixFile = fileSelection.files[0];
      }
    } else {
      callback(false, 'You must select BOTH  a compressed vcf file (.vcf.gz) and an index (.tbi)  file');
      return;
    }

    this.processVcfFile(vcfFile, tabixFile)
    callback(true);

    return;

  }


  function showFileFormatMessage() {
    alertify.set(
      {
        labels: {
          cancel     : "Show me how",
          ok         : "OK",
        },
        buttonFocus:  "cancel"
    });

    alertify.confirm("You must select a compressed vcf file and its corresponding index file in order to run this app. ",
        function (e) {
        if (e) {
            return;
        } else {
            window.location = 'http://iobio.io/2015/09/03/install-run-tabix/';
        }
     }).set('labels', {ok:'OK', cancel:'Cancel'});
  }

  function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  exports.setSamples = function(sampleNames) {
    samples = sampleNames;
  }
  exports.getSamples = function() {
    return samples;
  }
  exports.getVcfFile = function() {
    return vcfFile;
  }
  exports.getTabixFile = function() {
    return tabixFile;
  }
  exports.setVcfFile = function(file) {
    vcfFile = file;
  }

  exports.getVcfURL = function() {
    return vcfURL;
  }

  exports.getTbiURL = function() {
    return tbiUrl;
  }

  exports.setVcfURL = function(url, tbiUrl) {
    vcfURL = url;
    tbiUrl = tbiUrl;
  }

  exports.getSourceType = function() {
    return sourceType;
  }

  exports.setSourceType = function(st) {
    sourceType = st;
  }



  function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }


  exports.stripChr = function(ref) {
    if (ref.indexOf("chr") == 0) {
      return ref.split("chr")[1];
    } else {
      return ref;
    }
  }


  exports.isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }



  exports.getReferenceLengths = function(callback) {
    if (sourceType.toLowerCase() == SOURCE_TYPE_URL.toLowerCase()) {
      this._getRemoteReferenceLengths(callback);
    } else {
      this._getLocalReferenceLengths(callback);
    }
  }




  exports._getLocalReferenceLengths = function(callback, callbackError) {
    var me = this;

    vcfReader = new readBinaryVCF(tabixFile, vcfFile, function(tbiR) {
      var tbiIdx = tbiR;
      refDensity.length = 0;

      if (tbiIdx.idxContent.head.n_ref == 0) {
        var errorMsg = "Invalid index file.  The number of references is set to zero.  Try recompressing the vcf with bgzip and regenerating the index with tabix."
        if (callbackError) {
          callbackError(errorMsg);
        }
        console.log(errorMsg);
        return;
      }

      var referenceNames = [];
      for (var i = 0; i < tbiIdx.idxContent.head.n_ref; i++) {
        var ref   = tbiIdx.idxContent.head.names[i];
        referenceNames.push(ref);
      }

      for (var i = 0; i < referenceNames.length; i++) {
        var ref   = referenceNames[i];

        var indexseq = tbiIdx.idxContent.indexseq[i];
        var calcRefLength = indexseq.n_intv * size16kb;


        // Load the reference density data.  Exclude reference if 0 points.
        refData.push( {"name": ref, "calcRefLength": calcRefLength, "idx": i});
      }

      // Sort ref data so that refs are ordered numerically
      refData = me.sortRefData(refData);

      if (callback) {
        callback(refData);
      }

    });

  }
    
  exports._getRegions = function(refs, options) {
    // console.log("called getRegions");
    regionIndex = 0;
    regions.length = 0;
    var me = this;
    var allRegions = [];

    // console.log("refData", refData)
    refData = [
  {
    "name": "1",
    "value": 249250621,
    "refLength": 249250621,
    "calcRefLength": 249233408,
    "idx": 0,
    "genomePercent": 0.0805,
    "width": 106.20188030962638,
    "offset": 0
  },
  {
    "name": "2",
    "value": 243199373,
    "refLength": 243199373,
    "calcRefLength": 243040256,
    "idx": 1,
    "genomePercent": 0.0786,
    "width": 103.62353601807948,
    "offset": 106.20188030962638
  },
  {
    "name": "3",
    "value": 198022430,
    "refLength": 198022430,
    "calcRefLength": 197853184,
    "idx": 2,
    "genomePercent": 0.064,
    "width": 84.37433104522282,
    "offset": 209.82541632770585
  },
  {
    "name": "4",
    "value": 191154276,
    "refLength": 191154276,
    "calcRefLength": 191004672,
    "idx": 3,
    "genomePercent": 0.0617,
    "width": 81.44791559185437,
    "offset": 294.19974737292864
  },
  {
    "name": "5",
    "value": 180915260,
    "refLength": 180915260,
    "calcRefLength": 180682752,
    "idx": 4,
    "genomePercent": 0.0584,
    "width": 77.08522735718654,
    "offset": 375.647662964783
  },
  {
    "name": "6",
    "value": 171115067,
    "refLength": 171115067,
    "calcRefLength": 170950656,
    "idx": 5,
    "genomePercent": 0.0553,
    "width": 72.90951489628463,
    "offset": 452.73289032196953
  },
  {
    "name": "7",
    "value": 159138663,
    "refLength": 159138663,
    "calcRefLength": 158941184,
    "idx": 6,
    "genomePercent": 0.0514,
    "width": 67.8065521873262,
    "offset": 525.6424052182542
  },
  {
    "name": "8",
    "value": 146364022,
    "refLength": 146364022,
    "calcRefLength": 146292736,
    "idx": 7,
    "genomePercent": 0.0473,
    "width": 62.3634728921278,
    "offset": 593.4489574055805
  },
  {
    "name": "9",
    "value": 141213431,
    "refLength": 141213431,
    "calcRefLength": 141082624,
    "idx": 8,
    "genomePercent": 0.0456,
    "width": 60.168884783535525,
    "offset": 655.8124302977083
  },
  {
    "name": "10",
    "value": 135534747,
    "refLength": 135534747,
    "calcRefLength": 135495680,
    "idx": 9,
    "genomePercent": 0.0438,
    "width": 57.749284318491185,
    "offset": 715.9813150812438
  },
  {
    "name": "11",
    "value": 135006516,
    "refLength": 135006516,
    "calcRefLength": 134266880,
    "idx": 10,
    "genomePercent": 0.0436,
    "width": 57.524213162348175,
    "offset": 773.730599399735
  },
  {
    "name": "12",
    "value": 133851895,
    "refLength": 133851895,
    "calcRefLength": 133791744,
    "idx": 11,
    "genomePercent": 0.0432,
    "width": 57.032246800326625,
    "offset": 831.2548125620831
  },
  {
    "name": "13",
    "value": 115169878,
    "refLength": 115169878,
    "calcRefLength": 115064832,
    "idx": 12,
    "genomePercent": 0.0372,
    "width": 49.072124873984855,
    "offset": 888.2870593624098
  },
  {
    "name": "14",
    "value": 107349540,
    "refLength": 107349540,
    "calcRefLength": 107298816,
    "idx": 13,
    "genomePercent": 0.0347,
    "width": 45.739998370449186,
    "offset": 937.3591842363946
  },
  {
    "name": "15",
    "value": 102531392,
    "refLength": 102531392,
    "calcRefLength": 102531072,
    "idx": 14,
    "genomePercent": 0.0331,
    "width": 43.687059143428904,
    "offset": 983.0991826068438
  },
  {
    "name": "16",
    "value": 90354753,
    "refLength": 90354753,
    "calcRefLength": 90177536,
    "idx": 15,
    "genomePercent": 0.0292,
    "width": 38.498779361162974,
    "offset": 1026.7862417502727
  },
  {
    "name": "17",
    "value": 81195210,
    "refLength": 81195210,
    "calcRefLength": 81068032,
    "idx": 16,
    "genomePercent": 0.0262,
    "width": 34.596038074203946,
    "offset": 1065.2850211114355
  },
  {
    "name": "18",
    "value": 78077248,
    "refLength": 78077248,
    "calcRefLength": 77971456,
    "idx": 17,
    "genomePercent": 0.0252,
    "width": 33.26752211783262,
    "offset": 1099.8810591856395
  },
  {
    "name": "19",
    "value": 59128983,
    "refLength": 59128983,
    "calcRefLength": 59113472,
    "idx": 18,
    "genomePercent": 0.0191,
    "width": 25.193955987760337,
    "offset": 1133.1485813034722
  },
  {
    "name": "20",
    "value": 63025520,
    "refLength": 63025520,
    "calcRefLength": 62914560,
    "idx": 19,
    "genomePercent": 0.0204,
    "width": 26.854210852666093,
    "offset": 1158.3425372912325
  },
  {
    "name": "21",
    "value": 48129895,
    "refLength": 48129895,
    "calcRefLength": 48087040,
    "idx": 20,
    "genomePercent": 0.0155,
    "width": 20.507412690076645,
    "offset": 1185.1967481438985
  },
  {
    "name": "22",
    "value": 51304566,
    "refLength": 51304566,
    "calcRefLength": 51249152,
    "idx": 21,
    "genomePercent": 0.0166,
    "width": 21.86009148466405,
    "offset": 1205.704160833975
  },
  {
    "name": "X",
    "value": 155270560,
    "refLength": 155270560,
    "calcRefLength": 155271168,
    "idx": 22,
    "genomePercent": 0.0502,
    "width": 66.15841261526349,
    "offset": 1227.564252318639
  },
  {
    "name": "Y",
    "value": 59373566,
    "refLength": 59373566,
    "calcRefLength": 24559616,
    "idx": 23,
    "sparsePointData": [
      {
        "pos": 2834432,
        "depth": 1
      },
      {
        "pos": 4964352,
        "depth": 1
      },
      {
        "pos": 5488640,
        "depth": 1
      },
      {
        "pos": 6111232,
        "depth": 1
      },
      {
        "pos": 6127616,
        "depth": 1
      },
      {
        "pos": 6946816,
        "depth": 1
      },
      {
        "pos": 7192576,
        "depth": 1
      },
      {
        "pos": 9175040,
        "depth": 1
      },
      {
        "pos": 9191424,
        "depth": 1
      },
      {
        "pos": 9207808,
        "depth": 1
      },
      {
        "pos": 9289728,
        "depth": 1
      },
      {
        "pos": 9322496,
        "depth": 1
      },
      {
        "pos": 9355264,
        "depth": 1
      },
      {
        "pos": 9732096,
        "depth": 1
      },
      {
        "pos": 13484032,
        "depth": 18592
      },
      {
        "pos": 13500416,
        "depth": 1
      },
      {
        "pos": 14073856,
        "depth": 1
      },
      {
        "pos": 14106624,
        "depth": 1
      },
      {
        "pos": 14516224,
        "depth": 1
      },
      {
        "pos": 14843904,
        "depth": 1
      },
      {
        "pos": 14893056,
        "depth": 1
      },
      {
        "pos": 14942208,
        "depth": 1
      },
      {
        "pos": 14958592,
        "depth": 1
      },
      {
        "pos": 15024128,
        "depth": 1
      },
      {
        "pos": 15433728,
        "depth": 1
      },
      {
        "pos": 15581184,
        "depth": 1
      },
      {
        "pos": 16941056,
        "depth": 1
      },
      {
        "pos": 21856256,
        "depth": 1
      },
      {
        "pos": 21889024,
        "depth": 1
      },
      {
        "pos": 24313856,
        "depth": 1
      },
      {
        "pos": 24543232,
        "depth": 8752
      }
    ],
    "genomePercent": 0.0192,
    "width": 25.298169066097362,
    "offset": 1293.7226649339025
  }
  ]
    var bedRegions;
    for (var j=0; j < refs.length; j++) {
      var ref      = refData[refs[j]];
      var start    = options.start ? options.start : 0;
      var end      = options.end ? options.end : ref.refLength;
      var length   = end - start;
      var sparsePointData = ref.sparsePointData;

      if ( options.fullAnalysis || length < options.binSize * options.binNumber) {
        regions.push({
          'name' : ref.name,
          'start': start,
          'end'  : end
        });
      } else {
         // If this is sparse data, seed with known regions first
         if (sparsePointData != null && sparsePointData.length > 0) {
          sparsePointData.forEach( function(point) {
            regions.push( {
              'name' : ref.name,
              'start' : point.pos,
              'end' : point.pos + options.binSize
            })
          })
         }
         // create random reference coordinates
         for (var i=0; i < options.binNumber; i++) {
            var s = start + parseInt(Math.random()*length);
            regions.push( {
               'name' : ref.name,
               'start' : s,
               'end' : s + options.binSize
            });
         }
         // sort by start value
         regions = regions.sort(function(a,b) {
            if (a.name == b.name)
              return ((a.start < b.start) ? -1 : ((a.start > b.start) ? 1 : 0));
            else
              return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
         });
      }
    }
    // map random region coordinates to bed coordinates
    if (window.bed != undefined) {
      if (refs.length == 1)
        var bedArray = this._bedToArray(bed, refData[refs[0]].name, {name:ref.name, 'start':start, 'end':end});
      else
        var bedArray = this._bedToArray(bed, refData[refs[0]].name);
      regions = me._bedGetRegions(bedArray, options.binNumber * refs.length, options);
    }
      // regions = me._mapToBedCoordinates(regions, window.bed)

    // sort by start value
    regions = regions.sort(function(a,b) {
      if (a.name == b.name)
        return ((a.start < b.start) ? -1 : ((a.start > b.start) ? 1 : 0));
      else
        return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
    });
    return regions;

  }
  
  exports.getStats = function(refs, options, vcf, tbi, sample, callback) {
    this.vcfURL = vcf;
    this.tbiURL = tbi;
    this._getRemoteStats(refs, options, sample, callback);
  }
  
  exports._getRemoteStats = function(refs, options, sample, callback) {
    var me = this;

    me._getRegions(refs, options);

    // This is the tabix url.  Here we send the regions as arguments.  tabix
    // output (vcf header+records for the regions) will be piped
    // to the vcfstatsalive server.
    var regionStr = "";
    regions.forEach(function(region) {
      regionStr += " " + region.name + ":" + region.start + "-" + region.end
    });

    var refNames = [];

    var contigStr = "";
    for (var j=0; j < refs.length; j++) {
      var ref      = refData[refs[j]];
      contigStr += "##contig=<ID=" + ref.name + ">\n";
      refNames.push(ref.name);
    }
    var contigNameFile = new Blob([contigStr])

    var cmd = null;
    // console.log("me.tbiURL", me.tbiURL)
    var tabixArgs = ['-h', '"'+me.vcfURL+'"', regionStr];
    if (me.tbiURL) {
       tabixArgs.push('"'+me.tbiURL+'"');
    }
    samples = []; 
    samples.push(sample)
    
    if (samples && samples.length > 0) {
      var sampleNameFile = new Blob([samples.join("\n")]);

      cmd = apiClient.streamCommand('vcfStatsStream', {
        url: me.vcfURL,
        indexUrl: me.tbiURL,
        regions,
        refNames,
        sampleNames: samples,
      });
    } else {

      cmd = apiClient.streamCommand('vcfStatsStream', {
        url: me.vcfURL,
        indexUrl: me.tbiURL,
        regions,
        refNames,
      });
    }


    // Run like normal
    cmd.run();

    var buffer = "";
    var outputObject = ""

    // Use Results
    cmd.on('data', function(results) {
         results.split(';').forEach(function(data) {
           if (data == undefined) {
              return;
           }
           var success = true;
           try {
             var obj = JSON.parse(buffer + data);
             outputObject = obj
           } catch(e) {
             success = false;
             buffer += data;
           }
           if(success) {
             buffer = "";
             callback(obj);
           }
        });
    });

    cmd.on('end', function() {
      // callback(outputObject)
    });

    cmd.on('error', function(error) {
      console.log("error while annotating vcf records " + error);
    });


  };



  exports._getRemoteReferenceLengths = function(callback, callbackError) {
    var me = this;
    var buffer = "";
    var refName;

    var cmd = me.getEndpoint().getVcfDepth(vcfURL, tbiUrl)

    cmd.on('data', function(data) {

      if (data == undefined) {
        return;
      }

      buffer += data;

    })

    // All data has been streamed.
    cmd.on('end', function() {


      var recs = buffer.split("\n");
      if (recs.length > 0) {
        for (var i=0; i < recs.length; i++)  {
          if (recs[i] == undefined) {
            return;
          }

          var success = true;
          if ( recs[i][0] == '#' ) {
            var tokens = recs[i].substr(1).split("\t");
            if (tokens.length >= 3) {
              var refNamePrev = refName;
              var refIndex = tokens[0];
              var refName = tokens[1];
              var refLength = tokens[2];

              // Zero fill the previous reference point data and callback with the
              // data we have loaded so far.
              if (refData.length > 0) {
                var refDataPrev = refData[refData.length - 1];
              }

              refData.push({"name": refName,  "calcRefLength": +refLength, "idx": +refIndex});


            } else {
                success = false;
            }
          }
          else {
            // We only care about getting the reference lengths, not the density data
          }
          if (success) {
            buffer = "";
          } else {
            buffer += recs[i];
          }
        }
      } else  {
        buffer += data;
      }

      // sort refData so references or ordered numerically
      refData = me.sortRefData(refData);


      // Zero fill the previous reference point data and callback with the
      // for the last reference that was loaded
      if (refData.length > 0) {
        var refDataPrev = refData[refData.length - 1];
      }
      if (callback) {
        callback(refData);
      }
    })

    // Catch error event when fired
    cmd.on('error', function(error) {
      console.log("Error occurred in loadRemoteIndex. " +  error);
      if (callbackError) {
        callbackError("Error occurred in loadRemoteIndex. " +  error);
      }
    })

    // execute command
    cmd.run();




  };



  exports.sortRefData = function(refData) {
    var me = this;
    return refData.sort(function(refa,refb) {
          var x = me.stripChr(refa.name);
          var y = me.stripChr(refb.name);
          if (me.isNumeric(x) && me.isNumeric(y)) {
            return ((+x < +y) ? -1 : ((+x > +y) ? 1 : 0));
          } else {
             if (!me.isNumeric(x) && !me.isNumeric(y)) {
                return ((+x < +y) ? -1 : ((+x > +y) ? 1 : 0));
             } else if (!me.isNumeric(x)) {
                return 1;
             } else {
                return -1;
             }
          }

      });
  }


  /* When sfariMode = true, variant id field is assigned. */
  exports.promiseGetVariants = function(refName, geneObject, selectedTranscript, regions, isMultiSample, samplesToRetrieve, annotationEngine, clinvarMap, isRefSeq, hgvsNotation, getRsId, vepAF, cache, sfariMode = false, gnomADExtra=false, decompose=false) {
    var me = this;

    return new Promise( function(resolve, reject) {

      // This comma separated string of samples to perform vcf subset on
      var vcfSampleNames = samplesToRetrieve.filter(function(sample) {
        return (sample.vcfSampleName !== "" && sample.vcfSampleName != null);
      })
      .map(function(sample) {
        return sample.vcfSampleName;
      })
      .join(",");

      // This comma separated string of samples to be contained in the maps of genotypes
      var sampleNamesToGenotype = samplesToRetrieve.map(function(sample) {
        return sample.sampleName;
      })
      .join(",");

      if (sfariMode === true) {
        vcfSampleNames = samplesToRetrieve.join(',');
        sampleNamesToGenotype = samplesToRetrieve.join(',');
      }

      // sourceType = SOURCE_TYPE_URL;
      if (sourceType == SOURCE_TYPE_URL) {
        me._getRemoteVariantsImpl(refName, geneObject, selectedTranscript, regions, isMultiSample, vcfSampleNames, sampleNamesToGenotype, annotationEngine, clinvarMap, isRefSeq, hgvsNotation, getRsId, vepAF, cache,
          function(annotatedData, results) {
            if (annotatedData != null && results) {
              resolve([annotatedData, results]);
            } else {
              reject();
            }
          }, null, sfariMode, gnomADExtra, decompose);
      } else {
        //me._getLocalStats(refName, geneObject.start, geneObject.end, sampleName);

        me._getLocalVariantsImpl(refName, geneObject, selectedTranscript, regions, isMultiSample, vcfSampleNames, sampleNamesToGenotype, annotationEngine, clinvarMap, isRefSeq, hgvsNotation, getRsId, vepAF, cache,
            function(annotatedData, results) {
              if (annotatedData != null && results) {
                resolve([annotatedData, results]);
              } else {
                reject();
              }
            }, null, sfariMode, gnomADExtra, decompose);

      }

    });
  }


  exports._getLocalVariantsImpl = function(refName, geneObject, selectedTranscript, regions, isMultiSample, vcfSampleNames, sampleNamesToGenotype, annotationEngine, clinvarMap, isRefSeq, hgvsNotation, getRsId, vepAF, useServerCache, callback, errorCallback, sfariMode = false, gnomADExtra = false, decompose=false) {

    var me = this;

    if (regions == null || regions.length == 0) {
      regions = [];
      regions.push({'name': refName, 'start': geneObject.start, 'end': geneObject.end});
    }

    var serverCacheKey = me._getServerCacheKey(vcfURL, annotationEngine, refName, geneObject, vcfSampleNames, {refseq: isRefSeq, hgvs: hgvsNotation, rsid: getRsId});

    var cmd = me.getEndpoint().annotateVariants({'vcfUrl': me.vcfURL, 'tbiUrl': me.tbiUrl}, refName, regions, vcfSampleNames, annotationEngine, isRefSeq, hgvsNotation, getRsId, vepAF, useServerCache, serverCacheKey, sfariMode, gnomADExtra, decompose);

    var annotatedData = "";
    // Get the results from the iobio command
    cmd.on('data', function(data) {
      if (data == undefined) {
        return;
      }
      annotatedData += data;
    });

    // We have all of the annotated vcf recs.  Now parse them into vcf objects
    cmd.on('end', function(data) {
      var annotatedRecs = annotatedData.split("\n");
      var vcfObjects = [];
      var contigHdrRecFound = false;

      annotatedRecs.forEach(function(record) {
        if (record.charAt(0) == "#") {
          me._parseHeaderForInfoFields(record);

        } else {

          // Parse the vcf record into its fields
          var fields = record.split('\t');
          var pos    = fields[1];
          var id     = fields[2];
          var ref    = fields[3];
          var alt    = fields[4];
          var qual   = fields[5];
          var filter = fields[6];
          var info   = fields[7];
          var format = fields[8];
          var genotypes = [];

          // Too much data, crashes app
          if (sfariMode !== true) {
            for (var i = 9; i < fields.length; i++) {
              genotypes.push(fields[i]);
            }
          }


          // Turn vcf record into a JSON object and add it to an array
          var vcfObject = {'pos': pos, 'id': id, 'ref': ref, 'alt': alt,
            'qual': qual, 'filter': filter, 'info': info, 'format':format, 'genotypes': genotypes};
          vcfObjects.push(vcfObject);
        }
      });

      if (sfariMode === true) {
        annotatedData = '';
        annotatedRecs = '';
      }

      // Parse the vcf object into a variant object that is visualized by the client.
      var results = me._parseVcfRecords(vcfObjects, refName, geneObject, selectedTranscript, clinvarMap, (hgvsNotation && getRsId), isMultiSample, sampleNamesToGenotype, null, vepAF, sfariMode, gnomADExtra);


      callback(annotatedRecs, results);
    });

    cmd.on('error', function(error) {
      console.log(error);
    });

    cmd.run();




  }

  exports._getRemoteVariantsImpl = function(refName, geneObject, selectedTranscript, regions, isMultiSample, vcfSampleNames, sampleNamesToGenotype, annotationEngine, clinvarMap, isRefSeq, hgvsNotation, getRsId, vepAF, useServerCache, callback, errorCallback, sfariMode = false, gnomADExtra = false, decompose=false) {

    var me = this;

    if (regions == null || regions.length == 0) {
      regions = [];
      regions.push({'name': refName, 'start': geneObject.start, 'end': geneObject.end});
    }



    var serverCacheKey = me._getServerCacheKey(vcfURL, annotationEngine, refName, geneObject, vcfSampleNames, {refseq: isRefSeq, hgvs: hgvsNotation, rsid: getRsId});

    var cmd = me.getEndpoint().annotateVariants({'vcfUrl': vcfURL, 'tbiUrl': tbiUrl}, refName, regions, vcfSampleNames, annotationEngine, isRefSeq, hgvsNotation, getRsId, vepAF, useServerCache, serverCacheKey, sfariMode, gnomADExtra, decompose);

    var annotatedData = "";
    // Get the results from the iobio command
    cmd.on('data', function(data) {
         if (data == undefined) {
            return;
         }
         annotatedData += data;
    });

    // We have all of the annotated vcf recs.  Now parse them into vcf objects
    cmd.on('end', function(data) {
      var annotatedRecs = annotatedData.split("\n");
      var vcfObjects = [];
      var contigHdrRecFound = false;

      annotatedRecs.forEach(function(record) {
        if (record.charAt(0) == "#") {
          me._parseHeaderForInfoFields(record);

        } else {

          // Parse the vcf record into its fields
          var fields = record.split('\t');
          var pos    = fields[1];
          var id     = fields[2];
          var ref    = fields[3];
          var alt    = fields[4];
          var qual   = fields[5];
          var filter = fields[6];
          var info   = fields[7];
          var format = fields[8];
          var genotypes = [];

          // Too much data, crashes app
          if (sfariMode !== true) {
            for (var i = 9; i < fields.length; i++) {
                genotypes.push(fields[i]);
            }
          }


          // Turn vcf record into a JSON object and add it to an array
          var vcfObject = {'pos': pos, 'id': id, 'ref': ref, 'alt': alt,
                           'qual': qual, 'filter': filter, 'info': info, 'format':format, 'genotypes': genotypes};
          vcfObjects.push(vcfObject);
        }
      });

      if (sfariMode === true) {
        annotatedData = '';
        annotatedRecs = '';
      }

      // Parse the vcf object into a variant object that is visualized by the client.
      var results = me._parseVcfRecords(vcfObjects, refName, geneObject, selectedTranscript, clinvarMap, (hgvsNotation && getRsId), isMultiSample, sampleNamesToGenotype, null, vepAF, sfariMode, gnomADExtra);


      callback(annotatedRecs, results);
    });

    cmd.on('error', function(error) {
       console.log(error);
    });

    cmd.run();

  }





  exports.promiseGetKnownVariantsHistoData = function(refName, geneObject, transcript, binLength) {
    var me = this;


    return new Promise( function(resolve, reject) {

      me._getKnownVariantsHistoDataImpl(refName, geneObject, transcript, binLength,
        function(data) {
          if (data) {
            resolve(data);
          } else {
            reject();
          }
        });

    });
  }

  exports._getExonRegions = function(transcript) {

    return transcript.features
      .filter( function(feature) {
        return feature.feature_type.toUpperCase() == 'CDS' || feature.feature_type.toUpperCase() == 'UTR';
      })
      .sort( function(exon1, exon2) {
        if (exon1.start < exon2.start) {
          return -1;
        } else if (exon1.start > exon2.start) {
          return 1;
        } else {
          return 0;
        }
      })
      .map( function(exon) {
        return {start: exon.start, end: exon.end};
      })
  }

  exports._getKnownVariantsHistoDataImpl = function(refName, geneObject, transcript, binLength, callback) {

    var me = this;

      var clinvarUrl = globalApp.getClinvarUrl(me.getGenomeBuildHelper().getCurrentBuildName());
      var cmd = me.getEndpoint().getCountsForGene(clinvarUrl, refName, geneObject, binLength, (binLength == null ? me._getExonRegions(transcript) : null), 'clinvar', false);


    var summaryData = "";
    // Get the results from the iobio command
    cmd.on('data', function(data) {
         if (data == undefined) {
            return;
         }
         summaryData += data;
    });

    // We have all of the annotated vcf recs.  Now parse them into vcf objects
    cmd.on('end', function(data) {
      var results = [];
      var records = summaryData.split("\n");
      var fieldNames = {};

      var idx = 0;
      records.forEach(function(record) {
        if (idx == 0) {
          fieldNames = record.split('\t');
        } else {
          if (record.trim().length > 0) {
            var fields = record.split('\t');
            var resultRec = {};

            var i = 0;
            fieldNames.forEach(function(fieldName) {
              // All fields are numeric
              resultRec[fieldName] = +fields[i];
              i++;
            })
            // Find the mid-point of the interval (binned region)
            resultRec.point = resultRec.start + ((resultRec.end - resultRec.start) / 2);

            results.push(resultRec);
          }
        }
        idx++;
      });
      callback(results);
    });

    cmd.on('error', function(error) {
       console.log(error);
    });

    cmd.run();

  }



  exports.clearVepInfoFields = function() {
    this.infoFields.VEP = null;
  }

  exports._parseHeaderForInfoFields = function(record) {
    var me = this;
    if (me.infoFields == null) {
      me.infoFields = {};
    }
    if (record.indexOf("INFO=<ID=CSQ") > 0) {
      var fieldMap = me._parseInfoHeaderRecord(record);
      me.infoFields.VEP = fieldMap;
    } else if (record.indexOf("INFO=<ID=AVIA3") > 0 && !me.infoFields.AVIA3) {
      var fieldMap = me._parseInfoHeaderRecord(record);
      me.infoFields.AVIA3 = fieldMap;
    }
  }

  exports._parseInfoHeaderRecord = function(record) {
    var fieldMap = {};
    var tokens = record.split("Format: ");
    if (tokens.length == 2) {
      var format = tokens[1];
      if (endsWith(format, '">')) {
        format  =  format.substring(0, format.length - 2 );
      }
      var fields = format.split("|");
      for(var idx = 0; idx < fields.length; idx++) {
        var fieldName = fields[idx];
        if (fieldName.indexOf("\"") == fieldName.length-1) {
          fieldName = fieldName.trim("\"");
        }
        fieldMap[fieldName] = idx;
      }
    }
    return fieldMap;
  }


  exports.getSampleNames = function(callback) {
    if (sourceType == SOURCE_TYPE_URL) {
      this._getRemoteSampleNames(callback);
    } else {
      this._getLocalSampleNames(callback);
    }
  }


  exports._getLocalSampleNames = function(callback) {
    var me = this;

    var vcfReader = new readBinaryVCF(tabixFile, vcfFile, function(tbiR) {
      var sampleNames = [];
      sampleNames.length = 0;

      var headerRecords = [];
      vcfReader.getHeader( function(header) {
         headerRecords = header.split("\n");
         headerRecords.forEach(function(headerRec) {
            if (headerRec.indexOf("#CHROM") == 0) {
              var headerFields = headerRec.split("\t");
              sampleNames = headerFields.slice(9);
              callback(sampleNames);
            }
         });

      });
   });

  }


  exports._getRemoteSampleNames = function(callback) {
    var me = this;

    var cmd = me.getEndpoint().getVcfHeader(vcfURL, tbiUrl);


    var headerData = "";
    // Use Results
    cmd.on('data', function(data) {
         if (data == undefined) {
            return;
         }
         headerData += data;
    });

    cmd.on('end', function(data) {
        var headerRecords = headerData.split("\n");
         headerRecords.forEach(function(headerRec) {
              if (headerRec.indexOf("#CHROM") == 0) {
                var headerFields = headerRec.split("\t");
                var sampleNames = headerFields.slice(9);
                callback(sampleNames);
              }
         });

    });

    cmd.on('error', function(error) {
      console.log(error);
    });

    cmd.run();

  }

  exports.parseVcfRecordsForASample = function(annotatedRecs, refName, geneObject, selectedTranscript, clinvarMap, hasExtraAnnot, sampleNamesToGenotype, sampleIndex, vepAF, gnomADExtra) {
    var me = this;

      // For each vcf records, call snpEff to get the annotations.
      // Each vcf record returned will have an EFF field in the
      // info field.
      var vcfObjects = [];

      annotatedRecs.forEach(function(record) {
        if (record == null || record == "") {

        } else if (record.charAt(0) == "#") {
          me._parseHeaderForInfoFields(record);
        } else {

          // Parse the vcf record into its fields
          var fields = record.split('\t');
          var pos    = fields[1];
          var id     = fields[2];
          var ref    = fields[3];
          var alt    = fields[4];
          var qual   = fields[5];
          var filter = fields[6];
          var info   = fields[7];
          var format = fields[8];
          var genotypes = [];
          for (var i = 9; i < fields.length; i++) {
            genotypes.push(fields[i]);
          }


          // Turn vcf record into a JSON object and add it to an array
          var vcfObject = {gene: geneObject, 'pos': pos, 'id': 'id', 'ref': ref, 'alt': alt,
                           'qual': qual, 'filter': filter, 'info': info, 'format': format, 'genotypes': genotypes};
          vcfObjects.push(vcfObject);
        }
      });


      // Parse the vcf object into a variant object that is visualized by the client.
      var results = me._parseVcfRecords(vcfObjects, refName, geneObject, selectedTranscript, clinvarMap, hasExtraAnnot, false, sampleNamesToGenotype, sampleIndex, vepAF, false, gnomADExtra);
      return {'annotatedRecs': annotatedRecs, 'results': results};

  }

  exports._promiseAnnotateVcfRecords = function(records, refName, geneObject, selectedTranscript, clinvarMap, hasExtraAnnot, isMultiSample, vcfSampleNames, sampleNamesToGenotype, annotationEngine, isRefSeq, hgvsNotation, getRsId, vepAF, useServerCache, gnomADExtra, decompose) {
    var me = this;

    return new Promise( function(resolve, reject) {
      // For each vcf records, call snpEff to get the annotations.
      // Each vcf record returned will have an EFF field in the
      // info field.
      me._annotateVcfRegion(records, refName, vcfSampleNames, annotationEngine, isRefSeq, hgvsNotation, getRsId, vepAF, useServerCache, gnomADExtra, decompose, function(annotatedData) {

        var annotatedRecs = annotatedData.split("\n");
        var vcfObjects = [];

        annotatedRecs.forEach(function(record) {
          if (record.charAt(0) == "#") {
              me._parseHeaderForInfoFields(record);
          } else {

            // Parse the vcf record into its fields
            var fields = record.split('\t');
            var pos    = fields[1];
            var id     = fields[2];
            var ref    = fields[3];
            var alt    = fields[4];
            var qual   = fields[5];
            var filter = fields[6];
            var info   = fields[7];
            var format = fields[8];
            var genotypes = [];
            for (var i = 9; i < fields.length; i++) {
              genotypes.push(fields[i]);
            }


            // Turn vcf record into a JSON object and add it to an array
            var vcfObject = {'pos': pos, 'id': 'id', 'ref': ref, 'alt': alt,
                             'qual': qual, 'filter': filter, 'info': info, 'format': format, 'genotypes': genotypes};
            vcfObjects.push(vcfObject);
          }
        });

        // Parse the vcf object into a variant object that is visualized by the client.
        var results = me._parseVcfRecords(vcfObjects, refName, geneObject, selectedTranscript, clinvarMap, hasExtraAnnot, isMultiSample, sampleNamesToGenotype, null, vepAF, gnomADExtra);
        resolve([annotatedRecs, results]);
      });
    });
  }

  exports.promiseGetClinvarRecords = function(theVcfData, refName, geneObject, clinvarGenes, clinvarLoadVariantsFunction) {
    var me = this;

    return new Promise( function(resolve, reject) {
      var batchSize = 100;
      // When the clinvar vcf is used, just use 1 batch to get all clinvar variants.  But if accessing clinvar
      // via eutils, for every 100 variants, make an http request to eutils to get clinvar records.  Keep
      // repeating until all variants have been processed.
      var numberOfBatches = globalApp.isClinvarOffline || globalApp.clinvarSource == 'vcf' ? 1 : Math.ceil(theVcfData.features.length / batchSize);
      if (numberOfBatches == 0) {
        numberOfBatches = 1;
      }
      var clinvarPromises = [];
      for( var i = 0; i < numberOfBatches; i++) {
        var start = i * batchSize;
        var end = start + batchSize;
        var batchOfVariants = theVcfData.features.slice(start, end <= theVcfData.features.length ? end : theVcfData.features.length);

        if (globalApp.isClinvarOffline || globalApp.clinvarSource == 'vcf') {
          var promise = me.promiseGetClinvarVCFImpl(batchOfVariants, refName, geneObject, clinvarGenes, clinvarLoadVariantsFunction)
          .then(  function() {

          }, function(error) {
            reject("Unable to get clinvar annotations for variants");
          });
          clinvarPromises.push(promise);

        } else {
          var promise = me.promiseGetClinvarEutilsImpl(batchOfVariants, refName, geneObject, clinvarLoadVariantsFunction)
          .then(  function(data) {
            if (data == 'clinvarError') {
              alertify.alert("A problem occurred accessing ClinVar variants in gene " + geneObject.gene_name + ".  Unable to get ClinVar annotations at this time.");
            }

          }, function(error) {
            reject("Unable to get clinvar annotations for variants");
          });
          clinvarPromises.push(promise);

        }
      }

      Promise.all(clinvarPromises).then(function() {
        resolve(theVcfData);
      });



    });
  }

  exports._getClinvarVariantRegions = function(refName, geneObject, variants, clinvarGenes) {
    var regions = [];
    if (variants && variants.length > 0) {
      var clinvarVariantCount = clinvarGenes[geneObject.gene_name];
      // Avoid returning ALL clinvar variants for a gene when this gene has
      // a huge number of variants in clinvar.  Instead, just get the clinvar variants
      // for the specific positions of the sample's variants
      if (clinvarVariantCount != null && clinvarVariantCount > variants.length) {

        // Interrogate clinvar vcf by specific positions
        variants.forEach(function(variant) {
          regions.push({'refName': refName, 'start': variant.start, 'end': variant.end});
        })
      } else {
        // Just grab all clinvar variants for the gene
        regions.push({'refName': refName, 'start': geneObject.start, 'end': geneObject.end});
      }
    } else {
      // We don't have any variants for the sample, so don't bother interogating clinvar vcf
      regions.push({'refName': '0', 'start': 0, 'end': 0});
    }
    return regions;
  }

  // This method will obtain clinvar annotations from a clinvar vcf.
  exports.promiseGetClinvarVCFImpl= function(variants, refName, geneObject, clinvarGenes, clinvarLoadVariantsFunction) {
    var me = this;

    return new Promise( function(resolve, reject) {

      var clinvarUrl = globalApp.getClinvarUrl(me.getGenomeBuildHelper().getCurrentBuildName());

      var regions = me._getClinvarVariantRegions(refName, geneObject, variants, clinvarGenes);

      var cmd = me.getEndpoint().normalizeVariants(clinvarUrl, null, refName, regions);


      var clinvarData = "";
      // Parse results
      cmd.on('data', function(data) {
        if (data == undefined) {
            return;
        }
        clinvarData += data;
      });

      cmd.on('end', function(data) {
        var clinvarRecs = clinvarData.split("\n");
        var vcfObjects = [];

        clinvarRecs.forEach(function(record) {
          if (record.charAt(0) == "#" || record == "") {

          } else {

            // Parse the vcf record into its fields
            var fields = record.split('\t');
            var pos    = fields[1];
            var id     = fields[2];
            var ref    = fields[3];
            var altBuf = fields[4];
            var qual   = fields[5];
            var filter = fields[6];
            var info   = fields[7];
            var format = fields[8];
            var genotypes = [];
            for (var i = 9; i < fields.length; i++) {
              genotypes.push(fields[i]);
            }

            altBuf.split(",").forEach(function(alt) {
              // Turn vcf record into a JSON object and add it to an array
              var vcfObject = { 'clinvarUid': id, 'pos': pos, 'start':  +pos,  'id': id, 'ref': ref, 'alt': alt, 'chrom': refName,
                               'qual': qual, 'filter': filter, 'info': info, 'format':format, 'genotypes': genotypes};
              vcfObjects.push(vcfObject);
            })

          }
        });


        clinvarLoadVariantsFunction(vcfObjects);

        resolve();

      });

      cmd.on('error', function(error) {
        console.log(error);
      });

      cmd.run();
    });

  }


  exports.promiseGetClinvarEutilsImpl = function(variants, refName, geneObject, clinvarLoadVariantsFunction) {
    var me = this;

    return new Promise( function(resolve, reject) {

      var regionStart = geneObject.start;
      var regionEnd = geneObject.end;


      // Multiallelic input vcf records were assigned a number submission
      // index.  Create a map that ties the vcf record number to the
      // clinvar records number
      var sourceIndex = -1;
      var clinvarIndex = 0;
      var url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=clinvar&usehistory=y&retmode=json&term=";
      url += "(" + refName + "[Chromosome]" + " AND ";
      // clinvarToSourceMap = new Object();
      variants.forEach(function(variant) {

        var pos    = variant.start;
        var ref    = variant.ref;
        var alt    = variant.alt;

        if (pos == null || ref == null || alt == null) {

        } else {
          // Get rid of the left most anchor base for insertions and
          // deletions for accessing clinvar
          var clinvarStart = +pos;
          if (alt == '.') {

          } else if (ref == '.') {

          } else if (ref.length > alt.length) {
            // deletion
            clinvarStart++;
          } else if (alt.length > ref.length) {
            // insertion
            clinvarStart++;
          }

          url += clinvarStart + ','
        }
      });

      var clinvarBuild = me.getGenomeBuildHelper().getBuildResource(me.getGenomeBuildHelper().RESOURCE_CLINVAR_POSITION);
      url = url.slice(0,url.length-1) + '[' + clinvarBuild + '])';

      var clinvarVariants = null;
      var requestClinvarSummaryTries = 0;
      requestClinvarSummary(url);

      function requestClinvarSummary(url) {
        $.ajax( url )
          .done(function(data) {
            if (data["esearchresult"]["ERROR"] != undefined) {
              if (requestClinvarSummaryTries < 2 ) {
                requestClinvarSummaryTries += 1;
                console.log('clinvar request failed ' + requestClinvarSummaryTries + ' times (' + data["esearchresult"]["ERROR"] + '). Trying again ...')
                requestClinvarSummary(url);
              } else {
                console.log('clinvar request failed 3 times (' + data.esearchresult.ERROR + '). Aborting ...')
                resolve("clinvarError");
              }
            } else {
              var webenv = data["esearchresult"]["webenv"];
              var queryKey = data["esearchresult"]["querykey"];
              var summaryUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=clinvar&query_key=" + queryKey + "&retmode=json&WebEnv=" + webenv + "&usehistory=y"
              $.ajax( summaryUrl )
                .done(function(sumData) {

                  if (sumData.result == null) {
                    if (sumData.esummaryresult && sumData.esummaryresult.length > 0) {
                      sumData.esummaryresult.forEach( function(message) {
                      });
                    }
                    sumData.result = {uids: []};
                    clinvarLoadVariantsFunction(sumData.result);
                    resolve();
                  } else {
                    var sorted = sumData.result.uids.sort(function(a,b){
                      var aStart = parseInt(sumData.result[a].variation_set[0].variation_loc.filter(function(v){return v["assembly_name"] == me.getGenomeBuildHelper().getCurrentBuildName()})[0].start);
                      var bStart = parseInt(sumData.result[b].variation_set[0].variation_loc.filter(function(v){return v["assembly_name"] == me.getGenomeBuildHelper().getCurrentBuildName()})[0].start);
                      if ( aStart > bStart)
                        return 1;
                      else
                        return -1;
                    })
                    sumData.result.uids = sorted;
                    if (clinvarLoadVariantsFunction) {
                      clinvarLoadVariantsFunction(sumData.result);
                    }
                    resolve();
                  }
                })
                .fail(function() {
                  console.log('Error: clinvar http request failed to get summary data');
                  resolve("clinvarError");
                  //reject('Error: clinvar http request failed to get summary data');
                })
            }
          })
          .fail(function() {
            console.log('Error: clinvar http request failed to get IDs');
            //reject('Error: clinvar http request failed to get IDs');
            resolve("clinvarError");

          })
        }
      });

  }



  exports._annotateVcfRegion = function(records, refName, sampleName, annotationEngine, isRefSeq, hgvsNotation, getRsId, vepAF, useServerCache, gnomADExtra, decompose, callback, callbackClinvar ) {
    var me = this;

    //  Figure out the reference sequence file path
    var refFastaFile = me.getGenomeBuildHelper().getFastaPath(refName);


    var writeStream = function(stream) {
      records.forEach( function(record) {
        if (record.trim() == "") {
        } else {
          stream.write(record + "\n");
        }
      });

      stream.end();
    }

    let gnomadURL = null;
    let gnomadRegion = null;
    if (gnomADExtra) {

    }

    var cmd = me.getEndpoint().annotateVariants({'writeStream': writeStream}, refName, regions, null, annotationEngine, isRefSeq, hgvsNotation, getRsId, vepAF, useServerCache, null, false, gnomADExtra, decompose);


    var buffer = "";
    // Get the results from the command
    cmd.on('data', function(data) {
         buffer = buffer + data;
    });

    cmd.on('end', function() {
         callback(buffer);
    });

    cmd.on('error', function(error) {
      console.log("error while annotating vcf records " + error);
    });

    // Run the iobio command
    cmd.run();

  }


  exports._parseVcfRecords = function(vcfRecs, refName, geneObject, selectedTranscript, clinvarMap, hasExtraAnnot, parseMultiSample, sampleNames, sampleIndex, vepAF, sfariMode = false, gnomADExtra = false) {

      var me = this;
      var selectedTranscriptID = globalApp.utility.stripTranscriptPrefix(selectedTranscript.transcript_id);

      // Use the sample index to grab the right genotype column from the vcf record
      // If it isn't provided, assume that the first genotype column is the one
      // to be evaluated and parsed.  If sampleNames (a comma separated value string) is
      // provided, evaluate the sample indices as ordinals since vt select will return only those
      // sample (genotype) columns.
      var gtSampleIndices = [];
      var gtSampleNames = null;

      if (sampleNames != null && sampleNames != "") {
        gtSampleNames   = globalApp.utility.uniq(sampleNames.split(","))
        gtSampleIndices = gtSampleNames.map(function(sampleName,i) {
          return i;
        });
      }
      // If no sample name provided, get the genotype for the provided
      // index.  If no index provided, get the first genotype.
      if (gtSampleIndices.length == 0) {
        gtSampleIndices.push(sampleIndex != null ? sampleIndex : 0);
      }
      if (gtSampleNames == null) {
        gtSampleNames = gtSampleIndices.map(function(elem, i) {
          return elem.toString();
        })
      }
      var allVariants = null;
      if (parseMultiSample) {
        allVariants = gtSampleIndices.map(function(element) {
          return [];
        })
      } else {
        allVariants = [ [] ];
      }


      // The variant region may span more than the specified region.
      // We will be keeping track of variant depth by relative position
      // of the region start, so to prevent a negative index, we will
      // keep track of the region start based on the variants.
      var variantRegionStart = geneObject.start;

      // Interate through the vcf records.  For each record, if multiple
      // alternates are provided, iterate through each alternate
      vcfRecs.forEach(function(rec) {
        if (rec.pos && rec.id) {
          var alts = [];
          if(rec.alt.indexOf(',') > -1) {
            // Done split apart multiple alt alleles for education edition
            if (isEduMode) {
              alts.push(rec.alt);
            } else {
              alts = rec.alt.split(",");
            }
          } else {
            alts.push(rec.alt);
          }
          var altIdx = 0;
          alts.forEach(function(alt) {
            var len = null;
            var type = null;
            var end = null;

            var isMultiAllelic = alts.length > 1;

            if (alt.indexOf("<") == 0 && alt.indexOf(">") > 0) {
              var annotTokens = rec.info.split(";");
              annotTokens.forEach(function(annotToken) {
                if (annotToken.indexOf("SVLEN=") == 0) {
                  len = Math.abs(+annotToken.substring(6, annotToken.length));
                } else if (annotToken.indexOf("SVTYPE=") == 0) {
                  type = annotToken.substring(7, annotToken.length);
                  //if (type && type.toLowerCase() == 'mnp') {
                  //  type = 'snp';
                  //}
                }
              });
              rec.ref = '';
              alt = '';
              end = +rec.pos + len;

            } else {
              len = alt.length;
              type = 'SNP';
              if (rec.ref == '.' || alt.length > rec.ref.length ) {
                type = 'INS';
                len = alt.length - rec.ref.length;
              } else if (rec.alt == '.' || alt.length < rec.ref.length) {
                type = 'DEL';
                len = rec.ref.length - alt.length;
              }
              end = +rec.pos + len;

            }


            var annot = me._parseAnnot(rec, altIdx, isMultiAllelic, geneObject, selectedTranscript, selectedTranscriptID, vepAF, gnomADExtra);

            var clinvarResult = me.parseClinvarInfo(rec, clinvarMap);

            var gtResult = me._parseGenotypes(rec, alt, altIdx, gtSampleIndices, gtSampleNames, sfariMode);

            var clinvarObject = me._formatClinvarCoordinates(rec, alt);

            if (gtResult.keep) {

              var highestImpactSnpeff = me._getHighestImpact(annot.snpEff.allSnpeff, me._cullTranscripts, selectedTranscriptID);
              var highestImpactVep    = me._getHighestImpact(annot.vep.allVep,       me._cullTranscripts, selectedTranscriptID);
              var highestSIFT         = me._getLowestScore(  annot.vep.allSIFT,      me._cullTranscripts, selectedTranscriptID);
              var highestPolyphen     = me._getHighestScore( annot.vep.allPolyphen,  me._cullTranscripts, selectedTranscriptID);
              var highestREVEL        = me._getHighestScore( annot.vep.allREVEL,     me._cullTranscripts, selectedTranscriptID);

              for (var i = 0; i < allVariants.length; i++) {
                // When vcf data is cached, any circular references are ommitted during JSON.stringify.
                // To avoid culling out this genotype element from the 'genotypes' field, we
                // must make the genotype unique.  Here we are copying the element and adding a dummy
                // attribute
                var genotype = $.extend({'extraAttr': 1}, gtResult.genotypes[i]);

                // Keep the variant if we are just parsing a single sample (parseMultiSample=false)
                // or we are parsing multiple samples and this sample's genotype is het or hom
                if (!parseMultiSample || genotype.keep) {
                  let currId = rec.id;
                  if (sfariMode === true) {
                      currId = ('id_' + rec.pos + '_' + refName + '_' + geneObject.strand + '_' + rec.ref + '_' + rec.alt);  // key = start.chromosome.strand.ref.alt
                  }

                  var variant = {
                    'start':                    +rec.pos,
                    'end':                      +end,
                    'len':                      +len,
                    'level':                    +0,
                    'strand':                   geneObject.strand,
                    'chrom':                    refName,
                    'type':                     annot.typeAnnotated && annot.typeAnnotated != '' ? annot.typeAnnotated : type,
                    'id':                       currId,
                    'ref':                      rec.ref,
                    'alt':                      alt,
                    'qual':                     rec.qual,
                    'recfilter':                rec.filter.split(";").join("-"),

                    'extraAnnot':               hasExtraAnnot,

                    'gene':                     geneObject,

                    // genotype fields
                    'genotype':                 genotype,
                    'genotypeDepth' :           genotype.genotypeDepth,
                    'genotypeFilteredDepth' :   genotype.filteredDepth,
                    'genotypeAltCount' :        genotype.altCount,
                    'genotypeRefCount' :        genotype.refCount,
                    'genotypeAltForwardCount' : genotype.altForwardCount,
                    'genotypeAltReverseCount' : genotype.altReverseCount,
                    'genotypeRefForwardCount' : genotype.refForwardCount,
                    'genotypeRefReverseCount' : genotype.refReverseCount,
                    'eduGenotype' :             genotype.eduGenotype,
                    'eduGenotypeReversed':      genotype.eduGenotypeReversed,
                    'zygosity':                 genotype.zygosity ? genotype.zygosity : 'gt_unknown',
                    'phased':                   genotype.phased,

                    // fields to init to 'empty'
                    'consensus':                rec.consensus,
                    'inheritance':              '',

                    // clinvar coords
                    'clinvarStart':            clinvarObject.clinvarStart,
                    'clinvarRef':              clinvarObject.clinvarRef,
                    'clinvarAlt':              clinvarObject.clinvarAlt,

                    //
                    // annot fields
                    //
                    'af':                       annot.af,
                    'af1000G':                  me._parseAf(altIdx, annot.af1000G),
                    'afExAC':                   me._parseAf(altIdx, annot.afExAC),
                    'afgnomAD':                 vepAF ? annot.vep.af['gnomAD'].AF : '',
                    'rsid' :                    annot.rs,
                    'combinedDepth':            annot.combinedDepth,

                    // snpeff
                    'effect':                   annot.snpEff.effects,
                    'impact':                   annot.snpEff.impacts,

                    // multi-allelic (from vt decompose)
                    'multiallelic':             annot.multiallelic,

                    // vep
                    'vepConsequence':          annot.vep.vepConsequence,
                    'vepImpact':               annot.vep.vepImpact,
                    'vepExon':                 annot.vep.vepExon,
                    'vepHGVSc':                annot.vep.vepHGVSc,
                    'vepHGVSp':                annot.vep.vepHGVSp,
                    'vepAminoAcids':           annot.vep.vepAminoAcids,
                    'vepProteinPosition':      annot.vep.vepProteinPosition,
                    'vepVariationIds' :        annot.vep.vepVariationIds,
                    'vepREVEL':                annot.vep.vepREVEL,
                    'vepSIFT':                 annot.vep.vepSIFT,
                    'sift' :                   annot.vep.sift,
                    'vepPolyPhen':             annot.vep.vepPolyPhen,
                    'polyphen' :               annot.vep.polyphen,
                    'vepRegs':                 annot.vep.vepRegs,
                    'regulatory' :             annot.vep.regulatory,
                    'vepAf':                   annot.vep.af,

                    // generic annots
                    'genericAnnots':           annot.genericAnnots,

                    // gnomAD
                    'gnomAD':                  gnomADExtra ? annot.gnomAD : null,

                    //  when multiple impacts, pick the highest one (by variant type and transcript)
                    'highestImpactSnpeff':     highestImpactSnpeff,
                    'highestImpactVep':        highestImpactVep,
                    'highestSIFT':             highestSIFT,
                    'highestPolyphen':         highestPolyphen,
                    'highestREVEL':            highestREVEL
                  };

                  // Too much data for sfari vars
                  if (sfariMode === false) {
                      variant['genotypes'] = gtResult.genotypeMap;
                  }

                  for (var key in clinvarResult) {
                    variant[key] = clinvarResult[key];
                  }

                  if (me.getGenericAnnotation() !== undefined && sfariMode === false) {
                    me.getGenericAnnotation().setSimpleFields(variant);
                  }

                  allVariants[i].push(variant);
                }

              }

              if (rec.pos < variantRegionStart) {
                variantRegionStart = rec.pos;
              }

            }

            altIdx++;

          });
        }

      });

      // Here is the result set.  An object representing the entire region with a field called
      // 'features' that contains an array of variants for this region of interest.
      var results = [];
      for (var i = 0; i < allVariants.length; i++) {
        var data = {
          'name':              'vcf track',
          'ref':                refName,
          'gene':               geneObject.gene_name,
          'start':              +geneObject.start,
          'end':                +geneObject.end,
          'strand':             geneObject.strand,
          'transcript':         selectedTranscript,
          'variantRegionStart': variantRegionStart,
          'loadState':          {},
          'features':           allVariants[i],
          'genericAnnotators':  me.infoFields ? Object.keys(me.infoFields) : []
        };
        results.push(data);
      }

      return  parseMultiSample ? results :  results[0];
      //return  results;
  };

exports._parseAnnot = function(rec, altIdx, isMultiAllelic, geneObject, selectedTranscript, selectedTranscriptID, vepAF, gnomADExtra=false) {
  var me = this;

  var annot = {
    af: null,
    typeAnnotated: null,
    combinedDepth: null,
    af1000G: '.',
    afExAC: '.',
    rs: '',
    multiallelic: '',
    snpEff: {
      effects: {},
      impacts: {},
      allSnpeff: {}
    },
    gnomAD: gnomADExtra ? {
      af: '.',
      afPopMax: '.',
      altCount: 0,
      totalCount: 0,
      homCount: 0,
      pop: {
        fin: {
          af: '.',
          altCount: 0,
          totalCount: 0,
        },
        nfe: {
          af: '.',
          altCount: 0,
          totalCount: 0,
        },
        oth: {
          af: '.',
          altCount: 0,
          totalCount: 0,
        },
        amr: {
          af: '.',
          altCount: 0,
          totalCount: 0,
        },
        afr: {
          af: '.',
          altCount: 0,
          totalCount: 0,
        },
        asj: {
          af: '.',
          altCount: 0,
          totalCount: 0,
        },
        eas: {
          af: '.',
          altCount: 0,
          totalCount: 0,
        },
        sas: {
          af: '.',
          altCount: 0,
          totalCount: 0,
        }

      }
    } : null,

    vep: {
      allVep: {},
      allSIFT: {},
      allPolyphen: {},
      allREVEL: {},
      vepConsequence: {},
      vepImpact: {},
      vepFeatureType: {},
      vepFeature: {},
      vepExon: {},
      vepHGVSc: {},
      vepHGVSp: {},
      vepAminoAcids: {},
      vepProteinPosition: {},
      vepVariationIds: {},
      vepSIFT: {},
      vepPolyPhen: {},
      vepREVEL: {},
      sift: {},       // need a special field for filtering purposes
      polyphen: {},   // need a special field for filtering purposes
      regulatory: {}, // need a special field for filtering purposes
      vepRegs: [],
      af: {'1000G': {}, 'ESP': {}, 'gnomAD': {}, 'MAX': {}}
    },
    genericAnnots:  {}
  };

  var annotTokens = rec.info.split(";");

  if (gnomADExtra) {
    me._parseGnomADAnnot(annotTokens, annot);
  }

  annotTokens.forEach(function(annotToken) {
    if (annotToken.indexOf("BGAF_1KG=") == 0) {

      annot.af1000G = annotToken.substring(9, annotToken.length);

    } else if (annotToken.indexOf("BGAF_EXAC=") == 0) {

      annot.afExAC = annotToken.substring(10, annotToken.length);

    } else if (annotToken.indexOf("RS=") == 0) {

      annot.rs = annotToken.substring(3, annotToken.length);

    } else if (annotToken.indexOf("AF=") == 0) {

      // For now, just grab first af
      //af = me._parseAnnotForAlt(annotToken.substring(3, annotToken.length), altIdx);
      annot.af = me._parseAnnotForAlt(annotToken.substring(3, annotToken.length), 0);

    } else if (annotToken.indexOf("TYPE=") == 0) {

      annot.typeAnnotated = me._parseAnnotForAlt(annotToken.substring(5, annotToken.length), altIdx);

    } else if (annotToken.indexOf("DP=") == 0) {

      annot.combinedDepth = annotToken.substring(3, annotToken.length);

    } else if (annotToken.indexOf("EFF=") == 0) {

      me._parseSnpEffAnnot(annotToken, annot, geneObject, selectedTranscriptID);

    } else if (annotToken.indexOf("CSQ") == 0) {

      me._parseVepAnnot(altIdx, isMultiAllelic, annotToken, annot, geneObject, selectedTranscript, selectedTranscriptID, vepAF)

    } else if (annotToken.indexOf("AVIA3") == 0) {
      me._parseGenericAnnot("AVIA3", annotToken, annot);

    } else if (annotToken.indexOf("OLD_MULTIALLELIC=") == 0) {
      annot.multiallelic = annotToken.substring(17, annotToken.length);
    }

  });


  return annot;
}
/* To parse the VEP annot, split the CSQ string into its parts.
   Each part represents the annotations for a given transcript.

  Here is the field mapping for each transcript
  which is separated by a comma

   Allele|Consequence|IMPACT|SYMBOL|Gene|Feature_type|Feature|BIOTYPE|EXON|INTRON|HGVSc|HGVSp
   |cDNA_position|CDS_position|Protein_position|Amino_acids|Codons|Existing_variation
   |DISTANCE|STRAND|FLAGS|SYMBOL_SOURCE|HGNC_ID|GENE_PHENO|SIFT|PolyPhen|HGVS_OFFSET
   |AFR_AF|AMR_AF|EAS_AF|EUR_AF|SAS_AF
   |AA_AF|EA_AF
   |gnomAD_AF|gnomAD_AFR_AF|gnomAD_AMR_AF|gnomAD_ASJ_AF|gnomAD_EAS_AF|gnomAD_FIN_AF|gnomAD_NFE_AF|gnomAD_OTH_AF|gnomAD_SAS_AF
   |MAX_AF|MAX_AF_POPS
   |CLIN_SIG|SOMATIC|PHENO|MOTIF_NAME|MOTIF_POS|HIGH_INF_POS|MOTIF_SCORE_CHANGE


*/
exports._parseVepAnnot = function(altIdx, isMultiAllelic, annotToken, annot, geneObject, selectedTranscript, selectedTranscriptID, vepAF) {
  var me = this;

  var vepFields = me.infoFields.VEP;

  var tokenValue = annotToken.substring(4, annotToken.length);
  var transcriptTokens = tokenValue.split(",");

  transcriptTokens.forEach(function(transcriptToken) {
      var vepTokens   = transcriptToken.split("|");

      var keep = true;
      if (isMultiAllelic) {
        if (vepFields.hasOwnProperty('ALLELE_NUM') && vepFields.ALLELE_NUM >= 0) {
          var vepAlleleNumber   = vepTokens[vepFields.ALLELE_NUM];
          if (altIdx >= 0 &&  vepAlleleNumber >= 0) {
            if (altIdx+1 != vepAlleleNumber) {
              keep = false;
            }
          }
        }
      }

      if (keep) {
        var feature     = vepTokens[vepFields.Feature];
        var featureType = vepTokens[vepFields.Feature_type];

        // If the transcript is the selected transcript, parse
        // all of the vep fields.  We place these into maps
        // because we can have multiple vep consequences for
        // the same transcript.
        // TODO:  Need to sort so that highest impact shows first
        //        and is used for filtering and ranking purposes.
        if (featureType == 'Transcript' && (feature == selectedTranscriptID || feature == selectedTranscript.transcript_id)) {
          annot.vep.vepImpact[vepTokens[vepFields.IMPACT]] = vepTokens[vepFields.IMPACT];

          var consequence = vepTokens[vepFields.Consequence];
          consequence.split("&").forEach( function(token) {
            annot.vep.vepConsequence[token] = token;
          })

          if (vepTokens[vepFields.EXON] && vepTokens[vepFields.EXON].length > 0) {
            annot.vep.vepExon[vepTokens[vepFields.EXON]] = vepTokens[vepFields.EXON];
          }
          annot.vep.vepHGVSc[vepTokens[vepFields.HGVSc]] = vepTokens[vepFields.HGVSc];
          annot.vep.vepHGVSp[vepTokens[vepFields.HGVSp]] = vepTokens[vepFields.HGVSp];
          annot.vep.vepAminoAcids[vepTokens[vepFields.Amino_acids]] = vepTokens[vepFields.Amino_acids];
          annot.vep.vepProteinPosition[vepTokens[vepFields.Protein_position]] = vepTokens[vepFields.Protein_position];
          annot.vep.vepVariationIds[vepTokens[vepFields.Existing_variation]] = vepTokens[vepFields.Existing_variation];

          var siftString = vepTokens[vepFields.SIFT];
          var siftDisplay = siftString != null && siftString != "" ? siftString.split("(")[0] : "";
          annot.vep.vepSIFT[siftDisplay] = siftDisplay;
          annot.vep.sift['sift_'+ siftDisplay] = 'sift_' + siftDisplay;

          var polyphenString = vepTokens[vepFields.PolyPhen];
          var polyphenDisplay = polyphenString != null && polyphenString != "" ? polyphenString.split("(")[0] : "";
          annot.vep.vepPolyPhen[polyphenDisplay] = polyphenDisplay;
          annot.vep.polyphen['polyphen_' + polyphenDisplay] = 'polyphen_' + polyphenDisplay;

          if (vepFields.REVEL) {
            var revelScore = vepTokens[vepFields.REVEL];
            annot.vep.vepREVEL[revelScore] = revelScore;
          }


        } else if (featureType == 'RegulatoryFeature' || featureType == 'MotifFeature' ) {
          annot.vep.vepRegs.push( {
            'impact' :  vepTokens[vepFields.IMPACT],
            'consequence' : vepTokens[vepFields.Consequence],
            'biotype': vepTokens[vepFields.BIOTYPE],
            'motifName' : vepTokens[vepFields.MOTIF_NAME],
            'motifPos'  : vepTokens[vepFields.MOTIF_POS],
            'motifHiInf' : vepTokens[vepFields.HIGH_INF_POS]
          });
          var reg = vepTokens[vepFields.Consequence] == 'regulatory_region_variant' ? vepTokens[vepFields.BIOTYPE] : vepTokens[vepFields.Consequence];
          var regKey = reg;
          if (reg == "promoter") {
            regKey = "the_promoter";
          }

          var valueUrl = "";
          if (feature != "" && feature != null) {
            var url = me.getGenomeBuildHelper().getBuildResource(me.getGenomeBuildHelper().RESOURCE_ENSEMBL_URL) + "Regulation/Context?db=core;fdb=funcgen;rf=" + feature;
            valueUrl = '<a href="' + url + '" target="_reg">' + reg.split("_").join(" ").toLowerCase() + '</a>';
          } else {
            valueUrl = reg.split("_").join(" ").toLowerCase();
          }
          annot.vep.regulatory[(featureType == 'RegulatoryFeature' ? "reg_" : "mot_") + regKey.toLowerCase()] = valueUrl;
        }
        if (featureType == 'Transcript') {
          var theTranscriptId = feature;

          // Only keep annotations that are for transcripts that in the gene's list of known
          // transcripts
          var validTranscript = false;
          geneObject.transcripts.forEach( function(transcript) {
          if (transcript.transcript_id.indexOf(theTranscriptId) == 0) {
            validTranscript = true;
            }
          });
          if (validTranscript) {
            // Keep track of all VEP impact and consequence so that we can determine the highest impact
            // variant across all transcripts
            var theImpact = vepTokens[vepFields.IMPACT];
            var theConsequences = vepTokens[vepFields.Consequence];
            var siftString = vepTokens[vepFields.SIFT];
            var siftDisplay = siftString != null && siftString != "" ? siftString.split("(")[0] : "";
            var siftScore = "99";
            if (siftString != null && siftString != "" && siftString.indexOf("(") >= 0) {
              siftScore = siftString.split("(")[1].split(")")[0];
            }
            var polyphenString = vepTokens[vepFields.PolyPhen];
            var polyphenDisplay = polyphenString != null && polyphenString != "" ? polyphenString.split("(")[0] : "";
            var polyphenScore = -99;
            if (polyphenString != null && polyphenString != "" && polyphenString.indexOf("(") >= 0) {
              polyphenScore = polyphenString.split("(")[1].split(")")[0];
            }

            var revelScore  = vepFields.REVEL ? vepTokens[vepFields.REVEL] : "";

            var consequencesObject = annot.vep.allVep[theImpact];
            if (consequencesObject == null) {
              consequencesObject = {};
            }

            me._appendTranscript(consequencesObject, theConsequences, theTranscriptId);
            annot.vep.allVep[theImpact] = consequencesObject;

            var siftObject = annot.vep.allSIFT[siftScore];
            if (siftObject == null) {
              siftObject = {};
            }
            me._appendTranscript(siftObject, siftDisplay, theTranscriptId);
            annot.vep.allSIFT[siftScore] = siftObject;

            var polyphenObject = annot.vep.allPolyphen[polyphenScore];
            if (polyphenObject == null) {
              polyphenObject = {};
            }
            me._appendTranscript(polyphenObject, polyphenDisplay, theTranscriptId);
            annot.vep.allPolyphen[polyphenScore] = polyphenObject;

            var revelObject = annot.vep.allREVEL[revelScore];
            if (revelObject == null) {
              revelObject = {};
            }
            me._appendTranscript(revelObject, revelScore, theTranscriptId);
            annot.vep.allREVEL[revelScore] = revelObject;


            if (vepAF) {
              me._parseVepAfAnnot(VEP_FIELDS_AF_GNOMAD, vepFields, vepTokens, "gnomAD", "gnomAD", annot);
              me._parseVepAfAnnot(VEP_FIELDS_AF_1000G,  vepFields, vepTokens, "1000G",  null,     annot);
              me._parseVepAfAnnot(VEP_FIELDS_AF_ESP,    vepFields, vepTokens, "ESP",    null,     annot);
              me._parseVepAfAnnot(VEP_FIELDS_AF_MAX,    vepFields, vepTokens, "MAX",    "MAX",    annot);
            }

          } else {
            var consequence = vepTokens[vepFields.Consequence];
            //console.log(geneObject.gene_name + " " + consequence + ": throwing out invalid transcript " + theTranscriptId);
          }

        }
      }

  });


}

exports._parseVepAfAnnot = function(fieldNames, vepFields, vepTokens, afSource, omitPrefix, annot) {
  fieldNames.forEach(function(fieldName) {
    var targetFieldName = omitPrefix ? fieldName.split(omitPrefix + "_")[1] : fieldName;
    var tokenIdx        = vepFields[fieldName];
    if (tokenIdx && vepTokens[tokenIdx] && vepTokens[tokenIdx].length > 0) {
      annot.vep.af[afSource][targetFieldName] = vepTokens[tokenIdx];
    } else {
      annot.vep.af[afSource][targetFieldName] = ".";
    }
  })
}

exports._parseGnomADAnnot = function(annotTokens, annot) {

  var me = this;

  var setNestedValue = function(annotObject, gnomADTags, idx, theValue) {
    var field = gnomADTags[idx];
    if (idx == gnomADTags.length - 1) {
      annotObject[field] = theValue;
      return;
    } else {
      idx++;
      setNestedValue(annotObject[field], gnomADTags, idx, theValue)
    }
  }

  annotTokens.forEach(function(annotToken) {
    var tagValue = annotToken.split("\=");
    var annotTag   = tagValue[0];
    var annotValue = tagValue[1];

    var gnomADTag         = GNOMAD_TAGS[annotTag];
    if (gnomADTag && annotValue) {
      if (Array.isArray(gnomADTag)) {
        var idx = 0
        setNestedValue(annot.gnomAD, gnomADTag, idx, annotValue);
      } else {
        annot.gnomAD[gnomADTag] = annotValue;
      }
    }
  })

}

exports._parseGenericAnnot = function(annotator, annotToken, annot) {
  var me = this;
  var annotObject = {};
  var fieldMap = me.infoFields[annotator];

  var infoValues  = annotToken.substring(annotator.length + 1, annotToken.length);
  var tokens      = infoValues.split("|");
  for (var fieldName in fieldMap) {
    var idx = fieldMap[fieldName];

    var theValue = tokens[idx] ? tokens[idx] : '';
    var valueObject = null;
    if (theValue.indexOf(":") > 0) {
      valueObject = {};
      var subFields = theValue.split(":");
      // for each pair, create a tag/value in the associative array
      for (var x = 0; x < subFields.length - 1; x += 2) {
        var tag = subFields[x];
        var value = subFields[x+1];
        valueObject[tag] = value;
      }
    } else {
      valueObject = theValue;
    }

    annotObject[fieldName] = valueObject;
  }
  annot.genericAnnots[annotator] = annotObject;
}

/* Split the EFF annotation into its parts.  Each
    part represents the annotations for a given transcript.
*/
exports._parseSnpEffAnnot = function(annotToken, annot, geneObject, selectedTranscriptID) {
  var me = this;

  var tokenValue = annotToken.substring(4, annotToken.length);
  var tokens = tokenValue.split(",");

  tokens.forEach(function(token) {
    // If we passed in an applicable transcript, grab the snpEff
    // annotations pertaining to it.  Otherwise, just grab the
    // first snpEff annotations listed.

    //EFF= Effect ( Effect_Impact | Functional_Class | Codon_Change | Amino_Acid_Change| Amino_Acid_Length |
    //              Gene_Name | Transcript_BioType | Gene_Coding | Transcript_ID | Exon_Rank  |
    //              Genotype_Number [ | ERRORS | WARNINGS ] )

    var stop = token.indexOf("(");
    var theEffect = token.substring(0, stop);
    var remaining = token.substring(stop+1,token.length);
    var effectTokens = remaining.split("|");
    var theImpact = effectTokens[0];
    var theTranscriptId = effectTokens[8];


    // Make sure that this annotation belongs to a transcript in the gene's transcript set.
    var validTranscript = false;
    geneObject.transcripts.forEach( function(transcript) {
      if (transcript.transcript_id.indexOf(theTranscriptId) == 0) {
        validTranscript = true;
      }
    });

    if (validTranscript) {
      // Determine if this is an annotation for the selected transcript
      var parseForSelectedTranscript = false;
      if (selectedTranscriptID && token.indexOf(selectedTranscriptID) > -1) {
        parseForSelectedTranscript = true;
      }


      // Map all impact to effects so that we can determine
      // the highest impact/effects for this variant, across
      // ALL transcripts for this variant.
      var effectsObject = allSnpeff[theImpact];
      if (effectsObject == null) {
        effectsObject = {};
      }
      me._appendTranscript(effectsObject, theEffect, theTranscriptId);
      annot.snpEff.allSnpeff[theImpact] = effectsObject;

      if (parseForSelectedTranscript) {
        // Parse out the effect
        annot.snpEff.effects[theEffect] = theEffect;

        // Parse out the impact
        annot.snpEff.impacts[theImpact] = theImpact;
      }
    } else {
      //console.log(geneObject.gene_name + " " + theEffect + ": throwing out invalid transcript " + selectedTranscriptID)
    }

  });

  if ($.isEmptyObject(annot.snpEff.impacts)) {
    annot.snpEff.impacts["NOIMPACT"] = "NOIMPACT";
  }
}

exports.getClinvarAnnots = function() {
  return   {
    clinvarUid: null,
    clinvarAlleleId: null,
    clinvarSubmissions: [],
    clinvarClinSig: {},
    clinvarTrait:  {},
    clinvarAccession: {},
    clinvarRank: null,
    clinvar: null
  };
}

exports.parseClinvarInfo = function(rec, clinvarMap) {
  var me = this;



  var matchesNewFormat = rec.info.split(";").filter(function(annotToken) {
    return annotToken.indexOf("ALLELEID") == 0;
  });

  if (matchesNewFormat.length > 0) {
    return me._parseClinvarInfo(rec, clinvarMap)
  } else {
    return me._parseClinInfoDeprecated(rec, clinvarMap);
  }

}

exports._parseClinvarInfo = function(rec, clinvarMap) {
  var me = this;

  var result = me.getClinvarAnnots();
  result.clinvarUid = rec.id;

  // This is the newest vcf fromat from clinvar
  rec.info.split(";").forEach( function (annotToken) {

    if (annotToken.indexOf("ALLELEID=") == 0) {
      // allele id
      result.clinvarAlleleId = annotToken.substring("ALLELEID=".length, annotToken.length);
    } else if (annotToken.indexOf("CLNSIG=") == 0) {
      // clinical sig
      var clinsigString = annotToken.substring("CLNSIG=".length, annotToken.length);
      clinsigString.split("|").forEach(function(clinsig) {
        result.clinvarClinSig[clinsig.toLowerCase()] = clinsig.toLowerCase();

        var mapEntry = clinvarMap[clinsig.toLowerCase()];
        if (mapEntry != null) {
          if (result.clinvarRank == null || mapEntry.value < result.clinvarRank) {

            result.clinvarRank = mapEntry.value;
            result.clinvar = mapEntry.clazz;

          }
        }

      })
    } else if (annotToken.indexOf("CLNDN=") == 0) {
      // traits
      var traitsString = annotToken.substring("CLNDN=".length, annotToken.length);
      traitsString.split("|").forEach(function(trait) {
        result.clinvarTrait[trait] = trait;
      })
    } else if (annotToken.indexOf("CLNREVSTAT=") == 0) {
      // review status (stars)
      result.clinvarRevStat = annotToken.substring("CLNREVSTAT=".length, annotToken.length);
    }

  })
  return result;
}

exports._parseClinInfoDeprecated = function(rec, clinvarMap) {
  var me = this;

  var result = me.getClinvarAnnots();

  var initClinvarSubmissions = function(clinvarSubmissions, length) {
    for (var i = 0; i < length; i++) {
      var entry = { clinsig: "", phenotype: "", accession: "" };
      clinvarSubmissions.push(entry);
    }
  }

  // This is the older format (summer 2018 and earlier)
  rec.info.split(";").forEach( function (annotToken) {

    if (annotToken.indexOf("CLNSIG=") == 0) {
      var clinvarCode = annotToken.substring(7, annotToken.length);

      initClinvarSubmissions(result.clinvarSubmissions, clinvarCode.split("|").length);

      var idx = 0;
      clinvarCode.split("|").forEach(function(codePart) {
        var submission = result.clinvarSubmissions[idx];

        codePart.split(",").forEach(function(code) {

            var clinvarToken = CLINVAR_CODES[code];
            var mapEntry = clinvarMap[clinvarToken];
            if (mapEntry != null) {
              if (result.clinvarRank == null || mapEntry.value < result.clinvarRank) {

                result.clinvarRank = mapEntry.value;
                result.clinvar = mapEntry.clazz;

              }
              submission.clinsig += submission.clinsig.length > 0 ? "," : "";
              submission.clinsig += clinvarToken;
              result.clinvarClinSig[clinvarToken] = idx.toString();
            }

        })

        idx++;
      })
    } else if (annotToken.indexOf("CLNDBN=") == 0) {
      var phenotypesStr = annotToken.substring(7, annotToken.length);
      var idx = 0;
      phenotypesStr.split("|").forEach(function(pheno) {

        var submission = result.clinvarSubmissions[idx];
        submission.phenotype = pheno;

        result.clinvarTrait[pheno] = idx.toString();
        idx++;
      })
    } else if (annotToken.indexOf("CLNACC=") == 0) {
      var accessionIds = annotToken.substring(7, annotToken.length);
      var idx = 0;
      accessionIds.split("|").forEach(function(accessionId) {

        var submission = result.clinvarSubmissions[idx];
        submission.accession = accessionId;

          result.clinvarAccession[accessionId] = idx.toString();
          idx++;
      })
    }

  })

  return result;
}


/*
 *
 * Parse the genotype field from in the vcf rec
 *
 */
 exports._parseGenotypes = function(rec, alt, altIdx, sampleIndices, sampleNames, sfariMode) {
    var me = this;

    // The result returned will be an object representing all
    // genotypes for the sample indices provided.
    //
    //  all      the alternate for which these genotype(s) apply
    //  keep     a boolean indicating if any of the sample genotypes
    //           contains this alternate.  For example, if this is a
    //           multiallelic, if non of the samples contains this
    //           alternate, keep will be set to false.
    //  gtNumber Normally, the gtNumber for an alterate will equal
    //           1.  For multi-allelics, this number ranges from
    //           1 to the number of alternate alleles.
    //
    //
    var result = {
      alt:         alt,
      keep:        false,
      gtNumber:    altIdx +1,
      genotype:    {},
      genotypes:   [],
      genotypeMap: {} };



    // The results will contain an array of genotype objects for
    // each sample index provided.  The first element in the
    // array is assumed to be the "target" genotype.  For example,
    // if we are parsing the genotypes for a trio, the first
    // genotype will be for the proband, followed by 2 more elements
    // for the mother and father's genotypes.
     result.genotypes = sampleIndices.map( function(sampleIndex) {
         return { sampleIndex: sampleIndex, zygosity: null, phased: null};
     });

      // The results will also contain a map to obtain
      // the genotype by sample name.  If sample names were not provided,
      // we will use the index as the key to the map.
      // NOTE: cannot do this for sfari samples, crashes browser
     if (sfariMode === true) {
       result.genotypeMap = {};
     } else {
       result.genotypes.forEach(function(gt) {
           let key = sampleNames ? sampleNames[gt.sampleIndex] : gt.sampleIndex.toString();
           result.genotypeMap[key] = gt;
       });
     }

    // Determine the format of the genotype fields
    var gtTokens = {};
    var idx = 0;
    if (rec.format && rec.format != '') {
      var tokens = rec.format.split(":");
      tokens.forEach(function(token) {
        gtTokens[token] = idx;
        idx++;
      })
    }

    //
    // For each applicable genotype (of the sample indices provided),
    // parse the genotype field of the vcf record, creating an
    // object with the following fields:
    //    sampleIndex         - The applicable genotype column (for a sample)
    //    gt                  - The genotype field (e.g. 0|1)
    //    zygosity            - The zygosity (e.g. het, hom, homref)
    //    depth               - The total observations at this position
    //    filteredDepth       - The total observations considered at this position
    //    altCount            - The number of observations where the alternate allele was observed
    //    refCount            - The number of observations where the reference allele was observed
    //    altForwardCount,    - The alternate counts for the strands
    //    altReverseCount
    //    refForwardCount,    - The reference counts for the strands
    //    refReverseCount
    //    eduGenotype         - The simplified format for showing genotype (e.g. C->T)
    //    eduGenotypeReversed - For reverse strand, show the compliment of the simplified genotype (e.g. A->G)
    //
    result.genotypes.forEach( function(gt) {
      var genotype = rec.genotypes.length > gt.sampleIndex ? rec.genotypes[gt.sampleIndex] : null;

      if (genotype == null  || genotype == "" || genotype == '.') {
        gt.zygosity = 'gt_unknown';
        gt.keep      = rec.genotypes.length == 0 ? true : false;
        gt.absent   =  rec.genotypes.length == 0 ? true : false;
      } else {

        var tokens = genotype.split(":");
        var gtFieldIndex = gtTokens["GT"];
        gt.gt = tokens[gtFieldIndex];

        var gtDepthIndex = gtTokens["DP"];
        if (gtDepthIndex) {
          gt.filteredDepth = tokens[gtDepthIndex];
        } else {
          gt.filteredDepths = null;
        }

        var gtAlleleCountIndex = gtTokens["AD"];
        var gtAltCountIndex = gtTokens["AO"];
        if (gtAlleleCountIndex) {
          //
          // GATK allele counts
          //
          var countTokens = tokens[gtAlleleCountIndex].split(",");
          if (countTokens.length >= 2 ) {
            var refAlleleCount = countTokens[0];
            var altAlleleCounts = countTokens.slice(1).join(",");

            var totalAllelicDepth = 0;
            countTokens.forEach(function(allelicDepth) {
              if (allelicDepth) {
                totalAllelicDepth += +allelicDepth;
              }
            })

            gt.altCount      = altAlleleCounts;
            gt.refCount      = refAlleleCount;
            gt.genotypeDepth = totalAllelicDepth;
          } else {
            gt.altCount      = null;
            gt.refCount      = null;
            gt.genotypeDepth = null;
          }
        } else if (gtAltCountIndex) {
          //
          // Freebayes allele counts
          //
          var totalAllelicDepth = 0;


          gt.altCount = tokens[gtAltCountIndex];

          var altCountTokens = gt.altCount.split(",");
          altCountTokens.forEach(function(allelicDepth) {
            if (allelicDepth) {
                totalAllelicDepth += +allelicDepth;
            }
          })

          var gtRefCountIndex = gtTokens["RO"];
          if (gtRefCountIndex) {
            gt.refCount = tokens[gtRefCountIndex];;
            totalAllelicDepth += +gt.refCount;
          } else {
            gt.refCount = null;
          }

          gt.genotypeDepth = totalAllelicDepth;


        } else {
          gt.altCount = null;
          gt.refCount = null;
        }

        gt.altCount = me._parseMultiAllelic(result.gtNumber-1, gt.altCount, ",");


        var strandAlleleCountIndex = gtTokens["SAC"]; // GATK
        var strandRefForwardIndex  = gtTokens["SRF"]; // Freebayes
        var strandRefReverseIndex  = gtTokens["SRR"]; // Freebayes
        var strandAltForwardIndex  = gtTokens["SAF"]; // Freebayes
        var strandAltReverseIndex  = gtTokens["SAR"]; // Freebayes
        if (strandAlleleCountIndex) {
          //
          // GATK Strand allele counts, comma separated
          //
          var countTokens = tokens[strandAlleleCountIndex].split(",");
          if (countTokens.length == 4) {
            gt.refForwardCount = tokens[0];
            gt.refReverseCount = tokens[1];
            gt.altForwardCount = tokens[2];
            gt.altReverseCount = tokens[3];
          } else {
            gt.refForwardCount = null;
            gt.refReverseCount = null;
            gt.altForwardCount = null;
            gt.altReverseCount = null;
          }
        } else if (strandRefForwardIndex && strandRefReverseIndex && strandAltForwardIndex && strandAltReverseIndex ) {
          //
          // Freebayes Strand bias counts (SRF, SRR, SAF, SAR)
          //
          gt.refForwardCount = tokens[strandRefForwardIndex];
          gt.refReverseCount = tokens[strandRefReverseIndex];
          gt.altForwardCount = tokens[strandAltForwardIndex];
          gt.altReverseCount = tokens[strandAltReverseIndex];
        } else {
          gt.refForwardCount = null;
          gt.refReverseCount = null;
          gt.altForwardCount = null;
          gt.altReverseCount = null;
        }



        // Only keep the alt if we have a genotype that matches.
        // For example
        // A->G    0|1 keep
        // A->G,C  0|1 keep A->G, but bypass A->C
        // A->G,C  0|2 bypass A->G, keep A->C
        // A->G,C  1|2 keep A->G, keep A->C
        // unknown .   bypass
        var delim = null;

        if (gt.gt.indexOf("|") > 0) {
          delim = "|";
          gt.phased = true;
        } else if (gt.gt.indexOf("/") > 0){
          delim = "/";
          gt.phased = false;
        } else if (gt.gt == ".") {
          gt.keep = false;
          gt.zygosity = "HOMREF";
        } else {
          gt.keep = false;
          gt.zygosity = "gt_unknown";
        }
        if (delim) {
          var tokens = gt.gt.split(delim);
          if (tokens.length == 2) {
            if (isEduMode && alt.indexOf(",") > 0) {
              if ((tokens[0] == 1 ) && (tokens[1] == 2)) {
                gt.keep = true;
              } if (tokens[0] == tokens[1]) {
                gt.keep = true;
                var theAltIdx = tokens[0] - 1;
                result.alt = alt.split(',')[theAltIdx] + ',' + alt.split(',')[theAltIdx];
              } else if (tokens[0] == 0 && tokens[1] != 0) {
                var theAltIdx = +tokens[1] - 1;
                result.alt = alt.split(',')[theAltIdx]
              } else if (tokens[1] == 0 && tokens[0] != 0) {
                var theAltIdx = +tokens[0] - 1;
                result.alt = alt.split(',')[theAltIdx]
              }
              if (gt.keep) {
                if (tokens[0] == tokens[1]) {
                  gt.zygosity = "HOM";
                } else {
                  gt.zygosity = "HET";
                }
              }

            }  else if (tokens[0] == result.gtNumber || tokens[1] == result.gtNumber) {
              //  result.gtNumber will be a number > 1 if this is a multi-allelic
              //  in this case, we have a genotype that is not 0 and matches
              //  the "alt"
              //    simple het example:
              //      ref    alt   gt
              //      A      T     0/1
              //    simple hom example:
              //      ref    alt   gt
              //      A      T     1/1
              //    multi-allelic het example:
              //      ref    alt   gt
              //      A      T,G   1/2  if gt.number is "2", that means we will is het for A->G
              //    multi-allelic hom example:
              //      ref    alt   gt
              //      A      T,G   2/2  if gt.number is "2", that means we will is hom for A->G
              gt.keep = true;
              if (tokens[0] == tokens[1]) {
                gt.zygosity = "HOM";
              } else {
                gt.zygosity = "HET";
              }
            }
            else if (tokens[0] == "0" && tokens[1] == "0" ) {
              // Homozygous ref 0/0
              gt.keep = false;
              gt.zygosity = "HOMREF"
            } else if (tokens[0] != result.gtNumber && tokens[1] != result.gtNumber ) {
              // Multi-allelic, but this genotype doesn't have the alternate
              //    multi-allelic  example:
              //      ref    alt   gt
              //      A      T,G   0/1  if gt.number is "2", that means this allele is not present
              gt.keep = false;
              gt.zygosity = "gt_unknown"
            }
          }

          gt.eduGenotype = "";
          if (isEduMode) {
            var alts = alt.split(",");
            var gtIdx1 = +tokens[0];
            var gtIdx2 = +tokens[1];
            if (gt.zygosity == "HET" && gtIdx1 == 0) {
              gt.eduGenotype = rec.ref + " " + alts[altIdx];
            } else if (gt.zygosity == "HET" && gtIdx1 > 0) {
              gt.eduGenotype = alts[gtIdx1-1] + " " + alts[gtIdx2-1];
            } else if (gt.zygosity == "HOM") {
              gt.eduGenotype = alts[gtIdx1-1] + " " + alts[gtIdx1-1];
            } else if (gt.zygosity == "HOMREF") {
              gt.eduGenotype = rec.ref + " " + rec.ref;
            }
          }
          gt.eduGenotypeReversed = globalApp.utility.switchGenotype(gt.eduGenotype);

        }
      }
    });



    result.genotypes.forEach(function(gt) {
      if (gt.keep) {
        result.keep = true;
      }
    });

    // The 'target' genotype will be the first genotype in the array
    // For example, if the sampleIndex of '1' was sent in (sampleIndices = [1]),
    // the first element in the the array will be the second genotype
    // column in the vcf record (sample index is 0 based).
    if (result.genotypes.length > 0) {
      result.genotype = result.genotypes[0];
    }

    return result;
 }

exports._getServerCacheKey = function(vcfName, service, refName, geneObject, sampleName, miscObject) {
  var me = this;

  var key =  "backend.gene.iobio"
//    + "-" + cacheHelper.launchTimestamp
    + "-" + vcfName
    + "-" + service
    + "-" + refName
    + "-" + geneObject.start.toString()
    + "-" + geneObject.end.toString()
    + "-" + geneObject.strand
    + "-" + sampleName;

  if (miscObject) {
    for (var miscKey in miscObject) {
      key += "-" + miscKey + "=" + miscObject[miscKey];
    }
  }
  return key;
}

exports._appendTranscript = function(theObject, key, theTranscriptId) {
  var me = this;
  var transcripts = theObject[key];
  if (transcripts == null) {
    transcripts = {};
  }
  transcripts[theTranscriptId] = theTranscriptId;
  theObject[key] = transcripts;
}


exports._cullTranscripts = function(transcriptObject, theTranscriptId) {
  var me = this;
  // If the current transcript is included in the list,
  // we don't have to identify individual transcripts.
  for (var key in transcriptObject) {
    var transcripts = transcriptObject[key];
    var found = false;
    for (var transcriptId in transcripts) {
      var strippedTranscriptId = globalApp.utility.stripTranscriptPrefix(transcriptId);
      if (theTranscriptId.indexOf(strippedTranscriptId) == 0) {
        found = true;
      }
    }
    if (found) {
      transcriptObject[key] = {};
    }

  }
  return transcriptObject;
}

exports._getHighestImpact = function(theObject, cullFunction, theTranscriptId) {
  var me = this;
  var theEffects = theObject['HIGH'];
  if (theEffects) {
    return {HIGH: cullFunction(theEffects, theTranscriptId)};
  }
  theEffects = theObject['MODERATE'];
  if (theEffects) {
    return {MODERATE: cullFunction(theEffects, theTranscriptId)};
  }
  theEffects = theObject['MODIFIER'];
  if (theEffects) {
    return {MODIFIER: cullFunction(theEffects, theTranscriptId)};
  }
  theEffects = theObject['LOW'];
  if (theEffects) {
    return {LOW: cullFunction(theEffects, theTranscriptId)};
  }
  return {};
}

exports._getLowestScore = function(theObject, cullFunction, theTranscriptId) {
  var me = this;
  var minScore = 99;
  for( var score in theObject) {
    if (+score < minScore) {
      minScore = +score;
    }
  }
  // Now get other entries with the same SIFT/Polyphen category
  var categoryObject = theObject[minScore];
  for (var category in categoryObject) {
    for (var theScore in theObject) {
      var theCategoryObject = theObject[theScore];
      if (+theScore != +minScore && theCategoryObject[category] != null) {
        var theTranscripts = theCategoryObject[category];
        for (var transcriptId in theTranscripts) {
          me._appendTranscript(categoryObject, category, transcriptId);
        }
      }
    }

  }
  theObject[minScore] = cullFunction(categoryObject, theTranscriptId);
  return theObject[minScore];
}

exports._getHighestScore = function(theObject, cullFunction, theTranscriptId) {
  var me = this;
  var maxScore = -99;
  for( var score in theObject) {
    if (+score > maxScore) {
      maxScore = +score;
    }
  }
  // Now get other entries with the same SIFT/Polyphen category
  var categoryObject = theObject[maxScore];
  for (var category in categoryObject) {
    for (var theScore in theObject) {
      var theCategoryObject = theObject[theScore];
      if (+theScore != +maxScore && theCategoryObject[category] != null) {
        var theTranscripts = theCategoryObject[category];
        for (var transcriptId in theTranscripts) {
          me._appendTranscript(categoryObject, category, transcriptId);
        }
      }
    }

  }
  theObject[maxScore] = cullFunction(categoryObject, theTranscriptId);
  return theObject[maxScore];
}

/*
 *
 * Get rid of the left most anchor base for insertions and
 * deletions for accessing clinvar
 *
*/
  exports._formatClinvarCoordinates = function(rec, alt) {
      var target = {};
      if (rec.hasOwnProperty("pos")) {
        target.clinvarStart = +rec.pos;
      } else if (rec.hasOwnProperty("start")) {
        target.clinvarStart = +rec.start;
      }

      target.clinvarAlt   = alt;
      target.clinvarRef   = rec.ref;

      if (target.clinvarAlt == '.') {
        target.clinvarAlt = '-';
      } else if (target.clinvarRef == '.') {
        target.clinvarRef = '-';
      } else if (target.clinvarRef.length > target.clinvarAlt.length) {
        // deletion
        target.clinvarStart++;
        target.clinvarAlt = target.clinvarAlt.length == 1 ? "-" : target.clinvarAlt.substr(1,target.clinvarAlt.length-1);
        target.clinvarRef = target.clinvarRef.substr(1,target.clinvarRef.length-1);
      } else if (target.clinvarAlt.length > target.clinvarRef.length) {
        // insertion
        target.clinvarStart++;
        target.clinvarRef = target.clinvarRef.length == 1 ? "-" : target.clinvarRef.substr(1,target.clinvarRef.length-1);
        target.clinvarAlt = target.clinvarAlt.substr(1,target.clinvarAlt.length-1);
      }
      return target;
  }

  exports._parseMultiAllelic = function(alleleIdx, genotypeValue, delim) {
    if (genotypeValue == null || genotypeValue == "" || genotypeValue.indexOf(delim) < 0) {
      return genotypeValue;
    } else {
      var tokens = genotypeValue.split(delim);
      if (tokens.length > alleleIdx) {
        return tokens[alleleIdx];
      } else {
        return genotypeValue;
      }
    }
  };

  // If af returned from af is for multi-allelic variants, we need to parse out the
  // correct af from the comma separated string.
  exports._parseAf = function(altIdx, af) {
      // Handle multi-allelics
      if (af.indexOf(",") > 0) {
        var aftokens = af.split(",");
        var theAf = aftokens[+altIdx];
        return theAf;
      } else {
        return af;
      }
  };


  exports._parseAnnotForAlt = function(value, altIdx) {
    var annotValue = "";
    if (value.indexOf(",") > 0) {
      var tokens = value.split(",");
      if (tokens.length > altIdx) {
        annotValue = tokens[altIdx];
      } else {
        annotValue = value;
      }
    }  else {
      annotValue = value;
    }
    return annotValue;
  };

  exports.pileupVcfRecordsImproved = function(variants, regionStart, posToPixelFactor, widthFactor) {
    var pileup = pileupLayout().sort(null).size(800); // 1860
    var maxlevel = pileup(variants);
    return maxLevel;
  }

  exports.pileupVcfRecords = function(variants, regionStart, posToPixelFactor, widthFactor) {
      widthFactor = widthFactor ? widthFactor : 1;
      // Variant's can overlap each over.  Set a field called variant.level which determines
      // how to stack the variants vertically in these cases.
      var posLevels = {};
      var maxLevel = 0;
      var posUnitsForEachVariant = posToPixelFactor * widthFactor;
      variants.forEach(function(variant) {

        // get next available vertical spot starting at level 0
        var startIdx = (variant.start - regionStart);// + i;
        var posLevel = 0;
        var stackAtStart = posLevels[startIdx];
        if (stackAtStart) {
          for (var k = 0; k <= stackAtStart.length; k++ ) {
            if (stackAtStart[k] == undefined) {
              posLevel = k;
              break;
            }
          }
        }

        // Set variant level.
        variant.level = posLevel;

        // Now set new level for each positions comprised of this variant.
        for (var i = 0; i < variant.len + posUnitsForEachVariant; i++) {
          var idx = (variant.start - regionStart) + i;
          var stack = posLevels[idx] || [];
          stack[variant.level] = true;
          posLevels[idx] = stack;

          // Capture the max level of the entire region.
          if (stack.length - 1 > maxLevel) {
            maxLevel = stack.length - 1;
          }
        }
      });
      return maxLevel;
  }


  exports.compareVcfRecords = function(variants1, variants2, comparisonAttr, onMatchFunction, onNoMatchFunction) {

    var set1Label = 'unique1';
    var set2Label = 'unique2';
    var commonLabel = 'common';
    var comparisonAttribute = comparisonAttr;
    if (comparisonAttribute == null) {
      comparisonAttribute = 'consensus';
    }

    variants1.count = variants1.features.length;
    variants2.count = variants2.features.length;

    var features1 = variants1.features;
    var features2 = variants2.features;

    // Flag duplicates as this will throw off comparisons
    var ignoreDups = function(features) {
      for (var i =0; i < features.length - 1; i++) {
        var variant = features[i];
        var nextVariant = features[i+1];
        if (i == 0) {
          variant.dup = false;
        }
        nextVariant.dup = false;

        if (variant.start == nextVariant.start) {
             var refAlt = variant.type.toLowerCase() + ' ' + variant.ref + "->" + variant.alt;
             var nextRefAlt = nextVariant.type.toLowerCase() + ' ' + nextVariant.ref + "->" + nextVariant.alt;

             if (refAlt == nextRefAlt) {
                nextVariant.dup = true;
             }
        }
      }
    }
    ignoreDups(features1);
    ignoreDups(features2);


    // Iterate through the variants from the first set,
    // marking the consensus field based on whether a
    // matching variant from the second list is encountered.
    var idx1 = 0;
    var idx2 = 0;
    while (idx1 < features1.length && idx2 < features2.length) {
      // Bypass duplicates
      if (features1[idx1].dup) {
        idx1++;
      }
      if (features2[idx2].dup) {
        idx2++;
      }

      variant1 = features1[idx1];
      variant2 = features2[idx2];

      var refAlt1 = variant1.type.toLowerCase() + ' ' + variant1.ref + "->" + variant1.alt;
      var refAlt2 = variant2.type.toLowerCase() + ' ' + variant2.ref + "->" + variant2.alt;

      if (variant1.start == variant2.start) {

        if (refAlt1 == refAlt2) {
          variant1[comparisonAttribute] =  commonLabel;
          variant2[comparisonAttribute] =  commonLabel;

          if (onMatchFunction) {
            onMatchFunction(variant1, variant2);
          }
          idx1++;
          idx2++;
        } else if (refAlt1 < refAlt2) {
          variant1[comparisonAttribute] = set1Label;
          if (onNoMatchFunction) {
            onNoMatchFunction(variant1, null);
          }
          idx1++;
        } else {
          variant2[comparisonAttribute] = set2Label;
          if (onNoMatchFunction) {
            onNoMatchFunction(null, variant2);
          }
          idx2++;
        }
      } else if (variant1.start < variant2.start) {
        variant1[comparisonAttribute] = set1Label;
        if (onNoMatchFunction) {
            onNoMatchFunction(variant1, null);
        }
        idx1++;
      } else if (variant2.start < variant1.start) {
        variant2[comparisonAttribute] = set2Label;
        if (onNoMatchFunction) {
            onNoMatchFunction(null, variant2);
        }
        idx2++;
      }

    }


    // If we get to the end of one set before the other,
    // mark the remaining as unique
    //
    if (idx1 < features1.length) {
      for(var x = idx1; x < features1.length; x++) {
        var variant1 = features1[x];
        variant1[comparisonAttribute] = set1Label;
        if (onNoMatchFunction) {
            onNoMatchFunction(variant1, null);
        }
      }
    }
    if (idx2 < features2.length) {
      for(var x = idx2; x < features2.length; x++) {
        var variant2 = features2[x];
        variant2[comparisonAttribute] = set2Label;
        if (onNoMatchFunction) {
            onNoMatchFunction(null, variant2);
        }
      }
    }



  };

  exports.processVcfFile = function(vcfFile, tbiFile){

    let self = this;

    const proxyAddress = 'lf-proxy.iobio.io';
    const port = 443;
    const secure = true;
    const protocol = secure ? 'https:' : 'http:';
    // collected, which could lead to race conditions?
    createHoster({ proxyAddress, port, secure }).then((hoster) => {
      const vcfPath = '/' + vcfFile.name;
      hoster.hostFile({ path: vcfPath, file: vcfFile });
      const tbiPath = '/' + tbiFile.name;
      hoster.hostFile({ path: tbiPath, file: tbiFile });
      const portStr = hoster.getPortStr();
      const baseUrl = `${protocol}//${proxyAddress}${portStr}`;
      self.vcfURL = `${baseUrl}${hoster.getHostedPath(vcfPath)}`;
      self.tbiUrl = `${baseUrl}${hoster.getHostedPath(tbiPath)}`;
      self.sourceType = SOURCE_TYPE_URL;
    });

  };






  //
  //
  //
  //  PRIVATE
  //
  //
  //


  // Allow on() method to be invoked on this class
  // to handle data events
  // d3.rebind(exports, dispatch, 'on');

  // Return this scope so that all subsequent calls
  // will be made on this scope.
  return exports;
};


var iobioApiClient = (function (exports) {
  'use strict';

  // This code was originally adapted from
  const XHR_LOADING = 3;
  const XHR_DONE = 4;

  class Stream {
    constructor(xhr, body) {

      this._body = body;

      xhr.seenBytes = 0;

      xhr.onreadystatechange = () => { 
        switch (xhr.readyState) {
          //case XHR_HEADERS_RECEIVED:
          //  if (xhr.status !== 200) {
          //    this._onError(xhr.reponseText);
          //  }

          //  break;
          case XHR_LOADING:

            if (xhr.status === 200) {
              const newData = xhr.responseText.substr(xhr.seenBytes); 
              this._onData(newData);

              xhr.seenBytes = xhr.responseText.length; 
            }
            else {
              this._onError(xhr.responseText);
            }

            break;
          case XHR_DONE:

            if (xhr.status === 200) {
              const lastData = xhr.responseText.substr(xhr.seenBytes); 
              this._onData(lastData);
              this._onEnd();
            }
            else {
              this._onError(xhr.responseText);
            }

            break;
          default:
            //console.error("Unhandle XHR code: " + xhr.readyState);
            break;
        }
      };

      this._xhr = xhr;
      this._started = false;
    }

    onData(callback) {
      if (!this._started) {
        this._started = true;
        this.start();
      }

      this._onData = callback;
    }

    onEnd(callback) {
      this._onEnd = callback;
    }

    onError(callback) {
      this._onError = callback;
    }

    start() {
      if (this._body) {
        this._xhr.send(this._body);
      }
      else {
        this._xhr.send();
      }
    }

    cancel() {
      this._xhr.abort();
    }
  }


  function request(url, options) {
    let method = 'GET';

    let params;
    let contentType = "application/json;charset=UTF-8";

    if (options !== undefined) {
      method = options.method ? options.method : method;

      params = options.params;

      contentType = options.contentType ? options.contentType : contentType;
    }

    var xhr = new XMLHttpRequest();
    xhr.open(method, url);

    let body;
    if (params) {
      xhr.setRequestHeader("Content-Type", contentType);
      body = JSON.stringify(params);
    }
    
    return new Stream(xhr, body);
  }

  var domain;

  // This constructor is used to store event handlers. Instantiating this is
  // faster than explicitly calling `Object.create(null)` to get a "clean" empty
  // object (tested with v8 v4.9).
  function EventHandlers() {}
  EventHandlers.prototype = Object.create(null);

  function EventEmitter() {
    EventEmitter.init.call(this);
  }

  // nodejs oddity
  // require('events') === require('events').EventEmitter
  EventEmitter.EventEmitter = EventEmitter;

  EventEmitter.usingDomains = false;

  EventEmitter.prototype.domain = undefined;
  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._maxListeners = undefined;

  // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.
  EventEmitter.defaultMaxListeners = 10;

  EventEmitter.init = function() {
    this.domain = null;
    if (EventEmitter.usingDomains) {
      // if there is an active domain, then attach to it.
      if (domain.active && !(this instanceof domain.Domain)) ;
    }

    if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
      this._events = new EventHandlers();
      this._eventsCount = 0;
    }

    this._maxListeners = this._maxListeners || undefined;
  };

  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.
  EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || isNaN(n))
      throw new TypeError('"n" argument must be a positive number');
    this._maxListeners = n;
    return this;
  };

  function $getMaxListeners(that) {
    if (that._maxListeners === undefined)
      return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
  }

  EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return $getMaxListeners(this);
  };

  // These standalone emit* functions are used to optimize calling of event
  // handlers for fast cases because emit() itself often has a variable number of
  // arguments and can be deoptimized because of that. These functions always have
  // the same number of arguments and thus do not get deoptimized, so the code
  // inside them can execute faster.
  function emitNone(handler, isFn, self) {
    if (isFn)
      handler.call(self);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self);
    }
  }
  function emitOne(handler, isFn, self, arg1) {
    if (isFn)
      handler.call(self, arg1);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1);
    }
  }
  function emitTwo(handler, isFn, self, arg1, arg2) {
    if (isFn)
      handler.call(self, arg1, arg2);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1, arg2);
    }
  }
  function emitThree(handler, isFn, self, arg1, arg2, arg3) {
    if (isFn)
      handler.call(self, arg1, arg2, arg3);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1, arg2, arg3);
    }
  }

  function emitMany(handler, isFn, self, args) {
    if (isFn)
      handler.apply(self, args);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].apply(self, args);
    }
  }

  EventEmitter.prototype.emit = function emit(type) {
    var er, handler, len, args, i, events, domain;
    var doError = (type === 'error');

    events = this._events;
    if (events)
      doError = (doError && events.error == null);
    else if (!doError)
      return false;

    domain = this.domain;

    // If there is no 'error' event listener then throw.
    if (doError) {
      er = arguments[1];
      if (domain) {
        if (!er)
          er = new Error('Uncaught, unspecified "error" event');
        er.domainEmitter = this;
        er.domain = domain;
        er.domainThrown = false;
        domain.emit('error', er);
      } else if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
      return false;
    }

    handler = events[type];

    if (!handler)
      return false;

    var isFn = typeof handler === 'function';
    len = arguments.length;
    switch (len) {
      // fast cases
      case 1:
        emitNone(handler, isFn, this);
        break;
      case 2:
        emitOne(handler, isFn, this, arguments[1]);
        break;
      case 3:
        emitTwo(handler, isFn, this, arguments[1], arguments[2]);
        break;
      case 4:
        emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
        break;
      // slower
      default:
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        emitMany(handler, isFn, this, args);
    }

    return true;
  };

  function _addListener(target, type, listener, prepend) {
    var m;
    var events;
    var existing;

    if (typeof listener !== 'function')
      throw new TypeError('"listener" argument must be a function');

    events = target._events;
    if (!events) {
      events = target._events = new EventHandlers();
      target._eventsCount = 0;
    } else {
      // To avoid recursion in the case that type === "newListener"! Before
      // adding it to the listeners, first emit "newListener".
      if (events.newListener) {
        target.emit('newListener', type,
                    listener.listener ? listener.listener : listener);

        // Re-assign `events` because a newListener handler could have caused the
        // this._events to be assigned to a new object
        events = target._events;
      }
      existing = events[type];
    }

    if (!existing) {
      // Optimize the case of one listener. Don't need the extra array object.
      existing = events[type] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === 'function') {
        // Adding the second element, need to change to array.
        existing = events[type] = prepend ? [listener, existing] :
                                            [existing, listener];
      } else {
        // If we've already got an array, just append.
        if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
      }

      // Check for listener leak
      if (!existing.warned) {
        m = $getMaxListeners(target);
        if (m && m > 0 && existing.length > m) {
          existing.warned = true;
          var w = new Error('Possible EventEmitter memory leak detected. ' +
                              existing.length + ' ' + type + ' listeners added. ' +
                              'Use emitter.setMaxListeners() to increase limit');
          w.name = 'MaxListenersExceededWarning';
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          emitWarning(w);
        }
      }
    }

    return target;
  }
  function emitWarning(e) {
    typeof console.warn === 'function' ? console.warn(e) : console.log(e);
  }
  EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.prependListener =
      function prependListener(type, listener) {
        return _addListener(this, type, listener, true);
      };

  function _onceWrap(target, type, listener) {
    var fired = false;
    function g() {
      target.removeListener(type, g);
      if (!fired) {
        fired = true;
        listener.apply(target, arguments);
      }
    }
    g.listener = listener;
    return g;
  }

  EventEmitter.prototype.once = function once(type, listener) {
    if (typeof listener !== 'function')
      throw new TypeError('"listener" argument must be a function');
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };

  EventEmitter.prototype.prependOnceListener =
      function prependOnceListener(type, listener) {
        if (typeof listener !== 'function')
          throw new TypeError('"listener" argument must be a function');
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      };

  // emits a 'removeListener' event iff the listener was removed
  EventEmitter.prototype.removeListener =
      function removeListener(type, listener) {
        var list, events, position, i, originalListener;

        if (typeof listener !== 'function')
          throw new TypeError('"listener" argument must be a function');

        events = this._events;
        if (!events)
          return this;

        list = events[type];
        if (!list)
          return this;

        if (list === listener || (list.listener && list.listener === listener)) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else {
            delete events[type];
            if (events.removeListener)
              this.emit('removeListener', type, list.listener || listener);
          }
        } else if (typeof list !== 'function') {
          position = -1;

          for (i = list.length; i-- > 0;) {
            if (list[i] === listener ||
                (list[i].listener && list[i].listener === listener)) {
              originalListener = list[i].listener;
              position = i;
              break;
            }
          }

          if (position < 0)
            return this;

          if (list.length === 1) {
            list[0] = undefined;
            if (--this._eventsCount === 0) {
              this._events = new EventHandlers();
              return this;
            } else {
              delete events[type];
            }
          } else {
            spliceOne(list, position);
          }

          if (events.removeListener)
            this.emit('removeListener', type, originalListener || listener);
        }

        return this;
      };

  EventEmitter.prototype.removeAllListeners =
      function removeAllListeners(type) {
        var listeners, events;

        events = this._events;
        if (!events)
          return this;

        // not listening for removeListener, no need to emit
        if (!events.removeListener) {
          if (arguments.length === 0) {
            this._events = new EventHandlers();
            this._eventsCount = 0;
          } else if (events[type]) {
            if (--this._eventsCount === 0)
              this._events = new EventHandlers();
            else
              delete events[type];
          }
          return this;
        }

        // emit removeListener for all listeners on all events
        if (arguments.length === 0) {
          var keys = Object.keys(events);
          for (var i = 0, key; i < keys.length; ++i) {
            key = keys[i];
            if (key === 'removeListener') continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners('removeListener');
          this._events = new EventHandlers();
          this._eventsCount = 0;
          return this;
        }

        listeners = events[type];

        if (typeof listeners === 'function') {
          this.removeListener(type, listeners);
        } else if (listeners) {
          // LIFO order
          do {
            this.removeListener(type, listeners[listeners.length - 1]);
          } while (listeners[0]);
        }

        return this;
      };

  EventEmitter.prototype.listeners = function listeners(type) {
    var evlistener;
    var ret;
    var events = this._events;

    if (!events)
      ret = [];
    else {
      evlistener = events[type];
      if (!evlistener)
        ret = [];
      else if (typeof evlistener === 'function')
        ret = [evlistener.listener || evlistener];
      else
        ret = unwrapListeners(evlistener);
    }

    return ret;
  };

  EventEmitter.listenerCount = function(emitter, type) {
    if (typeof emitter.listenerCount === 'function') {
      return emitter.listenerCount(type);
    } else {
      return listenerCount.call(emitter, type);
    }
  };

  EventEmitter.prototype.listenerCount = listenerCount;
  function listenerCount(type) {
    var events = this._events;

    if (events) {
      var evlistener = events[type];

      if (typeof evlistener === 'function') {
        return 1;
      } else if (evlistener) {
        return evlistener.length;
      }
    }

    return 0;
  }

  EventEmitter.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
  };

  // About 1.5x faster than the two-arg version of Array#splice().
  function spliceOne(list, index) {
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
      list[i] = list[k];
    list.pop();
  }

  function arrayClone(arr, i) {
    var copy = new Array(i);
    while (i--)
      copy[i] = arr[i];
    return copy;
  }

  function unwrapListeners(arr) {
    var ret = new Array(arr.length);
    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }
    return ret;
  }

  class Client {

    constructor(server, options) {
      this.cmd = Command;
      const proto = options && options.secure ? 'https://' : 'http://';
      this._server = proto + server;
    }

    streamCommand(commandName, params) {
      return new PostCommand(this._server, commandName, params);
    }

    // bam.iobio endpoints
    //
    streamAlignmentHeader(url) {
      return new Command(this._server, 'alignmentHeader', { url });
    }

    streamBaiReadDepth(url) {
      return new Command(this._server, 'baiReadDepth', { url });
    }

    streamCraiReadDepth(url) {
      return new Command(this._server, 'craiReadDepth', { url });
    }

    streamAlignmentStatsStream(url, indexUrl, regions) {

      //const regArr = regions.map(function(d) { return d.name+ ":"+ d.start + '-' + d.end;});
      //const regStr = JSON.stringify(regions.map(function(d) { return {start:d.start,end:d.end,chr:d.name};}));
      return new Command(this._server, 'alignmentStatsStream', {
        url,
        indexUrl: indexUrl ? indexUrl : "",
        regions: JSON.stringify(regions),
      });
    }


    // gene.iobio endpoints
    //
    streamVariantHeader(url, indexUrl) {
      return new Command(this._server, 'variantHeader', { 
        url,
        indexUrl: indexUrl ? indexUrl : "",
      });
    }

    streamVcfReadDepth(url) {
      return new Command(this._server, 'vcfReadDepth', { url });
    }

    streamAlignmentCoverage(url, indexUrl, samtoolsRegion, maxPoints, coverageRegions) {
      return new PostCommand(this._server, 'alignmentCoverage', {
        url,
        indexUrl: indexUrl ? indexUrl : "",
        samtoolsRegion,
        maxPoints,
        coverageRegions,
      });
    }

    streamGeneCoverage(url, indexUrl, refName, geneName, regionStart, regionEnd, regions) {
      return new Command(this._server, 'geneCoverage', {
        url,
        indexUrl: indexUrl ? indexUrl : "",
        refName,
        geneName,
        regionStart,
        regionEnd,
        regions: JSON.stringify(regions),
      });
    }

    streamNormalizeVariants(vcfUrl, tbiUrl, refName, regions, contigStr, refFastaFile) {
      return new Command(this._server, 'normalizeVariants', {
        vcfUrl,
        tbiUrl: tbiUrl ? tbiUrl: "",
        refName,
        regions: JSON.stringify(regions),
        contigStr: encodeURIComponent(contigStr),
        refFastaFile: encodeURIComponent(refFastaFile),
      });
    }

    streamAnnotateVariants(args) {
      return new Command(this._server, 'annotateVariants', Object.assign({},
        args, {
          refNames: JSON.stringify(args.refNames),
          regions: JSON.stringify(args.regions),
          vcfSampleNames: JSON.stringify(args.vcfSampleNames),
        }
      ));
    }

    streamFreebayesJointCall(args) {
      return new PostCommand(this._server, 'freebayesJointCall', args);
    }

    streamClinvarCountsForGene(args) {
      return new PostCommand(this._server, 'clinvarCountsForGene', args);
    }

    // genepanel endpoints
    //
    async clinphen(args) {
      return fetchNoStream(this._server, 'clinphen', args);
    }
    streamClinphen(args) {
      return new Command(this._server, 'clinphen', args);
    }
  }


  async function fetchNoStream(server, endpoint, params) {
    const query = encodeURI(server + '/' + endpoint + encodeParams(params));
    const response = await fetch(query);
    if (response.ok) {
      return response.text();
    }
    else {
      throw new Error(`iobio API call failed with status code ${response.status}: '${query}'`);
    }
  }


  class Command extends EventEmitter {
    constructor(server, endpoint, params) {
      super();

      this._server = server;
      this._endpoint = endpoint;
      this._params = params;
    }

    run() {
      const query = encodeURI(this._server + '/' + this._endpoint + encodeParams(this._params));
      //console.log(query);
      this._stream = request(query);

      this._stream.onData((data) => {
        this.emit('data', data);
      });
      this._stream.onEnd(() => {
        this.emit('end');
      });
      this._stream.onError((e) => {
        this.emit('error', e);
      });
    }

    cancel() {
      this._stream.cancel();
    }
  }


  class PostCommand extends EventEmitter {
    constructor(server, endpoint, params) {
      super();

      this._server = server;
      this._endpoint = endpoint;
      this._params = params;
    }

    run() {
      const query = this._server + '/' + this._endpoint;
      //console.log(query);
      this._stream = request(query, {
        method: 'POST',
        params: this._params,
        contentType: 'text/plain; charset=utf-8',
      });

      this._stream.onData((data) => {
        this.emit('data', data);
      });
      this._stream.onEnd(() => {
        this.emit('end');
      });
      this._stream.onError((e) => {
        this.emit('error', e);
      });
    }

    cancel() {
      this._stream.cancel();
    }
  }


  function encodeParams(obj) {

    const params = Object.keys(obj).map((key, i) => {
      let sep = '&';
      if (i === 0) {
        sep = '?';
      }

      // TODO: might need this
      //const value = encodeURIComponent(String(obj[key]));
      const value = String(obj[key]);

      return sep + key + '=' + value;
    });

    return params.join('');
  }

  exports.Client = Client;

  return exports;

}({}));
