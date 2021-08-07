(function() {
    'use strict';
    /**
     * @ngdoc config
     *
     * @name BeautyCollective.Account.config.UserStates
     * @module BeautyCollective.Account
     *
     * @description
     * Configure Account module routes
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Account')
        .config(UserStates);

    /* @ngInject */
    function UserStates($stateProvider, APP_CONFIG) {

        $stateProvider.state('user', {
            parent: 'account',
            absolute: true,
            url: '^/user',
            views: {
                'account_content_view': {
                    template: '<div ui-view="user_view" class="fadeIn animated"></div>'
                }
            }
        }).state('user.detail', {
                parent: 'user',
                url: '/detail',
                views: {
                    'user_view@user': {
                        templateUrl: APP_CONFIG.modules + '/account/user/user-details.html',
                        controller: 'UserController as _self'
                    }
                },
                resolve: {
                    ResolveData: function(ResolveData){
                        return ResolveData.user;
                    }
                }    
            
        }).state('user.reviews', {
            parent: 'user',
            url: '/reviews',
            views: {
                'user_view@user': {
                    templateUrl: APP_CONFIG.modules + '/account/user/user-reviews.html',
                    controller: 'UserController as _self'
                }
            }
        }).state('user.job_preferences', {
            parent: 'user',
            absolute : true,
            url: '/job',
            views: {
                'user_view@user': {
                    template: '<div ui-view="job_preferences_views" class="fadeIn animated"></div>'
                },
                'account_top_nav_view@account':{
                    templateUrl: function() {
                        return APP_CONFIG.modules + '/account/user/job-dashboard-nav.html'
                    }
                }
            },
            resolve: {
                JobResolveData: ['AccountModel', '$q', function(AccountModel, $q) {
                    var deferred = $q.defer();
                    AccountModel.findJob({id:null}).then(function(response) {
                    var jobs_applied = {};
					response.jobs_applied.forEach(function(obj){
						jobs_applied[obj.id] = obj;
					});
					var jobPreferred = response.jobs_preferred.filter(function(obj){
						return !(obj.id in jobs_applied);
					});
					deferred.resolve({
                        'jobs_applied': response.jobs_applied,
                        'jobs_preferred': jobPreferred,
                        'jobs_shortlisted': response.jobs_shortlisted
                        });
                    }, function(error) {
                        deferred.resolve({});
                    });
                    return deferred.promise;
                }]
            }
        }).state('user.job_preferences.dashboard', {
            parent: 'user.job_preferences',
            url: '^/job/dashboard',
            views: {
                'job_preferences_views@user.job_preferences': {
                    templateUrl: APP_CONFIG.modules + '/account/user/job_preferences_dashboard.html',
                    controller: 'UserJobController as _self'
                }
            },
            resolve: {
                JobResolveData: function(JobResolveData){
                    return JobResolveData.jobs_preferred;
                }
            } 
        }).state('user.job_preferences.shortlisted', {
            parent: 'user.job_preferences',
            url: '^/job/shortlisted',
            views: {
                'job_preferences_views@user.job_preferences': {
                    templateUrl: APP_CONFIG.modules + '/account/user/job_preferences_shortlisted.html',
                    controller: 'UserJobController as _self'
                }
            },
            resolve: {
                JobResolveData: function(JobResolveData){
                    return JobResolveData.jobs_preferred;
                }
            } 
        }).state('user.job_preferences.preferences', {
            parent: 'user.job_preferences',
            url: '^/job/preferences',
            views: {
                'job_preferences_views@user.job_preferences': {
                    templateUrl: APP_CONFIG.modules + '/account/user/job_preferences.html',
                    controller: 'UserJobController as _self'
                }
            },
            resolve: {
                JobResolveData: function(JobResolveData){
                    return JobResolveData.jobs_applied;
                }
            } 
        });
    }
})();
