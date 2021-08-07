(function() {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Core.Constant.ENV
     * @module BeautyCollective.Core
     *
     * @description
     * Holds envoirment related properties
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Core')
        .constant('ENV', 'dev');

    angular
        .module('BeautyCollective.Core')
        .constant('CSRF_TOKEN', csrf_token);
    /**
     * @ngdoc overview
     * @name BeautyCollective.Core.Constant.APP_CONFIG
     * @module BeautyCollective.Core
     *
     * @description
     * Contains all static urls and configuration constants which are used in whole application
     *
     * If anything need to access in view(HTML) files then keep everything in view
     * and can be accessed by {{VIEW_CONFIG.assets}}
     */
    angular
        .module('BeautyCollective.Core')
        .constant('APP_CONFIG', {
            modules: '/apps/modules',
            components: '/apps/components',
            widgets: '/apps/widgets',
            sessionTimeout: 1800,
            notificationInterval: 60000,
            endPoint: '',
            GOOGLE: {
                MAP: {
                    KEY: 'AIzaSyCG6A6caq5LlVwI0k5MpfY02SHrJJKsO78'
                },
                CAPTCHA: {
                    SITE_KEY: '6LcR3gwTAAAAAEOPDjscoyuJKKKvFgFDYfZPNbnM',
                    SECRET_KEY: '6LcR3gwTAAAAAGwxaYHRpqVs_OwUK6gAOJyH1y0Q',
                    ENABLE: true
                }
            },
            item_per_page: 5,

        });
    /**
     * Angular moment configuration
     */
    angular
        .module('BeautyCollective.Core').constant('angularMomentConfig', {
            timezone: 'Asia/kolkata'
        });
})();
