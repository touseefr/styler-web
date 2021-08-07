(function() {
    'use strict';
    /**
     * @ngdoc config
     *
     * @name BeautyCollective.Listing.config.ListingState
     * @module BeautyCollective.Listing
     *
     * @description
     * Configure listing module routes
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Listing')
        .config(ListingState);

    /* @ngInject */
    function ListingState($stateProvider, APP_CONFIG, $urlRouterProvider) {
        $stateProvider.state('listing', {
            parent: 'dashboard',
            absolute: true,
            url: '/listing',
            views: {
                'dashboard_view@dashboard': {
                    templateUrl: APP_CONFIG.modules + '/listing/listing-layout.html',
                    controller: 'ListingController as baseController'
                }
            }
        }).state('listing.list', {
            parent: 'listing',
            url: '/list',
            views: {
                'listing_view@listing': {
                    templateUrl: APP_CONFIG.modules + '/listing/list/list.html',
                    controller: 'ListListingController as listingCtrl'
                }
            },
            resolve: {
                Model: ['ListingModel', '$stateParams', function(ListingModel, $stateParams) {
                    return ListingModel;
                }],
                Listing_type: function($stateParams) {
                    return $stateParams.listing_type;
                }
            }
        }).state('listing.list1', {
            parent: 'listing',
            url: '/list1',
            views: {
                'listing_view@listing': {
                    templateUrl: APP_CONFIG.modules + '/listing/list/list1.html',
                    controller: 'ListListingController as listingCtrl'
                }
            },
            resolve: {
                Model: ['ListingModel', '$stateParams', function(ListingModel, $stateParams) {
                    return ListingModel;
                }],
                Listing_type: function($stateParams) {
                    return $stateParams.listing_type;
                }
            }
        }).state('listing.create', {
            parent: 'listing',
            url: '/create',
            views: {
                'listing_view@listing': {
                    templateUrl: APP_CONFIG.modules + '/listing/create/create.html',
                    //controller: 'ListingController as listingCtrl'
                }
            }
        }).state('listing.create.list', {
            parent: 'listing.create',
            url: '/:listing_type',
            views: {
                'create_listing_view@listing.create': {
                    templateUrl: function($stateParams) {
                        return APP_CONFIG.modules + '/listing/partials/' + $stateParams.listing_type + '.form.html'
                    },
                    controller: 'CreateListingController as createListCtrl'
                }
            },
            resolve: {
                Listing_type: function($stateParams) {
                    return $stateParams.listing_type;
                }
            }
        }).state('listing.create.list.update', {
            parent: 'listing.create',
            url: '^/update/:listing_type/:list_id',
            views: {
                'create_listing_view@listing.create': {
                    templateUrl: function($stateParams) {
                        return APP_CONFIG.modules + '/listing/partials/' + $stateParams.listing_type + '.form.html'
                    },
                    controller: 'CreateListingController as createListCtrl'
                }
            },
            resolve: {
                Listing_type: function($stateParams) {
                    return $stateParams.listing_type;
                }
            }
        });
    }
})();
