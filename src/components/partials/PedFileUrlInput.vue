<template>
  <div>
    <v-text-field
      name="pedUrlInput"
      label="Enter URL for ped file"
      prepend-icon="link"
      hide-details
      v-model="pedUrl"
      :rules="urlRules"
      @change="onPedUrlChange"
      type="url"
    ></v-text-field>
  </div>
</template>

<script>
  export default {
    name: 'ped-file-url-input',
    data(){
      return {
        pedData: null, 
        pedUrl: '',
        urlRules: [
          v => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(v) || 'URL must be valid',
        ],
      }
    }, 
    methods: {
      isValidUrl(url){
        var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/; 
        var regex = new RegExp(expression);
        return url.match(regex); 
      },
      onPedUrlChange: _.debounce(function (url) {
        if(url && url.length > 0 && this.isValidUrl(url)){
          fetch(url)
            .then(res => {
              if(!res.ok){
                alert("Please enter a correct URL or a presigned URL that can be accessed."); 
              }
              else{
                return res.text(); 
              }
            })
             .then(ped => {
               this.pedData = ped;
               this.$emit("on-ped-url-change", this.pedData);
               // this.buildPedFromTxt(this.pedData);
             })
             .catch(error => console.log(error))
        }
        else {
          this.pedData = null;
          this.$emit("on-ped-url-change", this.pedData);
        }
      }, 100),
    }, 

  };
</script>

