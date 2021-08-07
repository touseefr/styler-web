(function() {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Account.Service.ReviewModel
     * @module BeautyCollective.Account
     *
     * @description
     *
     * Data model for jobtask module
     * Implemenets CURD operation
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Account')
        .service('ReviewModel', ReviewModel);

    /* @ngInject */
    function ReviewModel(ReviewResource) {
        var model = this;
        /**
         * [jobList description]
         * @True {Array}
         */
        model.reviewList = [];

       /**
         * Get Review
         * @param id id
         * @return Review
         */
        model.find = function(id) {
            return ReviewResource.find(id).$promise;
        };
        
		/**
         * Create a new Review
         * @param Review Review
         * @return Review saved
         */
        model.save = function(review) {
            return ReviewResource.save(review).$promise;
        };

        /**
         * Update Review
         * @param Review Review
         * @return Review saved
         */
        model.update = function(review) {
            return ReviewResource.update(review).$promise;
        };

        /**
         * Delete Review
         * @param id id
         */
        model.delete = function(id) {
            return ReviewResource.delete(id).$promise;
        };
		
		
		/**
         * Delete Review
         * @param id id
         */
        model.all = function(id) {
            return ReviewResource.all(id).$promise;
        };
		
		/**
         * Request Review
         * @param object
         */
        model.requestReview = function(customer) {
            return ReviewResource.requestReview(customer).$promise;
        };
    }
})();
