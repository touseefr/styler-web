(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.BlogController
     * @module BeautyCollective.Blog
     *
     * @description
     * WatchListController is responsible manage user's WatchList
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

    /* @ngInject */
    function BlogController($state,BlogModel,toaster) {
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
             self.bloglist = [];
			 self.getBlogList();
			//  self.currentPage = 0;
            //  self.pageSize = 6;
			//  self.host = '.';
        }

        /**
        * getWatchList
        * @params {Object}
        * @return {id}
        */
        self.getBlogList = function(){
          return BlogModel.getBlogList().then(function(responce) {
                self.bloglist = responce.blog_list;
				if(self.bloglist.length){
					self.statusText = "";
					_.each(self.bloglist, function(list, index){
						if(list.type === 'b'){
							list.url = 'b';
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
        .module('BeautyCollective.Blog')
        .controller('WatchListController', BlogController);
})();
