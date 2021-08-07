(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.SearchController
     * @module BeautyCollective.Widgets
     *
     * @description
     * SearchResultController is responsible for search listings
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .controller('SearchResultController', SearchResultController);

    /* @ngInject */

    function SearchResultController($sanitize, $q, Logger, Spinner, SearchResultModel,$location,moment,CategoriesModel,SuburbsModel) {

        /**
         * [self description]
         * @type {[type]}
         */

        var self = this;
        self.selectedTabs = [];
        self.suburbList = [];
		self.busy = false;
		self.page = 1;
		self.searchFilters=[];
		self.ratings = [{
			'id': '1',
			'value': 'Rating High To Low'
		},{
			'id': '2',
			'value': 'Rating Low To High'
		}];
		self.tabs = [{
			'id':'deal',
			'active':false,
			'showfilter':0,
			'label' : 'Deals',
			'url':'deals',
			'data':[],
			'aclass' : 'search_deal_icon',
			'subCategories':[],
			'sub_category':'',
			'location':''
		},{
			'id':'businessforsale',
			'active':false,
			'showfilter':0,
			'label' : 'Business for sale',
			'url':'business',
			'data':[],
			'aclass' : 'search_business_icon',
			'subCategories':[],
			'sub_category':'',
			'location':''
		},{
			'id':'schoolcolleges',
			'active':false,
			'showfilter':0,
			'label' : 'Schools & Colleges',
			'url':'schoolcolleges',
			'data':[],
			'aclass' : 'search_schoolcolleges_icon',
			'subCategories':[],
			'sub_category':'',
			'location':''
		},{
			'id':'gallery',
			'active':false,
			'showfilter':0,
			'label' : 'Gallery',
			'url':'gallery',
			'data':[],
			'aclass' : 'search_gallery_icon',
			'subCategories':[],
			'sub_category':'',
			'location':''
		},{
			'id':'serviceprovider',
			'active':false,
			'showfilter':0,
			'label' : 'Service Provider',
			'url':'profile',
			'data':[],
			'aclass' : 'search_serviceprovider_icon',
			'subCategories':[],
			'sub_category':'',
			'location':''
		},{
			'id':'job',
			'active':false,
			'showfilter':0,
			'label' : 'Jobs',
			'url':'jobs',
			'data':[],
			'aclass' : 'search_job_icon',
			'subCategories':[],
			'sub_category':'',
			'location':''
		},{
			'id':'classified',
			'active':false,
			'showfilter':0,
			'label' : 'Classifieds',
			'url':'classifieds',
			'data':[],
			'aclass' : 'search_classifieds_icon',
			'subCategories':[],
			'sub_category':'',
			'location':''
		}];

        init();

		self.selectTab = function(tab){
			
			_.each(self.tabs, function(list, index){
				
				if(list.id === tab.id){
				   if(list.active){
						if(self.selectedTabs.length > 1){
							self.tabs[index].active = false;
							self.qs.searchFor="";
							var tab_index='';
							_.each(self.selectedTabs, function(item, index){
								 if(item.id == tab.id) 
									 tab_index = index;
								 else self.qs.searchFor += item.id + ',';
								 //return;
							});
							self.qs.searchFor = _.trim(self.qs.searchFor,[',']);
							self.selectedTabs.splice(tab_index, 1);
						}
					}else{
						if(self.selectedTabs.length < 3){
							Spinner.start();
							self.tabs[index].active = true;
							self.qs.searchFor="";
							self.selectedTabs.push(tab);
							_.each(self.selectedTabs, function(item, index){
									self.selectedTabs[index].data = [];
									self.qs.searchFor += item.id + ','
							});
							self.qs.searchFor = _.trim(self.qs.searchFor,[',']);
							self.qs.page = 0;
							getRecords();
						}
					}
					//return;
					self.tabs[index].showfilter = 0;
				}
            });
		};
		
		self.showFilterTab = function(tab){
			_.each(self.tabs, function(list, index){
				if(list.id === tab.id){
					self.tabs[index].showfilter = 1;
					CategoriesModel.subcategories({
			                'cat_type': tab.id,
			            }).then(function(response) {
			                self.tabs[index].subCategories = response.list;
			            }, function() {
			        });
				}else{
					self.tabs[index].showfilter = 0;
				}
            });
		};
		
		self.hideFilterTab = function(){
			_.each(self.tabs, function(list, index){
				 self.tabs[index].showfilter = 0;
			});
		};

		self.filterRecords = function(tab){
			console.log(self.searchFilters);
			if(self.searchFilters.length){
				_.each(self.searchFilters, function(filter, index){
					if(filter && filter.id === tab.id){
						self.searchFilters.splice(index,1);

					}
				});
			}
			self.searchFilters.push({
				'id':tab.id,
				'rating' : tab.rating ? tab.rating : 0,
				'location' : tab.location.postcode ? tab.location.postcode : 0,
				'sub_category' : tab.sub_category});
			
			_.each(self.tabs, function(list, index){
				 self.tabs[index].showfilter = 0;
				 self.tabs[index].data = [];
			});
			self.qs.page = 0;
			getRecords();
		};
		
		self.nextPage = function(){
			getRecords();
		};

		self.getLocation = function(val) {
            if (val.length < 3) {
                return;
            }
            SuburbsModel
                .findLocation({
                    'q': val
                }).then(function(successResponse) {
                    self.suburbList = successResponse.list;
                }, function(errorResponse) {
                    console.log('Saving Details:', errorResponse);
                });

        };

        self.modelOptions = {
            debounce: {
                default: 500
            },
            getterSetter: true
        };


        /**
         * [init description]
         * @return {void}
         */
        function init() {
           Logger.getInstance('SearchResultController').info('Search Result Controller has initialized');
			self.qs = getQueryStrings();
			self.qs.page = 0;
			setSelecteTabs(self.qs['searchFor']);
			self.host = $location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : '') ;
			self.queryString = (self.qs['q'] ? 'q=' + self.qs['q'] : '') + (self.qs['state'] ? '&state=' + self.qs['state'] : '') + (self.qs['post'] ? '&post=' + self.qs['post'] : '');
			self.queryString = (self.queryString) ? '&'+self.queryString : '';
			getRecords();
		}
		
		function getRecords(){
			Spinner.start();
			self.busy = true;
			self.qs.page += 1;
			self.qs.filter_for = '';
			self.qs.locations = '';
			self.qs.rating = '';
			self.qs.sub_category = '';
			_.each(self.searchFilters, function(filter,index){
					self.qs.filter_for += ','+filter.id;
					if(parseInt(filter.location))
					self.qs.locations += ','+ filter.location;
					else  self.qs.locations += ',0';
					if(parseInt(filter.rating))
					self.qs.rating += ',' + filter.rating;
					else  self.qs.rating += ',0';
					if(parseInt(filter.sub_category))
					self.qs.sub_category += ',' + filter.sub_category;
					else  self.qs.sub_category += ',0';
				});
			self.qs.filter_for = self.qs.filter_for.substr(1);
			self.qs.locations = self.qs.locations.substr(1);
			self.qs.rating = self.qs.rating.substr(1);
			self.qs.sub_category = self.qs.sub_category.substr(1);
			
			SearchResultModel.findAll(self.qs).then(function(responce) {
									_.each(self.selectedTabs, function(tabs, tab_index){
										if(responce[tabs.id].length){
											_.each(responce[tabs.id], function(item, index){
												self.selectedTabs[tab_index].data.push(item);
												self.busy = false;
											});
										}
									});
									Spinner.stop();
								}, function(error) {
									Spinner.stop();
									return [];
							});
			}

        
		function getQueryStrings() {
            var assoc = {};
            var decode = function(s) {
                return decodeURIComponent(s.replace(/\+/g, " "));
            };
            var queryString = location.search.substring(1);
            var keyValues = queryString.split('&');

            for (var i in keyValues) {
                var key = keyValues[i].split('=');
                if (key.length > 1) {
                    assoc[decode(key[0])] = decode(key[1]);
                }
            }

            return assoc;
        }
		
		function setSelecteTabs(searchFor){
		 var searchFor = searchFor.split(',');
		 _.each(searchFor,function(item, index){
				_.each(self.tabs,function(tab, index){
						if(item==tab.id){
							self.tabs[index].active = true;
							self.selectedTabs.push(tab); 
						}
				});
			});
		}
		


	}
})();
