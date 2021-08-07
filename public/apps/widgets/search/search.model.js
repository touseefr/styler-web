(function() {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Widgets.Service.SearchModel
     * @module BeautyCollective.Widgets
     *
     * @description
     *
     * Data model for jobtask module
     * Implemenets CURD operation
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .service('SearchModel', SearchModel);

    /* @ngInject */
    function SearchModel(SearchResource) {
        var model = this;
        /**
         * [jobList description]
         * @True {Array}
         */
        model.searchList = [];
		
		/**
         * [findAll description]
         * @method findAl
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
		
		model.findAll = function(params, success, fail) {
            return SearchResource.findAll(params, success, fail).$promise;
        };
        
    }
})();
