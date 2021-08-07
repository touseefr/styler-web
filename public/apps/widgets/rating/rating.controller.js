(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.RatingController
     * @module BeautyCollective.Widgets
     *
     * @description
     * RatingController is responsible for user rating
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .controller('RatingController', RatingController);

    /* @ngInject */

    function RatingController($sanitize,$q, Logger, Spinner, RatingModel,toaster) {

        /**
         * [self description]
         * @type {[type]}
         */
        var self = this;
		init();
        /**
         * [init description]
         * @return {void}
         */
        function init() {
           Logger.getInstance('RatingController').info('Rarting Controller has initialized');
		   self.rate = 0;
		   self.max = 5;
		   self.isReadonly = true;
		   if(self.userfrom || self.userfrom!==self.userto) self.isReadonly = false;
        }
		

    	  self.hoveringOver = function(value) {
            self.overStar = value;
    		self.percent = 100 * (value / self.max);
    	  };

		  self.ratingStates = [
			{stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
			{stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
			{stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
			{stateOn: 'glyphicon-heart'},
			{stateOff: 'glyphicon-off'}
		  ];
		  
		  self.saveRating = function() {
            if(!self.userfrom) return false;
				RatingModel.saveRating({'rate':self.rate,
                         'requestType':"save",
                         'to':self.userto}).then(function(responce){
							 self.rate = responce.rating;
							},function(error){
                             
                });
		 };
		 
		 /**
		* Save Review
		* @params {Object}
		* @return {id}
		*/
		
		 self.saveReview = function() {
		   var _review = angular.copy(self.review);
		   Spinner.start();
		   RatingModel.save({
                    'review': _review,
                    'rate':self.rate,
                    'to_user': self.userto
           }).then(function(responce){
						if(responce.status && responce.status=='Already Review'){
							toaster.pop('error', "Already Reviewed", "You have already review this user.");
						}else{
							toaster.pop('success', "Review Saved", "Review has been saved successfully.");
						}
						self.review = '';
						self.rate = 0;
						Spinner.stop();
				},function(error){
                    Spinner.stop();         
            });
		 };
    }
})();
