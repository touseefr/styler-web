(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.JobSeekerController
     * @module BeautyCollective.Account
     *
     * @description
     * JobSeekerController is responsible manage user's review
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

    /* @ngInject */
    function JobSeekerController($state,AccountModel,toaster) {
        var self = this;
		self.statusText = "";
        init();

        /**
         * initialize properties
         * 
         * @private
         * @return {void}
         */

        function init() {
             /**
             * [jobseeker list]
             * @True {Array}
             */
             self.jobseekerList = [];
        }

        /**
        * getJobSeaker
        * @params {Object}
        * @return {id}
        */
        self.getJobSeaker = function(){
          return AccountModel.getJobSeekers({
                'q': self.q
            }).then(function(responce) {
                self.jobseekerList = responce;
				if(self.jobseekerList.length){
					self.statusText = "";
				}else{
					self.statusText = "No Record Found";
				}
            }, function(error) {
                return [];
            });
        }   

    }
    //end of controller

    angular
        .module('BeautyCollective.Account')
        .controller('JobSeekerController', JobSeekerController);
})();
