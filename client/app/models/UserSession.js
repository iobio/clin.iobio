//import {Config, CognitoIdentityCredentials} from 'aws-sdk'
//import {CognitoToIdentity, CognitoUserPool, CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js'

export default class UserSession {
  constructor() {
    this.region                   = 'us-east-1';
    this.cognitoPoolId            = 'us-east-1:1a31765e-26e2-4d81-beac-83158ab212d6'

    this.userPoolId               = 'us-east-1_UCmMb0nkm'
    this.userPoolClientId         = '3e79cbi05861c3138ola9v5sch';

    this.cognitoIdentityLoginName = 'cognito-idp.us-east-1.amazonaws.com/' + this.userPoolId;
    this.cognitoIdentityRoleArn   = 'arn:aws:iam::806953317734:role/Cognito_cliniobiopoolAuth_Role';

    this.dynamodb                 = null;
  }

  authenticate(userName, password, callback) {
    let self = this;
    AWSCognito.config.region = self.region;
    var poolData = {
      UserPoolId : self.userPoolId,
      ClientId :   self.userPoolClientId
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username : userName,
        Pool : userPool
    };
    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    var authenticationData = {
      Username : userName,
      Password : password
    };
    var authDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
    cognitoUser.authenticateUser(authDetails,
    {
      onSuccess: function (result) {
        var cognitoidentity = new AWS.CognitoIdentity();
        AWS.config.region = self.region;

        var logins = {};
        logins[self.cognitoIdentityLoginName] = result.getIdToken().getJwtToken();

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: self.cognitoPoolId,
            RoleArn:        self.cognitoIdentityRoleArn,
            Logins:         logins
        });

        AWS.config.update({
          region: self.region
        });
        self.dynamodb = new AWS.DynamoDB.DocumentClient();
        callback(true);
      },

      onFailure: function(err) {
        console.log(err);
        callback(false);
      },

      newPasswordRequired: function(userAttributes, requiredAttributes) {
        console.log(err);
        callback(false);
      }
    });
  }
}