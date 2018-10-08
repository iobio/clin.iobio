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

    this.cognitoUser              = null;
    this.userAttributes           = null;
  }

  authenticate(userName, password, callback, callbackNewPassword) {
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
    this.cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    var authenticationData = {
      Username : userName,
      Password : password
    };
    var authDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
    this.cognitoUser.authenticateUser(authDetails,
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
        self.dynamodb = new AWS.DynamoDB.DocumentClient({convertEmptyValues: true});
        AWS.config.credentials.get(function(err) {
          callback(true);
        });
      },

      onFailure: function(err) {
        console.log(err);
        callback(false);
      },

      newPasswordRequired: function(userAttributes, requiredAttributes) {
        if (callbackNewPassword) {
          self.userAttributes = userAttributes;
          delete self.userAttributes.email_verified;
          delete self.userAttributes.phone_number_verified;
          callbackNewPassword();
        } else {
          console.log("Authentication failed, new password required")
          callback(false);
        }
      }
    });
  }

  authenticateNewPassword(newPassword, callback) {
    let self = this;
    this.cognitoUser.completeNewPasswordChallenge(newPassword, this.userAttributes,
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
          AWS.config.credentials.get(function(err) {
            callback(true);
          });
        },

        onFailure: function(err) {
          console.log(err);
          callback(false);
        }
      });
  }

}