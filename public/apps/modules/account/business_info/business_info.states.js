(function() {
    'use strict';
    /**
     * @ngdoc config
     *
     * @name BeautyCollective.Account.config.AccountBusinessInfoStates
     * @module BeautyCollective.Account
     *
     * @description
     * Configure Account module routes
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Account')
        .config(AccountBusinessInfoStates);

    /* @ngInject */
    function AccountBusinessInfoStates($stateProvider, APP_CONFIG) {

        $stateProvider.state('business_info', {
            parent: 'account',
            absolute: true,
            url: '^/business_info',
            views: {
                'account_content_view': {
                    template: '<div ui-view="account_business_info_view" class="fadeIn animated"></div>'
                },
                'account_top_nav_view' : {
                    templateUrl: APP_CONFIG.modules + '/account/business_info/business_info-nav.html'
                }
            }
        }).state('business_info.basic_info', {
            parent: 'business_info',
            url: '/basic-info',
            views: {
                'account_business_info_view@business_info': {
                    templateUrl: APP_CONFIG.modules + '/account/business_info/basic-info.html',
                    controller: 'AccountBusinessInfoController as _self'
                }
            },
            resolve: {
                ResolveData: function(ResolveData){
                    return ResolveData.user;
                }
            }
        }).state('business_info.operation_time', {
            parent: 'business_info',
            url: '/operation-time',
            views: {
                'account_business_info_view@business_info': {
                    templateUrl: APP_CONFIG.modules + '/account/business_info/operation-time.html',
                    controller: 'AccountBusinessInfoController as _self'
                }
            },
            resolve: {
                ResolveData: function(ResolveData){
                    return ResolveData.user;
                }
            }
        }).state('business_info.faqs', {
            parent: 'business_info',
            url: '/faqs',
            views: {
                'account_business_info_view@business_info': {
                    templateUrl: APP_CONFIG.modules + '/account/business_info/business-faqs.html',
                    controller: 'AccountBusinessInfoController as _self'
                }
            },
            resolve: {
                ResolveData: function(ResolveData){
                    return ResolveData.user;
                }
            }
        });
    }
})();
