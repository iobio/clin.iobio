#!/bin/bash

rm -rf deploy
mkdir deploy
mkdir deploy/js
mkdir deploy/app
mkdir deploy/dist

# build vue app
if [[ $1 == "prod" ]]; then
  echo "** Building prod **"
  NODE_ENV=production npm run build
else
  echo "** Building dev **"
  npm run build
fi

# link to files needed for static page
ln -s ~/work/clin.iobio.vue/server/views/index.html ~/work/clin.iobio.vue/deploy/index.html
ln -s ~/work/clin.iobio.vue/client/assets ~/work/clin.iobio.vue/deploy/assets
ln -s ~/work/clin.iobio.vue/client/js/thirdparty ~/work/clin.iobio.vue/deploy/js/thirdparty
ln -s ~/work/clin.iobio.vue/client/app/third-party ~/work/clin.iobio.vue/deploy/app/third-party
ln -s ~/work/clin.iobio.vue/client/dist/build.js ~/work/clin.iobio.vue/deploy/dist/build.js
if [[ $1 == "prod" ]]; then
  ln -s ~/work/clin.iobio.vue/client/dist/build.js.map ~/work/clin.iobio.vue/deploy/dist/build.js.map
fi

# upload to cloudfront
if [[ $1 == "prod" ]]; then

  echo "** Uploaded to prod s3 bucket **"
  aws s3 cp ./deploy/  s3://static.iobio.io/prod/clin.iobio.io/ --recursive
  echo "** Renew cloudfrount cache **"
  aws cloudfront create-invalidation --distribution-id E2Y2NGXFSUAHUW --paths /\*


else
  echo "** Syncing to dev s3 bucket **"
  #aws s3 sync ./deploy/  s3://static.iobio.io/dev/clin.iobio.io/
  aws s3 cp ./deploy/  s3://static.iobio.io/dev/clin.iobio.io/ --recursive
  echo "** Renew cloudfrount cache **"
  aws cloudfront create-invalidation --distribution-id E2S63OUSKGCXCO --paths /\*
fi