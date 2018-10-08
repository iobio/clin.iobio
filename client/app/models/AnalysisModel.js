export default class AnalysisModel {
  constructor(userSession) {
    this.userSession = userSession;
    this.analysisTable = "clin.iobio.analysis";
    this.variantTable  = {
      'gene':     "clin.iobio.variant.gene",
      'genefull': "clin.iobio.variant.gene.full" }
    this.analysisCacheTable  = {
      'gene':     "clin.iobio.cache.gene",
      'genefull': "clin.iobio.cache.gene.full" }
    this.variantDataTable  = {
      'gene':     null,
      'genefull': "clin.iobio.variant.data.gene.full" }
    this.workflowTable = "clin.iobio.workflow";
    this.modelInfoTable = "clin.iobio.model.info";

    this.DELIM = "^";
  }

  promiseGetModelInfo(id) {
    let self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        TableName: self.modelInfoTable,
        Key:{
            "id": id
        }
      };

      self.userSession.dynamodb.get(params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          if (data && data.Item) {
            resolve(data.Item);
          } else {
            resolve(null);
          }
        }
      });
    })

  }

  promiseGetWorkflow(idWorkflow) {
    let self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        TableName: self.workflowTable,
        Key:{
            "id": idWorkflow
        }
      };

      self.userSession.dynamodb.get(params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          if (data && data.Item) {
            resolve(data.Item);
          } else {
            resolve(null);
          }
        }
      });
    })

  }

  promiseGetAnalysis(idAnalysis) {
    let self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        TableName: self.analysisTable,
        Key:{
            "id": idAnalysis
        }
      };

      self.userSession.dynamodb.get(params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          if (data && data.Item) {
            resolve(data.Item);
          } else {
            resolve(null);
          }
        }
      });
    })

  }

  promiseGetVariantData(app, id) {
    let self = this;


    return new Promise(function(resolve, reject) {
      if (self.variantDataTable[app]) {
        var params = {
          TableName: self.variantDataTable[app],
          Key:{
              "id": id
          }
        };

        self.userSession.dynamodb.get(params, function(err, data) {
          if (err) {
            reject(err);
          } else {
            if (data && data.Item) {
              resolve(data.Item);
            } else {
              resolve(null);
            }
          }
        });
      } else {
        reject("No variant data table exists for app " + app);
      }
    })

  }

  parseVariantData(variantData) {
    if (variantData != null && variantData.length > 0) {
      let buf = "";
      variantData.forEach(function(rec) {
        if (buf.length > 0) {
          buf += "\n";
        }
        buf += rec.split(",").join("\t");
      });
      return buf;

    } else {
      return null;
    }
  }

  promiseGetAnalysesForSample(idWorkflow, idProject, idSample ) {
    let self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        TableName: self.analysisTable,
        FilterExpression: "#project_id = :project_id and #sample_id = :sample_id and #workflow_id = :workflow_id",
        ExpressionAttributeNames: {
            "#project_id":  "project_id",
            "#sample_id":   "sample_id",
            "#workflow_id": "workflow_id",
        },
        ExpressionAttributeValues: {
            ":workflow_id": idWorkflow,
            ":sample_id":   idSample,
            ":project_id":  idProject
        }
      };

      self.userSession.dynamodb.scan(params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          if (data && data.Items) {
            resolve(data.Items);
          } else {
            resolve(null);
          }
        }
      });
    })

  }

  promiseAddAnalysis(analysis) {
    let self = this;
    return new Promise(function(resolve, reject) {
      var params = {
          TableName: self.analysisTable,
          Item: analysis
      };
      self.userSession.dynamodb.put(params, function (err, analysis) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    })
  }

  promiseUpdateGenesData(analysis) {
    let self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        TableName: self.analysisTable,
        Key:{
            "id": analysis.id
        },
        UpdateExpression: "set genesReport = :genesReport, genesGtr = :genesGtr, genesPhenolyzer = :genesPhenolyzer, genesManual = :genesManual, genes = :genes, phenotypes = :phenotypes, datetime_last_modified = :datetime_last_modified",
        ExpressionAttributeValues:{
            ":genes": analysis.genes,
            ":phenotypes": analysis.phenotypes,
            ":genesReport": analysis.genesReport,
            ":genesGtr": analysis.genesGtr,
            ":genesPhenolyzer": analysis.genesPhenolyzer,
            ":genesManual": analysis.genesManual,
            ":datetime_last_modified": analysis.datetime_last_modified
        },
        ReturnValues:"UPDATED_NEW"
      };
      self.userSession.dynamodb.update(params, function(err, data) {
        if (err) {
          console.log(err, err.stack); // an error occurred
          reject(err);
        }
        else  {
          resolve();
        }
      });
    })
  }


  promiseUpdateGenes(analysis) {
    let self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        TableName: self.analysisTable,
        Key:{
            "id": analysis.id
        },
        UpdateExpression: "set genes = :genes, datetime_last_modified = :datetime_last_modified",
        ExpressionAttributeValues:{
            ":genes": analysis.genes,
             ":datetime_last_modified": analysis.datetime_last_modified
        },
        ReturnValues:"UPDATED_NEW"
      };
      self.userSession.dynamodb.update(params, function(err, data) {
        if (err) {
          console.log(err, err.stack); // an error occurred
          reject(err);
        }
        else  {
          resolve();
        }
      });
    })
  }

  promiseUpdatePhenotypes(analysis) {
    let self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        TableName: self.analysisTable,
        Key:{
            "id": analysis.id
        },
        UpdateExpression: "set phenotypes = :phenotypes, datetime_last_modified = :datetime_last_modified",
        ExpressionAttributeValues:{
            ":phenotypes": analysis.phenotypes,
             ":datetime_last_modified": analysis.datetime_last_modified
        },
        ReturnValues:"UPDATED_NEW"
      };
      self.userSession.dynamodb.update(params, function(err, data) {
        if (err) {
          console.log(err, err.stack); // an error occurred
          reject(err);
        }
        else  {
          resolve();
        }
      });
    })
  }


  promiseGetVariants(app, idAnalysis) {
    let self = this;

    return new Promise(function(resolve, reject) {

      let lastEvaluatedKey = null;
      let variants = [];

      var params = {
        TableName: self.variantTable[app],
        FilterExpression: "#analysis_id = :analysis_id",
        ExpressionAttributeNames: {
            "#analysis_id": "analysis_id"
        },
        ExpressionAttributeValues: {
            ":analysis_id": idAnalysis
        }
      };
      if (lastEvaluatedKey) {
        params.ExclusiveStartKey = lastEvaluatedKey;
      }

      let onScan = function(err, data) {
        if (err) {
          reject(err);
        } else {
          if (data) {
            lastEvaluatedKey = data.LastEvaluatedKey;
            if (data.Items) {
              variants = variants.concat(data.Items);
            }
            if (lastEvaluatedKey == null) {
              resolve(variants);
            } else {
              params.ExclusiveStartKey = lastEvaluatedKey;
              doScan();
            }
          }
        }
      }

      let doScan = function() {
        self.userSession.dynamodb.scan(params, onScan);
      }

      doScan();

    })

  }

  replaceMatchingVariants(refreshedVariants, existingVariants) {
    let self = this;
    if (refreshedVariants && existingVariants) {
      refreshedVariants.forEach(function(refreshedVariant) {
        let matchingIdx = self.findMatchingVariantIndex(refreshedVariant, existingVariants);
        if (matchingIdx != -1) {
          existingVariants[matchingIdx] = refreshedVariant;
        } else {
          existingVariants.push(refreshedVariant);
        }
      })
    }
  }

  getObsoleteVariants(refreshedVariants, existingVariants) {
    let self = this;
    let unmatchedVariants = [];
    if (refreshedVariants && existingVariants) {
      existingVariants.forEach(function(existingVariant) {
        let matchingIdx = self.findMatchingVariantIndex(existingVariant, refreshedVariants);
        if (matchingIdx == -1) {
          unmatchedVariants.push(existingVariant);
        }
      })
    }
    return unmatchedVariants;
  }

  findMatchingVariantIndex(variant, existingVariants) {
    let matchingIdx = -1;
    let idx = 0;
    if (existingVariants) {
      existingVariants.forEach(function(v) {
        if (matchingIdx == -1
            && v.gene == variant.gene
            && v.start == variant.start
            && v.ref == variant.ref
            && v.alt == variant.alt ) {
          matchingIdx = idx;
        }
        idx++;
      })
    }
    return matchingIdx;
  }

  promiseUpdateVariants(app, idAnalysis, variants, variantsToDelete) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let promises = [];


      variants.forEach(function(variant) {
        variant.analysis_id = idAnalysis;
        variant.variant_id  = variant.gene + self.DELIM + variant.start + self.DELIM + variant.ref + self.DELIM + variant.alt;
        var p = self._promisePutVariant(app, variant);
        promises.push(p);
      })

      if (variantsToDelete && variantsToDelete.length > 0) {
        var p = self.promiseDeleteVariants(app, idAnalysis, variantsToDelete);
        promises.push(p);
      }

      Promise.all(promises)
      .then(function() {
        resolve();
      })
      .catch(function(error) {
        let msg = "Unable to add variant for " + app + " analysis: " + error;
        console.log(msg);
        reject(msg);
      })
    })

  }


  _promisePutVariant(app, variant) {
    let self = this;
    return new Promise(function(resolve, reject) {
      var params = {
          TableName: self.variantTable[app],
          Item: variant,
          Key:{
            "variant_id": variant.variant_id,
            "analysis_id": variant.analysis_id
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 6,
            WriteCapacityUnits: 400
          },
      };
      self.userSession.dynamodb.put(params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    })
  }

  promiseDeleteVariants(app, idAnalysis, variants) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let promises = [];


      variants.forEach(function(variant) {
        let idVariant  = variant.gene + self.DELIM + variant.start + self.DELIM + variant.ref + self.DELIM + variant.alt;
        var p = self._promiseDeleteVariant(app, idVariant, idAnalysis);
        promises.push(p);
      })

      Promise.all(promises)
      .then(function() {
        resolve();
      })
      .catch(function(error) {
        let msg = "Unable to delete variant for " + app + " analysis: " + error;
        console.log(msg);
        reject(msg);
      })
    })

  }


  _promiseDeleteVariant(app, idVariant, idAnalysis) {
    let self = this;
    return new Promise(function(resolve, reject) {
      var params = {
        TableName: self.variantTable[app],
        Key:{
            "variant_id": idVariant,
            "analysis_id": idAnalysis
        }
      };

      self.userSession.dynamodb.delete(params, function(err, data) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve();
        }
      });

    });
  }


  promiseUpdateFilters(analysis) {
    let self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        TableName: self.analysisTable,
        Key:{
            "id": analysis.id
        },
        UpdateExpression: "set filters = :filters, datetime_last_modified = :datetime_last_modified",
        ExpressionAttributeValues:{
            ":filters": analysis.filters,
            ":datetime_last_modified": analysis.datetime_last_modified
        },
        ReturnValues:"UPDATED_NEW"
      };
      self.userSession.dynamodb.update(params, function(err, data) {
        if (err) {
          console.log(err, err.stack); // an error occurred
          reject(err);
        }
        else  {
          resolve();
        }
      });
    })
  }

  promiseUpdateSteps(analysis) {
    let self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        TableName: self.analysisTable,
        Key:{
            "id": analysis.id
        },
        UpdateExpression: "set steps = :steps, datetime_last_modified = :datetime_last_modified",
        ExpressionAttributeValues:{
            ":steps": analysis.steps,
            ":datetime_last_modified": analysis.datetime_last_modified
        },
        ReturnValues:"UPDATED_NEW"
      };
      self.userSession.dynamodb.update(params, function(err, data) {
        if (err) {
          console.log(err, err.stack); // an error occurred
          reject(err);
        }
        else  {
          resolve();
        }
      });
    })
  }



  promiseGetCache(app, idAnalysis) {
    let self = this;

    return new Promise(function(resolve, reject) {

      let lastEvaluatedKey = null;
      let cacheItems = [];

      var params = {
        TableName: self.analysisCacheTable[app],
        FilterExpression: "#analysis_id = :analysis_id",
        ExpressionAttributeNames: {
            "#analysis_id": "analysis_id"
        },
        ExpressionAttributeValues: {
            ":analysis_id": idAnalysis
        }
      };
      if (lastEvaluatedKey) {
        params.ExclusiveStartKey = lastEvaluatedKey;
      }

      let onScan = function(err, data) {
        if (err) {
          reject(err);
        } else {
          if (data) {
            lastEvaluatedKey = data.LastEvaluatedKey;
            if (data.Items) {
              cacheItems = cacheItems.concat(data.Items);
            }
            if (lastEvaluatedKey == null) {
              resolve(cacheItems);
            } else {
              params.ExclusiveStartKey = lastEvaluatedKey;
              doScan();
            }
          }
        }
      }

      let doScan = function() {
        self.userSession.dynamodb.scan(params, onScan);
      }

      doScan();

    })

  }

  promiseUpdateCache(app, idAnalysis, cacheItems) {
    let self = this;
   return new Promise(function(resolve, reject) {
      let promises = [];


      cacheItems.forEach(function(cacheItem) {
        cacheItem.analysis_id = idAnalysis;
        var p = self._promisePutCacheItem(app, cacheItem);
        promises.push(p);
      })

      Promise.all(promises)
      .then(function() {
        resolve();
      })
      .catch(function(error) {
        reject("Unable to add cache for analysis " + error);
      })
    })

  }


  _promisePutCacheItem(app, cacheItem) {
    let self = this;
    return new Promise(function(resolve, reject) {
      var params = {
          TableName: self.analysisCacheTable[app],
          Item: cacheItem,
          ProvisionedThroughput: {
            ReadCapacityUnits: 6,
            WriteCapacityUnits: 4000
          },
      };
      self.userSession.dynamodb.put(params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    })
  }

  promiseDeleteCache(app, idAnalysis, cacheKeys) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let promises = [];

      cacheKeys.forEach(function(cacheKey) {
        var p = self._promiseDeleteCacheItem(app, idAnalysis, cacheKey);
        promises.push(p);
      })

      Promise.all(promises)
      .then(function() {
        resolve();
      })
      .catch(function(error) {
        reject("Unable to delete cache for analysis " + error);
      })
    })

  }

  _promiseDeleteCacheItem(app, idAnalysis, cacheKey) {
    let self = this;
    return new Promise(function(resolve, reject) {
      var params = {
        TableName: self.analysisCacheTable[app],
        Key:{
            "cache_key": cacheKey,
            "analysis_id": idAnalysis
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 6,
          WriteCapacityUnits: 8000
        }
      };

      self.userSession.dynamodb.delete(params, function(err, data) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve();
        }
      });

    });
  }

}