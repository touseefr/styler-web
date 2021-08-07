(function() {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Widgets.Service.RatingModel
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
        .service('RatingModel', RatingModel);

    /* @ngInject */
    function RatingModel(RatingResource) {
        var model = this;
       
		/**
         * [saveRating description]
         * @method findAl
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
		
		model.saveRating = function(params, success, fail) {
            return RatingResource.saveRating(params, success, fail).$promise;
        };
        /**
         * Create a new Review
         * @param Review Review
         * @return Review saved
         */
        model.save = function(review) {
            return RatingResource.save(review).$promise;
        };
    }
})();
