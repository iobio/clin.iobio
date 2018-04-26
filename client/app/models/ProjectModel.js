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
            reject("Cannot find project " + idProject);
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
}