(function() {
    'use strict';
    /**
     * @ngdoc config
     *
     * @name BeautyCollective.dashboard.config.DashboardState
     * @module BeautyCollective.dashboard
     *
     * @description
     * Configure dashboard module routes
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Dashboard')
        .config(DashboardState);

    /* @ngInject */
    function DashboardState($stateProvider, APP_CONFIG, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider.state('dashboard', {
            absolute: true,           
            views: {
                '': {
                    templateUrl: APP_CONFIG.modules + '/dashboard/dashboard.html',
                    controller: 'DashboardController as dashboardCtrl'
                },
                'user-top-section':{
                     templateUrl: APP_CONFIG.modules + '/dashboard/dashboard_top_section.html',
                     controller: 'DashboardController as dashboardCtrl'
                }
            }

        });
    }
})();
