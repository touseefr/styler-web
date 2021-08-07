(function() {
    'use strict';
    /**
     * @ngdoc config
     *
     * @name BeautyCollective.Account.config.AccountReviewStates
     * @module BeautyCollective.Account
     *
     * @description
     * Configure Account module routes
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Account')
        .config(AccountReviewStates);

    /* @ngInject */
    function AccountReviewStates($stateProvider, APP_CONFIG) {

        $stateProvider.state('reviews', {
            parent: 'account',
            absolute: true,
            url: '^/reviews',
            views: {
                'account_content_view': {
                    template: '<div ui-view="reviews_view" class="fadeIn animated"></div>'
                },
                'account_top_nav_view' : {
                    templateUrl: APP_CONFIG.modules + '/account/reviews/reviews-nav.html'
                }
            }
        }).state('reviews.dashbaord', {
            parent: 'reviews',
            url: '/dashbaord',
            views: {
                'reviews_view@reviews': {
                    templateUrl: APP_CONFIG.modules + '/account/reviews/dashboard.html',
                    controller: 'ReviewsController as _self'
                }
            }resolve: {
                ResolveData: function(ResolveData){
                return ResolveData.user;
                }
            }
        }).state('reviews.received-reviews', {
            parent: 'reviews',
            url: '/received-reviews',
            views: {
                'reviews_view@reviews': {
                    templateUrl: APP_CONFIG.modules + '/account/reviews/received-reviews.html',
                    controller: 'ReviewsController as _self'
                }
            },
            resolve: {
                ResolveData: function(ResolveData){
                return ResolveData.user;
                }
            }
        }).state('reviews.request', {
            parent: 'reviews',
            url: '/request',
            views: {
                'reviews_view@reviews': {
                    templateUrl: APP_CONFIG.modules + '/account/reviews/request-review.html',
                    controller: 'ReviewsController as _self'
                }
            }
        }).state('reviews.submit_review', {
            parent: 'reviews',
            url: '/submit',
            views: {
                'reviews_view@reviews': {
                    templateUrl: APP_CONFIG.modules + '/account/reviews/submit-review.html',
                    controller: 'ReviewsController as _self'
                }
            }
        }).state('reviews.faqs', {
            parent: 'reviews',
            url: '/faqs',
            views: {
                'reviews_view@reviews': {
                    templateUrl: APP_CONFIG.modules + '/account/reviews/review-faqs.html',
                    controller: 'ReviewsController as _self'
                }
            }
        });
    }
})();

