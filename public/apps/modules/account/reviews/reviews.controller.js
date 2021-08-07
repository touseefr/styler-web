(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.ReviewsController
     * @module BeautyCollective.Account
     *
     * @description
     * ReviewsController is responsible manage user's review
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

    /* @ngInject */
    function ReviewsController(ReviewModel,$state,utilFactory,toaster,Spinner,AccountModel,ResolveData) {
        var self = this;
        init();
		self.reviewList='';
        self.userList=[];
        /**
         * initialize properties
         * 
         * @private
         * @return {void}
         */

        function init() {
			if($state.current.name=='reviews.dashbaord'){
				getReviewlist();
			}
            self.rate = 0;
            self.max = 5;
            self.isReadonly = false;
            self.OverallRating = 0;
            self.currentPage = 0;
            self.pageSize = 2;
        }
		
		/**
		* Save Review
		* @params {Object}
		* @return {id}
		*/
		self.saveReview = function(){
			if(ResolveData.user.id==self.user.id){
				toaster.pop('error', "Review not Saved", "Sorry you can't review yourself.");
				return false;
			}
			Spinner.start();
			var _review = angular.copy(self.review);
			ReviewModel.save({
                    'review': _review,
                    'rate':self.rate,
                    'to_user': self.user.id
			}).then(function(responce){
                if(responce.status && responce.status=='Already Review'){
					toaster.pop('error', "Already Reviewed", "You have already review this user.");
				}else{
					toaster.pop('success', "Review Saved", "Review has been saved successfully.");
				}
				self.review = '';
                self.rate=0;
                 Spinner.stop();
            },function(error){
                Spinner.stop();
            });
		};
		 
		/**
		* Request Review
		* @params {Object}
		* @return {id}
		*/
		self.requestReview = function() {
			Spinner.start();
			ReviewModel.requestReview({
                    'customerName': self.customerName,
                    'customerEmail':self.emailAddress
			}).then(function(responce){
				toaster.pop('success', "Review Request", "Review request has been sent successfully.");
				$state.transitionTo($state.current,{}, {reload: true});
				Spinner.stop();
			});
		};
		/**
        * getUsers
        * @params {Object}
        * @return {id}
        */
        self.getUsers = function(txt) {
            if (txt.length < 3) {
                return;
            }
            Spinner.start();
            //console.log(txt);
            AccountModel
                .getUsers({
                    'q': txt
                }).then(function(successResponse) {
                     self.userList = angular.copy(successResponse);
                }, function(errorResponse) {
                    console.log('Error:');
                });
            Spinner.stop();
        };


        /**
        * modelOptions
        * 
        */

         self.modelOptions = {
            debounce: {
                default: 500
            },
            getterSetter: true
         };

        /**
        * Rating hover
        * @params {Object}
        * @return {id}
        */
         self.hoveringOver = function(value) {
            self.overStar = value;
            self.percent = 100 * (value / self.max);
          };
		 
		 /**
		* Delete Review
		* @params {index | id | integer}
		* @return {void}
		*/
		 self.deleteReview = function(index,id){
		  ReviewModel.delete({
            'id': id
          });
		  self.reviewList.data.splice(index,1);
		 }
		 
		 /**
		* Users Review
		* @params {index | id | integer}
		* @return {void}
		*/
		function getReviewlist() {
			ReviewModel.all({
                'to_user': ResolveData.user.id
            }).then(function(response) {
			    self.reviewList = angular.copy(response);
                self.numberOfPages=function(){
					return Math.ceil(self.reviewList.data.length/self.pageSize);                
				}
				var _totalrating = 0;
				angular.forEach(self.reviewList.data, function(value, key) {
				  _totalrating += parseInt(value.rating);
				});
				if(self.reviewList.data.length)
				self.OverallRating = _totalrating/self.reviewList.data.length;
            });
        }
	}
    //end of controller

    angular
        .module('BeautyCollective.Account')
        .controller('ReviewsController', ReviewsController);
})();
