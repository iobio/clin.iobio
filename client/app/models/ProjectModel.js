export default class ProjectModel {
  constructor(userSession) {
    this.userSession = userSession;
    this.table = "clin.iobio.dev";
  }

  promiseGetProject(idProject) {
    let self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        TableName: self.table,
        Key:{
            "idProject": idProject
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

  promiseAddProject(project) {
    let self = this;
    return new Promise(function(resolve, reject) {
      var params = {
          TableName: self.table,
          Item: project
      };
      self.userSession.dynamodb.put(params, function (err, project) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    })
  }

  promiseUpdateGenes(project) {
    let self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        TableName: self.table,
        Key:{
            "idProject": project.idProject
        },
        UpdateExpression: "set genes = :genes",
        ExpressionAttributeValues:{
            ":genes": project.genes
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

  promiseUpdatePhenotypes(project) {
    let self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        TableName: self.table,
        Key:{
            "idProject": project.idProject
        },
        UpdateExpression: "set phenotypes = :phenotypes",
        ExpressionAttributeValues:{
            ":phenotypes": project.phenotypes
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

  promiseUpdateVariants(project) {
    let self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        TableName: self.table,
        Key:{
            "idProject": project.idProject
        },
        UpdateExpression: "set variants = :variants",
        ExpressionAttributeValues:{
            ":variants": project.variants
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

  promiseUpdateFilters(project) {
    let self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        TableName: self.table,
        Key:{
            "idProject": project.idProject
        },
        UpdateExpression: "set filters = :filters",
        ExpressionAttributeValues:{
            ":filters": project.filters
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

  promiseUpdateWorkflow(project) {
    let self = this;

    return new Promise(function(resolve, reject) {
      var params = {
        TableName: self.table,
        Key:{
            "idProject": project.idProject
        },
        UpdateExpression: "set workflow = :workflow",
        ExpressionAttributeValues:{
            ":workflow": project.workflow
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
}