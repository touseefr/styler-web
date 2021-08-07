(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.UserController
     * @module BeautyCollective.Account
     *
     * @description
     * UserController is responsible manage user's review
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

    /* @ngInject */
    function UserController($state,SuburbsModel,AccountModel,ResolveData,toaster, Spinner) {
        var self = this;
        init();

        /**
         * initialize properties
         * 
         * @private
         * @return {void}
         */

        function init() {
            self.suburbList =[];
            self.userModel = {
                'id':ResolveData.id,
                'name':ResolveData.name,
                'address':(ResolveData.user_info) ? ResolveData.user_info.address:'',
                'suburb':(ResolveData.user_info && ResolveData.user_info.user_suburb) ? ResolveData.user_info.user_suburb:null,
                'email':ResolveData.email
            };
        }

        /**
         * save user data
         * 
         * @private
         * @return {void}
         */

        self.saveuser = function() {
            Spinner.start();
            var _user = angular.copy(self.userModel),
                resource = AccountModel.update({
                    id: _user.id
                }, _user);
            resource.then(function(successResponse) {
                toaster.pop('success', "Detail Save", "Details has been updated.");
                Spinner.stop();
            }, function(errorResponse) {
                console.log('Saving Details:', errorResponse);
                Spinner.stop();
            });
        };

        /**
         * getLocation
         * search locations based on search text
         * search is performed on postcode and city name
         * 
         * @param  {[string]}
         * @return {[void]}
         */
        self.getLocation = function(val) {
            if (val.length < 3) {
                return;
            }
            Spinner.start();
            SuburbsModel.findLocation({
                'q': val
            }).then(function(successResponse) {
                self.suburbList = successResponse.list;
                Spinner.stop();
            }, function(errorResponse) {
                console.info('Getting locations:', errorResponse);
                Spinner.stop();
            });

        };

        /**
         * model options
         * applied to search location ui-select to debounce the model changes
         * 
         * @type {Object}
         */
        self.modelOptions = {
            debounce: {
                default: 500
            },
            getterSetter: true
        };

        

    }
    //end of controller

    angular
        .module('BeautyCollective.Account')
        .controller('UserController', UserController);
})();
