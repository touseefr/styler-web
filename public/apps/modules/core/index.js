(function() {
    'use strict';

    angular
        .module('BeautyCollective.Core', [
            /**
             * @module dynamicLocale
             *
             * @description
             * Module to be able to change the locale at an angularjs application
             */
            'tmh.dynamicLocale',
            /**
             * @module ngResource
             *
             * @description
             * The ngResource module provides interaction support with RESTful services via the $resource service.
             */
            'ngResource',
            /**
             * @module ui.router
             *
             * @description
             * AngularUI Router is a routing framework, which implements flexible routing with nested views in AngularJS.
             */
            'ui.router',
            /**
             * @module ngCookies
             *
             * @description
             * JavaScript plain cookies
             */
            'ngCookies',
            /**
             * @module angular-translate
             *
             * @description
             * angular-translate is an AngularJS module that makes your life much easier when
             * it comes to i18n and l10n including lazy loading and pluralization.
             */
            'pascalprecht.translate',
            /**
             * @module ui.bootstrap
             *
             * @description
             * Twitter bootstrap ui componenets
             */
            'ui.bootstrap',
            /**
             * @module logger
             *
             * @description
             * console anything which is need to debug
             */
            'logger',
            /**
             * @module angularMoment
             *
             * @description
             * Parse, validate, manipulate, and display dates in JavaScript.
             */
            'angularMoment',
            /**
             * @module ngCacheBuster
             *
             * @description
             * For http request caching
             */
            'ngCacheBuster',

            /**
             * @module ngSanitize
             *
             * @description 
             * The ngSanitize module provides functionality to sanitize HTML.
             */
            'ngSanitize',
            'toaster',
            'ui.select',
            'BeautyCollective.bLaravel',
            'uiGmapgoogle-maps',
            'slick',
            'simplePagination',
            '720kb.socialshare',
            'angularSpinner',
            'infinite-scroll',
            'jkuri.slimscroll',
            'blockUI'
        ]);

    //angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 1000);
})();
