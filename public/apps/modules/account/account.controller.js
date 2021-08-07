(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.AccountController
     * @module BeautyCollective.Account
     *
     * @description
     * AccountController is responsible manage account activities
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

    /* @ngInject */
    function AccountController($state,ResolveData,AccountModel,toaster, Spinner) {
        var self = this;
        init();

        /**
         * initialize properties
         * 
         * @private
         * @return {void}
         */

        function init() {
            self.userRole = ResolveData.user.roles[0].name;
            self.isAustralian = (ResolveData.user.user_info && ResolveData.user.user_info.is_australian=='yes') ? true : false;
            self.lookingJob = (ResolveData.user.user_info && ResolveData.user.user_info.looking_job=='yes') ? true : false; 
            self.userProfilepic = (ResolveData.user.profilepic) ? ResolveData.user.profilepic.path + ResolveData.user.profilepic.name : 'images/user_pic.jpg'; 
        }

        /**
         * save user looking for job or not
         * 
         * @params {flag | {true | false}}
         * @return {void}
         */

        self.lookingWork = function(flag){
            Spinner.start();
            self.lookingJob = flag;
            AccountModel.updateIndividualInfo(
                {'id':ResolveData.user.id},
                {'name':ResolveData.user.name,'lookingJob':self.lookingJob,'isAustralian':self.isAustralian})
                .then(function(successResponse) {
                    toaster.pop('success', "Detail Save", "Details has been updated.");
                    Spinner.stop();
                }, function(errorResponse) {
                    console.log('Saving Details:', errorResponse);
                    Spinner.stop();
                });
        };

         /**
         * save user is australian citizen or not
         * 
         * @params {flag | {true | false}}
         * @return {void}
         */

        self.Australian = function(flag){
            Spinner.start();
           self.isAustralian = flag; 
           AccountModel.updateIndividualInfo(
                {'id':ResolveData.user.id},
                {'name':ResolveData.user.name,'lookingJob':self.lookingJob,'isAustralian':self.isAustralian})
                .then(function(successResponse) {
                    toaster.pop('success', "Detail Save", "Details has been updated.");
                    Spinner.stop();
                }, function(errorResponse) {
                    //console.log('Saving Details:', errorResponse);
                    Spinner.stop();
                });
        };

        /**
         * change user profile pic
         * 
         * @params {images chunks}
         * @return {object}
         */

        self.flowConfig = function() {
            return {
                target: '/uploadprofilepic',
                permanentErrors: [404, 500, 501],
                maxChunkRetries: 1,
                chunkRetryInterval: 5000,
                simultaneousUploads: 1,
                singleFile: true,
                headers: {
                    'X-CSRF-TOKEN': csrf_token
                },
                query: function(flowFile, flowChunk) {
                    Spinner.start();
                    // function will be called for every request
                    return {
                        id: ResolveData.user.id,
                        source: 'flow_query'
                    };
                }
            }
        };

        /**
         * change profile pic if upload successfully
         * 
         * @params {Oject}
         * @return {void}
         */
        self.fileUploadSuccess = function($file, $res) {
            var obj = JSON.parse($res);
            self.userProfilepic = obj.path+obj.name;
             Spinner.stop();
        };

    }
    //end of controller

    angular
        .module('BeautyCollective.Account')
        .controller('AccountController', AccountController);
})();
