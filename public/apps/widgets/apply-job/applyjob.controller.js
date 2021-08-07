(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.ApplyjobController
     * @module BeautyCollective.Widgets
     *
     * @description
     * ApplyjobController is responsible for activating job
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .controller('ApplyjobController', ApplyjobController);

    /* @ngInject */

    function ApplyjobController($sanitize,$q, Logger, Spinner, ApplyjobModel,toaster) {

        /**
         * [self description]
         * @type {[type]}
         */
        var self = this;
		self.fileName='';
        self.coverLetter='';
		init();
        /**
         * [init description]
         * @return {void}
         */
        function init() {
    		// Logger.getInstance('ApplyjobController').info('ApplyjobController Controller has initialized');
		}
		
	 self.flowConfig = function() {
		     return {
                target: '/uploadresume',
                permanentErrors: [404, 500, 501],
                maxChunkRetries: 1,
                chunkRetryInterval: 5000,
                simultaneousUploads: 1,
                singleFile: true,
                headers: {
                    'X-CSRF-TOKEN': csrf_token
                },
                query: function(flowFile, flowChunk) {
                    Spinner.start();
                    // function will be called for every request
                    return {
                        id: self.id,
                        source: 'flow_query'
                    };
                }
            }
        };	
		
	
		self.fileUploadSuccess = function($file, $res) {
            console.log($res);
			 
			 $res = angular.fromJson($res);
			  
			 self.fileName = $res.name;
			 
			
			//$file.id = $res;
            /*self.listing.flowFiles.push($res);*/
            Spinner.stop();
        };	
		
		
		self.cancelFile = function($file) {
			 self.fileName = '';
			 $file.cancel();
			 Spinner.stop();
        };
		
		  
	  self.applyJob= function() {
		toaster.clear();
		if(self.coverLetter==''){
		  toaster.pop('error','Please type your cover letter.');
		}else if(self.fileName==''){
		 toaster.pop('error','Please upload your resume of valid format(.pdf,.doc,.docx)');
		}else{
		   Spinner.start();
           ApplyjobModel.ApplyJob({
    			},{ id:self.id,
                    coverLetter:self.coverLetter,
                    resume:self.fileName,
                    userId:self.userId}).then(function(responce){
					Spinner.stop();
    				if(responce.status){
    					 toaster.pop('success',responce.title,responce.message);
    				}else{
    					toaster.pop('error',responce.title, responce.message);
    				}
    			},function(){
    		});
        } 
	  };
    }
})();
