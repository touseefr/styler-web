(function() {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Widgets.Service.ShortlistjobModel
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
        .service('ShortlistjobModel', ShortlistjobModel);

    /* @ngInject */
    function ShortlistjobModel(ShortlistjobResource) {
        var model = this;
       
		/**
         * [Shortlistjob description]
         * @method Shortlistjob
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
		
		model.ShortlistJob = function(params, success, fail) {
            return ShortlistjobResource.ShortlistJob(params, success, fail).$promise;
        };
		
    }
})();
