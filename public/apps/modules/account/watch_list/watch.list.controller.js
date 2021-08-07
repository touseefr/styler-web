(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.WatchListController
     * @module BeautyCollective.Account
     *
     * @description
     * WatchListController is responsible manage user's WatchList
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */ 

    /* @ngInject */
    function WatchListController($state,AccountModel,toaster,$location) {
        var self = this;
		self.statusText = "";
        
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
             self.watchlist = [];
			 self.getWatchList();
			 self.currentPage = 0;
             self.pageSize = 6;
			 self.host = '.';
        }

        /**
        * getWatchList
        * @params {Object}
        * @return {id}
        */
        self.getWatchList = function(){
          return AccountModel.getWatchList().then(function(responce) {
                self.watchlist = responce.watch_list;
				if(self.watchlist.length){
					self.statusText = "";
					_.each(self.watchlist, function(list, index){
						if(list.type === 'job'){
							list.url = 'jobs';
						}
						if(list.type === 'classified'){
							list.url = 'classifieds';
						}
						if(list.type === 'gallery'){
							list.url = 'gallery';
						}
						if(list.type === 'businessforsale'){
							list.url = 'business';
						}
						if(list.type === 'deal'){
							list.url = 'deals';
						}
					});
					self.numberOfPages= function(){
						return Math.ceil(self.watchlist.length/self.pageSize); 
					};
				}else{
					self.statusText = "No Record Found";
				}
            }, function(error) {
                return [];
            });
        }; 
		
		init();
    }
    //end of controller

    angular
        .module('BeautyCollective.Account')
        .controller('WatchListController', WatchListController);
})();
