<template>
  <div class="">
    <div class="row">
      <div class="col-md-9">
        <v-card style="height: 270px">
          <v-card-title primary-title style="padding-top: 6px; padding-bottom: 2px">
            <strong class="terms-heading" style="font-size: 14px">
              Sample Attributes
            </strong>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <v-simple-table >
              <template v-slot:default>
                <thead>
                  <tr>
                    <th 
                      v-for="item in table_headers"
                      :key="item"
                      class="text-left"
                    > 
                      <span>{{ item }}</span>
                   </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in sample_attributes"
                    :key="item.name"
                  >
                    <td text-color="primary">
                      <v-icon small class="mr-1 primary--text">mdi-account-multiple</v-icon> 
                      <strong class="primary--text">{{ item.sample }}</strong>
                    </td>
                    <td>{{ item.median_read_coverage }}</td>
                    <td>{{ item.total_reads }}</td>
                    <td>{{ item.mapped_reads }}</td>
                    <td>{{ item.variant_count }}</td>
                    <td>{{ item.ts_tv_ratio }}</td>

                  </tr>
                </tbody>
              </template>
            </v-simple-table>

          </v-card-text>
        </v-card>
      </div>
      
      <div class="col-md-3">
        <v-card
          class="mx-auto"
          tile style="height: 270px"
        >
          <v-card-title primary-title style="padding-top: 6px; padding-bottom: 2px">
            <strong class="terms-heading" style="font-size: 14px">
              Health
            </strong>
            <v-spacer></v-spacer>
          </v-card-title>

          <v-list dense>
            <v-list-item-group
              color="primary"
            >
              <v-list-item>
                <v-list-item-icon>
                  <v-icon v-if="pedigree_data">check_circle_outline</v-icon>
                  <v-icon v-if="!pedigree_data">highlight_off</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title> All samples have pedigree data </v-list-item-title>
                </v-list-item-content>
              </v-list-item>  
              
              <v-list-item>  
                <v-list-item-icon if="attribute_data">
                  <v-icon v-if="attribute_data">check_circle_outline</v-icon>
                  <v-icon v-if="!attribute_data">highlight_off</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title> All samples have attribute data </v-list-item-title>
                </v-list-item-content>
              </v-list-item>  
              
              <v-list-item>
                <v-list-item-icon>
                  <v-icon v-if="coverage_data">check_circle_outline</v-icon>
                  <v-icon v-if="!coverage_data">highlight_off</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title> All samples have coverage data </v-list-item-title>
                </v-list-item-content>
              </v-list-item>  

              <v-list-item>
                <v-list-item-icon>
                  <v-icon v-if="variant_data">check_circle_outline</v-icon>
                  <v-icon v-if="!variant_data">highlight_off</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title> All samples have variant data </v-list-item-title>
                </v-list-item-content>
              </v-list-item>  
              
              <v-list-item>
                <v-list-item-icon>
                  <v-icon v-if="getBadCoverageCount == 0">check_circle_outline</v-icon>
                  <v-icon v-if="getBadCoverageCount > 0">highlight_off</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title> All QC passed </v-list-item-title>
                  <v-list-item-subtitle class="mt-1 ml-3" v-if="getBadCoverageCount > 0">Failed QC 
                    <span style="color: red">{{ badCoverageCount }}</span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>  



              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </div>
    </div>
    
    
    
  </div>
  
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'quality-info',
    components: {
    },
    props: {
      sample_attributes: null,
      modelInfos: null
    },
    data(){
      return {
        table_headers: ['Name', 'Median RC', 'Total Reads', 'Mapped Reads', 'Variant Counts', 'Ts/Tv Ratio'],
        pedigree_data: false,
        attribute_data: false,
        coverage_data: false,
        variant_data: false,
        qc_check: true,
        badCoverageCount: 0,
        items: [
          { text: 'Real-Time', icon: 'mdi-clock' },
          { text: 'Audience', icon: 'mdi-account' },
          { text: 'Conversions', icon: 'mdi-flag' },
        ],
      }
    },
    
    computed: {
      ...mapGetters(['getPedigreeData', 'getVariantsCount', 'getCustomCoverage', 'getReviewCaseBadge', 'getVariantsByInterpretation', 'getModelInfos', 'getGeneSet', 'getCaseSummary', 'allAnalysis', 'getBadCoverageCount']),

    },
    
    methods: {
    },
    
    watch: {
      getBadCoverageCount(){
        console.log("getBadCoverageCount changing");
        if(this.getBadCoverageCount > 0) {
          this.qc_check = true;
          this.badCoverageCount = this.getBadCoverageCount;
        }
      },
      sample_attributes(){
        console.log("chaning ", this.sample_attributes);
      }
    },
    
    mounted() {
      console.log("this.sample_attributes", this.sample_attributes);
      // let ped_data = this.sample_attributes.every( sample => {
      //   console.log("sample.pedigree", sample.pedigree.toLowerCase() == 'Pedigree');
      //   return sample.pedigree.toLowerCase() == "Pedigree";
      // })
      
      let ped_data = this.sample_attributes.every(sample => sample.pedigree == "Pedigree" )
      this.pedigree_data = ped_data;
      
      let attr_data = this.sample_attributes.every(sample => Object.keys(sample).length !== 0 )
      this.attribute_data = ped_data;

      let cov_data = this.sample_attributes.every(sample =>  sample.total_reads > 0)
      this.coverage_data = cov_data;

      let var_data = this.sample_attributes.every(sample => sample.variant_count > 0 )
      this.variant_data = var_data;


      
      console.log("pedigree_data", this.pedigree_data);
    },

  };
</script>

