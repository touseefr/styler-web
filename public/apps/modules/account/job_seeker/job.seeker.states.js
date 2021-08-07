(function() {
    'use strict';
    /**
     * @ngdoc config
     *
     * @name BeautyCollective.Account.config.JobSeekerStates
     * @module BeautyCollective.Account
     *
     * @description
     * Configure Account module routes
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Account')
        .config(JobSeekerStates);

    /* @ngInject */
    function JobSeekerStates($stateProvider, APP_CONFIG) {

        $stateProvider.state('job_seeker', {
            parent: 'account',
            absolute: true,
            url: '^/job_seeker',
            views: {
                'account_content_view': {
                    template: '<div ui-view="account_job_seeker_view" class="fadeIn animated"></div>'
                },
                'account_top_nav_view' : {
                    templateUrl: APP_CONFIG.modules + '/account/job_seeker/job_seeker-nav.html'
                }
            }
        }).state('job_seeker.find-job-seeker', {
            parent: 'job_seeker',
            url: '/find-job-seeker',
            views: {
                'account_job_seeker_view@job_seeker': {
                    templateUrl: APP_CONFIG.modules + '/account/job_seeker/find-job-seeker.html',
                    controller: 'JobSeekerController as _self'
                }
            }
        });
    }
})();
