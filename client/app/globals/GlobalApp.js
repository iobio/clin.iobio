/*  These app.global variables determine which iobio servers the gene.iobio app with interact
    with for a local deployment.  This entire .js can be replaced or modified to suit the
    specific iobio deployment environment.
*/
class GlobalApp {
  constructor() {

    this.cacheHelper           = null;
    this.tour                  = "";
    this.completedTour         = "";

    this.version               = "3.0";

    this.DEV_IOBIO             = "nv-dev-new.iobio.io/";
    this.STAGE_IOBIO           = "nv-purple.iobio.io/";
    this.PROD_IOBIO            = "nv-blue.iobio.io/";
    this.CURRENT_IOBIO         = this.PROD_IOBIO;


    this.isOffline             = false;          // is there any internet connect to outside services and resources?
    this.isClinvarOffline      = false;          // is clinvar offline?  (Pull from clinvar hosted from URL?)
    this.accessNCBIGeneSummary = true;           // is it okay to access NCBI web resources to obtain the refseq gene summary?  In cases where the server and client are COMPLETELY offline, set this to false.

    this.useOnDemand           = true;           // use on demand tabix and samtools

    this.serverInstance        = "@hostname@/";  // this will be replace with the name of the server used for this deployement
    this.serverCacheDir        = "local_cache/"; // this is the directory from the server instance where resource files (like clinvar vcf) will be served
    this.serverDataDir         = "local_cache/"; // this is the directory from the server instance where data files will be served
    this.offlineUrlTag         = "site:"         // this is the first part if the vcf/bam URL that indicates that a special URL should be constructed to get to files served from the local isntance

    this.useSSL                = true;
    this.useServerCache        = false;



    this.IOBIO_SERVICES        = this.isOffline              ? this.serverInstance : this.CURRENT_IOBIO;
    this.HTTP_SERVICES         = (this.useSSL ? "https://" : "http://") + (this.isOffline ? this.serverInstance : this.CURRENT_IOBIO);
    this.emailServer           = (this.useSSL ? "wss://" : "ws://") +   this.IOBIO_SERVICES + "email/";


    this.hpoLookupUrl          = this.HTTP_SERVICES + "hpo/hot/lookup/?term=";

    // config files
    this.siteConfigUrl         =  "https://s3.amazonaws.com/gene.iobio.config/site-config.json";
    this.clinvarGenesUrl       =  "https://s3.amazonaws.com/gene.iobio.config/clinvar-counts.txt";

    // Get clinvar annotations from 'eutils' or 'vcf'
    this.clinvarSource         = "vcf";


    // get hgvs, rsid annotation for all variants
    this.getVariantIdsForGene = false;

    // How many genes can be analyzed in one session.  Set to null if no limitation.
    this.maxGeneCount         = 100;

    // Should vep retrieve allele frequencies (for gnomad, 1000G, ESP)
    this.vepAF                = true ;

    // What browser cache implementation is used: 'localStorage' or 'indexedDB'
    this.BROWSER_CACHE_LOCAL_STORAGE = 'localStorage';
    this.BROWSER_CACHE_INDEXED_DB    = 'indexedDB';
    this.browserCache                = this.BROWSER_CACHE_INDEXED_DB;

    this.BROWSER_CACHE_EXPIRATION    = 3 * 60 * 60 * 1000;  // 3 HOURS



    this.feedbackEmails              = "gene.iobio.feedback@gmail.com";  // what emails should feedback be sent to?   if no emails are provided, the feedback link will be hidden
    this.feedbackAttachScreenCapture = false;          // should the feedback include a screen capture?
    this.feedbackShowURL             = false;         // show the feedback email show the URL that launched gene.iobio?

    this.autocall                    = null       // If only alignments provided, should variants be automatically called when gene is selected?


    this.DEFAULT_BATCH_SIZE          = 10;              // how many genes can be analyzed simultaneously for 'Analyze all'

    this.keepLocalStorage            = false; // maintain cache between sessions?
    this.eduModeVariantSize          = 10;

    // Fields
    this.impactFieldToFilter         = 'highestImpactVep';
    this.impactFieldToColor          = 'vepImpact';

  }



  useLocalStorage() {
    return this.browserCache == this.BROWSER_CACHE_LOCAL_STORAGE;
  }
  useIndexedDB() {
    return this.browserCache == this.BROWSER_CACHE_INDEXED_DB;
  }
}

export default GlobalApp

