export default class MosaicSession {
  constructor(clientApplicationId) {
    this.vcf = null;
    this.samples = null;
    this.url = null;
    this.isMother = false;
    this.isFather = false;
    this.apiVersion =  '/api/v1';
    this.apiDepricated = null;
    this.apiVersionDeprecated = '/apiv1';

    this.client_application_id = clientApplicationId;
    this.variantSetTxtCols = [
      "chrom",
      "start",
      "end",
      "ref",
      "alt",
      "allelicBalance",
      "slivarFilter",
      "gene",
      "afgnomAD",
      "sampleId"
    ]
    this.user = null;

    this.variantSetToFilterName = {
      'compoundhet': 'compoundHet'
    };

    this.geneSet = null;
    this.variantSet = null;
    this.experimentId = null;

    this.OWNER_ROLE = 2;
    this.ADMIN_ROLE = 3;
  }

  // This formats the attributes and distributions to be how they used to be, an object
  // where the keys are the uids. This is not viable for long term since samples can now
  // have multiple distributions and attributes due to experiments
  formatAttributes(sample) {
    sample.attributes = sample.attributes.reduce((acc, curr) => {
      const value = curr.values.length ? curr.values[0].value : null;
      acc[curr.uid] = value

      return acc;
    }, {});

    sample.distributions = sample.distributions.reduce((acc, curr) => {
      const value = curr.values.length ? curr.values[0].value : null;
      acc[curr.uid] = value
      
      return acc;
    }, {});

    return sample;
  }
  
  promiseInit(sampleId, source, isPedigree, projectId, clientAppId, geneSetId, variantSetId, build, experimentId ) {
    let self = this;
    self.api = source + self.apiVersion;
    self.client_application_id = clientAppId;
    self.apiDepricated = source + self.apiVersionDeprecated;
    self.experiment_id = experimentId;
    
    return new Promise((resolve, reject) => {
      let modelInfos = [];
      let coverageHistos = [];
      let allVarCounts = [];

      self.promiseGetCurrentUser()
      .then(function(data) {
        self.user = data;
        if (geneSetId) {
          return self.promiseGetGeneSet(projectId, geneSetId)
        } else {
          return Promise.resolve(null);
        }
      })
      .then(function(data) {

        self.geneSet = data;
        
        if (variantSetId) {
          return self.promiseGetVariantSet(projectId, variantSetId, build)
        } else {
          return Promise.resolve(null);
        }
        
      })
      .then(function(data) {
          
        self.variantSet = data;

        self.promiseGetSampleInfo(projectId, sampleId, isPedigree)
        .then(data => {

          let promises = [];


          let pedigree    = isPedigree ? data.pedigree : {'proband': data.proband};
          let rawPedigree = data.rawPedigree;

          // Let's get the proband info first
          let probandSample = isPedigree ? pedigree.proband : data.proband;
          self.promiseGetFileMapForSample(projectId, probandSample, 'proband').then(data => {
            probandSample.files = data.fileMap;
          })
          .then( () => {
            for (var rel in pedigree) {
              if (rel != 'unparsed') {
                let samples = [];
                if (Array.isArray(pedigree[rel])) {
                  samples = pedigree[rel];
                } else {
                  samples = [pedigree[rel]];
                }
                samples.forEach(s => {
                  let p =  self.promiseGetFileMapForSample(projectId, s, rel).then(data => {
                    let theSample = self.formatAttributes(data.sample);
                    theSample.files = data.fileMap;
                    var sample_name = theSample.vcf_sample_name
                    let coverageHisto =  {id: sampleId, coverage: theSample.distributions.coverage_hist_no_outliers, sample: sample_name, median: theSample.attributes.median_read_coverage};
                    let varCounts = {id: sampleId, sample: sample_name, median: theSample.attributes.median_read_coverage, counts : { SNP: theSample.attributes.var_snp_count, indel : theSample.attributes.var_indel_count, other: theSample.attributes.var_other_count}}


                    // gene.iobio only supports siblings in same multi-sample vcf as proband.
                    // bypass siblings in their own vcf.
                    let bypass = false;
                    // TODO:  Need to check if samples exist in proband vcf rather than checking file names
                    // since mosaic generates different vcf url for sample physical file.
                    //if (data.relationship == 'siblings' && theSample.files.vcf != probandSample.files.vcf) {
                    //  bypass = true;
                    //  console.log("Bypassing sibling " + theSample.id + ".  This sample must reside in the same vcf as the proband in order to be processed.")
                    //}

                    if (!bypass) {

                      var modelInfo = {
                        'relationship':   data.relationship == 'siblings' ? 'sibling' : data.relationship,
                        'affectedStatus': isPedigree ? theSample.pedigree.affection_status == 2 ? 'affected' : 'unaffected' : 'affected',
                        'sex':            isPedigree ? theSample.pedigree.sex == 1 ? 'male' : (theSample.pedigree.sex == 2 ? 'female' : 'unknown') : 'unknown',
                        'name':           theSample.name,
                        'sample':         theSample.files.vcf ? theSample.vcf_sample_name : theSample.name,
                        'vcf':            theSample.files.vcf,
                        'tbi':            theSample.files.tbi == null || theSample.files.tbi.indexOf(theSample.files.vcf) == 0 ? null : theSample.files.tbi,
                        'txt':            theSample.files.txt
                      }


                      if (theSample.files.bam != null) {
                        modelInfo.bam = theSample.files.bam;
                        if (theSample.files.bai) {
                          modelInfo.bai = theSample.files.bai;
                        }

                      } else if (theSample.files.cram != null) {
                        modelInfo.bam = theSample.files.cram;
                        if (theSample.files.crai) {
                          modelInfo.bai = theSample.files.crai;
                        }
                      }

                      modelInfos.push(modelInfo);
                      coverageHistos.push(coverageHisto);
                      allVarCounts.push(varCounts);
                    }

                  })
                  promises.push(p);
                })
              }


            }
            Promise.all(promises).then(response => {
              // Don't want to expose db info here?
              //console.log(pedigree);

              let buf = "";
              modelInfos.forEach(function(modelInfo) {
                if (modelInfo.sample == null || modelInfo.sample == "") {
                  buf += "The sample " + modelInfo.name + "  (" + modelInfo.relationship + ")   has an empty vcf_sample_name. Unable to properly filter variants for this sample.<br><br>";
                }
              })
              if (buf.length > 0) {
                alertify.alert("Error", buf)
              }

              resolve({'modelInfos': modelInfos, 'rawPedigree': rawPedigree, 'coverageHistos': coverageHistos, 'allVarCounts': allVarCounts, 'user' : self.user, 'geneSet': self.geneSet, 'variantSet': self.variantSet, });
            })
            .catch(error => {
              reject(error);
            })

          })
        })

      })
      .catch(error => {
        reject(error);
      })

    })

  }

  hasVariantSets(modelInfos, rel='proband') {
    return false;
  }

  promiseParseVariantSets(modelInfos, rel='proband') {
    let self = this;
    return new Promise(function(resolve,reject) {
      let proband = modelInfos.filter(function(mi) {
        return mi.relationship == rel;
      })
      let variantSets = {};
      if (proband && proband.length > 0) {
        var promises = [];
        let fileInfos = proband[0].txt;
        fileInfos.forEach(function(fileInfo) {
          let p = self.promiseParseVariantSetFile(fileInfo, proband[0])
          .then(function(data) {
            if (data) {
              variantSets[data.nickname] = data.records;
            }
          })
          promises.push(p);
        })
        Promise.all(promises)
        .then(function() {
          resolve(variantSets)
        })
      } else {
        resolve(variantSets);
      }

    })
  }

  promiseParseVariantSetFile(fileInfo, modelInfo) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let theFileInfo = fileInfo
      $.ajax({
        url: fileInfo.url
      })
      .done(data => {
        let variants = [];
        if (data && data.length > 0) {
          let records = data.split("\n");
          records.map(function(record) {
            let fields = record.split("\t");
            if (fields.length >= self.variantSetTxtCols.length-1) {
              let variant = {};
              self.variantSetTxtCols.forEach(function(col, i) {
                variant[col] = fields[i];
              })
              let keep = true
              // If sampleId was included, us it to filter variants
              if (fields.length == self.variantSetTxtCols.length) {
                if (variant.sampleId  &&  modelInfo.sample && variant.sampleId != modelInfo.sample) {
                  keep = false;
                }
              }
              if (keep) {
                if (variant.gene == "" || variant.gene == null || variant.gene.trim().length == 0) {
                  console.log("promiseParseVariantSets: missing gene field.  bypassing record " + record);
                } else {
                  variant.isProxy = true;
                  variant.variant_id = variant.gene + "^" + variant.start + "^" + variant.ref + "^" + variant.alt;
                  if (variant.slivarFilter.indexOf("comphet") >= 0) {
                    variant.inheritance = "compound het"
                    variant.filtersPassed = "compoundHet"
                  } else {
                    variant.inheritance = variant.slivarFilter;
                    variant.filtersPassed = variant.inheritance;
                  }

                  let matched = variants.filter(function(v) {
                    return v.variant_id == variant.variant_id;
                  })
                  if (matched.length == 0) {
                    variants.push(variant)
                  }
                }
              } else {
                console.log("bypassing variant rec for sample " + variant.sampleId)
              }
            } else {
              console.log("promiseParseVariantSets: insufficient record fields.  bypassinging record " + record);
            }
          })
        }
        resolve({nickname: fileInfo.name, records: variants});
      })
      .fail(error => {
        console.log("Unable to get file " + fileInfo.url)
        //alertify.error("Missing file for URL " + fileInfo.url, 20)

        resolve();
      })

    })
  }


  promiseGetProject(project_id) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getProject(project_id)
      .done(data => {
          resolve(data);
      })
      .fail(error => {
        reject("Error getting project " + project_id + ": " + error);
      });
    });
  }

  promiseIsProjectOwnerOrAdmin(projectId) {
    let self = this;
    return new Promise(function(resolve, reject) {
      if (self.user) {
        self.promiseGetProjectRoles(projectId)
        .then(function(roles) {
          let matchedRoles = roles.filter(function(role) {
            return role.user_id == self.user.id 
                   && (role.role_id == self.OWNER_ROLE || role.role_type_id == self.ADMIN_ROLE);
          })
          resolve(matchedRoles.length > 0)
        })      
      } else {
        reject("Failed to get project roles because there is no current user")
      }

    })
  }


  promiseGetProjectRoles(project_id) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getProjectRoles(project_id)
      .done(response => {
          resolve(response.data);
      })
      .fail(error => {
        reject("Error getting project roles " + project_id + ": " + error);
      });
    });
  }

  



  promiseGetSampleInfo(project_id, sample_id, isPedigree) {
    let self = this;
    if (isPedigree) {
      return self.promiseGetPedigreeForSample(project_id, sample_id);
    } else {
      return self.promiseGetSample(project_id, sample_id, 'proband')
        .then((sample) => {
          return self.promiseGetSampleAttributes(project_id, sample)
        });
    }
  }

  promiseGetSample(project_id, sample_id, rel) {
    let self = this;

    return new Promise(function(resolve, reject) {
      // Get pedigree for sample
      self.getSample(project_id, sample_id)
      .done(data => {
        if (rel) {
          let sample = {};
          sample[rel] = data;
          resolve(sample);
        } else {
          resolve(data);
        }
      })
      .fail(error => {
        reject("Error getting sample " + sample_id + ": " + error);
      })
    })
  }

  promiseGetSampleAttributes(project_id, sample) {
    let self = this;

    return new Promise(function(resolve, reject) {
      self.getSampleAttributes(project_id, sample.id)
      .done(attributes => {
          const formattedSample = {
            ...sample,
            attributes,
          };

          resolve(formattedSample);
      })
      .fail(error => {
        reject("Error getting sample attributes" + sample_id + ": " + error);
      })
    })
  }

  promiseGetPedigreeForSample(project_id, sample_id) {
    let self = this;

    return new Promise(function(resolve, reject) {
      // Get pedigree for sample
      self.getPedigreeForSample(project_id, sample_id)
      .done(rawPedigree => {
        const rawPedigreeOrig = $.extend({}, rawPedigree);
        let pedigree = self.parsePedigree(rawPedigree, sample_id)
        if (pedigree) {
          resolve({pedigree: pedigree, rawPedigree: rawPedigreeOrig});
        } else {
          reject("Error parsing pedigree");
        }
      })
      .fail(error => {
        reject("Error getting pedigree for sample " + sample_id + ": " + error);
      })
    })
  }


  parsePedigree(raw_pedigree, sample_id) {
    let self = this;

    // This assumes only 1 proband. If there are multiple affected samples then
    // the proband will be overwritten
    // This also assume no grandparents/grandchildren

    let pedigree = {}

    // Look for proband, which should have mother and father filled in and is the sample selected
    let probandIndex = raw_pedigree.findIndex(d => ( d.id == sample_id && d.pedigree.maternal_id && d.pedigree.paternal_id ) );
    // If the sample selected doesn't have a mother and father (isn't a proband), find
    // the proband by looking for a child with mother and father filled in and affected status
    if (probandIndex == -1) {
      probandIndex = raw_pedigree.findIndex(d => ( d.pedigree.affection_status == 2 && (d.pedigree.maternal_id || d.pedigree.paternal_id )) );
    }
    // If the sample selected doesn't have a mother and father (isn't a proband), find
    // the proband by looking for a child with mother and father filled in and unknown affected status
    if (probandIndex == -1) {
      probandIndex = raw_pedigree.findIndex(d => ( d.pedigree.affection_status == 0 && (d.pedigree.maternal_id || d.pedigree.paternal_id ) ));
    }

    if (probandIndex == -1) {
      // Assume proband if there is only one sample in the pedigree
      if (raw_pedigree.length == 1) {
        probandIndex = 0;
      } else {
        // Assume proband is the sample selected
        probandIndex = raw_pedigree.findIndex(d => (d.id == sample_id));
      }
    }


    if (probandIndex != -1) {
      // Proband
      const proband  = raw_pedigree.splice(probandIndex, 1)[0];
      pedigree['proband'] = proband;

      // Get mother
      const motherIndex = raw_pedigree.findIndex(d => d.id == proband.pedigree.maternal_id)
      if (motherIndex != -1) {
        pedigree['mother'] = raw_pedigree.splice(motherIndex, 1)[0]
        this.isMother = true;
      }

      // Get mother
      const fatherIndex = raw_pedigree.findIndex(d => d.id == proband.pedigree.paternal_id)
      if (fatherIndex != -1) {
        pedigree['father'] = raw_pedigree.splice(fatherIndex, 1)[0]
        this.isFather = true;
      }

      raw_pedigree.forEach(sample => {
        if (sample.pedigree.maternal_id != null || sample.pedigree.paternal_id != null
            && sample.pedigree.id != pedigree.proband.id) {
          pedigree['siblings'] = (pedigree['siblings'] || [] )
          pedigree['siblings'].push(sample);
        } else {
          pedigree['unparsed'] = (pedigree['siblings'] || []).push(sample)
        }
      })

      return pedigree;


    } else {
      return null;
    }

  }

  getPedigreeForSample(project_id, sample_id) {
    let self = this;
    return $.ajax({
      url: self.api + '/projects/' + project_id +  '/samples/' + sample_id + '/pedigree',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': localStorage.getItem('hub-iobio-tkn')
      }
    });
  }

  getSample(project_id, sample_id) {
    let self = this;
    return $.ajax({
      url: self.api + '/projects/' + project_id + '/samples/' + sample_id,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': localStorage.getItem('hub-iobio-tkn')
      }
    });
  }

  getSampleAttributes(project_id, sample_id) {
    let self = this;
    return $.ajax({
      url: self.api + '/projects/' + project_id + '/samples/' + sample_id + '/attributes',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': localStorage.getItem('hub-iobio-tkn')
      }
    });
  }

  promiseGetFileMapForSample(project_id, sample, relationship) {
    let self = this;
    return new Promise((resolve,reject) => {
      var promises = [];
      var fileMap = {};
      var currentSample = sample;
      self.promiseGetFilesForSample(project_id, currentSample.id)
      .then(files => {
        files.filter(file => {
          if(self.experiment_id){
            return file.experiment_ids.includes(Number(self.experiment_id))
          }
          else {
            return file
          }
        }).filter(file => {
          return file.type
        })
        .forEach(file => {

          var p = self.promiseGetSignedUrlForFile(project_id, currentSample.id, file)
          .then(signed => {
            if (file.type == 'txt' || file.type == 'tsv') {
              var files = fileMap.txt;
              if (files == null) {
                files = [];
                fileMap.txt = files;
              }
              files.push({'url': signed.url, 'name': file.nickname});

            } else {
              fileMap[file.type] = signed.url
              if (file.type == 'vcf') {
                if (file.vcf_sample_name == null || file.vcf_sample_name == "") {
                  alertify.error("Missing vcf_sample_name for file " + file.name, 20)
                } else {
                  sample.vcf_sample_name = file.vcf_sample_name;
                }
              }
            }
          })
          promises.push(p);
        })
        Promise.all(promises)
        .then(response => {
          resolve({'sample': sample, 'relationship': relationship, 'fileMap': fileMap});
        })
        .catch(error => {
          reject(error);
        })
      })
    })
  }



  promiseGetFilesForSample(project_id, sample_id) {
    let self = this;
    return new Promise((resolve,reject) => {
      self.getFilesForSample(project_id, sample_id)
      .done(response => {
        resolve(response.data);
      })
      .fail(error => {
        console.log("Unable to get files for sample " + sample_id)
        reject(error);
      })
    })
  }


  getFilesForSample(project_id, sample_id) {
    let self = this;
    return $.ajax({
      url: self.api + '/projects/' + project_id +  '/samples/' + sample_id + '/files',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': localStorage.getItem('hub-iobio-tkn')
      }
    });
  }

  promiseGetFilesForProject(project_id) {
      let self = this;
      return new Promise((resolve,reject) => {
          self.getFilesForProject(project_id)
              .done(response => {
                  resolve(response);
              })
              .fail(error => {
                  console.log("Unable to get files for project " + project_id);
                  reject(error);
              })
      })
  }


  getFilesForProject(project_id) {
      let self = this;
      return $.ajax({
          url: self.api +  '/projects/' + project_id + '/files',
          type: 'GET',
          contentType: 'application/json',
          headers: {
              'Authorization': localStorage.getItem('hub-iobio-tkn')
          }
      });
  }

  promiseGetSignedUrlForFile(project_id, sample_id, file) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.getSignedUrlForFile(project_id, sample_id, file)
      .done(file => {
        resolve(file);
      })
      .fail(error => {
        reject(error);
      })
    })
  }

  getSignedUrlForFile (project_id, sample_id, file) {
    let self = this;
    return $.ajax({
      url: self.api +  '/projects/' + project_id + '/files/' + file.id + '/url',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': localStorage.getItem('hub-iobio-tkn')
      }
    });
  }

  getProject(projectId) {
    let self = this;
    return $.ajax({
        url: self.api + '/projects/' + projectId,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': localStorage.getItem('hub-iobio-tkn')
        }
    });
  }

  getProjectRoles(projectId) {
    let self = this;
    return $.ajax({
        url: self.api + '/projects/' + projectId + '/roles',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': localStorage.getItem('hub-iobio-tkn')
        }
    });
  }


  promiseUpdateProject(projectId, name, description) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.updateProject(projectId, name, description)
      .done(response => {
        resolve(response)
      })
      .fail(error => {
        reject("Error updating project " + projectId  + ": " + error);
      })
    })

  }
  promiseGetGeneSet(projectId, geneSetId) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getGeneSet(projectId, geneSetId)
      .done(response => {
        resolve(response)
      })
      .fail(error => {
        reject("Error getting gene set " + geneSetId + ": " + error);
      })
    })

  }
  
  promiseGetVariantSet(projectId, variantSetId, build) {
  let self = this;
  return new Promise(function(resolve, reject) {
    self.getVariantSet(projectId, variantSetId, build)
    .done(response => {
      resolve(response)
    })
    .fail(error => {
      self.getVariantSet(projectId, variantSetId, 'old_project')
      .done(response => {
        resolve(response)
      })
      .fail(error => {
        reject("Error getting variant set " + variantSetId + ": " + error);
      })
    })
  })

}

  promiseGetAnalysis(projectId, analysisId) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getAnalysis(projectId, analysisId)
      .done(response => {
        resolve(response)
      })
      .fail(error => {
        reject("Error getting analysis " + analysisId + ": " + error);
      })
    })
    
    // return new Promise((resolve, reject) => {
    //   const myHeaders = new Headers({
    //       'Content-Type': 'application/json',
    //       'Authorization': localStorage.getItem('hub-iobio-tkn')
    //   });
    // 
    //   fetch('https://mosaic.chpc.utah.edu/api/v1/projects/478/analyses/649', {
    //     method: 'GET',
    //     headers: myHeaders,
    //   }).then(resp => resp.json()).then(response => {
    //     console.log("response", response);
    //     resolve(response)
    //   })
    // })
    


  }
  promiseAddAnalysis(projectId, analysis) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.addAnalysis(projectId, analysis)
      .done(response => {
        resolve(response)
      })
      .fail(error => {
        reject("Error adding analysis for project " + projectId + ": " + error);
      })
    })

  }

  promiseUpdateAnalysis(analysis) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.updateAnalysis(analysis.project_id, analysis.id, analysis)
      .done(response => {
        resolve(response)
      })
      .fail(error => {
        reject("Error updating analysis " + analysis.id  + ": " + error);
      })
    })

  }

  promiseUpdateAnalysisTitle(analysis) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.updateAnalysisTitle(analysis.project_id, analysis.id, analysis)
      .done(response => {
        resolve(response)
      })
      .fail(error => {
        reject("Error updating analysis title " + analysis.id + ": " + error);
      })
    })

  }

  getAnalysis(projectId, analysisId) {
    let self = this;
    var u = self.api + '/projects/' + projectId  + '/analyses/' + analysisId
    return $.ajax({
      url: self.api + '/projects/' + projectId  + '/analyses/' + analysisId,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    })
    
    // const myHeaders = new Headers({
    //     'Content-Type': 'application/json',
    //     'Authorization': localStorage.getItem('hub-iobio-tkn')
    // });
    // 
    // return fetch('https://mosaic.chpc.utah.edu/api/v1/projects/478/analyses/649', {
    //   method: 'GET',
    //   headers: myHeaders,
    // }).then(resp => resp.json()).then(response => {
    //   console.log(response);
    // })

  }




  addAnalysis(projectId, newAnalysisData) {
    let self = this;

    return $.ajax({
      url: self.api + '/projects/' + projectId + '/analyses/?client_application_id=' + this.client_application_id,
      type: 'POST',
      data: self.stringifyAnalysis(newAnalysisData),
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });
  }

  updateAnalysisTitle(projectId, analysisId, newAnalysisData) {
    let self = this;

    return $.ajax({
      url: self.api + '/projects/' + projectId + '/analyses/' + analysisId,
      type: 'PUT',
      data: self.stringifyAnalysis(newAnalysisData),
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });
  }


  updateAnalysis(projectId, analysisId, newAnalysisData) {
    let self = this;
    self.updateAnalysisTitle(projectId, analysisId, newAnalysisData)
      .then(response => {
      })

    return $.ajax({
      url: self.api + '/projects/' + projectId + '/analyses/' + analysisId
            + '?client_application_id=' + this.client_application_id,
      type: 'PUT',
      data: self.stringifyAnalysis(newAnalysisData),
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });
  }

  updateProject(projectId, projectName, projectDescription) {
    let self = this;

    return $.ajax({
      url: self.api + '/projects/' + projectId  + '?client_application_id=' + this.client_application_id,
      type: 'PUT',
      data: JSON.stringify({'name': projectName, 'description': projectDescription}),
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });
  }

  promiseGetCurrentUser() {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getCurrentUser()
        .done(response => {
          resolve(response)
        })
        .fail(error => {
          reject("Error getting currentUser :" + error);
        })
    })
  }

  getCurrentUser() {
    let self = this;

    return $.ajax({
      url: self.api + '/user',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });

  }

  getGeneSet(projectId, geneSetId) {
    let self = this;

    return $.ajax({
      url: self.api + '/projects/' + projectId + '/genes/sets/' + geneSetId,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });
  }
  
  getVariantSet(projectId, variantSetId, build) {
    let self = this;
    let annotationUids = [];
    if(build === "GRCh38"){
      annotationUids.push('gene_symbol_GRCh38');
    }
    else if(build === "GRCh37"){
      annotationUids.push('gene_symbol_GRCh37');
    }
    else {
      annotationUids.push('gene_symbol');
    }
    return $.ajax({
      // url: 'https://mosaic.chpc.utah.edu/api/v1/projects/' + projectId + '/variants/sets/' + variantSetId + "?include_variant_data=true&include_genotype_data=true",
      url: self.api + '/projects/' + projectId + '/variants/sets/' + variantSetId + "?include_variant_data=true&include_genotype_data=true",
      data: {
        //annotation_uids: annotationUids,
      },
      type: 'GET',
      contentType: 'application/json',
      headers: {
        Authorization: localStorage.getItem('hub-iobio-tkn'),
      },
    });
  }

  stringifyAnalysis(analysisData) {
    var cache = [];
    let analysisString = JSON.stringify(analysisData, function(key, value) {
      if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
          }
          // Store value in our collection
          cache.push(value);
      }
      return value;
    });
    cache = [];
    return analysisString;
  }



}

