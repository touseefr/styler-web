(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Serviceprovider.Controller.ListListingController
     * @module BeautyCollective.Listing
     *
     * @description
     * ListListingController is responsible manage user listing
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

    /* @ngInject */
    function ListListingController(CategoriesModel, ListingModel, Listing_type,$location,moment,toaster,Spinner,$state) {
        var self = this;
         self.listing = '';
        init();

        /**
         * initialize properties
         * 
         * @private
         * @return {void}
         */

        function init() {
			getListings();
            self.currentPage = 0;
            self.pageSize = 4;
			self.host = $location.protocol() +'://'+$location.host();
        }


		/**
		* Get all the listing of a user
		*
		* @private
		* get user Listing
		* @return {Object | JSON | cuserlisting}
		*/
        function getListings() {
            ListingModel.findAll({per_page:999999}).then(function(data) {
                self.listing = angular.copy(data.list);
                
				_.each(self.listing.data, function(list, index){
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth()+1; //January is 0!
                    var yyyy = today.getFullYear();
                    var date = yyyy+'-'+mm+'-'+dd;
                    var a = moment(date, 'YYYY-MM-DD');
                    var b = moment(list.expiry, 'YYYY-MM-DD');
                    self.listing.data[index].daysleft = b.diff(a, 'days');

                    if(list.type === 'job'){
                        self.listing.data[index].url = 'jobs';
                    }
					if(list.type === 'classified'){
                        self.listing.data[index].url = 'classifieds';
                    }
					if(list.type === 'gallery'){
                        self.listing.data[index].url = 'gallery';
                    }
					if(list.type === 'businessforsale'){
                        self.listing.data[index].url = 'business';
                    }
					if(list.type === 'deal'){
                        self.listing.data[index].url = 'deals';
                    }
                })
				
				self.numberOfPages=function(){
                    return Math.ceil(self.listing.data.length/self.pageSize);                
                }
            });
        }


        self.delete = function($event, list_id){
            $event.preventDefault();
            if(confirm('Are you sure you want to delete this listing.')){
				Spinner.start();
				ListingModel.delete({id:list_id}).then(function(responseData){
					_.each(self.listing.data, function(list, index){
						if(list && list.id && list.id === list_id){
							Spinner.stop();
							self.listing.data.splice(index, 1);
							toaster.pop('success', "Listing Deleted", "Listing has been deleted successfully.");
							$state.go($state.current, {}, {reload: true});
							return;
						}
					})
				},function(errorResponse){
					console.log('unable to delete list : ', errorResponse);
				})
			}
        };

      

    }
    //end of controller

    angular
        .module('BeautyCollective.Listing')
        .controller('ListListingController', ListListingController);
})();
