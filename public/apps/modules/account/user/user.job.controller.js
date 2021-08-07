(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.UserJobController
     * @module BeautyCollective.Account
     *
     * @description
     * UserJobController is responsible manage user's review and jobs
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

    /* @ngInject */
    function UserJobController($state,AccountModel,JobResolveData) {
        var self = this;
        init();
       
        /**
         * initialize properties
         * 
         * @private
         * @return {void}
         */

        function init() {
            self.JobListing = (JobResolveData) ? JobResolveData : null;
            
        }

    }
    //end of controller

    angular
        .module('BeautyCollective.Account')
        .controller('UserJobController', UserJobController);
})();
