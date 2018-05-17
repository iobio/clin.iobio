
export default class HubSession {
  constructor() {
    this.vcf = null;
    this.samples = null;
    this.url = null;
    this.apiVersion =  '/apiv1';
  }

  init() {
    let self = this;
    let queryParams = Qs.parse(window.location.hash.substr(1));
    let { access_token, filter, sample_uuid, token_type, source } = queryParams;
    localStorage.setItem('hub-iobio-tkn', token_type + ' ' + access_token);
    this.api = source + apiVersion;

    // Get pedigree for sample
    self.getPedigreeForSample(sample_uuid).done(data => {
      let pedigree = self.parsePedigree(data);

      var promises = [];
      for (var rel in pedigree) {
        let samples = [];
        if (Array.isArray(pedigree[rel])) {
          samples = pedigree[rel];
        } else {
          samples = [pedigree[rel]];
        }
        samples.forEach(s => {
          p =  self.promiseGetFileMapForSample(s).then(fileMap => {
            s.files = fileMap;
          })
          promises.push(p);
        })

      }

      Promise.all(promises).then(response => {
        console.log(pedigree);
      })
    })
  }

  parsePedigree(raw_pedigree) {
    // This assumes only 1 proband. If there are multiple affected samples then
    // the proband will be overwritten
    // This also assume no grandparents/grandchildren

    let pedigree = {}

    const probandIndex = raw_pedigree.findIndex(d => d.pedigree.affection_status == 1 || d.pedigree.affection_status == 2);
    if (probandIndex != -1) {
      const proband  = raw_pedigree.splice(probandIndex, 1)[0];

      // Get mother
      const motherIndex = raw_pedigree.findIndex(d => d.uuid == proband.pedigree.maternal_id)
      pedigree['mother'] = raw_pedigree.splice(motherIndex, 1)[0]

      // Get mother
      const fatherIndex = raw_pedigree.findIndex(d => d.uuid == proband.pedigree.paternal_id)
      pedigree['father'] = raw_pedigree.splice(fatherIndex, 1)[0]

      // Proband
      pedigree['proband'] = proband;
    }


    raw_pedigree.forEach(sample => {
      if (sample.pedigree.maternal_id != null || sample.pedigree.paternal_id != null) {
        pedigree['siblings'] = (pedigree['siblings'] || [])
        pedigree['siblings'].push(sample);
      } else {
        pedigree['unparsed'] = (pedigree['siblings'] || []).push(sample)
      }
    })

    return pedigree;
  }

  getPedigreeForSample(sample_uuid) {
    return $.ajax({
      url: api + '/samples/' + sample_uuid + '/pedigree',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': localStorage.getItem('hub-iobio-tkn')
      }
    });
  }


  promiseGetFileMapForSample(sample) {
    let self = this;
    return new Promise((resolve,reject) => {
      var promises = [];
      var fileMap = {};
      var currentSample = sample;
      self.promiseGetFilesForSample(currentSample.uuid)
      .then(files => {
        files.forEach(file => {
          var p = self.promiseGetSignedUrlForFile(file)
          .then(signed => {
            fileMap[file.type] = signed.url;
          })
          promises.push(p);
        })
        Promise.all(promises)
        .then(response => {
          resolve(fileMap);
        })
        .catch(error => {
          reject(error);
        })
      })
    })
  }



  promiseGetFilesForSample(sample_uuid) {
    let self = this;
    return new Promise((resolve,reject) => {
      self.getFilesForSample(sample_uuid)
      .done(response => {
        resolve(response.data);
      })
      .fail(error => {
        console.log("Unable to get files for sample " + sample_uuid)
        reject(error);
      })
    })
  }


  getFilesForSample(sample_uuid) {
    let self = this;
    return $.ajax({
      url: api + '/samples/' + sample_uuid + '/files',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': localStorage.getItem('hub-iobio-tkn')
      }
    });
  }

  promiseGetSignedUrlForFile(file) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.getSignedUrlForFile(file)
      .done(file => {
        resolve(file);
      })
      .fail(error => {
        reject(error);
      })
    })
  }

  getSignedUrlForFile (file) {
    let self = this;
    return $.ajax({
      url: api + '/files/' + file.uuid + '/url',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': localStorage.getItem('hub-iobio-tkn')
      }
    });
  }


}