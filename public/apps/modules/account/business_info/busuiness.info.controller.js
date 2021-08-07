(function() {
	'use strict';
	/**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.AccountBusinessInfoController
     * @module BeautyCollective.Account
     *
     * @description
     * AccountBusinessInfoController is responsible manage user's business info
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

	/* @ngInject */
	function AccountBusinessInfoController(
		$state,
		AccountModel,
		AccountFactory,
		ResolveData,
		toaster,
		SuburbsModel,
		CategoriesModel,
		Spinner,
	) {
		var self = this;

		self.timeOptions = {
			readonlyInput: false,
			showMeridian: true,
		};

		/**
         * get suburbList
         * 
         * @private
         * @return {void}
         */
		self.suburbList = [];
		/**
         * get suburbList
         * 
         * @private
         * @return {void}
         */
		self.categoriesList = [];
		// self.count = 0;

		/**
         * initialize properties
         * 
         * @private
         * @return {void}
         */
		init();

		function init() {
			/**
             * get userInfo
             * 
             * @private
             * @return {void}
             */

			self.userBusinessModel = ResolveData.user_business
				? {
						id: ResolveData.id,
						name: ResolveData.user_business.business_name,
						website: ResolveData.user_business.website,
						address: ResolveData.user_business.business_address,
						locations: ResolveData.user_business.user_business_suburb
							? [ ResolveData.user_business.user_business_suburb ]
							: [],
						email: ResolveData.user_business.business_email,
						contactnumber: ResolveData.user_business.contact_number,
						about: ResolveData.user_business.about,
						logo:
							ResolveData.profilepic && ResolveData.profilepic.name
								? ResolveData.profilepic.path + 'thumb_small_' + ResolveData.profilepic.name
								: null,
						video:
							ResolveData.profilevideo && ResolveData.profilevideo.name
								? ResolveData.profilevideo.path + ResolveData.profilevideo.name
								: null,
						categories: ResolveData.user_business.business_categories
							? angular.fromJson(ResolveData.user_business.business_categories)
							: [],
						work_with_overseas_students: ResolveData.user_business.work_with_overseas_students,
						government_assistance: ResolveData.user_business.government_assistance,
					}
				: {
						id: ResolveData.id,
					};

			console.log(self.userBusinessModel);
			self.bussinessDays = AccountFactory.getDefaultBusinessDays();
			self.bussinessHours =
				ResolveData.user_business && ResolveData.user_business.operating_hours
					? angular.fromJson(ResolveData.user_business.operating_hours)
					: AccountFactory.getDefaultBusinessHours();
		}

		/**
         * save user business data
         * 
         * @private
         * @return {void}
         */

		self.updateBusinessInfo = function() {
			Spinner.start();
			if (self.userBusinessModel.hasOwnProperty('id')) {
				self.userBusinessModel.operating_hours = angular.toJson(self.bussinessHours);
				self.userBusinessModel.categories = angular.toJson(self.userBusinessModel.categories);
			}
			var _business = angular.copy(self.userBusinessModel),
				resource;
			_business.locations = _.map(_business.locations, function(location) {
				return location.id;
			});

			resource = AccountModel.updatebusiness(
				{
					id: _business.id,
				},
				_business,
			);
			resource.then(
				function(successResponse) {
					toaster.pop('success', 'Business Detail Save', 'Business Details has been saved Successfully.');
					Spinner.stop();
				},
				function(errorResponse) {
					Spinner.stop();
					console.log('Saving Business Detail:', errorResponse);
				},
			);
		};

		/**
         * @param  {[type]}
         * @return {[type]}
         */
		self.getLocation = function(val) {
			if (val.length < 3) {
				return;
			}
			Spinner.start();
			SuburbsModel.findLocation({
				q: val,
			}).then(
				function(successResponse) {
					self.suburbList = successResponse.list;
					Spinner.stop();
				},
				function(errorResponse) {
					console.log('Saving Details:', errorResponse);
					Spinner.stop();
				},
			);
		};

		/**
         * @param  {[type]}
         * @return {[type]}
         */
		self.getCategories = function(val) {
			if (val.length < 3) {
				return;
			}
			CategoriesModel.searchcategories({
				q: val,
			}).then(
				function(successResponse) {
					self.categoriesList = successResponse.list;
				},
				function(errorResponse) {
					console.log('Saving Details:', errorResponse);
				},
			);
		};

		self.flowConfig = function() {
			return {
				target: '/uploadprofilepic',
				permanentErrors: [ 404, 500, 501 ],
				maxChunkRetries: 1,
				chunkRetryInterval: 5000,
				simultaneousUploads: 1,
				singleFile: true,
				headers: {
					'X-CSRF-TOKEN': csrf_token,
				},
				query: function(flowFile, flowChunk) {
					Spinner.start();

					// function will be called for every request
					return {
						id: self.userBusinessModel.id,
						source: 'flow_query',
					};
				},
			};
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
			self.userBusinessModel.logo = obj.path + 'thumb_small_' + obj.name;
			toaster.pop('success', 'Logo Uploaded', 'Logo has been uploaded successfully.');
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
				permanentErrors: [ 404, 500, 501 ],
				maxChunkRetries: 1,
				chunkRetryInterval: 5000,
				simultaneousUploads: 1,
				singleFile: true,
				headers: {
					'X-CSRF-TOKEN': csrf_token,
				},
				query: function(flowFile, flowChunk) {
					Spinner.start();
					// function will be called for every request
					return {
						id: self.userBusinessModel.id,
						source: 'flow_query',
					};
				},
			};
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
			self.userBusinessModel.video = obj.path + obj.name;
			toaster.pop('success', 'Video Uploaded', 'Video has been uploaded successfully.');
		};

		/**
         * Remove user logo
         * 
         * @params {images chunks}
         * @return {object}
         */

		self.removeLogo = function($event, user_id) {
			$event.preventDefault();
			if (confirm('Are you sure you want to delete your logo?')) {
				Spinner.start();
				AccountModel.deleteLogo({ id: user_id }).then(
					function(responseData) {
						self.userBusinessModel.logo = '';
						toaster.pop('success', 'Delete Logo', 'Logo has been deleted successfully.');
						Spinner.stop();
					},
					function(errorResponse) {
						Spinner.stop();
					},
				);
			}
		};

		/**
         * Get Address Suggestions
         * 
         * Input
         * @return {object}
         */

		// self.getSuggestions = function($event) {
		//    self.count++;

		//    console.log(self.count);
		// };

		/**
         * Remove user Video
         * 
         * @params {images chunks}
         * @return {object}
         */

		self.removeVideo = function($event, user_id) {
			$event.preventDefault();
			if (confirm('Are you sure you want to delete your video?')) {
				Spinner.start();
				AccountModel.deleteVideo({ id: user_id }).then(
					function(responseData) {
						self.userBusinessModel.video = '';
						toaster.pop('success', 'Delete Video', 'Video has been deleted successfully.');
						Spinner.stop();
					},
					function(errorResponse) {
						Spinner.stop();
					},
				);
			}
		};

		self.modelOptions = {
			debounce: {
				default: 500,
			},
			getterSetter: true,
		};
	}
	//end of controller

	angular
		.module('BeautyCollective.Account')
		.controller('AccountBusinessInfoController', AccountBusinessInfoController);
})();
