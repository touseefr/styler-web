(function() {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Widgets.Service.ApplyjobModel
     * @module BeautyCollective.Widgets
     *
     * @description
     *
     * Data model for Booking module
     * Implemenets CURD operation
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .service('ApplyjobModel', ApplyjobModel);

    /* @ngInject */
    function ApplyjobModel(ApplyjobResource) {
        var model = this;
       
		/**
         * [ApplyJob description]
         * @method ApplyJob
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
		
		model.ApplyJob = function(params, success, fail) {
            return ApplyjobResource.ApplyJob(params, success, fail).$promise;
        };
		
    }
})();
