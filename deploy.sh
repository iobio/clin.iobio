rm -rf deploy
mkdir deploy

mkdir deploy/tmp
mkdir deploy/tmp/clin.iobio.vue
mkdir deploy/tmp/clin.iobio.vue/js
mkdir deploy/tmp/clin.iobio.vue/app
mkdir deploy/tmp/clin.iobio.vue/dist

ln -s ~/work/clin.iobio.vue/client/assets           ~/work/clin.iobio.vue/deploy/tmp/clin.iobio.vue/assets
ln -s ~/work/clin.iobio.vue/client/js/thirdparty    ~/work/clin.iobio.vue/deploy/tmp/clin.iobio.vue/js/thirdparty
ln -s ~/work/clin.iobio.vue/client/app/third-party  ~/work/clin.iobio.vue/deploy/tmp/clin.iobio.vue/app/third-party
ln -s ~/work/clin.iobio.vue/client/dist/build.js    ~/work/clin.iobio.vue/deploy/tmp/clin.iobio.vue/dist/build.js
ln -s ~/work/clin.iobio.vue/server/views/index.html ~/work/clin.iobio.vue/deploy/tmp/clin.iobio.vue/index.html

cd deploy/tmp

#zip -r  ../clin.iobio.vue.zip ./clin.iobio.io/*

aws s3 cp ~/work/clin.iobio.vue/deploy/tmp/clin.iobio.vue/  s3://static.iobio.io/vue.clin.iobio.io/ --recursive

