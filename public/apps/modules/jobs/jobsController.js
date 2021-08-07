(function () {
    'use strict';
    function JobsController($rootScope, $http, CategoriesModel, $state, $q, toaster, ListingModel, utilFactory, Listing_type, SuburbsModel, Spinner, moment) {

        var self = this,
                list_id, categoryType, parentCategoryId;

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
        self.showspinner = 0;

        self.showgallery = 0;


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
        self.Industry = [];
        self.parentCategory = self.categories[0];
        self.listing.flowFiles = [];
        self.listing.fileCount = 0;
        self.jobVisatype=[{id:1, name: 'Australian citizen'},{id:2, name:'Australian/NZ residents'},{id: 3,name:'Working and Holiday visa'},{id:4,name:'Student visa'}];
        self.Gendertype=[{id:'noprefrence',name: 'NO PREFRENCE'},{id:'male',name:'MALE'},{id:'female',name:'FEMALE'}];
        self.today = function () {
            var time = new Date();
            time.setDate(time.getDate() + 30);
            self.listing.expire = time;
        };
        self.today();

        self.weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        self.dateOptions = {
            minDate: new Date(),
            showWeeks: true
        };
        self.calculateDiscount = function () {
            self.listing.saving = self.listing.price - self.listing.discount;
            if (self.listing.saving > 0) {
                self.listing.saving
            } else {
                self.listing.saving = 0;
            }
        }
        // Disable weekend selection
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

        /**
         * invoke function on controller initialization
         */
        init();

        self.services = [];
        self.spservice = [];

        function getServices() {
            CategoriesModel.getAllServices().then(function (response) {
                if (response.list.status === "200") {
                    self.services = response.list.data;
                } else {

                }
            }, function () {

            });

        }






        /**
         * initialize properties
         *
         * @private
         * @return {void}
         */

        function init() {
            list_id = ($state.params.list_id) ? $rootScope.base64_decode($state.params.list_id) : "" || null;
            categoryType = $state.params.listing_type.toLowerCase();
            // getServices();
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

            if (categoryType == "job") {
                getCategories('posttitle', null).then(function (categories) {
                    Array.prototype.push.apply(self.posttitle, categories);
                });

            }
            
            if (categoryType == "job") {
                getCategories('service', null).then(function (categories) {
                    Array.prototype.push.apply(self.Industry, categories);
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
                singleFile:true,
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
            self.listing.flowFiles.push($res);
            Spinner.stop();
            self.showprogressbar = 0;
            self.listing.fileCount = $flow.files.length;
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

        /** delete image
         * @param  {[type]}
         * @return {[type]}
         */

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
                    self.listing.categories = (self.listing.categories && self.listing.categories.length > 0) ? self.listing.categories[0] : {};
                    self.listing.locations = {
                        location: self.listing.suburb,
                        state: self.listing.state,
                        postcode: self.listing.postcode
                    };
                }
                self.listing.parentCategory = self.listing.categories;
                self.listing.expire = moment(self.listing.expiry).format("YYYY-MM-DD");
                self.listing.fileCount = self.listing.assets.length;
                self.spservice = self.listing.listService;
                self.post_title = JSON.parse(self.listing.post_title);
                self.listing.post_title = self.post_title;
                self.industry = JSON.parse(self.listing.business_feature_stock);
                self.listing.industry = self.industry;
                self.showgallery = 1;
                self.listing.visa_id = self.jobVisatype.find(o => o.id == self.listing.visa_id);
                self.listing.gender_require = self.Gendertype.find(o => o.id == self.listing.gender_require);
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

        self.selectsubCategory = function ($item, $model) {
            if ('Other' === $model.name) {
                $(".other_opt").show();
            } else {
                $(".other_opt").hide();
            }

        };

        self.selectLocation = function ($item, $model) {
            $('#latitude-n1').val($item.latitude);
            $('#longitude-n1').val($item.longitude);
            $('#suburb-n1').val($item.location);
            $('#state-n1').val($item.state);
            $('#postcode-n1').val($item.postcode);
        };

        /**
         * saveform data
         *
         * @private
         * @return {void}
         */

        self.savelisting = function () {
            Spinner.start();
            var _list = angular.extend(self.listing),
                    resource;
            _list.visa_id=_list.visa_id.id;
            _list.gender_require=_list.gender_require.id;
            _list.latitude = $('#latitude-n1').val();
            _list.longitude = $('#longitude-n1').val();
            _list.suburb = $('#suburb-n1').val();
            _list.state = $('#state-n1').val();
            _list.postcode = $('#postcode-n1').val();
            _list.status = $('#hidden-status').val();

            _list.locations = [];
            _list.categories = _list.parentCategory ? [_list.parentCategory.id] : [];
            _list.services = self.spservice;
            _list.listing_meta = self.listing.listing_meta;

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
                toaster.pop('success', "Job Saved", "Job has been saved.");
                $state.go('listing.jobs', {}, {
                    reload: true
                });
            }, function (errorResponse) {
                Spinner.stop();
                $state.go('listing.jobs', {}, {
                    reload: true
                });
                console.log('Saving job:', errorResponse);
            });
        };
        /**
         * @param  {[type]}
         * @return {[type]}
         */
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
        self.seeSpinner = function () {
            Spinner.start();
        }








    }
    JobsController.$inject = ["$rootScope", "$http", "CategoriesModel", "$state", "$q", "toaster", "ListingModel", "utilFactory", "Listing_type", "SuburbsModel", "Spinner", "moment"];
    //end of controller

    angular
            .module('BeautyCollective.Listing')
            .controller('JobsController', JobsController);
})();

(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Serviceprovider.Controller.ListListingController
     * @module BeautyCollective.Listing
     *
     * @description
     * ListListingController is responsible manage user listing
     *
     * @author Kinectro
     */

    /* @ngInject */
    function ListJobsController($window, ResolveData, CategoriesModel, ListingModel, Listing_type, $location, moment, toaster, Spinner, $state, $http, $scope, $filter) {
        var self = this;
        self.listing = '';
        self.adddeals = '';
        self.job_applications = {};
        self.listing_type = Listing_type;
        self.left_menu_info = {};
        self.show_applicationall_menu = 0;
        self.activeFindStaff = 0;
        self.todayDat = $filter('date')(new Date(), 'yyyy-MM-dd')
        if (ResolveData.user.user_subscription[0].plan_id == 2) {
            self.activeFindStaff = 1;
        }
        init();
        self.openNewPage = function (url) {
            window.open(url, "_self");
        }
        /**
         * initialize properties
         *
         * @private
         * @return {void}
         */

        function init() {
            getAnalytics();
            if ($state.current.name === 'listing.jobs.applications.applieds') {
                getApplicationsApplied(Listing_type);
            } else if ($state.current.name === 'listing.jobs.applications.shortlisted') {
                getApplicationsShortListed(Listing_type);
            } else if ($state.current.name === 'listing.jobs.applications.interview') {
                getApplicationsInterview(Listing_type);
            } else if ($state.current.name === 'listing.jobs.applications.appliedsall') {
                self.show_applicationall_menu = 1;
                getAllApplications(0);
            } else if ($state.current.name === 'listing.jobs.applications.shortlistedall') {
                self.show_applicationall_menu = 1;
                getAllApplications(2);
            } else if ($state.current.name === 'listing.jobs.applications.completed') {
                getApplicationsCompleted(Listing_type);
            } else {
                getListings();
            }
            self.currentPage = 0;
            self.pageSize = 4;
            self.host = $location.protocol() + '://' + $location.host();
        }

        function getApplicationsCompleted(job_id) {

            Spinner.start();
            $http({
                method: "GET",
                url: main_url + "/listing/getjob/applications/" + job_id + "/5"
            }).then(function mySuccess(response) {

                if (response.status == "200") {
                    self.job_applications = response.data;
                }
                Spinner.stop();

            }, function myError(response) {
                console.log(response.statusText);
            });
        }




        function getAllApplications(application_type) {
            Spinner.start();
            $http({
                method: "GET",
                url: main_url + "/listing/getjob/all/" + application_type
            }).then(function mySuccess(response) {

                if (response.status == "200") {
                    self.job_applications = response.data;
                }
                Spinner.stop();

            }, function myError(response) {
                console.log(response.statusText);
            });
        }


        self.changeJobStatus = function (list_id, status) {
            $http({
                method: "POST",
                url: main_url + "/listing/changeJobStatus",
                data: {list_id: list_id, status: status}
            }).then(function mySuccess(response) {
                if (response.data.status == "200") {
                    toaster.pop('success', "Success", response.data.msg);
                }
            }, function myError(response) {
                console.log(response.statusText);
            });
        }


        function getAnalytics() {
            $http({
                method: "GET",
                url: main_url + "/listing/getjobsanalytic"
            }).then(function mySuccess(response) {
                if (response.status == "200") {
                    self.left_menu_info = response.data;
                }
            }, function myError(response) {
                console.log(response.statusText);
            });
        }

        self.formatDate = function (date) {
            var dateOut = new Date(date);
            return dateOut;
        }

        function getApplicationsShortListed(job_id) {

            Spinner.start();
            $http({
                method: "GET",
                url: main_url + "/listing/getjob/applications/" + job_id + "/2"
            }).then(function mySuccess(response) {

                if (response.status == "200") {
                    self.job_applications = response.data;
                }


                Spinner.stop();

            }, function myError(response) {
                console.log(response.statusText);
            });
        }


        function getApplicationsInterview(job_id) {

            Spinner.start();
            $http({
                method: "GET",
                url: main_url + "/listing/getjob/applications/" + job_id + "/3"
            }).then(function mySuccess(response) {

                if (response.status == "200") {
                    self.job_applications = response.data;
                }


                Spinner.stop();

            }, function myError(response) {
                console.log(response.statusText);
            });
        }

        self.downloadFile = function (file_path) {
            window.location.assign(file_path);
        }
        self.previewDoc = function (file_path, application_id, type) {

            if (file_path) {
                if (type == 0) {
                    $http({
                        method: "POST",
                        url: main_url + "/listing/getjob/applications/shortlist/" + application_id + "/1"
                    }).then(function mySuccess(response) {
                        $http.get(file_path)
                                .then(function (data) {     // data is your url
                                    $window.open(file_path, '_blank');
                                });
                    }, function myError(response) {
                        console.log(response.statusText);
                    });
                } else {
                    $http.get(file_path)
                            .then(function (data) {     // data is your url
                                $window.open(file_path, '_blank');
                            });
                }
            } else {
                toaster.pop('error', "Document", "No Document attached.")
            }
        }
        self.shortListCandidate = function (application_id, type) {
            Spinner.start();
            $http({
                method: "POST",
                url: main_url + "/listing/getjob/applications/shortlist/" + application_id + "/" + type
            }).then(function mySuccess(response) {
                if (response.status == "200") {
                    toaster.pop('success', "Success", response.data.msg);

                    $state.go('listing.jobs', {}, {
                        reload: true
                    });
                } else {
                    toaster.pop('error', "Error", response.status);
                }
                Spinner.stop();
            }, function myError(response) {
                console.log(response.statusText);
                Spinner.stop();
            });
        }
        self.openurl = function (url, application_id, type) {
            if (type == 0) {
                $http({
                    method: "POST",
                    url: main_url + "/listing/getjob/applications/shortlist/" + application_id + "/1"
                }).then(function mySuccess(response) {
                    window.open(url, '_blank');

                    Spinner.stop();
                }, function myError(response) {
                    console.log(response.statusText);
                });
            } else {
                window.open(url, '_blank');
            }
        }
        function getApplicationsApplied(job_id) {

            Spinner.start();
            $http({
                method: "GET",
                url: main_url + "/listing/getjob/applications/" + job_id + "/0"
            }).then(function mySuccess(response) {

                if (response.status == "200") {
                    self.job_applications = response.data;
                }


                Spinner.stop();

            }, function myError(response) {
                console.log(response.statusText);
            });
        }

        /**
         * Get all the listing of a user
         *
         * @private
         * get user Listing
         * @return {Object | JSON | cuserlisting}
         */
        function getListings() {
            ListingModel.getjobs().then(function (data) {
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
                })

                self.numberOfPages = function () {
                    return Math.ceil(self.listing.data.length / self.pageSize);
                }
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
                        toaster.toastpop('success', "Listing Deleted", "Listing has been deleted successfully.");
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

        $scope.dataTableOptJobManagement = {
            "order": [[0, 'Desc']]
        }
        ;
        $scope.dataTableOpt = {
            "order": [[0, 'Desc']]
        };

        self.showtitle = function (post_title) {            
            var title_obj= JSON.parse(post_title);
            if(post_title && !angular.isUndefined(title_obj.name)){
                return '-'+title_obj.name
            }else{
                return '';
            }            
        }


    }
    ListJobsController.$inject = ["$window", "ResolveData", "CategoriesModel", "ListingModel", "Listing_type", "$location", "moment", "toaster", "Spinner", "$state", "$http", "$scope", "$filter"];
    //end of controller
    angular
            .module('BeautyCollective.Listing')
            .controller('ListJobsController', ListJobsController);
})();


(function () {
    "use strict";

    angular
            .module("BeautyCollective.Core")
            .controller("ApplicantSelectedProfile", ApplicantSelectedProfile);

    function ApplicantSelectedProfile(toaster,
            Spinner,
            $state,
            $http) {
        var self = this;

        self.alertme = function () {
            alert("i am here");
        };
        self.shortListCandidate = function (application_id, type) {
            Spinner.start();
            $http({
                method: "POST",
                url: main_url +
                        "/listing/getjob/applications/shortlist/" +
                        application_id +
                        "/" +
                        type
            }).then(
                    function mySuccess(response) {
                        if (response.status == "200") {
                            toaster.pop("success", "Success", response.data.msg);
                        } else {
                            toaster.pop("error", "Error", response.status);
                        }
                        Spinner.stop();
                    },
                    function myError(response) {
                        console.log(response.statusText);
                        Spinner.stop();
                    }
            );
        };
    }
    ApplicantSelectedProfile.$inject = [
        "toaster",
        "Spinner",
        "$state",
        "$http"
    ];
})();