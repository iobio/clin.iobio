<template>
  <v-container>
    <v-card-text>
      <div class="container">
        <div class="row">
          <div class="col-md-3">
            <div class=" ml-10" style="width:60%">
              <center class="heading" style="font-size:16px; font-weight:500"><span >Sample </span></center>
            </div>
            <br>
          </div>
          <div class="col-md-4">
            <div class="mr-10 ml-10" style="width:70%">
              <center class="heading" style="font-size:16px; font-weight:500"><span >Read Coverage </span></center>
            </div>
            <br>
          </div>
          <div class="col-md-3">
            <div class="mr-10 ml-10" style="width:70%">
              <center class="heading" style="font-size:16px; font-weight:500"><span >Variant Types </span></center>
            </div>
            <br>
          </div>
          <div class="col-md-1"></div>
        </div>
        <div class="row mb-4" v-for="(item, i) in rowsLength" :key="i">
          <div class="col-md-3">
            <div class=" ml-10" style="width:60%">
              <center>
                <v-skeleton-loader
                  :loading="loading"
                  :transition="transition"
                  type="image"
                >
                </v-skeleton-loader>
              </center>
            </div>
          </div>
          <div class="col-md-4">
            <div class="mr-10 ml-10" style="width:70%">
              <v-skeleton-loader
                :loading="loading"
                :transition="transition"
                type="image"
              >
              </v-skeleton-loader>
            </div>
          </div>
          <div class="col-md-3">
            <div class="mr-10 ml-10" style="width:70%">
              <v-skeleton-loader
                :loading="loading"
                :transition="transition"
                type="image"
              >
              </v-skeleton-loader>
            </div>
          </div>
          <div class="col-md-1"></div>
        </div>
      </div>
    </v-card-text>
  </v-container>
</template>

<script>
  export default {
    name: 'SkeletonLoadersReview',
    props: {
      rowsLength: null,
    },
    data (){
      return {
        loading: true,
        transition: 'scale-transition',
      }
    }
  }
</script>
