(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Serviceprovider.Controller.CreateListingController
     * @module BeautyCollective.Listing
     *
     * @description
     * CreateListingController is responsible manage account activities
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

    /* @ngInject */
    function CreateListingController(CategoriesModel, $state, $q, toaster, ListingModel, utilFactory, Listing_type, SuburbsModel, Spinner,moment) {
      var self = this,
            list_id, categoryType,parentCategoryId;

        /**
         * get suburbList
         * 
         * @private
         * @return {void}
         */
        self.suburbList = [];
        /**
         * [listing description]
         * @type {[type]}
         */
        self.listing = angular.copy(ListingModel.listingSchema);
        self.categories = [];
        self.subCategories = [];
        self.parentCategory = self.categories[0];
        self.listing.flowFiles = [];
        self.today = function() {
            self.listing.expire = new Date();
        };
        self.today();
        
        self.dateOptions = {
            minDate: new Date(),
            showWeeks: true
        };

         // Disable weekend selection
        function disabled(data) {
            var date = data.date,
            mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        self.toggleMin = function() {
            self.dateOptions.minDate = self.dateOptions.minDate ? null : new Date();
        };

        self.toggleMin();

        self.open1 = function() {
        self.popup1.opened = true;
        };

        self.setDate = function(year, month, day) {
            self.listing.expire = new Date(year, month, day);
        };

  self.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  self.format = self.formats[0];
  self.altInputFormats = ['M!/d!/yyyy'];
  self.popup1 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  self.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

 /**
         * invoke function on controller initialization
         */
        init();

        /**
         * initialize properties
         * 
         * @private
         * @return {void}
         */

        function init() {
            list_id = $state.params.list_id || null;
            categoryType = $state.params.listing_type.toLowerCase();

            if (categoryType) {
                if (categoryType === 'classified') {
                    getCategories(categoryType, categoryType.id).then(function(categories) {
                        self.categories.length = 0;
                        Array.prototype.push.apply(self.categories, categories);
                    });
                } else {
                    getCategories(categoryType, null).then(function(categories) {
                        self.categories.length = 0;
                        Array.prototype.push.apply(self.categories, categories);
                    });
                }
            }

            if (list_id) {
                getList();
            }
        }

        self.flowConfig = function() {
            return {
                target: '/upload',
                permanentErrors: [404, 500, 501],
                maxChunkRetries: 1,
                chunkRetryInterval: 5000,
                simultaneousUploads: 1,
                headers: {
                    'X-CSRF-TOKEN': csrf_token
                },
                query: function(flowFile, flowChunk) {
                    Spinner.start();
                    // function will be called for every request
                    return {
                        id: list_id,
                        source: 'flow_query'
                    };
                }
            }
        };

        self.fileUploadSuccess = function($file, $res) {
            $file.id = $res;
            self.listing.flowFiles.push($res);
            Spinner.stop();
        };
		
		self.fileUploadSuccess = function($file, $res) {
            $file.id = $res;
            self.listing.flowFiles.push($res);
            Spinner.stop();
        };


        self.cancelFile = function($file) {
            var index = self.listing.flowFiles.indexOf($file.id);
            self.listing.flowFiles.splice(index, 1);
            ListingModel.cancel({
                id: $file.id,
                list_id: list_id
            });
            $file.cancel();
        };

        /** delete image
         * @param  {[type]}
         * @return {[type]}
         */

        self.deleteImage = function(id) {
            
			Spinner.start();
            for (var index in self.listing.assets) {
                if (self.listing.assets[index].id == id) {
                    self.listing.assets.splice(index, 1);
                    break;
                }
            }
            ListingModel.cancel({
                id: id,
                list_id: list_id
            }).then(function(successResponse) {
                toaster.pop('success', "Image Deleted", "Image has been deleted.");
                Spinner.stop();
            }, function(errorResponse) {
                console.log('Deleting Image:', errorResponse);
                Spinner.stop();
            });
        };

        function getList() {
            ListingModel.find({
                id: list_id
            }).then(function(responseData) {
                if (responseData.data) {
                    angular.extend(self.listing, responseData.data);
                    self.listing.categories = (self.listing.categories && self.listing.categories.length > 0) ? self.listing.categories[0] : {};
                }
                self.listing.parentCategory = self.listing.categories.parentcategories;
                self.listing.expire = moment(self.listing.expiry).format("YYYY-MM-DD");
                
            }, function(errorResponse) {
                console.log('Error while getting list', errorResponse);
            });
        };

        function getCategories(type, parent) {
            var deffered = $q.defer();
            CategoriesModel.all({
                'cat_type': type,
                'cat_parent': parent || null
            }).then(function(response) {
                deffered.resolve(response.list);
            }, function() {
                deffered.resolve([]);
            });

            return deffered.promise;
        };

        self.selectCategory = function($item, $model) {
            getCategories(categoryType, $model.id).then(function(subCategories) {
                self.subCategories.length = 0;
                Array.prototype.push.apply(self.subCategories, subCategories);

            });
        };

        /**
         * saveform data
         * 
         * @private
         * @return {void}
         */

        self.savelisting = function() {
            Spinner.start();
            var _list = angular.copy(self.listing),
                resource;
            _list.locations = _.map(_list.locations, function(location) {
                return location.id;
            });
            _list.categories = _list.categories ? [_list.categories.id] : [];
            resource = list_id ? ListingModel.update({
                id: list_id
            }, _list) : ListingModel.save({
                'data': _list,
                'type': Listing_type
            });

            resource.then(function(successResponse) {
                //Spinner.stop();
                toaster.pop('success', "Listing Saved", "Listing has been saved.");
                $state.go('listing.list');
            }, function(errorResponse) {
                //Spinner.stop();
                console.log('Saving listing:', errorResponse);
            });
        };



        /**
         * @param  {[type]}
         * @return {[type]}
         */
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

    }
    //end of controller

    angular
        .module('BeautyCollective.Listing')
        .controller('CreateListingController', CreateListingController);
})();
