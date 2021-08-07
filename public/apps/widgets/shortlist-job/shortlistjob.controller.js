(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.ShortlistjobController
     * @module BeautyCollective.Widgets
     *
     * @description
     * ShortlistjobController is responsible for booking appointments
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .controller('ShortlistjobController', ShortlistjobController);

    /* @ngInject */

    function ShortlistjobController($sanitize,$q, Logger, Spinner, ShortlistjobModel,toaster) {

        /**
         * [self description]
         * @type {[type]}
         */
        var self = this;
		init();
        /**
         * [init description]
         * @return {void}
         */
        function init() {
    		Logger.getInstance('ShortlistjobController').info('Shortlistjob Controller has initialized');
		}
		
		  
	  self.shortlistJob= function() {
		ShortlistjobModel.ShortlistJob({
			},{id:self.id}).then(function(responce){
				if(responce.status){
                    toaster.pop('success', "Job Saved", responce.message);
				}else{
					toaster.pop('error', "Job Already Saved", responce.message);
				}
			},function(){
		});
	  };

		
	}
})();
