(function() {
    'use strict';
    /**
     * @ngdoc config
     *
     * @name BeautyCollective.Account.config.AccountSettingsStates
     * @module BeautyCollective.Account
     *
     * @description
     * Configure Account module routes
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Account')
        .config(AccountSettingsStates);

    /* @ngInject */
    function AccountSettingsStates($stateProvider, APP_CONFIG) {
        $stateProvider.state('settings', {
            parent: 'account',
            absolute: true,
            abstract: true,
            url: '^/settings',
            views: {
                'account_content_view': {
                    template: '<div ui-view="account_settings_view" class="fadeIn animated"></div>'
                    
                },
                'account_top_nav_view' : {
                    templateUrl: APP_CONFIG.modules + '/account/settings/settings-nav.html'
                }
            }
        }).state('settings.details', {
            parent: 'settings',
			data: {
			  roles: []
			},
            url: '/details',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/settings/details.html',
                    controller: 'AccountSettingsController as _self'
                }
            },
            resolve: {
                ResolveData: function(ResolveData){
                return ResolveData.user;
                }
            }
            
        }).state('settings.payments_methods', {
            parent: 'settings',
            url: '/payments_methods',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/settings/payments_methods.html',
                    controller: 'AccountSettingsController as _self'
                }
            },
            resolve: {
                ResolveData: function(ResolveData){
                return ResolveData.user;
                }
            }
        }).state('settings.invoice', {
            parent: 'settings',
            url: '/invoice',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/settings/invoice.html',
                    controller: 'AccountSettingsController as _self'
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
