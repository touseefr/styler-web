(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Users
     * @module BeautyCollective.Users
     *
     * @description
     * Responsible for every action which is performed on user
     *
     * @see Users.model.js
     * @see Users.resource.js
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Users', ['ui.select', 'ui.mask'])
})();

(function () {
    'use strict';
    /**
     * @name BeautyCollective.Users.config.ViewUserState
     * @module BeautyCollective.Users
     *
     * @description
     * view user
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Users')
            .config(ViewUserState);


    /* @ngInject */
    function ViewUserState($stateProvider) {
        $stateProvider
                .state('users.viewuser', {
                    parent: 'users',
                    url: '/view/:user_id',
                    data: {
                        roles: ['ROLE_ADMIN', 'ROLE_SYSTEM_ADMIN'],
                        pageTitle: 'createuser.update_title'
                    },
                    views: {
                        'users': {
                            templateUrl: 'modules/users/view-user/view-user.html',
                            controller: 'ViewUserController as _self'
                        }
                    },
                    resolve: {
                        translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                                $translatePartialLoader.addPart('create-user');
                                return $translate.refresh();
                            }]
                    }
                });



    }

    ViewUserState.$inject = ["$stateProvider"];
})();

(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Users.Controller.ViewUserController
     * @module BeautyCollective.Users
     *
     * @description
     * ViewUserController is responsible every action on list view page
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Users')
            .controller('ViewUserController', ViewUserController);

    /* @ngInject */
    function ViewUserController($state, Logger, UsersModel, ResponseHandler, ProjectsModel, utilFactory, ProjectsFactory) {
        var _userId,
                self = this;

        self.projects = ProjectsModel.projectsList;


        init();

        /**
         * [init description]
         * @return {void}
         */
        function init() {
            Logger.getInstance('ViewUserController').info('Controller has initialized');
            self.pageTitle = $state.current.data.pageTitle;
            getUser();
        }

        function getProjects() {
            ProjectsFactory.getProjects({
                'page': 1,
                'per_page': 999999,
                'predicate': 'id',
                'isSortReverse': true
            }).then(function () {
                setUserProject();
            })
        }

        /**
         * getUser find user by ID
         * @return {void}
         */
        function getUser() {

            _userId = $state.params.user_id ? parseInt($state.params.user_id) : null;
            if (!_userId) {
                self.user = angular.extend({}, UsersModel.user);
                return;
            }

            UsersModel.find({
                'id': _userId
            }).then(function (user) {
                self.user = user;
                setRolesName(user.roles);
                if (self.user.projectIds && self.user.projectIds.length > 0) {
                    getProjects();
                }
            }).catch(ResponseHandler.error);
        }

        /**
         * setRolesName
         * create a string of role's name
         *
         * @param {[type]} roles [description]
         */
        function setRolesName(roles) {
            var roleList = utilFactory.getRoleNameByType(roles).join("/");
            self.user.roles = roleList;
        }

        function setUserProject() {
            var projects = [];
            _.each(self.projects, function (project) {
                if (self.user.projectIds.indexOf(project.projectid) >= 0) {
                    projects.push(project);
                }
            })

            self.user.projects = projects;
        }

    }

    ViewUserController.$inject = ["$state", "Logger", "UsersModel", "ResponseHandler", "ProjectsModel", "utilFactory", "ProjectsFactory"];
})();

(function () {
    'use strict';
    /**
     * @name BeautyCollective.Users.config.CreateUserState
     * @module BeautyCollective.Users
     *
     * @description
     * Create user
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Users')
            .config(CreateUserState);

    /* @ngInject */
    function CreateUserState($stateProvider) {
        $stateProvider
                .state('users.create', {
                    parent: 'users',
                    url: '/create',
                    data: {
                        roles: ['ROLE_ADMIN', 'ROLE_SYSTEM_ADMIN'],
                        pageTitle: 'createuser.title'
                    },
                    views: {
                        'users': {
                            templateUrl: 'modules/users/create/create.html',
                            controller: 'CreateUserController as _self'
                        }
                    },
                    resolve: {
                        translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                                $translatePartialLoader.addPart('create-user');
                                return $translate.refresh();
                            }]
                    }
                });


        $stateProvider
                .state('users.update', {
                    parent: 'users',
                    url: '/update/:user_id',
                    data: {
                        roles: ['ROLE_ADMIN', 'ROLE_SYSTEM_ADMIN'],
                        pageTitle: 'createuser.update_title'
                    },
                    views: {
                        'users': {
                            templateUrl: 'modules/users/create/update.html',
                            controller: 'CreateUserController as _self'
                        }
                    },
                    resolve: {
                        translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                                $translatePartialLoader.addPart('create-user');
                                return $translate.refresh();
                            }]
                    }
                });


    }

    CreateUserState.$inject = ["$stateProvider"];
})();

(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Users.Controller.CreateUserController
     * @module BeautyCollective.Users
     *
     * @description
     * CreateUserController is responsible every action on list view page
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Users')
            .controller('CreateUserController', CreateUserController);

    /* @ngInject */
    function CreateUserController($state, Logger, UsersModel, Spinner, UsersFactory, notify, $filter, ResponseHandler, $modal, Auth, ProjectsFactory, ProjectsModel) {
        var _userId,
                self = this;

        self.projects = ProjectsModel.projectsList || [];


        init();

        /**
         * [init description]
         * @return {void}
         */
        function init() {
            Logger.getInstance('CreateUserController').info('Controller has initialized');
            self.pageTitle = $state.current.data.pageTitle;
            self.roles = Auth.roles();
            getUser();
        }

        /**
         * getUser find user by ID
         * @return {void}
         */
        function getUser() {
            _userId = $state.params.user_id ? parseInt($state.params.user_id) : null;
            if (!_userId) {
                self.user = angular.extend({}, UsersModel.user);
                return;
            }

            UsersModel.find({
                'id': _userId
            }).then(function (user) {
                parseUserResponse(user);
            }).catch(UsersFactory.errorHandler);
        }

        /**
         * parseUserResponse updates self.user model
         *
         * @param  {object | array} user User Object
         * @return {[void]}
         */
        function parseUserResponse(user) {
            var _user = angular.copy(user);
            _user.roles = UsersFactory.getRolesByTypes(user.roles);
            self.user = _user;
        }


        /**
         * saveUser
         * Create/Update user
         *
         * @requires self.user
         * self.user object is a user's data to be sent to server
         *
         * @see UserModel
         * @see UserResource
         *
         * @return {void}
         */
        self.saveUser = function () {
            /**
             * _user
             * lets copy the self.user to break the reference link
             * @type {object}
             */
            var _user = angular.copy(self.user),
                    /**
                     * roles
                     * stores a list of user role's type (etc ['ADMIN', 'TESTER'])
                     * @return {array}       An array of user's role's type
                     */
                    roles = _user.roles.map(function (role) {
                        return role.type;
                    }),
                    resource;
            //update user roles
            _user.roles = roles;
            /**
             * remove confirm_password property from _user model, its not required to send on server
             * @action OnCreate
             */
            if (_user.hasOwnProperty('confirm_password')) {
                delete _user.confirm_password;
            }
            /**
             *  remove password property from _user model, its not required to send on server OnUpdate action
             *  @action OnUpdate
             */
            if (_userId && _user.hasOwnProperty('password')) {
                delete _user.password;
            }
            Spinner.show();

            resource = _userId ? UsersModel.update({
                id: _user.id
            }, _user) : UsersModel.create(_user);

            resource.then(function (response) {
                Spinner.hide();
                if (response.type === 'ERROR') {
                    notify.error({
                        title: 'Error',
                        message: $filter('translate')('SERVER.' + response.code)
                    })
                    return;
                }
                $state.go('users.list');
                notify.success({
                    'title': 'Success',
                    'message': $filter('translate')('createuser.message.success.user_saved', {
                        user_name: _user.firstName
                    })
                });

            }).catch(ResponseHandler.error);
        };

        /**
         * openPhotoModal
         * launch modal to upload user's profile photo
         *
         * @return {void}
         */
        self.openPhotoModal = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'modules/users/update-user-photo/update-user-photo.html',
                controller: 'UpdateUserPhotoController as modalCtrl',
                size: '',
                resolve: {
                    selectedUser: function () {
                        return self.user;
                    }
                }
            });
        };

        /**
         * getProjects
         * Retrieves a list of available project of logged in users
         *
         * @see ProjectsFactory.getProjects(options)
         * @return {void}
         */
        function getProjects() {
            ProjectsFactory.getProjects({
                'page': 1,
                'per_page': 999999,
                'predicate': 'name',
                'isSortReverse': true
            });
        }

        getProjects();

    }

    CreateUserController.$inject = ["$state", "Logger", "UsersModel", "Spinner", "UsersFactory", "notify", "$filter", "ResponseHandler", "$modal", "Auth", "ProjectsFactory", "ProjectsModel"];
})();

(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Pages
     * @module BeautyCollective.Pages
     *
     * @description
     * Pages module responsible for all static pages
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Pages', []);
})();
(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Pages.PrivacyPolicyStateConfig
     * @module BeautyCollective.Pages
     *
     * @description
     * Static page states
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Pages')
            .config(PrivacyPolicyStateConfig);

    /* @ngInject */
    function PrivacyPolicyStateConfig($stateProvider) {
        $stateProvider
                .state('page.privacypolicy', {
                    url: '/privacy-policy',
                    data: {
                        roles: [],
                        pageTitle: 'Privacy Policy'
                    },
                    views: {
                        'page-content': {
                            templateUrl: 'modules/pages/privacy-policy/privacy-policy.html',
                            controller: 'PrivacyPolicyController'
                        }
                    }
                });
    }

    PrivacyPolicyStateConfig.$inject = ["$stateProvider"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Pages.Controller.PrivacyPolicyController
     * @module BeautyCollective.Pages
     *
     * @description
     * PrivacyPolicyController is responsible for privacy policy page
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Pages')
            .controller('PrivacyPolicyController', PrivacyPolicyController);

    /* @ngInject */
    function PrivacyPolicyController($scope, $state, Logger) {
        var logger;
        init();

        function init() {
            setLogger();
            $scope.pageTitle = $state.current.data.pageTitle;
        }

        /**
         * [setLogger description]
         * @method setLogger
         * @author Kinectro
         */
        function setLogger() {
            logger = Logger.getInstance('PrivacyPolicyController');
            logger.info('Controller has initialized');
        }
    }

    PrivacyPolicyController.$inject = ["$scope", "$state", "Logger"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Account
     * @module BeautyCollective.Account
     *
     * @description
     * Account task module
     * @see Account.model.js
     * @see Account.resource.js
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Account', ['ui.bootstrap', 'ui.bootstrap.datetimepicker']);
})();
//for blogs test
(function (){
    
   'use strict'
    angular.module('BeautyCollective.Blog')
            .config(BlogStates);

    function BlogStates($stateProvider, APP_CONFIG){
         $stateProvider.state('b', {
             url: '/b',
             absolute: true,
             views: {
                templateUrl: APP_CONFIG.modules + '/blogs/blog.html',
                controller: 'BlogController as _self'
             },
             resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }
         })
    }
    BlogtStates.$inject = ["$stateProvider", "APP_CONFIG"];
})();
//blogs controller
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * 
     * @description
     * WatchListController is responsible manage user's WatchList
     *
     * @author Kinectro
     */
    function BlogController($state,BlogModel,$scope){
        var self=this;
        init();

        function init() {
            //self.currentPage = 0;
           // self.pageSize = 10;
            if ($state.current.name == 'b') {
                blogs();
            }
    }
    BlogController.$inject = ["$window", "$scope", "$state"];
    //end of controller
}
})();


(function () {
    'use strict';
    /**
     * @ngdoc config
     *
     * @name BeautyCollective.Account.config.WatchListStates
     * @module BeautyCollective.Account
     *
     * @description
     * Configure Account module routes
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Account')
            .config(WatchListStates);

    /* @ngInject */
    function WatchListStates($stateProvider, APP_CONFIG) {
        $stateProvider.state('watchlist', {
            parent: 'account',
            url: '^/watchlist',
            absolute: true,
            views: {
                'account_content_view': {
                    template: '<div ui-view="account_content_view" class="fadeIn animated"/>'
                            //templateUrl: APP_CONFIG.modules + '/account/watch_list/watch-list.html',
                            //controller: 'WatchListController as _self'
                },
                'account_top_nav_view': {
                    templateUrl: APP_CONFIG.modules + '/account/watch_list/watch-list-nav.html'
                            // controller: 'WatchListController as _self'
                }
            }
        }).state('watchlist.listing', {
            parent: 'watchlist',
            url: '/listing',
            views: {
                'account_content_view@watchlist': {
                    templateUrl: APP_CONFIG.modules + '/account/watch_list/watch-list.html',
                    controller: 'WatchListController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }
        }).state('watchlist.jobseeker', {
            parent: 'watchlist',
            url: '/jobseeker',
            views: {
                'account_content_view@watchlist': {
                    templateUrl: APP_CONFIG.modules + '/account/watch_list/jobseeker.html',
                    controller: 'WatchListController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }
        });
    }

    WatchListStates.$inject = ["$stateProvider", "APP_CONFIG"];
})();

(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.WatchListController
     * @module BeautyCollective.Account
     *
     * @description
     * WatchListController is responsible manage user's WatchList
     *
     * @author Kinectro
     */

    /* @ngInject */
    function WatchListController($state, AccountModel, toaster, $location, Spinner) {
        var self = this;
        self.statusText = "";

        /**
         * initialize properties
         *
         * @private
         * @return {void}
         */
        self.showClass = function ($value) {
            var return_class = "";
            if ($value == "Expired") {
                return_class = "btn-orange-1";
            } else if ($value == "Deleted") {
                return_class = "btn-danger";
            } else {
                return_class = "bg-teal";
            }
            return return_class;
        }
        self.checkvalues = function ($list) {
            var return_info = "";
            if ($list.expiry) {                
                if (moment().isSameOrAfter($list.expiry)) {
                    return_info = "Expired";
                } else {
                    return_info = "Active";
                }
            }
            if ($list.deleted_at) {
                return_info = "Deleted";
            }
            return return_info;
        }

        function init() {
            /**
             * [jobseeker list]
             * @True {Array}
             */
            self.watchlist = [];
            //self.getWatchList();
            self.currentPage = 0;
            self.pageSize = 6;
            self.host = '.';

            /*
             ** job seeker section
             */

            getWatchListjobseeker();

            getWatchListlisting();
        }

        /**
         * getWatchList
         * @params {Object}
         * @return {id}
         */
        self.getWatchList = function () {
            AccountModel.getWatchList().then(function (response) {
                self.watchlist = angular.copy(response);

                //self.watchlist = responce;
                if (self.watchlist.length) {
                    self.statusText = "";
                    _.each(self.watchlist, function (list, index) {
                        if (list.type === 'job') {
                            list.url = 'jobs';
                        }
                        if (list.type === 'classified') {
                            list.url = 'classifieds';
                        }
                        if (list.type === 'gallery') {
                            list.url = 'gallery';
                        }
                        if (list.type === 'businessforsale') {
                            list.url = 'business';
                        }
                        if (list.type === 'deal') {
                            list.url = 'deals';
                        }
                    });
                    alert(JSON.stringify(self.watchlist.data));
                    self.numberOfPages = function () {
                        return Math.ceil(self.watchlist.length / self.pageSize);
                    };
                } else {
                    self.statusText = "No Record Found";
                }
            }, function (error) {
                return [];
            });
        };
//        self.numberOfPages = function () {
//            return Math.ceil(self.watchlist.length / self.pageSize);
//        };

        self.delete_options = function ($event, watchlist_id) {
            $event.preventDefault();

            $("#delete_options_" + watchlist_id).slideToggle("slow");


        };

        self.delete_options_cancel = function ($event, watchlist_id) {
            $event.preventDefault();

            $("#delete_options_" + watchlist_id).slideToggle("slow");

        };

        self.watchlistdelete = function ($event, watchlist_id, watchtype) {
            $event.preventDefault();

            Spinner.start();
            AccountModel.watchlistdelete({
                id: watchlist_id,
                watchtype: watchtype
            }).then(function (responseData) {
                Spinner.stop();
                toaster.pop('success', "Watchlist Deleted", "Watchlist has been deleted successfully.");
                $state.go($state.current, {}, {
                    reload: true
                });

            }, function (errorResponse) {
                console.log('unable to delete watchlist : ', errorResponse);
            })

        };

        /**
         
         **get getWatchListjobseeker
         
         **/
        function getWatchListjobseeker() {

            AccountModel.getWatchListjobseeker().then(function (response) {

                self.getWatchListjobseeker = angular.copy(response);
                //alert(JSON.stringify(self.getWatchListjobseeker.data));

                self.numberOfPages = function () {
                    return Math.ceil(self.getWatchListjobseeker.data.length / self.pageSize);
                }
                //var _totalrating = 0;
            }, function (error) {
                //Spinner.stop();
            });

        }

        /**
         
         **get getWatchListlisting
         
         **/
        function getWatchListlisting() {

            AccountModel.getWatchListlisting().then(function (response) {

                self.getWatchListlisting = angular.copy(response);
                //alert(JSON.stringify(self.getWatchListlisting.data));


                if (self.getWatchListlisting.data.length) {
                    self.statusText = "";
                    _.each(self.getWatchListlisting.data, function (list, index) {
                        if (list.type === 'job') {
                            list.url = 'jobs';
                        }
                        if (list.type === 'classified') {
                            list.url = 'classifieds';
                        }
                        if (list.type === 'gallery') {
                            list.url = 'gallery';
                        }
                        if (list.type === 'businessforsale') {
                            list.url = 'business';
                        }
                        if (list.type === 'deal') {
                            list.url = 'deals';
                        }
                    });
                    //alert(JSON.stringify(self.getWatchListlisting.data));
                    /* self.numberOfPages= function(){
                     return Math.ceil(self.watchlist.length/self.pageSize);
                     }; */
                } else {
                    self.statusText = "No Record Found";
                }


                self.numberOfPages = function () {
                    return Math.ceil(self.getWatchListlisting.data.length / self.pageSize);
                }
                //var _totalrating = 0;
            }, function (error) {
                //Spinner.stop();
            });

        }

        init();

        self.timeSince = function (date) {
            return moment(moment(moment.utc(moment.utc(date)).toDate()).format('YYYY-MM-DD HH:mm:ss')).fromNow();
        };

        self.htmlToPlaintext = function (input, allowed) {
            var txt = document.createElement("textarea");
            txt.innerHTML = input;
            return txt.value;
            // allowed = (((allowed || '') + '')
            //         .toLowerCase()
            //         .match(/<[a-z][a-z0-9]*>/g) || [])
            //         .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
            // var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
            //         commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
            // return input.replace(commentsAndPhpTags, '')
            //         .replace(tags, function ($0, $1) {
            //             return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
            //         });
        }

    }

    WatchListController.$inject = ["$state", "AccountModel", "toaster", "$location", "Spinner"];
    //end of controller

    angular
            .module('BeautyCollective.Account')
            .controller('WatchListController', WatchListController);
})();

(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name UsersSidebarController
     * @module BeautyCollective.Users
     *
     * @description
     * UsersSidebarController is used to maintain the ui state for sidebar
     *
     * @author Kinectro
     */

    /* @ngInject */
    function UsersSidebarController(Principal, Logger, AclService, $scope) {
        var self = this;


        function init() {
            Logger.getInstance('UsersSidebarController').info('Controller has initialized');
        }

        Principal.identity(true).then(function (data) {
            self.user = data;
            self.profilePic = (data.profilePictureUrl !== '') ? data.profilePictureUrl : 'img/avatar.png';
        });
        init();

        $scope.can = AclService.can;
    }

    UsersSidebarController.$inject = ["Principal", "Logger", "AclService", "$scope"]; //end of controller

    angular
            .module('BeautyCollective.Users')
            .controller('UsersSidebarController', UsersSidebarController);
})();

(function () {
    'use strict';
    /**
     * @name BeautyCollective.Users.config.UsersListState
     * @module BeautyCollective.Users
     *
     * @description
     * Users list route configurations
     *
     * @author Kinectro
     */

    /* @ngInject */
    function UsersListState($stateProvider) {
        $stateProvider
                .state('users.list', {
                    parent: 'users',
                    url: '/list',
                    data: {
                        roles: ['ROLE_ADMIN', 'ROLE_SYSTEM_ADMIN', 'ROLE_PROJECT_OWNER'],
                        pageTitle: 'userslist.title'
                    },
                    views: {
                        'users': {
                            templateUrl: 'modules/users/list/list.html',
                            controller: 'UsersListController as _self'
                        }
                    },
                    resolve: {
                        translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                                $translatePartialLoader.addPart('users-list');
                                return $translate.refresh();
                            }]
                    }
                });
    }

    UsersListState.$inject = ["$stateProvider"];

    angular
            .module('BeautyCollective.Users')
            .config(UsersListState);
})();

(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Users.Controller.UsersListController
     * @module BeautyCollective.Users
     *
     * @description
     * UsersListController is responsible every action on list view page
     *
     * @author Kinectro
     */

    /* @ngInject */
    function UsersListController($scope, $state, Logger, UsersModel, UsersFactory, Spinner, _$modal, $filter, notify, $translate, APP_CONFIG, AclService) {
        var self = this;

        self.users = UsersModel.userslist || [];
        init();

        /**
         * initialize properties
         *
         * @private
         * @return {void}
         */
        function init() {
            Logger.getInstance('UsersListController').info('Controller has initialized');
            // $scope.pageTitle = $state.current.data.pageTitle;

            self.maxSize = 5;
            self.currentPage = 1;
            self.perPage = APP_CONFIG.item_per_page;
            self.predicate = 'id';
            self.isSortReverse = true;
            getAllUsers();
        }

        /**
         * pageChanged is called when pagination is changed
         *
         * @public
         * @return {void}
         */
        self.pageChanged = function () {
            Spinner.show();
            getAllUsers();
        };

        /**
         * sortColumnBy is called when table column headers are clicked
         *
         * @public
         * @return {void}
         */
        self.sortColumnBy = function (predicate) {
            self.isSortReverse = (self.predicate === predicate) ? !self.isSortReverse : false;
            self.predicate = predicate;
            self.currentPage = 1;
            getAllUsers();
        };

        self.isSortColumnBy = function (predicate) {
            return (predicate === self.predicate) ? true : false;
        };

        /**
         * parse getAllusers response
         * @param  {Array|Object} responseData
         *
         * @private
         * @return {Void}
         */
        function parseResponse(responseData) {
            if (responseData.length === 0) {
                return;
            }
            UsersModel.userslist.length = 0;
            for (var i = 0; i < responseData.length; i++) {
                UsersModel.userslist.push(responseData[i]);
            }
            Spinner.hide();
        }

        /**
         * get All users
         *
         * @requires page
         * @requires per_page
         * @requires sort_query
         *
         * @private
         * @return {[type]} [description]
         */
        function getAllUsers() {
            var _sortBy = self.isSortReverse ? '-' : '';
            UsersModel.findAll({
                'page': self.currentPage,
                'per_page': self.perPage,
                'sort_query': _sortBy + self.predicate
            }).then(function (successResponse) {
                self.totalCount = successResponse.totalCount;
                parseResponse(successResponse.list);
            }).catch(UsersFactory.errorHandler);
        }

        /**
         * delete user by userId
         * this is soft delete
         *
         * @param  {Object} user
         *
         * @public
         * @return {void}
         */
        self.deleteUser = function (user) {
            var _userId = parseInt(user.id);
            _$modal
                    .confirm($filter('translate')('userslist.confirm_modal.delete.header'), $filter('translate')('userslist.confirm_modal.delete.msg'), {
                        'size': 'sm'
                    })
                    .result
                    .then(function (btn) {
                        UsersModel.delete({
                            'id': _userId
                        }).then(function (response) {
                            if (response.type === 'ERROR') {
                                notify.error({
                                    title: 'Error',
                                    message: $filter('translate')('SERVER.' + response.code)
                                })
                                return;
                            }

                            notify.success({
                                'title': 'Success',
                                'message': $filter('translate')('userslist.message.success.user_deleted', {
                                    user_name: user.firstName
                                })
                            });
                            UsersModel.excludeUser(_userId);

                        }).catch(UsersFactory.errorHandler);
                    }, function (btn) {
                        //error callback
                    });
        };
        /**
         * update user's status
         *
         * @param  {object} user
         * @return {void}
         */
        self.updateUserStatus = function (user) {
            var _userId = parseInt(user.id);
            var modalKeys = {
                header: user.active ? 'userslist.confirm_modal.disable.header' : 'userslist.confirm_modal.enable.header',
                message: user.active ? 'userslist.confirm_modal.disable.msg' : 'userslist.confirm_modal.enable.msg'
            };
            _$modal
                    .confirm($filter('translate')(modalKeys.header), $filter('translate')(modalKeys.message), {
                        'size': 'sm'
                    })
                    .result
                    .then(function (btn) {
                        UsersModel.updateStatus({
                            id: _userId,
                            action: 'activate',
                            action_value: !user.active
                        }).then(function (response) {
                            if (response.type === 'ERROR') {
                                notify.error({
                                    title: 'Error',
                                    message: $filter('translate')('SERVER.' + response.code)
                                })
                                return;
                            }
                            var translatedMessage = $filter('translate')('userslist.message.success.user_status', {
                                user_name: user.firstName,
                                status_action: user.active ? 'disabled' : 'enabled'
                            });
                            notify.success({
                                'title': 'Success',
                                'message': translatedMessage
                            });

                            user.active = !user.active;

                        }).catch(UsersFactory.errorHandler);

                    }, function (btn) {
                        //error callback
                    });

        };

        $scope.can = AclService.can;

    }

    UsersListController.$inject = ["$scope", "$state", "Logger", "UsersModel", "UsersFactory", "Spinner", "_$modal", "$filter", "notify", "$translate", "APP_CONFIG", "AclService"]; //end of controller

    angular
            .module('BeautyCollective.Users')
            .controller('UsersListController', UsersListController);
})();

(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Pages.ContactSupportStateConfig
     * @module BeautyCollective.Pages
     *
     * @description
     * Static page states
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Pages')
            .config(ContactSupportStateConfig);

    /* @ngInject */
    function ContactSupportStateConfig($stateProvider) {
        $stateProvider
                .state('page.contactsupport', {
                    url: '/contact-support',
                    data: {
                        roles: [],
                        pageTitle: 'Contact Support'
                    },
                    views: {
                        'page-content': {
                            templateUrl: 'modules/pages/contact-support/contact-support.html',
                            controller: 'ContactSupportController'
                        }
                    }
                });
    }

    ContactSupportStateConfig.$inject = ["$stateProvider"];
})();

(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Pages.Controller.ContactSupportController
     * @module BeautyCollective.Pages
     *
     * @description
     * ContactSupportController is responsible for contact support page
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Pages')
            .controller('ContactSupportController', ContactSupportController);

    /* @ngInject */
    function ContactSupportController($scope, $state, Logger) {
        var logger;
        init();

        function init() {
            setLogger();
            $scope.pageTitle = $state.current.data.pageTitle;
        }

        /**
         * [setLogger description]
         * @method setLogger
         * @author Kinectro
         */
        function setLogger() {
            logger = Logger.getInstance('ContactSupportController');
            logger.info('Controller has initialized');
        }
    }

    ContactSupportController.$inject = ["$scope", "$state", "Logger"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Pages.HelpStateConfig
     * @module BeautyCollective.Pages
     *
     * @description
     * Static page states
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Pages')
            .config(HelpStateConfig);

    /* @ngInject */
    function HelpStateConfig($stateProvider) {
        $stateProvider
                .state('page.help', {
                    url: '/help',
                    data: {
                        roles: [],
                        pageTitle: 'Contact Support'
                    },
                    views: {
                        'page-content': {
                            templateUrl: 'modules/pages/help/help.html',
                            controller: 'HelpController'
                        }
                    }
                });
    }

    HelpStateConfig.$inject = ["$stateProvider"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Pages.Controller.HelpController
     * @module BeautyCollective.Pages
     *
     * @description
     * HelpController is responsible for Help page
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Pages')
            .controller('HelpController', HelpController);

    /* @ngInject */
    function HelpController($scope, $state, Logger) {
        var logger;
        init();

        function init() {
            setLogger();
            $scope.pageTitle = $state.current.data.pageTitle;
        }

        /**
         * [setLogger description]
         * @method setLogger
         * @author Kinectro
         */
        function setLogger() {
            logger = Logger.getInstance('HelpController');
            logger.info('Controller has initialized');
        }
    }

    HelpController.$inject = ["$scope", "$state", "Logger"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc config
     *
     * @name BeautyCollective.Account.config.UserStates
     * @module BeautyCollective.Account
     *
     * @description
     * Configure Account module routes
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Account')
            .config(UserStates);

    /* @ngInject */
    function UserStates($stateProvider, APP_CONFIG) {

        $stateProvider.state('user', {
            parent: 'account',
            absolute: true,
            url: '^/user',
            views: {
                'account_content_view': {
                    template: '<div ui-view="user_view" class="fadeIn animated"/>'
                }
            }
        }).state('user.detail', {
            parent: 'user',
            url: '/detail',
            views: {
                'user_view@user': {
                    templateUrl: APP_CONFIG.modules + '/account/user/user-details.html',
                    controller: 'UserController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }

        }).state('user.reviews', {
            parent: 'user',
            url: '/reviews',
            views: {
                'user_view@user': {
                    templateUrl: APP_CONFIG.modules + '/account/user/user-reviews.html',
                    controller: 'UserController as _self'
                }
            }
        }).state('user.job_preferences', {
            parent: 'user',
            absolute: true,
            url: '/job',
            views: {
                'user_view@user': {
                    template: '<div ui-view="job_preferences_views" class="fadeIn animated"/>'
                },
                'account_top_nav_view@account': {
                    templateUrl: function () {
                        return APP_CONFIG.modules + '/account/user/job-dashboard-nav.html'
                    }
                }
            },
            resolve: {
                JobResolveData: ['AccountModel', '$q', function (AccountModel, $q) {
                        var deferred = $q.defer();
                        AccountModel.findJob({
                            id: null
                        }).then(function (response) {
                            var jobs_applied = {};
                            response.jobs_applied.forEach(function (obj) {
                                jobs_applied[obj.id] = obj;
                            });
                            var jobPreferred = response.jobs_preferred.filter(function (obj) {
                                return !(obj.id in jobs_applied);
                            });
                            deferred.resolve({
                                'jobs_applied': response.jobs_applied,
                                'jobs_preferred': jobPreferred,
                                'jobs_shortlisted': response.jobs_shortlisted
                            });
                        }, function (error) {
                            deferred.resolve({});
                        });
                        return deferred.promise;
                    }]
            }
        }).state('user.job_preferences.dashboard', {
            parent: 'user.job_preferences',
            url: '^/job/dashboard',
            views: {
                'job_preferences_views@user.job_preferences': {
                    templateUrl: APP_CONFIG.modules + '/account/user/job_preferences_dashboard.html',
                    controller: 'UserJobController as _self'
                }
            },
            resolve: {
                JobResolveData: ["JobResolveData", function (JobResolveData) {
                        return JobResolveData.jobs_preferred;
                    }]
            }
        }).state('user.job_preferences.shortlisted', {
            parent: 'user.job_preferences',
            url: '^/job/shortlisted',
            views: {
                'job_preferences_views@user.job_preferences': {
                    templateUrl: APP_CONFIG.modules + '/account/user/job_preferences_shortlisted.html',
                    controller: 'UserJobController as _self'
                }
            },
            resolve: {
                JobResolveData: ["JobResolveData", function (JobResolveData) {
                        return JobResolveData.jobs_preferred;
                    }]
            }
        }).state('user.job_preferences.preferences', {
            parent: 'user.job_preferences',
            url: '^/job/preferences',
            views: {
                'job_preferences_views@user.job_preferences': {
                    templateUrl: APP_CONFIG.modules + '/account/user/job_preferences.html',
                    controller: 'UserJobController as _self'
                }
            },
            resolve: {
                JobResolveData: ["JobResolveData", function (JobResolveData) {
                        return JobResolveData.jobs_applied;
                    }]
            }
        });
    }

    UserStates.$inject = ["$stateProvider", "APP_CONFIG"];
})();

(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.UserJobController
     * @module BeautyCollective.Account
     *
     * @description
     * UserJobController is responsible manage user's review and jobs
     *
     * @author Kinectro
     */

    /* @ngInject */
    function UserJobController($http, $state, AccountModel, JobResolveData, moment, Spinner, toaster, $rootScope) {
        var self = this;
        init();

        /**
         * initialize properties
         *
         * @private
         * @return {void}
         */

        function init() {
            self.JobListing = (JobResolveData) ? JobResolveData : null;

        }


        self.formatDate = function (date) {
            var dateOut = new Date(date);
            return dateOut;
        }

        self.appliedjob = function ($listing_id, $user_id) {
            Spinner.start();
            $http({
                method: "POST",
                url: main_url + "/job/applied",
                data: {
                    'listing_id': $listing_id,
                    'user_id': lgin_user_id
                }
            }).then(function mySuccess(response) {
                Spinner.stop();
                toaster.pop('success', "Job Saved", "Job has been saved.");
                $state.go('user.job_preferences.preferences', {}, {
                    reload: true
                });

            }, function myError(response) {
                console.log(response.statusText);
            });


        }

        $rootScope.base64_encode = function (value) {
            return btoa(value);
        };
        $rootScope.base64_decode = function (value) {
            return atob(value);
        };
    }

    UserJobController.$inject = ["$http", "$state", "AccountModel", "JobResolveData", "moment", "Spinner", "toaster", "$rootScope"];
    //end of controller

    angular
            .module('BeautyCollective.Account')
            .controller('UserJobController', UserJobController);
})();

(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.UserController
     * @module BeautyCollective.Account
     *
     * @description
     * UserController is responsible manage user's review
     *
     * @author Kinectro
     */

    /* @ngInject */
    function UserController($state, SuburbsModel, AccountModel, ResolveData, toaster, CategoriesModel, Spinner, Laravel) {
        var self = this;
        init();
        self.temp1 = '';
        self.temp2 = '';
        self.temp = [];
        self.posttitle = [];
        self.jobType = [];
        self.showspinner = 0;
        self.showCatSpinner = 0;
        self.usertype = self.usertype = JSON.parse(Laravel.roles)[0].name;
        /**
         * initialize properties
         *
         * @private
         * @return {void}
         */
        function init() {
            if (Laravel) {

            }
            getRoleCategories();
            getTypeCategories();
            self.categoriesList = [];
            self.suburbList = [];
            console.log(ResolveData);
            self.userModel = {
                'id': ResolveData.id,
                'name': ResolveData.name,
                'address': (ResolveData.user_info) ? ResolveData.user_info.address : '',
                'state': (ResolveData.user_info && ResolveData.user_info.state) ? ResolveData.user_info.state : null,
                'postcode': (ResolveData.user_info && ResolveData.user_info.postcode) ? ResolveData.user_info.postcode : null,
                // 'suburb': (ResolveData.user_info && ResolveData.user_info.suburb) ? ResolveData.user_info.suburb : null,

                'suburb': [{
                        location: ResolveData.user_info.suburb,
                        state: ResolveData.user_info.state,
                        postcode: ResolveData.user_info.postcode
                    }],
                'email': ResolveData.email,
                'gender': (ResolveData.user_info && ResolveData.user_info.gender) ? ResolveData.user_info.gender : null,
                'jobtype': (ResolveData.user_info && ResolveData.user_info.jobtype) ? JSON.parse(ResolveData.user_info.jobtype) : null,
                'jobposition': (ResolveData.user_info && ResolveData.user_info.jobposition) ? JSON.parse(ResolveData.user_info.jobposition) : null,
                'jobtitle': (ResolveData.user_info && ResolveData.user_info.jobtitle) ? ResolveData.user_info.jobtitle : null,
                'cat_id': (ResolveData.user_info && ResolveData.user_info.cat_id) ? ResolveData.user_info.cat_id : null,
                'cat_name': (ResolveData.user_info && ResolveData.user_info.cat_name) ? ResolveData.user_info.cat_name : null,
                'youtube_video': (ResolveData.user_info && ResolveData.user_info.youtube_video) ? ResolveData.user_info.youtube_video : null,
                'exp_salary': (ResolveData.user_info && ResolveData.user_info.exp_salary) ? ResolveData.user_info.exp_salary : null,
                'contact': (ResolveData.user_info && ResolveData.user_info.contact_number) ? parseInt(ResolveData.user_info.contact_number) : null,
                'iagree': (ResolveData.iagree == 1) ? true : false,
            };

            get_account_cats();
            if (self.userModel.suburb) {
                self.userModel.suburb = {
                    location: self.userModel.suburb[0].location,
                    state: self.userModel.suburb[0].state,
                    postcode: self.userModel.suburb[0].postcode
                };
            }
        }

        function get_account_cats() {

            AccountModel.getaccountcats().then(function (response) {

                self.allcats = angular.copy(response.data);
                self.userModel.catArray = self.allcats;
                if (self.userModel.cat_id != null) {
                    self.temp1 = JSON.parse(self.userModel.cat_id);
                    self.temp2 = JSON.parse(self.userModel.cat_name);
                    for (var i = 0; i < self.temp2.length; i++) {
                        self.temp.push({
                            id: self.temp1[i],
                            name: self.temp2[i]
                        });
                    }
                }
                self.userModel.cat = self.temp;
            }, function (error) {});
        }

        self.modelOptions = {
            debounce: {
                default: 500
            },
            getterSetter: true
        };
        /**
         * save user data
         *
         * @private
         * @return {void}
         */
        self.saveuser = function () {
            Spinner.start();
            var _user = angular.copy(self.userModel),
                    resource = AccountModel.update({
                        id: _user.id
                    }, _user);
            resource.then(function (successResponse) {
                toaster.pop('success', "Detail Save", "Details has been updated.");
                Spinner.stop();
            }, function (errorResponse) {
                console.log('Saving Details:', errorResponse);
                Spinner.stop();
            });
        };

        /**
         * getLocation
         * search locations based on search text
         * search is performed on postcode and city name
         *
         * @param  {[string]}
         * @return {[void]}
         */
        self.getLocation = function (val) {
            if (val.length < 4) {
                return;
            }
            self.suburbList = [];
            self.showspinner = 1;
            SuburbsModel
                    .findLocation({
                        'q': val
                    }).then(function (successResponse) {
                self.suburbList = successResponse.list;
                self.showspinner = 0;
            }, function (errorResponse) {
                self.showspinner = 0;
            });

        };

        function getRoleCategories() {
            CategoriesModel.all({
                'cat_type': 'job',
                'cat_parent': null
            }).then(function (response) {
                if (response.list.length > 0)
                    self.posttitle = response.list;
            }, function (errorResponse) {
                self.posttitle = [];
                console.log('Saving Details:', errorResponse);
            });
        }
        ;

        function getTypeCategories() {
            CategoriesModel.all({
                'cat_type': 'posttitle',
                'cat_parent': null
            }).then(function (response) {
                if (response.list.length > 0)
                    self.jobType = response.list;
            }, function (errorResponse) {
                self.jobType = [];
                console.log('Saving Details:', errorResponse);
            });
        }
        ;

        /**
         * model options
         * applied to search categories ui-select to debounce the model changes
         *
         * @type {Object}
         */
        self.getCategories = function (val) {

            if (val.length < 3) {
                return;
            }
            self.showCatSpinner = 1;
            CategoriesModel
                    .searchcategories({
                        'q': val,
                        'type' : 'service'
                    }).then(function (successResponse) {

                self.categoriesList = successResponse.list;
                self.showCatSpinner = 0;

            }, function (errorResponse) {
                console.log('Saving Details:', errorResponse);
                self.showCatSpinner = 0;

            });

        };


        self.modelOptions = {
            debounce: {
                default: 500
            },
            getterSetter: true
        };


    }

    UserController.$inject = ["$state", "SuburbsModel", "AccountModel", "ResolveData", "toaster", "CategoriesModel", "Spinner", "Laravel"];
    //end of controller

    angular
            .module('BeautyCollective.Account')
            .controller('UserController', UserController);
})();

(function () {
    'use strict';
    if (typeof _.contains === 'undefined') {
        _.contains = _.includes;
        _.prototype.contains = _.includes;
    }
    if (typeof _.object === 'undefined') {
        _.object = _.zipObject;
    }
    /**
     * @ngdoc overview
     * @name BeautyCollective
     *
     * @module BeautyCollective
     *
     * @description
     * Configuartion while provider are created
     *
     * @author Kinectro
     */
    angular.module('BeautyCollective', [
        /*
         * Order is not important. Angular makes a
         * pass to register all of the modules listed
         */

        /*
         * Everybody has access to these.
         * We could place these under every feature area,
         * but this is easier to maintain.
         */
        'BeautyCollective.Core',
        'BeautyCollective.Components.Directvies'

    ]);

    angular.element(document).ready(function () {
        var location = window.location;
        if (location.pathname == '/account') {

            angular.bootstrap(document, ['BeautyCollective.Dashboard']);
        } else {
            angular.bootstrap(document, ['BeautyCollective.GlobalBeautyCollective']);
            //            console.info('BeautyCollective.GlobalBeautyCollective is running......');
        }
    });
})();

(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name MainSidebarController
     * @module BeautyCollective
     *
     * @description
     * MainSidebarController is used to maintain the ui state for sidebar
     *
     * @author Kinectro
     */

    /* @ngInject */
    function MainSidebarController(Principal, Logger, AclService, $scope) {
        var self = this;


        function init() {
            Logger.getInstance('MainSidebarController').info('Controller has initialized');
        }

        Principal.identity(true).then(function (data) {
            self.user = data;
            self.profilePic = (data.profilePictureUrl !== '') ? data.profilePictureUrl : 'img/avatar.png';
        });
        init();

        $scope.can = AclService.can;
    }

    MainSidebarController.$inject = ["Principal", "Logger", "AclService", "$scope"]; //end of controller

    angular
            .module('BeautyCollective')
            .controller('MainSidebarController', MainSidebarController);
})();

(function () {
    'use strict';
    /**
     * @ngdoc config
     *
     * @name BeautyCollective.Account.config.AccountReviewStates
     * @module BeautyCollective.Account
     *
     * @description
     * Configure Account module routes
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Account')
            .config(AccountReviewStates);

    /* @ngInject */
    function AccountReviewStates($stateProvider, APP_CONFIG) {

        $stateProvider.state('reviews', {
            parent: 'account',
            absolute: true,
            url: '^/reviews',
            views: {
                'account_content_view': {
                    template: '<div ui-view="reviews_view" class="fadeIn animated"/>'
                },
                'account_top_nav_view': {
                    templateUrl: APP_CONFIG.modules + '/account/reviews/reviews-nav.html'
                }
            }
        }).state('reviews.dashbaord', {
            parent: 'reviews',
            url: '/dashbaord',
            views: {
                'reviews_view@reviews': {
                    templateUrl: APP_CONFIG.modules + '/account/reviews/dashboard.html',
                    controller: 'ReviewsController as _self'
                }
            }
        }).state('reviews.received-reviews', {
            parent: 'reviews',
            url: '/received-reviews',
            views: {
                'reviews_view@reviews': {
                    templateUrl: APP_CONFIG.modules + '/account/reviews/received-reviews.html',
                    controller: 'ReviewsController as _self'
                }
            },

        }).state('reviews.request', {
            parent: 'reviews',
            url: '/request',
            views: {
                'reviews_view@reviews': {
                    templateUrl: APP_CONFIG.modules + '/account/reviews/request-review.html',
                    controller: 'ReviewsController as _self'
                }
            }
        }).state('reviews.submit_review', {
            parent: 'reviews',
            url: '/submit',
            views: {
                'reviews_view@reviews': {
                    templateUrl: APP_CONFIG.modules + '/account/reviews/submit-review.html',
                    controller: 'ReviewsController as _self'
                }
            }
        }).state('reviews.faqs', {
            parent: 'reviews',
            url: '/faqs',
            views: {
                'reviews_view@reviews': {
                    templateUrl: APP_CONFIG.modules + '/account/reviews/review-faqs.html',
                    controller: 'ReviewsController as _self'
                }
            }
        });
    }

    AccountReviewStates.$inject = ["$stateProvider", "APP_CONFIG"];
})();

(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.ReviewsController
     * @module BeautyCollective.Account
     *
     * @description
     * ReviewsController is responsible manage user's review
     *
     * @author Kinectro
     */

    /* @ngInject */
    function ReviewsController(ReviewModel, moment, $state, utilFactory, toaster, Spinner, AccountModel, ResolveData) {
        var self = this;
        init();
        self.reviewList = '';
        self.userList = [];
        self.fakeDetail = '';
        /**
         * initialize properties
         *
         * @private
         * @return {void}
         */
        self.dateformatedat = function (date) {
//          return moment(date).format('dddd MMM Do YYYY');
            return moment(date).format('ddd MMM DD YYYY');
        }
        function init() {
            if ($state.current.name == 'reviews.dashbaord') {
                //ReceivedRating();
                getReviewlist();
            }
            if ($state.current.name == 'reviews.received-reviews') {
                ReceivedRating();
                //getReviewlist();
            }


            self.rate = 0;
            self.max = 5;
            self.isReadonly = false;
            self.OverallRating = 0;
            self.currentPage = 0;
            self.pageSize = 10;
        }
        self.showTitle = function ($info) {
            var user_title = "";
            if ($info.business_name) {
                user_title = $info.business_name;
            } else {
                user_title = $info.name;
            }
            return user_title;

        }
        /**
         * Save Review
         * @params {Object}
         * @return {id}
         */

        function ReceivedRating() {
            ReviewModel.UserReceivedReview({}).then(function (response) {
                self.ReceivedUserRating = angular.copy(response);
                self.numberOfPages = function () {
                    return Math.ceil(self.ReceivedUserRating.data.length / self.pageSize);
                }
                //var _totalrating = 0;
            }, function (error) {
                //Spinner.stop();
            });
            /* ReviewModel.UserReceivedReview().then(function(responce){
             alert(JSON.stringify(responce));
             //alert(responce);
             self.xxx = angular.copy(response);
             alert(xxx);
             },function(error){
             alert(error);
             }); */
        }


        self.saveReview = function () {
            if (ResolveData.user.id == self.user.id) {
                toaster.pop('error', "Review not Saved", "Sorry you can't review yourself.");
                return false;
            }
            Spinner.start();
            var _review = angular.copy(self.review);
            ReviewModel.save({
                'review': _review,
                'rate': self.rate,
                'to_user': self.user.id
            }).then(function (responce) {
                if (responce.status && responce.status == 'Already Review') {
                    toaster.pop('error', "Already Reviewed", "You have already review this user.");
                } else {
                    toaster.pop('success', "Review Saved", "Review has been saved successfully.");
                }
                self.review = '';
                self.rate = 0;
                Spinner.stop();
            }, function (error) {
                Spinner.stop();
            });
        };

        /**
         * Request Review
         * @params {Object}
         * @return {id}
         */
        self.requestReview = function () {
            Spinner.start();
            ReviewModel.requestReview({
                'customerName': self.customerName,
                'customerEmail': self.emailAddress
            }).then(function (responce) {
                toaster.pop('success', "Review Request", "Review request has been sent successfully.");
                $state.transitionTo($state.current, {}, {
                    reload: true
                });
                Spinner.stop();
            });
        };


        /**
         * getUsers
         * @params {Object}
         * @return {id}
         */
        self.getUsers = function (txt) {
            if (txt.length < 3) {
                return;
            }
            Spinner.start();
            AccountModel
                    .getUsers({
                        'q': txt
                    }).then(function (successResponse) {
                self.userList = angular.copy(successResponse);
            }, function (errorResponse) {
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
        self.hoveringOver = function (value) {
            self.overStar = value;
            self.percent = 100 * (value / self.max);
        };

        /**
         * Delete Review
         * @params {index | id | integer}
         * @return {void}
         */
        self.deleteReview = function (index, id) {
            ReviewModel.delete({
                'id': id
            });
            self.reviewList.data.splice(index, 1);
        }

        /**
         * Users Review
         * @params {index | id | integer}
         * @return {void}
         */
        function getReviewlist() {
            //alert('hellllllllllll');

            ReviewModel.all({
                'to_user': ResolveData.user.id
            }).then(function (response) {
                self.reviewList = angular.copy(response);
                //alert(JSON.stringify(self.reviewList));


                self.numberOfPages = function () {
                    return Math.ceil(self.reviewList.data.length / self.pageSize);
                }
                var _totalrating = 0;
                /*angular.forEach(self.reviewList.data, function(value, key) {
                 _totalrating += parseInt(value.rating);
                 });
                 if(self.reviewList.data.length)
                 self.OverallRating = _totalrating/self.reviewList.data.length;*/
            });
        }

        self.ReportFake = function (review) {
            Spinner.start();
            ReviewModel.reportfake({
                'data': review,
                'fakedetail': self.fakeDetail
            }).then(function (response) {
                if (response.status == "200") {
                    toaster.pop('success', "Report", "Report Fake Successfully.");
                    $('#reportfake-' + review.id).modal('hide');
                    $state.go($state.current, {}, {
                        reload: true
                    });
                } else {
                    toaster.pop('Alert', "Report", response.msg);
                }
                Spinner.stop();
            });
        }


    }

    ReviewsController.$inject = ["ReviewModel", "moment", "$state", "utilFactory", "toaster", "Spinner", "AccountModel", "ResolveData"];
    //end of controller

    angular
            .module('BeautyCollective.Account')
            .controller('ReviewsController', ReviewsController);
})();

(function () {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Account.Factory.ReviewResource
     * @module BeautyCollective.Account
     *
     * @description
     * Implements CURD operations
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Account')
            .factory('ReviewResource', ReviewResource);

    /* @ngInject */
    function ReviewResource($resource, APP_CONFIG) {

        /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
        return $resource('review/:id', {
            id: '@id',
        }, {
            find: {
                method: 'GET',
                params: {
                    id: '@id',
                }
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PUT',
                params: {
                    id: 0
                }
            },
            all: {
                method: 'GET',
                params: {
                    id: '@id',
                },
                transformResponse: transformGetResponse,
            },

            UserReceivedReview: {
                method: 'GET',
                url: 'UserReceivedReview',
                transformResponse: transformGetResponse2,
            },
            requestReview: {
                method: 'POST',
                url: 'requestreview'
            },
            delete: {
                method: 'DELETE',
                params: {
                    id: '@id',
                },
            },
            reportfake: {
                method: 'POST',
                url: 'reportfake'
            }
        });
    }

    ReviewResource.$inject = ["$resource", "APP_CONFIG"];

    function transformGetResponse(data, headersGetter) {
        var _response = {};
        _response.data = angular.fromJson(data);
        return angular.fromJson(_response);
    }

    function transformGetResponse2(data, headersGetter) {
        var _response2 = {};
        _response2.data = angular.fromJson(data);
        return angular.fromJson(_response2);
    }

})();
(function () {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Account.Service.ReviewModel
     * @module BeautyCollective.Account
     *
     * @description
     *
     * Data model for jobtask module
     * Implemenets CURD operation
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Account')
            .service('ReviewModel', ReviewModel);

    /* @ngInject */
    function ReviewModel(ReviewResource) {
        var model = this;
        /**
         * [jobList description]
         * @True {Array}
         */
        model.reviewList = [];

        /**
         * Get Review
         * @param id id
         * @return Review
         */
        model.find = function (id) {
            return ReviewResource.find(id).$promise;
        };

        model.UserReceivedReview = function () {
            return ReviewResource.UserReceivedReview().$promise;
        };

        /**
         * Create a new Review
         * @param Review Review
         * @return Review saved
         */
        model.save = function (review) {
            return ReviewResource.save(review).$promise;
        };

        /**
         * Update Review
         * @param Review Review
         * @return Review saved
         */
        model.update = function (review) {
            return ReviewResource.update(review).$promise;
        };

        /**
         * Delete Review
         * @param id id
         */
        model.delete = function (id) {
            return ReviewResource.delete(id).$promise;
        };


        /**
         * Delete Review
         * @param id id
         */
        model.all = function (id) {
            return ReviewResource.all(id).$promise;
        };

        /**
         * Request Review
         * @param object
         */
        model.requestReview = function (customer) {
            return ReviewResource.requestReview(customer).$promise;
        };

        model.reportfake = function (reportfake) {
            return ReviewResource.reportfake(reportfake).$promise;
        }
    }

    ReviewModel.$inject = ["ReviewResource"];
})();

(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Listing
     * @module BeautyCollective.Listing
     *
     * @description
     * Listing task module
     * @see Listing.model.js
     * @see Listing.resource.js
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Listing', ['ui.bootstrap', 'flow'])

    angular
            .module('BeautyCollective.Listing').config(['flowFactoryProvider', 'CSRF_TOKEN', function (flowFactoryProvider, CSRF_TOKEN) {
            // Can be used with different implementations of Flow.js
            flowFactoryProvider.factory = fustyFlowFactory;
        }]);
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
    function ListListingController($window, $scope, $rootScope, CategoriesModel, ListingModel, Listing_type, $location, moment, toaster, Spinner, $state, $http, $filter) {
        var self = this;
        self.listing = '';
        self.adddeals = '';
        self.today = $filter('date')(new Date(), 'yyyy-MM-dd')
        init();

        /**
         * initialize properties
         *
         * @private
         * @return {void}
         */

        function init() {
            $window.scrollTo('0', '250');
            getListings();
            self.currentPage = 0;
            self.pageSize = 4;
            self.host = $location.protocol() + '://' + $location.host();
        }


        /**
         * Get all the listing of a user
         *
         * @private
         * get user Listing
         * @return {Object | JSON | cuserlisting}
         */
        function getListings() {
            ListingModel.findAll({
                per_page: 999999
            }).then(function (data) {
                self.listing = angular.copy(data.list);

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

//                self.numberOfPages = function () {
//                    return Math.ceil(self.listing.data.length / self.pageSize);
//                }
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

        self.shareit = function ($List) {            
        }

        $scope.dataTableOpt = {
            "order": [
                [0, 'Desc']
            ]
        };
    }
    ListListingController.$inject = ["$window", "$scope", "$rootScope", "CategoriesModel", "ListingModel", "Listing_type", "$location", "moment", "toaster", "Spinner", "$state", "$http", "$filter"];
    //end of controller
    angular
            .module('BeautyCollective.Listing')
            .controller('ListListingController', ListListingController);
})();

(function () {
    'use strict';
    /**
     * @ngdoc config
     *
     * @name BeautyCollective.Account.config.JobSeekerStates
     * @module BeautyCollective.Account
     *
     * @description
     * Configure Account module routes
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Account')
            .config(JobSeekerStates);

    /* @ngInject */
    function JobSeekerStates($stateProvider, APP_CONFIG) {

        $stateProvider.state('job_seeker', {
            parent: 'account',
            absolute: true,
            url: '^/job_seeker',
            views: {
                'account_content_view': {
                    template: '<div ui-view="account_job_seeker_view" class="fadeIn animated"/>'
                },
                'account_top_nav_view': {
                    templateUrl: APP_CONFIG.modules + '/account/job_seeker/job_seeker-nav.html'
                }
            }
        }).state('job_seeker.find-job-seeker', {
            parent: 'job_seeker',
            url: '/find-job-seeker',
            views: {
                'account_job_seeker_view@job_seeker': {
                    templateUrl: APP_CONFIG.modules + '/account/job_seeker/find-job-seeker.html',
                    controller: 'JobSeekerController as _self'
                }
            }
        });
    }

    JobSeekerStates.$inject = ["$stateProvider", "APP_CONFIG"];
})();

(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.JobSeekerController
     * @module BeautyCollective.Account
     *
     * @description
     * JobSeekerController is responsible manage user's review
     *
     * @author Kinectro
     */

    /* @ngInject */
    function JobSeekerController($state, AccountModel, toaster, SuburbsModel, CategoriesModel, Spinner) {

        var self = this;
        self.statusText = "";
        init();

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
            self.jobseekerList = []
            //self.jobseekerList11 = [];

            //self.getCategories11 = [];
            self.categoriesList = [];
        }

        /**
         * getJobSeaker1
         * @params {Object}
         * @return {id}
         */
        self.getJobSeaker2 = function () {


            return AccountModel.getJobSeekers1(self.search).then(function (response) {
                //alert(response.length);

                // self.jobseekerList11 = responce
                //alert(json.stringify(response));
                self.jobseekerList11 = response;

                /*  if(self.jobseekerList11.data.length){
                 self.statusText = "";
                 }else{
                 self.statusText = "No Record Found";
                 } */
            }, function (error) {
                return [];
            });
        }

        /**
         * getJobSeaker
         * @params {Object}
         * @return {id}
         */
        self.getJobSeaker = function () {


            return AccountModel.getJobSeekers({
                'q': self.q
            }).then(function (responce) {
                self.jobseekerList = responce;
                //alert(JSON.stringify(self.jobseekerList));
                if (self.jobseekerList.length) {
                    self.statusText = "";
                } else {
                    self.statusText = "No Record Found";
                }
            }, function (error) {
                return [];
            });
        }

        self.getLocation = function (val) {

            if (val.length < 4) {
                return;
            }
            Spinner.start();
            SuburbsModel
                    .findLocation({
                        'q': val
                    }).then(function (successResponse) {
                self.suburbList = successResponse.list;
                Spinner.stop();
            }, function (errorResponse) {
                console.log('Saving Details:', errorResponse);
                Spinner.stop();
            });

        };

        self.getCategories11 = function (val) {

            if (val.length < 3) {
                return;
            }
            CategoriesModel
                    .searchcategories({
                        'q': val
                    }).then(function (successResponse) {

                self.categoriesList = successResponse.list;

            }, function (errorResponse) {
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

    JobSeekerController.$inject = ["$state", "AccountModel", "toaster", "SuburbsModel", "CategoriesModel", "Spinner"];
    //end of controller

    angular
            .module('BeautyCollective.Account')
            .controller('JobSeekerController', JobSeekerController);
})();


(function () {
    'use strict';
    /**
     * @ngdoc config
     *
     * @name BeautyCollective.Account.config.AccountSettingsStates
     * @module BeautyCollective.Account
     *
     * @description
     * Configure Account module routes
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Account')
            .config(AccountSettingsStates);

    /* @ngInject */
    function AccountSettingsStates($stateProvider, APP_CONFIG) {
        $stateProvider.state('settings', {
            parent: 'account',
            absolute: true,
            abstract: true,
            url: '^/settings',
            views: {
                'account_content_view': {
                    template: '<div ui-view="account_settings_view" class="fadeIn animated"/>'

                },
                'account_top_nav_view': {
                    templateUrl: APP_CONFIG.modules + '/account/settings/settings-nav.html',
                    controller: 'DashboardController as dashboardCtrl'
                }
            },
            resolve: {
                ResolveData: ['AccountModel', '$q', function (AccountModel, $q) {
                        var deferred = $q.defer();
                        AccountModel.find({
                            id: null
                        }).then(function (response) {

                            deferred.resolve({
                                'user': response
                            });
                        }, function (error) {
                            deferred.resolve({});
                        });
                        return deferred.promise;
                    }]
            }
        }).state('settings.details', {
            parent: 'settings',
            data: {
                roles: []
            },
            url: '/details',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/settings/details.html',
                    controller: 'AccountSettingsController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }

        }).state('settings.teams', {
            parent: 'settings',
            data: {
                roles: []
            },
            url: '/teams',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/team/teams.html',
                    controller: 'AccountSettingsController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }

        }).state('settings.bookings', {
            parent: 'settings',
            data: {
                roles: []
            },
            url: '/bookings',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/bookings/bookings.html',
                    controller: 'AccountSettingsController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }

        }).state('settings.blogs', {
            parent: 'settings',
            data: {
                roles: []
            },
            url: '/blogs',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/bookings/blogs.html',
                    controller: 'AccountSettingsController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }

        }).state('settings.updateteammember', {
            parent: 'settings',
            url: '^/updateteammember/:team_member_id',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/team/update_team_member.html',
                    controller: 'AccountSettingsController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }
        }).state('settings.payments_methods', {
            parent: 'settings',
            url: '/payments_methods',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/settings/payments_methods.html',
                    controller: 'AccountSettingsController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }
        }).state('settings.invoice', {
            parent: 'settings',
            url: '/invoice',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/settings/invoice.html',
                    controller: 'AccountSettingsController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }
        }).state('settings.transactions', {
            parent: 'settings',
            url: '/transactions',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/transactions/transactions.html',
                    controller: 'AccountSettingsController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }

        }).state('settings.paymethod', {
            parent: 'settings',
            url: '/paymethod',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/settings/paymethod.html',
                    controller: 'AccountSettingsController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }

        }).state('settings.invoices', {
            parent: 'settings',
            url: '/invoices',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/settings/invoices.html',
                    controller: 'AccountSettingsController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }

        }).state('settings.mygallery', {
            parent: 'settings',
            url: '/mygallery',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/gallery/gallery.html',
                    controller: 'AccountSettingsController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }
        }).state('settings.myvideos', {
            parent: 'settings',
            url: '/myvideos',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/gallery/videos.html',
                    controller: 'AccountSettingsController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }
        }).state('settings.resumeupload', {
            parent: 'settings',
            url: '/resumeupload',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/user/resume.html',
                    controller: 'AccountSettingsController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }
        }).state('settings.notifications', {
            parent: 'settings',
            data: {
                roles: []
            },
            url: '/notifications',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/notifications/notifications.html',
                    controller: 'AccountSettingsController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }

        }).state("settings.subscription", {
            parent: 'settings',
            url: '/subscription',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/subscription/subscription.html',
                    controller: 'SubscriptionController as subscriptionCtrl'
                }
            },
        }).state("settings.booking", {
            parent: 'settings',
            url: '/booking',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/booking/booking.html',
                    controller: 'BookingModuleController as bookingCtrl'
                }
            },
        }).state('settings.sms_packages', {
            parent: 'settings',
            url: '/sms_packages',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/packages/sms_packages.html',
                    controller: 'SubscriptionController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }

        }).state('settings.facebook_chat', {
            parent: 'settings',
            url: '/facebook_chat',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/packages/facebookChat.html',
                    controller: 'FacebookChatController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }

        });


        ;
    }

    AccountSettingsStates.$inject = ["$stateProvider", "APP_CONFIG"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Serviceprovider.Controller.DashboardController
     * @module BeautyCollective.Account
     *
     * @description
     * DashboardController is responsible manage account activities
     *
     * @author Kinectro ( gmail::kinectro.development@gmail.com )
     */

    /* @ngInject */
    function BookingModuleController($http, Spinner, $state, toaster, $location) {

        var _self = this;
        _self.bookings = {};
        _self.current_page = 0;
        _self.totalBooking = {};
        _self.disabled_cancel_button = 1;
        _self.total_pages = 0;
        _self.total_records = 0;
        _self.record_per_page = 10;
        _self.booking_chuncks = {};
        _self.toaser_msg = ["Book Successfully"];
        init();

        function init() {
            var params = $location.search();
            if (params.id === 1) {
                toaster.pop('success', "Booking confirm", _self.toaser_msg[(params.id - 1)]);
            }
            getBooking();
        }
        _self.showtable = 0;
        function getBooking() {
            $http({
                method: "GET",
                url: "getbooking"
            }).then(function (response) {
                _self.bookings = response;
            });
        }
        _self.getStatusClass = function (bookingStatus) {
            var classIs = '';
            if (bookingStatus == 'Void') {
                classIs = 'badge badge-void';
            } else if (bookingStatus == 'No show') {
                classIs = 'badge badge-void';
            } else if (bookingStatus == 'Cancel') {
                classIs = 'badge badge-danger';
            } else if (bookingStatus == 'Check out') {
                classIs = 'badge badge-checkout';
            } else if (bookingStatus == 'Check In') {
                classIs = 'badge badge-checkin';
            }
            return classIs;
        }
        _self.cancelBooking = function (booking_id, cancel_booking_status) {
            if (cancel_booking_status != "Cancel") {
                Spinner.start();
                $http({
                    method: 'POST',
                    url: '/cancelbooking',
                    data: {
                        bookingid: booking_id
                    }
                }).then(function (response) {
                    toaster.pop('success', "Booking cancel", "Booking cancel");
                    Spinner.stop();
                    $state.go($state.current, {}, {
                        reload: true
                    });

                });
            }
        }
        _self.disableCancel = function (status) {
            if (status == 'Cancel') {
                _self.disabled_cancel_button = 0;
                return 'disabled-cancel-btn';
            } else {
                _self.disabled_cancel_button = 1;
            }
        };

        function numberOfPages() {
            return Math.ceil(_self.total_records / _self.record_per_page);
        }
        _self.nextPage = function () {
            _self.current_page = _self.current_page + 1;
            _self.bookings = _self.booking_chuncks[_self.current_page];
        };
        _self.previousPage = function () {
            _self.current_page = _self.current_page - 1;
            _self.bookings = _self.booking_chuncks[_self.current_page];
        };
        _self.dataTableOpt = {
            "order": [
                [0, 'Desc']
            ]
        };
    }
    BookingModuleController.$inject = ["$http", "Spinner", "$state", "toaster", "$location"];
    angular.module('BeautyCollective.Account')
            .controller('BookingModuleController', BookingModuleController);
})();

(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Serviceprovider.Controller.DashboardController
     * @module BeautyCollective.Account
     *
     * @description
     * DashboardController is responsible manage account activities
     *
     * @author Kinectro
     */

    /* @ngInject */


    angular
            .module('BeautyCollective.Account')
            .controller('stripeController', function ($uibModalInstance, $location, SuburbsModel, AccountFactory, toaster, Spinner, $http, $scope, checkusersubscription, userType, plan_selected, package_selected, auth_check, promo_status, promo_code, $state, userSubscription) {
                var self = this;
                self.suburbList = [];
                self.locations = {
                    location: 'Address? (suburb,',
                    state: " or postcode)",
                    postcode: ""
                };
                self.show_register_form = 0;
                self.plan_selected = plan_selected;
                self.user_type = userType;
                self.package_selected = package_selected;
                self.token = '';
                self.stripe_error = "";
                self.show_cb = 0;
                self.showspinner = 0;
                self.auth_check = auth_check;
                self.promo_status = promo_status;
                self.promo_code = promo_code;
                self.userSubscription = userSubscription;
                self.couponerror = 0;
                self.ToggleCards = 0;
                self.show_coupon_discount_error = "";
                self.packages = {};
                self.user_type = userType;
                if (self.plan_selected == 0) {
                    self.plan_selected = 'free';
                }
                if (self.user_type == "ServiceProvider" && self.plan_selected == 'free') {
                    self.show_cb = 1;
                }
                self.packageses = checkusersubscription.getStripePackages(self.user_type)[self.package_selected];
                angular.forEach(self.packageses, function (value, key) {
                    if (key != "weekly") {
                        self.packages[key] = value;
                    }
                });
                if (self.plan_selected == 1) {
                    self.plan_selected = Object.keys(self.packages)[0];
                }
                $scope.handleStripe = function (status, response) {
                    console.log(
                            '-----------------stripe response--------------',
                                response,
                                '-----------------stripe status--------------',
                                status
                                        );
                                // return false;
                    Spinner.start();
                    showSpinner(1);
                    if (self.plan_selected != "free") {
                        if (response.error) {
                            // there was an error. Fix it.
                            self.stripe_error = response.error;
                        } else {

                            // got stripe token, now charge it or smt
                            self.token = response.id;
                            if (auth_check == 1) {
                                if (self.user_type.length > 0 && self.token) {
                                    Spinner.start();
                                    $http({
                                        method: 'POST',
                                        url: "/addsubscription",
                                        params: {
                                            stripeToken: self.token,
                                            stripeplanid: self.package_selected,
                                            stripeplantype: self.plan_selected,
                                            usertype: self.user_type,
                                            stripe_plan_id: self.packages[self.plan_selected]['plan_id'],
                                            selected_stripe_plan_tb_id: self.packages[self.plan_selected]['id'],
                                            selected_stripe_plan_tb_price: self.packages[self.plan_selected]['price'],
                                            selected_stripe_plan_tb_title: self.packages[self.plan_selected]['title'],
                                            selected_stripe_plan_tb_duration: self.packages[self.plan_selected]['duration'],
                                            usepromo: self.havepromo,
                                            plan_type: plan_selected,
                                            local_plan_id: package_selected,
                                        }
                                    }).then(function mySuccess(response) {
                                        var info = response.data;
                                        if (info.status === "200") {
                                            toaster.pop('success', "Thank you", info.msg);
                                            window.location.href = '/account';
                                        } else {
                                            toaster.pop('error', "Try Next Time.", info.msg);
                                        }
                                        Spinner.stop();
                                        showSpinner(0);
                                    });

                                } else {
                                }
                            } else {
                                self.show_register_form = 1;
                            }
                        }
                    } else {
                        if (auth_check == 0) {
                            self.show_register_form = 1;
                        } else {
                            if (self.user_type.length > 0) {
                                Spinner.start();
                                showSpinner(1);
                                $http({
                                    method: 'POST',
                                    url: "/addsubscription",
                                    params: {
                                        stripeToken: self.token,
                                        stripeplanid: self.package_selected,
                                        stripeplantype: self.plan_selected,
                                        usertype: self.user_type,
                                        usepromo: self.havepromo,
                                        plan_type: plan_selected,
                                        local_plan_id: package_selected,
                                    }
                                }).then(function mySuccess(response) {
                                    var info = response.data;
                                    if (info.status === "200") {
                                        toaster.pop('success', "Thank you", info.msg);
                                        window.location.href = '/account';
                                    } else {
                                        toaster.pop('error', "Try Next Time.", info.msg);
                                    }
                                    Spinner.stop();
                                    showSpinner(0);
                                });



                            }
                        }
                    }
                    Spinner.stop();
                    showSpinner(0);
                };
                self.BuySubmit = function () {
                  
                    var el = document.getElementById('stripeBuybutton');
                    if (el.type != 'button') {
                        var $form = $(".validation");
                        if (!$form.data('cc-on-file')) {
                            $("#stripeBuybutton").attr('disabled', true);
                            Stripe.createToken({
                                number: $('.card-num').val(),
                                cvc: $('.card-cvc').val(),
                                exp_month: $('.card-expiry-month').val(),
                                exp_year: $('.card-expiry-year').val()
                            }, $scope.handleBuyStripe);
                        }
                    return;
                    }
                    showSpinner(1);
                    $http({
                        method: 'POST',
                        url: "/buyPackage",
                        params: {
                            stripeToken: self.token,
                            stripeplanid: self.package_selected,
                            stripeplantype: self.plan_selected,
                            usertype: self.user_type,
                            usepromo: self.havepromo,
                            NewCards: self.ToggleCards
                        }
                    }).then(function mySuccess(response) {
                        var info = response.data;
                        $uibModalInstance.dismiss('cancel');
                        if (info.status === "200") {
                            $state.reload();
                            toaster.pop('success', "Thank you", info.msg);
                            // window.location.href = '/account';
                        } else {
                            toaster.pop('error', "Try Next Time.", info.msg);
                        }
                    
                        Spinner.stop();
                        showSpinner(0);
                    });
                }
                self.BuySubmit3 = function () {
                    console.log("clickeddd");
                    console.log("plan",self.plan_selected);
                    var el = document.getElementById('stripeBuybutton');
                    if (el.type != 'button' && self.plan_selected != 'free') {
                        var $form = $(".validation");
                        if (!$form.data('cc-on-file')) {
                          //  $("#stripeBuybutton").attr('disabled', true);
                           // Stripe.setPublishableKey('pk_test_XvmKBqleTGuZGhrvSSYVIwjx');
                            Stripe.createToken({
                                number: $('.card-num').val(),
                                cvc: $('.card-cvc').val(),
                                exp_month: $('.card-expiry-month').val(),
                                exp_year: $('.card-expiry-year').val(),
                            }, $scope.handleBuyStripe2);
                        }
                    return;
                    }
                    showSpinner(1);
                    $http({
                        method: 'POST',
                        url: "/addsubscription",
                        params: {
                            stripeToken: self.token,
                            stripeplanid: self.package_selected,
                            stripeplantype: self.plan_selected,
                            usertype: self.user_type,
                            stripe_plan_id: self.packages[self.plan_selected]['plan_id'],
                            selected_stripe_plan_tb_id: self.packages[self.plan_selected]['id'],
                            selected_stripe_plan_tb_price: self.packages[self.plan_selected]['price'],
                            selected_stripe_plan_tb_title: self.packages[self.plan_selected]['title'],
                            selected_stripe_plan_tb_duration: self.packages[self.plan_selected]['duration'],
                            usepromo: self.havepromo,
                            plan_type: plan_selected,
                            local_plan_id: package_selected,
                        }
                    }).then(function mySuccess(response) {
                        var info = response.data;
                        $uibModalInstance.dismiss('cancel');
                        if (info.status === "200") {
                           $state.reload();
                            toaster.pop('success', "Thank you", info.msg);
                            // window.location.href = '/account';
                        } else {
                            toaster.pop('error', "Try Next Time.", info.msg);
                        }
                        Spinner.stop();
                        showSpinner(0);
                    });
                
                }
                self.BuySubmit2 = function () {
                    console.log("buysubmit2");
                    showSpinner(1);
                    $http({
                        method: 'POST',
                        url: "/addsubscription",
                        params: {
                            stripeToken: self.token,
                            stripeplanid: self.package_selected,
                            stripeplantype: self.plan_selected,
                            usertype: self.user_type,
                            stripe_plan_id: self.packages[self.plan_selected]['plan_id'],
                            selected_stripe_plan_tb_id: self.packages[self.plan_selected]['id'],
                            selected_stripe_plan_tb_price: self.packages[self.plan_selected]['price'],
                            selected_stripe_plan_tb_title: self.packages[self.plan_selected]['title'],
                            selected_stripe_plan_tb_duration: self.packages[self.plan_selected]['duration'],
                            usepromo: self.havepromo,
                            plan_type: plan_selected,
                            local_plan_id: package_selected,
                        }
                    }).then(function mySuccess(response) {
                        var info = response.data;
                        $uibModalInstance.dismiss('cancel');
                        if (info.status === "200") {
                           $state.reload();
                            toaster.pop('success', "Thank you", info.msg);
                            // window.location.href = '/account';
                        } else {
                            toaster.pop('error', "Try Next Time.", info.msg);
                        }
                        Spinner.stop();
                        showSpinner(0);
                    });
                }
                self.changeCardMethod = function () {
                    self.ToggleCards = self.ToggleCards == 0 ? 1 : 0;
                    var el = document.getElementById('stripeBuybutton');
                    if (self.ToggleCards == 1) {
                        el.type = "button";
                    } else {
                        el.type = "submit";
                    }
                }
                $scope.handleBuyStripe2 = function (status, response) {
                    Spinner.start();
                    showSpinner(1);
                    if (response.error) {
                        // there was an error. Fix it.
                        self.stripe_error = response.error;
                        console.log('haserror',self.stripe_error);
                        $scope.$apply();
                        showSpinner(0);
                        
                    } 
                  
                    else {
                         // got stripe token, now charge it or smt
                         self.token = response.id;
                          if (auth_check == 1) {
                
                             if (self.user_type.length > 0 && self.token) {
                                 Spinner.start();
                                 $http({
                                     method: 'POST',
                                     url: "/addsubscription",
                                     params: {
                                        stripeToken: self.token,
                                        stripeplanid: self.package_selected,
                                        stripeplantype: self.plan_selected,
                                        usertype: self.user_type,
                                        stripe_plan_id: self.packages[self.plan_selected]['plan_id'],
                                        selected_stripe_plan_tb_id: self.packages[self.plan_selected]['id'],
                                        selected_stripe_plan_tb_price: self.packages[self.plan_selected]['price'],
                                        selected_stripe_plan_tb_title: self.packages[self.plan_selected]['title'],
                                        selected_stripe_plan_tb_duration: self.packages[self.plan_selected]['duration'],
                                        usepromo: self.havepromo,
                                        plan_type: plan_selected,
                                        local_plan_id: package_selected
                                     }
                                 }).then(function mySuccess(response) {
                                     var info = response.data;
                                     $uibModalInstance.dismiss('cancel');
                                     if (info.status === "200") {
                                        $state.reload();
                                         toaster.pop('success', "Thank you", info.msg);
                                         // window.location.href = '/account';
                                     } else {
                                         toaster.pop('error', "Try Next Time.", info.msg);
                                     }
                                     Spinner.stop();
                                     showSpinner(0);
                                 });
 
                             } else {           
                             }
                         } else {
                            self.show_register_form = 1;
                            $scope.$apply();
                            Spinner.stop();
                            showSpinner(0);
                         }
                                     
                    }
                    Spinner.stop();
                    // showSpinner(0);
                };
                $scope.handleBuyStripe = function (status, response) {
                    console.log(response)
                    $("#stripeBuybutton").removeAttr('disabled', true);
                    Spinner.start();
                    showSpinner(1);
                    if (response.error) {
                        // there was an error. Fix it.
                        self.stripe_error = response.error;
                        console.log(response.error);
                        console.log('haserror',self.stripe_error);
                        $scope.$apply();
                        showSpinner(0);
                    } else {

                        // got stripe token, now charge it or smt
                        self.token = response.id;
                        if (auth_check == 1) {
                            if (self.user_type.length > 0 && self.token) {
                                Spinner.start();
                                $http({
                                    method: 'POST',
                                    url: "/buyPackage",
                                    params: {
                                        stripeToken: self.token,
                                        stripeplanid: self.package_selected,
                                        stripeplantype: self.plan_selected,
                                        usertype: self.user_type,
                                        usepromo: self.havepromo,
                                        NewCards: self.ToggleCards
                                    }
                                }).then(function mySuccess(response) {
                                    var info = response.data;
                                    $uibModalInstance.dismiss('cancel');
                                    if (info.status === "200") {
                                        $state.reload();
                                        toaster.pop('success', "Thank you", info.msg);
                                        // window.location.href = '/account';
                                    } else {
                                        toaster.pop('error', "Try Next Time.", info.msg);
                                    }
                                    Spinner.stop();
                                    showSpinner(0);
                                });

                            } else {
                            }
                        } else {
                            self.show_register_form = 1;
                        }
                    }
                    Spinner.stop();
                    // showSpinner(0);
                };
                function showSpinner(show = 0) {
                    var el = document.getElementsByClassName('spinner_overlay');
                    if (show == 0) {
                        el[0].style.display = "none";
                    } else {
                        el[0].style.display = "block";
                }
                }

                function formartErrors(errors) {
                    var errorLabels = [];
                    if (angular.isObject(errors) && !errors.hasOwnProperty('success')) {
                        for (var error in errors) {
                            for (var i = 0; i < errors[error].length; i++) {
                                errorLabels.push(errors[error][i]);
                            }
                            ;
                        }
                    }
                    if (errors.hasOwnProperty('success')) {
                        if (errors.hasOwnProperty('error')) {
                            errorLabels.push(errors.error);
                        }
                    }
                    return errorLabels;
                }

                self.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                    self.plan_selected = 0;
                };


                self.getLocation = function (val) {
                    if (val.length < 4) {
                        return;
                    }
//                    Spinner.start();
                    self.suburbList = [];
                    self.showspinner = 1;
                    SuburbsModel
                            .findLocation({
                                'q': val
                            }).then(function (successResponse) {
                        self.suburbList = successResponse.list;
//                        Spinner.stop();
                        self.showspinner = 0;
                    }, function (errorResponse) {
//                        Spinner.stop();
                        self.showspinner = 0;
                    });

                };

                self.modelOptions = {
                    debounce: {
                        default: 500
                    },
                    getterSetter: true
                };

                self.registerAccount = function () {

                    if (self.user.terms_condition) {

                        Spinner.start();
                        if (self.havepromo2 == 1 && self.user.promo_code.length > 0) {
                            $http.get("/checkCoupon?coupon=" + self.user.promo_code).success(function (response) {
                                if (response.status == "200") {
                                    self.couponerror = 0;
                                    registeruseraccount();
                                } else {
                                    self.couponerror = 1;
                                    Spinner.stop();
                                }
                            });
                        } else {
                            registeruseraccount();
                        }


                    } else {
                        self.userRegister.terms_condition.$invalid = true;
                        self.userRegister.terms_condition.$pristine = false;
                    }
                    return false;
                };
                function registeruseraccount() {
                    var user;

                    self.user.name = self.user.name || (self.user.firstName + ' ' + self.user.lastName);
                    user = angular.copy(self.user);
                    if (self.user.Jobseeker) {
                        user.account_type = 'job_seeker';
                    } else {
                        user.account_type = self.user_type;
                    }
                    user.suburb = user.locations.location;
                    user.state = user.locations.state;
                    user.postcode = user.locations.postcode;
                    user.latitude = user.locations.latitude;
                    user.longitude = user.locations.longitude;
                    user.planid = self.package_selected;
                    user.sripetoken = self.token;
                    user.accounttype = 1;
                    user.hear_us = user.hear_us;
                    user.sub_newletter = user.sub_newletter;
                    user.other_option = user.other_option;
                    user.operating_hours = JSON.stringify(AccountFactory.getDefaultBusinessHours());
                    user.package_type = self.plan_selected;
                    user.plan_type = plan_selected;
                    user.stripe_plan_id = self.packages[self.plan_selected]['plan_id'];
                    user.selected_stripe_plan_tb_id = self.packages[self.plan_selected]['id'];
                    user.selected_stripe_plan_tb_price = self.packages[self.plan_selected]['price'];
                    user.selected_stripe_plan_tb_title = self.packages[self.plan_selected]['title'];
                    user.local_plan_id = package_selected;
                    var register = $http.post("/auth/register", user);

                    register.success(function (response) {
                        self.errors = [];
                        if (typeof response.success !== 'undefined' && response.success == false) {
                            self.errors.push(response.error);
                        } else {
                            //                                resetForm();
                            self.successMsg = 'Your account was successfully created. We have sent you an e-mail to confirm your account';
                            window.location = site_url() + 'account';
                        }
                        Spinner.stop();
                    });
                    register.error(function (errorResponse) {
                        self.errors = formartErrors(errorResponse);
                        self.successMsg = '';
                        toaster.pop('error', "error", errorResponse.email);
                        Spinner.stop();
                    });
                }
                self.selectBooking = function () {
                    if (self.cb_select_booking) {
//                        self.package_selected = 1;
//                        self.plan_selected = 'monthly';

                    } else {
//                        self.package_selected = 0;
                        self.plan_selected = 'free';
                    }                    
                    self.packages = checkusersubscription.getStripePackages(self.user_type)[self.package_selected];
                };

                self.getBookingDetails = function () {
                    if (self.havepromo) {
                        $http.get('coupondetail?coupon=' + self.promo_code).then(function (response) {
                            var data = response.data;
                            if (data.status == "200") {                                
                                var price = self.packages[self.plan_selected].originalprice;
                                if (data.coupon_detail[0].coupon_type == 0) {
                                    self.packages[self.plan_selected].discount = data.coupon_detail[0].coupon_amount + "%";
                                    var discount = (price * data.coupon_detail[0].coupon_amount) / 100;
                                    self.packages[self.plan_selected].price = (price - discount);
                                } else {
                                    self.packages[self.plan_selected].price = (price - data.coupon_detail[0].coupon_amount);
                                }
                            } else {
                                self.show_coupon_discount_error = data.msg;
                            }

                        }, function () {
                            console.log('Error getting all users')
                        });
                    } else {
                        self.packages[self.plan_selected].price = self.packages[self.plan_selected].originalprice;
                        self.packages[self.plan_selected].discount = "0";
                    }
                }

            })
            .controller('showPackageModalController', function ($uibModalInstance, packageDetail) {
                var _self = this;
                _self.packageDetail = packageDetail;
                _self.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

            });



    function SubscriptionController($uibModal, $scope, $state, $window, Laravel, checkusersubscription, $http, $location, $timeout, AccountModel) {

        var _self = this;
        _self.userType = 'ServiceProvider';
        _self.checkAuth = 0;
        _self.package_selected = (checkusersubscription.planid) ? checkusersubscription.planid : 0;
        _self.trail_periode = 0;
        _self.promo_status = 0;
        _self.promo_code = "";
        _self.SMS_Packages = [];
        _self.Listing_Packages = [];
        _self.businessInfo = "";
        _self.userSubscription = "";        

        if (Laravel.roles != '' && JSON.parse(Laravel.roles).length > 0) {
            _self.checkAuth = 1;
            _self.userType = JSON.parse(Laravel.roles)[0].name;
            _self.promo_status = JSON.parse(Laravel.user).pc_user_status;
            _self.promo_code = JSON.parse(Laravel.user).promo_code;
        }

        $http({
            method: "GET",
            url: "/fetch/plans"
        }).then(function mySuccess(response) {
            if (response.data.status == "200") {
                checkusersubscription.setPackages(response.data.details);
            }
        }, function myError(response) {
            console.log(response.statusText);
        });
        _self.userplanid = checkusersubscription.getPlanType();
        _self.changemodule = 0;
        _self.stripeplanid = 0;
        _self.showerror = 0;
        _self.showmsg = "";
        _self.pricing = 'Pricing';
        _self.openDialog = function (selected_plan, package_selected) {
            $uibModal.open({
                animation: false,
                templateUrl: 'apps/modules/subscription/subscription_modal.html',
                controller: 'stripeController',
                controllerAs: '$stripe',
                resolve: {
                    userType: function () {
                        return _self.userType;
                    },
                    plan_selected: function () {
                        return selected_plan;
                    },
                    package_selected: function () {
                        return package_selected;
                    },
                    auth_check: function () {
                        return _self.checkAuth;
                    },
                    promo_status: function () {
                        return  _self.promo_status;
                    }
                    ,
                    promo_code: function () {
                        return  _self.promo_code;
                    },
                    userSubscription: function () {
                        return _self.userSubscription;
                    }
                }
            });
        };
        $http({
            method: "GET",
            url: "/getPlanDetails",
            params: {userType: _self.userType}
        }).then(function mySuccess(response) {
            if (response.status == "200") {
                _self.subscriptionDetail = response.data.data;

                angular.forEach(_self.subscriptionDetail, function (value, key) {
                    var desc_template = JSON.parse(value.template_description);
                    angular.forEach(desc_template, function (entry, index) {
                        desc_template[index] = JSON.parse(entry);
                    });
                    _self.subscriptionDetail[key].template_description = desc_template;
                });
            }
        }, function myError(response) {
            console.log(response.statusText);
        });
        _self.showBtnValue = function (plan_type, booking_type, planid) {
            var returnVal = '';
            if (plan_type == 0) {
                returnVal = "Free";
            } else {
                returnVal = "Buy Now";
            }
            if (_self.userplanid == 0 && plan_type == 0) {
                returnVal = "Selected Plan";
            } else if (_self.userplanid == 1 && booking_type == 1 && plan_type == 1) {
                returnVal = "Selected Plan";
            } else if (_self.userplanid == 2 && booking_type == 0 && plan_type == 1) {
                returnVal = "Selected Plan";
            }
            return returnVal;
        }
        _self.checkFirstPlan = function (plan_type, stripe_plan_details) {
            var $planReplacement = {week: "Weekly", month: "Monthly", year: "Annaully"};
            if (plan_type == 0) {
                return "Free";
            } else {
                var html = '';
                angular.forEach(stripe_plan_details, function (value, key) {
                    if (key == 0) {
                        html = '<span>' + value['price'] + '<i class="fa fa-dollar small"></i></span> <small>' + $planReplacement[value['duration']] + '</small>';
                    }
                });
                return html;
            }
        };
        _self.checkvalue = function (textVar) {
            var newtext = textVar;            
        };
        init();

        function init() {
            var elementval = $(".change_subscrip_but_" + _self.userplanid);
            elementval.addClass("selected_package");
            showstripeerror();
            if ($state.current.name == 'settings.sms_packages') {
                getSMSPackages();
                getListingPackages();
            }

            function getSMSPackages() {
                AccountModel.getSMSPackages().then(function (response) {
                    _self.SMS_Packages = angular.copy(response.packages);
                }, function (error) {});
            }

            function getListingPackages() {
                AccountModel.getListingPackages().then(function (response) {
                    _self.Listing_Packages = angular.copy(response.packages);
                }, function (error) {});
            }
            getBusinessInfo();
        }



        _self.showCardDetails = function ($package) {            
            $uibModal.open({
                animation: false,
                templateUrl: 'apps/modules/account/packages/sms_packages_details.html',
                controller: 'showPackageModalController',
                controllerAs: '$package',
                resolve: {
                    packageDetail: function () {
                        return $package;
                    }
                }
            });
        }
        _self.CardModel = function (type, id) {
            $uibModal.open({
                animation: false,
                templateUrl: 'apps/modules/account/packages/buy_packages_form.html',
                controller: 'stripeController',
                controllerAs: '$stripe',
                resolve: {
                    userType: function () {
                        return _self.userType;
                    },
                    plan_selected: function () {
                        return type;
                    },
                    package_selected: function () {
                        return id;
                    },
                    auth_check: function () {
                        return _self.checkAuth;
                    },
                    promo_status: function () {
                        return  type == 'sms' ? _self.SMS_Packages.find(a => a.id === id) : _self.Listing_Packages.find(a => a.id === id);
                    },
                    promo_code: function () {
                        return  _self.promo_code;
                    },
                    userSubscription: function () {
                        return _self.userSubscription;
                    }
                }
            });
        }

        function showstripeerror() {
            var msg = $location.search().msg;
            var pid = $location.search().pid;
            if ($location.url().indexOf('msg') > -1) {
                _self.showmsg = msg;
                _self.showerror = 1;
                _self.changemodule = 1;
                _self.stripeplanid = pid;
                $timeout(function () {
                    _self.showerror = 0;
                }, 3000); // 3 seconds
            }
        }
        _self.hideMsg = function () {
            _self.showerror = 0;
        }

        function getBusinessInfo() {
            $http.get("/getBusinessInfo").success(function (response) {
                if (response.status == "200") {
                    _self.businessInfo = response.userbusiness;
                    _self.userSubscription = response.userSubscription;
                } else {
                }
            });
        }

        function stripeTokenHandler(token) {
            // Insert the token ID into the form so it gets submitted to the server
            var form = document.getElementById('payment-form');
            var hiddenInput = document.createElement('input');
            hiddenInput.setAttribute('type', 'hidden');
            hiddenInput.setAttribute('name', 'stripeToken');
            hiddenInput.setAttribute('value', token.id);
            form.appendChild(hiddenInput);
            var hiddenInput = document.createElement('input');
            hiddenInput.setAttribute('type', 'hidden');
            hiddenInput.setAttribute('name', 'stripeplanid');
            hiddenInput.setAttribute('value', document.getElementById('plainidstripe').value);
            form.appendChild(hiddenInput);
            // Submit the form
            form.submit();
        }

        _self.changepackage = function (plan_id) {
            _self.stripeplanid = plan_id;
            _self.changemodule = 1;
            var stripe = Stripe(publishable_key);

            // Create an instance of Elements.
            var elements = stripe.elements();

            // Custom styling can be passed to options when creating an Element.
            // (Note that this demo uses a wider set of styles than the guide below.)
            var style = {
                base: {
                    color: '#32325d',
                    lineHeight: '18px',
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    '::placeholder': {
                        color: '#aab7c4'
                    }
                },
                invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a'
                }
            };

            // Create an instance of the card Element.
            var card = elements.create('card', {
                style: style
            });

            // Add an instance of the card Element into the `card-element` <div>.
            card.mount('#card-element');

            // Handle real-time validation errors from the card Element.
            card.addEventListener('change', function (event) {
                var displayError = document.getElementById('card-errors');
                if (event.error) {
                    displayError.textContent = event.error.message;
                } else {
                    displayError.textContent = '';
                }
            });

            // Handle form submission.
            var form = document.getElementById('payment-form');
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                stripe.createToken(card).then(function (result) {
                    if (result.error) {
                        // Inform the user if there was an error.
                        var errorElement = document.getElementById('card-errors');
                    } else {
                        // Send the token to your server.
                        stripeTokenHandler(result.token);
                    }
                });
            });


            return false;
            if (plan_id != _self.userplanid) {
                $http.post("changepackage", {
                    new_plan_id: plan_id
                })
                        .success(function (response) {
                            $("#upgrade_subscript").text("package successfully change!");
                            $("#upgrade_subscript").fadeIn('slow', 'linear');
                            setTimeout(function () {
                                $("#upgrade_subscript").fadeOut('slow', 'linear');
                            }, 2000);
                            window.location.href = '/account';
                            Spinner.stop();
                        });
            } else {                
            }
        }

        _self.cancelpayment = function () {
            _self.changemodule = 0;
        }

    }
    SubscriptionController.$inject = ["$uibModal", "$scope", "$state", "$window", "Laravel", "checkusersubscription", "$http", "$location", "$timeout", "AccountModel"];
    angular
            .module('BeautyCollective.Account')
            .controller('SubscriptionController', SubscriptionController);
})();


(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.AccountSettingsController
     * @module BeautyCollective.Account
     *
     * @description
     * AccountSettingsController is responsible manage user's review
     *
     * @author Kinectro
     */

    /* @ngInject */
    function AccountSettingsController($window, $scope, $rootScope, $sce, $state, AccountModel, ResolveData, toaster, SuburbsModel, $http, Spinner, CategoriesModel, $location, CSRF_TOKEN, NotificationModel, $timeout) {
        var self = this,
                team_id, imgid, team_member_id;
        self.payment = {
            'creditcard': false,
            'paypal': false
        };
        self.usersubscription = [];
        self.loadingspinner = 1;
        init();
        self.teams.flowFiles = [];
        self.usergallery.flowFiles = [];
        self.successfullyuploadfile = 0;
        self.SMS_Packages = [];
        self.Listing_Packages = [];



        /**
         * initialize properties
         *
         * @private
         * @return {void}
         */
        self.listingValidateForm = function (validation) {
            if (validation || self.successfullyuploadfile == 0) {
                return true;
            } else {
                return false;
            }

        }
        self.site_url = location.origin;
        self.membershipPlanid = ["plan_E0VKE9WT1Y2WE3", "plan_E0VKFf9gXOswGu", "plan_E1en4B0RGC0472", "plan_E1eoYxQNFld1yM", "plan_E0a93bgwoQUa6k",
            "plan_E1eldC6p1p9Cao", "plan_E1emJ7wxlmrwF4", "plan_E1emMYpcUKiZwr"];
        self.membershipArray = ["Monthly Add on booking system - Medium", "Annually Add on booking system - Medium", "Monthly Glamours - Premium",
            "Annually Glamours - Premium", "Monthly Glamours - Premium", "Annually Glamours - Premium", "Monthly Glamours - Premium", "Annually Glamours - Premium"];
        self.membership = function (plan_id) {
            var a = self.membershipPlanid.indexOf(plan_id);
            return (self.membershipArray[a]);
        }

        function init() {
            //alert(imgid);
            //jsload();
            /**
             * get suburbList
             *
             * @private
             * @return {void}
             */
            // self.usersubscription = ResolveData.user_subscription;
            team_member_id = ($state.params.team_member_id) ? $rootScope.base64_decode($state.params.team_member_id) : '' || null;

            if (team_member_id) {
                $window.scrollTo('0', '250');
                SetTeamMemberInform();
            }

            self.currentPage = 0;
            self.pageSize = 10;
            if ($state.current.name == 'settings.resumeupload') {
                GetMyCLandResume();
            }
            if ($state.current.name == 'settings.invoice') {
                if (ResolveData.user_subscription[0].stp_customer_id) {
                    getSubscriptiondata(ResolveData.user_subscription[0].stp_customer_id);
                } else {
                    self.loadingspinner = 0;
                }
            }
            if ($state.current.name == 'settings.transactions') {
                get_transactions();
            }
            if ($state.current.name == 'settings.subscriptions') {
                get_subscriptions();
            }
            if ($state.current.name == 'settings.teams') {
                TeamMembers();
            }
            if ($state.current.name == 'settings.bookings') {
                CustomerBooking();
            }
            if ($state.current.name == 'settings.blogs') {
                blogs();
            }
            if ($state.current.name == 'settings.mygallery') {
                MyGalleryImages();
            }
            if ($state.current.name == 'settings.myvideos') {
                MyVideoGallery();
            }
            if ($state.current.name == 'settings.paymethod' || $state.current.name == 'business_info.paymethod') {
                GetSavePaymentMethod();
            }

            GetClassfiedcategories();

            get_credit_card_info();

            if ($state.current.name == 'settings.invoices') {
                get_invoices();
            }

            if ($state.current.name == 'settings.notifications') {
                getUserNotifications();
            }

            if ($state.current.name == 'settings.sms_packages') {
                getSMSPackages();
                getListingPackages();
            }

            function getSMSPackages() {
                AccountModel.getSMSPackages().then(function (response) {                    
                    self.SMS_Packages = angular.copy(response.packages);
                }, function (error) {});
            }

            function getListingPackages() {
                AccountModel.getListingPackages().then(function (response) {                    
                    self.Listing_Packages = angular.copy(response.packages);
                }, function (error) {});
            }
            function getUserNotifications() {
                AccountModel.getusernotification().then(function (response) {
                    self.usernotifications = angular.copy(response);
                    self.numberOfPages = function () {
                        return Math.ceil(self.usernotifications.data.length / self.pageSize);
                    }
                }, function (error) {});
            }

            self.suburbList = [];
            self.host = $location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : '');
            self.Role = ResolveData.roles[0].name;
            self.csrf_token = CSRF_TOKEN;
            /**
             * get userdata
             *
             * @private
             * @return {void}
             */
            self.is_plan_expire = 1;
            if (ResolveData.user_payment_info.length) {
                var date = moment(ResolveData.user_payment_info[ResolveData.user_payment_info.length - 1].created_at);
                date.add(30, 'days');
                var days = date.diff(moment(), 'days')
                if (days <= 30 && days >= 0)
                    self.is_plan_expire = 0;
                ResolveData.user_payment_info[ResolveData.user_payment_info.length - 1].next_payment_date = date.format('MMM-DD-YYYY');
            }

            self.userModel = {
                'id': ResolveData.id,
                'name': ResolveData.name,
                'password': '',
                'about': (ResolveData.user_info) ? ResolveData.user_info.about : '',
                'address': (ResolveData.user_info) ? ResolveData.user_info.address : '',
                'contactnumber': (ResolveData.user_info) ? ResolveData.user_info.contact_number : '',
                'suburb': [{
                        location: ResolveData.user_info.suburb,
                        state: ResolveData.user_info.state,
                        postcode: ResolveData.user_info.postcode
                    }],
                'state': (ResolveData.user_info && ResolveData.user_info.state) ? ResolveData.user_info.state : null,
                'postcode': (ResolveData.user_info && ResolveData.user_info.postcode) ? ResolveData.user_info.postcode : null,
                'email': ResolveData.email,
                'logo': (ResolveData.profilepic && ResolveData.profilepic.name) ? ResolveData.profilepic.path + 'thumb_small_' + ResolveData.profilepic.name : null,
                'video': (ResolveData.profilevideo && ResolveData.profilevideo.name) ? ResolveData.profilevideo.name : null,
                'paymentInfo': ResolveData.user_payment_info,
                'jobnotifications': (ResolveData.job_notifications == "1") ? true : false,
                'youtube_video': (ResolveData.user_info.youtube_video) ? ResolveData.user_info.youtube_video : ''
            };
            if (self.userModel.suburb) {
                self.userModel.suburb = {
                    location: self.userModel.suburb[0].location,
                    state: self.userModel.suburb[0].state,
                    postcode: self.userModel.suburb[0].postcode
                };
            }
            /*
             ** adding team img id to modal
             */
            self.teams = {
                'imgid': ResolveData.imgid
            };
            self.usergallery = {
                'imgid': ResolveData.imgid
            };

            function ppp() {
                $('#paypal').removeAttribute('ng-checked');
                $('#crdcrd').removeAttribute('ng-checked');
            }
            ;
            $('#crdcrd').click(function () {
                $('#crdcrd').removeAttribute('ng-checked');
                $('#paypal').removeAttribute('ng-checked');

            });
        }
        /*************Get classified categories**************/

        function GetClassfiedcategories() {
            AccountModel.classifiedcat().then(function (response) {
                self.GetClassCats = angular.copy(response.data);
            }, function (error) {});
        }

        function SetTeamMemberInform() {
            AccountModel.getteammemberbyid({
                team_member_id: team_member_id
            }).then(function (response) {
                self.updatetm = angular.copy(response);
            }, function (error) {});
        }
        /**************** delete existing team member profile pic******************/

        self.DeleteExistingTMProfilePic = function ($event, image_id, member_id) {
            $event.preventDefault();
            AccountModel.TeamMPic({
                image_id: image_id,
                member_id: member_id
            }).then(function (responseData) {
                toaster.pop('success', "Image Deleted", "Image has been deleted successfully.");
                $state.go($state.current, {}, {
                    reload: true
                });
            }, function (errorResponse) {
                console.log('unable to delete list : ', errorResponse);
            })
        };
        /**************** End delete existing team member profile pic******************/
        /*****************update team member***********************/
        self.updateTMember = function () {
            var updateimage = angular.copy([self.teams]),
                    resource;
            var upmember11 = angular.copy(self.updatetm.data),
                    resource;
            var args = angular.merge(upmember11, updateimage);
            resource = AccountModel.updateteammembersave({
                id: team_member_id
            }, args);
            resource.then(function (successResponse) {
                toaster.pop('success', "Team Member Detail update", "Team Member Details has been updated Successfully.");
                $state.go('settings.teams');
            }, function (errorResponse) {
                console.log('Saving Team Member Detail:', errorResponse);
            });
        };
        /*****************end update team member***********************/

        /**************** delete upload team member profile pic******************/

        self.DeleteUploadTMpic = function ($event, image_id) {
            $event.preventDefault();
            AccountModel.UploadTeamMPic({
                image_id: image_id
            }).then(function (responseData) {
                toaster.pop('success', "Image Deleted", "Image has been deleted successfully.");
                $state.go($state.current, {}, {
                    reload: true
                });
            }, function (errorResponse) {
                console.log('unable to delete list : ', errorResponse);
            })

        };
        /**************** end existing team member profile pic******************/
        /*************Get classified categories**************/
        function get_credit_card_info() {
            AccountModel.getccinfo().then(function (response) {
                self.Getccinfo1 = angular.copy(response.data);
            }, function (error) {});

        }
        self.delete_options = function ($event, team_id) {
            $event.preventDefault();
            $("#delete_options_" + team_id).slideToggle("slow");
        };
        self.delete_options_cancel = function ($event, team_id) {
            $event.preventDefault();
            $("#delete_options_" + team_id).slideToggle("slow");
        };
        self.DeleteTeamMember = function ($event, team_id) {
            $event.preventDefault();
            Spinner.start();
            AccountModel.DeleteTeam({
                id: team_id
            }).then(function (responseData) {
                Spinner.stop();
                toaster.pop('success', "Team Member Deleted", "Team Member has been deleted successfully.");
                $state.go($state.current, {}, {
                    reload: true
                });
            }, function (errorResponse) {
                console.log('unable to delete list : ', errorResponse);
            })
        };
        /************get team members*************/
        function TeamMembers() {
            AccountModel.getteammembers().then(function (response) {
                self.TeamInfo = angular.copy(response);
                self.numberOfPages = function () {
                    return Math.ceil(self.TeamInfo.data.length / self.pageSize);
                }
            }, function (error) {});
        }

        function CustomerBooking() {
            AccountModel.getcustomerbooking().then(function (response) {
                self.TeamInfo1 = angular.copy(response);
                self.numberOfPages = function () {
                    return Math.ceil(self.TeamInfo1.data.length / self.pageSize);
                }
            }, function (error) {});
        }
        //user blog
        function blogs() {
            AccountModel.getblogs().then(function (response) {
                self.TeamInfo2 = angular.copy(response);
                self.numberOfPages = function () {
                    return Math.ceil(self.TeamInfo2.data.length / self.pageSize);
                }
            }, function (error) {});
        }
        /************end get team members*************/
        /*******get my cover letters and resume *********/
        function GetMyCLandResume() {
            AccountModel.getcoverltrandresume().then(function (response) {
                self.mycoverletter = angular.copy(response.data);

            }, function (error) {});

        }

        /*******end my cover letters and resume *********/
        /*
         ** Create My cover letter and resume
         */

        self.CreatMyCoverletterAndResume = function () {
            Spinner.start();
            var coverletter = angular.copy(self.mycoverletter),
                    resource;
            var resumefileId = angular.copy(self.usergallery),
                    resource;
            var args = angular.merge(coverletter, resumefileId);
            resource = AccountModel.MycoverltrAndResume(args);
            resource.then(function (successResponse) {
                toaster.pop('success', "CoverLetter And Resume", "CoverLetter And Resume Details has been saved Successfully.");
                $state.go($state.current, {}, {
                    reload: true
                });
                Spinner.stop();
            }, function (errorResponse) {
                Spinner.stop();
                console.log('Saving CoverLetter Detail:', errorResponse);
            });
        };

        /************get save payment method **************/
        function GetSavePaymentMethod() {
            AccountModel.getpaymentmethod().then(function (response) {
                self.pmethod = angular.copy(response.data);
                self.payment.creditcard = response.data.creditcard;
                self.payment.paypal = response.data.paypal;
            }, function (error) {});
        }
        /******************End of function*************************/

        /*****************save payment method**********************/
        self.SavePaymentMethod = function () {

            var PaymentMethod = angular.copy(self.payment),
                    resource;

            resource = AccountModel.paymentavailablethods(PaymentMethod);
            resource.then(function (successResponse) {
                toaster.pop('success', "Payment Methods Detail Save", "Payment Methods Details has been saved Successfully.");
                Spinner.stop();
                $state.reload();

            }, function (errorResponse) {
                Spinner.stop();
                console.log('Saving FAQ Detail:', errorResponse);
            })
        };

        /****************End of payment method*********************/

        /************get my gallery images ******************/

        function MyGalleryImages() {

            AccountModel.getgallery().then(function (response) {

                self.MyGallery = angular.copy(response);
                self.numberOfPages = function () {
                    return Math.ceil(self.MyGallery.data.length / self.pageSize);
                }
            }, function (error) {});

        }

        /****************get my videos gallery ****************************/
        function MyVideoGallery() {
            AccountModel.getvideogallery().then(function (response) {

                self.MyVideos = angular.copy(response);
                $scope.getIframeSrc = function (videoId) {
                    return $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + videoId);
                };
                self.numberOfPages = function () {
                    return Math.ceil(self.MyVideos.data.length / self.pageSize);
                }
            }, function (error) {});

        }


        self.DeleteMygalleryImage = function ($event, list_id, cat_id) {
            $event.preventDefault();
            MyGalleryImages();
            AccountModel.DeleteMygalleryImage({
                id: list_id,
                cat_id: cat_id
            }).then(function (responseData) {
                toaster.pop('error', "Image Deleted", "Image has been deleted successfully.");

                $state.go($state.current, {}, {
                    reload: true
                });
            }, function (errorResponse) {
                console.log('unable to delete list : ', errorResponse);
            })

        };
        self.DeleteAsset = function ($event, $flow, asset_id) {
            $event.preventDefault();
            if (asset_id) {
                AccountModel.DeleteAsset({
                    id: asset_id
                }).then(function (responseData) {
                    toaster.pop('success', "Image Deleted", "Image has been deleted successfully.");
                    $flow.cancel();
                    // $state.go($state.current, {}, {
                    //     reload: true
                    // });
                }, function (errorResponse) {
                    $flow.cancel();
                    console.log('unable to delete list : ', errorResponse);
                });
            } else {
                $flow.cancel();
            }

        };

        /************delete my resume ***************************/
        self.DeleteMyResume = function ($event, list_id) {
            $event.preventDefault();
            GetMyCLandResume();
            AccountModel.DeleteMyResumeFile({
                id: list_id
            }).then(function (responseData) {
                toaster.pop('success', "File Deleted", "File has been deleted successfully.");
                $state.go($state.current, {}, {
                    reload: true
                });
            }, function (errorResponse) {
                console.log('unable to delete list : ', errorResponse);
            })

        };
        /************End Delete resume*********************/


        /****** delete video gallery ******/

        self.DeleteMyvideogallery = function ($event, list_id, cat_id) {
            $event.preventDefault();
            MyVideoGallery();
            AccountModel.DeleteMyvideogallery({
                id: list_id,
                cat_id: cat_id
            }).then(function (responseData) {
                toaster.pop('success', "Video Deleted", "Video has been deleted successfully.");
                $state.go($state.current, {}, {
                    reload: true
                });
            }, function (errorResponse) {
                console.log('unable to delete list : ', errorResponse);
            })

        };

        self.playOtherVideo = function () {
            $('.parent-container-icon').each(function () { // the containers for all your galleries
                $(this).magnificPopup({
                    delegate: 'a', // the selector for gallery item
                    type: 'image',
                    callbacks: {
                        elementParse: function (item) {
                            // Function will fire for each target element
                            // "item.el" is a target DOM element (if present)
                            // "item.src" is a source that you may modify                            
                            if (item.el.context.className.indexOf('video') !== -1) {
                                item.type = 'iframe',
                                        item.iframe = {
                                            patterns: {
                                                youtube: {
                                                    index: 'youtube.com/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).

                                                    id: 'v=', // String that splits URL in a two parts, second part should be %id%
                                                    // Or null - full URL will be returned
                                                    // Or a function that should return %id%, for example:
                                                    // id: function(url) { return 'parsed id'; }

                                                    src: '//www.youtube.com/embed/%id%?autoplay=1' // URL that will be set as a source for iframe.
                                                }
                                            }
                                        }
                            } else {
                                item.type = 'image'
                            }
                        }
                    },
                    gallery: {
                        enabled: true
                    }
                });
            });
        };

        /************End delete video gallery  ******************/
        /**
         * save user data
         *
         * @private
         * @return {void}
         */

        self.saveuser = function () {            
            var _user = angular.copy(self.userModel),
                    resource = AccountModel.update({
                        id: _user.id
                    }, _user);
            resource.then(function (successResponse) {                
                if (successResponse.status == "210") {
                    toaster.pop('error', "Auth Fail", successResponse.msg);
                } else {
                    toaster.pop('success', "Detail Save", "Details has been updated.");
                }
            }, function (errorResponse) {
                console.log('Saving Details:', errorResponse);
            });
        };


        self.savecreditform = function () {
            Spinner.start();
            var _user = angular.copy(self.Getccinfo1),
                    resource = AccountModel.updatecreditform({
                        id: _user.id
                    }, _user);
            resource.then(function (successResponse) {
                toaster.pop('success', "Detail Save", "Details has been updated.");
                Spinner.stop();
            }, function (errorResponse) {
                console.log('Saving Details:', errorResponse);
                Spinner.stop();
            });
        };


        /**
         
         **get user transactions
         
         **/
        function get_transactions() {
            AccountModel.get_transactions().then(function (response) {
                self.transactions = angular.copy(response);
                self.numberOfPages = function () {
                    return Math.ceil(self.transactions.data.length / self.pageSize);
                }
            }, function (error) {});
        }
        /**
         
         **get user invoices
         
         **/
        function get_invoices() {

            AccountModel.get_invoices().then(function (response) {
                self.my_invs = angular.copy(response);
                self.numberOfPages = function () {
                    return Math.ceil(self.my_invs.data.length / self.pageSize);
                }
            }, function (error) {});
        }
        /**
         **get user subscription
         **/
        function getSubscriptiondata(id) {
            AccountModel.getSubscriptiondata({
                id: id
            }).then(function (response) {
                angular.copy(response);
                if (response.data.length > 0)
                    self.usersubscription = response.data;
                self.loadingspinner = 0;
            }, function (error) {
                self.loadingspinner = 0;
            });
        }

        /**
         **get user subscription
         **/
        function get_subscriptions() {

            AccountModel.get_subscriptions().then(function (response) {

                self.subcriptions1 = angular.copy(response);                
                self.numberOfPages = function () {
                    return Math.ceil(self.subcriptions1.data.length / self.pageSize);
                }
            }, function (error) {});
        }

        /*
         ** Create My  video gallery
         */

        self.CreatMyVideoGallery = function () {

            Spinner.start();
            var args = angular.copy(self.gallery),
                    resource;
            resource = AccountModel.videogallery(args);
            resource.then(function (successResponse) {
                if (successResponse.data == 0) {
                    $("#upgrade_subscript").text("Please Upgrade the plan!");
                    $("#upgrade_subscript").fadeIn('slow', 'linear');
                    setTimeout(function () {
                        $("#upgrade_subscript").fadeOut('slow', 'linear');
                    }, 2000);
                } else if (successResponse.data == 2) {
                    $("#upgrade_subscript").text("Videos limit reach!");
                    $("#upgrade_subscript").fadeIn('slow', 'linear');
                    setTimeout(function () {
                        $("#upgrade_subscript").fadeOut('slow', 'linear');
                    }, 2000);
                } else {
                    toaster.pop('success', "Video", "video Details has been saved Successfully.");
                    $state.go($state.current, {}, {
                        reload: true
                    });
                }


                Spinner.stop();
            }, function (errorResponse) {
                Spinner.stop();
                console.log('Saving Video Detail:', errorResponse);
            });
        };
        /*
         ** Create My gallery
         */

        self.validateFileUpload = function () {
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                //get the file size and file type from file input field
                var fsize = $('#i_file')[0].files[0].size;
                if (fsize < 16000) {
                    return false;
                }
            }
        };
        self.CreatMyGallery = function () {
            var ctgallery = angular.copy(self.gallery),
                    resource;
            var img = angular.copy(self.usergallery),
                    resource;
            var args = angular.merge(ctgallery, img);

            resource = AccountModel.ctusergallery(args);
            resource.then(function (successResponse) {
                toaster.pop('success', "Upload", "Image Details has been saved Successfully.");
                $state.go($state.current, {}, {
                    reload: true
                });
                Spinner.stop();
            }, function (errorResponse) {
                Spinner.stop();
                console.log('Saving Image Detail:', errorResponse);
            });
        };
        /*
         ** Create team
         */
        self.createteam = function () {
            var teams = angular.copy(self.teams),
                    resource;
            resource = AccountModel.teamssave(teams);
            resource.then(function (successResponse) {
                toaster.pop('success', "Team Created", "Team Details has been saved Successfully.");
                $state.go($state.current, {}, {
                    reload: true
                });
            }, function (errorResponse) {
                console.log('Saving Team Detail:', errorResponse);
            });
        };
        /**
         * getLocation
         * search locations based on search text
         * search is performed on postcode and city name
         *
         * @param  {[string]}
         * @return {[void]}
         */
        self.getLocation = function (val) {
            if (val.length < 4) {
                return;
            }

            Spinner.start();
            SuburbsModel
                    .findLocation({
                        'q': val
                    }).then(function (successResponse) {
                self.suburbList = successResponse.list;
                Spinner.stop();
            }, function (errorResponse) {
                console.log('Saving Details:', errorResponse);
            });

        };
        /**
         * model options
         * applied to search location ui-select to debounce the model changes
         *
         * @type {Object}
         */
        self.modelOptions = {
            debounce: {
                default: 500
            },
            getterSetter: true
        };

        /***************upload gallery images***********************/
        self.uploadFileStart = function () {}
        self.galleryflowConfig = function () {
            return {
                target: '/usergalleryupload',
                permanentErrors: [404, 500, 501],
                maxChunkRetries: 0,
                chunkRetryInterval: 5000,
                simultaneousUploads: 1,
                singleFile: true,
                testChunks: false,
                headers: {
                    'X-CSRF-TOKEN': csrf_token
                },
                query: function (flowFile, flowChunk) {
                    self.loginAlertMessage = 0;
//                    Spinner.start();
                    // function will be called for every request
                    return {
                        imgid: '',
                        source: 'flow_query'
                    };
                }
            }
        };

        self.UserGalleryfileUploadSuccess = function ($file, $res) {
            self.selectedgalleryImage = "/assets/usergallery/large/" + $file.name;
            $file.imgid = $res;
            var obj = JSON.parse($res);
            if (obj == 0 || obj == 2) {
                $("#upgrade_subscript").text("Please Upgrade the plan!");
                $("#upgrade_subscript").fadeIn('slow', 'linear');
                setTimeout(function () {
                    $("#upgrade_subscript").fadeOut('slow', 'linear');
                }, 2000);
                toaster.pop('error', "Gallery", "Please Upgrade the plan!");
            } else if (obj == 3) {
                $("#upgrade_subscript").text("Gallery limit reach!");
                $("#upgrade_subscript").fadeIn('slow', 'linear');
                setTimeout(function () {
                    $("#upgrade_subscript").fadeOut('slow', 'linear');
                }, 2000);
                toaster.pop('error', "Gallery", "Gallery limit reach!");
            } else {
                toaster.pop('success', "Gallery", "Gallery Image has been uploaded successfully.");
                self.usergallery.imgid = $file.imgid;
                self.successfullyuploadfile = 1;
            }
            Spinner.stop();
        };
        self.UserGalleryfileUploadError = function ($file, $res, $flow) {
            $flow.cancel();
            toaster.pop('error', "Gallery", $res);
            Spinner.stop();
        };
        /***************End of gallery images**********************/

        /***************upload my resume***********************/
        self.MyResumeflowConfig = function () {
            return {
                target: '/myresumeupload',
                permanentErrors: [404, 500, 501],
                maxChunkRetries: 1,
                chunkRetryInterval: 5000,
                simultaneousUploads: 1,
                singleFile: true,
                headers: {
                    'X-CSRF-TOKEN': csrf_token
                },
                query: function (flowFile, flowChunk) {
//                    Spinner.start();
                    // function will be called for every request
                    return {
                        imgid: '',
                        source: 'flow_query'
                    };
                }
            }
        };
        self.submitCvFile = function ($flow) {
            Spinner.start();
            $flow.upload();
        };
        self.UserResumefileUploadSuccess = function ($file, $res) {
            $res = JSON.parse($res);
            $file.imgid = $res.id;
            var temp = self.mycoverletter.cover;
            toaster.pop('success', "Resume", "Resume has been uploaded successfully.");
            self.usergallery.imgid = $file.imgid;            
            self.mycoverletter = $res.mycoverletter;
            var filenameis = $res.mycoverletter.file_name.split("_");
            self.mycoverletter['filenameis'] = filenameis[(filenameis.length - 1)];
            self.mycoverletter.cover = temp;
            Spinner.stop();
        };
        /***************End of my resume**********************/
        /********************** upload team image ******************/
        self.teamflowConfig = function () {
            return {
                target: '/uploadteamimg',
                permanentErrors: [404, 500, 501],
                maxChunkRetries: 1,
                chunkRetryInterval: 5000,
                simultaneousUploads: 1,
                singleFile: true,
                headers: {
                    'X-CSRF-TOKEN': csrf_token
                },
                query: function (flowFile, flowChunk) {
//                    Spinner.start();
                    // function will be called for every request
                    return {
                        imgid: '',
                        source: 'flow_query'
                    };
                }
            }
        };

        self.teamfileUploadSuccess = function ($file, $res) {
            $file.imgid = $res;
            self.teams.imgid = $file.imgid;
            toaster.pop('success', "Image", "Image has been Uploaded successfully.");
            Spinner.stop();
        };
        self.teamcancelFile = function ($event, $flow, list_id) {
            $event.preventDefault();
            AccountModel.teamcancelFile({
                id: parseInt(list_id)
            }).then(function (responseData) {
                toaster.pop('success', "Image Canceled", "Image has been canceled successfully.");
                // $state.go($state.current, {}, {
                //     reload: true
                // });
                $flow.cancel();
            }, function (errorResponse) {
                console.log('unable to canceled image : ', errorResponse);
            })

        };
        /********************************************************************/
        /**
         * change user profile pic
         *
         * @params {images chunks}
         * @return {object}
         */
        self.flowConfig = function () {
            return {
                target: '/uploadprofilepic',
                permanentErrors: [404, 500, 501],
                maxChunkRetries: 1,
                chunkRetryInterval: 5000,
                simultaneousUploads: 1,
                singleFile: true,
                headers: {
                    'X-CSRF-TOKEN': csrf_token
                },
                query: function (flowFile, flowChunk) {
//                    Spinner.start();
                    // function will be called for every request
                    return {
                        id: self.userModel.id,
                        source: 'flow_query'
                    };
                }
            }
        };

        /**
         * change profile pic if upload successfully
         *
         * @params {Oject}
         * @return {void}
         */
        self.fileUploadSuccess = function ($file, $res) {
            var obj = JSON.parse($res);
            self.userModel.logo = obj.path + 'thumb_small_' + obj.name;
            toaster.pop('success', "Logo Uploaded", "Logo has been uploaded successfully.");
            Spinner.stop();
        };
        /**
         * change user profile pic
         *
         * @params {images chunks}
         * @return {object}
         */

        self.videoflowConfig = function () {
            return {
                target: '/uploadvideo',
                permanentErrors: [404, 500, 501],
                maxChunkRetries: 1,
                chunkRetryInterval: 5000,
                simultaneousUploads: 1,
                singleFile: true,
                headers: {
                    'X-CSRF-TOKEN': csrf_token
                },
                query: function (flowFile, flowChunk) {
                    Spinner.start();
                    // function will be called for every request
                    return {
                        id: self.userModel.id,
                        source: 'flow_query'
                    };
                }
            }
        };

        /**
         * change profile pic if upload successfully
         *
         * @params {Oject}
         * @return {void}
         */
        self.videoUploadSuccess = function ($file, $res) {
            Spinner.stop();
            var obj = JSON.parse($res);
            self.userModel.video = obj.name;
            toaster.pop('success', "Video Uploaded", "Video has been uploaded successfully.");
        };

        self.hideProgressbar = function () {
            $timeout(function () {
                self.loginAlertMessage = 1;
            }, 3000);
        }
        self.loginAlertMessage = 0;

    }

    AccountSettingsController.$inject = ["$window", "$scope", "$rootScope", "$sce", "$state", "AccountModel", "ResolveData", "toaster", "SuburbsModel", "$http", "Spinner", "CategoriesModel", "$location", "CSRF_TOKEN", "NotificationModel", "$timeout"];
    //end of controller

    angular
            .module('BeautyCollective.Account')
            .controller('AccountSettingsController', AccountSettingsController);
})();

(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Serviceprovider.Controller.CreateListingController
     * @module BeautyCollective.Listing
     *
     * @description
     * CreateListingController is responsible manage account activities
     *
     * @author Kinectro
     */

    /* @ngInject */
    function CreateListingController($rootScope, $http, Laravel, CategoriesModel, $state, $q, toaster, ListingModel, utilFactory, Listing_type, SuburbsModel, Spinner, moment, $location) {
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
        self.roles = angular.fromJson(Laravel.roles);
        self.roles = _.map(self.roles, function (role) {
            return (role.name).toLowerCase();
        });
        self.userRole = self.roles;
        self.dataType = [{
                id: 1,
                colId: ['col1', 'col4'],
                dataTypeName: 'Date'
            },
            {
                id: 2,
                colId: ['col2', 'col3'],
                dataTypeName: 'Alpha'
            },
            {
                id: 3,
                colId: ['col5', 'col6', 'col7', 'col8'],
                dataTypeName: 'List Value'
            }
        ];
        self.business_feature = [{
                colId: 'col1',
                name: ''
            }];
        self.business_stock = [{
                colId: 'col1',
                name: ''
            }];
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
        self.showspinner = 0;
        /**
         * get suburbList
         *
         * @private
         * @return {void}
         */
        self.trixInitialize = function (e, editor) {

            // Insert a bold “Hello” at the beginning of the document
            editor.setSelectedRange([0, 0])
            editor.insertHTML("<strong>Hello</strong>")
        }

        self.showgallery = 0;
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
        self.listing.fileCount = 0;
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
        self.services = [];
        self.spservice = [];
        self.scCourses = [];
        self.courses = [];
        self.bookingUrl = function () {
//            var url = 'http://booking.stylerzone.com.au/services';
//            var hosturl = $location.host();
//            var hosturl = $location.host();
//            var url = hosturl.replace("app", "booking");
//            var path = $location.path();
//            var protocol = $location.protocol();
//
//            if (path == "/listing/list/deal") {
//                url = url + '/services';
//            }
//            if (url == 'http://stylerzone.com.au' || url == 'http://www.stylerzone.com.au') {
//                url = 'booking.stylerzone.com.au';
//            }
//            if (hosturl == 'beautyc.loc') {
//                url = 'http://bcbooking.loc/services';
//            } else if (hosturl == 'app.develop.stylerzone.com.au') {
//                url = 'http://booking.develop.stylerzone.com.au/services';
//            }
//            else if (hosturl == 'app58.develop.stylerzone.com.au') {
//                url = 'http://booking58.develop.stylerzone.com.au/services';
//            }
//            return protocol + '://' + url;
            return booking_url;
        }
        /**
         * invoke function on controller initialization
         */
        init();

        function getServices() {
            CategoriesModel.getAllServices().then(function (response) {
                if (response.list.status === "200") {
                    self.services = response.list.data;
                } else {

                }
            }, function () {

            });
        }

        function getCourses() {
            CategoriesModel.getAllCourses().then(function (response) {
                if (response.list.status === "200") {
                    self.scCourses = response.list.data;
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

            getServices();
            getCourses();
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
//                    Spinner.start();
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
                self.business_feature_stock = JSON.parse(responseData.data.business_feature_stock);
                self.business_feature = self.business_feature_stock.business_feature;
                self.business_stock = self.business_feature_stock.business_stock;
                self.listing.parentCategory = self.listing.categories.parentcategories;
                self.listing.expire = moment(self.listing.expiry).format("YYYY-MM-DD");
                self.listing.fileCount = self.listing.assets.length;
                self.spservice = self.listing.listService;
                self.courses = self.listing.getListingCourses;
                self.showgallery = 1;
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
            _list.latitude = $('#latitude-n1').val();
            _list.longitude = $('#longitude-n1').val();
            _list.suburb = $('#suburb-n1').val();
            _list.state = $('#state-n1').val();
            _list.postcode = $('#postcode-n1').val();
            _list.status = $('#hidden-status').val();
            _list.locations = [];
            _list.categories = _list.categories ? [_list.categories.id] : [];
            _list.services = self.spservice;
            _list.courses = self.courses;
            _list.listing_meta = self.listing.listing_meta;            
            _list.listing_meta.days_valid = angular.extend(self.listing.listing_meta.days_valid);
            _list.business_feature = self.business_feature;
            _list.business_stock = self.business_stock;
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
                toaster.pop('success', "Listing Saved", "Listing has been saved.");
                $state.go('listing.list', {}, {
                    reload: true
                });
            }, function (errorResponse) {
                Spinner.stop();
                $state.go('listing.list', {}, {
                    reload: true
                });
                console.log('Saving listing:', errorResponse);
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
            self.showspinner = 1;
            self.suburbList = [];

            SuburbsModel
                    .findLocation({
                        'q': val
                    }).then(function (successResponse) {
                self.suburbList = successResponse.list;
//                    Spinner.stop();
                self.showspinner = 0;
            }, function (errorResponse) {
                console.log('Saving Details:', errorResponse);
//                    Spinner.stop();self.showspinner = 0;
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

    CreateListingController.$inject = ["$rootScope", "$http", "Laravel", "CategoriesModel", "$state", "$q", "toaster", "ListingModel", "utilFactory", "Listing_type", "SuburbsModel", "Spinner", "moment", "$location"];
    //end of controller

    angular
            .module('BeautyCollective.Listing')
            .controller('CreateListingController', CreateListingController);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.AccountBusinessInfoController
     * @module BeautyCollective.Account
     *
     * @description
     * AccountBusinessInfoController is responsible manage user's business info
     *
     * @author Kinectro
     */

    /* @ngInject */
    function AccountBusinessInfoModalController($scope, $http, parent, AccountModel, Spinner, SuburbsModel, toaster, CategoriesModel) {
        var self = this;
        self.BussBrand = {};
        angular.extend(self, parent);        
        AccountModel.setModalCall(1);
        self.showwizardportion = 1;
        self.callForm = 1;
        businessbrand2();
        self.nofound = 1;        
        self.numberOfPages = 0;
        self.abn_text = "Lookup  ABN";        
        self.presentAbnNumber = self.userBusinessModel.abn;
        self.presentAbnName = self.userBusinessModel.abn_name;
        self.hidetick = 1;
        self.hidecross = 1;
        self.showAbnerrors = 3;

        if (self.userBusinessModel.abn && self.userBusinessModel.abn_name) {
            self.abn_text = "Verified";
        }

        self.validateAbn = function () {
//            Spinner.start();
            self.validate_abn = 1;
            $http({
                method: 'get',
                url: "/abnValidation",
                params: {
                    abn: self.userBusinessModel.abn,
                    cname: self.userBusinessModel.abn_name
                }
            }).then(function mySuccess(response) {
                var info = response.data;
                if (info.status === "200") {
                    self.showAbnerrors = 1;
                    self.validabncheck = 1;
                    self.showerror = 0;
                    self.hidetick = 0;
                    self.presentAbnNumber = self.userBusinessModel.abn;
                    self.presentAbnName = self.userBusinessModel.abn_name;
                    toaster.pop('success', "ABN Detail", "ABN Verified Successfully.");
                } else {
                    self.showAbnerrors = 0;
                    self.showerror = 1;
                    self.hidecross = 0;
                    self.errorMsg = info.msg;
                    self.validabncheck = 0;
                }
                if (self.userBusinessModel.abn && self.userBusinessModel.abn_name) {
                    self.abn_text = "Verified";
                }
//                Spinner.stop();
                self.validate_abn = 0;
            });
        };
//        self.validateAbn = function () {
////            Spinner.start();
//            self.validate_abn = 1;
//            $http({
//                method: 'get',
//                url: "/abnValidation",
//                params: {
//                    abn: self.userBusinessModel.abn,
//                    cname: self.userBusinessModel.abn_name
//                }
//            }).then(function mySuccess(response) {
//                var info = response.data;
//                if (info.status === "200") {
//                    self.validabncheck = 1;
//                    self.showerror = 0;
//                    toaster.pop('success', "ABN Detail", "ABN Verified Successfully.");
//                } else {
//                    self.showerror = 1;
//                    self.errorMsg = info.msg;
//                    self.validabncheck
//                }
//                if (self.userBusinessModel.abn && self.userBusinessModel.abn_name) {
//                    self.abn_text = "Verified";
//                }
////                Spinner.stop();
//                self.validate_abn = 0;
//            });
//        };

        self.getCategories = function (val) {

            if (val.length < 4) {
                return;
            }
//            Spinner.start();
            self.showCatSpinner = 1;
            CategoriesModel
                    .searchcategories({
                        'q': val
                    }).then(function (successResponse) {

                self.categoriesList = successResponse.list;
                self.showCatSpinner = 0;
//                Spinner.stop();
            }, function (errorResponse) {
                console.log('Saving Details:', errorResponse);
            });
        };

        self.getLocation = function (val,type_code) {

            if (val.length < 4) {
                return;
            }
            // Spinner.start();
            self.showspinner = 1;
            SuburbsModel
                    .findLocation({
                        'q': val,
                        'service':type_code
                    }).then(function (successResponse) {
                self.suburbList = successResponse.list;
                if (successResponse.list.no_found) {
                    self.nofound = 0;
                }
                // Spinner.stop();
                self.showspinner = 0;
            }, function (errorResponse) {
                console.log('Saving Details:', errorResponse);
                Spinner.stop();
            });
        };

        function businessbrand2() {
            AccountModel.getbusbrand().then(function (response) {
                self.BussBrand = angular.copy(response);
                self.brand.title = "";
                self.numberOfPages = function () {
                    return Math.ceil(self.BussBrand.data.length / self.pageSize);
                }
            }, function (error) {});
        }
        self.create_businessbrand_Modal = function () {
            Spinner.start();
            var businessbrand = angular.copy(self.brand),
                    resource;
            resource = AccountModel.brandsave(businessbrand);
            resource.then(function (successResponse) {
//                self.brand.title = "";
                $scope.servicesform.$setPristine();
                toaster.pop('success', "Brand Detail Save", "Brand Details has been saved Successfully.");
                Spinner.stop();
                businessbrand2();
            }, function (errorResponse) {
                Spinner.stop();
                console.log('Saving Brand Detail:', errorResponse);
            });
        };
        /*
         * scC-model
         * school and college wizard model
         * Section start
         */
        function scCourses() {
            AccountModel.getCourses().then(function (response) {                
                if (response.status == "200") {
                    self.BussCourses = angular.copy(JSON.parse(response.data));
                    self.numberOfPages = function () {
                        return Math.ceil(self.BussCourses.length / self.pageSize);
                    }
                }
            }, function (error) {});
        }
        self.create_businesscourse_Modal = function () {
            Spinner.start();
            var business_course = angular.copy(self.course),
                    resource;
            resource = AccountModel.saveCourse(business_course);
            resource.then(function (successResponse) {
                self.course = [];
                toaster.pop('success', "Course Save", "Course details has been saved successfully.");
                Spinner.stop();
                scCourses();
            }, function (errorResponse) {
                Spinner.stop();
                console.log('Saving Course Detail:', errorResponse);
            });
        };
        /*
         * scC-model
         * school and college wizard model
         * Section end
         */
        self.checkValideDate = function ($start_date, $end_date) {
        }
        self.setDateOnChange = function ($key, $main_key) {
            var am_pm = self.businesshoursdata[$key][$main_key]['time'];
            var hours = parseInt(self.businesshoursdata[$key][$main_key]['hours']);
            var minutes = (self.businesshoursdata[$key][$main_key]['minutes']);
            if ($main_key === "close") {
                var end_time = hours + ":" + minutes + " " + am_pm;
                var open_am_pm = self.businesshoursdata[$key]['open']['time'];
                var open_hours = parseInt(self.businesshoursdata[$key]['open']['hours']);
                var open_minutes = (self.businesshoursdata[$key]['open']['minutes']);
                var start_time = open_hours + ":" + open_minutes + " " + open_am_pm;
                start_time = moment(start_time, "HH:mm a");
                end_time = moment(end_time, "HH:mm a");
                var duration = moment.duration(end_time.diff(start_time));
                if (duration.asMinutes() < 0) {
                    toaster.pop('error', "Time", "Closing time must be greater than opening time");
                    self.valideClosingHours = 0;
                } else {
                    self.valideClosingHours = 1;
                }
            } else {
                var start_time = hours + ":" + minutes + " " + am_pm;
                var close_am_pm = self.businesshoursdata[$key]['close']['time'];
                var close_hours = parseInt(self.businesshoursdata[$key]['close']['hours']);
                var close_minutes = (self.businesshoursdata[$key]['close']['minutes']);
                var end_time = close_hours + ":" + close_minutes + " " + close_am_pm;
                start_time = moment(start_time, "HH:mm a");
                end_time = moment(end_time, "HH:mm a");
                var duration = moment.duration(end_time.diff(start_time));
                console.log(duration.asMinutes());
                if (duration.asMinutes() < 0) {
                    toaster.pop('error', "Time", "Closing time must be greater than opening time");
                    self.valideClosingHours = 0;
                } else {
                    self.valideClosingHours = 1;
                }
            }
            var time = "";
            if (am_pm == "PM") {
                if (hours < 12) {
                    hours = hours + 12;
                } else {
                    hours = "12";
                }
            }
            var d = new Date();
            d.setHours(hours);
            d.setMinutes(minutes);
            time = d.toISOString();
            if ($main_key == 'open') {
                self.bussinessHours[$key].open = time;
            } else {
                self.bussinessHours[$key].close = time;
            }
        }
        self.formValidation = function ($formInValid) {
            if ($formInValid || self.validabncheck == 0) {
                return true;
            } else {
                return false;
            }
        };
        self.inputfocus = function () {
            self.showerror = 0;
        };
        self.checkkeyup = function () {
            self.validabncheck = 0;
            self.hidecross = 1;
            self.hidetick = 1;
            if (self.presentAbnNumber == self.userBusinessModel.abn && self.presentAbnName == self.userBusinessModel.abn_name) {
                if (self.presentAbnNumber && self.presentAbnName) {
                    self.validabncheck = 1;
                    self.hidecross = 0;
                    self.hidetick = 0;
                }
            }
        };
        self.checkABNNumberVerification = function () {
            var return_status = false;
            if (self.abn_text == 'Verified' && self.userBusinessModel.abn == self.presentAbnNumber && self.validabncheck == 1) {
                return_status = true;
            }
            return return_status;
        }
        self.checkABNNameVerification = function () {
            var return_status = false;
            if (self.abn_text == 'Verified' && self.userBusinessModel.abn_name == self.presentAbnName && self.validabncheck == 1) {
                return_status = true;
            }
//            if(self.showAbnerrors==1){
//                return_status=true;
//                self.showAbnerrors=3;
//            }
            return return_status;
        }

    }
    AccountBusinessInfoModalController.$inject = ["$scope", "$http", "parent", "AccountModel", "Spinner", "SuburbsModel", "toaster", "CategoriesModel"];
    //end of controller

    angular
            .module('BeautyCollective.Account')
            .controller('AccountBusinessInfoModalController', AccountBusinessInfoModalController);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.AccountBusinessInfoController
     * @module BeautyCollective.Account
     *
     * @description
     * AccountBusinessInfoController is responsible manage user's business info
     *
     * @author Kinectro
     */

    /* @ngInject */
    function AccountBusinessInfoController($http, $state, AccountModel, Laravel, AccountFactory, ResolveData, toaster, SuburbsModel, CategoriesModel, Spinner, APP_CONFIG, $uibModal, $rootScope) {
        var self = this, faq_id, service_id, brand_id, course_id, roles = [];
        self.timeOptions = {
            readonlyInput: false,
            showMeridian: true
        };
        self.brand = {};
        self.BussBrand = {};
        self.showerror = 0;
        self.validabncheck = 0;
        self.showpopwizard = 1;
        self.showbusinessform = 0;
        self.TeamInfo = {};
        self.nofound = 1;
        self.showspinner = 0;
        self.showCatSpinner = 0;
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
        self.businesshoursdata = [];
        self.showBusinessInfoModal = {};
        self.showBusinessHours = {};
        self.showBusinessSocialMedia = {};
        self.showBusinessBrand = {};
        self.course = {}
        self.course.course_type = 0;
        self.valideClosingHours = 1;
        self.validate_abn = 0;
        self.abn_text = "Lookup  ABN";
        self.promo_code = "";
        self.presentAbnNumber = "";
        self.presentAbnName = "";
        self.showAbnerrors = 3;
        self.profile_url = '';
        self.hidetick = 0;
        self.hidecross = 1;
        self.callstatus = 1;
        self.assets = [];
        self.showassets = 0;
        /**
         * initialize properties
         *
         * @private
         * @return {void}
         */
        init();

        self.showwizardportion = 0;
        self.show_buiness_wizard = (ResolveData.show_buiness_wizard) ? ResolveData.show_buiness_wizard : 0;
        self.callForm = 0;
        self.showbusinessCoursesform = 0;
        if (AccountModel.getModalCall() == 0 && self.show_buiness_wizard == 0) {
            self.showBusinessInfoModal = $uibModal.open({
                templateUrl: APP_CONFIG.modules + '/account/business_info/basic-info.html',
                controller: 'AccountBusinessInfoModalController',
                controllerAs: '_self',
                size: 'lg',
                resolve: {
                    parent: function () {
                        return self;
                    }
                }
            });
        }
        self.finishWizard = function () {
            Spinner.start();
            $http({
                method: "GET",
                url: main_url + "/wizardComplete"
            }).then(function mySuccess(response) {
                if (response.status == "200") {
                    if (AccountModel.getModalCount() == 0) {
                        self.showBusinessInfoModal.close();
                    } else if (AccountModel.getModalCount() == 1) {
                        self.showBusinessHours.close();
                    } else if (AccountModel.getModalCount() == 2) {
                        self.showBusinessSocialMedia.close();
                    } else if (AccountModel.getModalCount() == 3) {
                        if (self.roles[0] == 'schoolcollege') {
                            self.showcoursesModelForm.close();
                        } else {
                            self.showBusinessBrand.close();

                        }
                    }
                    toaster.pop('success', "Wizard Skip", "Successfully wizard skip");
                    Spinner.stop();
                }
            }, function myError(response) {
                console.log(response.statusText);
            });
        }
        self.saveandFinish = function () {
            Spinner.start();
            $http({
                method: "GET",
                url: main_url + "/wizardComplete"
            }).then(function mySuccess(response) {
                if (response.status == "200") {
                    self.showBusinessInfoModal.close();
                    self.showBusinessHours.close();
                    self.showBusinessSocialMedia.close();

                    if (self.roles[0] == 'schoolcollege') {
                        self.showcoursesModelForm.close();
                    } else {
                        self.showBusinessBrand.close();
                    }
                    toaster.pop('success', "Wizard done", "Business information save successfully");
                    Spinner.stop();
                }
            }, function myError(response) {
                console.log(response.statusText);
            });
        }
        self.skipAndNext = function (callFrom) {
            if (AccountModel.getModalCall() == 1 && self.show_buiness_wizard == 0 && callFrom == 1) {
                AccountModel.increaseModalCount();
                if (AccountModel.getModalCount() == 1) {
                    self.showBusinessInfoModal.close();
                    self.showBusinessHours = $uibModal.open({
                        templateUrl: APP_CONFIG.modules + '/account/business_info/operation-time.html',
                        controller: 'AccountBusinessInfoModalController',
                        controllerAs: '_self',
                        size: 'lg',
                        resolve: {
                            parent: function () {
                                return self;
                            }
                        }
                    });
                } else if (AccountModel.getModalCount() == 2) {
                    self.showBusinessHours.close();
                    self.showBusinessSocialMedia = $uibModal.open({
                        templateUrl: APP_CONFIG.modules + '/account/business_info/social-media.html',
                        controller: 'AccountBusinessInfoModalController',
                        controllerAs: '_self',
                        size: 'lg',
                        resolve: {
                            parent: function () {
                                return self;
                            }
                        }
                    });
                } else if (AccountModel.getModalCount() == 3) {
                    self.showBusinessSocialMedia.close();
                    if (self.roles[0] == 'schoolcollege') {

                        self.showcoursesModelForm = $uibModal.open({
                            templateUrl: APP_CONFIG.modules + '/account/business_info/sc_courses.html',
                            controller: 'AccountBusinessInfoModalController',
                            size: 'lg',
                            controllerAs: '_self',
                            resolve: {
                                parent: function () {
                                    return self;
                                }
                            }
                        });
                    } else {
                        //                        self.showBusinessSocialMedia.close();
                        self.showBusinessBrand = $uibModal.open({
                            templateUrl: APP_CONFIG.modules + '/account/business_info/brand.html',
                            controller: 'AccountBusinessInfoModalController',
                            size: 'lg',
                            controllerAs: '_self',
                            resolve: {
                                parent: function () {
                                    return self;
                                }
                            }
                        });
                    }
                }
            }
        }

        function init() {
            Spinner.start();
            roles = angular.fromJson(Laravel.roles);
            roles = _.map(roles, function (role) {
                return (role.name).toLowerCase();
            });
            self.roles = roles;
            if ($state.current.name === 'business_info.basic_info') {
                if (roles[0] == 'individual' || roles[0] == 'jobseeker') {
                    $state.go('user.detail');
                }
            }
            faq_id = $state.params.faq_id || null;
            if (faq_id) {
                getbusinessfaq();
            }
            service_id = $state.params.service_id || null;
            if (service_id) {
                SetBusinessServiceInForm();
            }
            //            brand_id = $state.params.brand_id || null;
            brand_id = ($state.params.brand_id) ? $rootScope.base64_decode($state.params.brand_id) : '' || null;
            if (brand_id) {
                SetBusinessBrandInForm();
            }
            course_id = ($state.params.course_id) ? $rootScope.base64_decode($state.params.course_id) : '' || null;
            if (course_id) {
                self.showbusinessform = 1;
                SetBusinessCourseInForm();
            }
            businessfaq();
            businesservices();
            businessbrand();
            scCourses();
            TeamMembers();
            CustomerBooking();
            blogs();
            self.currentPage = 0;
            self.pageSize = 10;
            /**
             * get userInfo
             *
             * @private
             * @return {void}
             */
            self.presentAbnNumber = ResolveData.user_business.abn;
            self.presentAbnName = ResolveData.user_business.abn_name;
            self.profile_url = ResolveData.profile_url ? ResolveData.profile_url : '';
            if (ResolveData.profilepic && ResolveData.profilepic.name) {
                self.assets.push(ResolveData.profilepic);
                self.showassets = 1;
            }
            self.userBusinessModel = ResolveData.user_business ? {
                'id': ResolveData.id,
                'name': ResolveData.user_business.business_name,
                'website': ResolveData.user_business.website,
                'address': ResolveData.user_business.business_address,
                'locations': [{
                        location: ResolveData.user_business.business_suburb,
                        state: ResolveData.user_business.state,
                        postcode: ResolveData.user_business.postcode
                    }],
                'latitude': ResolveData.user_business.latitude,
                'longitude': ResolveData.user_business.longitude,
                'state': ResolveData.user_business.state,
                'postcode': ResolveData.user_business.postcode,
                'email': ResolveData.user_business.business_email,
                'abn': ResolveData.user_business.abn,
                'abn_name': ResolveData.user_business.abn_name,
                'contactnumber': ResolveData.user_business.contact_number,
                'about': ResolveData.user_business.about,
                'logo': (ResolveData.profilepic && ResolveData.profilepic.name) ? ResolveData.profilepic.path + 'thumb_small_' + ResolveData.profilepic.name : null,
                'video': (ResolveData.profilevideo && ResolveData.profilevideo.name) ? ResolveData.profilevideo.path + ResolveData.profilevideo.name : null,
                'categories': (ResolveData.user_business.categories) ? ResolveData.user_business.categories : [],
                'work_with_overseas_students': ResolveData.user_business.work_with_overseas_students,
                'government_assistance': ResolveData.user_business.government_assistance,
                'social_media_list': ResolveData.social_medias_list,
                'userSocialMediaAccounts': ResolveData.userSocialMediaAccounts,
                'businessType': ResolveData.user_business.busi_type,
                'businessCode': ResolveData.user_business.business_code,
                'iagree': (ResolveData.iagree == 1) ? true : false
            } : {
                'id': ResolveData.id
            };
            /*
             * check for the lookup validation start
             */
            if (ResolveData.user_business != null && ResolveData.user_business.abn && ResolveData.user_business.abn_name) {
                self.validabncheck = 1;
            }
            /*
             * check for the lookup validation end
             */

            if (self.userBusinessModel.locations) {
                self.userBusinessModel.locations = {
                    location: self.userBusinessModel.locations[0].location,
                    state: self.userBusinessModel.locations[0].state,
                    postcode: self.userBusinessModel.locations[0].postcode
                };
            }

            self.bussinessDays = AccountFactory.getDefaultBusinessDays();
            self.bussinessHours = (ResolveData.user_business && ResolveData.user_business.operating_hours) ? angular.fromJson(ResolveData.user_business.operating_hours) : AccountFactory.getDefaultBusinessHours();
            if (self.userBusinessModel.abn && self.userBusinessModel.abn_name) {
                self.abn_text = "Verified";
            }
            Spinner.stop();
            self.promo_code = ResolveData.promo_code;;

        }


        function TeamMembers() {
            AccountModel.getteammembers().then(function (response) {
                self.TeamInfo = angular.copy(response);
                self.numberOfPages = function () {
                    return Math.ceil(self.TeamInfo.data.length / self.pageSize);
                }
            }, function (error) {});
        }

        function CustomerBooking() {
            AccountModel.getcustomerbooking().then(function (response) {
                self.TeamInfo1 = angular.copy(response);
                self.numberOfPages = function () {
                    return Math.ceil(self.TeamInfo1.data.length / self.pageSize);
                }
            }, function (error) {});
        }

        function blogs() {
            AccountModel.getblogs().then(function (response) {
                self.TeamInfo = angular.copy(response);
                self.numberOfPages = function () {
                    return Math.ceil(self.TeamInfo.data.length / self.pageSize);
                }
            }, function (error) {});
        }
        /*
         * scC-start
         * School and College Courses
         *  Section Start
         */
        function scCourses() {
            AccountModel.getCourses().then(function (response) {
                response = response.data;
                if (response.status == "200") {
                    self.BussCourses = angular.copy(JSON.parse(response.data));
                    self.numberOfPages = function () {
                        return Math.ceil(self.BussCourses.length / self.pageSize);
                    }
                }
            }, function (error) {});
        }
        self.create_businessCourse = function () {
            Spinner.start();
            var business_course = angular.copy(self.course),
                    resource;
            resource = AccountModel.saveCourse(business_course);
            resource.then(function (successResponse) {                
                toaster.pop('success', "Course Save", "Course details has been saved successfully.");
                Spinner.stop();
                $state.reload();
                scCourses();
            }, function (errorResponse) {
                Spinner.stop();
                console.log('Saving Course Detail:', errorResponse);
            });
        };

        function SetBusinessCourseInForm() {

            AccountModel.getCoursesById({
                course_id: course_id
            }).then(function (response) {
                response = response.data;
                if (response.status = "200") {
                    self.course = angular.copy(JSON.parse(response.data)[0]);
                }
            }, function (error) {});
        }
        self.UpdateBusinesCourse = function ($course_id) {
            Spinner.start();
            var _course = angular.copy(self.course),
                    resource;
            _course['course_id'] = $course_id;
            resource = AccountModel.updatebusinessCourses(_course);
            resource.then(function (successResponse) {                
                toaster.pop('success', "Course Detail Update", "Course details has been updated successfully.");
                $state.go('business_info.courses');
                Spinner.stop();
            }, function (errorResponse) {
                Spinner.stop();
                console.log('Update Course Detail:', errorResponse);
            });
        };
        self.copyInputMessage = function () {
            let inputfield = document.getElementById('profileurl').innerHTML;
            let selBox = document.createElement('textarea');
            selBox.style.position = 'fixed';
            selBox.style.left = '0';
            selBox.style.top = '0';
            selBox.style.opacity = '0';
            selBox.value = main_url + inputfield;
            document.body.appendChild(selBox);
            selBox.focus();
            selBox.select();
            document.execCommand('copy');
            document.body.removeChild(selBox);
        }

        self.busCoursedelete = function (course_id) {
            Spinner.start();
            AccountModel.busscoursedelete({
                course_id: course_id
            }).then(function (responseData) {
                Spinner.stop();
                toaster.pop('success', "Course Deleted", "Course has been deleted successfully.");
                $state.go($state.current, {}, {
                    reload: true
                });
            }, function (errorResponse) {
                console.log('unable to delete Course : ', errorResponse);
            })

        };
        /*
         * scC-end
         * School and College Courses
         * Section End
         */





        function updateResolveData() {
            ResolveData.id = self.userBusinessModel.id;
            ResolveData.user_business.business_name = self.userBusinessModel.name;
            ResolveData.user_business.website = self.userBusinessModel.website;
            ResolveData.user_business.business_address = self.userBusinessModel.address;
            ResolveData.user_business.busi_type = self.userBusinessModel.businessType;
            ResolveData.iagree = self.userBusinessModel.iagree;
            location: ResolveData.user_business.business_suburb = self.userBusinessModel.locations.location;
            state: ResolveData.user_business.state == self.userBusinessModel.locations.state;
            postcode: ResolveData.user_business.postcode == self.userBusinessModel.locations.postcode;
            ResolveData.user_business.latitude = self.userBusinessModel.latitude;
            ResolveData.user_business.longitude = self.userBusinessModel.longitude;
            ResolveData.user_business.state = self.userBusinessModel.state;
            ResolveData.user_business.postcode = self.userBusinessModel.postcode;
            ResolveData.user_business.business_email = self.userBusinessModel.email;
            ResolveData.user_business.abn = self.userBusinessModel.abn;
            ResolveData.user_business.abn_name = self.userBusinessModel.abn_name;
            ResolveData.user_business.contact_number = self.userBusinessModel.contactnumber;
            ResolveData.user_business.about = self.userBusinessModel.about;
            ResolveData.user_business.categories = (self.userBusinessModel.categories) ? self.userBusinessModel.categories : [],
                    ResolveData.user_business.work_with_overseas_students = self.userBusinessModel.work_with_overseas_students;
            ResolveData.user_business.government_assistance = self.userBusinessModel.government_assistance;
            ResolveData.social_medias_list = self.userBusinessModel.social_media_list;
            ResolveData.userSocialMediaAccounts = self.userBusinessModel.userSocialMediaAccounts;
            ResolveData.user_business.operating_hours = self.bussinessHours;
        }
        /**
         * save user business data
         *
         * @private
         * @return {void}
         */

        self.delete_options = function ($event, list_id) {
            $event.preventDefault();
            $("#delete_options_" + list_id).slideToggle("slow");
        };
        self.delete_options_cancel = function ($event, list_id) {
            $event.preventDefault();
            $("#delete_options_" + list_id).slideToggle("slow");
        };
        self.setMinuteOnLoad = function ($min) {
            if ($min > 0 && $min <= 15) {
                return "15";
            } else if ($min > 15 && $min <= 30) {
                return "30";
            } else if ($min > 30 && $min <= 59) {
                return "45";
            } else {
                return "00";
            }
        }
        self.setDateOnChange = function ($key, $main_key) {
            var am_pm = self.businesshoursdata[$key][$main_key]['time'];
            var hours = parseInt(self.businesshoursdata[$key][$main_key]['hours']);
            var minutes = (self.businesshoursdata[$key][$main_key]['minutes']);
            if ($main_key === "close") {
                var end_time = hours + ":" + minutes + " " + am_pm;
                var open_am_pm = self.businesshoursdata[$key]['open']['time'];
                var open_hours = parseInt(self.businesshoursdata[$key]['open']['hours']);
                var open_minutes = (self.businesshoursdata[$key]['open']['minutes']);
                var start_time = open_hours + ":" + open_minutes + " " + open_am_pm;
                start_time = moment(start_time, "HH:mm a");
                end_time = moment(end_time, "HH:mm a");
                var duration = moment.duration(end_time.diff(start_time));
                if (duration.asMinutes() < 0) {
                    toaster.pop('error', "Time", "Closing time must be greater than opening time");
                    self.valideClosingHours = 0;
                } else {
                    self.valideClosingHours = 1;
                }
            } else {
                var start_time = hours + ":" + minutes + " " + am_pm;
                var close_am_pm = self.businesshoursdata[$key]['close']['time'];
                var close_hours = parseInt(self.businesshoursdata[$key]['close']['hours']);
                var close_minutes = (self.businesshoursdata[$key]['close']['minutes']);
                var end_time = close_hours + ":" + close_minutes + " " + close_am_pm;
                start_time = moment(start_time, "HH:mm a");
                end_time = moment(end_time, "HH:mm a");
                var duration = moment.duration(end_time.diff(start_time));
                if (duration.asMinutes() < 0) {
                    toaster.pop('error', "Time", "Closing time must be greater than opening time");
                    self.valideClosingHours = 0;
                } else {
                    self.valideClosingHours = 1;
                }
            }

            var time = "";
            if (am_pm == "PM") {
                if (hours < 12) {
                    hours = hours + 12;
                } else {
                    hours = "12";
                }
            }
            var d = new Date();
            d.setHours(hours);
            d.setMinutes(minutes);
            time = moment(d).format();
            if ($main_key == 'open') {
                self.bussinessHours[$key].open = time;
            } else {
                self.bussinessHours[$key].close = time;
            }
        }


        self.setHolidayOnChange = function ($key, $value) {
            self.bussinessHours[$key].holiday = $value;
        }

        function businessfaq() {
            AccountModel.getfaq().then(function (response) {

                self.BussFaq = angular.copy(response);
                self.numberOfPages = function () {
                    return Math.ceil(self.BussFaq.data.length / self.pageSize);
                }
            }, function (error) {});
        }

        function getbusinessfaq() {
            AccountModel.getfaqbyid({
                faq_id: faq_id
            }).then(function (response) {
                self.updateBussFaq = angular.copy(response);
            }, function (error) {});
        }

        /******** set business sevice in edit form ********/

        function SetBusinessBrandInForm() {
            AccountModel.getbussbrandbyid({
                brand_id: brand_id
            }).then(function (response) {
                self.BussBrandSetVal = angular.copy(response);
            }, function (error) {});
        }

        function SetBusinessServiceInForm() {
            AccountModel.getbussservicebyid({
                service_id: service_id
            }).then(function (response) {
                self.BussServiceSetVal = angular.copy(response);
            }, function (error) {});
        }


        function businesservices() {
            AccountModel.getbusservices().then(function (response) {

                self.BussServices = angular.copy(response);
                self.numberOfPages = function () {
                    return Math.ceil(self.BussServices.data.length / self.pageSize);
                }
            }, function (error) {});
        }
        self.calculateNumberofpages = function (total_lenght) {
            return Math.ceil(total_lenght / self.pageSize);
        }

        function businessbrand() {
            AccountModel.getbusbrand().then(function (response) {
                self.BussBrand = angular.copy(response);
                self.numberOfPages = function () {                   
                    return Math.ceil(self.BussBrand.data.length / self.pageSize);
                }
            }, function (error) {});
        }


        self.faqdelete = function ($event, list_id) {
            $event.preventDefault();
            Spinner.start();
            AccountModel.faqdelete({
                id: list_id
            }).then(function (responseData) {
                _.each(self.BussFaq.data, function (list, index) {
                    if (list && list.id && list.id === list_id) {
                        Spinner.stop();
                        self.BussFaq.data.splice(index, 1);
                        toaster.pop('success', "Faq Deleted", "Faq has been deleted successfully.");
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
        self.busbranddelete = function ($event, list_id) {
            $event.preventDefault();
            Spinner.start();
            AccountModel.bussbranddelete({
                id: list_id
            }).then(function (responseData) {
                _.each(self.BussBrand.data, function (list, index) {
                    if (list && list.id && list.id === list_id) {
                        Spinner.stop();
                        self.BussBrand.data.splice(index, 1);
                        toaster.pop('success', "Business Service Deleted", "Business Service has been deleted successfully.");
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
        self.busservicedelete = function ($event, list_id) {
            $event.preventDefault();
            Spinner.start();
            AccountModel.busservicedelete({
                id: list_id
            }).then(function (responseData) {
                _.each(self.BussServices.data, function (list, index) {
                    if (list && list.id && list.id === list_id) {
                        Spinner.stop();
                        self.BussServices.data.splice(index, 1);
                        toaster.pop('success', "Business Service Deleted", "Business Service has been deleted successfully.");
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
        self.businesfaq = function () {
            Spinner.start();
            var _business = angular.copy(self.faq),
                    resource;
            resource = AccountModel.faqsave(_business);
            resource.then(function (successResponse) {
                toaster.pop('success', "FAQ Detail Save", "FAQ Details has been saved Successfully.");
                Spinner.stop();
                self.faq = null;
                $state.reload();
            }, function (errorResponse) {
                Spinner.stop();
                console.log('Saving FAQ Detail:', errorResponse);
            });
        };
        self.updatebusinesfaq = function () {
            Spinner.start();
            var _business2 = angular.copy(self.updateBussFaq.data),
                    resource;
            resource = AccountModel.updatefaqsave({
                id: faq_id
            }, _business2);
            resource.then(function (successResponse) {

                toaster.pop('success', "FAQ Detail update", "FAQ Details has been updated Successfully.");
                Spinner.stop();
                $state.go('business_info.faqs');
            }, function (errorResponse) {
                Spinner.stop();
                console.log('Saving FAQ Detail:', errorResponse);
            });
        };
        self.UpdateBusinesBrand = function () {
            Spinner.start();
            var _business2 = angular.copy(self.BussBrandSetVal.data),
                    resource;
            resource = AccountModel.updatebusinessbrand({
                id: brand_id
            }, _business2);
            resource.then(function (successResponse) {
                toaster.pop('success', "Business Brand Detail update", "Business Brand Details has been updated Successfully.");
                $state.go('business_info.brand');
                Spinner.stop();
            }, function (errorResponse) {
                Spinner.stop();
                console.log('Saving Business brand Detail:', errorResponse);
            });
        };
        self.UpdateBusinesService = function () {
            Spinner.start();
            var _business2 = angular.copy(self.BussServiceSetVal.data),
                    resource;            
            resource = AccountModel.updatebusinessservice({
                id: service_id
            }, _business2);
            resource.then(function (successResponse) {
                toaster.pop('success', "Business service Detail update", "Business service Details has been updated Successfully.");
                $state.go('business_info.services');
                Spinner.stop();
            }, function (errorResponse) {
                Spinner.stop();
                console.log('Saving Business service Detail:', errorResponse);
            });
        };
        self.create_businessbrand = function () {
            Spinner.start();
            var businessbrand = angular.copy(self.brand),
                    resource;
            resource = AccountModel.brandsave(businessbrand);
            resource.then(function (successResponse) {
                toaster.pop('success', "Brand Detail Save", "Brand Details has been saved Successfully.");
                Spinner.stop();
                $state.reload();
//                businessbrand();
            }, function (errorResponse) {
                Spinner.stop();
                console.log('Saving Brand Detail:', errorResponse);
            });
        };
        self.create_businesservice = function () {

            Spinner.start();
            var businessservices = angular.copy(self.services),
                    resource;
            resource = AccountModel.servicesave(businessservices);
            resource.then(function (successResponse) {
                toaster.pop('success', "Service Detail Save", "Service Details has been saved Successfully.");
                Spinner.stop();
                $state.reload();
                businesservices();
            }, function (errorResponse) {
                Spinner.stop();
                console.log('Saving Service Detail:', errorResponse);
            });
        };
        self.updateBusinessInfo = function (callFrom) {
            Spinner.start("search_location");
            Spinner.start();
            if (self.userBusinessModel.hasOwnProperty('id')) {
                self.userBusinessModel.operating_hours = angular.toJson(self.bussinessHours);
                self.userBusinessModel.categories = self.userBusinessModel.categories;
            }

            var _business = angular.copy(self.userBusinessModel),
                    resource;
            if (_business.locations) {
                _business.postcode = _business.locations.postcode;
                _business.latitude = _business.locations.latitude;
                _business.longitude = _business.locations.longitude;
                _business.state = _business.locations.state;
                _business.locations = _business.locations.location;
            }
            _business.noNotificationEmail = 0;
            resource = AccountModel.updatebusiness({
                id: _business.id
            }, _business);
            resource.then(function (successResponse) {

                toaster.pop('success', "Business Detail Save", "Business Details has been saved Successfully.");
                Spinner.stop();
                Spinner.stop("search_location");
                updateResolveData();
                if (AccountModel.getModalCall() == 1 && self.show_buiness_wizard == 0 && callFrom == 1) {
                    AccountModel.increaseModalCount();
                    if (AccountModel.getModalCount() == 1) {
                        self.showBusinessInfoModal.close();
                        self.showBusinessHours = $uibModal.open({
                            templateUrl: APP_CONFIG.modules + '/account/business_info/operation-time.html',
                            controller: 'AccountBusinessInfoModalController',
                            controllerAs: '_self',
                            size: 'lg',
                            resolve: {
                                parent: function () {
                                    return self;
                                }
                            }
                        });
                    } else if (AccountModel.getModalCount() == 2) {
                        self.showBusinessHours.close();
                        self.showBusinessSocialMedia = $uibModal.open({
                            templateUrl: APP_CONFIG.modules + '/account/business_info/social-media.html',
                            controller: 'AccountBusinessInfoModalController',
                            controllerAs: '_self',
                            size: 'lg',
                            resolve: {
                                parent: function () {
                                    return self;
                                }
                            }
                        });
                    }
                }
            }, function (errorResponse) {
                Spinner.stop();
                console.log('Saving Business Detail:', errorResponse);
            });
        };
        self.updateUserSocialAccounts = function (obj, callFrom) {            
            var data = {};
            angular.extend(data, self.userBusinessModel.userSocialMediaAccounts);
            data = self.userBusinessModel.userSocialMediaAccounts;
            Spinner.start();
            var resource = false;
            $http({
                method: "POST",
                url: "/updatesocialmedia",
                params: data
            }).success(function (msg) {                
                resource = true;
                self.userBusinessModel.userSocialMediaAccounts = msg;
                ResolveData.userSocialMediaAccounts = self.userBusinessModel.userSocialMediaAccounts.data;
                toaster.pop('success', "Social media", "Social media has been saved Successfully.");
                Spinner.stop();
                updateResolveData();
                if (AccountModel.getModalCall() == 1 && self.show_buiness_wizard == 0 && callFrom == 1) {
                    AccountModel.increaseModalCount();
                    if (AccountModel.getModalCount() == 3) {
                        self.showBusinessSocialMedia.close();
                        if (self.roles[0] == 'schoolcollege') {

                            self.showcoursesModelForm = $uibModal.open({
                                templateUrl: APP_CONFIG.modules + '/account/business_info/sc_courses.html',
                                controller: 'AccountBusinessInfoModalController',
                                size: 'lg',
                                controllerAs: '_self',
                                resolve: {
                                    parent: function () {
                                        return self;
                                    }
                                }
                            });
                        } else {
                            self.showBusinessBrand = $uibModal.open({
                                templateUrl: APP_CONFIG.modules + '/account/business_info/brand.html',
                                controller: 'AccountBusinessInfoModalController',
                                size: 'lg',
                                controllerAs: '_self',
                                resolve: {
                                    parent: function () {
                                        return self;
                                    }
                                }
                            });
                        }
                    }
                }
            });








//            $.ajax({
//                method: "POST",
//                url: "/updatesocialmedia",
//                data: data
//            }).success(function (msg) {
//                resource = true;
//                self.userBusinessModel.userSocialMediaAccounts = msg;
//                ResolveData.userSocialMediaAccounts = self.userBusinessModel.userSocialMediaAccounts;
//                Spinner.stop();
//                toaster.pop('success', "Social media", "Social media has been saved Successfully.");
//
//                if (AccountModel.getModalCall() == 1 && self.show_buiness_wizard == 0 && callFrom == 1) {
//                    AccountModel.increaseModalCount();
//                    if (AccountModel.getModalCount() == 3) {
//                        console.log(self.rol);
//                        self.showBusinessSocialMedia.close();
//                        if (self.roles[0] == 'schoolcollege') {
//
//                            self.showcoursesModelForm = $uibModal.open({
//                                templateUrl: APP_CONFIG.modules + '/account/business_info/sc_courses.html',
//                                controller: 'AccountBusinessInfoModalController',
//                                size: 'lg',
//                                controllerAs: '_self',
//                                resolve: {
//                                    parent: function () {
//                                        return self;
//                                    }
//                                }
//                            });
//                        } else {
//                            self.showBusinessBrand = $uibModal.open({
//                                templateUrl: APP_CONFIG.modules + '/account/business_info/brand.html',
//                                controller: 'AccountBusinessInfoModalController',
//                                size: 'lg',
//                                controllerAs: '_self',
//                                resolve: {
//                                    parent: function () {
//                                        return self;
//                                    }
//                                }
//                            });
//                        }
//                    }
//                }
//
//
//
//
//
//            });
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
            self.showspinner = 1;
            self.suburbList = [];

            SuburbsModel
                    .findLocation({
                        'q': val
                    }).then(function (successResponse) {

                self.suburbList = successResponse.list;
                if (successResponse.list.no_found) {
                    self.nofound = 0;
                }
//                    Spinner.stop();
                self.showspinner = 0;
            }, function (errorResponse) {
                console.log('Saving Details:', errorResponse);
//                    Spinner.stop();
                self.showspinner = 0;
            });
        };
        /**
         * @param  {[type]}
         * @return {[type]}
         */
        self.getCategories = function (val) {
            self.exceptIds = [];
            angular.forEach(self.userBusinessModel.categories, function (task, index) {
                self.exceptIds.push(task.id);
            });            
            if (val.length < 4) {
                return;
            }
            self.showCatSpinner = 1;
            CategoriesModel
                    .searchcategories({
                        'q': val,
                        'type' : 'service',
                        'except': self.exceptIds.join()
                    }).then(function (successResponse) {

                self.categoriesList = successResponse.list;
                self.showCatSpinner = 0;
//                Spinner.stop();
            }, function (errorResponse) {
                console.log('Saving Details:', errorResponse);
            });
        };
        self.flowConfig = function () {
            return {
                target: '/uploadprofilepic',
                permanentErrors: [404, 500, 501],
                maxChunkRetries: 1,
                chunkRetryInterval: 5000,
                simultaneousUploads: 1,
                singleFile: true,
                headers: {
                    'X-CSRF-TOKEN': csrf_token
                },
                query: function (flowFile, flowChunk) {
                    Spinner.start();
                    // function will be called for every request
                    return {
                        id: self.userBusinessModel.id,
                        source: 'flow_query'
                    };
                }
            }
        };
        /**
         * change profile pic if upload successfully
         *
         * @params {Oject}
         * @return {void}
         */
        self.fileUploadSuccess = function ($file, $res) {
            Spinner.stop();
            var obj = JSON.parse($res);
            var profilepic = [];
            profilepic["path"] = obj.path;
            profilepic["name"] = obj.name;
            ResolveData.profilepic = profilepic;
            self.userBusinessModel.logo = obj.path + 'thumb_small_' + obj.name;
            toaster.pop('success', "Logo Uploaded", "Logo has been uploaded successfully.");
        };
        self.flowConfigProfile = function () {

            return {
                target: '/uploadprofilepic',
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
                        id: self.userBusinessModel.id,
                        source: 'flow_query'
                    };
                }
            }
        };
        self.UserProfilefileUploadError = function ($file, $res) {

            var index = self.assets.indexOf($file.id);
            self.assets.splice(index, 1);
            $file.cancel();
            toaster.pop('error', "Gallery", $res);
            Spinner.stop();
        };
        self.showprogressbar = 0;
        self.uploadProfilefiles = function ($flow) {
            self.showprogressbar = 1;
            $flow.upload();
        }
        self.fileProfileUploadSuccess = function ($file, $res, $flow) {
            $file.id = $res;
            self.assets = [];
            self.assets.push($res.replace(/(\r\n|\n|\r)/gm, ""));            
            Spinner.stop();
            self.showprogressbar = 0;
            toaster.pop('success', "Logo Uploaded", "Logo has been uploaded successfully.");
            // self.listing.fileCount = 0;
//            self.listing.fileCount = self.listing.fileCount + $flow.files.length;
        };
        self.fileUploadError = function ($file, $message, $flow) {
            Spinner.stop();
            console.log($message);
        };
        /**
         * change user profile pic
         *
         * @params {images chunks}
         * @return {object}
         */

        self.videoflowConfig = function () {
            return {
                target: '/uploadvideo',
                permanentErrors: [404, 500, 501],
                maxChunkRetries: 1,
                chunkRetryInterval: 5000,
                simultaneousUploads: 1,
                singleFile: true,
                headers: {
                    'X-CSRF-TOKEN': csrf_token
                },
                query: function (flowFile, flowChunk) {
                    Spinner.start();
                    // function will be called for every request
                    return {
                        id: self.userBusinessModel.id,
                        source: 'flow_query'
                    };
                }
            }
        };
        /**
         * change profile pic if upload successfully
         *
         * @params {Oject}
         * @return {void}
         */
        self.videoUploadSuccess = function ($file, $res) {
            Spinner.stop();
            var obj = JSON.parse($res);
            self.userBusinessModel.video = obj.path + obj.name;
            toaster.pop('success', "Video Uploaded", "Video has been uploaded successfully.");
        };
        /**
         * Remove user logo
         *
         * @params {images chunks}
         * @return {object}
         */

        self.removeLogo = function ($event, $flow, user_id) {
            $event.preventDefault();
            if (confirm('Are you sure you want to delete your logo?')) {
                // Spinner.start();
                AccountModel.deleteLogo({
                    id: user_id
                }).then(function (responseData) {
                    self.userBusinessModel.logo = '';
                    self.assets = [];
                    $flow.cancel();
                    if (ResolveData.profilepic) {
                        ResolveData.profilepic = null;
                    }
                    toaster.pop('success', "Delete Logo", "Logo has been deleted successfully.");
                    Spinner.stop();
                }, function (errorResponse) {
                    Spinner.stop();
                });
            }
        };
        /**
         * Remove user Video
         *
         * @params {images chunks}
         * @return {object}
         */

        self.removeVideo = function ($event, user_id) {
            $event.preventDefault();
            if (confirm('Are you sure you want to delete your video?')) {
                Spinner.start();
                AccountModel.deleteVideo({
                    id: user_id
                }).then(function (responseData) {
                    self.userBusinessModel.video = '';
                    toaster.pop('success', "Delete Video", "Video has been deleted successfully.");
                    Spinner.stop();
                }, function (errorResponse) {
                    Spinner.stop();
                });
            }
        };
        self.modelOptions = {
            debounce: {
                default: 500
            },
            getterSetter: true
        };
        self.validateAbn = function () {
//            Spinner.start();
            self.validate_abn = 1;
            $http({
                method: 'get',
                url: "/abnValidation",
                params: {
                    abn: self.userBusinessModel.abn,
                    cname: self.userBusinessModel.abn_name
                }
            }).then(function mySuccess(response) {
                var info = response.data;
                if (info.status === "200") {
                    self.showAbnerrors = 1;
                    self.validabncheck = 1;
                    self.showerror = 0;
                    self.hidetick = 0;
                    self.presentAbnNumber = self.userBusinessModel.abn;
                    self.presentAbnName = self.userBusinessModel.abn_name;
                    toaster.pop('success', "ABN Detail", "ABN Verified Successfully.");
                } else {
                    self.showAbnerrors = 0;
                    self.showerror = 1;
                    self.hidecross = 0;
                    self.errorMsg = info.msg;
                    self.validabncheck = 0;
                }
                if (self.userBusinessModel.abn && self.userBusinessModel.abn_name) {
                    self.abn_text = "Verified";
                }
//                Spinner.stop();
                self.validate_abn = 0;
            });
        };
        self.inputfocus = function () {
            self.showerror = 0;
        };
        self.checkkeyup = function () {
            self.validabncheck = 0;
            self.hidecross = 1;
            self.hidetick = 1;
            if (self.presentAbnNumber == self.userBusinessModel.abn && self.presentAbnName == self.userBusinessModel.abn_name) {
                if (self.presentAbnNumber && self.presentAbnName)
                {
                    self.validabncheck = 1;
                    self.hidecross = 0;
                    self.hidetick = 0;
                }
            }
        };
        self.formValidation = function ($formInValid) {
            if ($formInValid || self.validabncheck == 0) {
                return true;
            } else {
                return false;
            }
        };
        self.showSpinner = function () {
            Spinner.start();
        }
        self.stopSpinner = function () {
            Spinner.stop();
        }
        self.checkABNNumberVerification = function () {
            var return_status = false;
            if (self.abn_text == 'Verified' && self.userBusinessModel.abn == self.presentAbnNumber && self.validabncheck == 1) {
                return_status = true;
            }
            return return_status;
        }
        self.checkABNNameVerification = function () {
            var return_status = false;
            if (self.abn_text == 'Verified' && self.userBusinessModel.abn_name == self.presentAbnName && self.validabncheck == 1) {
                return_status = true;
            }
            return return_status;
        }

        self.validUrl = function ($web_url) {
            if ($web_url === null || typeof $web_url == 'undefined') {
                return $web_url;
            } else {
                var url_is = $web_url;
                var httpStr = 'http';
                if ($web_url.indexOf(httpStr) == -1) {
                    url_is = "http://" + $web_url;
                }
                return url_is;
            }
        }

    }

    AccountBusinessInfoController.$inject = ["$http", "$state", "AccountModel", "Laravel", "AccountFactory", "ResolveData", "toaster", "SuburbsModel", "CategoriesModel", "Spinner", "APP_CONFIG", "$uibModal", "$rootScope"];
    //end of controller

    angular
            .module('BeautyCollective.Account')
            .controller('AccountBusinessInfoController', AccountBusinessInfoController);



})();
(function () {
    'use strict';
    /**
     * @ngdoc config
     *
     * @name BeautyCollective.Account.config.AccountBusinessInfoStates
     * @module BeautyCollective.Account
     *
     * @description
     * Configure Account module routes
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Account')
            .config(AccountBusinessInfoStates);
    /* @ngInject */
    function AccountBusinessInfoStates($stateProvider, APP_CONFIG) {

        $stateProvider.state('business_info', {
            parent: 'account',
            absolute: true,
            url: '^/business_info',
            views: {
                'account_content_view': {
                    template: '<div ui-view="account_business_info_view" class="fadeIn animated"/>'
                },
                'account_top_nav_view': {
                    templateUrl: APP_CONFIG.modules + '/account/business_info/business_info-nav.html'
                }
            }
        }).state('business_info.basic_info', {
            parent: 'business_info',
            url: '/basic-info',
            views: {
                'account_business_info_view@business_info': {
                    templateUrl: APP_CONFIG.modules + '/account/business_info/basic-info.html',
                    controller: 'AccountBusinessInfoController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }
        }).state('business_info.operation_time', {
            parent: 'business_info',
            url: '/operation-time',
            views: {
                'account_business_info_view@business_info': {
                    templateUrl: APP_CONFIG.modules + '/account/business_info/operation-time.html',
                    controller: 'AccountBusinessInfoController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }
        }).state('business_info.social_media', {
            parent: 'business_info',
            url: '/social-media',
            views: {
                'account_business_info_view@business_info': {
                    templateUrl: APP_CONFIG.modules + '/account/business_info/social-media.html',
                    controller: 'AccountBusinessInfoController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }
        }).state('business_info.faqs', {
            parent: 'business_info',
            url: '/faqs',
            views: {
                'account_business_info_view@business_info': {
                    templateUrl: APP_CONFIG.modules + '/account/business_info/business-faqs.html',
                    controller: 'AccountBusinessInfoController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }
        }).state('business_info.update', {
            parent: 'business_info',
            url: '^/update/:faq_id',
            views: {
                'account_business_info_view@business_info': {
                    templateUrl: function ($stateParams) {
                        return APP_CONFIG.modules + '/account/business_info/update-bussiness-faq.html'
                    },
                    controller: 'AccountBusinessInfoController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }
        }).state('business_info.update1', {
            parent: 'business_info',
            url: '^/update1/service/:service_id',
            views: {
                'account_business_info_view@business_info': {
                    templateUrl: function ($stateParams) {
                        return APP_CONFIG.modules + '/account/business_info/update-bussiness-service.html'
                    },
                    controller: 'AccountBusinessInfoController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }
        }).state('business_info.services', {
            parent: 'business_info',
            url: '/services',
            views: {
                'account_business_info_view@business_info': {
                    templateUrl: APP_CONFIG.modules + '/account/business_info/services.html',
                    controller: 'AccountBusinessInfoController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }
        })
                .state('business_info.brand', {
                    parent: 'business_info',
                    url: '/brand',
                    views: {
                        'account_business_info_view@business_info': {
                            templateUrl: APP_CONFIG.modules + '/account/business_info/brand.html',
                            controller: 'AccountBusinessInfoController as _self'
                        }
                    },
                    resolve: {
                        ResolveData: ["ResolveData", function (ResolveData) {
                                return ResolveData.user;
                            }]
                    }
                })
                .state('business_info.courses', {
                    parent: 'business_info',
                    url: '/courses',
                    views: {
                        'account_business_info_view@business_info': {
                            templateUrl: APP_CONFIG.modules + '/account/business_info/sc_courses.html',
                            controller: 'AccountBusinessInfoController as _self'
                        }
                    },
                    resolve: {
                        ResolveData: ["ResolveData", function (ResolveData) {
                                return ResolveData.user;
                            }]
                    }
                })
                .state('business_info.courses.update', {
                    parent: 'business_info',
                    url: '^/update/course/:course_id',
                    views: {
                        'account_business_info_view@business_info': {
                            templateUrl: function ($stateParams) {
                                return APP_CONFIG.modules + '/account/business_info/sc_courses.html'
                            },
                            controller: 'AccountBusinessInfoController as _self'
                        }
                    },
                    resolve: {
                        ResolveData: ["ResolveData", function (ResolveData) {
                                return ResolveData.user;
                            }]
                    }
                })

                .state('business_info.update2', {
                    parent: 'business_info',
                    url: '^/update/brand/:brand_id',
                    views: {
                        'account_business_info_view@business_info': {
                            templateUrl: function ($stateParams) {
                                return APP_CONFIG.modules + '/account/business_info/update-bussiness-brand.html'
                            },
                            controller: 'AccountBusinessInfoController as _self'
                        }
                    },
                    resolve: {
                        ResolveData: ["ResolveData", function (ResolveData) {
                                return ResolveData.user;
                            }]
                    }
                }).state('business_info.profile', {
            parent: 'business_info',
            url: '/profile',
            views: {
                'account_business_info_view@business_info': {
                    templateUrl: APP_CONFIG.modules + '/account/business_info/profile.html',
                    controller: 'AccountBusinessInfoController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }
        }).state('business_info.paymethod', {
            parent: 'business_info',
            url: '/paymethod',
            views: {
                'account_business_info_view@business_info': {
                    templateUrl: APP_CONFIG.modules + '/account/business_info/paymethod.html',
                    controller: 'AccountSettingsController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function (ResolveData) {
                        return ResolveData.user;
                    }]
            }
        })
                .state('business_info.changeCard', {
                    parent: 'business_info',
                    url: '/change/card',
                    onEnter: function ($stateParams, $state, $uibModal) {
                        var obj_modal = $uibModal.open({
                            animation: false,
                            templateUrl: APP_CONFIG.modules + '/account/business_info/changeCard.html',
                            controller: 'changeCardController',
                            controllerAs: '$changeCard'
                        });
                        obj_modal.result.then(function () {
                            //Get triggers when modal is closed                            
                        }, function () {
                            //gets triggers when modal is dismissed.
                            $state.go('business_info.profile');
                        })
                    },
                    resolve: {
                        ResolveData: ["ResolveData", function (ResolveData) {
                                return ResolveData.user;
                            }]
                    }
                })
                ;
    }

    AccountBusinessInfoStates.$inject = ["$stateProvider", "APP_CONFIG"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Configuration(Module config Block)
     *
     * @name BeautyCollective.Users.config.UsersState
     * @module BeautyCollective.Users
     *
     * @description
     * Configure users module routes
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Users')
            .config(UsersState);
    /* @ngInject */
    function UsersState($stateProvider) {
        $stateProvider
                .state('users', {
                    parent: 'dashboard',
                    url: '/users',
                    views: {
                        'content': {
                            templateUrl: 'modules/users/users.html',
                        },
                        'content_sidebar': {
                            templateUrl: 'modules/users/sidebar/users-sidebar.html',
                            controller: 'UsersSidebarController as _self'
                        }
                    },
                    resolve: {
                        authorize: ['Auth',
                            function (Auth) {
                                return Auth.authorize();
                            }
                        ]
                    }
                });
    }

    UsersState.$inject = ["$stateProvider"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Users.Factory.UsersResource
     * @module BeautyCollective.Users
     *
     * @description
     * Implements CURD operations
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Users')
            .factory('UsersResource', UsersResource);
    /* @ngInject */
    function UsersResource($resource, APP_CONFIG) {
        return $resource('macros/', {
            action: '@action',
            action_value: '@action_value'
        }, {
            find: {
                method: 'GET',
                params: {
                    id: '@id',
                }
            },
            create: {
                method: 'POST'
            },
            update: {
                method: 'PUT',
                params: {
                    id: '@id'
                }
            },
            updateStatus: {
                method: 'PUT',
                params: {
                    id: '@id',
                    action: '@status'
                }
            },
            query: {
                method: 'GET',
                transformResponse: transformQueryResponse
            },
            getPhoto: {
                method: 'GET',
                params: {
                    id: '@id',
                    action: '@action'
                }
            },
            savePhoto: {
                url: 'api/v1/users/upload/photo/:user_id',
                method: 'POST',
                params: {
                    user_id: '@user_id',
                },
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: function (data) {
                    var formData = new FormData();
                    //need to convert our json object to a string version of json otherwise
                    // the browser will do a 'toString()' on the object which will result
                    // in the value '[Object object]' on the server.
                    formData.append("photo", data);
                    return formData;
                }
            },
            searchUsers: {
                url: 'api/v1/users/list',
                method: 'GET',
                transformResponse: transformQueryResponse
            }
        });

        function transformQueryResponse(data, headersGetter) {
            var _response = {};
            _response.list = angular.fromJson(data);
            _response.totalCount = parseInt(headersGetter('x-total-count'));
            return angular.fromJson(_response);
        }
    }

    UsersResource.$inject = ["$resource", "APP_CONFIG"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Users.Service.UsersModel
     * @module BeautyCollective.Users
     *
     * @description
     *
     * Data model for users
     * Implemenets CURD operation
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Users')
            .service('UsersModel', UsersModel);
    /* @ngInject */
    function UsersModel(UsersResource) {
        var model = this;
        model.user = {
            firstName: '',
            lastName: '',
            email: '',
            roles: [],
            username: '',
            password: '',
            projectCode: ''
        };
        /**
         * [roleList description]
         * @True {Array}
         */
        model.userslist = [];
        /**
         * Get users
         * @param id id
         * @return users
         */
        model.find = function (id) {
            return UsersResource.find(id).$promise;
        };
        /**
         * [findAll description]
         * @method findAll
         * @author Kinectro
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
        model.findAll = function (params, success, fail) {
            return UsersResource.query(params, success, fail).$promise;
        };
        /**
         * Create a new users
         * @param users users
         * @return users saved
         */
        model.create = function (users) {
            return UsersResource.create(users).$promise;
        };
        /**
         * Update users
         * @param users users
         * @return users saved
         */
        model.update = function (params, users) {
            return UsersResource.update(params, users).$promise;
        };
        /**
         * [savePhoto description]
         * @param  {[type]} params [description]
         * @param  {[type]} data   [description]
         * @return {[type]}        [description]
         */
        model.savePhoto = function (params, data) {
            return UsersResource.savePhoto(params, data).$promise;
        };
        /**
         * Update user's status
         * @param users users
         * @return users saved
         */
        model.updateStatus = function (params, users) {
            return UsersResource.updateStatus(params, users).$promise;
        };
        /**
         * Delete users
         * @param id id
         */
        model.delete = function (id) {
            return UsersResource.delete(id).$promise;
        };
        /**
         * exclude user from userslist
         * @param  {Integet} userId
         *
         * @protected
         * @return {void}
         */
        model.excludeUser = function (userId) {
            angular.forEach(model.userslist, function (user, index) {
                if (parseInt(user.id) === userId) {
                    model.userslist.splice(index, 1);
                }
            });
        };
        /**
         * [getPhoto description]
         * @param  {[type]} params  [description]
         * @param  {[type]} success [description]
         * @param  {[type]} fail    [description]
         * @return {[type]}         [description]
         */
        model.getPhoto = function (params, success, fail) {
            return UsersResource.getPhoto(params, success, fail).$promise;
        };
        /**
         * [searchUsers description]
         * @param  {[type]} params  [description]
         * @param  {[type]} success [description]
         * @param  {[type]} fail    [description]
         * @return {[type]}         [description]
         */
        model.searchUsers = function (params, success, fail) {
            return UsersResource.searchUsers(params, success, fail).$promise;
        };
    }

    UsersModel.$inject = ["UsersResource"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Users.Factory.UsersFactory
     * @module BeautyCollective.Users
     *
     * @description
     *
     * UsersFactory handles business logic and common features
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Users')
            .service('UsersFactory', UsersFactory);
    /* @ngInject */
    function UsersFactory(notify, ResponseHandler, UsersModel, $q, Spinner) {
        var factory = {};
        /**[errorHandler description]
         * @param  {[type]} errorResponse [description]
         * @return {[type]}               [description]
         */
        factory.errorHandler = function (errorResponse) {
            notify.error({
                title: 'Error ' + errorResponse.data ? errorResponse.data.code : errorResponse.status,
                message: errorResponse.data ? errorResponse.data.message : errorResponse.statusText
            })
        };
        /**
         * get All Users
         *
         * @requires page
         * @requires per_page
         * @requires sort_query
         *
         * @private
         * @return {[type]} [description]
         */
        factory.getUsers = function (options) {
            var deferred = $q.defer(),
                    _sortBy = options.isSortReverse ? '-' : '';
            UsersModel.findAll({
                'page': options.page,
                'per_page': options.per_page,
                'sort_query': _sortBy + options.predicate
            }).then(function (successResponse) {
                UsersModel.totalCounts = successResponse.totalCount;
                parseResponse(successResponse.list);
                deferred.resolve(successResponse);
            }).catch(function (error) {
                ResponseHandler.error(error);
                deferred.resolve(null);
            });
            /**
             * parse getUsers response
             * @param  {Array|Object} responseData
             *
             * @private
             * @return {Void}
             */
            function parseResponse(responseData) {
                Spinner.hide();
                UsersModel.userslist.length = 0;
                if (responseData.length === 0) {
                    return;
                }
                Array.prototype.push.apply(UsersModel.userslist, responseData);
            }

            return deferred.promise;
        }

        return factory;
    }

    UsersFactory.$inject = ["notify", "ResponseHandler", "UsersModel", "$q", "Spinner"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Pages.PagesStateConfig
     * @module BeautyCollective.Pages
     *
     * @description
     * Static page states
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Pages')
            .config(PagesStateConfig);
    /* @ngInject */
    function PagesStateConfig($stateProvider) {
        $stateProvider
                .state('page', {
                    abstract: true,
                    parent: 'index',
                    views: {
                        '': {
                            template: '<div ui-view="page-content" class="fade-in-up"/>',
                        }
                    }

                });
    }

    PagesStateConfig.$inject = ["$stateProvider"];
})();
'use strict';
angular.module('BeautyCollective')
        .config(["$stateProvider", function ($stateProvider) {
                $stateProvider
                        .state('home', {
                            parent: 'index',
                            url: '/',
                            data: {
                                roles: ['ROLE_ADMIN', 'ROLE_SYSTEM_ADMIN', 'ROLE_TESTER'],
                                pageClass: 'home-page',
                                pageTitle: 'main.title'
                            },
                            views: {
                                'content': {
                                    templateUrl: 'modules/main/main.html',
                                    controller: 'MainController'
                                },
                                'content_sidebar': {
                                    templateUrl: 'modules/main/sidebar/main-sidebar.html',
                                    controller: 'MainSidebarController as _self'
                                }
                            },
                            resolve: {
                                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader',
                                    function ($translate, $translatePartialLoader) {
                                        $translatePartialLoader.addPart('main');
                                        return $translate.refresh();
                                    }
                                ]
                            }
                        });
            }]);
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.main.Controller.MainController
     * @module BeautyCollective.main
     *
     * @description
     * Landing dashboard page controller
     * Responsible for all view states
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective')
            .controller('MainController', MainController);
    /* @ngInject */
    function MainController($scope, $modal, Logger, LayoutService, notify, Spinner, $window, utilFactory, APP_CONFIG, $state, $filter) {}

    MainController.$inject = ["$scope", "$modal", "Logger", "LayoutService", "notify", "Spinner", "$window", "utilFactory", "APP_CONFIG", "$state", "$filter"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.main.Controller.MainController
     * @module BeautyCollective.main
     *
     * @description
     * Landing dashboard page controller
     * Responsible for all view states
     *
     * @author Kinectro
     */
    angular.module('BeautyCollective.Dashboard', ['froala']).
            value('froalaConfig', {
                toolbarInline: false,
                placeholderText: 'Enter Text Here'
            });
})();




(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Dashboard
     * @module BeautyCollective.Dashboard
     *
     * @description
     * Dashboard task module
     * @see Dashboard.model.js
     * @see Dashboard.resource.js
     *
     * @author Kinectro
     */
    angular

            .module('BeautyCollective.Dashboard', ['ui.bootstrap', "ui.utils", 'angularPayments', 'angularTrix',
                'BeautyCollective.Core',
                'BeautyCollective.Components',
                'BeautyCollective.Widgets',
                'BeautyCollective.Dashboard',
                'BeautyCollective.Pages',
                'BeautyCollective.Users',
                'BeautyCollective.Account',
                'BeautyCollective.Listing',
                'BeautyCollective.Suburbs'
            ]).config(function ($logProvider) {
        $logProvider.debugEnabled(true);
    });

    angular
            .module('BeautyCollective.Dashboard').run(function ($rootScope) {
        $rootScope.base64_encode = function (value) {
            return btoa(value);
        };
        $rootScope.base64_decode = function (value) {
            return atob(value);
        };

    });
})();
(function () {
    'use strict';
    /**
     * @ngdoc config
     *
     * @name BeautyCollective.dashboard.config.DashboardState
     * @module BeautyCollective.dashboard
     *
     * @description
     * Configure dashboard module routes
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Dashboard')
            .config(DashboardState);
    /* @ngInject */
    function DashboardState($stateProvider, APP_CONFIG, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('dashboard', {
            absolute: true,
            views: {
                '': {
                    templateUrl: APP_CONFIG.modules + '/dashboard/dashboard.html',
                    controller: 'DashboardController as dashboardCtrl'
                },
                'user-top-section': {
                    templateUrl: APP_CONFIG.modules + '/dashboard/dashboard_top_section.html',
                    controller: 'DashboardController as dashboardCtrl'
                }
            },
            resolve: {
                ResolveData: ['AccountModel', '$q', function (AccountModel, $q) {
                        var deferred = $q.defer();
                        AccountModel.find({
                            id: null
                        }).then(function (response) {

                            deferred.resolve({
                                'user': response
                            });
                        }, function (error) {
                            deferred.resolve({});
                        });
                        return deferred.promise;
                    }]
            }

        });
    }

    DashboardState.$inject = ["$stateProvider", "APP_CONFIG", "$urlRouterProvider"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Account.Factory.AccountResource
     * @module BeautyCollective.Account
     *
     * @description
     * Implements CURD operations
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Account')
            .factory('AccountResource', AccountResource);
    /* @ngInject */
    function AccountResource($resource, APP_CONFIG) {
        /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
        return $resource('api/dashboard/', {
            requestType: '@requestType',
        }, {
            find: {
                method: 'GET',
                params: {
                    id: '@id',
                }
            },
            save: {
                method: 'POST',
                params: {
                    requestType: 'add',
                    id: '@id',
                }
            },
            update: {
                method: 'PUT',
                params: {
                    id: 0
                }
            },
            teamcancelimage: {
                method: 'GET',
                params: {
                    imgid: '@imgid',
                    team_id: '@team_id',
                },
                url: 'teamcancelimage'
            }
        });
    }

    AccountResource.$inject = ["$resource", "APP_CONFIG"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Dashboard.Service.DashboardModel
     * @module BeautyCollective.Dashboard
     *
     * @description
     *
     * Data model for jobtask module
     * Implemenets CURD operation
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Dashboard')
            .service('DashboardModel', DashboardModel);
    /* @ngInject */
    function DashboardModel(DashboardResource) {
        var model = this;
        /**
         * [jobList description]
         * @True {Array}
         */
        model.dashboardList = [];
        /**
         * [dashboardActivities description]
         * @True {Array}
         */
        model.dashboardActivities = [];
        /**
         * Get dashboard
         * @param id id
         * @return dashboard
         */
        model.find = function (id) {
            return DashboardResource.find(id).$promise;
        };
        /**
         * [findAllActivities description]
         * @method findAllActivities
         * @author Kinectro
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
        model.findAllActivities = function (params, success, fail) {
            return DashboardResource.findAllActivities(params, success, fail);
        };
        /**
         * Create a new dashboard
         * @param dashboard dashboard
         * @return dashboard saved
         */
        model.save = function (dashboard) {
            return DashboardResource.save(dashboard).$promise;
        };
        /**
         * Update dashboard
         * @param dashboard dashboard
         * @return dashboard saved
         */
        model.update = function (dashboard) {
            return DashboardResource.update(dashboard).$promise;
        };
        /**
         * Delete dashboard
         * @param id id
         */
        model.delete = function (id) {
            return DashboardResource.delete(id).$promise;
        };
    }

    DashboardModel.$inject = ["DashboardResource"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Serviceprovider.Controller.DashboardController
     * @module BeautyCollective.Account
     *
     * @description
     * DashboardController is responsible manage account activities
     *
     * @author Kinectro
     */

    /* @ngInject */
    function DashboardController($scope, $state, $window, Laravel, ResolveData, checkusersubscription) {
        var self = this,
                roles = [];
        self.userplanid = 0;
        init();
        /**
         * initialize properties
         *
         * @private
         * @return {void}
         */


        function init() {
            roles = angular.fromJson(Laravel.roles);
            roles = _.map(roles, function (role) {
                return (role.name).toLowerCase();
            });
            if ($state.current.name === 'account' && $state.current.url === '/') {

                if (roles[0] == 'individual' || roles[0] == 'jobseeker') {
                    $state.go('user.detail');
                } else if (roles[0] == 'distributor' || roles[0] == 'serviceprovider') {
                    //                    $state.go('business_info.basic_info');
                    $state.go('business_info.profile');
                } else {
                    $state.go('business_info.profile');
                    //                    $state.go('settings.details');
                }
            }
            if ($state.current.name === 'business_info.basic_info') {
                if (roles[0] == 'individual' || roles[0] == 'jobseeker') {
                    $state.go('user.detail');
                }
            }
            self.userRole = ResolveData.user.roles[0].name;
//            self.planid = 0;
//            if (ResolveData.user.user_subscription.length > 0) {
//                if (ResolveData.user.user_subscription[0].subscription_user_plan) {
//                    if (ResolveData.user.user_subscription[0].subscription_user_plan.plan_detail_record.length > 0) {
//                        if (ResolveData.user.user_subscription[0].subscription_user_plan.plan_detail_record[0].plan_type == 1 && ResolveData.user.user_subscription[0].subscription_user_plan.plan_detail_record[0].booking_type == 1) {
//                            self.planid = 1;
//                        } else {
//                            self.planid = 2;
//                        }
//                    }
//                }
//            }
            self.planid = (ResolveData.user.user_subscription.length > 0) ? ResolveData.user.user_subscription[0].plan_type : '1';
            self.userplanid = (ResolveData.user.user_subscription.length > 0) ? ResolveData.user.user_subscription[0].plan_type : '1';
            // self.userplanid = self.planid;
        }

        self.hasRole = function (roleName) {
            return roles.indexOf(roleName) >= 0;
        }

        self.checkstatus = function (roletype, planid, pl = 0) {
            return checkusersubscription.checkstatus(roletype, planid, pl);
        }

    }

    DashboardController.$inject = ["$scope", "$state", "$window", "Laravel", "ResolveData", "checkusersubscription"];
    //end of controller

    angular
            .module('BeautyCollective.Account')
            .controller('DashboardController', DashboardController);
})();
'use strict';
angular.module('BeautyCollective')
        .config(["$stateProvider", function ($stateProvider) {
                $stateProvider
                        .state('error', {
                            abstract: true,
                            parent: 'index',
                            views: {
                                'content': {
                                    template: '<div ui-view="error" class="fade-in-up"/>',
                                }
                            }

                        });
                $stateProvider
                        .state('error.exception', {
                            parent: 'error',
                            url: '/error',
                            data: {
                                roles: [],
                                pageTitle: 'errors.title'
                            },
                            views: {
                                'error': {
                                    templateUrl: 'modules/error/error.html',
                                    controller: 'ErrorController'
                                }
                            },
                            resolve: {
                                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader',
                                    function ($translate, $translatePartialLoader) {
                                        $translatePartialLoader.addPart('error');
                                        return $translate.refresh();
                                    }
                                ]
                            }
                        })
                        .state('accessdenied', {
                            parent: 'error',
                            url: '/accessdenied',
                            data: {
                                roles: []
                            },
                            views: {
                                'error': {
                                    templateUrl: 'modules/error/accessdenied.html',
                                    controller: 'ErrorController'
                                }
                            },
                            resolve: {
                                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader',
                                    function ($translate, $translatePartialLoader) {
                                        $translatePartialLoader.addPart('error');
                                        return $translate.refresh();
                                    }
                                ]
                            }
                        });
            }]);
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Controller.ErrorController
     * @module BeautyCollective
     *
     * @description
     * Error controller to hanlde errors
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective')
            .controller('ErrorController', ErrorController);
    /* @ngInject */
    function ErrorController($scope, Spinner, $state) {
        Spinner.hide();
    }

    ErrorController.$inject = ["$scope", "Spinner", "$state"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc config
     *
     * @name BeautyCollective.Listing.config.ListingState
     * @module BeautyCollective.Listing
     *
     * @description
     * Configure listing module routes
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Listing')
            .config(ListingState);
    /* @ngInject */
    function ListingState($stateProvider, APP_CONFIG, $urlRouterProvider) {
        $stateProvider.state('listing', {
            parent: 'dashboard',
            absolute: true,
            url: '/listing',
            views: {
                'dashboard_view@dashboard': {
                    templateUrl: APP_CONFIG.modules + '/listing/listing-layout.html',
                    controller: 'ListingController as baseController'
                }
            }

        }).state('listing.list', {
            parent: 'listing',
            url: '/list',
            views: {
                'listing_view@listing': {
                    templateUrl: APP_CONFIG.modules + '/listing/list/list.html',
                    controller: 'ListListingController as listingCtrl'
                }
            },
            onEnter: function ($http) {

                $http({
                    method: "GET",
                    url: "listcheck"

                }).then(function mySuccess(response) {

                    if (response.data == 2) {
                        $(".checklisting .checklist_button").addClass("disabled_button");
                    }
                });
            },
            resolve: {
                Model: ['ListingModel', '$stateParams', function (ListingModel, $stateParams) {
                        return ListingModel;
                    }],
                Listing_type: ["$stateParams", function ($stateParams) {
                        return $stateParams.listing_type;
                    }]
            }
        }).state('listing.create', {
            parent: 'listing',
            url: '/create',
            views: {
                'listing_view@listing': {
                    templateUrl: APP_CONFIG.modules + '/listing/create/create.html',
                    //controller: 'ListingController as listingCtrl'
                }
            }
        }).state('listing.create.list', {
            //parent: 'listing.create',
            parent: 'listing.list',
            url: '/:listing_type',
            views: {
                'create_listing_view@listing.list': {
                    templateUrl: function ($stateParams) {
                        return APP_CONFIG.modules + '/listing/partials/' + $stateParams.listing_type + '.form.html'
                    },
                    controller: 'CreateListingController as createListCtrl'
                }
            },
            resolve: {
                Listing_type: ["$stateParams", function ($stateParams) {
                        return $stateParams.listing_type;
                    }]
            }
        }).state('listing.create.list.update', {
            parent: 'listing.list',
            url: '^/update/:listing_type/:list_id',
            views: {
                'create_listing_view@listing.list': {
                    templateUrl: function ($stateParams) {
                        return APP_CONFIG.modules + '/listing/partials/' + $stateParams.listing_type + '.form.html'
                    },
                    controller: 'CreateListingController as createListCtrl'
                }
            },
            resolve: {
                Listing_type: ["$stateParams", function ($stateParams) {
                        return $stateParams.listing_type;
                    }]
            }
        }).state('listing.jobs', {
            parent: 'dashboard',
            absolute: true,
            url: '/jobs',
            views: {
                'dashboard_view@dashboard': {
                    templateUrl: APP_CONFIG.modules + '/jobs/jobs.html',
                    controller: 'ListJobsController as listingCtrl'
                }
            },
            resolve: {
                Listing_type: ["$stateParams", function ($stateParams) {
                        return $stateParams.listing_type;
                    }]
            }

        })
                .state('listing.jobs.create', {
                    parent: 'listing.jobs',
                    url: '/create/:listing_type',
                    views: {
                        'create_listing_view@listing.jobs': {
                            templateUrl: function ($stateParams) {
                                return APP_CONFIG.modules + '/jobs/job.form.html'
                            },
                            controller: 'JobsController as obj'
                        }
                    },
                    resolve: {
                        Listing_type: ["$stateParams", function ($stateParams) {
                                return $stateParams.listing_type;
                            }]
                    }
                })
                .state('listing.jobs.update', {
                    parent: 'listing.jobs',
                    url: '/update/:listing_type/:list_id',
                    views: {
                        'create_listing_view@listing.jobs': {
                            templateUrl: function ($stateParams) {
                                return APP_CONFIG.modules + '/jobs/job.form.html'
                            },
                            controller: 'JobsController as obj'
                        }
                    },
                    resolve: {
                        Listing_type: ["$stateParams", function ($stateParams) {
                                return $stateParams.listing_type;
                            }]
                    }
                })
                .state('listing.jobs.applications', {
                    parent: 'listing.jobs',
                    url: '/applications',
                    views: {
                        'create_listing_view@listing.jobs': {
                            templateUrl: function () {
                                return APP_CONFIG.modules + '/jobs/lists.html'
                            }
                        },
                        'job_applications_nav@listing.jobs.applications': {
                            templateUrl: function () {
                                return APP_CONFIG.modules + '/jobs/nav_job_list.html'
                            },
                            controller: 'ListJobsController as applicationingCtrl'
                        },
                        'job_applications_applieds@listing.jobs.applications': {
                            templateUrl: function () {
                                return APP_CONFIG.modules + '/jobs/list_empty.html'
                            }
                        }
                    },
                    resolve: {
                        Listing_type: ["$stateParams", function ($stateParams) {
                                return $stateParams.listing_type;
                            }]
                    }
                })
                .state('listing.jobs.applications.applieds', {
                    parent: 'listing.jobs.applications',
                    url: '/applieds/:list_id',
                    views: {
                        'job_applications_applieds@listing.jobs.applications': {
                            templateUrl: function () {
                                return APP_CONFIG.modules + '/jobs/list_applied.html'
                            },
                            controller: 'ListJobsController as applicationingCtrl'
                        }
                    },
                    resolve: {
                        Listing_type: ["$stateParams", function ($stateParams) {
                                return $stateParams.list_id;
                            }]
                    }
                })
                .state('listing.jobs.applications.shortlisted', {
                    parent: 'listing.jobs.applications',
                    url: '/shortlisted/:list_id',
                    views: {
                        'job_applications_applieds@listing.jobs.applications': {
                            templateUrl: function () {
                                return APP_CONFIG.modules + '/jobs/list_applied.html'
                            },
                            controller: 'ListJobsController as applicationingCtrl'
                        }
                    },
                    resolve: {
                        Listing_type: ["$stateParams", function ($stateParams) {
                                return $stateParams.list_id;
                            }]
                    }
                })
                .state('listing.jobs.applications.interview', {
                    parent: 'listing.jobs.applications',
                    url: '/interview/:list_id',
                    views: {
                        'job_applications_applieds@listing.jobs.applications': {
                            templateUrl: function () {
                                return APP_CONFIG.modules + '/jobs/list_applied.html'
                            },
                            controller: 'ListJobsController as applicationingCtrl'
                        }
                    },
                    resolve: {
                        Listing_type: ["$stateParams", function ($stateParams) {
                                return $stateParams.list_id;
                            }]
                    }
                })
                .state('listing.jobs.applications.completed', {
                    parent: 'listing.jobs.applications',
                    url: '/completed/:list_id',
                    views: {
                        'job_applications_applieds@listing.jobs.applications': {
                            templateUrl: function () {
                                return APP_CONFIG.modules + '/jobs/list_applied.html'
                            },
                            controller: 'ListJobsController as applicationingCtrl'
                        }
                    },
                    resolve: {
                        Listing_type: ["$stateParams", function ($stateParams) {
                                return $stateParams.list_id;
                            }]
                    }
                })
                .state('listing.jobs.applications.appliedsall', {
                    parent: 'listing.jobs.applications',
                    url: '/appliedsall',
                    views: {
                        'job_applications_applieds@listing.jobs.applications': {
                            templateUrl: function () {
                                return APP_CONFIG.modules + '/jobs/list_applied.html'
                            },
                            controller: 'ListJobsController as applicationingCtrl'
                        }
                    }
                })
                .state('listing.jobs.applications.shortlistedall', {
                    parent: 'listing.jobs.applications',
                    url: '/shortlistedall',
                    views: {
                        'create_listing_view@listing.jobs.applications': {
                            templateUrl: function ($stateParams) {
                                return APP_CONFIG.modules + '/jobs/job.form.html'
                            },
                            controller: 'ListJobsController as applicationingCtrl'
                        },
                        'job_applications_applieds@listing.jobs.applications': {
                            templateUrl: function () {
                                return APP_CONFIG.modules + '/jobs/list_applied.html'
                            },
                            controller: 'ListJobsController as applicationingCtrl'
                        }
                    }
                })
                .state('marketplace', {
                    parent: 'dashboard',
                    url: '/marketplace',
                    views: {
                        'dashboard_view@dashboard': {
                            templateUrl: APP_CONFIG.modules + '/marketplace/listing.html',
                            controller: 'ListMarketplaceController as listingCtrl'
                        },
                        'classified_left_view@marketplace': {

                            templateUrl: APP_CONFIG.modules + '/marketplace/mp_left_menu.html',
                            controller: 'ListMarketplaceController as listingCtrl'
                        },
                        'classified_right_view@marketplace': {

                            templateUrl: APP_CONFIG.modules + '/marketplace/mp_right_menu.html',
                            controller: 'ListMarketplaceController as listingCtrl'
                        }
                    },
                    onEnter: function ($http) {
                        $http({
                            method: "GET",
                            url: "listcheck"

                        }).then(function mySuccess(response) {

                            if (response.data == 2) {
                                $(".checklisting .checklist_button").addClass("disabled_button");
                            }
                        });
                    },
                    resolve: {
                        Model: ['ListingModel', '$stateParams', function (ListingModel, $stateParams) {
                                return ListingModel;
                            }],
                        Listing_type: ["$stateParams", function ($stateParams) {
                                return $stateParams.listing_type;
                            }]
                    }
                })
                .state('marketplace.create', {
                    parent: 'marketplace',
                    url: '/create/:listing_type',
                    views: {
                        'create_listing_view@marketplace': {
                            templateUrl: function ($stateParams) {
                                return APP_CONFIG.modules + '/marketplace/classified.form.html'
                            },
                            controller: 'MarketplaceController as createListCtrl'
                        }
                    },
                    resolve: {
                        Listing_type: ["$stateParams", function ($stateParams) {
                                return $stateParams.listing_type;
                            }]
                    }
                })
                .state('marketplace.update', {
                    parent: 'marketplace',
                    url: '^/:listing_type/update/:list_id',
                    views: {
                        'create_listing_view@marketplace': {
                            templateUrl: function ($stateParams) {
                                return APP_CONFIG.modules + '/marketplace/classified.form.html'
                            },
                            controller: 'MarketplaceController as createListCtrl'
                        }
                    },
                    resolve: {
                        Listing_type: ["$stateParams", function ($stateParams) {
                                return $stateParams.listing_type;
                            }]
                    }
                });
    }

    ListingState.$inject = ["$stateProvider", "APP_CONFIG", "$urlRouterProvider"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Listing.Factory.ListingResource
     * @module BeautyCollective.Listing
     *
     * @description
     * Implements CURD operations
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Listing')
            .factory('ListingResource', ListingResource);
    /* @ngInject */
    function ListingResource($resource, APP_CONFIG) {
        return $resource('listing/:id', {
            id: '@id'
        }, {
            find: {
                method: 'GET',
                params: {
                    id: '@id',
                },
                transformResponse: transformGetResponse
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PUT'
            },
            query: {
                method: 'GET',
                transformResponse: transformQueryResponse
            },
            getjobs: {
                method: 'GET',
                url: 'listing/getjobs/:id'
            },
            cancel: {
                method: 'GET',
                params: {
                    id: '@id',
                    list_id: '@list_id',
                },
                url: 'cancelimage'
            },
            classifiedAll: {
                method: 'GET',
                url: 'getclassifieds'

            },
            getAnalytics: {
                method: 'GET',
                url: 'MarketAnalytic'
            },
            makeclassified: {
                url: 'makeclassifieds',
                method: 'POST'
            }

        });
    }

    ListingResource.$inject = ["$resource", "APP_CONFIG"];

    function transformQueryResponse(data, headersGetter) {
        var _response = {};
        _response.list = angular.fromJson(data);
        return angular.fromJson(_response);
    }

    function transformGetResponse(data, headersGetter) {
        var _response = {};
        _response.data = angular.fromJson(data);
        return angular.fromJson(_response);
    }
})();
(function () {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Listing.Service.ListingModel
     * @module BeautyCollective.Listing
     *
     * @description
     *
     * Data model for jobtask module
     * Implemenets CURD operation
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Listing')
            .service('ListingModel', ListingModel);
    /* @ngInject */
    function ListingModel(ListingResource) {
        var model = this;
        /**
         * [listingSchema description]
         * @type {Object}
         */
        model.listingSchema = {
            id: null,
            title: '',
            user_id: null,
            email: '',
            contact: '',
            price: 0.00,
            dealprice: 0.00,
            discount: 0,
            saving: 0,
            description: '',
            categories: null,
            other_subcat: null,
            visa_id: null,
            status: 1,
            expiry: '',
            slug: '',
            latitude: '',
            longitude: '',
            suburb: '',
            state: '',
            postcode: '',
            is_show_phone: 0,
            turnover: '',
            rent: '',
            area: '',
            listing_video: '',
            listing_meta: {
                limit_upto: '',
                phone_bookings: '',
                new_customer_only: '',
                valid_for_age: '',
                refunds: '',
                surchage_apply: '',
                public_holidays: '',
                days_valid: {}
            }

        };
        /**
         * [jobList description]
         * @True {Array}
         */
        model.dashboardList = [];
        /**
         * [dashboardActivities description]
         * @True {Array}
         */
        model.dashboardActivities = [];
        /**
         * Get dashboard
         * @param id id
         * @return dashboard
         */
        model.find = function (id) {
            return ListingResource.find(id).$promise;
        };
        /**
         * [findAllListing description]
         * @method findAl
         * @author Kinectro
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
        model.findAll = function (params, success, fail) {
            return ListingResource.query(params, success, fail).$promise;
        };
        /**
         * Create a new dashboard
         * @param dashboard dashboard
         * @return dashboard saved
         */
        model.save = function (list) {
            return ListingResource.save(list).$promise;
        };
        /**
         * Update dashboard
         * @param dashboard dashboard
         * @return dashboard saved
         */
        model.update = function (params, data) {
            return ListingResource.update(params, data).$promise;
        };
        /**
         * Delete dashboard
         * @param id id
         */
        model.delete = function (id) {
            return ListingResource.delete(id).$promise;
        };
        model.cancel = function (id, list_id) {
            return ListingResource.cancel(id, list_id).$promise;
        };
        model.getjobs = function () {
            return ListingResource.getjobs().$promise;
        };
        model.findAllMarketplace = function (params, success, fail) {
            return ListingResource.classifiedAll().$promise;
        };
        model.makeclassified = function (params) {
            return ListingResource.makeclassified(params).$promise;
        };
        model.getAnalytics = function (params) {
            return ListingResource.getAnalytics().$promise;
        };

    }

    ListingModel.$inject = ["ListingResource"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Serviceprovider.Controller.ListingController
     * @module BeautyCollective.Listing
     *
     * @description
     * ListingController is responsible manage account activities
     *
     * @author Kinectro
     */

    /* @ngInject */
    function ListingController($scope, CategoriesModel) {
        var self = this;
        self.adddeals = false;
        //init();

        /**
         * initialize properties
         *
         * @private
         * @return {void}
         */

        function init() {
            CategoriesModel.all({
                type: 'types'
            }).then(function (response) {
                CategoriesModel.categoryTypes.length = 0;
                Array.prototype.push.apply(CategoriesModel.categoryTypes, response.list);
                deferred.resolve({
                    'categoryType': _.find(CategoriesModel.categoryTypes, function (categoryType) {
                        return (categoryType.type_code.toLowerCase() === $stateParams.listing_type.toLowerCase());
                    })
                });
            }, function (error) {
                deferred.resolve({});
            });
        }

    }

    ListingController.$inject = ["$scope", "CategoriesModel"];
    //end of controller

    angular
            .module('BeautyCollective.Listing')
            .controller('ListingController', ListingController);
})();
(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Suburbs
     * @module BeautyCollective.Suburbs
     *
     * @description
     * Suburbs module serve all CURD OPERATIONS locations
     *
     * @see Suburbs.model.js
     * @see Suburbs.resource.js
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Suburbs', []);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Suburbs.Factory.SuburbsResource
     * @module BeautyCollective.Suburbs
     *
     * @description
     * Implements CURD operations
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Suburbs')
            .factory('SuburbsResource', SuburbsResource);
    /* @ngInject */
    function SuburbsResource($resource, APP_CONFIG) {
        return $resource('/locations/:id', {}, {
            findAll: {
                method: "GET",
                transformResponse: transformQueryResponse
            },
            findById: {
                method: "GET",
                params: {
                    id: "@id"
                }
            },
            save: {
                method: "POST",
                params: {}
            },
            delete: {
                method: "DELETE",
                params: {
                    id: "@id"
                }
            },
            update: {
                method: "PUT",
                params: {
                    id: 0
                }
            }
        });

        function transformQueryResponse(data, headersGetter) {
            var _response = {};
            _response.list = angular.fromJson(data);
            _response.totalCount = parseInt(headersGetter('x-total-count'));
            return angular.fromJson(_response);
        }
    }

    SuburbsResource.$inject = ["$resource", "APP_CONFIG"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Suburbs.Service.PriorityModel
     * @module BeautyCollective.Priority
     *
     * @description
     *
     * Data model for Suburbs module
     * Implemenets CURD operation
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Suburbs')
            .service('SuburbsModel', SuburbsModel);
    /* @ngInject */
    function SuburbsModel(SuburbsResource) {
        var model = this;
        /**
         * [jobList description]
         * @True {Array}
         */
        model.cities = [];
        /**
         * [findAll description]
         * @method findAll
         * @return {[type]} [description]
         */
        model.findAll = function (params, callback) {
            return SuburbsResource.findAll(params);
        };
        model.findLocation = function (params, callback) {
            return SuburbsResource.findAll(params).$promise;
        };
    }

    SuburbsModel.$inject = ["SuburbsResource"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.bLaravel
     * @module BeautyCollective
     *
     * @description
     * this module will be used to save the data from laravel blades
     * avoid global variable collision
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.bLaravel', []);
})();
(function () {
    'use strict';
    /**
     * @ngdoc config
     *
     * @name BeautyCollective.Account.config.AccountState
     * @module BeautyCollective.Account
     *
     * @description
     * Configure Account module routes
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Account')
            .config(AccountState);
    /* @ngInject */
    function AccountState($stateProvider, APP_CONFIG, $urlRouterProvider) {
        $stateProvider.state('account', {
            url: '/',
            parent: 'dashboard',
            views: {
                'dashboard_view@dashboard': {
                    templateUrl: APP_CONFIG.modules + '/account/account-layout.html',
                    controller: 'AccountController as _acountCtrl'
                },
                'dashboard_top_view@dashboard': {
                    templateUrl: APP_CONFIG.modules + '/account/account-top-layout.html',
                    controller: 'AccountController as _acountCtrl'
                }
            },
            resolve: {
                ResolveData: ['AccountModel', '$q', function (AccountModel, $q) {
                        var deferred = $q.defer();
                        AccountModel.find({
                            id: null
                        }).then(function (response) {
                            if (typeof response.id === "undefined") {
                                window.location.reload();
                            }
                            deferred.resolve({
                                'user': response
                            });
                        }, function (error) {
                            deferred.resolve({});
                        });
                        return deferred.promise;
                    }]
            }
        });
    }

    AccountState.$inject = ["$stateProvider", "APP_CONFIG", "$urlRouterProvider"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Account.Factory.AccountResource
     * @module BeautyCollective.Account
     *
     * @description
     * Implements CURD operations
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Account')
            .factory('AccountResource', AccountResource);
    /* @ngInject */
    function AccountResource($resource, APP_CONFIG) {
        /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
        return $resource('account/:id', {
            requestType: '@requestType',
            id: '@id',
        }, {
            find: {
                method: 'GET',
                url: 'getuser',
                params: {
                    id: '@id',
                }
            },
            findJob: {
                method: 'GET',
                url: 'getjobs',
                params: {
                    id: '@id',
                }
            },
            save: {
                method: 'POST',
                params: {
                    requestType: 'add',
                    id: '@id',
                }
            },
            updatesocialmedia: {
                url: 'updatesocialmedia',
                method: 'POST'
            },
            faqdelete: {
                method: 'GET',
                params: {
                    id: '@id',
                },
                url: 'faqsave/:id',
            },
            bussbranddelete: {
                method: 'GET',
                params: {
                    id: '@id',
                },
                url: 'bussbranddelete/:id',
            },
            busservicedelete: {
                method: 'GET',
                params: {
                    id: '@id',
                },
                url: 'busservicedelete/:id',
            },
            watchlistdelete: {
                method: 'GET',
                params: {
                    id: '@id',
                    watchtype: '@watchtype',
                },
                url: 'watchlistdelete/:id/:watchtype',
            },
            update: {
                method: 'PUT'
            },
            faqsave: {
                url: 'faqsave',
                method: 'POST'
            },
            updatefaqsave: {
                url: 'updatefaqsave/:id',
                method: 'POST'
            },
            updateteammembersave: {
                url: 'updateteammembersave/:id',
                method: 'POST'
            },
            updatebusinessservice: {
                url: 'updatebusinessservice/:id',
                method: 'POST'
            },
            updatebusinessbrand: {
                url: 'updatebusinessbrand/:id',
                method: 'POST'
            },
            updatecreditform: {
                url: 'updatecreditform',
                method: 'POST'
            },
            servicesave: {
                url: 'servicesave',
                method: 'POST'
            },
            brandsave: {
                url: 'brandsave',
                method: 'POST'
            },
            getSubscriptiondata: {
                url: 'previous/receipt',
                method: 'POST'
            },
            getfaq: {
                url: 'faqsave',
                method: 'GET',
                transformResponse: transformGetResponse2,
            },
            getCourses: {
                url: 'getCourses',
                method: 'GET',
                transformResponse: transformGetResponse2,
            },
            get_transactions: {
                url: 'account/transactions',
                method: 'GET',
                transformResponse: transformGetResponse6,
            },
            get_invoices: {
                url: 'account/invoices',
                method: 'GET',
                transformResponse: transformGetResponse15,
            },
            getWatchListjobseeker: {
                url: 'getWatchListjobseeker',
                method: 'GET',
                transformResponse: transformGetResponse8,
            },
            getWatchListlisting: {
                url: 'getwatchlist',
                method: 'GET',
                transformResponse: transformGetResponse10,
            },
            get_subscriptions: {
                url: 'account/subscriptions',
                method: 'GET',
                transformResponse: transformGetResponse7,
            },
            teamssave: {
                url: 'teamssave',
                method: 'POST'
            },
            /********create user gallery **************/

            ctusergallery: {
                url: 'ctusergallery',
                method: 'POST'
            },
            /********create cover letter and resume **************/

            MycoverltrAndResume: {
                url: 'mycoverletterandresume',
                method: 'POST'
            },
            /********create payment methods **************/
            paymentavailablethods: {
                url: 'paymentmethods',
                method: 'POST'
            },
            /****create user video gallery *****/
            videogallery: {
                url: 'videogallery',
                method: 'POST',
                interceptor: {
                    response: function (response) {
                        // expose response
                        return response;
                    }
                }
            },
            /********End create user gallery **************/
            getfaqbyid: {
                url: 'getfaqbyid/:id',
                method: 'GET',
                /*  params: {
                 id: 'faq_id',
                 }, */
                transformResponse: transformGetResponse4,
            },
            getteammemberbyid: {
                url: 'getteammemberbyid/:id',
                method: 'GET',
                /*  params: {
                 id: 'faq_id',
                 }, */
                transformResponse: transformGetResponse18,
            },
            DeleteTeam: {
                method: 'DELETE',
                params: {
                    id: '@id',
                },
                url: 'teamssave/:id',
            },
            getbussservicebyid: {
                url: 'getbussservicebyid/:id',
                method: 'GET',
                /*  params: {
                 id: 'faq_id',
                 }, */
                transformResponse: transformGetResponse5,
            },
            getbussbrandbyid: {
                url: 'getbussbrandbyid/:id',
                method: 'GET',
                /*  params: {
                 id: 'faq_id',
                 }, */
                transformResponse: transformGetResponse5,
            },
            getbusservices: {
                url: 'getbusservices',
                method: 'GET',
                transformResponse: transformGetResponse3,
            },
            getbusbrand: {
                url: 'getbusbrand',
                method: 'GET',
                transformResponse: transformGetResponse3,
            },
            updatebusiness: {
                url: 'business/:id',
                method: 'PUT'
            },
            updateIndividualInfo: {
                url: 'updateindividualinfo/:id',
                method: 'PUT'
            },
            getJobSeekers: {
                url: 'jobseekers',
                method: 'GET',
                isArray: true
            },
            getJobSeekers1: {
                url: 'getjobseekers',
                method: 'GET',
                /*    isArray:true */
                transformResponse: transformGetResponse21,
            },
            getUsers: {
                url: 'getusers',
                method: 'GET',
                isArray: true
            },
            deleteLogo: {
                url: 'deletelogo',
                method: 'GET'
            },
            deleteVideo: {
                url: 'deletevideo',
                method: 'GET'
            },
            getWatchList: {
                url: 'getwatchlist',
                method: 'GET',
                transformResponse: transformGetResponse9,
            },
            getgallery: {
                url: 'getgallery',
                method: 'GET',
                transformResponse: transformGetResponse11,
            },
            /************ get cover letter and resume ***************/
            getcoverltrandresume: {
                url: 'getcoverltrandresume',
                method: 'GET',
                transformResponse: transformGetResponse17,
            },
            /************ end cover letter and resume ***************/

            /************ get payment method ***************/
            getpaymentmethod: {
                url: 'getpaymentmethod',
                method: 'GET',
                transformResponse: transformGetResponse20,
            },
            /************get my video gallery*******************/
            getvideogallery: {
                url: 'getvideogallery',
                method: 'GET',
                transformResponse: transformGetResponse13,
            },
            /************end**********************/

            classifiedcat: {
                url: 'classifiedcat',
                method: 'GET',
                transformResponse: transformGetResponse12,
            },
            getaccountcats: {
                url: 'getaccountcats',
                method: 'GET',
                transformResponse: transformGetResponse19,
            },
            getccinfo: {
                url: 'getccinfo',
                method: 'GET',
                transformResponse: transformGetResponse14,
            },
            /********team members***********/
            getteammembers: {
                url: 'getteammembers',
                method: 'GET',
                transformResponse: transformGetResponse16,
            },
            getcustomerbooking: {
                url: 'getcustomerbooking',
                method: 'GET',
                transformResponse: transformGetResponse2,
            },
            //user blog
            getblogs: {
                url: 'getblogs',
                method: 'GET',
                transformResponse: transformGetResponse3,
            },
            TeamMPic: {
                method: 'GET',
                params: {
                    image_id: '@image_id',
                    member_id: '@member_id',
                },
                url: 'teammemberpic/:image_id/:member_id',
            },
            UploadTeamMPic: {
                method: 'GET',
                params: {
                    image_id: '@image_id',
                },
                url: 'uploadteammemberpic/:image_id',
            },
            DeleteMygalleryImage: {
                method: 'GET',
                params: {
                    id: '@id',
                    cat_id: '@cat_id',
                },
                url: 'getgallery/:id/:cat_id',
            },
            DeleteMyResumeFile: {
                method: 'GET',
                params: {
                    id: '@id',
                },
                url: 'myresumeupload/:id',
            },
            teamcancelFile: {
                method: 'GET',
                params: {
                    id: '@id',
                },
                url: 'teamssave/:id',
            },
            DeleteMyvideogallery: {
                method: 'GET',
                params: {
                    id: '@id',
                    cat_id: '@cat_id',
                },
                url: 'getvideogallery/:id/:cat_id',
            },
            /********user notifications***********/
            getusernotification: {
                url: 'getusernotification',
                method: 'GET',
                transformResponse: transformGetResponse16,
            },
            /*
             * scC-Resourse-start
             * School and Colleges Resourse Section
             * Section Start
             */
            getCourses: {
                url: 'getCourses',
                method: 'GET',
                transformResponse: transformGetResponse2,
            },
            getCoursesById: {
                url: 'getCourses/:id',
                method: 'GET',
                transformResponse: transformGetResponse2,
            },
            saveCourse: {
                url: 'changecoursedetail',
                method: 'POST',
                transformResponse: transformGetResponse2,
            },
            updatebusinessCourses: {
                url: 'changecoursedetail',
                method: 'POST',
                transformResponse: transformGetResponse2,
            },
            busscoursedelete: {
                url: 'deletecourse',
                method: 'POST'
            },
            DeleteAsset: {
                url: 'deleteasset/:id',
                method: 'GET'
            },
            getSMSPackages: {
                url: 'getSMSPackages',
                method: 'GET',
            },
            getListingPackages: {
                url: 'getListingPackages',
                method: 'GET',
            },
            /*
             * scC-Resourse-end
             * School and Colleges Resourse Section
             * Section end
             */
            updatefbcredential: {
                url: 'fb/save',
                method: 'POST'
            }
        });
    }

    AccountResource.$inject = ["$resource", "APP_CONFIG"];

    function transformGetResponse(data, headersGetter) {
        var _response = {};
        _response.data = angular.fromJson(data);
        return angular.fromJson(_response);
    }

    function transformGetResponse2(data, headersGetter) {
        var _response2 = {};
        _response2.data = angular.fromJson(data);
        return angular.fromJson(_response2);
    }

    function transformGetResponse4(data, headersGetter) {
        var _response4 = {};
        _response4.data = angular.fromJson(data);
        return angular.fromJson(_response4);
    }

    function transformGetResponse5(data, headersGetter) {
        var _response5 = {};
        _response5.data = angular.fromJson(data);
        return angular.fromJson(_response5);
    }

    function transformGetResponse3(data, headersGetter) {
        var _response3 = {};
        _response3.data = angular.fromJson(data);
        return angular.fromJson(_response3);
    }

    function transformGetResponse6(data, headersGetter) {
        var _response6 = {};
        _response6.data = angular.fromJson(data);
        return angular.fromJson(_response6);
    }

    function transformGetResponse7(data, headersGetter) {
        var _response7 = {};
        _response7.data = angular.fromJson(data);
        return angular.fromJson(_response7);
    }

    function transformGetResponse8(data, headersGetter) {
        var _response8 = {};
        _response8.data = angular.fromJson(data);
        return angular.fromJson(_response8);
    }

    function transformGetResponse9(data, headersGetter) {
        var _response9 = {};
        _response9.data = angular.fromJson(data);
        return angular.fromJson(_response9);
    }

    function transformGetResponse10(data, headersGetter) {
        var _response10 = {};
        _response10.data = angular.fromJson(data);
        return angular.fromJson(_response10);
    }

    function transformGetResponse11(data, headersGetter) {
        var _response11 = {};
        _response11.data = angular.fromJson(data);
        return angular.fromJson(_response11);
    }

    function transformGetResponse12(data, headersGetter) {
        var _response12 = {};
        _response12.data = angular.fromJson(data);
        return angular.fromJson(_response12);
    }

    function transformGetResponse13(data, headersGetter) {
        var _response13 = {};
        _response13.data = angular.fromJson(data);
        return angular.fromJson(_response13);
    }

    function transformGetResponse14(data, headersGetter) {
        var _response14 = {};
        _response14.data = angular.fromJson(data);
        return angular.fromJson(_response14);
    }

    function transformGetResponse15(data, headersGetter) {
        var _response15 = {};
        _response15.data = angular.fromJson(data);
        return angular.fromJson(_response15);
    }

    function transformGetResponse16(data, headersGetter) {
        var _response16 = {};
        _response16.data = angular.fromJson(data);
        return angular.fromJson(_response16);
    }

    function transformGetResponse17(data, headersGetter) {
        var _response17 = {};
        _response17.data = angular.fromJson(data);
        return angular.fromJson(_response17);
    }

    function transformGetResponse18(data, headersGetter) {
        var _response18 = {};
        _response18.data = angular.fromJson(data);
        return angular.fromJson(_response18);
    }

    function transformGetResponse19(data, headersGetter) {
        var _response19 = {};
        _response19.data = angular.fromJson(data);
        return angular.fromJson(_response19);
    }

    function transformGetResponse20(data, headersGetter) {
        var _response20 = {};
        _response20.data = angular.fromJson(data);
        return angular.fromJson(_response20);
    }

    function transformGetResponse21(data, headersGetter) {
        var _response21 = {};
        _response21.data = angular.fromJson(data);
        return angular.fromJson(_response21);
    }


})();
(function () {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Account.Service.AccountModel
     * @module BeautyCollective.Account
     *
     * @description
     *
     * Data model for jobtask module
     * Implemenets CURD operation
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Account')
            .service('AccountModel', AccountModel);
    /* @ngInject */
    function AccountModel(AccountResource) {
        var model = this;
        /**
         * [jobList description]
         * @True {Array}
         */
        model.dashboardList = [];
        /**
         * [dashboardActivities description]
         * @True {Array}
         */
        model.dashboardActivities = [];
        model.modalcallstatus = 0;
        model.modalcount = 0;
        model.increaseModalCount = function () {
            model.modalcount++;
            if (model.modalcount > 4) {
                model.modalcount = 0;
            }
        }
        model.getModalCount = function () {
            return model.modalcount;
        }

        /**
         * Get dashboard
         * @param id id
         * @return dashboard
         */
        model.find = function (id) {
            return AccountResource.find(id).$promise;
        };
        /**
         * Get dashboard
         * @param id id
         * @return dashboard
         */
        model.findJob = function (id) {
            return AccountResource.findJob(id).$promise;
        };
        /**
         * [findAllActivities description]
         * @method findAllActivities
         * @author Kinectro
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
        model.findAllActivities = function (params, success, fail) {
            return AccountResource.findAllActivities(params, success, fail);
        };
        /**
         * Create a new dashboard
         * @param dashboard dashboard
         * @return dashboard saved
         */
        model.save = function (dashboard) {
            return AccountResource.save(dashboard).$promise;
        };
        model.faqsave = function (data) {
            return AccountResource.faqsave(data).$promise;
        };
        model.updatefaqsave = function (params, data) {
            return AccountResource.updatefaqsave(params, data).$promise;
        };
        model.updateteammembersave = function (params, data) {
            return AccountResource.updateteammembersave(params, data).$promise;
        };
        model.updatebusinessservice = function (params, data) {
            return AccountResource.updatebusinessservice(params, data).$promise;
        };
        model.updatebusinessbrand = function (params, data) {
            return AccountResource.updatebusinessbrand(params, data).$promise;
        };
        model.servicesave = function (data) {
            return AccountResource.servicesave(data).$promise;
        };
        model.brandsave = function (data) {
            return AccountResource.brandsave(data).$promise;
        };
        model.teamssave = function (data) {
            return AccountResource.teamssave(data).$promise;
        };
        /***********Create user gallery*******************/
        model.ctusergallery = function (data) {
            return AccountResource.ctusergallery(data).$promise;
        };
        /***********Create my cover letter and Resume *******************/
        model.MycoverltrAndResume = function (data) {
            return AccountResource.MycoverltrAndResume(data).$promise;
        };
        /***********Create my cover letter and Resume *******************/
        model.paymentavailablethods = function (data) {
            return AccountResource.paymentavailablethods(data).$promise;
        };
        /***********Create user video gallery*******************/
        model.videogallery = function (data) {
            return AccountResource.videogallery(data).$promise;
        };
        /**
         *
         *    Get all business
         *
         **/
        model.getfaq = function () {
            return AccountResource.getfaq().$promise;
        };
        /*****
         **** Get my gallery
         ****/
        model.getgallery = function () {
            return AccountResource.getgallery().$promise;
        };
        /*****
         **** Get my coverletter and resume
         ****/
        model.getcoverltrandresume = function () {
            return AccountResource.getcoverltrandresume().$promise;
        };
        /*****
         **** Get my payment method
         ****/
        model.getpaymentmethod = function () {
            return AccountResource.getpaymentmethod().$promise;
        };
        /*****
         **** Get my team members
         ****/
        model.getteammembers = function () {
            return AccountResource.getteammembers().$promise;
        };
        model.getcustomerbooking = function () {
            return AccountResource.getcustomerbooking().$promise;
        };
        //user blog
        model.getblogs = function () {
            return AccountResource.getblogs().$promise;
        };
        /*****
         **** Get my video gallery
         ****/
        model.getvideogallery = function () {
            return AccountResource.getvideogallery().$promise;
        };
        /*****
         **** Get classified categories
         ****/
        model.classifiedcat = function () {
            return AccountResource.classifiedcat().$promise;
        };
        /*****
         **** Get all categories
         ****/
        model.getaccountcats = function () {
            return AccountResource.getaccountcats().$promise;
        };
        /*
         ** get cc info
         */
        model.getccinfo = function () {
            return AccountResource.getccinfo().$promise;
        };
        /**
         *
         *    Get all transaction
         *
         **/
        model.get_transactions = function () {
            return AccountResource.get_transactions().$promise;
        };
        /**
         *
         *    Get all transaction
         *
         **/
        model.get_invoices = function () {
            return AccountResource.get_invoices().$promise;
        };
        /**
         *
         *    Get getWatchListjobseeker
         *
         **/
        model.getWatchListjobseeker = function () {
            return AccountResource.getWatchListjobseeker().$promise;
        };
        /**
         *
         *    Get getWatchListlisting
         *
         **/
        model.getWatchListlisting = function () {
            return AccountResource.getWatchListlisting().$promise;
        };
        /**
         *
         *    Get all subcriptions
         *
         **/

        model.get_subscriptions = function () {
            return AccountResource.get_subscriptions().$promise;
        };
        model.getSubscriptiondata = function (data) {
            return AccountResource.getSubscriptiondata(data).$promise;
        };
        model.getfaqbyid = function (faq_id) {
            return AccountResource.getfaqbyid(faq_id).$promise;
        };
        /***** set team member id ******/
        model.getteammemberbyid = function (team_member_id) {
            return AccountResource.getteammemberbyid(team_member_id).$promise;
        };
        /***** end set team member id ******/
        model.DeleteTeam = function (team_id) {
            return AccountResource.DeleteTeam(team_id).$promise;
        };
        model.getbussservicebyid = function (service_id) {
            return AccountResource.getbussservicebyid(service_id).$promise;
        };
        model.getbussbrandbyid = function (brand_id) {
            return AccountResource.getbussbrandbyid(brand_id).$promise;
        };
        model.getbusservices = function () {
            return AccountResource.getbusservices().$promise;
        };
        model.getbusbrand = function () {
            return AccountResource.getbusbrand().$promise;
        };
        /**
         * Update dashboard
         * @param dashboard dashboard
         * @return dashboard saved
         */
        model.update = function (params, data) {
            return AccountResource.update(params, data).$promise;
        };
        model.updatecreditform = function (params, data) {
            return AccountResource.updatecreditform(params, data).$promise;
        };
        /**
         * Update business details
         * @param {{dashboard dashboard}}
         * @return dashboard saved
         */
        model.updatebusiness = function (params, data) {
            return AccountResource.updatebusiness(params, data).$promise;
        };
        model.updateUserSocialMedia = function (data) {
            return AccountResource.updatesocialmedia(data).$promise;
        };
        /**
         * Update jobs details
         * @param {{dashboard dashboard}}
         * @return dashboard saved
         */
        model.updateIndividualInfo = function (params, data) {
            return AccountResource.updateIndividualInfo(params, data).$promise;
        };
        model.faqdelete = function (id) {
            return AccountResource.faqdelete(id).$promise;
        };
        /************Delete My gallery image*****************/
        model.DeleteMygalleryImage = function (id, cat_id) {
            return AccountResource.DeleteMygalleryImage(id, cat_id).$promise;
        };
        /************Delete existing team member profile pic *****************/
        model.TeamMPic = function (id) {
            return AccountResource.TeamMPic(id).$promise;
        };
        /************Delete upload team member profile pic *****************/
        model.UploadTeamMPic = function (image_id) {
            return AccountResource.UploadTeamMPic(image_id).$promise;
        };
        /************Delete My Resume file*****************/
        model.DeleteMyResumeFile = function (id) {
            return AccountResource.DeleteMyResumeFile(id).$promise;
        };
        /************cancel team image*****************/
        model.teamcancelFile = function (id) {
            return AccountResource.teamcancelFile(id).$promise;
        };
        /**************end delete************************/

        /************Delete My video gallery*****************/
        model.DeleteMyvideogallery = function (id, cat_id) {
            return AccountResource.DeleteMyvideogallery(id, cat_id).$promise;
        };
        /**************end delete************************/
        model.busservicedelete = function (id) {
            return AccountResource.busservicedelete(id).$promise;
        };
        model.bussbranddelete = function (id) {
            return AccountResource.bussbranddelete(id).$promise;
        };
        model.watchlistdelete = function (id, watchtype) {
            return AccountResource.watchlistdelete(id, watchtype).$promise;
        };
        /**
         * Delete dashboard
         * @param id id
         */
        model.delete = function (id) {
            return AccountResource.delete(id).$promise;
        };
        /**
         * search job seekers
         * @param {{dashboard dashboard}}
         * @return dashboard saved
         */
        model.getJobSeekers = function (params, success, fail) {
            return AccountResource.getJobSeekers(params, success, fail).$promise;
        };
        /*
         search all job seekers
         */

        model.getJobSeekers1 = function (params, success, fail) {
            return AccountResource.getJobSeekers1(params, success, fail).$promise;
        };
        /**
         * search job seekers
         * @param {{dashboard dashboard}}
         * @return dashboard saved
         */
        model.getUsers = function (params, success, fail) {
            return AccountResource.getUsers(params, success, fail).$promise;
        };
        /**
         * delete logo
         * @param {{delete logo}}
         * @return delete logo
         */
        model.deleteLogo = function (params, success, fail) {
            return AccountResource.deleteLogo(params, success, fail).$promise;
        };
        /**
         * delete Video
         * @param {{delete logo}}
         * @return delete logo
         */
        model.deleteVideo = function (params, success, fail) {
            return AccountResource.deleteVideo(params, success, fail).$promise;
        };
        /**
         * search job seekers
         * @param {{dashboard dashboard}}
         * @return dashboard saved
         */
        model.getWatchList = function () {
            return AccountResource.getWatchList().$promise;
        };
        /*
         ** team cancle image
         */

        model.teamcancelimage = function (imgid, team_id) {
            return AccountResource.teamcancelimage(imgid, team_id).$promise;
        };
        /*****
         **** Get my user notifications
         ****/
        model.getusernotification = function () {
            return AccountResource.getusernotification().$promise;
        };
        model.setModalCall = function (modalcall) {
            model.modalcallstatus = modalcall;
        }
        model.getModalCall = function () {
            return model.modalcallstatus;
        }

        /**
         *  scC-Modal-start
         *    School and Colleges Courses Modal
         *      Session Start
         **/
        model.getCourses = function () {
            return AccountResource.getCourses().$promise;
        };
        model.getCoursesById = function (course_id) {
            return AccountResource.getCoursesById(course_id).$promise;
        };
        model.DeleteAsset = function (asset_id) {
            return AccountResource.DeleteAsset(asset_id).$promise;
        };
        model.saveCourse = function (business_course) {
            return AccountResource.saveCourse(business_course).$promise;
        };
        model.updatebusinessCourses = function (business_course) {
            return AccountResource.updatebusinessCourses(business_course).$promise;
        };
        model.busscoursedelete = function (id) {
            return AccountResource.busscoursedelete(id).$promise;
        };

        model.getSMSPackages = function () {
            return AccountResource.getSMSPackages().$promise;
        };
        model.getListingPackages = function () {
            return AccountResource.getListingPackages().$promise;
        };
        /**
         *  scC-Modal-start
         *    School and Colleges Courses Modal
         *      Session Start
         **/
        model.updatefbcredential = function (data) {
            return AccountResource.updatefbcredential(data).$promise;
        };

    }

    AccountModel.$inject = ["AccountResource"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Account.Factory.AccountFactory
     * @module BeautyCollective.Account
     *
     * @description
     *
     * AccountFactory handles business logic and common features
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Account')
            .service('AccountFactory', AccountFactory);
    /* @ngInject */
    function AccountFactory() {
        var factory = {};
        var openinghours = "2019-05-23T08:00";
        var closinghours = "2019-05-23T17:00";
        factory.getDefaultBusinessHours = function () {
            return {
                monday: {
                    open: openinghours,
                    close: closinghours,
                    holiday: 1
                },
                tuesday: {
                    open: openinghours,
                    close: closinghours,
                    holiday: 1
                },
                wednesday: {
                    open: openinghours,
                    close: closinghours,
                    holiday: 1
                },
                thursday: {
                    open: openinghours,
                    close: closinghours,
                    holiday: 1
                },
                friday: {
                    open: openinghours,
                    close: closinghours,
                    holiday: 1
                },
                saturday: {
                    open: openinghours,
                    close: closinghours,
                    holiday: 1
                },
                sunday: {
                    open: openinghours,
                    close: closinghours,
                    holiday: 1
                }
            };
        };
//        factory.getDefaultBusinessHours = function () {
//            return {
//                monday: {
//
//                    open: moment().utcOffset(5).set({
//                        hour: 8,
//                        minute: 0,
//                        second: 0,
//                        millisecond: 0
//                    }).toISOString(),
//                    close: moment().utcOffset(5).set({
//                        hour: 17,
//                        minute: 0,
//                        second: 0,
//                        millisecond: 0
//                    }).toISOString(),
//                    holiday: 1
//                },
//                tuesday: {
//                    open: moment().utcOffset(5).set({
//                        hour: 8,
//                        minute: 0,
//                        second: 0,
//                        millisecond: 0
//                    }).toISOString(),
//                    close: moment().utcOffset(5).set({
//                        hour: 17,
//                        minute: 0,
//                        second: 0,
//                        millisecond: 0
//                    }).toISOString(),
//                    holiday: 1
//                },
//                wednesday: {
//                    open: moment().utcOffset(5).set({
//                        hour: 8,
//                        minute: 0,
//                        second: 0,
//                        millisecond: 0
//                    }).toISOString(),
//                    close: moment().utcOffset(5).set({
//                        hour: 17,
//                        minute: 0,
//                        second: 0,
//                        millisecond: 0
//                    }).toISOString(),
//                    holiday: 1
//                },
//                thursday: {
//                    open: moment().utcOffset(5).set({
//                        hour: 8,
//                        minute: 0,
//                        second: 0,
//                        millisecond: 0
//                    }).toISOString(),
//                    close: moment().utcOffset(5).set({
//                        hour: 17,
//                        minute: 0,
//                        second: 0,
//                        millisecond: 0
//                    }).toISOString(),
//                    holiday: 1
//                },
//                friday: {
//                    open: moment().utcOffset(5).set({
//                        hour: 8,
//                        minute: 0,
//                        second: 0,
//                        millisecond: 0
//                    }).toISOString(),
//                    close: moment().utcOffset(5).set({
//                        hour: 17,
//                        minute: 0,
//                        second: 0,
//                        millisecond: 0
//                    }).toISOString(),
//                    holiday: 1
//                },
//                saturday: {
//                    open: moment().utcOffset(5).set({
//                        hour: 8,
//                        minute: 0,
//                        second: 0,
//                        millisecond: 0
//                    }).toISOString(),
//                    close: moment().utcOffset(5).set({
//                        hour: 17,
//                        minute: 0,
//                        second: 0,
//                        millisecond: 0
//                    }).toISOString(),
//                    holiday: 1
//                },
//                sunday: {
//                    open: moment().utcOffset(5).set({
//                        hour: 8,
//                        minute: 0,
//                        second: 0,
//                        millisecond: 0
//                    }).toISOString(),
//                    close: moment().utcOffset(5).set({
//                        hour: 17,
//                        minute: 0,
//                        second: 0,
//                        millisecond: 0
//                    }).toISOString(),
//                    holiday: 1
//                }
//            };
//        };
        factory.getDefaultBusinessDays = function () {
            return [{
                    day: 'monday',
                    isOpen: false,
                    isClose: false
                }, {
                    day: 'tuesday',
                    isOpen: false,
                    isClose: false
                }, {
                    day: 'wednesday',
                    isOpen: false,
                    isClose: false
                }, {
                    day: 'thursday',
                    isOpen: false,
                    isClose: false
                }, {
                    day: 'friday',
                    isOpen: false,
                    isClose: false
                }, {
                    day: 'saturday',
                    isOpen: false,
                    isClose: false
                }, {
                    day: 'sunday',
                    isOpen: false,
                    isClose: false
                }];
        };
        return factory;
    }
})();
(function () {
    'use strict';
    angular.module('BeautyCollective.Account')
            .factory('checkusersubscription', function ($http) {
                return {
                    checkstatus: function (roletype, planid, pl = 0) {
                        var ret = false;
                        if (roletype != "JobSeeker" && roletype != "Individual") {
                            if (pl == 3) {
                                pl = 2;
                            }
                            if (planid == 2) {
                                ret = true;
                            }

                        }
                        ////                        if (pl == 0) {
                        //                            if (roletype == "ServiceProvider" || roletype == "Distributor" || roletype == "Distributor") {
                        //                                if (planid == 2 || planid == 3) {
                        //                                    ret = true;
                        //                                }
                        //                            }
                        //                        } else {
                        //                            if (pl == 2 && planid == 2) {
                        //                                ret = true;
                        //                            } else if (pl == 3 && planid == 3) {
                        //                                ret = true;
                        //                            }
                        //                        }
                        return ret;
                    },
                    planid: '',
                    setPlanType: function (plid) {
                        this.planid = plid;
                    },
                    getPlanType: function () {
                        return this.planid;
                    },
                    packagesMe: {}
                    ,
                    setPackages: function (packages) {
                        this.packagesMe = packages;
                    },
                    getStripePackages: function (userType) {
                        return this.packagesMe[userType];
//                        var packages = ['service_provider', 'distributor', 'school_college'];
//                        packages['service_provider'] = [{
//                                'free': {
//                                    'plan': 'free',
//                                    'price': '0',
//                                    'title': 'Trendy',
//                                    'des': '',
//                                    'originalprice': '0',
//                                    'discount': '0'
//                                }
//                            },
//                            {
//                                'monthly': {
//                                    'plan': 'monthly',
//                                    'price': '58.2',
//                                    'title': 'Trendy - Booking',
//                                    'des': '',
//                                    'originalprice': '58.2',
//                                    'discount': '0'
//                                },
//                                'annually': {
//                                    'plan': 'annually',
//                                    'price': '488.88',
//                                    'title': 'Trendy - Booking',
//                                    'des': '30% discount at annual subscription',
//                                    'originalprice': '698.4',
//                                    'discount': '209.6'
//                                }
//                            },
//                            {
//                                'monthly': {
//                                    'plan': 'monthly',
//                                    'price': '87.3',
//                                    'title': 'Glamours - Premium',
//                                    'des': '',
//                                    'originalprice': '87.3',
//                                    'discount': '0'
//                                },
//                                'annually': {
//                                    'plan': 'annually',
//                                    'price': '733.6',
//                                    'title': 'Glamours - Premium',
//                                    'des': '30% discount at annual subscription',
//                                    'originalprice': '1047.6',
//                                    'discount': '314'
//                                }
//                            }
//                        ];
//                        packages['distributor'] = [{
//                                'free': {
//                                    'plan': 'free',
//                                    'price': '0',
//                                    'title': 'Trendy',
//                                    'des': '',
//                                    'originalprice': '0',
//                                    'discount': '0'
//                                }
//                            },
//                            {
//                                'monthly': {
//                                    'plan': 'monthly',
//                                    'price': '72.75',
//                                    'title': 'Trendy - Booking',
//                                    'des': 'not implemneted',
//                                    'originalprice': '873',
//                                    'discount': '0'
//                                },
//                                'annually': {
//                                    'plan': 'annually',
//                                    'price': '488.88',
//                                    'title': 'Trendy - Booking',
//                                    'des': 'not implemented',
//                                    'originalprice': '873',
//                                    'discount': '261'
//
//                                }
//                            },
//                            {
//                                'monthly': {
//                                    'plan': 'monthly',
//                                    'price': '72.75',
//                                    'title': 'Glamours - Premium',
//                                    'des': '',
//                                    'originalprice': '72.75',
//                                    'discount': '0'
//                                },
//                                'annually': {
//                                    'plan': 'annually',
//                                    'price': '612',
//                                    'title': 'Glamours - Premium',
//                                    'des': '261',
//                                    'originalprice': '873',
//                                    'discount': '261'
//                                }
//                            }
//                        ];
//                        packages['school_college'] = [{
//                                'free': {
//                                    'plan': 'free',
//                                    'price': '0',
//                                    'title': 'Trendy',
//                                    'des': '',
//                                    'originalprice': '0',
//                                    'discount': '0'
//                                }
//                            },
//                            {
//                                'monthly': {
//                                    'plan': 'monthly',
//                                    'price': '58.2',
//                                    'title': 'Trendy - Booking',
//                                    'des': ''
//                                },
//                                'annually': {
//                                    'plan': 'annually',
//                                    'price': '488.88',
//                                    'title': 'Trendy - Booking',
//                                    'des': '698.4'
//                                }
//                            },
//                            {
//                                'monthly': {
//                                    'plan': 'monthly',
//                                    'price': '72.75',
//                                    'title': 'Glamours - Premium',
//                                    'des': '',
//                                    'originalprice': '72.75',
//                                    'discount': '0'
//                                },
//                                'annually': {
//                                    'plan': 'annually',
//                                    'price': '612',
//                                    'title': 'Glamours - Premium',
//                                    'des': '261',
//                                    'originalprice': '873',
//                                    'discount': '261'
//                                }
//                            }
//                        ];
//                        return packages[userType];
                    }
                };
            });
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.AccountController
     * @module BeautyCollective.Account
     *
     * @description
     * AccountController is responsible manage account activities
     *
     * @author Kinectro
     */

    /* @ngInject */
    function AccountController($state, $location, ResolveData, AccountModel, toaster, Spinner, $scope, checkusersubscription) {
        var self = this;
        self.bookingUrl = function () {



//            var hosturl = $location.host();
//
//            var url = hosturl.replace("app", "booking");
//            var path = $location.path();
//            var protocol = $location.protocol();
//            if (path == "/listing/list/deal") {
//                url = url + '/services';
//            }
//            if (url == 'http://stylerzone.com.au' || url == 'http://www.stylerzone.com.au') {
//                url = 'booking.stylerzone.com.au';
//            }
//            var url = 'http://booking.stylerzone.com.au/calendar';
//            var hosturl = $location.host();
//            console.log(hosturl.split('.'));
//            if (hosturl == 'beautyc.loc') {
//                url = 'http://bcbooking.loc/calendar';
//            } else if (hosturl == 'app.develop.stylerzone.com.au') {
//                url = 'http://booking.develop.stylerzone.com.au/calendar';
//            }
//
            return booking_url;
        }
        self.getWatchListlisting = [];
        /**
         
         **get getWatchListlisting
         
         **/
        function getWatchListlisting() {

            AccountModel.getWatchListlisting().then(function (response) {
                self.getWatchListlisting = angular.copy(response);                
            }, function (error) {
                //Spinner.stop();
            });

        }
        init();
        /**
         * initialize properties
         *
         * @private
         * @return {void}
         */

        function init() {
            self.currentPage = 0;
            self.pageSize = 4;
            self.userRole = ResolveData.user.roles[0].name;
            self.planid = 0;

//            if (ResolveData.user.user_subscription.length > 0) {
//                if (ResolveData.user.user_subscription[0].subscription_user_plan) {
//                    if (ResolveData.user.user_subscription[0].subscription_user_plan.plan_detail_record.length > 0) {
//                        if (ResolveData.user.user_subscription[0].subscription_user_plan.plan_detail_record[0].plan_type == 1 && ResolveData.user.user_subscription[0].subscription_user_plan.plan_detail_record[0].booking_type == 1) {
//                            self.planid = 1;
//                        } else {
//                            self.planid = 2;
//                        }
//                    }
//                }
//            }
            $scope.plainid = self.planid = (ResolveData.user.user_subscription.length > 0) ? ResolveData.user.user_subscription[0].plan_type : '1';
            $scope.plainid = self.planid;
            checkusersubscription.setPlanType(self.planid);
            self.isAustralian = (ResolveData.user.user_info && ResolveData.user.user_info.is_australian == 'yes') ? true : false;
            self.lookingJob = (ResolveData.user.user_info && ResolveData.user.user_info.looking_job == 'yes') ? true : false;
            self.userProfilepic = (ResolveData.user.profilepic) ? ResolveData.user.profilepic.path + ResolveData.user.profilepic.name : 'images/user_pic.jpg';
            getWatchListlisting();
        }

        /**
         *
         * return bussiness faqs
         *
         
         **/

        self.checkstatus = function (roletype, planid, pl = 0) {
            return checkusersubscription.checkstatus(roletype, planid, pl);
        }
        self.showBooking = function (userRole, planid) {
            var returnData = false;
            if (userRole == 'ServiceProvider' || userRole == 'SchoolCollege' || userRole == 'Distributor') {
                if (planid == '1' || planid == '2') {
                    returnData = true;
                }
            }
            var url = $location.host();
            return returnData;
        }

        /**
         * save user looking for job or not
         *
         * @params {flag | {true | false}}
         * @return {void}
         */

        self.lookingWork = function (flag) {
            Spinner.start();
            self.lookingJob = flag;
            AccountModel.updateIndividualInfo({
                'id': ResolveData.user.id
            }, {
                'name': ResolveData.user.name,
                'lookingJob': self.lookingJob,
                'isAustralian': self.isAustralian
            })
                    .then(function (successResponse) {
                        toaster.pop('success', "Detail Save", "Details has been updated.");                        
                        if (successResponse.data) {
                            location.reload();
                        }
                        Spinner.stop();
                    }, function (errorResponse) {
                        console.log('Saving Details:', errorResponse);
                        Spinner.stop();
                    });
        };
        /**
         * save user is australian citizen or not
         *
         * @params {flag | {true | false}}
         * @return {void}
         */

        self.Australian = function (flag) {
            Spinner.start();
            self.isAustralian = flag;
            AccountModel.updateIndividualInfo({
                'id': ResolveData.user.id
            }, {
                'name': ResolveData.user.name,
                'lookingJob': self.lookingJob,
                'isAustralian': self.isAustralian
            })
                    .then(function (successResponse) {
                        toaster.pop('success', "Detail Save", "Details has been updated.");
                        Spinner.stop();
                    }, function (errorResponse) {
                        Spinner.stop();
                    });
        };
        /**
         * change user profile pic
         *
         * @params {images chunks}
         * @return {object}
         */

        self.flowConfig = function () {
            return {
                target: '/uploadprofilepic',
                permanentErrors: [404, 500, 501],
                maxChunkRetries: 1,
                chunkRetryInterval: 5000,
                simultaneousUploads: 1,
                singleFile: true,
                headers: {
                    'X-CSRF-TOKEN': csrf_token
                },
                query: function (flowFile, flowChunk) {
                    // Spinner.start();
                    // function will be called for every request
                    return {
                        id: ResolveData.user.id,
                        source: 'flow_query'
                    };
                }
            }
        };
        /**
         * change profile pic if upload successfully
         *
         * @params {Oject}
         * @return {void}
         */
        self.fileUploadSuccess = function ($file, $res) {
            var obj = JSON.parse($res);
            self.userProfilepic = obj.path + obj.name;
            Spinner.stop();
        };
    }

    AccountController.$inject = ["$state", "$location", "ResolveData", "AccountModel", "toaster", "Spinner", "$scope", "checkusersubscription"];
    //end of controller

    angular
            .module('BeautyCollective.Account')
            .controller('AccountController', AccountController);
})();
(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name GlobalBeautyCollective
     *
     * @module GlobalBeautyCollective
     *
     * @description
     * Configuartion while provider are created
     *
     * @author Kinectro
     */

    angular.module('BeautyCollective.GlobalBeautyCollective', [
        /*
         * Order is not important. Angular makes a
         * pass to register all of the modules listed
         */

        /*
         * Everybody has access to these.
         * We could place these under every feature area,
         * but this is easier to maintain.
         */
        'BeautyCollective.Core',
        'BeautyCollective.Widgets'

    ]).controller('BusinessController', BusinessController);

    function BusinessController($location, moment, toaster, Spinner, $state) {
        var self = this;
        init();
        /**
         * initialize properties
         *
         * @private
         * @return {void}
         */

        function init() {            
        }

        $scope.sendEmail = function () {            
            var email_to = $('#email_to').val();
            var from_email = $('#from_email_business').val();
            var email_message_business = $('#email_message_business').val();
            if (!email_to || !from_email || !email_message_business) {
                return false;
            }

            Spinner.start();
            var data = {
                "email_to": email_to,
                "from_email": from_email,
                "email_message_business": email_message_business
            };
            $.ajax({
                method: "POST",
                url: "/listing/sendEmail",
                data: data
            }).done(function (msg) {
                toaster.pop('success', "Email Sent", "Email has been sent.");
                $('#email_to').val('');
                $('#from_email_business').val('');
                $('#email_message_business').val('');
                $("#businessemail-popup").modal("hide");
                Spinner.stop();
            });
        };
    }

    BusinessController.$inject = ["$location", "moment", "toaster", "Spinner", "$state"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name GlobalBeautyCollective
     *
     * @module GlobalBeautyCollective
     *
     * @description
     * Configuartion while provider are created
     *
     * @author Kinectro
     */

    var myApp = angular.module('Home', []);
    myApp.controller('HomeMainController', function ($scope) {

        $scope.likeGallery = function (user_id, asset_id, ele_id) {
            var resource;
            var data = {
                "user_id": user_id,
                "asset_id": asset_id
            };
            resource = $.ajax({
                method: "POST",
                url: "/addgallerylike",
                data: data
            }).done(function (msg) {
                var data_count = $('#' + ele_id).attr('data-count');
                data_count = parseInt(data_count) + 1;
                $('#' + ele_id).attr('data-count', data_count);
                resource = true;
            });
        };
        $scope.paginateGallery = function () {            
            var offset = Number($('#gallery_offset').val());
            var max_limit = 15;            
            var gallery_json = $('#gallery_data_json').attr('data-attr');
            gallery_json = JSON.parse(gallery_json);
            var html = '';
            var limit = (gallery_json.length > max_limit) ? max_limit : gallery_json.length;
            var next_offset = offset + Number(limit);
            if (offset >= gallery_json.length) {
                window.location.href = '/galleryall';
                return false;
            }
            next_offset = next_offset > gallery_json.length ? gallery_json.length : next_offer;
            $('#gallery_offset').val(next_offset);
            if (offset < gallery_json.length) {
                for (var i = offset; i < next_offset; i++) {

                    var gallery_n = gallery_json[i];
                    html += '<div class="white-panel listing_item r1 c0" style="width: 265px; left: 0px; top: 0px;">\n' +
                            '                            <div class="item_detail">\n' +
                            '                                <div class="gallery-image">\n' +
                            '                                    <figure>\n' +
                            '                                        <img class="img-responsive  center-block" style="width: 100%" src="' + gallery_n.image_path + gallery_n.image_name + '">\n' +
                            '\n' +
                            '                                    </figure>\n' +
                            '\n' +
                            '                                </div>\n' +
                            '                                <div class="image-title">\n' +
                            '                                    <a href="/profile?id=' + gallery_n.user_id + '">' + gallery_n.business.business_name + '</a>\n' +
                            '                                    <ul class="social_links">\n' +
                            '                                        <li>\n' +
                            '                                            <a href="#" socialshare="" socialshare-provider="facebook" socialshare-text="Expert Beauti Solution2" socialshare-via="229619774120606" socialshare-description="Expert Beauti Solution2" socialshare-url="http://beautyc.dev/" socialshare-type="feed" socialshare-media="/assets/usergallery/large/thumb_medium_1509602159_banner-2.jpg">\n' +
                            '                                                <i class="fa fa-facebook" aria-hidden="true"/>\n' +
                            '                                            </a>\n' +
                            '                                        </li>\n' +
                            '                                        <li>\n' +
                            '                                            <a href="#" socialshare="" socialshare-provider="twitter" socialshare-text="Expert Beauti Solution2" socialshare-hashtags="Expert Beauti Solution2" socialshare-url="http://beautyc.dev/">\n' +
                            '                                                <i class="fa fa-tumblr" aria-hidden="true"/>\n' +
                            '                                            </a>\n' +
                            '                                        </li>\n' +
                            '                                    </ul>\n' +
                            '                                </div>\n' +
                            '\n' +
                            '                            </div>\n' +
                            '                        </div>';
                }

                $('#pinBoot').append(html);
            }



        };
    });
})();
(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name GlobalBeautyCollective
     *
     * @module GlobalBeautyCollective
     *
     * @description
     * Configuartion while provider are created
     *
     * @author Kinectro
     */

    // var BusinessNewApp = angular.module('BusinessNew', [
    //     'BeautyCollective.Core',
    //     'BeautyCollective.Widgets'
    //
    // ]);
    //
    // BusinessNewApp.controller('BusinessNewController', BusinessNewController);

    angular.module('BeautyCollective.GlobalBeautyCollective', [
        'BeautyCollective.Core',
        'BeautyCollective.Widgets'

    ]).controller('BusinessNewController', BusinessNewController);

    function BusinessNewController($scope, Spinner, toaster) {

        var self = this;
        $scope.sendEmail = function () {
            console.log('send email called');
            var email_to = $('#email_to').val();
            var from_email = $('#from_email_business').val();
            var email_message_business = $('#email_message_business').val();
            if (!email_to || !from_email || !email_message_business) {
                return false;
            }

            Spinner.start();
            var data = {
                "email_to": email_to,
                "from_email": from_email,
                "email_message_business": email_message_business
            };
            $.ajax({
                method: "POST",
                url: "/listing/sendEmail",
                data: data
            }).done(function (msg) {
                toaster.pop('success', "Email Sent", "Email has been sent.");
                $('#email_to').val('');
                $('#from_email_business').val('');
                $('#email_message_business').val('');
                $("#businessemail-popup").modal("hide");
                Spinner.stop();
            });
        };
        $scope.ReportBusiness = function (type, item_title, item_id) {

            var success = false;
            var data = {
                "type": type,
                "item_title": item_title,
                "item_id": item_id
            };
            Spinner.start();
            var resource;
            resource = $.ajax({
                method: "POST",
                url: "/reportBusiness",
                data: data
            }).done(function (msg) {
                success = true;
            });
            if (resource) {

                toaster.pop('success', "Email Sent", type + " has been reported.");
                Spinner.stop();
            }
        };
    }

    BusinessNewController.$inject = ["$scope", "Spinner", "toaster"];
})();
(function () {
    'use strict';
    angular
            .module('BeautyCollective.Core', [
                /**
                 * @module dynamicLocale
                 *
                 * @description
                 * Module to be able to change the locale at an angularjs application
                 */
                'tmh.dynamicLocale',
                /**
                 * @module ngResource
                 *
                 * @description
                 * The ngResource module provides interaction support with RESTful services via the $resource service.
                 */
                'ngResource',
                /**
                 * @module ui.router
                 *
                 * @description
                 * AngularUI Router is a routing framework, which implements flexible routing with nested views in AngularJS.
                 */
                'ui.router',
                /**
                 * @module ngCookies
                 *
                 * @description
                 * JavaScript plain cookies
                 */
                'ngCookies',
                /**
                 * @module angular-translate
                 *
                 * @description
                 * angular-translate is an AngularJS module that makes your life much easier when
                 * it comes to i18n and l10n including lazy loading and pluralization.
                 */
                'pascalprecht.translate',
                /**
                 * @module ui.bootstrap
                 *
                 * @description
                 * Twitter bootstrap ui componenets
                 */
                'ui.bootstrap',
                /**
                 * @module logger
                 *
                 * @description
                 * console anything which is need to debug
                 */
                'logger',
                /**
                 * @module angularMoment
                 *
                 * @description
                 * Parse, validate, manipulate, and display dates in JavaScript.
                 */
                'angularMoment',
                /**
                 * @module ngCacheBuster
                 *
                 * @description
                 * For http request caching
                 */
                'ngCacheBuster',
                /**
                 * @module ngSanitize
                 *
                 * @description
                 * The ngSanitize module provides functionality to sanitize HTML.
                 */
                'ngSanitize',
                'toaster',
                'ui.select',
                'BeautyCollective.bLaravel',
                'uiGmapgoogle-maps',
                'slick',
                'simplePagination',
                '720kb.socialshare',
                'angularSpinner',
                'infinite-scroll',
                'jkuri.slimscroll',
                'blockUI',
                'ui.utils',
                'angularPayments',
                'rzSlider'
            ]);
    //angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 1000);
})();
(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Core.Config
     * @module BeautyCollective.Core
     *
     * @description
     * Core module state configurations
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Core')
            .config(coreStateConfig);
    /* @ngInject */
    function coreStateConfig($stateProvider, $urlRouterProvider, APP_CONFIG, $locationProvider) {

    }

    coreStateConfig.$inject = ["$stateProvider", "$urlRouterProvider", "APP_CONFIG", "$locationProvider"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Directive.ngSpinnerBar
     * @module BeautyCollective.Core
     *
     * @description
     * Directive commands spinner show and hide based on state change events
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Core')
            .directive('ngSpinnerBar', NgSpinnerDirective);
    /* @ngInject */
    function NgSpinnerDirective($rootScope, $timeout) {
        return {
            link: function (scope, element, attrs) {
                // by defult hide the spinner bar
                $rootScope.loadingSpinner = false;
                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                    $rootScope.loadingSpinner = false;
                });
                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function () {
                    $rootScope.loadingSpinner = false;
                    angular.element('body').removeClass('page-on-load'); // remove page loading indicator
                });
                // handle errors
                $rootScope.$on('$stateNotFound', function (error) {
                    $rootScope.loadingSpinner = false;
                    console.log(error);
                });
                // handle errors
                $rootScope.$on('$stateChangeError', function () {
                    $rootScope.loadingSpinner = false;
                });
                $rootScope.$on('$stateChangeCancel', function () {
                    $rootScope.loadingSpinner = false;
                });
            }
        };
    }

    NgSpinnerDirective.$inject = ["$rootScope", "$timeout"];
    /**
     * @ngdoc Service
     * @name BeautyCollective.Service.Spinner
     * @module BeautyCollective.Core
     *
     * @description
     * Spinner service is used to hide/show spinning loader
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Core')
            .factory('Spinner', SpinnerService);
    /* @ngInject */
    function SpinnerService($rootScope) {
        /**
         * Spinner class
         */
        function Spinner() {}

        /**
         * Method to show shipper
         * @return void
         */
        Spinner.prototype.show = function () {
            $rootScope.loadingSpinner = true;
        };
        /**
         * Method to Hide spinner
         * @return void
         */
        Spinner.prototype.hide = function () {
            $rootScope.loadingSpinner = false;
        };
        return new Spinner();
    }

    SpinnerService.$inject = ["$rootScope"];
    /**
     * @ngdoc ngEnter
     * @name BeautyCollective.Service.enter
     * @module BeautyCollective.Core
     *
     * @description
     *
     *
     * @author Kinectro
     */

    angular
            .module('BeautyCollective.Core')
            .directive('ngEnter', function () {
                return function (scope, element, attrs) {
                    element.bind("keydown keypress", function (event) {
                        if (event.which === 13) {
                            scope.$apply(function () {
                                scope.$eval(attrs.ngEnter);
                            });
                            event.preventDefault();
                        }
                    });
                };
            });
})();
(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Core.Constant.ENV
     * @module BeautyCollective.Core
     *
     * @description
     * Holds envoirment related properties
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Core')
            .constant('ENV', 'dev');
    angular
            .module('BeautyCollective.Core')
            .constant('CSRF_TOKEN', csrf_token);
    /**
     * @ngdoc overview
     * @name BeautyCollective.Core.Constant.APP_CONFIG
     * @module BeautyCollective.Core
     *
     * @description
     * Contains all static urls and configuration constants which are used in whole application
     *
     * If anything need to access in view(HTML) files then keep everything in view
     * and can be accessed by {{VIEW_CONFIG.assets}}
     */
    angular
            .module('BeautyCollective.Core')
            .constant('APP_CONFIG', {
                modules: '/apps/modules',
                components: '/apps/components',
                widgets: '/apps/widgets',
                sessionTimeout: 1800,
                notificationInterval: 60000,
                endPoint: '',
                GOOGLE: {
                    MAP: {
                        KEY: 'AIzaSyCG6A6caq5LlVwI0k5MpfY02SHrJJKsO78'
                    },
                    CAPTCHA: {
                        SITE_KEY: '6LcR3gwTAAAAAEOPDjscoyuJKKKvFgFDYfZPNbnM',
                        SECRET_KEY: '6LcR3gwTAAAAAGwxaYHRpqVs_OwUK6gAOJyH1y0Q',
                        ENABLE: true
                    }
                },
                item_per_page: 5,
            });
    /**
     * Angular moment configuration
     */
    angular
            .module('BeautyCollective.Core').constant('angularMomentConfig', {
        timezone: 'Asia/kolkata'
    });
})();
(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Core.Config
     * @module BeautyCollective.Core
     *
     * @description
     * Configuartion while provider are created
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Core')
            .config(CoreConfiguration);
    /* @ngInject */
    function CoreConfiguration($interpolateProvider, $httpProvider, $translateProvider, tmhDynamicLocaleProvider, LoggerProvider, httpRequestInterceptorCacheBusterProvider, APP_CONFIG, $provide, ENV, uiGmapGoogleMapApiProvider,
            usSpinnerConfigProvider, blockUIConfig) {
        $interpolateProvider.startSymbol('<%');
        $interpolateProvider.endSymbol('%>');
        //Cache everything except rest api requests
        httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*api.*/, /.*protected.*/, /.*registeraccount.*/], true);
        $httpProvider.interceptors.push('XSRFInterceptor');
        $httpProvider.interceptors.push('errorHandlerInterceptor');
        $httpProvider.interceptors.push('notificationInterceptor');
        // Initialize angular-translate
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'resources/i18n/{lang}/{part}.json'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useCookieStorage();
        tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
        tmhDynamicLocaleProvider.useCookieStorage('NG_TRANSLATE_LANG_KEY');
        if (ENV === 'production') {
            $compileProvider.debugInfoEnabled(false);
        }

        uiGmapGoogleMapApiProvider.configure({
            key: APP_CONFIG.GOOGLE.MAP.KEY,
            v: '3.20', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization'
        });
        usSpinnerConfigProvider.setTheme('global', {
            lines: 13,
            length: 6,
            width: 3,
            radius: 10,
            scale: 1,
            corners: 1,
            color: '#fff',
            opacity: 0.25,
            rotate: 23,
            direction: 1,
            speed: 1.1,
            trail: 68,
            fps: 20,
            zIndex: 2e9,
            className: 'spinner',
            top: '47%',
            left: '50%',
            shadow: true,
            hwaccel: true,
            position: 'fixed'
        });
        usSpinnerConfigProvider.setTheme('inline', {
            lines: 13,
            length: 6,
            width: 4,
            radius: 10,
            scale: 1,
            corners: 1,
            color: '#fff',
            opacity: 0.25,
            rotate: 23,
            direction: 1,
            speed: 1.1,
            trail: 68,
            fps: 20,
            zIndex: 2e9,
            className: 'spinner',
            top: '47%',
            left: '50%',
            shadow: true,
            hwaccel: true,
            position: 'fixed'
        });
        /**
         * Block UI configuration
         */
        blockUIConfig.templateUrl = '/apps/components/partials/regular-spinner.html';
        blockUIConfig.message = 'Please wait';
        blockUIConfig.delay = 0;
        blockUIConfig.autoBlock = false;
        // console.log('i am here');

    }

    CoreConfiguration.$inject = ["$interpolateProvider", "$httpProvider", "$translateProvider", "tmhDynamicLocaleProvider", "LoggerProvider", "httpRequestInterceptorCacheBusterProvider", "APP_CONFIG", "$provide", "ENV", "uiGmapGoogleMapApiProvider", "usSpinnerConfigProvider", "blockUIConfig"];
    /**
     * @ngdoc overview
     * @name BeautyCollective.Core.Run
     * @module BeautyCollective.Core
     *
     * @description
     * Core module configuration in run block
     * Handle state change event
     * Check Authentication before state get change
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Core')
            .run([
                '$rootScope',
                '$window',
                '$state',
                '$translate',
                'Language',
                'ENV',
                'APP_CONFIG',
                'Spinner',
                function ($rootScope, $window, $state, $translate, Language, ENV, APP_CONFIG, Spinner) {
                    /**
                     * Keep application configuration in rootScope
                     */
                    $rootScope.VIEW_CONFIG = APP_CONFIG.view;
                    /**
                     * Set global information to $rootScope
                     */
                    $rootScope.ENV = ENV;
                    /**
                     * Capture $stateChangeStart event on $rootScope
                     * Authenticate user
                     * Detect current language
                     */
                    $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
                        $rootScope.toState = toState;
                        $rootScope.toStateParams = toStateParams;
                        Spinner.start();
                        /**
                         * Update current lanaguage
                         */
                        Language.getCurrent().then(function (language) {
                            $translate.use(language);
                        });
                    });
                    /**
                     * Capture $stateChangeSuccess event on $rootScope
                     * Set page title
                     */
                    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

                        Spinner.stop();
                        var titleKey = 'global.title';
                        //Set page class
                        $rootScope.$state = $state;
                        $rootScope.previousStateName = fromState.name;
                        $rootScope.previousStateParams = fromParams;
                        $translate(titleKey).then(function (title) {
                            // Change window title with translated one
                            $rootScope.title = title;
                        });
                    });
                }
            ]);
    angular
            .module('BeautyCollective.Core').factory('XSRFInterceptor', ['utilFactory', function (utilFactory) {
            var XSRFInterceptor = {
                request: function (config) {
                    var token = utilFactory.readCookie('XSRF-TOKEN');
                    if (token) {
                        config.headers['X-XSRF-TOKEN'] = token;
                    }
                    return config;
                }
            };
            return XSRFInterceptor;
        }]);
    /**
     * override spinner methods
     */
    angular
            .module('BeautyCollective.Core').factory('Spinner', ['usSpinnerService', function (usSpinnerService) {
            var Spinner = {
                start: function (spinnerId) {
                    if (spinnerId == "global_spinner_ab") {
                        spinnerId ? usSpinnerService.spin(spinnerId) : usSpinnerService.spin('global_spinner');
                    } else {
                        angular.element('.spinner_overlay').addClass("displayme")
                    }
                },
                stop: function (spinnerId) {
                    if (spinnerId == "global_spinner_ab") {
                        spinnerId ? usSpinnerService.stop(spinnerId) : usSpinnerService.stop('global_spinner');
                    } else {
                        angular.element('.spinner_overlay').removeClass("displayme");
                    }
                }
            };
            return Spinner;
        }]);
})();
(function () {
    'use strict';
    /*global angular: false */

    angular.module('BeautyCollective.Widgets', ['BeautyCollective.Core', 'BeautyCollective.Suburbs', 'BeautyCollective.Components.Directvies', 'BeautyCollective.Account', 'flow']);
    angular.module('BeautyCollective.Widgets').config(['flowFactoryProvider', 'CSRF_TOKEN', function (flowFactoryProvider, CSRF_TOKEN) {
            // Can be used with different implementations of Flow.js
            // flowFactoryProvider.factory = fustyFlowFactory;
        }]);

    angular.module('BeautyCollective.Widgets').run(function ($rootScope) {
        $rootScope.base64_encode = function (value) {
            return btoa(value);
        };
        $rootScope.base64_decode = function (value) {
            return atob(value);
        };
    });

}());
(function () {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Widgets.Factory.ShortlistjobResource
     * @module BeautyCollective.Widgets
     *
     * @description
     * Implements CURD operations
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .factory('ShortlistjobResource', ShortlistjobResource);
    /* @ngInject */
    function ShortlistjobResource($resource, APP_CONFIG) {
        /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
        return $resource('../shortlistjob', {}, {
            ShortlistJob: {
                method: 'POST'
            }
        });
    }

    ShortlistjobResource.$inject = ["$resource", "APP_CONFIG"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Widgets.Service.ShortlistjobModel
     * @module BeautyCollective.Widgets
     *
     * @description
     *
     * Data model for Booking module
     * Implemenets CURD operation
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .service('ShortlistjobModel', ShortlistjobModel);
    /* @ngInject */
    function ShortlistjobModel(ShortlistjobResource) {
        var model = this;
        /**
         * [Shortlistjob description]
         * @method Shortlistjob
         * @author Kinectro
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */

        model.ShortlistJob = function (params, success, fail) {
            return ShortlistjobResource.ShortlistJob(params, success, fail).$promise;
        };
    }

    ShortlistjobModel.$inject = ["ShortlistjobResource"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.ShortlistjobController
     * @module BeautyCollective.Widgets
     *
     * @description
     * ShortlistjobController is responsible for booking appointments
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .controller('ShortlistjobController', ShortlistjobController);
    /* @ngInject */

    function ShortlistjobController($sanitize, $q, Logger, Spinner, ShortlistjobModel, toaster) {

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
            Logger.getInstance('ShortlistjobController').info('Shortlistjob Controller has initialized');
        }


        self.shortlistJob = function () {
            ShortlistjobModel.ShortlistJob({}, {
                id: self.id
            }).then(function (responce) {
                if (responce.status) {
                    toaster.pop('success', "Job Saved", responce.message);
                } else {
                    toaster.pop('error', "Job Already Saved", responce.message);
                }
            }, function () {});
        };
    }

    ShortlistjobController.$inject = ["$sanitize", "$q", "Logger", "Spinner", "ShortlistjobModel", "toaster"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.shortlistJob
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .directive('shortlistJob', [function () {
                    return {
                        restrict: 'EA',
                        scope: {
                            "id": "@id"
                        },
                        templateUrl: '/apps/widgets/shortlist-job/shortlistjob.html',
                        controller: 'ShortlistjobController',
                        controllerAs: 'self',
                        bindToController: true, //required in 1.3+ with controllerAs
                        link: function (scope, element, iAttrs, ngModel) {}
                    };
                }]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Widgets.Factory.AddtowatchResource
     * @module BeautyCollective.Widgets
     *
     * @description
     * Implements CURD operations
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .factory('AddtowatchResource', AddtowatchResource);
    /* @ngInject */
    function AddtowatchResource($resource, APP_CONFIG) {
        /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
        return $resource('../addtowatchlist', {}, {
            AddtowatchList: {
                method: 'POST'
            }
        });
    }

    AddtowatchResource.$inject = ["$resource", "APP_CONFIG"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Widgets.Service.AddtowatchModel
     * @module BeautyCollective.Widgets
     *
     * @description
     *
     * Data model for Booking module
     * Implemenets CURD operation
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .service('AddtowatchModel', AddtowatchModel);
    /* @ngInject */
    function AddtowatchModel(AddtowatchResource) {
        var model = this;
        /**
         * [AddtowatchList description]
         * @method AddtowatchList
         * @author Kinectro
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */

        model.AddtowatchList = function (params, success, fail) {
            return AddtowatchResource.AddtowatchList(params, success, fail).$promise;
        };
    }

    AddtowatchModel.$inject = ["AddtowatchResource"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.AddtowatchController
     * @module BeautyCollective.Widgets
     *
     * @description
     * AddtowatchController is responsible for booking appointments
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .controller('AddtowatchController', AddtowatchController);
    /* @ngInject */

    function AddtowatchController($sanitize, $q, Logger, Spinner, AddtowatchModel, toaster) {

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
            //Logger.getInstance('ShortlistjobController').info('AddtowatchList Controller has initialized');
        }


        self.AddtowatchList = function () {
            Spinner.start();
            if (self.type == 'Job Seeker') {
                self.watchtype = 'Job Seeker';
            } else {
                self.watchtype = 'listing';
            }
            AddtowatchModel.AddtowatchList({}, {
                id: self.id,
                watchtype: self.watchtype
            }).then(function (responce) {
                if (responce.status == 1) {
                    toaster.pop('success', self.type + " Saved", responce.message);
                } else if (responce.status == 0) {
                    toaster.pop('error', self.type + " Already Saved", responce.message);
                } else if (angular.isUndefined(responce.status)) {
                    toaster.pop('error', "Authentication Issue", "Please Login.");
                }
                Spinner.stop();
            }, function () {
                Spinner.stop();
            });
        };
    }

    AddtowatchController.$inject = ["$sanitize", "$q", "Logger", "Spinner", "AddtowatchModel", "toaster"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.addtoWatch
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement add to watch list
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .directive('addtoWatch', [function () {
                    return {
                        restrict: 'EA',
                        scope: {
                            "id": "@id",
                            "type": "@type"
                        },
                        templateUrl: '/apps/widgets/watch/watch.html',
                        controller: 'AddtowatchController',
                        controllerAs: 'self',
                        bindToController: true, //required in 1.3+ with controllerAs
                        link: function (scope, element, iAttrs, ngModel) {}
                    };
                }]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Account.Factory.CategoriesResource
     * @module BeautyCollective.Account
     *
     * @description
     * Implements CURD operations
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Account')
            .factory('CategoriesResource', CategoriesResource);
    /* @ngInject */
    function CategoriesResource($resource, APP_CONFIG) {
        /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
        return $resource('categories/:type', {
            type: '@types'
        }, {
            find: {
                method: 'GET',
                isArray: true,
                params: {
                    id: '@id',
                }
            },
            create: {
                method: 'POST',
                url: 'jobs/save',
                params: {}
            },
            update: {
                method: 'PUT',
                params: {
                    id: '@id'
                }
            },
            findAllByType: {
                method: 'GET',
                isArray: true
            },
            query: {
                method: 'GET',
                transformResponse: transformQueryResponse
            },
            subcategories: {
                method: 'GET',
                transformResponse: transformQueryResponse,
                url: 'subcategoriesbytype'
            },
            searchcategories: {
                url: 'serviceprovidercategories',
                method: 'GET',
                transformResponse: transformQueryResponse
            },
            getAllServices: {
                url: 'getAllServices',
                method: 'GET',
                transformResponse: transformQueryResponse
            },
            getAllCourses: {
                url: 'getAllCourses',
                method: 'GET',
                transformResponse: transformQueryResponse
            }




        });
    }

    CategoriesResource.$inject = ["$resource", "APP_CONFIG"];

    function transformQueryResponse(data, headersGetter) {
        var _response = {};
        _response.list = angular.fromJson(data);
        return angular.fromJson(_response);
    }

})();
(function () {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Account.Service.CategoriesModel
     * @module BeautyCollective.Account
     *
     * @description
     *
     * Data model for Categories
     * Implemenets CURD operation
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Account')
            .service('CategoriesModel', CategoriesModel);
    /* @ngInject */
    function CategoriesModel(CategoriesResource) {
        var model = this;
        /**
         * [categories list]
         * @True {Array}
         */
        model.categories = [];
        model.subCategories = [];
        model.categoryTypes = [];
        /**
         * Get Listing
         * @param id id
         * @return list
         */
        model.get = function (id) {
            return CategoriesResource.find(id).$promise;
        };
        /**
         * [all description]
         * @method all
         * @author Kinectro
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
        model.all = function (params, success, fail) {
            return CategoriesResource.query(params, success, fail).$promise;
        };
        /**
         * [all description]
         * @method all
         * @author Kinectro
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
        model.subcategories = function (params, success, fail) {
            return CategoriesResource.subcategories(params, success, fail).$promise;
        };
        /**
         * [search categories]
         * @method all
         * @author Kinectro
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
        model.searchcategories = function (params, success, fail) {
            return CategoriesResource.searchcategories(params, success, fail).$promise;
        };
        model.getAllServices = function () {
            return CategoriesResource.getAllServices().$promise;
        }

        model.getAllCourses = function () {
            return CategoriesResource.getAllCourses().$promise;
        }

    }

    CategoriesModel.$inject = ["CategoriesResource"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.widgetEmail
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to send email to individual users
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .directive('widgetEmail', [function () {
                    return {
                        restrict: 'EA',
                        scope: {
                            "id": "@id",
                            "userto": "@userto",
                            "userfrom": "@userfrom"
                        },
                        templateUrl: '/apps/widgets/email/email.html',
                        controller: 'EmailController',
                        controllerAs: 'self',
                        bindToController: true, //required in 1.3+ with controllerAs
                        link: function (scope, element, iAttrs, ngModel) {}
                    };
                }]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Widgets.Factory.EmailResource
     * @module BeautyCollective.Widgets
     *
     * @description
     * Implements CURD operations
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .factory('EmailResource', EmailResource);
    /* @ngInject */
    function EmailResource($resource, APP_CONFIG) {
        /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
        return $resource('sendemail', {}, {
            sendMail: {
                method: 'POST'
            }
        });
    }

    EmailResource.$inject = ["$resource", "APP_CONFIG"];

    function transformQueryResponse(data, headersGetter) {
        var _response = {};
        _response.list = angular.fromJson(data);
        return angular.fromJson(_response);
    }

})();
(function () {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Widgets.Service.EmailModel
     * @module BeautyCollective.Widgets
     *
     * @description
     *
     * Data model for jobtask module
     * Implemenets CURD operation
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .service('EmailModel', EmailModel);
    /* @ngInject */
    function EmailModel(EmailResource) {
        var model = this;
        /**
         * Send email to user
         * @param message message
         * @return message send
         */
        model.sendMail = function (message) {
            return EmailResource.sendMail(message).$promise;
        };
    }

    EmailModel.$inject = ["EmailResource"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.EmailController
     * @module BeautyCollective.Widgets
     *
     * @description
     * EmailController is responsible for send email to individual user
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .controller('EmailController', EmailController);
    /* @ngInject */

    function EmailController($sanitize, $q, Logger, Spinner, EmailModel, toaster) {

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
            Logger.getInstance('EmailController').info('Email Controller has initialized');
        }


        /**
         * Save Review
         * @params {Object}
         * @return {id}
         */

        self.sendEmail = function () {
            var _message = angular.copy(self.message);
            Spinner.start();
            EmailModel.sendMail({
                'message': _message,
                'to_user': self.userto,
                'from_user': self.userfrom,
            }).then(function (responce) {
                toaster.pop('success', "Message Sent", "Your message has been Sent successfully.");
                self.message = '';
                Spinner.stop();
            }, function (error) {
                self.message = '';
                Spinner.stop();
            });
        };
    }

    EmailController.$inject = ["$sanitize", "$q", "Logger", "Spinner", "EmailModel", "toaster"];
})();
'use strict';
angular
        .module('BeautyCollective.Widgets')
        .directive('timeline', function () {
            return {
                templateUrl: 'widgets/timeline/timeline.html',
                restrict: 'E',
                replace: true,
            };
        });
(function () {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Widgets.Factory.RatingResource
     * @module BeautyCollective.Widgets
     *
     * @description
     * Implements CURD operations
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .factory('RatingResource', RatingResource);
    /* @ngInject */
    function RatingResource($resource, APP_CONFIG) {
        /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
        return $resource('../rating', {
            requestType: '@requestType'
        }, {
            saveRating: {
                method: 'POST'
            },
            save: {
                url: 'review',
                method: 'POST'
            }
        });
    }

    RatingResource.$inject = ["$resource", "APP_CONFIG"];

    function transformQueryResponse(data, headersGetter) {
        var _response = {};
        _response.list = angular.fromJson(data);
        return angular.fromJson(_response);
    }

})();
(function () {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Widgets.RatingModel
     * @module BeautyCollective.Widgets
     *
     * @description
     *
     * Data model for jobtask module
     * Implemenets CURD operation
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .service('RatingModel', RatingModel);
    /* @ngInject */
    function RatingModel(RatingResource) {
        var model = this;
        /**
         * [saveRating description]
         * @method findAl
         * @author Kinectro
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */

        model.saveRating = function (params, success, fail) {
            return RatingResource.saveRating(params, success, fail).$promise;
        };
        /**
         * Create a new Review
         * @param Review Review
         * @return Review saved
         */
        model.save = function (review) {
            return RatingResource.save(review).$promise;
        };
    }

    RatingModel.$inject = ["RatingResource"];
})();
(function () {
    'use strict';
    angular
            .module('BeautyCollective.Widgets')
            .service('userAuthentication', userAuthentication);

    function userAuthentication($http, $cookies, $rootScope, $timeout) {
        var service = {};
        service.checkstatus = checkstatus;
        return service;

        function checkstatus() {
            return $http.get('/check/auth').then(function (response) {
                return response.data;
            }, function () {
                console.log('Error getting all users')
            });
        }

    }
    userAuthentication.$inject = ['$http', '$cookies', '$rootScope', '$timeout'];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.RatingController
     * @module BeautyCollective.Widgets
     *
     * @description
     * RatingController is responsible for user rating
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .controller('RatingController', RatingController);
    /* @ngInject */

    function RatingController($sanitize, $q, Logger, Spinner, RatingModel, toaster, userAuthentication) {

        /**
         * [self description]
         * @type {[type]}
         */
        var self = this;
        self.authstatus = 0;
        self.approxprice = 0;
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
            self.anonymously = '0';
            if (self.userfrom || self.userfrom !== self.userto)
                self.isReadonly = false;
            self.authinfo = userAuthentication.checkstatus().then(function (data) {
                if (!angular.isUndefined(data[0]) && data[0] != '!210') {
                    self.authstatus = 1;
                    self.first_name = data[2];
                    self.last_name = data[3];
                }
                return data;
            });
        }
        self.checkbusinessfield = function () {            
            if (self.businessname.length > 0 && parseInt(self.userto) > 0) {
                var element = angular.element('#business-rating');
                element.modal('show');
            } else {
                toaster.pop('error', "Business Name", "Please select the value from dropdown list");
            }
        }


        self.hoveringOver = function (value) {
            self.overStar = value;
            self.percent = 100 * (value / self.max);
        };
        self.ratingStates = [{
                stateOn: 'glyphicon-ok-sign',
                stateOff: 'glyphicon-ok-circle'
            },
            {
                stateOn: 'glyphicon-star',
                stateOff: 'glyphicon-star-empty'
            },
            {
                stateOn: 'glyphicon-heart',
                stateOff: 'glyphicon-ban-circle'
            },
            {
                stateOn: 'glyphicon-heart'
            },
            {
                stateOff: 'glyphicon-off'
            }
        ];
        self.saveRating = function () {
            if (!self.userfrom)
                return false;
            RatingModel.saveRating({
                'rate': self.rate,
                'requestType': "save",
                'to': self.userto
            }).then(function (responce) {
                self.rate = responce.rating;
            }, function (error) {

            });
        };
        /**
         * Save Review
         * @params {Object}
         * @return {id}
         */

        self.saveReview = function () {
            var _review = angular.copy(self.review);
            var first_name = self.first_name;
            var last_name = self.last_name;
            var email = $('#rating_email').val();
            var approxprice = self.approxprice;
            Spinner.start();
            RatingModel.save({
                'review': _review,
                'rate': self.rate,
                'to_user': (self.userto.length > 0) ? self.userto : $("widget-rating-home").attr("userto"),
                'approx_price': self.approx_price,
                'anonymously': self.anonymously,
                'from_user': self.userfrom,
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'approx_price': approxprice

            }).then(function (responce) {
                if (responce.status && responce.status == 'Already Review') {
                    toaster.pop('error', "Already Reviewed", "You have already review this user.");
                } else {
                    toaster.pop('success', "Review Saved", "Review has been saved successfully.");
                }
                self.review = '';
                self.approx_price = '';
                self.rate = 0;
                self.anonymously = "0";
                self.userfrom = 0;
                self.first_name = '';
                self.last_name = '';
                self.email = '';
                $('#rating_first_name').val('');
                $('#rating_last_name').val('');
                $('#rating_email').val('');
                Spinner.stop();
            }, function (error) {
                toaster.pop('error', "Error", error.data.message);
                Spinner.stop();
            });
        };
    }

    RatingController.$inject = ["$sanitize", "$q", "Logger", "Spinner", "RatingModel", "toaster", "userAuthentication"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.widgetLogin
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .directive('widgetRating', [function () {
                    return {
                        restrict: 'EA',
                        scope: {
                            "id": "@id",
                            "userto": "@userto",
                            "userfrom": "@userfrom",
                            "businesstitle": "@businesstitle"
                        },
                        templateUrl: '/apps/widgets/rating/rating.html',
                        controller: 'RatingController',
                        controllerAs: 'self',
                        bindToController: true, //required in 1.3+ with controllerAs
                        link: function (scope, element, iAttrs, ngModel) {}
                    };
                }]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.widgetLogin
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .directive('widgetRatingHome', [function () {
                    return {
                        restrict: 'EA',
                        scope: {
                            "id": "@id",
                            "userto": "@userto",
                            "userfrom": "@userfrom",
                            "businessname": "@businessname"
                        },
                        templateUrl: main_url + '/apps/widgets/rating/rating_home.html',
                        controller: 'RatingController',
                        controllerAs: 'self',
                        bindToController: true, //required in 1.3+ with controllerAs
                        link: function (scope, element, iAttrs, ngModel) {}
                    };
                }]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.RatingController
     * @module BeautyCollective.Widgets
     *
     * @description
     * RatingController is responsible for user rating
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .controller('ReviewDetailController', ReviewDetailController);
    /* @ngInject */

    function ReviewDetailController($scope, $sanitize, $q, Logger, Spinner, RatingModel, toaster) {

        /**
         * [self description]
         * @type {[type]}
         */
        var self = this;
        self.review = 'tahir';
        init();
        /**
         * [init description]
         * @return {void}
         */
        function init() {
            Logger.getInstance('ReviewDetailController').info('ReviewDetailController has initialized');
            self.id = 0;
        }

        self.ReviewDetail = function () {
            var review_selected_id = $('#review_selected_id').val();
            if (review_selected_id == 0)
                return false;
            Spinner.start();
            var data = {
                "is_api": true
            };
            $.ajax({
                method: "get",
                url: "/review_detail/" + review_selected_id,
                data: data
            }).done(function (results) {
                self.review = results;
                $scope.review = results;
                $scope.$apply();
                Spinner.stop();
            });
        }

    }

    ReviewDetailController.$inject = ["$scope", "$sanitize", "$q", "Logger", "Spinner", "RatingModel", "toaster"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Widgets.Factory.SearchResultResource
     * @module BeautyCollective.Widgets
     *
     * @description
     * Implements CURD operations
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .factory('SearchResultResource', SearchResultResource);
    /* @ngInject */
    function SearchResultResource($resource, APP_CONFIG) {
        return $resource('getrecords', {}, {
            findAll: {
                method: 'GET'
            }
        });
    }

    SearchResultResource.$inject = ["$resource", "APP_CONFIG"];

    function transformQueryResponse(data, headersGetter) {
        var _response = {};
        _response.list = angular.fromJson(data);
        return angular.fromJson(_response);
    }

})();
(function () {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Widgets.Service.SearchResultModel
     * @module BeautyCollective.Widgets
     *
     * @description
     *
     * Data model for jobtask module
     * Implemenets CURD operation
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .service('SearchResultModel', SearchResultModel);
    /* @ngInject */
    function SearchResultModel(SearchResultResource) {
        var model = this;
        /**
         * [jobList description]
         * @True {Array}
         */
        model.searchList = [];
        /**
         * [findAll description]
         * @method findAl
         * @author Kinectro
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */

        model.findAll = function (params, success, fail) {
            return SearchResultResource.findAll(params, success, fail).$promise;
        };
    }

    SearchResultModel.$inject = ["SearchResultResource"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.ListingByCatController
     * @module BeautyCollective.Widgets
     *
     * @description
     * ListingByCatController is responsible for listings
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .controller('ListingByCatController', ListingByCatController);
    /* @ngInject */

    function ListingByCatController($scope, $q, Logger, Spinner, $location, moment, CategoriesModel, SuburbsModel) {

        /**
         * [self description]
         * @type {[type]}
         */

        $scope.listing = [];
        var self = this;
        self.busy = false;
        self.page = 1;
        init();
        self.nextPage = function () {
            getRecords();
        };
        /**
         * [init description]
         * @return {void}
         */
        function init() {
            Logger.getInstance('ListingByCatController').info('ListingByCatController has initialized');
            self.qs = getQueryStrings();            
            self.qs.page = 0;
            getRecords();
        }

        function getRecords() {
            Spinner.start();
            self.busy = true;
            self.qs.page += 1;
            var type = self.qs.type;
            if (self.qs.p_id) {
                var data = {
                    'type': type,
                    'page': self.qs.page,
                    'is_api': true,
                    'p_id': self.qs.p_id
                };
            } else {
                var data = {
                    'type': type,
                    'page': self.qs.page,
                    'is_api': true
                };
            }


            var resource;
            $.ajax({
                method: "get",
                url: "/listingbycat",
                data: data
            }).done(function (results) {
                $scope.results = results;
                self.busy = false;                
                for (var i = 0; i < results.data.length; i++) {
                    $scope.listing.push(results.data[i]);
                }

                $scope.$apply();
                if (results.data.length > 0) {
                    getRecords();
                } else {
                    Spinner.stop();
                }
            });
        }


        function getQueryStrings() {
            var assoc = {};
            var decode = function (s) {
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

        function setSelecteTabs(searchFor) {
            var searchFor = searchFor.split(',');
            _.each(searchFor, function (item, index) {
                _.each(self.tabs, function (tab, index) {
                    if (item == tab.id) {
                        self.tabs[index].active = true;
                        self.selectedTabs.push(tab);
                    }
                });
            });
        }


    }

    ListingByCatController.$inject = ["$scope", "$q", "Logger", "Spinner", "$location", "moment", "CategoriesModel", "SuburbsModel"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.GalleryController
     * @module BeautyCollective.Widgets
     *
     * @description
     * GalleryController is responsible for listings
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .controller('GalleryController', GalleryController);
    /* @ngInject */

    function GalleryController($scope, $q, Logger, Spinner, $location, moment, CategoriesModel, SuburbsModel) {

        /**
         * [self description]
         * @type {[type]}
         */

        $scope.records = [];
        var self = this;
        self.busy = false;
        self.page = 1;
        self.showgallery = 0;
        init();
        self.nextPage = function () {
            getRecords();
        };
        /**
         * [init description]
         * @return {void}
         */
        function init() {
            Logger.getInstance('GalleryController').info('GalleryController has initialized');
            self.qs = getQueryStrings();
            self.qs.page = 0;
            getRecords();
        }
        self.showspinner = function () {
            Spinner.start('global_spinner_ab');
        }
        self.stopspinner = function () {
            Spinner.stop('global_spinner_ab');
        }
        function getRecords() {
            Spinner.start('global_spinner_ab');
            self.busy = true;
            self.qs.page += 1;
            var type = self.qs.type;
            var data = {
                'page': self.qs.page,
                'is_api': true
            };
            var resource;
            $.ajax({
                method: "get",
                url: "/galleryall",
                data: data
            }).done(function (results) {
                if (results.data.length > 0) {

                    for (var i = 0; i < results.data.length; i++) {

                        if (typeof results.data[i].images !== "undefined") {
                            for (var j = 0; j < results.data[i].images.length; j++) {
                                $scope.records.push(results.data[i].images[j]);
                            }
                        }
                    }
                    self.busy = false;
                }
                self.showgallery = 1;
                $scope.$apply();
                Spinner.stop('global_spinner_ab');
                //                $('#pinBootnew').pinterest_grid({
                //                        no_columns: 4,
                //                        padding_x: 10,
                //                        padding_y: 10,
                //                        margin_bottom: 100,
                //                        single_column_breakpoint: 700
                //                    });
            });
        }


        function getQueryStrings() {
            var assoc = {};
            var decode = function (s) {
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

        function setSelecteTabs(searchFor) {
            var searchFor = searchFor.split(',');
            _.each(searchFor, function (item, index) {
                _.each(self.tabs, function (tab, index) {
                    if (item == tab.id) {
                        self.tabs[index].active = true;
                        self.selectedTabs.push(tab);
                    }
                });
            });
        }

        $scope.likeGallery = function (user_id, asset_id, ele_id) {
            var resource;
            var data = {
                "user_id": user_id,
                "asset_id": asset_id
            };
            resource = $.ajax({
                method: "POST",
                url: "/addgallerylike",
                data: data
            }).done(function (msg) {
                var data_count = $('.' + ele_id).attr('data-count');
                data_count = parseInt(data_count) + 1;
                $('.' + ele_id).attr('data-count', data_count);
                $('.' + ele_id).text(data_count);
                resource = true;
            });
        };
    }

    GalleryController.$inject = ["$scope", "$q", "Logger", "Spinner", "$location", "moment", "CategoriesModel", "SuburbsModel"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.widgetLogin
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .directive('widgetListingByCat', [function () {
                    return {
                        restrict: 'EA',
                        scope: {
                            "id": "@id",
                            "placeholder": "@placeholder",
                            "selectedObject": "=selectedobject",
                            "titleField": "@titlefield",
                            "descriptionField": "@descriptionfield",
                            "userPause": "@pause",
                            "ishome": "@ishome"
                        },
                        templateUrl: '../resources/views/frontend/listing/listing-by-cat.blade.php',
                        controller: 'ListingByCatController',
                        controllerAs: 'self',
                        bindToController: true, //required in 1.3+ with controllerAs
                        link: function (scope, element, iAttrs, ngModel) {

                        }
                    };
                }]);
    angular
            .module('infinite-scroll').config(["$provide", function ($provide) {
            $provide.value('THROTTLE_MILLISECONDS', 1000);
        }]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.widgetLogin
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .directive('widgetGallery', [function () {
                    return {
                        restrict: 'EA',
                        scope: {
                            "id": "@id",
                            "placeholder": "@placeholder",
                            "selectedObject": "=selectedobject",
                            "titleField": "@titlefield",
                            "descriptionField": "@descriptionfield",
                            "userPause": "@pause",
                            "ishome": "@ishome"
                        },
                        templateUrl: '../resources/views/frontend/listing/serviceprovidergalleryall.blade.php',
                        controller: 'GalleryController',
                        controllerAs: 'self',
                        bindToController: true, //required in 1.3+ with controllerAs
                        link: function (scope, element, iAttrs, ngModel) {

                        }
                    };
                }]);
    angular
            .module('infinite-scroll').config(["$provide", function ($provide) {
            $provide.value('THROTTLE_MILLISECONDS', 1000);
        }]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.widgetLogin
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .directive('widgetSearchResult', [function () {
                    return {
                        restrict: 'EA',
                        scope: {
                            "query": "@query",
                            "plan": "@plan",
                            servicecats: "@"
                        },
                        templateUrl: '/apps/widgets/search-result/results.html',
                        controller: 'SearchResultController',
                        controllerAs: 'self',
                        bindToController: true, //required in 1.3+ with controllerAs
                        link: function (scope, element, iAttrs, ngModel) {}
                    };
                }]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.SearchController
     * @module BeautyCollective.Widgets
     *
     * @description
     * SearchResultController is responsible for search listings
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .controller('SearchResultController', SearchResultController);
    /* @ngInject */

    function SearchResultController($scope, $rootScope, Laravel, $sanitize, $q, Logger, Spinner, SearchResultModel, $location, moment, CategoriesModel, SuburbsModel, userAuthentication, $window, LocationFilterList) {
        var self = this;
        self.selectedTabs = [];
        self.suburbList = [];
        self.busy = false;
        self.selectedTabValue = "";
        self.page = 1;
        self.filterSelectedCat = 'Categories';
        self.filterSelectedRating = 'Rating';
        self.filterSelectedReviews = 'Reviews';
        self.filterSelectedArray = {'rating': {'ASC': 'Rating Low to High', 'DESC': 'Rating High to Low'}, 'review': {'ASC': 'Reviews Low to High', 'DESC': 'Reviews High to Low'}};
        self.showSpinner = function () {
            Spinner.start();
        }
        self.showAddress = '';
        self.showselectedContent = "";
        self.areanSearch = "";
        self.sercats = [];
        if (self.servicecats) {
            self.sercats = JSON.parse(self.servicecats);
        } else {
            self.sercats = [];
        }
        self.userRole = 'Distributor';
        if (Laravel.roles != '' && JSON.parse(Laravel.roles).length > 0) {
            self.userRole = JSON.parse(Laravel.roles)[0].name;
        }
        self.searchFilters = [];
        self.ratings = [{
                'id': '1',
                'value': 'Rating High To Low'
            }, {
                'id': '2',
                'value': 'Rating Low To High'
            }];
        self.tabs = [{
                'id': 'deal',
                'active': false,
                'showfilter': 0,
                'label': 'Deals',
                'url': 'deals',
                'data': [],
                'aclass': 'search_deal_icon',
                'subCategories': [],
                'sub_category': '',
                'location': '',
                'icons': 'images/pgsl-r2-01.png',
                'content': 'DEAL'
            }, {
                'id': 'businessforsale',
                'active': false,
                'showfilter': 0,
                'label': 'Business For Sale',
                'url': 'business',
                'data': [],
                'aclass': 'search_business_icon',
                'subCategories': [],
                'sub_category': '',
                'location': '',
                'icons': 'images/pgsl-r2-02.png',
                'content': 'BUSINESS FOR SALE'
            }, {
                'id': 'gallery',
                'active': false,
                'showfilter': 0,
                'label': 'Gallery',
                'url': 'gallery',
                'data': [],
                'aclass': 'search_gallery_icon',
                'subCategories': [],
                'sub_category': '',
                'location': '',
                'icons': 'images/pgsl-r2-04.png',
                'content': 'GALLERY'
            }, {
                'id': 'serviceprovider',
                'active': false,
                'showfilter': 0,
                'label': 'Service Provider',
                'url': 'profile',
                'data': [],
                'aclass': 'search_serviceprovider_icon',
                'subCategories': [],
                'sub_category': '',
                'location': '',
                'icons': 'images/pgsl-r2-05.png',
                'content': 'SERVICE PROVIDER'
            }, {
                'id': 'distributor',
                'active': false,
                'showfilter': 0,
                'label': 'Distributor',
                'url': 'profile',
                'data': [],
                'aclass': 'search_distributor_icon',
                'subCategories': [],
                'sub_category': '',
                'location': '',
                'icons': 'images/pgsl-r2-06.png',
                'content': 'FIND DISTRIBUTOR'
            }, {
                'id': 'job',
                'active': false,
                'showfilter': 0,
                'label': 'Jobseeker',
                'url': 'jobs',
                'data': [],
                'aclass': 'search_job_icon',
                'subCategories': [],
                'sub_category': '',
                'location': '',
                'icons': 'images/pgsl-r2-07.png',
                'content': 'FIND JOBSEEKER'
            }, {
                'id': 'classified',
                'active': false,
                'showfilter': 0,
                'label': 'Marketplace',
                'url': 'marketplace',
                'data': [],
                'aclass': 'search_classifieds_icon',
                'subCategories': [],
                'sub_category': '',
                'location': '',
                'icons': 'images/marketplace-green.svg',
                'content': 'MARKETPLACE'
            }];
        self.tabs2 = [{
                'id': 'serviceprovider',
                'active': false,
                'showfilter': 0,
                'label': 'Service Provider',
                'url': 'deals',
                'data': [],
                'aclass': 'search_deal_icon',
                'subCategories': [],
                'sub_category': '',
                'location': '',
                'icons': 'images/pgsl-01.png',
                'content': 'FIND A SERVICE'
            },
            {
                'id': 'deal',
                'active': false,
                'showfilter': 0,
                'label': 'Deals',
                'url': 'deals',
                'data': [],
                'aclass': 'search_deal_icon',
                'subCategories': [],
                'sub_category': '',
                'location': '',
                'icons': 'images/pgsl-03.png',
                'content': 'DEAL'
            },
            {
                'id': 'gallery',
                'active': false,
                'showfilter': 0,
                'label': 'Deals',
                'url': 'deals',
                'data': [],
                'aclass': 'search_deal_icon',
                'subCategories': [],
                'sub_category': '',
                'location': '',
                'icons': 'images/pgsl-04.png',
                'content': 'GALLERY'
            },
            {
                'id': 'job',
                'active': false,
                'showfilter': 0,
                'label': 'Jobs',
                'url': 'jobs',
                'data': [],
                'aclass': 'search_job_icon',
                'subCategories': [],
                'sub_category': '',
                'location': '',
                'icons': 'images/pgsl-05.png',
                'content': 'FIND JOBS'
            },
            {
                'id': 'findcourses',
                'active': false,
                'showfilter': 0,
                'label': 'School and Colleges',
                'url': 'schoolandcolleges',
                'data': [],
                'aclass': 'search_deal_icon',
                'subCategories': [],
                'sub_category': '',
                'location': '',
                'icons': 'images/pgsl-06.png',
                'content': 'FIND COURSES'
            },
            {
                'id': 'auctionaservice',
                'active': false,
                'showfilter': 0,
                'label': 'Deals',
                'url': 'deals',
                'data': [],
                'aclass': 'search_deal_icon',
                'subCategories': [],
                'sub_category': '',
                'location': '',
                'icons': 'images/pgsl-07.png',
                'content': 'AUCTION A SERVICE'
            },
            {
                'id': 'marketplace',
                'active': false,
                'showfilter': 0,
                'label': 'MarketPlace',
                'url': 'MarketPlace',
                'data': [],
                'aclass': 'search_deal_icon',
                'subCategories': [],
                'sub_category': '',
                'location': '',
                'icons': 'images/marketplace-yellow.svg',
                'content': 'MARKETPLACE'
            }
        ];
        self.LocationFilterList = {};

        angular.element(document).ready(function () {
            $(".show-spinner").hide();
        });
        $scope.$on('filterdata:updated', function (event, data) {
            self.filterRecords(data);
        });
        $scope.$$listeners['searchbarshow:updated'] = [];
        $scope.$on('searchbarshow:updated', function (event, data) {
            self.showAddress = data.Address;
            self.showselectedContent = data.textfield;
            self.areanSearch2 = data.Address;
        });
        $scope.$on("LocationFilterList", function (event, data) {
            self.LocationFilterList = data;
        });
        self.selectLocationFilter = function (value_is) {
            self.areanSearch2 = value_is;
            self.qs.location_address = self.areanSearch2;
            self.showAddress = self.areanSearch2;
            self.qs.page = 0;
            self.selectedTabs[0].data = [];
            $rootScope.$broadcast("LocationForSearch", self.areanSearch2);
            getRecords();


        }
        self.removeSearchFor = function () {
            var el = $window.document.getElementById('textfield');
            $rootScope.$broadcast("removesearchelement");
            self.showselectedContent = '';
            self.areanSearch = "";
            el.focus();
            self.selectedTabs[0].data = [];
            self.qs.sercat = '';
            self.qs.page = 0;
            self.qs.q='';
            self.filterSelectedCat='Categories';           
            getRecords();
        }
        init();
        self.startspinner = function () {
            Spinner.start('global_spinner_ab');
        }
        self.selectTab = function (tab, index) {
            if ($window.innerWidth < 500) {
                self.selectedtext = tab.content;
                self.showbar = 0;
            } else {
                self.showbar = 2;
            }

            self.selecterimg = 'img[op-change="opimg2' + index + '"]';
            $(self.selecterimg).toggleClass('shiny');
            if (tab.id == "distributor" || tab.id == "serviceprovider" || tab.id == "deal" || tab.id == "businessforsale" || tab.id == "schoolcolleges") {
                _.each(self.tabs, function (list, index) {
                    self.tabs[index].active = false;
                    if (list.id === tab.id) {
                        if (list.active) {
                            if (self.selectedTabs.length > 1) {
                                self.tabs[index].active = false;
                                self.qs.searchFor = "";
                                var tab_index = '';
                                _.each(self.selectedTabs, function (item, index) {
                                    if (item.id == tab.id)
                                        tab_index = index;
                                    else
                                        self.qs.searchFor = item.id;
                                });
                                self.qs.searchFor = _.trim(self.qs.searchFor, [',']);
                                self.selectedTabs.splice(tab_index, 1);
                            }
                        } else {
                            if (self.selectedTabs.length < 3) {
                                Spinner.start('global_spinner_ab');
                                self.tabs[index].active = true;
                                self.qs.searchFor = "";
                                self.selectedTabs = [];
                                self.selectedTabs.push(tab);
                                _.each(self.selectedTabs, function (item, index) {
                                    self.selectedTabs[index].data = [];
                                    self.qs.searchFor = item.id
                                });
                                self.qs.searchFor = _.trim(self.qs.searchFor, [',']);
                                self.qs.page = 0;
                                getRoleCategory(tab.id);
                                getRecords();
                            } else {
                                alert('You can only search 3 listing types (classified, jobs, etc.) at the one time. If you want to do a new 4th search you must deselect one and then select the new listing type.');
                            }
                        }
                        //return;
                        self.tabs[index].showfilter = 0;
                    }
                });
            } else if (tab.id == "job" && self.plan == 2) {
                _.each(self.tabs, function (list, index) {
                    self.tabs[index].active = false;
                    if (list.id === tab.id) {
                        if (list.active) {
                            if (self.selectedTabs.length > 1) {
                                self.tabs[index].active = false;
                                self.qs.searchFor = "";
                                var tab_index = '';
                                _.each(self.selectedTabs, function (item, index) {
                                    if (item.id == tab.id)
                                        tab_index = index;
                                    else
                                        self.qs.searchFor = item.id;
                                });
                                self.qs.searchFor = _.trim(self.qs.searchFor, [',']);
                                self.selectedTabs.splice(tab_index, 1);
                            }
                        } else {
                            if (self.selectedTabs.length < 3) {
                                Spinner.start('global_spinner_ab');
                                self.tabs[index].active = true;
                                self.qs.searchFor = "";
                                self.selectedTabs = [];
                                self.selectedTabs.push(tab);
                                _.each(self.selectedTabs, function (item, index) {
                                    self.selectedTabs[index].data = [];
                                    self.qs.searchFor = item.id
                                });
                                self.qs.searchFor = _.trim(self.qs.searchFor, [',']);
                                self.qs.page = 0;
                                getRoleCategory(tab.id);
                                getRecords();
                            } else {
                                alert('You can only search 3 listing types (classified, jobs, etc.) at the one time. If you want to do a new 4th search you must deselect one and then select the new listing type.');
                            }
                        }
                        //return;
                        self.tabs[index].showfilter = 0;
                    }
                });
            }



            if (tab.id == "gallery") {
                $window.open('/galleryall', '_blank');
            } else if (tab.id == "classified") {
                $window.open('/marketplace', '_self');
            }


        };
         //get role category
         function getRoleCategory(id) {
             if(id == 'serviceprovider')
                 {id = 'service'}
            CategoriesModel.subcategories({
                'cat_type': id
            }).then(function (response) {
                if (response.list.length > 0)
                    self.sercats = response.list;
                    console.log("result here",self.sercats);
            }, function (errorResponse) {
                self.sercats = [];
                console.log('Saving Details:', errorResponse);
            });
        };
        self.showFilterTab = function (tab) {
            _.each(self.tabs, function (list, index) {
                if (list.id === tab.id) {
                    self.tabs[index].showfilter = 1;
                    CategoriesModel.subcategories({
                        'cat_type': tab.id,
                    }).then(function (response) {
                        self.tabs[index].subCategories = response.list;
                    }, function () {});
                } else {
                    self.tabs[index].showfilter = 0;
                }
            });
        };
        self.hideFilterTab = function () {
            _.each(self.tabs, function (list, index) {
                self.tabs[index].showfilter = 0;
            });
        };
        self.filterRecords = function (tabs) {
            var tab = tabs.tabs;
            if (self.searchFilters.length) {
                _.each(self.searchFilters, function (filter, index) {
                    if (filter && filter.id === tab.id) {
                        self.searchFilters.splice(index, 1);
                    }
                });
            }
            self.searchFilters.push({
                'id': tab.id,
                'rating': tab.rating ? tab.rating : 0,
                'location': tab.location.postcode ? tab.location.postcode : 0,
                'sub_category': tab.sub_category,
                'sortBy': tabs.sortBy,
                'sortType': tabs.sortType,
            });
            _.each(self.tabs, function (list, index) {
                self.tabs[index].showfilter = 0;
                self.tabs[index].data = [];
            });
            self.qs.page = 0;
            getRecords();
        };
        self.nextPage = function () {
            getRecords();
        };
        self.getLocation = function (val) {
            if (val.length < 4) {
                return;
            }

            SuburbsModel
                    .findLocation({
                        'q': val
                    }).then(function (successResponse) {
                self.suburbList = successResponse.list;
            }, function (errorResponse) {
                console.log('Saving Details:', errorResponse);
            });
        };
        self.modelOptions = {
            debounce: {
                default: 500
            },
            getterSetter: true
        };
        angular.element($window).on('resize', function () {
            if ($window.innerWidth > 500) {
                self.showbar = self.menubar;
            } else {
                self.showbar = 0;
            }
        });
        self.divWidth = 0;
        self.showbar = 0;
        self.selectedtext = "Find A Service";
        self.menubar = 1;        
        if (!Laravel.user) {
            self.authcheck = 1;
        } else {
            self.authcheck = 2;
        }        
        /**
         * [init description]
         * @return {void}
         */
        function init() {
            Logger.getInstance('SearchResultController').info('Search Result Controller has initialized');
            self.qs = getQueryStrings();
            self.qs.page = 0;
            if (self.userRole == 'ServiceProvider' && self.qs['label'] != 'job') {
                self.qs['searchFor'] = "distributor";
            }
            setSelecteTabs(self.qs['searchFor']);
            self.host = $location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : '');
            self.showAddress = self.qs.location_address;
            self.areanSearch2 = self.qs.location_address;
            self.showselectedContent = self.qs['q'];
            self.queryString = (self.qs['q'] ? 'q=' + self.qs['q'] : '') + (self.qs['state'] ? '&state=' + self.qs['state'] : '') + (self.qs['post'] ? '&post=' + self.qs['post'] : '');
            self.queryString = (self.queryString) ? '&' + self.queryString : '';
            getRecords();
            var tabsdata = self.selectedTabs[0].data;
            self.authinfo = userAuthentication.checkstatus().then(function (data) {
                if (!angular.isUndefined(data[0]) && data[0] != '!210') {
                    if (data[4] == 'ServiceProvider' || data[4] == 'Distributor' || data[4] == 'SchoolCollege') {
                        self.showbar = 2;
                        self.selectedtext = "ServiceProvider";
                        self.menubar = 2;
                    } else {
                        self.showbar = 1;
                        self.menubar = 1;
                    }
                    if ($window.innerWidth < 500) {
                        self.showbar = 0;
                    }
                } else {

                    self.showbar = 1;
                    self.menubar = 1;
                    if ($window.innerWidth < 500) {
                        self.showbar = 0;
                    }
                }
                return data;
            });
            var $splitLocation = self.qs.location_address;
            var splitIt = $splitLocation.split(",");

            if (splitIt.length == 3) {
                self.searchButtonText = 'Searching';
                SuburbsModel
                        .findLocation({
                            'q': splitIt[2]
                        }).then(function (successResponse) {
                    self.searchButtonText = '';
                    self.LocationFilterList = successResponse.list;

                }, function (errorResponse) {
                    console.log('Saving Details:', errorResponse);
                });
            }




        }
        self.addFilterCategor = function (categoryIs) {
            // self.qs.sercat = categoryIs;
            self.selectedTabs[0].data = [];
            self.showselectedContent = categoryIs;
            self.filterSelectedCat = categoryIs;
            self.qs.page = 0;
            self.qs.q = categoryIs;
            $rootScope.$broadcast("CategoryForSearch", categoryIs);

            getRecords();
        };
        self.addFilterArea = function (areaIs) {
            self.areanSearch = areaIs;
            self.selectedTabs[0].data = [];
            self.qs.page = 0;
            getRecords();
        };
        function getRecords() {
            Spinner.start('global_spinner_ab');
            self.busy = true;
            self.qs.page += 1;
            self.qs.filter_for = '';
            self.qs.locations = '';
            self.qs.rating = '';
            self.qs.sub_category = '';
            self.qs.sortBy = '';
            self.qs.sortType = '';
            _.each(self.searchFilters, function (filter, index) {
                self.qs.filter_for += ',' + filter.id;
                if (parseInt(filter.location))
                    self.qs.locations += ',' + filter.location;
                else
                    self.qs.locations += '';
                if (parseInt(filter.rating))
                    self.qs.rating += ',' + filter.rating;
                else
                    self.qs.rating += ',0';
                if (parseInt(filter.sub_category))
                    self.qs.sub_category += ',' + filter.sub_category;
                else
                    self.qs.sub_category += ',0';
                self.qs.sortBy = filter.sortBy;
                self.qs.sortType = filter.sortType;

            });
            self.qs.filter_for = self.qs.filter_for.substr(1);
            self.qs.locations = self.qs.locations;
            self.qs.rating = self.qs.rating.substr(1);
            self.qs.sub_category = self.qs.sub_category.substr(1);
            self.qs.serarea = self.areanSearch;
            console.log(self.qs);
            SearchResultModel.findAll(self.qs).then(function (responce) {
                var AuthCheck = responce.auth_check;
                if (self.authcheck != AuthCheck) {
                    window.location.reload();
                }
                responce = responce.results;
                _.each(self.selectedTabs, function (tabs, tab_index) {
                    if (responce[tabs.id].length) {
                        _.each(responce[tabs.id], function (item, index) {
                            self.selectedTabs[tab_index].data.push(item);
                            self.busy = false;
                        });
                    }
                });
                Spinner.stop('global_spinner_ab');
            }, function (error) {
                Spinner.stop('global_spinner_ab');
                return [];
            });
        }
        function getQueryStrings() {
            var assoc = {};
            var decode = function (s) {
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

        function setSelecteTabs(searchFor) {
            _.each(self.tabs, function (tab, index) {
                if (searchFor == tab.id) {
                    self.tabs[index].active = true;
                    self.selectedTabs.push(tab);
                }
            });
            _.each(self.tabs2, function (tab, index) {
                if (searchFor == tab.id) {
                    self.tabs2[index].active = true;
                }
            });
        }

        self.selectTabOther = function (tab, index) {
            if ($window.innerWidth < 500) {
                self.selectedtext = tab.content;
                self.showbar = 0;
            } else {
                self.showbar = 1;
            }
            self.selecterimg = 'img[op-change="opimg1' + index + '"]';
            $(self.selecterimg).toggleClass('shiny');
            $(self.selecterimg).parent().parent().toggleClass('active');
            if (tab.id == "deal" || tab.id == "serviceprovider" || tab.id == "job" || tab.id == "findcourses") {
                _.each(self.tabs2, function (list, index) {
                    self.tabs2[index].active = false;
                    if (list.id === tab.id) {
                        if (list.active) {
                            if (self.selectedTabs.length > 1) {
                                self.tabs2[index].active = false;
                                self.qs.searchFor = "";
                                var tab_index = '';
                                _.each(self.selectedTabs, function (item, index) {
                                    if (item.id == tab.id)
                                        tab_index = index;
                                    else
                                        self.qs.searchFor = item.id;
                                });
                                self.qs.searchFor = _.trim(self.qs.searchFor, [',']);
                                self.selectedTabs.splice(tab_index, 1);
                            }
                        } else {
                            if (self.selectedTabs.length < 3) {
                                Spinner.start('global_spinner_ab');
                                self.tabs2[index].active = true;
                                self.qs.searchFor = "";
                                self.selectedTabs = [];
                                self.selectedTabs.push(tab);
                                _.each(self.selectedTabs, function (item, index) {
                                    self.selectedTabs[index].data = [];
                                    self.qs.searchFor = item.id
                                });
                                self.qs.searchFor = _.trim(self.qs.searchFor, [',']);
                                self.qs.page = 0;
                                getRoleCategory(tab.id)
                                getRecords();
                            } else {
                                alert('You can only search 3 listing types (classified, jobs, etc.) at the one time. If you want to do a new 4th search you must deselect one and then select the new listing type.');
                            }
                        }
                        //return;
                        self.tabs[index].showfilter = 0;
                    }
                });
            }
            if (tab.id == "gallery") {
                $window.open('/galleryall', '_blank');
            }
            if (tab.id == 'marketplace') {
                $window.open('/marketplace', '_blank');
            }

        };
        self.showmenu = function () {

            if (self.showbar == 0) {
                self.showbar = self.menubar;
            } else {
                self.showbar = 0;
            }
        }

        self.base64Convertion = function (value) {
            return $rootScope.base64_encode(value);
        }

        self.htmlToPlaintext = function (input) {
            var txt = document.createElement("textarea");
            txt.innerHTML = input;
            return txt.value;
//            allowed = (((allowed || '') + '')
//                    .toLowerCase()
//                    .match(/<[a-z][a-z0-9]*>/g) || [])
//                    .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
//            var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
//                    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
//            return input.replace(commentsAndPhpTags, '')
//                    .replace(tags, function ($0, $1) {
//                        return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
//                    });
        }
        self.contentOnly = function (text) {
            return angular.element(text).text();
        }
        self.searchFilterRecords = function (sortBy, sortType) {
            if (sortBy == 'review') {
                self.filterSelectedReviews = self.filterSelectedArray[sortBy][sortType];
            } else {
                self.filterSelectedRating = self.filterSelectedArray[sortBy][sortType];
            }
            var tabs = JSON.parse(angular.element("#btn-filter-records").attr('tabs-data'));
            $rootScope.$broadcast('filterdata:updated', {tabs: tabs, "sortBy": sortBy, "sortType": sortType});
        }
        self.searchButtonText = '';
        $scope.fetchSuberbs = function () {
            if (self.areanSearch2 && self.areanSearch2.length < 4) {
                self.LocationFilterList = {};
                return;
            }
            if (self.areanSearch2) {
                self.searchButtonText = 'Searching';
                SuburbsModel
                        .findLocation({
                            'q': self.areanSearch2
                        }).then(function (successResponse) {
                    self.searchButtonText = '';
                    self.LocationFilterList = successResponse.list;

                }, function (errorResponse) {
                    console.log('Saving Details:', errorResponse);
                });
            }
        }
    }
    SearchResultController.$inject = ["$scope", "$rootScope", "Laravel", "$sanitize", "$q", "Logger", "Spinner", "SearchResultModel", "$location", "moment", "CategoriesModel", "SuburbsModel", "userAuthentication", "$window", "LocationFilterList"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.widgetLogin
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .directive('resizeSearch', function ($window) {
                return function (scope, element) {
                    var w = angular.element($window);
                    scope.getWindowDimensions = function () {
                        return {
                            'w': $window.innerWidth
                        };
                    };
                    scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                        scope.windowWidth = newValue.w;
                        if (scope.windowWidth > 500) {
                            self.showbar = 1;
                        } else {
                            self.showbar = 0;
                        }
                        scope.style = function () {
                            return {
                                'height': (newValue.h - 100) + 'px',
                                'width': (newValue.w - 100) + 'px'
                            };
                        };
                    }, true);
                    w.bind('resizeSearch', function () {
                        scope.$apply();
                    });
                }
            });
})();
'use strict';
angular
        .module('BeautyCollective.Widgets')
        .directive('notifications', function () {
            return {
                templateUrl: 'widgets/notifications/notifications.html',
                restrict: 'E',
                replace: true,
            };
        });
(function () {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Widgets.Factory.SearchResource
     * @module BeautyCollective.Widgets
     *
     * @description
     * Implements CURD operations
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .factory('SearchResource', SearchResource);
    /* @ngInject */
    function SearchResource($resource, APP_CONFIG) {
        /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
        return $resource('/search', {}, {
            findAll: {
                method: 'GET',
                transformResponse: transformQueryResponse
            }
        });
    }

    SearchResource.$inject = ["$resource", "APP_CONFIG"];

    function transformQueryResponse(data, headersGetter) {
        var _response = {};
        _response.list = angular.fromJson(data);
        return angular.fromJson(_response);
    }

})();
(function () {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Widgets.Service.SearchModel
     * @module BeautyCollective.Widgets
     *
     * @description
     *
     * Data model for jobtask module
     * Implemenets CURD operation
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .service('SearchModel', SearchModel);
    /* @ngInject */
    function SearchModel(SearchResource) {
        var model = this;
        /**
         * [jobList description]
         * @True {Array}
         */
        model.searchList = [];
        /**
         * [findAll description]
         * @method findAl
         * @author Kinectro
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */

        model.findAll = function (params, success, fail) {
            return SearchResource.findAll(params, success, fail).$promise;
        };
    }

    SearchModel.$inject = ["SearchResource"];
})();
(function () {
    angular
            .module('BeautyCollective.Widgets')
            .directive('onlyNumbers', function () {
                return {
                    restrict: 'A',
                    link: function (scope, elm, attrs, ctrl) {
                        elm.on('keydown', function (event) {
                            if (event.shiftKey) {
                                event.preventDefault();
                                return false;
                            }                            
                            if ([8, 13, 27, 37, 38, 39, 40].indexOf(event.which) > -1) {
                                // backspace, enter, escape, arrows
                                return true;
                            } else if (event.which >= 49 && event.which <= 57) {
                                // numbers
                                return true;
                            } else if (event.which >= 96 && event.which <= 105) {
                                // numpad number
                                return true;
                            }                       
                            else {
                                event.preventDefault();
                                return false;
                            }
                        });
                    }
                }
            });
    angular
            .module('BeautyCollective.Widgets')
            .directive('noFloat', function () {
                return {
                    restrict: 'A',
                    link: function (scope, elm, attrs, ctrl) {
                        elm.on('keydown', function (event) {
                            if ([110, 190].indexOf(event.which) > -1) {
                                // dot and numpad dot
                                event.preventDefault();
                                return false;
                            } else {
                                return true;
                            }
                        });
                    }
                }
            });
})();



(function () {
    'use strict';
    angular.module('BeautyCollective.Widgets');
    angular.service('SearchFilterService', SearchFilterService);
    function SearchFilterService($rootScope) {
        var pd = this;
        pd.tabData = [];
        pd.setData = function (tabdata) {
            pd.tabData = tabdata;
            $rootScope.$broadcast('filterdata:updated');
        }
        pd.getdData = function () {
            return pd.tabData;
        }
    }
    SearchFilterService.$inject = ["$rootScope"];
});





(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.SearchController
     * @module BeautyCollective.Widgets
     *
     * @description
     * SearchController is responsible for search listings
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .controller('SearchController', SearchController);
    /* @ngInject */

    function SearchController($scope, $rootScope, $sanitize, $q, Logger, Spinner, SearchModel, SuburbsModel, $location, $http, LocationFilterList) {

        var self = this;
        self.geoPosition = {};
        self.selected = true;
        self.addresstype = 'number';
        $scope.userto = 0;
        $scope.showDropdownmenu = false;
        $scope.showSearchmenu = false;
        $scope.searchRessultFound = false;
        self.searching2 = false;
        init();
        $scope.$on("LocationForSearch", function (event, data) {
            $scope.searchText = data;
        });
        $scope.$on("CategoryForSearch", function (event, data) {
            self.searchStr = data;
        });
        function init() {
            Logger.getInstance('SearchController').info('Search Controller has initialized');
            $scope.showDropdownmenu = false;
            self.qs = getQueryStrings();
            self.searchStr = self.qs.q;
            self.bussinessStr = self.qs.busq;
            $scope.searchText = self.qs.location_address;
            $scope.businessText = self.qs.location_address;
            self.selected = true;
            self.lastFoundWord = null;
            self.currentIndex = null;
            self.justChanged = false;
            self.searchTimer = null;
            self.searching = false;
            self.pause = 500;
            self.minLength = 3;
            self.post = [];
        }
        self.CheckPostCodeValidation = function (frm) {
            if (typeof self.searchStr != 'undefined' && self.searchStr.length > 0) {
                document.getElementById("search-frm-main").submit();
            } else {
                if (typeof $scope.searchText != 'undefined' && $scope.searchText.length > 0) {
                    document.getElementById("search-frm-main").submit();
                } else {
                    self.showclass = 'require-class';
                }
            }
            return false;
        };

        function getQueryStrings() {
            var assoc = {};
            var decode = function (s) {
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
        self.searchButtonText = '';

        self.callStatus = 0;
        self.nextCall = 0;
        self.preStrlength = 0;
        self.spOpen = function (id) {
            window.open('profile?id=' + id, '_self');
        }
        self.showAjaxCall = function (length) {           
            if (length == 0 && self.searchStr.length >= 5) {
                if (self.callStatus == 0 && self.nextCall == 0) {
                    self.preStrlength = self.searchStr.length;
                    self.callStatus = 1;
                    self.nextCall = 1;
                    self.searching = true;

                    $http({
                        method: "GET",
                        url: main_url + "/getServiceProviderByName/" + self.searchStr
                    }).then(function mySuccess(response) {                        
                        self.callStatus = 0;
                        self.nextCall = 1;
                        self.searching = false;
                        self.results = response.data;
                    }, function myError(response) {
                        console.log(response.statusText);
                    });
                }
                if (self.searchStr.length <= self.preStrlength || self.searchStr.length >= self.preStrlength) {
                    self.nextCall = 0;
                }
//                return true;
            } else {
                return false;
            }            
        }
        self.getLocation = function (val) {
            if (val.length < 4) {
                return;
            }
            Spinner.start('me');
            SuburbsModel
                    .findLocation({
                        'q': val
                    }).then(function (successResponse) {
                self.suburbList = successResponse.list;
                Spinner.stop();
            }, function (errorResponse) {
                console.log('Saving Details:', errorResponse);
                Spinner.stop('me');
            });
        };
        $scope.alphaValidate = function (evt) {
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if (charCode != 46 && charCode > 31
                    && (charCode < 48 || charCode > 57)) {
                event.preventDefault();
                return false;
            }
            return true;
        }
        $scope.fetchSuberbs = function () {

            self.showclass = '';

            if ($scope.searchText && $scope.searchText.length < 4) {
                self.suburbList = {};
                $("#searchResult").hide();
                return;
            }
            if ($scope.searchText) {
                self.searchButtonText = 'Searching';
//             Spinner.start();
                SuburbsModel
                        .findLocation({
                            'q': $scope.searchText
                        }).then(function (successResponse) {
                    self.suburbList = successResponse.list;
                    $rootScope.$broadcast("LocationFilterList", self.suburbList);
                    self.searchButtonText = '';
                    $("#searchResult").show();
                    Spinner.stop('me');
                }, function (errorResponse) {
                    console.log('Saving Details:', errorResponse);
                    self.searchButtonText = '';
                    Spinner.stop('me');
                });
            }
        }
        $scope.setValue = function (index) {
            self.addresstype = 'text';
            $('a').removeClass("VIC");
            $scope.searchText = self.suburbList[index].location + "," + self.suburbList[index].state + "," + self.suburbList[index].postcode;
            $scope.bclasses = "";
            $('#v' + self.suburbList[index].state + '').addClass("VIC");
            self.suburbList = {};
            $rootScope.$broadcast('searchbarshow:updated', {"textfield": self.searchStr, "Address": $scope.searchText});
        }
        $scope.scrollTo = function (selector) {
            window.scrollTo(0, $(selector)[0].offsetTop - 100);
        }

        self.modelOptions = {
            debounce: {
                default: 500,
                blur: 250
            },
            getterSetter: true
        };
        self.searchRecord = function (q) {
            Spinner.start();
            var deffered = $q.defer();
            if (!q && q.length < 3) {
                return;
            }
            return SearchModel.findAll({
                'q': self.q,
                'post': self.post,
                'state': self.state
            }).then(function (responce) {
                Spinner.stop();
                return responce.list;
            }, function (error) {
                Spinner.stop();
                return [];
            });
        };
        self.handleSelection = function (item) {
            self.q = item;
            self.selected = true;
        };
        if (self.userPause) {
            self.pause = self.userPause;
        }

        self.processResults = function (responseData) {
            return false;
            if (responseData && responseData.length > 0) {
                self.results = [];
                var titleFields = ["title"];
                if (self.titleField && self.titleField != "") {
                    titleFields = self.titleField.split(",");
                }

                for (var i = 0; i < responseData.length; i++) {
                    // Get title variables
                    var titleCode = "";
                    for (var t = 0; t < titleFields.length; t++) {
                        if (t > 0) {
                            titleCode = titleCode + " + ' ' + ";
                        }
                        titleCode = titleCode + "responseData[i]." + titleFields[t];
                    }

                    // Figure out description
                    var description = "";
                    if (self.descriptionField && self.descriptionField != "") {
                        eval("description = responseData[i]." + self.descriptionField);
                    }

                    // Figure out image
                    var image = "";
                    if (self.imageField && self.imageField != "") {
                        eval("image = responseData[i]." + self.imageField);
                    }

                    var resultRow = {
                        title: eval(titleCode),
                        description: description,
                        image: image,
                        originalObject: responseData[i]
                    }

                    self.results[self.results.length] = resultRow;
                }


            } else {
                self.results = [];
            }

            Spinner.stop();
        }

        self.searchTimerComplete = function (str) {
            if (str.length >= self.minLength) {
                if (self.localData) {
                    var searchFields = self.searchFields.split(",");
                    var matches = [];
                    for (var i = 0; i < self.localData.length; i++) {
                        var match = false;
                        for (var s = 0; s < searchFields.length; s++) {
                            var evalStr = 'match = match || (self.localData[i].' + searchFields[s] + '.toLowerCase().indexOf("' + str.toLowerCase() + '") >= 0)';
                            eval(evalStr);
                        }

                        if (match) {
                            matches[matches.length] = self.localData[i];
                        }
                    }

                    self.searching = false;
                    self.results = matches;
                    self.$apply();
                } else {
                    Spinner.start();
                    var serialized = $('#search-frm-main').serializeArray();
                    var sa = '';
                    var data = {};
                    for (sa in serialized) {
                        data[serialized[sa]['name']] = serialized[sa]['value']
                    }
                    data['searchWidget'] = 1;
                    var data2 = JSON.stringify(data);
                    self.selected = false;
                    self.searching = false;
                    self.results = {Category: self.categories};                    
                    $scope.$apply();
                }
                Spinner.stop();
            }

        }

        self.hoverRow = function (index) {
            self.currentIndex = index;
        }

        self.keyPressed = function (event) {

            if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
                if (!self.searchStr || self.searchStr == "") {
                    self.showDropdown = false;
                } else {
                    if (self.searchStr.length >= self.minLength) {
                        self.showDropdown = true;
                        self.currentIndex = -1;
                        self.results = [];
                        if (self.searchTimer) {
                            clearTimeout(self.searchTimer);
                        }                        
                        self.searching = true;                        
                        self.searchTimer = setTimeout(function () {
                            self.searchTimerComplete(self.searchStr);
                            console.log(self.searchStr);
                            self.searching = false;
                        }, self.pause);                        
                    }
                }

            } else {
                event.preventDefault();
            }
        }

        self.hidelist = function () {
            self.showDropdown = false;
        }

        self.selectResult = function (result) {
//            if (result.originalObject.categories[0].name == 'serviceprovider') {
//                window.open(main_url + '/profile?id=' + $rootScope.base64_encode(result.id), '_self');
//            }
            self.searchStr = result.name;
            self.selectedObject = result;
            self.showDropdown = false;
            self.results = [];
            $rootScope.$broadcast('searchbarshow:updated', {"textfield": result.name, "Address": $scope.searchText});
        }
        /*
         * home page business search bar start here
         */
        $scope.bussinessStr = "";
        $scope.bsearchResults = [];
        $scope.businessSearch = function (event) {

            if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
                if (!$scope.bussinessStr || $scope.bussinessStr == "") {
                    $scope.showDropdownmenu = false;
                    $scope.bsearchResults = [];
                    $scope.showSearchmenu = false;
                    $scope.searchRessultFound = false;
                } else {
                    if ($scope.bussinessStr.length >= self.minLength) {
                        self.showDropdown = true;
                        self.currentIndex = -1;
                        self.results = [];
                        if (self.searchTimer) {
                            clearTimeout(self.searchTimer);
                        }
                        self.searching = true;
                        self.searchTimer = setTimeout(function () {
                            self.getsearchresults($scope.bussinessStr);
                        }, self.pause);
                    } else {
                        $scope.showSearchmenu = false;
                        $scope.searchRessultFound = false;
                    }
                }
                $scope.userto = 0;
            } else {
                event.preventDefault();
            }

        }
        $scope.bsearchbutton = false;
        self.getsearchresults = function (str) {

            if (str.length > 0) {
                $scope.showDropdownmenu = false;
                $scope.bsearchResults = [];
                $scope.showSearchmenu = true;
                $scope.searchRessultFound = false;
                // Spinner.start();
                $http({
                    method: "GET",
                    url: main_url + "/bussinessSearch",
                    params: {
                        name: str
                    }
                }).then(function mySuccess(response) {
                    if (response['data'].length > 0) {
                        $scope.showDropdownmenu = true;
                        $scope.showSearchmenu = false;
                        $scope.bsearchResults = response['data'];
                    } else {
                        $scope.showDropdownmenu = false;
                        $scope.showSearchmenu = false;
                        $scope.bsearchResults = [];
                        $scope.searchRessultFound = true;
                    }
                    // Spinner.stop();
                }, function myError(response) {
                    console.log(response.statusText);
                });
            } else {
                $scope.showDropdownmenu = false;
                $scope.bsearchResults = [];
                $scope.showSearchmenu = false;
                $scope.searchRessultFound = false;
            }
        }
        $scope.selectedResult = function (result) {
            $scope.bussinessStr = result.business_name;
            $scope.bsearchbutton = true;
            $scope.showDropdownmenu = false;
            $scope.userto = result.user_id;
            $("#business_name").text(result.business_name);
            //            $("widget-rating-home").attr("userto", result.user_id);
            $scope.bsearchResults = [];
        }

        $scope.lostFocus = function () {
            setTimeout(function () {
                $scope.showDropdownmenu = false;
                $scope.bsearchResults = [];
            }, 100);
        }
        $scope.$on('removesearchelement', function (event, data) {
            self.searchStr = "";
        });
        self.searchFilterRecords = function (sortBy, sortType) {
            var tabs = JSON.parse(angular.element("#btn-filter-records").attr('tabs-data'));
            $rootScope.$broadcast('filterdata:updated', {tabs: tabs, "sortBy": sortBy, "sortType": sortType});
        }



        /*
         * home page business search bar end here
         */
    }


    SearchController.$inject = ["$scope", "$rootScope", "$sanitize", "$q", "Logger", "Spinner", "SearchModel", "SuburbsModel", "$location", "$http", "LocationFilterList"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Account.Factory.ReviewResource
     * @module BeautyCollective.Account
     *
     * @description
     * Implements CURD operations
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Account')
            .factory('LocationFilterList', LocationFilterList);

    /* @ngInject */
    function LocationFilterList() {
        var locations = {};
        var addFileterList = function (Locations) {
            locations = Locations;
        };
        var getFilterList = function () {
            return locations;
        };
        var testFunction = function () {            
        };
        return {
            getFilterList: getFilterList,
            addFileterList: addFileterList,
            testFunction: testFunction
        };
    }

    LocationFilterList.$inject = [];

    function transformGetResponse(data, headersGetter) {
        var _response = {};
        _response.data = angular.fromJson(data);
        return angular.fromJson(_response);
    }

    function transformGetResponse2(data, headersGetter) {
        var _response2 = {};
        _response2.data = angular.fromJson(data);
        return angular.fromJson(_response2);
    }

})();

(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.widgetLogin
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .directive('widgetSearchOld', ['$document', function ($document) {
                    return {
                        restrict: 'EA',
                        scope: {
                            "id": "@id",
                            "placeholder": "@placeholder",
                            "selectedObject": "=selectedobject",
                            "titleField": "@titlefield",
                            "descriptionField": "@descriptionfield",
                            "userPause": "@pause",
                            "ishome": "@ishome",
                            "query": "@query",
                            "categories": "="
                        },
                        templateUrl: '/apps/widgets/search/search2.html',
                        controller: 'SearchController',
                        controllerAs: 'self',
                        bindToController: true, //required in 1.3+ with controllerAs
                        link: function (scope, element, iAttrs, ngModel) {
                            element.bind("keyup", function (event) {
                                if (event.which === 40) {
                                    if ((scope.currentIndex + 1) < scope.results.length) {
                                        scope.currentIndex++;
                                        scope.$apply();
                                        event.preventDefault;
                                        event.stopPropagation();
                                    }

                                    scope.$apply();
                                } else if (event.which == 38) {
                                    if (scope.currentIndex >= 1) {
                                        scope.currentIndex--;
                                        scope.$apply();
                                        event.preventDefault;
                                        event.stopPropagation();
                                    }

                                } else if (event.which == 13) {
                                    if (scope.currentIndex >= 0 && scope.currentIndex < scope.results.length) {
                                        scope.selectResult(scope.results[scope.currentIndex]);
                                        scope.$apply();
                                        event.preventDefault;
                                        event.stopPropagation();
                                    } else {
                                        scope.results = [];
                                        scope.$apply();
                                        event.preventDefault;
                                        event.stopPropagation();
                                    }

                                } else if (event.which == 27) {
                                    scope.results = [];
                                    scope.showDropdown = false;
                                    scope.$apply();
                                } else if (event.which == 8) {
                                    scope.selectedObject = null;
                                    scope.$apply();
                                }
                            });
                            $document.bind('click', function (event) {
                                var click_element_status = element.find(event.target).length;
                                if (click_element_status > 0) {
                                    return;
                                } else {
                                    // scope.$apply(function () {
                                    scope.self.showDropdown = false;
                                    // });
                                }
                            });
                        }
                    };
                }]);
    angular
            .module('infinite-scroll').config(["$provide", function ($provide) {
            $provide.value('THROTTLE_MILLISECONDS', 1000);
        }]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.widgetLogin
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Kinectro ( gmail::Kinectro.com )
     */
    angular
            .module('BeautyCollective.Widgets')
            .directive('widgetSearch', ['$document', function ($document) {
                    return {
                        restrict: 'EA',
                        scope: {
                            "id": "@id",
                            "placeholder": "@placeholder",
                            "selectedObject": "=selectedobject",
                            "titleField": "@titlefield",
                            "descriptionField": "@descriptionfield",
                            "userPause": "@pause",
                            "ishome": "@ishome",
                            " ": "@query",
                            "categories": "="
                        },
                        templateUrl: main_url + '/apps/widgets/search/search.html',
                        controller: 'SearchController',
                        controllerAs: 'self',
                        bindToController: true, //required in 1.3+ with controllerAs
                        link: function (scope, element, iAttrs, ngModel) {
                            element.bind("keyup", function (event) {
                                if (event.which === 40) {
                                    if ((scope.currentIndex + 1) < scope.results.length) {
                                        scope.currentIndex++;
                                        scope.$apply();
                                        event.preventDefault;
                                        event.stopPropagation();
                                    }

                                    scope.$apply();
                                } else if (event.which == 38) {
                                    if (scope.currentIndex >= 1) {
                                        scope.currentIndex--;
                                        scope.$apply();
                                        event.preventDefault;
                                        event.stopPropagation();
                                    }

                                } else if (event.which == 13) {
                                    if (scope.currentIndex >= 0 && scope.currentIndex < scope.results.length) {
                                        scope.selectResult(scope.results[scope.currentIndex]);
                                        scope.$apply();
                                        event.preventDefault;
                                        event.stopPropagation();
                                    } else {
                                        scope.results = [];
                                        scope.$apply();
                                        event.preventDefault;
                                        event.stopPropagation();
                                    }

                                } else if (event.which == 27) {
                                    scope.results = [];
                                    scope.showDropdown = false;
                                    scope.$apply();
                                } else if (event.which == 8) {
                                    scope.selectedObject = null;
                                    scope.$apply();
                                }
                            });
                            $document.bind('click', function (event) {
                                var click_element_status = element.find(event.target).length;
                                if (click_element_status > 0) {
                                    return;
                                } else {
                                    scope.$apply(function () {
                                        scope.self.showDropdown = false;
                                    });
                                }
                            });
                        }
                    };
                }]);
    angular.module('infinite-scroll').config(["$provide", function ($provide) {
            $provide.value('THROTTLE_MILLISECONDS', 1000);
        }]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.widgetBooking
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .directive('widgetBooking', [function () {
                    return {
                        restrict: 'EA',
                        scope: {
                            "id": "@id",
                            "userto": "@userto",
                            "userfrom": "@userfrom",
                            "categories": "@categories"
                        },
                        templateUrl: '/apps/widgets/booking/booking.html',
                        controller: 'BookingController',
                        controllerAs: 'self',
                        bindToController: true, //required in 1.3+ with controllerAs
                        link: function (scope, element, iAttrs, ngModel) {}
                    };
                }]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Widgets.Factory.BookingResource
     * @module BeautyCollective.Widgets
     *
     * @description
     * Implements CURD operations
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .factory('BookingResource', BookingResource);
    /* @ngInject */
    function BookingResource($resource, APP_CONFIG) {
        /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
        return $resource('../bookappointment', {}, {
            saveAppointment: {
                method: 'POST'
            },
            getServices: {
                url: 'services',
                method: 'GET',
                isArray: true
            }
        });
    }

    BookingResource.$inject = ["$resource", "APP_CONFIG"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Widgets.Service.BookingModel
     * @module BeautyCollective.Widgets
     *
     * @description
     *
     * Data model for Booking module
     * Implemenets CURD operation
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .service('BookingModel', BookingModel);
    /* @ngInject */
    function BookingModel(BookingResource) {
        var model = this;
        /**
         * [saveBooking description]
         * @method saveBooking
         * @author Kinectro
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */

        model.saveAppointment = function (params, success, fail) {
            return BookingResource.saveAppointment(params, success, fail).$promise;
        };
        model.getServices = function (params, success, fail) {
            return BookingResource.getServices(params, success, fail).$promise;
        };
    }
    BookingModel.$inject = ["BookingResource"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.BookingController
     * @module BeautyCollective.Widgets
     *
     * @description
     * BookingController is responsible for booking appointments
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .controller('BookingController', BookingController);
    /* @ngInject */

    function BookingController($sanitize, $q, Logger, Spinner, BookingModel, uibDateParser, toaster) {

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
            Logger.getInstance('BookingController').info('Booking Controller has initialized');
            self.serviceprovidercategories = (self.categories) ? angular.fromJson(self.categories) : [];
            self.services = [];
        }

        self.today = function () {
            self.appointmentdate = new Date();
        };
        self.today();
        self.clear = function () {
            self.appointmentdate = null;
        };
        // Disable weekend selection
        self.disabled = function (date, mode) {
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        };
        self.toggleMin = function () {
            self.minDate = self.minDate ? null : new Date();
        };
        self.toggleMin();
        self.maxDate = new Date(2020, 5, 22);
        self.open1 = function () {
            self.popup1.opened = true;
        };
        self.setDate = function (year, month, day) {
            self.appointmentdate = new Date(year, month, day);
        };
        self.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        self.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        self.format = self.formats[0];
        self.altInputFormats = ['M!/d!/yyyy'];
        self.popup1 = {
            opened: true
        };
        self.appointmenttime = new Date();
        self.hstep = 1;
        self.mstep = 5;
        self.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };
        self.ismeridian = true;
        self.toggleMode = function () {
            self.ismeridian = !self.ismeridian;
        };
        self.appointmentservices = [{
                index: 1,
                category: null,
                service: null
            }];
        self.removeService = function (index) {
            for (var item in self.appointmentservices) {
                if (self.appointmentservices[item].index == index) {
                    self.appointmentservices.splice(item, 1);
                    break;
                }
            }
        };
        self.addService = function (last) {
            self.appointmentservices.push({
                index: last + 1,
                category: null,
                service: null
            });
        };
        self.bookAppointment = function () {
            Spinner.start();
            var _data = {
                'appointmentdate': self.appointmentdate,
                'appointmenttime': self.appointmenttime,
                'appointmentservices': angular.toJson(self.appointmentservices),
                'touser': self.userto
            }
            if (self.appointmenttime < new Date()) {
                toaster.pop('error', 'Invalid Date', 'You can\'t select past time.');
                Spinner.stop();
            } else {
                BookingModel.saveAppointment({}, _data).then(function (responce) {
                    self.appointmentservices = [{
                            index: 1,
                            category: null,
                            service: null
                        }];
                    Spinner.stop();
                    toaster.pop('success', 'Appointment Booked', 'Your appointment has been booked successfully.');
                }, function () {
                    Spinner.stop();
                    toaster.pop('error', 'Appointment Booked', 'Something went worng! we can\'t book your appointment.');
                });
            }
        };
        self.selectCategory = function (item, id) {
            self.services[id] = [];
            BookingModel.getServices({
                'id': item.id
            }).then(function (responce) {
                self.services[id].serviceproviderServices = responce;
            }, function () {});
        }

    }
    BookingController.$inject = ["$sanitize", "$q", "Logger", "Spinner", "BookingModel", "uibDateParser", "toaster"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.LocationMapController
     * @module BeautyCollective.Widgets
     *
     * @description
     * LocationMapController is responsible for login implementation
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .controller('LocationMapController', LocationMapController);
    /* @ngInject */
    function LocationMapController($sanitize, $scope, $timeout, $log, $http, Logger, Spinner, uiGmapGoogleMapApi) {
        /**
         * [self description]
         * @type {[type]}
         */
        var self = this;
        $scope.map = {
            center: {
                latitude: $scope.locationInfo.latitude,
                longitude: $scope.locationInfo.longitude
            },
            zoom: 14,
            options: {
                scrollwheel: false
            },
            marker: {
                id: 0,
                coords: {
                    latitude: $scope.locationInfo.latitude,
                    longitude: $scope.locationInfo.longitude
                },
                options: {
                    showWindow: true,
                    animation: 0,
                    labelContent: $scope.locationInfo.name + ', ' + $scope.locationInfo.state + '-' + $scope.locationInfo.postcode,
                    labelClass: "marker-labels",
                    labelAnchor: "50 0"
                }
            }
        };
        uiGmapGoogleMapApi.then(function (maps) {
            
            //            service = new google.maps.places.PlacesService($scope.map);
        });
    }

    LocationMapController.$inject = ["$sanitize", "$scope", "$timeout", "$log", "$http", "Logger", "Spinner", "uiGmapGoogleMapApi"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.locationMap
     * @module BeautyCollective.Widgets
     *
     * @description
     * This directive is used to avail all feature from google map API and use in application as independent widget
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .directive('locationMap', ['Laravel', function (Laravel) {
                    return {
                        templateUrl: '/apps/widgets/location-map/location-map.html',
                        restrict: 'E',
                        scope: {
                            locationInfo: '='
                        },
                        link: function (scope, element, attrs, ngModel) {},
                        controller: 'LocationMapController'
                    };
                }]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.locationMap
     * @module BeautyCollective.Widgets
     *
     * @description
     * This directive is used to avail all feature from google map API and use in application as independent widget
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .directive('setfocus', function () {


                return {
                    link: function (scope, element, attrs) {
                        element.bind('click', function () {
                            alert("hello");
                            $("#xxxxx").animate({
                                scrollTop: $("#target-element").offset().top
                            }, 1000);
                        })
                    }
                };
            });
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.activatejob
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .directive('activateJob', [function () {
                    return {
                        restrict: 'EA',
                        scope: {
                            "id": "@id",
                            "status": "@status",
                            "daysleft": "@daysleft"
                        },
                        templateUrl: '/apps/widgets/activate-job/activatejob.html',
                        controller: 'ActivatejobController',
                        controllerAs: 'self',
                        bindToController: true, //required in 1.3+ with controllerAs
                        link: function (scope, element, iAttrs, ngModel) {}
                    };
                }]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Widgets.Factory.ActivatejobResource
     * @module BeautyCollective.Widgets
     *
     * @description
     * Implements CURD operations
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .factory('ActivatejobResource', ActivatejobResource);
    /* @ngInject */
    function ActivatejobResource($resource, APP_CONFIG) {
        /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
        return $resource('../activatejob', {}, {
            ActivateJob: {
                method: 'POST'
            }
        });
    }

    ActivatejobResource.$inject = ["$resource", "APP_CONFIG"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Widgets.Service.ShortlistjobModel
     * @module BeautyCollective.Widgets
     *
     * @description
     *
     * Data model for Booking module
     * Implemenets CURD operation
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .service('ActivatejobModel', ActivatejobModel);
    /* @ngInject */
    function ActivatejobModel(ActivatejobResource) {
        var model = this;
        /**
         * [Shortlistjob description]
         * @method Shortlistjob
         * @author Kinectro
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */

        model.ActivateJob = function (params, success, fail) {
            return ActivatejobResource.ActivateJob(params, success, fail).$promise;
        };
    }

    ActivatejobModel.$inject = ["ActivatejobResource"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.ActivatejobController
     * @module BeautyCollective.Widgets
     *
     * @description
     * ActivatejobController is responsible for activating job
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .controller('ActivatejobController', ActivatejobController);
    /* @ngInject */

    function ActivatejobController($sanitize, $q, Logger, Spinner, ActivatejobModel, toaster) {

        /**
         * [self description]
         * @type {[type]}
         */
        var self = this;
        self.showlink = (parseInt(self.status) && parseInt(self.daysleft) >= 0) ? false : true;
        init();
        /**
         * [init description]
         * @return {void}
         */
        function init() {
            Logger.getInstance('ActivatejobController').info('Activatejob Controller has initialized');
        }


        self.activateJob = function () {
            ActivatejobModel.ActivateJob({}, {
                id: self.id,
                action: self.showlink
            }).then(function (responce) {
                if (responce.status) {
                    self.showlink = !self.showlink;
                    toaster.pop('success', responce.title, responce.message);
                } else {
                    toaster.pop('error', responce.title, "There are some issues to activate your job.");
                }
            }, function () {});
        };
    }

    ActivatejobController.$inject = ["$sanitize", "$q", "Logger", "Spinner", "ActivatejobModel", "toaster"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.applyjob
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .directive('applyJob', [function () {
                    return {
                        restrict: 'EA',
                        scope: {
                            "id": "@id",
                            "userId": "@userid"
                        },
                        templateUrl: '/apps/widgets/apply-job/applyjob.html',
                        controller: 'ApplyjobController',
                        controllerAs: 'self',
                        bindToController: true, //required in 1.3+ with controllerAs
                        link: function (scope, element, iAttrs, ngModel) {}
                    };
                }]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Widgets.Factory.ApplyjobResource
     * @module BeautyCollective.Widgets
     *
     * @description
     * Implements CURD operations
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .factory('ApplyjobResource', ApplyjobResource);
    /* @ngInject */
    function ApplyjobResource($resource, APP_CONFIG) {
        return $resource('../applyjob', {}, {
            ApplyJob: {
                method: 'POST'
            },
            /************ get cover letter and resume ***************/
            getcoverltrandresume1: {
                url: 'existingclandresume',
                method: 'GET',
                transformResponse: transformGetResponse,
            },
            /************ end cover letter and resume ***************/
        });
    }

    ApplyjobResource.$inject = ["$resource", "APP_CONFIG"];

    function transformGetResponse(data, headersGetter) {
        var _response = {};
        _response.data = angular.fromJson(data);
        return angular.fromJson(_response);
    }
})();
(function () {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Widgets.Service.ApplyjobModel
     * @module BeautyCollective.Widgets
     *
     * @description
     *
     * Data model for Booking module
     * Implemenets CURD operation
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .service('ApplyjobModel', ApplyjobModel);
    /* @ngInject */
    function ApplyjobModel(ApplyjobResource) {
        var model = this;
        /**
         * [ApplyJob description]
         * @method ApplyJob
         * @author Kinectro
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */

        model.ApplyJob = function (params, success, fail) {
            return ApplyjobResource.ApplyJob(params, success, fail).$promise;
        };
        model.getcoverltrandresume1 = function () {

            return ApplyjobResource.getcoverltrandresume1().$promise;
        };
    }

    ApplyjobModel.$inject = ["ApplyjobResource"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.ApplyjobController
     * @module BeautyCollective.Widgets
     *
     * @description
     * ApplyjobController is responsible for activating job
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .controller('ApplyjobController', ApplyjobController);
    /* @ngInject */

    function ApplyjobController($sanitize, $q, Logger, Spinner, ApplyjobModel, toaster) {

        /**
         * [self description]
         * @type {[type]}
         */
        var self = this;
        self.fileName = '';
        self.coverLetter = '';
        self.img1 = "../images/plus-sign.png";
        self.img2 = "../images/minus.png";
        self.counter = 1;
        self.count = 1;
        init();
        /**
         * [init description]
         * @return {void}
         */
        function init() {
            Logger.getInstance('ApplyjobController').info('ApplyjobController Controller has initialized');
            GetMyCLandResume1();
        }
        self.toggleresume = function () {
            if (self.counter == 0) {
                var a = document.getElementById("plus_img").setAttribute("src", self.img1);
                self.counter++;
            } else {
                self.counter = 0;
                var a = document.getElementById("plus_img").setAttribute("src", self.img2);
            }

        }
        self.togglecover = function () {
            if (self.count == 0) {
                var a = document.getElementById("plus_img_cover").setAttribute("src", self.img1);
                self.count++;
            } else {
                self.count = 0;
                var a = document.getElementById("plus_img_cover").setAttribute("src", self.img2);
            }

        }
        self.flowConfig = function () {
            return {
                target: '/uploadresume',
                permanentErrors: [404, 500, 501],
                maxChunkRetries: 1,
                chunkRetryInterval: 5000,
                simultaneousUploads: 1,
                singleFile: true,
                headers: {
                    'X-CSRF-TOKEN': csrf_token
                },
                query: function (flowFile, flowChunk) {
                    Spinner.start();
                    // function will be called for every request
                    return {
                        id: self.id,
                        source: 'flow_query'
                    };
                }
            }
        };
        self.fileUploadSuccess = function ($file, $res) {
            $res = angular.fromJson($res);
            self.fileName = $res.name;
            self.fileid = $res.img_id;
            Spinner.stop();
        };
        self.cancelFile = function ($file) {
            self.fileName = '';
            $file.cancel();
            Spinner.stop();
        };
        /*******get my cover letters and resume *********/
        function GetMyCLandResume1() {
            ApplyjobModel.getcoverltrandresume1().then(function (response) {
                self.coverLetter = angular.copy(response.data);
            }, function (error) {

            });
        }

        /*******end my cover letters and resume *********/

        self.applyJob = function () {

            toaster.clear();

            var file_name = '';
            var file_id = '';
            //alert(self.fileid);

            if (self.fileid) {
                file_id = self.fileid;
            }
            if ((self.coverLetter.asset_id !== '-')) {
                file_id = self.coverLetter.asset_id;
            }

            if (self.fileName) {
                file_name = self.fileName;
            }
            if (self.coverLetter.fileName) {
                file_name = self.coverLetter.fileName;
            }

            if (self.coverLetter.cover == '') {
                toaster.pop('error', 'Please type your cover letter.');
            } else if (file_name == '') {
                toaster.pop('error', 'Please upload your resume of valid format(.pdf,.doc,.docx)');
            } else {
                Spinner.start();
                ApplyjobModel.ApplyJob({}, {
                    id: self.id,
                    //coverLetter:self.coverLetter.cover,
                    coverLetter: self.coverLetter.cover,
                    resume: file_name,
                    userId: self.userId,
                    fileId: file_id
                }).then(function (responce) {
                    Spinner.stop();
                    if (responce.status) {
                        toaster.pop('success', responce.title, responce.message);
                        var close = document.getElementById('applyjobModalClose');
                        var element = document.getElementById('applyjobModaltext');
                        if (element) {
                            element.innerText = 'Applied';
                            element.disabled = true;
                        }
                        if (close)
                            close.click();
                    } else {
                        toaster.pop('error', responce.title, responce.message);
                        console.log(responce.message);
                        var element = document.getElementById('applyjobModaltext');
                        if (element && responce.message == 'You had already been applied to this job.') {
                            var close = document.getElementById('applyjobModalClose');
                            close.click();
                            element.innerText = 'Applied';
                            element.disabled = true;
                        }
                    }
                }, function () {});
            }
        };
    }

    ApplyjobController.$inject = ["$sanitize", "$q", "Logger", "Spinner", "ApplyjobModel", "toaster"];
})();
'use strict';
angular
        .module('BeautyCollective.Widgets')
        .directive('chat', function () {
            return {
                templateUrl: '/apps/widgets/chat/chat.html',
                restrict: 'E',
                replace: true,
            };
        });
(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name Filters
     * @module BeautyCollective.Components.Filters
     *
     * @description
     * This module is a bundle of all custom filters
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Components.Filters', []);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Filter
     * @name BeautyCollective.Components.Filters.propsFilter
     * @module BeautyCollective.Components.Filters
     *
     * @description
     * propsFilter is used for ui-select component
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Components.Filters')
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
                }
            });
})();
(function () {
    'use strict';
    /**
     * @ngdoc Filter
     * @name BeautyCollective.Components.Filters.truncateWords
     * @module BeautyCollective.Components.Filters
     *
     * @description
     * truncateWords is used to truncate words by given length
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Components.Filters')
            .filter('truncateWords', function () {
                return function (input, words) {
                    if (isNaN(words)) {
                        return input;
                    }
                    if (words <= 0) {
                        return '';
                    }
                    if (input) {
                        var inputWords = input.split(/\s+/);
                        if (inputWords.length > words) {
                            input = inputWords.slice(0, words).join(' ') + '...';
                        }
                    }
                    return input;
                };
            });
})();
(function () {
    'use strict';
    /**
     * @ngdoc Filter
     * @name BeautyCollective.Components.Filters.truncateCharacters
     * @module BeautyCollective.Components.Filters
     *
     * @description
     * truncateCharacters is used to truncate Characters by given length
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Components.Filters')
            .filter('truncateCharacters', function () {
                return function (input, chars, breakOnWord) {
                    if (isNaN(chars)) {
                        return input;
                    }
                    if (chars <= 0) {
                        return '';
                    }
                    if (input && input.length > chars) {
                        input = input.substring(0, chars);
                        if (!breakOnWord) {
                            var lastspace = input.lastIndexOf(' ');
                            // Get last space
                            if (lastspace !== -1) {
                                input = input.substr(0, lastspace);
                            }
                        } else {
                            while (input.charAt(input.length - 1) === ' ') {
                                input = input.substr(0, input.length - 1);
                            }
                        }
                        return input + '...';
                    }
                    return input;
                };
            });
})();
(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Components.modal
     *
     * @module modal
     *
     * @description
     * Extends $modal service
     *
     * @author Kinectro
     */
    angular.module('BeautyCollective.Components.modal', ['ui.bootstrap']);
})();
(function () {
    'use strict';
    /**
     * @ngdoc factory
     * @name BeautyCollective.Components.modal._$modal
     *
     * @module modal
     *
     * @description
     * Extends $modal service
     *
     * @author Mohan Singh (singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
            .module('BeautyCollective.Components.modal')
            .factory('_$modal', ['$modal', function ($modal) {

                    var _modal = _modal || {},
                            defaultOptions = {
                                keyboard: true, // keyboard
                                backdrop: true, // backdrop
                                size: 'lg', // values: 'sm', 'lg', 'md'
                                windowClass: '',
                                templateUrl: 'components/modal/confirm-modal.html'
                            };
                    var _setOptions = function (opts) {
                        var _opts = {};
                        _opts = opts || {};
                        _opts.kb = (angular.isDefined(opts.keyboard)) ? opts.keyboard : defaultOptions.keyboard; // values: true,false
                        _opts.bd = (angular.isDefined(opts.backdrop)) ? opts.backdrop : defaultOptions.backdrop; // values: 'static',true,false
                        _opts.ws = (angular.isDefined(opts.size) && (angular.equals(opts.size, 'sm') || angular.equals(opts.size, 'lg') || angular.equals(opts.size, 'md'))) ? opts.size : defaultOptions.size; // values: 'sm', 'lg', 'md'
                        _opts.wc = (angular.isDefined(opts.windowClass)) ? opts.windowClass : defaultOptions.windowClass; // additional CSS class(es) to be added to a modal window
                        _opts.templateUrl = (angular.isDefined(opts.templateUrl)) ? opts.templateUrl : defaultOptions.templateUrl;
                        return _opts;
                    };
                    /**
                     * Confirm Modal
                     *
                     * @param header  string
                     * @param msg   string
                     * @param opts  object
                     */
                    _modal.confirm = function (header, msg, opts) {
                        var _opts = _setOptions(opts);
                        return $modal.open({
                            templateUrl: _opts.templateUrl,
                            controller: 'ConfirmModalController',
                            backdrop: _opts.bd,
                            keyboard: _opts.kb,
                            windowClass: _opts.wc,
                            size: _opts.ws,
                            resolve: {
                                data: function () {
                                    return {
                                        header: angular.copy(header),
                                        msg: angular.copy(msg)
                                    };
                                }
                            }
                        }); // end modal.open
                    };
                    return _modal;
                }]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Components.modal.ConfirmModalController
     *
     * @module modal
     *
     * @description
     * Handles confirm modals actions
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Components.modal')
            .controller('ConfirmModalController', ['$scope',
                '$modalInstance',
                'data',
                function ($scope, $modalInstance, data) {

                    $scope.header = (angular.isDefined(data.header) && (data.header !== '')) ? data.header : 'Please confirm';
                    $scope.msg = (angular.isDefined(data.msg)) ? data.msg : 'Do you want to perform this action?';
                    $scope.no = function () {
                        $modalInstance.dismiss('no');
                    };
                    $scope.yes = function () {
                        $modalInstance.close('yes');
                    };
                }
            ]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.widgetLogin
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Widgets')
            .directive('widgetAuth', [function () {
                    return {
                        templateUrl: '/apps/widgets/auth/auth.html',
                        restrict: 'E',
                        link: function (scope, element, iAttrs, ngModel) {

                        }
                    };
                }]);
})();
(function () {
    'use strict';
    angular.module('BeautyCollective.Widgets')
            .factory('stripeInfo', function () {
                return {
                    str_token: '',
                    str_planid: '',
                    setStrPlan: function (plid) {
                        this.str_planid = plid;
                    },
                    getStrPlan: function () {
                        return this.str_planid;
                    },
                    setStrToken: function (plid) {
                        this.str_token = plid;
                    },
                    getStrToken: function () {
                        return this.str_token;
                    }
                };
            });
})();
(function () {
    'use strict';
    angular
            .module('BeautyCollective.Widgets')
            .controller('NeedController', NeedController);

    function NeedController($scope, stripeInfo) {
        var self = $scope;
        self.str_token = "";
        self.planid = "";
        $scope.$watch('str_token', function () {
            stripeInfo.setStrToken(self.str_token);
        });
        $scope.$watch('planid', function () {
            stripeInfo.setStrPlan(self.planid);
        });
    }
    NeedController.$inject = ["$scope", "stripeInfo"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.AuthController
     * @module BeautyCollective.Widgets
     *
     * @description
     * AuthController is responsible for login implementation
     *
     * @author Kinectro
     */
//    angular
//            .module('BeautyCollective.Widgets', ['ui.bootstrap', 'ui.bootstrap.datetimepicker']);
    angular
            .module('BeautyCollective.Widgets')
            .controller('AuthController', AuthController);
    /* @ngInject */
    function AuthController($sanitize, $http, Logger, Spinner, SuburbsModel, $scope, stripeInfo, $location, AccountFactory) {
        /**
         * [self description]
         * @type {[type]}
         */
        var self = this;
        self.stripetoken = 'hello';
        self.expression = 1;
        self.showspinner = 0;
        self.maxdob = new Date();
        /**
         * [userSchema description]
         * @type {Object}
         */
        self.userSchema = {
            name: '',
            lastName: '',
            email: '',
            password: '',
            password_confirmation: '',
            contact_number: '',
            business_name: '',
            account_type: 'individual',
            suburb: '',
            locations: {
                location: 'Postcode',
                state: " or Suburb",
                postcode: ""
            },
            planid: ''
        };
        /**
         * [login description]
         * @type {Object}
         */
        self.login = {
            email: '',
            password: ''
        };
        /**
         * [error description]
         * @type {String}
         */
        self.error = '';
        /**
         * [user description]
         * @type {Object}
         */
        self.user = angular.copy(self.userSchema);
        /**
         * [account_type description]
         * @type {String}
         */
        self.user_type = '';
        /**
         * [form description]
         * @type {String}
         */
        self.form = '';
        self.suburbList = [];
        self.morebranches = 0;
        self.confirmationPassword=0;
        init();
        /**
         * [init description]
         * @return {void}
         */
        function init() {
            //            Logger.getInstance('AuthController').info('Controller has initialized');
            // self.isShown = true;
        }
        self.showerror = 0;
        self.showmsg = "";

        function showstripeerror() {
            var param1 = $location.search().msg;
            if ($location.url().indexOf('msg') > -1) {
                self.showmsg = param1;
                self.showerror = 1;
                self.changemodule = 1;
            }
        }

        var sanitizeCredentials = function (credentials) {
            return {
                email: $sanitize(credentials.email),
                password: $sanitize(credentials.password)
            };
        };
        self.authentication = function () {
            Spinner.start();
            var login = $http.post("/auth/login", sanitizeCredentials(self.login));
            login.success(function (response) {
                window.location.href = '/account';
                Spinner.stop();
            });
            login.error(function (errorResponse) {
                self.errors = formartErrors(errorResponse);
                Spinner.stop();
            });
        };
        self.getlastsegment = function () {
            var segment_value = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
            if (!isNaN(segment_value) && !angular.isNumber(segment_value)) {
                /*
                 * portion for integrater value
                 */
                return segment_value;
            } else {
                /*
                 * portion for text value
                 */
                return "1";
            }
        }
        self.couponerror = 0;
        self.registerAccount = function () {
            Spinner.start();
            if (self.havepromo == 1 && self.user.promo_code.length > 0) {
                $http.get("/checkCoupon?coupon=" + self.user.promo_code).success(function (response) {
                    if (response.status == "200") {
                        self.couponerror = 0;
                        registeruser();
                    } else {
                        self.couponerror = 1;
                        Spinner.stop();
                    }
                });
            } else {
                registeruser();
            }
        };
        function registeruser() {
            var user;
            self.user.name = self.user.name || (self.user.firstName + ' ' + self.user.lastName);
            user = angular.copy(self.user);
            if (self.user.Jobseeker) {
                user.account_type = 'job_seeker';
            } else {
                user.account_type = self.activeForm;
            }
            user.suburb = user.locations.location;
            user.state = user.locations.state;
            user.postcode = user.locations.postcode;
            user.latitude = user.locations.latitude;
            user.longitude = user.locations.longitude;
            user.planid = 2; //stripeInfo.getStrPlan();
            user.sripetoken = stripeInfo.getStrToken();
            user.accounttype = 0;
            user.hear_us = user.hear_us;
            user.sub_newletter = user.sub_newletter;
            user.other_option = user.other_option;
            user.operating_hours = JSON.stringify(AccountFactory.getDefaultBusinessHours());
            user.plan_type = 0;
            var register = $http.post("/auth/register", user);
//            var register = $http.post("/register", user);
            register.success(function (response) {
                self.errors = [];
                if (typeof response.success !== 'undefined' && response.success == false) {
                    self.errors.push(response.error);
                } else {
                    resetForm();
                    self.successMsg = 'Your account was successfully created. We have sent you an e-mail to confirm your account';
                    window.location = site_url() + 'account';
                }
                Spinner.stop();
            });
            register.error(function (errorResponse) {
                console.log(errorResponse);
                self.errors = formartErrors(errorResponse);
                self.successMsg = '';
                Spinner.stop();
            });
        }
        function formartErrors(errors) {
            var errorLabels = [];
            if (angular.isObject(errors) && !errors.hasOwnProperty('success')) {
                for (var error in errors) {
                    if (angular.isObject(errors[error])) {
                        console.log(errors[error]);
                        for (var values in errors[error]) {
                            if (angular.isArray(errors[error][values])) {
                                for (var i = 0; i < errors[error][values].length; i++) {
                                    errorLabels.push(errors[error][values][i]);
                                }
                                ;
                            }

                        }
                    } else {
                        console.log(errors[error]);
                    }
                }
            }
            if (errors.hasOwnProperty('success')) {
                if (errors.hasOwnProperty('error')) {
                    errorLabels.push(errors.error);
                }
            }
            return errorLabels;
        }
        self.testfunction = function (abc) {            
        };

        /**
         * [dropdown description]
         * @type {Object}
         */
        self.dropdown = {
            login: {
                isopen: false,
                toggle: function () {
                    resetForm();
                    resetFlash();
                },
                toggleDropdown: function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    self.dropdown.login.isopen = !self.dropdown.login.isopen;
                }
            },
            register: {
                isopen: false,
                toggle: function () {
                    resetForm();
                    resetFlash();
                },
                toggleDropdown: function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    self.dropdown.register.isopen = !self.dropdown.register.isopen;
                }
            }

        };
        self.setUserType = function (userType) {
            resetForm();
            self.user_type = userType;
            self.user.account_type = userType;
        };

        function resetForm() {
            self.user = angular.copy(self.userSchema);
            self.userRegister ? self.userRegister.$setPristine() : angular.noop;
            self.userLogin ? self.userLogin.$setPristine() : angular.noop;
        }

        function resetFlash() {
            self.errors = [];
            self.successMsg = '';
        }

        self.likeme = function () {
            alert(likeme);
        }

        /**
         * [selectForm description]
         * @param  {[type]} formName [description]
         * @return {[type]}          [description]
         */
        self.selectForm = function (formName) {
            self.activeForm = formName;
            resetForm();
            resetFlash();
        };
        /**
         * @param  {[type]}
         * @return {[type]}
         */
        self.getLocation = function (val) {

            if (val.length < 4) {
                return;
            }
//            Spinner.start('search_location');
            self.suburbList = [];
            self.showspinner = 1;
            SuburbsModel
                    .findLocation({
                        'q': val
                    }).then(function (successResponse) {
                self.suburbList = successResponse.list;
                self.showspinner = 0;
//                Spinner.stop('search_location');
            }, function (errorResponse) {
//                Spinner.stop('search_location');
                self.showspinner = 0;
            });
        };
        self.modelOptions = {
            debounce: {
                default: 500
            },
            getterSetter: true
        };
        
        self.onBlurConfirmPassword= function(password,confirmPassword){
            if(password!==confirmPassword){
                self.confirmationPassword=1;                
            }else{
                self.confirmationPassword=0;                
            }
        }
    }

    AuthController.$inject = ["$sanitize", "$http", "Logger", "Spinner", "SuburbsModel", "$scope", "stripeInfo", "$location", "AccountFactory"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Core.main.Factory.utilFactory
     * @module BeautyCollective.Core
     *
     * @description
     * util factory contains all generic methods
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Core')
            .factory('utilFactory', utilFactory)
            .filter('parseDate', function () {
                return function (value) {
                    return Date.parse(value);
                };
            });
    ;
    /* @ngInject */
    function utilFactory() {
        var util = {},
                bgColors;
        /**
         * [getBgColors description]
         * @method getBgColors
         * @author Kinectro
         * @return {[type]}    [description]
         */
        util.getBgColors = function () {
            return bgColors;
        };
        /**
         * [getStatus description]
         * @method getStatus
         * @author Kinectro
         * @param  {[type]}  statusCode [description]
         * @return {[type]}             [description]
         */
        util.getStatus = function (statusCode) {
            var colorCode = '',
                    _statusCode = angular.isDefined(statusCode) ? statusCode.toLowerCase() : '',
                    label;
            switch (_statusCode) {
                case 'ontrack':
                    colorCode = 'success';
                    label = 'On Track';
                    break;
                case 'aheadoftrack':
                    colorCode = 'blue';
                    label = 'Ahead Of Track';
                    break;
                case 'behindtrack':
                    colorCode = 'danger';
                    label = 'Behind Track';
                    break;
                case 'notstarted':
                    colorCode = 'danger';
                    label = 'Not Started';
                    break;
            }
            return {
                colorCode: colorCode,
                label: label
            };
        };
        /**
         * [getNotificationTypeLable description]
         * @method getNotificationTypeLable
         * @author Kinectro
         * @param  {[type]}                 eventType [description]
         * @return {[type]}                           [description]
         */
        util.getNotificationTypeLable = function (eventType) {
            var notificationLable = '';
            switch (eventType) {
                case 0:
                    notificationLable = 'added';
                    break;
                case 1:
                    notificationLable = 'updated';
                    break;
            }
            return notificationLable;
        };
        /**
         * [getFileType description]
         * @method getFileType
         * @author Kinectro
         * @param  {[type]}  fileType [description]
         * @return {Boolean}          [description]
         */
        util.getFileType = function (fileType) {
            var _imageTypes = ['jpg', 'gif', 'png', 'bmp', 'jpeg', 'tif'],
                    _videoTypes = ['3g2', '3gp', 'asf', 'asx', 'avi', 'flv', 'mov', 'mp4', 'mpg', 'rm', 'swf', 'vob', 'wmv'],
                    _fileString;
            if (!fileType) {
                fileType = '';
            }

            var _fileType = fileType.toLowerCase();
            if (_imageTypes.indexOf(_fileType) >= 0) {
                return {
                    'type': 'image',
                    'icon': 'fa fa-camera bg-purple'
                };
            } else if (_videoTypes.indexOf(_fileType) >= 0) {
                return {
                    'type': 'video',
                    'icon': 'fa fa-video-camera bg-maroon'
                };
            } else {
                return {
                    'type': 'doc',
                    'icon': 'fa fa-file-code-o bg-green'
                };
            }
        };
        /**
         * addTime
         * helper function to add time in given date
         * @param {[type]} date [description]
         */
        util.addTime = function (date) {
            date.hours(moment().hours());
            date.minutes(moment().minutes());
            date.seconds(moment().seconds());
            date.milliseconds(moment().milliseconds());
            return date;
        };
        util.getCurrentUtcDate = function () {
            return moment.utc().format('YYYY-MM-DD HH:mm:ss');
        };
        util.readCookie = function (name) {
            var cookie_start = document.cookie.indexOf(name);
            var cookie_end = document.cookie.indexOf(";", cookie_start);
            return cookie_start == -1 ? '' : decodeURIComponent(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
        };
        return util;
    }
})();
'use strict';
angular.module('BeautyCollective')
        .service('ParseLinks', function () {
            this.parse = function (header) {
                if (0 === header.length) {
                    throw new Error('input must not be of zero length');
                }

                // Split parts by comma
                var parts = header.split(',');
                var links = {};
                // Parse each part into a named link
                angular.forEach(parts, function (p) {
                    var section = p.split(';');
                    if (2 !== section.length) {
                        throw new Error('section could not be split on \';\'');
                    }
                    var url = section[0].replace(/<(.*)>/, '$1').trim();
                    var queryString = {};
                    url.replace(
                            new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
                            function ($0, $1, $2, $3) {
                                queryString[$1] = $3;
                            }
                    );
                    var page = queryString.page;
                    if (angular.isString(page)) {
                        page = parseInt(page);
                    }
                    var name = section[1].replace(/rel='(.*)'/, '$1').trim();
                    links[name] = page;
                });
                return links;
            };
        });
/*jshint bitwise: false*/
'use strict';
angular.module('BeautyCollective')
        .service('Base64', function () {
            var keyStr = 'ABCDEFGHIJKLMNOP' +
                    'QRSTUVWXYZabcdef' +
                    'ghijklmnopqrstuv' +
                    'wxyz0123456789+/' +
                    '=';
            this.encode = function (input) {
                var output = '',
                        chr1, chr2, chr3 = '',
                        enc1, enc2, enc3, enc4 = '',
                        i = 0;
                while (i < input.length) {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);
                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;
                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                            keyStr.charAt(enc1) +
                            keyStr.charAt(enc2) +
                            keyStr.charAt(enc3) +
                            keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = '';
                    enc1 = enc2 = enc3 = enc4 = '';
                }

                return output;
            };
            this.decode = function (input) {
                var output = '',
                        chr1, chr2, chr3 = '',
                        enc1, enc2, enc3, enc4 = '',
                        i = 0;
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
                while (i < input.length) {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));
                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;
                    output = output + String.fromCharCode(chr1);
                    if (enc3 !== 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 !== 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = '';
                    enc1 = enc2 = enc3 = enc4 = '';
                }
            };
        })
        .factory('StorageService', ["$window", function ($window) {
                return {

                    get: function (key) {
                        return JSON.parse($window.localStorage.getItem(key));
                    },
                    save: function (key, data) {
                        $window.localStorage.setItem(key, JSON.stringify(data));
                    },
                    remove: function (key) {
                        $window.localStorage.removeItem(key);
                    },
                    clearAll: function () {
                        $window.localStorage.clear();
                    }
                };
            }]);
// Generated by CoffeeScript 1.7.1
(function () {
    'use strict';
    var MODULE_NAME, SLIDER_TAG, angularize, contain, events, gap, halfWidth, hide, module, offset, offsetLeft,
            pixelize, qualifiedDirectiveDefinition, roundStep, show, sliderDirective, width;
    MODULE_NAME = 'ui.slider';
    SLIDER_TAG = 'slider';
    angularize = function (element) {
        return angular.element(element);
    };
    pixelize = function (position) {
        return '' + position + 'px';
    };
    hide = function (element) {
        return element.css({
            opacity: 0
        });
    };
    show = function (element) {
        return element.css({
            opacity: 1
        });
    };
    offset = function (element, position) {
        return element.css({
            left: position
        });
    };
    halfWidth = function (element) {
        return element[0].offsetWidth / 2;
    };
    offsetLeft = function (element) {
        return element[0].offsetLeft;
    };
    width = function (element) {
        return element[0].offsetWidth;
    };
    gap = function (element1, element2) {
        return offsetLeft(element2) - offsetLeft(element1) - width(element1);
    };
    contain = function (value) {
        if (isNaN(value)) {
            return value;
        }
        return Math.min(Math.max(0, value), 100);
    };
    roundStep = function (value, precision, step, floor) {
        var decimals, remainder, roundedValue, steppedValue;
        if (floor === null) {
            floor = 0;
        }
        if (step === null) {
            step = 1 / Math.pow(10, precision);
        }
        remainder = (value - floor) % step;
        steppedValue = remainder > (step / 2) ? value + step - remainder : value - remainder;
        decimals = Math.pow(10, precision);
        roundedValue = steppedValue * decimals / decimals;
        return parseFloat(roundedValue.toFixed(precision));
    };
    events = {
        mouse: {
            start: 'mousedown',
            move: 'mousemove',
            end: 'mouseup'
        },
        touch: {
            start: 'touchstart',
            move: 'touchmove',
            end: 'touchend'
        }
    };
    sliderDirective = function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                floor: '@',
                ceiling: '@',
                values: '=?',
                step: '@',
                highlight: '@',
                precision: '@',
                buffer: '@',
                dragstop: '@',
                ngModel: '=?',
                disabled: '=?',
                ngModelLow: '=?',
                ngModelHigh: '=?'
            },
            template: '<div class="bar"><div class="selection"/></div>\n<div class="handle low"/><div class="handle high"/>\n<div class="bubble limit low">{{ values.length ? values[floor || 0] : floor }}</div>\n<div class="bubble limit high">{{ values.length ? values[ceiling || values.length - 1] : ceiling }}</div>\n<div class="bubble value low">{{ values.length ? values[local.ngModelLow || local.ngModel || 0] : local.ngModelLow || local.ngModel || 0 }}</div>\n<div class="bubble value high">{{ values.length ? values[local.ngModelHigh] : local.ngModelHigh }}</div>',
            compile: function (element, attributes) {
                var high, low, range, watchables;
                range = (attributes.ngModel === null) && (attributes.ngModelLow !== null) && (attributes.ngModelHigh !== null);
                low = range ? 'ngModelLow' : 'ngModel';
                high = 'ngModelHigh';
                watchables = ['floor', 'ceiling', 'values', low];
                if (range) {
                    watchables.push(high);
                }
                return {
                    post: function (scope, element, attributes) {
                        var bar, barWidth, bound, ceilBub, dimensions, e, flrBub, handleHalfWidth, highBub, lowBub,
                                maxOffset, maxPtr, maxValue, minOffset, minPtr, minValue, ngDocument, offsetRange,
                                selection, updateDOM, upper, valueRange, w, _i, _j, _len, _len1, _ref, _ref1;
                        _ref = (function () {
                            var _i, _len, _ref, _results;
                            _ref = element.children();
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                e = _ref[_i];
                                _results.push(angularize(e));
                            }
                            return _results;
                        })();
                        bar = _ref[0];
                        minPtr = _ref[1];
                        maxPtr = _ref[2];
                        flrBub = _ref[3];
                        ceilBub = _ref[4];
                        lowBub = _ref[5];
                        highBub = _ref[6];
                        selection = angularize(bar.children()[0]);
                        if (!range) {
                            _ref1 = [maxPtr, highBub];
                            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                                upper = _ref1[_i];
                                upper.remove();
                            }
                            if (!attributes.highlight) {
                                selection.remove();
                            }
                        }
                        scope.local = {};
                        scope.local[low] = scope[low];
                        scope.local[high] = scope[high];
                        bound = false;
                        ngDocument = angularize(document);
                        handleHalfWidth = barWidth = minOffset = maxOffset = minValue = maxValue = valueRange = offsetRange = void 0;
                        dimensions = function () {
                            var value, _j, _len1, _ref2;
                            if (scope.step === null) {
                                scope.step = 1;
                            }
                            if (scope.floor === null) {
                                scope.floor = 0;
                            }
                            if (scope.precision === null) {
                                scope.precision = 0;
                            }
                            if (!range) {
                                scope.ngModelLow = scope.ngModel;
                            }
                            if ((_ref2 = scope.values) !== null ? _ref2.length : void 0) {
                                if (scope.ceiling === null) {
                                    scope.ceiling = scope.values.length - 1;
                                }
                            }
                            scope.local[low] = scope[low];
                            scope.local[high] = scope[high];
                            for (_j = 0, _len1 = watchables.length; _j < _len1; _j++) {
                                value = watchables[_j];
                                if (typeof value === 'number') {
                                    scope[value] = roundStep(parseFloat(scope[value]), parseInt(scope.precision), parseFloat(scope.step), parseFloat(scope.floor));
                                }
                            }
                            handleHalfWidth = halfWidth(minPtr);
                            barWidth = width(bar);
                            minOffset = 0;
                            maxOffset = barWidth - width(minPtr);
                            minValue = parseFloat(scope.floor);
                            maxValue = parseFloat(scope.ceiling);
                            valueRange = maxValue - minValue;
                            offsetRange = maxOffset - minOffset;
                            return offsetRange;
                        };
                        updateDOM = function () {
                            var bind, percentOffset, percentValue, pixelsToOffset, setBindings, setPointers;
                            dimensions();
                            percentOffset = function (offset) {
                                return contain(((offset - minOffset) / offsetRange) * 100);
                            };
                            percentValue = function (value) {
                                return contain(((value - minValue) / valueRange) * 100);
                            };
                            pixelsToOffset = function (percent) {
                                return pixelize(percent * offsetRange / 100);
                            };
                            setPointers = function () {
                                var newHighValue, newLowValue;
                                offset(ceilBub, pixelize(barWidth - width(ceilBub)));
                                newLowValue = percentValue(scope.local[low]);
                                offset(minPtr, pixelsToOffset(newLowValue));
                                offset(lowBub, pixelize(offsetLeft(minPtr) - (halfWidth(lowBub)) + handleHalfWidth));
                                offset(selection, pixelize(offsetLeft(minPtr) + handleHalfWidth));
                                switch (true) {
                                    case range:
                                        newHighValue = percentValue(scope.local[high]);
                                        offset(maxPtr, pixelsToOffset(newHighValue));
                                        offset(highBub, pixelize(offsetLeft(maxPtr) - (halfWidth(highBub)) + handleHalfWidth));
                                        return selection.css({
                                            width: pixelsToOffset(newHighValue - newLowValue)
                                        });
                                    case attributes.highlight === 'right':
                                        return selection.css({
                                            width: pixelsToOffset(110 - newLowValue)
                                        });
                                    case attributes.highlight === 'left':
                                        selection.css({
                                            width: pixelsToOffset(newLowValue)
                                        });
                                        return offset(selection, 0);
                                }
                            };
                            bind = function (handle, bubble, ref, events) {
                                var currentRef, onEnd, onMove, onStart;
                                currentRef = ref;
                                onEnd = function () {
                                    bubble.removeClass('active');
                                    handle.removeClass('active');
                                    ngDocument.unbind(events.move);
                                    ngDocument.unbind(events.end);
                                    if (scope.dragstop) {
                                        scope[high] = scope.local[high];
                                        scope[low] = scope.local[low];
                                    }
                                    currentRef = ref;
                                    return scope.$apply();
                                };
                                onMove = function (event) {
                                    var eventX, newOffset, newPercent, newValue, _ref2, _ref3, _ref4, _ref5;
                                    eventX = event.clientX || ((_ref2 = event.touches) !== null ? (_ref3 = _ref2[0]) !== null ? _ref3.clientX : void 0 : void 0) || ((_ref4 = event.originalEvent) !== null ? (_ref5 = _ref4.changedTouches) !== null ? _ref5[0].clientX : void 0 : void 0) || 0;
                                    newOffset = eventX - element[0].getBoundingClientRect().left - handleHalfWidth;
                                    newOffset = Math.max(Math.min(newOffset, maxOffset), minOffset);
                                    newPercent = percentOffset(newOffset);
                                    newValue = minValue + (valueRange * newPercent / 100.0);
                                    if (range) {
                                        switch (currentRef) {
                                            case low:
                                                if (newValue > scope.local[high]) {
                                                    currentRef = high;
                                                    minPtr.removeClass('active');
                                                    lowBub.removeClass('active');
                                                    maxPtr.addClass('active');
                                                    highBub.addClass('active');
                                                    setPointers();
                                                } else if (scope.buffer > 0) {
                                                    newValue = Math.min(newValue, scope.local[high] - scope.buffer);
                                                }
                                                break;
                                            case high:
                                                if (newValue < scope.local[low]) {
                                                    currentRef = low;
                                                    maxPtr.removeClass('active');
                                                    highBub.removeClass('active');
                                                    minPtr.addClass('active');
                                                    lowBub.addClass('active');
                                                    setPointers();
                                                } else if (scope.buffer > 0) {
                                                    newValue = Math.max(newValue, parseInt(scope.local[low]) + parseInt(scope.buffer));
                                                }
                                        }
                                    }
                                    newValue = roundStep(newValue, parseInt(scope.precision), parseFloat(scope.step), parseFloat(scope.floor));
                                    scope.local[currentRef] = newValue;
                                    if (!scope.dragstop) {
                                        scope[currentRef] = newValue;
                                    }
                                    setPointers();
                                    return scope.$apply();
                                };
                                onStart = function (event) {
                                    if (scope.disabled) {
                                        handle.addClass('disabled');
                                        return;
                                    } else {
                                        if (handle.hasClass('disabled')) {
                                            handle.removeClass('disabled');
                                        }
                                    }
                                    dimensions();
                                    bubble.addClass('active');
                                    handle.addClass('active');
                                    setPointers();
                                    event.stopPropagation();
                                    event.preventDefault();
                                    ngDocument.bind(events.move, onMove);
                                    return ngDocument.bind(events.end, onEnd);
                                };
                                return handle.bind(events.start, onStart);
                            };
                            setBindings = function () {
                                var method, _j, _len1, _ref2;
                                _ref2 = ['touch', 'mouse'];
                                for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                                    method = _ref2[_j];
                                    bind(minPtr, lowBub, low, events[method]);
                                    bind(maxPtr, highBub, high, events[method]);
                                }
                                bound = true;
                                return bound;
                            };
                            if (!bound) {
                                setBindings();
                            }
                            return setPointers();
                        };
                        $timeout(updateDOM);
                        for (_j = 0, _len1 = watchables.length; _j < _len1; _j++) {
                            w = watchables[_j];
                            scope.$watch(w, updateDOM, true);
                        }
                        return window.addEventListener('resize', updateDOM);
                    }
                };
            }
        };
    };
    qualifiedDirectiveDefinition = ['$timeout', sliderDirective];
    module = function (window, angular) {
        return angular.module(MODULE_NAME, []).directive(SLIDER_TAG, qualifiedDirectiveDefinition);
    };
    module(window, window.angular);
}).call(this);
(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name FancyDropDown
     * @module FancyDropDown
     *
     * @description
     * Has custom implementation of dropdowns built by angular UI Team
     *
     * @author Kinectro
     */

    angular
            .module('FancyDropDown', []);
    /**
     * @ngdoc Directive
     * @name FancyDropDown.Directive.fancyDropdown
     * @module FancyDropDown
     *
     * @description
     * Adjust dropdown up/down by determining the window offsets
     *
     * Example
     *  <div dropdown="" keyboard-nav="" fancy-dropdown close-on-select="false">
     <a href="" id="choiceDropdown" name="choiceDropdown" dropdown-toggle="dropdown">
     Click me for a dropdown, yo!  {{ self.selection1.Text }}
     </a>
     <div class="panel panel-default dropdown-menu fancy-dropdown" role="menu" aria-labelledby="simple-btn-keyboard-nav">
     <div class="panel-heading dropdown-heading">
     <span>Select team member</span>
     </div>
     <div class="panel-heading dropdown-filter">
     <input type="text" class="form-control" placeholder="Text input" ng-model="query" />
     </div>
     <div class="panel-body dropdown-body">
     <ul class="list-group">
     <li class="list-group-item" ng-repeat="choice in self.choices | filter:query" role="menuitem" ng-class="{ 'selected-dropdown-item' : choice.ID == self.selection1.ID }">
     <a href="#" ng-click="self.setChoice(choice.ID)">{{ choice.Text }}</a>
     </li>
     </ul>
     </div>
     </div>
     </div>
     * self is your controller alias instead of using scope in controller
     *
     * @author Kinectro
     */
    angular
            .module('FancyDropDown')
            .directive('fancyDropdown', fancyDropdownDirective);
    /* @ngInject */
    function fancyDropdownDirective() {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, element, attrs) {
                var isDropUp = false,
                        closeOnSelect = attrs.closeOnSelect || true;
                element.bind('click', ToggleDropUp)

                function ToggleDropUp($event) {
                    var dropdownContainer = $event.currentTarget,
                            position = dropdownContainer.getBoundingClientRect().top,
                            buttonHeight = dropdownContainer.getBoundingClientRect().height,
                            dropdownMenu = angular.element(dropdownContainer).find('.dropdown-menu'),
                            menuHeight = dropdownMenu.outerHeight(),
                            $win = $(window);
                    if (position > menuHeight && $win.height() - position < buttonHeight + menuHeight) {
                        isDropUp = true;
                    } else {
                        isDropUp = false;
                    }
                    isDropUp ? element.addClass('dropup') : (element.hasClass('dropup') ? element.removeClass('dropup') : '');
                    if (closeOnSelect) {
                        $event.stopPropagation();
                    }

                }
            }
        };
    }
}());
(function () {
    'use strict';
    /*
     * AngularJS Notify
     * Version: 0.4.12
     *
     * Copyright 2015-2016 Jiri Kavulak.
     * All Rights Reserved.
     * Use, reproduction, distribution, and modification of this code is subject to the terms and
     * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
     *
     * Author: Mohan Singh <singhmohancs@gmail.com>
     */

    angular
            .module('ngNotify', []);
    angular
            .module('ngNotify')
            .factory('notify', ['$timeout', '$http', '$compile', '$templateCache', '$rootScope', '$document',
                function ($timeout, $http, $compile, $templateCache, $rootScope, $document) {
                    var _this = this;
                    var startTop = 5;
                    var verticalSpacing = 15;
                    var duration = 10000;
                    var defaultTemplateUrl = 'components/notify/notify.html';
                    var position = 'right';
                    var container = $document[0].body;
                    _this.positionClass = 'notify-top-right';
                    var messageElements = [];
                    var notify = function (args) {
                        _this.type = _this.type || args.type;
                        if (typeof args !== 'object') {
                            args = {
                                message: args
                            };
                        }
                        args.templateUrl = args.templateUrl ? args.templateUrl : defaultTemplateUrl;
                        args.position = args.position ? args.position : position;
                        args.container = args.container ? args.container : container;
                        args.classes = args.classes ? args.classes : _this.positionClass;
                        args.title = args.title ? args.title : (_this.title || 'Notification');
                        var scope = args.scope ? args.scope.$new() : $rootScope.$new();
                        scope.$message = args.message;
                        scope.$classes = args.classes;
                        scope.$messageTemplate = args.messageTemplate;
                        scope.$type = _this.type;
                        scope.$title = args.title;
                        $http.get(args.templateUrl, {
                            cache: $templateCache
                        }).success(function (template) {

                            var templateElement = $compile(template)(scope);
                            templateElement.bind('webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd', function (e) {
                                if (e.propertyName === 'opacity' || e.currentTarget.style.opacity === 0 ||
                                        (e.originalEvent && e.originalEvent.propertyName === 'opacity')) {

                                    templateElement.remove();
                                    messageElements.splice(messageElements.indexOf(templateElement), 1);
                                    layoutMessages();
                                }
                            });
                            if (args.messageTemplate) {
                                var messageTemplateElement;
                                for (var i = 0; i < templateElement.children().length; i++) {
                                    if (angular.element(templateElement.children()[i]).hasClass('cg-notify-message-template')) {
                                        messageTemplateElement = angular.element(templateElement.children()[i]);
                                        break;
                                    }
                                }
                                if (messageTemplateElement) {
                                    messageTemplateElement.append($compile(args.messageTemplate)(scope));
                                } else {
                                    throw new Error('cgNotify could not find the .cg-notify-message-template element in ' + args.templateUrl + '.');
                                }
                            }

                            angular.element(args.container).append(templateElement);
                            messageElements.push(templateElement);
                            if (args.position === 'center') {
                                $timeout(function () {
                                    templateElement.css('margin-left', '-' + (templateElement[0].offsetWidth / 2) + 'px');
                                });
                            }

                            scope.$close = function () {
                                templateElement.remove();
                                layoutMessages();
                            };
                            var layoutMessages = function () {
                                var j = 0;
                                var currentY = startTop;
                                for (var i = messageElements.length - 1; i >= 0; i--) {
                                    var shadowHeight = 10;
                                    var element = messageElements[i];
                                    var height = element[0].offsetHeight;
                                    var top = currentY + height + shadowHeight;
                                    if (element.attr('data-closing')) {
                                        top += 20;
                                    } else {
                                        currentY += height + verticalSpacing;
                                    }
                                    element.css('top', top + 'px').css('margin-top', '-' + (height + shadowHeight) + 'px').css('visibility', 'visible');
                                    j++;
                                }
                            };
                            $timeout(function () {
                                layoutMessages();
                            });
                            if (duration > 0) {
                                $timeout(function () {
                                    scope.$close();
                                }, duration);
                            }

                        }).error(function (data) {
                            throw new Error('Template specified for cgNotify (' + args.templateUrl + ') could not be loaded. ' + data);
                        });
                        var retVal = {};
                        retVal.close = function () {
                            if (scope.$close) {
                                scope.$close();
                            }
                        };
                        Object.defineProperty(retVal, 'message', {
                            get: function () {
                                return scope.$message;
                            },
                            set: function (val) {
                                scope.$message = val;
                            }
                        });
                        return retVal;
                    };
                    /**
                     * addNewNotifyEvent Event handler which is captured
                     *
                     * @author Kinectro
                     * @param  {Object} $event Captured event data
                     * @return {Object} args Data which is attached to addNewNotify event
                     */
                    var addNewNotifyEvent = $rootScope.$on('addNewNotify', function ($event, args) {
                        notify.error(args);
                    });
                    /**
                     * Remove event from $rootScope
                     */
                    $rootScope.$on('$destroy', addNewNotifyEvent);
                    /**
                     * config Sets Notify congigurations
                     * @method config
                     *
                     * @author Kinectro
                     * @param  {Object} args A object which holds configuration of Notify
                     * @return {Void}
                     */
                    notify.config = function (args) {
                        startTop = !angular.isUndefined(args.startTop) ? args.startTop : startTop;
                        verticalSpacing = !angular.isUndefined(args.verticalSpacing) ? args.verticalSpacing : verticalSpacing;
                        duration = !angular.isUndefined(args.duration) ? args.duration : duration;
                        defaultTemplateUrl = args.templateUrl ? args.templateUrl : defaultTemplateUrl;
                        position = !angular.isUndefined(args.position) ? args.position : position;
                        container = args.container ? args.container : container;
                        _this.positionClass = args.positionClass ? args.positionClass : 'notify-top-right';
                    };
                    /**
                     * Close all opened Notifications
                     * @method closeAll
                     *
                     * @author Kinectro
                     * @return {Void}
                     */
                    notify.closeAll = function () {
                        for (var i = messageElements.length - 1; i >= 0; i--) {
                            var element = messageElements[i];
                            element.css('opacity', 0);
                        }
                    };
                    /**
                     * A success notification
                     * @method success
                     *
                     * @author Kinectro
                     * @param  {Object} args [title,message,type...etc]
                     * @return {Void}
                     */
                    notify.success = function success(args) {
                        _this.type = 'notify-success';
                        _this.title = 'Success';
                        notify(args);
                    };
                    /**
                     * A information notification
                     * @method info
                     *
                     * @author Kinectro
                     * @param  {Object} args [title,message,type...etc]
                     * @return {Void}
                     */
                    notify.info = function info(args) {
                        _this.type = 'notify-info';
                        _this.title = 'Information';
                        notify(args);
                    };
                    /**
                     * A error notification
                     * @method error
                     *
                     * @author Kinectro
                     * @param  {Object} args [title,message,type...etc]
                     * @return {Void}
                     */
                    notify.error = function error(args) {
                        _this.type = 'notify-error';
                        _this.title = 'Error';
                        notify(args);
                    };
                    /**
                     * A warning notification
                     * @method warning
                     *
                     * @author Kinectro
                     * @param  {Object} args [title,message,type...etc]
                     * @return {Void}
                     */
                    notify.warning = function warning(args) {
                        _this.type = 'notify-warning';
                        _this.title = 'Warning';
                        notify(args);
                    };
                    /**
                     * A wait notification
                     * @method wait
                     *
                     * @author Kinectro
                     * @param  {Object} args [title,message,type...etc]
                     * @return {Void}
                     */
                    notify.wait = function wait(args) {
                        _this.type = 'notify-wait';
                        _this.title = 'Please wait';
                        notify(args);
                    };
                    return notify;
                }
            ]);
})(window, document);
(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name PasswordStrength
     * @module PasswordStrength
     *
     * @description
     * This is an independed module. This module supplly password strength checker
     * set field validatity 'strength'
     *
     * @author Kinectro
     */

    angular
            .module('PasswordStrength', []);
    /**
     * @ngdoc Factory
     * @name PasswordStrength.Factory.StrongPass
     * @module PasswordStrength
     *
     * @description
     * Helper factory for password strength directive
     *
     * Usage :
     * <input type="password" password-strength />
     *
     * @author Kinectro
     */
    angular
            .module('PasswordStrength')
            .factory('StrongPass', StrongPassFactory);
    /** @ngInject */
    function StrongPassFactory() {

        var StrongPass = {
            options: {

                minChar: 6, // too short while less than this

                passIndex: 2, // Weak

                // output verdicts, colours and bar %
                label: 'Password strength: ',
                verdicts: [
                    'Too Short',
                    'Very weak',
                    'Weak',
                    'Good',
                    'Strong',
                    'Very strong'
                ],
                colors: [
                    '#ccc',
                    '#500',
                    '#800',
                    '#f60',
                    '#050',
                    '#0f0'
                ],
                width: [
                    '0%',
                    '10%',
                    '30%',
                    '60%',
                    '80%',
                    '100%'
                ],
                // tweak scores here
                scores: [
                    10,
                    15,
                    25,
                    45
                ],
                // when in banned list, verdict is:
                bannedPass: 'Not allowed',
                // styles
                passStrengthZen: 'div.pass-container',
                passbarClassZen: 'div.pass-bar', // css controls

                passbarHintZen: 'div.pass-hint',
                // output
                render: true, // it can just report for your own implementation

                injectTarget: null,
                injectPlacement: 'after',
                barWidth: '200px'
            },
            bannedPasswords: [
                '123456',
                '12345',
                '123456789',
                'password',
                'iloveyou',
                'princess',
                'rockyou',
                '1234567',
                '12345678',
                'abc123',
                'nicole',
                'daniel',
                'babygirl',
                'monkey',
                'jessica',
                'lovely',
                'michael',
                'ashley',
                '654321',
                'qwerty',
                'password1',
                'welcome',
                'welcome1',
                'password2',
                'password01',
                'password3',
                'p@ssw0rd',
                'passw0rd',
                'password4',
                'password123',
                'summer09',
                'password6',
                'password7',
                'password9',
                'password8',
                'welcome2',
                'welcome01',
                'winter12',
                'spring2012',
                'summer12',
                'summer2012'
            ],
            /**
             * @constructor
             * @param {DOMElement} element Base element to attach to
             * @param {Object} options* Options to merge in / attach events from
             * @fires StrongPass#ready
             * @returns SrongPass
             */
            initialize: function (element, options) {
                this.setOptions(options);
                this.element = element;
                this.options.render && this.createBox();
                this.attachEvents();
            },
            setOptions: function (options) {
                angular.extend(this.options, options);
            },
            /**
             * @description Attaches events and saves a reference
             * @returns {StrongPass}
             */
            attachEvents: function () {
                // only attach events once so freshen
                this.element.on('keyup', function (event) {
                    this.runPassword()
                }.bind(this));
                return this;
            },
            /**
             * @description Attaches pass elements.
             * @returns {StrongPass}
             */
            createBox: function () {
                //todo: should be templated
                var o = this.options;
                var template = '<div class="pass-container" style="width: ' + o.barWidth + ';"><div class="pass-bar"/><div class="pass-hint"/></div>';
                this.element.after(template);
                this.pass_container = this.element.next();
                //hide container by default
                this.pass_container.hide();
                this.txtbox = this.pass_container.find(o.passbarHintZen);
                this.stdbar = this.pass_container.find(o.passbarClassZen);
                return this;
            },
            /**
             * @description Runs a password check on the keyup event
             * @param {Object} event*
             * @param {String} password* Optionally pass a string or go to element getter
             * @fires StrongPass#fail StrongPass#pass
             * @returns {StrongPass}
             */
            runPassword: function (event, password) {
                password = password || this.element.val();
                var score = this.checkPassword(password),
                        index = 0,
                        o = this.options,
                        s = angular.copy(o.scores),
                        verdict;
                this.displayContianer(password);
                if (this.bannedPasswords.indexOf(password.toLowerCase()) !== -1) {
                    verdict = o.bannedPass;
                } else {
                    if (score < 0 && score > -199) {
                        index = 0;
                    } else {
                        s.push(score);
                        s.sort(function (a, b) {
                            return a - b;
                        });
                        index = s.indexOf(score) + 1;
                    }

                    verdict = o.verdicts[index] || o.verdicts.getLast();
                }

                if (o.render) {
                    this.txtbox.text([o.label, verdict].join(''));
                    this.stdbar.css({
                        width: o.width[index] || o.width.getLast(),
                        background: o.colors[index] || o.colors.getLast()
                    });
                }

                /**
                 * @event StrongPass#fail,StrongPass#pass
                 */
                this.passed = (o.verdicts.indexOf(verdict) >= o.passIndex);
                if (this.passed && o.onPass) {
                    o.onPass(index, verdict);
                } else if (!this.passed && o.onFail) {
                    o.onFail(index, verdict)
                }

            },
            displayContianer: function (password) {
                if (password) {
                    this.pass_container.show();
                    return;
                }
                this.pass_container.hide();
            },
            /**
             * @type {Array}
             * @description The collection of regex checks and how much they affect the scoring
             */
            checks: [
                /* alphaLower */
                {
                    re: /[a-z]/,
                    score: 1
                },
                /* alphaUpper */
                {
                    re: /[A-Z]/,
                    score: 5
                },
                /* mixture of upper and lowercase */
                {
                    re: /([a-z].*[A-Z])|([A-Z].*[a-z])/,
                    score: 2
                },
                /* threeNumbers */
                {
                    re: /(.*[0-9].*[0-9].*[0-9])/,
                    score: 7
                },
                /* special chars */
                {
                    re: /.[!@#$%^&*?_~]/,
                    score: 5
                },
                /* multiple special chars */
                {
                    re: /(.*[!@#$%^&*?_~].*[!@#$%^&*?_~])/,
                    score: 7
                },
                /* all together now, does it look nice? */
                {
                    re: /([a-zA-Z0-9].*[!@#$%^&*?_~])|([!@#$%^&*?_~].*[a-zA-Z0-9])/,
                    score: 3
                },
                /* password of a single char sucks */
                {
                    re: /(.)\1+$/,
                    score: 2
                }
            ],
            checkPassword: function (pass) {
                var score = 0,
                        minChar = this.options.minChar,
                        len = pass.length,
                        diff = len - minChar;
                (diff < 0 && (score -= 100)) || (diff >= 5 && (score += 18)) || (diff >= 3 && (score += 12)) || (diff === 2 && (score += 6));
                angular.forEach(this.checks, function (check) {
                    pass.match(check.re) && (score += check.score);
                });
                // bonus for length per char
                score && (score += len);
                return score;
            }
        };
        return StrongPass;
    }


    /**
     * @ngdoc Directive
     * @name PasswordStrength.Directive.passwordStrength
     * @module PasswordStrength
     *
     * @description
     * Determine the strength of password
     *
     * Usage :
     * <input type="password" password-strength />
     *
     * @author Kinectro
     */
    angular
            .module('PasswordStrength')
            .directive('passwordStrength', passwordStrengthDirective);
    /* @ngInject */
    function passwordStrengthDirective(StrongPass) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attributes, ngModel) {
                StrongPass.initialize(element, {
                    barWidth: '100%',
                    render: true,
                    onPass: function (score, verdict) {
                        ngModel.$setValidity('strong', true);
                    },
                    onFail: function (score, verdict) {
                        ngModel.$setValidity('strong', false);
                    }
                });
            }
        };
    }

    passwordStrengthDirective.$inject = ["StrongPass"];
}());
(function () {
    'use strict';
    /**
     * @module Logger
     * Logger module is use full for debugging code
     *
     * Usage :
     *
     * angular.module('app').controller('Controller',['Logger', function(Logger){
     *
     *  //Get an instance of Controller to track info
     *  var logger = Logger.getInstance('Controller');
     *  //Simple info log
     *  logger.log('This is a log');
     *  //If you want to show any warning
     *  logger.warn('warn', 'This is a warn');
     *  //Show error log
     *  logger.error('This is a {0} error! {1}', [ 'big', 'just kidding' ]);
     *  //Debug error
     *  logger.debug('debug', 'This is a debug for line {0}', [ 8 ]);
     *
     * }]);
     *
     *
     * Similar implementaion with directive, service, factory etc.
     * @author Kinectro
     **/
    angular
            .module('logger', [])
            .provider('Logger', [

                function () {
                    /**
                     * flag to holds boolean value
                     * @True {bool}
                     */
                    var isEnabled = true;
                    /**
                     * Set isEnabled flag to [true|false]
                     * @method enabled
                     * @param  {[boolean]} _isEnabled Flag to set [true|false]
                     * @return {[void]}
                     */
                    this.enabled = function (_isEnabled) {
                        isEnabled = !!_isEnabled;
                    };
                    /**
                     * Logger provider construct which returned while provide is used in controller
                     * Services and factory or directive
                     * @requires $log Angular $log service
                     * @True {Array}
                     */
                    this.$get = ['$log',
                        function ($log) {
                            /**
                             * Logger class
                             *
                             * @method Logger
                             * @param  {[Object]} context [controller, service, factory etc...]
                             */
                            var Logger = function (context) {
                                this.context = context;
                            };
                            /**
                             * Returns context
                             * @method getInstance
                             * @param  {[Object]} context [controller, service, factory etc...]
                             */
                            Logger.getInstance = function (context) {
                                return new Logger(context);
                            };
                            /**
                             * Returns an string based on supplied arguments
                             *
                             * @method supplant
                             * @param  {[string]} str message string
                             * @param  {[type]} o   type
                             * @return {[void]}
                             */
                            Logger.supplant = function (str, o) {
                                return str.replace(
                                        /\{([^{}]*)\}/g,
                                        function (a, b) {
                                            var r = o[b];
                                            return typeof r === 'string' || typeof r === 'number' ? r : a;
                                        }
                                );
                            };
                            /**
                             * Returns logger time
                             * @method getFormattedTimestamp
                             * @param  {[string]}              date logged date
                             * @return {[void]}
                             */
                            Logger.getFormattedTimestamp = function (date) {
                                return Logger.supplant('{0}:{1}:{2}:{3}', [
                                    date.getHours(),
                                    date.getMinutes(),
                                    date.getSeconds(),
                                    date.getMilliseconds()
                                ]);
                            };
                            /**
                             * Lets add some methods to Logger's prototype
                             * @True {Object}
                             */
                            Logger.prototype = {
                                /**
                                 * Log messages
                                 * Check if logger enabled
                                 *
                                 * @method  _log
                                 * @param   {[object]} originalFn callback function
                                 * @param   {[array | object]} args       arguments
                                 * @return  {[void]}
                                 * @private
                                 */
                                _log: function (originalFn, args) {
                                    if (!isEnabled) {
                                        return;
                                    }

                                    var now = Logger.getFormattedTimestamp(new Date());
                                    var message = '',
                                            supplantData = [];
                                    switch (args.length) {
                                        case 1:
                                            message = Logger.supplant('{0} - {1}: {2}', [now, this.context, args[0]]);
                                            break;
                                        case 3:
                                            supplantData = args[2];
                                            message = Logger.supplant('{0} - {1}::{2}(\'{3}\')', [now, this.context, args[0], args[1]]);
                                            break;
                                        case 2:
                                            if (typeof args[1] === 'string') {
                                                message = Logger.supplant('{0} - {1}::{2}(\'{3}\')', [now, this.context, args[0], args[1]]);
                                            } else {
                                                supplantData = args[1];
                                                message = Logger.supplant('{0} - {1}: {2}', [now, this.context, args[0]]);
                                            }
                                            break;
                                    }

                                    $log[originalFn].call(null, Logger.supplant(message, supplantData));
                                },
                                /**
                                 * Log default message
                                 *
                                 * @method log
                                 * @author Kinectro
                                 */
                                log: function () {
                                    this._log('log', arguments);
                                },
                                /**
                                 * Log info message
                                 *
                                 * @method info
                                 */
                                info: function () {
                                    this._log('info', arguments);
                                },
                                /**
                                 * Log warn message
                                 *
                                 * @method warn
                                 */
                                warn: function () {
                                    this._log('warn', arguments);
                                },
                                /**
                                 * Log debug messae
                                 *
                                 * @method debug
                                 */
                                debug: function () {
                                    this._log('debug', arguments);
                                },
                                /**
                                 * Log error message
                                 *
                                 * @method error
                                 */
                                error: function () {
                                    this._log('error', arguments);
                                }
                            };
                            return Logger;
                        }
                    ];
                }
            ]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc factory
     * @name BeautyCollective.Core.factory.notificationInterceptor
     * @module BeautyCollective.Core
     *
     * @description
     * An interceptor to read the header response request
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Core')
            .factory('notificationInterceptor', ['$q', 'AlertService', function ($q, AlertService) {
                    return {
                        response: function (response) {
                            var alertKey = response.headers('X-beautyCollective-alert');
                            if (angular.isString(alertKey)) {
                                AlertService.success(alertKey, {
                                    param: response.headers('X-beautyCollective-params')
                                });
                            }
                            return response;
                        }
                    };
                }]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc factory
     * @name BeautyCollective.Core.factory.errorHandlerInterceptor
     * @module BeautyCollective.Core
     *
     * @description
     * An interceptor to read the error response of http request
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Core')
            .factory('errorHandlerInterceptor', ['$q', '$rootScope', function ($q, $rootScope) {
                    return {
                        responseError: function (response) {
                            if (!(response.status == 401)) {
                                $rootScope.$emit('BeautyCollective.httpError', response);
                            }
                            return $q.reject(response);
                        }
                    };
                }]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name Directvies
     * @module BeautyCollective.Components.Directvies
     *
     * @description
     * This module is a bundle of all custom Directvies
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Components.Directvies', []);
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Components.Directvies.Directive.scrollToTopWhen
     * @module BeautyCollective.Components.Directvies
     *
     * @description
     * Scroll any html Element to target pixels
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Components.Directvies')
            .directive('scrollToTopWhen', ScrollToTopWhen);
    /* @ngInject */
    function ScrollToTopWhen($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$on(attrs.scrollToTopWhen, function () {
                    $timeout(function () {
                        angular.element(element)[0].scrollTop = element.find('.target').prop('offsetTop');
                    }, 100);
                });
            }
        };
    }

    ScrollToTopWhen.$inject = ["$timeout"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Components.Directvies.Directive.resizeBackground
     * @module BeautyCollective.Components.Directvies
     *
     * @description
     * Adjust the background image when window is resized
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Components.Directvies')
            .directive('resizeBackground', ResizeBackground);
    /* @ngInject */
    function ResizeBackground($window) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var $img = element.find('> img');
                angular.element($window).on('resize', function () {
                    $img.attr('style', '');
                    if ($img.height() < element.height()) {
                        $img.css({
                            height: '100%',
                            width: 'auto'
                        });
                    }
                });
            }
        };
    }

    ResizeBackground.$inject = ["$window"];
})();
(function () {
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Components.Directvies.Directive.remainingCharacters
     * @module BeautyCollective.Components.Directvies.
     *
     * @description
     * remainingCharacters
     * this diective is used to show the remaining Characters
     *
     * @required
     * maxlength attribute is required
     *
     * Usage :
     * =for simple input text or textarea
     * <imput type="text" ng-model="modelobject" remaining-characters data-maxlength="200" />
     * <textarea ng-model="modelobject" remaining-characters data-maxlength="200" />
     *
     * =editable field
     * <strong editable-text="checklist.title" e-maxlength="300" data-maxlength="300" remaining-characters >text content</strong>
     */
    angular
            .module('BeautyCollective.Components.Directvies')
            .directive('remainingCharacters', ['$compile', function ($compile) {
                    return {
                        restrict: 'A',
                        require: '?ngModel',
                        link: function (scope, element, iAttrs, ngModel) {
                            var maxChars = parseInt(iAttrs.maxlength),
                                    template = $compile('<p ng-show="isVisible" class="help-block" style="font-size: 13px;font-family:inherit">{{remainingCharacters}} characters remaining</p>')(scope);
                            scope.remainingCharacters = maxChars;
                            scope.isVisible = true;

                            function getRemaining(value) {
                                var currentLength = value ? value.length : 0;
                                scope.remainingCharacters = (maxChars - currentLength);
                                if (currentLength == 1) {
                                    scope.remainingCharacters = maxChars - 1;
                                }
                            }

                            function render() {
                                element.after(template);
                            }

                            scope.$watch(function () {
                                return element.attr('class');
                            }, function (newValue) {
                                (element.hasClass('editable-hide')) ?
                                        (scope.isVisible = true) :
                                        (element.hasClass('editable') && (scope.isVisible = false))
                            });
                            scope.$watch(function () {
                                return (element.hasClass('editable')) ? scope.$data : ngModel.$modelValue;
                            }, function (newValue) {
                                getRemaining(newValue);
                            });
                            render();
                        }
                    };
                }])


})();
/* globals $ */
'use strict';
angular.module('BeautyCollective')
        .directive('showValidation', function () {
            return {
                restrict: 'A',
                require: 'form',
                link: function (scope, element) {
                    element.find('.form-group').each(function () {
                        var $formGroup = $(this);
                        var $inputs = $formGroup.find('input[ng-model],textarea[ng-model],select[ng-model]');
                        if ($inputs.length > 0) {
                            $inputs.each(function () {
                                var $input = $(this);
                                scope.$watch(function () {
                                    return $input.hasClass('ng-invalid') && $input.hasClass('ng-dirty');
                                }, function (isInvalid) {
                                    $formGroup.toggleClass('has-error', isInvalid);
                                });
                            });
                        }
                    });
                }
            };
        });
angular
        .module('BeautyCollective')
        .directive('uiSelectRequired1', function () {
            return {
                require: 'ngModel',
                link: function (scope, elm, attrs, ctrl) {
                    ctrl.$validators.uiSelectRequired1 = function (modelValue, viewValue) {

                        var determineVal;
                        if (angular.isArray(modelValue)) {
                            determineVal = modelValue;
                        } else if (angular.isArray(viewValue)) {
                            determineVal = viewValue;
                        } else {
                            return false;
                        }

                        return determineVal.length > 0;
                    };
                }
            };
        });
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Components.Directvies.Directive.fileModel
     * @module BeautyCollective.Components.Directvies.
     *
     * @description
     * Change file model when file is selected
     *
     * @author Kinectro
     */

    angular.module('BeautyCollective.Components.Directvies')
            .directive('fileModel', ['$parse',
                function ($parse) {
                    return {
                        restrict: 'A',
                        link: function (scope, element, attrs) {
                            var model = $parse(attrs.fileModel);
                            var modelSetter = model.assign;
                            element.bind('change', function () {
                                scope.$apply(function () {
                                    modelSetter(scope, element[0].files[0]);
                                });
                            });
                        }
                    };
                }
            ]);
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Components.Directvies.Directive.browseFileButton
     * @module BeautyCollective.Components.Directvies.
     *
     * @description
     * Browse a file when click on link(.upload_link) which again trigger (.upload_file)
     * Usage:
     * <div class="any-class" browse-file-button>
     * <a href="#" class="upload_link">Upload File</a>
     <input type="file" class="upload_file" />
     * </div>
     *
     * @author Kinectro
     */
    angular.module('BeautyCollective.Components.Directvies')
            .directive('browseFileButton', [
                function () {
                    return {
                        restrict: 'A',
                        link: function (scope, element, attrs) {
                            element.find('.upload_link').bind('click', function () {
                                element.find('.upload_file').trigger('click');
                            });
                            scope.$on('$destroy', function () {
                                element.find('.upload_link').unbind('click');
                            });
                        }
                    };
                }
            ]);
    angular.module('BeautyCollective.Components.Directvies')
            .directive('fallbackSrc', function () {
                var fallbackSrc = {
                    link: function postLink(scope, iElement, iAttrs) {
                        iElement.bind('error', function () {
                            angular.element(this).attr("src", iAttrs.fallbackSrc);
                        });
                    }
                }
                return fallbackSrc;
            });
}());
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Components.Directvies.Directive.ExactLength
     * @module BeautyCollective.Components.Directvies.
     *
     * @description
     * validate model exact length of field
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Components.Directvies')
            .directive('exactLength', ExactLength);
    /* @ngInject */
    function ExactLength() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                exactLength: '='
            },
            link: function (scope, $element, $attrs, ngModel) {
                $element.on('keyup', function () {
                    scope.$apply(function () {
                        ngModel.$setValidity('exactLength', (scope.exactLength === (ngModel.$modelValue && ngModel.$modelValue.length)));
                    });
                });
            }
        }
    }
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Components.Directvies.Directive.scrollToTopWhen
     * @module BeautyCollective.Components.Directvies
     *
     * @description
     * Stop event propogationt to parents
     *
     * Usage :
     * <a href="#" stop-click-propagation>Hit me</a>
     *
     * @author Kinectro
     */

    angular
            .module('BeautyCollective.Components.Directvies')
            .directive('stopClickPropagation', stopClickPropagation);
    /* @ngInject */
    function stopClickPropagation() {
        return {
            restrict: 'A',
            link: {
                post: function (scope, element, attrs) {
                    element.click(function (e) {
                        e.stopPropagation();
                    });
                }
            }
        };
    }

    /**
     * @ngdoc Directive
     * @name BeautyCollective.Components.Directvies.Directive.preventDefault
     * @module BeautyCollective.Components.Directvies
     *
     * @description
     * preventDefault directive is used to stop default action of html element
     *
     * Usage :
     * <a href="#" prevent-default>Hit me</a>
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Components.Directvies')
            .directive('preventDefault', preventDefault);
    /* @ngInject */
    function preventDefault() {
        return {
            restrict: 'A',
            link: {
                post: function (scope, element, attrs) {
                    element[0].click(function (e) {
                        e.preventDefault();
                    });
                }
            }
        };
    }

}());
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Components.Directvies.Directive.match
     * @module BeautyCollective.Components.Directvies.
     *
     * @description
     * password matching check
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Components.Directvies')
            .directive('match', PasswordMatch);
    /* @ngInject*/
    function PasswordMatch($parse) {
        return {
            require: '?ngModel',
            restrict: 'A',
            link: function (scope, elem, attrs, ctrl) {
                if (!ctrl) {
                    if (console && console.warn) {
                        console.warn('Match validation requires ngModel to be on the element');
                    }
                    return;
                }

                var matchGetter = $parse(attrs.match);
                var caselessGetter = $parse(attrs.matchCaseless);
                var noMatchGetter = $parse(attrs.notMatch);
                scope.$watch(getMatchValue, function () {
                    ctrl.$$parseAndValidate();
                });
                ctrl.$validators.match = function () {
                    var match = getMatchValue();
                    var notMatch = noMatchGetter(scope);
                    var value;
                    if (caselessGetter(scope)) {
                        value = angular.lowercase(ctrl.$viewValue) === angular.lowercase(match);
                    } else {
                        value = ctrl.$viewValue === match;
                    }
                    value ^= notMatch;
                    return !!value;
                };

                function getMatchValue() {
                    var match = matchGetter(scope);
                    if (angular.isObject(match) && match.hasOwnProperty('$viewValue')) {
                        match = match.$viewValue;
                    }
                    return match;
                }
            }
        };
    }

    PasswordMatch.$inject = ["$parse"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Components.Directvies.Directive.userImage
     * @module BeautyCollective.Components.Directvies
     *
     * @description
     * loads user
     *
     * Usage :
     * <user-image data-userid="{{userid}}"/>
     *
     * @author Kinectro
     */

    angular
            .module('BeautyCollective.Components.Directvies')
            .directive('userImage', blobToImageDirective)

    /* @ngInject */
    function blobToImageDirective($rootScope) {
        return {
            restrict: 'E',
            scope: {
                userid: '=',
                imageclass: '@'
            },
            replace: true,
            link: function (scope, element, attributes) {
                scope.$watch(function () {
                    return $rootScope.isPhotoUpdated;
                }, function (newVal, oldVal) {
                    if (newVal)
                        scope.imageUrl = 'api/v1/users/' + scope.userid + '/photo?referece=' + newVal;
                });
                scope.$watch(function () {
                    return scope.userid;
                }, function (newVal, oldVal) {
                    if (newVal)
                        scope.imageUrl = 'api/v1/users/' + scope.userid + '/photo?referece=' + newVal;
                });
            },
            template: '<img ng-src="{{imageUrl}}" class="{{imageclass}}" />'
        };
    }

    blobToImageDirective.$inject = ["$rootScope"];
}());
(function () {

    /**
     * @ngdoc Directive
     * @name BeautyCollective.Components.Directvies.Directive.adjustWidth
     * @module BeautyCollective.Components.Directvies.
     *
     * @description
     * directive is used on active run view
     * directive apply width to element same as parent's width
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective.Components.Directvies')
            .directive('adjustWidth', [function () {
                    return {
                        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
                        link: function (scope, element, attrs) {
                            element.width(element.parent().width());
                        }
                    };
                }]);
})();
'use strict';
angular.module('BeautyCollective.Core')
        .factory('Language', ["$q", "$http", "$translate", "LANGUAGES", function ($q, $http, $translate, LANGUAGES) {
                return {
                    getCurrent: function () {
                        var deferred = $q.defer();
                        var language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');
                        if (angular.isUndefined(language)) {
                            language = 'en';
                        }

                        deferred.resolve(language);
                        return deferred.promise;
                    },
                    getAll: function () {
                        var deferred = $q.defer();
                        deferred.resolve(LANGUAGES);
                        return deferred.promise;
                    }
                };
            }])

        /*
         Languages codes are ISO_639-1 codes, see http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
         They are written in English to avoid character encoding issues (not a perfect solution)
         */
        .constant('LANGUAGES', [
            'en', 'fr'
                    //add new languages here
        ]);
'use strict';
angular.module('BeautyCollective.Core')
        .controller('LanguageController', ["$scope", "$translate", "Language", function ($scope, $translate, Language) {
                $scope.changeLanguage = function (languageKey) {
                    $translate.use(languageKey);
                };
                Language.getAll().then(function (languages) {
                    $scope.languages = languages;
                });
            }]);
(function () {
    'use strict';
    /**
     * @ngdoc factory
     * @name BeautyCollective.factory.ResponseHandler
     * @module BeautyCollective
     *
     * @description
     * ResponseHandler factory handles response from server
     * handle success message and error message based on response from server
     *
     * @author Kinectro
     */
    angular
            .module('BeautyCollective')
            .factory('ResponseHandler', ResponseHandlerFactory);
    /* @ngInject */
    function ResponseHandlerFactory(notify, $filter, $q) {

        function ResponseHandlerFactory() {
            this.notifyConfig = {
                title: '',
                message: ''
            };
            this.setNotifyConfig = function (title, message) {
                this.notifyConfig = {
                    title: title,
                    message: message
                }
            }

            this.showNotification = function (type) {
                ('error' === type) ? notify.error(this.notifyConfig) : notify.success(this.notifyConfig)
            }
        }

        ResponseHandlerFactory.prototype.success = function (successObj, showNotify) {
            var deferred = $q.defer();
            if (!successObj.data && !success.data.type) {

                deferred.resolve({
                    type: ((success.status === 200) && (success.statusText === 'OK')) ? 'success' : 'error',
                    message: success.statusText
                });
                return deferred.promise;
            }
            var successData = successObj.data,
                    messageType,
                    message;
            message = $filter('translate')('SERVER.' + successData.code);
            this.setNotifyConfig(successData.type, message);
            messageType = (successData.type.toLowerCase() === 'success') ? 'success' : 'error';
            if (showNotify) {
                this.showNotification(messageType);
            }

            deferred.resolve({
                type: messageType,
                message: message
            });
            return deferred.promise;
        };
        ResponseHandlerFactory.prototype.error = function (errorObj, showNotify) {
            var deferred = $q.defer();
            var message = errorData.message || errorData.statusText;
            this.setNotifyConfig('Error', message);
            if (showNotify) {
                this.showNotification('error');
            }
            deferred.resolve({
                type: 'error',
                message: message
            });
            return deferred.promise;
        };
        return new ResponseHandlerFactory();
    }

    ResponseHandlerFactory.$inject = ["notify", "$filter", "$q"];
})();
(function () {
    'use strict';
    /**
     * @ngdoc Provider
     * @name BeautyCollective.Core.Provider.AlertService
     * @module BeautyCollective.Core
     *
     * @description
     * This provider will be used to set the setting of alert messages
     *
     * @author Kinectro
     */
    angular.module('BeautyCollective.Core').provider('AlertService', function () {
        this.toast = false;
        this.$get = ['$timeout', '$sce', '$translate', function ($timeout, $sce, $translate) {

                var exports = {
                    factory: factory,
                    isToast: isToast,
                    add: addAlert,
                    closeAlert: closeAlert,
                    closeAlertByIndex: closeAlertByIndex,
                    clear: clear,
                    get: get,
                    success: success,
                    error: error,
                    info: info,
                    warning: warning
                },
                        toast = this.toast,
                        alertId = 0, // unique id for each alert. Starts from 0.
                        alerts = [],
                        timeout = 5000; // default timeout

                function isToast() {
                    return toast;
                }

                function clear() {
                    alerts = [];
                }

                function get() {
                    return alerts;
                }

                function success(msg, params, position) {
                    return this.add({
                        type: "success",
                        msg: msg,
                        params: params,
                        timeout: timeout,
                        toast: toast,
                        position: position
                    });
                }

                function error(msg, params, position) {
                    return this.add({
                        type: "danger",
                        msg: msg,
                        params: params,
                        timeout: timeout,
                        toast: toast,
                        position: position
                    });
                }

                function warning(msg, params, position) {
                    return this.add({
                        type: "warning",
                        msg: msg,
                        params: params,
                        timeout: timeout,
                        toast: toast,
                        position: position
                    });
                }

                function info(msg, params, position) {
                    return this.add({
                        type: "info",
                        msg: msg,
                        params: params,
                        timeout: timeout,
                        toast: toast,
                        position: position
                    });
                }

                function factory(alertOptions) {
                    var alert = {
                        type: alertOptions.type,
                        msg: $sce.trustAsHtml(alertOptions.msg),
                        id: alertOptions.alertId,
                        timeout: alertOptions.timeout,
                        toast: alertOptions.toast,
                        position: alertOptions.position ? alertOptions.position : 'top right',
                        scoped: alertOptions.scoped,
                        close: function (alerts) {
                            return exports.closeAlert(this.id, alerts);
                        }
                    }
                    if (!alert.scoped) {
                        alerts.push(alert);
                    }
                    return alert;
                }

                function addAlert(alertOptions, extAlerts) {
                    alertOptions.alertId = alertId++;
                    alertOptions.msg = $translate.instant(alertOptions.msg, alertOptions.params);
                    var that = this;
                    var alert = this.factory(alertOptions);
                    if (alertOptions.timeout && alertOptions.timeout > 0) {
                        $timeout(function () {
                            that.closeAlert(alertOptions.alertId, extAlerts);
                        }, alertOptions.timeout);
                    }
                    return alert;
                }

                function closeAlert(id, extAlerts) {
                    var thisAlerts = extAlerts ? extAlerts : alerts;
                    return this.closeAlertByIndex(thisAlerts.map(function (e) {
                        return e.id;
                    }).indexOf(id), thisAlerts);
                }

                function closeAlertByIndex(index, thisAlerts) {
                    return thisAlerts.splice(index, 1);
                }

                return exports;
            }];
        this.showAsToast = function (isToast) {
            this.toast = isToast;
        };
    });
})();
(function () {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Directive.Alert
     * @module BeautyCollective
     *
     * @description
     * This directive is to show the alert box and inline alerts
     *
     * @author Kinectro
     */

    angular
            .module('BeautyCollective')
            .directive('alert', ['AlertService', function (AlertService) {
                    return {
                        restrict: 'E',
                        template: '<div class="alerts" ng-cloak="">' +
                                '<div ng-repeat="alert in alerts" ng-class="[alert.position, {\'toast\': alert.toast}]">' +
                                '<uib-alert ng-cloak="" type="{{alert.type}}" close="alert.close()"><pre>{{ alert.msg }}</pre></uib-alert>' +
                                '</div>' +
                                '</div>',
                        controller: ['$scope',
                            function ($scope) {
                                $scope.alerts = AlertService.get();
                                $scope.$on('$destroy', function () {
                                    $scope.alerts = [];
                                });
                            }
                        ]
                    }
                }]);
    angular
            .module('BeautyCollective')
            .directive('alertError', ['AlertService', '$rootScope', '$translate', function (AlertService, $rootScope, $translate) {
                    return {
                        restrict: 'E',
                        template: '<div class="alerts" ng-cloak="">' +
                                '<div ng-repeat="alert in alerts" ng-class="[alert.position, {\'toast\': alert.toast}]">' +
                                '<uib-alert ng-cloak="" type="{{alert.type}}" close="alert.close(alerts)"><pre>{{ alert.msg }}</pre></uib-alert>' +
                                '</div>' +
                                '</div>',
                        controller: ['$scope',
                            function ($scope) {

                                $scope.alerts = [];
                                var cleanHttpErrorListener = $rootScope.$on('BeautyCollective.httpError', function (event, httpResponse) {
                                    var i;
                                    event.stopPropagation();
                                    switch (httpResponse.status) {
                                        // connection refused, server not reachable
                                        case 0:
                                            addErrorAlert("Server not reachable", 'error.serverNotReachable');
                                            break;
                                        case 400:
                                            if (httpResponse.data && httpResponse.data.fieldErrors) {
                                                for (i = 0; i < httpResponse.data.fieldErrors.length; i++) {
                                                    var fieldError = httpResponse.data.fieldErrors[i];
                                                    // convert 'something[14].other[4].id' to 'something[].other[].id' so translations can be written to it
                                                    var convertedField = fieldError.field.replace(/\[\d*\]/g, "[]");
                                                    var fieldName = $translate.instant('BeautyCollective.' + fieldError.objectName + '.' + convertedField);
                                                    addErrorAlert('Field ' + fieldName + ' cannot be empty', 'error.' + fieldError.message, {
                                                        fieldName: fieldName
                                                    });
                                                }
                                            } else if (httpResponse.data && httpResponse.data.message) {
                                                addErrorAlert(httpResponse.data.message, httpResponse.data.message, httpResponse.data);
                                            } else {
                                                addErrorAlert(httpResponse.data);
                                            }
                                            break;
                                        default:
                                            if (httpResponse.data && httpResponse.data.message) {
                                                addErrorAlert(httpResponse.data.message);
                                            } else {
                                                addErrorAlert(JSON.stringify(httpResponse));
                                            }
                                    }
                                });
                                $scope.$on('$destroy', function () {
                                    if (cleanHttpErrorListener !== undefined && cleanHttpErrorListener !== null) {
                                        cleanHttpErrorListener();
                                        $scope.alerts = [];
                                    }
                                });
                                var addErrorAlert = function (message, key, data) {
                                    key = key && key != null ? key : message;
                                    $scope.alerts.push(
                                            AlertService.add({
                                                type: "danger",
                                                msg: key,
                                                params: data,
                                                timeout: 5000,
                                                toast: AlertService.isToast(),
                                                scoped: true
                                            },
                                                    $scope.alerts
                                                    )
                                            );
                                }
                            }
                        ]
                    }
                }]);
})();
(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Components
     *
     * @module BeautyCollective
     *
     * @description
     * Application components goes here
     *
     * @author Kinectro
     */
    angular.module('BeautyCollective.Components', [
        'BeautyCollective.Components.Filters',
        'BeautyCollective.Components.Directvies',
        'BeautyCollective.Components.modal',
        'FancyDropDown'
    ]);
})();

function setsearchfor(b_value, label, classs) {

    //$("#searchFor").val(b_value);
    $("#searchFor").val(label);
    $("#searchFor_hidden").val(b_value);
    $(".business_deal .nav li").removeClass('active');
    $("." + classs).parent().addClass('active');
    scroll_to_div('#scroll_top_sec');
    document.getElementById("suburb_input").focus();
    $(".front-boxes").removeClass('fadeinn');
    $("#search_categories_icons").removeClass('highlighted');
    $("#suburb_input").addClass('highlighted');
    $(".fa-arrow-down").removeClass('arrow_animated');
}

function set_header_name(thiss) {

    var title = $(thiss).attr('data-name');
    $("#page_info .modal-title").html(title);
}


/*Notification modal code start here*/
(function () {
    'use strict';
    angular
            .module('BeautyCollective.Widgets')
            .directive('widgetNotification', [function () {
                    return {
                        restrict: 'EA',
                        scope: {
                            "fromname": "@fromname",
                            "fromemail": "@fromemail",
                            "fromuserid": "@fromuserid",
                            "message": "@message",
                            "touserid": "@touserid",
                            "toemail": "@toemail",
                            "listid": "@listid",
                        },
                        templateUrl: '/apps/widgets/notifications/notification-modal.html',
                        controller: 'NotificationController',
                        controllerAs: 'self',
                        bindToController: true, //required in 1.3+ with controllerAs
                        link: function ($scope, element, iAttrs, ngModel) {}
                    };
                }]);
})();
(function () {
    'use strict';
    /*Notification controller*/
    angular
            .module('BeautyCollective.Widgets')
            .controller('NotificationController', NotificationController);

    function NotificationController($scope, $sanitize, $q, Logger, Spinner, NotificationModel, toaster) {
        var self = this;
        init();

        function init() {
            Logger.getInstance('NotificationController').info('Notification Controller has initialized');
        }

        $scope.fromname = self.fromname;
        $scope.fromemail = self.fromemail;
        //Save notification.
        self.saveNotification = function () {
            Spinner.start();
            NotificationModel.save({
                'notification': self.notification,
                'from_name': $scope.fromname,
                'from_email': $scope.fromemail,
                'from_user_id': self.fromuserid,
                'message': $scope.message,
                'to_user_id': self.touserid,
                'to_email': self.toemail,
                'list_id': self.listid
            }).then(function (responce) {
                Spinner.stop();
                toaster.pop('success', "Notification Sent", "Notification has been sent successfully.");
                if (self.fromuserid != '') {
                    $scope.message = "";
                } else {
                    $scope.fromname = $scope.fromemail = $scope.message = "";
                }
            }, function (error) {
                Spinner.stop();
            });
        };
    }
})();
(function () {
    /*Data model for notification */
    'use strict';
    angular
            .module('BeautyCollective.Widgets')
            .service('NotificationModel', NotificationModel);

    function NotificationModel(NotificationResource) {
        var model = this;
        model.save = function (notification) {
            return NotificationResource.save(notification).$promise;
        };
    }

    NotificationModel.$inject = ["NotificationResource"];
})();
(function () {
    'use strict';
    /*Notificaton resource*/
    angular
            .module('BeautyCollective.Widgets')
            .factory('NotificationResource', NotificationResource);
    /* @ngInject */
    function NotificationResource($resource, APP_CONFIG) {
        return $resource('../notification/', {}, {
            save: {
                url: 'notification',
                method: 'POST'
            },
        });
    }

    NotificationResource.$inject = ["$resource", "APP_CONFIG"];

    function transformQueryResponse(data, headersGetter) {
        var _response = {};
        _response.list = angular.fromJson(data);
        return angular.fromJson(_response);
    }

})();

(function () {
    'use strict';
    angular.module('BeautyCollective.Account')
            .controller('changeCardController', changeCardController);

    function  changeCardController($scope, Spinner, $http, $uibModalInstance, $state, toaster) {        
        var self = this;
        $scope.handleChangeCard = function (status, response) {
            Spinner.start();
            if (response.error) {
                // there was an error. Fix it.
                self.stripe_error = response.error;
                console.log(response.error);
            } else {
                self.token = response.id;
                if (self.token) {
                    Spinner.start();
                    $http({
                        method: 'POST',
                        url: "/request/change/card",
                        params: {
                            stripeToken: self.token
                        }
                    }).then(function mySuccess(response) {
                        var info = response.data;
                        $uibModalInstance.dismiss('cancel');
                        if (info.status === "200") {
                            $state.go('business_info.profile');
                            toaster.pop('success', "Thank you", info.msg);
                        } else {
                            toaster.pop('error', "Try Next Time.", info.msg);
                        }
                        Spinner.stop();
                    });

                } else {
                }

            }
            Spinner.stop();
        };
        self.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            $state.go('business_info.profile');
        };
    }
    changeCardController.$inject = ["$scope", "Spinner", "$http", "$uibModalInstance", "$state", "toaster"];
})();

(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Serviceprovider.Controller.DashboardController
     * @module BeautyCollective.Account
     *
     * @description
     * DashboardController is responsible manage account activities
     *
     * @author Kinectro
     */

    /* @ngInject */
    angular
            .module('BeautyCollective.Account')
            .controller('FacebookChatController', FacebookChatController);

    function FacebookChatController(AccountModel, ResolveData, Spinner, toaster) {      
        var _self = this;
        _self.facebookChat = {};
        _self.profile_url = "/profile?id=" + btoa(ResolveData.id);
        init();
        function init() {
            _self.facebookChat.facebook_app_id = (ResolveData.user_business.facebook_app_id) ? ResolveData.user_business.facebook_app_id : '';
            _self.facebookChat.facebook_page_id = (ResolveData.user_business.facebook_page_id) ? ResolveData.user_business.facebook_page_id : '';
        }
        _self.UpdateCredential = function () {
            Spinner.start();
            AccountModel.updatefbcredential(_self.facebookChat).then(function (response) {
                if (response.status) {
                    toaster.pop('success', "Success", response.msg);
                } else {
                    toaster.pop('error', "Not Save", response.msg);
                }
                Spinner.stop();
            }, function (error) {
                Spinner.stop();
                return [];
            });
        };
        _self.copyInputMessage = function () {
            let inputfield = document.getElementById('profileurl').innerHTML;
            let selBox = document.createElement('textarea');
            selBox.style.position = 'fixed';
            selBox.style.left = '0';
            selBox.style.top = '0';
            selBox.style.opacity = '0';
            selBox.value = main_url + inputfield;
            document.body.appendChild(selBox);
            selBox.focus();
            selBox.select();
            document.execCommand('copy');
            document.body.removeChild(selBox);
        }
    }
    FacebookChatController.$inject = ["AccountModel", "ResolveData", "Spinner", "toaster"];

})();
