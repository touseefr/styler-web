(function() {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Dashboard.Service.DashboardModel
     * @module BeautyCollective.Dashboard
     *
     * @description
     *
     * Data model for jobtask module
     * Implemenets CURD operation
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Dashboard')
        .service('DashboardModel', DashboardModel);

    /* @ngInject */
    function DashboardModel(DashboardResource) {
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
            return DashboardResource.find(id).$promise;
        };
        /**
         * [findAllActivities description]
         * @method findAllActivities
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
        model.findAllActivities = function(params, success, fail) {
            return DashboardResource.findAllActivities(params, success, fail);
        };

        /**
         * Create a new dashboard
         * @param dashboard dashboard
         * @return dashboard saved
         */
        model.save = function(dashboard) {
            return DashboardResource.save(dashboard).$promise;
        };

        /**
         * Update dashboard
         * @param dashboard dashboard
         * @return dashboard saved
         */
        model.update = function(dashboard) {
            return DashboardResource.update(dashboard).$promise;
        };

        /**
         * Delete dashboard
         * @param id id
         */
        model.delete = function(id) {
            return DashboardResource.delete(id).$promise;
        };
    }
})();
