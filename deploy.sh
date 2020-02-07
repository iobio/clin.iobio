#!/bin/bash

rm -rf dist
npm run build

if [[ $1 == "prod" ]]; then
	echo "** Syncing to prod s3 bucket **"
	aws s3 cp ./dist/  s3://static.iobio.io/prod/clin.iobio.io/ --recursive
	echo "** Renew cloudfrount cache **"
	aws cloudfront create-invalidation --distribution-id E2Y2NGXFSUAHUW --paths /\*
else
	echo "** Syncing to dev s3 bucket **"
	aws s3 cp ./dist/  s3://static.iobio.io/dev/clin.iobio.io/ --recursive
	echo "** Renew cloudfrount cache **"
	aws cloudfront create-invalidation --distribution-id E2S63OUSKGCXCO --paths /\*
fi




	