(function() {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Core.Config
     * @module BeautyCollective.Core
     *
     * @description
     * Configuartion while provider are created
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Core')
        .config(CoreConfiguration);

    /* @ngInject */
    function CoreConfiguration($interpolateProvider, $httpProvider, $translateProvider, tmhDynamicLocaleProvider, LoggerProvider, httpRequestInterceptorCacheBusterProvider, APP_CONFIG, $provide, ENV, uiGmapGoogleMapApiProvider,
        usSpinnerConfigProvider,blockUIConfig) {
		$interpolateProvider.startSymbol('<%');
        $interpolateProvider.endSymbol('%>');

        //Cache everything except rest api requests
        httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*api.*/, /.*protected.*/, /.*registeraccount.*/], true);

        $httpProvider.interceptors.push('XSRFInterceptor');
        $httpProvider.interceptors.push('errorHandlerInterceptor');
        $httpProvider.interceptors.push('notificationInterceptor');


        // Initialize angular-translate
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'resources/i18n/{lang}/{part}.json'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useCookieStorage();

        tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
        tmhDynamicLocaleProvider.useCookieStorage('NG_TRANSLATE_LANG_KEY');
        if (ENV === 'production') {
            $compileProvider.debugInfoEnabled(false);
        }

        uiGmapGoogleMapApiProvider.configure({
            key: APP_CONFIG.GOOGLE.MAP.KEY,
            v: '3.20', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization,places'
        });
        usSpinnerConfigProvider.setTheme('global', {
            lines: 9,
            length: 28,
            width: 8,
            radius: 17,
            scale: 1,
            corners: 1,
            color: '#57ce4b',
            opacity: 0.35,
            rotate: 23,
            direction: 1,
            speed: 1.1,
            trail: 68,
            fps: 20,
            zIndex: 2e9,
            className: 'spinner',
            top: '47%',
            left: '50%',
            shadow: true,
            hwaccel: true,
            position: 'fixed'
        });
        usSpinnerConfigProvider.setTheme('inline', {
            lines: 9,
            length: 28,
            width: 8,
            radius: 17,
            scale: 1,
            corners: 1,
            color: '#57ce4b',
            opacity: 0.35,
            rotate: 23,
            direction: 1,
            speed: 1.1,
            trail: 68,
            fps: 20,
            zIndex: 2e9,
            className: 'spinner',
            top: '47%',
            left: '50%',
            shadow: true,
            hwaccel: true,
            position: 'fixed'
        });
                /**
         * Block UI configuration
         */
        blockUIConfig.templateUrl = '/apps/components/partials/regular-spinner.html';
        blockUIConfig.message = 'Please wait';
        blockUIConfig.delay = 0;
        blockUIConfig.autoBlock = false;

    }


    /**
     * @ngdoc overview
     * @name BeautyCollective.Core.Run
     * @module BeautyCollective.Core
     *
     * @description
     * Core module configuration in run block
     * Handle state change event
     * Check Authentication before state get change
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Core')
        .run([
            '$rootScope',
            '$window',
            '$state',
            '$translate',
            'Language',
            'ENV',
            'APP_CONFIG',
            'Spinner',
            function($rootScope, $window, $state, $translate, Language, ENV, APP_CONFIG, Spinner) {
                /**
                 * Keep application configuration in rootScope
                 */
                $rootScope.VIEW_CONFIG = APP_CONFIG.view;
                /**
                 * Set global information to $rootScope
                 */
                $rootScope.ENV = ENV;
                /**
                 * Capture $stateChangeStart event on $rootScope
                 * Authenticate user
                 * Detect current language
                 */
                $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
                    $rootScope.toState = toState;
                    $rootScope.toStateParams = toStateParams;
                    Spinner.start();

                    /**
                     * Update current lanaguage
                     */
                    Language.getCurrent().then(function(language) {
                        $translate.use(language);
                    });
                });


                /**
                 * Capture $stateChangeSuccess event on $rootScope
                 * Set page title
                 */
                $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

                    Spinner.stop();
                    var titleKey = 'global.title';
                    //Set page class
                    $rootScope.$state = $state;

                    $rootScope.previousStateName = fromState.name;
                    $rootScope.previousStateParams = fromParams;


                    $translate(titleKey).then(function(title) {
                        // Change window title with translated one
                        $rootScope.title = title;
                    });
                });

            }
        ]);

    angular
        .module('BeautyCollective.Core').factory('XSRFInterceptor', ['utilFactory', function(utilFactory) {
            var XSRFInterceptor = {
                request: function(config) {
                    var token = utilFactory.readCookie('XSRF-TOKEN');
                    if (token) {
                        config.headers['X-XSRF-TOKEN'] = token;
                    }
                    return config;
                }
            };
            return XSRFInterceptor;
        }]);

    /**
     * override spinner methods
     */
    angular
        .module('BeautyCollective.Core').factory('Spinner', ['usSpinnerService', function(usSpinnerService) {
            var Spinner = {
                start: function(spinnerId) {
                    spinnerId ? usSpinnerService.spin(spinnerId) : usSpinnerService.spin('global_spinner');
                },
                stop: function(spinnerId) {
                    spinnerId ? usSpinnerService.stop(spinnerId) : usSpinnerService.stop('global_spinner');
                }
            };
            return Spinner;
        }]);

 })();
