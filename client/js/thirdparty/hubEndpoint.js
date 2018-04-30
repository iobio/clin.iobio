function HubEndpoint(source) {
  //this.api = decodeURIComponent(source) + '/apiv1';
  this.api = decodeURIComponent(source) + '';
}

HubEndpoint.prototype.getFilesForProject = function(project_uuid) {
  let self = this;
  var key = localStorage.getItem('hub-iobio-tkn');


  var call =  $.ajax({
    url: self.api + '/projects/' + project_uuid + '/files',
    type: 'GET',
    crossDomain: true,
    async: true,
    contentType: 'application/json',
    xhrFields: {
        withCredentials: true
    },
    headers: {
      'Authorization': key,
    }
  });
  return call;
}


HubEndpoint.prototype.getProject = function(project_uuid) {
  let self = this;
  return $.ajax({
    url: self.api + '/projects/' + project_uuid,
    type: 'GET',
    contentType: 'application/json',
    headers: {
      'Authorization': localStorage.getItem('hub-iobio-tkn')
    }
  });
}

HubEndpoint.prototype.getSamplesForProject = function(project_uuid, sampleFilters) {
  let self = this;
  let queryParams = { include: 'files' };
  var params = "";
  if (sampleFilters) {
    queryParams.filter = sampleFilters;
    params = Qs.stringify(queryParams, { addQueryPrefix: true, arrayFormat: 'brackets' });
  }

  let urlParam = self.api + '/projects/' + project_uuid + '/samples' + params;
  let authToken = localStorage.getItem('hub-iobio-tkn');

  return $.ajax({
    url: urlParam,
    type: 'GET',
    crossDomain: true,
    async: true,
    contentType: 'application/json',
    xhrFields: {
        withCredentials: true
    },
    headers: {
      'Authorization': authToken
    }
  }).then(function(response) {
    return response.data;
  });
}


HubEndpoint.prototype.getSignedUrlForFile = function(file) {
  let self = this;
  return $.ajax({
    url: self.api + '/files/' + file.uuid + '/url',
    type: 'GET',
    crossDomain: true,
    async: true,
    contentType: 'application/json',
    xhrFields: {
        withCredentials: true
    },
    headers: {
      'Authorization': localStorage.getItem('hub-iobio-tkn')
    }
  });
}
