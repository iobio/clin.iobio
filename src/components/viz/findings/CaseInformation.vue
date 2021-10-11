<template>
  <div class="">
    <div>
      <div class="col-md-12" style="padding-left: 2px;">
        <v-card>
          <div class="row">
            <div class="col-md-3" style="padding-top: 0px;">
              <v-card-text >
                <span>
                  <span>
                    <strong class="terms-heading" style="font-size: 14px; display: inline">
                      <v-icon small class="mr-1">subtitles</v-icon>Case name:
                    </strong>
                  </span>
                  <span>{{ caseSummary.name }}</span>
                </span>
              </v-card-text >
            </div>
            
            <div class="col-md-3" style="padding-top: 0px;">
              <v-card-text >
                <span>
                  <span>
                    <strong class="terms-heading" style="font-size: 14px; display: inline">
                      <v-icon small class="mr-1">date_range</v-icon>Date:
                    </strong>
                  </span>
                  <span>{{ getDate }}</span>
                </span>


              </v-card-text >
            </div>
            <div class="col-md-3" style="padding-top: 0px;">
              <v-card-text >
                <span>
                  <span>
                    <strong class="terms-heading" style="font-size: 14px; display: inline">
                      <v-icon small class="mr-1">mdi-clipboard-account</v-icon>Reference:
                    </strong>
                  </span>
                  <span>GRCh38</span>
                </span>
              </v-card-text >
            </div>

                
              <div class="col-md-3" style="padding-top: 0px;">
                <v-card-text >
                <span>
                  <span>
                    <strong class="terms-heading" style="font-size: 14px; display: inline">
                      <v-icon small class="mr-1">mdi-account-multiple</v-icon>Samples:
                    </strong>
                  </span>
                  <span>3 Samples</span>
                </span>


              </v-card-text >
            </div>
          </div>
        </v-card>
      </div>
      
      <div class="col-md-12" style="padding-left: 2px;">
        <!-- <v-card-title primary-title style="padding-top: 6px; padding-bottom: 2px">
          <strong class="terms-heading" style="font-size: 14px">
            General Information
          </strong>
          <v-spacer></v-spacer>
        </v-card-title> -->

        <v-card>

          <v-card-title primary-title style="padding-top: 6px; padding-bottom: 2px">
            <strong class="terms-heading" style="font-size: 14px">
              Case summary
            </strong>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text >
            {{ caseSummary.description }}
          </v-card-text >
        </v-card>
      </div>

      
    </div>
  </div>
  
</template>

<script>

  export default {
    name: 'case-information',
    components: {
    },
    props: {
      caseSummary: null,
    },
    data(){
      return {
      }
    },
    
    computed: {
      getDate(){
        let date = new Date().toLocaleDateString();
        return date;
      }
    },
    
    methods: {
    },
    
    watch: {
    }

  };
</script>

