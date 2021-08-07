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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Users', ['ui.select','ui.mask'])
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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

(function() {
  'use strict';
  /**
   * @ngdoc Controller
   * @name BeautyCollective.Users.Controller.ViewUserController
   * @module BeautyCollective.Users
   *
   * @description
   * ViewUserController is responsible every action on list view page
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
      }).then(function(){
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
      }).then(function(user) {
        self.user = user;
        setRolesName(user.roles);
        if(self.user.projectIds && self.user.projectIds.length > 0 ){
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

    function setUserProject(){
      var projects = [];
      _.each(self.projects, function(project){
          if(self.user.projectIds.indexOf(project.projectid) >= 0){
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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

(function() {
  'use strict';
  /**
   * @ngdoc Controller
   * @name BeautyCollective.Users.Controller.CreateUserController
   * @module BeautyCollective.Users
   *
   * @description
   * CreateUserController is responsible every action on list view page
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
      self.roles =  Auth.roles();
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
      }).then(function(user) {
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
    self.saveUser = function() {
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
        roles = _user.roles.map(function(role) {
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

      resource.then(function(response) {
         Spinner.hide();
        if(response.type === 'ERROR'){
          notify.error({
            title : 'Error',
            message : $filter('translate')('SERVER.' + response.code)
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
    self.openPhotoModal = function() {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'modules/users/update-user-photo/update-user-photo.html',
        controller: 'UpdateUserPhotoController as modalCtrl',
        size:'',
        resolve: {
          selectedUser : function(){
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

(function() {
  'use strict';
  /**
   * @ngdoc overview
   * @name BeautyCollective.Pages
   * @module BeautyCollective.Pages
   *
   * @description
   * Pages module responsible for all static pages
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Pages', []);
})();
(function() {
  'use strict';
  /**
   * @ngdoc overview
   * @name BeautyCollective.Pages.PrivacyPolicyStateConfig
   * @module BeautyCollective.Pages
   *
   * @description
   * Static page states
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
(function() {
  'use strict';
  /**
   * @ngdoc Controller
   * @name BeautyCollective.Pages.Controller.PrivacyPolicyController
   * @module BeautyCollective.Pages
   *
   * @description
   * PrivacyPolicyController is responsible for privacy policy page
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    function setLogger() {
      logger = Logger.getInstance('PrivacyPolicyController');
      logger.info('Controller has initialized');
    }
  }
  PrivacyPolicyController.$inject = ["$scope", "$state", "Logger"];
})();
(function() {
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Account', ['ui.bootstrap', 'ui.bootstrap.datetimepicker']);
})();
(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Account')
        .config(WatchListStates);

    /* @ngInject */
    function WatchListStates($stateProvider, APP_CONFIG) {
		$stateProvider.state('watchlist', {
            parent: 'account',
            url: '^/watchlist',
            views: {
                'account_content_view': {
                    templateUrl: APP_CONFIG.modules + '/account/watch_list/watch-list.html',
                    controller: 'WatchListController as _self'
                },
				'account_top_nav_view' : {
                    templateUrl: APP_CONFIG.modules + '/account/watch_list/watch-list-nav.html'
                }
            }
        });
    }
    WatchListStates.$inject = ["$stateProvider", "APP_CONFIG"];
})();

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
             self.pageSize = 4;
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
    WatchListController.$inject = ["$state", "AccountModel", "toaster", "$location"];
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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

(function() {
  'use strict';
  /**
   * @name BeautyCollective.Users.config.UsersListState
   * @module BeautyCollective.Users
   *
   * @description
   * Users list route configurations
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
          translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
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

(function() {
  'use strict';
  /**
   * @ngdoc Controller
   * @name BeautyCollective.Users.Controller.UsersListController
   * @module BeautyCollective.Users
   *
   * @description
   * UsersListController is responsible every action on list view page
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
      console.log('dhasjhd kasjahdasdsa dasdasd sdadas');
    }

    /**
     * pageChanged is called when pagination is changed
     *
     * @public
     * @return {void}
     */
    self.pageChanged = function() {
      Spinner.show();
      getAllUsers();
    };

    /**
     * sortColumnBy is called when table column headers are clicked
     *
     * @public
     * @return {void}
     */
    self.sortColumnBy = function(predicate) {
      self.isSortReverse = (self.predicate === predicate) ? !self.isSortReverse : false;
      self.predicate = predicate;
      self.currentPage = 1;
      getAllUsers();
    };

    self.isSortColumnBy = function(predicate) {
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
      }).then(function(successResponse) {
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
    self.deleteUser = function(user) {
      var _userId = parseInt(user.id);
      _$modal
        .confirm($filter('translate')('userslist.confirm_modal.delete.header'), $filter('translate')('userslist.confirm_modal.delete.msg'), {
          'size': 'sm'
        })
        .result
        .then(function(btn) {
          UsersModel.delete({
            'id': _userId
          }).then(function(response) {
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
        }, function(btn) {
          //error callback
        });
    };
    /**
     * update user's status
     * 
     * @param  {object} user
     * @return {void}
     */
    self.updateUserStatus = function(user) {
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
        .then(function(btn) {
          UsersModel.updateStatus({
            id: _userId,
            action: 'activate',
            action_value: !user.active
          }).then(function(response) {
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

        }, function(btn) {
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

(function() {
  'use strict';
  /**
   * @ngdoc overview
   * @name BeautyCollective.Pages.ContactSupportStateConfig
   * @module BeautyCollective.Pages
   *
   * @description
   * Static page states
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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

(function() {
  'use strict';
  /**
   * @ngdoc Controller
   * @name BeautyCollective.Pages.Controller.ContactSupportController
   * @module BeautyCollective.Pages
   *
   * @description
   * ContactSupportController is responsible for contact support page
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    function setLogger() {
      logger = Logger.getInstance('ContactSupportController');
      logger.info('Controller has initialized');
    }
  }
  ContactSupportController.$inject = ["$scope", "$state", "Logger"];
})();
(function() {
  'use strict';
  /**
   * @ngdoc overview
   * @name BeautyCollective.Pages.HelpStateConfig
   * @module BeautyCollective.Pages
   *
   * @description
   * Static page states
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
(function() {
  'use strict';
  /**
   * @ngdoc Controller
   * @name BeautyCollective.Pages.Controller.HelpController
   * @module BeautyCollective.Pages
   *
   * @description
   * HelpController is responsible for Help page
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    function setLogger() {
      logger = Logger.getInstance('HelpController');
      logger.info('Controller has initialized');
    }
  }
  HelpController.$inject = ["$scope", "$state", "Logger"];
})();
(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
                    template: '<div ui-view="user_view" class="fadeIn animated"></div>'
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
                    ResolveData: ["ResolveData", function(ResolveData){
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
            absolute : true,
            url: '/job',
            views: {
                'user_view@user': {
                    template: '<div ui-view="job_preferences_views" class="fadeIn animated"></div>'
                },
                'account_top_nav_view@account':{
                    templateUrl: function() {
                        return APP_CONFIG.modules + '/account/user/job-dashboard-nav.html'
                    }
                }
            },
            resolve: {
                JobResolveData: ['AccountModel', '$q', function(AccountModel, $q) {
                    var deferred = $q.defer();
                    AccountModel.findJob({id:null}).then(function(response) {
                    var jobs_applied = {};
					response.jobs_applied.forEach(function(obj){
						jobs_applied[obj.id] = obj;
					});
					var jobPreferred = response.jobs_preferred.filter(function(obj){
						return !(obj.id in jobs_applied);
					});
					deferred.resolve({
                        'jobs_applied': response.jobs_applied,
                        'jobs_preferred': jobPreferred,
                        'jobs_shortlisted': response.jobs_shortlisted
                        });
                    }, function(error) {
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
                JobResolveData: ["JobResolveData", function(JobResolveData){
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
                JobResolveData: ["JobResolveData", function(JobResolveData){
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
                JobResolveData: ["JobResolveData", function(JobResolveData){
                    return JobResolveData.jobs_applied;
                }]
            } 
        });
    }
    UserStates.$inject = ["$stateProvider", "APP_CONFIG"];
})();

(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.UserJobController
     * @module BeautyCollective.Account
     *
     * @description
     * UserJobController is responsible manage user's review and jobs
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

    /* @ngInject */
    function UserJobController($state,AccountModel,JobResolveData) {
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

    }
    UserJobController.$inject = ["$state", "AccountModel", "JobResolveData"];
    //end of controller

    angular
        .module('BeautyCollective.Account')
        .controller('UserJobController', UserJobController);
})();

(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.UserController
     * @module BeautyCollective.Account
     *
     * @description
     * UserController is responsible manage user's review
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

    /* @ngInject */
    function UserController($state,SuburbsModel,AccountModel,ResolveData,toaster, Spinner) {
        var self = this;
        init();

        /**
         * initialize properties
         * 
         * @private
         * @return {void}
         */

        function init() {
            self.suburbList =[];
            self.userModel = {
                'id':ResolveData.id,
                'name':ResolveData.name,
                'address':(ResolveData.user_info) ? ResolveData.user_info.address:'',
                'suburb':(ResolveData.user_info && ResolveData.user_info.user_suburb) ? ResolveData.user_info.user_suburb:null,
                'email':ResolveData.email
            };
        }

        /**
         * save user data
         * 
         * @private
         * @return {void}
         */

        self.saveuser = function() {
            Spinner.start();
            var _user = angular.copy(self.userModel),
                resource = AccountModel.update({
                    id: _user.id
                }, _user);
            resource.then(function(successResponse) {
                toaster.pop('success', "Detail Save", "Details has been updated.");
                Spinner.stop();
            }, function(errorResponse) {
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
        self.getLocation = function(val) {
            if (val.length < 3) {
                return;
            }
            Spinner.start();
            SuburbsModel.findLocation({
                'q': val
            }).then(function(successResponse) {
                self.suburbList = successResponse.list;
                Spinner.stop();
            }, function(errorResponse) {
                console.info('Getting locations:', errorResponse);
                Spinner.stop();
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

        

    }
    UserController.$inject = ["$state", "SuburbsModel", "AccountModel", "ResolveData", "toaster", "Spinner"];
    //end of controller

    angular
        .module('BeautyCollective.Account')
        .controller('UserController', UserController);
})();

(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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

    angular.element(document).ready(function() {
        var location = window.location;
        
        if (location.pathname == '/account') {
            console.info('BeautyCollective.Dashboard is running......');
            angular.bootstrap(document, ['BeautyCollective.Dashboard']);
        } else {
            angular.bootstrap(document, ['BeautyCollective.GlobalBeautyCollective']);
            console.info('BeautyCollective.GlobalBeautyCollective is running......');
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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

(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
                    template: '<div ui-view="reviews_view" class="fadeIn animated"></div>'
                },
                'account_top_nav_view' : {
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
        }) .state('reviews.received-reviews', {
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
				//ReceivedRating();
				getReviewlist();
			}
			if($state.current.name=='reviews.received-reviews'){
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
		
		/**
		* Save Review
		* @params {Object}
		* @return {id}
		*/
		
		function ReceivedRating() {
			ReviewModel.UserReceivedReview({
               
            }).then(function(response) {
			    self.ReceivedUserRating = angular.copy(response); 
				 self.numberOfPages=function(){
					return Math.ceil(self.ReceivedUserRating.data.length/self.pageSize);                
				}
				//var _totalrating = 0;
            },function(error){
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
			//alert('hellllllllllll');

			ReviewModel.all({
                'to_user': ResolveData.user.id
            }).then(function(response) {
			    self.reviewList = angular.copy(response);
           //alert(JSON.stringify(self.reviewList));


                self.numberOfPages=function(){
					return Math.ceil(self.reviewList.data.length/self.pageSize);                
				}
				var _totalrating = 0;
				/*angular.forEach(self.reviewList.data, function(value, key) {
				  _totalrating += parseInt(value.rating);
				});
				if(self.reviewList.data.length)
				self.OverallRating = _totalrating/self.reviewList.data.length;*/
            });
        }
	}
	ReviewsController.$inject = ["ReviewModel", "$state", "utilFactory", "toaster", "Spinner", "AccountModel", "ResolveData"];
    //end of controller

    angular
        .module('BeautyCollective.Account')
        .controller('ReviewsController', ReviewsController);
})();

(function() {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Account.Factory.ReviewResource
     * @module BeautyCollective.Account
     *
     * @description
     * Implements CURD operations
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
      .module('BeautyCollective.Account')
      .factory('ReviewResource', ReviewResource);

    /* @ngInject */
    function ReviewResource($resource, APP_CONFIG) {
      /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
      return $resource('review/:id', {
          id: '@id',
        },
        {
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
			url:'UserReceivedReview',
			transformResponse: transformGetResponse2,
        },
		requestReview: {
			method: 'POST',
			url:'requestreview'
        },
		delete: {
                method: 'DELETE',
                params: {
                    id: '@id',
				},
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
(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
        model.find = function(id) {
            return ReviewResource.find(id).$promise;
        };
		
		model.UserReceivedReview = function() {
            return ReviewResource.UserReceivedReview().$promise;
        };
        
		/**
         * Create a new Review
         * @param Review Review
         * @return Review saved
         */
        model.save = function(review) {
            return ReviewResource.save(review).$promise;
        };

        /**
         * Update Review
         * @param Review Review
         * @return Review saved
         */
        model.update = function(review) {
            return ReviewResource.update(review).$promise;
        };

        /**
         * Delete Review
         * @param id id
         */
        model.delete = function(id) {
            return ReviewResource.delete(id).$promise;
        };
		
		
		/**
         * Delete Review
         * @param id id
         */
        model.all = function(id) {
            return ReviewResource.all(id).$promise;
        };
		
		/**
         * Request Review
         * @param object
         */
        model.requestReview = function(customer) {
            return ReviewResource.requestReview(customer).$promise;
        };
    }
    ReviewModel.$inject = ["ReviewResource"];
})();

(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Listing', ['ui.bootstrap', 'flow'])

    angular
        .module('BeautyCollective.Listing').config(['flowFactoryProvider','CSRF_TOKEN', function(flowFactoryProvider, CSRF_TOKEN) {
            // Can be used with different implementations of Flow.js
             flowFactoryProvider.factory = fustyFlowFactory;
        }]);
})();
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

		
		
		  self.delete_options = function($event, list_id){ 
            $event.preventDefault();
			
				$("#delete_options_"+list_id).slideToggle("slow");
		
           
        };
		
		 self.delete_options_cancel = function($event, list_id){
            $event.preventDefault();
			
				$("#delete_options_"+list_id).slideToggle("slow");
           
        };
		

        self.delete = function($event, list_id){
            $event.preventDefault();
			
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
				
            /* if(confirm('Are you sure you want to delete this listing.')){
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
			} */
        };

      

    }
    ListListingController.$inject = ["CategoriesModel", "ListingModel", "Listing_type", "$location", "moment", "toaster", "Spinner", "$state"];
    //end of controller

    angular
        .module('BeautyCollective.Listing')
        .controller('ListListingController', ListListingController);
})();

(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
                    template: '<div ui-view="account_job_seeker_view" class="fadeIn animated"></div>'
                },
                'account_top_nav_view' : {
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

(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.JobSeekerController
     * @module BeautyCollective.Account
     *
     * @description
     * JobSeekerController is responsible manage user's review
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

    /* @ngInject */
    function JobSeekerController($state,AccountModel,toaster) {
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
             self.jobseekerList = [];
        }

        /**
        * getJobSeaker
        * @params {Object}
        * @return {id}
        */
        self.getJobSeaker = function(){
          return AccountModel.getJobSeekers({
                'q': self.q
            }).then(function(responce) {
                self.jobseekerList = responce;
				if(self.jobseekerList.length){
					self.statusText = "";
				}else{
					self.statusText = "No Record Found";
				}
            }, function(error) {
                return [];
            });
        }   

    }
    JobSeekerController.$inject = ["$state", "AccountModel", "toaster"];
    //end of controller

    angular
        .module('BeautyCollective.Account')
        .controller('JobSeekerController', JobSeekerController);
})();
