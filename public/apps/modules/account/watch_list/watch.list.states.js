(function() {
    'use strict';
    /**
     * @ngdoc config
     *
     * @name BeautyCollective.Account.config.WatchListStates
     * @module BeautyCollective.Account
     *
     * @description
     * Configure Account module routes
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Account')
        .config(WatchListStates);

    /* @ngInject */
    function WatchListStates($stateProvider, APP_CONFIG) {
		$stateProvider.state('watchlist', {
            parent: 'account',
            url: '^/watchlist',
            views: {
                'account_content_view': {
                    templateUrl: APP_CONFIG.modules + '/account/watch_list/watch-list.html',
                    controller: 'WatchListController as _self'
                },
				'account_top_nav_view' : {
                    templateUrl: APP_CONFIG.modules + '/account/watch_list/watch-list-nav.html'
                }
            }
        });
    }
})();
