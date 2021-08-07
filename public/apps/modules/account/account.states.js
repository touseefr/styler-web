(function() {
    'use strict';
    /**
     * @ngdoc config
     *
     * @name BeautyCollective.Account.config.AccountState
     * @module BeautyCollective.Account
     *
     * @description
     * Configure Account module routes
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Account')
        .config(AccountState);

    /* @ngInject */
    function AccountState($stateProvider, APP_CONFIG, $urlRouterProvider) {
        $stateProvider.state('account', {
            url: '/',
            parent: 'dashboard',
            views: {
                'dashboard_view@dashboard': {
                    templateUrl: APP_CONFIG.modules + '/account/account-layout.html',
                    controller: 'AccountController as _acountCtrl'
                },
                'dashboard_top_view@dashboard': {
                     templateUrl: APP_CONFIG.modules + '/account/account-top-layout.html',
                     controller: 'AccountController as _acountCtrl'
                }
            },
            resolve: {
                ResolveData: ['AccountModel', '$q', function(AccountModel, $q) {
                    var deferred = $q.defer();
                    AccountModel.find({id:null}).then(function(response) {
					deferred.resolve({
                        'user': response
                        });
                    }, function(error) {
                        deferred.resolve({});
                    });
                    return deferred.promise;
                }]
            }
        });
    }
})();
