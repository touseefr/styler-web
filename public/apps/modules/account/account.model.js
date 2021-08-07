(function() {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Account.Service.AccountModel
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
        .service('AccountModel', AccountModel);

    /* @ngInject */
    function AccountModel(AccountResource) {
        var model = this;
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
            return AccountResource.find(id).$promise;
        };

        /**
         * Get dashboard
         * @param id id
         * @return dashboard
         */
        model.findJob = function(id) {
            return AccountResource.findJob(id).$promise;
        };
        /**
         * [findAllActivities description]
         * @method findAllActivities
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
        model.findAllActivities = function(params, success, fail) {
            return AccountResource.findAllActivities(params, success, fail);
        };

        /**
         * Create a new dashboard
         * @param dashboard dashboard
         * @return dashboard saved
         */
        model.save = function(dashboard) {
            return AccountResource.save(dashboard).$promise;
        };

        /**
         * Update dashboard
         * @param dashboard dashboard
         * @return dashboard saved
         */
        model.update = function(params, data) {
            return AccountResource.update(params,data).$promise;
        };

        /**
         * Update business details
         * @param {{dashboard dashboard}}
         * @return dashboard saved
         */
        model.updatebusiness = function(params, data) {
            return AccountResource.updatebusiness(params, data).$promise;
        };

        model.updateUserSocialMedia = function(data) {
            return AccountResource.updatesocialmedia(data).$promise;
        };

        /**
         * Update jobs details
         * @param {{dashboard dashboard}}
         * @return dashboard saved
         */
        model.updateIndividualInfo = function(params, data) {
            return AccountResource.updateIndividualInfo(params,data).$promise;
        };

        /**
         * Delete dashboard
         * @param id id
         */
        model.delete = function(id) {
            return AccountResource.delete(id).$promise;
        };

        /**
         * search job seekers
         * @param {{dashboard dashboard}}
         * @return dashboard saved
         */
        model.getJobSeekers = function(params, success, fail) {
            return AccountResource.getJobSeekers(params, success, fail).$promise;
        };

        /**
         * search job seekers
         * @param {{dashboard dashboard}}
         * @return dashboard saved
         */
        model.getUsers = function(params, success, fail) {
            return AccountResource.getUsers(params, success, fail).$promise;
        };
		
		/**
         * delete logo
         * @param {{delete logo}}
         * @return delete logo
         */
        model.deleteLogo = function(params, success, fail) {
            return AccountResource.deleteLogo(params, success, fail).$promise;
        };
		
		/**
         * delete Video
         * @param {{delete logo}}
         * @return delete logo
         */
        model.deleteVideo = function(params, success, fail) {
            return AccountResource.deleteVideo(params, success, fail).$promise;
        };
		
		/**
         * search job seekers
         * @param {{dashboard dashboard}}
         * @return dashboard saved
         */
        model.getWatchList = function() {
            return AccountResource.getWatchList().$promise;
        };

        
    }
})();
