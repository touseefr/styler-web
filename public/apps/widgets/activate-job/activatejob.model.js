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
        .service('ActivatejobModel', ActivatejobModel);

    /* @ngInject */
    function ActivatejobModel(ActivatejobResource) {
        var model = this;
       
		/**
         * [Shortlistjob description]
         * @method Shortlistjob
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
		
		model.ActivateJob = function(params, success, fail) {
            return ActivatejobResource.ActivateJob(params, success, fail).$promise;
        };
		
    }
})();
