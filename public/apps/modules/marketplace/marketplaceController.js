'use strict';
angular.module('BeautyCollective.Core')
        .directive('marketPlace', function ($window) {
            // Get the specified element's computed style (height, padding, etc.) in integer form
            function getStyleInt(elem, prop) {
                try {
                    return parseInt(window.getComputedStyle(elem, null).getPropertyValue(prop), 10);
                } catch (e) {
                    return parseInt(elem.currentStyle[prop], 10);
                }
            }
            // Get the 'innerHeight' equivalent for a non-window element, including padding
            function getElementDimension(elem, prop) {
                switch (prop) {
                    case 'width':
                        return getStyleInt(elem, 'width') +
                                getStyleInt(elem, 'padding-left') +
                                getStyleInt(elem, 'padding-right');
                    case 'height':
                        return getStyleInt(elem, 'height') +
                                getStyleInt(elem, 'padding-top') +
                                getStyleInt(elem, 'padding-bottom');
                        /*default:
                         return null;*/
                }
            }
            return {
                restrict: 'E',
                scope: {
                    user: "@user"
                },
                templateUrl: 'apps/modules/marketplace/search_market.html',
                controller: 'ClassifiedController',
                controllerAs: '_self',
                bindToController: true,
                link: function (scope, elem, attr, ClassifiedController) {
                    var callback = scope.callback || function () {};
                    var boundToWindow = attr.bindToWindow;
                    var body = document.body;
                    var html = document.documentElement;
                    var boundElement = boundToWindow ? angular.element($window) : elem;
                    var oldScrollX = 0;
                    var oldScrollY = 0;
                    var handleScroll = function () {
                        // Dimensions of the content, including everything scrollable
                        var contentWidth;
                        var contentHeight;
                        // The dimensions of the container with the scrolling, only the visible part
                        var viewportWidth;
                        var viewportHeight;
                        // The offset of how much the user has scrolled
                        var scrollX;
                        var scrollY;
                        if (boundToWindow) {
                            // Window binding case - Populate Dimensions
                            contentWidth = Math.max(
                                    body.scrollWidth,
                                    body.offsetWidth,
                                    html.clientWidth,
                                    html.scrollWidth,
                                    html.offsetWidth
                                    );
                            contentHeight = Math.max(
                                    body.scrollHeight,
                                    body.offsetHeight,
                                    html.clientHeight,
                                    html.scrollHeight,
                                    html.offsetHeight
                                    );
                            viewportWidth = window.innerWidth;
                            viewportHeight = window.innerHeight;
                            scrollX = (window.pageXOffset || html.scrollLeft) - (html.clientLeft || 0);
                            scrollY = (window.pageYOffset || html.scrollTop) - (html.clientTop || 0);
                        } else {
                            // DOM element case - Populate Dimensions
                            var domElement = boundElement[0];
                            contentWidth = domElement.scrollWidth;
                            contentHeight = domElement.scrollHeight;
                            viewportWidth = getElementDimension(domElement, 'width');
                            viewportHeight = getElementDimension(domElement, 'height');
                            scrollX = domElement.scrollLeft;
                            scrollY = domElement.scrollTop;
                        }
                        var scrollWasInXDirection = oldScrollX !== scrollX;
                        var scrollWasInYDirection = oldScrollY !== scrollY;
                        oldScrollX = scrollX;
                        oldScrollY = scrollY;
                        if (scrollWasInYDirection && scrollY >= (contentHeight - viewportHeight - 300)) {

                            if (ClassifiedController.call_status == 0 && ClassifiedController.checkNextPage === 1) {
                                ClassifiedController.searchClassified();
                            }
                        }
                    };
                    boundElement.bind('scroll', handleScroll);
                    // Unbind the event when scope is destroyed
                    scope.$on('$destroy', function () {
                        boundElement.unbind('scroll', handleScroll);
                    });
                }
            };
        })
        .controller('MarketplaceContactModalController', function (classified, $http, Spinner, toaster, ModalInstance) {
            var _self = this;
            _self.sendMessage = function () {
                Spinner.start();

                var data = {
                    "email_to": classified.email,
                    "from_email": _self.from_email_business,
                    "email_message_business": _self.email_message_business
                };
                $http({
                    method: "POST",
                    url: "/listing/sendEmail",
                    params: data
                }).then(function mySuccess(response) {
                    toaster.pop('success', "Email Sent", "Email has been sent.");
                    _self.from_email_business = "";
                    _self.email_message_business = "";
                    Spinner.stop();
                }, function myError(response) {
                    console.log(response.statusText);
                });


            }


        })
        .controller('MarketplaceModalController', function ($scope, classified, $location, $modal) {
            $scope.slickConfig = {
                centerMode: true,
                slidesToShow: 1,
                centerMode: true,
                slidesToShow: 1
            };
            var _self = this;
            _self.ModalData = classified;
            _self.ModalData.host = $location.protocol() + '://' + $location.host();

            _self.showDescriptionFun = function () {
                if (_self.ShowDescription == 1) {
                    _self.ShowDescription = 0;
                    _self.showBtnText = 'Show More';
                } else {
                    _self.ShowDescription = 1;
                    _self.showBtnText = 'Show Less';
                }
            }

            _self.htmlToPlaintext = function (input) {
                var txt = document.createElement("textarea");
                txt.innerHTML = input;
                return txt.value;
            }
            _self.getAssetsUrlConvert = function (assets) {
                if (assets) {
                    return assets.path + assets.name;
                } else {
                    return "images/user_pic.jpg";
                }
            }
            _self.featuresAre = function ($features) {
                var feature = angular.fromJson($features);
                var html = '';
                angular.forEach(feature.business_feature, function (value, keys) {
                    if (value.name) {
                        html += '<p>' + value.name + '</p>';
                    }
                });
                return html;

            }
            _self.checkFeatures = function ($features) {
                var feature = angular.fromJson($features);
                if (feature.business_feature.length > 0) {
                    if (feature.business_feature[0].name.length > 0) {
                        return true;
                    } else {
                        return false;
                    }

                } else {
                    return false;
                }
            }
            _self.contactModal = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'apps/modules/marketplace/marketplace_contact_modal.html',
                    controller: 'MarketplaceContactModalController as _self',
//                    size: 'sm',
                    resolve: {
                        classified: function () {
                            return _self.ModalData;
                        },
                        ModalInstance: function () {
                            return modalInstance;
                        }
                    }
                });
            }
        })
        .controller('ClassifiedController', function ($scope, $http, moment, Spinner, $q, CategoriesModel, SuburbsModel, $sce, $modal, Laravel, toaster, AddtowatchModel, $location, $rootScope) {
            var _self = this;
            _self.page_number = 1;
            _self.checkNextPage = 1;
            _self.latest_reviews = [];
            _self.next_call_status = true;
            _self.categories = [];
            _self.priceSlider = {
                minValue: '',
                maxValue: '',
                options: {
                    floor: 0,
                    ceil: 100000,
                }
            };
            _self.records = [];
            _self.call_status = 0; //0: free for call 1: waiting for results;
            _self.selectedCategory = 0;
            _self.newcall = 0;
            _self.searchfor = '';
            _self.Showtag = false;
            _self.searchKeyword = '';
            _self.searchLocation = '';
            _self.searchcategory = '';
            _self.searchPrice = '';
            _self.host = $location.protocol() + '://' + $location.host();
            _self.classcount = 0;
            _self.onSliderChange = function ($classified) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'apps/modules/marketplace/marketplace_modal.html',
                    controller: 'MarketplaceModalController as _self',
                    size: 'lg',
                    resolve: {
                        classified: function () {
                            return $classified;
                        }
                    }
                });
            }

            init();
            function init() {
                getCategories('classified', null).then(function (categories) {
                    _self.categories.length = 0;
                    Array.prototype.push.apply(_self.categories, categories);
                });
                getSearchResults();
            }
            function getCategories(type, parent) {
                var deffered = $q.defer();
                CategoriesModel.all({
                    'cat_type': type,
                    'cat_parent': parent || null
                }).then(function (response) {
                    deffered.resolve(response.list);
                }, function () {
                    deffered.resolve([]);
                });
                return deffered.promise;
            }
            ;
            _self.getLocation = function (val) {
                if (val.length < 4) {
                    return;
                }
//            Spinner.start();
                _self.suburbList = [];
                _self.showspinner = 1;
                SuburbsModel
                        .findLocation({
                            'q': val
                        }).then(function (successResponse) {
                    _self.suburbList = successResponse.list;
//                Spinner.stop();
                    _self.showspinner = 0;
                }, function (errorResponse) {
                    console.log('Saving Details:', errorResponse);
//                Spinner.stop();
                    _self.showspinner = 0;
                });
            };
            _self.selectLocation = function ($item, $model) {
                _self.searchLocation = $item.location + ' - ' + $item.state + ',' + $item.postcode;
                $('#latitude-n1').val($item.latitude);
                $('#longitude-n1').val($item.longitude);
                $('#suburb-n1').val($item.location);
                $('#state-n1').val($item.state);
                $('#postcode-n1').val($item.postcode);
                _self.newcall = 1;
                _self.checkNextPage = 1;
                getSearchResults();
            };
            _self.getclassifiedByCategories = function (catId) {
                _self.selectedCategory = catId;
                _self.newcall = 1;
                _self.checkNextPage = 1;
                var index = _self.categories.findIndex(x => x.id === catId);
                _self.searchcategory = _self.categories[index];
                getSearchResults(_self.selectedCategory);
            }
            _self.searchClassified = function () {
                getSearchResults();
            };
            _self.checkAssets = function (assets) {
                if (assets && assets.length > 0) {
                    return true;
                } else {
                    return false;
                }
            }
            _self.getAssetsUrl = function (assets) {
                if (assets && assets.length > 0) {
                    return assets[0].path + assets[0].name;
                } else {
                    return "images/user_pic.jpg";
                }
            }
            _self.showdescription = function (desc) {
                return $sce.trustAsHtml(desc);
            }
            _self.opensamepage = function () {
                window.open('/marketplace', '_self');
            }
            _self.eventChange = function () {
                _self.newcall = 1;
                _self.checkNextPage = 1;
                if (_self.priceSlider.minValue > 0 && _self.priceSlider.maxValue > 0) {
                    _self.searchPrice = _self.priceSlider.minValue + ' - ' + _self.priceSlider.maxValue;
                }
                getSearchResults();
            }
            function getSearchResults($searchCat) {

                var minV = (_self.priceSlider.minValue) ? _self.priceSlider.minValue : '';
                var maxV = (_self.priceSlider.maxValue) ? _self.priceSlider.maxValue : '';
                var location = (_self.locations) ? JSON.stringify(_self.locations) : '';
                var cateory = ($searchCat) ? $searchCat : (_self.selectedCategory) ? _self.selectedCategory : '';
                var $q = (_self.searchfor) ? _self.searchfor : '';
                if (_self.checkNextPage == 1) {
                    _self.call_status = 1;
                    if (_self.newcall == 1) {
                        _self.records = [];
                        _self.page_number = 1;
                        _self.checkNextPage = 1;
                    }
                    $http({
                        method: "GET",
                        url: "MarketplaceSearch",
                        params: {page: _self.page_number, minv: minV, maxv: maxV, location: location, category: cateory, q: $q}
                    }).then(function mySuccess(response) {
                        _self.call_status = 0;
                        var data = response.data;
                        if (_self.records) {
                            angular.forEach(data.data, function (value, keys) {
                                _self.records.push(value);
                            });
                        }
                        if (data.next_page_url) {
                            _self.page_number++;
                        } else {
                            _self.checkNextPage = 0;
                        }
                        _self.newcall = 0;
                    }, function myError(response) {
                        console.log(response.statusText);
                    });
                }
            }
            _self.firstLetterIn = function ($name) {
//                _self.showColorClass = ['dealsCircle', 'classifiedCircle', 'JobsCircle', 'businessCircle', 'grayCircle'];
//                _self.classIs = _self.showColorClass[_self.classcount];
//                _self.classcount++;
//                if (_self.classcount === 3) {
//                    _self.classcount = 0;
//                }                
                return $name.charAt(0);
            }
            _self.checklogin = function () {
                if (Laravel.user) {
                    window.open('account#/marketplace', '_self');
                } else {
                    window.open('auth/login', '_self');
                }
            }
            _self.removeText = function (removeIndex = 0) {
                if (removeIndex == 0) {
                    _self.Showtag = false;
                    _self.searchfor ='';
//                            _self.searchKeyword
//                    _self.searchKeyword = '';                    
                    var name = window.document.getElementById('searchBy');
//                    _self.
                    name.focus();
                } 
                // for the max and min price check remove
                else if (removeIndex == 1) {
                    console.log(_self.searchPrice);
                    _self.searchPrice='';
                    _self.priceSlider.minValue='';
                    _self.priceSlider.maxValue='';
                }
                // for the Category remove check
                else if (removeIndex == 2) {   
                    _self.selectedCategory='';
                   _self.searchcategory='';
                }
                // for the location remove check
                else if (removeIndex == 3) {   
                    _self.locations='';
                }
                _self.newcall=1;
                _self.checkNextPage=1;
                getSearchResults();

            }
            _self.AddtowatchList = function ($event, listing_id) {
                Spinner.start();
                _self.watchtype = 'listing';
                AddtowatchModel.AddtowatchList({}, {
                    id: listing_id,
                    watchtype: _self.watchtype
                }).then(function (responce) {
                    if (responce.status == 1) {
                        toaster.pop('success', "Listing Saved", responce.message);
                    } else if (responce.status == 0) {
                        toaster.pop('error', "Listing Already Saved", responce.message);
                    } else if (angular.isUndefined(responce.status)) {
                        toaster.pop('error', "Authentication Issue", "Please Login.");
                    }
                    Spinner.stop();
                }, function () {
                    Spinner.stop();
                });

                $event.stopPropagation();
            };
            _self.searchByText = function () {
                var $q = _self.searchfor;
                if ($q.length > 0) {
                    _self.searchKeyword = $q;

                    _self.Showtag = true;
                    _self.page_number = 1;
                    _self.records = [];
                    $http({
                        method: "GET",
                        url: "MarketplaceSearch",
                        params: {page: _self.page_number, q: $q}
                    }).then(function mySuccess(response) {
                        _self.call_status = 0;
                        _self.records = [];
                        var data = response.data;
                        if (_self.records) {
                            angular.forEach(data.data, function (value, keys) {
                                _self.records.push(value);
                            });
                        }
                        if (data.next_page_url) {
                            _self.page_number++;
                        } else {
                            _self.checkNextPage = 0;
                        }
                        _self.newcall = 0;
                    }, function myError(response) {
                        console.log(response.statusText);
                    });
                }
            }
            _self.EnterPress = function ($event) {
                if ($event.which === 13) {
                    var $q = _self.searchfor;
                    if ($q.length > 0) {
                        _self.searchKeyword = $q;
                    }
                    _self.Showtag = true;
                    _self.page_number = 1;
                    $http({
                        method: "GET",
                        url: "MarketplaceSearch",
                        params: {page: _self.page_number, q: $q}
                    }).then(function mySuccess(response) {
                        _self.records = [];
                        _self.call_status = 0;
                        var data = response.data;
                        if (_self.records) {
                            angular.forEach(data.data, function (value, keys) {
                                _self.records.push(value);
                            });
                        }
                        if (data.next_page_url) {
                            _self.page_number++;
                        } else {
                            _self.checkNextPage = 0;
                        }
                        _self.newcall = 0;
                    }, function myError(response) {
                        console.log(response.statusText);
                    });
                }
            }
            _self.catClasses = function () {
                _self.showColorClass = ['dealsCircle', 'classifiedCircle', 'JobsCircle', 'businessCircle', 'grayCircle'];
                _self.classIs = _self.showColorClass[_self.classcount];
                _self.classcount++;
                if (_self.classcount >= 3) {
                    _self.classcount = 0;
                }
                console.log(_self.classIs);
                return _self.classIs;

            };
            _self.base64_encode = function (value) {
                return btoa(value);
            };
            _self.base64_decode = function (value) {
                return atob(value);
            };
        });
(function () {
    'use strict';
    function MarketplaceController($rootScope, $http, CategoriesModel, $state, $q, toaster, ListingModel, utilFactory, Listing_type, SuburbsModel, Spinner, moment) {
        var self = this, list_id, categoryType, parentCategoryId;
        self.showspinner = 0;
        self.suburbList = [];
        self.listing = angular.copy(ListingModel.listingSchema);
        self.listing.categories = [];
        self.listing.isSold = 0;
        self.listing.classifiedActive = 1;
        self.categories = [];
        self.listing.parentCategory = {};
        self.subCategories = [];
        self.parentCategory = self.categories[0];
        self.listing.flowFiles = [];
        self.listing.fileCount = 0;
        self.business_feature = [{
                colId: 'col1',
                name: ''
            }];
        self.showgallery = 0;
        self.today = function () {
            var time = new Date();
            time.setDate(time.getDate() + 30);
            self.listing.expire = time;
        };
        self.today();
        self.setCheckBValue = function (obj) {
            var is_checked = $(obj).is(":checked");
            if (is_checked) {
                // $('#hidden-status').val(0);
                self.listing.status = 0;
            } else {
                // $('#hidden-status').val(1);
                self.listing.status = 1;
            }
        };
        self.addNewColumn = function ($typeinfo) {
            if ($typeinfo == 1) {
                var newItemNo = self.business_stock.length + 1;
                self.business_stock.push({
                    'colId': 'col' + newItemNo
                });
            } else {
                var newItemNo = self.business_feature.length + 1;
                self.business_feature.push({
                    'colId': 'col' + newItemNo
                });
            }
        };

        self.toggleactive = function () {
            if (self.listing.classifiedActive === 1) {
                self.listing.isSold = 0;
            }
        };
        self.togglesold = function () {
            if (self.listing.isSold === 1) {
                self.listing.classifiedActive = 0;
            }
        };
        self.removeColumn = function (index, $typeinfo) {

            if ($typeinfo == 1) {
                self.business_stock.splice(index, 1);
                // if no rows left in the array create a blank array
                if (self.business_stock.length === 0 || self.business_stock.length == null) {
                    // alert('no rec');
                    self.business_stock.push({
                        "colId": "col1"
                    });
                }
            } else {
                self.business_feature.splice(index, 1);
                // if no rows left in the array create a blank array
                if (self.business_feature.length === 0 || self.business_feature.length == null) {
                    self.business_feature.push({
                        "colId": "col1"
                    });
                }
            }
        };
        self.dateOptions = {
            minDate: new Date(),
            showWeeks: true
        };
        function disabled(data) {
            var date = data.date,
                    mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }
        self.toggleMin = function () {
            self.dateOptions.minDate = self.dateOptions.minDate ? null : new Date();
        };
        self.toggleMin();
        self.posttitle = [];
        self.open1 = function () {
            self.popup1.opened = true;
        };
        self.setDate = function (year, month, day) {
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
        self.events = [{
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];
        init();
        function init() {
            list_id = ($state.params.list_id) ? $rootScope.base64_decode($state.params.list_id) : "" || null;
            categoryType = $state.params.listing_type.toLowerCase();
            if (categoryType) {
                if (categoryType === 'classified') {
                    getCategories(categoryType, categoryType.id).then(function (categories) {
                        self.categories.length = 0;
                        Array.prototype.push.apply(self.categories, categories);
                    });
                } else {
                    getCategories(categoryType, null).then(function (categories) {
                        self.categories.length = 0;
                        Array.prototype.push.apply(self.categories, categories);
                    });
                }
            }
            if (categoryType == "classified") {
                getCategories('posttitle', null).then(function (categories) {
                    Array.prototype.push.apply(self.posttitle, categories);
                });
            }
            if (list_id) {
                getList();
            }

        }
        self.flowConfig = function () {

            return {
                target: '/upload',
                permanentErrors: [404, 500, 501],
                maxChunkRetries: 0,
                chunkRetryInterval: 5000,
                simultaneousUploads: 1,
                testChunks: false,
                singleFile: true,
                headers: {
                    'X-CSRF-TOKEN': csrf_token
                },
                query: function (flowFile, flowChunk) {

                    // Spinner.start();
                    // function will be called for every request
                    return {
                        id: list_id,
                        source: 'flow_query'
                    };
                }
            }
        };
        self.UserGalleryfileUploadError = function ($file, $res) {

            var index = self.listing.flowFiles.indexOf($file.id);
            self.listing.flowFiles.splice(index, 1);
            $file.cancel();
            toaster.pop('error', "Gallery", $res);
            Spinner.stop();
        };
        self.showprogressbar = 0;
        self.uploadfiles = function ($flow) {
            self.showprogressbar = 1;
            $flow.upload();
        }
        self.listingValidateForm = function (filecount, validation) {
            if (validation || filecount == 0) {
                return true;
            } else {
                return false;
            }

        };
        self.dealListinDisableSaveBtn = function (filecount, validation, service_count) {
            if ((validation || filecount == 0) || service_count == 0) {
                return true;
            } else {
                return false;
            }

        }
        self.fileUploadSuccess = function ($file, $res, $flow) {
            $file.id = $res;
            self.listing.flowFiles = [];
            self.listing.flowFiles.push($res.replace(/(\r\n|\n|\r)/gm, ""));
            Spinner.stop();
            self.showprogressbar = 0;
            self.listing.fileCount = 0;
//            self.listing.fileCount = self.listing.fileCount + $flow.files.length;
        };
        self.fileUploadError = function ($file, $message, $flow) {
            Spinner.stop();
            console.log($message);
        };
        self.cancelFile = function ($file, $flow) {
            if (self.listing.fileCount > 1) {
                var index = self.listing.flowFiles.indexOf($file.id);
                self.listing.flowFiles.splice(index, 1);
                ListingModel.cancel({
                    id: $file.id,
                    list_id: list_id
                });
                $file.cancel();
                self.listing.fileCount = self.listing.fileCount - 1;
            }
        };
        self.deleteImage = function (id, $flow) {
            if (self.listing.fileCount > 1) {
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
                }).then(function (successResponse) {
                    toaster.pop('success', "Image Deleted", "Image has been deleted.");
                    Spinner.stop();
                }, function (errorResponse) {
                    console.log('Deleting Image:', errorResponse);
                    Spinner.stop();
                });
                self.listing.fileCount = self.listing.fileCount - 1;
            }
        };
        function getList() {
            ListingModel.find({
                id: list_id
            }).then(function (responseData) {
                if (responseData.data) {
                    self.listing = angular.extend(self.listing, responseData.data);
                    self.listing.locations = {
                        location: self.listing.suburb,
                        state: self.listing.state,
                        postcode: self.listing.postcode
                    };
                }
                self.listing.isSold = parseInt(self.listing.visa_id);
                self.listing.classifiedActive = parseInt(self.listing.status);
                self.showgallery = 1;
                self.listing.parentCategory = angular.extend(self.listing.classified_categories);
                self.newCategories = [];
                self.count = 0;
                self.havevalue = 0;
                angular.forEach(self.categories, function (values, keys) {
                    angular.forEach(self.listing.parentCategory, function (selected_value, selected_key) {
                        if (values.id === selected_value.id) {
                            self.havevalue = 1;
                        }
                    });
                    if (self.havevalue === 0) {
                        self.newCategories[self.count] = values;
                        self.count++;
                    } else {
                        self.havevalue = 0;
                    }
                });
                self.categories = angular.copy(self.newCategories);
                self.listing.expire = moment(self.listing.expiry).format("YYYY-MM-DD");
                self.listing.fileCount = self.listing.assets.length;
                self.post_title = JSON.parse(self.listing.post_title);
                self.listing.post_title = self.post_title;

                self.business_feature_stock = JSON.parse(responseData.data.business_feature_stock);
                self.business_feature = self.business_feature_stock.business_feature;

            }, function (errorResponse) {
                console.log('Error while getting list', errorResponse);
            });
        }
        ;
        function getCategories(type, parent) {
            var deffered = $q.defer();
            CategoriesModel.all({
                'cat_type': type,
                'cat_parent': parent || null
            }).then(function (response) {
                deffered.resolve(response.list);
            }, function () {
                deffered.resolve([]);
            });
            return deffered.promise;
        }
        ;
        self.selectCategory = function ($item, $model) {
            getCategories(categoryType, $model.id).then(function (subCategories) {
                self.subCategories.length = 0;
                Array.prototype.push.apply(self.subCategories, subCategories);
            });
        };
        self.selectLocation = function ($item, $model) {
            $('#latitude-n1').val($item.latitude);
            $('#longitude-n1').val($item.longitude);
            $('#suburb-n1').val($item.location);
            $('#state-n1').val($item.state);
            $('#postcode-n1').val($item.postcode);
        };
        self.savelisting = function () {
            Spinner.start();
            var _list = angular.extend(self.listing), resource;
            _list.latitude = $('#latitude-n1').val();
            _list.longitude = $('#longitude-n1').val();
            _list.suburb = $('#suburb-n1').val();
            _list.state = $('#state-n1').val();
            _list.postcode = $('#postcode-n1').val();
            _list.status = $('#hidden-status').val();
            _list.locations = [];
            _list.categories = _list.parentCategory;
            _list.services = self.spservice;
            _list.listing_meta = self.listing.listing_meta;
            _list.business_feature = self.business_feature;
            resource = list_id ?
                    ListingModel.update({
                        id: list_id
                    }, _list) :
                    ListingModel.save({
                        'data': _list,
                        'type': Listing_type
                    });
            resource.then(function (successResponse) {
                Spinner.stop();
                toaster.pop('success', "Classified Saved", "Classified has been saved.");
                $state.go('marketplace', {}, {
                    reload: true
                });
            }, function (errorResponse) {
                Spinner.stop();
                $state.go('marketplace', {}, {
                    reload: true
                });
                console.log('Saving job:', errorResponse);
            });
        };
        self.getLocation = function (val) {
            if (val.length < 4) {
                return;
            }
//            Spinner.start();
            self.suburbList = [];
            self.showspinner = 1;
            SuburbsModel
                    .findLocation({
                        'q': val
                    }).then(function (successResponse) {
                self.suburbList = successResponse.list;
//                Spinner.stop();
                self.showspinner = 0;
            }, function (errorResponse) {
                console.log('Saving Details:', errorResponse);
//                Spinner.stop();
                self.showspinner = 0;
            });
        };
        self.modelOptions = {
            debounce: {
                default: 500
            },
            getterSetter: true
        };
        self.checkExpiry = function (expriy) {
            var alignFillDate = new Date(expriy);
            var pickUpDate = new Date();
            if (pickUpDate <= alignFillDate) {
                return false;
            } else {
                return true;
            }
        }
        self.makeSold = function (listingId) {
            Spinner.start();
            ListingModel.makeclassified({
                listingId: listingId,
                type: 3,
                typeDo: 1
            }).then(function (responseData) {
                if (responseData.status == 200) {
                    toaster.pop('success', "Classified Repost", "Classified Repost Successfully.");
                    Spinner.stop();
                    $state.go('marketplace', {}, {
                        reload: true
                    });
                } else {
                    toaster.pop('error', responseData.message);
                }
                Spinner.stop();
            }, function (errorResponse) {
                console.log('Error while getting list', errorResponse);
                Spinner.stop();
            });
        }


    }
    MarketplaceController.$inject = ["$rootScope", "$http", "CategoriesModel", "$state", "$q", "toaster", "ListingModel", "utilFactory", "Listing_type", "SuburbsModel", "Spinner", "moment"];
    //end of controller

    angular
            .module('BeautyCollective.Listing')
            .filter('propsFilter', function () {
                return function (items, props) {
                    var out = [];

                    if (angular.isArray(items)) {
                        items.forEach(function (item) {
                            var itemMatches = false;

                            var keys = Object.keys(props);
                            for (var i = 0; i < keys.length; i++) {
                                var prop = keys[i];
                                var text = props[prop].toLowerCase();
                                if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                                    itemMatches = true;
                                    break;
                                }
                            }

                            if (itemMatches) {
                                out.push(item);
                            }
                        });
                    } else {
                        // Let the output be the input untouched
                        out = items;
                    }

                    return out;
                };
            })
            .controller('MarketplaceController', MarketplaceController);
})();
(function () {
    'use strict';
    function ListMarketplaceController($window, $scope, $rootScope, CategoriesModel, ListingModel, Listing_type, $location, moment, toaster, Spinner, $state, $http, $filter) {
        var self = this;
        self.listing = '';
        self.adddeals = '';
        self.today = $filter('date')(new Date(), 'yyyy-MM-dd');
        self.active = 0;
        self.expired = 0;
        self.total = 0;
        self.deactive = 0;
        self.sold = 0;
        init();
        function init() {
            $window.scrollTo('0', '250');
            getListings();
            self.currentPage = 0;
            self.pageSize = 4;
            self.host = $location.protocol() + '://' + $location.host();
            getAnalyticInfo();
        }

        function getListings() {
            ListingModel.findAllMarketplace().then(function (data) {
                self.listing = angular.copy(data);
                _.each(self.listing.data, function (list, index) {
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth() + 1; //January is 0!
                    var yyyy = today.getFullYear();
                    var date = yyyy + '-' + mm + '-' + dd;
                    var a = moment(date, 'YYYY-MM-DD');
                    var b = moment(list.expiry, 'YYYY-MM-DD');
                    self.listing.data[index].daysleft = b.diff(a, 'days');
                    if (list.type === 'job') {
                        self.listing.data[index].url = 'jobs';
                    }
                    if (list.type === 'marketplace') {
                        self.listing.data[index].url = 'classifieds';
                    }
                    if (list.type === 'gallery') {
                        self.listing.data[index].url = 'gallery';
                    }
                    if (list.type === 'businessforsale') {
                        self.listing.data[index].url = 'business';
                    }
                    if (list.type === 'deal') {
                        self.listing.data[index].url = 'deals';
                    }
                })
            });
        }
        self.delete_options = function ($event, list_id) {
            $event.preventDefault();
            $("#delete_options_" + list_id).slideToggle("slow");
        };
        self.delete_options_cancel = function ($event, list_id) {
            $event.preventDefault();
            $("#delete_options_" + list_id).slideToggle("slow");
        };
        self.delete = function ($event, list_id) {
            $event.preventDefault();
            Spinner.start();
            ListingModel.delete({
                id: list_id
            }).then(function (responseData) {
                _.each(self.listing.data, function (list, index) {
                    if (list && list.id && list.id === list_id) {
                        Spinner.stop();
                        self.listing.data.splice(index, 1);
                        toaster.pop('success', "Listing Deleted", "Listing has been deleted successfully.");
                        $state.go($state.current, {}, {
                            reload: true
                        });
                        return;
                    }
                })
            }, function (errorResponse) {
                console.log('unable to delete list : ', errorResponse);
            })
        };
        $scope.dataTableOpt = {
            "order": [
                [0, 'Desc']
            ]
        };

        function getAnalyticInfo() {
            ListingModel.getAnalytics().then(function (data) {
                if (data.status == 200) {
                    console.log(data);
                    self.active = data.active;
                    self.expired = data.expired;
                    self.total = data.total;
                    self.deactive = data.deactive;
                    self.sold = data.sold;
                }
            });
        }

    }
    ListMarketplaceController.$inject = ["$window", "$scope", "$rootScope", "CategoriesModel", "ListingModel", "Listing_type", "$location", "moment", "toaster", "Spinner", "$state", "$http", "$filter"];
    //end of controller
    angular
            .module('BeautyCollective.Listing')
            .controller('ListMarketplaceController', ListMarketplaceController);
})();


