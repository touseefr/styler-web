(function() {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Widgets.Service.AddtowatchModel
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
        .service('AddtowatchModel', AddtowatchModel);

    /* @ngInject */
    function AddtowatchModel(AddtowatchResource) {
        var model = this;
       
		/**
         * [AddtowatchList description]
         * @method AddtowatchList
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
		
		model.AddtowatchList = function(params, success, fail) {
            return AddtowatchResource.AddtowatchList(params, success, fail).$promise;
        };
		
    }
})();
