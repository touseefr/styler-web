(function() {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Core.Config
     * @module BeautyCollective.Core
     *
     * @description
     * Core module state configurations
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Core')
        .config(coreStateConfig);

    /* @ngInject */
    function coreStateConfig($stateProvider, $urlRouterProvider, APP_CONFIG, $locationProvider) {
        
    }
})();
