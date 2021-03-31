# clin.iobio.io

## Project setup

1. Clone this repo and run `npm start`. Make sure the app is running on port `4030`.

2. Clone gene.iobio (https://github.com/iobio/gene.iobio.vue) and checkout to `dev` branch. 

3. Run `npm start` and  `npm run webpack`  for gene.iobio. Make sure the app is running on port `4026`.  Go to  http://localhost:4026/ in your browser. It should open gene.iobio. (It might show a warning asking for a key. Click ok and it should work). 

4. Go to http://localhost:4030/  in your browser. It should open clin.iobio. 



### To compile and minify for production
```
npm run build
```


## Using clin.iobio
You can try out clin.iobio using a demo dataset. Or you can immediately plug in your own data, by providing URLs to your BAM and VCF files.

From the clin.iobio landing page, you can import your data into the app using the provided screen prompts for entering data URLs or a configuration file. Our screencast will help guide you through these options.

[![clin.iobio screencast](https://i.ytimg.com/vi/MVWiTlNY7yM/hqdefault.jpg)](https://youtu.be/MVWiTlNY7yM "clin.iobio screencast")
