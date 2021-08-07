(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.AccountSettingsController
     * @module BeautyCollective.Account
     *
     * @description
     * AccountSettingsController is responsible manage user's review
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

    /* @ngInject */
    function AccountSettingsController($state, AccountModel, ResolveData, toaster, SuburbsModel, $http, Spinner, $location,CSRF_TOKEN) {
        var self = this;
        init();


        /**
         * initialize properties
         * 
         * @private
         * @return {void}
         */

        function init() {
            /**
             * get suburbList
             * 
             * @private
             * @return {void}
             */
            self.suburbList = [];
            self.host = $location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : '');
            self.Role = ResolveData.roles[0].name;
			self.csrf_token= CSRF_TOKEN;
			/**
             * get userdata
             * 
             * @private
             * @return {void}
             */
			self.is_plan_expire = 1; 
			//console.log(ResolveData.user_payment_info);
			if(ResolveData.user_payment_info.length){
				var date = moment(ResolveData.user_payment_info[ResolveData.user_payment_info.length-1].created_at);
				date.add(30, 'days');
				var days = date.diff(moment(), 'days')
				if( days <=30 && days >=0 ) self.is_plan_expire = 0; 
				ResolveData.user_payment_info[ResolveData.user_payment_info.length-1].next_payment_date =   date.format('MMM-DD-YYYY');
			}
			
            self.userModel = {
                'id': ResolveData.id,
                'name': ResolveData.name,
				'password': '',
                'about': (ResolveData.user_info) ? ResolveData.user_info.about : '',
                'address': (ResolveData.user_info) ? ResolveData.user_info.address : '',
				'contactnumber': (ResolveData.user_info) ? ResolveData.user_info.contact_number : '',
                'suburb': (ResolveData.user_info && ResolveData.user_info.user_suburb) ? ResolveData.user_info.user_suburb : null,
                'email': ResolveData.email,
                'logo' : (ResolveData.profilepic && ResolveData.profilepic.name) ? ResolveData.profilepic.path + 'thumb_small_' + ResolveData.profilepic.name : null,
                'video' : (ResolveData.profilevideo && ResolveData.profilevideo.name) ? ResolveData.profilevideo.name : null,
                'paymentInfo' : ResolveData.user_payment_info,
                'jobnotifications' : (ResolveData.job_notifications=="1") ? true : false
            };

            // console.log(ResolveData.user.id);
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
                        id: self.userModel.id,
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
            Spinner.stop();
			var obj = JSON.parse($res);
            self.userModel.logo = obj.path+'thumb_small_'+obj.name;
            toaster.pop('success', "Logo Uploaded", "Logo has been uploaded successfully.");
        };


        /**
         * change user profile pic
         * 
         * @params {images chunks}
         * @return {object}
         */

        self.videoflowConfig = function() {
            return {
                target: '/uploadvideo',
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
                        id: self.userModel.id,
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
        self.videoUploadSuccess = function($file, $res) {
           Spinner.stop();
           var obj = JSON.parse($res);
           self.userModel.video = obj.name;
           toaster.pop('success', "Video Uploaded", "Video has been uploaded successfully.");
        };
    }
    //end of controller

    angular
        .module('BeautyCollective.Account')
        .controller('AccountSettingsController', AccountSettingsController);
})();
