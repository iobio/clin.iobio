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
    this.workflowTable = "clin.iobio.workflow";

    this.DELIM = "^";
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

  parseFullAnalysisTSV(analysis) {
    if (analysis.full_analysis_records != null && analysis.full_analysis_records.length > 0) {
      if (analysis.variants_full_analysis == null || analysis.variants_full_analysis.length == 0) {
        let buf = "";
        analysis.full_analysis_records.forEach(function(rec) {
          if (buf.length > 0) {
            buf += "\n";
          }
          buf += rec.split(",").join("\t");
        });
        return buf;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  promiseGetAnalysesForSample(idWorkflow, idSample ) {
    let self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        TableName: self.analysisTable,
        FilterExpression: "#sample_id = :sample_id and #workflow_id = :workflow_id",
        ExpressionAttributeNames: {
            "#sample_id":   "sample_id",
            "#workflow_id": "workflow_id",
        },
        ExpressionAttributeValues: {
            ":workflow_id": idWorkflow,
            ":sample_id":   idSample
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

  promiseUpdateVariants(app, idAnalysis, variants) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let promises = [];


      variants.forEach(function(variant) {
        variant.analysis_id = idAnalysis;
        variant.variant_id  = variant.gene + self.DELIM + variant.start + self.DELIM + variant.ref + self.DELIM + variant.alt;
        var p = self._promisePutVariant(app, variant);
        promises.push(p);
      })

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
        TableName: self.analysisCacheTable[app],
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
            WriteCapacityUnits: 1000
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

  _promiseDeleteCache(app, cacheKeys) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let promises = [];

      cacheKeys.forEach(function(cacheKey) {
        var p = self._promiseDeleteCacheItem(app, cacheKey);
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

  _promiseDeleteCacheItem(app, cacheKey) {
    let self = this;
    return new Promise(function(resolve, reject) {
      var params = {
        TableName: self.analysisCacheTable[app],
        Key:{
            "cache_key": cacheKey
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