//import {Config, CognitoIdentityCredentials} from 'aws-sdk'
//import {CognitoToIdentity, CognitoUserPool, CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js'

export default class AWSSession {
  constructor() {
    this.region = "us-east-1";
    this.cognitoPoolId = "us-east-1:1a31765e-26e2-4d81-beac-83158ab212d6";

    this.userPoolId = "us-east-1_UCmMb0nkm";
    this.userPoolClientId = "3e79cbi05861c3138ola9v5sch";

    this.cognitoIdentityLoginName =
      "cognito-idp.us-east-1.amazonaws.com/" + this.userPoolId;
    this.cognitoIdentityRoleArn =
      "arn:aws:iam::806953317734:role/Cognito_cliniobiopoolAuth_Role";

    this.dynamodb = null;

    this.cognitoUser = null;
    this.userAttributes = null;
    this.workflowTable = "clin.iobio.workflow";
  }

  canAuthenticatePrevSession() {
    let self = this;
    let block1 = localStorage.getItem("clin.iobio.block1");
    let block2 = localStorage.getItem("clin.iobio.block2");
    return block1 && block2;
  }

  authenticatePrevSession(callback) {
    let self = this;
    let block1 = localStorage.getItem("clin.iobio.block1");
    let block2 = localStorage.getItem("clin.iobio.block2");
    return self.authenticate(block1, block2, function(success) {
      if (callback) {
        callback(success, block1);
      }
    });
  }

  setSession(block1, block2) {
    localStorage.setItem("clin.iobio.block1", block1);
    localStorage.setItem("clin.iobio.block2", block2);
  }

  clearPrevSession() {
    let self = this;
    localStorage.removeItem("clin.iobio.block1");
    localStorage.removeItem("clin.iobio.block2");
  }

  authenticateMosaic(userName, password, callback, callbackNewPassword) {
    let self = this;
    self.authenticate(userName, password, callback, callbackNewPassword);
  }

  authenticate(
    userName,
    password,
    callback,
    callbackNewPassword,
    callbackResetPassword
  ) {
    let self = this;

    AWSCognito.config.region = self.region;
    var poolData = {
      UserPoolId: self.userPoolId,
      ClientId: self.userPoolClientId
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
      Username: userName,
      Pool: userPool
    };
    this.cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(
      userData
    );

    var authenticationData = {
      Username: userName,
      Password: password
    };
    var authDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(
      authenticationData
    );
    this.cognitoUser.authenticateUser(authDetails, {
      onSuccess: function(result) {
        var cognitoidentity = new AWS.CognitoIdentity();
        AWS.config.region = self.region;

        var logins = {};
        logins[
          self.cognitoIdentityLoginName
        ] = result.getIdToken().getJwtToken();

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: self.cognitoPoolId,
          RoleArn: self.cognitoIdentityRoleArn,
          Logins: logins
        });

        AWS.config.update({
          region: self.region
        });
        self.dynamodb = new AWS.DynamoDB.DocumentClient({
          convertEmptyValues: true
        });
        AWS.config.credentials.get(function(err) {
          if (err) {
            console.log(err);
            self.clearPrevSession();
            if (callback) {
              callback(false);
            }
          } else if (callback) {
            self.setSession(userName, password);
            callback(true);
          }
        });
      },

      onFailure: function(err) {
        if (err.code == "PasswordResetRequiredException") {
          if (callbackResetPassword) {
            callbackResetPassword();
          } else {
            console.log(err);
            callback(false, err);
          }
        } else {
          console.log(err);
          callback(false, err);
        }
      },

      newPasswordRequired: function(userAttributes, requiredAttributes) {
        if (callbackNewPassword) {
          self.userAttributes = userAttributes;
          delete self.userAttributes.email_verified;
          delete self.userAttributes.phone_number_verified;
          callbackNewPassword();
        } else {
          console.log("Authentication failed, new password required");
          callback(false);
        }
      }
    });
  }

  authenticateNewPassword(newPassword, callback) {
    let self = this;
    this.cognitoUser.completeNewPasswordChallenge(
      newPassword,
      this.userAttributes,
      {
        onSuccess: function(result) {
          var cognitoidentity = new AWS.CognitoIdentity();
          AWS.config.region = self.region;

          var logins = {};
          logins[
            self.cognitoIdentityLoginName
          ] = result.getIdToken().getJwtToken();

          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: self.cognitoPoolId,
            RoleArn: self.cognitoIdentityRoleArn,
            Logins: logins
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
      }
    );
  }

  authenticateResetPassword(verificationCode, newPassword, callback) {
    let self = this;

    self.cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess() {
        callback(true);
      },
      onFailure(err) {}
    });
  }
}
