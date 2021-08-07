(function() {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Listing.Service.ListingModel
     * @module BeautyCollective.Listing
     *
     * @description
     *
     * Data model for jobtask module
     * Implemenets CURD operation
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Listing')
        .service('ListingModel', ListingModel);

    /* @ngInject */
    function ListingModel(ListingResource) {
        var model = this;
        /**
         * [listingSchema description]
         * @type {Object}
         */
        model.listingSchema = {
            id: null,
            title: '',
            user_id: null,
            email: '',
            contact: '',
            price: 0.00,
            dealprice: 0.00,
            discount: 0,
            saving: 0,
            description: '',
            categories: null,
            visa_id: null,
            status: 1,
            expiry: '',
            slug: '',
            latitude:'',
            longitude:'',
            suburb: '',
            state:'',
            postcode:''

        };

        /**
         * [jobList description]
         * @True {Array}
         */
        model.dashboardList = [];

        /**
         * [dashboardActivities description]
         * @True {Array}
         */
        model.dashboardActivities = [];

        /**
         * Get dashboard
         * @param id id
         * @return dashboard
         */
        model.find = function(id) {
            return ListingResource.find(id).$promise;
        };
        /**
         * [findAllListing description]
         * @method findAl
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
        model.findAll = function(params, success, fail) {
            return ListingResource.query(params, success, fail).$promise;
        };

        /**
         * Create a new dashboard
         * @param dashboard dashboard
         * @return dashboard saved
         */
        model.save = function(list) {
            return ListingResource.save(list).$promise;
        };

        /**
         * Update dashboard
         * @param dashboard dashboard
         * @return dashboard saved
         */
        model.update = function(params, data) {
            consolde.log(data);
            return ListingResource.update(params, data).$promise;
        };

        /**
         * Delete dashboard
         * @param id id
         */
        model.delete = function(id) {
            return ListingResource.delete(id).$promise;
        };

        model.cancel = function(id,list_id) {
            return ListingResource.cancel(id,list_id).$promise;
        };

    }
})();
