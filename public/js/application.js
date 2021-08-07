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
        'BeautyCollective.Core'

    ]);

    angular.element(document).ready(function() {
        var location = window.location;
        if (location.hasOwnProperty('pathname') && (location.pathname === '/account')) {
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
            // flowFactoryProvider.factory = fustyFlowFactory;
        }]);
})();
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
    function CreateListingController(CategoriesModel, $state, $q, toaster, ListingModel, ResolveData, utilFactory, Listing_type, SuburbsModel,Spinner) {
        var self = this,
            list_id;

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
        self.categories = CategoriesModel.categories;
        self.subCategories = CategoriesModel.subCategories;
        self.parentCategory = CategoriesModel.categories[0];

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
            var categoryType = ResolveData.categoryType,
                parentCategoryId;

            if (categoryType.hasOwnProperty('type_code')) {
                if (categoryType.type_code === 'classified') {
                    getCategories(categoryType.type_code, categoryType.id).then(function(categories) {
                        CategoriesModel.categories.length = 0;
                        Array.prototype.push.apply(CategoriesModel.categories, categories);
                    });
                } else {
                    getCategories(categoryType.type_code, null).then(function(categories) {
                        CategoriesModel.categories.length = 0;
                        Array.prototype.push.apply(CategoriesModel.categories, categories);
                    });
                }
            }

            if (list_id) {
                getList();
            }
        }
        self.listing.flowFiles = [];
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
                self.parentCategory = CategoriesModel.categories[0];
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
            getCategories(ResolveData.categoryType.type_code, $model.id).then(function(subCategories) {
                CategoriesModel.subCategories.length = 0;
                Array.prototype.push.apply(CategoriesModel.subCategories, subCategories);

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
                 Spinner.stop();
                toaster.pop('success', "Listing Saved", "Listing has been saved.");
                $state.go('listing.list');
            }, function(errorResponse) {
                 Spinner.stop();
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
    CreateListingController.$inject = ["CategoriesModel", "$state", "$q", "toaster", "ListingModel", "ResolveData", "utilFactory", "Listing_type", "SuburbsModel", "Spinner"];
    //end of controller

    angular
        .module('BeautyCollective.Listing')
        .controller('CreateListingController', CreateListingController);
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
    function ListListingController(CategoriesModel, ListingModel, Listing_type,$location) {
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
            ListingModel.delete({id:list_id}).then(function(responseData){
                _.each(self.listing.data, function(list, index){
                    if(list.id === list_id){
                        self.listing.data.splice(index, 1);
                        return;
                    }
                })
            }, function(errorResponse){
                console.log('unable to delete list : ', errorResponse);
            })
        };

      

    }
    ListListingController.$inject = ["CategoriesModel", "ListingModel", "Listing_type", "$location"];
    //end of controller

    angular
        .module('BeautyCollective.Listing')
        .controller('ListListingController', ListListingController);
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
     * @name BeautyCollective.Account.config.AccountSettingsStates
     * @module BeautyCollective.Account
     *
     * @description
     * Configure Account module routes
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
                    template: '<div ui-view="account_settings_view" class="fadeIn animated"></div>'
                    
                },
                'account_top_nav_view' : {
                    templateUrl: APP_CONFIG.modules + '/account/settings/settings-nav.html'
                }
            }
        }).state('settings.details', {
            parent: 'settings',
            url: '/details',
            views: {
                'account_settings_view@settings': {
                    templateUrl: APP_CONFIG.modules + '/account/settings/details.html',
                    controller: 'AccountSettingsController as _self'
                }
            },
            resolve: {
                ResolveData: ["ResolveData", function(ResolveData){
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
                ResolveData: ["ResolveData", function(ResolveData){
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
                ResolveData: ["ResolveData", function(ResolveData){
                return ResolveData.user;
                }]
            }
        });
    }
    AccountSettingsStates.$inject = ["$stateProvider", "APP_CONFIG"];
})();

(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.AccountSettingsController
     * @module BeautyCollective.Account
     *
     * @description
     * AccountSettingsController is responsible manage user's review
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

    /* @ngInject */
    function AccountSettingsController($state, AccountModel, ResolveData, toaster, SuburbsModel, $http) {
        var self = this;
        init();


        /**
         * initialize properties
         * 
         * @private
         * @return {void}
         */

        function init() {
            /**
             * get suburbList
             * 
             * @private
             * @return {void}
             */
            self.suburbList = [];
            /**
             * get userdata
             * 
             * @private
             * @return {void}
             */

            self.userModel = {
                'id': ResolveData.id,
                'name': ResolveData.name,
                'about': (ResolveData.user_info) ? ResolveData.user_info.about : '',
                'address': (ResolveData.user_info) ? ResolveData.user_info.address : '',
                'suburb': (ResolveData.user_info && ResolveData.user_info.user_suburb) ? ResolveData.user_info.user_suburb : null,
                'email': ResolveData.email,
                'logo' : (ResolveData.profilepic && ResolveData.profilepic.name) ? ResolveData.profilepic.path + 'thumb_small_' + ResolveData.profilepic.name : null,
                'video' : (ResolveData.profilevideo && ResolveData.profilevideo.name) ? ResolveData.profilevideo.name : null
            };

            // console.log(ResolveData.user.id);
        }

        /**
         * save user data
         * 
         * @private
         * @return {void}
         */

        self.saveuser = function() {
            var _user = angular.copy(self.userModel),
                resource = AccountModel.update({
                    id: _user.id
                }, _user);
            resource.then(function(successResponse) {
                toaster.pop('success', "Detail Save", "Datails has been updated.");
            }, function(errorResponse) {
                console.log('Saving Details:', errorResponse);
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
            SuburbsModel.findLocation({
                'q': val
            }).then(function(successResponse) {
                self.suburbList = successResponse.list;
            }, function(errorResponse) {
                console.info('Getting locations:', errorResponse);
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


         /**
         * change user profile pic
         * 
         * @params {images chunks}
         * @return {object}
         */

        self.flowConfig = function() {
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
                query: function(flowFile, flowChunk) {
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
        self.fileUploadSuccess = function($file, $res) {
            var obj = JSON.parse($res);
            self.userModel.logo = obj.path+'thumb_small_'+obj.name;
            toaster.pop('success', "Logo Uploaded", "Logo has been uploaded successfully.");
        };


        /**
         * change user profile pic
         * 
         * @params {images chunks}
         * @return {object}
         */

        self.videoflowConfig = function() {
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
                query: function(flowFile, flowChunk) {
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
        self.videoUploadSuccess = function($file, $res) {
           console.log('video has been uploaded successfully.')
           var obj = JSON.parse($res);
           self.userModel.video = obj.name;
           toaster.pop('success', "Video Uploaded", "Video has been uploaded successfully.");
        };
    }
    AccountSettingsController.$inject = ["$state", "AccountModel", "ResolveData", "toaster", "SuburbsModel", "$http"];
    //end of controller

    angular
        .module('BeautyCollective.Account')
        .controller('AccountSettingsController', AccountSettingsController);
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
    function ReviewsController(ReviewModel,$state,utilFactory,toaster,Spinner) {
        var self = this;
        init();
		self.reviewList='';
        /**
         * initialize properties
         * 
         * @private
         * @return {void}
         */

        function init() {
			getReviewlist();
            self.rate = 0;
            self.max = 5;
            self.isReadonly = false;
            self.OverallRating = 0;
            self.currentPage = 0;
            self.pageSize = 2;
            
		}
		
		
		/**
		* Save Review
		* @params {Object}
		* @return {id}
		*/
		
		 self.saveReview = function() {
            Spinner.start();
		   var _review = angular.copy(self.review);
		   ReviewModel.save({
                    'review': _review,
                    'rate':self.rate,
                    'to_user': 2
           }).then(function(responce){
                    toaster.pop('success', "Review Saved", "Review has been saved successfully.");
                        self.review = '';
                        self.rate=0;
                        Spinner.stop();
                    },function(error){
                        Spinner.stop();
                             
                });
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
            ReviewModel.all({
                'to_user': 2
            }).then(function(response) {
			    self.reviewList = angular.copy(response);
               
            self.numberOfPages=function(){
                return Math.ceil(self.reviewList.data.length/self.pageSize);                
            }
            var _totalrating = 0;
            angular.forEach(self.reviewList.data, function(value, key) {
              _totalrating += parseInt(value.rating);
              
            });
            if(self.reviewList.data.length)
            self.OverallRating = _totalrating/self.reviewList.data.length;
            });
        }

    }
    ReviewsController.$inject = ["ReviewModel", "$state", "utilFactory", "toaster", "Spinner"];
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
    }
    ReviewModel.$inject = ["ReviewResource"];
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
                    deferred.resolve({
                        'jobs_applied': response.jobs_applied,
                        'jobs_preferred': response.jobs_preferred,
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
                    return JobResolveData.jobs_shortlisted;
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
    function UserController($state,SuburbsModel,AccountModel,ResolveData,toaster) {
        var self = this;
        init();

        /**
         * initialize properties
         * 
         * @private
         * @return {void}
         */

        function init() {
             self.suburbList = SuburbsModel.findAll({'id':null});
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
            var _user = angular.copy(self.userModel),
                resource = AccountModel.update({
                    id: _user.id
                }, _user);
            resource.then(function(successResponse) {
                toaster.pop('success', "Detail Save", "Datails has been updated.");
            }, function(errorResponse) {
                console.log('Saving Details:', errorResponse);
            });
        };

        

    }
    UserController.$inject = ["$state", "SuburbsModel", "AccountModel", "ResolveData", "toaster"];
    //end of controller

    angular
        .module('BeautyCollective.Account')
        .controller('UserController', UserController);
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

(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.AccountBusinessInfoController
     * @module BeautyCollective.Account
     *
     * @description
     * AccountBusinessInfoController is responsible manage user's business info
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

    /* @ngInject */
    function AccountBusinessInfoController($state, AccountModel, AccountFactory, ResolveData, toaster, SuburbsModel,CategoriesModel,Spinner) {
        var self = this;

        self.timeOptions = {
            readonlyInput: false,
            showMeridian: true
        };

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

        /**
         * initialize properties
         * 
         * @private
         * @return {void}
         */
        init();

        function init() {
            /**
             * get userInfo
             * 
             * @private
             * @return {void}
             */
            self.userBusinessModel = ResolveData.user_business ? {
                'id': ResolveData.id,
                'name': ResolveData.user_business.business_name,
                'website': ResolveData.user_business.website,
                'address': ResolveData.user_business.business_address,
                'locations': (ResolveData.user_business.user_business_suburb) ? [ResolveData.user_business.user_business_suburb] : [],
                'email': ResolveData.user_business.business_email,
                'categories': (ResolveData.user_business.business_categories) ? angular.fromJson(ResolveData.user_business.business_categories) : [],
            } : {
                'id': ResolveData.id
            };

            self.bussinessDays = AccountFactory.getDefaultBusinessDays();
            self.bussinessHours = (ResolveData.user_business && ResolveData.user_business.operating_hours) ? angular.fromJson(ResolveData.user_business.operating_hours) : AccountFactory.getDefaultBusinessHours();
            
        }

        /**
         * save user business data
         * 
         * @private
         * @return {void}
         */

        self.updateBusinessInfo = function() {
            Spinner.start();
            if (self.userBusinessModel.hasOwnProperty('id')) {
                self.userBusinessModel.operating_hours = angular.toJson(self.bussinessHours);
                self.userBusinessModel.categories = angular.toJson(self.userBusinessModel.categories);
            }
            var _business = angular.copy(self.userBusinessModel),resource;
            _business.locations = _.map(_business.locations, function(location){
              return location.id;
            })

                resource = AccountModel.updatebusiness({
                    id: _business.id
                }, _business);
            resource.then(function(successResponse) {
                toaster.pop('success', "Business Detail Save", "Business Datails has been saved Successfully.");
                Spinner.stop();
            }, function(errorResponse) {
                Spinner.stop();
                console.log('Saving Business Detail:', errorResponse);
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
		
		/**
         * @param  {[type]}
         * @return {[type]}
         */
        self.getCategories = function(val) {
            if (val.length < 3) {
                return;
            }
            CategoriesModel
                .searchcategories({
                    'q': val
                }).then(function(successResponse) {
                    self.categoriesList = successResponse.list;
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
    AccountBusinessInfoController.$inject = ["$state", "AccountModel", "AccountFactory", "ResolveData", "toaster", "SuburbsModel", "CategoriesModel", "Spinner"];
    //end of controller

    angular
        .module('BeautyCollective.Account')
        .controller('AccountBusinessInfoController', AccountBusinessInfoController);
})();

(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
                    template: '<div ui-view="account_business_info_view" class="fadeIn animated"></div>'
                },
                'account_top_nav_view' : {
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
                ResolveData: ["ResolveData", function(ResolveData){
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
                ResolveData: ["ResolveData", function(ResolveData){
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
                ResolveData: ["ResolveData", function(ResolveData){
                return ResolveData.user;
                }]
            }
        });
    }
    AccountBusinessInfoStates.$inject = ["$stateProvider", "APP_CONFIG"];
})();

(function() {
  'use strict';
  /*global angular: false */

  angular.module('BeautyCollective.Widgets', ['BeautyCollective.Core']);
}());
'use strict';
angular
  .module('BeautyCollective.Widgets')
  .directive('notifications',function(){
		return {
        templateUrl:'widgets/notifications/notifications.html',
        restrict: 'E',
        replace: true,
    	};
	});



'use strict';
angular
  .module('BeautyCollective.Widgets')
  .directive('timeline',function() {
    return {
        templateUrl:'widgets/timeline/timeline.html',
        restrict: 'E',
        replace: true,
    };
  });

(function() {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Widgets.Factory.ShortlistjobResource
     * @module BeautyCollective.Widgets
     *
     * @description
     * Implements CURD operations
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
      .module('BeautyCollective.Widgets')
      .factory('ShortlistjobResource',ShortlistjobResource);
	
	/* @ngInject */
    function ShortlistjobResource($resource, APP_CONFIG) {
      /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
      return $resource('../shortlistjob', {},
        {
        ShortlistJob: {
          method: 'POST'
        }
      });
    }
    ShortlistjobResource.$inject = ["$resource", "APP_CONFIG"];
})();
(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
		
		model.ShortlistJob = function(params, success, fail) {
            return ShortlistjobResource.ShortlistJob(params, success, fail).$promise;
        };
		
    }
    ShortlistjobModel.$inject = ["ShortlistjobResource"];
})();

(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.ShortlistjobController
     * @module BeautyCollective.Widgets
     *
     * @description
     * ShortlistjobController is responsible for booking appointments
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .controller('ShortlistjobController', ShortlistjobController);

    /* @ngInject */

    function ShortlistjobController($sanitize,$q, Logger, Spinner, ShortlistjobModel,toaster) {

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
		
		  
	  self.shortlistJob= function() {
		ShortlistjobModel.ShortlistJob({
			},{id:self.id}).then(function(responce){
				if(responce.status){
                    toaster.pop('success', "Job Saved", responce.message);
				}else{
					toaster.pop('error', "Job Already Saved", responce.message);
				}
			},function(){
		});
	  };

		
	}
	ShortlistjobController.$inject = ["$sanitize", "$q", "Logger", "Spinner", "ShortlistjobModel", "toaster"];
})();

(function() {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.shortlistJob
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .directive('shortlistJob', [function() {
            return {
               restrict: 'EA',
                scope: {
                    "id": "@id"
                },
                templateUrl: '/apps/widgets/shortlist-job/shortlistjob.html',
                controller:'ShortlistjobController',
                controllerAs: 'self',
                bindToController: true, //required in 1.3+ with controllerAs
                link: function(scope, element, iAttrs, ngModel) {
                }
            };
        }]);
})();

(function() {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Widgets.Factory.SearchResultResource
     * @module BeautyCollective.Widgets
     *
     * @description
     * Implements CURD operations
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
      .module('BeautyCollective.Widgets')
      .factory('SearchResultResource', SearchResultResource);

    /* @ngInject */
    function SearchResultResource($resource, APP_CONFIG) {
      /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
      return $resource('getrecords', {},
        {
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
(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
		
		model.findAll = function(params, success, fail) {
            return SearchResultResource.findAll(params, success, fail).$promise;
        };
        
    }
    SearchResultModel.$inject = ["SearchResultResource"];
})();

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

    function SearchResultController($sanitize, $q, Logger, Spinner, SearchResultModel, $location) {

        /**
         * [self description]
         * @type {[type]}
         */
        var self = this;
        self.host = $location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : '');
        self.selectedTabs = [];

        self.tabs = [{
            'id': 'deal',
            'active': false,
            'label': 'Deals',
            'url': 'deals',
            'aclass': 'search_deal_icon'
        }, {
            'id': 'businessforsale',
            'active': false,
            'label': 'Business for sale',
            'url': 'business',
            'aclass': 'search_business_icon'
        }, {
            'id': 'schoolcolleges',
            'active': false,
            'label': 'Schools & Colleges',
            'url': 'schoolcolleges',
            'aclass': 'search_schoolcolleges_icon'
        }, {
            'id': 'gallery',
            'active': false,
            'label': 'Gallery',
            'url': 'gallery',
            'aclass': 'search_gallery_icon'
        }, {
            'id': 'serviceprovider',
            'active': false,
            'label': 'Service Provider',
            'url': 'profile',
            'aclass': 'search_serviceprovider_icon'
        }, {
            'id': 'job',
            'active': false,
            'label': 'Jobs',
            'url': 'jobs',
            'aclass': 'search_job_icon'
        }, {
            'id': 'classified',
            'active': true,
            'label': 'Classifieds',
            'url': 'classifieds',
            'aclass': 'search_classifieds_icon'
        }];

        init();

        /**
         * [init description]
         * @return {void}
         */
        function init() {
            Logger.getInstance('SearchResultController').info('Search Result Controller has initialized');
            self.qs = getQueryStrings();
            setSelecteTabs(self.qs['searchFor']);
            getRecords();
        }

        function getRecords() {
            Spinner.start();
            SearchResultModel.findAll(self.qs).then(function(responce) {
                _.each(self.selectedTabs, function(item, index) {
                    self.selectedTabs[index].data = responce[item.id];
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

        function setSelecteTabs(searchFor) {
            var searchFor = searchFor.split(',');
            _.each(searchFor, function(item, index) {
                _.each(self.tabs, function(tab, index) {
                    if (item == tab.id) {
                        self.tabs[index].active = true;
                        self.selectedTabs.push(tab);
                    }
                });
            });
        }

        self.selectTab = function(tab) {
            _.each(self.tabs, function(list, index) {
                if (list.id === tab.id) {
                    if (list.active) {
                        if (self.selectedTabs.length > 1) {
                            self.tabs[index].active = false;
                            self.qs.searchFor = "";
                            var tab_index = '';
                            _.each(self.selectedTabs, function(item, index) {
                                if (item.id == tab.id)
                                    tab_index = index;
                                else self.qs.searchFor += item.id + ',';
                                //return;
                            });
                            self.qs.searchFor = _.trim(self.qs.searchFor, [',']);
                            self.selectedTabs.splice(tab_index, 1);
                        }
                    } else {
                        if (self.selectedTabs.length < 3) {
                            Spinner.start();
                            self.tabs[index].active = true;
                            tab.data = "";
                            self.selectedTabs.push(tab);
                            var query = angular.copy(self.qs);
                            query.searchFor = tab.id;
                            SearchResultModel.findAll(query).then(function(responce) {
                                self.selectedTabs[self.selectedTabs.length - 1].data = responce[tab.id];
                                self.qs.searchFor = "";
                                _.each(self.selectedTabs, function(item, index) {
                                    self.qs.searchFor += item.id + ','
                                });
                                self.qs.searchFor = _.trim(self.qs.searchFor, [',']);
                                Spinner.stop();
                            }, function(error) {
                                Spinner.stop();
                                return [];
                            });
                        }
                    }
                    return;
                }
            });
        }

    }
    SearchResultController.$inject = ["$sanitize", "$q", "Logger", "Spinner", "SearchResultModel", "$location"];
})();

(function() {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.widgetLogin
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .directive('widgetSearchResult', [function() {
            return {
               restrict: 'EA',
                scope: {
                    "query": "@query",
                },
                templateUrl: '/apps/widgets/search-result/results.html',
                controller:'SearchResultController',
                controllerAs: 'self',
                bindToController: true, //required in 1.3+ with controllerAs
                link: function(scope, element, iAttrs, ngModel) {
                }
            };
        }]);
})();

(function() {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Widgets.Factory.SearchResource
     * @module BeautyCollective.Widgets
     *
     * @description
     * Implements CURD operations
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
      .module('BeautyCollective.Widgets')
      .factory('SearchResource', SearchResource);

    /* @ngInject */
    function SearchResource($resource, APP_CONFIG) {
      /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
      return $resource('search', {},
        {
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
(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
		
		model.findAll = function(params, success, fail) {
            return SearchResource.findAll(params, success, fail).$promise;
        };
        
    }
    SearchModel.$inject = ["SearchResource"];
})();

(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.SearchController
     * @module BeautyCollective.Widgets
     *
     * @description
     * SearchController is responsible for search listings
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .controller('SearchController', SearchController);

    /* @ngInject */

    function SearchController($sanitize,$q, Logger, Spinner, SearchModel) {

        /**
         * [self description]
         * @type {[type]}
         */
        var self = this;
        self.selected = true;
		init();
       
        /**
         * [init description]
         * @return {void}
         */
        function init() {
           Logger.getInstance('SearchController').info('Search Controller has initialized');
           self.selected = true;
           self.lastFoundWord = null;
           self.currentIndex = null;
           self.justChanged = false;
           self.searchTimer = null;
           self.searching = false;
           self.pause = 500;
           self.minLength = 3;
        }

        self.modelOptions = {
            debounce: {
                default: 500,
                blur: 250
            },
            getterSetter: true
        };

        self.searchRecord = function(q) {
            var deffered =  $q.defer();
            if(!q && q.length <3){
                return;
            }
            return SearchModel.findAll({
                'q': self.q,
                'post': self.post,
                'state': self.state
            }).then(function(responce) {
                return responce.list;
            }, function(error) {
                return [];
            });

        };
        self.handleSelection = function(item) {
            self.q = item;
            self.selected = true;
        };

		


        if (self.userPause) {
            self.pause = self.userPause;
        }

        self.processResults = function(responseData) {
            if (responseData && responseData.length > 0) {
                self.results = [];
                var titleFields = [];
                if (self.titleField && self.titleField != "") {
                    titleFields = self.titleField.split(",");
                }

                for (var i = 0; i < responseData.length; i++) {
                    // Get title variables
                    var titleCode = "";

                    for (var t = 0; t < titleFields.length; t++) {
                        if (t > 0) {
                            titleCode = titleCode +  " + ' ' + ";
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
        }

        self.searchTimerComplete = function(str) {
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
                    self.processResults(matches);
                    self.$apply();


                } else {

                    SearchModel.findAll({'q':self.searchStr,
                         'post':self.post,
                         'state':self.state}).then(function(responce){
                             self.selected = false;
                             self.searching = false;
                             self.processResults(responce.list);
                         },function(error){
                             
                         });
                   
                }
            }

        }

        self.hoverRow = function(index) {
            self.currentIndex = index;
        }

        self.keyPressed = function(event) {
           
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
                        self.searchTimer = setTimeout(function() {
                            self.searchTimerComplete(self.searchStr);
                        }, self.pause);
                    }


                }

            } else {
                event.preventDefault();
            }
        }

        self.selectResult = function(result) {
            self.searchStr = result.title;
            self.selectedObject = result;
            self.showDropdown = false;
            self.results = [];
            //self.$apply();
        }
    }
    SearchController.$inject = ["$sanitize", "$q", "Logger", "Spinner", "SearchModel"];
})();

(function() {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.widgetLogin
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .directive('widgetSearch', [function() {
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
                templateUrl: '/apps/widgets/search/search.html',
                controller:'SearchController',
                controllerAs: 'self',
                bindToController: true, //required in 1.3+ with controllerAs
                link: function(scope, element, iAttrs, ngModel) {
                    element.bind("keyup", function (event) {
                        if(event.which === 40) {
                            if ((scope.currentIndex + 1) < scope.results.length) {
                                scope.currentIndex ++;
                                scope.$apply();
                                event.preventDefault;
                                event.stopPropagation();
                            }

                            scope.$apply();
                        } else if(event.which == 38) {
                            if (scope.currentIndex >= 1) {
                                scope.currentIndex --;
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
                }
            };
        }]);
})();

(function() {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Widgets.Factory.RatingResource
     * @module BeautyCollective.Widgets
     *
     * @description
     * Implements CURD operations
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
      .module('BeautyCollective.Widgets')
      .factory('RatingResource', RatingResource);

    /* @ngInject */
    function RatingResource($resource, APP_CONFIG) {
      /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
      return $resource('../rating', {
		  requestType :'@requestType'
	   },
        {
        saveRating: {
          method: 'POST'
        },
		save: {
			url:'review',
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
(function() {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Widgets.Service.RatingModel
     * @module BeautyCollective.Widgets
     *
     * @description
     *
     * Data model for jobtask module
     * Implemenets CURD operation
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
		
		model.saveRating = function(params, success, fail) {
            return RatingResource.saveRating(params, success, fail).$promise;
        };
        /**
         * Create a new Review
         * @param Review Review
         * @return Review saved
         */
        model.save = function(review) {
            return RatingResource.save(review).$promise;
        };
    }
    RatingModel.$inject = ["RatingResource"];
})();

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
           toaster.pop('success', "Review Saved", "Review has been saved successfully.");
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
		   RatingModel.save({
                    'review': _review,
                    'rate':self.rate,
                    'to_user': self.userto
           }).then(function(responce){
					toaster.pop('success', "Review Saved", "Review has been saved successfully.");
                        self.review = '';
                        self.rate = 0;
					},function(error){
                             
                });
		 };
    }
    RatingController.$inject = ["$sanitize", "$q", "Logger", "Spinner", "RatingModel", "toaster"];
})();

(function() {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.widgetLogin
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .directive('widgetRating', [function() {
            return {
               restrict: 'EA',
                scope: {
                    "id": "@id",
                    "userto": "@userto",
					"userfrom": "@userfrom"
                },
                templateUrl: '/apps/widgets/rating/rating.html',
                controller:'RatingController',
                controllerAs: 'self',
                bindToController: true, //required in 1.3+ with controllerAs
                link: function(scope, element, iAttrs, ngModel) {
                }
            };
        }]);
})();

'use strict';
angular
  .module('BeautyCollective.Widgets')
  .directive('chat',function(){
		return {
        templateUrl:'/apps/widgets/chat/chat.html',
        restrict: 'E',
        replace: true,
    	};
	});



(function() {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.locationMap
     * @module BeautyCollective.Widgets
     *
     * @description
     * This directive is used to avail all feature from google map API and use in application as independent widget
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .directive('locationMap', ['Laravel', function(Laravel) {
            return {
                templateUrl: '/apps/widgets/location-map/location-map.html',
                restrict: 'E',
                scope : {
                    locationInfo : '='
                },
                link: function(scope, element, attrs, ngModel) {
                },
                controller : 'LocationMapController'
            };
        }]);
})();

(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.LocationMapController
     * @module BeautyCollective.Widgets
     *
     * @description
     * LocationMapController is responsible for login implementation
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
            zoom: 4,
            marker: {
                id: 0,
                coords: {
                    latitude: $scope.locationInfo.latitude,
                    longitude: $scope.locationInfo.longitude
                },
                options: {
                    showWindow: true,
                    animation: 1,
                    labelContent: $scope.locationInfo.name + ', '+$scope.locationInfo.state + '-' +$scope.locationInfo.postcode,
                    labelClass: "marker-labels",
                    labelAnchor:"50 0"
                }
            }
        };

        uiGmapGoogleMapApi.then(function(maps) {

        });


    }
    LocationMapController.$inject = ["$sanitize", "$scope", "$timeout", "$log", "$http", "Logger", "Spinner", "uiGmapGoogleMapApi"];
})();

(function() {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.widgetBooking
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .directive('widgetBooking', [function() {
            return {
               restrict: 'EA',
                scope: {
                    "id": "@id",
                    "userto": "@userto",
					"userfrom": "@userfrom",
                    "categories":"@categories"
                },
                templateUrl: '/apps/widgets/booking/booking.html',
                controller:'BookingController',
                controllerAs: 'self',
                bindToController: true, //required in 1.3+ with controllerAs
                link: function(scope, element, iAttrs, ngModel) {
                }
            };
        }]);
})();

(function() {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Widgets.Factory.BookingResource
     * @module BeautyCollective.Widgets
     *
     * @description
     * Implements CURD operations
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
      .module('BeautyCollective.Widgets')
      .factory('BookingResource',BookingResource);
	
	/* @ngInject */
    function BookingResource($resource, APP_CONFIG) {
      /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
      return $resource('../bookappointment', {},
        {
        saveAppointment: {
          method: 'POST'
        },
		    getServices: {
		      url:'services',
          method: 'GET',
		      isArray:true
        }
      });
    }
    BookingResource.$inject = ["$resource", "APP_CONFIG"];
})();
(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
		
		model.saveAppointment = function(params, success, fail) {
            return BookingResource.saveAppointment(params, success, fail).$promise;
        };
		
		model.getServices = function(params, success, fail) {
            return BookingResource.getServices(params, success, fail).$promise;
        };
        
    }
    BookingModel.$inject = ["BookingResource"];
})();

(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.BookingController
     * @module BeautyCollective.Widgets
     *
     * @description
     * BookingController is responsible for booking appointments
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .controller('BookingController', BookingController);

    /* @ngInject */

    function BookingController($sanitize,$q, Logger, Spinner, BookingModel,uibDateParser) {

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
		    self.serviceprovidercategories =  (self.categories) ? angular.fromJson(self.categories) : [];
			self.services=[];
        }
		
		self.today = function() {
			self.appointmentdate = new Date();
		 };
	  	self.today();

		  self.clear = function() {
			self.appointmentdate = null;
		  };

		  // Disable weekend selection
		  self.disabled = function(date, mode) {
			return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
		  };

		  self.toggleMin = function() {
			self.minDate = self.minDate ? null : new Date();
		  };

		  self.toggleMin();
			self.maxDate = new Date(2020, 5, 22);

		  self.open1 = function() {
			self.popup1.opened = true;
		  };

		  self.setDate = function(year, month, day) {
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
		  self.toggleMode = function() {
			self.ismeridian = ! self.ismeridian;
		  };
		  
		  self.appointmentservices = [{
			  index:1,
			  category:null,
			  service:null
		  }];
		  
		  self.removeService= function(index) {
			//var index = self.services.indexOf($file.id);
			for(var item in self.appointmentservices){
				if(self.appointmentservices[item].index==index){
					self.appointmentservices.splice(item, 1);
					break;
				}
			}
		  };
		
		  self.addService= function(last) {
			self.appointmentservices.push({
			  index:last+1,
			  category:null,
			  service:null
			});
		  };

		 self.bookAppointment = function(){
		 	var _data = {'appointmentdate':self.appointmentdate,
					'appointmenttime':self.appointmenttime,
					'appointmentservices':angular.toJson(self.appointmentservices),
					'touser':self.userto
					}
			 BookingModel.saveAppointment({
				},_data).then(function(responce){
					 self.appointmentservices = [{
						  index:1,
						  category:null,
						  service:null
					  }];
				},function(){
			});
		 }
		 
		 self.selectCategory = function(item,id){
			self.services[id] = [];
			BookingModel.getServices({
					'id':item.id
				}).then(function(responce){
					self.services[id].serviceproviderServices = responce;
				},function(){
			});
		 }
	}
	BookingController.$inject = ["$sanitize", "$q", "Logger", "Spinner", "BookingModel", "uibDateParser"];
})();

(function() {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.widgetLogin
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .directive('widgetAuth', [function() {
            return {
                templateUrl: '/apps/widgets/auth/auth.html',
                restrict: 'E',
                link: function(scope, element, iAttrs, ngModel) {

                }
            };
        }]);
})();

(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.AuthController
     * @module BeautyCollective.Widgets
     *
     * @description
     * AuthController is responsible for login implementation
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .controller('AuthController', AuthController);

    /* @ngInject */
    function AuthController($sanitize, $http, Logger, Spinner) {
        /**
         * [self description]
         * @type {[type]}
         */
        var self = this;
        /**
         * [userSchema description]
         * @type {Object}
         */
        self.userSchema = {
            name: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            password_confirmation: '',
            contact_number: '',
            business_name: '',
            account_type: 'individual',
            suburb: ''
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

        init();
        /**
         * [init description]
         * @return {void}
         */
        function init() {
            Logger.getInstance('AuthController').info('Controller has initialized');
            self.isShown = true;
        }
        /**
         * [sanitizeCredentials description]
         * @author Mohan Singh <mslogicmaster@gmail.com>
         * @param  {[type]} credentials [description]
         * @return {[type]}             [description]
         */
        var sanitizeCredentials = function(credentials) {
            return {
                email: $sanitize(credentials.email),
                password: $sanitize(credentials.password)
            };
        };
        /**
         * [authentication description]
         * @author Mohan Singh <mslogicmaster@gmail.com>
         * @param  {[type]} credentials [description]
         * @return {[type]}             [description]
         */
        self.authentication = function() {
            Spinner.start();

            var login = $http.post("/auth/login", sanitizeCredentials(self.login));
            login.success(function(response) {
                window.location.href = '/account';
                Spinner.stop();
            });
            login.error(function(errorResponse) {
                self.errors = formartErrors(errorResponse);
                Spinner.stop();
            });
        };
        self.registerAccount = function() {
            Spinner.start();
            if (self.user.account_type !== 'individual') {
                self.user.name = self.user.firstName + '' + self.user.lastName;
            }
            var register = $http.post("/auth/register", self.user);
            register.success(function(response) {
                if (response.success) {
                    resetForm();
                    resetFlash();
                    self.successMsg = 'Your account was successfully created. We have sent you an e-mail to confirm your account';
                }
                Spinner.stop();
            });
            register.error(function(errorResponse) {
                self.errors = formartErrors(errorResponse);
                Spinner.stop();
            });
        };

        function formartErrors(errors) {
            var errorLabels = [];
            if (angular.isObject(errors) && !errors.hasOwnProperty('success')) {
                for (var error in errors) {
                    for (var i = 0; i < errors[error].length; i++) {
                        errorLabels.push(errors[error][i]);
                    };
                }
            }
            if (errors.hasOwnProperty('success')) {
                if (errors.hasOwnProperty('error')) {
                    errorLabels.push(errors.error);
                }
            }
            return errorLabels;
        }

        /**
         * [dropdown description]
         * @type {Object}
         */
        self.dropdown = {
            login: {
                isopen: false,
                toggle: function() {
                    resetForm();
                    resetFlash();
                },
                toggleDropdown: function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    self.dropdown.login.isopen = !self.dropdown.login.isopen;
                }
            },
            register: {
                isopen: false,
                toggle: function() {
                    resetForm();
                    resetFlash();
                },
                toggleDropdown: function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    self.dropdown.register.isopen = !self.dropdown.register.isopen;
                }
            }

        };

        self.setUserType = function(userType) {
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

    }
    AuthController.$inject = ["$sanitize", "$http", "Logger", "Spinner"];
})();

(function() {
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Suburbs', []);
})();
(function() {
  'use strict';
  /**
   * @ngdoc Factory
   * @name BeautyCollective.Suburbs.Factory.SuburbsResource
   * @module BeautyCollective.Suburbs
   *
   * @description
   * Implements CURD operations
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Suburbs')
    .factory('SuburbsResource', SuburbsResource);

  /* @ngInject */
  function SuburbsResource($resource, APP_CONFIG) {
    return $resource('locations/:id', {}, {
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
(function() {
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
    model.findAll = function(params, callback) {
      return SuburbsResource.findAll(params);
    };

    model.findLocation = function(params, callback) {
      return SuburbsResource.findAll(params).$promise;
    };
  }
  SuburbsModel.$inject = ["SuburbsResource"];
})();
(function() {
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Users')
    .config(UsersState);

  /* @ngInject */
  function UsersState($stateProvider) {
    $stateProvider
      .state('users', {
        parent: 'dashboard',
        url:'/users',
        views: {
          'content': {
            templateUrl: 'modules/users/users.html',
          },
          'content_sidebar' : {
            templateUrl : 'modules/users/sidebar/users-sidebar.html',
            controller : 'UsersSidebarController as _self'
          }
        },
        resolve: {
          authorize: ['Auth',
            function(Auth) {
              return Auth.authorize();
            }
          ]
        }
      });
  }
  UsersState.$inject = ["$stateProvider"];
})();
(function() {
  'use strict';
  /**
   * @ngdoc Factory
   * @name BeautyCollective.Users.Factory.UsersResource
   * @module BeautyCollective.Users
   *
   * @description
   * Implements CURD operations
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Users')
    .factory('UsersResource', UsersResource);

  /* @ngInject */
  function UsersResource($resource, APP_CONFIG) {
    /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
    return $resource('macros/', {
      action: '@action',
      action_value : '@action_value'
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
        }, headers: {
          'Content-Type': undefined
        },
        transformRequest: function(data) {
          var formData = new FormData();
          //need to convert our json object to a string version of json otherwise
          // the browser will do a 'toString()' on the object which will result 
          // in the value '[Object object]' on the server.
          formData.append("photo",data);
          
          return formData;
        }
      },
      searchUsers : {
        url : 'api/v1/users/list',
        method :'GET',
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

(function() {
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Users')
    .service('UsersModel', UsersModel);

  /* @ngInject */
  function UsersModel(UsersResource) {
    var model = this;

    model.user = {
      firstName : '',
      lastName:'',
      email:'',
      roles:[],
      username:'',
      password : '',
      projectCode : ''
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
    model.find = function(id) {
      return UsersResource.find(id).$promise;
    };

    /**
     * [findAll description]
     * @method findAll
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     * @param  {[type]}          params [description]
     * @return {[type]}                 [description]
     */
    model.findAll = function(params, success, fail){
      return UsersResource.query(params, success, fail).$promise;
    };

    /**
     * Create a new users
     * @param users users
     * @return users saved
     */
    model.create = function(users) {
      return UsersResource.create(users).$promise;
    };

    /**
     * Update users
     * @param users users
     * @return users saved
     */
    model.update = function(params, users) {
      return UsersResource.update(params, users).$promise;
    };

    /**
     * [savePhoto description]
     * @param  {[type]} params [description]
     * @param  {[type]} data   [description]
     * @return {[type]}        [description]
     */
    model.savePhoto = function(params, data) {
      return UsersResource.savePhoto(params, data).$promise;
    };

     /**
     * Update user's status
     * @param users users
     * @return users saved
     */
    model.updateStatus = function(params, users) {
      return UsersResource.updateStatus(params, users).$promise;
    };

    /**
     * Delete users
     * @param id id
     */
    model.delete = function(id) {
      return UsersResource.delete(id).$promise;
    };

    /**
     * exclude user from userslist 
     * @param  {Integet} userId
     *
     * @protected
     * @return {void}
     */
    model.excludeUser = function(userId){
      angular.forEach(model.userslist, function(user, index){
        if(parseInt(user.id) === userId){
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
    model.getPhoto = function(params, success, fail) {
      return UsersResource.getPhoto(params, success, fail).$promise;
    };

    /**
     * [searchUsers description]
     * @param  {[type]} params  [description]
     * @param  {[type]} success [description]
     * @param  {[type]} fail    [description]
     * @return {[type]}         [description]
     */
    model.searchUsers = function(params, success, fail) {
      return UsersResource.searchUsers(params, success, fail).$promise;
    };

  }
  UsersModel.$inject = ["UsersResource"];
})();
(function() {
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
    factory.errorHandler = function(errorResponse) {
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
    factory.getUsers = function(options) {
      var deferred = $q.defer(),
        _sortBy = options.isSortReverse ? '-' : '';

      UsersModel.findAll({
        'page': options.page,
        'per_page': options.per_page,
        'sort_query': _sortBy + options.predicate
      }).then(function(successResponse) {
        UsersModel.totalCounts = successResponse.totalCount;
        parseResponse(successResponse.list);
        deferred.resolve(successResponse);
      }).catch(function(error) {
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

(function() {
  'use strict';
  /**
   * @ngdoc overview
   * @name BeautyCollective.Pages.PagesStateConfig
   * @module BeautyCollective.Pages
   *
   * @description
   * Static page states
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
            template: '<div ui-view="page-content" class="fade-in-up"></div>',
          }
        }

      });
  }
  PagesStateConfig.$inject = ["$stateProvider"];
})();
(function() {
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.bLaravel', []);
})();
'use strict';

angular.module('BeautyCollective')
  .config(["$stateProvider", function($stateProvider) {
    $stateProvider
      .state('home', {
        parent: 'index',
        url: '/',
        data: {
          roles: ['ROLE_ADMIN','ROLE_SYSTEM_ADMIN', 'ROLE_TESTER'],
          pageClass : 'home-page',
          pageTitle:'main.title'
        },
        views: {
          'content': {
            templateUrl: 'modules/main/main.html',
            controller: 'MainController'
          },
          'content_sidebar' : {
            templateUrl : 'modules/main/sidebar/main-sidebar.html',
            controller : 'MainSidebarController as _self'
          }
        },
        resolve: {
          mainTranslatePartialLoader: ['$translate', '$translatePartialLoader',
            function($translate, $translatePartialLoader) {
              $translatePartialLoader.addPart('main');
              return $translate.refresh();
            }
          ]
        }
      });
  }]);
(function() {
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective')
    .controller('MainController', MainController);

  /* @ngInject */
  function MainController($scope, $modal, Logger, LayoutService, notify, Spinner, $window, utilFactory, APP_CONFIG, $state, $filter) {
  }
  MainController.$inject = ["$scope", "$modal", "Logger", "LayoutService", "notify", "Spinner", "$window", "utilFactory", "APP_CONFIG", "$state", "$filter"];
})();

(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
            resolve: {
                Model: ['ListingModel', '$stateParams', function(ListingModel, $stateParams) {
                    return ListingModel;
                }],
                Listing_type: ["$stateParams", function($stateParams) {
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
            parent: 'listing.create',
            url: '/:listing_type',
            views: {
                'create_listing_view@listing.create': {
                    templateUrl: function($stateParams) {
                        return APP_CONFIG.modules + '/listing/partials/' + $stateParams.listing_type + '.form.html'
                    },
                    controller: 'CreateListingController as createListCtrl'
                }
            },
            resolve: {
                ResolveData: ['CategoriesModel', '$stateParams', '$q', function(CategoriesModel, $stateParams, $q) {
                    var deferred = $q.defer(),
                        categoryType;
                    CategoriesModel.all({
                        type: 'types'
                    }).then(function(response) {
                        Array.prototype.push.apply(CategoriesModel.categoryTypes, response.list);
                        categoryType = _.find(CategoriesModel.categoryTypes, {
                            'type_code': $stateParams.listing_type
                        }) || {};
                        deferred.resolve({
                            'categoryType': categoryType
                        });
                    }, function(error) {
                        deferred.resolve({});
                    });
                    return deferred.promise;
                }],
                Listing_type: ["$stateParams", function($stateParams) {
                    return $stateParams.listing_type;
                }]
            }
        }).state('listing.create.list.update', {
            parent: 'listing.create',
            url: '^/update/:listing_type/:list_id',
            views: {
                'create_listing_view@listing.create': {
                    templateUrl: function($stateParams) {
                        return APP_CONFIG.modules + '/listing/partials/' + $stateParams.listing_type + '.form.html'
                    },
                    controller: 'CreateListingController as createListCtrl'
                }
            },
            resolve: {
                ResolveData: ['CategoriesModel', '$stateParams', '$q', function(CategoriesModel, $stateParams, $q) {
                    var deferred = $q.defer(),
                        categoryType;
                    CategoriesModel.all({
                        type: 'types'
                    }).then(function(response) {
                        Array.prototype.push.apply(CategoriesModel.categoryTypes, response.list);
                        categoryType = _.find(CategoriesModel.categoryTypes, {
                            'type_code': $stateParams.listing_type
                        }) || {};
                        deferred.resolve({
                            'categoryType': categoryType
                        });
                    }, function(error) {
                        deferred.resolve({});
                    });
                    return deferred.promise;
                }],
                Listing_type: ["$stateParams", function($stateParams) {
                    return $stateParams.listing_type;
                }]
            }
        });
    }
    ListingState.$inject = ["$stateProvider", "APP_CONFIG", "$urlRouterProvider"];
})();

(function() {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Listing.Factory.ListingResource
     * @module BeautyCollective.Listing
     *
     * @description
     * Implements CURD operations
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Listing')
        .factory('ListingResource', ListingResource);

    /* @ngInject */
    function ListingResource($resource, APP_CONFIG) {
        /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
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
            cancel: {
                method: 'GET',
                params: {
                    id: '@id',
					list_id: '@list_id',
                },
                url: 'cancelimage'
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

(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
            visa_id: null,
            status: 1,
            expiry: '',
            slug: ''
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
        model.find = function(id) {
            return ListingResource.find(id).$promise;
        };
        /**
         * [findAllListing description]
         * @method findAl
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
        model.findAll = function(params, success, fail) {
            return ListingResource.query(params, success, fail).$promise;
        };

        /**
         * Create a new dashboard
         * @param dashboard dashboard
         * @return dashboard saved
         */
        model.save = function(list) {
            return ListingResource.save(list).$promise;
        };

        /**
         * Update dashboard
         * @param dashboard dashboard
         * @return dashboard saved
         */
        model.update = function(params, data) {
            return ListingResource.update(params, data).$promise;
        };

        /**
         * Delete dashboard
         * @param id id
         */
        model.delete = function(id) {
            return ListingResource.delete(id).$promise;
        };

        model.cancel = function(id,list_id) {
            return ListingResource.cancel(id,list_id).$promise;
        };

    }
    ListingModel.$inject = ["ListingResource"];
})();

(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Serviceprovider.Controller.ListingController
     * @module BeautyCollective.Listing
     *
     * @description
     * ListingController is responsible manage account activities
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

    /* @ngInject */
    function ListingController($scope, $window) {
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

     }
     ListingController.$inject = ["$scope", "$window"];
    //end of controller

    angular
        .module('BeautyCollective.Listing')
        .controller('ListingController', ListingController);
})();

(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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

    ]);
})();

'use strict';

angular.module('BeautyCollective')
  .config(["$stateProvider", function($stateProvider) {
    $stateProvider
      .state('error', {
        abstract: true,
        parent: 'index',
        views: {
          'content': {
            template: '<div ui-view="error" class="fade-in-up"></div>',
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
            controller:'ErrorController'
          }
        },
        resolve: {
          mainTranslatePartialLoader: ['$translate', '$translatePartialLoader',
            function($translate, $translatePartialLoader) {
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
            controller:'ErrorController'
          }
        },
        resolve: {
          mainTranslatePartialLoader: ['$translate', '$translatePartialLoader',
            function($translate, $translatePartialLoader) {
              $translatePartialLoader.addPart('error');
              return $translate.refresh();
            }
          ]
        }
      });
  }]);
(function() {
  'use strict';
  /**
   * @ngdoc Controller
   * @name BeautyCollective.Controller.ErrorController
   * @module BeautyCollective
   *
   * @description
   * Error controller to hanlde errors
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective')
    .controller('ErrorController', ErrorController);
  /* @ngInject */
  function ErrorController($scope,Spinner, $state) {
    Spinner.hide();

}
ErrorController.$inject = ["$scope", "Spinner", "$state"];
})();
(function() {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Account.Factory.CategoriesResource
     * @module BeautyCollective.Account
     *
     * @description
     * Implements CURD operations
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
            searchcategories: {
                url:'serviceprovidercategories',
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

(function() {
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
    model.get = function(id) {
      return CategoriesResource.find(id).$promise;
    };

    /**
     * [all description]
     * @method all
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     * @param  {[type]}          params [description]
     * @return {[type]}                 [description]
     */
    model.all = function(params, success, fail){
      return CategoriesResource.query(params, success, fail).$promise;
    };
	
	/**
     * [search categories]
     * @method all
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     * @param  {[type]}          params [description]
     * @return {[type]}                 [description]
     */
    model.searchcategories = function(params, success, fail){
      return CategoriesResource.searchcategories(params, success, fail).$promise;
    };

}
CategoriesModel.$inject = ["CategoriesResource"];
})();
(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Dashboard', ['ui.bootstrap',
            'BeautyCollective.Core',
            'BeautyCollective.Components',
            'BeautyCollective.Widgets',
            'BeautyCollective.Dashboard',
            'BeautyCollective.Pages',
            'BeautyCollective.Users',
            'BeautyCollective.Account',
            'BeautyCollective.Listing',
            'BeautyCollective.Suburbs'
        ]);
})();

(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
                'user-top-section':{
                     templateUrl: APP_CONFIG.modules + '/dashboard/dashboard_top_section.html',
                     controller: 'DashboardController as dashboardCtrl'
                }
            }

        });
    }
    DashboardState.$inject = ["$stateProvider", "APP_CONFIG", "$urlRouterProvider"];
})();

(function() {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Account.Factory.AccountResource
     * @module BeautyCollective.Account
     *
     * @description
     * Implements CURD operations
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
      .module('BeautyCollective.Account')
      .factory('AccountResource', AccountResource);

    /* @ngInject */
    function AccountResource($resource, APP_CONFIG) {
      /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
      return $resource('api/dashboard/', {
          requestType: '@requestType',
        },
        {
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
        }
      });
    }
    AccountResource.$inject = ["$resource", "APP_CONFIG"];

})();
(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
        model.find = function(id) {
            return DashboardResource.find(id).$promise;
        };
        /**
         * [findAllActivities description]
         * @method findAllActivities
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
        model.findAllActivities = function(params, success, fail) {
            return DashboardResource.findAllActivities(params, success, fail);
        };

        /**
         * Create a new dashboard
         * @param dashboard dashboard
         * @return dashboard saved
         */
        model.save = function(dashboard) {
            return DashboardResource.save(dashboard).$promise;
        };

        /**
         * Update dashboard
         * @param dashboard dashboard
         * @return dashboard saved
         */
        model.update = function(dashboard) {
            return DashboardResource.update(dashboard).$promise;
        };

        /**
         * Delete dashboard
         * @param id id
         */
        model.delete = function(id) {
            return DashboardResource.delete(id).$promise;
        };
    }
    DashboardModel.$inject = ["DashboardResource"];
})();

(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Serviceprovider.Controller.DashboardController
     * @module BeautyCollective.Account
     *
     * @description
     * DashboardController is responsible manage account activities
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

    /* @ngInject */
    function DashboardController($scope, $window,Laravel) {
        var self = this,roles = [];
        init();

        /**
         * initialize properties
         * 
         * @private
         * @return {void}
         */

        function init() {
            roles = angular.fromJson(Laravel.roles);
            roles = _.map(roles, function(role){
                return (role.name).toLowerCase();
            });
        }

        self.hasRole = function(roleName) {
            return roles.indexOf(roleName) >= 0;
        }

        

    }
    DashboardController.$inject = ["$scope", "$window", "Laravel"];
    //end of controller

    angular
        .module('BeautyCollective.Account')
        .controller('DashboardController', DashboardController);
})();

(function() {
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
       * @module ui.slimscroll
       *
       * @description
       * any container smooth scrolling
       */
      'ui.slimscroll',
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
        'angularSpinner'
    ]);
})();
(function() {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Core.Config
     * @module BeautyCollective.Core
     *
     * @description
     * Core module state configurations
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Core')
        .config(coreStateConfig);

    /* @ngInject */
    function coreStateConfig($stateProvider, $urlRouterProvider, APP_CONFIG, $locationProvider) {
        
    }
    coreStateConfig.$inject = ["$stateProvider", "$urlRouterProvider", "APP_CONFIG", "$locationProvider"];
})();

(function() {
  'use strict';
  /**
   * @ngdoc Directive
   * @name BeautyCollective.Directive.ngSpinnerBar
   * @module BeautyCollective.Core
   *
   * @description
   * Directive commands spinner show and hide based on state change events
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Core')
    .directive('ngSpinnerBar', NgSpinnerDirective);

  /* @ngInject */
  function NgSpinnerDirective($rootScope, $timeout) {
    return {
      link: function(scope, element, attrs) {
        // by defult hide the spinner bar
        $rootScope.loadingSpinner = false;

        // display the spinner bar whenever the route changes(the content part started loading)
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
          $rootScope.loadingSpinner = true;
        });

        // hide the spinner bar on rounte change success(after the content loaded)
        $rootScope.$on('$stateChangeSuccess', function() {
          $rootScope.loadingSpinner = false;
          angular.element('body').removeClass('page-on-load'); // remove page loading indicator
        });

        // handle errors
        $rootScope.$on('$stateNotFound', function(error) {
          //element.addClass('hide'); // hide spinner bar
          $rootScope.loadingSpinner = false;
          console.log(error);
        });

        // handle errors
        $rootScope.$on('$stateChangeError', function() {
          //element.addClass('hide'); // hide spinner bar
          $rootScope.loadingSpinner = false;
        });
        $rootScope.$on('$stateChangeCancel', function() {
          //element.addClass('hide'); // hide spinner bar
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
    Spinner.prototype.show = function() {
      $rootScope.loadingSpinner = true;
    };
    /**
     * Method to Hide spinner
     * @return void
     */
    Spinner.prototype.hide = function() {
      $rootScope.loadingSpinner = false;
    };
    return new Spinner();
  }
  SpinnerService.$inject = ["$rootScope"];
})();
(function() {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Core.Constant.ENV
     * @module BeautyCollective.Core
     *
     * @description
     * Holds envoirment related properties
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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

(function() {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Core.Config
     * @module BeautyCollective.Core
     *
     * @description
     * Configuartion while provider are created
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Core')
        .config(CoreConfiguration);

    /* @ngInject */
    function CoreConfiguration($interpolateProvider, $httpProvider, $translateProvider, tmhDynamicLocaleProvider, LoggerProvider, httpRequestInterceptorCacheBusterProvider, APP_CONFIG, $provide, ENV, uiGmapGoogleMapApiProvider,
        usSpinnerConfigProvider) {
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
            lines: 9,
            length: 28,
            width: 8,
            radius: 17,
            scale: 1,
            corners: 1,
            color: '#57ce4b',
            opacity: 0.35,
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
    }
    CoreConfiguration.$inject = ["$interpolateProvider", "$httpProvider", "$translateProvider", "tmhDynamicLocaleProvider", "LoggerProvider", "httpRequestInterceptorCacheBusterProvider", "APP_CONFIG", "$provide", "ENV", "uiGmapGoogleMapApiProvider", "usSpinnerConfigProvider"];


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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
            function($rootScope, $window, $state, $translate, Language, ENV, APP_CONFIG, Spinner) {
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
                $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
                    $rootScope.toState = toState;
                    $rootScope.toStateParams = toStateParams;
                    Spinner.start();

                    /**
                     * Update current lanaguage
                     */
                    Language.getCurrent().then(function(language) {
                        $translate.use(language);
                    });
                });


                /**
                 * Capture $stateChangeSuccess event on $rootScope
                 * Set page title
                 */
                $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

                    Spinner.stop();
                    var titleKey = 'global.title';
                    //Set page class
                    $rootScope.$state = $state;

                    $rootScope.previousStateName = fromState.name;
                    $rootScope.previousStateParams = fromParams;


                    $translate(titleKey).then(function(title) {
                        // Change window title with translated one
                        $rootScope.title = title;
                    });
                });

            }
        ]);

    angular
        .module('BeautyCollective.Core').factory('XSRFInterceptor', ['utilFactory', function(utilFactory) {
            var XSRFInterceptor = {
                request: function(config) {
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
        .module('BeautyCollective.Core').factory('Spinner', ['usSpinnerService', function(usSpinnerService) {
            var Spinner = {
                start: function(spinnerId) {
                    spinnerId ? usSpinnerService.spin(spinnerId) : usSpinnerService.spin('global_spinner');
                },
                stop: function(spinnerId) {
                    spinnerId ? usSpinnerService.stop(spinnerId) : usSpinnerService.stop('global_spinner');
                }
            };
            return Spinner;
        }]);
})();

(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
                ResolveData: ['AccountModel', '$q', function(AccountModel, $q) {
                    var deferred = $q.defer();
                    AccountModel.find({id:null}).then(function(response) {
                    deferred.resolve({
                        'user': response
                        });
                    }, function(error) {
                        deferred.resolve({});
                    });
                    return deferred.promise;
                }]
            }
        });
    }
    AccountState.$inject = ["$stateProvider", "APP_CONFIG", "$urlRouterProvider"];
})();

(function() {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Account.Factory.AccountResource
     * @module BeautyCollective.Account
     *
     * @description
     * Implements CURD operations
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
        },
        {
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
        update: {
          method: 'PUT'
        },
        updatebusiness: {
          url:'business/:id',
          method: 'PUT'
        },
        updateIndividualInfo: {
          url:'updateindividualinfo/:id',
          method: 'PUT'
        },
        getJobSeekers: {
          url:'jobseekers',
          method: 'GET',
          isArray:true
        }
      });
    }
    AccountResource.$inject = ["$resource", "APP_CONFIG"];

    function transformGetResponse(data, headersGetter) {
        var _response = {};
        _response.data = angular.fromJson(data);
        return angular.fromJson(_response);
    }

})();
(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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


        /**
         * Get dashboard
         * @param id id
         * @return dashboard
         */
        model.find = function(id) {
            return AccountResource.find(id).$promise;
        };

        /**
         * Get dashboard
         * @param id id
         * @return dashboard
         */
        model.findJob = function(id) {
            return AccountResource.findJob(id).$promise;
        };
        /**
         * [findAllActivities description]
         * @method findAllActivities
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
        model.findAllActivities = function(params, success, fail) {
            return AccountResource.findAllActivities(params, success, fail);
        };

        /**
         * Create a new dashboard
         * @param dashboard dashboard
         * @return dashboard saved
         */
        model.save = function(dashboard) {
            return AccountResource.save(dashboard).$promise;
        };

        /**
         * Update dashboard
         * @param dashboard dashboard
         * @return dashboard saved
         */
        model.update = function(params, data) {
            return AccountResource.update(params,data).$promise;
        };

        /**
         * Update business details
         * @param {{dashboard dashboard}}
         * @return dashboard saved
         */
        model.updatebusiness = function(params, data) {
            return AccountResource.updatebusiness(params,data).$promise;
        };

        /**
         * Update jobs details
         * @param {{dashboard dashboard}}
         * @return dashboard saved
         */
        model.updateIndividualInfo = function(params, data) {
            return AccountResource.updateIndividualInfo(params,data).$promise;
        };

        /**
         * Delete dashboard
         * @param id id
         */
        model.delete = function(id) {
            return AccountResource.delete(id).$promise;
        };

        /**
         * search job seekers
         * @param {{dashboard dashboard}}
         * @return dashboard saved
         */
        model.getJobSeekers = function(params, success, fail) {
            return AccountResource.getJobSeekers(params, success, fail).$promise;
        };

        
    }
    AccountModel.$inject = ["AccountResource"];
})();

(function() {
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
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Account')
        .service('AccountFactory', AccountFactory);

    /* @ngInject */
    function AccountFactory() {
        var factory = {};

        factory.getDefaultBusinessHours = function() {
            return {
                monday: {
                    open: moment.utc().toDate(),
                    close: moment().add(7, 'hours').utc().toDate()
                },
                tuesday: {
                    open: moment.utc().toDate(),
                    close: moment().add(7, 'hours').utc().toDate()
                },
                wednesday: {
                    open: moment.utc().toDate(),
                    close: moment().add(7, 'hours').utc().toDate()
                },
                thursday: {
                    open: moment.utc().toDate(),
                    close: moment().add(7, 'hours').utc().toDate()
                },
                friday: {
                    open: moment.utc().toDate(),
                    close: moment().add(7, 'hours').utc().toDate()
                },
                saturday: {
                    open: moment.utc().toDate(),
                    close: moment().add(7, 'hours').utc().toDate()
                },
                sunday: {
                    open: moment.utc().toDate(),
                    close: moment().add(7, 'hours').utc().toDate()
                }
            };
        };

        factory.getDefaultBusinessDays = function() {
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

(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Account.Controller.AccountController
     * @module BeautyCollective.Account
     *
     * @description
     * AccountController is responsible manage account activities
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

    /* @ngInject */
    function AccountController($state,ResolveData,AccountModel,toaster) {
        var self = this;
        init();

        /**
         * initialize properties
         * 
         * @private
         * @return {void}
         */

        function init() {
            self.userRole = ResolveData.user.roles[0].name;
            self.isAustralian = (ResolveData.user.user_info && ResolveData.user.user_info.is_australian=='yes') ? true : false;
            self.lookingJob = (ResolveData.user.user_info && ResolveData.user.user_info.looking_job=='yes') ? true : false; 
            self.userProfilepic = (ResolveData.user.profilepic) ? ResolveData.user.profilepic.path + ResolveData.user.profilepic.name : 'images/user_pic.jpg'; 
        }

        /**
         * save user looking for job or not
         * 
         * @params {flag | {true | false}}
         * @return {void}
         */

        self.lookingWork = function(flag){
            self.lookingJob = flag;
            AccountModel.updateIndividualInfo(
                {'id':ResolveData.user.id},
                {'name':ResolveData.user.name,'lookingJob':self.lookingJob,'isAustralian':self.isAustralian})
                .then(function(successResponse) {
                    toaster.pop('success', "Detail Save", "Datails has been updated.");
                }, function(errorResponse) {
                    console.log('Saving Details:', errorResponse);
                });
        };

         /**
         * save user is australian citizen or not
         * 
         * @params {flag | {true | false}}
         * @return {void}
         */

        self.Australian = function(flag){
           self.isAustralian = flag; 
           AccountModel.updateIndividualInfo(
                {'id':ResolveData.user.id},
                {'name':ResolveData.user.name,'lookingJob':self.lookingJob,'isAustralian':self.isAustralian})
                .then(function(successResponse) {
                    toaster.pop('success', "Detail Save", "Datails has been updated.");
                }, function(errorResponse) {
                    //console.log('Saving Details:', errorResponse);
                });
        };

        /**
         * change user profile pic
         * 
         * @params {images chunks}
         * @return {object}
         */

        self.flowConfig = function() {
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
                query: function(flowFile, flowChunk) {
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
        self.fileUploadSuccess = function($file, $res) {
            var obj = JSON.parse($res);
            self.userProfilepic = obj.path+obj.name;
        };

    }
    AccountController.$inject = ["$state", "ResolveData", "AccountModel", "toaster"];
    //end of controller

    angular
        .module('BeautyCollective.Account')
        .controller('AccountController', AccountController);
})();

(function() {
    'use strict';
    /**
     * @ngdoc Provider
     * @name BeautyCollective.Core.Provider.AlertService
     * @module BeautyCollective.Core
     *
     * @description
     * This provider will be used to set the setting of alert messages
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
   angular.module('BeautyCollective.Core').provider('AlertService', function() {
            this.toast = false;

            this.$get = ['$timeout', '$sce', '$translate', function($timeout, $sce, $translate) {

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
                        close: function(alerts) {
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
                        $timeout(function() {
                            that.closeAlert(alertOptions.alertId, extAlerts);
                        }, alertOptions.timeout);
                    }
                    return alert;
                }

                function closeAlert(id, extAlerts) {
                    var thisAlerts = extAlerts ? extAlerts : alerts;
                    return this.closeAlertByIndex(thisAlerts.map(function(e) {
                        return e.id;
                    }).indexOf(id), thisAlerts);
                }

                function closeAlertByIndex(index, thisAlerts) {
                    return thisAlerts.splice(index, 1);
                }

                return exports;
            }];

            this.showAsToast = function(isToast) {
                this.toast = isToast;
            };

        });
})();

(function() {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Directive.Alert
     * @module BeautyCollective
     *
     * @description
     * This directive is to show the alert box and inline alerts
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

    angular
        .module('BeautyCollective')
        .directive('alert', ['AlertService', function(AlertService) {
            return {
                restrict: 'E',
                template: '<div class="alerts" ng-cloak="">' +
                    '<div ng-repeat="alert in alerts" ng-class="[alert.position, {\'toast\': alert.toast}]">' +
                    '<uib-alert ng-cloak="" type="{{alert.type}}" close="alert.close()"><pre>{{ alert.msg }}</pre></uib-alert>' +
                    '</div>' +
                    '</div>',
                controller: ['$scope',
                    function($scope) {
                        $scope.alerts = AlertService.get();
                        $scope.$on('$destroy', function() {
                            $scope.alerts = [];
                        });
                    }
                ]
            }
        }]);

    angular
        .module('BeautyCollective')
        .directive('alertError', ['AlertService', '$rootScope', '$translate', function(AlertService, $rootScope, $translate) {
            return {
                restrict: 'E',
                template: '<div class="alerts" ng-cloak="">' +
                    '<div ng-repeat="alert in alerts" ng-class="[alert.position, {\'toast\': alert.toast}]">' +
                    '<uib-alert ng-cloak="" type="{{alert.type}}" close="alert.close(alerts)"><pre>{{ alert.msg }}</pre></uib-alert>' +
                    '</div>' +
                    '</div>',
                controller: ['$scope',
                    function($scope) {

                        $scope.alerts = [];

                        var cleanHttpErrorListener = $rootScope.$on('BeautyCollective.httpError', function(event, httpResponse) {
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

                        $scope.$on('$destroy', function() {
                            if (cleanHttpErrorListener !== undefined && cleanHttpErrorListener !== null) {
                                cleanHttpErrorListener();
                                $scope.alerts = [];
                            }
                        });

                        var addErrorAlert = function(message, key, data) {
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

(function() {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Core.main.Factory.utilFactory
     * @module BeautyCollective.Core
     *
     * @description
     * util factory contains all generic methods
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Core')
        .factory('utilFactory', utilFactory)
        .filter('parseDate', function() {
            return function(value) {
                return Date.parse(value);
            };
        });;

    /* @ngInject */
    function utilFactory() {
        var util = {},
            bgColors;
        /**
         * [getBgColors description]
         * @method getBgColors
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @return {[type]}    [description]
         */
        util.getBgColors = function() {
            return bgColors;
        };
        /**
         * [getStatus description]
         * @method getStatus
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}  statusCode [description]
         * @return {[type]}             [description]
         */
        util.getStatus = function(statusCode) {
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
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}                 eventType [description]
         * @return {[type]}                           [description]
         */
        util.getNotificationTypeLable = function(eventType) {
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
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}  fileType [description]
         * @return {Boolean}          [description]
         */
        util.getFileType = function(fileType) {
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
        util.addTime = function(date) {
            date.hours(moment().hours());
            date.minutes(moment().minutes());
            date.seconds(moment().seconds());
            date.milliseconds(moment().milliseconds());
            return date;
        };

        util.getCurrentUtcDate = function() {
            return moment.utc().format('YYYY-MM-DD HH:mm:ss');
        };

        util.readCookie = function(name) {
            var cookie_start = document.cookie.indexOf(name);
            var cookie_end = document.cookie.indexOf(";", cookie_start);
            return cookie_start == -1 ? '' : decodeURIComponent(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
        };

        return util;
    }
})();

'use strict';

angular.module('BeautyCollective')
  .service('ParseLinks', function() {
    this.parse = function(header) {
      if (0 === header.length) {
        throw new Error('input must not be of zero length');
      }

      // Split parts by comma
      var parts = header.split(',');
      var links = {};
      // Parse each part into a named link
      angular.forEach(parts, function(p) {
        var section = p.split(';');
        if (2 !== section.length) {
          throw new Error('section could not be split on \';\'');
        }
        var url = section[0].replace(/<(.*)>/, '$1').trim();
        var queryString = {};
        url.replace(
          new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
          function($0, $1, $2, $3) {
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

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
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

            clearAll : function () {
                $window.localStorage.clear();
            }
        };
    }]);
(function() {
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
      initialize: function(element, options) {
        this.setOptions(options);
        this.element = element;
        this.options.render && this.createBox();
        this.attachEvents();
      },
      setOptions: function(options) {
        angular.extend(this.options, options);
      },
      /**
       * @description Attaches events and saves a reference
       * @returns {StrongPass}
       */
      attachEvents: function() {
        // only attach events once so freshen
        this.element.on('keyup', function(event) {
          this.runPassword()
        }.bind(this));

        return this;
      },

      /**
       * @description Attaches pass elements.
       * @returns {StrongPass}
       */
      createBox: function() {
        //todo: should be templated
        var o = this.options;

        var template = '<div class="pass-container" style="width: ' + o.barWidth + ';"><div class="pass-bar"></div><div class="pass-hint"></div></div>';

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
      runPassword: function(event, password) {
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
            s.sort(function(a, b) {
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

      displayContianer: function(password) {
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

      checkPassword: function(pass) {
        var score = 0,
          minChar = this.options.minChar,
          len = pass.length,
          diff = len - minChar;

        (diff < 0 && (score -= 100)) || (diff >= 5 && (score += 18)) || (diff >= 3 && (score += 12)) || (diff === 2 && (score += 6));

        angular.forEach(this.checks, function(check) {
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('PasswordStrength')
    .directive('passwordStrength', passwordStrengthDirective);

  /* @ngInject */
  function passwordStrengthDirective(StrongPass) {
    return {
      restrict: 'A',
       require: 'ngModel',
      link: function(scope, element, attributes, ngModel) {
        StrongPass.initialize(element, {
          barWidth: '100%',
          render: true,
          onPass: function(score, verdict) {
            ngModel.$setValidity('strong', true);
          },
          onFail: function(score, verdict) {
            ngModel.$setValidity('strong', false);
          }
        });
      }
    };
  }
  passwordStrengthDirective.$inject = ["StrongPass"];
}());

// Generated by CoffeeScript 1.7.1
(function() {
    'use strict';
    var MODULE_NAME, SLIDER_TAG, angularize, contain, events, gap, halfWidth, hide, module, offset, offsetLeft, pixelize, qualifiedDirectiveDefinition, roundStep, show, sliderDirective, width;

    MODULE_NAME = 'ui.slider';

    SLIDER_TAG = 'slider';

    angularize = function(element) {
        return angular.element(element);
    };

    pixelize = function(position) {
        return '' + position + 'px';
    };

    hide = function(element) {
        return element.css({
            opacity: 0
        });
    };

    show = function(element) {
        return element.css({
            opacity: 1
        });
    };

    offset = function(element, position) {
        return element.css({
            left: position
        });
    };

    halfWidth = function(element) {
        return element[0].offsetWidth / 2;
    };

    offsetLeft = function(element) {
        return element[0].offsetLeft;
    };

    width = function(element) {
        return element[0].offsetWidth;
    };

    gap = function(element1, element2) {
        return offsetLeft(element2) - offsetLeft(element1) - width(element1);
    };

    contain = function(value) {
        if (isNaN(value)) {
            return value;
        }
        return Math.min(Math.max(0, value), 100);
    };

    roundStep = function(value, precision, step, floor) {
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

    sliderDirective = function($timeout) {
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
            template: '<div class="bar"><div class="selection"></div></div>\n<div class="handle low"></div><div class="handle high"></div>\n<div class="bubble limit low">{{ values.length ? values[floor || 0] : floor }}</div>\n<div class="bubble limit high">{{ values.length ? values[ceiling || values.length - 1] : ceiling }}</div>\n<div class="bubble value low">{{ values.length ? values[local.ngModelLow || local.ngModel || 0] : local.ngModelLow || local.ngModel || 0 }}</div>\n<div class="bubble value high">{{ values.length ? values[local.ngModelHigh] : local.ngModelHigh }}</div>',
            compile: function(element, attributes) {
                var high, low, range, watchables;
                range = (attributes.ngModel === null) && (attributes.ngModelLow !== null) && (attributes.ngModelHigh !== null);
                low = range ? 'ngModelLow' : 'ngModel';
                high = 'ngModelHigh';
                watchables = ['floor', 'ceiling', 'values', low];
                if (range) {
                    watchables.push(high);
                }
                return {
                    post: function(scope, element, attributes) {
                        var bar, barWidth, bound, ceilBub, dimensions, e, flrBub, handleHalfWidth, highBub, lowBub, maxOffset, maxPtr, maxValue, minOffset, minPtr, minValue, ngDocument, offsetRange, selection, updateDOM, upper, valueRange, w, _i, _j, _len, _len1, _ref, _ref1;

                        _ref = (function() {
                            var _i, _len, _ref, _results;
                            _ref = element.children();
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                e = _ref[_i];
                                _results.push(angularize(e));
                            }
                            return _results;
                        })(); bar = _ref[0]; minPtr = _ref[1]; maxPtr = _ref[2]; flrBub = _ref[3]; ceilBub = _ref[4]; lowBub = _ref[5]; highBub = _ref[6];
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
                        dimensions = function() {
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
                        updateDOM = function() {
                            var bind, percentOffset, percentValue, pixelsToOffset, setBindings, setPointers;
                            dimensions();
                            percentOffset = function(offset) {
                                return contain(((offset - minOffset) / offsetRange) * 100);
                            };
                            percentValue = function(value) {
                                return contain(((value - minValue) / valueRange) * 100);
                            };
                            pixelsToOffset = function(percent) {
                                return pixelize(percent * offsetRange / 100);
                            };
                            setPointers = function() {
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
                            bind = function(handle, bubble, ref, events) {
                                var currentRef, onEnd, onMove, onStart;
                                currentRef = ref;
                                onEnd = function() {
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
                                onMove = function(event) {
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
                                onStart = function(event) {
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
                            setBindings = function() {
                                var method, _j, _len1, _ref2;
                                _ref2 = ['touch', 'mouse'];
                                for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                                    method = _ref2[_j];
                                    bind(minPtr, lowBub, low, events[method]);
                                    bind(maxPtr, highBub, high, events[method]);
                                }
                                bound = true;
                                return bound ;
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

    module = function(window, angular) {
        return angular.module(MODULE_NAME, []).directive(SLIDER_TAG, qualifiedDirectiveDefinition);
    };

    module(window, window.angular);

}).call(this);

(function() {
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
      function($timeout, $http, $compile, $templateCache, $rootScope, $document) {
        var _this = this;
        var startTop = 5;
        var verticalSpacing = 15;
        var duration = 10000;
        var defaultTemplateUrl = 'components/notify/notify.html';
        var position = 'right';
        var container = $document[0].body;

        _this.positionClass = 'notify-top-right';

        var messageElements = [];

        var notify = function(args) {
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
          }).success(function(template) {

            var templateElement = $compile(template)(scope);
            templateElement.bind('webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd', function(e) {
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
              $timeout(function() {
                templateElement.css('margin-left', '-' + (templateElement[0].offsetWidth / 2) + 'px');
              });
            }

            scope.$close = function() {
              templateElement.remove();
              layoutMessages();
            };

            var layoutMessages = function() {
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

            $timeout(function() {
              layoutMessages();
            });

            if (duration > 0) {
              $timeout(function() {
                scope.$close();
              }, duration);
            }

          }).error(function(data) {
            throw new Error('Template specified for cgNotify (' + args.templateUrl + ') could not be loaded. ' + data);
          });

          var retVal = {};

          retVal.close = function() {
            if (scope.$close) {
              scope.$close();
            }
          };
          Object.defineProperty(retVal, 'message', {
            get: function() {
              return scope.$message;
            },
            set: function(val) {
              scope.$message = val;
            }
          });




          return retVal;

        };
        /**
         * addNewNotifyEvent Event handler which is captured
         *
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {Object} $event Captured event data
         * @return {Object} args Data which is attached to addNewNotify event
         */
        var addNewNotifyEvent = $rootScope.$on('addNewNotify', function($event, args) {
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
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {Object} args A object which holds configuration of Notify
         * @return {Void}
         */
        notify.config = function(args) {
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
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @return {Void}
         */
        notify.closeAll = function() {
          for (var i = messageElements.length - 1; i >= 0; i--) {
            var element = messageElements[i];
            element.css('opacity', 0);
          }
        };
        /**
         * A success notification
         * @method success
         *
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
   * @name BeautyCollective.Components.modal
   * 
   * @module modal
   *
   * @description
   * Extends $modal service
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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

(function() {
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Components.modal')
    .controller('ConfirmModalController', ['$scope',
      '$modalInstance',
      'data',
      function($scope, $modalInstance, data) {

        $scope.header = (angular.isDefined(data.header) && (data.header !== '')) ? data.header : 'Please confirm';
        $scope.msg = (angular.isDefined(data.msg)) ? data.msg : 'Do you want to perform this action?';

        $scope.no = function() {
          $modalInstance.dismiss('no');
        };
        $scope.yes = function() {
          $modalInstance.close('yes');
        };
      }
    ]);

})();

(function() {
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   **/
  angular
    .module('logger', [])
    .provider('Logger', [

      function() {
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
        this.enabled = function(_isEnabled) {
          isEnabled = !!_isEnabled;
        };
        /**
         * Logger provider construct which returned while provide is used in controller
         * Services and factory or directive
         * @requires $log Angular $log service
         * @True {Array}
         */
        this.$get = ['$log',
          function($log) {
            /**
             * Logger class
             *
             * @method Logger
             * @param  {[Object]} context [controller, service, factory etc...]
             */
            var Logger = function(context) {
              this.context = context;
            };
            /**
             * Returns context
             * @method getInstance
             * @param  {[Object]} context [controller, service, factory etc...]
             */
            Logger.getInstance = function(context) {
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
            Logger.supplant = function(str, o) {
              return str.replace(
                /\{([^{}]*)\}/g,
                function(a, b) {
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
            Logger.getFormattedTimestamp = function(date) {
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
              _log: function(originalFn, args) {
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
               * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
               */
              log: function() {
                this._log('log', arguments);
              },
              /**
               * Log info message
               *
               * @method info
               */
              info: function() {
                this._log('info', arguments);
              },
              /**
               * Log warn message
               *
               * @method warn
               */
              warn: function() {
                this._log('warn', arguments);
              },
              /**
               * Log debug messae
               *
               * @method debug
               */
              debug: function() {
                this._log('debug', arguments);
              },
              /**
               * Log error message
               *
               * @method error
               */
              error: function() {
                this._log('error', arguments);
              }
            };
            return Logger;
          }
        ];
      }
    ]);
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
    ]
);





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

(function() {
  'use strict';
  /**
   * @ngdoc overview
   * @name Filters
   * @module BeautyCollective.Components.Filters
   *
   * @description
   * This module is a bundle of all custom filters
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Components.Filters', []);
})();
(function() {
    'use strict';
    /**
     * @ngdoc Filter
     * @name BeautyCollective.Components.Filters.propsFilter
     * @module BeautyCollective.Components.Filters
     *
     * @description
     * propsFilter is used for ui-select component
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Components.Filters')
        .filter('propsFilter', function() {
            return function(items, props) {
                var out = [];

                if (angular.isArray(items)) {
                    items.forEach(function(item) {
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

(function() {
  'use strict';
  /**
   * @ngdoc Filter
   * @name BeautyCollective.Components.Filters.truncateWords
   * @module BeautyCollective.Components.Filters
   *
   * @description
   * truncateWords is used to truncate words by given length
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Components.Filters')
    .filter('truncateWords', function() {
      return function(input, words) {
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
(function() {
  'use strict';
  /**
   * @ngdoc Filter
   * @name BeautyCollective.Components.Filters.truncateCharacters
   * @module BeautyCollective.Components.Filters
   *
   * @description
   * truncateCharacters is used to truncate Characters by given length
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Components.Filters')
    .filter('truncateCharacters', function() {
      return function(input, chars, breakOnWord) {
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
(function() {
    'use strict';
    /**
     * @ngdoc factory
     * @name BeautyCollective.Core.factory.notificationInterceptor
     * @module BeautyCollective.Core
     *
     * @description
     * An interceptor to read the header response request
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Core')
        .factory('notificationInterceptor', ['$q', 'AlertService', function($q, AlertService) {
            return {
                response: function(response) {
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

(function() {
    'use strict';
    /**
     * @ngdoc factory
     * @name BeautyCollective.Core.factory.errorHandlerInterceptor
     * @module BeautyCollective.Core
     *
     * @description
     * An interceptor to read the error response of http request
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Core')
        .factory('errorHandlerInterceptor', ['$q', '$rootScope', function($q, $rootScope) {
            return {
                responseError: function(response) {
                    if (!(response.status == 401)) {
                        $rootScope.$emit('BeautyCollective.httpError', response);
                    }
                    return $q.reject(response);
                }
            };
        }]);
})();

(function() {
  'use strict';
  /**
   * @ngdoc overview
   * @name FancyDropDown
   * @module FancyDropDown
   *
   * @description
   * Has custom implementation of dropdowns built by angular UI Team
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('FancyDropDown')
    .directive('fancyDropdown', fancyDropdownDirective);

  /* @ngInject */
  function fancyDropdownDirective() {
    return {
      restrict: 'A',
      scope: {

      },
      link: function(scope, element, attrs) {
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

(function() {
  'use strict';
  /**
   * @ngdoc overview
   * @name Directvies
   * @module BeautyCollective.Components.Directvies
   *
   * @description
   * This module is a bundle of all custom Directvies
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Components.Directvies', []);
})();
(function() {
  'use strict';
  /**
   * @ngdoc Directive
   * @name BeautyCollective.Components.Directvies.Directive.scrollToTopWhen
   * @module BeautyCollective.Components.Directvies
   *
   * @description
   * Scroll any html Element to target pixels
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Components.Directvies')
    .directive('scrollToTopWhen', ScrollToTopWhen);

  /* @ngInject */
  function ScrollToTopWhen($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.$on(attrs.scrollToTopWhen, function() {
          $timeout(function() {
            angular.element(element)[0].scrollTop = element.find('.target').prop('offsetTop');
          }, 100);
        });
      }
    };
  }
  ScrollToTopWhen.$inject = ["$timeout"];
})();
(function() {
  'use strict';
  /**
   * @ngdoc Directive
   * @name BeautyCollective.Components.Directvies.Directive.resizeBackground
   * @module BeautyCollective.Components.Directvies
   *
   * @description
   * Adjust the background image when window is resized
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Components.Directvies')
    .directive('resizeBackground', ResizeBackground);

  /* @ngInject */
  function ResizeBackground($window) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var $img = element.find('> img');
        angular.element($window).on('resize', function() {
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
(function() {
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
   * <textarea ng-model="modelobject" remaining-characters data-maxlength="200" ></textarea>
   * 
   * =editable field
   * <strong editable-text="checklist.title" e-maxlength="300" data-maxlength="300" remaining-characters >text content</strong>
   */
  angular
    .module('BeautyCollective.Components.Directvies')
    .directive('remainingCharacters', ['$compile', function($compile) {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, iAttrs, ngModel) {
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

          scope.$watch(function() {
            return element.attr('class');
          }, function(newValue) {
            (element.hasClass('editable-hide')) ?
            (scope.isVisible = true) :
            (element.hasClass('editable') && (scope.isVisible = false))
          });


          scope.$watch(function() {
            return (element.hasClass('editable')) ? scope.$data : ngModel.$modelValue;
          }, function(newValue) {
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
  .directive('showValidation', function() {
    return {
      restrict: 'A',
      require: 'form',
      link: function(scope, element) {
        element.find('.form-group').each(function() {
          var $formGroup = $(this);
          var $inputs = $formGroup.find('input[ng-model],textarea[ng-model],select[ng-model]');

          if ($inputs.length > 0) {
            $inputs.each(function() {
              var $input = $(this);
              scope.$watch(function() {
                return $input.hasClass('ng-invalid') && $input.hasClass('ng-dirty');
              }, function(isInvalid) {
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
  .directive('uiSelectRequired', function() {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$validators.uiSelectRequired = function (modelValue, viewValue) {

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

(function() {
  'use strict';
  /**
   * @ngdoc Directive
   * @name BeautyCollective.Components.Directvies.Directive.fileModel
   * @module BeautyCollective.Components.Directvies.
   *
   * @description
   * Change file model when file is selected
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */

  angular.module('BeautyCollective.Components.Directvies')
    .directive('fileModel', ['$parse',
      function($parse) {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
              scope.$apply(function() {
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
   * <a href="#" class="upload_link">Upload File</a> <input type="file" class="upload_file" />
   * </div>
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
    angular.module('BeautyCollective.Components.Directvies')
    .directive('browseFileButton', [
      function() {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            element.find('.upload_link').bind('click', function() {
              element.find('.upload_file').trigger('click');
            });

            scope.$on('$destroy', function(){
              element.find('.upload_link').unbind('click');
            });
          }
        };
      }
    ]);

}());
(function() {
  'use strict';
  /**
   * @ngdoc Directive
   * @name BeautyCollective.Components.Directvies.Directive.ExactLength
   * @module BeautyCollective.Components.Directvies.
   *
   * @description
   * validate model exact length of field
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
      link: function(scope, $element, $attrs, ngModel) {
        $element.on('keyup', function() {
          scope.$apply(function() {
            ngModel.$setValidity('exactLength', (scope.exactLength === (ngModel.$modelValue && ngModel.$modelValue.length )));
          });
        });
      }
    }
  }
})();

(function() {
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */

  angular
    .module('BeautyCollective.Components.Directvies')
    .directive('stopClickPropagation', stopClickPropagation);

  /* @ngInject */
  function stopClickPropagation() {
    return {
      restrict: 'A',
      link: {
        post: function(scope, element, attrs) {
          element.click(function(e) {
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Components.Directvies')
    .directive('preventDefault', preventDefault);
  /* @ngInject */
  function preventDefault() {
    return {
      restrict: 'A',
      link: {
        post: function(scope, element, attrs) {
          element[0].click(function(e) {
            e.preventDefault();
          });
        }
      }
    };
  }

}());
(function() {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Components.Directvies.Directive.match
     * @module BeautyCollective.Components.Directvies.
     *
     * @description
     * password matching check
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Components.Directvies')
        .directive('match', PasswordMatch);

    /* @ngInject*/
    function PasswordMatch($parse) {
        return {
            require: '?ngModel',
            restrict: 'A',
            link: function(scope, elem, attrs, ctrl) {
                if (!ctrl) {
                    if (console && console.warn) {
                        console.warn('Match validation requires ngModel to be on the element');
                    }
                    return;
                }

                var matchGetter = $parse(attrs.match);
                var caselessGetter = $parse(attrs.matchCaseless);
                var noMatchGetter = $parse(attrs.notMatch);

                scope.$watch(getMatchValue, function() {
                    ctrl.$$parseAndValidate();
                });

                ctrl.$validators.match = function() {
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

(function() {
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
   * <user-image data-userid="{{userid}}"></user-image>
   * 
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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
      link: function(scope, element, attributes) {
        scope.$watch(function() {
          return $rootScope.isPhotoUpdated;
        }, function(newVal, oldVal) {
          if(newVal)
          scope.imageUrl = 'api/v1/users/' + scope.userid + '/photo?referece=' + newVal;
        });
        scope.$watch(function() {
          return scope.userid;
        }, function(newVal, oldVal) {
            if(newVal)
          scope.imageUrl = 'api/v1/users/' + scope.userid + '/photo?referece=' + newVal;
        });
      },
      template: '<img ng-src="{{imageUrl}}" class="{{imageclass}}" />'
    };
  }
  blobToImageDirective.$inject = ["$rootScope"];
}());

(function() {

  /**
   * @ngdoc Directive
   * @name BeautyCollective.Components.Directvies.Directive.adjustWidth
   * @module BeautyCollective.Components.Directvies.
   *
   * @description
   * directive is used on active run view
   * directive apply width to element same as parent's width
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Components.Directvies')
    .directive('adjustWidth', [function() {
      return {
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        link: function(scope, element, attrs) {
          element.width(element.parent().width());
        }
      };
    }]);

})();

(function() {
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
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

      this.setNotifyConfig = function(title, message) {
        this.notifyConfig = {
          title: title,
          message: message
        }
      }

      this.showNotification = function(type) {
        ('error' === type) ? notify.error(this.notifyConfig): notify.success(this.notifyConfig)
      }
    }
    ResponseHandlerFactory.prototype.success = function(successObj, showNotify) {
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

    ResponseHandlerFactory.prototype.error = function(errorObj, showNotify) {
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

(function() {
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
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular.module('BeautyCollective.Components', [
    'BeautyCollective.Components.Filters',
    'BeautyCollective.Components.Directvies',
    'BeautyCollective.Components.modal',
    'FancyDropDown'
  ]);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcHMvbW9kdWxlcy91c2Vycy9pbmRleC5qcyIsImFwcHMvbW9kdWxlcy91c2Vycy92aWV3LXVzZXIvdmlldy11c2VyLnN0YXRlcy5qcyIsImFwcHMvbW9kdWxlcy91c2Vycy92aWV3LXVzZXIvdmlldy11c2VyLmNvbnRyb2xsZXIuanMiLCJhcHBzL21vZHVsZXMvaW5kZXguanMiLCJhcHBzL21vZHVsZXMvbWFpbi9zaWRlYmFyL21haW4tc2lkZWJhci5jb250cm9sbGVyLmpzIiwiYXBwcy9tb2R1bGVzL3VzZXJzL3NpZGViYXIvdXNlcnMtc2lkZWJhci5jb250cm9sbGVyLmpzIiwiYXBwcy9tb2R1bGVzL3VzZXJzL2NyZWF0ZS9jcmVhdGUuc3RhdGVzLmpzIiwiYXBwcy9tb2R1bGVzL3VzZXJzL2NyZWF0ZS9jcmVhdGUuY29udHJvbGxlci5qcyIsImFwcHMvbW9kdWxlcy9wYWdlcy9pbmRleC5qcyIsImFwcHMvbW9kdWxlcy9wYWdlcy9wcml2YWN5LXBvbGljeS9wcml2YWN5LXBvbGljeS5qcyIsImFwcHMvbW9kdWxlcy9wYWdlcy9wcml2YWN5LXBvbGljeS9wcml2YWN5LXBvbGljeS5jb250cm9sbGVyLmpzIiwiYXBwcy9tb2R1bGVzL3VzZXJzL2xpc3QvbGlzdC5zdGF0ZXMuanMiLCJhcHBzL21vZHVsZXMvdXNlcnMvbGlzdC9saXN0LmNvbnRyb2xsZXIuanMiLCJhcHBzL21vZHVsZXMvcGFnZXMvY29udGFjdC1zdXBwb3J0L2NvbnRhY3Qtc3VwcG9ydC5qcyIsImFwcHMvbW9kdWxlcy9wYWdlcy9jb250YWN0LXN1cHBvcnQvY29udGFjdC1zdXBwb3J0LmNvbnRyb2xsZXIuanMiLCJhcHBzL21vZHVsZXMvcGFnZXMvaGVscC9oZWxwLmpzIiwiYXBwcy9tb2R1bGVzL3BhZ2VzL2hlbHAvaGVscC5jb250cm9sbGVyLmpzIiwiYXBwcy9tb2R1bGVzL2xpc3RpbmcvaW5kZXguanMiLCJhcHBzL21vZHVsZXMvbGlzdGluZy9jcmVhdGUvY3JlYXRlLmxpc3RpbmcuY29udHJvbGxlci5qcyIsImFwcHMvbW9kdWxlcy9saXN0aW5nL2xpc3QvbGlzdC5saXN0aW5nLmNvbnRyb2xsZXIuanMiLCJhcHBzL21vZHVsZXMvYWNjb3VudC9pbmRleC5qcyIsImFwcHMvbW9kdWxlcy9hY2NvdW50L3NldHRpbmdzL3NldHRpbmdzLnN0YXRlcy5qcyIsImFwcHMvbW9kdWxlcy9hY2NvdW50L3NldHRpbmdzL3NldHRpbmdzLmNvbnRyb2xsZXIuanMiLCJhcHBzL21vZHVsZXMvYWNjb3VudC9yZXZpZXdzL3Jldmlld3Muc3RhdGVzLmpzIiwiYXBwcy9tb2R1bGVzL2FjY291bnQvcmV2aWV3cy9yZXZpZXdzLmNvbnRyb2xsZXIuanMiLCJhcHBzL21vZHVsZXMvYWNjb3VudC9yZXZpZXdzL3Jldmlldy5yZXNvdXJjZS5qcyIsImFwcHMvbW9kdWxlcy9hY2NvdW50L3Jldmlld3MvcmV2aWV3Lm1vZGVsLmpzIiwiYXBwcy9tb2R1bGVzL2FjY291bnQvdXNlci91c2VyLnN0YXRlcy5qcyIsImFwcHMvbW9kdWxlcy9hY2NvdW50L3VzZXIvdXNlci5qb2IuY29udHJvbGxlci5qcyIsImFwcHMvbW9kdWxlcy9hY2NvdW50L3VzZXIvdXNlci5jb250cm9sbGVyLmpzIiwiYXBwcy9tb2R1bGVzL2FjY291bnQvam9iX3NlZWtlci9qb2Iuc2Vla2VyLnN0YXRlcy5qcyIsImFwcHMvbW9kdWxlcy9hY2NvdW50L2pvYl9zZWVrZXIvam9iLnNlZWtlci5jb250cm9sbGVyLmpzIiwiYXBwcy9tb2R1bGVzL2FjY291bnQvYnVzaW5lc3NfaW5mby9idXN1aW5lc3MuaW5mby5jb250cm9sbGVyLmpzIiwiYXBwcy9tb2R1bGVzL2FjY291bnQvYnVzaW5lc3NfaW5mby9idXNpbmVzc19pbmZvLnN0YXRlcy5qcyIsImFwcHMvd2lkZ2V0cy9pbmRleC5qcyIsImFwcHMvd2lkZ2V0cy9ub3RpZmljYXRpb25zL25vdGlmaWNhdGlvbnMuanMiLCJhcHBzL3dpZGdldHMvdGltZWxpbmUvdGltZWxpbmUuanMiLCJhcHBzL3dpZGdldHMvc2hvcnRsaXN0LWpvYi9zaG9ydGxpc3Rqb2IucmVzb3VyY2UuanMiLCJhcHBzL3dpZGdldHMvc2hvcnRsaXN0LWpvYi9zaG9ydGxpc3Rqb2IubW9kZWwuanMiLCJhcHBzL3dpZGdldHMvc2hvcnRsaXN0LWpvYi9zaG9ydGxpc3Rqb2IuY29udHJvbGxlci5qcyIsImFwcHMvd2lkZ2V0cy9zaG9ydGxpc3Qtam9iL2luZGV4LmpzIiwiYXBwcy93aWRnZXRzL3NlYXJjaC1yZXN1bHQvc2VhcmNoLnJlc3VsdC5yZXNvdXJjZS5qcyIsImFwcHMvd2lkZ2V0cy9zZWFyY2gtcmVzdWx0L3NlYXJjaC5yZXN1bHQubW9kZWwuanMiLCJhcHBzL3dpZGdldHMvc2VhcmNoLXJlc3VsdC9zZWFyY2gucmVzdWx0LmNvbnRyb2xsZXIuanMiLCJhcHBzL3dpZGdldHMvc2VhcmNoLXJlc3VsdC9pbmRleC5qcyIsImFwcHMvd2lkZ2V0cy9zZWFyY2gvc2VhcmNoLnJlc291cmNlLmpzIiwiYXBwcy93aWRnZXRzL3NlYXJjaC9zZWFyY2gubW9kZWwuanMiLCJhcHBzL3dpZGdldHMvc2VhcmNoL3NlYXJjaC5jb250cm9sbGVyLmpzIiwiYXBwcy93aWRnZXRzL3NlYXJjaC9pbmRleC5qcyIsImFwcHMvd2lkZ2V0cy9yYXRpbmcvcmF0aW5nLnJlc291cmNlLmpzIiwiYXBwcy93aWRnZXRzL3JhdGluZy9yYXRpbmcubW9kZWwuanMiLCJhcHBzL3dpZGdldHMvcmF0aW5nL3JhdGluZy5jb250cm9sbGVyLmpzIiwiYXBwcy93aWRnZXRzL3JhdGluZy9pbmRleC5qcyIsImFwcHMvd2lkZ2V0cy9jaGF0L2NoYXQuanMiLCJhcHBzL3dpZGdldHMvbG9jYXRpb24tbWFwL2luZGV4LmpzIiwiYXBwcy93aWRnZXRzL2xvY2F0aW9uLW1hcC9Mb2NhdGlvbk1hcC5jb250cm9sbGVyLmpzIiwiYXBwcy93aWRnZXRzL2Jvb2tpbmcvaW5kZXguanMiLCJhcHBzL3dpZGdldHMvYm9va2luZy9ib29raW5nLnJlc291cmNlLmpzIiwiYXBwcy93aWRnZXRzL2Jvb2tpbmcvYm9va2luZy5tb2RlbC5qcyIsImFwcHMvd2lkZ2V0cy9ib29raW5nL2Jvb2tpbmcuY29udHJvbGxlci5qcyIsImFwcHMvd2lkZ2V0cy9hdXRoL2luZGV4LmpzIiwiYXBwcy93aWRnZXRzL2F1dGgvYXV0aC5jb250cm9sbGVyLmpzIiwiYXBwcy9tb2R1bGVzL3N1YnVyYnMvaW5kZXguanMiLCJhcHBzL21vZHVsZXMvc3VidXJicy9zdWJ1cmJzLnJlc291cmNlLmpzIiwiYXBwcy9tb2R1bGVzL3N1YnVyYnMvc3VidXJicy5tb2RlbC5qcyIsImFwcHMvbW9kdWxlcy91c2Vycy91c2Vycy5zdGF0ZXMuanMiLCJhcHBzL21vZHVsZXMvdXNlcnMvdXNlcnMucmVzb3VyY2UuanMiLCJhcHBzL21vZHVsZXMvdXNlcnMvdXNlcnMubW9kZWwuanMiLCJhcHBzL21vZHVsZXMvdXNlcnMvdXNlcnMuZmFjdG9yeS5qcyIsImFwcHMvbW9kdWxlcy9wYWdlcy9wYWdlcy5zdGF0ZXMuanMiLCJhcHBzL21vZHVsZXMvbGFyYXZlbC9pbmRleC5qcyIsImFwcHMvbW9kdWxlcy9tYWluL21haW4uanMiLCJhcHBzL21vZHVsZXMvbWFpbi9tYWluLmNvbnRyb2xsZXIuanMiLCJhcHBzL21vZHVsZXMvbGlzdGluZy9saXN0aW5nLnN0YXRlcy5qcyIsImFwcHMvbW9kdWxlcy9saXN0aW5nL2xpc3RpbmcucmVzb3VyY2UuanMiLCJhcHBzL21vZHVsZXMvbGlzdGluZy9saXN0aW5nLm1vZGVsLmpzIiwiYXBwcy9tb2R1bGVzL2xpc3RpbmcvbGlzdGluZy5jb250cm9sbGVyLmpzIiwiYXBwcy9tb2R1bGVzL2dsb2JhbC9pbmRleC5qcyIsImFwcHMvbW9kdWxlcy9lcnJvci9lcnJvci5qcyIsImFwcHMvbW9kdWxlcy9lcnJvci9lcnJvci5jb250cm9sbGVyLmpzIiwiYXBwcy9tb2R1bGVzL2NhdGVnb3JpZXMvY2F0ZWdvcmllcy5yZXNvdXJjZS5qcyIsImFwcHMvbW9kdWxlcy9jYXRlZ29yaWVzL2NhdGVnb3JpZXMubW9kZWwuanMiLCJhcHBzL21vZHVsZXMvZGFzaGJvYXJkL2luZGV4LmpzIiwiYXBwcy9tb2R1bGVzL2Rhc2hib2FyZC9kYXNoYm9hcmQuc3RhdGVzLmpzIiwiYXBwcy9tb2R1bGVzL2Rhc2hib2FyZC9kYXNoYm9hcmQucmVzb3VyY2UuanMiLCJhcHBzL21vZHVsZXMvZGFzaGJvYXJkL2Rhc2hib2FyZC5tb2RlbC5qcyIsImFwcHMvbW9kdWxlcy9kYXNoYm9hcmQvZGFzaGJvYXJkLmNvbnRyb2xsZXIuanMiLCJhcHBzL21vZHVsZXMvY29yZS9pbmRleC5qcyIsImFwcHMvbW9kdWxlcy9jb3JlL2NvcmUuc3RhdGUuanMiLCJhcHBzL21vZHVsZXMvY29yZS9jb3JlLmRpcmVjdGl2ZS5qcyIsImFwcHMvbW9kdWxlcy9jb3JlL2NvcmUuY29uc3RhbnQuanMiLCJhcHBzL21vZHVsZXMvY29yZS9jb3JlLmNvbmZpZy5qcyIsImFwcHMvbW9kdWxlcy9hY2NvdW50L2FjY291bnQuc3RhdGVzLmpzIiwiYXBwcy9tb2R1bGVzL2FjY291bnQvYWNjb3VudC5yZXNvdXJjZS5qcyIsImFwcHMvbW9kdWxlcy9hY2NvdW50L2FjY291bnQubW9kZWwuanMiLCJhcHBzL21vZHVsZXMvYWNjb3VudC9hY2NvdW50LmZhY3RvcnkuanMiLCJhcHBzL21vZHVsZXMvYWNjb3VudC9hY2NvdW50LmNvbnRyb2xsZXIuanMiLCJhcHBzL2NvbXBvbmVudHMvYWxlcnQvYWxlcnQuc2VydmljZS5qcyIsImFwcHMvY29tcG9uZW50cy9hbGVydC9hbGVydC5kaXJlY3RpdmUuanMiLCJhcHBzL2NvbXBvbmVudHMvdXRpbC91dGlsLmZhY3RvcnkuanMiLCJhcHBzL2NvbXBvbmVudHMvdXRpbC9wYXJzZS1saW5rcy5zZXJ2aWNlLmpzIiwiYXBwcy9jb21wb25lbnRzL3V0aWwvYmFzZTY0LnNlcnZpY2UuanMiLCJhcHBzL2NvbXBvbmVudHMvcGFzc3dvcmQvcGFzc3dvcmQtc3RyZW5ndGguanMiLCJhcHBzL2NvbXBvbmVudHMvc2xpZGVyL3NsaWRlci5qcyIsImFwcHMvY29tcG9uZW50cy9ub3RpZnkvaW5kZXguanMiLCJhcHBzL2NvbXBvbmVudHMvbW9kYWwvaW5kZXguanMiLCJhcHBzL2NvbXBvbmVudHMvbW9kYWwvbW9kYWwuZmFjdG9yeS5qcyIsImFwcHMvY29tcG9uZW50cy9tb2RhbC9jb25maXJtLm1vZGFsLmNvbnRyb2xsZXIuanMiLCJhcHBzL2NvbXBvbmVudHMvbG9nZ2VyL2xvZ2dlci5qcyIsImFwcHMvY29tcG9uZW50cy9sYW5ndWFnZS9sYW5ndWFnZS5zZXJ2aWNlLmpzIiwiYXBwcy9jb21wb25lbnRzL2xhbmd1YWdlL2xhbmd1YWdlLmNvbnRyb2xsZXIuanMiLCJhcHBzL2NvbXBvbmVudHMvZmlsdGVycy9pbmRleC5qcyIsImFwcHMvY29tcG9uZW50cy9maWx0ZXJzL3VpLXNlbGVjdC5maWx0ZXIuanMiLCJhcHBzL2NvbXBvbmVudHMvZmlsdGVycy90cnVuY2F0ZS13b3Jkcy5maWx0ZXIuanMiLCJhcHBzL2NvbXBvbmVudHMvZmlsdGVycy90cnVuY2F0ZS1jaGFyYWN0ZXJzLmZpbHRlci5qcyIsImFwcHMvY29tcG9uZW50cy9pbnRlcmNlcHRvci9ub3RpZmljYXRpb24uaW50ZXJjZXB0b3IuanMiLCJhcHBzL2NvbXBvbmVudHMvaW50ZXJjZXB0b3IvZXJyb3JoYW5kbGVyLmludGVyY2VwdG9yLmpzIiwiYXBwcy9jb21wb25lbnRzL2ZhbmN5LWRyb3Bkb3duL2ZhbmN5LWRyb3Bkb3duLmpzIiwiYXBwcy9jb21wb25lbnRzL2RpcmVjdGl2ZXMvaW5kZXguanMiLCJhcHBzL2NvbXBvbmVudHMvZGlyZWN0aXZlcy9zY3JvbGwtdG9wLmRpcmVjdGl2ZS5qcyIsImFwcHMvY29tcG9uZW50cy9kaXJlY3RpdmVzL3Jlc2l6ZS1iYWNrZ3JvdW5kLmRpcmVjdGl2ZS5qcyIsImFwcHMvY29tcG9uZW50cy9kaXJlY3RpdmVzL3JlbWFpbmluZy1jaGFyYWN0ZXJzLmRpcmVjdGl2ZS5qcyIsImFwcHMvY29tcG9uZW50cy9kaXJlY3RpdmVzL2Zvcm0uZGlyZWN0aXZlLmpzIiwiYXBwcy9jb21wb25lbnRzL2RpcmVjdGl2ZXMvZmlsZS1kaXJlY3RpdmUuanMiLCJhcHBzL2NvbXBvbmVudHMvZGlyZWN0aXZlcy9leGFjdC1sZW5ndGguZGlyZWN0aXZlLmpzIiwiYXBwcy9jb21wb25lbnRzL2RpcmVjdGl2ZXMvZXZlbnQtaGFuZGxlci5kaXJlY3RpdmUuanMiLCJhcHBzL2NvbXBvbmVudHMvZGlyZWN0aXZlcy9jb21wYXJlLmRpcmVjdGl2ZS5qcyIsImFwcHMvY29tcG9uZW50cy9kaXJlY3RpdmVzL2Jsb2ItdG8taW1hZ2UuZGlyZWN0aXZlLmpzIiwiYXBwcy9jb21wb25lbnRzL2RpcmVjdGl2ZXMvYWRqdXN0LXdpZHRoLmRpcmVjdGl2ZS5qcyIsImFwcHMvY29tcG9uZW50cy9mYWN0b3J5L3Jlc3BvbnNlLmhhbmRsZXIuanMiLCJhcHBzL2NvbXBvbmVudHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxZQUFBO0VBQ0E7Ozs7Ozs7Ozs7Ozs7O0VBY0E7S0FDQSxPQUFBLDBCQUFBLENBQUEsWUFBQTs7O0FDaEJBLENBQUEsWUFBQTtFQUNBOzs7Ozs7Ozs7O0VBVUE7S0FDQSxPQUFBO0tBQ0EsT0FBQTs7O0VBR0EsU0FBQSxjQUFBLGdCQUFBO0lBQ0E7T0FDQSxNQUFBLGtCQUFBO1FBQ0EsUUFBQTtRQUNBLEtBQUE7UUFDQSxNQUFBO1VBQ0EsT0FBQSxDQUFBLGNBQUE7VUFDQSxXQUFBOztRQUVBLE9BQUE7VUFDQSxTQUFBO1lBQ0EsYUFBQTtZQUNBLFlBQUE7OztRQUdBLFNBQUE7VUFDQSx3QkFBQSxDQUFBLGNBQUEsMkJBQUEsVUFBQSxZQUFBLHlCQUFBO1lBQ0Esd0JBQUEsUUFBQTtZQUNBLE9BQUEsV0FBQTs7Ozs7Ozs7OztBQ2xDQSxDQUFBLFdBQUE7RUFDQTs7Ozs7Ozs7Ozs7RUFXQTtLQUNBLE9BQUE7S0FDQSxXQUFBLHNCQUFBOzs7RUFHQSxTQUFBLG1CQUFBLFFBQUEsUUFBQSxZQUFBLGlCQUFBLGVBQUEsYUFBQSxpQkFBQTtJQUNBLElBQUE7TUFDQSxPQUFBOztJQUVBLEtBQUEsV0FBQSxjQUFBOzs7SUFHQTs7Ozs7SUFLQSxTQUFBLE9BQUE7TUFDQSxPQUFBLFlBQUEsc0JBQUEsS0FBQTtNQUNBLEtBQUEsWUFBQSxPQUFBLFFBQUEsS0FBQTtNQUNBOzs7SUFHQSxTQUFBLGNBQUE7TUFDQSxnQkFBQSxZQUFBO1FBQ0EsUUFBQTtRQUNBLFlBQUE7UUFDQSxhQUFBO1FBQ0EsaUJBQUE7U0FDQSxLQUFBLFVBQUE7VUFDQTs7Ozs7Ozs7SUFRQSxTQUFBLFVBQUE7TUFDQSxVQUFBLE9BQUEsT0FBQSxVQUFBLFNBQUEsT0FBQSxPQUFBLFdBQUE7TUFDQSxJQUFBLENBQUEsU0FBQTtRQUNBLEtBQUEsT0FBQSxRQUFBLE9BQUEsSUFBQSxXQUFBO1FBQ0E7OztNQUdBLFdBQUEsS0FBQTtRQUNBLE1BQUE7U0FDQSxLQUFBLFNBQUEsTUFBQTtRQUNBLEtBQUEsT0FBQTtRQUNBLGFBQUEsS0FBQTtRQUNBLEdBQUEsS0FBQSxLQUFBLGNBQUEsS0FBQSxLQUFBLFdBQUEsU0FBQSxHQUFBO1VBQ0E7O1NBRUEsTUFBQSxnQkFBQTs7Ozs7Ozs7SUFRQSxTQUFBLGFBQUEsT0FBQTtNQUNBLElBQUEsV0FBQSxZQUFBLGtCQUFBLE9BQUEsS0FBQTtNQUNBLEtBQUEsS0FBQSxRQUFBOzs7SUFHQSxTQUFBLGdCQUFBO01BQ0EsSUFBQSxXQUFBO01BQ0EsRUFBQSxLQUFBLEtBQUEsVUFBQSxTQUFBLFFBQUE7VUFDQSxHQUFBLEtBQUEsS0FBQSxXQUFBLFFBQUEsUUFBQSxjQUFBLEVBQUE7WUFDQSxTQUFBLEtBQUE7Ozs7TUFJQSxLQUFBLEtBQUEsV0FBQTs7Ozs7OztBQ3RGQSxDQUFBLFdBQUE7SUFDQTtJQUNBLElBQUEsT0FBQSxFQUFBLGFBQUEsYUFBQTtRQUNBLEVBQUEsV0FBQSxFQUFBO1FBQ0EsRUFBQSxVQUFBLFdBQUEsRUFBQTs7SUFFQSxJQUFBLE9BQUEsRUFBQSxXQUFBLGFBQUE7UUFDQSxFQUFBLFNBQUEsRUFBQTs7Ozs7Ozs7Ozs7OztJQWFBLFFBQUEsT0FBQSxvQkFBQTs7Ozs7Ozs7Ozs7UUFXQTs7OztJQUlBLFFBQUEsUUFBQSxVQUFBLE1BQUEsV0FBQTtRQUNBLElBQUEsV0FBQSxPQUFBO1FBQ0EsSUFBQSxTQUFBLGVBQUEsZ0JBQUEsU0FBQSxhQUFBLGFBQUE7WUFDQSxRQUFBLEtBQUE7WUFDQSxRQUFBLFVBQUEsVUFBQSxDQUFBO2VBQ0E7WUFDQSxRQUFBLFVBQUEsVUFBQSxDQUFBO1lBQ0EsUUFBQSxLQUFBOzs7OztBQzFDQSxDQUFBLFlBQUE7RUFDQTs7Ozs7Ozs7Ozs7O0VBWUEsU0FBQSxzQkFBQSxXQUFBLFFBQUEsWUFBQSxRQUFBO0lBQ0EsSUFBQSxPQUFBOzs7SUFHQSxTQUFBLE9BQUE7TUFDQSxPQUFBLFlBQUEseUJBQUEsS0FBQTs7O0lBR0EsVUFBQSxTQUFBLE1BQUEsS0FBQSxVQUFBLE1BQUE7TUFDQSxLQUFBLE9BQUE7TUFDQSxLQUFBLGFBQUEsQ0FBQSxLQUFBLHNCQUFBLE1BQUEsS0FBQSxvQkFBQTs7SUFFQTs7SUFFQSxPQUFBLE1BQUEsV0FBQTs7OztFQUdBO0tBQ0EsT0FBQTtLQUNBLFdBQUEseUJBQUE7OztBQ2hDQSxDQUFBLFlBQUE7RUFDQTs7Ozs7Ozs7Ozs7O0VBWUEsU0FBQSx1QkFBQSxXQUFBLFFBQUEsWUFBQSxRQUFBO0lBQ0EsSUFBQSxPQUFBOzs7SUFHQSxTQUFBLE9BQUE7TUFDQSxPQUFBLFlBQUEsMEJBQUEsS0FBQTs7O0lBR0EsVUFBQSxTQUFBLE1BQUEsS0FBQSxVQUFBLE1BQUE7TUFDQSxLQUFBLE9BQUE7TUFDQSxLQUFBLGFBQUEsQ0FBQSxLQUFBLHNCQUFBLE1BQUEsS0FBQSxvQkFBQTs7SUFFQTs7SUFFQSxPQUFBLE1BQUEsV0FBQTs7OztFQUdBO0tBQ0EsT0FBQTtLQUNBLFdBQUEsMEJBQUE7OztBQ2hDQSxDQUFBLFlBQUE7RUFDQTs7Ozs7Ozs7OztFQVVBO0tBQ0EsT0FBQTtLQUNBLE9BQUE7OztFQUdBLFNBQUEsZ0JBQUEsZ0JBQUE7SUFDQTtPQUNBLE1BQUEsZ0JBQUE7UUFDQSxRQUFBO1FBQ0EsS0FBQTtRQUNBLE1BQUE7VUFDQSxPQUFBLENBQUEsY0FBQTtVQUNBLFdBQUE7O1FBRUEsT0FBQTtVQUNBLFNBQUE7WUFDQSxhQUFBO1lBQ0EsWUFBQTs7O1FBR0EsU0FBQTtVQUNBLHdCQUFBLENBQUEsY0FBQSwyQkFBQSxVQUFBLFlBQUEseUJBQUE7WUFDQSx3QkFBQSxRQUFBO1lBQ0EsT0FBQSxXQUFBOzs7Ozs7SUFNQTtPQUNBLE1BQUEsZ0JBQUE7UUFDQSxRQUFBO1FBQ0EsS0FBQTtRQUNBLE1BQUE7VUFDQSxPQUFBLENBQUEsY0FBQTtVQUNBLFdBQUE7O1FBRUEsT0FBQTtVQUNBLFNBQUE7WUFDQSxhQUFBO1lBQ0EsWUFBQTs7O1FBR0EsU0FBQTtVQUNBLHdCQUFBLENBQUEsY0FBQSwyQkFBQSxVQUFBLFlBQUEseUJBQUE7WUFDQSx3QkFBQSxRQUFBO1lBQ0EsT0FBQSxXQUFBOzs7Ozs7Ozs7O0FDekRBLENBQUEsV0FBQTtFQUNBOzs7Ozs7Ozs7OztFQVdBO0tBQ0EsT0FBQTtLQUNBLFdBQUEsd0JBQUE7OztFQUdBLFNBQUEscUJBQUEsUUFBQSxRQUFBLFlBQUEsU0FBQSxjQUFBLFFBQUEsU0FBQSxpQkFBQSxRQUFBLE1BQUEsaUJBQUEsZUFBQTtJQUNBLElBQUE7TUFDQSxPQUFBOztNQUVBLEtBQUEsV0FBQSxjQUFBLGdCQUFBOzs7SUFHQTs7Ozs7SUFLQSxTQUFBLE9BQUE7TUFDQSxPQUFBLFlBQUEsd0JBQUEsS0FBQTtNQUNBLEtBQUEsWUFBQSxPQUFBLFFBQUEsS0FBQTtNQUNBLEtBQUEsU0FBQSxLQUFBO01BQ0E7Ozs7Ozs7SUFPQSxTQUFBLFVBQUE7TUFDQSxVQUFBLE9BQUEsT0FBQSxVQUFBLFNBQUEsT0FBQSxPQUFBLFdBQUE7TUFDQSxJQUFBLENBQUEsU0FBQTtRQUNBLEtBQUEsT0FBQSxRQUFBLE9BQUEsSUFBQSxXQUFBO1FBQ0E7OztNQUdBLFdBQUEsS0FBQTtRQUNBLE1BQUE7U0FDQSxLQUFBLFNBQUEsTUFBQTtRQUNBLGtCQUFBO1NBQ0EsTUFBQSxhQUFBOzs7Ozs7OztJQVFBLFNBQUEsa0JBQUEsTUFBQTtNQUNBLElBQUEsUUFBQSxRQUFBLEtBQUE7TUFDQSxNQUFBLFFBQUEsYUFBQSxnQkFBQSxLQUFBO01BQ0EsS0FBQSxPQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0lBZ0JBLEtBQUEsV0FBQSxXQUFBOzs7Ozs7TUFNQSxJQUFBLFFBQUEsUUFBQSxLQUFBLEtBQUE7Ozs7OztRQU1BLFFBQUEsTUFBQSxNQUFBLElBQUEsU0FBQSxNQUFBO1VBQ0EsT0FBQSxLQUFBOztRQUVBOztNQUVBLE1BQUEsUUFBQTs7Ozs7TUFLQSxJQUFBLE1BQUEsZUFBQSxxQkFBQTtRQUNBLE9BQUEsTUFBQTs7Ozs7O01BTUEsSUFBQSxXQUFBLE1BQUEsZUFBQSxhQUFBO1FBQ0EsT0FBQSxNQUFBOztNQUVBLFFBQUE7O01BRUEsV0FBQSxVQUFBLFdBQUEsT0FBQTtRQUNBLElBQUEsTUFBQTtTQUNBLFNBQUEsV0FBQSxPQUFBOztNQUVBLFNBQUEsS0FBQSxTQUFBLFVBQUE7U0FDQSxRQUFBO1FBQ0EsR0FBQSxTQUFBLFNBQUEsUUFBQTtVQUNBLE9BQUEsTUFBQTtZQUNBLFFBQUE7WUFDQSxVQUFBLFFBQUEsYUFBQSxZQUFBLFNBQUE7O1VBRUE7O1FBRUEsT0FBQSxHQUFBO1FBQ0EsT0FBQSxRQUFBO1VBQ0EsU0FBQTtVQUNBLFdBQUEsUUFBQSxhQUFBLHlDQUFBO1lBQ0EsV0FBQSxNQUFBOzs7O1NBSUEsTUFBQSxnQkFBQTs7Ozs7Ozs7O0lBU0EsS0FBQSxpQkFBQSxXQUFBO01BQ0EsSUFBQSxnQkFBQSxPQUFBLEtBQUE7UUFDQSxXQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxLQUFBO1FBQ0EsU0FBQTtVQUNBLGVBQUEsVUFBQTtZQUNBLE9BQUEsS0FBQTs7Ozs7Ozs7Ozs7O0lBWUEsU0FBQSxjQUFBO01BQ0EsZ0JBQUEsWUFBQTtRQUNBLFFBQUE7UUFDQSxZQUFBO1FBQ0EsYUFBQTtRQUNBLGlCQUFBOzs7SUFHQTs7Ozs7O0FDMUtBLENBQUEsV0FBQTtFQUNBOzs7Ozs7Ozs7OztFQVdBO0tBQ0EsT0FBQSwwQkFBQTs7QUNiQSxDQUFBLFdBQUE7RUFDQTs7Ozs7Ozs7Ozs7RUFXQTtLQUNBLE9BQUE7S0FDQSxPQUFBOzs7RUFHQSxTQUFBLHlCQUFBLGdCQUFBO0lBQ0E7T0FDQSxNQUFBLHNCQUFBO1FBQ0EsS0FBQTtRQUNBLE1BQUE7VUFDQSxPQUFBO1VBQ0EsV0FBQTs7UUFFQSxPQUFBO1VBQ0EsZ0JBQUE7WUFDQSxhQUFBO1lBQ0EsWUFBQTs7Ozs7OztBQzVCQSxDQUFBLFdBQUE7RUFDQTs7Ozs7Ozs7Ozs7RUFXQTtLQUNBLE9BQUE7S0FDQSxXQUFBLDJCQUFBOzs7RUFHQSxTQUFBLHdCQUFBLFFBQUEsUUFBQSxRQUFBO0lBQ0EsSUFBQTtJQUNBOztJQUVBLFNBQUEsT0FBQTtNQUNBO01BQ0EsT0FBQSxZQUFBLE9BQUEsUUFBQSxLQUFBOzs7Ozs7O0lBT0EsU0FBQSxZQUFBO01BQ0EsU0FBQSxPQUFBLFlBQUE7TUFDQSxPQUFBLEtBQUE7Ozs7O0FDaENBLENBQUEsV0FBQTtFQUNBOzs7Ozs7Ozs7OztFQVdBLFNBQUEsZUFBQSxnQkFBQTtJQUNBO09BQ0EsTUFBQSxjQUFBO1FBQ0EsUUFBQTtRQUNBLEtBQUE7UUFDQSxNQUFBO1VBQ0EsT0FBQSxDQUFBLGNBQUEscUJBQUE7VUFDQSxXQUFBOztRQUVBLE9BQUE7VUFDQSxTQUFBO1lBQ0EsYUFBQTtZQUNBLFlBQUE7OztRQUdBLFNBQUE7VUFDQSx3QkFBQSxDQUFBLGNBQUEsMkJBQUEsU0FBQSxZQUFBLHlCQUFBO1lBQ0Esd0JBQUEsUUFBQTtZQUNBLE9BQUEsV0FBQTs7Ozs7OztFQU1BO0tBQ0EsT0FBQTtLQUNBLE9BQUE7OztBQ3RDQSxDQUFBLFdBQUE7RUFDQTs7Ozs7Ozs7Ozs7OztFQWFBLFNBQUEsb0JBQUEsUUFBQSxRQUFBLFFBQUEsWUFBQSxjQUFBLFNBQUEsU0FBQSxTQUFBLFFBQUEsWUFBQSxZQUFBLFlBQUE7SUFDQSxJQUFBLE9BQUE7O0lBRUEsS0FBQSxRQUFBLFdBQUEsYUFBQTtJQUNBOzs7Ozs7O0lBT0EsU0FBQSxPQUFBO01BQ0EsT0FBQSxZQUFBLHVCQUFBLEtBQUE7OztNQUdBLEtBQUEsVUFBQTtNQUNBLEtBQUEsY0FBQTtNQUNBLEtBQUEsVUFBQSxXQUFBO01BQ0EsS0FBQSxZQUFBO01BQ0EsS0FBQSxnQkFBQTtNQUNBO01BQ0EsUUFBQSxJQUFBOzs7Ozs7Ozs7SUFTQSxLQUFBLGNBQUEsV0FBQTtNQUNBLFFBQUE7TUFDQTs7Ozs7Ozs7O0lBU0EsS0FBQSxlQUFBLFNBQUEsV0FBQTtNQUNBLEtBQUEsZ0JBQUEsQ0FBQSxLQUFBLGNBQUEsYUFBQSxDQUFBLEtBQUEsZ0JBQUE7TUFDQSxLQUFBLFlBQUE7TUFDQSxLQUFBLGNBQUE7TUFDQTs7O0lBR0EsS0FBQSxpQkFBQSxTQUFBLFdBQUE7TUFDQSxPQUFBLENBQUEsY0FBQSxLQUFBLGFBQUEsT0FBQTs7Ozs7Ozs7OztJQVVBLFNBQUEsY0FBQSxjQUFBO01BQ0EsSUFBQSxhQUFBLFdBQUEsR0FBQTtRQUNBOztNQUVBLFdBQUEsVUFBQSxTQUFBO01BQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLGFBQUEsUUFBQSxLQUFBO1FBQ0EsV0FBQSxVQUFBLEtBQUEsYUFBQTs7TUFFQSxRQUFBOzs7Ozs7Ozs7Ozs7O0lBYUEsU0FBQSxjQUFBO01BQ0EsSUFBQSxVQUFBLEtBQUEsZ0JBQUEsTUFBQTtNQUNBLFdBQUEsUUFBQTtRQUNBLFFBQUEsS0FBQTtRQUNBLFlBQUEsS0FBQTtRQUNBLGNBQUEsVUFBQSxLQUFBO1NBQ0EsS0FBQSxTQUFBLGlCQUFBO1FBQ0EsS0FBQSxhQUFBLGdCQUFBO1FBQ0EsY0FBQSxnQkFBQTtTQUNBLE1BQUEsYUFBQTs7Ozs7Ozs7Ozs7SUFXQSxLQUFBLGFBQUEsU0FBQSxNQUFBO01BQ0EsSUFBQSxVQUFBLFNBQUEsS0FBQTtNQUNBO1NBQ0EsUUFBQSxRQUFBLGFBQUEsMENBQUEsUUFBQSxhQUFBLHVDQUFBO1VBQ0EsUUFBQTs7U0FFQTtTQUNBLEtBQUEsU0FBQSxLQUFBO1VBQ0EsV0FBQSxPQUFBO1lBQ0EsTUFBQTthQUNB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UUFBQTs7OztRQUlBLEtBQUEsYUFBQSxTQUFBLE9BQUE7WUFDQSxJQUFBLFFBQUEsS0FBQSxRQUFBLFVBQUEsUUFBQSxNQUFBO1lBQ0EsS0FBQSxRQUFBLFVBQUEsT0FBQSxPQUFBO1lBQ0EsYUFBQSxPQUFBO2dCQUNBLElBQUEsTUFBQTtnQkFDQSxTQUFBOztZQUVBLE1BQUE7Ozs7Ozs7O1FBUUEsS0FBQSxjQUFBLFNBQUEsSUFBQTtZQUNBLFFBQUE7WUFDQSxLQUFBLElBQUEsU0FBQSxLQUFBLFFBQUEsUUFBQTtnQkFDQSxJQUFBLEtBQUEsUUFBQSxPQUFBLE9BQUEsTUFBQSxJQUFBO29CQUNBLEtBQUEsUUFBQSxPQUFBLE9BQUEsT0FBQTtvQkFDQTs7O1lBR0EsYUFBQSxPQUFBO2dCQUNBLElBQUE7Z0JBQ0EsU0FBQTtlQUNBLEtBQUEsU0FBQSxpQkFBQTtnQkFDQSxRQUFBLElBQUEsV0FBQSxpQkFBQTtnQkFDQSxRQUFBO2VBQ0EsU0FBQSxlQUFBO2dCQUNBLFFBQUEsSUFBQSxtQkFBQTtnQkFDQSxRQUFBOzs7O1FBSUEsU0FBQSxVQUFBO1lBQ0EsYUFBQSxLQUFBO2dCQUNBLElBQUE7ZUFDQSxLQUFBLFNBQUEsY0FBQTtnQkFDQSxJQUFBLGFBQUEsTUFBQTtvQkFDQSxRQUFBLE9BQUEsS0FBQSxTQUFBLGFBQUE7b0JBQ0EsS0FBQSxRQUFBLGFBQUEsQ0FBQSxLQUFBLFFBQUEsY0FBQSxLQUFBLFFBQUEsV0FBQSxTQUFBLEtBQUEsS0FBQSxRQUFBLFdBQUEsS0FBQTs7Z0JBRUEsS0FBQSxpQkFBQSxnQkFBQSxXQUFBO2VBQ0EsU0FBQSxlQUFBO2dCQUNBLFFBQUEsSUFBQSw0QkFBQTs7U0FFQTs7UUFFQSxTQUFBLGNBQUEsTUFBQSxRQUFBO1lBQ0EsSUFBQSxXQUFBLEdBQUE7WUFDQSxnQkFBQSxJQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsY0FBQSxVQUFBO2VBQ0EsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsU0FBQSxRQUFBLFNBQUE7ZUFDQSxXQUFBO2dCQUNBLFNBQUEsUUFBQTs7O1lBR0EsT0FBQSxT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QUEsSUFBQTtnQkFDQSxXQUFBO2VBQ0EsS0FBQSxTQUFBLFVBQUE7T0FDQSxLQUFBLGFBQUEsUUFBQSxLQUFBOztZQUVBLEtBQUEsY0FBQSxVQUFBO2dCQUNBLE9BQUEsS0FBQSxLQUFBLEtBQUEsV0FBQSxLQUFBLE9BQUEsS0FBQTs7WUFFQSxJQUFBLGVBQUE7WUFDQSxRQUFBLFFBQUEsS0FBQSxXQUFBLE1BQUEsU0FBQSxPQUFBLEtBQUE7Y0FDQSxnQkFBQSxTQUFBLE1BQUE7OztZQUdBLEdBQUEsS0FBQSxXQUFBLEtBQUE7WUFDQSxLQUFBLGdCQUFBLGFBQUEsS0FBQSxXQUFBLEtBQUE7Ozs7Ozs7O0lBT0E7U0FDQSxPQUFBO1NBQ0EsV0FBQSxxQkFBQTs7O0FDaEhBLENBQUEsV0FBQTtJQUNBOzs7Ozs7Ozs7OztJQVdBO09BQ0EsT0FBQTtPQUNBLFFBQUEsa0JBQUE7OztJQUdBLFNBQUEsZUFBQSxXQUFBLFlBQUE7O01BRUEsT0FBQSxVQUFBLGNBQUE7VUFDQSxJQUFBOztRQUVBO1FBQ0EsTUFBQTtLQUNBLFFBQUE7S0FDQSxRQUFBO0lBQ0EsSUFBQTs7O1FBR0EsTUFBQTtHQUNBLFFBQUE7O1FBRUEsUUFBQTtLQUNBLFFBQUE7S0FDQSxRQUFBO0lBQ0EsSUFBQTs7O0VBR0EsS0FBQTtHQUNBLFFBQUE7R0FDQSxRQUFBO0lBQ0EsSUFBQTs7R0FFQSxtQkFBQTs7RUFFQSxRQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsUUFBQTtvQkFDQSxJQUFBOzs7Ozs7O0lBTUEsU0FBQSxxQkFBQSxNQUFBLGVBQUE7UUFDQSxJQUFBLFlBQUE7UUFDQSxVQUFBLE9BQUEsUUFBQSxTQUFBO1FBQ0EsT0FBQSxRQUFBLFNBQUE7Ozs7QUN6REEsQ0FBQSxXQUFBO0lBQ0E7Ozs7Ozs7Ozs7Ozs7SUFhQTtTQUNBLE9BQUE7U0FDQSxRQUFBLGVBQUE7OztJQUdBLFNBQUEsWUFBQSxnQkFBQTtRQUNBLElBQUEsUUFBQTs7Ozs7UUFLQSxNQUFBLGFBQUE7Ozs7Ozs7UUFPQSxNQUFBLE9BQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxl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QUE7Z0JBQ0EsS0FBQSxZQUFBO2dCQUNBLE9BQUEsWUFBQTtnQkFDQSxVQUFBLENBQUEsWUFBQSxhQUFBLFlBQUEsVUFBQSxRQUFBO2dCQUNBLFNBQUEsQ0FBQSxZQUFBLGFBQUEsWUFBQSxVQUFBLGVBQUEsWUFBQSxVQUFBLFlBQUE7Z0JBQ0EsUUFBQSxZQUFBOzs7Ozs7Ozs7OztRQVdBLEtBQUEsV0FBQSxXQUFBO1lBQ0EsSUFBQSxRQUFBLFFBQUEsS0FBQSxLQUFBO2dCQUNBLFdBQUEsYUFBQSxPQUFBO29CQUNBLElBQUEsTUFBQTttQkFDQTtZQUNBLFNBQUEsS0FBQSxTQUFBLGlCQUFBO2dCQUNBLFFBQUEsSUFBQSxXQUFBLGVBQUE7ZUFDQSxTQUFBLGVBQUE7Z0JBQ0EsUUFBQSxJQUFBLG1CQUFBOzs7Ozs7Ozs7O0lBU0E7U0FDQSxPQUFBO1NBQ0EsV0FBQSxrQkFBQTs7O0FDOURBLENBQUEsV0FBQTtJQUNBOzs7Ozs7Ozs7Ozs7SUFZQTtTQUNBLE9BQUE7U0FDQSxPQUFBOzs7SUFHQSxTQUFBLGdCQUFBLGdCQUFBLFlBQUE7O1FBRUEsZUFBQSxNQUFBLGNBQUE7WUFDQSxRQUFBO1lBQ0EsVUFBQTtZQUNBLEtBQUE7WUFDQSxPQUFBO2dCQUNBLHdCQUFBO29CQUNBLFVBQUE7O2dCQUVBLHlCQUFBO29CQUNBLGFBQUEsV0FBQSxVQUFBOzs7V0FHQSxNQUFBLDhCQUFBO1lBQ0EsUUFBQTtZQUNBLEtBQUE7WUFDQSxPQUFBO2dCQUNBLHNDQUFBO29CQUNBLGFBQUEsV0FBQSxVQUFBO29CQUNBLFlBQUE7Ozs7Ozs7O0FDdENBLENBQUEsV0FBQTtJQUNBOzs7Ozs7Ozs7Ozs7O0lBYUEsU0FBQSxvQkFBQSxPQUFBLGFBQUEsU0FBQTtRQUNBLElBQUEsT0FBQTtRQUNBOzs7Ozs7Ozs7UUFTQSxTQUFBLE9BQUE7Ozs7O2FBS0EsS0FBQSxnQkFBQTs7Ozs7Ozs7UUFRQSxLQUFBLGVBQUEsVUFBQTtVQUNBLE9BQUEsYUFBQSxjQUFBO2dCQUNBLEtBQUEsS0FBQTtlQUNBLEtBQUEsU0FBQSxVQUFBO2dCQUNB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UUFLQSxNQUFBLGFBQUE7Ozs7Ozs7Ozs7RUFVQSxNQUFBLFVBQUEsU0FBQSxRQUFBLFNBQUEsTUFBQTtZQUNBLE9BQUEscUJBQUEsUUFBQSxRQUFBLFNBQUEsTUFBQTs7Ozs7OztBQ3BDQSxDQUFBLFdBQUE7SUFDQTs7Ozs7Ozs7Ozs7SUFXQTtTQUNBLE9BQUE7U0FDQSxXQUFBLDBCQUFBOzs7O0lBSUEsU0FBQSx1QkFBQSxXQUFBLElBQUEsUUFBQSxTQUFBLG1CQUFBLFdBQUE7Ozs7OztRQU1BLElBQUEsT0FBQTtRQUNBLEtBQUEsT0FBQSxVQUFBLGFBQUEsUUFBQSxVQUFBLFVBQUEsVUFBQSxTQUFBLE1BQUEsVUFBQSxTQUFBO1FBQ0EsS0FBQSxlQUFBOztRQUVBLEtBQUEsT0FBQSxDQUFBO1lBQ0EsTUFBQTtZQUNBLFVBQUE7WUFDQSxTQUFBO1lBQ0EsT0FBQTtZQUNBLFVBQUE7V0FDQTtZQUNBLE1BQUE7WUFDQSxVQUFBO1lBQ0EsU0FBQTtZQUNBLE9BQUE7WUFDQSxVQUFBO1dBQ0E7WUFDQSxNQUFBO1lBQ0EsVUFBQTtZQUNBLFNBQUE7WUFDQSxPQUFBO1lBQ0EsVUFBQTtXQUNBO1lBQ0EsTUFBQTtZQUNBLFVBQUE7WUFDQSxTQUFBO1lBQ0EsT0FBQTtZQUNBLFVBQUE7V0FDQTtZQUNBLE1BQUE7WUFDQSxVQUFBO1lBQ0EsU0FBQTtZQUNBLE9BQUE7WUFDQSxVQUFBO1dBQ0E7WUFDQSxNQUFBO1lBQ0EsVUFBQTtZQUNBLFNBQUE7WUFDQSxPQUFBO1lBQ0EsVUFBQTtXQUNBO1lBQ0EsTUFBQTtZQUNBLFVBQUE7WUFDQSxTQUFBO1lBQ0EsT0FBQTtZQUNBLFVBQUE7OztRQUdBOzs7Ozs7UUFNQSxTQUFBLE9BQUE7WUFDQSxPQUFBLFlBQUEsMEJBQUEsS0FBQTtZQUNBLEtBQUEsS0FBQTtZQUNBLGVBQUEsS0FBQSxHQUFBO1lBQ0E7OztRQUdBLFNBQUEsYUFBQTtZQUNBLFFBQUE7WUFDQSxrQkFBQSxRQUFBLEtBQUEsSUFBQSxLQUFBLFNBQUEsVUFBQTtnQkFDQSxFQUFBLEtBQUEsS0FBQSxjQUFBLFNBQUEsTUFBQSxPQUFBO29CQUNBLEtBQUEsYUFBQSxPQUFBLE9BQUEsU0FBQSxLQUFBOztnQkFFQSxRQUFBO2VBQ0EsU0FBQSxPQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsT0FBQTs7Ozs7UUFLQSxTQUFBLGtCQUFBO1lBQ0EsSUFBQSxRQUFBO1lBQ0EsSUFBQSxTQUFBLFNBQUEsR0FBQTtnQkFDQSxPQUFBLG1CQUFBLEVBQUEsUUFBQSxPQUFBOztZQUVBLElBQUEsY0FBQSxTQUFBLE9BQUEsVUFBQTtZQUNBLElBQUEsWUFBQSxZQUFBLE1BQUE7O1lBRUEsS0FBQSxJQUFBLEtBQUEsV0FBQTtnQkFDQSxJQUFBLE1BQUEsVUFBQSxHQUFBLE1BQUE7Z0JBQ0EsSUFBQSxJQUFBLFNBQUEsR0FBQTtvQkFDQSxNQUFBLE9BQUEsSUFBQSxPQUFBLE9BQUEsSUFBQTs7OztZQUlBLE9BQUE7OztRQUdBLFNBQUEsZUFBQSxXQUFBO1lBQ0EsSUFBQSxZQUFBLFVBQUEsTUFBQTtZQUNBLEVBQUEsS0FBQSxXQUFBLFNBQUEsTUFBQSxPQUFBO2dCQUNBLEVBQUEsS0FBQSxLQUFBLE1BQUEsU0FBQSxLQUFBLE9BQUE7b0JBQ0EsSUFBQSxRQUFBLElBQUEsSUFBQTt3QkFDQSxLQUFBLEtBQUEsT0FBQSxTQUFBO3dCQUNBLEtBQUEsYUFBQSxLQUFBOzs7Ozs7UUFNQSxLQUFBLFlBQUEsU0FBQSxLQUFBO1lBQ0EsRUFBQSxLQUFBLEtBQUEsTUFBQSxTQUFBLE1BQUEsT0FBQTtnQkFDQSxJQUFBLEtBQUEsT0FBQSxJQUFBLElBQUE7b0JBQ0EsSUFBQSxLQUFBLFFBQUE7d0JBQ0EsSUFBQSxLQUFBLGFBQUEsU0FBQSxHQUFBOzRCQUNBLEtBQUEsS0FBQSxPQUFBLFNBQUE7NEJBQ0EsS0FBQSxHQUFBLFlBQUE7NEJBQ0EsSUFBQSxZQUFBOzRCQUNBLEVBQUEsS0FBQSxLQUFBLGNBQUEsU0FBQSxNQUFBLE9BQUE7Z0NBQ0EsSUFBQSxLQUFBLE1BQUEsSUFBQTtvQ0FDQSxZQUFBO3FDQUNBLEtBQUEsR0FBQSxhQUFBLEtBQUEsS0FBQTs7OzRCQUdBLEtBQUEsR0FBQSxZQUFBLEVBQUEsS0FBQSxLQUFBLEdBQUEsV0FBQSxDQUFBOzRCQUNBLEtBQUEsYUFBQSxPQUFBLFdBQUE7OzJCQUVBO3dCQUNBLElBQUEsS0FBQSxhQUFBLFNBQUEsR0FBQTs0QkFDQSxRQUFBOzRCQUNBLEtBQUEsS0FBQSxPQUFBLFNBQUE7NEJBQ0EsSUFBQSxPQUFBOzRCQUNBLEtBQUEsYUFBQSxLQUFBOzRCQUNBLElBQUEsUUFBQSxRQUFBLEtBQUEsS0FBQTs0QkFDQSxNQUFBLFlBQUEsSUFBQTs0QkFDQSxrQkFBQSxRQUFBLE9BQUEsS0FBQSxTQUFBLFVBQUE7Z0NBQ0EsS0FBQSxhQUFBLEtBQUEsYUFBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLElBQUE7Z0NBQ0EsS0FBQSxHQUFBLFlBQUE7Z0NBQ0EsRUFBQSxLQUFBLEtBQUEsY0FBQSxTQUFBLE1BQUEsT0FBQTtvQ0FDQSxLQUFBLEdBQUEsYUFBQSxLQUFBLEtBQUE7O2dDQUVBLEtBQUEsR0FBQSxZQUFBLEVBQUEsS0FBQSxLQUFBLEdBQUEsV0FBQSxDQUFBO2dDQUNBLFFBQUE7K0JBQ0EsU0FBQSxPQUFBO2dDQUNBLFFBQUE7Z0NBQ0EsT0FBQTs7OztvQkFJQTs7Ozs7Ozs7O0FDeEtBLENBQUEsV0FBQTtJQUNBOzs7Ozs7Ozs7OztJQVdBO1NBQ0EsT0FBQTtTQUNBLFVBQUEsc0JBQUEsQ0FBQSxXQUFBO1lBQ0EsT0FBQTtlQUNBLFVBQUE7Z0JBQ0EsT0FBQTtvQkFDQSxTQUFBOztnQkFFQSxhQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsY0FBQTtnQkFDQSxrQkFBQTtnQkFDQSxNQUFBLFNBQUEsT0FBQSxTQUFBLFFBQUEsU0FBQTs7Ozs7O0FDeEJBLENBQUEsV0FBQTtJQUNBOzs7Ozs7Ozs7OztJQVdBO09BQ0EsT0FBQTtPQUNBLFFBQUEsa0JBQUE7OztJQUdBLFNBQUEsZUFBQSxXQUFBLFlBQUE7O01BRUEsT0FBQSxVQUFBLFVBQUE7UUFDQTtRQUNBLFNBQUE7VUFDQSxRQUFBO0lBQ0EsbUJBQUE7Ozs7OztDQUtBLFNBQUEsdUJBQUEsTUFBQSxlQUFBO1FBQ0EsSUFBQSxZQUFBO1FBQ0EsVUFBQSxPQUFBLFFBQUEsU0FBQTtRQUNBLE9BQUEsUUFBQSxTQUFBOzs7O0FDL0JBLENBQUEsV0FBQTtJQUNBOzs7Ozs7Ozs7Ozs7O0lBYUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxlQUFBOzs7SUFHQSxTQUFBLFlBQUEsZ0JBQUE7UUFDQSxJQUFBLFFBQUE7Ozs7O1FBS0EsTUFBQSxhQUFBOzs7Ozs7Ozs7O0VBVUEsTUFBQSxVQUFBLFNBQUEsUUFBQSxTQUFBLE1BQUE7WUFDQSxPQUFBLGVBQUEsUUFBQSxRQUFBLFNBQUEsTUFBQTs7Ozs7OztBQ3BDQSxDQUFBLFdBQUE7SUFDQTs7Ozs7Ozs7Ozs7SUFXQTtTQUNBLE9BQUE7U0FDQSxXQUFBLG9CQUFBOzs7O0lBSUEsU0FBQSxpQkFBQSxVQUFBLElBQUEsUUFBQSxTQUFBLGFBQUE7Ozs7OztRQU1BLElBQUEsT0FBQTtRQUNBLEtBQUEsV0FBQTtFQUNBOzs7Ozs7UUFNQSxTQUFBLE9BQUE7V0FDQSxPQUFBLFlBQUEsb0JBQUEsS0FBQTtXQUNBLEtBQUEsV0FBQTtXQUNBLEtBQUEsZ0JBQUE7V0FDQSxLQUFBLGVBQUE7V0FDQSxLQUFBLGNBQUE7V0FDQSxLQUFBLGNBQUE7V0FDQSxLQUFBLFlBQUE7V0FDQSxLQUFBLFFBQUE7V0FDQSxLQUFBLFlBQUE7OztRQUdBLEtBQUEsZUFBQTtZQUNBLFVBQUE7Z0JBQ0EsU0FBQTtnQkFDQSxNQUFBOztZQUVBLGNBQUE7OztRQUdBLEtBQUEsZUFBQSxTQUFBLEdBQUE7WUFDQSxJQUFBLFlBQUEsR0FBQTtZQUNBLEdBQUEsQ0FBQSxLQUFBLEVBQUEsUUFBQSxFQUFBO2dCQUNBOztZQUVBLE9BQUEsWUFBQSxRQUFBO2dCQUNBLEtBQUEsS0FBQTtnQkFDQSxRQUFBLEtBQUE7Z0JBQ0EsU0FBQSxLQUFBO2VBQ0EsS0FBQSxTQUFBLFVBQUE7Z0JBQ0EsT0FBQSxTQUFBO2VBQ0EsU0FBQSxPQUFBO2dCQUNBLE9BQUE7Ozs7UUFJQSxLQUFBLGtCQUFB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QUE7OztJQUdBLFNBQUEsZUFBQSxXQUFBLFlBQUE7O01BRUEsT0FBQSxVQUFBLGFBQUE7SUFDQSxhQUFBOztRQUVBO1FBQ0EsWUFBQTtVQUNBLFFBQUE7O0VBRUEsTUFBQTtHQUNBLElBQUE7R0FDQSxRQUFBOzs7Ozs7Q0FLQSxTQUFBLHVCQUFBLE1BQUEsZUFBQTtRQUNBLElBQUEsWUFBQTtRQUNBLFVBQUEsT0FBQSxRQUFBLFNBQUE7UUFDQSxPQUFBLFFBQUEsU0FBQTs7OztBQ3BDQSxDQUFBLFdBQUE7SUFDQTs7Ozs7Ozs7Ozs7OztJQWFBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsZUFBQTs7O0lBR0EsU0FBQSxZQUFBLGdCQUFBO1FBQ0EsSUFBQSxRQUFBOzs7Ozs7Ozs7O0VBVUEsTUFBQSxhQUFBLFNBQUEsUUFBQSxTQUFBLE1BQUE7WUFDQSxPQUFBLGVBQUEsV0FBQSxRQUFBLFNBQUEsTUFBQTs7Ozs7OztRQU9BLE1BQUEsT0FBQSxTQUFBLFFBQUE7WUFDQSxPQUFBLGVBQUEsS0FBQSxRQUFBOzs7Ozs7QUN2Q0EsQ0FBQSxXQUFBO0lBQ0E7Ozs7Ozs7Ozs7O0lBV0E7U0FDQSxPQUFBO1NBQ0EsV0FBQSxvQkFBQTs7OztJQUlBLFNBQUEsaUJBQUEsVUFBQSxJQUFBLFFBQUEsU0FBQSxZQUFBLFNBQUE7Ozs7OztRQU1BLElBQUEsT0FBQTtFQUNBOzs7OztRQUtBLFNBQUEsT0FBQTtXQUNBLFFBQUEsSUFBQSxXQUFBLGdCQUFBO1dBQ0EsT0FBQSxZQUFBLG9CQUFBLEtBQUE7S0FDQSxLQUFBLE9BQUE7S0FDQSxLQUFBLE1BQUE7S0FDQSxLQUFBLGFBQUE7S0FDQSxHQUFBLEtBQUEsWUFBQSxLQUFBLFdBQUEsS0FBQSxRQUFBLEtBQUEsYUFBQTs7OztPQUlBLEtBQUEsZUFBQSxTQUFBLE9BQUE7WUFDQSxLQUFBLFdBQUE7TUFDQSxLQUFBLFVBQUEsT0FBQSxRQUFBLEtBQUE7OztJQUdBLEtBQUEsZUFBQTtHQUNBLENBQUEsU0FBQSxxQkFBQSxVQUFBO0dBQ0EsQ0FBQSxTQUFBLGtCQUFBLFVBQUE7R0FD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Q0FBQSxXQUFBO0lBQ0E7Ozs7Ozs7Ozs7Ozs7SUFhQTtTQUNBLE9BQUE7U0FDQSxRQUFBLGdCQUFBOzs7SUFHQSxTQUFBLGFBQUEsaUJBQUE7UUFDQSxJQUFBLFFBQUE7Ozs7Ozs7Ozs7RUFVQSxNQUFBLGtCQUFBLFNBQUEsUUFBQSxTQUFBLE1BQUE7WUFDQSxPQUFBLGdCQUFBLGdCQUFBLFFBQUEsU0FBQSxNQUFBOzs7RUFHQSxNQUFBLGNBQUEsU0FBQSxRQUFBLFNBQUEsTUFBQTtZQUNBLE9BQUEsZ0JBQUEsWUFBQSxRQUFBLFNBQUEsTUFBQTs7Ozs7OztBQ25DQSxDQUFBLFdBQUE7SUFDQTs7Ozs7Ozs7Ozs7SUFXQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHFCQUFBOzs7O0lBSUEsU0FBQSxrQkFBQSxVQUFBLElBQUEsUUFBQSxTQUFBLGFBQUEsZUFBQTs7Ozs7O1FBTUEsSUFBQSxPQUFBO0VBQ0E7Ozs7O1FBS0EsU0FBQSxPQUFBO01BQ0EsT0FBQSxZQUFBLHFCQUFBLEtBQUE7TUFDQSxLQUFBLDZCQUFBLENBQUEsS0FBQSxjQUFBLFFBQUEsU0FBQSxLQUFBLGNBQUE7R0FDQSxLQUFBLFNBQUE7OztFQUdBLEtBQUEsUUFBQSxXQUFBO0dBQ0EsS0FBQSxrQkFBQSxJQUFBOztJQUVBLEtBQUE7O0lBRUEsS0FBQSxRQUFBLFdBQUE7R0FDQSxLQUFBLGtCQUFBOzs7O0lBSUEsS0FBQSxXQUFBLFNBQUEsTUFBQSxNQUFBO0dBQ0EsT0FBQSxTQUFBLFVBQUEsS0FBQSxhQUFBLEtBQUEsS0FBQSxhQUFBOzs7SUFHQSxLQUFBLFlBQUEsV0FBQTtHQUNBLEtBQUEsVUFBQSxLQUFBLFVBQUEsT0FBQSxJQUFBOzs7SUFHQSxLQUFBO0dBQ0EsS0FBQSxVQUFBLElBQUEsS0FBQSxNQUFBLEdBQUE7O0lBRUEsS0FBQSxRQUFBLFdBQUE7R0FDQSxLQUFBLE9BQUEsU0FBQTs7O0lBR0EsS0FBQSxVQUFBLFNBQUEsTUFBQSxPQUFBLEtBQUE7R0FDQSxLQUFBLGtCQUFBLElBQUEsS0FBQSxNQUFBLE9BQUE7OztJQUdBLEtBQUEsY0FBQTtHQUNBLFlBQUE7R0FDQSxhQUFBOzs7SUFHQSxLQUFBLFVBQUEsQ0FBQSxnQkFBQSxjQUFBLGNBQUE7SUFDQSxLQUFBLFNBQUEsS0FBQSxRQUFBO0lBQ0EsS0FBQSxrQkFBQSxDQUFBOztJQUVBLEtBQUEsU0FBQTtHQUNBLFFBQUE7OztJQUdBLEtBQUEsa0JBQUEsSUFBQTs7SUFFQSxLQUFBLFFBQUE7SUFDQSxLQUFBLFFBQUE7O0lBRUEsS0FBQSxVQUFBO0dBQ0EsT0FBQSxDQUFBLEdBQUEsR0FBQTtHQUNBLE9BQUEsQ0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLElBQUE7OztJQUdBLEtBQUEsYUFBQTtJQUNBLEtBQUEsYUFBQSxXQUFBO0dBQ0EsS0FBQSxhQUFBLEVBQUEsS0FBQTs7O0lBR0EsS0FBQSxzQkFBQSxDQUFBO0tBQ0EsTUFBQTtLQUNBLFNBQUE7S0FDQSxRQUFBOzs7SUFHQSxLQUFBLGVBQUEsU0FBQSxPQUFBOztHQUVBLElBQUEsSUFBQSxRQUFBLEtBQUEsb0JBQUE7SUFDQSxHQUFBLEtBQUEsb0JBQUEsTUFBQSxPQUFBLE1BQUE7S0FDQSxLQUFBLG9CQUFBLE9BQUEsTUFBQTtLQUNBOzs7OztJQUtBLEtBQUEsWUFBQSxTQUFBLE1BQUE7R0FDQSxLQUFBLG9CQUFBLEtBQUE7S0FDQSxNQUFBLEtBQUE7S0FDQSxTQUFBO0tBQ0EsUUFBQTs7OztHQUlBLEtBQUEsa0JBQUEsVUFBQTtJQUNBLElBQUEsUUFBQSxDQUFBLGtCQUFBLEtBQUE7S0FDQSxrQkFBQSxLQUFBO0tBQ0Esc0JBQUEsUUFBQSxPQUFBLEtBQUE7S0FDQSxTQUFBLEtBQUE7O0lBRUEsYUFBQSxnQkFBQTtNQUNBLE9BQUEsS0FBQSxTQUFBLFNBQUE7TUFDQSxLQUFBLHNCQUFBLENBQUE7UUFDQSxNQUFBO1FBQ0EsU0FBQTtRQUNBLFFBQUE7O01BRUEsVUFBQTs7OztHQUlBLEtBQUEsaUJBQUEsU0FBQSxLQUFBLEdBQUE7R0FDQSxLQUFBLFNBQUEsTUFBQTtHQUNBLGFBQUEsWUFBQTtLQUNBLEtBQUEsS0FBQTtP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O0lBR0EsTUFBQSxlQUFBLFNBQUEsUUFBQSxVQUFBO01BQ0EsT0FBQSxnQkFBQSxRQUFBLFFBQUE7Ozs7O0FDcENBLENBQUEsV0FBQTtFQUNBOzs7Ozs7Ozs7Ozs7RUFZQTtLQUNBLE9BQUE7S0FDQSxPQUFBOzs7RUFHQSxTQUFBLFdBQUEsZ0JBQUE7SUFDQTtPQUNBLE1BQUEsU0FBQTtRQUNBLFFBQUE7UUFDQSxJQUFBO1FBQ0EsT0FBQTtVQUNBLFdBQUE7WUFDQSxhQUFBOztVQUVBLG9CQUFBO1lBQ0EsY0FBQTtZQUNBLGFBQUE7OztRQUdBLFNBQUE7VUFDQSxXQUFBLENBQUE7WUFDQSxTQUFBLE1BQUE7Y0FDQSxPQUFBLEtBQUE7Ozs7Ozs7O0FDbkNBLENBQUEsV0FBQTtFQUNBOzs7Ozs7Ozs7OztFQVdBO0tBQ0EsT0FBQTtLQUNBLFFBQUEsaUJBQUE7OztFQUdBLFNBQUEsY0FBQSxXQUFBLFlBQUE7O0lBRUEsT0FBQSxVQUFBLFdBQUE7TUFDQSxRQUFBO01BQ0EsZUFBQTtPQUNBO01BQ0EsTUFBQTtRQUNBLFFBQUE7UUFDQSxRQUFBO1VBQ0EsSUFBQTs7O01BR0EsUUFBQTtRQUNBLFFBQUE7O01BRUEsUUFBQTtRQUNBLFFBQUE7UUFDQSxRQUFBO1VBQ0EsSUFBQTs7O01BR0EsY0FBQTtRQUNBLFFBQUE7UUFDQSxRQUFBO1VBQ0EsSUFBQTtVQUNBLFFBQUE7OztNQUdBLE9BQUE7UUFDQSxRQUFBO1FBQ0EsbUJBQUE7O01BRUEsVUFBQTtRQUNBLFFBQUE7UUFDQSxRQUFBO1VBQ0EsSUFBQTtVQUNBLFFBQUE7OztNQUdBLFdBQUE7UUFDQSxLQUFBO1FBQ0EsUUFBQTtRQUNBLFFBQUE7VUFDQSxTQUFBO1dBQ0EsU0FBQTtVQUNBLGdCQUFBOztRQUVBLGtCQUFBLFNBQUEsTUFBQTtVQUNBLElBQUEsV0FBQSxJQUFBOzs7O1VBSUEsU0FBQSxPQUFBLFFBQUE7O1VBRUEsT0FBQTs7O01BR0EsY0FBQTtRQUNBLE1BQUE7UUFDQSxRQUFBO1NBQ0EsbUJBQUE7Ozs7SUFJQSxTQUFBLHVCQUFBLE1BQUEsZUFBQTtNQUNBLElBQUEsWUFBQTtNQUNBLFVBQUEsT0FBQSxRQUFBLFNBQUE7TUFDQSxVQUFBLGFBQUEsU0FBQSxjQUFBO01BQ0EsT0FBQSxRQUFBLFNBQUE7Ozs7Ozs7QUNyRkEsQ0FBQSxXQUFBO0VBQ0E7Ozs7Ozs7Ozs7Ozs7RUFhQTtLQUNBLE9BQUE7S0FDQSxRQUFBLGNBQUE7OztFQUdBLFNBQUEsV0FBQSxlQUFBO0lBQ0EsSUFBQSxRQUFBOztJQUVBLE1BQUEsT0FBQTtNQUNBLFlBQUE7TUFDQSxTQUFBO01BQ0EsTUFBQTtNQUNBLE1BQUE7TUFDQSxTQUFBO01BQ0EsV0FBQTtNQUNBLGNBQUE7Ozs7Ozs7SUFPQSxNQUFBLFlBQUE7Ozs7Ozs7SUFPQSxNQUFBLE9BQUEsU0FBQSxJQUFBO01BQ0EsT0FBQSxjQUFBLEtBQUEsSUFBQTs7Ozs7Ozs7OztJQVVBLE1BQUEsVUFBQSxTQUFBLFFBQUEsU0FBQSxLQUFBO01BQ0EsT0FBQSxjQUFBLE1BQUEsUUFBQSxTQUFBLE1BQUE7Ozs7Ozs7O0lBUUEsTUFBQSxTQUFBLFNBQUEsT0FBQTtNQUNBLE9BQUEsY0FBQSxPQUFBLE9BQUE7Ozs7Ozs7O0lBUUEsTUFBQSxTQUFBLFNBQUEsUUFBQSxPQUFBO01BQ0EsT0FBQSxjQUFBLE9BQUEsUUFBQSxPQUFBOzs7Ozs7Ozs7SUFTQSxNQUFBLFlBQUEsU0FBQSxRQUFBLE1BQUE7TUFDQSxPQUFBLGNBQUEsVUFBQSxRQUFBLE1BQUE7Ozs7Ozs7O0lBUUEsTUFBQSxlQUFBLFNBQUEsUUFBQSxPQUFBO01BQ0EsT0FBQSxjQUFBLGFBQUEsUUFBQSxPQUFBOzs7Ozs7O0lBT0EsTUFBQSxTQUFBLFNBQUEsSUFBQTtNQUNBLE9BQUEsY0FBQSxPQUFBLElBQUE7Ozs7Ozs7Ozs7SUFVQSxNQUFBLGNBQUEsU0FBQSxPQUFBO01BQ0EsUUFBQSxRQUFBLE1BQUEsV0FBQSxTQUFBLE1BQUEsTUFBQTtRQUNBLEdBQUEsU0FBQSxLQUFBLFFBQUEsT0FBQTtVQUNBLE1BQUEsVUFBQSxPQUFBLE9BQUE7Ozs7Ozs7Ozs7OztJQVlBLE1BQUEsV0FBQSxTQUFBLFFBQUEsU0FBQSxNQUFBO01BQ0EsT0FBQSxjQUFBLFNBQUEsUUFBQSxTQUFBLE1BQUE7Ozs7Ozs7Ozs7SUFVQSxNQUFBLGNBQUEsU0FBQSxRQUFBLFNBQUEsTUFBQTtNQUNBLE9BQUEsY0FBQSxZQUFBLFFBQUEsU0FBQSxNQUFBOzs7Ozs7QUN6SUEsQ0FBQSxXQUFBO0VBQ0E7Ozs7Ozs7Ozs7OztFQVlBO0tBQ0EsT0FBQTtLQUNBLFFBQUEsZ0JBQUE7OztFQUdBLFNBQUEsYUFBQSxRQUFBLGlCQUFBLFlBQUEsSUFBQSxTQUFBO0lBQ0EsSUFBQSxVQUFBOzs7Ozs7SUFNQSxRQUFBLGVBQUEsU0FBQSxlQUFBO01BQ0EsT0FBQSxNQUFBO1FBQ0EsT0FBQSxXQUFBLGNBQUEsT0FBQSxjQUFBLEtBQUEsT0FBQSxjQUFBO1FBQ0EsU0FBQSxjQUFBLE9BQUEsY0FBQSxLQUFBLFVBQUEsY0FBQTs7Ozs7Ozs7Ozs7Ozs7SUFjQSxRQUFBLFdBQUEsU0FBQSxTQUFBO01BQ0EsSUFBQSxXQUFBLEdBQUE7UUFDQSxVQUFBLFFBQUEsZ0JBQUEsTUFBQTs7TUFFQSxXQUFBLFFBQUE7UUFDQSxRQUFBLFFBQUE7UUFDQSxZQUFBLFFBQUE7UUFDQSxjQUFBLFVBQUEsUUFBQTtTQUNBLEtBQUEsU0FBQSxpQkFBQTtRQUNBLFdBQUEsY0FBQSxnQkFBQTtRQUNBLGNBQUEsZ0JBQUE7UUFDQSxTQUFBLFFBQUE7U0FDQSxNQUFBLFNBQUEsT0FBQTtRQUNBLGdCQUFBLE1BQUE7UUFDQSxTQUFBLFFBQUE7Ozs7Ozs7OztNQVNBLFNBQUEsY0FBQSxjQUFBO1FBQ0EsUUFBQTtRQUNBLFdBQUEsVUFBQSxTQUFBO1FBQ0EsSUFBQSxhQUFBLFdBQUEsR0FBQTtVQUNBOztRQUVBLE1BQUEsVUFBQSxLQUFBLE1BQUEsV0FBQSxXQUFBOzs7TUFHQSxPQUFBLFNBQUE7OztJQUdBLE9BQUE7Ozs7O0FDN0VBLENBQUEsV0FBQTtFQUNBOzs7Ozs7Ozs7OztFQVdBO0tBQ0EsT0FBQTtLQUNBLE9BQUE7OztFQUdBLFNBQUEsaUJBQUEs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UUFDQSxRQUFBO1FBQ0EsS0FBQTtRQUNBLE1BQUE7VUFDQSxPQUFBO1VBQ0EsV0FBQTs7UUFFQSxPQUFBO1VBQ0EsU0FBQTtZQUNBLGFBQUE7WUFDQSxXQUFBOzs7UUFHQSxTQUFBO1VBQ0EsNEJBQUEsQ0FBQSxjQUFBO1lBQ0EsU0FBQSxZQUFBLHlCQUFBO2NBQ0Esd0JBQUEsUUFBQTtjQUNBLE9BQUEsV0FBQTs7Ozs7T0FLQSxNQUFBLGdCQUFBO1FBQ0EsUUFBQTtRQUNBLEtBQUE7UUFDQSxNQUFBO1VBQ0EsT0FBQTs7UUFFQSxPQUFBO1VBQ0EsU0FBQTtZQUNBLGFBQUE7WUFDQSxXQUFBOzs7UUFHQSxTQUFBO1VBQ0EsNEJBQUEsQ0FBQSxjQUFBO1lBQ0EsU0FBQSxZQUFBLHlCQUFBO2NBQ0Esd0JBQUEsUUFBQTtjQUNBLE9BQUEsV0FBQTs7Ozs7O0FDdERBLENBQUEsV0FBQTtFQUNBOzs7Ozs7Ozs7OztFQVdBO0tBQ0EsT0FBQTtLQUNBLFdBQUEsbUJBQUE7O0VBRUEsU0FBQSxnQkFBQSxPQUFBLFNBQUEsUUFBQTtJQUNBLFFBQUE7Ozs7O0FDakJBLENBQUEsV0FBQTtJQUNBOzs7Ozs7Ozs7OztJQVdBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsc0JBQUE7OztJQUdBLFNBQUEsbUJBQUEsV0FBQSxZQUFBOztRQUVBLE9BQUEsVUFBQSxvQkFBQTtZQUNBLE1BQUE7V0FDQTtZQUNBLE1BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxRQUFBO29CQUNBLElBQUE7OztZQUdBLFFBQUE7Z0JBQ0EsUUFBQTtnQkFDQSxLQUFBO2dCQUNBLFFBQUE7O1lBRUEsUUFBQTtnQkFDQSxRQUFBO2dCQUNBLFFBQUE7b0JBQ0EsSUFBQTs7O1lBR0EsZUFBQTtnQkFDQSxRQUFBO2dCQUNBLFNBQUE7O1lBRUEsT0FBQTtnQkFDQSxRQUFBO2dCQUNBLG1CQUFBOztZQUVBLGtCQUFBO2dCQUNBLElBQUE7SUFDQSxRQUFBO2dCQUNBLG1CQUFBOzs7Ozs7SUFLQSxTQUFBLHVCQUFBLE1BQUEsZUFBQTtRQUNBLElBQUEsWUFBQTtRQUNBLFVBQUEsT0FBQSxRQUFBLFNBQUE7UUFDQSxPQUFBLFFBQUEsU0FBQTs7Ozs7QUMxREEsQ0FBQSxXQUFBO0VBQ0E7Ozs7Ozs7Ozs7Ozs7RUFhQTtLQUNBLE9BQUE7S0FDQSxRQUFBLG1CQUFBOzs7RUFHQSxTQUFBLGdCQUFBLG9CQUFBO0lBQ0EsSUFBQSxRQUFBOzs7Ozs7SUFNQSxNQUFBLGFBQUE7SUFDQSxNQUFBLGdCQUFBOztJQUVBLE1BQUEsZ0JBQUE7Ozs7Ozs7SUFPQSxNQUFBLE1BQUEsU0FBQSxJQUFBO01BQ0EsT0FBQSxtQkFBQSxLQUFBLElBQUE7Ozs7Ozs7Ozs7SUFVQSxNQUFBLE1BQUEsU0FBQSxRQUFBLFNBQUEsS0FBQTtNQUNBLE9BQUEsbUJBQUEsTUFBQSxRQUFBLFNBQUEsTUFBQTs7Ozs7Ozs7OztJQVVBLE1BQUEsbUJBQUEsU0FBQSxRQUFBLFNBQUEsS0FBQTtNQUNBLE9BQUEsbUJBQUEsaUJBQUEsUUFBQSxTQUFBLE1BQUE7Ozs7OztBQzNEQSxDQUFBLFdBQUE7SUFDQTs7Ozs7Ozs7Ozs7OztJQWFBO1NBQ0EsT0FBQSw4QkFBQSxDQUFBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1lBQ0E7WUFDQTtZQUNBOzs7O0FDeEJBLENBQUEsV0FBQTtJQUNBOzs7Ozs7Ozs7Ozs7SUFZQTtTQUNBLE9BQUE7U0FDQSxPQUFBOzs7SUFHQSxTQUFBLGVBQUEsZ0JBQUEsWUFBQSxvQkFBQTtRQUNBLG1CQUFBLFVBQUE7O1FBRUEsZUFBQSxNQUFBLGFBQUE7WUFDQSxVQUFBO1lBQ0EsT0FBQTtnQkFDQSxJQUFBO29CQUNBLGFBQUEsV0FBQSxVQUFBO29CQUNBLFlBQUE7O2dCQUVBLG1CQUFBO3FCQUNBLGFBQUEsV0FBQSxVQUFBO3FCQUNBLFlBQUE7Ozs7Ozs7OztBQzlCQSxDQUFBLFdBQUE7SUFDQTs7Ozs7Ozs7Ozs7SUFXQTtPQUNBLE9BQUE7T0FDQSxRQUFBLG1CQUFBOzs7SUFHQSxTQUFBLGdCQUFBLFdBQUEsWUFBQTs7TUFFQSxPQUFBLFVBQUEsa0JBQUE7VUFDQSxhQUFBOztRQUVBO1FBQ0EsTUFBQTtVQUNBLFFBQUE7VUFDQSxRQUFBO1lBQ0EsSUFBQTs7O1FBR0EsTUFBQTtVQUNBLFFBQUE7VUFDQSxRQUFBO1lBQ0EsYUFBQTtZQUNBLElBQUE7OztRQUdBLFFBQUE7VUFDQSxRQUFBO1VBQ0EsUUFBQTtZQUNBLElBQUE7Ozs7Ozs7O0FDdkNBLENBQUEsV0FBQTtJQUNBOzs7Ozs7Ozs7Ozs7O0lBYUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxrQkFBQTs7O0lBR0EsU0FBQSxlQUFBLG1CQUFBO1FBQ0EsSUFBQSxRQUFBOzs7OztRQUtBLE1BQUEsZ0JBQUE7Ozs7OztRQU1BLE1BQUEsc0JBQUE7Ozs7Ozs7O1FBUUEsTUFBQSxPQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsa0JBQUEsS0FBQSxJQUFBOzs7Ozs7Ozs7UUFTQSxNQUFBLG9CQUFBLFNBQUEsUUFBQSxTQUFBLE1BQUE7WUFDQSxPQUFBLGtCQUFBLGtCQUFBLFFBQUEsU0FBQTs7Ozs7Ozs7UUFRQSxNQUFBLE9BQUEsU0FBQSxXQUFBO1lBQ0EsT0FBQSxrQkFBQSxLQUFBLFdBQUE7Ozs7Ozs7O1FBUUEsTUFBQSxTQUFBLFNBQUEsV0FBQTtZQUNBLE9BQUEsa0JBQUEsT0FBQSxXQUFBOzs7Ozs7O1FBT0EsTUFBQSxTQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsa0JBQUEsT0FBQSxJQUFBOzs7Ozs7QUM1RUEsQ0FBQSxXQUFBO0lBQ0E7Ozs7Ozs7Ozs7Ozs7SUFhQSxTQUFBLG9CQUFBLFFBQUEsUUFBQSxTQUFBO1FBQ0EsSUFBQSxPQUFBLEtBQUEsUUFBQTtRQUNBOzs7Ozs7Ozs7UUFTQSxTQUFBLE9BQUE7WUFDQSxRQUFBLFFBQUEsU0FBQSxRQUFBO1lBQ0EsUUFBQSxFQUFBLElBQUEsT0FBQSxTQUFBLEtBQUE7Z0JBQ0EsT0FBQSxDQUFBLEtBQUEsTUFBQTs7OztRQUlBLEtBQUEsVUFBQSxTQUFBLFVBQUE7WUFDQSxPQUFBLE1BQUEsUUFBQSxhQUFBOzs7Ozs7Ozs7SUFRQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHVCQUFBOzs7QUMzQ0EsQ0FBQSxXQUFBO0VBQ0E7O0VBRUE7S0FDQSxPQUFBLHlCQUFBOzs7Ozs7O01BT0E7Ozs7Ozs7TUFPQTs7Ozs7OztNQU9BOzs7Ozs7O01BT0E7Ozs7Ozs7O01BUUE7Ozs7Ozs7TUFPQTs7Ozs7OztNQU9BOzs7Ozs7O01BT0E7Ozs7Ozs7TUFPQTs7Ozs7OztNQU9BOzs7Ozs7OztNQVFBO01BQ0E7TUFDQTtNQUNBO01BQ0E7R0FDQTtHQUNBO0dBQ0E7UUFDQTs7O0FDM0ZBLENBQUEsV0FBQTtJQUNBOzs7Ozs7Ozs7OztJQVdBO1NBQ0EsT0FBQTtTQUNBLE9BQUE7OztJQUdBLFNBQUEsZ0JBQUEsZ0JBQUEsb0JBQUEsWUFBQSxtQkFBQTs7Ozs7O0FDakJBLENBQUEsV0FBQTtFQUNBOzs7Ozs7Ozs7OztFQVdBO0tBQ0EsT0FBQTtLQUNBLFVBQUEsZ0JBQUE7OztFQUdBLFNBQUEsbUJBQUEsWUFBQSxVQUFBO0lBQ0EsT0FBQTtNQUNBLE1BQUEsU0FBQSxPQUFBLFNBQUEsT0FBQTs7UUFFQSxXQUFBLGlCQUFBOzs7UUFHQSxXQUFBLElBQUEscUJBQUEsU0FBQSxPQUFBLFNBQUEsVUFBQSxXQUFBLFlBQUE7VUFDQSxXQUFBLGlCQUFBOzs7O1FBSUEsV0FBQSxJQUFBLHVCQUFBLFdBQUE7VUFDQSxXQUFBLGlCQUFBO1VBQ0EsUUFBQSxRQUFBLFFBQUEsWUFBQTs7OztRQUlBLFdBQUEsSUFBQSxrQkFBQSxTQUFBLE9BQUE7O1VBRUEsV0FBQSxpQkFBQTtVQUNBLFFBQUEsSUFBQTs7OztRQUlBLFdBQUEsSUFBQSxxQkFBQSxXQUFBOztVQUVBLFdBQUEsaUJBQUE7O1FBRUEsV0FBQSxJQUFBLHNCQUFBLFdBQUE7O1VBRUEsV0FBQSxpQkFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBaUJBO0tBQ0EsT0FBQTtLQUNBLFFBQUEsV0FBQTs7RUFFQSxTQUFBLGVBQUEsWUFBQTs7OztJQUlBLFNBQUEsVUFBQTs7Ozs7SUFLQSxRQUFBLFVBQUEsT0FBQSxXQUFBO01BQ0EsV0FBQSxpQkFBQTs7Ozs7O0lBTUEsUUFBQSxVQUFBLE9B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R0EsUUFBQTtVQUNBLFFBQUE7O1FBRUEsZ0JBQUE7VUFDQSxJQUFBO1VBQ0EsUUFBQTs7UUFFQSxzQkFBQTtVQUNBLElBQUE7VUFDQSxRQUFBOztRQUVBLGVBQUE7VUFDQSxJQUFBO1VBQ0EsUUFBQTtVQUNBLFFBQUE7Ozs7OztJQUtBLFNBQUEscUJBQUEsTUFBQSxlQUFBO1FBQ0EsSUFBQSxZQUFBO1FBQ0EsVUFBQSxPQUFBLFFBQUEsU0FBQTtRQUNBLE9BQUEsUUFBQSxTQUFBOzs7O0FDbkVBLENBQUEsV0FBQTtJQUNBOzs7Ozs7Ozs7Ozs7O0lBYUE7U0FDQSxPQUFBO1NBQ0EsUUFBQSxnQkFBQTs7O0lBR0EsU0FBQSxhQUFBLGlCQUFBO1FBQ0EsSUFBQSxRQUFBOzs7OztRQUtBLE1BQUEsZ0JBQUE7Ozs7OztRQU1BLE1BQUEsc0JBQUE7Ozs7Ozs7O1FBUUEsTUFBQSxPQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsZ0JBQUEsS0FBQSxJQUFBOzs7Ozs7OztRQVFBLE1BQUEsVUFBQSxTQUFBLElBQUE7WUFDQSxPQUFBLGdCQUFBLFFBQUEsSUFBQTs7Ozs7Ozs7O1FBU0EsTUFBQSxvQkFBQSxTQUFBLFFBQUEsU0FBQSxNQUFBO1lBQ0EsT0FBQSxnQkFBQSxrQkFBQSxRQUFBLFNBQUE7Ozs7Ozs7O1FBUUEsTUFBQSxPQUFBLFNBQUEsV0FBQTtZQUNBLE9BQUEsZ0JBQUEsS0FBQSxXQUFBOzs7Ozs7OztRQVFBLE1BQUEsU0FBQSxTQUFBLFFBQUEsTUFBQTtZQUNBLE9BQUEsZ0JBQUEsT0FBQSxPQUFBLE1BQUE7Ozs7Ozs7O1FBUUEsTUFBQSxpQkFBQSxTQUFBLFFBQUEsTUFBQTtZQUNBLE9BQUEsZ0JBQUEsZUFBQSxPQUFBLE1BQUE7Ozs7Ozs7O1FBUUEsTUFBQSx1QkFBQSxTQUFBLFFBQUEsTUFBQTtZQUNBLE9BQUEsZ0JBQUEscUJBQUEsT0FBQSxNQUFBOzs7Ozs7O1FBT0EsTUFBQSxTQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsZ0JBQUEsT0FBQSxJQUFBOzs7Ozs7OztRQVFBLE1BQUEsZ0JBQUEsU0FBQSxRQUFBLFNBQUEsTUFBQTtZQUNBLE9BQUEsZ0JBQUEsY0FBQSxRQUFBLFNBQUEsTUFBQTs7Ozs7Ozs7QUNoSEEsQ0FBQSxXQUFBO0lBQ0E7Ozs7Ozs7Ozs7OztJQVlBO1NBQ0EsT0FBQTtTQUNBLFFBQUEsa0JBQUE7OztJQUdBLFNBQUEsaUJBQUE7UUFDQSxJQUFBLFVBQUE7O1FBRUEsUUFBQSwwQkFBQSxXQUFBO1lBQ0EsT0FBQTtnQkFDQSxRQUFBO29CQUNBLE1BQUEsT0FBQSxNQUFBO29CQUNBLE9BQUEsU0FBQSxJQUFBLEdBQUEsU0FBQSxNQUFBOztnQkFFQSxTQUFBO29CQUNBLE1BQUEsT0FBQSxNQUFBO29CQUNBLE9BQUEsU0FBQSxJQUFBLEdBQUEsU0FBQSxNQUFBOztnQkFFQSxXQUFBO29CQUNBLE1BQUEsT0FBQSxNQUFBO29CQUNBLE9BQUEsU0FBQSxJQUFBLEdBQUEsU0FBQSxNQUFBOztnQkFFQSxVQUFBO29CQUNBLE1BQUEsT0FBQSxNQUFBO29CQUNBLE9BQUEsU0FBQSxJQUFBLEdBQUEsU0FBQSxNQUFBOztnQkFFQSxRQUFBO29CQUNBLE1BQUEsT0FBQSxNQUFBO29CQUNBLE9BQUEsU0FBQSxJQUFBLEdBQUEsU0FBQSxNQUFBOztnQkFFQSxVQUFBO29CQUNBLE1BQUEsT0FBQSxNQUFBO29CQUNBLE9BQUEsU0FBQSxJQUFBLEdBQUEsU0FBQSxNQUFBOztnQkFFQSxRQUFBO29CQUNBLE1BQUEsT0FBQSxNQUFBO29CQUNBLE9BQUEsU0FBQSxJQUFBLEdBQUEsU0FBQSxNQUFBOzs7OztRQUtBLFFBQUEseUJBQUEsV0FBQTtZQUNBLE9BQUEsQ0FBQTtnQkFDQSxLQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsU0FBQTtlQUNBO2dCQUNBLEtBQUE7Z0JBQ0EsUUFBQTtnQkFDQSxTQUFBO2VBQ0E7Z0JBQ0EsS0FBQTtnQkFDQSxRQUFBO2dCQUNBLFNBQUE7ZUFDQTtnQkFDQSxLQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsU0FBQTtlQUNBO2dCQUNBLEtBQUE7Z0JBQ0EsUUFBQTtnQkFDQSxTQUFBO2VBQ0E7Z0JBQ0EsS0FBQTtnQkFDQSxRQUFBO2dCQUNBLFNBQUE7ZUFDQTtnQkFDQSxLQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsU0FBQTs7OztRQUlBLE9BQUE7Ozs7QUN0RkEsQ0FBQSxXQUFBO0lBQ0E7Ozs7Ozs7Ozs7Ozs7SUFhQSxTQUFBLGtCQUFBLE9BQUEsWUFBQSxhQUFBLFNBQUE7UUFDQSxJQUFBLE9BQUE7UUFDQTs7Ozs7Ozs7O1FBU0EsU0FBQSxPQUFBO1lBQ0EsS0FBQSxXQUFBLFlBQUEsS0FBQSxNQUFBLEdBQUE7WUFDQSxLQUFBLGVBQUEsQ0FBQSxZQUFBLEtBQUEsYUFBQSxZQUFBLEtBQUEsVUFBQSxlQUFBLFNBQUEsT0FBQTtZQUNBLEtBQUEsYUFBQSxDQUFBLFlBQUEsS0FBQSxhQUFBLFlBQUEsS0FBQSxVQUFBLGFBQUEsU0FBQSxPQUFBO1lBQ0EsS0FBQSxpQkFBQSxDQUFBLFlBQUEsS0FBQSxjQUFBLFlBQUEsS0FBQSxXQUFBLE9BQUEsWUFBQSxLQUFBLFdBQUEsT0FBQTs7Ozs7Ozs7OztRQVVBLEtBQUEsY0FBQSxTQUFBLEtBQUE7WUFDQSxLQUFBLGFBQUE7WUFDQSxhQUFBO2dCQUNBLENBQUEsS0FBQSxZQUFBLEtBQUE7Z0JBQ0EsQ0FBQSxPQUFBLFlBQUEsS0FBQSxLQUFBLGFBQUEsS0FBQSxXQUFBLGVBQUEsS0FBQTtpQkFDQSxLQUFBLFNBQUEsaUJBQUE7b0JBQ0EsUUFBQSxJQUFBLFdBQUEsZUFBQTttQkFDQSxTQUFBLGVBQUE7b0JBQ0EsUUFBQSxJQUFBLG1CQUFBOzs7Ozs7Ozs7OztRQVdBLEtBQUEsYUFBQSxTQUFBLEtBQUE7V0FDQSxLQUFBLGVBQUE7V0FDQSxhQUFBO2dCQUNBLENBQUEsS0FBQSxZQUFBLEtBQUE7Z0JBQ0EsQ0FBQSxPQUFBLFlBQUEsS0FBQSxLQUFBLGFBQUEsS0FBQSxXQUFBLGVBQUEsS0FBQTtpQkFDQSxLQUFBLFNBQUEsaUJBQUE7b0JBQ0EsUUFBQSxJQUFBLFdBQUEsZUFBQTttQkFDQSxTQUFBLGVBQUE7Ozs7Ozs7Ozs7OztRQVlBLEtBQUEsYUFBQSxXQUFBO1lBQ0EsT0FBQTtnQkFDQSxRQUFBO2dCQUNBLGlCQUFBLENBQUEsS0FBQSxLQUFBO2dCQUNBLGlCQUFBO2dCQUNBLG9CQUFBO2dCQUNBLHFCQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsU0FBQTtvQkFDQSxnQkFBQTs7Z0JBRUEsT0FBQSxTQUFBLFVBQUEsV0FBQTs7b0JBRUEsT0FBQTt3QkFDQSxJQUFBLFlBQUEsS0FBQTt3QkFDQSxRQUFBOzs7Ozs7Ozs7Ozs7UUFZQSxLQUFBLG9CQUFBLFNBQUEsT0FBQSxNQUFBO1lBQ0EsSUFBQSxNQUFBLEtBQUEsTUFBQTtZQUNBLEtBQUEsaUJBQUEsSUFBQSxLQUFBLElBQUE7Ozs7Ozs7SUFNQTtTQUNBLE9BQUE7U0FDQSxXQUFBLHFCQUFBOzs7QUNsSEEsQ0FBQSxXQUFBO0lBQ0E7Ozs7Ozs7Ozs7O0dBV0EsUUFBQSxPQUFBLHlCQUFBLFNBQUEsZ0JBQUEsV0FBQTtZQUNBLEtBQUEsUUFBQTs7WUFFQSxLQUFBLE9BQUEsQ0FBQSxZQUFBLFFBQUEsY0FBQSxTQUFBLFVBQUEsTUFBQSxZQUFBOztnQkFFQSxJQUFBLFVBQUE7d0JBQ0EsU0FBQTt3QkFDQSxTQUFBO3dCQUNBLEtBQUE7d0JBQ0EsWUFBQTt3QkFDQSxtQkFBQTt3QkFDQSxPQUFBO3dCQUNBLEtBQUE7d0JBQ0EsU0FBQTt3QkFDQSxPQUFBO3dCQUNBLE1BQUE7d0JBQ0EsU0FBQTs7O29CQUdBLFFBQUEsS0FBQTtvQkFDQSxVQUFBO29CQUNBLFNBQUE7b0JBQ0EsVUFBQTs7Z0JBRUEsU0FBQSxVQUFBO29CQUNBLE9BQUE7OztnQkFHQSxTQUFBLFFBQUE7b0JBQ0EsU0FBQTs7O2dCQUdBLFNBQUEsTUFBQTtvQkFDQSxPQUFBOzs7Z0JBR0EsU0FBQSxRQUFBLEtBQUEsUUFBQSxVQUFBO29CQUNBLE9BQUEsS0FBQSxJQUFBO3dCQUNBLE1BQUE7d0JBQ0EsS0FBQTt3QkFDQSxRQUFBO3dCQUNBLFNBQUE7d0JBQ0EsT0FBQTt3QkFDQSxVQUFBOzs7O2dCQUlBLFNBQUEsTUFBQSxLQUFBLFFBQUEsVUFBQTtv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QkFDQSxRQUFBO29CQUNBO2dCQUNBLEtBQUE7b0JBQ0EsWUFBQTtvQkFDQSxRQUFBO29CQUNBO2dCQUNBLEtBQUE7b0JBQ0EsWUFBQTtvQkFDQSxRQUFBO29CQUNBO2dCQUNBLEtBQUE7b0JBQ0EsWUFBQTtvQkFDQSxRQUFBO29CQUNBOzs7WUFHQSxPQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsT0FBQTs7Ozs7Ozs7Ozs7UUFXQSxLQUFBLDJCQUFBLFNBQUEsV0FBQTtZQUNBLElBQUEsb0JBQUE7WUFDQSxRQUFBO2dCQUNBLEtBQUE7b0JBQ0Esb0JBQUE7b0JBQ0E7Z0JBQ0EsS0FBQTtvQkFDQSxvQkFBQTtvQkFDQTs7WUFFQSxPQUFBOzs7Ozs7Ozs7UUFTQSxLQUFBLGNBQUEsU0FBQSxVQUFBO1lBQ0EsSUFBQSxjQUFBLENBQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxRQUFBO2dCQUNBLGNBQUEsQ0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxNQUFBLE9BQUEsT0FBQTtnQkFDQTtZQUNBLElBQUEsQ0FBQSxVQUFBO2dCQUNBLFdBQUE7OztZQUdBLElBQUEsWUFBQSxTQUFBOztZQUVBLElBQUEsWUFBQSxRQUFBLGNBQUEsR0FBQTtnQkFDQSxPQUFBO29CQUNBLFFBQUE7b0JBQ0EsUUFBQTs7bUJBRUEsSUFBQSxZQUFBLFFBQUEsY0FBQSxHQUFBO2dCQUNBLE9BQUE7b0JBQ0EsUUFBQTtvQkFDQSxRQUFBOzttQkFFQTtnQkFDQSxPQUFBO29CQUNBLFFBQUE7b0JBQ0EsUUFBQTs7Ozs7Ozs7OztRQVVBLEtBQUEsVUFBQSxTQUFBLE1BQUE7WUFDQSxLQUFBLE1BQUEsU0FBQTtZQUNBLEtBQUEsUUFBQSxTQUFBO1lBQ0EsS0FBQSxRQUFBLFNBQUE7WUFDQSxLQUFBLGFBQUEsU0FBQTtZQUNBLE9BQUE7OztRQUdBLEtBQUEsb0JBQUEsV0FBQTtZQUNBLE9BQUEsT0FBQSxNQUFBLE9BQUE7OztRQUdBLEtBQUEsYUFBQSxTQUFBLE1BQUE7WUFDQSxJQUFBLGVBQUEsU0FBQSxPQUFBLFFBQUE7WUFDQSxJQUFBLGFBQUEsU0FBQSxPQUFBLFFBQUEsS0FBQTtZQUNBLE9BQUEsZ0JBQUEsQ0FBQSxJQUFBLEtBQUEsbUJBQUEsU0FBQSxPQUFBLFVBQUEsZUFBQSxLQUFBLFNBQUEsSUFBQSxhQUFBLGVBQUEsYUFBQSxTQUFBLE9BQUE7OztRQUdBLE9BQUE7Ozs7QUNuSkE7O0FBRUEsUUFBQSxPQUFBO0dBQ0EsUUFBQSxjQUFBLFdBQUE7SUFDQSxLQUFBLFFBQUEsU0FBQSxRQUFBO01BQ0EsSUFBQSxNQUFBLE9BQUEsUUFBQTtRQUNBLE1BQUEsSUFBQSxNQUFBOzs7O01BSUEsSUFBQSxRQUFBLE9BQUEsTUFBQTtNQUNBLElBQUEsUUFBQTs7TUFFQSxRQUFBLFFBQUEsT0FBQSxTQUFBLEdBQUE7UUFDQSxJQUFBLFVBQUEsRUFBQSxNQUFBO1FBQ0EsSUFBQSxNQUFBLFFBQUEsUUFBQTtVQUNBLE1BQUEsSUFBQSxNQUFBOztRQUVBLElBQUEsTUFBQSxRQUFBLEdBQUEsUUFBQSxVQUFBLE1BQUE7UUFDQSxJQUFBLGNBQUE7UUFDQSxJQUFBO1VBQ0EsSUFBQSxPQUFBLHdCQUFBO1VBQ0EsU0FBQSxJQUFBLElBQUEsSUFBQSxJQUFBO1lBQ0EsWUFBQSxNQUFBOzs7UUFHQSxJQUFBLE9BQUEsWUFBQTtRQUNBLElBQUEsUUFBQSxTQUFBLE9BQUE7VUFDQSxPQUFBLFNBQUE7O1FBRUEsSUFBQSxPQUFBLFFBQUEsR0FBQSxRQUFBLGNBQUEsTUFBQTtRQUNBLE1BQUEsUUFBQTs7O01BR0EsT0FBQTs7OztBQ2pDQTs7QUFFQSxRQUFBLE9BQUE7S0FDQSxRQUFBLFVBQUEsWUFBQTtRQUNBLElBQUEsU0FBQTtZQUNBO1lBQ0E7WUFDQTtZQUNBO1FBQ0EsS0FBQSxTQUFBLFVBQUEsT0FBQTtZQUNBLElBQUEsU0FBQTtnQkFDQSxNQUFBLE1BQUEsT0FBQTtnQkFDQSxNQUFBLE1BQUEsTUFBQSxPQUFBO2dCQUNBLElBQUE7O1lBRUEsT0FBQSxJQUFBLE1BQUEsUUFBQTtnQkFDQSxPQUFBLE1BQUEsV0FBQTtnQkFDQSxPQUFBLE1BQUEsV0FBQTtnQkFDQSxPQUFBLE1BQUEsV0FBQTs7Z0JBRUEsT0FBQSxRQUFBO2dCQUNBLE9BQUEsQ0FBQSxDQUFBLE9BQUEsTUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQSxDQUFBLENBQUEsT0FBQSxPQUFBLE1BQUEsUUFBQTtnQkFDQSxPQUFBLE9BQUE7O2dCQUVBLElBQUEsTUFBQSxPQUFBO29CQUNBLE9BQUEsT0FBQTt1QkFDQSxJQUFBLE1BQUEsT0FBQTtvQkFDQSxPQUFBOzs7Z0JBR0EsU0FBQTtvQkFDQSxPQUFBLE9BQUE7b0JBQ0EsT0FBQSxPQUFBO29CQUNBLE9BQUEsT0FBQTtvQkFDQSxPQUFBLE9BQUE7Z0JBQ0EsT0FBQSxPQUFBLE9BQUE7Z0JBQ0EsT0FBQSxPQUFBLE9BQUEsT0FBQTs7O1lBR0EsT0FBQTs7O1FBR0EsS0FBQSxTQUFBLFVBQUEsT0FBQTtZQUNBLElBQUEsU0FBQTtnQkFDQSxNQUFBLE1BQUEsT0FBQTtnQkFDQSxNQUFBLE1BQUEsTUFBQSxPQUFBO2dCQUNBLElBQUE7OztZQUdBLFFBQUEsTUFBQSxRQUFBLHVCQUFBOztZQUVBLE9BQUEsSUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQSxPQUFBLFFBQUEsTUFBQSxPQUFBO2dCQUNBLE9BQUEsT0FBQSxRQUFBLE1BQUEsT0FBQTtnQkFDQSxPQUFBLE9BQUEsUUFBQSxNQUFBLE9BQUE7Z0JBQ0EsT0FBQSxPQUFBLFFBQUEsTUFBQSxPQUFBOztnQkFFQSxPQUFBLENBQUEsUUFBQSxNQUFBLFFBQUE7Z0JBQ0EsT0FBQSxDQUFBLENBQUEsT0FBQSxPQUFBLE1BQUEsUUFBQTtnQkFDQSxPQUFBLENBQUEsQ0FBQSxPQUFBLE1BQUEsS0FBQTs7Z0JBRUEsU0FBQSxTQUFBLE9BQUEsYUFBQTs7Z0JBRUEsSUFBQSxTQUFBLElBQUE7b0JBQ0EsU0FBQSxTQUFBLE9BQUEsYUFBQTs7Z0JBRUEsSUFBQSxTQUFBLElBQUE7b0JBQ0EsU0FBQSxTQUFBLE9BQUEsYUFBQTs7O2dCQUdBLE9BQUEsT0FBQSxPQUFBO2dCQUNBLE9BQUEsT0FBQSxPQUFBLE9BQUE7Ozs7S0FJQSxRQUFBLDhCQUFBLFVBQUEsU0FBQTtRQUNBLE9BQUE7O1lBRUEsS0FBQSxVQUFBLEtBQUE7Z0JBQ0EsT0FBQSxLQUFBLE1BQUEsUUFBQSxhQUFBLFFBQUE7OztZQUdBLE1BQUEsVUFBQSxLQUFBLE1BQUE7Z0JBQ0EsUUFBQSxhQUFBLFFBQUEsS0FBQSxLQUFBLFVBQUE7OztZQUdBLFFBQUEsVUFBQSxLQUFBO2dCQUNBLFFBQUEsYUFBQSxXQUFBOzs7WUFHQSxXQUFBLFlBQUE7Z0JBQ0EsUUFBQSxhQUFBOzs7O0FDN0ZBLENBQUEsV0FBQTtFQUNBOzs7Ozs7Ozs7Ozs7O0VBYUE7S0FDQSxPQUFBLG9CQUFBOzs7Ozs7Ozs7Ozs7Ozs7RUFlQTtLQUNBLE9BQUE7S0FDQSxRQUFBLGNBQUE7OztFQUdBLFNBQUEsb0JBQUE7O0lBRUEsSUFBQSxhQUFBO01BQ0EsU0FBQTs7UUFFQSxTQUFBOztRQUVBLFdBQUE7OztRQUdBLE9BQUE7O1FBRUEsVUFBQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7O1FBR0EsUUFBQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7O1FBR0EsT0FBQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7OztRQUlBLFFBQUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7OztRQUlBLFlBQUE7OztRQUdBLGlCQUFBOztRQUVBLGlCQUFBOztRQUVBLGdCQUFBOzs7UUFHQSxRQUFBOztRQUVBLGNBQUE7O1FBRUEsaUJBQUE7UUFDQSxVQUFBOzs7TUFHQSxpQkFBQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7Ozs7Ozs7Ozs7TUFVQSxZQUFBLFNBQUEsU0FBQSxTQUFBO1FBQ0EsS0FBQSxXQUFBO1FBQ0EsS0FBQSxVQUFBO1FBQ0EsS0FBQSxRQUFBLFVBQUEsS0FBQTtRQUNBLEtBQUE7O01BRUEsWUFBQSxTQUFBLFNBQUE7UUFDQSxRQUFBLE9BQUEsS0FBQSxTQUFBOzs7Ozs7TUFNQSxjQUFBLFdBQUE7O1FBRUEsS0FBQSxRQUFBLEdBQUEsU0FBQSxTQUFBLE9BQUE7VUFDQSxLQUFBO1VBQ0EsS0FBQTs7UUFFQSxPQUFBOzs7Ozs7O01BT0EsV0FBQSxXQUFBOztRQUVBLElBQUEsSUFBQSxLQUFBOztRQUVBLElBQUEsV0FBQSwrQ0FBQSxFQUFBLFdBQUE7O1FBRUEsS0FBQSxRQUFBLE1BQUE7UUFDQSxLQUFBLGlCQUFBLEtBQUEsUUFBQTs7UUFFQSxLQUFBLGVBQUE7UUFDQSxLQUFBLFNBQUEsS0FBQSxlQUFBLEtBQUEsRUFBQTtRQUNBLEtBQUEsU0FBQSxLQUFBLGVBQUEsS0FBQSxFQUFBOztRQUVBLE9BQUE7Ozs7Ozs7Ozs7TUFVQSxhQUFBLFNBQUEsT0FBQSxVQUFBO1FBQ0EsV0FBQSxZQUFBLEtBQUEsUUFBQTs7UUFFQSxJQUFBLFFBQUEsS0FBQSxjQUFBO1VBQ0EsUUFBQTtVQUNBLElBQUEsS0FBQTtVQUNBLElBQUEsUUFBQSxLQUFBLEVBQUE7VUFDQTtRQUNBLEtBQUEsaUJBQUE7UUFDQSxJQUFBLEtBQUEsZ0JBQUEsUUFBQSxTQUFBLG1CQUFBLENBQUEsR0FBQTtVQUNBLFVBQUEsRUFBQTtlQUNBO1VBQ0EsSUFBQSxRQUFBLEtBQUEsUUFBQSxDQUFBLEtBQUE7WUFDQSxRQUFBO2lCQUNBO1lBQ0EsRUFBQSxLQUFBO1lBQ0EsRUFBQSxLQUFBLFNBQUEsR0FBQSxHQUFBO2NBQ0EsT0FBQSxJQUFBOztZQUVBLFFBQUEsRUFBQSxRQUFBLFNBQUE7OztVQUdBLFVBQUEsRUFBQSxTQUFBLFVBQUEsRUFBQSxTQUFBOzs7UUFHQSxJQUFBLEVBQUEsUUFBQTtVQUNBLEtBQUEsT0FBQSxLQUFBLENBQUEsRUFBQSxPQUFBLFNBQUEsS0FBQTs7VUFFQSxLQUFBLE9BQUEsSUFBQTtZQUNBLE9BQUEsRUFBQSxNQUFBLFVBQUEsRUFBQSxNQUFBO1lBQ0EsWUFBQSxFQUFBLE9BQUEsVUFBQSxFQUFBLE9BQUE7Ozs7Ozs7UUFPQSxLQUFBLFVBQUEsRUFBQSxTQUFBLFFBQUEsWUFBQSxFQUFBOztRQUVBLElBQUEsS0FBQSxVQUFBLEVBQUEsUUFBQTtVQUNBLEVBQUEsT0FBQSxPQUFBO2VBQ0EsSUFBQSxDQUFBLEtBQUEsVUFBQSxFQUFBLFFBQUE7VUFDQSxFQUFBLE9BQUEsT0FBQTs7Ozs7TUFLQSxrQkFBQSxTQUFBLFVBQUE7UUFDQSxJQUFBLFVBQUE7VUFDQSxLQUFBLGVBQUE7VUFDQTs7UUFFQSxLQUFBLGVBQUE7Ozs7Ozs7TUFPQSxRQUFBOztRQUVBO1VBQ0EsSUFBQTtVQUNBLE9BQUE7OztRQUdBO1VBQ0EsSUFBQTtVQUNBLE9BQUE7OztRQUdBO1VBQ0EsSUFBQTtVQUNBLE9BQUE7OztRQUdBO1VBQ0EsSUFBQTtVQUNBLE9BQUE7OztRQUdBO1VBQ0EsSUFBQTtVQUNBLE9BQUE7OztRQUdBO1VBQ0EsSUFBQTtVQUNBLE9BQUE7OztRQUdBO1VBQ0EsSUFBQTtVQUNBLE9BQUE7OztRQUdBO1VBQ0EsSUFBQTtVQUNBLE9BQUE7Ozs7TUFJQSxlQUFBLFNBQUEsTUFBQTtRQUNBLElBQUEsUUFBQTtVQUNBLFVBQUEsS0FBQSxRQUFBO1VBQ0EsTUFBQSxLQUFBO1VBQ0EsT0FBQSxNQUFBOztRQUVBLENBQUEsT0FBQSxNQUFBLFNBQUEsVUFBQSxRQUFBLE1BQUEsU0FBQSxTQUFBLFFBQUEsTUFBQSxTQUFBLFNBQUEsU0FBQSxNQUFBLFNBQUE7O1FBRUEsUUFBQSxRQUFBLEtBQUEsUUFBQSxTQUFBLE9BQUE7VUFDQSxLQUFBLE1BQUEsTUFBQSxRQUFBLFNBQUEsTUFBQTs7OztRQUlBLFVBQUEsU0FBQTtRQUNBLE9BQUE7Ozs7SUFJQSxPQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFrQkE7S0FDQSxPQUFBO0tBQ0EsVUFBQSxvQkFBQTs7O0VBR0EsU0FBQSwwQkFBQSxZQUFBO0lBQ0EsT0FBQTtNQUNBLFVBQUE7T0FDQSxTQUFBO01BQ0EsTUFBQSxTQUFBLE9BQUEsU0FBQSxZQUFBLFNBQUE7UUFDQSxXQUFBLFdBQUEsU0FBQTtVQUNBLFVBQUE7VUFDQSxRQUFBO1VBQ0EsUUFBQSxTQUFBLE9BQUEsU0FBQTtZQUNBLFFBQUEsYUFBQSxVQUFBOztVQUVBLFFBQUEsU0FBQSxPQUFBLFNBQUE7WUFDQSxRQUFBLGFBQUEsVUFBQTs7Ozs7Ozs7OztBQ25XQSxDQUFBLFdBQUE7SUFDQTtJQUNBLElBQUEsYUFBQSxZQUFBLFlBQUEsU0FBQSxRQUFBLEtBQUEsV0FBQSxNQUFBLFFBQUEsUUFBQSxZQUFBLFVBQUEsOEJBQUEsV0FBQSxNQUFBLGlCQUFBOztJQUVBLGNBQUE7O0lBRUEsYUFBQTs7SUFFQSxhQUFBLFNBQUEsU0FBQTtRQUNBLE9BQUEsUUFBQSxRQUFBOzs7SUFHQSxXQUFBLFNBQUEsVUFBQTtRQUNBLE9BQUEsS0FBQSxXQUFBOzs7SUFHQSxPQUFBLFNBQUEsU0FBQTtRQUNBLE9BQUEsUUFBQSxJQUFBO1lBQ0EsU0FBQTs7OztJQUlBLE9BQUEsU0FBQSxTQUFBO1FBQ0EsT0FBQSxRQUFBLElBQUE7WUFDQSxTQUFBOzs7O0lBSUEsU0FBQSxTQUFBLFNBQUEsVUFBQTtRQUNBLE9BQUEsUUFBQSxJQUFBO1lBQ0EsTUFBQTs7OztJQUlBLFlBQUEsU0FBQSxTQUFBO1FBQ0EsT0FBQSxRQUFBLEdBQUEsY0FBQTs7O0lBR0EsYUFBQSxTQUFBLFNBQUE7UUFDQSxPQUFBLFFBQUEsR0FBQTs7O0lBR0EsUUFBQSxTQUFBLFNBQUE7UUFDQSxPQUFBLFFBQUEsR0FBQTs7O0lBR0EsTUFBQSxTQUFBLFVBQUEsVUFBQTtRQUNBLE9BQUEsV0FBQSxZQUFBLFdBQUEsWUFBQSxNQUFBOzs7SUFHQSxVQUFBLFNBQUEsT0FBQTtRQUNBLElBQUEsTUFBQSxRQUFBO1lBQ0EsT0FBQTs7UUFFQSxPQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsR0FBQSxRQUFB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QSxVQUFBO2dDQUNBLFFBQUE7b0NBQ0EsS0FBQTt3Q0FDQSxlQUFBLGFBQUEsTUFBQSxNQUFBO3dDQUNBLE9BQUEsUUFBQSxlQUFBO3dDQUNBLE9BQUEsU0FBQSxTQUFBLFdBQUEsV0FBQSxVQUFBLFlBQUE7d0NBQ0EsT0FBQSxVQUFBLElBQUE7NENBQ0EsT0FBQSxlQUFBLGVBQUE7O29DQUVBLEtBQUEsV0FBQSxjQUFBO3dDQUNBLE9BQUEsVUFBQSxJQUFBOzRDQUNBLE9BQUEsZUFBQSxNQUFBOztvQ0FFQSxLQUFBLFdBQUEsY0FBQTt3Q0FDQSxVQUFBLElBQUE7NENBQ0EsT0FBQSxlQUFBOzt3Q0FFQSxPQUFBLE9BQUEsV0FBQTs7OzRCQUdBLE9BQUEsU0FBQSxRQUFBLFFBQUEsS0FBQSxRQUFBO2dDQUNBLElBQUEsWUFBQSxPQUFBLFFBQUE7Z0NBQ0EsYUFBQTtnQ0FDQSxRQUFBLFdBQUE7b0NBQ0EsT0FBQSxZQUFBO29DQUNBLE9BQUEsWUFBQTtvQ0FDQSxXQUFBLE9BQUEsT0FBQTtvQ0FDQSxXQUFBLE9BQUEsT0FBQTtvQ0FDQSxJQUFBLE1BQUEsVUFBQTt3Q0FDQSxNQUFBLFFBQUEsTUFBQSxNQUFBO3dDQUNBLE1BQUEsT0FBQSxNQUFBLE1BQUE7O29DQUVBLGFBQUE7b0NBQ0EsT0FBQSxNQUFBOztnQ0FFQSxTQUFBLFNBQUEsT0FBQTtvQ0FDQSxJQUFBLFFBQUEsV0FBQSxZQUFBLFVBQUEsT0FBQSxPQUFBLE9BQUE7b0NBQ0EsU0FBQSxNQUFBLFlBQUEsQ0FBQSxRQUFBLE1BQUEsYUFBQSxPQUFBLENBQUEsUUFBQSxNQUFBLFFBQUEsT0FBQSxNQUFBLFVBQUEsS0FBQSxJQUFBLEtBQUEsT0FBQSxDQUFBLFFBQUEsTUFBQSxtQkFBQSxPQUFBLENBQUEsUUFBQSxNQUFBLG9CQUFBLE9BQUEsTUFBQSxHQUFBLFVBQUEsS0FBQSxJQUFBLEtBQUEsTUFBQTtvQ0FDQSxZQUFBLFNBQUEsUUFBQSxHQUFBLHdCQUFBLE9BQUE7b0NBQ0EsWUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLFdBQUEsWUFBQTtvQ0FDQSxhQUFBLGNBQUE7b0NBQ0EsV0FBQSxZQUFBLGFBQUEsYUFBQTtvQ0FDQSxJQUFBLE9BQUE7d0NBQ0EsUUFBQTs0Q0FDQSxLQUFBO2dEQUNBLElBQUEsV0FBQSxNQUFBLE1BQUEsT0FBQTtvREFDQSxhQUFBO29EQUNBLE9BQUEsWUFBQTtvREFDQSxPQUFBLFlBQUE7b0RBQ0EsT0FBQSxTQUFBO29EQUNBLFFBQUEsU0FBQTtvREFDQTt1REFDQSxJQUFBLE1BQUEsU0FBQSxHQUFBO29EQUNBLFdBQUEsS0FBQSxJQUFBLFVBQUEsTUFBQSxNQUFBLFFBQUEsTUFBQTs7Z0RBRUE7NENBQ0EsS0FBQTtnREFDQSxJQUFBLFdBQUEsTUFBQSxNQUFBLE1BQUE7b0RBQ0EsYUFBQTtvREFDQSxPQUFBLFlBQUE7b0RBQ0EsUUFBQSxZQUFBO29EQUNBLE9BQUEsU0FBQTtvREFDQSxPQUFBLFNBQUE7b0RBQ0E7dURBQ0EsSUFBQSxNQUFBLFNBQUEsR0FBQTtvREFDQSxXQUFBLEtBQUEsSUFBQSxVQUFBLFNBQUEsTUFBQSxNQUFBLFFBQUEsU0FBQSxNQUFBOzs7O29DQUlBLFdBQUEsVUFBQSxVQUFBLFNBQUEsTUFBQSxZQUFBLFdBQUEsTUFBQSxPQUFBLFdBQUEsTUFBQTtvQ0FDQSxNQUFBLE1BQUEsY0FBQTtvQ0FDQSxJQUFBLENBQUEsTUFBQSxVQUFBO3dDQUNBLE1BQUEsY0FBQTs7b0NBRUE7b0NBQ0EsT0FBQSxNQUFBOztnQ0FFQSxVQUFBLFNBQUEsT0FBQTtvQ0FDQSxJQUFBLE1BQUEsVUFBQTt3Q0FDQSxPQUFBLFNBQUE7d0NBQ0E7MkNBQ0E7d0NBQ0EsSUFBQSxPQUFBLFNBQUEsYUFBQTs0Q0FDQSxPQUFBLFlBQUE7OztvQ0FHQTtvQ0FDQSxPQUFBLFNBQUE7b0NBQ0EsT0FBQSxTQUFBO29DQUNBO29DQUNBLE1BQUE7b0NBQ0EsTUFBQTtvQ0FDQSxXQUFBLEtBQUEsT0FBQSxNQUFBO29DQUNBLE9BQUEsV0FBQSxLQUFBLE9BQUEsS0FBQTs7Z0NBRUEsT0FBQSxPQUFBLEtBQUEsT0FBQSxPQUFBOzs0QkFF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Ozs7Ozs7OztRQVNBLE9BQUEsU0FBQSxTQUFBLE1BQUE7VUFDQSxXQUFBLENBQUEsUUFBQSxZQUFBLEtBQUEsWUFBQSxLQUFBLFdBQUE7VUFDQSxrQkFBQSxDQUFBLFFBQUEsWUFBQSxLQUFBLG1CQUFBLEtBQUEsa0JBQUE7VUFDQSxXQUFBLENBQUEsUUFBQSxZQUFBLEtBQUEsWUFBQSxLQUFBLFdBQUE7VUFDQSxxQkFBQSxLQUFBLGNBQUEsS0FBQSxjQUFBO1VBQ0EsV0FBQSxDQUFBLFFBQUEsWUFBQSxLQUFBLFlBQUEsS0FBQSxXQUFBO1VBQ0EsWUFBQSxLQUFBLFlBQUEsS0FBQSxZQUFBO1VBQ0EsTUFBQSxnQkFBQSxLQUFBLGdCQUFBLEtBQUEsZ0JBQUE7Ozs7Ozs7OztRQVNBLE9BQUEsV0FBQSxXQUFBO1VBQ0EsS0FBQSxJQUFBLElBQUEsZ0JBQUEsU0FBQSxHQUFBLEtBQUEsR0FBQSxLQUFBO1lBQ0EsSUFBQSxVQUFBLGdCQUFBO1lBQ0EsUUFBQSxJQUFBLFdBQUE7Ozs7Ozs7Ozs7O1FBV0EsT0FBQSxVQUFBLFNBQUEsUUFBQSxNQUFBO1VBQ0EsTUFBQSxPQUFBO1VBQ0EsTUFBQSxRQUFBO1VBQ0EsT0FBQTs7Ozs7Ozs7OztRQVVBLE9BQUEsT0FBQSxTQUFBLEtBQUEsTUFBQTtVQUNBLE1BQUEsT0FBQTtVQUNBLE1BQUEsUUFBQTtVQUNBLE9BQUE7Ozs7Ozs7Ozs7UUFVQSxPQUFBLFFBQUEsU0FBQSxNQUFBLE1BQUE7VUFDQSxNQUFBLE9BQUE7VUFDQSxNQUFBLFFBQUE7VUFDQSxPQUFBOzs7Ozs7Ozs7O1FBVUEsT0FBQSxVQUFBLFNBQUEsUUFBQSxNQUFBO1VBQ0EsTUFBQSxPQUFBO1VBQ0EsTUFBQSxRQUFBO1VBQ0EsT0FBQTs7Ozs7Ozs7OztRQVVBLE9BQUEsT0FBQSxTQUFBLEtBQUEsTUFBQTtVQUNBLE1BQUEsT0FBQTtVQUNBLE1BQUEsUUFBQTtVQUNBLE9BQUE7O1FBRUEsT0FBQTs7O0dBR0EsUUFBQTtBQ3hRQSxDQUFBLFlBQUE7RUFDQTs7Ozs7Ozs7Ozs7OztFQWFBLFFBQUEsT0FBQSxxQ0FBQSxDQUFBOzs7QUNkQSxDQUFBLFlBQUE7RUFDQTs7Ozs7Ozs7Ozs7OztFQWFBO0tBQ0EsT0FBQTtLQUNBLFFBQUEsV0FBQSxDQUFBLFVBQUEsVUFBQSxRQUFBOztNQUVBLElBQUEsU0FBQSxVQUFBO1FBQ0EsaUJBQUE7VUFDQSxVQUFBO1VBQ0EsVUFBQTtVQUNBLE1BQUE7VUFDQSxhQUFBO1VBQ0EsYUFBQTs7OztNQUlBLElBQUEsY0FBQSxVQUFBLE1BQUE7UUFDQSxJQUFBLFFBQUE7UUFDQSxRQUFBLFFBQUE7UUFDQSxNQUFBLEtBQUEsQ0FBQSxRQUFBLFVBQUEsS0FBQSxhQUFBLEtBQUEsV0FBQSxlQUFBO1FBQ0EsTUFBQSxLQUFBLENBQUEsUUFBQSxVQUFBLEtBQUEsYUFBQSxLQUFBLFdBQUEsZUFBQTtRQUNBLE1BQUEsS0FBQSxDQUFBLFFBQUEsVUFBQSxLQUFBLFVBQUEsUUFBQSxPQUFBLEtBQUEsTUFBQSxTQUFBLFFBQUEsT0FBQSxLQUFBLE1BQUEsU0FBQSxRQUFBLE9BQUEsS0FBQSxNQUFBLFVBQUEsS0FBQSxPQUFBLGVBQUE7UUFDQSxNQUFBLEtBQUEsQ0FBQSxRQUFBLFVBQUEsS0FBQSxnQkFBQSxLQUFBLGNBQUEsZUFBQTtRQUNBLE1BQUEsY0FBQSxDQUFBLFFBQUEsVUFBQSxLQUFBLGdCQUFBLEtBQUEsY0FBQSxlQUFBOztRQUVBLE9BQUE7Ozs7Ozs7Ozs7TUFVQSxPQUFBLFVBQUEsVUFBQSxRQUFBLEtBQUEsTUFBQTtRQUNBLElBQUEsUUFBQSxZQUFBOztRQUVBLE9BQUEsT0FBQSxLQUFBO1VBQ0EsYUFBQSxNQUFBO1VBQ0EsWUFBQTtVQUNBLFVBQUEsTUFBQTtVQUNBLFVBQUEsTUFBQTtVQUNBLGFBQUEsTUFBQTtVQUNBLE1BQUEsTUFBQTtVQUNBLFNBQUE7WUFDQSxNQUFBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBLFFBQUEsUUFBQSxLQUFBO2dCQUNBLEtBQUEsUUFBQSxLQUFBOzs7Ozs7TUFNQSxPQUFBOzs7OztBQ25FQSxDQUFBLFdBQUE7RUFDQTs7Ozs7Ozs7Ozs7OztFQWFBO0tBQ0EsT0FBQTtLQUNBLFdBQUEsMEJBQUEsQ0FBQTtNQUNBO01BQ0E7TUFDQSxTQUFBLFFBQUEsZ0JBQUEsTUFBQTs7UUFFQSxPQUFBLFNBQUEsQ0FBQSxRQUFBLFVBQUEsS0FBQSxZQUFBLEtBQUEsV0FBQSxPQUFBLEtBQUEsU0FBQTtRQUNBLE9BQUEsTUFBQSxDQUFBLFFBQUEsVUFBQSxLQUFBLFFBQUEsS0FBQSxNQUFBOztRQUVBLE9BQUEsS0FBQSxXQUFBO1VBQ0EsZUFBQSxRQUFBOztRQUVBLE9BQUEsTUFBQSxXQUFBO1VBQ0EsZUFBQSxNQUFBOzs7Ozs7O0FDNUJBLENBQUEsV0FBQTtFQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTBCQTtLQUNBLE9BQUEsVUFBQTtLQUNBLFNBQUEsVUFBQTs7TUFFQSxXQUFBOzs7OztRQUtBLElBQUEsWUFBQTs7Ozs7OztRQU9BLEtBQUEsVUFBQSxTQUFBLFlBQUE7VUFDQSxZQUFBLENBQUEsQ0FBQTs7Ozs7Ozs7UUFRQSxLQUFBLE9BQUEsQ0FBQTtVQUNBLFNBQUEsTUFBQTs7Ozs7OztZQU9BLElBQUEsU0FBQSxTQUFBLFNBQUE7Y0FDQSxLQUFBLFVBQUE7Ozs7Ozs7WUFPQSxPQUFBLGNBQUEsU0FBQSxTQUFBO2NBQ0EsT0FBQSxJQUFBLE9BQUE7Ozs7Ozs7Ozs7WUFVQSxPQUFBLFdBQUEsU0FBQSxLQUFBLEdBQUE7Y0FDQSxPQUFBLElBQUE7Z0JBQ0E7Z0JBQ0EsU0FBQSxHQUFBLEdBQUE7a0JBQ0EsSUFBQSxJQUFBLEVBQUE7a0JBQ0EsT0FBQSxPQUFBLE1BQUEsWUFBQSxPQUFBLE1BQUEsV0FBQSxJQUFBOzs7Ozs7Ozs7O1lBVUEsT0FBQSx3QkFBQSxTQUFBLE1BQUE7Y0FDQSxPQUFBLE9BQUEsU0FBQSxtQkFBQTtnQkFDQSxLQUFBO2dCQUNBLEtBQUE7Z0JBQ0EsS0FBQTtnQkFDQSxLQUFBOzs7Ozs7O1lBT0EsT0FBQSxZQUFBOzs7Ozs7Ozs7OztjQVdBLE1BQUEsU0FBQSxZQUFBLE1BQUE7Z0JBQ0EsSUFBQSxDQUFBLFdBQUE7a0JBQ0E7OztnQkFHQSxJQUFBLE1BQUEsT0FBQSxzQkFBQSxJQUFBO2dCQUNBLElBQUEsVUFBQTtrQkFDQSxlQUFBO2dCQUNBLFFBQUEsS0FBQTtrQkFDQSxLQUFBO29CQUNBLFVBQUEsT0FBQSxTQUFBLGtCQUFBLENBQUEsS0FBQSxLQUFBLFNBQUEsS0FBQTtvQkFDQTtrQkFDQSxLQUFBO29CQUNBLGVBQUEsS0FBQTtvQkFDQSxVQUFBLE9BQUEsU0FBQSwyQkFBQSxDQUFBLEtBQUEsS0FBQSxTQUFBLEtBQUEsSUFBQSxLQUFBO29CQUNBO2tCQUNBLEtBQUE7b0JBQ0EsSUFBQSxPQUFBLEtBQUEsT0FBQSxVQUFBO3NCQUNBLFVBQUEsT0FBQSxTQUFBLDJCQUFBLENBQUEsS0FBQSxLQUFBLFNBQUEsS0FBQSxJQUFBLEtBQUE7MkJBQ0E7c0JBQ0EsZUFBQSxLQUFBO3NCQUNBLFVBQUEsT0FBQSxTQUFBLGtCQUFBLENBQUEsS0FBQSxLQUFBLFNBQUEsS0FBQTs7b0JBRUE7OztnQkFHQSxLQUFBLFlBQUEsS0FBQSxNQUFBLE9BQUEsU0FBQSxTQUFBOzs7Ozs7OztjQVFBLEtBQUEsV0FBQTtnQkFDQSxLQUFBLEtBQUEsT0FBQTs7Ozs7OztjQU9BLE1BQUEsV0FBQTtnQkFDQSxLQUFBLEtBQUEsUUFBQTs7Ozs7OztjQU9BLE1BQUEsV0FBQTtnQkFDQSxLQUFBLEtBQUEsUUFBQTs7Ozs7OztjQU9BLE9BQUEsV0FBQTtnQkFDQSxLQUFBLEtBQUEsU0FBQTs7Ozs7OztjQU9BLE9BQUEsV0FBQTtnQkFDQSxLQUFBLEtBQUEsU0FBQTs7O1lBR0EsT0FBQTs7Ozs7O0FDM0xBOztBQUVBLFFBQUEsT0FBQTtLQUNBLFFBQUEsdURBQUEsVUFBQSxJQUFBLE9BQUEsWUFBQSxXQUFBO1FBQ0EsT0FBQTtZQUNBLFlBQUEsWUFBQTtnQkFDQSxJQUFBLFdBQUEsR0FBQTtnQkFDQSxJQUFBLFdBQUEsV0FBQSxVQUFBLElBQUE7O2dCQUVBLElBQUEsUUFBQSxZQUFBLFdBQUE7b0JBQ0EsV0FBQTs7O2dCQUdBLFNBQUEsUUFBQTtnQkFDQSxPQUFBLFNBQUE7O1lBRUEsUUFBQSxZQUFBO2dCQUNBLElBQUEsV0FBQSxHQUFBO2dCQUNBLFNBQUEsUUFBQTtnQkFDQSxPQUFBLFNBQUE7Ozs7Ozs7OztLQVNBLFNBQUEsYUFBQTtRQUNBLE1BQUE7Ozs7Ozs7OztBQzdCQTs7QUFFQSxRQUFBLE9BQUE7S0FDQSxXQUFBLDJEQUFBLFVBQUEsUUFBQSxZQUFBLFVBQUE7UUFDQSxPQUFBLGlCQUFBLFVBQUEsYUFBQTtZQUNBLFdBQUEsSUFBQTs7O1FBR0EsU0FBQSxTQUFBLEtBQUEsVUFBQSxXQUFBO1lBQ0EsT0FBQSxZQUFBOzs7O0FDVEEsQ0FBQSxXQUFBO0VBQ0E7Ozs7Ozs7Ozs7O0VBV0E7S0FDQSxPQUFBLHVDQUFBOztBQ2JBLENBQUEsV0FBQTtJQUNBOzs7Ozs7Ozs7OztJQVdBO1NBQ0EsT0FBQTtTQUNBLE9BQUEsZUFBQSxXQUFBO1lBQ0EsT0FBQSxTQUFBLE9BQUEsT0FBQTtnQkFDQSxJQUFBLE1BQUE7O2dCQUVBLElBQUEsUUFBQSxRQUFBLFFBQUE7b0JBQ0EsTUFBQSxRQUFBLFNBQUEsTUFBQTt3QkFDQSxJQUFBLGNBQUE7O3dCQUVBLElBQUEsT0FBQSxPQUFBLEtBQUE7d0JBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsUUFBQSxLQUFBOzRCQUNBLElBQUEsT0FBQSxLQUFBOzRCQUNBLElBQUEsT0FBQSxNQUFBLE1BQUE7NEJBQ0EsSUFBQSxLQUFBLE1BQUEsV0FBQSxjQUFBLFFBQUEsVUFBQSxDQUFBLEdBQUE7Z0NBQ0EsY0FBQTtnQ0FDQTs7Ozt3QkFJQSxJQUFBLGFBQUE7NEJBQ0EsSUFBQSxLQUFBOzs7dUJBR0E7O29CQUVBLE1BQUE7OztnQkFHQSxPQUFBOzs7OztBQ3pDQSxDQUFBLFdBQUE7RUFDQTs7Ozs7Ozs7Ozs7RUFXQTtLQUNBLE9BQUE7S0FDQSxPQUFBLGlCQUFBLFdBQUE7TUFDQSxPQUFBLFNBQUEsT0FBQSxPQUFBO1FBQ0EsSUFBQSxNQUFBLFFBQUE7VUFDQSxPQUFBOztRQUVBLElBQUEsU0FBQSxHQUFB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QSxRQUFBLFFBQUE7YUFDQSxTQUFBLFVBQUE7WUFDQSxhQUFBOzs7VUFHQTs7Ozs7Ozs7OztBQzNEQTs7QUFFQSxRQUFBLE9BQUE7R0FDQSxVQUFBLGtCQUFBLFdBQUE7SUFDQSxPQUFBO01BQ0EsVUFBQTtNQUNBLFNBQUE7TUFDQSxNQUFBLFNBQUEsT0FBQSxTQUFBO1FBQ0EsUUFBQSxLQUFBLGVBQUEsS0FBQSxXQUFBO1VBQ0EsSUFBQSxhQUFBLEVBQUE7VUFDQSxJQUFBLFVBQUEsV0FBQSxLQUFBOztVQUVBLElBQUEsUUFBQSxTQUFBLEdBQUE7WUFDQSxRQUFBLEtBQUEsV0FBQTtjQUNBLElBQUEsU0FBQSxFQUFBO2NBQ0EsTUFBQSxPQUFBLFdBQUE7Z0JBQ0EsT0FBQSxPQUFBLFNBQUEsaUJBQUEsT0FBQSxTQUFBO2lCQUNBLFNBQUEsV0FBQTtnQkFDQSxXQUFBLFlBQUEsYUFBQTs7Ozs7Ozs7OztBQVVBO0dBQ0EsT0FBQTtHQUNBLFVBQUEsb0JBQUEsV0FBQTtJQUNBLE9BQUE7TUFDQSxTQUFBO01BQ0EsTUFBQSxTQUFBLE9BQUEsS0FBQSxPQUFBLE1BQUE7UUFDQSxLQUFBLFlBQUEsbUJBQUEsVUFBQSxZQUFBLFdBQUE7O2FBRUEsSUFBQTtZQUNBLElBQUEsUUFBQSxRQUFBLGFBQUE7Z0JBQ0EsZUFBQTttQkFDQSxJQUFBLFFBQUEsUUFBQSxZQUFBO2dCQUNBLGVBQUE7bUJBQ0E7Z0JBQ0EsT0FBQTs7O1lBR0EsT0FBQSxhQUFBLFNBQUE7Ozs7OztBQzlDQSxDQUFBLFdBQUE7RUFDQTs7Ozs7Ozs7Ozs7O0VBWUEsUUFBQSxPQUFBO0tBQ0EsVUFBQSxhQUFBLENBQUE7TUFDQSxTQUFBLFFBQUE7UUFDQSxPQUFBO1VBQ0EsVUFBQTtVQUNBLE1BQUEsU0FBQSxPQUFBLFNBQUEsT0FBQTtZQUNBLElBQUEsUUFBQSxPQUFBLE1BQUE7WUFDQSxJQUFBLGNBQUEsTUFBQTs7WUFFQSxRQUFBLEtBQUEsVUFBQSxXQUFBO2NBQ0EsTUFBQSxPQUFBLFdBQUE7Z0JBQ0EsWUFBQSxPQUFBLFFBQUEsR0FBQSxNQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBc0JBLFFBQUEsT0FBQTtLQUNBLFVBQUEsb0JBQUE7TUFDQSxXQUFBO1FBQ0EsT0FBQTtVQUNBLFVBQUE7VUFDQSxNQUFBLFNBQUEsT0FBQSxTQUFBLE9BQUE7WUFDQSxRQUFBLEtBQUEsZ0JBQUEsS0FBQSxTQUFBLFdBQUE7Y0FDQSxRQUFBLEtBQUEsZ0JBQUEsUUFBQTs7O1lBR0EsTUFBQSxJQUFBLFlBQUEsVUFBQTtjQUNBLFFBQUEsS0FBQSxnQkFBQSxPQUFBOzs7Ozs7OztBQ3pEQSxDQUFBLFdBQUE7RUFDQTs7Ozs7Ozs7Ozs7RUFXQTtLQUNBLE9BQUE7S0FDQSxVQUFBLGVBQUE7O0VBRUEsU0FBQSxjQUFBO0lBQ0EsT0FBQTtNQUNBLFVBQUE7TUFDQSxTQUFBO01BQ0EsT0FBQTtRQUNBLGFBQUE7O01BRUEsTUFBQSxTQUFBLE9BQUEsVUFBQSxRQUFBLFNBQUE7UUFDQSxTQUFBLEdBQUEsU0FBQSxXQUFBO1VBQ0EsTUFBQSxPQUFBLFdBQUE7WUFDQSxRQUFBLGFBQUEsZ0JBQUEsTUFBQSxpQkFBQSxRQUFBLGVBQUEsUUFBQSxZQUFBOzs7Ozs7OztBQzFCQSxDQUFBLFdBQUE7RUFDQTs7Ozs7Ozs7Ozs7Ozs7O0VBZUE7S0FDQSxPQUFBO0tBQ0EsVUFBQSx3QkFBQTs7O0VBR0EsU0FBQSx1QkFBQTtJQUNBLE9BQUE7TUFDQSxVQUFBO01BQ0EsTUFBQTtRQUNBLE1BQUEsU0FBQSxPQUFBLFNBQUEsT0FBQTtVQUNBLFFBQUEsTUFBQSxTQUFBLEdBQUE7WUFDQSxFQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW9CQTtLQUNBLE9BQUE7S0FDQSxVQUFBLGtCQUFBOztFQUVBLFNBQUEsaUJBQUE7SUFDQSxPQUFBO01BQ0EsVUFBQTtNQUNBLE1BQUE7UUFDQSxNQUFBLFNBQUEsT0FBQSxTQUFBLE9BQUE7VUFDQSxRQUFBLEdBQUEsTUFBQSxTQUFBLEdBQUE7WUFDQSxFQUFBOzs7Ozs7OztBQ3pEQSxDQUFBLFdBQUE7SUFDQTs7Ozs7Ozs7Ozs7SUFXQTtTQUNBLE9BQUE7U0FDQSxVQUFBLFNBQUE7OztJQUdBLFNBQUEsY0FBQSxRQUFBO1FBQ0EsT0FBQTtZQUNBLFNBQUE7WUFDQSxVQUFBO1lBQ0EsTUFBQSxTQUFBLE9BQUEsTUFBQSxPQUFBLE1BQUE7Z0JBQ0EsSUFBQSxDQUFBLE1BQUE7b0JBQ0EsSUFBQSxXQUFBLFFBQUEsTUFBQTt3QkFDQSxRQUFBLEtBQUE7O29CQUVBOzs7Z0JBR0EsSUFBQSxjQUFBLE9BQUEsTUFBQTtnQkFDQSxJQUFBLGlCQUFBLE9BQUEsTUFBQTtnQkFDQSxJQUFBLGdCQUFBLE9BQUEsTUFBQTs7Z0JBRUEsTUFBQSxPQUFBLGVBQUEsV0FBQTtvQkFDQSxLQUFBOzs7Z0JBR0EsS0FBQSxZQUFBLFFBQUEsV0FBQTtvQkFDQSxJQUFBLFFBQUE7b0JBQ0EsSUFBQSxXQUFBLGNBQUE7b0JBQ0EsSUFBQTs7b0JBRUEsSUFBQSxlQUFBLFFBQUE7d0JBQ0EsUUFBQSxRQUFBLFVBQUEsS0FBQSxnQkFBQSxRQUFBLFVBQUE7MkJBQ0E7d0JBQ0EsUUFBQSxLQUFBLGVBQUE7O29CQUVBLFNBQUE7b0JBQ0EsT0FBQSxDQUFBLENBQUE7OztnQkFHQSxTQUFBLGdCQUFBO29CQUNBLElBQUEsUUFBQSxZQUFBO29CQUNBLElBQUEsUUFBQSxTQUFBLFVBQUEsTUFBQSxlQUFBLGVBQUE7d0JBQ0EsUUFBQSxNQUFBOztvQkFFQSxPQUFBOzs7Ozs7OztBQ3hEQSxDQUFBLFdBQUE7RUFDQTs7Ozs7Ozs7Ozs7Ozs7O0VBZUE7S0FDQSxPQUFBO0tBQ0EsVUFBQSxhQUFBOzs7RUFHQSxTQUFBLHFCQUFBLFlBQUE7SUFDQSxPQUFBO01BQ0EsVUFBQTtNQUNBLE9BQUE7UUFDQSxRQUFBO1FBQ0EsWUFBQTs7TUFFQSxTQUFBO01BQ0EsTUFBQSxTQUFBLE9BQUEsU0FBQSxZQUFBO1FBQ0EsTUFBQSxPQUFBLFdBQUE7VUFDQSxPQUFBLFdBQUE7V0FDQSxTQUFBLFFBQUEsUUFBQTtVQUNBLEdBQUE7VUFDQSxNQUFBLFdBQUEsa0JBQUEsTUFBQSxTQUFBLHFCQUFBOztRQUVBLE1BQUEsT0FBQSxXQUFBO1VBQ0EsT0FBQSxNQUFBO1dBQ0EsU0FBQSxRQUFBLFFBQUE7WUFDQSxHQUFBO1VBQ0EsTUFBQSxXQUFBLGtCQUFBLE1BQUEsU0FBQSxxQkFBQTs7O01BR0EsVUFBQTs7Ozs7O0FDM0NBLENBQUEsV0FBQTs7Ozs7Ozs7Ozs7OztFQWFBO0tBQ0EsT0FBQTtLQUNBLFVBQUEsZUFBQSxDQUFBLFdBQUE7TUFDQSxPQUFBO1FBQ0EsVUFBQTtRQUNBLE1BQUEsU0FBQSxPQUFBLFNBQUEsT0FBQTtVQUNBLFFBQUEsTUFBQSxRQUFBLFNBQUE7Ozs7Ozs7QUNuQkEsQ0FBQSxXQUFBO0VBQ0E7Ozs7Ozs7Ozs7OztFQVlBO0tBQ0EsT0FBQTtLQUNBLFFBQUEsbUJBQUE7OztFQUdBLFNBQUEsdUJBQUEsUUFBQSxTQUFBLElBQUE7O0lBRUEsU0FBQSx5QkFBQTtNQUNBLEtBQUEsZUFBQTtRQUNBLE9BQUE7UUFDQSxTQUFBOzs7TUFHQSxLQUFBLGtCQUFBLFNBQUEsT0FBQSxTQUFBO1FBQ0EsS0FBQSxlQUFBO1VBQ0EsT0FBQTtVQUNBLFNBQUE7Ozs7TUFJQSxLQUFBLG1CQUFBLFNBQUEsTUFBQTtRQUNBLENBQUEsWUFBQSxRQUFBLE9BQUEsTUFBQSxLQUFBLGVBQUEsT0FBQSxRQUFBLEtBQUE7OztJQUdBLHVCQUFBLFVBQUEsVUFBQSxTQUFBLFlBQUEsWUFBQTtNQUNBLElBQUEsV0FBQSxHQUFBO01BQ0EsSUFBQSxDQUFBLFdBQUEsUUFBQSxDQUFBLFFBQUEsS0FBQSxNQUFBOztRQUVBLFNBQUEsUUFBQTtVQUNBLE1BQUEsQ0FBQSxDQUFBLFFBQUEsV0FBQSxTQUFBLFFBQUEsZUFBQSxTQUFBLFlBQUE7VUFDQSxTQUFBLFFBQUE7O1FBRUEsT0FBQSxTQUFBOztNQUVBLElBQUEsY0FBQSxXQUFBO1FBQ0E7UUFDQTtNQUNBLFVBQUEsUUFBQSxhQUFBLFlBQUEsWUFBQTs7TUFFQSxLQUFBLGdCQUFBLFlBQUEsTUFBQTtNQUNBLGNBQUEsQ0FBQSxZQUFBLEtBQUEsa0JBQUEsYUFBQSxZQUFBO01BQ0EsSUFBQSxZQUFBO1FBQ0EsS0FBQSxpQkFBQTs7O01BR0EsU0FBQSxRQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7OztNQUdBLE9BQUEsU0FBQTs7O0lBR0EsdUJBQUEsVUFBQSxRQUFBLFNBQUEsVUFBQSxZQUFBO01BQ0EsSUFBQSxXQUFBLEdBQUE7TUFDQSxJQUFBLFVBQUEsVUFBQSxXQUFBLFVBQUE7TUFDQSxLQUFBLGdCQUFBLFNBQUE7TUFDQSxJQUFBLFlBQUE7UUFDQSxLQUFBLGlCQUFBOztNQUVBLFNBQUEsUUFBQTtRQUNBLE1BQUE7UUFDQSxTQUFBOzs7TUFHQSxPQUFBLFNBQUE7O0lBRUEsT0FBQSxJQUFBOzs7Ozs7O0FDaEZBLENBQUEsV0FBQTtFQUNBOzs7Ozs7Ozs7Ozs7O0VBYUEsUUFBQSxPQUFBLCtCQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7O0tBRUEiLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG4gIC8qKlxuICAgKiBAbmdkb2Mgb3ZlcnZpZXdcbiAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5Vc2Vyc1xuICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuVXNlcnNcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlc3BvbnNpYmxlIGZvciBldmVyeSBhY3Rpb24gd2hpY2ggaXMgcGVyZm9ybWVkIG9uIHVzZXJcbiAgICpcbiAgICogQHNlZSBVc2Vycy5tb2RlbC5qc1xuICAgKiBAc2VlIFVzZXJzLnJlc291cmNlLmpzXG4gICAqXG4gICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAqL1xuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5Vc2VycycsIFsndWkuc2VsZWN0JywndWkubWFzayddKVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLyoqXG4gICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuVXNlcnMuY29uZmlnLlZpZXdVc2VyU3RhdGVcbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLlVzZXJzXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiB2aWV3IHVzZXJcbiAgICpcbiAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICovXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLlVzZXJzJylcbiAgICAuY29uZmlnKFZpZXdVc2VyU3RhdGUpO1xuXG4gIC8qIEBuZ0luamVjdCAqL1xuICBmdW5jdGlvbiBWaWV3VXNlclN0YXRlKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgIC5zdGF0ZSgndXNlcnMudmlld3VzZXInLCB7XG4gICAgICAgIHBhcmVudDogJ3VzZXJzJyxcbiAgICAgICAgdXJsOiAnL3ZpZXcvOnVzZXJfaWQnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcm9sZXM6IFsnUk9MRV9BRE1JTicsICdST0xFX1NZU1RFTV9BRE1JTiddLFxuICAgICAgICAgIHBhZ2VUaXRsZTogJ2NyZWF0ZXVzZXIudXBkYXRlX3RpdGxlJ1xuICAgICAgICB9LFxuICAgICAgICB2aWV3czoge1xuICAgICAgICAgICd1c2Vycyc6IHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbW9kdWxlcy91c2Vycy92aWV3LXVzZXIvdmlldy11c2VyLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1ZpZXdVc2VyQ29udHJvbGxlciBhcyBfc2VsZidcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICB0cmFuc2xhdGVQYXJ0aWFsTG9hZGVyOiBbJyR0cmFuc2xhdGUnLCAnJHRyYW5zbGF0ZVBhcnRpYWxMb2FkZXInLCBmdW5jdGlvbiAoJHRyYW5zbGF0ZSwgJHRyYW5zbGF0ZVBhcnRpYWxMb2FkZXIpIHtcbiAgICAgICAgICAgICR0cmFuc2xhdGVQYXJ0aWFsTG9hZGVyLmFkZFBhcnQoJ2NyZWF0ZS11c2VyJyk7XG4gICAgICAgICAgICByZXR1cm4gJHRyYW5zbGF0ZS5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG5cbiAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvKipcbiAgICogQG5nZG9jIENvbnRyb2xsZXJcbiAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5Vc2Vycy5Db250cm9sbGVyLlZpZXdVc2VyQ29udHJvbGxlclxuICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuVXNlcnNcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFZpZXdVc2VyQ29udHJvbGxlciBpcyByZXNwb25zaWJsZSBldmVyeSBhY3Rpb24gb24gbGlzdCB2aWV3IHBhZ2VcbiAgICpcbiAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICovXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLlVzZXJzJylcbiAgICAuY29udHJvbGxlcignVmlld1VzZXJDb250cm9sbGVyJywgVmlld1VzZXJDb250cm9sbGVyKTtcblxuICAvKiBAbmdJbmplY3QgKi9cbiAgZnVuY3Rpb24gVmlld1VzZXJDb250cm9sbGVyKCRzdGF0ZSwgTG9nZ2VyLCBVc2Vyc01vZGVsLCBSZXNwb25zZUhhbmRsZXIsIFByb2plY3RzTW9kZWwsIHV0aWxGYWN0b3J5LCBQcm9qZWN0c0ZhY3RvcnkpIHtcbiAgICB2YXIgX3VzZXJJZCxcbiAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5wcm9qZWN0cyA9IFByb2plY3RzTW9kZWwucHJvamVjdHNMaXN0O1xuXG5cbiAgICBpbml0KCk7XG4gICAgLyoqXG4gICAgICogW2luaXQgZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgTG9nZ2VyLmdldEluc3RhbmNlKCdWaWV3VXNlckNvbnRyb2xsZXInKS5pbmZvKCdDb250cm9sbGVyIGhhcyBpbml0aWFsaXplZCcpO1xuICAgICAgc2VsZi5wYWdlVGl0bGUgPSAkc3RhdGUuY3VycmVudC5kYXRhLnBhZ2VUaXRsZTtcbiAgICAgIGdldFVzZXIoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9qZWN0cygpIHtcbiAgICAgIFByb2plY3RzRmFjdG9yeS5nZXRQcm9qZWN0cyh7XG4gICAgICAgICdwYWdlJzogMSxcbiAgICAgICAgJ3Blcl9wYWdlJzogOTk5OTk5LFxuICAgICAgICAncHJlZGljYXRlJzogJ2lkJyxcbiAgICAgICAgJ2lzU29ydFJldmVyc2UnOiB0cnVlXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgc2V0VXNlclByb2plY3QoKTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0VXNlciBmaW5kIHVzZXIgYnkgSUQgXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRVc2VyKCkge1xuICAgICAgX3VzZXJJZCA9ICRzdGF0ZS5wYXJhbXMudXNlcl9pZCA/IHBhcnNlSW50KCRzdGF0ZS5wYXJhbXMudXNlcl9pZCkgOiBudWxsO1xuICAgICAgaWYgKCFfdXNlcklkKSB7XG4gICAgICAgIHNlbGYudXNlciA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCBVc2Vyc01vZGVsLnVzZXIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIFVzZXJzTW9kZWwuZmluZCh7XG4gICAgICAgICdpZCc6IF91c2VySWRcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24odXNlcikge1xuICAgICAgICBzZWxmLnVzZXIgPSB1c2VyO1xuICAgICAgICBzZXRSb2xlc05hbWUodXNlci5yb2xlcyk7XG4gICAgICAgIGlmKHNlbGYudXNlci5wcm9qZWN0SWRzICYmIHNlbGYudXNlci5wcm9qZWN0SWRzLmxlbmd0aCA+IDAgKXtcbiAgICAgICAgICBnZXRQcm9qZWN0cygpO1xuICAgICAgICB9XG4gICAgICB9KS5jYXRjaChSZXNwb25zZUhhbmRsZXIuZXJyb3IpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBzZXRSb2xlc05hbWVcbiAgICAgKiBjcmVhdGUgYSBzdHJpbmcgb2Ygcm9sZSdzIG5hbWVcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1t0eXBlXX0gcm9sZXMgW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldFJvbGVzTmFtZShyb2xlcykge1xuICAgICAgdmFyIHJvbGVMaXN0ID0gdXRpbEZhY3RvcnkuZ2V0Um9sZU5hbWVCeVR5cGUocm9sZXMpLmpvaW4oXCIvXCIpO1xuICAgICAgc2VsZi51c2VyLnJvbGVzID0gcm9sZUxpc3Q7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0VXNlclByb2plY3QoKXtcbiAgICAgIHZhciBwcm9qZWN0cyA9IFtdO1xuICAgICAgXy5lYWNoKHNlbGYucHJvamVjdHMsIGZ1bmN0aW9uKHByb2plY3Qpe1xuICAgICAgICAgIGlmKHNlbGYudXNlci5wcm9qZWN0SWRzLmluZGV4T2YocHJvamVjdC5wcm9qZWN0aWQpID49IDApe1xuICAgICAgICAgICAgcHJvamVjdHMucHVzaChwcm9qZWN0KTtcbiAgICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBzZWxmLnVzZXIucHJvamVjdHMgPSBwcm9qZWN0cztcbiAgICB9XG5cbiAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgaWYgKHR5cGVvZiBfLmNvbnRhaW5zID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBfLmNvbnRhaW5zID0gXy5pbmNsdWRlcztcbiAgICAgICAgXy5wcm90b3R5cGUuY29udGFpbnMgPSBfLmluY2x1ZGVzO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIF8ub2JqZWN0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBfLm9iamVjdCA9IF8uemlwT2JqZWN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAbmdkb2Mgb3ZlcnZpZXdcbiAgICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlXG4gICAgICpcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmVcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIENvbmZpZ3VhcnRpb24gd2hpbGUgcHJvdmlkZXIgYXJlIGNyZWF0ZWRcbiAgICAgKlxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG4gICAgYW5ndWxhci5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUnLCBbXG4gICAgICAgIC8qXG4gICAgICAgICAqIE9yZGVyIGlzIG5vdCBpbXBvcnRhbnQuIEFuZ3VsYXIgbWFrZXMgYVxuICAgICAgICAgKiBwYXNzIHRvIHJlZ2lzdGVyIGFsbCBvZiB0aGUgbW9kdWxlcyBsaXN0ZWRcbiAgICAgICAgICovXG5cbiAgICAgICAgLypcbiAgICAgICAgICogRXZlcnlib2R5IGhhcyBhY2Nlc3MgdG8gdGhlc2UuXG4gICAgICAgICAqIFdlIGNvdWxkIHBsYWNlIHRoZXNlIHVuZGVyIGV2ZXJ5IGZlYXR1cmUgYXJlYSxcbiAgICAgICAgICogYnV0IHRoaXMgaXMgZWFzaWVyIHRvIG1haW50YWluLlxuICAgICAgICAgKi9cbiAgICAgICAgJ0JlYXV0eUNvbGxlY3RpdmUuQ29yZSdcblxuICAgIF0pO1xuXG4gICAgYW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uO1xuICAgICAgICBpZiAobG9jYXRpb24uaGFzT3duUHJvcGVydHkoJ3BhdGhuYW1lJykgJiYgKGxvY2F0aW9uLnBhdGhuYW1lID09PSAnL2FjY291bnQnKSkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdCZWF1dHlDb2xsZWN0aXZlLkRhc2hib2FyZCBpcyBydW5uaW5nLi4uLi4uJyk7XG4gICAgICAgICAgICBhbmd1bGFyLmJvb3RzdHJhcChkb2N1bWVudCwgWydCZWF1dHlDb2xsZWN0aXZlLkRhc2hib2FyZCddKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFuZ3VsYXIuYm9vdHN0cmFwKGRvY3VtZW50LCBbJ0JlYXV0eUNvbGxlY3RpdmUuR2xvYmFsQmVhdXR5Q29sbGVjdGl2ZSddKTtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnQmVhdXR5Q29sbGVjdGl2ZS5HbG9iYWxCZWF1dHlDb2xsZWN0aXZlIGlzIHJ1bm5pbmcuLi4uLi4nKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLyoqXG4gICAqIEBuZ2RvYyBDb250cm9sbGVyXG4gICAqIEBuYW1lIE1haW5TaWRlYmFyQ29udHJvbGxlclxuICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmVcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIE1haW5TaWRlYmFyQ29udHJvbGxlciBpcyB1c2VkIHRvIG1haW50YWluIHRoZSB1aSBzdGF0ZSBmb3Igc2lkZWJhclxuICAgKlxuICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgKi9cbiAgLyogQG5nSW5qZWN0ICovXG4gIGZ1bmN0aW9uIE1haW5TaWRlYmFyQ29udHJvbGxlcihQcmluY2lwYWwsIExvZ2dlciwgQWNsU2VydmljZSwgJHNjb3BlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG5cbiAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgTG9nZ2VyLmdldEluc3RhbmNlKCdNYWluU2lkZWJhckNvbnRyb2xsZXInKS5pbmZvKCdDb250cm9sbGVyIGhhcyBpbml0aWFsaXplZCcpO1xuICAgIH1cblxuICAgIFByaW5jaXBhbC5pZGVudGl0eSh0cnVlKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBzZWxmLnVzZXIgPSBkYXRhO1xuICAgICAgc2VsZi5wcm9maWxlUGljID0gKGRhdGEucHJvZmlsZVBpY3R1cmVVcmwgIT09ICcnKSA/IGRhdGEucHJvZmlsZVBpY3R1cmVVcmwgOiAnaW1nL2F2YXRhci5wbmcnO1xuICAgIH0pO1xuICAgIGluaXQoKTtcbiAgIFxuICAgICRzY29wZS5jYW4gPSBBY2xTZXJ2aWNlLmNhbjtcbiAgfSAvL2VuZCBvZiBjb250cm9sbGVyXG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUnKVxuICAgIC5jb250cm9sbGVyKCdNYWluU2lkZWJhckNvbnRyb2xsZXInLCBNYWluU2lkZWJhckNvbnRyb2xsZXIpO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLyoqXG4gICAqIEBuZ2RvYyBDb250cm9sbGVyXG4gICAqIEBuYW1lIFVzZXJzU2lkZWJhckNvbnRyb2xsZXJcbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLlVzZXJzXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBVc2Vyc1NpZGViYXJDb250cm9sbGVyIGlzIHVzZWQgdG8gbWFpbnRhaW4gdGhlIHVpIHN0YXRlIGZvciBzaWRlYmFyXG4gICAqXG4gICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAqL1xuICAvKiBAbmdJbmplY3QgKi9cbiAgZnVuY3Rpb24gVXNlcnNTaWRlYmFyQ29udHJvbGxlcihQcmluY2lwYWwsIExvZ2dlciwgQWNsU2VydmljZSwgJHNjb3BlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG5cbiAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgTG9nZ2VyLmdldEluc3RhbmNlKCdVc2Vyc1NpZGViYXJDb250cm9sbGVyJykuaW5mbygnQ29udHJvbGxlciBoYXMgaW5pdGlhbGl6ZWQnKTtcbiAgICB9XG5cbiAgICBQcmluY2lwYWwuaWRlbnRpdHkodHJ1ZSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgc2VsZi51c2VyID0gZGF0YTtcbiAgICAgIHNlbGYucHJvZmlsZVBpYyA9IChkYXRhLnByb2ZpbGVQaWN0dXJlVXJsICE9PSAnJykgPyBkYXRhLnByb2ZpbGVQaWN0dXJlVXJsIDogJ2ltZy9hdmF0YXIucG5nJztcbiAgICB9KTtcbiAgICBpbml0KCk7XG4gICBcbiAgICAkc2NvcGUuY2FuID0gQWNsU2VydmljZS5jYW47XG4gIH0gLy9lbmQgb2YgY29udHJvbGxlclxuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLlVzZXJzJylcbiAgICAuY29udHJvbGxlcignVXNlcnNTaWRlYmFyQ29udHJvbGxlcicsIFVzZXJzU2lkZWJhckNvbnRyb2xsZXIpO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLyoqXG4gICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuVXNlcnMuY29uZmlnLkNyZWF0ZVVzZXJTdGF0ZVxuICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuVXNlcnNcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZSB1c2VyXG4gICAqXG4gICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAqL1xuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5Vc2VycycpXG4gICAgLmNvbmZpZyhDcmVhdGVVc2VyU3RhdGUpO1xuXG4gIC8qIEBuZ0luamVjdCAqL1xuICBmdW5jdGlvbiBDcmVhdGVVc2VyU3RhdGUoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgLnN0YXRlKCd1c2Vycy5jcmVhdGUnLCB7XG4gICAgICAgIHBhcmVudDogJ3VzZXJzJyxcbiAgICAgICAgdXJsOiAnL2NyZWF0ZScsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICByb2xlczogWydST0xFX0FETUlOJywgJ1JPTEVfU1lTVEVNX0FETUlOJ10sXG4gICAgICAgICAgcGFnZVRpdGxlOiAnY3JlYXRldXNlci50aXRsZSdcbiAgICAgICAgfSxcbiAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAndXNlcnMnOiB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ21vZHVsZXMvdXNlcnMvY3JlYXRlL2NyZWF0ZS5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDcmVhdGVVc2VyQ29udHJvbGxlciBhcyBfc2VsZidcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICB0cmFuc2xhdGVQYXJ0aWFsTG9hZGVyOiBbJyR0cmFuc2xhdGUnLCAnJHRyYW5zbGF0ZVBhcnRpYWxMb2FkZXInLCBmdW5jdGlvbiAoJHRyYW5zbGF0ZSwgJHRyYW5zbGF0ZVBhcnRpYWxMb2FkZXIpIHtcbiAgICAgICAgICAgICR0cmFuc2xhdGVQYXJ0aWFsTG9hZGVyLmFkZFBhcnQoJ2NyZWF0ZS11c2VyJyk7XG4gICAgICAgICAgICByZXR1cm4gJHRyYW5zbGF0ZS5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG5cbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgLnN0YXRlKCd1c2Vycy51cGRhdGUnLCB7XG4gICAgICAgIHBhcmVudDogJ3VzZXJzJyxcbiAgICAgICAgdXJsOiAnL3VwZGF0ZS86dXNlcl9pZCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICByb2xlczogWydST0xFX0FETUlOJywgJ1JPTEVfU1lTVEVNX0FETUlOJ10sXG4gICAgICAgICAgcGFnZVRpdGxlOiAnY3JlYXRldXNlci51cGRhdGVfdGl0bGUnXG4gICAgICAgIH0sXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgJ3VzZXJzJzoge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdtb2R1bGVzL3VzZXJzL2NyZWF0ZS91cGRhdGUuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQ3JlYXRlVXNlckNvbnRyb2xsZXIgYXMgX3NlbGYnXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgdHJhbnNsYXRlUGFydGlhbExvYWRlcjogWyckdHJhbnNsYXRlJywgJyR0cmFuc2xhdGVQYXJ0aWFsTG9hZGVyJywgZnVuY3Rpb24gKCR0cmFuc2xhdGUsICR0cmFuc2xhdGVQYXJ0aWFsTG9hZGVyKSB7XG4gICAgICAgICAgICAkdHJhbnNsYXRlUGFydGlhbExvYWRlci5hZGRQYXJ0KCdjcmVhdGUtdXNlcicpO1xuICAgICAgICAgICAgcmV0dXJuICR0cmFuc2xhdGUucmVmcmVzaCgpO1xuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICB9XG4gICAgICB9KTtcblxuXG4gIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLyoqXG4gICAqIEBuZ2RvYyBDb250cm9sbGVyXG4gICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuVXNlcnMuQ29udHJvbGxlci5DcmVhdGVVc2VyQ29udHJvbGxlclxuICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuVXNlcnNcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZVVzZXJDb250cm9sbGVyIGlzIHJlc3BvbnNpYmxlIGV2ZXJ5IGFjdGlvbiBvbiBsaXN0IHZpZXcgcGFnZVxuICAgKlxuICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgKi9cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuVXNlcnMnKVxuICAgIC5jb250cm9sbGVyKCdDcmVhdGVVc2VyQ29udHJvbGxlcicsIENyZWF0ZVVzZXJDb250cm9sbGVyKTtcblxuICAvKiBAbmdJbmplY3QgKi9cbiAgZnVuY3Rpb24gQ3JlYXRlVXNlckNvbnRyb2xsZXIoJHN0YXRlLCBMb2dnZXIsIFVzZXJzTW9kZWwsIFNwaW5uZXIsIFVzZXJzRmFjdG9yeSwgbm90aWZ5LCAkZmlsdGVyLCBSZXNwb25zZUhhbmRsZXIsICRtb2RhbCwgQXV0aCwgUHJvamVjdHNGYWN0b3J5LCBQcm9qZWN0c01vZGVsKSB7XG4gICAgdmFyIF91c2VySWQsXG4gICAgICBzZWxmID0gdGhpcztcblxuICAgICAgc2VsZi5wcm9qZWN0cyA9IFByb2plY3RzTW9kZWwucHJvamVjdHNMaXN0IHx8IFtdO1xuXG5cbiAgICBpbml0KCk7XG4gICAgLyoqXG4gICAgICogW2luaXQgZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgTG9nZ2VyLmdldEluc3RhbmNlKCdDcmVhdGVVc2VyQ29udHJvbGxlcicpLmluZm8oJ0NvbnRyb2xsZXIgaGFzIGluaXRpYWxpemVkJyk7XG4gICAgICBzZWxmLnBhZ2VUaXRsZSA9ICRzdGF0ZS5jdXJyZW50LmRhdGEucGFnZVRpdGxlO1xuICAgICAgc2VsZi5yb2xlcyA9ICBBdXRoLnJvbGVzKCk7XG4gICAgICBnZXRVc2VyKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0VXNlciBmaW5kIHVzZXIgYnkgSUQgXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRVc2VyKCkge1xuICAgICAgX3VzZXJJZCA9ICRzdGF0ZS5wYXJhbXMudXNlcl9pZCA/IHBhcnNlSW50KCRzdGF0ZS5wYXJhbXMudXNlcl9pZCkgOiBudWxsO1xuICAgICAgaWYgKCFfdXNlcklkKSB7XG4gICAgICAgIHNlbGYudXNlciA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCBVc2Vyc01vZGVsLnVzZXIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIFVzZXJzTW9kZWwuZmluZCh7XG4gICAgICAgICdpZCc6IF91c2VySWRcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24odXNlcikge1xuICAgICAgICBwYXJzZVVzZXJSZXNwb25zZSh1c2VyKTtcbiAgICAgIH0pLmNhdGNoKFVzZXJzRmFjdG9yeS5lcnJvckhhbmRsZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBwYXJzZVVzZXJSZXNwb25zZSB1cGRhdGVzIHNlbGYudXNlciBtb2RlbFxuICAgICAqIFxuICAgICAqIEBwYXJhbSAge29iamVjdCB8IGFycmF5fSB1c2VyIFVzZXIgT2JqZWN0XG4gICAgICogQHJldHVybiB7W3ZvaWRdfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBhcnNlVXNlclJlc3BvbnNlKHVzZXIpIHtcbiAgICAgIHZhciBfdXNlciA9IGFuZ3VsYXIuY29weSh1c2VyKTtcbiAgICAgIF91c2VyLnJvbGVzID0gVXNlcnNGYWN0b3J5LmdldFJvbGVzQnlUeXBlcyh1c2VyLnJvbGVzKTtcbiAgICAgIHNlbGYudXNlciA9IF91c2VyO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogc2F2ZVVzZXJcbiAgICAgKiBDcmVhdGUvVXBkYXRlIHVzZXJcbiAgICAgKiBcbiAgICAgKiBAcmVxdWlyZXMgc2VsZi51c2VyXG4gICAgICogc2VsZi51c2VyIG9iamVjdCBpcyBhIHVzZXIncyBkYXRhIHRvIGJlIHNlbnQgdG8gc2VydmVyIFxuICAgICAqIFxuICAgICAqIEBzZWUgVXNlck1vZGVsXG4gICAgICogQHNlZSBVc2VyUmVzb3VyY2VcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHNlbGYuc2F2ZVVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIC8qKlxuICAgICAgICogX3VzZXJcbiAgICAgICAqIGxldHMgY29weSB0aGUgc2VsZi51c2VyIHRvIGJyZWFrIHRoZSByZWZlcmVuY2UgbGlua1xuICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAqL1xuICAgICAgdmFyIF91c2VyID0gYW5ndWxhci5jb3B5KHNlbGYudXNlciksXG4gICAgICAvKipcbiAgICAgICAqIHJvbGVzXG4gICAgICAgKiBzdG9yZXMgYSBsaXN0IG9mIHVzZXIgcm9sZSdzIHR5cGUgKGV0YyBbJ0FETUlOJywgJ1RFU1RFUiddKVxuICAgICAgICogQHJldHVybiB7YXJyYXl9ICAgICAgIEFuIGFycmF5IG9mIHVzZXIncyByb2xlJ3MgdHlwZVxuICAgICAgICovXG4gICAgICAgIHJvbGVzID0gX3VzZXIucm9sZXMubWFwKGZ1bmN0aW9uKHJvbGUpIHtcbiAgICAgICAgICByZXR1cm4gcm9sZS50eXBlO1xuICAgICAgICB9KSxcbiAgICAgICAgcmVzb3VyY2U7XG4gICAgICAgIC8vdXBkYXRlIHVzZXIgcm9sZXNcbiAgICAgIF91c2VyLnJvbGVzID0gcm9sZXM7XG4gICAgICAvKipcbiAgICAgICAqIHJlbW92ZSBjb25maXJtX3Bhc3N3b3JkIHByb3BlcnR5IGZyb20gX3VzZXIgbW9kZWwsIGl0cyBub3QgcmVxdWlyZWQgdG8gc2VuZCBvbiBzZXJ2ZXJcbiAgICAgICAqIEBhY3Rpb24gT25DcmVhdGVcbiAgICAgICAqL1xuICAgICAgaWYgKF91c2VyLmhhc093blByb3BlcnR5KCdjb25maXJtX3Bhc3N3b3JkJykpIHtcbiAgICAgICAgZGVsZXRlIF91c2VyLmNvbmZpcm1fcGFzc3dvcmQ7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqICByZW1vdmUgcGFzc3dvcmQgcHJvcGVydHkgZnJvbSBfdXNlciBtb2RlbCwgaXRzIG5vdCByZXF1aXJlZCB0byBzZW5kIG9uIHNlcnZlciBPblVwZGF0ZSBhY3Rpb25cbiAgICAgICAqICBAYWN0aW9uIE9uVXBkYXRlXG4gICAgICAgKi9cbiAgICAgIGlmIChfdXNlcklkICYmIF91c2VyLmhhc093blByb3BlcnR5KCdwYXNzd29yZCcpKSB7XG4gICAgICAgIGRlbGV0ZSBfdXNlci5wYXNzd29yZDtcbiAgICAgIH1cbiAgICAgIFNwaW5uZXIuc2hvdygpO1xuXG4gICAgICByZXNvdXJjZSA9IF91c2VySWQgPyBVc2Vyc01vZGVsLnVwZGF0ZSh7XG4gICAgICAgIGlkOiBfdXNlci5pZFxuICAgICAgfSwgX3VzZXIpIDogVXNlcnNNb2RlbC5jcmVhdGUoX3VzZXIpO1xuXG4gICAgICByZXNvdXJjZS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICBTcGlubmVyLmhpZGUoKTtcbiAgICAgICAgaWYocmVzcG9uc2UudHlwZSA9PT0gJ0VSUk9SJyl7XG4gICAgICAgICAgbm90aWZ5LmVycm9yKHtcbiAgICAgICAgICAgIHRpdGxlIDogJ0Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2UgOiAkZmlsdGVyKCd0cmFuc2xhdGUnKSgnU0VSVkVSLicgKyByZXNwb25zZS5jb2RlKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICRzdGF0ZS5nbygndXNlcnMubGlzdCcpO1xuICAgICAgICBub3RpZnkuc3VjY2Vzcyh7XG4gICAgICAgICAgJ3RpdGxlJzogJ1N1Y2Nlc3MnLFxuICAgICAgICAgICdtZXNzYWdlJzogJGZpbHRlcigndHJhbnNsYXRlJykoJ2NyZWF0ZXVzZXIubWVzc2FnZS5zdWNjZXNzLnVzZXJfc2F2ZWQnLCB7XG4gICAgICAgICAgICB1c2VyX25hbWU6IF91c2VyLmZpcnN0TmFtZVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgIFxuICAgICAgfSkuY2F0Y2goUmVzcG9uc2VIYW5kbGVyLmVycm9yKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogb3BlblBob3RvTW9kYWxcbiAgICAgKiBsYXVuY2ggbW9kYWwgdG8gdXBsb2FkIHVzZXIncyBwcm9maWxlIHBob3RvXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHNlbGYub3BlblBob3RvTW9kYWwgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuICAgICAgICBhbmltYXRpb246IHRydWUsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnbW9kdWxlcy91c2Vycy91cGRhdGUtdXNlci1waG90by91cGRhdGUtdXNlci1waG90by5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1VwZGF0ZVVzZXJQaG90b0NvbnRyb2xsZXIgYXMgbW9kYWxDdHJsJyxcbiAgICAgICAgc2l6ZTonJyxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgIHNlbGVjdGVkVXNlciA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi51c2VyO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBnZXRQcm9qZWN0c1xuICAgICAqIFJldHJpZXZlcyBhIGxpc3Qgb2YgYXZhaWxhYmxlIHByb2plY3Qgb2YgbG9nZ2VkIGluIHVzZXJzXG4gICAgICpcbiAgICAgKiBAc2VlIFByb2plY3RzRmFjdG9yeS5nZXRQcm9qZWN0cyhvcHRpb25zKVxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0UHJvamVjdHMoKSB7XG4gICAgICBQcm9qZWN0c0ZhY3RvcnkuZ2V0UHJvamVjdHMoe1xuICAgICAgICAncGFnZSc6IDEsXG4gICAgICAgICdwZXJfcGFnZSc6IDk5OTk5OSxcbiAgICAgICAgJ3ByZWRpY2F0ZSc6ICduYW1lJyxcbiAgICAgICAgJ2lzU29ydFJldmVyc2UnOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gICAgZ2V0UHJvamVjdHMoKTtcblxuICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG4gIC8qKlxuICAgKiBAbmdkb2Mgb3ZlcnZpZXdcbiAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5QYWdlc1xuICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuUGFnZXNcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFBhZ2VzIG1vZHVsZSByZXNwb25zaWJsZSBmb3IgYWxsIHN0YXRpYyBwYWdlc1xuICAgKlxuICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgKi9cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuUGFnZXMnLCBbXSk7XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvKipcbiAgICogQG5nZG9jIG92ZXJ2aWV3XG4gICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuUGFnZXMuUHJpdmFjeVBvbGljeVN0YXRlQ29uZmlnXG4gICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5QYWdlc1xuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogU3RhdGljIHBhZ2Ugc3RhdGVzXG4gICAqXG4gICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAqL1xuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5QYWdlcycpXG4gICAgLmNvbmZpZyhQcml2YWN5UG9saWN5U3RhdGVDb25maWcpO1xuXG4gIC8qIEBuZ0luamVjdCAqL1xuICBmdW5jdGlvbiBQcml2YWN5UG9saWN5U3RhdGVDb25maWcoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgLnN0YXRlKCdwYWdlLnByaXZhY3lwb2xpY3knLCB7XG4gICAgICAgIHVybDogJy9wcml2YWN5LXBvbGljeScsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICByb2xlczogW10sXG4gICAgICAgICAgcGFnZVRpdGxlOiAnUHJpdmFjeSBQb2xpY3knXG4gICAgICAgIH0sXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgJ3BhZ2UtY29udGVudCc6IHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbW9kdWxlcy9wYWdlcy9wcml2YWN5LXBvbGljeS9wcml2YWN5LXBvbGljeS5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcml2YWN5UG9saWN5Q29udHJvbGxlcidcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvKipcbiAgICogQG5nZG9jIENvbnRyb2xsZXJcbiAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5QYWdlcy5Db250cm9sbGVyLlByaXZhY3lQb2xpY3lDb250cm9sbGVyXG4gICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5QYWdlc1xuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUHJpdmFjeVBvbGljeUNvbnRyb2xsZXIgaXMgcmVzcG9uc2libGUgZm9yIHByaXZhY3kgcG9saWN5IHBhZ2VcbiAgICpcbiAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICovXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLlBhZ2VzJylcbiAgICAuY29udHJvbGxlcignUHJpdmFjeVBvbGljeUNvbnRyb2xsZXInLCBQcml2YWN5UG9saWN5Q29udHJvbGxlcik7XG5cbiAgLyogQG5nSW5qZWN0ICovXG4gIGZ1bmN0aW9uIFByaXZhY3lQb2xpY3lDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlLCBMb2dnZXIpIHtcbiAgICB2YXIgbG9nZ2VyO1xuICAgIGluaXQoKTtcblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICBzZXRMb2dnZXIoKTtcbiAgICAgICRzY29wZS5wYWdlVGl0bGUgPSAkc3RhdGUuY3VycmVudC5kYXRhLnBhZ2VUaXRsZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogW3NldExvZ2dlciBkZXNjcmlwdGlvbl1cbiAgICAgKiBAbWV0aG9kIHNldExvZ2dlclxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0TG9nZ2VyKCkge1xuICAgICAgbG9nZ2VyID0gTG9nZ2VyLmdldEluc3RhbmNlKCdQcml2YWN5UG9saWN5Q29udHJvbGxlcicpO1xuICAgICAgbG9nZ2VyLmluZm8oJ0NvbnRyb2xsZXIgaGFzIGluaXRpYWxpemVkJyk7XG4gICAgfVxuICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvKipcbiAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5Vc2Vycy5jb25maWcuVXNlcnNMaXN0U3RhdGVcbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLlVzZXJzXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBVc2VycyBsaXN0IHJvdXRlIGNvbmZpZ3VyYXRpb25zXG4gICAqXG4gICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAqL1xuICAvKiBAbmdJbmplY3QgKi9cbiAgZnVuY3Rpb24gVXNlcnNMaXN0U3RhdGUoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgLnN0YXRlKCd1c2Vycy5saXN0Jywge1xuICAgICAgICBwYXJlbnQ6ICd1c2VycycsXG4gICAgICAgIHVybDogJy9saXN0JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJvbGVzOiBbJ1JPTEVfQURNSU4nLCAnUk9MRV9TWVNURU1fQURNSU4nLCAnUk9MRV9QUk9KRUNUX09XTkVSJ10sXG4gICAgICAgICAgcGFnZVRpdGxlOiAndXNlcnNsaXN0LnRpdGxlJ1xuICAgICAgICB9LFxuICAgICAgICB2aWV3czoge1xuICAgICAgICAgICd1c2Vycyc6IHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbW9kdWxlcy91c2Vycy9saXN0L2xpc3QuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnVXNlcnNMaXN0Q29udHJvbGxlciBhcyBfc2VsZidcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICB0cmFuc2xhdGVQYXJ0aWFsTG9hZGVyOiBbJyR0cmFuc2xhdGUnLCAnJHRyYW5zbGF0ZVBhcnRpYWxMb2FkZXInLCBmdW5jdGlvbigkdHJhbnNsYXRlLCAkdHJhbnNsYXRlUGFydGlhbExvYWRlcikge1xuICAgICAgICAgICAgJHRyYW5zbGF0ZVBhcnRpYWxMb2FkZXIuYWRkUGFydCgndXNlcnMtbGlzdCcpO1xuICAgICAgICAgICAgcmV0dXJuICR0cmFuc2xhdGUucmVmcmVzaCgpO1xuICAgICAgICAgIH1dXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuVXNlcnMnKVxuICAgIC5jb25maWcoVXNlcnNMaXN0U3RhdGUpO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvKipcbiAgICogQG5nZG9jIENvbnRyb2xsZXJcbiAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5Vc2Vycy5Db250cm9sbGVyLlVzZXJzTGlzdENvbnRyb2xsZXJcbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLlVzZXJzXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBVc2Vyc0xpc3RDb250cm9sbGVyIGlzIHJlc3BvbnNpYmxlIGV2ZXJ5IGFjdGlvbiBvbiBsaXN0IHZpZXcgcGFnZVxuICAgKlxuICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgKi9cblxuICAvKiBAbmdJbmplY3QgKi9cbiAgZnVuY3Rpb24gVXNlcnNMaXN0Q29udHJvbGxlcigkc2NvcGUsICRzdGF0ZSwgTG9nZ2VyLCBVc2Vyc01vZGVsLCBVc2Vyc0ZhY3RvcnksIFNwaW5uZXIsIF8kbW9kYWwsICRmaWx0ZXIsIG5vdGlmeSwgJHRyYW5zbGF0ZSwgQVBQX0NPTkZJRywgQWNsU2VydmljZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNlbGYudXNlcnMgPSBVc2Vyc01vZGVsLnVzZXJzbGlzdCB8fCBbXTtcbiAgICBpbml0KCk7XG4gICAgLyoqXG4gICAgICogaW5pdGlhbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICogXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICBMb2dnZXIuZ2V0SW5zdGFuY2UoJ1VzZXJzTGlzdENvbnRyb2xsZXInKS5pbmZvKCdDb250cm9sbGVyIGhhcyBpbml0aWFsaXplZCcpO1xuICAgICAvLyAkc2NvcGUucGFnZVRpdGxlID0gJHN0YXRlLmN1cnJlbnQuZGF0YS5wYWdlVGl0bGU7XG5cbiAgICAgIHNlbGYubWF4U2l6ZSA9IDU7XG4gICAgICBzZWxmLmN1cnJlbnRQYWdlID0gMTtcbiAgICAgIHNlbGYucGVyUGFnZSA9IEFQUF9DT05GSUcuaXRlbV9wZXJfcGFnZTtcbiAgICAgIHNlbGYucHJlZGljYXRlID0gJ2lkJztcbiAgICAgIHNlbGYuaXNTb3J0UmV2ZXJzZSA9IHRydWU7XG4gICAgICBnZXRBbGxVc2VycygpO1xuICAgICAgY29uc29sZS5sb2coJ2RoYXNqaGQga2FzamFoZGFzZHNhIGRhc2Rhc2Qgc2RhZGFzJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcGFnZUNoYW5nZWQgaXMgY2FsbGVkIHdoZW4gcGFnaW5hdGlvbiBpcyBjaGFuZ2VkXG4gICAgICpcbiAgICAgKiBAcHVibGljXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBzZWxmLnBhZ2VDaGFuZ2VkID0gZnVuY3Rpb24oKSB7XG4gICAgICBTcGlubmVyLnNob3coKTtcbiAgICAgIGdldEFsbFVzZXJzKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIHNvcnRDb2x1bW5CeSBpcyBjYWxsZWQgd2hlbiB0YWJsZSBjb2x1bW4gaGVhZGVycyBhcmUgY2xpY2tlZFxuICAgICAqXG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgc2VsZi5zb3J0Q29sdW1uQnkgPSBmdW5jdGlvbihwcmVkaWNhdGUpIHtcbiAgICAgIHNlbGYuaXNTb3J0UmV2ZXJzZSA9IChzZWxmLnByZWRpY2F0ZSA9PT0gcHJlZGljYXRlKSA/ICFzZWxmLmlzU29ydFJldmVyc2UgOiBmYWxzZTtcbiAgICAgIHNlbGYucHJlZGljYXRlID0gcHJlZGljYXRlO1xuICAgICAgc2VsZi5jdXJyZW50UGFnZSA9IDE7XG4gICAgICBnZXRBbGxVc2VycygpO1xuICAgIH07XG5cbiAgICBzZWxmLmlzU29ydENvbHVtbkJ5ID0gZnVuY3Rpb24ocHJlZGljYXRlKSB7XG4gICAgICByZXR1cm4gKHByZWRpY2F0ZSA9PT0gc2VsZi5wcmVkaWNhdGUpID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBwYXJzZSBnZXRBbGx1c2VycyByZXNwb25zZVxuICAgICAqIEBwYXJhbSAge0FycmF5fE9iamVjdH0gcmVzcG9uc2VEYXRhXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEByZXR1cm4ge1ZvaWR9XG4gICAgICovXG4gICAgZnVuY3Rpb24gcGFyc2VSZXNwb25zZShyZXNwb25zZURhdGEpIHtcbiAgICAgIGlmIChyZXNwb25zZURhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIFVzZXJzTW9kZWwudXNlcnNsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3BvbnNlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBVc2Vyc01vZGVsLnVzZXJzbGlzdC5wdXNoKHJlc3BvbnNlRGF0YVtpXSk7XG4gICAgICB9XG4gICAgICBTcGlubmVyLmhpZGUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgQWxsIHVzZXJzXG4gICAgICpcbiAgICAgKiBAcmVxdWlyZXMgcGFnZVxuICAgICAqIEByZXF1aXJlcyBwZXJfcGFnZVxuICAgICAqIEByZXF1aXJlcyBzb3J0X3F1ZXJ5XG4gICAgICogXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRBbGxVc2VycygpIHtcbiAgICAgIHZhciBfc29ydEJ5ID0gc2VsZi5pc1NvcnRSZXZlcnNlID8gJy0nIDogJyc7XG4gICAgICBVc2Vyc01vZGVsLmZpbmRBbGwoe1xuICAgICAgICAncGFnZSc6IHNlbGYuY3VycmVudFBhZ2UsXG4gICAgICAgICdwZXJfcGFnZSc6IHNlbGYucGVyUGFnZSxcbiAgICAgICAgJ3NvcnRfcXVlcnknOiBfc29ydEJ5ICsgc2VsZi5wcmVkaWNhdGVcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24oc3VjY2Vzc1Jlc3BvbnNlKSB7XG4gICAgICAgIHNlbGYudG90YWxDb3VudCA9IHN1Y2Nlc3NSZXNwb25zZS50b3RhbENvdW50O1xuICAgICAgICBwYXJzZVJlc3BvbnNlKHN1Y2Nlc3NSZXNwb25zZS5saXN0KTtcbiAgICAgIH0pLmNhdGNoKFVzZXJzRmFjdG9yeS5lcnJvckhhbmRsZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBkZWxldGUgdXNlciBieSB1c2VySWRcbiAgICAgKiB0aGlzIGlzIHNvZnQgZGVsZXRlXG4gICAgICogXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSB1c2VyXG4gICAgICpcbiAgICAgKiBAcHVibGljXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBzZWxmLmRlbGV0ZVVzZXIgPSBmdW5jdGlvbih1c2VyKSB7XG4gICAgICB2YXIgX3VzZXJJZCA9IHBhcnNlSW50KHVzZXIuaWQpO1xuICAgICAgXyRtb2RhbFxuICAgICAgICAuY29uZmlybSgkZmlsdGVyKCd0cmFuc2xhdGUnKSgndXNlcnNsaXN0LmNvbmZpcm1fbW9kYWwuZGVsZXRlLmhlYWRlcicpLCAkZmlsdGVyKCd0cmFuc2xhdGUnKSgndXNlcnNsaXN0LmNvbmZpcm1fbW9kYWwuZGVsZXRlLm1zZycpLCB7XG4gICAgICAgICAgJ3NpemUnOiAnc20nXG4gICAgICAgIH0pXG4gICAgICAgIC5yZXN1bHRcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oYnRuKSB7XG4gICAgICAgICAgVXNlcnNNb2RlbC5kZWxldGUoe1xuICAgICAgICAgICAgJ2lkJzogX3VzZXJJZFxuICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS50eXBlID09PSAnRVJST1InKSB7XG4gICAgICAgICAgICAgIG5vdGlmeS5lcnJvcih7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdFcnJvcicsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJGZpbHRlcigndHJhbnNsYXRlJykoJ1NFUlZFUi4nICsgcmVzcG9uc2UuY29kZSlcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBub3RpZnkuc3VjY2Vzcyh7XG4gICAgICAgICAgICAgICd0aXRsZSc6ICdTdWNjZXNzJyxcbiAgICAgICAgICAgICAgJ21lc3NhZ2UnOiAkZmlsdGVyKCd0cmFuc2xhdGUnKSgndXNlcnNsaXN0Lm1lc3NhZ2Uuc3VjY2Vzcy51c2VyX2RlbGV0ZWQnLCB7XG4gICAgICAgICAgICAgICAgdXNlcl9uYW1lOiB1c2VyLmZpcnN0TmFtZVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBVc2Vyc01vZGVsLmV4Y2x1ZGVVc2VyKF91c2VySWQpO1xuXG4gICAgICAgICAgfSkuY2F0Y2goVXNlcnNGYWN0b3J5LmVycm9ySGFuZGxlcik7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGJ0bikge1xuICAgICAgICAgIC8vZXJyb3IgY2FsbGJhY2tcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiB1cGRhdGUgdXNlcidzIHN0YXR1c1xuICAgICAqIFxuICAgICAqIEBwYXJhbSAge29iamVjdH0gdXNlclxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgc2VsZi51cGRhdGVVc2VyU3RhdHVzID0gZnVuY3Rpb24odXNlcikge1xuICAgICAgdmFyIF91c2VySWQgPSBwYXJzZUludCh1c2VyLmlkKTtcbiAgICAgIHZhciBtb2RhbEtleXMgPSB7XG4gICAgICAgIGhlYWRlcjogdXNlci5hY3RpdmUgPyAndXNlcnNsaXN0LmNvbmZpcm1fbW9kYWwuZGlzYWJsZS5oZWFkZXInIDogJ3VzZXJzbGlzdC5jb25maXJtX21vZGFsLmVuYWJsZS5oZWFkZXInLFxuICAgICAgICBtZXNzYWdlOiB1c2VyLmFjdGl2ZSA/ICd1c2Vyc2xpc3QuY29uZmlybV9tb2RhbC5kaXNhYmxlLm1zZycgOiAndXNlcnNsaXN0LmNvbmZpcm1fbW9kYWwuZW5hYmxlLm1zZydcbiAgICAgIH07XG4gICAgICBfJG1vZGFsXG4gICAgICAgIC5jb25maXJtKCRmaWx0ZXIoJ3RyYW5zbGF0ZScpKG1vZGFsS2V5cy5oZWFkZXIpLCAkZmlsdGVyKCd0cmFuc2xhdGUnKShtb2RhbEtleXMubWVzc2FnZSksIHtcbiAgICAgICAgICAnc2l6ZSc6ICdzbSdcbiAgICAgICAgfSlcbiAgICAgICAgLnJlc3VsdFxuICAgICAgICAudGhlbihmdW5jdGlvbihidG4pIHtcbiAgICAgICAgICBVc2Vyc01vZGVsLnVwZGF0ZVN0YXR1cyh7XG4gICAgICAgICAgICBpZDogX3VzZXJJZCxcbiAgICAgICAgICAgIGFjdGlvbjogJ2FjdGl2YXRlJyxcbiAgICAgICAgICAgIGFjdGlvbl92YWx1ZTogIXVzZXIuYWN0aXZlXG4gICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnR5cGUgPT09ICdFUlJPUicpIHtcbiAgICAgICAgICAgICAgbm90aWZ5LmVycm9yKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0Vycm9yJyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAkZmlsdGVyKCd0cmFuc2xhdGUnKSgnU0VSVkVSLicgKyByZXNwb25zZS5jb2RlKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdHJhbnNsYXRlZE1lc3NhZ2UgPSAkZmlsdGVyKCd0cmFuc2xhdGUnKSgndXNlcnNsaXN0Lm1lc3NhZ2Uuc3VjY2Vzcy51c2VyX3N0YXR1cycsIHtcbiAgICAgICAgICAgICAgdXNlcl9uYW1lOiB1c2VyLmZpcnN0TmFtZSxcbiAgICAgICAgICAgICAgc3RhdHVzX2FjdGlvbjogdXNlci5hY3RpdmUgPyAnZGlzYWJsZWQnIDogJ2VuYWJsZWQnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG5vdGlmeS5zdWNjZXNzKHtcbiAgICAgICAgICAgICAgJ3RpdGxlJzogJ1N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAnbWVzc2FnZSc6IHRyYW5zbGF0ZWRNZXNzYWdlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdXNlci5hY3RpdmUgPSAhdXNlci5hY3RpdmU7XG5cbiAgICAgICAgICB9KS5jYXRjaChVc2Vyc0ZhY3RvcnkuZXJyb3JIYW5kbGVyKTtcblxuICAgICAgICB9LCBmdW5jdGlvbihidG4pIHtcbiAgICAgICAgICAvL2Vycm9yIGNhbGxiYWNrXG4gICAgICAgIH0pO1xuXG4gICAgfTtcbiAgICBcbiAgICAkc2NvcGUuY2FuID0gQWNsU2VydmljZS5jYW47XG5cbiAgfSAvL2VuZCBvZiBjb250cm9sbGVyXG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuVXNlcnMnKVxuICAgIC5jb250cm9sbGVyKCdVc2Vyc0xpc3RDb250cm9sbGVyJywgVXNlcnNMaXN0Q29udHJvbGxlcik7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG4gIC8qKlxuICAgKiBAbmdkb2Mgb3ZlcnZpZXdcbiAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5QYWdlcy5Db250YWN0U3VwcG9ydFN0YXRlQ29uZmlnXG4gICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5QYWdlc1xuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogU3RhdGljIHBhZ2Ugc3RhdGVzXG4gICAqXG4gICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAqL1xuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5QYWdlcycpXG4gICAgLmNvbmZpZyhDb250YWN0U3VwcG9ydFN0YXRlQ29uZmlnKTtcblxuICAvKiBAbmdJbmplY3QgKi9cbiAgZnVuY3Rpb24gQ29udGFjdFN1cHBvcnRTdGF0ZUNvbmZpZygkc3RhdGVQcm92aWRlcikge1xuICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgLnN0YXRlKCdwYWdlLmNvbnRhY3RzdXBwb3J0Jywge1xuICAgICAgICB1cmw6ICcvY29udGFjdC1zdXBwb3J0JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJvbGVzOiBbXSxcbiAgICAgICAgICBwYWdlVGl0bGU6ICdDb250YWN0IFN1cHBvcnQnXG4gICAgICAgIH0sXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgJ3BhZ2UtY29udGVudCc6IHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbW9kdWxlcy9wYWdlcy9jb250YWN0LXN1cHBvcnQvY29udGFjdC1zdXBwb3J0Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0NvbnRhY3RTdXBwb3J0Q29udHJvbGxlcidcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG4gIC8qKlxuICAgKiBAbmdkb2MgQ29udHJvbGxlclxuICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLlBhZ2VzLkNvbnRyb2xsZXIuQ29udGFjdFN1cHBvcnRDb250cm9sbGVyXG4gICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5QYWdlc1xuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ29udGFjdFN1cHBvcnRDb250cm9sbGVyIGlzIHJlc3BvbnNpYmxlIGZvciBjb250YWN0IHN1cHBvcnQgcGFnZVxuICAgKlxuICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgKi9cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuUGFnZXMnKVxuICAgIC5jb250cm9sbGVyKCdDb250YWN0U3VwcG9ydENvbnRyb2xsZXInLCBDb250YWN0U3VwcG9ydENvbnRyb2xsZXIpO1xuXG4gIC8qIEBuZ0luamVjdCAqL1xuICBmdW5jdGlvbiBDb250YWN0U3VwcG9ydENvbnRyb2xsZXIoJHNjb3BlLCAkc3RhdGUsIExvZ2dlcikge1xuICAgIHZhciBsb2dnZXI7XG4gICAgaW5pdCgpO1xuXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgIHNldExvZ2dlcigpO1xuICAgICAgJHNjb3BlLnBhZ2VUaXRsZSA9ICRzdGF0ZS5jdXJyZW50LmRhdGEucGFnZVRpdGxlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBbc2V0TG9nZ2VyIGRlc2NyaXB0aW9uXVxuICAgICAqIEBtZXRob2Qgc2V0TG9nZ2VyXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXRMb2dnZXIoKSB7XG4gICAgICBsb2dnZXIgPSBMb2dnZXIuZ2V0SW5zdGFuY2UoJ0NvbnRhY3RTdXBwb3J0Q29udHJvbGxlcicpO1xuICAgICAgbG9nZ2VyLmluZm8oJ0NvbnRyb2xsZXIgaGFzIGluaXRpYWxpemVkJyk7XG4gICAgfVxuICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvKipcbiAgICogQG5nZG9jIG92ZXJ2aWV3XG4gICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuUGFnZXMuSGVscFN0YXRlQ29uZmlnXG4gICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5QYWdlc1xuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogU3RhdGljIHBhZ2Ugc3RhdGVzXG4gICAqXG4gICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAqL1xuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5QYWdlcycpXG4gICAgLmNvbmZpZyhIZWxwU3RhdGVDb25maWcpO1xuXG4gIC8qIEBuZ0luamVjdCAqL1xuICBmdW5jdGlvbiBIZWxwU3RhdGVDb25maWcoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgLnN0YXRlKCdwYWdlLmhlbHAnLCB7XG4gICAgICAgIHVybDogJy9oZWxwJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJvbGVzOiBbXSxcbiAgICAgICAgICBwYWdlVGl0bGU6ICdDb250YWN0IFN1cHBvcnQnXG4gICAgICAgIH0sXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgJ3BhZ2UtY29udGVudCc6IHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbW9kdWxlcy9wYWdlcy9oZWxwL2hlbHAuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnSGVscENvbnRyb2xsZXInXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLyoqXG4gICAqIEBuZ2RvYyBDb250cm9sbGVyXG4gICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuUGFnZXMuQ29udHJvbGxlci5IZWxwQ29udHJvbGxlclxuICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuUGFnZXNcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEhlbHBDb250cm9sbGVyIGlzIHJlc3BvbnNpYmxlIGZvciBIZWxwIHBhZ2VcbiAgICpcbiAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICovXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLlBhZ2VzJylcbiAgICAuY29udHJvbGxlcignSGVscENvbnRyb2xsZXInLCBIZWxwQ29udHJvbGxlcik7XG5cbiAgLyogQG5nSW5qZWN0ICovXG4gIGZ1bmN0aW9uIEhlbHBDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlLCBMb2dnZXIpIHtcbiAgICB2YXIgbG9nZ2VyO1xuICAgIGluaXQoKTtcblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICBzZXRMb2dnZXIoKTtcbiAgICAgICRzY29wZS5wYWdlVGl0bGUgPSAkc3RhdGUuY3VycmVudC5kYXRhLnBhZ2VUaXRsZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogW3NldExvZ2dlciBkZXNjcmlwdGlvbl1cbiAgICAgKiBAbWV0aG9kIHNldExvZ2dlclxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0TG9nZ2VyKCkge1xuICAgICAgbG9nZ2VyID0gTG9nZ2VyLmdldEluc3RhbmNlKCdIZWxwQ29udHJvbGxlcicpO1xuICAgICAgbG9nZ2VyLmluZm8oJ0NvbnRyb2xsZXIgaGFzIGluaXRpYWxpemVkJyk7XG4gICAgfVxuICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyoqXG4gICAgICogQG5nZG9jIG92ZXJ2aWV3XG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5MaXN0aW5nXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkxpc3RpbmdcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIExpc3RpbmcgdGFzayBtb2R1bGVcbiAgICAgKiBAc2VlIExpc3RpbmcubW9kZWwuanNcbiAgICAgKiBAc2VlIExpc3RpbmcucmVzb3VyY2UuanNcbiAgICAgKlxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkxpc3RpbmcnLCBbJ3VpLmJvb3RzdHJhcCcsICdmbG93J10pXG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuTGlzdGluZycpLmNvbmZpZyhbJ2Zsb3dGYWN0b3J5UHJvdmlkZXInLCdDU1JGX1RPS0VOJywgZnVuY3Rpb24oZmxvd0ZhY3RvcnlQcm92aWRlciwgQ1NSRl9UT0tFTikge1xuICAgICAgICAgICAgLy8gQ2FuIGJlIHVzZWQgd2l0aCBkaWZmZXJlbnQgaW1wbGVtZW50YXRpb25zIG9mIEZsb3cuanNcbiAgICAgICAgICAgIC8vIGZsb3dGYWN0b3J5UHJvdmlkZXIuZmFjdG9yeSA9IGZ1c3R5Rmxvd0ZhY3Rvcnk7XG4gICAgICAgIH1dKTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgQ29udHJvbGxlclxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuU2VydmljZXByb3ZpZGVyLkNvbnRyb2xsZXIuQ3JlYXRlTGlzdGluZ0NvbnRyb2xsZXJcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuTGlzdGluZ1xuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQ3JlYXRlTGlzdGluZ0NvbnRyb2xsZXIgaXMgcmVzcG9uc2libGUgbWFuYWdlIGFjY291bnQgYWN0aXZpdGllc1xuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIENyZWF0ZUxpc3RpbmdDb250cm9sbGVyKENhdGVnb3JpZXNNb2RlbCwgJHN0YXRlLCAkcSwgdG9hc3RlciwgTGlzdGluZ01vZGVsLCBSZXNvbHZlRGF0YSwgdXRpbEZhY3RvcnksIExpc3RpbmdfdHlwZSwgU3VidXJic01vZGVsLFNwaW5uZXIpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgbGlzdF9pZDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogZ2V0IHN1YnVyYkxpc3RcbiAgICAgICAgICogXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBzZWxmLnN1YnVyYkxpc3QgPSBbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFtsaXN0aW5nIGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAdHlwZSB7W3R5cGVdfVxuICAgICAgICAgKi9cbiAgICAgICAgc2VsZi5saXN0aW5nID0gYW5ndWxhci5jb3B5KExpc3RpbmdNb2RlbC5saXN0aW5nU2NoZW1hKTtcbiAgICAgICAgc2VsZi5jYXRlZ29yaWVzID0gQ2F0ZWdvcmllc01vZGVsLmNhdGVnb3JpZXM7XG4gICAgICAgIHNlbGYuc3ViQ2F0ZWdvcmllcyA9IENhdGVnb3JpZXNNb2RlbC5zdWJDYXRlZ29yaWVzO1xuICAgICAgICBzZWxmLnBhcmVudENhdGVnb3J5ID0gQ2F0ZWdvcmllc01vZGVsLmNhdGVnb3JpZXNbMF07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGludm9rZSBmdW5jdGlvbiBvbiBjb250cm9sbGVyIGluaXRpYWxpemF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBpbml0KCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGluaXRpYWxpemUgcHJvcGVydGllc1xuICAgICAgICAgKiBcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG5cbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgIGxpc3RfaWQgPSAkc3RhdGUucGFyYW1zLmxpc3RfaWQgfHwgbnVsbDtcbiAgICAgICAgICAgIHZhciBjYXRlZ29yeVR5cGUgPSBSZXNvbHZlRGF0YS5jYXRlZ29yeVR5cGUsXG4gICAgICAgICAgICAgICAgcGFyZW50Q2F0ZWdvcnlJZDtcblxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5VHlwZS5oYXNPd25Qcm9wZXJ0eSgndHlwZV9jb2RlJykpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2F0ZWdvcnlUeXBlLnR5cGVfY29kZSA9PT0gJ2NsYXNzaWZpZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldENhdGVnb3JpZXMoY2F0ZWdvcnlUeXBlLnR5cGVfY29kZSwgY2F0ZWdvcnlUeXBlLmlkKS50aGVuKGZ1bmN0aW9uKGNhdGVnb3JpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIENhdGVnb3JpZXNNb2RlbC5jYXRlZ29yaWVzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShDYXRlZ29yaWVzTW9kZWwuY2F0ZWdvcmllcywgY2F0ZWdvcmllcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdldENhdGVnb3JpZXMoY2F0ZWdvcnlUeXBlLnR5cGVfY29kZSwgbnVsbCkudGhlbihmdW5jdGlvbihjYXRlZ29yaWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBDYXRlZ29yaWVzTW9kZWwuY2F0ZWdvcmllcy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoQ2F0ZWdvcmllc01vZGVsLmNhdGVnb3JpZXMsIGNhdGVnb3JpZXMpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChsaXN0X2lkKSB7XG4gICAgICAgICAgICAgICAgZ2V0TGlzdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNlbGYubGlzdGluZy5mbG93RmlsZXMgPSBbXTtcbiAgICAgICAgc2VsZi5mbG93Q29uZmlnID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRhcmdldDogJy91cGxvYWQnLFxuICAgICAgICAgICAgICAgIHBlcm1hbmVudEVycm9yczogWzQwNCwgNTAwLCA1MDFdLFxuICAgICAgICAgICAgICAgIG1heENodW5rUmV0cmllczogMSxcbiAgICAgICAgICAgICAgICBjaHVua1JldHJ5SW50ZXJ2YWw6IDUwMDAsXG4gICAgICAgICAgICAgICAgc2ltdWx0YW5lb3VzVXBsb2FkczogMSxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdYLUNTUkYtVE9LRU4nOiBjc3JmX3Rva2VuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBxdWVyeTogZnVuY3Rpb24oZmxvd0ZpbGUsIGZsb3dDaHVuaykge1xuICAgICAgICAgICAgICAgICAgICBTcGlubmVyLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGZvciBldmVyeSByZXF1ZXN0XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogbGlzdF9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogJ2Zsb3dfcXVlcnknXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuZmlsZVVwbG9hZFN1Y2Nlc3MgPSBmdW5jdGlvbigkZmlsZSwgJHJlcykge1xuICAgICAgICAgICAgJGZpbGUuaWQgPSAkcmVzO1xuICAgICAgICAgICAgc2VsZi5saXN0aW5nLmZsb3dGaWxlcy5wdXNoKCRyZXMpO1xuICAgICAgICAgICAgU3Bpbm5lci5zdG9wKCk7XG4gICAgICAgIH07XG5cblxuICAgICAgICBzZWxmLmNhbmNlbEZpbGUgPSBmdW5jdGlvbigkZmlsZSkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gc2VsZi5saXN0aW5nLmZsb3dGaWxlcy5pbmRleE9mKCRmaWxlLmlkKTtcbiAgICAgICAgICAgIHNlbGYubGlzdGluZy5mbG93RmlsZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIExpc3RpbmdNb2RlbC5jYW5jZWwoe1xuICAgICAgICAgICAgICAgIGlkOiAkZmlsZS5pZCxcbiAgICAgICAgICAgICAgICBsaXN0X2lkOiBsaXN0X2lkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRmaWxlLmNhbmNlbCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKiBkZWxldGUgaW1hZ2VcbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfVxuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19XG4gICAgICAgICAqL1xuXG4gICAgICAgIHNlbGYuZGVsZXRlSW1hZ2UgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgU3Bpbm5lci5zdGFydCgpO1xuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gc2VsZi5saXN0aW5nLmFzc2V0cykge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmxpc3RpbmcuYXNzZXRzW2luZGV4XS5pZCA9PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmxpc3RpbmcuYXNzZXRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIExpc3RpbmdNb2RlbC5jYW5jZWwoe1xuICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICBsaXN0X2lkOiBsaXN0X2lkXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHN1Y2Nlc3NSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgXCJJbWFnZSBEZWxldGVkXCIsIFwiSW1hZ2UgaGFzIGJlZW4gZGVsZXRlZC5cIik7XG4gICAgICAgICAgICAgICAgU3Bpbm5lci5zdG9wKCk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvclJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0RlbGV0aW5nIEltYWdlOicsIGVycm9yUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIFNwaW5uZXIuc3RvcCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0TGlzdCgpIHtcbiAgICAgICAgICAgIExpc3RpbmdNb2RlbC5maW5kKHtcbiAgICAgICAgICAgICAgICBpZDogbGlzdF9pZFxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZURhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VEYXRhLmRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5leHRlbmQoc2VsZi5saXN0aW5nLCByZXNwb25zZURhdGEuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubGlzdGluZy5jYXRlZ29yaWVzID0gKHNlbGYubGlzdGluZy5jYXRlZ29yaWVzICYmIHNlbGYubGlzdGluZy5jYXRlZ29yaWVzLmxlbmd0aCA+IDApID8gc2VsZi5saXN0aW5nLmNhdGVnb3JpZXNbMF0gOiB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZi5wYXJlbnRDYXRlZ29yeSA9IENhdGVnb3JpZXNNb2RlbC5jYXRlZ29yaWVzWzBdO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3JSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciB3aGlsZSBnZXR0aW5nIGxpc3QnLCBlcnJvclJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldENhdGVnb3JpZXModHlwZSwgcGFyZW50KSB7XG4gICAgICAgICAgICB2YXIgZGVmZmVyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgQ2F0ZWdvcmllc01vZGVsLmFsbCh7XG4gICAgICAgICAgICAgICAgJ2NhdF90eXBlJzogdHlwZSxcbiAgICAgICAgICAgICAgICAnY2F0X3BhcmVudCc6IHBhcmVudCB8fCBudWxsXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgZGVmZmVyZWQucmVzb2x2ZShyZXNwb25zZS5saXN0KTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGRlZmZlcmVkLnJlc29sdmUoW10pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBkZWZmZXJlZC5wcm9taXNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuc2VsZWN0Q2F0ZWdvcnkgPSBmdW5jdGlvbigkaXRlbSwgJG1vZGVsKSB7XG4gICAgICAgICAgICBnZXRDYXRlZ29yaWVzKFJlc29sdmVEYXRhLmNhdGVnb3J5VHlwZS50eXBlX2NvZGUsICRtb2RlbC5pZCkudGhlbihmdW5jdGlvbihzdWJDYXRlZ29yaWVzKSB7XG4gICAgICAgICAgICAgICAgQ2F0ZWdvcmllc01vZGVsLnN1YkNhdGVnb3JpZXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShDYXRlZ29yaWVzTW9kZWwuc3ViQ2F0ZWdvcmllcywgc3ViQ2F0ZWdvcmllcyk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBzYXZlZm9ybSBkYXRhXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cblxuICAgICAgICBzZWxmLnNhdmVsaXN0aW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgU3Bpbm5lci5zdGFydCgpO1xuICAgICAgICAgICAgdmFyIF9saXN0ID0gYW5ndWxhci5jb3B5KHNlbGYubGlzdGluZyksXG4gICAgICAgICAgICAgICAgcmVzb3VyY2U7XG4gICAgICAgICAgICBfbGlzdC5sb2NhdGlvbnMgPSBfLm1hcChfbGlzdC5sb2NhdGlvbnMsIGZ1bmN0aW9uKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxvY2F0aW9uLmlkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBfbGlzdC5jYXRlZ29yaWVzID0gX2xpc3QuY2F0ZWdvcmllcyA/IFtfbGlzdC5jYXRlZ29yaWVzLmlkXSA6IFtdO1xuICAgICAgICAgICAgcmVzb3VyY2UgPSBsaXN0X2lkID8gTGlzdGluZ01vZGVsLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgaWQ6IGxpc3RfaWRcbiAgICAgICAgICAgIH0sIF9saXN0KSA6IExpc3RpbmdNb2RlbC5zYXZlKHtcbiAgICAgICAgICAgICAgICAnZGF0YSc6IF9saXN0LFxuICAgICAgICAgICAgICAgICd0eXBlJzogTGlzdGluZ190eXBlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmVzb3VyY2UudGhlbihmdW5jdGlvbihzdWNjZXNzUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgU3Bpbm5lci5zdG9wKCk7XG4gICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCBcIkxpc3RpbmcgU2F2ZWRcIiwgXCJMaXN0aW5nIGhhcyBiZWVuIHNhdmVkLlwiKTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xpc3RpbmcubGlzdCcpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3JSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICBTcGlubmVyLnN0b3AoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2F2aW5nIGxpc3Rpbmc6JywgZXJyb3JSZXNwb25zZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX1cbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfVxuICAgICAgICAgKi9cbiAgICAgICAgc2VsZi5nZXRMb2NhdGlvbiA9IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgaWYgKHZhbC5sZW5ndGggPCAzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgU3VidXJic01vZGVsXG4gICAgICAgICAgICAgICAgLmZpbmRMb2NhdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICdxJzogdmFsXG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihzdWNjZXNzUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zdWJ1cmJMaXN0ID0gc3VjY2Vzc1Jlc3BvbnNlLmxpc3Q7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3JSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2F2aW5nIERldGFpbHM6JywgZXJyb3JSZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLm1vZGVsT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGRlYm91bmNlOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogNTAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0dGVyU2V0dGVyOiB0cnVlXG4gICAgICAgIH07XG5cbiAgICB9XG4gICAgLy9lbmQgb2YgY29udHJvbGxlclxuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkxpc3RpbmcnKVxuICAgICAgICAuY29udHJvbGxlcignQ3JlYXRlTGlzdGluZ0NvbnRyb2xsZXInLCBDcmVhdGVMaXN0aW5nQ29udHJvbGxlcik7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgQ29udHJvbGxlclxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuU2VydmljZXByb3ZpZGVyLkNvbnRyb2xsZXIuTGlzdExpc3RpbmdDb250cm9sbGVyXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkxpc3RpbmdcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIExpc3RMaXN0aW5nQ29udHJvbGxlciBpcyByZXNwb25zaWJsZSBtYW5hZ2UgdXNlciBsaXN0aW5nXG4gICAgICpcbiAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAqL1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gTGlzdExpc3RpbmdDb250cm9sbGVyKENhdGVnb3JpZXNNb2RlbCwgTGlzdGluZ01vZGVsLCBMaXN0aW5nX3R5cGUsJGxvY2F0aW9uKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgIHNlbGYubGlzdGluZyA9ICcnO1xuICAgICAgICBpbml0KCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGluaXRpYWxpemUgcHJvcGVydGllc1xuICAgICAgICAgKiBcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG5cbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRcdGdldExpc3RpbmdzKCk7XG4gICAgICAgICAgICBzZWxmLmN1cnJlbnRQYWdlID0gMDtcbiAgICAgICAgICAgIHNlbGYucGFnZVNpemUgPSA0O1xuXHRcdFx0c2VsZi5ob3N0ID0gJGxvY2F0aW9uLnByb3RvY29sKCkgKyc6Ly8nKyRsb2NhdGlvbi5ob3N0KCk7XG4gICAgICAgIH1cblxuXG5cdFx0LyoqXG5cdFx0KiBHZXQgYWxsIHRoZSBsaXN0aW5nIG9mIGEgdXNlclxuXHRcdCpcblx0XHQqIEBwcml2YXRlXG5cdFx0KiBnZXQgdXNlciBMaXN0aW5nXG5cdFx0KiBAcmV0dXJuIHtPYmplY3QgfCBKU09OIHwgY3VzZXJsaXN0aW5nfVxuXHRcdCovXG4gICAgICAgIGZ1bmN0aW9uIGdldExpc3RpbmdzKCkge1xuICAgICAgICAgICAgTGlzdGluZ01vZGVsLmZpbmRBbGwoe3Blcl9wYWdlOjk5OTk5OX0pLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHNlbGYubGlzdGluZyA9IGFuZ3VsYXIuY29weShkYXRhLmxpc3QpO1xuICAgICAgICAgICAgICAgIFxuXHRcdFx0XHRfLmVhY2goc2VsZi5saXN0aW5nLmRhdGEsIGZ1bmN0aW9uKGxpc3QsIGluZGV4KXtcbiAgICAgICAgICAgICAgICAgICAgaWYobGlzdC50eXBlID09PSAnam9iJyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxpc3RpbmcuZGF0YVtpbmRleF0udXJsID0gJ2pvYnMnO1xuICAgICAgICAgICAgICAgICAgICB9XG5cdFx0XHRcdFx0aWYobGlzdC50eXBlID09PSAnY2xhc3NpZmllZCcpe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5saXN0aW5nLmRhdGFbaW5kZXhdLnVybCA9ICdjbGFzc2lmaWVkcyc7XG4gICAgICAgICAgICAgICAgICAgIH1cblx0XHRcdFx0XHRpZihsaXN0LnR5cGUgPT09ICdnYWxsZXJ5Jyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxpc3RpbmcuZGF0YVtpbmRleF0udXJsID0gJ2dhbGxlcnknO1xuICAgICAgICAgICAgICAgICAgICB9XG5cdFx0XHRcdFx0aWYobGlzdC50eXBlID09PSAnYnVzaW5lc3Nmb3JzYWxlJyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxpc3RpbmcuZGF0YVtpbmRleF0udXJsID0gJ2J1c2luZXNzJztcbiAgICAgICAgICAgICAgICAgICAgfVxuXHRcdFx0XHRcdGlmKGxpc3QudHlwZSA9PT0gJ2RlYWwnKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubGlzdGluZy5kYXRhW2luZGV4XS51cmwgPSAnZGVhbHMnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcblx0XHRcdFx0XG5cdFx0XHRcdHNlbGYubnVtYmVyT2ZQYWdlcz1mdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKHNlbGYubGlzdGluZy5kYXRhLmxlbmd0aC9zZWxmLnBhZ2VTaXplKTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHNlbGYuZGVsZXRlID0gZnVuY3Rpb24oJGV2ZW50LCBsaXN0X2lkKXtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgTGlzdGluZ01vZGVsLmRlbGV0ZSh7aWQ6bGlzdF9pZH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2VEYXRhKXtcbiAgICAgICAgICAgICAgICBfLmVhY2goc2VsZi5saXN0aW5nLmRhdGEsIGZ1bmN0aW9uKGxpc3QsIGluZGV4KXtcbiAgICAgICAgICAgICAgICAgICAgaWYobGlzdC5pZCA9PT0gbGlzdF9pZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxpc3RpbmcuZGF0YS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yUmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd1bmFibGUgdG8gZGVsZXRlIGxpc3QgOiAnLCBlcnJvclJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH07XG5cbiAgICAgIFxuXG4gICAgfVxuICAgIC8vZW5kIG9mIGNvbnRyb2xsZXJcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5MaXN0aW5nJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xpc3RMaXN0aW5nQ29udHJvbGxlcicsIExpc3RMaXN0aW5nQ29udHJvbGxlcik7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG4gIC8qKlxuICAgKiBAbmdkb2Mgb3ZlcnZpZXdcbiAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50XG4gICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50XG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBY2NvdW50IHRhc2sgbW9kdWxlXG4gICAqIEBzZWUgQWNjb3VudC5tb2RlbC5qc1xuICAgKiBAc2VlIEFjY291bnQucmVzb3VyY2UuanNcbiAgICpcbiAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICovXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkFjY291bnQnLCBbJ3VpLmJvb3RzdHJhcCcsICd1aS5ib290c3RyYXAuZGF0ZXRpbWVwaWNrZXInXSk7XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyoqXG4gICAgICogQG5nZG9jIGNvbmZpZ1xuICAgICAqXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50LmNvbmZpZy5BY2NvdW50U2V0dGluZ3NTdGF0ZXNcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuQWNjb3VudFxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQ29uZmlndXJlIEFjY291bnQgbW9kdWxlIHJvdXRlc1xuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuQWNjb3VudCcpXG4gICAgICAgIC5jb25maWcoQWNjb3VudFNldHRpbmdzU3RhdGVzKTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIEFjY291bnRTZXR0aW5nc1N0YXRlcygkc3RhdGVQcm92aWRlciwgQVBQX0NPTkZJRykge1xuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc2V0dGluZ3MnLCB7XG4gICAgICAgICAgICBwYXJlbnQ6ICdhY2NvdW50JyxcbiAgICAgICAgICAgIGFic29sdXRlOiB0cnVlLFxuICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICAgICAgICB1cmw6ICdeL3NldHRpbmdzJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2FjY291bnRfY29udGVudF92aWV3Jzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgdWktdmlldz1cImFjY291bnRfc2V0dGluZ3Nfdmlld1wiIGNsYXNzPVwiZmFkZUluIGFuaW1hdGVkXCI+PC9kaXY+J1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdhY2NvdW50X3RvcF9uYXZfdmlldycgOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBBUFBfQ09ORklHLm1vZHVsZXMgKyAnL2FjY291bnQvc2V0dGluZ3Mvc2V0dGluZ3MtbmF2Lmh0bWwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KS5zdGF0ZSgnc2V0dGluZ3MuZGV0YWlscycsIHtcbiAgICAgICAgICAgIHBhcmVudDogJ3NldHRpbmdzJyxcbiAgICAgICAgICAgIHVybDogJy9kZXRhaWxzJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2FjY291bnRfc2V0dGluZ3Nfdmlld0BzZXR0aW5ncyc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IEFQUF9DT05GSUcubW9kdWxlcyArICcvYWNjb3VudC9zZXR0aW5ncy9kZXRhaWxzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQWNjb3VudFNldHRpbmdzQ29udHJvbGxlciBhcyBfc2VsZidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgIFJlc29sdmVEYXRhOiBmdW5jdGlvbihSZXNvbHZlRGF0YSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc29sdmVEYXRhLnVzZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH0pLnN0YXRlKCdzZXR0aW5ncy5wYXltZW50c19tZXRob2RzJywge1xuICAgICAgICAgICAgcGFyZW50OiAnc2V0dGluZ3MnLFxuICAgICAgICAgICAgdXJsOiAnL3BheW1lbnRzX21ldGhvZHMnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnYWNjb3VudF9zZXR0aW5nc192aWV3QHNldHRpbmdzJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogQVBQX0NPTkZJRy5tb2R1bGVzICsgJy9hY2NvdW50L3NldHRpbmdzL3BheW1lbnRzX21ldGhvZHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBY2NvdW50U2V0dGluZ3NDb250cm9sbGVyIGFzIF9zZWxmJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgUmVzb2x2ZURhdGE6IGZ1bmN0aW9uKFJlc29sdmVEYXRhKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzb2x2ZURhdGEudXNlcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnN0YXRlKCdzZXR0aW5ncy5pbnZvaWNlJywge1xuICAgICAgICAgICAgcGFyZW50OiAnc2V0dGluZ3MnLFxuICAgICAgICAgICAgdXJsOiAnL2ludm9pY2UnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnYWNjb3VudF9zZXR0aW5nc192aWV3QHNldHRpbmdzJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogQVBQX0NPTkZJRy5tb2R1bGVzICsgJy9hY2NvdW50L3NldHRpbmdzL2ludm9pY2UuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBY2NvdW50U2V0dGluZ3NDb250cm9sbGVyIGFzIF9zZWxmJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgUmVzb2x2ZURhdGE6IGZ1bmN0aW9uKFJlc29sdmVEYXRhKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzb2x2ZURhdGEudXNlcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBDb250cm9sbGVyXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50LkNvbnRyb2xsZXIuQWNjb3VudFNldHRpbmdzQ29udHJvbGxlclxuICAgICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50XG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBBY2NvdW50U2V0dGluZ3NDb250cm9sbGVyIGlzIHJlc3BvbnNpYmxlIG1hbmFnZSB1c2VyJ3MgcmV2aWV3XG4gICAgICpcbiAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAqL1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gQWNjb3VudFNldHRpbmdzQ29udHJvbGxlcigkc3RhdGUsIEFjY291bnRNb2RlbCwgUmVzb2x2ZURhdGEsIHRvYXN0ZXIsIFN1YnVyYnNNb2RlbCwgJGh0dHApIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBpbml0KCk7XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogaW5pdGlhbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cblxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBnZXQgc3VidXJiTGlzdFxuICAgICAgICAgICAgICogXG4gICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgc2VsZi5zdWJ1cmJMaXN0ID0gW107XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIGdldCB1c2VyZGF0YVxuICAgICAgICAgICAgICogXG4gICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICBzZWxmLnVzZXJNb2RlbCA9IHtcbiAgICAgICAgICAgICAgICAnaWQnOiBSZXNvbHZlRGF0YS5pZCxcbiAgICAgICAgICAgICAgICAnbmFtZSc6IFJlc29sdmVEYXRhLm5hbWUsXG4gICAgICAgICAgICAgICAgJ2Fib3V0JzogKFJlc29sdmVEYXRhLnVzZXJfaW5mbykgPyBSZXNvbHZlRGF0YS51c2VyX2luZm8uYWJvdXQgOiAnJyxcbiAgICAgICAgICAgICAgICAnYWRkcmVzcyc6IChSZXNvbHZlRGF0YS51c2VyX2luZm8pID8gUmVzb2x2ZURhdGEudXNlcl9pbmZvLmFkZHJlc3MgOiAnJyxcbiAgICAgICAgICAgICAgICAnc3VidXJiJzogKFJlc29sdmVEYXRhLnVzZXJfaW5mbyAmJiBSZXNvbHZlRGF0YS51c2VyX2luZm8udXNlcl9zdWJ1cmIpID8gUmVzb2x2ZURhdGEudXNlcl9pbmZvLnVzZXJfc3VidXJiIDogbnVsbCxcbiAgICAgICAgICAgICAgICAnZW1haWwnOiBSZXNvbHZlRGF0YS5lbWFpbCxcbiAgICAgICAgICAgICAgICAnbG9nbycgOiAoUmVzb2x2ZURhdGEucHJvZmlsZXBpYyAmJiBSZXNvbHZlRGF0YS5wcm9maWxlcGljLm5hbWUpID8gUmVzb2x2ZURhdGEucHJvZmlsZXBpYy5wYXRoICsgJ3RodW1iX3NtYWxsXycgKyBSZXNvbHZlRGF0YS5wcm9maWxlcGljLm5hbWUgOiBudWxsLFxuICAgICAgICAgICAgICAgICd2aWRlbycgOiAoUmVzb2x2ZURhdGEucHJvZmlsZXZpZGVvICYmIFJlc29sdmVEYXRhLnByb2ZpbGV2aWRlby5uYW1lKSA/IFJlc29sdmVEYXRhLnByb2ZpbGV2aWRlby5uYW1lIDogbnVsbFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coUmVzb2x2ZURhdGEudXNlci5pZCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogc2F2ZSB1c2VyIGRhdGFcbiAgICAgICAgICogXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuXG4gICAgICAgIHNlbGYuc2F2ZXVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBfdXNlciA9IGFuZ3VsYXIuY29weShzZWxmLnVzZXJNb2RlbCksXG4gICAgICAgICAgICAgICAgcmVzb3VyY2UgPSBBY2NvdW50TW9kZWwudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IF91c2VyLmlkXG4gICAgICAgICAgICAgICAgfSwgX3VzZXIpO1xuICAgICAgICAgICAgcmVzb3VyY2UudGhlbihmdW5jdGlvbihzdWNjZXNzUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsIFwiRGV0YWlsIFNhdmVcIiwgXCJEYXRhaWxzIGhhcyBiZWVuIHVwZGF0ZWQuXCIpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3JSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTYXZpbmcgRGV0YWlsczonLCBlcnJvclJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogZ2V0TG9jYXRpb25cbiAgICAgICAgICogc2VhcmNoIGxvY2F0aW9ucyBiYXNlZCBvbiBzZWFyY2ggdGV4dFxuICAgICAgICAgKiBzZWFyY2ggaXMgcGVyZm9ybWVkIG9uIHBvc3Rjb2RlIGFuZCBjaXR5IG5hbWVcbiAgICAgICAgICogXG4gICAgICAgICAqIEBwYXJhbSAge1tzdHJpbmddfVxuICAgICAgICAgKiBAcmV0dXJuIHtbdm9pZF19XG4gICAgICAgICAqL1xuICAgICAgICBzZWxmLmdldExvY2F0aW9uID0gZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICBpZiAodmFsLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBTdWJ1cmJzTW9kZWwuZmluZExvY2F0aW9uKHtcbiAgICAgICAgICAgICAgICAncSc6IHZhbFxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihzdWNjZXNzUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnN1YnVyYkxpc3QgPSBzdWNjZXNzUmVzcG9uc2UubGlzdDtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8oJ0dldHRpbmcgbG9jYXRpb25zOicsIGVycm9yUmVzcG9uc2UpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIG1vZGVsIG9wdGlvbnNcbiAgICAgICAgICogYXBwbGllZCB0byBzZWFyY2ggbG9jYXRpb24gdWktc2VsZWN0IHRvIGRlYm91bmNlIHRoZSBtb2RlbCBjaGFuZ2VzXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgc2VsZi5tb2RlbE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBkZWJvdW5jZToge1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDUwMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldHRlclNldHRlcjogdHJ1ZVxuICAgICAgICB9O1xuXG5cbiAgICAgICAgIC8qKlxuICAgICAgICAgKiBjaGFuZ2UgdXNlciBwcm9maWxlIHBpY1xuICAgICAgICAgKiBcbiAgICAgICAgICogQHBhcmFtcyB7aW1hZ2VzIGNodW5rc31cbiAgICAgICAgICogQHJldHVybiB7b2JqZWN0fVxuICAgICAgICAgKi9cblxuICAgICAgICBzZWxmLmZsb3dDb25maWcgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnL3VwbG9hZHByb2ZpbGVwaWMnLFxuICAgICAgICAgICAgICAgIHBlcm1hbmVudEVycm9yczogWzQwNCwgNTAwLCA1MDFdLFxuICAgICAgICAgICAgICAgIG1heENodW5rUmV0cmllczogMSxcbiAgICAgICAgICAgICAgICBjaHVua1JldHJ5SW50ZXJ2YWw6IDUwMDAsXG4gICAgICAgICAgICAgICAgc2ltdWx0YW5lb3VzVXBsb2FkczogMSxcbiAgICAgICAgICAgICAgICBzaW5nbGVGaWxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ1gtQ1NSRi1UT0tFTic6IGNzcmZfdG9rZW5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHF1ZXJ5OiBmdW5jdGlvbihmbG93RmlsZSwgZmxvd0NodW5rKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGZvciBldmVyeSByZXF1ZXN0XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogc2VsZi51c2VyTW9kZWwuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6ICdmbG93X3F1ZXJ5J1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogY2hhbmdlIHByb2ZpbGUgcGljIGlmIHVwbG9hZCBzdWNjZXNzZnVsbHlcbiAgICAgICAgICogXG4gICAgICAgICAqIEBwYXJhbXMge09qZWN0fVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgc2VsZi5maWxlVXBsb2FkU3VjY2VzcyA9IGZ1bmN0aW9uKCRmaWxlLCAkcmVzKSB7XG4gICAgICAgICAgICB2YXIgb2JqID0gSlNPTi5wYXJzZSgkcmVzKTtcbiAgICAgICAgICAgIHNlbGYudXNlck1vZGVsLmxvZ28gPSBvYmoucGF0aCsndGh1bWJfc21hbGxfJytvYmoubmFtZTtcbiAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgXCJMb2dvIFVwbG9hZGVkXCIsIFwiTG9nbyBoYXMgYmVlbiB1cGxvYWRlZCBzdWNjZXNzZnVsbHkuXCIpO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGNoYW5nZSB1c2VyIHByb2ZpbGUgcGljXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcGFyYW1zIHtpbWFnZXMgY2h1bmtzfVxuICAgICAgICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAgICAgICAqL1xuXG4gICAgICAgIHNlbGYudmlkZW9mbG93Q29uZmlnID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRhcmdldDogJy91cGxvYWR2aWRlbycsXG4gICAgICAgICAgICAgICAgcGVybWFuZW50RXJyb3JzOiBbNDA0LCA1MDAsIDUwMV0sXG4gICAgICAgICAgICAgICAgbWF4Q2h1bmtSZXRyaWVzOiAxLFxuICAgICAgICAgICAgICAgIGNodW5rUmV0cnlJbnRlcnZhbDogNTAwMCxcbiAgICAgICAgICAgICAgICBzaW11bHRhbmVvdXNVcGxvYWRzOiAxLFxuICAgICAgICAgICAgICAgIHNpbmdsZUZpbGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAnWC1DU1JGLVRPS0VOJzogY3NyZl90b2tlblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcXVlcnk6IGZ1bmN0aW9uKGZsb3dGaWxlLCBmbG93Q2h1bmspIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgZm9yIGV2ZXJ5IHJlcXVlc3RcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBzZWxmLnVzZXJNb2RlbC5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogJ2Zsb3dfcXVlcnknXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBjaGFuZ2UgcHJvZmlsZSBwaWMgaWYgdXBsb2FkIHN1Y2Nlc3NmdWxseVxuICAgICAgICAgKiBcbiAgICAgICAgICogQHBhcmFtcyB7T2plY3R9XG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBzZWxmLnZpZGVvVXBsb2FkU3VjY2VzcyA9IGZ1bmN0aW9uKCRmaWxlLCAkcmVzKSB7XG4gICAgICAgICAgIGNvbnNvbGUubG9nKCd2aWRlbyBoYXMgYmVlbiB1cGxvYWRlZCBzdWNjZXNzZnVsbHkuJylcbiAgICAgICAgICAgdmFyIG9iaiA9IEpTT04ucGFyc2UoJHJlcyk7XG4gICAgICAgICAgIHNlbGYudXNlck1vZGVsLnZpZGVvID0gb2JqLm5hbWU7XG4gICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgXCJWaWRlbyBVcGxvYWRlZFwiLCBcIlZpZGVvIGhhcyBiZWVuIHVwbG9hZGVkIHN1Y2Nlc3NmdWxseS5cIik7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vZW5kIG9mIGNvbnRyb2xsZXJcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50JylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0FjY291bnRTZXR0aW5nc0NvbnRyb2xsZXInLCBBY2NvdW50U2V0dGluZ3NDb250cm9sbGVyKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBjb25maWdcbiAgICAgKlxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuQWNjb3VudC5jb25maWcuQWNjb3VudFJldmlld1N0YXRlc1xuICAgICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50XG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBDb25maWd1cmUgQWNjb3VudCBtb2R1bGUgcm91dGVzXG4gICAgICpcbiAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAqL1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50JylcbiAgICAgICAgLmNvbmZpZyhBY2NvdW50UmV2aWV3U3RhdGVzKTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIEFjY291bnRSZXZpZXdTdGF0ZXMoJHN0YXRlUHJvdmlkZXIsIEFQUF9DT05GSUcpIHtcblxuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncmV2aWV3cycsIHtcbiAgICAgICAgICAgIHBhcmVudDogJ2FjY291bnQnLFxuICAgICAgICAgICAgYWJzb2x1dGU6IHRydWUsXG4gICAgICAgICAgICB1cmw6ICdeL3Jldmlld3MnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnYWNjb3VudF9jb250ZW50X3ZpZXcnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiB1aS12aWV3PVwicmV2aWV3c192aWV3XCIgY2xhc3M9XCJmYWRlSW4gYW5pbWF0ZWRcIj48L2Rpdj4nXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnYWNjb3VudF90b3BfbmF2X3ZpZXcnIDoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogQVBQX0NPTkZJRy5tb2R1bGVzICsgJy9hY2NvdW50L3Jldmlld3MvcmV2aWV3cy1uYXYuaHRtbCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnN0YXRlKCdyZXZpZXdzLmRhc2hiYW9yZCcsIHtcbiAgICAgICAgICAgIHBhcmVudDogJ3Jldmlld3MnLFxuICAgICAgICAgICAgdXJsOiAnL2Rhc2hiYW9yZCcsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdyZXZpZXdzX3ZpZXdAcmV2aWV3cyc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IEFQUF9DT05GSUcubW9kdWxlcyArICcvYWNjb3VudC9yZXZpZXdzL2Rhc2hib2FyZC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Jldmlld3NDb250cm9sbGVyIGFzIF9zZWxmJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuc3RhdGUoJ3Jldmlld3MucmVxdWVzdCcsIHtcbiAgICAgICAgICAgIHBhcmVudDogJ3Jldmlld3MnLFxuICAgICAgICAgICAgdXJsOiAnL3JlcXVlc3QnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAncmV2aWV3c192aWV3QHJldmlld3MnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBBUFBfQ09ORklHLm1vZHVsZXMgKyAnL2FjY291bnQvcmV2aWV3cy9yZXF1ZXN0LXJldmlldy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Jldmlld3NDb250cm9sbGVyIGFzIF9zZWxmJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuc3RhdGUoJ3Jldmlld3Muc3VibWl0X3JldmlldycsIHtcbiAgICAgICAgICAgIHBhcmVudDogJ3Jldmlld3MnLFxuICAgICAgICAgICAgdXJsOiAnL3N1Ym1pdCcsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdyZXZpZXdzX3ZpZXdAcmV2aWV3cyc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IEFQUF9DT05GSUcubW9kdWxlcyArICcvYWNjb3VudC9yZXZpZXdzL3N1Ym1pdC1yZXZpZXcuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXZpZXdzQ29udHJvbGxlciBhcyBfc2VsZidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnN0YXRlKCdyZXZpZXdzLmZhcXMnLCB7XG4gICAgICAgICAgICBwYXJlbnQ6ICdyZXZpZXdzJyxcbiAgICAgICAgICAgIHVybDogJy9mYXFzJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ3Jldmlld3Nfdmlld0ByZXZpZXdzJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogQVBQX0NPTkZJRy5tb2R1bGVzICsgJy9hY2NvdW50L3Jldmlld3MvcmV2aWV3LWZhcXMuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXZpZXdzQ29udHJvbGxlciBhcyBfc2VsZidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBDb250cm9sbGVyXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50LkNvbnRyb2xsZXIuUmV2aWV3c0NvbnRyb2xsZXJcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuQWNjb3VudFxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmV2aWV3c0NvbnRyb2xsZXIgaXMgcmVzcG9uc2libGUgbWFuYWdlIHVzZXIncyByZXZpZXdcbiAgICAgKlxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBSZXZpZXdzQ29udHJvbGxlcihSZXZpZXdNb2RlbCwkc3RhdGUsdXRpbEZhY3RvcnksdG9hc3RlcixTcGlubmVyKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgaW5pdCgpO1xuXHRcdHNlbGYucmV2aWV3TGlzdD0nJztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGluaXRpYWxpemUgcHJvcGVydGllc1xuICAgICAgICAgKiBcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG5cbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRcdGdldFJldmlld2xpc3QoKTtcbiAgICAgICAgICAgIHNlbGYucmF0ZSA9IDA7XG4gICAgICAgICAgICBzZWxmLm1heCA9IDU7XG4gICAgICAgICAgICBzZWxmLmlzUmVhZG9ubHkgPSBmYWxzZTtcbiAgICAgICAgICAgIHNlbGYuT3ZlcmFsbFJhdGluZyA9IDA7XG4gICAgICAgICAgICBzZWxmLmN1cnJlbnRQYWdlID0gMDtcbiAgICAgICAgICAgIHNlbGYucGFnZVNpemUgPSAyO1xuICAgICAgICAgICAgXG5cdFx0fVxuXHRcdFxuXHRcdFxuXHRcdC8qKlxuXHRcdCogU2F2ZSBSZXZpZXdcblx0XHQqIEBwYXJhbXMge09iamVjdH1cblx0XHQqIEByZXR1cm4ge2lkfVxuXHRcdCovXG5cdFx0XG5cdFx0IHNlbGYuc2F2ZVJldmlldyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgU3Bpbm5lci5zdGFydCgpO1xuXHRcdCAgIHZhciBfcmV2aWV3ID0gYW5ndWxhci5jb3B5KHNlbGYucmV2aWV3KTtcblx0XHQgICBSZXZpZXdNb2RlbC5zYXZlKHtcbiAgICAgICAgICAgICAgICAgICAgJ3Jldmlldyc6IF9yZXZpZXcsXG4gICAgICAgICAgICAgICAgICAgICdyYXRlJzpzZWxmLnJhdGUsXG4gICAgICAgICAgICAgICAgICAgICd0b191c2VyJzogMlxuICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbmNlKXtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCBcIlJldmlldyBTYXZlZFwiLCBcIlJldmlldyBoYXMgYmVlbiBzYXZlZCBzdWNjZXNzZnVsbHkuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZXZpZXcgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucmF0ZT0wO1xuICAgICAgICAgICAgICAgICAgICAgICAgU3Bpbm5lci5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgICAgICAgICAgICAgICAgU3Bpbm5lci5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0pO1xuXHRcdCB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAqIFJhdGluZyBob3ZlclxuICAgICAgICAqIEBwYXJhbXMge09iamVjdH1cbiAgICAgICAgKiBAcmV0dXJuIHtpZH1cbiAgICAgICAgKi9cbiAgICAgICAgIHNlbGYuaG92ZXJpbmdPdmVyID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHNlbGYub3ZlclN0YXIgPSB2YWx1ZTtcbiAgICAgICAgICAgIHNlbGYucGVyY2VudCA9IDEwMCAqICh2YWx1ZSAvIHNlbGYubWF4KTtcbiAgICAgICAgICB9O1xuXHRcdCBcblx0XHQgLyoqXG5cdFx0KiBEZWxldGUgUmV2aWV3XG5cdFx0KiBAcGFyYW1zIHtpbmRleCB8IGlkIHwgaW50ZWdlcn1cblx0XHQqIEByZXR1cm4ge3ZvaWR9XG5cdFx0Ki9cblx0XHQgc2VsZi5kZWxldGVSZXZpZXcgPSBmdW5jdGlvbihpbmRleCxpZCl7XG5cdFx0ICBSZXZpZXdNb2RlbC5kZWxldGUoe1xuICAgICAgICAgICAgJ2lkJzogaWRcbiAgICAgICAgICB9KTtcblx0XHQgIHNlbGYucmV2aWV3TGlzdC5kYXRhLnNwbGljZShpbmRleCwxKTtcblx0XHQgfVxuXHRcdCBcblx0XHQgLyoqXG5cdFx0KiBVc2VycyBSZXZpZXdcblx0XHQqIEBwYXJhbXMge2luZGV4IHwgaWQgfCBpbnRlZ2VyfVxuXHRcdCogQHJldHVybiB7dm9pZH1cblx0XHQqL1xuXHRcdCBmdW5jdGlvbiBnZXRSZXZpZXdsaXN0KCkge1xuICAgICAgICAgICAgUmV2aWV3TW9kZWwuYWxsKHtcbiAgICAgICAgICAgICAgICAndG9fdXNlcic6IDJcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRcdCAgICBzZWxmLnJldmlld0xpc3QgPSBhbmd1bGFyLmNvcHkocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBzZWxmLm51bWJlck9mUGFnZXM9ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKHNlbGYucmV2aWV3TGlzdC5kYXRhLmxlbmd0aC9zZWxmLnBhZ2VTaXplKTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgX3RvdGFscmF0aW5nID0gMDtcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChzZWxmLnJldmlld0xpc3QuZGF0YSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICBfdG90YWxyYXRpbmcgKz0gcGFyc2VJbnQodmFsdWUucmF0aW5nKTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmKHNlbGYucmV2aWV3TGlzdC5kYXRhLmxlbmd0aClcbiAgICAgICAgICAgIHNlbGYuT3ZlcmFsbFJhdGluZyA9IF90b3RhbHJhdGluZy9zZWxmLnJldmlld0xpc3QuZGF0YS5sZW5ndGg7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfVxuICAgIC8vZW5kIG9mIGNvbnRyb2xsZXJcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50JylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Jldmlld3NDb250cm9sbGVyJywgUmV2aWV3c0NvbnRyb2xsZXIpO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyoqXG4gICAgICogQG5nZG9jIEZhY3RvcnlcbiAgICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLkFjY291bnQuRmFjdG9yeS5SZXZpZXdSZXNvdXJjZVxuICAgICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50XG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBJbXBsZW1lbnRzIENVUkQgb3BlcmF0aW9uc1xuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkFjY291bnQnKVxuICAgICAgLmZhY3RvcnkoJ1Jldmlld1Jlc291cmNlJywgUmV2aWV3UmVzb3VyY2UpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gUmV2aWV3UmVzb3VyY2UoJHJlc291cmNlLCBBUFBfQ09ORklHKSB7XG4gICAgICAvKiAkcmVzb3VyY2UoQVBJX1VSTCwgREVGQVVMVF9QQVJBTUVURVJTLCBDT05GSUdVUkVfWU9VUl9DVVNUT01fTUVUSE9EUykqL1xuICAgICAgcmV0dXJuICRyZXNvdXJjZSgncmV2aWV3LzppZCcsIHtcbiAgICAgICAgICBpZDogJ0BpZCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgZmluZDoge1xuXHRcdFx0ICBtZXRob2Q6ICdHRVQnLFxuXHRcdFx0ICBwYXJhbXM6IHtcblx0XHRcdFx0aWQ6ICdAaWQnLFxuXHRcdFx0ICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNhdmU6IHtcblx0XHRcdG1ldGhvZDogJ1BPU1QnXG4gICAgICAgIH0sXG4gICAgICAgIHVwZGF0ZToge1xuXHRcdFx0ICBtZXRob2Q6ICdQVVQnLFxuXHRcdFx0ICBwYXJhbXM6IHtcblx0XHRcdFx0aWQ6IDBcblx0XHRcdCAgfVxuICAgICAgICB9LFxuXHRcdGFsbDoge1xuXHRcdFx0bWV0aG9kOiAnR0VUJyxcblx0XHRcdHBhcmFtczoge1xuXHRcdFx0XHRpZDogJ0BpZCcsXG5cdFx0XHR9LFxuXHRcdFx0dHJhbnNmb3JtUmVzcG9uc2U6IHRyYW5zZm9ybUdldFJlc3BvbnNlLFxuICAgICAgICB9LFxuXHRcdGRlbGV0ZToge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAnQGlkJyxcblx0XHRcdFx0fSxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXHRcbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm1HZXRSZXNwb25zZShkYXRhLCBoZWFkZXJzR2V0dGVyKSB7XG4gICAgICAgIHZhciBfcmVzcG9uc2UgPSB7fTtcbiAgICAgICAgX3Jlc3BvbnNlLmRhdGEgPSBhbmd1bGFyLmZyb21Kc29uKGRhdGEpO1xuICAgICAgICByZXR1cm4gYW5ndWxhci5mcm9tSnNvbihfcmVzcG9uc2UpO1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBTZXJ2aWNlXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50LlNlcnZpY2UuUmV2aWV3TW9kZWxcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuQWNjb3VudFxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICpcbiAgICAgKiBEYXRhIG1vZGVsIGZvciBqb2J0YXNrIG1vZHVsZVxuICAgICAqIEltcGxlbWVuZXRzIENVUkQgb3BlcmF0aW9uXG4gICAgICpcbiAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAqL1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50JylcbiAgICAgICAgLnNlcnZpY2UoJ1Jldmlld01vZGVsJywgUmV2aWV3TW9kZWwpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gUmV2aWV3TW9kZWwoUmV2aWV3UmVzb3VyY2UpIHtcbiAgICAgICAgdmFyIG1vZGVsID0gdGhpcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFtqb2JMaXN0IGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAVHJ1ZSB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBtb2RlbC5yZXZpZXdMaXN0ID0gW107XG5cbiAgICAgICAvKipcbiAgICAgICAgICogR2V0IFJldmlld1xuICAgICAgICAgKiBAcGFyYW0gaWQgaWRcbiAgICAgICAgICogQHJldHVybiBSZXZpZXdcbiAgICAgICAgICovXG4gICAgICAgIG1vZGVsLmZpbmQgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgcmV0dXJuIFJldmlld1Jlc291cmNlLmZpbmQoaWQpLiRwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBcblx0XHQvKipcbiAgICAgICAgICogQ3JlYXRlIGEgbmV3IFJldmlld1xuICAgICAgICAgKiBAcGFyYW0gUmV2aWV3IFJldmlld1xuICAgICAgICAgKiBAcmV0dXJuIFJldmlldyBzYXZlZFxuICAgICAgICAgKi9cbiAgICAgICAgbW9kZWwuc2F2ZSA9IGZ1bmN0aW9uKHJldmlldykge1xuICAgICAgICAgICAgcmV0dXJuIFJldmlld1Jlc291cmNlLnNhdmUocmV2aWV3KS4kcHJvbWlzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlIFJldmlld1xuICAgICAgICAgKiBAcGFyYW0gUmV2aWV3IFJldmlld1xuICAgICAgICAgKiBAcmV0dXJuIFJldmlldyBzYXZlZFxuICAgICAgICAgKi9cbiAgICAgICAgbW9kZWwudXBkYXRlID0gZnVuY3Rpb24ocmV2aWV3KSB7XG4gICAgICAgICAgICByZXR1cm4gUmV2aWV3UmVzb3VyY2UudXBkYXRlKHJldmlldykuJHByb21pc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlbGV0ZSBSZXZpZXdcbiAgICAgICAgICogQHBhcmFtIGlkIGlkXG4gICAgICAgICAqL1xuICAgICAgICBtb2RlbC5kZWxldGUgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgcmV0dXJuIFJldmlld1Jlc291cmNlLmRlbGV0ZShpZCkuJHByb21pc2U7XG4gICAgICAgIH07XG5cdFx0XG5cdFx0XG5cdFx0LyoqXG4gICAgICAgICAqIERlbGV0ZSBSZXZpZXdcbiAgICAgICAgICogQHBhcmFtIGlkIGlkXG4gICAgICAgICAqL1xuICAgICAgICBtb2RlbC5hbGwgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgcmV0dXJuIFJldmlld1Jlc291cmNlLmFsbChpZCkuJHByb21pc2U7XG4gICAgICAgIH07XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyoqXG4gICAgICogQG5nZG9jIGNvbmZpZ1xuICAgICAqXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50LmNvbmZpZy5Vc2VyU3RhdGVzXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkFjY291bnRcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIENvbmZpZ3VyZSBBY2NvdW50IG1vZHVsZSByb3V0ZXNcbiAgICAgKlxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkFjY291bnQnKVxuICAgICAgICAuY29uZmlnKFVzZXJTdGF0ZXMpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gVXNlclN0YXRlcygkc3RhdGVQcm92aWRlciwgQVBQX0NPTkZJRykge1xuXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd1c2VyJywge1xuICAgICAgICAgICAgcGFyZW50OiAnYWNjb3VudCcsXG4gICAgICAgICAgICBhYnNvbHV0ZTogdHJ1ZSxcbiAgICAgICAgICAgIHVybDogJ14vdXNlcicsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdhY2NvdW50X2NvbnRlbnRfdmlldyc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IHVpLXZpZXc9XCJ1c2VyX3ZpZXdcIiBjbGFzcz1cImZhZGVJbiBhbmltYXRlZFwiPjwvZGl2PidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnN0YXRlKCd1c2VyLmRldGFpbCcsIHtcbiAgICAgICAgICAgICAgICBwYXJlbnQ6ICd1c2VyJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGV0YWlsJyxcbiAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAndXNlcl92aWV3QHVzZXInOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogQVBQX0NPTkZJRy5tb2R1bGVzICsgJy9hY2NvdW50L3VzZXIvdXNlci1kZXRhaWxzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VzZXJDb250cm9sbGVyIGFzIF9zZWxmJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIFJlc29sdmVEYXRhOiBmdW5jdGlvbihSZXNvbHZlRGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVzb2x2ZURhdGEudXNlcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gICAgXG4gICAgICAgICAgICBcbiAgICAgICAgfSkuc3RhdGUoJ3VzZXIucmV2aWV3cycsIHtcbiAgICAgICAgICAgIHBhcmVudDogJ3VzZXInLFxuICAgICAgICAgICAgdXJsOiAnL3Jldmlld3MnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAndXNlcl92aWV3QHVzZXInOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBBUFBfQ09ORklHLm1vZHVsZXMgKyAnL2FjY291bnQvdXNlci91c2VyLXJldmlld3MuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdVc2VyQ29udHJvbGxlciBhcyBfc2VsZidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnN0YXRlKCd1c2VyLmpvYl9wcmVmZXJlbmNlcycsIHtcbiAgICAgICAgICAgIHBhcmVudDogJ3VzZXInLFxuICAgICAgICAgICAgYWJzb2x1dGUgOiB0cnVlLFxuICAgICAgICAgICAgdXJsOiAnL2pvYicsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICd1c2VyX3ZpZXdAdXNlcic6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IHVpLXZpZXc9XCJqb2JfcHJlZmVyZW5jZXNfdmlld3NcIiBjbGFzcz1cImZhZGVJbiBhbmltYXRlZFwiPjwvZGl2PidcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdhY2NvdW50X3RvcF9uYXZfdmlld0BhY2NvdW50Jzp7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBBUFBfQ09ORklHLm1vZHVsZXMgKyAnL2FjY291bnQvdXNlci9qb2ItZGFzaGJvYXJkLW5hdi5odG1sJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICBKb2JSZXNvbHZlRGF0YTogWydBY2NvdW50TW9kZWwnLCAnJHEnLCBmdW5jdGlvbihBY2NvdW50TW9kZWwsICRxKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgICAgIEFjY291bnRNb2RlbC5maW5kSm9iKHtpZDpudWxsfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdqb2JzX2FwcGxpZWQnOiByZXNwb25zZS5qb2JzX2FwcGxpZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAnam9ic19wcmVmZXJyZWQnOiByZXNwb25zZS5qb2JzX3ByZWZlcnJlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdqb2JzX3Nob3J0bGlzdGVkJzogcmVzcG9uc2Uuam9ic19zaG9ydGxpc3RlZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHt9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnN0YXRlKCd1c2VyLmpvYl9wcmVmZXJlbmNlcy5kYXNoYm9hcmQnLCB7XG4gICAgICAgICAgICBwYXJlbnQ6ICd1c2VyLmpvYl9wcmVmZXJlbmNlcycsXG4gICAgICAgICAgICB1cmw6ICdeL2pvYi9kYXNoYm9hcmQnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnam9iX3ByZWZlcmVuY2VzX3ZpZXdzQHVzZXIuam9iX3ByZWZlcmVuY2VzJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogQVBQX0NPTkZJRy5tb2R1bGVzICsgJy9hY2NvdW50L3VzZXIvam9iX3ByZWZlcmVuY2VzX2Rhc2hib2FyZC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VzZXJKb2JDb250cm9sbGVyIGFzIF9zZWxmJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgSm9iUmVzb2x2ZURhdGE6IGZ1bmN0aW9uKEpvYlJlc29sdmVEYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpvYlJlc29sdmVEYXRhLmpvYnNfcHJlZmVycmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0pLnN0YXRlKCd1c2VyLmpvYl9wcmVmZXJlbmNlcy5zaG9ydGxpc3RlZCcsIHtcbiAgICAgICAgICAgIHBhcmVudDogJ3VzZXIuam9iX3ByZWZlcmVuY2VzJyxcbiAgICAgICAgICAgIHVybDogJ14vam9iL3Nob3J0bGlzdGVkJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2pvYl9wcmVmZXJlbmNlc192aWV3c0B1c2VyLmpvYl9wcmVmZXJlbmNlcyc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IEFQUF9DT05GSUcubW9kdWxlcyArICcvYWNjb3VudC91c2VyL2pvYl9wcmVmZXJlbmNlc19zaG9ydGxpc3RlZC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VzZXJKb2JDb250cm9sbGVyIGFzIF9zZWxmJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgSm9iUmVzb2x2ZURhdGE6IGZ1bmN0aW9uKEpvYlJlc29sdmVEYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpvYlJlc29sdmVEYXRhLmpvYnNfc2hvcnRsaXN0ZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBcbiAgICAgICAgfSkuc3RhdGUoJ3VzZXIuam9iX3ByZWZlcmVuY2VzLnByZWZlcmVuY2VzJywge1xuICAgICAgICAgICAgcGFyZW50OiAndXNlci5qb2JfcHJlZmVyZW5jZXMnLFxuICAgICAgICAgICAgdXJsOiAnXi9qb2IvcHJlZmVyZW5jZXMnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnam9iX3ByZWZlcmVuY2VzX3ZpZXdzQHVzZXIuam9iX3ByZWZlcmVuY2VzJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogQVBQX0NPTkZJRy5tb2R1bGVzICsgJy9hY2NvdW50L3VzZXIvam9iX3ByZWZlcmVuY2VzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVXNlckpvYkNvbnRyb2xsZXIgYXMgX3NlbGYnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICBKb2JSZXNvbHZlRGF0YTogZnVuY3Rpb24oSm9iUmVzb2x2ZURhdGEpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gSm9iUmVzb2x2ZURhdGEuam9ic19hcHBsaWVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0pO1xuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBDb250cm9sbGVyXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50LkNvbnRyb2xsZXIuVXNlckpvYkNvbnRyb2xsZXJcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuQWNjb3VudFxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVXNlckpvYkNvbnRyb2xsZXIgaXMgcmVzcG9uc2libGUgbWFuYWdlIHVzZXIncyByZXZpZXcgYW5kIGpvYnNcbiAgICAgKlxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBVc2VySm9iQ29udHJvbGxlcigkc3RhdGUsQWNjb3VudE1vZGVsLEpvYlJlc29sdmVEYXRhKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgaW5pdCgpO1xuICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICogaW5pdGlhbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cblxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgc2VsZi5Kb2JMaXN0aW5nID0gKEpvYlJlc29sdmVEYXRhKSA/IEpvYlJlc29sdmVEYXRhIDogbnVsbDtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICB9XG4gICAgLy9lbmQgb2YgY29udHJvbGxlclxuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkFjY291bnQnKVxuICAgICAgICAuY29udHJvbGxlcignVXNlckpvYkNvbnRyb2xsZXInLCBVc2VySm9iQ29udHJvbGxlcik7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgQ29udHJvbGxlclxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuQWNjb3VudC5Db250cm9sbGVyLlVzZXJDb250cm9sbGVyXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkFjY291bnRcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFVzZXJDb250cm9sbGVyIGlzIHJlc3BvbnNpYmxlIG1hbmFnZSB1c2VyJ3MgcmV2aWV3XG4gICAgICpcbiAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAqL1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gVXNlckNvbnRyb2xsZXIoJHN0YXRlLFN1YnVyYnNNb2RlbCxBY2NvdW50TW9kZWwsUmVzb2x2ZURhdGEsdG9hc3Rlcikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGluaXQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogaW5pdGlhbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cblxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgIHNlbGYuc3VidXJiTGlzdCA9IFN1YnVyYnNNb2RlbC5maW5kQWxsKHsnaWQnOm51bGx9KTtcbiAgICAgICAgICAgICBzZWxmLnVzZXJNb2RlbCA9IHtcbiAgICAgICAgICAgICAgICAnaWQnOlJlc29sdmVEYXRhLmlkLFxuICAgICAgICAgICAgICAgICduYW1lJzpSZXNvbHZlRGF0YS5uYW1lLFxuICAgICAgICAgICAgICAgICdhZGRyZXNzJzooUmVzb2x2ZURhdGEudXNlcl9pbmZvKSA/IFJlc29sdmVEYXRhLnVzZXJfaW5mby5hZGRyZXNzOicnLFxuICAgICAgICAgICAgICAgICdzdWJ1cmInOihSZXNvbHZlRGF0YS51c2VyX2luZm8gJiYgUmVzb2x2ZURhdGEudXNlcl9pbmZvLnVzZXJfc3VidXJiKSA/IFJlc29sdmVEYXRhLnVzZXJfaW5mby51c2VyX3N1YnVyYjpudWxsLFxuICAgICAgICAgICAgICAgICdlbWFpbCc6UmVzb2x2ZURhdGEuZW1haWxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogc2F2ZSB1c2VyIGRhdGFcbiAgICAgICAgICogXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuXG4gICAgICAgIHNlbGYuc2F2ZXVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBfdXNlciA9IGFuZ3VsYXIuY29weShzZWxmLnVzZXJNb2RlbCksXG4gICAgICAgICAgICAgICAgcmVzb3VyY2UgPSBBY2NvdW50TW9kZWwudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IF91c2VyLmlkXG4gICAgICAgICAgICAgICAgfSwgX3VzZXIpO1xuICAgICAgICAgICAgcmVzb3VyY2UudGhlbihmdW5jdGlvbihzdWNjZXNzUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsIFwiRGV0YWlsIFNhdmVcIiwgXCJEYXRhaWxzIGhhcyBiZWVuIHVwZGF0ZWQuXCIpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3JSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTYXZpbmcgRGV0YWlsczonLCBlcnJvclJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIFxuXG4gICAgfVxuICAgIC8vZW5kIG9mIGNvbnRyb2xsZXJcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50JylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1VzZXJDb250cm9sbGVyJywgVXNlckNvbnRyb2xsZXIpO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyoqXG4gICAgICogQG5nZG9jIGNvbmZpZ1xuICAgICAqXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50LmNvbmZpZy5Kb2JTZWVrZXJTdGF0ZXNcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuQWNjb3VudFxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQ29uZmlndXJlIEFjY291bnQgbW9kdWxlIHJvdXRlc1xuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuQWNjb3VudCcpXG4gICAgICAgIC5jb25maWcoSm9iU2Vla2VyU3RhdGVzKTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIEpvYlNlZWtlclN0YXRlcygkc3RhdGVQcm92aWRlciwgQVBQX0NPTkZJRykge1xuXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdqb2Jfc2Vla2VyJywge1xuICAgICAgICAgICAgcGFyZW50OiAnYWNjb3VudCcsXG4gICAgICAgICAgICBhYnNvbHV0ZTogdHJ1ZSxcbiAgICAgICAgICAgIHVybDogJ14vam9iX3NlZWtlcicsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdhY2NvdW50X2NvbnRlbnRfdmlldyc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IHVpLXZpZXc9XCJhY2NvdW50X2pvYl9zZWVrZXJfdmlld1wiIGNsYXNzPVwiZmFkZUluIGFuaW1hdGVkXCI+PC9kaXY+J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2FjY291bnRfdG9wX25hdl92aWV3JyA6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IEFQUF9DT05GSUcubW9kdWxlcyArICcvYWNjb3VudC9qb2Jfc2Vla2VyL2pvYl9zZWVrZXItbmF2Lmh0bWwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KS5zdGF0ZSgnam9iX3NlZWtlci5maW5kLWpvYi1zZWVrZXInLCB7XG4gICAgICAgICAgICBwYXJlbnQ6ICdqb2Jfc2Vla2VyJyxcbiAgICAgICAgICAgIHVybDogJy9maW5kLWpvYi1zZWVrZXInLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnYWNjb3VudF9qb2Jfc2Vla2VyX3ZpZXdAam9iX3NlZWtlcic6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IEFQUF9DT05GSUcubW9kdWxlcyArICcvYWNjb3VudC9qb2Jfc2Vla2VyL2ZpbmQtam9iLXNlZWtlci5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0pvYlNlZWtlckNvbnRyb2xsZXIgYXMgX3NlbGYnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgQ29udHJvbGxlclxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuQWNjb3VudC5Db250cm9sbGVyLkpvYlNlZWtlckNvbnRyb2xsZXJcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuQWNjb3VudFxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogSm9iU2Vla2VyQ29udHJvbGxlciBpcyByZXNwb25zaWJsZSBtYW5hZ2UgdXNlcidzIHJldmlld1xuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIEpvYlNlZWtlckNvbnRyb2xsZXIoJHN0YXRlLEFjY291bnRNb2RlbCx0b2FzdGVyKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgaW5pdCgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBpbml0aWFsaXplIHByb3BlcnRpZXNcbiAgICAgICAgICogXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBbam9ic2Vla2VyIGxpc3RdXG4gICAgICAgICAgICAgKiBAVHJ1ZSB7QXJyYXl9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICBzZWxmLmpvYnNlZWtlckxpc3QgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAqIGdldEpvYlNlYWtlclxuICAgICAgICAqIEBwYXJhbXMge09iamVjdH1cbiAgICAgICAgKiBAcmV0dXJuIHtpZH1cbiAgICAgICAgKi9cbiAgICAgICAgc2VsZi5nZXRKb2JTZWFrZXIgPSBmdW5jdGlvbigpe1xuICAgICAgICAgIHJldHVybiBBY2NvdW50TW9kZWwuZ2V0Sm9iU2Vla2Vycyh7XG4gICAgICAgICAgICAgICAgJ3EnOiBzZWxmLnFcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uY2UpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmpvYnNlZWtlckxpc3QgPSByZXNwb25jZTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gICBcblxuICAgIH1cbiAgICAvL2VuZCBvZiBjb250cm9sbGVyXG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuQWNjb3VudCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdKb2JTZWVrZXJDb250cm9sbGVyJywgSm9iU2Vla2VyQ29udHJvbGxlcik7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgQ29udHJvbGxlclxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuQWNjb3VudC5Db250cm9sbGVyLkFjY291bnRCdXNpbmVzc0luZm9Db250cm9sbGVyXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkFjY291bnRcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEFjY291bnRCdXNpbmVzc0luZm9Db250cm9sbGVyIGlzIHJlc3BvbnNpYmxlIG1hbmFnZSB1c2VyJ3MgYnVzaW5lc3MgaW5mb1xuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIEFjY291bnRCdXNpbmVzc0luZm9Db250cm9sbGVyKCRzdGF0ZSwgQWNjb3VudE1vZGVsLCBBY2NvdW50RmFjdG9yeSwgUmVzb2x2ZURhdGEsIHRvYXN0ZXIsIFN1YnVyYnNNb2RlbCxDYXRlZ29yaWVzTW9kZWwsU3Bpbm5lcikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgc2VsZi50aW1lT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHJlYWRvbmx5SW5wdXQ6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd01lcmlkaWFuOiB0cnVlXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGdldCBzdWJ1cmJMaXN0XG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgc2VsZi5zdWJ1cmJMaXN0ID0gW107XG5cdFx0IC8qKlxuICAgICAgICAgKiBnZXQgc3VidXJiTGlzdFxuICAgICAgICAgKiBcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIHNlbGYuY2F0ZWdvcmllc0xpc3QgPSBbXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogaW5pdGlhbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgaW5pdCgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIGdldCB1c2VySW5mb1xuICAgICAgICAgICAgICogXG4gICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgc2VsZi51c2VyQnVzaW5lc3NNb2RlbCA9IFJlc29sdmVEYXRhLnVzZXJfYnVzaW5lc3MgPyB7XG4gICAgICAgICAgICAgICAgJ2lkJzogUmVzb2x2ZURhdGEuaWQsXG4gICAgICAgICAgICAgICAgJ25hbWUnOiBSZXNvbHZlRGF0YS51c2VyX2J1c2luZXNzLmJ1c2luZXNzX25hbWUsXG4gICAgICAgICAgICAgICAgJ3dlYnNpdGUnOiBSZXNvbHZlRGF0YS51c2VyX2J1c2luZXNzLndlYnNpdGUsXG4gICAgICAgICAgICAgICAgJ2FkZHJlc3MnOiBSZXNvbHZlRGF0YS51c2VyX2J1c2luZXNzLmJ1c2luZXNzX2FkZHJlc3MsXG4gICAgICAgICAgICAgICAgJ2xvY2F0aW9ucyc6IChSZXNvbHZlRGF0YS51c2VyX2J1c2luZXNzLnVzZXJfYnVzaW5lc3Nfc3VidXJiKSA/IFtSZXNvbHZlRGF0YS51c2VyX2J1c2luZXNzLnVzZXJfYnVzaW5lc3Nfc3VidXJiXSA6IFtdLFxuICAgICAgICAgICAgICAgICdlbWFpbCc6IFJlc29sdmVEYXRhLnVzZXJfYnVzaW5lc3MuYnVzaW5lc3NfZW1haWwsXG4gICAgICAgICAgICAgICAgJ2NhdGVnb3JpZXMnOiAoUmVzb2x2ZURhdGEudXNlcl9idXNpbmVzcy5idXNpbmVzc19jYXRlZ29yaWVzKSA/IGFuZ3VsYXIuZnJvbUpzb24oUmVzb2x2ZURhdGEudXNlcl9idXNpbmVzcy5idXNpbmVzc19jYXRlZ29yaWVzKSA6IFtdLFxuICAgICAgICAgICAgfSA6IHtcbiAgICAgICAgICAgICAgICAnaWQnOiBSZXNvbHZlRGF0YS5pZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgc2VsZi5idXNzaW5lc3NEYXlzID0gQWNjb3VudEZhY3RvcnkuZ2V0RGVmYXVsdEJ1c2luZXNzRGF5cygpO1xuICAgICAgICAgICAgc2VsZi5idXNzaW5lc3NIb3VycyA9IChSZXNvbHZlRGF0YS51c2VyX2J1c2luZXNzICYmIFJlc29sdmVEYXRhLnVzZXJfYnVzaW5lc3Mub3BlcmF0aW5nX2hvdXJzKSA/IGFuZ3VsYXIuZnJvbUpzb24oUmVzb2x2ZURhdGEudXNlcl9idXNpbmVzcy5vcGVyYXRpbmdfaG91cnMpIDogQWNjb3VudEZhY3RvcnkuZ2V0RGVmYXVsdEJ1c2luZXNzSG91cnMoKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHNhdmUgdXNlciBidXNpbmVzcyBkYXRhXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cblxuICAgICAgICBzZWxmLnVwZGF0ZUJ1c2luZXNzSW5mbyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgU3Bpbm5lci5zdGFydCgpO1xuICAgICAgICAgICAgaWYgKHNlbGYudXNlckJ1c2luZXNzTW9kZWwuaGFzT3duUHJvcGVydHkoJ2lkJykpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnVzZXJCdXNpbmVzc01vZGVsLm9wZXJhdGluZ19ob3VycyA9IGFuZ3VsYXIudG9Kc29uKHNlbGYuYnVzc2luZXNzSG91cnMpO1xuICAgICAgICAgICAgICAgIHNlbGYudXNlckJ1c2luZXNzTW9kZWwuY2F0ZWdvcmllcyA9IGFuZ3VsYXIudG9Kc29uKHNlbGYudXNlckJ1c2luZXNzTW9kZWwuY2F0ZWdvcmllcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgX2J1c2luZXNzID0gYW5ndWxhci5jb3B5KHNlbGYudXNlckJ1c2luZXNzTW9kZWwpLHJlc291cmNlO1xuICAgICAgICAgICAgX2J1c2luZXNzLmxvY2F0aW9ucyA9IF8ubWFwKF9idXNpbmVzcy5sb2NhdGlvbnMsIGZ1bmN0aW9uKGxvY2F0aW9uKXtcbiAgICAgICAgICAgICAgcmV0dXJuIGxvY2F0aW9uLmlkO1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIHJlc291cmNlID0gQWNjb3VudE1vZGVsLnVwZGF0ZWJ1c2luZXNzKHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IF9idXNpbmVzcy5pZFxuICAgICAgICAgICAgICAgIH0sIF9idXNpbmVzcyk7XG4gICAgICAgICAgICByZXNvdXJjZS50aGVuKGZ1bmN0aW9uKHN1Y2Nlc3NSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgXCJCdXNpbmVzcyBEZXRhaWwgU2F2ZVwiLCBcIkJ1c2luZXNzIERhdGFpbHMgaGFzIGJlZW4gc2F2ZWQgU3VjY2Vzc2Z1bGx5LlwiKTtcbiAgICAgICAgICAgICAgICBTcGlubmVyLnN0b3AoKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBTcGlubmVyLnN0b3AoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2F2aW5nIEJ1c2luZXNzIERldGFpbDonLCBlcnJvclJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19XG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX1cbiAgICAgICAgICovXG4gICAgICAgIHNlbGYuZ2V0TG9jYXRpb24gPSBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgIGlmICh2YWwubGVuZ3RoIDwgMykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFN1YnVyYnNNb2RlbFxuICAgICAgICAgICAgICAgIC5maW5kTG9jYXRpb24oe1xuICAgICAgICAgICAgICAgICAgICAncSc6IHZhbFxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oc3VjY2Vzc1Jlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc3VidXJiTGlzdCA9IHN1Y2Nlc3NSZXNwb25zZS5saXN0O1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1NhdmluZyBEZXRhaWxzOicsIGVycm9yUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cdFx0XG5cdFx0LyoqXG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX1cbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfVxuICAgICAgICAgKi9cbiAgICAgICAgc2VsZi5nZXRDYXRlZ29yaWVzID0gZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICBpZiAodmFsLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBDYXRlZ29yaWVzTW9kZWxcbiAgICAgICAgICAgICAgICAuc2VhcmNoY2F0ZWdvcmllcyh7XG4gICAgICAgICAgICAgICAgICAgICdxJzogdmFsXG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihzdWNjZXNzUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jYXRlZ29yaWVzTGlzdCA9IHN1Y2Nlc3NSZXNwb25zZS5saXN0O1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1NhdmluZyBEZXRhaWxzOicsIGVycm9yUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgc2VsZi5tb2RlbE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBkZWJvdW5jZToge1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDUwMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldHRlclNldHRlcjogdHJ1ZVxuICAgICAgICB9O1xuXG4gICAgfVxuICAgIC8vZW5kIG9mIGNvbnRyb2xsZXJcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50JylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0FjY291bnRCdXNpbmVzc0luZm9Db250cm9sbGVyJywgQWNjb3VudEJ1c2luZXNzSW5mb0NvbnRyb2xsZXIpO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyoqXG4gICAgICogQG5nZG9jIGNvbmZpZ1xuICAgICAqXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50LmNvbmZpZy5BY2NvdW50QnVzaW5lc3NJbmZvU3RhdGVzXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkFjY291bnRcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIENvbmZpZ3VyZSBBY2NvdW50IG1vZHVsZSByb3V0ZXNcbiAgICAgKlxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkFjY291bnQnKVxuICAgICAgICAuY29uZmlnKEFjY291bnRCdXNpbmVzc0luZm9TdGF0ZXMpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gQWNjb3VudEJ1c2luZXNzSW5mb1N0YXRlcygkc3RhdGVQcm92aWRlciwgQVBQX0NPTkZJRykge1xuXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdidXNpbmVzc19pbmZvJywge1xuICAgICAgICAgICAgcGFyZW50OiAnYWNjb3VudCcsXG4gICAgICAgICAgICBhYnNvbHV0ZTogdHJ1ZSxcbiAgICAgICAgICAgIHVybDogJ14vYnVzaW5lc3NfaW5mbycsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdhY2NvdW50X2NvbnRlbnRfdmlldyc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IHVpLXZpZXc9XCJhY2NvdW50X2J1c2luZXNzX2luZm9fdmlld1wiIGNsYXNzPVwiZmFkZUluIGFuaW1hdGVkXCI+PC9kaXY+J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2FjY291bnRfdG9wX25hdl92aWV3JyA6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IEFQUF9DT05GSUcubW9kdWxlcyArICcvYWNjb3VudC9idXNpbmVzc19pbmZvL2J1c2luZXNzX2luZm8tbmF2Lmh0bWwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KS5zdGF0ZSgnYnVzaW5lc3NfaW5mby5iYXNpY19pbmZvJywge1xuICAgICAgICAgICAgcGFyZW50OiAnYnVzaW5lc3NfaW5mbycsXG4gICAgICAgICAgICB1cmw6ICcvYmFzaWMtaW5mbycsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdhY2NvdW50X2J1c2luZXNzX2luZm9fdmlld0BidXNpbmVzc19pbmZvJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogQVBQX0NPTkZJRy5tb2R1bGVzICsgJy9hY2NvdW50L2J1c2luZXNzX2luZm8vYmFzaWMtaW5mby5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FjY291bnRCdXNpbmVzc0luZm9Db250cm9sbGVyIGFzIF9zZWxmJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgUmVzb2x2ZURhdGE6IGZ1bmN0aW9uKFJlc29sdmVEYXRhKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVzb2x2ZURhdGEudXNlcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnN0YXRlKCdidXNpbmVzc19pbmZvLm9wZXJhdGlvbl90aW1lJywge1xuICAgICAgICAgICAgcGFyZW50OiAnYnVzaW5lc3NfaW5mbycsXG4gICAgICAgICAgICB1cmw6ICcvb3BlcmF0aW9uLXRpbWUnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnYWNjb3VudF9idXNpbmVzc19pbmZvX3ZpZXdAYnVzaW5lc3NfaW5mbyc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IEFQUF9DT05GSUcubW9kdWxlcyArICcvYWNjb3VudC9idXNpbmVzc19pbmZvL29wZXJhdGlvbi10aW1lLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQWNjb3VudEJ1c2luZXNzSW5mb0NvbnRyb2xsZXIgYXMgX3NlbGYnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICBSZXNvbHZlRGF0YTogZnVuY3Rpb24oUmVzb2x2ZURhdGEpe1xuICAgICAgICAgICAgICAgIHJldHVybiBSZXNvbHZlRGF0YS51c2VyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuc3RhdGUoJ2J1c2luZXNzX2luZm8uZmFxcycsIHtcbiAgICAgICAgICAgIHBhcmVudDogJ2J1c2luZXNzX2luZm8nLFxuICAgICAgICAgICAgdXJsOiAnL2ZhcXMnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnYWNjb3VudF9idXNpbmVzc19pbmZvX3ZpZXdAYnVzaW5lc3NfaW5mbyc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IEFQUF9DT05GSUcubW9kdWxlcyArICcvYWNjb3VudC9idXNpbmVzc19pbmZvL2J1c2luZXNzLWZhcXMuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBY2NvdW50QnVzaW5lc3NJbmZvQ29udHJvbGxlciBhcyBfc2VsZidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgIFJlc29sdmVEYXRhOiBmdW5jdGlvbihSZXNvbHZlRGF0YSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlc29sdmVEYXRhLnVzZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG4gIC8qZ2xvYmFsIGFuZ3VsYXI6IGZhbHNlICovXG5cbiAgYW5ndWxhci5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cycsIFsnQmVhdXR5Q29sbGVjdGl2ZS5Db3JlJ10pO1xufSgpKTsiLCIndXNlIHN0cmljdCc7XG5hbmd1bGFyXG4gIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cycpXG4gIC5kaXJlY3RpdmUoJ25vdGlmaWNhdGlvbnMnLGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6J3dpZGdldHMvbm90aWZpY2F0aW9ucy9ub3RpZmljYXRpb25zLmh0bWwnLFxuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgIFx0fTtcblx0fSk7XG5cblxuIiwiJ3VzZSBzdHJpY3QnO1xuYW5ndWxhclxuICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLldpZGdldHMnKVxuICAuZGlyZWN0aXZlKCd0aW1lbGluZScsZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6J3dpZGdldHMvdGltZWxpbmUvdGltZWxpbmUuaHRtbCcsXG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgfTtcbiAgfSk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBGYWN0b3J5XG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzLkZhY3RvcnkuU2hvcnRsaXN0am9iUmVzb3VyY2VcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0c1xuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogSW1wbGVtZW50cyBDVVJEIG9wZXJhdGlvbnNcbiAgICAgKlxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG4gICAgYW5ndWxhclxuICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzJylcbiAgICAgIC5mYWN0b3J5KCdTaG9ydGxpc3Rqb2JSZXNvdXJjZScsU2hvcnRsaXN0am9iUmVzb3VyY2UpO1xuXHRcblx0LyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gU2hvcnRsaXN0am9iUmVzb3VyY2UoJHJlc291cmNlLCBBUFBfQ09ORklHKSB7XG4gICAgICAvKiAkcmVzb3VyY2UoQVBJX1VSTCwgREVGQVVMVF9QQVJBTUVURVJTLCBDT05GSUdVUkVfWU9VUl9DVVNUT01fTUVUSE9EUykqL1xuICAgICAgcmV0dXJuICRyZXNvdXJjZSgnLi4vc2hvcnRsaXN0am9iJywge30sXG4gICAgICAgIHtcbiAgICAgICAgU2hvcnRsaXN0Sm9iOiB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCdcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBTZXJ2aWNlXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzLlNlcnZpY2UuU2hvcnRsaXN0am9iTW9kZWxcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0c1xuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICpcbiAgICAgKiBEYXRhIG1vZGVsIGZvciBCb29raW5nIG1vZHVsZVxuICAgICAqIEltcGxlbWVuZXRzIENVUkQgb3BlcmF0aW9uXG4gICAgICpcbiAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAqL1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzJylcbiAgICAgICAgLnNlcnZpY2UoJ1Nob3J0bGlzdGpvYk1vZGVsJywgU2hvcnRsaXN0am9iTW9kZWwpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gU2hvcnRsaXN0am9iTW9kZWwoU2hvcnRsaXN0am9iUmVzb3VyY2UpIHtcbiAgICAgICAgdmFyIG1vZGVsID0gdGhpcztcbiAgICAgICBcblx0XHQvKipcbiAgICAgICAgICogW1Nob3J0bGlzdGpvYiBkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQG1ldGhvZCBTaG9ydGxpc3Rqb2JcbiAgICAgICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSAgICAgICAgICBwYXJhbXMgW2Rlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqL1xuXHRcdFxuXHRcdG1vZGVsLlNob3J0bGlzdEpvYiA9IGZ1bmN0aW9uKHBhcmFtcywgc3VjY2VzcywgZmFpbCkge1xuICAgICAgICAgICAgcmV0dXJuIFNob3J0bGlzdGpvYlJlc291cmNlLlNob3J0bGlzdEpvYihwYXJhbXMsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuICAgICAgICB9O1xuXHRcdFxuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBDb250cm9sbGVyXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzLkNvbnRyb2xsZXIuU2hvcnRsaXN0am9iQ29udHJvbGxlclxuICAgICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBTaG9ydGxpc3Rqb2JDb250cm9sbGVyIGlzIHJlc3BvbnNpYmxlIGZvciBib29raW5nIGFwcG9pbnRtZW50c1xuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cycpXG4gICAgICAgIC5jb250cm9sbGVyKCdTaG9ydGxpc3Rqb2JDb250cm9sbGVyJywgU2hvcnRsaXN0am9iQ29udHJvbGxlcik7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cblxuICAgIGZ1bmN0aW9uIFNob3J0bGlzdGpvYkNvbnRyb2xsZXIoJHNhbml0aXplLCRxLCBMb2dnZXIsIFNwaW5uZXIsIFNob3J0bGlzdGpvYk1vZGVsLHRvYXN0ZXIpIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogW3NlbGYgZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEB0eXBlIHtbdHlwZV19XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cdFx0aW5pdCgpO1xuICAgICAgICAvKipcbiAgICAgICAgICogW2luaXQgZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgIFx0XHRMb2dnZXIuZ2V0SW5zdGFuY2UoJ1Nob3J0bGlzdGpvYkNvbnRyb2xsZXInKS5pbmZvKCdTaG9ydGxpc3Rqb2IgQ29udHJvbGxlciBoYXMgaW5pdGlhbGl6ZWQnKTtcblx0XHR9XG5cdFx0XG5cdFx0ICBcblx0ICBzZWxmLnNob3J0bGlzdEpvYj0gZnVuY3Rpb24oKSB7XG5cdFx0U2hvcnRsaXN0am9iTW9kZWwuU2hvcnRsaXN0Sm9iKHtcblx0XHRcdH0se2lkOnNlbGYuaWR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbmNlKXtcblx0XHRcdFx0aWYocmVzcG9uY2Uuc3RhdHVzKXtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCBcIkpvYiBTYXZlZFwiLCByZXNwb25jZS5tZXNzYWdlKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0dG9hc3Rlci5wb3AoJ2Vycm9yJywgXCJKb2IgQWxyZWFkeSBTYXZlZFwiLCByZXNwb25jZS5tZXNzYWdlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxmdW5jdGlvbigpe1xuXHRcdH0pO1xuXHQgIH07XG5cblx0XHRcblx0fVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyoqXG4gICAgICogQG5nZG9jIERpcmVjdGl2ZVxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cy5zaG9ydGxpc3RKb2JcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0c1xuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogd2lkZ2V0IGlzIHVzZWQgdG8gdXNlIGltcGxlbWVudCBsb2dpbiBmdW5jdGlvbmFsaXR5XG4gICAgICpcbiAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAqL1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnc2hvcnRsaXN0Sm9iJywgW2Z1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJAaWRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXBwcy93aWRnZXRzL3Nob3J0bGlzdC1qb2Ivc2hvcnRsaXN0am9iLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6J1Nob3J0bGlzdGpvYkNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3NlbGYnLFxuICAgICAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsIC8vcmVxdWlyZWQgaW4gMS4zKyB3aXRoIGNvbnRyb2xsZXJBc1xuICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBpQXR0cnMsIG5nTW9kZWwpIHtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgRmFjdG9yeVxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cy5GYWN0b3J5LlNlYXJjaFJlc3VsdFJlc291cmNlXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLldpZGdldHNcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEltcGxlbWVudHMgQ1VSRCBvcGVyYXRpb25zXG4gICAgICpcbiAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAqL1xuICAgIGFuZ3VsYXJcbiAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cycpXG4gICAgICAuZmFjdG9yeSgnU2VhcmNoUmVzdWx0UmVzb3VyY2UnLCBTZWFyY2hSZXN1bHRSZXNvdXJjZSk7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBTZWFyY2hSZXN1bHRSZXNvdXJjZSgkcmVzb3VyY2UsIEFQUF9DT05GSUcpIHtcbiAgICAgIC8qICRyZXNvdXJjZShBUElfVVJMLCBERUZBVUxUX1BBUkFNRVRFUlMsIENPTkZJR1VSRV9ZT1VSX0NVU1RPTV9NRVRIT0RTKSovXG4gICAgICByZXR1cm4gJHJlc291cmNlKCdnZXRyZWNvcmRzJywge30sXG4gICAgICAgIHtcbiAgICAgICAgZmluZEFsbDoge1xuICAgICAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXHRcblx0ZnVuY3Rpb24gdHJhbnNmb3JtUXVlcnlSZXNwb25zZShkYXRhLCBoZWFkZXJzR2V0dGVyKSB7XG4gICAgICAgIHZhciBfcmVzcG9uc2UgPSB7fTtcbiAgICAgICAgX3Jlc3BvbnNlLmxpc3QgPSBhbmd1bGFyLmZyb21Kc29uKGRhdGEpO1xuICAgICAgICByZXR1cm4gYW5ndWxhci5mcm9tSnNvbihfcmVzcG9uc2UpO1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBTZXJ2aWNlXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzLlNlcnZpY2UuU2VhcmNoUmVzdWx0TW9kZWxcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0c1xuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICpcbiAgICAgKiBEYXRhIG1vZGVsIGZvciBqb2J0YXNrIG1vZHVsZVxuICAgICAqIEltcGxlbWVuZXRzIENVUkQgb3BlcmF0aW9uXG4gICAgICpcbiAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAqL1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzJylcbiAgICAgICAgLnNlcnZpY2UoJ1NlYXJjaFJlc3VsdE1vZGVsJywgU2VhcmNoUmVzdWx0TW9kZWwpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gU2VhcmNoUmVzdWx0TW9kZWwoU2VhcmNoUmVzdWx0UmVzb3VyY2UpIHtcbiAgICAgICAgdmFyIG1vZGVsID0gdGhpcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFtqb2JMaXN0IGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAVHJ1ZSB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBtb2RlbC5zZWFyY2hMaXN0ID0gW107XG5cdFx0XG5cdFx0LyoqXG4gICAgICAgICAqIFtmaW5kQWxsIGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAbWV0aG9kIGZpbmRBbFxuICAgICAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19ICAgICAgICAgIHBhcmFtcyBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgICAgICovXG5cdFx0XG5cdFx0bW9kZWwuZmluZEFsbCA9IGZ1bmN0aW9uKHBhcmFtcywgc3VjY2VzcywgZmFpbCkge1xuICAgICAgICAgICAgcmV0dXJuIFNlYXJjaFJlc3VsdFJlc291cmNlLmZpbmRBbGwocGFyYW1zLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyoqXG4gICAgICogQG5nZG9jIENvbnRyb2xsZXJcbiAgICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLldpZGdldHMuQ29udHJvbGxlci5TZWFyY2hDb250cm9sbGVyXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLldpZGdldHNcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFNlYXJjaFJlc3VsdENvbnRyb2xsZXIgaXMgcmVzcG9uc2libGUgZm9yIHNlYXJjaCBsaXN0aW5nc1xuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cycpXG4gICAgICAgIC5jb250cm9sbGVyKCdTZWFyY2hSZXN1bHRDb250cm9sbGVyJywgU2VhcmNoUmVzdWx0Q29udHJvbGxlcik7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cblxuICAgIGZ1bmN0aW9uIFNlYXJjaFJlc3VsdENvbnRyb2xsZXIoJHNhbml0aXplLCAkcSwgTG9nZ2VyLCBTcGlubmVyLCBTZWFyY2hSZXN1bHRNb2RlbCwgJGxvY2F0aW9uKSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFtzZWxmIGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAdHlwZSB7W3R5cGVdfVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLmhvc3QgPSAkbG9jYXRpb24ucHJvdG9jb2woKSArICc6Ly8nICsgJGxvY2F0aW9uLmhvc3QoKSArICgkbG9jYXRpb24ucG9ydCgpID8gJzonICsgJGxvY2F0aW9uLnBvcnQoKSA6ICcnKTtcbiAgICAgICAgc2VsZi5zZWxlY3RlZFRhYnMgPSBbXTtcblxuICAgICAgICBzZWxmLnRhYnMgPSBbe1xuICAgICAgICAgICAgJ2lkJzogJ2RlYWwnLFxuICAgICAgICAgICAgJ2FjdGl2ZSc6IGZhbHNlLFxuICAgICAgICAgICAgJ2xhYmVsJzogJ0RlYWxzJyxcbiAgICAgICAgICAgICd1cmwnOiAnZGVhbHMnLFxuICAgICAgICAgICAgJ2FjbGFzcyc6ICdzZWFyY2hfZGVhbF9pY29uJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICAnaWQnOiAnYnVzaW5lc3Nmb3JzYWxlJyxcbiAgICAgICAgICAgICdhY3RpdmUnOiBmYWxzZSxcbiAgICAgICAgICAgICdsYWJlbCc6ICdCdXNpbmVzcyBmb3Igc2FsZScsXG4gICAgICAgICAgICAndXJsJzogJ2J1c2luZXNzJyxcbiAgICAgICAgICAgICdhY2xhc3MnOiAnc2VhcmNoX2J1c2luZXNzX2ljb24nXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgICdpZCc6ICdzY2hvb2xjb2xsZWdlcycsXG4gICAgICAgICAgICAnYWN0aXZlJzogZmFsc2UsXG4gICAgICAgICAgICAnbGFiZWwnOiAnU2Nob29scyAmIENvbGxlZ2VzJyxcbiAgICAgICAgICAgICd1cmwnOiAnc2Nob29sY29sbGVnZXMnLFxuICAgICAgICAgICAgJ2FjbGFzcyc6ICdzZWFyY2hfc2Nob29sY29sbGVnZXNfaWNvbidcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgJ2lkJzogJ2dhbGxlcnknLFxuICAgICAgICAgICAgJ2FjdGl2ZSc6IGZhbHNlLFxuICAgICAgICAgICAgJ2xhYmVsJzogJ0dhbGxlcnknLFxuICAgICAgICAgICAgJ3VybCc6ICdnYWxsZXJ5JyxcbiAgICAgICAgICAgICdhY2xhc3MnOiAnc2VhcmNoX2dhbGxlcnlfaWNvbidcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgJ2lkJzogJ3NlcnZpY2Vwcm92aWRlcicsXG4gICAgICAgICAgICAnYWN0aXZlJzogZmFsc2UsXG4gICAgICAgICAgICAnbGFiZWwnOiAnU2VydmljZSBQcm92aWRlcicsXG4gICAgICAgICAgICAndXJsJzogJ3Byb2ZpbGUnLFxuICAgICAgICAgICAgJ2FjbGFzcyc6ICdzZWFyY2hfc2VydmljZXByb3ZpZGVyX2ljb24nXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgICdpZCc6ICdqb2InLFxuICAgICAgICAgICAgJ2FjdGl2ZSc6IGZhbHNlLFxuICAgICAgICAgICAgJ2xhYmVsJzogJ0pvYnMnLFxuICAgICAgICAgICAgJ3VybCc6ICdqb2JzJyxcbiAgICAgICAgICAgICdhY2xhc3MnOiAnc2VhcmNoX2pvYl9pY29uJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICAnaWQnOiAnY2xhc3NpZmllZCcsXG4gICAgICAgICAgICAnYWN0aXZlJzogdHJ1ZSxcbiAgICAgICAgICAgICdsYWJlbCc6ICdDbGFzc2lmaWVkcycsXG4gICAgICAgICAgICAndXJsJzogJ2NsYXNzaWZpZWRzJyxcbiAgICAgICAgICAgICdhY2xhc3MnOiAnc2VhcmNoX2NsYXNzaWZpZWRzX2ljb24nXG4gICAgICAgIH1dO1xuXG4gICAgICAgIGluaXQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogW2luaXQgZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgTG9nZ2VyLmdldEluc3RhbmNlKCdTZWFyY2hSZXN1bHRDb250cm9sbGVyJykuaW5mbygnU2VhcmNoIFJlc3VsdCBDb250cm9sbGVyIGhhcyBpbml0aWFsaXplZCcpO1xuICAgICAgICAgICAgc2VsZi5xcyA9IGdldFF1ZXJ5U3RyaW5ncygpO1xuICAgICAgICAgICAgc2V0U2VsZWN0ZVRhYnMoc2VsZi5xc1snc2VhcmNoRm9yJ10pO1xuICAgICAgICAgICAgZ2V0UmVjb3JkcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0UmVjb3JkcygpIHtcbiAgICAgICAgICAgIFNwaW5uZXIuc3RhcnQoKTtcbiAgICAgICAgICAgIFNlYXJjaFJlc3VsdE1vZGVsLmZpbmRBbGwoc2VsZi5xcykudGhlbihmdW5jdGlvbihyZXNwb25jZSkge1xuICAgICAgICAgICAgICAgIF8uZWFjaChzZWxmLnNlbGVjdGVkVGFicywgZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFRhYnNbaW5kZXhdLmRhdGEgPSByZXNwb25jZVtpdGVtLmlkXTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBTcGlubmVyLnN0b3AoKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgU3Bpbm5lci5zdG9wKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFF1ZXJ5U3RyaW5ncygpIHtcbiAgICAgICAgICAgIHZhciBhc3NvYyA9IHt9O1xuICAgICAgICAgICAgdmFyIGRlY29kZSA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHMucmVwbGFjZSgvXFwrL2csIFwiIFwiKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIHF1ZXJ5U3RyaW5nID0gbG9jYXRpb24uc2VhcmNoLnN1YnN0cmluZygxKTtcbiAgICAgICAgICAgIHZhciBrZXlWYWx1ZXMgPSBxdWVyeVN0cmluZy5zcGxpdCgnJicpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIGtleVZhbHVlcykge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBrZXlWYWx1ZXNbaV0uc3BsaXQoJz0nKTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgYXNzb2NbZGVjb2RlKGtleVswXSldID0gZGVjb2RlKGtleVsxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYXNzb2M7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRTZWxlY3RlVGFicyhzZWFyY2hGb3IpIHtcbiAgICAgICAgICAgIHZhciBzZWFyY2hGb3IgPSBzZWFyY2hGb3Iuc3BsaXQoJywnKTtcbiAgICAgICAgICAgIF8uZWFjaChzZWFyY2hGb3IsIGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgXy5lYWNoKHNlbGYudGFicywgZnVuY3Rpb24odGFiLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSA9PSB0YWIuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudGFic1tpbmRleF0uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRUYWJzLnB1c2godGFiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLnNlbGVjdFRhYiA9IGZ1bmN0aW9uKHRhYikge1xuICAgICAgICAgICAgXy5lYWNoKHNlbGYudGFicywgZnVuY3Rpb24obGlzdCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAobGlzdC5pZCA9PT0gdGFiLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0LmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuc2VsZWN0ZWRUYWJzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnRhYnNbaW5kZXhdLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucXMuc2VhcmNoRm9yID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGFiX2luZGV4ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKHNlbGYuc2VsZWN0ZWRUYWJzLCBmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PSB0YWIuaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJfaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBzZWxmLnFzLnNlYXJjaEZvciArPSBpdGVtLmlkICsgJywnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3JldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnFzLnNlYXJjaEZvciA9IF8udHJpbShzZWxmLnFzLnNlYXJjaEZvciwgWycsJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRUYWJzLnNwbGljZSh0YWJfaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuc2VsZWN0ZWRUYWJzLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTcGlubmVyLnN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi50YWJzW2luZGV4XS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYi5kYXRhID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkVGFicy5wdXNoKHRhYik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gYW5ndWxhci5jb3B5KHNlbGYucXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5LnNlYXJjaEZvciA9IHRhYi5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWFyY2hSZXN1bHRNb2RlbC5maW5kQWxsKHF1ZXJ5KS50aGVuKGZ1bmN0aW9uKHJlc3BvbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRUYWJzW3NlbGYuc2VsZWN0ZWRUYWJzLmxlbmd0aCAtIDFdLmRhdGEgPSByZXNwb25jZVt0YWIuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnFzLnNlYXJjaEZvciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChzZWxmLnNlbGVjdGVkVGFicywgZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucXMuc2VhcmNoRm9yICs9IGl0ZW0uaWQgKyAnLCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucXMuc2VhcmNoRm9yID0gXy50cmltKHNlbGYucXMuc2VhcmNoRm9yLCBbJywnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNwaW5uZXIuc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNwaW5uZXIuc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgRGlyZWN0aXZlXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzLndpZGdldExvZ2luXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLldpZGdldHNcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIHdpZGdldCBpcyB1c2VkIHRvIHVzZSBpbXBsZW1lbnQgbG9naW4gZnVuY3Rpb25hbGl0eVxuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3dpZGdldFNlYXJjaFJlc3VsdCcsIFtmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgICAgICBcInF1ZXJ5XCI6IFwiQHF1ZXJ5XCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9hcHBzL3dpZGdldHMvc2VhcmNoLXJlc3VsdC9yZXN1bHRzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6J1NlYXJjaFJlc3VsdENvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3NlbGYnLFxuICAgICAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsIC8vcmVxdWlyZWQgaW4gMS4zKyB3aXRoIGNvbnRyb2xsZXJBc1xuICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBpQXR0cnMsIG5nTW9kZWwpIHtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgRmFjdG9yeVxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cy5GYWN0b3J5LlNlYXJjaFJlc291cmNlXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLldpZGdldHNcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEltcGxlbWVudHMgQ1VSRCBvcGVyYXRpb25zXG4gICAgICpcbiAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAqL1xuICAgIGFuZ3VsYXJcbiAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cycpXG4gICAgICAuZmFjdG9yeSgnU2VhcmNoUmVzb3VyY2UnLCBTZWFyY2hSZXNvdXJjZSk7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBTZWFyY2hSZXNvdXJjZSgkcmVzb3VyY2UsIEFQUF9DT05GSUcpIHtcbiAgICAgIC8qICRyZXNvdXJjZShBUElfVVJMLCBERUZBVUxUX1BBUkFNRVRFUlMsIENPTkZJR1VSRV9ZT1VSX0NVU1RPTV9NRVRIT0RTKSovXG4gICAgICByZXR1cm4gJHJlc291cmNlKCdzZWFyY2gnLCB7fSxcbiAgICAgICAge1xuICAgICAgICBmaW5kQWxsOiB7XG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcblx0XHQgIHRyYW5zZm9ybVJlc3BvbnNlOiB0cmFuc2Zvcm1RdWVyeVJlc3BvbnNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblx0XG5cdGZ1bmN0aW9uIHRyYW5zZm9ybVF1ZXJ5UmVzcG9uc2UoZGF0YSwgaGVhZGVyc0dldHRlcikge1xuICAgICAgICB2YXIgX3Jlc3BvbnNlID0ge307XG4gICAgICAgIF9yZXNwb25zZS5saXN0ID0gYW5ndWxhci5mcm9tSnNvbihkYXRhKTtcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZnJvbUpzb24oX3Jlc3BvbnNlKTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgU2VydmljZVxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cy5TZXJ2aWNlLlNlYXJjaE1vZGVsXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLldpZGdldHNcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqXG4gICAgICogRGF0YSBtb2RlbCBmb3Igam9idGFzayBtb2R1bGVcbiAgICAgKiBJbXBsZW1lbmV0cyBDVVJEIG9wZXJhdGlvblxuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cycpXG4gICAgICAgIC5zZXJ2aWNlKCdTZWFyY2hNb2RlbCcsIFNlYXJjaE1vZGVsKTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIFNlYXJjaE1vZGVsKFNlYXJjaFJlc291cmNlKSB7XG4gICAgICAgIHZhciBtb2RlbCA9IHRoaXM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBbam9iTGlzdCBkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQFRydWUge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgbW9kZWwuc2VhcmNoTGlzdCA9IFtdO1xuXHRcdFxuXHRcdC8qKlxuICAgICAgICAgKiBbZmluZEFsbCBkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQG1ldGhvZCBmaW5kQWxcbiAgICAgICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSAgICAgICAgICBwYXJhbXMgW2Rlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqL1xuXHRcdFxuXHRcdG1vZGVsLmZpbmRBbGwgPSBmdW5jdGlvbihwYXJhbXMsIHN1Y2Nlc3MsIGZhaWwpIHtcbiAgICAgICAgICAgIHJldHVybiBTZWFyY2hSZXNvdXJjZS5maW5kQWxsKHBhcmFtcywgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBDb250cm9sbGVyXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzLkNvbnRyb2xsZXIuU2VhcmNoQ29udHJvbGxlclxuICAgICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBTZWFyY2hDb250cm9sbGVyIGlzIHJlc3BvbnNpYmxlIGZvciBzZWFyY2ggbGlzdGluZ3NcbiAgICAgKlxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLldpZGdldHMnKVxuICAgICAgICAuY29udHJvbGxlcignU2VhcmNoQ29udHJvbGxlcicsIFNlYXJjaENvbnRyb2xsZXIpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG5cbiAgICBmdW5jdGlvbiBTZWFyY2hDb250cm9sbGVyKCRzYW5pdGl6ZSwkcSwgTG9nZ2VyLCBTcGlubmVyLCBTZWFyY2hNb2RlbCkge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBbc2VsZiBkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQHR5cGUge1t0eXBlXX1cbiAgICAgICAgICovXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5zZWxlY3RlZCA9IHRydWU7XG5cdFx0aW5pdCgpO1xuICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICogW2luaXQgZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICBMb2dnZXIuZ2V0SW5zdGFuY2UoJ1NlYXJjaENvbnRyb2xsZXInKS5pbmZvKCdTZWFyY2ggQ29udHJvbGxlciBoYXMgaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgICAgc2VsZi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgIHNlbGYubGFzdEZvdW5kV29yZCA9IG51bGw7XG4gICAgICAgICAgIHNlbGYuY3VycmVudEluZGV4ID0gbnVsbDtcbiAgICAgICAgICAgc2VsZi5qdXN0Q2hhbmdlZCA9IGZhbHNlO1xuICAgICAgICAgICBzZWxmLnNlYXJjaFRpbWVyID0gbnVsbDtcbiAgICAgICAgICAgc2VsZi5zZWFyY2hpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgc2VsZi5wYXVzZSA9IDUwMDtcbiAgICAgICAgICAgc2VsZi5taW5MZW5ndGggPSAzO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5tb2RlbE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBkZWJvdW5jZToge1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDUwMCxcbiAgICAgICAgICAgICAgICBibHVyOiAyNTBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXR0ZXJTZXR0ZXI6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLnNlYXJjaFJlY29yZCA9IGZ1bmN0aW9uKHEpIHtcbiAgICAgICAgICAgIHZhciBkZWZmZXJlZCA9ICAkcS5kZWZlcigpO1xuICAgICAgICAgICAgaWYoIXEgJiYgcS5sZW5ndGggPDMpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBTZWFyY2hNb2RlbC5maW5kQWxsKHtcbiAgICAgICAgICAgICAgICAncSc6IHNlbGYucSxcbiAgICAgICAgICAgICAgICAncG9zdCc6IHNlbGYucG9zdCxcbiAgICAgICAgICAgICAgICAnc3RhdGUnOiBzZWxmLnN0YXRlXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbmNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbmNlLmxpc3Q7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG4gICAgICAgIHNlbGYuaGFuZGxlU2VsZWN0aW9uID0gZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgc2VsZi5xID0gaXRlbTtcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB9O1xuXG5cdFx0XG5cblxuICAgICAgICBpZiAoc2VsZi51c2VyUGF1c2UpIHtcbiAgICAgICAgICAgIHNlbGYucGF1c2UgPSBzZWxmLnVzZXJQYXVzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYucHJvY2Vzc1Jlc3VsdHMgPSBmdW5jdGlvbihyZXNwb25zZURhdGEpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZURhdGEgJiYgcmVzcG9uc2VEYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBzZWxmLnJlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgdGl0bGVGaWVsZHMgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi50aXRsZUZpZWxkICYmIHNlbGYudGl0bGVGaWVsZCAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlRmllbGRzID0gc2VsZi50aXRsZUZpZWxkLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3BvbnNlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGl0bGUgdmFyaWFibGVzXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aXRsZUNvZGUgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHQgPSAwOyB0IDwgdGl0bGVGaWVsZHMubGVuZ3RoOyB0KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlQ29kZSA9IHRpdGxlQ29kZSArICBcIiArICcgJyArIFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGVDb2RlID0gdGl0bGVDb2RlICsgXCJyZXNwb25zZURhdGFbaV0uXCIgKyB0aXRsZUZpZWxkc1t0XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIEZpZ3VyZSBvdXQgZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gXCJcIjtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5kZXNjcmlwdGlvbkZpZWxkICYmIHNlbGYuZGVzY3JpcHRpb25GaWVsZCAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmFsKFwiZGVzY3JpcHRpb24gPSByZXNwb25zZURhdGFbaV0uXCIgKyBzZWxmLmRlc2NyaXB0aW9uRmllbGQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRmlndXJlIG91dCBpbWFnZVxuICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmltYWdlRmllbGQgJiYgc2VsZi5pbWFnZUZpZWxkICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2YWwoXCJpbWFnZSA9IHJlc3BvbnNlRGF0YVtpXS5cIiArIHNlbGYuaW1hZ2VGaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0Um93ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGV2YWwodGl0bGVDb2RlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlOiBpbWFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsT2JqZWN0OiByZXNwb25zZURhdGFbaV1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmVzdWx0c1tzZWxmLnJlc3VsdHMubGVuZ3RoXSA9IHJlc3VsdFJvdztcbiAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLnJlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuc2VhcmNoVGltZXJDb21wbGV0ZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgICAgaWYgKHN0ci5sZW5ndGggPj0gc2VsZi5taW5MZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5sb2NhbERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlYXJjaEZpZWxkcyA9IHNlbGYuc2VhcmNoRmllbGRzLnNwbGl0KFwiLFwiKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgbWF0Y2hlcyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5sb2NhbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBzID0gMDsgcyA8IHNlYXJjaEZpZWxkcy5sZW5ndGg7IHMrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBldmFsU3RyID0gJ21hdGNoID0gbWF0Y2ggfHwgKHNlbGYubG9jYWxEYXRhW2ldLicgKyBzZWFyY2hGaWVsZHNbc10gKyAnLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcIicgKyBzdHIudG9Mb3dlckNhc2UoKSArICdcIikgPj0gMCknO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2YWwoZXZhbFN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZXNbbWF0Y2hlcy5sZW5ndGhdID0gc2VsZi5sb2NhbERhdGFbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlYXJjaGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnByb2Nlc3NSZXN1bHRzKG1hdGNoZXMpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLiRhcHBseSgpO1xuXG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIFNlYXJjaE1vZGVsLmZpbmRBbGwoeydxJzpzZWxmLnNlYXJjaFN0cixcbiAgICAgICAgICAgICAgICAgICAgICAgICAncG9zdCc6c2VsZi5wb3N0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICdzdGF0ZSc6c2VsZi5zdGF0ZX0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uY2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucHJvY2Vzc1Jlc3VsdHMocmVzcG9uY2UubGlzdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgfSxmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5ob3ZlclJvdyA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICBzZWxmLmN1cnJlbnRJbmRleCA9IGluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5rZXlQcmVzc2VkID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIShldmVudC53aGljaCA9PSAzOCB8fCBldmVudC53aGljaCA9PSA0MCB8fCBldmVudC53aGljaCA9PSAxMykpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYuc2VhcmNoU3RyIHx8IHNlbGYuc2VhcmNoU3RyID09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zaG93RHJvcGRvd24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLnNlYXJjaFN0ci5sZW5ndGggPj0gc2VsZi5taW5MZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2hvd0Ryb3Bkb3duID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY3VycmVudEluZGV4ID0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJlc3VsdHMgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuc2VhcmNoVGltZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoc2VsZi5zZWFyY2hUaW1lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VhcmNoVGltZXJDb21wbGV0ZShzZWxmLnNlYXJjaFN0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBzZWxmLnBhdXNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuc2VsZWN0UmVzdWx0ID0gZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICBzZWxmLnNlYXJjaFN0ciA9IHJlc3VsdC50aXRsZTtcbiAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRPYmplY3QgPSByZXN1bHQ7XG4gICAgICAgICAgICBzZWxmLnNob3dEcm9wZG93biA9IGZhbHNlO1xuICAgICAgICAgICAgc2VsZi5yZXN1bHRzID0gW107XG4gICAgICAgICAgICAvL3NlbGYuJGFwcGx5KCk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgRGlyZWN0aXZlXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzLndpZGdldExvZ2luXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLldpZGdldHNcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIHdpZGdldCBpcyB1c2VkIHRvIHVzZSBpbXBsZW1lbnQgbG9naW4gZnVuY3Rpb25hbGl0eVxuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3dpZGdldFNlYXJjaCcsIFtmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiQGlkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGxhY2Vob2xkZXJcIjogXCJAcGxhY2Vob2xkZXJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3RlZE9iamVjdFwiOiBcIj1zZWxlY3RlZG9iamVjdFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRpdGxlRmllbGRcIjogXCJAdGl0bGVmaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImRlc2NyaXB0aW9uRmllbGRcIjogXCJAZGVzY3JpcHRpb25maWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInVzZXJQYXVzZVwiOiBcIkBwYXVzZVwiLFxuXHRcdFx0XHRcdFwiaXNob21lXCI6IFwiQGlzaG9tZVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9hcHBzL3dpZGdldHMvc2VhcmNoL3NlYXJjaC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOidTZWFyY2hDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdzZWxmJyxcbiAgICAgICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLCAvL3JlcXVpcmVkIGluIDEuMysgd2l0aCBjb250cm9sbGVyQXNcbiAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgaUF0dHJzLCBuZ01vZGVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYmluZChcImtleXVwXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZXZlbnQud2hpY2ggPT09IDQwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChzY29wZS5jdXJyZW50SW5kZXggKyAxKSA8IHNjb3BlLnJlc3VsdHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmN1cnJlbnRJbmRleCArKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihldmVudC53aGljaCA9PSAzOCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS5jdXJyZW50SW5kZXggPj0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXJyZW50SW5kZXggLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LndoaWNoID09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNjb3BlLmN1cnJlbnRJbmRleCA+PSAwICYmIHNjb3BlLmN1cnJlbnRJbmRleCA8IHNjb3BlLnJlc3VsdHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnNlbGVjdFJlc3VsdChzY29wZS5yZXN1bHRzW3Njb3BlLmN1cnJlbnRJbmRleF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnJlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQud2hpY2ggPT0gMjcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5yZXN1bHRzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2hvd0Ryb3Bkb3duID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LndoaWNoID09IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5zZWxlY3RlZE9iamVjdCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1dKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBGYWN0b3J5XG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzLkZhY3RvcnkuUmF0aW5nUmVzb3VyY2VcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0c1xuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogSW1wbGVtZW50cyBDVVJEIG9wZXJhdGlvbnNcbiAgICAgKlxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG4gICAgYW5ndWxhclxuICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzJylcbiAgICAgIC5mYWN0b3J5KCdSYXRpbmdSZXNvdXJjZScsIFJhdGluZ1Jlc291cmNlKTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIFJhdGluZ1Jlc291cmNlKCRyZXNvdXJjZSwgQVBQX0NPTkZJRykge1xuICAgICAgLyogJHJlc291cmNlKEFQSV9VUkwsIERFRkFVTFRfUEFSQU1FVEVSUywgQ09ORklHVVJFX1lPVVJfQ1VTVE9NX01FVEhPRFMpKi9cbiAgICAgIHJldHVybiAkcmVzb3VyY2UoJy4uL3JhdGluZycsIHtcblx0XHQgIHJlcXVlc3RUeXBlIDonQHJlcXVlc3RUeXBlJ1xuXHQgICB9LFxuICAgICAgICB7XG4gICAgICAgIHNhdmVSYXRpbmc6IHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuICAgICAgICB9LFxuXHRcdHNhdmU6IHtcblx0XHRcdHVybDoncmV2aWV3Jyxcblx0XHRcdG1ldGhvZDogJ1BPU1QnXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblx0XG5cdGZ1bmN0aW9uIHRyYW5zZm9ybVF1ZXJ5UmVzcG9uc2UoZGF0YSwgaGVhZGVyc0dldHRlcikge1xuICAgICAgICB2YXIgX3Jlc3BvbnNlID0ge307XG4gICAgICAgIF9yZXNwb25zZS5saXN0ID0gYW5ndWxhci5mcm9tSnNvbihkYXRhKTtcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZnJvbUpzb24oX3Jlc3BvbnNlKTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgU2VydmljZVxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cy5TZXJ2aWNlLlJhdGluZ01vZGVsXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLldpZGdldHNcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqXG4gICAgICogRGF0YSBtb2RlbCBmb3Igam9idGFzayBtb2R1bGVcbiAgICAgKiBJbXBsZW1lbmV0cyBDVVJEIG9wZXJhdGlvblxuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cycpXG4gICAgICAgIC5zZXJ2aWNlKCdSYXRpbmdNb2RlbCcsIFJhdGluZ01vZGVsKTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIFJhdGluZ01vZGVsKFJhdGluZ1Jlc291cmNlKSB7XG4gICAgICAgIHZhciBtb2RlbCA9IHRoaXM7XG4gICAgICAgXG5cdFx0LyoqXG4gICAgICAgICAqIFtzYXZlUmF0aW5nIGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAbWV0aG9kIGZpbmRBbFxuICAgICAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19ICAgICAgICAgIHBhcmFtcyBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgICAgICovXG5cdFx0XG5cdFx0bW9kZWwuc2F2ZVJhdGluZyA9IGZ1bmN0aW9uKHBhcmFtcywgc3VjY2VzcywgZmFpbCkge1xuICAgICAgICAgICAgcmV0dXJuIFJhdGluZ1Jlc291cmNlLnNhdmVSYXRpbmcocGFyYW1zLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZSBhIG5ldyBSZXZpZXdcbiAgICAgICAgICogQHBhcmFtIFJldmlldyBSZXZpZXdcbiAgICAgICAgICogQHJldHVybiBSZXZpZXcgc2F2ZWRcbiAgICAgICAgICovXG4gICAgICAgIG1vZGVsLnNhdmUgPSBmdW5jdGlvbihyZXZpZXcpIHtcbiAgICAgICAgICAgIHJldHVybiBSYXRpbmdSZXNvdXJjZS5zYXZlKHJldmlldykuJHByb21pc2U7XG4gICAgICAgIH07XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyoqXG4gICAgICogQG5nZG9jIENvbnRyb2xsZXJcbiAgICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLldpZGdldHMuQ29udHJvbGxlci5SYXRpbmdDb250cm9sbGVyXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLldpZGdldHNcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJhdGluZ0NvbnRyb2xsZXIgaXMgcmVzcG9uc2libGUgZm9yIHVzZXIgcmF0aW5nXG4gICAgICpcbiAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAqL1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1JhdGluZ0NvbnRyb2xsZXInLCBSYXRpbmdDb250cm9sbGVyKTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuXG4gICAgZnVuY3Rpb24gUmF0aW5nQ29udHJvbGxlcigkc2FuaXRpemUsJHEsIExvZ2dlciwgU3Bpbm5lciwgUmF0aW5nTW9kZWwsdG9hc3Rlcikge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBbc2VsZiBkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQHR5cGUge1t0eXBlXX1cbiAgICAgICAgICovXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblx0XHRpbml0KCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBbaW5pdCBkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgIHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgXCJSZXZpZXcgU2F2ZWRcIiwgXCJSZXZpZXcgaGFzIGJlZW4gc2F2ZWQgc3VjY2Vzc2Z1bGx5LlwiKTtcbiAgICAgICAgICAgTG9nZ2VyLmdldEluc3RhbmNlKCdSYXRpbmdDb250cm9sbGVyJykuaW5mbygnUmFydGluZyBDb250cm9sbGVyIGhhcyBpbml0aWFsaXplZCcpO1xuXHRcdCAgIHNlbGYucmF0ZSA9IDA7XG5cdFx0ICAgc2VsZi5tYXggPSA1O1xuXHRcdCAgIHNlbGYuaXNSZWFkb25seSA9IHRydWU7XG5cdFx0ICAgaWYoc2VsZi51c2VyZnJvbSB8fCBzZWxmLnVzZXJmcm9tIT09c2VsZi51c2VydG8pIHNlbGYuaXNSZWFkb25seSA9IGZhbHNlO1xuICAgICAgICB9XG5cdFx0XG5cbiAgICBcdCAgc2VsZi5ob3ZlcmluZ092ZXIgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgc2VsZi5vdmVyU3RhciA9IHZhbHVlO1xuICAgIFx0XHRzZWxmLnBlcmNlbnQgPSAxMDAgKiAodmFsdWUgLyBzZWxmLm1heCk7XG4gICAgXHQgIH07XG5cblx0XHQgIHNlbGYucmF0aW5nU3RhdGVzID0gW1xuXHRcdFx0e3N0YXRlT246ICdnbHlwaGljb24tb2stc2lnbicsIHN0YXRlT2ZmOiAnZ2x5cGhpY29uLW9rLWNpcmNsZSd9LFxuXHRcdFx0e3N0YXRlT246ICdnbHlwaGljb24tc3RhcicsIHN0YXRlT2ZmOiAnZ2x5cGhpY29uLXN0YXItZW1wdHknfSxcblx0XHRcdHtzdGF0ZU9uOiAnZ2x5cGhpY29uLWhlYXJ0Jywgc3RhdGVPZmY6ICdnbHlwaGljb24tYmFuLWNpcmNsZSd9LFxuXHRcdFx0e3N0YXRlT246ICdnbHlwaGljb24taGVhcnQnfSxcblx0XHRcdHtzdGF0ZU9mZjogJ2dseXBoaWNvbi1vZmYnfVxuXHRcdCAgXTtcblx0XHQgIFxuXHRcdCAgc2VsZi5zYXZlUmF0aW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZighc2VsZi51c2VyZnJvbSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRSYXRpbmdNb2RlbC5zYXZlUmF0aW5nKHsncmF0ZSc6c2VsZi5yYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICdyZXF1ZXN0VHlwZSc6XCJzYXZlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ3RvJzpzZWxmLnVzZXJ0b30pLnRoZW4oZnVuY3Rpb24ocmVzcG9uY2Upe1xuXHRcdFx0XHRcdFx0XHQgc2VsZi5yYXRlID0gcmVzcG9uY2UucmF0aW5nO1xuXHRcdFx0XHRcdFx0XHR9LGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSk7XG5cdFx0IH07XG5cdFx0IFxuXHRcdCAvKipcblx0XHQqIFNhdmUgUmV2aWV3XG5cdFx0KiBAcGFyYW1zIHtPYmplY3R9XG5cdFx0KiBAcmV0dXJuIHtpZH1cblx0XHQqL1xuXHRcdFxuXHRcdCBzZWxmLnNhdmVSZXZpZXcgPSBmdW5jdGlvbigpIHtcblx0XHQgICB2YXIgX3JldmlldyA9IGFuZ3VsYXIuY29weShzZWxmLnJldmlldyk7XG5cdFx0ICAgUmF0aW5nTW9kZWwuc2F2ZSh7XG4gICAgICAgICAgICAgICAgICAgICdyZXZpZXcnOiBfcmV2aWV3LFxuICAgICAgICAgICAgICAgICAgICAncmF0ZSc6c2VsZi5yYXRlLFxuICAgICAgICAgICAgICAgICAgICAndG9fdXNlcic6IHNlbGYudXNlcnRvXG4gICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uY2Upe1xuXHRcdFx0XHRcdHRvYXN0ZXIucG9wKCdzdWNjZXNzJywgXCJSZXZpZXcgU2F2ZWRcIiwgXCJSZXZpZXcgaGFzIGJlZW4gc2F2ZWQgc3VjY2Vzc2Z1bGx5LlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucmV2aWV3ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJhdGUgPSAwO1xuXHRcdFx0XHRcdH0sZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9KTtcblx0XHQgfTtcbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgRGlyZWN0aXZlXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzLndpZGdldExvZ2luXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLldpZGdldHNcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIHdpZGdldCBpcyB1c2VkIHRvIHVzZSBpbXBsZW1lbnQgbG9naW4gZnVuY3Rpb25hbGl0eVxuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3dpZGdldFJhdGluZycsIFtmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiQGlkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidXNlcnRvXCI6IFwiQHVzZXJ0b1wiLFxuXHRcdFx0XHRcdFwidXNlcmZyb21cIjogXCJAdXNlcmZyb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXBwcy93aWRnZXRzL3JhdGluZy9yYXRpbmcuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjonUmF0aW5nQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnc2VsZicsXG4gICAgICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSwgLy9yZXF1aXJlZCBpbiAxLjMrIHdpdGggY29udHJvbGxlckFzXG4gICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGlBdHRycywgbmdNb2RlbCkge1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1dKTtcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5hbmd1bGFyXG4gIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cycpXG4gIC5kaXJlY3RpdmUoJ2NoYXQnLGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6Jy9hcHBzL3dpZGdldHMvY2hhdC9jaGF0Lmh0bWwnLFxuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgIFx0fTtcblx0fSk7XG5cblxuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgRGlyZWN0aXZlXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzLmxvY2F0aW9uTWFwXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLldpZGdldHNcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFRoaXMgZGlyZWN0aXZlIGlzIHVzZWQgdG8gYXZhaWwgYWxsIGZlYXR1cmUgZnJvbSBnb29nbGUgbWFwIEFQSSBhbmQgdXNlIGluIGFwcGxpY2F0aW9uIGFzIGluZGVwZW5kZW50IHdpZGdldFxuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2xvY2F0aW9uTWFwJywgWydMYXJhdmVsJywgZnVuY3Rpb24oTGFyYXZlbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9hcHBzL3dpZGdldHMvbG9jYXRpb24tbWFwL2xvY2F0aW9uLW1hcC5odG1sJyxcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIHNjb3BlIDoge1xuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbkluZm8gOiAnPSdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbCkge1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29udHJvbGxlciA6ICdMb2NhdGlvbk1hcENvbnRyb2xsZXInXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgQ29udHJvbGxlclxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cy5Db250cm9sbGVyLkxvY2F0aW9uTWFwQ29udHJvbGxlclxuICAgICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBMb2NhdGlvbk1hcENvbnRyb2xsZXIgaXMgcmVzcG9uc2libGUgZm9yIGxvZ2luIGltcGxlbWVudGF0aW9uXG4gICAgICpcbiAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAqL1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0xvY2F0aW9uTWFwQ29udHJvbGxlcicsIExvY2F0aW9uTWFwQ29udHJvbGxlcik7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBMb2NhdGlvbk1hcENvbnRyb2xsZXIoJHNhbml0aXplLCAkc2NvcGUsICR0aW1lb3V0LCAkbG9nLCAkaHR0cCwgTG9nZ2VyLCBTcGlubmVyLCB1aUdtYXBHb29nbGVNYXBBcGkpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFtzZWxmIGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAdHlwZSB7W3R5cGVdfVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAkc2NvcGUubWFwID0ge1xuICAgICAgICAgICAgY2VudGVyOiB7XG4gICAgICAgICAgICAgICAgbGF0aXR1ZGU6ICRzY29wZS5sb2NhdGlvbkluZm8ubGF0aXR1ZGUsXG4gICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiAkc2NvcGUubG9jYXRpb25JbmZvLmxvbmdpdHVkZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHpvb206IDQsXG4gICAgICAgICAgICBtYXJrZXI6IHtcbiAgICAgICAgICAgICAgICBpZDogMCxcbiAgICAgICAgICAgICAgICBjb29yZHM6IHtcbiAgICAgICAgICAgICAgICAgICAgbGF0aXR1ZGU6ICRzY29wZS5sb2NhdGlvbkluZm8ubGF0aXR1ZGUsXG4gICAgICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogJHNjb3BlLmxvY2F0aW9uSW5mby5sb25naXR1ZGVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgc2hvd1dpbmRvdzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiAxLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbENvbnRlbnQ6ICRzY29wZS5sb2NhdGlvbkluZm8ubmFtZSArICcsICcrJHNjb3BlLmxvY2F0aW9uSW5mby5zdGF0ZSArICctJyArJHNjb3BlLmxvY2F0aW9uSW5mby5wb3N0Y29kZSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxDbGFzczogXCJtYXJrZXItbGFiZWxzXCIsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsQW5jaG9yOlwiNTAgMFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHVpR21hcEdvb2dsZU1hcEFwaS50aGVuKGZ1bmN0aW9uKG1hcHMpIHtcblxuICAgICAgICB9KTtcblxuXG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyoqXG4gICAgICogQG5nZG9jIERpcmVjdGl2ZVxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cy53aWRnZXRCb29raW5nXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLldpZGdldHNcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIHdpZGdldCBpcyB1c2VkIHRvIHVzZSBpbXBsZW1lbnQgbG9naW4gZnVuY3Rpb25hbGl0eVxuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ3dpZGdldEJvb2tpbmcnLCBbZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcIkBpZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInVzZXJ0b1wiOiBcIkB1c2VydG9cIixcblx0XHRcdFx0XHRcInVzZXJmcm9tXCI6IFwiQHVzZXJmcm9tXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY2F0ZWdvcmllc1wiOlwiQGNhdGVnb3JpZXNcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXBwcy93aWRnZXRzL2Jvb2tpbmcvYm9va2luZy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOidCb29raW5nQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnc2VsZicsXG4gICAgICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSwgLy9yZXF1aXJlZCBpbiAxLjMrIHdpdGggY29udHJvbGxlckFzXG4gICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGlBdHRycywgbmdNb2RlbCkge1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1dKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBGYWN0b3J5XG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzLkZhY3RvcnkuQm9va2luZ1Jlc291cmNlXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLldpZGdldHNcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEltcGxlbWVudHMgQ1VSRCBvcGVyYXRpb25zXG4gICAgICpcbiAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAqL1xuICAgIGFuZ3VsYXJcbiAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cycpXG4gICAgICAuZmFjdG9yeSgnQm9va2luZ1Jlc291cmNlJyxCb29raW5nUmVzb3VyY2UpO1xuXHRcblx0LyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gQm9va2luZ1Jlc291cmNlKCRyZXNvdXJjZSwgQVBQX0NPTkZJRykge1xuICAgICAgLyogJHJlc291cmNlKEFQSV9VUkwsIERFRkFVTFRfUEFSQU1FVEVSUywgQ09ORklHVVJFX1lPVVJfQ1VTVE9NX01FVEhPRFMpKi9cbiAgICAgIHJldHVybiAkcmVzb3VyY2UoJy4uL2Jvb2thcHBvaW50bWVudCcsIHt9LFxuICAgICAgICB7XG4gICAgICAgIHNhdmVBcHBvaW50bWVudDoge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnXG4gICAgICAgIH0sXG5cdFx0ICAgIGdldFNlcnZpY2VzOiB7XG5cdFx0ICAgICAgdXJsOidzZXJ2aWNlcycsXG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcblx0XHQgICAgICBpc0FycmF5OnRydWVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBTZXJ2aWNlXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzLlNlcnZpY2UuQm9va2luZ01vZGVsXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLldpZGdldHNcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqXG4gICAgICogRGF0YSBtb2RlbCBmb3IgQm9va2luZyBtb2R1bGVcbiAgICAgKiBJbXBsZW1lbmV0cyBDVVJEIG9wZXJhdGlvblxuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cycpXG4gICAgICAgIC5zZXJ2aWNlKCdCb29raW5nTW9kZWwnLCBCb29raW5nTW9kZWwpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gQm9va2luZ01vZGVsKEJvb2tpbmdSZXNvdXJjZSkge1xuICAgICAgICB2YXIgbW9kZWwgPSB0aGlzO1xuICAgICAgIFxuXHRcdC8qKlxuICAgICAgICAgKiBbc2F2ZUJvb2tpbmcgZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEBtZXRob2Qgc2F2ZUJvb2tpbmdcbiAgICAgICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSAgICAgICAgICBwYXJhbXMgW2Rlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqL1xuXHRcdFxuXHRcdG1vZGVsLnNhdmVBcHBvaW50bWVudCA9IGZ1bmN0aW9uKHBhcmFtcywgc3VjY2VzcywgZmFpbCkge1xuICAgICAgICAgICAgcmV0dXJuIEJvb2tpbmdSZXNvdXJjZS5zYXZlQXBwb2ludG1lbnQocGFyYW1zLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcbiAgICAgICAgfTtcblx0XHRcblx0XHRtb2RlbC5nZXRTZXJ2aWNlcyA9IGZ1bmN0aW9uKHBhcmFtcywgc3VjY2VzcywgZmFpbCkge1xuICAgICAgICAgICAgcmV0dXJuIEJvb2tpbmdSZXNvdXJjZS5nZXRTZXJ2aWNlcyhwYXJhbXMsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgQ29udHJvbGxlclxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cy5Db250cm9sbGVyLkJvb2tpbmdDb250cm9sbGVyXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLldpZGdldHNcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEJvb2tpbmdDb250cm9sbGVyIGlzIHJlc3BvbnNpYmxlIGZvciBib29raW5nIGFwcG9pbnRtZW50c1xuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0cycpXG4gICAgICAgIC5jb250cm9sbGVyKCdCb29raW5nQ29udHJvbGxlcicsIEJvb2tpbmdDb250cm9sbGVyKTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuXG4gICAgZnVuY3Rpb24gQm9va2luZ0NvbnRyb2xsZXIoJHNhbml0aXplLCRxLCBMb2dnZXIsIFNwaW5uZXIsIEJvb2tpbmdNb2RlbCx1aWJEYXRlUGFyc2VyKSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFtzZWxmIGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAdHlwZSB7W3R5cGVdfVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXHRcdGluaXQoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFtpbml0IGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBcdFx0TG9nZ2VyLmdldEluc3RhbmNlKCdCb29raW5nQ29udHJvbGxlcicpLmluZm8oJ0Jvb2tpbmcgQ29udHJvbGxlciBoYXMgaW5pdGlhbGl6ZWQnKTtcblx0XHQgICAgc2VsZi5zZXJ2aWNlcHJvdmlkZXJjYXRlZ29yaWVzID0gIChzZWxmLmNhdGVnb3JpZXMpID8gYW5ndWxhci5mcm9tSnNvbihzZWxmLmNhdGVnb3JpZXMpIDogW107XG5cdFx0XHRzZWxmLnNlcnZpY2VzPVtdO1xuICAgICAgICB9XG5cdFx0XG5cdFx0c2VsZi50b2RheSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0c2VsZi5hcHBvaW50bWVudGRhdGUgPSBuZXcgRGF0ZSgpO1xuXHRcdCB9O1xuXHQgIFx0c2VsZi50b2RheSgpO1xuXG5cdFx0ICBzZWxmLmNsZWFyID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRzZWxmLmFwcG9pbnRtZW50ZGF0ZSA9IG51bGw7XG5cdFx0ICB9O1xuXG5cdFx0ICAvLyBEaXNhYmxlIHdlZWtlbmQgc2VsZWN0aW9uXG5cdFx0ICBzZWxmLmRpc2FibGVkID0gZnVuY3Rpb24oZGF0ZSwgbW9kZSkge1xuXHRcdFx0cmV0dXJuIG1vZGUgPT09ICdkYXknICYmIChkYXRlLmdldERheSgpID09PSAwIHx8IGRhdGUuZ2V0RGF5KCkgPT09IDYpO1xuXHRcdCAgfTtcblxuXHRcdCAgc2VsZi50b2dnbGVNaW4gPSBmdW5jdGlvbigpIHtcblx0XHRcdHNlbGYubWluRGF0ZSA9IHNlbGYubWluRGF0ZSA/IG51bGwgOiBuZXcgRGF0ZSgpO1xuXHRcdCAgfTtcblxuXHRcdCAgc2VsZi50b2dnbGVNaW4oKTtcblx0XHRcdHNlbGYubWF4RGF0ZSA9IG5ldyBEYXRlKDIwMjAsIDUsIDIyKTtcblxuXHRcdCAgc2VsZi5vcGVuMSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0c2VsZi5wb3B1cDEub3BlbmVkID0gdHJ1ZTtcblx0XHQgIH07XG5cblx0XHQgIHNlbGYuc2V0RGF0ZSA9IGZ1bmN0aW9uKHllYXIsIG1vbnRoLCBkYXkpIHtcblx0XHRcdHNlbGYuYXBwb2ludG1lbnRkYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGgsIGRheSk7XG5cdFx0ICB9O1xuXG5cdFx0ICBzZWxmLmRhdGVPcHRpb25zID0ge1xuXHRcdFx0Zm9ybWF0WWVhcjogJ3l5Jyxcblx0XHRcdHN0YXJ0aW5nRGF5OiAxXG5cdFx0ICB9O1xuXG5cdFx0ICBzZWxmLmZvcm1hdHMgPSBbJ2RkLU1NTU0teXl5eScsICd5eXl5L01NL2RkJywgJ2RkLk1NLnl5eXknLCAnc2hvcnREYXRlJ107XG5cdFx0ICBzZWxmLmZvcm1hdCA9IHNlbGYuZm9ybWF0c1swXTtcblx0XHQgIHNlbGYuYWx0SW5wdXRGb3JtYXRzID0gWydNIS9kIS95eXl5J107XG5cblx0XHQgIHNlbGYucG9wdXAxID0ge1xuXHRcdFx0b3BlbmVkOiB0cnVlXG5cdFx0ICB9O1xuXG5cdFx0ICBzZWxmLmFwcG9pbnRtZW50dGltZSA9IG5ldyBEYXRlKCk7XG5cblx0XHQgIHNlbGYuaHN0ZXAgPSAxO1xuXHRcdCAgc2VsZi5tc3RlcCA9IDU7XG5cblx0XHQgIHNlbGYub3B0aW9ucyA9IHtcblx0XHRcdGhzdGVwOiBbMSwgMiwgM10sXG5cdFx0XHRtc3RlcDogWzEsIDUsIDEwLCAxNSwgMjUsIDMwXVxuXHRcdCAgfTtcblxuXHRcdCAgc2VsZi5pc21lcmlkaWFuID0gdHJ1ZTtcblx0XHQgIHNlbGYudG9nZ2xlTW9kZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0c2VsZi5pc21lcmlkaWFuID0gISBzZWxmLmlzbWVyaWRpYW47XG5cdFx0ICB9O1xuXHRcdCAgXG5cdFx0ICBzZWxmLmFwcG9pbnRtZW50c2VydmljZXMgPSBbe1xuXHRcdFx0ICBpbmRleDoxLFxuXHRcdFx0ICBjYXRlZ29yeTpudWxsLFxuXHRcdFx0ICBzZXJ2aWNlOm51bGxcblx0XHQgIH1dO1xuXHRcdCAgXG5cdFx0ICBzZWxmLnJlbW92ZVNlcnZpY2U9IGZ1bmN0aW9uKGluZGV4KSB7XG5cdFx0XHQvL3ZhciBpbmRleCA9IHNlbGYuc2VydmljZXMuaW5kZXhPZigkZmlsZS5pZCk7XG5cdFx0XHRmb3IodmFyIGl0ZW0gaW4gc2VsZi5hcHBvaW50bWVudHNlcnZpY2VzKXtcblx0XHRcdFx0aWYoc2VsZi5hcHBvaW50bWVudHNlcnZpY2VzW2l0ZW1dLmluZGV4PT1pbmRleCl7XG5cdFx0XHRcdFx0c2VsZi5hcHBvaW50bWVudHNlcnZpY2VzLnNwbGljZShpdGVtLCAxKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCAgfTtcblx0XHRcblx0XHQgIHNlbGYuYWRkU2VydmljZT0gZnVuY3Rpb24obGFzdCkge1xuXHRcdFx0c2VsZi5hcHBvaW50bWVudHNlcnZpY2VzLnB1c2goe1xuXHRcdFx0ICBpbmRleDpsYXN0KzEsXG5cdFx0XHQgIGNhdGVnb3J5Om51bGwsXG5cdFx0XHQgIHNlcnZpY2U6bnVsbFxuXHRcdFx0fSk7XG5cdFx0ICB9O1xuXG5cdFx0IHNlbGYuYm9va0FwcG9pbnRtZW50ID0gZnVuY3Rpb24oKXtcblx0XHQgXHR2YXIgX2RhdGEgPSB7J2FwcG9pbnRtZW50ZGF0ZSc6c2VsZi5hcHBvaW50bWVudGRhdGUsXG5cdFx0XHRcdFx0J2FwcG9pbnRtZW50dGltZSc6c2VsZi5hcHBvaW50bWVudHRpbWUsXG5cdFx0XHRcdFx0J2FwcG9pbnRtZW50c2VydmljZXMnOmFuZ3VsYXIudG9Kc29uKHNlbGYuYXBwb2ludG1lbnRzZXJ2aWNlcyksXG5cdFx0XHRcdFx0J3RvdXNlcic6c2VsZi51c2VydG9cblx0XHRcdFx0XHR9XG5cdFx0XHQgQm9va2luZ01vZGVsLnNhdmVBcHBvaW50bWVudCh7XG5cdFx0XHRcdH0sX2RhdGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uY2Upe1xuXHRcdFx0XHRcdCBzZWxmLmFwcG9pbnRtZW50c2VydmljZXMgPSBbe1xuXHRcdFx0XHRcdFx0ICBpbmRleDoxLFxuXHRcdFx0XHRcdFx0ICBjYXRlZ29yeTpudWxsLFxuXHRcdFx0XHRcdFx0ICBzZXJ2aWNlOm51bGxcblx0XHRcdFx0XHQgIH1dO1xuXHRcdFx0XHR9LGZ1bmN0aW9uKCl7XG5cdFx0XHR9KTtcblx0XHQgfVxuXHRcdCBcblx0XHQgc2VsZi5zZWxlY3RDYXRlZ29yeSA9IGZ1bmN0aW9uKGl0ZW0saWQpe1xuXHRcdFx0c2VsZi5zZXJ2aWNlc1tpZF0gPSBbXTtcblx0XHRcdEJvb2tpbmdNb2RlbC5nZXRTZXJ2aWNlcyh7XG5cdFx0XHRcdFx0J2lkJzppdGVtLmlkXG5cdFx0XHRcdH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uY2Upe1xuXHRcdFx0XHRcdHNlbGYuc2VydmljZXNbaWRdLnNlcnZpY2Vwcm92aWRlclNlcnZpY2VzID0gcmVzcG9uY2U7XG5cdFx0XHRcdH0sZnVuY3Rpb24oKXtcblx0XHRcdH0pO1xuXHRcdCB9XG5cdH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBEaXJlY3RpdmVcbiAgICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLldpZGdldHMud2lkZ2V0TG9naW5cbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0c1xuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogd2lkZ2V0IGlzIHVzZWQgdG8gdXNlIGltcGxlbWVudCBsb2dpbiBmdW5jdGlvbmFsaXR5XG4gICAgICpcbiAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAqL1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnd2lkZ2V0QXV0aCcsIFtmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXBwcy93aWRnZXRzL2F1dGgvYXV0aC5odG1sJyxcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBpQXR0cnMsIG5nTW9kZWwpIHtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1dKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBDb250cm9sbGVyXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzLkNvbnRyb2xsZXIuQXV0aENvbnRyb2xsZXJcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuV2lkZ2V0c1xuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQXV0aENvbnRyb2xsZXIgaXMgcmVzcG9uc2libGUgZm9yIGxvZ2luIGltcGxlbWVudGF0aW9uXG4gICAgICpcbiAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAqL1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0F1dGhDb250cm9sbGVyJywgQXV0aENvbnRyb2xsZXIpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gQXV0aENvbnRyb2xsZXIoJHNhbml0aXplLCAkaHR0cCwgTG9nZ2VyLCBTcGlubmVyKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBbc2VsZiBkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQHR5cGUge1t0eXBlXX1cbiAgICAgICAgICovXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFt1c2VyU2NoZW1hIGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgc2VsZi51c2VyU2NoZW1hID0ge1xuICAgICAgICAgICAgbmFtZTogJycsXG4gICAgICAgICAgICBmaXJzdE5hbWU6ICcnLFxuICAgICAgICAgICAgbGFzdE5hbWU6ICcnLFxuICAgICAgICAgICAgZW1haWw6ICcnLFxuICAgICAgICAgICAgcGFzc3dvcmQ6ICcnLFxuICAgICAgICAgICAgcGFzc3dvcmRfY29uZmlybWF0aW9uOiAnJyxcbiAgICAgICAgICAgIGNvbnRhY3RfbnVtYmVyOiAnJyxcbiAgICAgICAgICAgIGJ1c2luZXNzX25hbWU6ICcnLFxuICAgICAgICAgICAgYWNjb3VudF90eXBlOiAnaW5kaXZpZHVhbCcsXG4gICAgICAgICAgICBzdWJ1cmI6ICcnXG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBbbG9naW4gZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBzZWxmLmxvZ2luID0ge1xuICAgICAgICAgICAgZW1haWw6ICcnLFxuICAgICAgICAgICAgcGFzc3dvcmQ6ICcnXG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBbZXJyb3IgZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBzZWxmLmVycm9yID0gJyc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBbdXNlciBkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHNlbGYudXNlciA9IGFuZ3VsYXIuY29weShzZWxmLnVzZXJTY2hlbWEpO1xuICAgICAgICAvKipcbiAgICAgICAgICogW2FjY291bnRfdHlwZSBkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHNlbGYudXNlcl90eXBlID0gJyc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBbZm9ybSBkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHNlbGYuZm9ybSA9ICcnO1xuXG4gICAgICAgIGluaXQoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFtpbml0IGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgIExvZ2dlci5nZXRJbnN0YW5jZSgnQXV0aENvbnRyb2xsZXInKS5pbmZvKCdDb250cm9sbGVyIGhhcyBpbml0aWFsaXplZCcpO1xuICAgICAgICAgICAgc2VsZi5pc1Nob3duID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogW3Nhbml0aXplQ3JlZGVudGlhbHMgZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggPG1zbG9naWNtYXN0ZXJAZ21haWwuY29tPlxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IGNyZWRlbnRpYWxzIFtkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgc2FuaXRpemVDcmVkZW50aWFscyA9IGZ1bmN0aW9uKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGVtYWlsOiAkc2FuaXRpemUoY3JlZGVudGlhbHMuZW1haWwpLFxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiAkc2FuaXRpemUoY3JlZGVudGlhbHMucGFzc3dvcmQpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogW2F1dGhlbnRpY2F0aW9uIGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoIDxtc2xvZ2ljbWFzdGVyQGdtYWlsLmNvbT5cbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSBjcmVkZW50aWFscyBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgICAgICAgKi9cbiAgICAgICAgc2VsZi5hdXRoZW50aWNhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgU3Bpbm5lci5zdGFydCgpO1xuXG4gICAgICAgICAgICB2YXIgbG9naW4gPSAkaHR0cC5wb3N0KFwiL2F1dGgvbG9naW5cIiwgc2FuaXRpemVDcmVkZW50aWFscyhzZWxmLmxvZ2luKSk7XG4gICAgICAgICAgICBsb2dpbi5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2FjY291bnQnO1xuICAgICAgICAgICAgICAgIFNwaW5uZXIuc3RvcCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsb2dpbi5lcnJvcihmdW5jdGlvbihlcnJvclJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5lcnJvcnMgPSBmb3JtYXJ0RXJyb3JzKGVycm9yUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIFNwaW5uZXIuc3RvcCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHNlbGYucmVnaXN0ZXJBY2NvdW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBTcGlubmVyLnN0YXJ0KCk7XG4gICAgICAgICAgICBpZiAoc2VsZi51c2VyLmFjY291bnRfdHlwZSAhPT0gJ2luZGl2aWR1YWwnKSB7XG4gICAgICAgICAgICAgICAgc2VsZi51c2VyLm5hbWUgPSBzZWxmLnVzZXIuZmlyc3ROYW1lICsgJycgKyBzZWxmLnVzZXIubGFzdE5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcmVnaXN0ZXIgPSAkaHR0cC5wb3N0KFwiL2F1dGgvcmVnaXN0ZXJcIiwgc2VsZi51c2VyKTtcbiAgICAgICAgICAgIHJlZ2lzdGVyLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICByZXNldEZvcm0oKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzZXRGbGFzaCgpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnN1Y2Nlc3NNc2cgPSAnWW91ciBhY2NvdW50IHdhcyBzdWNjZXNzZnVsbHkgY3JlYXRlZC4gV2UgaGF2ZSBzZW50IHlvdSBhbiBlLW1haWwgdG8gY29uZmlybSB5b3VyIGFjY291bnQnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBTcGlubmVyLnN0b3AoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVnaXN0ZXIuZXJyb3IoZnVuY3Rpb24oZXJyb3JSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHNlbGYuZXJyb3JzID0gZm9ybWFydEVycm9ycyhlcnJvclJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBTcGlubmVyLnN0b3AoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGZvcm1hcnRFcnJvcnMoZXJyb3JzKSB7XG4gICAgICAgICAgICB2YXIgZXJyb3JMYWJlbHMgPSBbXTtcbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KGVycm9ycykgJiYgIWVycm9ycy5oYXNPd25Qcm9wZXJ0eSgnc3VjY2VzcycpKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgZXJyb3IgaW4gZXJyb3JzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXJyb3JzW2Vycm9yXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JMYWJlbHMucHVzaChlcnJvcnNbZXJyb3JdW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXJyb3JzLmhhc093blByb3BlcnR5KCdzdWNjZXNzJykpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3JzLmhhc093blByb3BlcnR5KCdlcnJvcicpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTGFiZWxzLnB1c2goZXJyb3JzLmVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZXJyb3JMYWJlbHM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogW2Ryb3Bkb3duIGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgc2VsZi5kcm9wZG93biA9IHtcbiAgICAgICAgICAgIGxvZ2luOiB7XG4gICAgICAgICAgICAgICAgaXNvcGVuOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0b2dnbGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXNldEZvcm0oKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzZXRGbGFzaCgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdG9nZ2xlRHJvcGRvd246IGZ1bmN0aW9uKCRldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmRyb3Bkb3duLmxvZ2luLmlzb3BlbiA9ICFzZWxmLmRyb3Bkb3duLmxvZ2luLmlzb3BlbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVnaXN0ZXI6IHtcbiAgICAgICAgICAgICAgICBpc29wZW46IGZhbHNlLFxuICAgICAgICAgICAgICAgIHRvZ2dsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc2V0Rm9ybSgpO1xuICAgICAgICAgICAgICAgICAgICByZXNldEZsYXNoKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0b2dnbGVEcm9wZG93bjogZnVuY3Rpb24oJGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZHJvcGRvd24ucmVnaXN0ZXIuaXNvcGVuID0gIXNlbGYuZHJvcGRvd24ucmVnaXN0ZXIuaXNvcGVuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuc2V0VXNlclR5cGUgPSBmdW5jdGlvbih1c2VyVHlwZSkge1xuICAgICAgICAgICAgcmVzZXRGb3JtKCk7XG4gICAgICAgICAgICBzZWxmLnVzZXJfdHlwZSA9IHVzZXJUeXBlO1xuICAgICAgICAgICAgc2VsZi51c2VyLmFjY291bnRfdHlwZSA9IHVzZXJUeXBlO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgZnVuY3Rpb24gcmVzZXRGb3JtKCkge1xuICAgICAgICAgICAgc2VsZi51c2VyID0gYW5ndWxhci5jb3B5KHNlbGYudXNlclNjaGVtYSk7XG4gICAgICAgICAgICBzZWxmLnVzZXJSZWdpc3RlciA/IHNlbGYudXNlclJlZ2lzdGVyLiRzZXRQcmlzdGluZSgpIDogYW5ndWxhci5ub29wO1xuICAgICAgICAgICAgc2VsZi51c2VyTG9naW4gPyBzZWxmLnVzZXJMb2dpbi4kc2V0UHJpc3RpbmUoKSA6IGFuZ3VsYXIubm9vcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlc2V0Rmxhc2goKSB7XG4gICAgICAgICAgICBzZWxmLmVycm9ycyA9IFtdO1xuICAgICAgICAgICAgc2VsZi5zdWNjZXNzTXNnID0gJyc7XG4gICAgICAgIH1cblxuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLyoqXG4gICAqIEBuZ2RvYyBvdmVydmlld1xuICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLlN1YnVyYnNcbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLlN1YnVyYnNcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFN1YnVyYnMgbW9kdWxlIHNlcnZlIGFsbCBDVVJEIE9QRVJBVElPTlMgbG9jYXRpb25zXG4gICAqXG4gICAqIEBzZWUgU3VidXJicy5tb2RlbC5qc1xuICAgKiBAc2VlIFN1YnVyYnMucmVzb3VyY2UuanNcbiAgICpcbiAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICovXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLlN1YnVyYnMnLCBbXSk7XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvKipcbiAgICogQG5nZG9jIEZhY3RvcnlcbiAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5TdWJ1cmJzLkZhY3RvcnkuU3VidXJic1Jlc291cmNlXG4gICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5TdWJ1cmJzXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBJbXBsZW1lbnRzIENVUkQgb3BlcmF0aW9uc1xuICAgKlxuICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgKi9cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuU3VidXJicycpXG4gICAgLmZhY3RvcnkoJ1N1YnVyYnNSZXNvdXJjZScsIFN1YnVyYnNSZXNvdXJjZSk7XG5cbiAgLyogQG5nSW5qZWN0ICovXG4gIGZ1bmN0aW9uIFN1YnVyYnNSZXNvdXJjZSgkcmVzb3VyY2UsIEFQUF9DT05GSUcpIHtcbiAgICByZXR1cm4gJHJlc291cmNlKCdsb2NhdGlvbnMvOmlkJywge30sIHtcbiAgICAgIGZpbmRBbGw6IHtcbiAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICB0cmFuc2Zvcm1SZXNwb25zZTogdHJhbnNmb3JtUXVlcnlSZXNwb25zZVxuICAgICAgfSxcbiAgICAgIGZpbmRCeUlkOiB7XG4gICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgaWQ6IFwiQGlkXCJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHNhdmU6IHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgcGFyYW1zOiB7fVxuICAgICAgfSxcbiAgICAgIGRlbGV0ZToge1xuICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIGlkOiBcIkBpZFwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB1cGRhdGU6IHtcbiAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBpZDogMFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm1RdWVyeVJlc3BvbnNlKGRhdGEsIGhlYWRlcnNHZXR0ZXIpIHtcbiAgICAgIHZhciBfcmVzcG9uc2UgPSB7fTtcbiAgICAgIF9yZXNwb25zZS5saXN0ID0gYW5ndWxhci5mcm9tSnNvbihkYXRhKTtcbiAgICAgIF9yZXNwb25zZS50b3RhbENvdW50ID0gcGFyc2VJbnQoaGVhZGVyc0dldHRlcigneC10b3RhbC1jb3VudCcpKTtcbiAgICAgIHJldHVybiBhbmd1bGFyLmZyb21Kc29uKF9yZXNwb25zZSk7XG4gICAgfVxuICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvKipcbiAgICogQG5nZG9jIFNlcnZpY2VcbiAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5TdWJ1cmJzLlNlcnZpY2UuUHJpb3JpdHlNb2RlbFxuICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuUHJpb3JpdHlcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqXG4gICAqIERhdGEgbW9kZWwgZm9yIFN1YnVyYnMgbW9kdWxlXG4gICAqIEltcGxlbWVuZXRzIENVUkQgb3BlcmF0aW9uXG4gICAqXG4gICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAqL1xuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5TdWJ1cmJzJylcbiAgICAuc2VydmljZSgnU3VidXJic01vZGVsJywgU3VidXJic01vZGVsKTtcblxuICAvKiBAbmdJbmplY3QgKi9cbiAgZnVuY3Rpb24gU3VidXJic01vZGVsKFN1YnVyYnNSZXNvdXJjZSkge1xuICAgIHZhciBtb2RlbCA9IHRoaXM7XG4gICAgLyoqXG4gICAgICogW2pvYkxpc3QgZGVzY3JpcHRpb25dXG4gICAgICogQFRydWUge0FycmF5fVxuICAgICAqL1xuICAgIG1vZGVsLmNpdGllcyA9IFtdO1xuICAgIC8qKlxuICAgICAqIFtmaW5kQWxsIGRlc2NyaXB0aW9uXVxuICAgICAqIEBtZXRob2QgZmluZEFsbFxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuICAgIG1vZGVsLmZpbmRBbGwgPSBmdW5jdGlvbihwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gU3VidXJic1Jlc291cmNlLmZpbmRBbGwocGFyYW1zKTtcbiAgICB9O1xuXG4gICAgbW9kZWwuZmluZExvY2F0aW9uID0gZnVuY3Rpb24ocGFyYW1zLCBjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIFN1YnVyYnNSZXNvdXJjZS5maW5kQWxsKHBhcmFtcykuJHByb21pc2U7XG4gICAgfTtcbiAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLyoqXG4gICAqIEBuZ2RvYyBDb25maWd1cmF0aW9uKE1vZHVsZSBjb25maWcgQmxvY2spXG4gICAqXG4gICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuVXNlcnMuY29uZmlnLlVzZXJzU3RhdGVcbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLlVzZXJzXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDb25maWd1cmUgdXNlcnMgbW9kdWxlIHJvdXRlc1xuICAgKlxuICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgKi9cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuVXNlcnMnKVxuICAgIC5jb25maWcoVXNlcnNTdGF0ZSk7XG5cbiAgLyogQG5nSW5qZWN0ICovXG4gIGZ1bmN0aW9uIFVzZXJzU3RhdGUoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgLnN0YXRlKCd1c2VycycsIHtcbiAgICAgICAgcGFyZW50OiAnZGFzaGJvYXJkJyxcbiAgICAgICAgdXJsOicvdXNlcnMnLFxuICAgICAgICB2aWV3czoge1xuICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdtb2R1bGVzL3VzZXJzL3VzZXJzLmh0bWwnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ2NvbnRlbnRfc2lkZWJhcicgOiB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdtb2R1bGVzL3VzZXJzL3NpZGViYXIvdXNlcnMtc2lkZWJhci5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnVXNlcnNTaWRlYmFyQ29udHJvbGxlciBhcyBfc2VsZidcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICBhdXRob3JpemU6IFsnQXV0aCcsXG4gICAgICAgICAgICBmdW5jdGlvbihBdXRoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBBdXRoLmF1dGhvcml6ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG4gIC8qKlxuICAgKiBAbmdkb2MgRmFjdG9yeVxuICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLlVzZXJzLkZhY3RvcnkuVXNlcnNSZXNvdXJjZVxuICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuVXNlcnNcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEltcGxlbWVudHMgQ1VSRCBvcGVyYXRpb25zXG4gICAqXG4gICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAqL1xuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5Vc2VycycpXG4gICAgLmZhY3RvcnkoJ1VzZXJzUmVzb3VyY2UnLCBVc2Vyc1Jlc291cmNlKTtcblxuICAvKiBAbmdJbmplY3QgKi9cbiAgZnVuY3Rpb24gVXNlcnNSZXNvdXJjZSgkcmVzb3VyY2UsIEFQUF9DT05GSUcpIHtcbiAgICAvKiAkcmVzb3VyY2UoQVBJX1VSTCwgREVGQVVMVF9QQVJBTUVURVJTLCBDT05GSUdVUkVfWU9VUl9DVVNUT01fTUVUSE9EUykqL1xuICAgIHJldHVybiAkcmVzb3VyY2UoJ21hY3Jvcy8nLCB7XG4gICAgICBhY3Rpb246ICdAYWN0aW9uJyxcbiAgICAgIGFjdGlvbl92YWx1ZSA6ICdAYWN0aW9uX3ZhbHVlJ1xuICAgIH0sIHtcbiAgICAgIGZpbmQ6IHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgaWQ6ICdAaWQnLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY3JlYXRlOiB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnXG4gICAgICB9LFxuICAgICAgdXBkYXRlOiB7XG4gICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIGlkOiAnQGlkJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdXBkYXRlU3RhdHVzOiB7XG4gICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIGlkOiAnQGlkJyxcbiAgICAgICAgICBhY3Rpb246ICdAc3RhdHVzJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgdHJhbnNmb3JtUmVzcG9uc2U6IHRyYW5zZm9ybVF1ZXJ5UmVzcG9uc2VcbiAgICAgIH0sXG4gICAgICBnZXRQaG90bzoge1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBpZDogJ0BpZCcsXG4gICAgICAgICAgYWN0aW9uOiAnQGFjdGlvbidcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHNhdmVQaG90bzoge1xuICAgICAgICB1cmw6ICdhcGkvdjEvdXNlcnMvdXBsb2FkL3Bob3RvLzp1c2VyX2lkJyxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIHVzZXJfaWQ6ICdAdXNlcl9pZCcsXG4gICAgICAgIH0sIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogdW5kZWZpbmVkXG4gICAgICAgIH0sXG4gICAgICAgIHRyYW5zZm9ybVJlcXVlc3Q6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgICAvL25lZWQgdG8gY29udmVydCBvdXIganNvbiBvYmplY3QgdG8gYSBzdHJpbmcgdmVyc2lvbiBvZiBqc29uIG90aGVyd2lzZVxuICAgICAgICAgIC8vIHRoZSBicm93c2VyIHdpbGwgZG8gYSAndG9TdHJpbmcoKScgb24gdGhlIG9iamVjdCB3aGljaCB3aWxsIHJlc3VsdCBcbiAgICAgICAgICAvLyBpbiB0aGUgdmFsdWUgJ1tPYmplY3Qgb2JqZWN0XScgb24gdGhlIHNlcnZlci5cbiAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJwaG90b1wiLGRhdGEpO1xuICAgICAgICAgIFxuICAgICAgICAgIHJldHVybiBmb3JtRGF0YTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHNlYXJjaFVzZXJzIDoge1xuICAgICAgICB1cmwgOiAnYXBpL3YxL3VzZXJzL2xpc3QnLFxuICAgICAgICBtZXRob2QgOidHRVQnLFxuICAgICAgICAgdHJhbnNmb3JtUmVzcG9uc2U6IHRyYW5zZm9ybVF1ZXJ5UmVzcG9uc2VcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybVF1ZXJ5UmVzcG9uc2UoZGF0YSwgaGVhZGVyc0dldHRlcikge1xuICAgICAgdmFyIF9yZXNwb25zZSA9IHt9O1xuICAgICAgX3Jlc3BvbnNlLmxpc3QgPSBhbmd1bGFyLmZyb21Kc29uKGRhdGEpO1xuICAgICAgX3Jlc3BvbnNlLnRvdGFsQ291bnQgPSBwYXJzZUludChoZWFkZXJzR2V0dGVyKCd4LXRvdGFsLWNvdW50JykpO1xuICAgICAgcmV0dXJuIGFuZ3VsYXIuZnJvbUpzb24oX3Jlc3BvbnNlKTtcbiAgICB9XG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvKipcbiAgICogQG5nZG9jIFNlcnZpY2VcbiAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5Vc2Vycy5TZXJ2aWNlLlVzZXJzTW9kZWxcbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLlVzZXJzXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBEYXRhIG1vZGVsIGZvciB1c2Vyc1xuICAgKiBJbXBsZW1lbmV0cyBDVVJEIG9wZXJhdGlvblxuICAgKlxuICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgKi9cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuVXNlcnMnKVxuICAgIC5zZXJ2aWNlKCdVc2Vyc01vZGVsJywgVXNlcnNNb2RlbCk7XG5cbiAgLyogQG5nSW5qZWN0ICovXG4gIGZ1bmN0aW9uIFVzZXJzTW9kZWwoVXNlcnNSZXNvdXJjZSkge1xuICAgIHZhciBtb2RlbCA9IHRoaXM7XG5cbiAgICBtb2RlbC51c2VyID0ge1xuICAgICAgZmlyc3ROYW1lIDogJycsXG4gICAgICBsYXN0TmFtZTonJyxcbiAgICAgIGVtYWlsOicnLFxuICAgICAgcm9sZXM6W10sXG4gICAgICB1c2VybmFtZTonJyxcbiAgICAgIHBhc3N3b3JkIDogJycsXG4gICAgICBwcm9qZWN0Q29kZSA6ICcnXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFtyb2xlTGlzdCBkZXNjcmlwdGlvbl1cbiAgICAgKiBAVHJ1ZSB7QXJyYXl9XG4gICAgICovXG4gICAgbW9kZWwudXNlcnNsaXN0ID0gW107XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdXNlcnNcbiAgICAgKiBAcGFyYW0gaWQgaWRcbiAgICAgKiBAcmV0dXJuIHVzZXJzXG4gICAgICovXG4gICAgbW9kZWwuZmluZCA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICByZXR1cm4gVXNlcnNSZXNvdXJjZS5maW5kKGlkKS4kcHJvbWlzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogW2ZpbmRBbGwgZGVzY3JpcHRpb25dXG4gICAgICogQG1ldGhvZCBmaW5kQWxsXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19ICAgICAgICAgIHBhcmFtcyBbZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuICAgIG1vZGVsLmZpbmRBbGwgPSBmdW5jdGlvbihwYXJhbXMsIHN1Y2Nlc3MsIGZhaWwpe1xuICAgICAgcmV0dXJuIFVzZXJzUmVzb3VyY2UucXVlcnkocGFyYW1zLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IHVzZXJzXG4gICAgICogQHBhcmFtIHVzZXJzIHVzZXJzXG4gICAgICogQHJldHVybiB1c2VycyBzYXZlZFxuICAgICAqL1xuICAgIG1vZGVsLmNyZWF0ZSA9IGZ1bmN0aW9uKHVzZXJzKSB7XG4gICAgICByZXR1cm4gVXNlcnNSZXNvdXJjZS5jcmVhdGUodXNlcnMpLiRwcm9taXNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdXNlcnNcbiAgICAgKiBAcGFyYW0gdXNlcnMgdXNlcnNcbiAgICAgKiBAcmV0dXJuIHVzZXJzIHNhdmVkXG4gICAgICovXG4gICAgbW9kZWwudXBkYXRlID0gZnVuY3Rpb24ocGFyYW1zLCB1c2Vycykge1xuICAgICAgcmV0dXJuIFVzZXJzUmVzb3VyY2UudXBkYXRlKHBhcmFtcywgdXNlcnMpLiRwcm9taXNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBbc2F2ZVBob3RvIGRlc2NyaXB0aW9uXVxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gcGFyYW1zIFtkZXNjcmlwdGlvbl1cbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IGRhdGEgICBbZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuICAgIG1vZGVsLnNhdmVQaG90byA9IGZ1bmN0aW9uKHBhcmFtcywgZGF0YSkge1xuICAgICAgcmV0dXJuIFVzZXJzUmVzb3VyY2Uuc2F2ZVBob3RvKHBhcmFtcywgZGF0YSkuJHByb21pc2U7XG4gICAgfTtcblxuICAgICAvKipcbiAgICAgKiBVcGRhdGUgdXNlcidzIHN0YXR1c1xuICAgICAqIEBwYXJhbSB1c2VycyB1c2Vyc1xuICAgICAqIEByZXR1cm4gdXNlcnMgc2F2ZWRcbiAgICAgKi9cbiAgICBtb2RlbC51cGRhdGVTdGF0dXMgPSBmdW5jdGlvbihwYXJhbXMsIHVzZXJzKSB7XG4gICAgICByZXR1cm4gVXNlcnNSZXNvdXJjZS51cGRhdGVTdGF0dXMocGFyYW1zLCB1c2VycykuJHByb21pc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERlbGV0ZSB1c2Vyc1xuICAgICAqIEBwYXJhbSBpZCBpZFxuICAgICAqL1xuICAgIG1vZGVsLmRlbGV0ZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICByZXR1cm4gVXNlcnNSZXNvdXJjZS5kZWxldGUoaWQpLiRwcm9taXNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBleGNsdWRlIHVzZXIgZnJvbSB1c2Vyc2xpc3QgXG4gICAgICogQHBhcmFtICB7SW50ZWdldH0gdXNlcklkXG4gICAgICpcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBtb2RlbC5leGNsdWRlVXNlciA9IGZ1bmN0aW9uKHVzZXJJZCl7XG4gICAgICBhbmd1bGFyLmZvckVhY2gobW9kZWwudXNlcnNsaXN0LCBmdW5jdGlvbih1c2VyLCBpbmRleCl7XG4gICAgICAgIGlmKHBhcnNlSW50KHVzZXIuaWQpID09PSB1c2VySWQpe1xuICAgICAgICAgIG1vZGVsLnVzZXJzbGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAvKipcbiAgICAqIFtnZXRQaG90byBkZXNjcmlwdGlvbl1cbiAgICAqIEBwYXJhbSAge1t0eXBlXX0gcGFyYW1zICBbZGVzY3JpcHRpb25dXG4gICAgKiBAcGFyYW0gIHtbdHlwZV19IHN1Y2Nlc3MgW2Rlc2NyaXB0aW9uXVxuICAgICogQHBhcmFtICB7W3R5cGVdfSBmYWlsICAgIFtkZXNjcmlwdGlvbl1cbiAgICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAgKi9cbiAgICBtb2RlbC5nZXRQaG90byA9IGZ1bmN0aW9uKHBhcmFtcywgc3VjY2VzcywgZmFpbCkge1xuICAgICAgcmV0dXJuIFVzZXJzUmVzb3VyY2UuZ2V0UGhvdG8ocGFyYW1zLCBzdWNjZXNzLCBmYWlsKS4kcHJvbWlzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogW3NlYXJjaFVzZXJzIGRlc2NyaXB0aW9uXVxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gcGFyYW1zICBbZGVzY3JpcHRpb25dXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSBzdWNjZXNzIFtkZXNjcmlwdGlvbl1cbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IGZhaWwgICAgW2Rlc2NyaXB0aW9uXVxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAgICovXG4gICAgbW9kZWwuc2VhcmNoVXNlcnMgPSBmdW5jdGlvbihwYXJhbXMsIHN1Y2Nlc3MsIGZhaWwpIHtcbiAgICAgIHJldHVybiBVc2Vyc1Jlc291cmNlLnNlYXJjaFVzZXJzKHBhcmFtcywgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG4gICAgfTtcblxuICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvKipcbiAgICogQG5nZG9jIEZhY3RvcnlcbiAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5Vc2Vycy5GYWN0b3J5LlVzZXJzRmFjdG9yeVxuICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuVXNlcnNcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqXG4gICAqIFVzZXJzRmFjdG9yeSBoYW5kbGVzIGJ1c2luZXNzIGxvZ2ljIGFuZCBjb21tb24gZmVhdHVyZXNcbiAgICpcbiAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICovXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLlVzZXJzJylcbiAgICAuc2VydmljZSgnVXNlcnNGYWN0b3J5JywgVXNlcnNGYWN0b3J5KTtcblxuICAvKiBAbmdJbmplY3QgKi9cbiAgZnVuY3Rpb24gVXNlcnNGYWN0b3J5KG5vdGlmeSwgUmVzcG9uc2VIYW5kbGVyLCBVc2Vyc01vZGVsLCAkcSwgU3Bpbm5lcikge1xuICAgIHZhciBmYWN0b3J5ID0ge307XG5cbiAgICAvKipbZXJyb3JIYW5kbGVyIGRlc2NyaXB0aW9uXVxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gZXJyb3JSZXNwb25zZSBbZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgKi9cbiAgICBmYWN0b3J5LmVycm9ySGFuZGxlciA9IGZ1bmN0aW9uKGVycm9yUmVzcG9uc2UpIHtcbiAgICAgIG5vdGlmeS5lcnJvcih7XG4gICAgICAgIHRpdGxlOiAnRXJyb3IgJyArIGVycm9yUmVzcG9uc2UuZGF0YSA/IGVycm9yUmVzcG9uc2UuZGF0YS5jb2RlIDogZXJyb3JSZXNwb25zZS5zdGF0dXMsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yUmVzcG9uc2UuZGF0YSA/IGVycm9yUmVzcG9uc2UuZGF0YS5tZXNzYWdlIDogZXJyb3JSZXNwb25zZS5zdGF0dXNUZXh0XG4gICAgICB9KVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBnZXQgQWxsIFVzZXJzXG4gICAgICpcbiAgICAgKiBAcmVxdWlyZXMgcGFnZVxuICAgICAqIEByZXF1aXJlcyBwZXJfcGFnZVxuICAgICAqIEByZXF1aXJlcyBzb3J0X3F1ZXJ5XG4gICAgICogXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgICAgKi9cbiAgICBmYWN0b3J5LmdldFVzZXJzID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKSxcbiAgICAgICAgX3NvcnRCeSA9IG9wdGlvbnMuaXNTb3J0UmV2ZXJzZSA/ICctJyA6ICcnO1xuXG4gICAgICBVc2Vyc01vZGVsLmZpbmRBbGwoe1xuICAgICAgICAncGFnZSc6IG9wdGlvbnMucGFnZSxcbiAgICAgICAgJ3Blcl9wYWdlJzogb3B0aW9ucy5wZXJfcGFnZSxcbiAgICAgICAgJ3NvcnRfcXVlcnknOiBfc29ydEJ5ICsgb3B0aW9ucy5wcmVkaWNhdGVcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24oc3VjY2Vzc1Jlc3BvbnNlKSB7XG4gICAgICAgIFVzZXJzTW9kZWwudG90YWxDb3VudHMgPSBzdWNjZXNzUmVzcG9uc2UudG90YWxDb3VudDtcbiAgICAgICAgcGFyc2VSZXNwb25zZShzdWNjZXNzUmVzcG9uc2UubGlzdCk7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoc3VjY2Vzc1Jlc3BvbnNlKTtcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIFJlc3BvbnNlSGFuZGxlci5lcnJvcihlcnJvcik7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUobnVsbCk7XG4gICAgICB9KTtcbiAgICAgIC8qKlxuICAgICAgICogcGFyc2UgZ2V0VXNlcnMgcmVzcG9uc2VcbiAgICAgICAqIEBwYXJhbSAge0FycmF5fE9iamVjdH0gcmVzcG9uc2VEYXRhXG4gICAgICAgKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqIEByZXR1cm4ge1ZvaWR9XG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIHBhcnNlUmVzcG9uc2UocmVzcG9uc2VEYXRhKSB7XG4gICAgICAgIFNwaW5uZXIuaGlkZSgpO1xuICAgICAgICBVc2Vyc01vZGVsLnVzZXJzbGlzdC5sZW5ndGggPSAwO1xuICAgICAgICBpZiAocmVzcG9uc2VEYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShVc2Vyc01vZGVsLnVzZXJzbGlzdCwgcmVzcG9uc2VEYXRhKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhY3Rvcnk7XG4gIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLyoqXG4gICAqIEBuZ2RvYyBvdmVydmlld1xuICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLlBhZ2VzLlBhZ2VzU3RhdGVDb25maWdcbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLlBhZ2VzXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBTdGF0aWMgcGFnZSBzdGF0ZXNcbiAgICpcbiAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICovXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLlBhZ2VzJylcbiAgICAuY29uZmlnKFBhZ2VzU3RhdGVDb25maWcpO1xuXG4gIC8qIEBuZ0luamVjdCAqL1xuICBmdW5jdGlvbiBQYWdlc1N0YXRlQ29uZmlnKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgIC5zdGF0ZSgncGFnZScsIHtcbiAgICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICAgIHBhcmVudDogJ2luZGV4JyxcbiAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAnJzoge1xuICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IHVpLXZpZXc9XCJwYWdlLWNvbnRlbnRcIiBjbGFzcz1cImZhZGUtaW4tdXBcIj48L2Rpdj4nLFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9KTtcbiAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLyoqXG4gICAqIEBuZ2RvYyBvdmVydmlld1xuICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLmJMYXJhdmVsXG4gICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZVxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogdGhpcyBtb2R1bGUgd2lsbCBiZSB1c2VkIHRvIHNhdmUgdGhlIGRhdGEgZnJvbSBsYXJhdmVsIGJsYWRlcyBcbiAgICogYXZvaWQgZ2xvYmFsIHZhcmlhYmxlIGNvbGxpc2lvblxuICAgKlxuICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgKi9cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuYkxhcmF2ZWwnLCBbXSk7XG59KSgpOyIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUnKVxuICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgIC5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgcGFyZW50OiAnaW5kZXgnLFxuICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJvbGVzOiBbJ1JPTEVfQURNSU4nLCdST0xFX1NZU1RFTV9BRE1JTicsICdST0xFX1RFU1RFUiddLFxuICAgICAgICAgIHBhZ2VDbGFzcyA6ICdob21lLXBhZ2UnLFxuICAgICAgICAgIHBhZ2VUaXRsZTonbWFpbi50aXRsZSdcbiAgICAgICAgfSxcbiAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbW9kdWxlcy9tYWluL21haW4uaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnTWFpbkNvbnRyb2xsZXInXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnY29udGVudF9zaWRlYmFyJyA6IHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ21vZHVsZXMvbWFpbi9zaWRlYmFyL21haW4tc2lkZWJhci5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnTWFpblNpZGViYXJDb250cm9sbGVyIGFzIF9zZWxmJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgIG1haW5UcmFuc2xhdGVQYXJ0aWFsTG9hZGVyOiBbJyR0cmFuc2xhdGUnLCAnJHRyYW5zbGF0ZVBhcnRpYWxMb2FkZXInLFxuICAgICAgICAgICAgZnVuY3Rpb24oJHRyYW5zbGF0ZSwgJHRyYW5zbGF0ZVBhcnRpYWxMb2FkZXIpIHtcbiAgICAgICAgICAgICAgJHRyYW5zbGF0ZVBhcnRpYWxMb2FkZXIuYWRkUGFydCgnbWFpbicpO1xuICAgICAgICAgICAgICByZXR1cm4gJHRyYW5zbGF0ZS5yZWZyZXNoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgfSk7IiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG4gIC8qKlxuICAgKiBAbmdkb2MgQ29udHJvbGxlclxuICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLm1haW4uQ29udHJvbGxlci5NYWluQ29udHJvbGxlclxuICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUubWFpblxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTGFuZGluZyBkYXNoYm9hcmQgcGFnZSBjb250cm9sbGVyXG4gICAqIFJlc3BvbnNpYmxlIGZvciBhbGwgdmlldyBzdGF0ZXNcbiAgICpcbiAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICovXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlJylcbiAgICAuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBNYWluQ29udHJvbGxlcik7XG5cbiAgLyogQG5nSW5qZWN0ICovXG4gIGZ1bmN0aW9uIE1haW5Db250cm9sbGVyKCRzY29wZSwgJG1vZGFsLCBMb2dnZXIsIExheW91dFNlcnZpY2UsIG5vdGlmeSwgU3Bpbm5lciwgJHdpbmRvdywgdXRpbEZhY3RvcnksIEFQUF9DT05GSUcsICRzdGF0ZSwgJGZpbHRlcikge1xuICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyoqXG4gICAgICogQG5nZG9jIGNvbmZpZ1xuICAgICAqXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5MaXN0aW5nLmNvbmZpZy5MaXN0aW5nU3RhdGVcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuTGlzdGluZ1xuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQ29uZmlndXJlIGxpc3RpbmcgbW9kdWxlIHJvdXRlc1xuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuTGlzdGluZycpXG4gICAgICAgIC5jb25maWcoTGlzdGluZ1N0YXRlKTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIExpc3RpbmdTdGF0ZSgkc3RhdGVQcm92aWRlciwgQVBQX0NPTkZJRywgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdsaXN0aW5nJywge1xuICAgICAgICAgICAgcGFyZW50OiAnZGFzaGJvYXJkJyxcbiAgICAgICAgICAgIGFic29sdXRlOiB0cnVlLFxuICAgICAgICAgICAgdXJsOiAnL2xpc3RpbmcnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnZGFzaGJvYXJkX3ZpZXdAZGFzaGJvYXJkJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogQVBQX0NPTkZJRy5tb2R1bGVzICsgJy9saXN0aW5nL2xpc3RpbmctbGF5b3V0Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTGlzdGluZ0NvbnRyb2xsZXIgYXMgYmFzZUNvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KS5zdGF0ZSgnbGlzdGluZy5saXN0Jywge1xuICAgICAgICAgICAgcGFyZW50OiAnbGlzdGluZycsXG4gICAgICAgICAgICB1cmw6ICcvbGlzdCcsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdsaXN0aW5nX3ZpZXdAbGlzdGluZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IEFQUF9DT05GSUcubW9kdWxlcyArICcvbGlzdGluZy9saXN0L2xpc3QuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMaXN0TGlzdGluZ0NvbnRyb2xsZXIgYXMgbGlzdGluZ0N0cmwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICBNb2RlbDogWydMaXN0aW5nTW9kZWwnLCAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24oTGlzdGluZ01vZGVsLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIExpc3RpbmdNb2RlbDtcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICBMaXN0aW5nX3R5cGU6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHN0YXRlUGFyYW1zLmxpc3RpbmdfdHlwZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnN0YXRlKCdsaXN0aW5nLmNyZWF0ZScsIHtcbiAgICAgICAgICAgIHBhcmVudDogJ2xpc3RpbmcnLFxuICAgICAgICAgICAgdXJsOiAnL2NyZWF0ZScsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdsaXN0aW5nX3ZpZXdAbGlzdGluZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IEFQUF9DT05GSUcubW9kdWxlcyArICcvbGlzdGluZy9jcmVhdGUvY3JlYXRlLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAvL2NvbnRyb2xsZXI6ICdMaXN0aW5nQ29udHJvbGxlciBhcyBsaXN0aW5nQ3RybCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnN0YXRlKCdsaXN0aW5nLmNyZWF0ZS5saXN0Jywge1xuICAgICAgICAgICAgcGFyZW50OiAnbGlzdGluZy5jcmVhdGUnLFxuICAgICAgICAgICAgdXJsOiAnLzpsaXN0aW5nX3R5cGUnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnY3JlYXRlX2xpc3Rpbmdfdmlld0BsaXN0aW5nLmNyZWF0ZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEFQUF9DT05GSUcubW9kdWxlcyArICcvbGlzdGluZy9wYXJ0aWFscy8nICsgJHN0YXRlUGFyYW1zLmxpc3RpbmdfdHlwZSArICcuZm9ybS5odG1sJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ3JlYXRlTGlzdGluZ0NvbnRyb2xsZXIgYXMgY3JlYXRlTGlzdEN0cmwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICBSZXNvbHZlRGF0YTogWydDYXRlZ29yaWVzTW9kZWwnLCAnJHN0YXRlUGFyYW1zJywgJyRxJywgZnVuY3Rpb24oQ2F0ZWdvcmllc01vZGVsLCAkc3RhdGVQYXJhbXMsICRxKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeVR5cGU7XG4gICAgICAgICAgICAgICAgICAgIENhdGVnb3JpZXNNb2RlbC5hbGwoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3R5cGVzJ1xuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShDYXRlZ29yaWVzTW9kZWwuY2F0ZWdvcnlUeXBlcywgcmVzcG9uc2UubGlzdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeVR5cGUgPSBfLmZpbmQoQ2F0ZWdvcmllc01vZGVsLmNhdGVnb3J5VHlwZXMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndHlwZV9jb2RlJzogJHN0YXRlUGFyYW1zLmxpc3RpbmdfdHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkgfHwge307XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2F0ZWdvcnlUeXBlJzogY2F0ZWdvcnlUeXBlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoe30pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgTGlzdGluZ190eXBlOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRzdGF0ZVBhcmFtcy5saXN0aW5nX3R5cGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KS5zdGF0ZSgnbGlzdGluZy5jcmVhdGUubGlzdC51cGRhdGUnLCB7XG4gICAgICAgICAgICBwYXJlbnQ6ICdsaXN0aW5nLmNyZWF0ZScsXG4gICAgICAgICAgICB1cmw6ICdeL3VwZGF0ZS86bGlzdGluZ190eXBlLzpsaXN0X2lkJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2NyZWF0ZV9saXN0aW5nX3ZpZXdAbGlzdGluZy5jcmVhdGUnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBBUFBfQ09ORklHLm1vZHVsZXMgKyAnL2xpc3RpbmcvcGFydGlhbHMvJyArICRzdGF0ZVBhcmFtcy5saXN0aW5nX3R5cGUgKyAnLmZvcm0uaHRtbCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NyZWF0ZUxpc3RpbmdDb250cm9sbGVyIGFzIGNyZWF0ZUxpc3RDdHJsJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgUmVzb2x2ZURhdGE6IFsnQ2F0ZWdvcmllc01vZGVsJywgJyRzdGF0ZVBhcmFtcycsICckcScsIGZ1bmN0aW9uKENhdGVnb3JpZXNNb2RlbCwgJHN0YXRlUGFyYW1zLCAkcSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlUeXBlO1xuICAgICAgICAgICAgICAgICAgICBDYXRlZ29yaWVzTW9kZWwuYWxsKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0eXBlcydcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoQ2F0ZWdvcmllc01vZGVsLmNhdGVnb3J5VHlwZXMsIHJlc3BvbnNlLmxpc3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlUeXBlID0gXy5maW5kKENhdGVnb3JpZXNNb2RlbC5jYXRlZ29yeVR5cGVzLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGVfY29kZSc6ICRzdGF0ZVBhcmFtcy5saXN0aW5nX3R5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pIHx8IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhdGVnb3J5VHlwZSc6IGNhdGVnb3J5VHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHt9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgIExpc3RpbmdfdHlwZTogZnVuY3Rpb24oJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkc3RhdGVQYXJhbXMubGlzdGluZ190eXBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyoqXG4gICAgICogQG5nZG9jIEZhY3RvcnlcbiAgICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLkxpc3RpbmcuRmFjdG9yeS5MaXN0aW5nUmVzb3VyY2VcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuTGlzdGluZ1xuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogSW1wbGVtZW50cyBDVVJEIG9wZXJhdGlvbnNcbiAgICAgKlxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkxpc3RpbmcnKVxuICAgICAgICAuZmFjdG9yeSgnTGlzdGluZ1Jlc291cmNlJywgTGlzdGluZ1Jlc291cmNlKTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIExpc3RpbmdSZXNvdXJjZSgkcmVzb3VyY2UsIEFQUF9DT05GSUcpIHtcbiAgICAgICAgLyogJHJlc291cmNlKEFQSV9VUkwsIERFRkFVTFRfUEFSQU1FVEVSUywgQ09ORklHVVJFX1lPVVJfQ1VTVE9NX01FVEhPRFMpKi9cbiAgICAgICAgcmV0dXJuICRyZXNvdXJjZSgnbGlzdGluZy86aWQnLCB7XG4gICAgICAgICAgICBpZDogJ0BpZCdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgZmluZDoge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAnQGlkJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybVJlc3BvbnNlOiB0cmFuc2Zvcm1HZXRSZXNwb25zZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNhdmU6IHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVwZGF0ZToge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BVVCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBxdWVyeToge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtUmVzcG9uc2U6IHRyYW5zZm9ybVF1ZXJ5UmVzcG9uc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjYW5jZWw6IHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBpZDogJ0BpZCcsXG5cdFx0XHRcdFx0bGlzdF9pZDogJ0BsaXN0X2lkJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVybDogJ2NhbmNlbGltYWdlJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybVF1ZXJ5UmVzcG9uc2UoZGF0YSwgaGVhZGVyc0dldHRlcikge1xuICAgICAgICB2YXIgX3Jlc3BvbnNlID0ge307XG4gICAgICAgIF9yZXNwb25zZS5saXN0ID0gYW5ndWxhci5mcm9tSnNvbihkYXRhKTtcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZnJvbUpzb24oX3Jlc3BvbnNlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm1HZXRSZXNwb25zZShkYXRhLCBoZWFkZXJzR2V0dGVyKSB7XG4gICAgICAgIHZhciBfcmVzcG9uc2UgPSB7fTtcbiAgICAgICAgX3Jlc3BvbnNlLmRhdGEgPSBhbmd1bGFyLmZyb21Kc29uKGRhdGEpO1xuICAgICAgICByZXR1cm4gYW5ndWxhci5mcm9tSnNvbihfcmVzcG9uc2UpO1xuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBTZXJ2aWNlXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5MaXN0aW5nLlNlcnZpY2UuTGlzdGluZ01vZGVsXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkxpc3RpbmdcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqXG4gICAgICogRGF0YSBtb2RlbCBmb3Igam9idGFzayBtb2R1bGVcbiAgICAgKiBJbXBsZW1lbmV0cyBDVVJEIG9wZXJhdGlvblxuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuTGlzdGluZycpXG4gICAgICAgIC5zZXJ2aWNlKCdMaXN0aW5nTW9kZWwnLCBMaXN0aW5nTW9kZWwpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gTGlzdGluZ01vZGVsKExpc3RpbmdSZXNvdXJjZSkge1xuICAgICAgICB2YXIgbW9kZWwgPSB0aGlzO1xuICAgICAgICAvKipcbiAgICAgICAgICogW2xpc3RpbmdTY2hlbWEgZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBtb2RlbC5saXN0aW5nU2NoZW1hID0ge1xuICAgICAgICAgICAgaWQ6IG51bGwsXG4gICAgICAgICAgICB0aXRsZTogJycsXG4gICAgICAgICAgICB1c2VyX2lkOiBudWxsLFxuICAgICAgICAgICAgZW1haWw6ICcnLFxuICAgICAgICAgICAgY29udGFjdDogJycsXG4gICAgICAgICAgICBwcmljZTogMC4wMCxcbiAgICAgICAgICAgIGRlYWxwcmljZTogMC4wMCxcbiAgICAgICAgICAgIGRpc2NvdW50OiAwLFxuICAgICAgICAgICAgc2F2aW5nOiAwLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICAgICAgY2F0ZWdvcmllczogbnVsbCxcbiAgICAgICAgICAgIHZpc2FfaWQ6IG51bGwsXG4gICAgICAgICAgICBzdGF0dXM6IDEsXG4gICAgICAgICAgICBleHBpcnk6ICcnLFxuICAgICAgICAgICAgc2x1ZzogJydcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogW2pvYkxpc3QgZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEBUcnVlIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIG1vZGVsLmRhc2hib2FyZExpc3QgPSBbXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogW2Rhc2hib2FyZEFjdGl2aXRpZXMgZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEBUcnVlIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIG1vZGVsLmRhc2hib2FyZEFjdGl2aXRpZXMgPSBbXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IGRhc2hib2FyZFxuICAgICAgICAgKiBAcGFyYW0gaWQgaWRcbiAgICAgICAgICogQHJldHVybiBkYXNoYm9hcmRcbiAgICAgICAgICovXG4gICAgICAgIG1vZGVsLmZpbmQgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgcmV0dXJuIExpc3RpbmdSZXNvdXJjZS5maW5kKGlkKS4kcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFtmaW5kQWxsTGlzdGluZyBkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQG1ldGhvZCBmaW5kQWxcbiAgICAgICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSAgICAgICAgICBwYXJhbXMgW2Rlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqL1xuICAgICAgICBtb2RlbC5maW5kQWxsID0gZnVuY3Rpb24ocGFyYW1zLCBzdWNjZXNzLCBmYWlsKSB7XG4gICAgICAgICAgICByZXR1cm4gTGlzdGluZ1Jlc291cmNlLnF1ZXJ5KHBhcmFtcywgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZSBhIG5ldyBkYXNoYm9hcmRcbiAgICAgICAgICogQHBhcmFtIGRhc2hib2FyZCBkYXNoYm9hcmRcbiAgICAgICAgICogQHJldHVybiBkYXNoYm9hcmQgc2F2ZWRcbiAgICAgICAgICovXG4gICAgICAgIG1vZGVsLnNhdmUgPSBmdW5jdGlvbihsaXN0KSB7XG4gICAgICAgICAgICByZXR1cm4gTGlzdGluZ1Jlc291cmNlLnNhdmUobGlzdCkuJHByb21pc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwZGF0ZSBkYXNoYm9hcmRcbiAgICAgICAgICogQHBhcmFtIGRhc2hib2FyZCBkYXNoYm9hcmRcbiAgICAgICAgICogQHJldHVybiBkYXNoYm9hcmQgc2F2ZWRcbiAgICAgICAgICovXG4gICAgICAgIG1vZGVsLnVwZGF0ZSA9IGZ1bmN0aW9uKHBhcmFtcywgZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIExpc3RpbmdSZXNvdXJjZS51cGRhdGUocGFyYW1zLCBkYXRhKS4kcHJvbWlzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVsZXRlIGRhc2hib2FyZFxuICAgICAgICAgKiBAcGFyYW0gaWQgaWRcbiAgICAgICAgICovXG4gICAgICAgIG1vZGVsLmRlbGV0ZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gTGlzdGluZ1Jlc291cmNlLmRlbGV0ZShpZCkuJHByb21pc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgbW9kZWwuY2FuY2VsID0gZnVuY3Rpb24oaWQsbGlzdF9pZCkge1xuICAgICAgICAgICAgcmV0dXJuIExpc3RpbmdSZXNvdXJjZS5jYW5jZWwoaWQsbGlzdF9pZCkuJHByb21pc2U7XG4gICAgICAgIH07XG5cbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgQ29udHJvbGxlclxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuU2VydmljZXByb3ZpZGVyLkNvbnRyb2xsZXIuTGlzdGluZ0NvbnRyb2xsZXJcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuTGlzdGluZ1xuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogTGlzdGluZ0NvbnRyb2xsZXIgaXMgcmVzcG9uc2libGUgbWFuYWdlIGFjY291bnQgYWN0aXZpdGllc1xuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIExpc3RpbmdDb250cm9sbGVyKCRzY29wZSwgJHdpbmRvdykge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGluaXQoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogaW5pdGlhbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICAgICAqIFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cblxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICB9XG4gICAgLy9lbmQgb2YgY29udHJvbGxlclxuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkxpc3RpbmcnKVxuICAgICAgICAuY29udHJvbGxlcignTGlzdGluZ0NvbnRyb2xsZXInLCBMaXN0aW5nQ29udHJvbGxlcik7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBvdmVydmlld1xuICAgICAqIEBuYW1lIEdsb2JhbEJlYXV0eUNvbGxlY3RpdmVcbiAgICAgKlxuICAgICAqIEBtb2R1bGUgR2xvYmFsQmVhdXR5Q29sbGVjdGl2ZVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQ29uZmlndWFydGlvbiB3aGlsZSBwcm92aWRlciBhcmUgY3JlYXRlZFxuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5HbG9iYWxCZWF1dHlDb2xsZWN0aXZlJywgW1xuICAgICAgICAvKlxuICAgICAgICAgKiBPcmRlciBpcyBub3QgaW1wb3J0YW50LiBBbmd1bGFyIG1ha2VzIGFcbiAgICAgICAgICogcGFzcyB0byByZWdpc3RlciBhbGwgb2YgdGhlIG1vZHVsZXMgbGlzdGVkXG4gICAgICAgICAqL1xuXG4gICAgICAgIC8qXG4gICAgICAgICAqIEV2ZXJ5Ym9keSBoYXMgYWNjZXNzIHRvIHRoZXNlLlxuICAgICAgICAgKiBXZSBjb3VsZCBwbGFjZSB0aGVzZSB1bmRlciBldmVyeSBmZWF0dXJlIGFyZWEsXG4gICAgICAgICAqIGJ1dCB0aGlzIGlzIGVhc2llciB0byBtYWludGFpbi5cbiAgICAgICAgICovXG4gICAgICAgICdCZWF1dHlDb2xsZWN0aXZlLkNvcmUnLFxuICAgICAgICAnQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzJ1xuXG4gICAgXSk7XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZScpXG4gIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgLnN0YXRlKCdlcnJvcicsIHtcbiAgICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICAgIHBhcmVudDogJ2luZGV4JyxcbiAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiB1aS12aWV3PVwiZXJyb3JcIiBjbGFzcz1cImZhZGUtaW4tdXBcIj48L2Rpdj4nLFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9KTtcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgLnN0YXRlKCdlcnJvci5leGNlcHRpb24nLCB7XG4gICAgICAgIHBhcmVudDogJ2Vycm9yJyxcbiAgICAgICAgdXJsOiAnL2Vycm9yJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJvbGVzOiBbXSxcbiAgICAgICAgICBwYWdlVGl0bGU6ICdlcnJvcnMudGl0bGUnXG4gICAgICAgIH0sXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgJ2Vycm9yJzoge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdtb2R1bGVzL2Vycm9yL2Vycm9yLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjonRXJyb3JDb250cm9sbGVyJ1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgIG1haW5UcmFuc2xhdGVQYXJ0aWFsTG9hZGVyOiBbJyR0cmFuc2xhdGUnLCAnJHRyYW5zbGF0ZVBhcnRpYWxMb2FkZXInLFxuICAgICAgICAgICAgZnVuY3Rpb24oJHRyYW5zbGF0ZSwgJHRyYW5zbGF0ZVBhcnRpYWxMb2FkZXIpIHtcbiAgICAgICAgICAgICAgJHRyYW5zbGF0ZVBhcnRpYWxMb2FkZXIuYWRkUGFydCgnZXJyb3InKTtcbiAgICAgICAgICAgICAgcmV0dXJuICR0cmFuc2xhdGUucmVmcmVzaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5zdGF0ZSgnYWNjZXNzZGVuaWVkJywge1xuICAgICAgICBwYXJlbnQ6ICdlcnJvcicsXG4gICAgICAgIHVybDogJy9hY2Nlc3NkZW5pZWQnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcm9sZXM6IFtdXG4gICAgICAgIH0sXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgJ2Vycm9yJzoge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdtb2R1bGVzL2Vycm9yL2FjY2Vzc2RlbmllZC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6J0Vycm9yQ29udHJvbGxlcidcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICBtYWluVHJhbnNsYXRlUGFydGlhbExvYWRlcjogWyckdHJhbnNsYXRlJywgJyR0cmFuc2xhdGVQYXJ0aWFsTG9hZGVyJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCR0cmFuc2xhdGUsICR0cmFuc2xhdGVQYXJ0aWFsTG9hZGVyKSB7XG4gICAgICAgICAgICAgICR0cmFuc2xhdGVQYXJ0aWFsTG9hZGVyLmFkZFBhcnQoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgIHJldHVybiAkdHJhbnNsYXRlLnJlZnJlc2goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9KTsiLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLyoqXG4gICAqIEBuZ2RvYyBDb250cm9sbGVyXG4gICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuQ29udHJvbGxlci5FcnJvckNvbnRyb2xsZXJcbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBFcnJvciBjb250cm9sbGVyIHRvIGhhbmxkZSBlcnJvcnNcbiAgICpcbiAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICovXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlJylcbiAgICAuY29udHJvbGxlcignRXJyb3JDb250cm9sbGVyJywgRXJyb3JDb250cm9sbGVyKTtcbiAgLyogQG5nSW5qZWN0ICovXG4gIGZ1bmN0aW9uIEVycm9yQ29udHJvbGxlcigkc2NvcGUsU3Bpbm5lciwgJHN0YXRlKSB7XG4gICAgU3Bpbm5lci5oaWRlKCk7XG5cbn1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgRmFjdG9yeVxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuQWNjb3VudC5GYWN0b3J5LkNhdGVnb3JpZXNSZXNvdXJjZVxuICAgICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50XG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBJbXBsZW1lbnRzIENVUkQgb3BlcmF0aW9uc1xuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuQWNjb3VudCcpXG4gICAgICAgIC5mYWN0b3J5KCdDYXRlZ29yaWVzUmVzb3VyY2UnLCBDYXRlZ29yaWVzUmVzb3VyY2UpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gQ2F0ZWdvcmllc1Jlc291cmNlKCRyZXNvdXJjZSwgQVBQX0NPTkZJRykge1xuICAgICAgICAvKiAkcmVzb3VyY2UoQVBJX1VSTCwgREVGQVVMVF9QQVJBTUVURVJTLCBDT05GSUdVUkVfWU9VUl9DVVNUT01fTUVUSE9EUykqL1xuICAgICAgICByZXR1cm4gJHJlc291cmNlKCdjYXRlZ29yaWVzLzp0eXBlJywge1xuICAgICAgICAgICAgdHlwZTogJ0B0eXBlcydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgZmluZDoge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAnQGlkJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3JlYXRlOiB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnam9icy9zYXZlJyxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHt9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXBkYXRlOiB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdAaWQnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZpbmRBbGxCeVR5cGU6IHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBxdWVyeToge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtUmVzcG9uc2U6IHRyYW5zZm9ybVF1ZXJ5UmVzcG9uc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZWFyY2hjYXRlZ29yaWVzOiB7XG4gICAgICAgICAgICAgICAgdXJsOidzZXJ2aWNlcHJvdmlkZXJjYXRlZ29yaWVzJyxcblx0XHRcdFx0bWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1SZXNwb25zZTogdHJhbnNmb3JtUXVlcnlSZXNwb25zZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm1RdWVyeVJlc3BvbnNlKGRhdGEsIGhlYWRlcnNHZXR0ZXIpIHtcbiAgICAgICAgdmFyIF9yZXNwb25zZSA9IHt9O1xuICAgICAgICBfcmVzcG9uc2UubGlzdCA9IGFuZ3VsYXIuZnJvbUpzb24oZGF0YSk7XG4gICAgICAgIHJldHVybiBhbmd1bGFyLmZyb21Kc29uKF9yZXNwb25zZSk7XG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG4gIC8qKlxuICAgKiBAbmdkb2MgU2VydmljZVxuICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLkFjY291bnQuU2VydmljZS5DYXRlZ29yaWVzTW9kZWxcbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkFjY291bnRcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqXG4gICAqIERhdGEgbW9kZWwgZm9yIENhdGVnb3JpZXNcbiAgICogSW1wbGVtZW5ldHMgQ1VSRCBvcGVyYXRpb25cbiAgICpcbiAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICovXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkFjY291bnQnKVxuICAgIC5zZXJ2aWNlKCdDYXRlZ29yaWVzTW9kZWwnLCBDYXRlZ29yaWVzTW9kZWwpO1xuXG4gIC8qIEBuZ0luamVjdCAqL1xuICBmdW5jdGlvbiBDYXRlZ29yaWVzTW9kZWwoQ2F0ZWdvcmllc1Jlc291cmNlKSB7XG4gICAgdmFyIG1vZGVsID0gdGhpcztcblxuICAgIC8qKlxuICAgICAqIFtjYXRlZ29yaWVzIGxpc3RdXG4gICAgICogQFRydWUge0FycmF5fVxuICAgICAqL1xuICAgIG1vZGVsLmNhdGVnb3JpZXMgPSBbXTtcbiAgICBtb2RlbC5zdWJDYXRlZ29yaWVzID0gW107XG5cbiAgICBtb2RlbC5jYXRlZ29yeVR5cGVzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBHZXQgTGlzdGluZ1xuICAgICAqIEBwYXJhbSBpZCBpZFxuICAgICAqIEByZXR1cm4gbGlzdFxuICAgICAqL1xuICAgIG1vZGVsLmdldCA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICByZXR1cm4gQ2F0ZWdvcmllc1Jlc291cmNlLmZpbmQoaWQpLiRwcm9taXNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBbYWxsIGRlc2NyaXB0aW9uXVxuICAgICAqIEBtZXRob2QgYWxsXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19ICAgICAgICAgIHBhcmFtcyBbZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuICAgIG1vZGVsLmFsbCA9IGZ1bmN0aW9uKHBhcmFtcywgc3VjY2VzcywgZmFpbCl7XG4gICAgICByZXR1cm4gQ2F0ZWdvcmllc1Jlc291cmNlLnF1ZXJ5KHBhcmFtcywgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG4gICAgfTtcblx0XG5cdC8qKlxuICAgICAqIFtzZWFyY2ggY2F0ZWdvcmllc11cbiAgICAgKiBAbWV0aG9kIGFsbFxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSAgICAgICAgICBwYXJhbXMgW2Rlc2NyaXB0aW9uXVxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgKi9cbiAgICBtb2RlbC5zZWFyY2hjYXRlZ29yaWVzID0gZnVuY3Rpb24ocGFyYW1zLCBzdWNjZXNzLCBmYWlsKXtcbiAgICAgIHJldHVybiBDYXRlZ29yaWVzUmVzb3VyY2Uuc2VhcmNoY2F0ZWdvcmllcyhwYXJhbXMsIHN1Y2Nlc3MsIGZhaWwpLiRwcm9taXNlO1xuICAgIH07XG5cbn1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2Mgb3ZlcnZpZXdcbiAgICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLkRhc2hib2FyZFxuICAgICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5EYXNoYm9hcmRcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIERhc2hib2FyZCB0YXNrIG1vZHVsZVxuICAgICAqIEBzZWUgRGFzaGJvYXJkLm1vZGVsLmpzXG4gICAgICogQHNlZSBEYXNoYm9hcmQucmVzb3VyY2UuanNcbiAgICAgKlxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkRhc2hib2FyZCcsIFsndWkuYm9vdHN0cmFwJyxcbiAgICAgICAgICAgICdCZWF1dHlDb2xsZWN0aXZlLkNvcmUnLFxuICAgICAgICAgICAgJ0JlYXV0eUNvbGxlY3RpdmUuQ29tcG9uZW50cycsXG4gICAgICAgICAgICAnQmVhdXR5Q29sbGVjdGl2ZS5XaWRnZXRzJyxcbiAgICAgICAgICAgICdCZWF1dHlDb2xsZWN0aXZlLkRhc2hib2FyZCcsXG4gICAgICAgICAgICAnQmVhdXR5Q29sbGVjdGl2ZS5QYWdlcycsXG4gICAgICAgICAgICAnQmVhdXR5Q29sbGVjdGl2ZS5Vc2VycycsXG4gICAgICAgICAgICAnQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50JyxcbiAgICAgICAgICAgICdCZWF1dHlDb2xsZWN0aXZlLkxpc3RpbmcnLFxuICAgICAgICAgICAgJ0JlYXV0eUNvbGxlY3RpdmUuU3VidXJicydcbiAgICAgICAgXSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgY29uZmlnXG4gICAgICpcbiAgICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLmRhc2hib2FyZC5jb25maWcuRGFzaGJvYXJkU3RhdGVcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuZGFzaGJvYXJkXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBDb25maWd1cmUgZGFzaGJvYXJkIG1vZHVsZSByb3V0ZXNcbiAgICAgKlxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkRhc2hib2FyZCcpXG4gICAgICAgIC5jb25maWcoRGFzaGJvYXJkU3RhdGUpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gRGFzaGJvYXJkU3RhdGUoJHN0YXRlUHJvdmlkZXIsIEFQUF9DT05GSUcsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG5cbiAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2Rhc2hib2FyZCcsIHtcbiAgICAgICAgICAgIGFic29sdXRlOiB0cnVlLCAgICAgICAgICAgXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICcnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBBUFBfQ09ORklHLm1vZHVsZXMgKyAnL2Rhc2hib2FyZC9kYXNoYm9hcmQuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdEYXNoYm9hcmRDb250cm9sbGVyIGFzIGRhc2hib2FyZEN0cmwnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAndXNlci10b3Atc2VjdGlvbic6e1xuICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IEFQUF9DT05GSUcubW9kdWxlcyArICcvZGFzaGJvYXJkL2Rhc2hib2FyZF90b3Bfc2VjdGlvbi5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdEYXNoYm9hcmRDb250cm9sbGVyIGFzIGRhc2hib2FyZEN0cmwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBGYWN0b3J5XG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50LkZhY3RvcnkuQWNjb3VudFJlc291cmNlXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkFjY291bnRcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEltcGxlbWVudHMgQ1VSRCBvcGVyYXRpb25zXG4gICAgICpcbiAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAqL1xuICAgIGFuZ3VsYXJcbiAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuQWNjb3VudCcpXG4gICAgICAuZmFjdG9yeSgnQWNjb3VudFJlc291cmNlJywgQWNjb3VudFJlc291cmNlKTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIEFjY291bnRSZXNvdXJjZSgkcmVzb3VyY2UsIEFQUF9DT05GSUcpIHtcbiAgICAgIC8qICRyZXNvdXJjZShBUElfVVJMLCBERUZBVUxUX1BBUkFNRVRFUlMsIENPTkZJR1VSRV9ZT1VSX0NVU1RPTV9NRVRIT0RTKSovXG4gICAgICByZXR1cm4gJHJlc291cmNlKCdhcGkvZGFzaGJvYXJkLycsIHtcbiAgICAgICAgICByZXF1ZXN0VHlwZTogJ0ByZXF1ZXN0VHlwZScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgZmluZDoge1xuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICBpZDogJ0BpZCcsXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzYXZlOiB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICByZXF1ZXN0VHlwZTogJ2FkZCcsXG4gICAgICAgICAgICBpZDogJ0BpZCcsXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB1cGRhdGU6IHtcbiAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgaWQ6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBTZXJ2aWNlXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5EYXNoYm9hcmQuU2VydmljZS5EYXNoYm9hcmRNb2RlbFxuICAgICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5EYXNoYm9hcmRcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqXG4gICAgICogRGF0YSBtb2RlbCBmb3Igam9idGFzayBtb2R1bGVcbiAgICAgKiBJbXBsZW1lbmV0cyBDVVJEIG9wZXJhdGlvblxuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuRGFzaGJvYXJkJylcbiAgICAgICAgLnNlcnZpY2UoJ0Rhc2hib2FyZE1vZGVsJywgRGFzaGJvYXJkTW9kZWwpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gRGFzaGJvYXJkTW9kZWwoRGFzaGJvYXJkUmVzb3VyY2UpIHtcbiAgICAgICAgdmFyIG1vZGVsID0gdGhpcztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFtqb2JMaXN0IGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAVHJ1ZSB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBtb2RlbC5kYXNoYm9hcmRMaXN0ID0gW107XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFtkYXNoYm9hcmRBY3Rpdml0aWVzIGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAVHJ1ZSB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICBtb2RlbC5kYXNoYm9hcmRBY3Rpdml0aWVzID0gW107XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IGRhc2hib2FyZFxuICAgICAgICAgKiBAcGFyYW0gaWQgaWRcbiAgICAgICAgICogQHJldHVybiBkYXNoYm9hcmRcbiAgICAgICAgICovXG4gICAgICAgIG1vZGVsLmZpbmQgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgcmV0dXJuIERhc2hib2FyZFJlc291cmNlLmZpbmQoaWQpLiRwcm9taXNlO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogW2ZpbmRBbGxBY3Rpdml0aWVzIGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAbWV0aG9kIGZpbmRBbGxBY3Rpdml0aWVzXG4gICAgICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gICAgICAgICAgcGFyYW1zIFtkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgICAgICAgKi9cbiAgICAgICAgbW9kZWwuZmluZEFsbEFjdGl2aXRpZXMgPSBmdW5jdGlvbihwYXJhbXMsIHN1Y2Nlc3MsIGZhaWwpIHtcbiAgICAgICAgICAgIHJldHVybiBEYXNoYm9hcmRSZXNvdXJjZS5maW5kQWxsQWN0aXZpdGllcyhwYXJhbXMsIHN1Y2Nlc3MsIGZhaWwpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDcmVhdGUgYSBuZXcgZGFzaGJvYXJkXG4gICAgICAgICAqIEBwYXJhbSBkYXNoYm9hcmQgZGFzaGJvYXJkXG4gICAgICAgICAqIEByZXR1cm4gZGFzaGJvYXJkIHNhdmVkXG4gICAgICAgICAqL1xuICAgICAgICBtb2RlbC5zYXZlID0gZnVuY3Rpb24oZGFzaGJvYXJkKSB7XG4gICAgICAgICAgICByZXR1cm4gRGFzaGJvYXJkUmVzb3VyY2Uuc2F2ZShkYXNoYm9hcmQpLiRwcm9taXNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGUgZGFzaGJvYXJkXG4gICAgICAgICAqIEBwYXJhbSBkYXNoYm9hcmQgZGFzaGJvYXJkXG4gICAgICAgICAqIEByZXR1cm4gZGFzaGJvYXJkIHNhdmVkXG4gICAgICAgICAqL1xuICAgICAgICBtb2RlbC51cGRhdGUgPSBmdW5jdGlvbihkYXNoYm9hcmQpIHtcbiAgICAgICAgICAgIHJldHVybiBEYXNoYm9hcmRSZXNvdXJjZS51cGRhdGUoZGFzaGJvYXJkKS4kcHJvbWlzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVsZXRlIGRhc2hib2FyZFxuICAgICAgICAgKiBAcGFyYW0gaWQgaWRcbiAgICAgICAgICovXG4gICAgICAgIG1vZGVsLmRlbGV0ZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gRGFzaGJvYXJkUmVzb3VyY2UuZGVsZXRlKGlkKS4kcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgQ29udHJvbGxlclxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuU2VydmljZXByb3ZpZGVyLkNvbnRyb2xsZXIuRGFzaGJvYXJkQ29udHJvbGxlclxuICAgICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50XG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBEYXNoYm9hcmRDb250cm9sbGVyIGlzIHJlc3BvbnNpYmxlIG1hbmFnZSBhY2NvdW50IGFjdGl2aXRpZXNcbiAgICAgKlxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBEYXNoYm9hcmRDb250cm9sbGVyKCRzY29wZSwgJHdpbmRvdyxMYXJhdmVsKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxyb2xlcyA9IFtdO1xuICAgICAgICBpbml0KCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGluaXRpYWxpemUgcHJvcGVydGllc1xuICAgICAgICAgKiBcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG5cbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgIHJvbGVzID0gYW5ndWxhci5mcm9tSnNvbihMYXJhdmVsLnJvbGVzKTtcbiAgICAgICAgICAgIHJvbGVzID0gXy5tYXAocm9sZXMsIGZ1bmN0aW9uKHJvbGUpe1xuICAgICAgICAgICAgICAgIHJldHVybiAocm9sZS5uYW1lKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLmhhc1JvbGUgPSBmdW5jdGlvbihyb2xlTmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJvbGVzLmluZGV4T2Yocm9sZU5hbWUpID49IDA7XG4gICAgICAgIH1cblxuICAgICAgICBcblxuICAgIH1cbiAgICAvL2VuZCBvZiBjb250cm9sbGVyXG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuQWNjb3VudCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdEYXNoYm9hcmRDb250cm9sbGVyJywgRGFzaGJvYXJkQ29udHJvbGxlcik7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuQ29yZScsIFtcbiAgICAgLyoqXG4gICAgICAgKiBAbW9kdWxlIGR5bmFtaWNMb2NhbGVcbiAgICAgICAqXG4gICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAqIE1vZHVsZSB0byBiZSBhYmxlIHRvIGNoYW5nZSB0aGUgbG9jYWxlIGF0IGFuIGFuZ3VsYXJqcyBhcHBsaWNhdGlvblxuICAgICAgICovXG4gICAgICAndG1oLmR5bmFtaWNMb2NhbGUnLFxuICAgICAgLyoqXG4gICAgICAgKiBAbW9kdWxlIG5nUmVzb3VyY2VcbiAgICAgICAqXG4gICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAqIFRoZSBuZ1Jlc291cmNlIG1vZHVsZSBwcm92aWRlcyBpbnRlcmFjdGlvbiBzdXBwb3J0IHdpdGggUkVTVGZ1bCBzZXJ2aWNlcyB2aWEgdGhlICRyZXNvdXJjZSBzZXJ2aWNlLlxuICAgICAgICovXG4gICAgICAnbmdSZXNvdXJjZScsXG4gICAgICAvKipcbiAgICAgICAqIEBtb2R1bGUgdWkucm91dGVyXG4gICAgICAgKlxuICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgKiBBbmd1bGFyVUkgUm91dGVyIGlzIGEgcm91dGluZyBmcmFtZXdvcmssIHdoaWNoIGltcGxlbWVudHMgZmxleGlibGUgcm91dGluZyB3aXRoIG5lc3RlZCB2aWV3cyBpbiBBbmd1bGFySlMuXG4gICAgICAgKi9cbiAgICAgICd1aS5yb3V0ZXInLFxuICAgICAgLyoqXG4gICAgICAgKiBAbW9kdWxlIG5nQ29va2llc1xuICAgICAgICpcbiAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICogSmF2YVNjcmlwdCBwbGFpbiBjb29raWVzXG4gICAgICAgKi9cbiAgICAgICduZ0Nvb2tpZXMnLFxuICAgICAgLyoqXG4gICAgICAgKiBAbW9kdWxlIGFuZ3VsYXItdHJhbnNsYXRlXG4gICAgICAgKlxuICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgKiBhbmd1bGFyLXRyYW5zbGF0ZSBpcyBhbiBBbmd1bGFySlMgbW9kdWxlIHRoYXQgbWFrZXMgeW91ciBsaWZlIG11Y2ggZWFzaWVyIHdoZW5cbiAgICAgICAqIGl0IGNvbWVzIHRvIGkxOG4gYW5kIGwxMG4gaW5jbHVkaW5nIGxhenkgbG9hZGluZyBhbmQgcGx1cmFsaXphdGlvbi5cbiAgICAgICAqL1xuICAgICAgJ3Bhc2NhbHByZWNodC50cmFuc2xhdGUnLFxuICAgICAgLyoqXG4gICAgICAgKiBAbW9kdWxlIHVpLmJvb3RzdHJhcFxuICAgICAgICpcbiAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICogVHdpdHRlciBib290c3RyYXAgdWkgY29tcG9uZW5ldHNcbiAgICAgICAqL1xuICAgICAgJ3VpLmJvb3RzdHJhcCcsXG4gICAgICAvKipcbiAgICAgICAqIEBtb2R1bGUgdWkuc2xpbXNjcm9sbFxuICAgICAgICpcbiAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICogYW55IGNvbnRhaW5lciBzbW9vdGggc2Nyb2xsaW5nXG4gICAgICAgKi9cbiAgICAgICd1aS5zbGltc2Nyb2xsJyxcbiAgICAgIC8qKlxuICAgICAgICogQG1vZHVsZSBsb2dnZXJcbiAgICAgICAqXG4gICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAqIGNvbnNvbGUgYW55dGhpbmcgd2hpY2ggaXMgbmVlZCB0byBkZWJ1Z1xuICAgICAgICovXG4gICAgICAnbG9nZ2VyJyxcbiAgICAgICAvKipcbiAgICAgICAqIEBtb2R1bGUgYW5ndWxhck1vbWVudFxuICAgICAgICpcbiAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICogUGFyc2UsIHZhbGlkYXRlLCBtYW5pcHVsYXRlLCBhbmQgZGlzcGxheSBkYXRlcyBpbiBKYXZhU2NyaXB0LlxuICAgICAgICovXG4gICAgICAnYW5ndWxhck1vbWVudCcsXG4gICAgICAgLyoqXG4gICAgICAgKiBAbW9kdWxlIG5nQ2FjaGVCdXN0ZXJcbiAgICAgICAqXG4gICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAqIEZvciBodHRwIHJlcXVlc3QgY2FjaGluZ1xuICAgICAgICovXG4gICAgICAnbmdDYWNoZUJ1c3RlcicsXG4gICAgIFxuICAgICAgLyoqXG4gICAgICAgKiBAbW9kdWxlIG5nU2FuaXRpemVcbiAgICAgICAqXG4gICAgICAgKiBAZGVzY3JpcHRpb24gXG4gICAgICAgKiBUaGUgbmdTYW5pdGl6ZSBtb2R1bGUgcHJvdmlkZXMgZnVuY3Rpb25hbGl0eSB0byBzYW5pdGl6ZSBIVE1MLlxuICAgICAgICovXG4gICAgICAnbmdTYW5pdGl6ZScsXG4gICAgICAndG9hc3RlcicsXG4gICAgICAndWkuc2VsZWN0JyxcbiAgICAgICdCZWF1dHlDb2xsZWN0aXZlLmJMYXJhdmVsJyxcbiAgICAgICd1aUdtYXBnb29nbGUtbWFwcycsXG5cdCAgJ3NsaWNrJyxcblx0ICAnc2ltcGxlUGFnaW5hdGlvbicsXG5cdCAgJzcyMGtiLnNvY2lhbHNoYXJlJyxcbiAgICAgICAgJ2FuZ3VsYXJTcGlubmVyJ1xuICAgIF0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBvdmVydmlld1xuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuQ29yZS5Db25maWdcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuQ29yZVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQ29yZSBtb2R1bGUgc3RhdGUgY29uZmlndXJhdGlvbnNcbiAgICAgKlxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkNvcmUnKVxuICAgICAgICAuY29uZmlnKGNvcmVTdGF0ZUNvbmZpZyk7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBjb3JlU3RhdGVDb25maWcoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgQVBQX0NPTkZJRywgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgICAgICAgXG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvKipcbiAgICogQG5nZG9jIERpcmVjdGl2ZVxuICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLkRpcmVjdGl2ZS5uZ1NwaW5uZXJCYXJcbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkNvcmVcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIERpcmVjdGl2ZSBjb21tYW5kcyBzcGlubmVyIHNob3cgYW5kIGhpZGUgYmFzZWQgb24gc3RhdGUgY2hhbmdlIGV2ZW50c1xuICAgKlxuICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgKi9cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuQ29yZScpXG4gICAgLmRpcmVjdGl2ZSgnbmdTcGlubmVyQmFyJywgTmdTcGlubmVyRGlyZWN0aXZlKTtcblxuICAvKiBAbmdJbmplY3QgKi9cbiAgZnVuY3Rpb24gTmdTcGlubmVyRGlyZWN0aXZlKCRyb290U2NvcGUsICR0aW1lb3V0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAvLyBieSBkZWZ1bHQgaGlkZSB0aGUgc3Bpbm5lciBiYXJcbiAgICAgICAgJHJvb3RTY29wZS5sb2FkaW5nU3Bpbm5lciA9IGZhbHNlO1xuXG4gICAgICAgIC8vIGRpc3BsYXkgdGhlIHNwaW5uZXIgYmFyIHdoZW5ldmVyIHRoZSByb3V0ZSBjaGFuZ2VzKHRoZSBjb250ZW50IHBhcnQgc3RhcnRlZCBsb2FkaW5nKVxuICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuICAgICAgICAgICRyb290U2NvcGUubG9hZGluZ1NwaW5uZXIgPSB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBoaWRlIHRoZSBzcGlubmVyIGJhciBvbiByb3VudGUgY2hhbmdlIHN1Y2Nlc3MoYWZ0ZXIgdGhlIGNvbnRlbnQgbG9hZGVkKVxuICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRyb290U2NvcGUubG9hZGluZ1NwaW5uZXIgPSBmYWxzZTtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKS5yZW1vdmVDbGFzcygncGFnZS1vbi1sb2FkJyk7IC8vIHJlbW92ZSBwYWdlIGxvYWRpbmcgaW5kaWNhdG9yXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGhhbmRsZSBlcnJvcnNcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZU5vdEZvdW5kJywgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAvL2VsZW1lbnQuYWRkQ2xhc3MoJ2hpZGUnKTsgLy8gaGlkZSBzcGlubmVyIGJhclxuICAgICAgICAgICRyb290U2NvcGUubG9hZGluZ1NwaW5uZXIgPSBmYWxzZTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGhhbmRsZSBlcnJvcnNcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZUVycm9yJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgLy9lbGVtZW50LmFkZENsYXNzKCdoaWRlJyk7IC8vIGhpZGUgc3Bpbm5lciBiYXJcbiAgICAgICAgICAkcm9vdFNjb3BlLmxvYWRpbmdTcGlubmVyID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlQ2FuY2VsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgLy9lbGVtZW50LmFkZENsYXNzKCdoaWRlJyk7IC8vIGhpZGUgc3Bpbm5lciBiYXJcbiAgICAgICAgICAkcm9vdFNjb3BlLmxvYWRpbmdTcGlubmVyID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmdkb2MgU2VydmljZVxuICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLlNlcnZpY2UuU3Bpbm5lclxuICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuQ29yZVxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogU3Bpbm5lciBzZXJ2aWNlIGlzIHVzZWQgdG8gaGlkZS9zaG93IHNwaW5uaW5nIGxvYWRlclxuICAgKlxuICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgKi9cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuQ29yZScpXG4gICAgLmZhY3RvcnkoJ1NwaW5uZXInLCBTcGlubmVyU2VydmljZSk7XG4gIC8qIEBuZ0luamVjdCAqL1xuICBmdW5jdGlvbiBTcGlubmVyU2VydmljZSgkcm9vdFNjb3BlKSB7XG4gICAgLyoqXG4gICAgICogU3Bpbm5lciBjbGFzc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIFNwaW5uZXIoKSB7fVxuICAgIC8qKlxuICAgICAqIE1ldGhvZCB0byBzaG93IHNoaXBwZXJcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBTcGlubmVyLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oKSB7XG4gICAgICAkcm9vdFNjb3BlLmxvYWRpbmdTcGlubmVyID0gdHJ1ZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1ldGhvZCB0byBIaWRlIHNwaW5uZXJcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBTcGlubmVyLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAkcm9vdFNjb3BlLmxvYWRpbmdTcGlubmVyID0gZmFsc2U7XG4gICAgfTtcbiAgICByZXR1cm4gbmV3IFNwaW5uZXIoKTtcbiAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBvdmVydmlld1xuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuQ29yZS5Db25zdGFudC5FTlZcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuQ29yZVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogSG9sZHMgZW52b2lybWVudCByZWxhdGVkIHByb3BlcnRpZXNcbiAgICAgKlxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkNvcmUnKVxuICAgICAgICAuY29uc3RhbnQoJ0VOVicsICdkZXYnKTtcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5Db3JlJylcbiAgICAgICAgLmNvbnN0YW50KCdDU1JGX1RPS0VOJywgY3NyZl90b2tlbik7XG4gICAgLyoqXG4gICAgICogQG5nZG9jIG92ZXJ2aWV3XG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5Db3JlLkNvbnN0YW50LkFQUF9DT05GSUdcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuQ29yZVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQ29udGFpbnMgYWxsIHN0YXRpYyB1cmxzIGFuZCBjb25maWd1cmF0aW9uIGNvbnN0YW50cyB3aGljaCBhcmUgdXNlZCBpbiB3aG9sZSBhcHBsaWNhdGlvblxuICAgICAqXG4gICAgICogSWYgYW55dGhpbmcgbmVlZCB0byBhY2Nlc3MgaW4gdmlldyhIVE1MKSBmaWxlcyB0aGVuIGtlZXAgZXZlcnl0aGluZyBpbiB2aWV3XG4gICAgICogYW5kIGNhbiBiZSBhY2Nlc3NlZCBieSB7e1ZJRVdfQ09ORklHLmFzc2V0c319XG4gICAgICovXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkNvcmUnKVxuICAgICAgICAuY29uc3RhbnQoJ0FQUF9DT05GSUcnLCB7XG4gICAgICAgICAgICBtb2R1bGVzOiAnL2FwcHMvbW9kdWxlcycsXG4gICAgICAgICAgICBjb21wb25lbnRzOiAnL2FwcHMvY29tcG9uZW50cycsXG4gICAgICAgICAgICB3aWRnZXRzOiAnL2FwcHMvd2lkZ2V0cycsXG4gICAgICAgICAgICBzZXNzaW9uVGltZW91dDogMTgwMCxcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbkludGVydmFsOiA2MDAwMCxcbiAgICAgICAgICAgIGVuZFBvaW50OiAnJyxcbiAgICAgICAgICAgIEdPT0dMRToge1xuICAgICAgICAgICAgICAgIE1BUDoge1xuICAgICAgICAgICAgICAgICAgICBLRVk6ICdBSXphU3lEYkphZVV3MTY2VFM2MzBIZ3JWc1BUMTVMSjZ3djhpeEknXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBDQVBUQ0hBOiB7XG4gICAgICAgICAgICAgICAgICAgIFNJVEVfS0VZOiAnNkxjUjNnd1RBQUFBQUVPUERqc2NveXVKS0tLdkZnRkRZZlpQTmJuTScsXG4gICAgICAgICAgICAgICAgICAgIFNFQ1JFVF9LRVk6ICc2TGNSM2d3VEFBQUFBR3d4YVlIUnBxVnNfT3dVSzZnQU9KeUgxeTBRJyxcbiAgICAgICAgICAgICAgICAgICAgRU5BQkxFOiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGl0ZW1fcGVyX3BhZ2U6IDUsXG5cbiAgICAgICAgfSk7XG4gICAgLyoqXG4gICAgICogQW5ndWxhciBtb21lbnQgY29uZmlndXJhdGlvblxuICAgICAqL1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5Db3JlJykuY29uc3RhbnQoJ2FuZ3VsYXJNb21lbnRDb25maWcnLCB7XG4gICAgICAgICAgICB0aW1lem9uZTogJ0FzaWEva29sa2F0YSdcbiAgICAgICAgfSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2Mgb3ZlcnZpZXdcbiAgICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLkNvcmUuQ29uZmlnXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkNvcmVcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIENvbmZpZ3VhcnRpb24gd2hpbGUgcHJvdmlkZXIgYXJlIGNyZWF0ZWRcbiAgICAgKlxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkNvcmUnKVxuICAgICAgICAuY29uZmlnKENvcmVDb25maWd1cmF0aW9uKTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIENvcmVDb25maWd1cmF0aW9uKCRpbnRlcnBvbGF0ZVByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyLCAkdHJhbnNsYXRlUHJvdmlkZXIsIHRtaER5bmFtaWNMb2NhbGVQcm92aWRlciwgTG9nZ2VyUHJvdmlkZXIsIGh0dHBSZXF1ZXN0SW50ZXJjZXB0b3JDYWNoZUJ1c3RlclByb3ZpZGVyLCBBUFBfQ09ORklHLCAkcHJvdmlkZSwgRU5WLCB1aUdtYXBHb29nbGVNYXBBcGlQcm92aWRlcixcbiAgICAgICAgdXNTcGlubmVyQ29uZmlnUHJvdmlkZXIpIHtcblx0XHQkaW50ZXJwb2xhdGVQcm92aWRlci5zdGFydFN5bWJvbCgnPCUnKTtcbiAgICAgICAgJGludGVycG9sYXRlUHJvdmlkZXIuZW5kU3ltYm9sKCclPicpO1xuXG4gICAgICAgIC8vQ2FjaGUgZXZlcnl0aGluZyBleGNlcHQgcmVzdCBhcGkgcmVxdWVzdHNcbiAgICAgICAgaHR0cFJlcXVlc3RJbnRlcmNlcHRvckNhY2hlQnVzdGVyUHJvdmlkZXIuc2V0TWF0Y2hsaXN0KFsvLiphcGkuKi8sIC8uKnByb3RlY3RlZC4qLywgLy4qcmVnaXN0ZXJhY2NvdW50LiovXSwgdHJ1ZSk7XG5cbiAgICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnWFNSRkludGVyY2VwdG9yJyk7XG4gICAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ2Vycm9ySGFuZGxlckludGVyY2VwdG9yJyk7XG4gICAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ25vdGlmaWNhdGlvbkludGVyY2VwdG9yJyk7XG5cblxuICAgICAgICAvLyBJbml0aWFsaXplIGFuZ3VsYXItdHJhbnNsYXRlXG4gICAgICAgICR0cmFuc2xhdGVQcm92aWRlci51c2VMb2FkZXIoJyR0cmFuc2xhdGVQYXJ0aWFsTG9hZGVyJywge1xuICAgICAgICAgICAgdXJsVGVtcGxhdGU6ICdyZXNvdXJjZXMvaTE4bi97bGFuZ30ve3BhcnR9Lmpzb24nXG4gICAgICAgIH0pO1xuXG4gICAgICAgICR0cmFuc2xhdGVQcm92aWRlci5wcmVmZXJyZWRMYW5ndWFnZSgnZW4nKTtcbiAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnVzZUNvb2tpZVN0b3JhZ2UoKTtcblxuICAgICAgICB0bWhEeW5hbWljTG9jYWxlUHJvdmlkZXIubG9jYWxlTG9jYXRpb25QYXR0ZXJuKCdib3dlcl9jb21wb25lbnRzL2FuZ3VsYXItaTE4bi9hbmd1bGFyLWxvY2FsZV97e2xvY2FsZX19LmpzJyk7XG4gICAgICAgIHRtaER5bmFtaWNMb2NhbGVQcm92aWRlci51c2VDb29raWVTdG9yYWdlKCdOR19UUkFOU0xBVEVfTEFOR19LRVknKTtcbiAgICAgICAgaWYgKEVOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAkY29tcGlsZVByb3ZpZGVyLmRlYnVnSW5mb0VuYWJsZWQoZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgdWlHbWFwR29vZ2xlTWFwQXBpUHJvdmlkZXIuY29uZmlndXJlKHtcbiAgICAgICAgICAgIGtleTogQVBQX0NPTkZJRy5HT09HTEUuTUFQLktFWSxcbiAgICAgICAgICAgIHY6ICczLjIwJywgLy9kZWZhdWx0cyB0byBsYXRlc3QgMy5YIGFueWhvd1xuICAgICAgICAgICAgbGlicmFyaWVzOiAnd2VhdGhlcixnZW9tZXRyeSx2aXN1YWxpemF0aW9uJ1xuICAgICAgICB9KTtcbiAgICAgICAgdXNTcGlubmVyQ29uZmlnUHJvdmlkZXIuc2V0VGhlbWUoJ2dsb2JhbCcsIHtcbiAgICAgICAgICAgIGxpbmVzOiA5LFxuICAgICAgICAgICAgbGVuZ3RoOiAyOCxcbiAgICAgICAgICAgIHdpZHRoOiA4LFxuICAgICAgICAgICAgcmFkaXVzOiAxNyxcbiAgICAgICAgICAgIHNjYWxlOiAxLFxuICAgICAgICAgICAgY29ybmVyczogMSxcbiAgICAgICAgICAgIGNvbG9yOiAnIzU3Y2U0YicsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjM1LFxuICAgICAgICAgICAgcm90YXRlOiAyMyxcbiAgICAgICAgICAgIGRpcmVjdGlvbjogMSxcbiAgICAgICAgICAgIHNwZWVkOiAxLjEsXG4gICAgICAgICAgICB0cmFpbDogNjgsXG4gICAgICAgICAgICBmcHM6IDIwLFxuICAgICAgICAgICAgekluZGV4OiAyZTksXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdzcGlubmVyJyxcbiAgICAgICAgICAgIHRvcDogJzQ3JScsXG4gICAgICAgICAgICBsZWZ0OiAnNTAlJyxcbiAgICAgICAgICAgIHNoYWRvdzogdHJ1ZSxcbiAgICAgICAgICAgIGh3YWNjZWw6IHRydWUsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJ1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBvdmVydmlld1xuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuQ29yZS5SdW5cbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuQ29yZVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQ29yZSBtb2R1bGUgY29uZmlndXJhdGlvbiBpbiBydW4gYmxvY2tcbiAgICAgKiBIYW5kbGUgc3RhdGUgY2hhbmdlIGV2ZW50XG4gICAgICogQ2hlY2sgQXV0aGVudGljYXRpb24gYmVmb3JlIHN0YXRlIGdldCBjaGFuZ2VcbiAgICAgKlxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkNvcmUnKVxuICAgICAgICAucnVuKFtcbiAgICAgICAgICAgICckcm9vdFNjb3BlJyxcbiAgICAgICAgICAgICckd2luZG93JyxcbiAgICAgICAgICAgICckc3RhdGUnLFxuICAgICAgICAgICAgJyR0cmFuc2xhdGUnLFxuICAgICAgICAgICAgJ0xhbmd1YWdlJyxcbiAgICAgICAgICAgICdFTlYnLFxuICAgICAgICAgICAgJ0FQUF9DT05GSUcnLFxuICAgICAgICAgICAgJ1NwaW5uZXInLFxuICAgICAgICAgICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHdpbmRvdywgJHN0YXRlLCAkdHJhbnNsYXRlLCBMYW5ndWFnZSwgRU5WLCBBUFBfQ09ORklHLCBTcGlubmVyKSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogS2VlcCBhcHBsaWNhdGlvbiBjb25maWd1cmF0aW9uIGluIHJvb3RTY29wZVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuVklFV19DT05GSUcgPSBBUFBfQ09ORklHLnZpZXc7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogU2V0IGdsb2JhbCBpbmZvcm1hdGlvbiB0byAkcm9vdFNjb3BlXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5FTlYgPSBFTlY7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQ2FwdHVyZSAkc3RhdGVDaGFuZ2VTdGFydCBldmVudCBvbiAkcm9vdFNjb3BlXG4gICAgICAgICAgICAgICAgICogQXV0aGVudGljYXRlIHVzZXJcbiAgICAgICAgICAgICAgICAgKiBEZXRlY3QgY3VycmVudCBsYW5ndWFnZVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlLCB0b1N0YXRlUGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUudG9TdGF0ZSA9IHRvU3RhdGU7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUudG9TdGF0ZVBhcmFtcyA9IHRvU3RhdGVQYXJhbXM7XG4gICAgICAgICAgICAgICAgICAgIFNwaW5uZXIuc3RhcnQoKTtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogVXBkYXRlIGN1cnJlbnQgbGFuYWd1YWdlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBMYW5ndWFnZS5nZXRDdXJyZW50KCkudGhlbihmdW5jdGlvbihsYW5ndWFnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRyYW5zbGF0ZS51c2UobGFuZ3VhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQ2FwdHVyZSAkc3RhdGVDaGFuZ2VTdWNjZXNzIGV2ZW50IG9uICRyb290U2NvcGVcbiAgICAgICAgICAgICAgICAgKiBTZXQgcGFnZSB0aXRsZVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcblxuICAgICAgICAgICAgICAgICAgICBTcGlubmVyLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpdGxlS2V5ID0gJ2dsb2JhbC50aXRsZSc7XG4gICAgICAgICAgICAgICAgICAgIC8vU2V0IHBhZ2UgY2xhc3NcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kc3RhdGUgPSAkc3RhdGU7XG5cbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5wcmV2aW91c1N0YXRlTmFtZSA9IGZyb21TdGF0ZS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnByZXZpb3VzU3RhdGVQYXJhbXMgPSBmcm9tUGFyYW1zO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgJHRyYW5zbGF0ZSh0aXRsZUtleSkudGhlbihmdW5jdGlvbih0aXRsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hhbmdlIHdpbmRvdyB0aXRsZSB3aXRoIHRyYW5zbGF0ZWQgb25lXG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnRpdGxlID0gdGl0bGU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIF0pO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkNvcmUnKS5mYWN0b3J5KCdYU1JGSW50ZXJjZXB0b3InLCBbJ3V0aWxGYWN0b3J5JywgZnVuY3Rpb24odXRpbEZhY3RvcnkpIHtcbiAgICAgICAgICAgIHZhciBYU1JGSW50ZXJjZXB0b3IgPSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdDogZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IHV0aWxGYWN0b3J5LnJlYWRDb29raWUoJ1hTUkYtVE9LRU4nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuaGVhZGVyc1snWC1YU1JGLVRPS0VOJ10gPSB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gWFNSRkludGVyY2VwdG9yO1xuICAgICAgICB9XSk7XG5cbiAgICAvKipcbiAgICAgKiBvdmVycmlkZSBzcGlubmVyIG1ldGhvZHNcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuQ29yZScpLmZhY3RvcnkoJ1NwaW5uZXInLCBbJ3VzU3Bpbm5lclNlcnZpY2UnLCBmdW5jdGlvbih1c1NwaW5uZXJTZXJ2aWNlKSB7XG4gICAgICAgICAgICB2YXIgU3Bpbm5lciA9IHtcbiAgICAgICAgICAgICAgICBzdGFydDogZnVuY3Rpb24oc3Bpbm5lcklkKSB7XG4gICAgICAgICAgICAgICAgICAgIHNwaW5uZXJJZCA/IHVzU3Bpbm5lclNlcnZpY2Uuc3BpbihzcGlubmVySWQpIDogdXNTcGlubmVyU2VydmljZS5zcGluKCdnbG9iYWxfc3Bpbm5lcicpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RvcDogZnVuY3Rpb24oc3Bpbm5lcklkKSB7XG4gICAgICAgICAgICAgICAgICAgIHNwaW5uZXJJZCA/IHVzU3Bpbm5lclNlcnZpY2Uuc3RvcChzcGlubmVySWQpIDogdXNTcGlubmVyU2VydmljZS5zdG9wKCdnbG9iYWxfc3Bpbm5lcicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gU3Bpbm5lcjtcbiAgICAgICAgfV0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyoqXG4gICAgICogQG5nZG9jIGNvbmZpZ1xuICAgICAqXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50LmNvbmZpZy5BY2NvdW50U3RhdGVcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuQWNjb3VudFxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQ29uZmlndXJlIEFjY291bnQgbW9kdWxlIHJvdXRlc1xuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuQWNjb3VudCcpXG4gICAgICAgIC5jb25maWcoQWNjb3VudFN0YXRlKTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIEFjY291bnRTdGF0ZSgkc3RhdGVQcm92aWRlciwgQVBQX0NPTkZJRywgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhY2NvdW50Jywge1xuICAgICAgICAgICAgdXJsOiAnLycsXG4gICAgICAgICAgICBwYXJlbnQ6ICdkYXNoYm9hcmQnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnZGFzaGJvYXJkX3ZpZXdAZGFzaGJvYXJkJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogQVBQX0NPTkZJRy5tb2R1bGVzICsgJy9hY2NvdW50L2FjY291bnQtbGF5b3V0Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQWNjb3VudENvbnRyb2xsZXIgYXMgX2Fjb3VudEN0cmwnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnZGFzaGJvYXJkX3RvcF92aWV3QGRhc2hib2FyZCc6IHtcbiAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBBUFBfQ09ORklHLm1vZHVsZXMgKyAnL2FjY291bnQvYWNjb3VudC10b3AtbGF5b3V0Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FjY291bnRDb250cm9sbGVyIGFzIF9hY291bnRDdHJsJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgUmVzb2x2ZURhdGE6IFsnQWNjb3VudE1vZGVsJywgJyRxJywgZnVuY3Rpb24oQWNjb3VudE1vZGVsLCAkcSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgICAgICBBY2NvdW50TW9kZWwuZmluZCh7aWQ6bnVsbH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAndXNlcic6IHJlc3BvbnNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoe30pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyoqXG4gICAgICogQG5nZG9jIEZhY3RvcnlcbiAgICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLkFjY291bnQuRmFjdG9yeS5BY2NvdW50UmVzb3VyY2VcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuQWNjb3VudFxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogSW1wbGVtZW50cyBDVVJEIG9wZXJhdGlvbnNcbiAgICAgKlxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG4gICAgYW5ndWxhclxuICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50JylcbiAgICAgIC5mYWN0b3J5KCdBY2NvdW50UmVzb3VyY2UnLCBBY2NvdW50UmVzb3VyY2UpO1xuXG4gICAgLyogQG5nSW5qZWN0ICovXG4gICAgZnVuY3Rpb24gQWNjb3VudFJlc291cmNlKCRyZXNvdXJjZSwgQVBQX0NPTkZJRykge1xuICAgICAgLyogJHJlc291cmNlKEFQSV9VUkwsIERFRkFVTFRfUEFSQU1FVEVSUywgQ09ORklHVVJFX1lPVVJfQ1VTVE9NX01FVEhPRFMpKi9cbiAgICAgIHJldHVybiAkcmVzb3VyY2UoJ2FjY291bnQvOmlkJywge1xuICAgICAgICAgIHJlcXVlc3RUeXBlOiAnQHJlcXVlc3RUeXBlJyxcbiAgICAgICAgICBpZDogJ0BpZCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgZmluZDoge1xuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgdXJsOiAnZ2V0dXNlcicsXG4gICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICBpZDogJ0BpZCcsXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmaW5kSm9iOiB7XG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICB1cmw6ICdnZXRqb2JzJyxcbiAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgIGlkOiAnQGlkJyxcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNhdmU6IHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgIHJlcXVlc3RUeXBlOiAnYWRkJyxcbiAgICAgICAgICAgIGlkOiAnQGlkJyxcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHVwZGF0ZToge1xuICAgICAgICAgIG1ldGhvZDogJ1BVVCdcbiAgICAgICAgfSxcbiAgICAgICAgdXBkYXRlYnVzaW5lc3M6IHtcbiAgICAgICAgICB1cmw6J2J1c2luZXNzLzppZCcsXG4gICAgICAgICAgbWV0aG9kOiAnUFVUJ1xuICAgICAgICB9LFxuICAgICAgICB1cGRhdGVJbmRpdmlkdWFsSW5mbzoge1xuICAgICAgICAgIHVybDondXBkYXRlaW5kaXZpZHVhbGluZm8vOmlkJyxcbiAgICAgICAgICBtZXRob2Q6ICdQVVQnXG4gICAgICAgIH0sXG4gICAgICAgIGdldEpvYlNlZWtlcnM6IHtcbiAgICAgICAgICB1cmw6J2pvYnNlZWtlcnMnLFxuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgaXNBcnJheTp0cnVlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybUdldFJlc3BvbnNlKGRhdGEsIGhlYWRlcnNHZXR0ZXIpIHtcbiAgICAgICAgdmFyIF9yZXNwb25zZSA9IHt9O1xuICAgICAgICBfcmVzcG9uc2UuZGF0YSA9IGFuZ3VsYXIuZnJvbUpzb24oZGF0YSk7XG4gICAgICAgIHJldHVybiBhbmd1bGFyLmZyb21Kc29uKF9yZXNwb25zZSk7XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyoqXG4gICAgICogQG5nZG9jIFNlcnZpY2VcbiAgICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLkFjY291bnQuU2VydmljZS5BY2NvdW50TW9kZWxcbiAgICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuQWNjb3VudFxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICpcbiAgICAgKiBEYXRhIG1vZGVsIGZvciBqb2J0YXNrIG1vZHVsZVxuICAgICAqIEltcGxlbWVuZXRzIENVUkQgb3BlcmF0aW9uXG4gICAgICpcbiAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAqL1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50JylcbiAgICAgICAgLnNlcnZpY2UoJ0FjY291bnRNb2RlbCcsIEFjY291bnRNb2RlbCk7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBBY2NvdW50TW9kZWwoQWNjb3VudFJlc291cmNlKSB7XG4gICAgICAgIHZhciBtb2RlbCA9IHRoaXM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBbam9iTGlzdCBkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQFRydWUge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgbW9kZWwuZGFzaGJvYXJkTGlzdCA9IFtdO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBbZGFzaGJvYXJkQWN0aXZpdGllcyBkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQFRydWUge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgbW9kZWwuZGFzaGJvYXJkQWN0aXZpdGllcyA9IFtdO1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCBkYXNoYm9hcmRcbiAgICAgICAgICogQHBhcmFtIGlkIGlkXG4gICAgICAgICAqIEByZXR1cm4gZGFzaGJvYXJkXG4gICAgICAgICAqL1xuICAgICAgICBtb2RlbC5maW5kID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBBY2NvdW50UmVzb3VyY2UuZmluZChpZCkuJHByb21pc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCBkYXNoYm9hcmRcbiAgICAgICAgICogQHBhcmFtIGlkIGlkXG4gICAgICAgICAqIEByZXR1cm4gZGFzaGJvYXJkXG4gICAgICAgICAqL1xuICAgICAgICBtb2RlbC5maW5kSm9iID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBBY2NvdW50UmVzb3VyY2UuZmluZEpvYihpZCkuJHByb21pc2U7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBbZmluZEFsbEFjdGl2aXRpZXMgZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEBtZXRob2QgZmluZEFsbEFjdGl2aXRpZXNcbiAgICAgICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSAgICAgICAgICBwYXJhbXMgW2Rlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqL1xuICAgICAgICBtb2RlbC5maW5kQWxsQWN0aXZpdGllcyA9IGZ1bmN0aW9uKHBhcmFtcywgc3VjY2VzcywgZmFpbCkge1xuICAgICAgICAgICAgcmV0dXJuIEFjY291bnRSZXNvdXJjZS5maW5kQWxsQWN0aXZpdGllcyhwYXJhbXMsIHN1Y2Nlc3MsIGZhaWwpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDcmVhdGUgYSBuZXcgZGFzaGJvYXJkXG4gICAgICAgICAqIEBwYXJhbSBkYXNoYm9hcmQgZGFzaGJvYXJkXG4gICAgICAgICAqIEByZXR1cm4gZGFzaGJvYXJkIHNhdmVkXG4gICAgICAgICAqL1xuICAgICAgICBtb2RlbC5zYXZlID0gZnVuY3Rpb24oZGFzaGJvYXJkKSB7XG4gICAgICAgICAgICByZXR1cm4gQWNjb3VudFJlc291cmNlLnNhdmUoZGFzaGJvYXJkKS4kcHJvbWlzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlIGRhc2hib2FyZFxuICAgICAgICAgKiBAcGFyYW0gZGFzaGJvYXJkIGRhc2hib2FyZFxuICAgICAgICAgKiBAcmV0dXJuIGRhc2hib2FyZCBzYXZlZFxuICAgICAgICAgKi9cbiAgICAgICAgbW9kZWwudXBkYXRlID0gZnVuY3Rpb24ocGFyYW1zLCBkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gQWNjb3VudFJlc291cmNlLnVwZGF0ZShwYXJhbXMsZGF0YSkuJHByb21pc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwZGF0ZSBidXNpbmVzcyBkZXRhaWxzXG4gICAgICAgICAqIEBwYXJhbSB7e2Rhc2hib2FyZCBkYXNoYm9hcmR9fVxuICAgICAgICAgKiBAcmV0dXJuIGRhc2hib2FyZCBzYXZlZFxuICAgICAgICAgKi9cbiAgICAgICAgbW9kZWwudXBkYXRlYnVzaW5lc3MgPSBmdW5jdGlvbihwYXJhbXMsIGRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBBY2NvdW50UmVzb3VyY2UudXBkYXRlYnVzaW5lc3MocGFyYW1zLGRhdGEpLiRwcm9taXNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGUgam9icyBkZXRhaWxzXG4gICAgICAgICAqIEBwYXJhbSB7e2Rhc2hib2FyZCBkYXNoYm9hcmR9fVxuICAgICAgICAgKiBAcmV0dXJuIGRhc2hib2FyZCBzYXZlZFxuICAgICAgICAgKi9cbiAgICAgICAgbW9kZWwudXBkYXRlSW5kaXZpZHVhbEluZm8gPSBmdW5jdGlvbihwYXJhbXMsIGRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBBY2NvdW50UmVzb3VyY2UudXBkYXRlSW5kaXZpZHVhbEluZm8ocGFyYW1zLGRhdGEpLiRwcm9taXNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWxldGUgZGFzaGJvYXJkXG4gICAgICAgICAqIEBwYXJhbSBpZCBpZFxuICAgICAgICAgKi9cbiAgICAgICAgbW9kZWwuZGVsZXRlID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBBY2NvdW50UmVzb3VyY2UuZGVsZXRlKGlkKS4kcHJvbWlzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogc2VhcmNoIGpvYiBzZWVrZXJzXG4gICAgICAgICAqIEBwYXJhbSB7e2Rhc2hib2FyZCBkYXNoYm9hcmR9fVxuICAgICAgICAgKiBAcmV0dXJuIGRhc2hib2FyZCBzYXZlZFxuICAgICAgICAgKi9cbiAgICAgICAgbW9kZWwuZ2V0Sm9iU2Vla2VycyA9IGZ1bmN0aW9uKHBhcmFtcywgc3VjY2VzcywgZmFpbCkge1xuICAgICAgICAgICAgcmV0dXJuIEFjY291bnRSZXNvdXJjZS5nZXRKb2JTZWVrZXJzKHBhcmFtcywgc3VjY2VzcywgZmFpbCkuJHByb21pc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgXG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyoqXG4gICAgICogQG5nZG9jIEZhY3RvcnlcbiAgICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLkFjY291bnQuRmFjdG9yeS5BY2NvdW50RmFjdG9yeVxuICAgICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50XG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKlxuICAgICAqIEFjY291bnRGYWN0b3J5IGhhbmRsZXMgYnVzaW5lc3MgbG9naWMgYW5kIGNvbW1vbiBmZWF0dXJlc1xuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuQWNjb3VudCcpXG4gICAgICAgIC5zZXJ2aWNlKCdBY2NvdW50RmFjdG9yeScsIEFjY291bnRGYWN0b3J5KTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIEFjY291bnRGYWN0b3J5KCkge1xuICAgICAgICB2YXIgZmFjdG9yeSA9IHt9O1xuXG4gICAgICAgIGZhY3RvcnkuZ2V0RGVmYXVsdEJ1c2luZXNzSG91cnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbW9uZGF5OiB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW46IG1vbWVudC51dGMoKS50b0RhdGUoKSxcbiAgICAgICAgICAgICAgICAgICAgY2xvc2U6IG1vbWVudCgpLmFkZCg3LCAnaG91cnMnKS51dGMoKS50b0RhdGUoKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdHVlc2RheToge1xuICAgICAgICAgICAgICAgICAgICBvcGVuOiBtb21lbnQudXRjKCkudG9EYXRlKCksXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlOiBtb21lbnQoKS5hZGQoNywgJ2hvdXJzJykudXRjKCkudG9EYXRlKClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHdlZG5lc2RheToge1xuICAgICAgICAgICAgICAgICAgICBvcGVuOiBtb21lbnQudXRjKCkudG9EYXRlKCksXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlOiBtb21lbnQoKS5hZGQoNywgJ2hvdXJzJykudXRjKCkudG9EYXRlKClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRodXJzZGF5OiB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW46IG1vbWVudC51dGMoKS50b0RhdGUoKSxcbiAgICAgICAgICAgICAgICAgICAgY2xvc2U6IG1vbWVudCgpLmFkZCg3LCAnaG91cnMnKS51dGMoKS50b0RhdGUoKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnJpZGF5OiB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW46IG1vbWVudC51dGMoKS50b0RhdGUoKSxcbiAgICAgICAgICAgICAgICAgICAgY2xvc2U6IG1vbWVudCgpLmFkZCg3LCAnaG91cnMnKS51dGMoKS50b0RhdGUoKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2F0dXJkYXk6IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbjogbW9tZW50LnV0YygpLnRvRGF0ZSgpLFxuICAgICAgICAgICAgICAgICAgICBjbG9zZTogbW9tZW50KCkuYWRkKDcsICdob3VycycpLnV0YygpLnRvRGF0ZSgpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdW5kYXk6IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbjogbW9tZW50LnV0YygpLnRvRGF0ZSgpLFxuICAgICAgICAgICAgICAgICAgICBjbG9zZTogbW9tZW50KCkuYWRkKDcsICdob3VycycpLnV0YygpLnRvRGF0ZSgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgICAgICBmYWN0b3J5LmdldERlZmF1bHRCdXNpbmVzc0RheXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgICAgIGRheTogJ21vbmRheScsXG4gICAgICAgICAgICAgICAgaXNPcGVuOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpc0Nsb3NlOiBmYWxzZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGRheTogJ3R1ZXNkYXknLFxuICAgICAgICAgICAgICAgIGlzT3BlbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXNDbG9zZTogZmFsc2VcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBkYXk6ICd3ZWRuZXNkYXknLFxuICAgICAgICAgICAgICAgIGlzT3BlbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXNDbG9zZTogZmFsc2VcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBkYXk6ICd0aHVyc2RheScsXG4gICAgICAgICAgICAgICAgaXNPcGVuOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpc0Nsb3NlOiBmYWxzZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGRheTogJ2ZyaWRheScsXG4gICAgICAgICAgICAgICAgaXNPcGVuOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpc0Nsb3NlOiBmYWxzZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGRheTogJ3NhdHVyZGF5JyxcbiAgICAgICAgICAgICAgICBpc09wZW46IGZhbHNlLFxuICAgICAgICAgICAgICAgIGlzQ2xvc2U6IGZhbHNlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgZGF5OiAnc3VuZGF5JyxcbiAgICAgICAgICAgICAgICBpc09wZW46IGZhbHNlLFxuICAgICAgICAgICAgICAgIGlzQ2xvc2U6IGZhbHNlXG4gICAgICAgICAgICB9XTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgQ29udHJvbGxlclxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuQWNjb3VudC5Db250cm9sbGVyLkFjY291bnRDb250cm9sbGVyXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkFjY291bnRcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEFjY291bnRDb250cm9sbGVyIGlzIHJlc3BvbnNpYmxlIG1hbmFnZSBhY2NvdW50IGFjdGl2aXRpZXNcbiAgICAgKlxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBmdW5jdGlvbiBBY2NvdW50Q29udHJvbGxlcigkc3RhdGUsUmVzb2x2ZURhdGEsQWNjb3VudE1vZGVsLHRvYXN0ZXIpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBpbml0KCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGluaXRpYWxpemUgcHJvcGVydGllc1xuICAgICAgICAgKiBcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG5cbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgIHNlbGYudXNlclJvbGUgPSBSZXNvbHZlRGF0YS51c2VyLnJvbGVzWzBdLm5hbWU7XG4gICAgICAgICAgICBzZWxmLmlzQXVzdHJhbGlhbiA9IChSZXNvbHZlRGF0YS51c2VyLnVzZXJfaW5mbyAmJiBSZXNvbHZlRGF0YS51c2VyLnVzZXJfaW5mby5pc19hdXN0cmFsaWFuPT0neWVzJykgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICBzZWxmLmxvb2tpbmdKb2IgPSAoUmVzb2x2ZURhdGEudXNlci51c2VyX2luZm8gJiYgUmVzb2x2ZURhdGEudXNlci51c2VyX2luZm8ubG9va2luZ19qb2I9PSd5ZXMnKSA/IHRydWUgOiBmYWxzZTsgXG4gICAgICAgICAgICBzZWxmLnVzZXJQcm9maWxlcGljID0gKFJlc29sdmVEYXRhLnVzZXIucHJvZmlsZXBpYykgPyBSZXNvbHZlRGF0YS51c2VyLnByb2ZpbGVwaWMucGF0aCArIFJlc29sdmVEYXRhLnVzZXIucHJvZmlsZXBpYy5uYW1lIDogJ2ltYWdlcy91c2VyX3BpYy5qcGcnOyBcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBzYXZlIHVzZXIgbG9va2luZyBmb3Igam9iIG9yIG5vdFxuICAgICAgICAgKiBcbiAgICAgICAgICogQHBhcmFtcyB7ZmxhZyB8IHt0cnVlIHwgZmFsc2V9fVxuICAgICAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAgICAgKi9cblxuICAgICAgICBzZWxmLmxvb2tpbmdXb3JrID0gZnVuY3Rpb24oZmxhZyl7XG4gICAgICAgICAgICBzZWxmLmxvb2tpbmdKb2IgPSBmbGFnO1xuICAgICAgICAgICAgQWNjb3VudE1vZGVsLnVwZGF0ZUluZGl2aWR1YWxJbmZvKFxuICAgICAgICAgICAgICAgIHsnaWQnOlJlc29sdmVEYXRhLnVzZXIuaWR9LFxuICAgICAgICAgICAgICAgIHsnbmFtZSc6UmVzb2x2ZURhdGEudXNlci5uYW1lLCdsb29raW5nSm9iJzpzZWxmLmxvb2tpbmdKb2IsJ2lzQXVzdHJhbGlhbic6c2VsZi5pc0F1c3RyYWxpYW59KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHN1Y2Nlc3NSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICB0b2FzdGVyLnBvcCgnc3VjY2VzcycsIFwiRGV0YWlsIFNhdmVcIiwgXCJEYXRhaWxzIGhhcyBiZWVuIHVwZGF0ZWQuXCIpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1NhdmluZyBEZXRhaWxzOicsIGVycm9yUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICAvKipcbiAgICAgICAgICogc2F2ZSB1c2VyIGlzIGF1c3RyYWxpYW4gY2l0aXplbiBvciBub3RcbiAgICAgICAgICogXG4gICAgICAgICAqIEBwYXJhbXMge2ZsYWcgfCB7dHJ1ZSB8IGZhbHNlfX1cbiAgICAgICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgICAgICovXG5cbiAgICAgICAgc2VsZi5BdXN0cmFsaWFuID0gZnVuY3Rpb24oZmxhZyl7XG4gICAgICAgICAgIHNlbGYuaXNBdXN0cmFsaWFuID0gZmxhZzsgXG4gICAgICAgICAgIEFjY291bnRNb2RlbC51cGRhdGVJbmRpdmlkdWFsSW5mbyhcbiAgICAgICAgICAgICAgICB7J2lkJzpSZXNvbHZlRGF0YS51c2VyLmlkfSxcbiAgICAgICAgICAgICAgICB7J25hbWUnOlJlc29sdmVEYXRhLnVzZXIubmFtZSwnbG9va2luZ0pvYic6c2VsZi5sb29raW5nSm9iLCdpc0F1c3RyYWxpYW4nOnNlbGYuaXNBdXN0cmFsaWFufSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihzdWNjZXNzUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3Rlci5wb3AoJ3N1Y2Nlc3MnLCBcIkRldGFpbCBTYXZlXCIsIFwiRGF0YWlscyBoYXMgYmVlbiB1cGRhdGVkLlwiKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvclJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ1NhdmluZyBEZXRhaWxzOicsIGVycm9yUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBjaGFuZ2UgdXNlciBwcm9maWxlIHBpY1xuICAgICAgICAgKiBcbiAgICAgICAgICogQHBhcmFtcyB7aW1hZ2VzIGNodW5rc31cbiAgICAgICAgICogQHJldHVybiB7b2JqZWN0fVxuICAgICAgICAgKi9cblxuICAgICAgICBzZWxmLmZsb3dDb25maWcgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnL3VwbG9hZHByb2ZpbGVwaWMnLFxuICAgICAgICAgICAgICAgIHBlcm1hbmVudEVycm9yczogWzQwNCwgNTAwLCA1MDFdLFxuICAgICAgICAgICAgICAgIG1heENodW5rUmV0cmllczogMSxcbiAgICAgICAgICAgICAgICBjaHVua1JldHJ5SW50ZXJ2YWw6IDUwMDAsXG4gICAgICAgICAgICAgICAgc2ltdWx0YW5lb3VzVXBsb2FkczogMSxcbiAgICAgICAgICAgICAgICBzaW5nbGVGaWxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ1gtQ1NSRi1UT0tFTic6IGNzcmZfdG9rZW5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHF1ZXJ5OiBmdW5jdGlvbihmbG93RmlsZSwgZmxvd0NodW5rKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGZvciBldmVyeSByZXF1ZXN0XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogUmVzb2x2ZURhdGEudXNlci5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogJ2Zsb3dfcXVlcnknXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBjaGFuZ2UgcHJvZmlsZSBwaWMgaWYgdXBsb2FkIHN1Y2Nlc3NmdWxseVxuICAgICAgICAgKiBcbiAgICAgICAgICogQHBhcmFtcyB7T2plY3R9XG4gICAgICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBzZWxmLmZpbGVVcGxvYWRTdWNjZXNzID0gZnVuY3Rpb24oJGZpbGUsICRyZXMpIHtcbiAgICAgICAgICAgIHZhciBvYmogPSBKU09OLnBhcnNlKCRyZXMpO1xuICAgICAgICAgICAgc2VsZi51c2VyUHJvZmlsZXBpYyA9IG9iai5wYXRoK29iai5uYW1lO1xuICAgICAgICB9O1xuXG4gICAgfVxuICAgIC8vZW5kIG9mIGNvbnRyb2xsZXJcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5BY2NvdW50JylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0FjY291bnRDb250cm9sbGVyJywgQWNjb3VudENvbnRyb2xsZXIpO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyoqXG4gICAgICogQG5nZG9jIFByb3ZpZGVyXG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5Db3JlLlByb3ZpZGVyLkFsZXJ0U2VydmljZVxuICAgICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5Db3JlXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBUaGlzIHByb3ZpZGVyIHdpbGwgYmUgdXNlZCB0byBzZXQgdGhlIHNldHRpbmcgb2YgYWxlcnQgbWVzc2FnZXNcbiAgICAgKlxuICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICovXG4gICBhbmd1bGFyLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5Db3JlJykucHJvdmlkZXIoJ0FsZXJ0U2VydmljZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy50b2FzdCA9IGZhbHNlO1xuXG4gICAgICAgICAgICB0aGlzLiRnZXQgPSBbJyR0aW1lb3V0JywgJyRzY2UnLCAnJHRyYW5zbGF0ZScsIGZ1bmN0aW9uKCR0aW1lb3V0LCAkc2NlLCAkdHJhbnNsYXRlKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgZXhwb3J0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhY3Rvcnk6IGZhY3RvcnksXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1RvYXN0OiBpc1RvYXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkOiBhZGRBbGVydCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlQWxlcnQ6IGNsb3NlQWxlcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZUFsZXJ0QnlJbmRleDogY2xvc2VBbGVydEJ5SW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhcjogY2xlYXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXQ6IGdldCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHN1Y2Nlc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZvOiBpbmZvLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2FybmluZzogd2FybmluZ1xuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ID0gdGhpcy50b2FzdCxcbiAgICAgICAgICAgICAgICAgICAgYWxlcnRJZCA9IDAsIC8vIHVuaXF1ZSBpZCBmb3IgZWFjaCBhbGVydC4gU3RhcnRzIGZyb20gMC5cbiAgICAgICAgICAgICAgICAgICAgYWxlcnRzID0gW10sXG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQgPSA1MDAwOyAvLyBkZWZhdWx0IHRpbWVvdXRcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGlzVG9hc3QoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b2FzdDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnRzID0gW107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxlcnRzO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MobXNnLCBwYXJhbXMsIHBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZzogbXNnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3Q6IHRvYXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGVycm9yKG1zZywgcGFyYW1zLCBwb3NpdGlvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hZGQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJkYW5nZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZzogbXNnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3Q6IHRvYXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHdhcm5pbmcobXNnLCBwYXJhbXMsIHBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIndhcm5pbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZzogbXNnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3Q6IHRvYXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGluZm8obXNnLCBwYXJhbXMsIHBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImluZm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zZzogbXNnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3Q6IHRvYXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGZhY3RvcnkoYWxlcnRPcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhbGVydCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGFsZXJ0T3B0aW9ucy50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbXNnOiAkc2NlLnRydXN0QXNIdG1sKGFsZXJ0T3B0aW9ucy5tc2cpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGFsZXJ0T3B0aW9ucy5hbGVydElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dDogYWxlcnRPcHRpb25zLnRpbWVvdXQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2FzdDogYWxlcnRPcHRpb25zLnRvYXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGFsZXJ0T3B0aW9ucy5wb3NpdGlvbiA/IGFsZXJ0T3B0aW9ucy5wb3NpdGlvbiA6ICd0b3AgcmlnaHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGVkOiBhbGVydE9wdGlvbnMuc2NvcGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2U6IGZ1bmN0aW9uKGFsZXJ0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBleHBvcnRzLmNsb3NlQWxlcnQodGhpcy5pZCwgYWxlcnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWFsZXJ0LnNjb3BlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnRzLnB1c2goYWxlcnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGVydDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBhZGRBbGVydChhbGVydE9wdGlvbnMsIGV4dEFsZXJ0cykge1xuICAgICAgICAgICAgICAgICAgICBhbGVydE9wdGlvbnMuYWxlcnRJZCA9IGFsZXJ0SWQrKztcbiAgICAgICAgICAgICAgICAgICAgYWxlcnRPcHRpb25zLm1zZyA9ICR0cmFuc2xhdGUuaW5zdGFudChhbGVydE9wdGlvbnMubXNnLCBhbGVydE9wdGlvbnMucGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWxlcnQgPSB0aGlzLmZhY3RvcnkoYWxlcnRPcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFsZXJ0T3B0aW9ucy50aW1lb3V0ICYmIGFsZXJ0T3B0aW9ucy50aW1lb3V0ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5jbG9zZUFsZXJ0KGFsZXJ0T3B0aW9ucy5hbGVydElkLCBleHRBbGVydHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgYWxlcnRPcHRpb25zLnRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGVydDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBjbG9zZUFsZXJ0KGlkLCBleHRBbGVydHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNBbGVydHMgPSBleHRBbGVydHMgPyBleHRBbGVydHMgOiBhbGVydHM7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb3NlQWxlcnRCeUluZGV4KHRoaXNBbGVydHMubWFwKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlLmlkO1xuICAgICAgICAgICAgICAgICAgICB9KS5pbmRleE9mKGlkKSwgdGhpc0FsZXJ0cyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gY2xvc2VBbGVydEJ5SW5kZXgoaW5kZXgsIHRoaXNBbGVydHMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNBbGVydHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZXhwb3J0cztcbiAgICAgICAgICAgIH1dO1xuXG4gICAgICAgICAgICB0aGlzLnNob3dBc1RvYXN0ID0gZnVuY3Rpb24oaXNUb2FzdCkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9hc3QgPSBpc1RvYXN0O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBEaXJlY3RpdmVcbiAgICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLkRpcmVjdGl2ZS5BbGVydFxuICAgICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogVGhpcyBkaXJlY3RpdmUgaXMgdG8gc2hvdyB0aGUgYWxlcnQgYm94IGFuZCBpbmxpbmUgYWxlcnRzXG4gICAgICpcbiAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAqL1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnYWxlcnQnLCBbJ0FsZXJ0U2VydmljZScsIGZ1bmN0aW9uKEFsZXJ0U2VydmljZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImFsZXJ0c1wiIG5nLWNsb2FrPVwiXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IG5nLXJlcGVhdD1cImFsZXJ0IGluIGFsZXJ0c1wiIG5nLWNsYXNzPVwiW2FsZXJ0LnBvc2l0aW9uLCB7XFwndG9hc3RcXCc6IGFsZXJ0LnRvYXN0fV1cIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzx1aWItYWxlcnQgbmctY2xvYWs9XCJcIiB0eXBlPVwie3thbGVydC50eXBlfX1cIiBjbG9zZT1cImFsZXJ0LmNsb3NlKClcIj48cHJlPnt7IGFsZXJ0Lm1zZyB9fTwvcHJlPjwvdWliLWFsZXJ0PicgK1xuICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJyxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRzID0gQWxlcnRTZXJ2aWNlLmdldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfV0pO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnYWxlcnRFcnJvcicsIFsnQWxlcnRTZXJ2aWNlJywgJyRyb290U2NvcGUnLCAnJHRyYW5zbGF0ZScsIGZ1bmN0aW9uKEFsZXJ0U2VydmljZSwgJHJvb3RTY29wZSwgJHRyYW5zbGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImFsZXJ0c1wiIG5nLWNsb2FrPVwiXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IG5nLXJlcGVhdD1cImFsZXJ0IGluIGFsZXJ0c1wiIG5nLWNsYXNzPVwiW2FsZXJ0LnBvc2l0aW9uLCB7XFwndG9hc3RcXCc6IGFsZXJ0LnRvYXN0fV1cIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzx1aWItYWxlcnQgbmctY2xvYWs9XCJcIiB0eXBlPVwie3thbGVydC50eXBlfX1cIiBjbG9zZT1cImFsZXJ0LmNsb3NlKGFsZXJ0cylcIj48cHJlPnt7IGFsZXJ0Lm1zZyB9fTwvcHJlPjwvdWliLWFsZXJ0PicgK1xuICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJyxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oJHNjb3BlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5hbGVydHMgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNsZWFuSHR0cEVycm9yTGlzdGVuZXIgPSAkcm9vdFNjb3BlLiRvbignQmVhdXR5Q29sbGVjdGl2ZS5odHRwRXJyb3InLCBmdW5jdGlvbihldmVudCwgaHR0cFJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChodHRwUmVzcG9uc2Uuc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbm5lY3Rpb24gcmVmdXNlZCwgc2VydmVyIG5vdCByZWFjaGFibGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkRXJyb3JBbGVydChcIlNlcnZlciBub3QgcmVhY2hhYmxlXCIsICdlcnJvci5zZXJ2ZXJOb3RSZWFjaGFibGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGh0dHBSZXNwb25zZS5kYXRhICYmIGh0dHBSZXNwb25zZS5kYXRhLmZpZWxkRXJyb3JzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGh0dHBSZXNwb25zZS5kYXRhLmZpZWxkRXJyb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZEVycm9yID0gaHR0cFJlc3BvbnNlLmRhdGEuZmllbGRFcnJvcnNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnZlcnQgJ3NvbWV0aGluZ1sxNF0ub3RoZXJbNF0uaWQnIHRvICdzb21ldGhpbmdbXS5vdGhlcltdLmlkJyBzbyB0cmFuc2xhdGlvbnMgY2FuIGJlIHdyaXR0ZW4gdG8gaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnZlcnRlZEZpZWxkID0gZmllbGRFcnJvci5maWVsZC5yZXBsYWNlKC9cXFtcXGQqXFxdL2csIFwiW11cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZE5hbWUgPSAkdHJhbnNsYXRlLmluc3RhbnQoJ0JlYXV0eUNvbGxlY3RpdmUuJyArIGZpZWxkRXJyb3Iub2JqZWN0TmFtZSArICcuJyArIGNvbnZlcnRlZEZpZWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkRXJyb3JBbGVydCgnRmllbGQgJyArIGZpZWxkTmFtZSArICcgY2Fubm90IGJlIGVtcHR5JywgJ2Vycm9yLicgKyBmaWVsZEVycm9yLm1lc3NhZ2UsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkTmFtZTogZmllbGROYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaHR0cFJlc3BvbnNlLmRhdGEgJiYgaHR0cFJlc3BvbnNlLmRhdGEubWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZEVycm9yQWxlcnQoaHR0cFJlc3BvbnNlLmRhdGEubWVzc2FnZSwgaHR0cFJlc3BvbnNlLmRhdGEubWVzc2FnZSwgaHR0cFJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRFcnJvckFsZXJ0KGh0dHBSZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaHR0cFJlc3BvbnNlLmRhdGEgJiYgaHR0cFJlc3BvbnNlLmRhdGEubWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZEVycm9yQWxlcnQoaHR0cFJlc3BvbnNlLmRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZEVycm9yQWxlcnQoSlNPTi5zdHJpbmdpZnkoaHR0cFJlc3BvbnNlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNsZWFuSHR0cEVycm9yTGlzdGVuZXIgIT09IHVuZGVmaW5lZCAmJiBjbGVhbkh0dHBFcnJvckxpc3RlbmVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFuSHR0cEVycm9yTGlzdGVuZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWRkRXJyb3JBbGVydCA9IGZ1bmN0aW9uKG1lc3NhZ2UsIGtleSwgZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IGtleSAmJiBrZXkgIT0gbnVsbCA/IGtleSA6IG1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0cy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBbGVydFNlcnZpY2UuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImRhbmdlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZzoga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtczogZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiA1MDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0OiBBbGVydFNlcnZpY2UuaXNUb2FzdCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5hbGVydHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgIH1dKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBGYWN0b3J5XG4gICAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5Db3JlLm1haW4uRmFjdG9yeS51dGlsRmFjdG9yeVxuICAgICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5Db3JlXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiB1dGlsIGZhY3RvcnkgY29udGFpbnMgYWxsIGdlbmVyaWMgbWV0aG9kc1xuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuQ29yZScpXG4gICAgICAgIC5mYWN0b3J5KCd1dGlsRmFjdG9yeScsIHV0aWxGYWN0b3J5KVxuICAgICAgICAuZmlsdGVyKCdwYXJzZURhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBEYXRlLnBhcnNlKHZhbHVlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pOztcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGZ1bmN0aW9uIHV0aWxGYWN0b3J5KCkge1xuICAgICAgICB2YXIgdXRpbCA9IHt9LFxuICAgICAgICAgICAgYmdDb2xvcnM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBbZ2V0QmdDb2xvcnMgZGVzY3JpcHRpb25dXG4gICAgICAgICAqIEBtZXRob2QgZ2V0QmdDb2xvcnNcbiAgICAgICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSAgICBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqL1xuICAgICAgICB1dGlsLmdldEJnQ29sb3JzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gYmdDb2xvcnM7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBbZ2V0U3RhdHVzIGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAbWV0aG9kIGdldFN0YXR1c1xuICAgICAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19ICBzdGF0dXNDb2RlIFtkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqL1xuICAgICAgICB1dGlsLmdldFN0YXR1cyA9IGZ1bmN0aW9uKHN0YXR1c0NvZGUpIHtcbiAgICAgICAgICAgIHZhciBjb2xvckNvZGUgPSAnJyxcbiAgICAgICAgICAgICAgICBfc3RhdHVzQ29kZSA9IGFuZ3VsYXIuaXNEZWZpbmVkKHN0YXR1c0NvZGUpID8gc3RhdHVzQ29kZS50b0xvd2VyQ2FzZSgpIDogJycsXG4gICAgICAgICAgICAgICAgbGFiZWw7XG4gICAgICAgICAgICBzd2l0Y2ggKF9zdGF0dXNDb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnb250cmFjayc6XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yQ29kZSA9ICdzdWNjZXNzJztcbiAgICAgICAgICAgICAgICAgICAgbGFiZWwgPSAnT24gVHJhY2snO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhaGVhZG9mdHJhY2snOlxuICAgICAgICAgICAgICAgICAgICBjb2xvckNvZGUgPSAnYmx1ZSc7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsID0gJ0FoZWFkIE9mIFRyYWNrJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYmVoaW5kdHJhY2snOlxuICAgICAgICAgICAgICAgICAgICBjb2xvckNvZGUgPSAnZGFuZ2VyJztcbiAgICAgICAgICAgICAgICAgICAgbGFiZWwgPSAnQmVoaW5kIFRyYWNrJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnbm90c3RhcnRlZCc6XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yQ29kZSA9ICdkYW5nZXInO1xuICAgICAgICAgICAgICAgICAgICBsYWJlbCA9ICdOb3QgU3RhcnRlZCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGNvbG9yQ29kZTogY29sb3JDb2RlLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBsYWJlbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogW2dldE5vdGlmaWNhdGlvblR5cGVMYWJsZSBkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQG1ldGhvZCBnZXROb3RpZmljYXRpb25UeXBlTGFibGVcbiAgICAgICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgICAgICogQHBhcmFtICB7W3R5cGVdfSAgICAgICAgICAgICAgICAgZXZlbnRUeXBlIFtkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICAgICAgICAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgICAgICovXG4gICAgICAgIHV0aWwuZ2V0Tm90aWZpY2F0aW9uVHlwZUxhYmxlID0gZnVuY3Rpb24oZXZlbnRUeXBlKSB7XG4gICAgICAgICAgICB2YXIgbm90aWZpY2F0aW9uTGFibGUgPSAnJztcbiAgICAgICAgICAgIHN3aXRjaCAoZXZlbnRUeXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBub3RpZmljYXRpb25MYWJsZSA9ICdhZGRlZCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgbm90aWZpY2F0aW9uTGFibGUgPSAndXBkYXRlZCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5vdGlmaWNhdGlvbkxhYmxlO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogW2dldEZpbGVUeXBlIGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAbWV0aG9kIGdldEZpbGVUeXBlXG4gICAgICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gIGZpbGVUeXBlIFtkZXNjcmlwdGlvbl1cbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgICAgICAgKi9cbiAgICAgICAgdXRpbC5nZXRGaWxlVHlwZSA9IGZ1bmN0aW9uKGZpbGVUeXBlKSB7XG4gICAgICAgICAgICB2YXIgX2ltYWdlVHlwZXMgPSBbJ2pwZycsICdnaWYnLCAncG5nJywgJ2JtcCcsICdqcGVnJywgJ3RpZiddLFxuICAgICAgICAgICAgICAgIF92aWRlb1R5cGVzID0gWyczZzInLCAnM2dwJywgJ2FzZicsICdhc3gnLCAnYXZpJywgJ2ZsdicsICdtb3YnLCAnbXA0JywgJ21wZycsICdybScsICdzd2YnLCAndm9iJywgJ3dtdiddLFxuICAgICAgICAgICAgICAgIF9maWxlU3RyaW5nO1xuICAgICAgICAgICAgaWYgKCFmaWxlVHlwZSkge1xuICAgICAgICAgICAgICAgIGZpbGVUeXBlID0gJyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBfZmlsZVR5cGUgPSBmaWxlVHlwZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICBpZiAoX2ltYWdlVHlwZXMuaW5kZXhPZihfZmlsZVR5cGUpID49IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdpbWFnZScsXG4gICAgICAgICAgICAgICAgICAgICdpY29uJzogJ2ZhIGZhLWNhbWVyYSBiZy1wdXJwbGUnXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX3ZpZGVvVHlwZXMuaW5kZXhPZihfZmlsZVR5cGUpID49IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICd2aWRlbycsXG4gICAgICAgICAgICAgICAgICAgICdpY29uJzogJ2ZhIGZhLXZpZGVvLWNhbWVyYSBiZy1tYXJvb24nXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnZG9jJyxcbiAgICAgICAgICAgICAgICAgICAgJ2ljb24nOiAnZmEgZmEtZmlsZS1jb2RlLW8gYmctZ3JlZW4nXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogYWRkVGltZVxuICAgICAgICAgKiBoZWxwZXIgZnVuY3Rpb24gdG8gYWRkIHRpbWUgaW4gZ2l2ZW4gZGF0ZVxuICAgICAgICAgKiBAcGFyYW0ge1t0eXBlXX0gZGF0ZSBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqL1xuICAgICAgICB1dGlsLmFkZFRpbWUgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgICAgICBkYXRlLmhvdXJzKG1vbWVudCgpLmhvdXJzKCkpO1xuICAgICAgICAgICAgZGF0ZS5taW51dGVzKG1vbWVudCgpLm1pbnV0ZXMoKSk7XG4gICAgICAgICAgICBkYXRlLnNlY29uZHMobW9tZW50KCkuc2Vjb25kcygpKTtcbiAgICAgICAgICAgIGRhdGUubWlsbGlzZWNvbmRzKG1vbWVudCgpLm1pbGxpc2Vjb25kcygpKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHV0aWwuZ2V0Q3VycmVudFV0Y0RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBtb21lbnQudXRjKCkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdXRpbC5yZWFkQ29va2llID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgICAgICAgdmFyIGNvb2tpZV9zdGFydCA9IGRvY3VtZW50LmNvb2tpZS5pbmRleE9mKG5hbWUpO1xuICAgICAgICAgICAgdmFyIGNvb2tpZV9lbmQgPSBkb2N1bWVudC5jb29raWUuaW5kZXhPZihcIjtcIiwgY29va2llX3N0YXJ0KTtcbiAgICAgICAgICAgIHJldHVybiBjb29raWVfc3RhcnQgPT0gLTEgPyAnJyA6IGRlY29kZVVSSUNvbXBvbmVudChkb2N1bWVudC5jb29raWUuc3Vic3RyaW5nKGNvb2tpZV9zdGFydCArIG5hbWUubGVuZ3RoICsgMSwgKGNvb2tpZV9lbmQgPiBjb29raWVfc3RhcnQgPyBjb29raWVfZW5kIDogZG9jdW1lbnQuY29va2llLmxlbmd0aCkpKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gdXRpbDtcbiAgICB9XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZScpXG4gIC5zZXJ2aWNlKCdQYXJzZUxpbmtzJywgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXJzZSA9IGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgaWYgKDAgPT09IGhlYWRlci5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnB1dCBtdXN0IG5vdCBiZSBvZiB6ZXJvIGxlbmd0aCcpO1xuICAgICAgfVxuXG4gICAgICAvLyBTcGxpdCBwYXJ0cyBieSBjb21tYVxuICAgICAgdmFyIHBhcnRzID0gaGVhZGVyLnNwbGl0KCcsJyk7XG4gICAgICB2YXIgbGlua3MgPSB7fTtcbiAgICAgIC8vIFBhcnNlIGVhY2ggcGFydCBpbnRvIGEgbmFtZWQgbGlua1xuICAgICAgYW5ndWxhci5mb3JFYWNoKHBhcnRzLCBmdW5jdGlvbihwKSB7XG4gICAgICAgIHZhciBzZWN0aW9uID0gcC5zcGxpdCgnOycpO1xuICAgICAgICBpZiAoMiAhPT0gc2VjdGlvbi5sZW5ndGgpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NlY3Rpb24gY291bGQgbm90IGJlIHNwbGl0IG9uIFxcJztcXCcnKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdXJsID0gc2VjdGlvblswXS5yZXBsYWNlKC88KC4qKT4vLCAnJDEnKS50cmltKCk7XG4gICAgICAgIHZhciBxdWVyeVN0cmluZyA9IHt9O1xuICAgICAgICB1cmwucmVwbGFjZShcbiAgICAgICAgICBuZXcgUmVnRXhwKCcoW14/PSZdKykoPShbXiZdKikpPycsICdnJyksXG4gICAgICAgICAgZnVuY3Rpb24oJDAsICQxLCAkMiwgJDMpIHtcbiAgICAgICAgICAgIHF1ZXJ5U3RyaW5nWyQxXSA9ICQzO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgdmFyIHBhZ2UgPSBxdWVyeVN0cmluZy5wYWdlO1xuICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhwYWdlKSkge1xuICAgICAgICAgIHBhZ2UgPSBwYXJzZUludChwYWdlKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbmFtZSA9IHNlY3Rpb25bMV0ucmVwbGFjZSgvcmVsPScoLiopJy8sICckMScpLnRyaW0oKTtcbiAgICAgICAgbGlua3NbbmFtZV0gPSBwYWdlO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBsaW5rcztcbiAgICB9O1xuICB9KTsiLCIvKmpzaGludCBiaXR3aXNlOiBmYWxzZSovXG4ndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlJylcbiAgICAuc2VydmljZSgnQmFzZTY0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIga2V5U3RyID0gJ0FCQ0RFRkdISUpLTE1OT1AnICtcbiAgICAgICAgICAgICdRUlNUVVZXWFlaYWJjZGVmJyArXG4gICAgICAgICAgICAnZ2hpamtsbW5vcHFyc3R1dicgK1xuICAgICAgICAgICAgJ3d4eXowMTIzNDU2Nzg5Ky8nICtcbiAgICAgICAgICAgICc9JztcbiAgICAgICAgdGhpcy5lbmNvZGUgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSAnJyxcbiAgICAgICAgICAgICAgICBjaHIxLCBjaHIyLCBjaHIzID0gJycsXG4gICAgICAgICAgICAgICAgZW5jMSwgZW5jMiwgZW5jMywgZW5jNCA9ICcnLFxuICAgICAgICAgICAgICAgIGkgPSAwO1xuXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGlucHV0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNocjEgPSBpbnB1dC5jaGFyQ29kZUF0KGkrKyk7XG4gICAgICAgICAgICAgICAgY2hyMiA9IGlucHV0LmNoYXJDb2RlQXQoaSsrKTtcbiAgICAgICAgICAgICAgICBjaHIzID0gaW5wdXQuY2hhckNvZGVBdChpKyspO1xuXG4gICAgICAgICAgICAgICAgZW5jMSA9IGNocjEgPj4gMjtcbiAgICAgICAgICAgICAgICBlbmMyID0gKChjaHIxICYgMykgPDwgNCkgfCAoY2hyMiA+PiA0KTtcbiAgICAgICAgICAgICAgICBlbmMzID0gKChjaHIyICYgMTUpIDw8IDIpIHwgKGNocjMgPj4gNik7XG4gICAgICAgICAgICAgICAgZW5jNCA9IGNocjMgJiA2MztcblxuICAgICAgICAgICAgICAgIGlmIChpc05hTihjaHIyKSkge1xuICAgICAgICAgICAgICAgICAgICBlbmMzID0gZW5jNCA9IDY0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNOYU4oY2hyMykpIHtcbiAgICAgICAgICAgICAgICAgICAgZW5jNCA9IDY0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dCArXG4gICAgICAgICAgICAgICAgICAgIGtleVN0ci5jaGFyQXQoZW5jMSkgK1xuICAgICAgICAgICAgICAgICAgICBrZXlTdHIuY2hhckF0KGVuYzIpICtcbiAgICAgICAgICAgICAgICAgICAga2V5U3RyLmNoYXJBdChlbmMzKSArXG4gICAgICAgICAgICAgICAgICAgIGtleVN0ci5jaGFyQXQoZW5jNCk7XG4gICAgICAgICAgICAgICAgY2hyMSA9IGNocjIgPSBjaHIzID0gJyc7XG4gICAgICAgICAgICAgICAgZW5jMSA9IGVuYzIgPSBlbmMzID0gZW5jNCA9ICcnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZGVjb2RlID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gJycsXG4gICAgICAgICAgICAgICAgY2hyMSwgY2hyMiwgY2hyMyA9ICcnLFxuICAgICAgICAgICAgICAgIGVuYzEsIGVuYzIsIGVuYzMsIGVuYzQgPSAnJyxcbiAgICAgICAgICAgICAgICBpID0gMDtcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIGFsbCBjaGFyYWN0ZXJzIHRoYXQgYXJlIG5vdCBBLVosIGEteiwgMC05LCArLCAvLCBvciA9XG4gICAgICAgICAgICBpbnB1dCA9IGlucHV0LnJlcGxhY2UoL1teQS1aYS16MC05XFwrXFwvXFw9XS9nLCAnJyk7XG5cbiAgICAgICAgICAgIHdoaWxlIChpIDwgaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZW5jMSA9IGtleVN0ci5pbmRleE9mKGlucHV0LmNoYXJBdChpKyspKTtcbiAgICAgICAgICAgICAgICBlbmMyID0ga2V5U3RyLmluZGV4T2YoaW5wdXQuY2hhckF0KGkrKykpO1xuICAgICAgICAgICAgICAgIGVuYzMgPSBrZXlTdHIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XG4gICAgICAgICAgICAgICAgZW5jNCA9IGtleVN0ci5pbmRleE9mKGlucHV0LmNoYXJBdChpKyspKTtcblxuICAgICAgICAgICAgICAgIGNocjEgPSAoZW5jMSA8PCAyKSB8IChlbmMyID4+IDQpO1xuICAgICAgICAgICAgICAgIGNocjIgPSAoKGVuYzIgJiAxNSkgPDwgNCkgfCAoZW5jMyA+PiAyKTtcbiAgICAgICAgICAgICAgICBjaHIzID0gKChlbmMzICYgMykgPDwgNikgfCBlbmM0O1xuXG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICsgU3RyaW5nLmZyb21DaGFyQ29kZShjaHIxKTtcblxuICAgICAgICAgICAgICAgIGlmIChlbmMzICE9PSA2NCkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGNocjIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZW5jNCAhPT0gNjQpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICsgU3RyaW5nLmZyb21DaGFyQ29kZShjaHIzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjaHIxID0gY2hyMiA9IGNocjMgPSAnJztcbiAgICAgICAgICAgICAgICBlbmMxID0gZW5jMiA9IGVuYzMgPSBlbmM0ID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSlcbiAgICAuZmFjdG9yeSgnU3RvcmFnZVNlcnZpY2UnLCBmdW5jdGlvbiAoJHdpbmRvdykge1xuICAgICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSgkd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2F2ZTogZnVuY3Rpb24gKGtleSwgZGF0YSkge1xuICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBjbGVhckFsbCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pOyIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuIC8qKlxuICAgKiBAbmdkb2Mgb3ZlcnZpZXdcbiAgICogQG5hbWUgUGFzc3dvcmRTdHJlbmd0aFxuICAgKiBAbW9kdWxlIFBhc3N3b3JkU3RyZW5ndGhcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoaXMgaXMgYW4gaW5kZXBlbmRlZCBtb2R1bGUuIFRoaXMgbW9kdWxlIHN1cHBsbHkgcGFzc3dvcmQgc3RyZW5ndGggY2hlY2tlclxuICAgKiBzZXQgZmllbGQgdmFsaWRhdGl0eSAnc3RyZW5ndGgnXG4gICAqXG4gICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAqL1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdQYXNzd29yZFN0cmVuZ3RoJywgW10pO1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgRmFjdG9yeVxuICAgKiBAbmFtZSBQYXNzd29yZFN0cmVuZ3RoLkZhY3RvcnkuU3Ryb25nUGFzc1xuICAgKiBAbW9kdWxlIFBhc3N3b3JkU3RyZW5ndGhcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEhlbHBlciBmYWN0b3J5IGZvciBwYXNzd29yZCBzdHJlbmd0aCBkaXJlY3RpdmUgXG4gICAqXG4gICAqIFVzYWdlIDpcbiAgICogPGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIHBhc3N3b3JkLXN0cmVuZ3RoIC8+XG4gICAqIFxuICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgKi9cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ1Bhc3N3b3JkU3RyZW5ndGgnKVxuICAgIC5mYWN0b3J5KCdTdHJvbmdQYXNzJywgU3Ryb25nUGFzc0ZhY3RvcnkpO1xuXG4gIC8qKiBAbmdJbmplY3QgKi9cbiAgZnVuY3Rpb24gU3Ryb25nUGFzc0ZhY3RvcnkoKSB7XG5cbiAgICB2YXIgU3Ryb25nUGFzcyA9IHtcbiAgICAgIG9wdGlvbnM6IHtcblxuICAgICAgICBtaW5DaGFyOiA2LCAvLyB0b28gc2hvcnQgd2hpbGUgbGVzcyB0aGFuIHRoaXNcblxuICAgICAgICBwYXNzSW5kZXg6IDIsIC8vIFdlYWtcblxuICAgICAgICAvLyBvdXRwdXQgdmVyZGljdHMsIGNvbG91cnMgYW5kIGJhciAlXG4gICAgICAgIGxhYmVsOiAnUGFzc3dvcmQgc3RyZW5ndGg6ICcsXG5cbiAgICAgICAgdmVyZGljdHM6IFtcbiAgICAgICAgICAnVG9vIFNob3J0JyxcbiAgICAgICAgICAnVmVyeSB3ZWFrJyxcbiAgICAgICAgICAnV2VhaycsXG4gICAgICAgICAgJ0dvb2QnLFxuICAgICAgICAgICdTdHJvbmcnLFxuICAgICAgICAgICdWZXJ5IHN0cm9uZydcbiAgICAgICAgXSxcblxuICAgICAgICBjb2xvcnM6IFtcbiAgICAgICAgICAnI2NjYycsXG4gICAgICAgICAgJyM1MDAnLFxuICAgICAgICAgICcjODAwJyxcbiAgICAgICAgICAnI2Y2MCcsXG4gICAgICAgICAgJyMwNTAnLFxuICAgICAgICAgICcjMGYwJ1xuICAgICAgICBdLFxuXG4gICAgICAgIHdpZHRoOiBbXG4gICAgICAgICAgJzAlJyxcbiAgICAgICAgICAnMTAlJyxcbiAgICAgICAgICAnMzAlJyxcbiAgICAgICAgICAnNjAlJyxcbiAgICAgICAgICAnODAlJyxcbiAgICAgICAgICAnMTAwJSdcbiAgICAgICAgXSxcblxuICAgICAgICAvLyB0d2VhayBzY29yZXMgaGVyZVxuICAgICAgICBzY29yZXM6IFtcbiAgICAgICAgICAxMCxcbiAgICAgICAgICAxNSxcbiAgICAgICAgICAyNSxcbiAgICAgICAgICA0NVxuICAgICAgICBdLFxuXG4gICAgICAgIC8vIHdoZW4gaW4gYmFubmVkIGxpc3QsIHZlcmRpY3QgaXM6XG4gICAgICAgIGJhbm5lZFBhc3M6ICdOb3QgYWxsb3dlZCcsXG5cbiAgICAgICAgLy8gc3R5bGVzXG4gICAgICAgIHBhc3NTdHJlbmd0aFplbjogJ2Rpdi5wYXNzLWNvbnRhaW5lcicsXG5cbiAgICAgICAgcGFzc2JhckNsYXNzWmVuOiAnZGl2LnBhc3MtYmFyJywgLy8gY3NzIGNvbnRyb2xzXG5cbiAgICAgICAgcGFzc2JhckhpbnRaZW46ICdkaXYucGFzcy1oaW50JyxcblxuICAgICAgICAvLyBvdXRwdXRcbiAgICAgICAgcmVuZGVyOiB0cnVlLCAvLyBpdCBjYW4ganVzdCByZXBvcnQgZm9yIHlvdXIgb3duIGltcGxlbWVudGF0aW9uXG5cbiAgICAgICAgaW5qZWN0VGFyZ2V0OiBudWxsLFxuXG4gICAgICAgIGluamVjdFBsYWNlbWVudDogJ2FmdGVyJyxcbiAgICAgICAgYmFyV2lkdGg6ICcyMDBweCdcbiAgICAgIH0sXG5cbiAgICAgIGJhbm5lZFBhc3N3b3JkczogW1xuICAgICAgICAnMTIzNDU2JyxcbiAgICAgICAgJzEyMzQ1JyxcbiAgICAgICAgJzEyMzQ1Njc4OScsXG4gICAgICAgICdwYXNzd29yZCcsXG4gICAgICAgICdpbG92ZXlvdScsXG4gICAgICAgICdwcmluY2VzcycsXG4gICAgICAgICdyb2NreW91JyxcbiAgICAgICAgJzEyMzQ1NjcnLFxuICAgICAgICAnMTIzNDU2NzgnLFxuICAgICAgICAnYWJjMTIzJyxcbiAgICAgICAgJ25pY29sZScsXG4gICAgICAgICdkYW5pZWwnLFxuICAgICAgICAnYmFieWdpcmwnLFxuICAgICAgICAnbW9ua2V5JyxcbiAgICAgICAgJ2plc3NpY2EnLFxuICAgICAgICAnbG92ZWx5JyxcbiAgICAgICAgJ21pY2hhZWwnLFxuICAgICAgICAnYXNobGV5JyxcbiAgICAgICAgJzY1NDMyMScsXG4gICAgICAgICdxd2VydHknLFxuICAgICAgICAncGFzc3dvcmQxJyxcbiAgICAgICAgJ3dlbGNvbWUnLFxuICAgICAgICAnd2VsY29tZTEnLFxuICAgICAgICAncGFzc3dvcmQyJyxcbiAgICAgICAgJ3Bhc3N3b3JkMDEnLFxuICAgICAgICAncGFzc3dvcmQzJyxcbiAgICAgICAgJ3BAc3N3MHJkJyxcbiAgICAgICAgJ3Bhc3N3MHJkJyxcbiAgICAgICAgJ3Bhc3N3b3JkNCcsXG4gICAgICAgICdwYXNzd29yZDEyMycsXG4gICAgICAgICdzdW1tZXIwOScsXG4gICAgICAgICdwYXNzd29yZDYnLFxuICAgICAgICAncGFzc3dvcmQ3JyxcbiAgICAgICAgJ3Bhc3N3b3JkOScsXG4gICAgICAgICdwYXNzd29yZDgnLFxuICAgICAgICAnd2VsY29tZTInLFxuICAgICAgICAnd2VsY29tZTAxJyxcbiAgICAgICAgJ3dpbnRlcjEyJyxcbiAgICAgICAgJ3NwcmluZzIwMTInLFxuICAgICAgICAnc3VtbWVyMTInLFxuICAgICAgICAnc3VtbWVyMjAxMidcbiAgICAgIF0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGVsZW1lbnQgQmFzZSBlbGVtZW50IHRvIGF0dGFjaCB0b1xuICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMqIE9wdGlvbnMgdG8gbWVyZ2UgaW4gLyBhdHRhY2ggZXZlbnRzIGZyb21cbiAgICAgICAqIEBmaXJlcyBTdHJvbmdQYXNzI3JlYWR5XG4gICAgICAgKiBAcmV0dXJucyBTcm9uZ1Bhc3NcbiAgICAgICAqL1xuICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMub3B0aW9ucy5yZW5kZXIgJiYgdGhpcy5jcmVhdGVCb3goKTtcbiAgICAgICAgdGhpcy5hdHRhY2hFdmVudHMoKTtcbiAgICAgIH0sXG4gICAgICBzZXRPcHRpb25zOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIGFuZ3VsYXIuZXh0ZW5kKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICB9LFxuICAgICAgLyoqXG4gICAgICAgKiBAZGVzY3JpcHRpb24gQXR0YWNoZXMgZXZlbnRzIGFuZCBzYXZlcyBhIHJlZmVyZW5jZVxuICAgICAgICogQHJldHVybnMge1N0cm9uZ1Bhc3N9XG4gICAgICAgKi9cbiAgICAgIGF0dGFjaEV2ZW50czogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIG9ubHkgYXR0YWNoIGV2ZW50cyBvbmNlIHNvIGZyZXNoZW5cbiAgICAgICAgdGhpcy5lbGVtZW50Lm9uKCdrZXl1cCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgdGhpcy5ydW5QYXNzd29yZCgpXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEBkZXNjcmlwdGlvbiBBdHRhY2hlcyBwYXNzIGVsZW1lbnRzLlxuICAgICAgICogQHJldHVybnMge1N0cm9uZ1Bhc3N9XG4gICAgICAgKi9cbiAgICAgIGNyZWF0ZUJveDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vdG9kbzogc2hvdWxkIGJlIHRlbXBsYXRlZFxuICAgICAgICB2YXIgbyA9IHRoaXMub3B0aW9ucztcblxuICAgICAgICB2YXIgdGVtcGxhdGUgPSAnPGRpdiBjbGFzcz1cInBhc3MtY29udGFpbmVyXCIgc3R5bGU9XCJ3aWR0aDogJyArIG8uYmFyV2lkdGggKyAnO1wiPjxkaXYgY2xhc3M9XCJwYXNzLWJhclwiPjwvZGl2PjxkaXYgY2xhc3M9XCJwYXNzLWhpbnRcIj48L2Rpdj48L2Rpdj4nO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5hZnRlcih0ZW1wbGF0ZSk7XG4gICAgICAgIHRoaXMucGFzc19jb250YWluZXIgPSB0aGlzLmVsZW1lbnQubmV4dCgpO1xuICAgICAgICAvL2hpZGUgY29udGFpbmVyIGJ5IGRlZmF1bHRcbiAgICAgICAgdGhpcy5wYXNzX2NvbnRhaW5lci5oaWRlKCk7XG4gICAgICAgIHRoaXMudHh0Ym94ID0gdGhpcy5wYXNzX2NvbnRhaW5lci5maW5kKG8ucGFzc2JhckhpbnRaZW4pO1xuICAgICAgICB0aGlzLnN0ZGJhciA9IHRoaXMucGFzc19jb250YWluZXIuZmluZChvLnBhc3NiYXJDbGFzc1plbik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEBkZXNjcmlwdGlvbiBSdW5zIGEgcGFzc3dvcmQgY2hlY2sgb24gdGhlIGtleXVwIGV2ZW50XG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQqXG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGFzc3dvcmQqIE9wdGlvbmFsbHkgcGFzcyBhIHN0cmluZyBvciBnbyB0byBlbGVtZW50IGdldHRlclxuICAgICAgICogQGZpcmVzIFN0cm9uZ1Bhc3MjZmFpbCBTdHJvbmdQYXNzI3Bhc3NcbiAgICAgICAqIEByZXR1cm5zIHtTdHJvbmdQYXNzfVxuICAgICAgICovXG4gICAgICBydW5QYXNzd29yZDogZnVuY3Rpb24oZXZlbnQsIHBhc3N3b3JkKSB7XG4gICAgICAgIHBhc3N3b3JkID0gcGFzc3dvcmQgfHwgdGhpcy5lbGVtZW50LnZhbCgpO1xuXG4gICAgICAgIHZhciBzY29yZSA9IHRoaXMuY2hlY2tQYXNzd29yZChwYXNzd29yZCksXG4gICAgICAgICAgaW5kZXggPSAwLFxuICAgICAgICAgIG8gPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgcyA9IGFuZ3VsYXIuY29weShvLnNjb3JlcyksXG4gICAgICAgICAgdmVyZGljdDtcbiAgICAgICAgdGhpcy5kaXNwbGF5Q29udGlhbmVyKHBhc3N3b3JkKTtcbiAgICAgICAgaWYgKHRoaXMuYmFubmVkUGFzc3dvcmRzLmluZGV4T2YocGFzc3dvcmQudG9Mb3dlckNhc2UoKSkgIT09IC0xKSB7XG4gICAgICAgICAgdmVyZGljdCA9IG8uYmFubmVkUGFzcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoc2NvcmUgPCAwICYmIHNjb3JlID4gLTE5OSkge1xuICAgICAgICAgICAgaW5kZXggPSAwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzLnB1c2goc2NvcmUpO1xuICAgICAgICAgICAgcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpbmRleCA9IHMuaW5kZXhPZihzY29yZSkgKyAxO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZlcmRpY3QgPSBvLnZlcmRpY3RzW2luZGV4XSB8fCBvLnZlcmRpY3RzLmdldExhc3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvLnJlbmRlcikge1xuICAgICAgICAgIHRoaXMudHh0Ym94LnRleHQoW28ubGFiZWwsIHZlcmRpY3RdLmpvaW4oJycpKTtcblxuICAgICAgICAgIHRoaXMuc3RkYmFyLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogby53aWR0aFtpbmRleF0gfHwgby53aWR0aC5nZXRMYXN0KCksXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBvLmNvbG9yc1tpbmRleF0gfHwgby5jb2xvcnMuZ2V0TGFzdCgpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQGV2ZW50IFN0cm9uZ1Bhc3MjZmFpbCxTdHJvbmdQYXNzI3Bhc3NcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucGFzc2VkID0gKG8udmVyZGljdHMuaW5kZXhPZih2ZXJkaWN0KSA+PSBvLnBhc3NJbmRleCk7XG5cbiAgICAgICAgaWYgKHRoaXMucGFzc2VkICYmIG8ub25QYXNzKSB7XG4gICAgICAgICAgby5vblBhc3MoaW5kZXgsIHZlcmRpY3QpO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLnBhc3NlZCAmJiBvLm9uRmFpbCkge1xuICAgICAgICAgIG8ub25GYWlsKGluZGV4LCB2ZXJkaWN0KVxuICAgICAgICB9XG5cbiAgICAgIH0sXG5cbiAgICAgIGRpc3BsYXlDb250aWFuZXI6IGZ1bmN0aW9uKHBhc3N3b3JkKSB7XG4gICAgICAgIGlmIChwYXNzd29yZCkge1xuICAgICAgICAgIHRoaXMucGFzc19jb250YWluZXIuc2hvdygpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhc3NfY29udGFpbmVyLmhpZGUoKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICogQGRlc2NyaXB0aW9uIFRoZSBjb2xsZWN0aW9uIG9mIHJlZ2V4IGNoZWNrcyBhbmQgaG93IG11Y2ggdGhleSBhZmZlY3QgdGhlIHNjb3JpbmdcbiAgICAgICAqL1xuICAgICAgY2hlY2tzOiBbXG4gICAgICAgIC8qIGFscGhhTG93ZXIgKi9cbiAgICAgICAge1xuICAgICAgICAgIHJlOiAvW2Etel0vLFxuICAgICAgICAgIHNjb3JlOiAxXG4gICAgICAgIH0sXG4gICAgICAgIC8qIGFscGhhVXBwZXIgKi9cbiAgICAgICAge1xuICAgICAgICAgIHJlOiAvW0EtWl0vLFxuICAgICAgICAgIHNjb3JlOiA1XG4gICAgICAgIH0sXG4gICAgICAgIC8qIG1peHR1cmUgb2YgdXBwZXIgYW5kIGxvd2VyY2FzZSAqL1xuICAgICAgICB7XG4gICAgICAgICAgcmU6IC8oW2Etel0uKltBLVpdKXwoW0EtWl0uKlthLXpdKS8sXG4gICAgICAgICAgc2NvcmU6IDJcbiAgICAgICAgfSxcbiAgICAgICAgLyogdGhyZWVOdW1iZXJzICovXG4gICAgICAgIHtcbiAgICAgICAgICByZTogLyguKlswLTldLipbMC05XS4qWzAtOV0pLyxcbiAgICAgICAgICBzY29yZTogN1xuICAgICAgICB9LFxuICAgICAgICAvKiBzcGVjaWFsIGNoYXJzICovXG4gICAgICAgIHtcbiAgICAgICAgICByZTogLy5bIUAjJCVeJio/X35dLyxcbiAgICAgICAgICBzY29yZTogNVxuICAgICAgICB9LFxuICAgICAgICAvKiBtdWx0aXBsZSBzcGVjaWFsIGNoYXJzICovXG4gICAgICAgIHtcbiAgICAgICAgICByZTogLyguKlshQCMkJV4mKj9ffl0uKlshQCMkJV4mKj9ffl0pLyxcbiAgICAgICAgICBzY29yZTogN1xuICAgICAgICB9LFxuICAgICAgICAvKiBhbGwgdG9nZXRoZXIgbm93LCBkb2VzIGl0IGxvb2sgbmljZT8gKi9cbiAgICAgICAge1xuICAgICAgICAgIHJlOiAvKFthLXpBLVowLTldLipbIUAjJCVeJio/X35dKXwoWyFAIyQlXiYqP19+XS4qW2EtekEtWjAtOV0pLyxcbiAgICAgICAgICBzY29yZTogM1xuICAgICAgICB9LFxuICAgICAgICAvKiBwYXNzd29yZCBvZiBhIHNpbmdsZSBjaGFyIHN1Y2tzICovXG4gICAgICAgIHtcbiAgICAgICAgICByZTogLyguKVxcMSskLyxcbiAgICAgICAgICBzY29yZTogMlxuICAgICAgICB9XG4gICAgICBdLFxuXG4gICAgICBjaGVja1Bhc3N3b3JkOiBmdW5jdGlvbihwYXNzKSB7XG4gICAgICAgIHZhciBzY29yZSA9IDAsXG4gICAgICAgICAgbWluQ2hhciA9IHRoaXMub3B0aW9ucy5taW5DaGFyLFxuICAgICAgICAgIGxlbiA9IHBhc3MubGVuZ3RoLFxuICAgICAgICAgIGRpZmYgPSBsZW4gLSBtaW5DaGFyO1xuXG4gICAgICAgIChkaWZmIDwgMCAmJiAoc2NvcmUgLT0gMTAwKSkgfHwgKGRpZmYgPj0gNSAmJiAoc2NvcmUgKz0gMTgpKSB8fCAoZGlmZiA+PSAzICYmIChzY29yZSArPSAxMikpIHx8IChkaWZmID09PSAyICYmIChzY29yZSArPSA2KSk7XG5cbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKHRoaXMuY2hlY2tzLCBmdW5jdGlvbihjaGVjaykge1xuICAgICAgICAgIHBhc3MubWF0Y2goY2hlY2sucmUpICYmIChzY29yZSArPSBjaGVjay5zY29yZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGJvbnVzIGZvciBsZW5ndGggcGVyIGNoYXJcbiAgICAgICAgc2NvcmUgJiYgKHNjb3JlICs9IGxlbik7XG4gICAgICAgIHJldHVybiBzY29yZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIFN0cm9uZ1Bhc3M7XG4gIH1cblxuXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBEaXJlY3RpdmVcbiAgICogQG5hbWUgUGFzc3dvcmRTdHJlbmd0aC5EaXJlY3RpdmUucGFzc3dvcmRTdHJlbmd0aFxuICAgKiBAbW9kdWxlIFBhc3N3b3JkU3RyZW5ndGhcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIERldGVybWluZSB0aGUgc3RyZW5ndGggb2YgcGFzc3dvcmRcbiAgICpcbiAgICogVXNhZ2UgOlxuICAgKiA8aW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgcGFzc3dvcmQtc3RyZW5ndGggLz5cbiAgICogXG4gICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAqL1xuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnUGFzc3dvcmRTdHJlbmd0aCcpXG4gICAgLmRpcmVjdGl2ZSgncGFzc3dvcmRTdHJlbmd0aCcsIHBhc3N3b3JkU3RyZW5ndGhEaXJlY3RpdmUpO1xuXG4gIC8qIEBuZ0luamVjdCAqL1xuICBmdW5jdGlvbiBwYXNzd29yZFN0cmVuZ3RoRGlyZWN0aXZlKFN0cm9uZ1Bhc3MpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcywgbmdNb2RlbCkge1xuICAgICAgICBTdHJvbmdQYXNzLmluaXRpYWxpemUoZWxlbWVudCwge1xuICAgICAgICAgIGJhcldpZHRoOiAnMTAwJScsXG4gICAgICAgICAgcmVuZGVyOiB0cnVlLFxuICAgICAgICAgIG9uUGFzczogZnVuY3Rpb24oc2NvcmUsIHZlcmRpY3QpIHtcbiAgICAgICAgICAgIG5nTW9kZWwuJHNldFZhbGlkaXR5KCdzdHJvbmcnLCB0cnVlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uRmFpbDogZnVuY3Rpb24oc2NvcmUsIHZlcmRpY3QpIHtcbiAgICAgICAgICAgIG5nTW9kZWwuJHNldFZhbGlkaXR5KCdzdHJvbmcnLCBmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59KCkpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjcuMVxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgTU9EVUxFX05BTUUsIFNMSURFUl9UQUcsIGFuZ3VsYXJpemUsIGNvbnRhaW4sIGV2ZW50cywgZ2FwLCBoYWxmV2lkdGgsIGhpZGUsIG1vZHVsZSwgb2Zmc2V0LCBvZmZzZXRMZWZ0LCBwaXhlbGl6ZSwgcXVhbGlmaWVkRGlyZWN0aXZlRGVmaW5pdGlvbiwgcm91bmRTdGVwLCBzaG93LCBzbGlkZXJEaXJlY3RpdmUsIHdpZHRoO1xuXG4gICAgTU9EVUxFX05BTUUgPSAndWkuc2xpZGVyJztcblxuICAgIFNMSURFUl9UQUcgPSAnc2xpZGVyJztcblxuICAgIGFuZ3VsYXJpemUgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudCk7XG4gICAgfTtcblxuICAgIHBpeGVsaXplID0gZnVuY3Rpb24ocG9zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuICcnICsgcG9zaXRpb24gKyAncHgnO1xuICAgIH07XG5cbiAgICBoaWRlID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5jc3Moe1xuICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgc2hvdyA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQuY3NzKHtcbiAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIG9mZnNldCA9IGZ1bmN0aW9uKGVsZW1lbnQsIHBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50LmNzcyh7XG4gICAgICAgICAgICBsZWZ0OiBwb3NpdGlvblxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgaGFsZldpZHRoID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudFswXS5vZmZzZXRXaWR0aCAvIDI7XG4gICAgfTtcblxuICAgIG9mZnNldExlZnQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50WzBdLm9mZnNldExlZnQ7XG4gICAgfTtcblxuICAgIHdpZHRoID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudFswXS5vZmZzZXRXaWR0aDtcbiAgICB9O1xuXG4gICAgZ2FwID0gZnVuY3Rpb24oZWxlbWVudDEsIGVsZW1lbnQyKSB7XG4gICAgICAgIHJldHVybiBvZmZzZXRMZWZ0KGVsZW1lbnQyKSAtIG9mZnNldExlZnQoZWxlbWVudDEpIC0gd2lkdGgoZWxlbWVudDEpO1xuICAgIH07XG5cbiAgICBjb250YWluID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYgKGlzTmFOKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heCgwLCB2YWx1ZSksIDEwMCk7XG4gICAgfTtcblxuICAgIHJvdW5kU3RlcCA9IGZ1bmN0aW9uKHZhbHVlLCBwcmVjaXNpb24sIHN0ZXAsIGZsb29yKSB7XG4gICAgICAgIHZhciBkZWNpbWFscywgcmVtYWluZGVyLCByb3VuZGVkVmFsdWUsIHN0ZXBwZWRWYWx1ZTtcbiAgICAgICAgaWYgKGZsb29yID09PSBudWxsKSB7XG4gICAgICAgICAgICBmbG9vciA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0ZXAgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHN0ZXAgPSAxIC8gTWF0aC5wb3coMTAsIHByZWNpc2lvbik7XG4gICAgICAgIH1cbiAgICAgICAgcmVtYWluZGVyID0gKHZhbHVlIC0gZmxvb3IpICUgc3RlcDtcbiAgICAgICAgc3RlcHBlZFZhbHVlID0gcmVtYWluZGVyID4gKHN0ZXAgLyAyKSA/IHZhbHVlICsgc3RlcCAtIHJlbWFpbmRlciA6IHZhbHVlIC0gcmVtYWluZGVyO1xuICAgICAgICBkZWNpbWFscyA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24pO1xuICAgICAgICByb3VuZGVkVmFsdWUgPSBzdGVwcGVkVmFsdWUgKiBkZWNpbWFscyAvIGRlY2ltYWxzO1xuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChyb3VuZGVkVmFsdWUudG9GaXhlZChwcmVjaXNpb24pKTtcbiAgICB9O1xuXG4gICAgZXZlbnRzID0ge1xuICAgICAgICBtb3VzZToge1xuICAgICAgICAgICAgc3RhcnQ6ICdtb3VzZWRvd24nLFxuICAgICAgICAgICAgbW92ZTogJ21vdXNlbW92ZScsXG4gICAgICAgICAgICBlbmQ6ICdtb3VzZXVwJ1xuICAgICAgICB9LFxuICAgICAgICB0b3VjaDoge1xuICAgICAgICAgICAgc3RhcnQ6ICd0b3VjaHN0YXJ0JyxcbiAgICAgICAgICAgIG1vdmU6ICd0b3VjaG1vdmUnLFxuICAgICAgICAgICAgZW5kOiAndG91Y2hlbmQnXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgc2xpZGVyRGlyZWN0aXZlID0gZnVuY3Rpb24oJHRpbWVvdXQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIGZsb29yOiAnQCcsXG4gICAgICAgICAgICAgICAgY2VpbGluZzogJ0AnLFxuICAgICAgICAgICAgICAgIHZhbHVlczogJz0/JyxcbiAgICAgICAgICAgICAgICBzdGVwOiAnQCcsXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0OiAnQCcsXG4gICAgICAgICAgICAgICAgcHJlY2lzaW9uOiAnQCcsXG4gICAgICAgICAgICAgICAgYnVmZmVyOiAnQCcsXG4gICAgICAgICAgICAgICAgZHJhZ3N0b3A6ICdAJyxcbiAgICAgICAgICAgICAgICBuZ01vZGVsOiAnPT8nLFxuICAgICAgICAgICAgICAgIGRpc2FibGVkOiAnPT8nLFxuICAgICAgICAgICAgICAgIG5nTW9kZWxMb3c6ICc9PycsXG4gICAgICAgICAgICAgICAgbmdNb2RlbEhpZ2g6ICc9PydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJiYXJcIj48ZGl2IGNsYXNzPVwic2VsZWN0aW9uXCI+PC9kaXY+PC9kaXY+XFxuPGRpdiBjbGFzcz1cImhhbmRsZSBsb3dcIj48L2Rpdj48ZGl2IGNsYXNzPVwiaGFuZGxlIGhpZ2hcIj48L2Rpdj5cXG48ZGl2IGNsYXNzPVwiYnViYmxlIGxpbWl0IGxvd1wiPnt7IHZhbHVlcy5sZW5ndGggPyB2YWx1ZXNbZmxvb3IgfHwgMF0gOiBmbG9vciB9fTwvZGl2PlxcbjxkaXYgY2xhc3M9XCJidWJibGUgbGltaXQgaGlnaFwiPnt7IHZhbHVlcy5sZW5ndGggPyB2YWx1ZXNbY2VpbGluZyB8fCB2YWx1ZXMubGVuZ3RoIC0gMV0gOiBjZWlsaW5nIH19PC9kaXY+XFxuPGRpdiBjbGFzcz1cImJ1YmJsZSB2YWx1ZSBsb3dcIj57eyB2YWx1ZXMubGVuZ3RoID8gdmFsdWVzW2xvY2FsLm5nTW9kZWxMb3cgfHwgbG9jYWwubmdNb2RlbCB8fCAwXSA6IGxvY2FsLm5nTW9kZWxMb3cgfHwgbG9jYWwubmdNb2RlbCB8fCAwIH19PC9kaXY+XFxuPGRpdiBjbGFzcz1cImJ1YmJsZSB2YWx1ZSBoaWdoXCI+e3sgdmFsdWVzLmxlbmd0aCA/IHZhbHVlc1tsb2NhbC5uZ01vZGVsSGlnaF0gOiBsb2NhbC5uZ01vZGVsSGlnaCB9fTwvZGl2PicsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbihlbGVtZW50LCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhpZ2gsIGxvdywgcmFuZ2UsIHdhdGNoYWJsZXM7XG4gICAgICAgICAgICAgICAgcmFuZ2UgPSAoYXR0cmlidXRlcy5uZ01vZGVsID09PSBudWxsKSAmJiAoYXR0cmlidXRlcy5uZ01vZGVsTG93ICE9PSBudWxsKSAmJiAoYXR0cmlidXRlcy5uZ01vZGVsSGlnaCAhPT0gbnVsbCk7XG4gICAgICAgICAgICAgICAgbG93ID0gcmFuZ2UgPyAnbmdNb2RlbExvdycgOiAnbmdNb2RlbCc7XG4gICAgICAgICAgICAgICAgaGlnaCA9ICduZ01vZGVsSGlnaCc7XG4gICAgICAgICAgICAgICAgd2F0Y2hhYmxlcyA9IFsnZmxvb3InLCAnY2VpbGluZycsICd2YWx1ZXMnLCBsb3ddO1xuICAgICAgICAgICAgICAgIGlmIChyYW5nZSkge1xuICAgICAgICAgICAgICAgICAgICB3YXRjaGFibGVzLnB1c2goaGlnaCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHBvc3Q6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYmFyLCBiYXJXaWR0aCwgYm91bmQsIGNlaWxCdWIsIGRpbWVuc2lvbnMsIGUsIGZsckJ1YiwgaGFuZGxlSGFsZldpZHRoLCBoaWdoQnViLCBsb3dCdWIsIG1heE9mZnNldCwgbWF4UHRyLCBtYXhWYWx1ZSwgbWluT2Zmc2V0LCBtaW5QdHIsIG1pblZhbHVlLCBuZ0RvY3VtZW50LCBvZmZzZXRSYW5nZSwgc2VsZWN0aW9uLCB1cGRhdGVET00sIHVwcGVyLCB2YWx1ZVJhbmdlLCB3LCBfaSwgX2osIF9sZW4sIF9sZW4xLCBfcmVmLCBfcmVmMTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgX3JlZiA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgX2ksIF9sZW4sIF9yZWYsIF9yZXN1bHRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWYgPSBlbGVtZW50LmNoaWxkcmVuKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZSA9IF9yZWZbX2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVzdWx0cy5wdXNoKGFuZ3VsYXJpemUoZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSgpOyBiYXIgPSBfcmVmWzBdOyBtaW5QdHIgPSBfcmVmWzFdOyBtYXhQdHIgPSBfcmVmWzJdOyBmbHJCdWIgPSBfcmVmWzNdOyBjZWlsQnViID0gX3JlZls0XTsgbG93QnViID0gX3JlZls1XTsgaGlnaEJ1YiA9IF9yZWZbNl07XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb24gPSBhbmd1bGFyaXplKGJhci5jaGlsZHJlbigpWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcmFuZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVmMSA9IFttYXhQdHIsIGhpZ2hCdWJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjEubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBwZXIgPSBfcmVmMVtfaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwcGVyLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWF0dHJpYnV0ZXMuaGlnaGxpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5sb2NhbCA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUubG9jYWxbbG93XSA9IHNjb3BlW2xvd107XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5sb2NhbFtoaWdoXSA9IHNjb3BlW2hpZ2hdO1xuICAgICAgICAgICAgICAgICAgICAgICAgYm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nRG9jdW1lbnQgPSBhbmd1bGFyaXplKGRvY3VtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUhhbGZXaWR0aCA9IGJhcldpZHRoID0gbWluT2Zmc2V0ID0gbWF4T2Zmc2V0ID0gbWluVmFsdWUgPSBtYXhWYWx1ZSA9IHZhbHVlUmFuZ2UgPSBvZmZzZXRSYW5nZSA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUsIF9qLCBfbGVuMSwgX3JlZjI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNjb3BlLnN0ZXAgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuc3RlcCA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS5mbG9vciA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5mbG9vciA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS5wcmVjaXNpb24gPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJlY2lzaW9uID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyYW5nZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5uZ01vZGVsTG93ID0gc2NvcGUubmdNb2RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChfcmVmMiA9IHNjb3BlLnZhbHVlcykgIT09IG51bGwgPyBfcmVmMi5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNjb3BlLmNlaWxpbmcgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNlaWxpbmcgPSBzY29wZS52YWx1ZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5sb2NhbFtsb3ddID0gc2NvcGVbbG93XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5sb2NhbFtoaWdoXSA9IHNjb3BlW2hpZ2hdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IHdhdGNoYWJsZXMubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gd2F0Y2hhYmxlc1tfal07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZVt2YWx1ZV0gPSByb3VuZFN0ZXAocGFyc2VGbG9hdChzY29wZVt2YWx1ZV0pLCBwYXJzZUludChzY29wZS5wcmVjaXNpb24pLCBwYXJzZUZsb2F0KHNjb3BlLnN0ZXApLCBwYXJzZUZsb2F0KHNjb3BlLmZsb29yKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlSGFsZldpZHRoID0gaGFsZldpZHRoKG1pblB0cik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFyV2lkdGggPSB3aWR0aChiYXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbk9mZnNldCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4T2Zmc2V0ID0gYmFyV2lkdGggLSB3aWR0aChtaW5QdHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pblZhbHVlID0gcGFyc2VGbG9hdChzY29wZS5mbG9vcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4VmFsdWUgPSBwYXJzZUZsb2F0KHNjb3BlLmNlaWxpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlUmFuZ2UgPSBtYXhWYWx1ZSAtIG1pblZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldFJhbmdlID0gbWF4T2Zmc2V0IC0gbWluT2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvZmZzZXRSYW5nZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVET00gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYmluZCwgcGVyY2VudE9mZnNldCwgcGVyY2VudFZhbHVlLCBwaXhlbHNUb09mZnNldCwgc2V0QmluZGluZ3MsIHNldFBvaW50ZXJzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbnMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJjZW50T2Zmc2V0ID0gZnVuY3Rpb24ob2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluKCgob2Zmc2V0IC0gbWluT2Zmc2V0KSAvIG9mZnNldFJhbmdlKSAqIDEwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJjZW50VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGFpbigoKHZhbHVlIC0gbWluVmFsdWUpIC8gdmFsdWVSYW5nZSkgKiAxMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGl4ZWxzVG9PZmZzZXQgPSBmdW5jdGlvbihwZXJjZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwaXhlbGl6ZShwZXJjZW50ICogb2Zmc2V0UmFuZ2UgLyAxMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0UG9pbnRlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0hpZ2hWYWx1ZSwgbmV3TG93VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldChjZWlsQnViLCBwaXhlbGl6ZShiYXJXaWR0aCAtIHdpZHRoKGNlaWxCdWIpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0xvd1ZhbHVlID0gcGVyY2VudFZhbHVlKHNjb3BlLmxvY2FsW2xvd10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQobWluUHRyLCBwaXhlbHNUb09mZnNldChuZXdMb3dWYWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQobG93QnViLCBwaXhlbGl6ZShvZmZzZXRMZWZ0KG1pblB0cikgLSAoaGFsZldpZHRoKGxvd0J1YikpICsgaGFuZGxlSGFsZldpZHRoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldChzZWxlY3Rpb24sIHBpeGVsaXplKG9mZnNldExlZnQobWluUHRyKSArIGhhbmRsZUhhbGZXaWR0aCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgcmFuZ2U6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SGlnaFZhbHVlID0gcGVyY2VudFZhbHVlKHNjb3BlLmxvY2FsW2hpZ2hdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQobWF4UHRyLCBwaXhlbHNUb09mZnNldChuZXdIaWdoVmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQoaGlnaEJ1YiwgcGl4ZWxpemUob2Zmc2V0TGVmdChtYXhQdHIpIC0gKGhhbGZXaWR0aChoaWdoQnViKSkgKyBoYW5kbGVIYWxmV2lkdGgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZWN0aW9uLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBwaXhlbHNUb09mZnNldChuZXdIaWdoVmFsdWUgLSBuZXdMb3dWYWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgYXR0cmlidXRlcy5oaWdobGlnaHQgPT09ICdyaWdodCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGVjdGlvbi5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogcGl4ZWxzVG9PZmZzZXQoMTEwIC0gbmV3TG93VmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIGF0dHJpYnV0ZXMuaGlnaGxpZ2h0ID09PSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBwaXhlbHNUb09mZnNldChuZXdMb3dWYWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2Zmc2V0KHNlbGVjdGlvbiwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQgPSBmdW5jdGlvbihoYW5kbGUsIGJ1YmJsZSwgcmVmLCBldmVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRSZWYsIG9uRW5kLCBvbk1vdmUsIG9uU3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRSZWYgPSByZWY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWJibGUucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nRG9jdW1lbnQudW5iaW5kKGV2ZW50cy5tb3ZlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nRG9jdW1lbnQudW5iaW5kKGV2ZW50cy5lbmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNjb3BlLmRyYWdzdG9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGVbaGlnaF0gPSBzY29wZS5sb2NhbFtoaWdoXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZVtsb3ddID0gc2NvcGUubG9jYWxbbG93XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRSZWYgPSByZWY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXZlbnRYLCBuZXdPZmZzZXQsIG5ld1BlcmNlbnQsIG5ld1ZhbHVlLCBfcmVmMiwgX3JlZjMsIF9yZWY0LCBfcmVmNTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50WCA9IGV2ZW50LmNsaWVudFggfHwgKChfcmVmMiA9IGV2ZW50LnRvdWNoZXMpICE9PSBudWxsID8gKF9yZWYzID0gX3JlZjJbMF0pICE9PSBudWxsID8gX3JlZjMuY2xpZW50WCA6IHZvaWQgMCA6IHZvaWQgMCkgfHwgKChfcmVmNCA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQpICE9PSBudWxsID8gKF9yZWY1ID0gX3JlZjQuY2hhbmdlZFRvdWNoZXMpICE9PSBudWxsID8gX3JlZjVbMF0uY2xpZW50WCA6IHZvaWQgMCA6IHZvaWQgMCkgfHwgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld09mZnNldCA9IGV2ZW50WCAtIGVsZW1lbnRbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCAtIGhhbmRsZUhhbGZXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld09mZnNldCA9IE1hdGgubWF4KE1hdGgubWluKG5ld09mZnNldCwgbWF4T2Zmc2V0KSwgbWluT2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1BlcmNlbnQgPSBwZXJjZW50T2Zmc2V0KG5ld09mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IG1pblZhbHVlICsgKHZhbHVlUmFuZ2UgKiBuZXdQZXJjZW50IC8gMTAwLjApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJhbmdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChjdXJyZW50UmVmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgbG93OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID4gc2NvcGUubG9jYWxbaGlnaF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50UmVmID0gaGlnaDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5QdHIucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvd0J1Yi5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4UHRyLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWdoQnViLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRQb2ludGVycygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzY29wZS5idWZmZXIgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWUgPSBNYXRoLm1pbihuZXdWYWx1ZSwgc2NvcGUubG9jYWxbaGlnaF0gLSBzY29wZS5idWZmZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgaGlnaDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA8IHNjb3BlLmxvY2FsW2xvd10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50UmVmID0gbG93O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heFB0ci5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaEJ1Yi5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluUHRyLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb3dCdWIuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFBvaW50ZXJzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNjb3BlLmJ1ZmZlciA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IE1hdGgubWF4KG5ld1ZhbHVlLCBwYXJzZUludChzY29wZS5sb2NhbFtsb3ddKSArIHBhcnNlSW50KHNjb3BlLmJ1ZmZlcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gcm91bmRTdGVwKG5ld1ZhbHVlLCBwYXJzZUludChzY29wZS5wcmVjaXNpb24pLCBwYXJzZUZsb2F0KHNjb3BlLnN0ZXApLCBwYXJzZUZsb2F0KHNjb3BlLmZsb29yKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5sb2NhbFtjdXJyZW50UmVmXSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzY29wZS5kcmFnc3RvcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlW2N1cnJlbnRSZWZdID0gbmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRQb2ludGVycygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblN0YXJ0ID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS5kaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYW5kbGUuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpbWVuc2lvbnMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGUuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0UG9pbnRlcnMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nRG9jdW1lbnQuYmluZChldmVudHMubW92ZSwgb25Nb3ZlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZ0RvY3VtZW50LmJpbmQoZXZlbnRzLmVuZCwgb25FbmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlLmJpbmQoZXZlbnRzLnN0YXJ0LCBvblN0YXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEJpbmRpbmdzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZXRob2QsIF9qLCBfbGVuMSwgX3JlZjI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWYyID0gWyd0b3VjaCcsICdtb3VzZSddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZCA9IF9yZWYyW19qXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQobWluUHRyLCBsb3dCdWIsIGxvdywgZXZlbnRzW21ldGhvZF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZChtYXhQdHIsIGhpZ2hCdWIsIGhpZ2gsIGV2ZW50c1ttZXRob2RdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBib3VuZCA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWJvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEJpbmRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZXRQb2ludGVycygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KHVwZGF0ZURPTSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSB3YXRjaGFibGVzLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHcgPSB3YXRjaGFibGVzW19qXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2godywgdXBkYXRlRE9NLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlRE9NKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHF1YWxpZmllZERpcmVjdGl2ZURlZmluaXRpb24gPSBbJyR0aW1lb3V0Jywgc2xpZGVyRGlyZWN0aXZlXTtcblxuICAgIG1vZHVsZSA9IGZ1bmN0aW9uKHdpbmRvdywgYW5ndWxhcikge1xuICAgICAgICByZXR1cm4gYW5ndWxhci5tb2R1bGUoTU9EVUxFX05BTUUsIFtdKS5kaXJlY3RpdmUoU0xJREVSX1RBRywgcXVhbGlmaWVkRGlyZWN0aXZlRGVmaW5pdGlvbik7XG4gICAgfTtcblxuICAgIG1vZHVsZSh3aW5kb3csIHdpbmRvdy5hbmd1bGFyKTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qXG4gICAqIEFuZ3VsYXJKUyBOb3RpZnlcbiAgICogVmVyc2lvbjogMC40LjEyXG4gICAqXG4gICAqIENvcHlyaWdodCAyMDE1LTIwMTYgSmlyaSBLYXZ1bGFrLlxuICAgKiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICAgKiBVc2UsIHJlcHJvZHVjdGlvbiwgZGlzdHJpYnV0aW9uLCBhbmQgbW9kaWZpY2F0aW9uIG9mIHRoaXMgY29kZSBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBhbmRcbiAgICogY29uZGl0aW9ucyBvZiB0aGUgTUlUIGxpY2Vuc2UsIGF2YWlsYWJsZSBhdCBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICAgKlxuICAgKiBBdXRob3I6IE1vaGFuIFNpbmdoIDxzaW5naG1vaGFuY3NAZ21haWwuY29tPlxuICAgKi9cblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnbmdOb3RpZnknLCBbXSk7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ25nTm90aWZ5JylcbiAgICAuZmFjdG9yeSgnbm90aWZ5JywgWyckdGltZW91dCcsICckaHR0cCcsICckY29tcGlsZScsICckdGVtcGxhdGVDYWNoZScsICckcm9vdFNjb3BlJywgJyRkb2N1bWVudCcsXG4gICAgICBmdW5jdGlvbigkdGltZW91dCwgJGh0dHAsICRjb21waWxlLCAkdGVtcGxhdGVDYWNoZSwgJHJvb3RTY29wZSwgJGRvY3VtZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBzdGFydFRvcCA9IDU7XG4gICAgICAgIHZhciB2ZXJ0aWNhbFNwYWNpbmcgPSAxNTtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gMTAwMDA7XG4gICAgICAgIHZhciBkZWZhdWx0VGVtcGxhdGVVcmwgPSAnY29tcG9uZW50cy9ub3RpZnkvbm90aWZ5Lmh0bWwnO1xuICAgICAgICB2YXIgcG9zaXRpb24gPSAncmlnaHQnO1xuICAgICAgICB2YXIgY29udGFpbmVyID0gJGRvY3VtZW50WzBdLmJvZHk7XG5cbiAgICAgICAgX3RoaXMucG9zaXRpb25DbGFzcyA9ICdub3RpZnktdG9wLXJpZ2h0JztcblxuICAgICAgICB2YXIgbWVzc2FnZUVsZW1lbnRzID0gW107XG5cbiAgICAgICAgdmFyIG5vdGlmeSA9IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICAgICAgICBfdGhpcy50eXBlID0gX3RoaXMudHlwZSB8fCBhcmdzLnR5cGU7XG4gICAgICAgICAgaWYgKHR5cGVvZiBhcmdzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgYXJncyA9IHtcbiAgICAgICAgICAgICAgbWVzc2FnZTogYXJnc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYXJncy50ZW1wbGF0ZVVybCA9IGFyZ3MudGVtcGxhdGVVcmwgPyBhcmdzLnRlbXBsYXRlVXJsIDogZGVmYXVsdFRlbXBsYXRlVXJsO1xuICAgICAgICAgIGFyZ3MucG9zaXRpb24gPSBhcmdzLnBvc2l0aW9uID8gYXJncy5wb3NpdGlvbiA6IHBvc2l0aW9uO1xuICAgICAgICAgIGFyZ3MuY29udGFpbmVyID0gYXJncy5jb250YWluZXIgPyBhcmdzLmNvbnRhaW5lciA6IGNvbnRhaW5lcjtcbiAgICAgICAgICBhcmdzLmNsYXNzZXMgPSBhcmdzLmNsYXNzZXMgPyBhcmdzLmNsYXNzZXMgOiBfdGhpcy5wb3NpdGlvbkNsYXNzO1xuICAgICAgICAgIGFyZ3MudGl0bGUgPSBhcmdzLnRpdGxlID8gYXJncy50aXRsZSA6IChfdGhpcy50aXRsZSB8fCAnTm90aWZpY2F0aW9uJyk7XG5cbiAgICAgICAgICB2YXIgc2NvcGUgPSBhcmdzLnNjb3BlID8gYXJncy5zY29wZS4kbmV3KCkgOiAkcm9vdFNjb3BlLiRuZXcoKTtcbiAgICAgICAgICBzY29wZS4kbWVzc2FnZSA9IGFyZ3MubWVzc2FnZTtcbiAgICAgICAgICBzY29wZS4kY2xhc3NlcyA9IGFyZ3MuY2xhc3NlcztcbiAgICAgICAgICBzY29wZS4kbWVzc2FnZVRlbXBsYXRlID0gYXJncy5tZXNzYWdlVGVtcGxhdGU7XG4gICAgICAgICAgc2NvcGUuJHR5cGUgPSBfdGhpcy50eXBlO1xuICAgICAgICAgIHNjb3BlLiR0aXRsZSA9IGFyZ3MudGl0bGU7XG5cbiAgICAgICAgICAkaHR0cC5nZXQoYXJncy50ZW1wbGF0ZVVybCwge1xuICAgICAgICAgICAgY2FjaGU6ICR0ZW1wbGF0ZUNhY2hlXG4gICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbih0ZW1wbGF0ZSkge1xuXG4gICAgICAgICAgICB2YXIgdGVtcGxhdGVFbGVtZW50ID0gJGNvbXBpbGUodGVtcGxhdGUpKHNjb3BlKTtcbiAgICAgICAgICAgIHRlbXBsYXRlRWxlbWVudC5iaW5kKCd3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kIHRyYW5zaXRpb25lbmQgbXNUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICBpZiAoZS5wcm9wZXJ0eU5hbWUgPT09ICdvcGFjaXR5JyB8fCBlLmN1cnJlbnRUYXJnZXQuc3R5bGUub3BhY2l0eSA9PT0gMCB8fFxuICAgICAgICAgICAgICAgIChlLm9yaWdpbmFsRXZlbnQgJiYgZS5vcmlnaW5hbEV2ZW50LnByb3BlcnR5TmFtZSA9PT0gJ29wYWNpdHknKSkge1xuXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VFbGVtZW50cy5zcGxpY2UobWVzc2FnZUVsZW1lbnRzLmluZGV4T2YodGVtcGxhdGVFbGVtZW50KSwgMSk7XG4gICAgICAgICAgICAgICAgbGF5b3V0TWVzc2FnZXMoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChhcmdzLm1lc3NhZ2VUZW1wbGF0ZSkge1xuICAgICAgICAgICAgICB2YXIgbWVzc2FnZVRlbXBsYXRlRWxlbWVudDtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZW1wbGF0ZUVsZW1lbnQuY2hpbGRyZW4oKS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmVsZW1lbnQodGVtcGxhdGVFbGVtZW50LmNoaWxkcmVuKClbaV0pLmhhc0NsYXNzKCdjZy1ub3RpZnktbWVzc2FnZS10ZW1wbGF0ZScpKSB7XG4gICAgICAgICAgICAgICAgICBtZXNzYWdlVGVtcGxhdGVFbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KHRlbXBsYXRlRWxlbWVudC5jaGlsZHJlbigpW2ldKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAobWVzc2FnZVRlbXBsYXRlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VUZW1wbGF0ZUVsZW1lbnQuYXBwZW5kKCRjb21waWxlKGFyZ3MubWVzc2FnZVRlbXBsYXRlKShzY29wZSkpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY2dOb3RpZnkgY291bGQgbm90IGZpbmQgdGhlIC5jZy1ub3RpZnktbWVzc2FnZS10ZW1wbGF0ZSBlbGVtZW50IGluICcgKyBhcmdzLnRlbXBsYXRlVXJsICsgJy4nKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoYXJncy5jb250YWluZXIpLmFwcGVuZCh0ZW1wbGF0ZUVsZW1lbnQpO1xuICAgICAgICAgICAgbWVzc2FnZUVsZW1lbnRzLnB1c2godGVtcGxhdGVFbGVtZW50KTtcblxuICAgICAgICAgICAgaWYgKGFyZ3MucG9zaXRpb24gPT09ICdjZW50ZXInKSB7XG4gICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlRWxlbWVudC5jc3MoJ21hcmdpbi1sZWZ0JywgJy0nICsgKHRlbXBsYXRlRWxlbWVudFswXS5vZmZzZXRXaWR0aCAvIDIpICsgJ3B4Jyk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzY29wZS4kY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdGVtcGxhdGVFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICAgICAgICBsYXlvdXRNZXNzYWdlcygpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGxheW91dE1lc3NhZ2VzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHZhciBqID0gMDtcbiAgICAgICAgICAgICAgdmFyIGN1cnJlbnRZID0gc3RhcnRUb3A7XG4gICAgICAgICAgICAgIGZvciAodmFyIGkgPSBtZXNzYWdlRWxlbWVudHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICB2YXIgc2hhZG93SGVpZ2h0ID0gMTA7XG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBtZXNzYWdlRWxlbWVudHNbaV07XG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IGVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgIHZhciB0b3AgPSBjdXJyZW50WSArIGhlaWdodCArIHNoYWRvd0hlaWdodDtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5hdHRyKCdkYXRhLWNsb3NpbmcnKSkge1xuICAgICAgICAgICAgICAgICAgdG9wICs9IDIwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBjdXJyZW50WSArPSBoZWlnaHQgKyB2ZXJ0aWNhbFNwYWNpbmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsZW1lbnQuY3NzKCd0b3AnLCB0b3AgKyAncHgnKS5jc3MoJ21hcmdpbi10b3AnLCAnLScgKyAoaGVpZ2h0ICsgc2hhZG93SGVpZ2h0KSArICdweCcpLmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgaisrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgbGF5b3V0TWVzc2FnZXMoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoZHVyYXRpb24gPiAwKSB7XG4gICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNjb3BlLiRjbG9zZSgpO1xuICAgICAgICAgICAgICB9LCBkdXJhdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RlbXBsYXRlIHNwZWNpZmllZCBmb3IgY2dOb3RpZnkgKCcgKyBhcmdzLnRlbXBsYXRlVXJsICsgJykgY291bGQgbm90IGJlIGxvYWRlZC4gJyArIGRhdGEpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdmFyIHJldFZhbCA9IHt9O1xuXG4gICAgICAgICAgcmV0VmFsLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoc2NvcGUuJGNsb3NlKSB7XG4gICAgICAgICAgICAgIHNjb3BlLiRjbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJldFZhbCwgJ21lc3NhZ2UnLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gc2NvcGUuJG1lc3NhZ2U7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgc2NvcGUuJG1lc3NhZ2UgPSB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cblxuXG5cbiAgICAgICAgICByZXR1cm4gcmV0VmFsO1xuXG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBhZGROZXdOb3RpZnlFdmVudCBFdmVudCBoYW5kbGVyIHdoaWNoIGlzIGNhcHR1cmVkXG4gICAgICAgICAqXG4gICAgICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gJGV2ZW50IENhcHR1cmVkIGV2ZW50IGRhdGFcbiAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBhcmdzIERhdGEgd2hpY2ggaXMgYXR0YWNoZWQgdG8gYWRkTmV3Tm90aWZ5IGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgYWRkTmV3Tm90aWZ5RXZlbnQgPSAkcm9vdFNjb3BlLiRvbignYWRkTmV3Tm90aWZ5JywgZnVuY3Rpb24oJGV2ZW50LCBhcmdzKSB7XG4gICAgICAgICAgbm90aWZ5LmVycm9yKGFyZ3MpO1xuICAgICAgICB9KTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZSBldmVudCBmcm9tICRyb290U2NvcGVcbiAgICAgICAgICovXG4gICAgICAgICRyb290U2NvcGUuJG9uKCckZGVzdHJveScsIGFkZE5ld05vdGlmeUV2ZW50KTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGNvbmZpZyBTZXRzIE5vdGlmeSBjb25naWd1cmF0aW9uc1xuICAgICAgICAgKiBAbWV0aG9kIGNvbmZpZ1xuICAgICAgICAgKlxuICAgICAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGFyZ3MgQSBvYmplY3Qgd2hpY2ggaG9sZHMgY29uZmlndXJhdGlvbiBvZiBOb3RpZnlcbiAgICAgICAgICogQHJldHVybiB7Vm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIG5vdGlmeS5jb25maWcgPSBmdW5jdGlvbihhcmdzKSB7XG4gICAgICAgICAgc3RhcnRUb3AgPSAhYW5ndWxhci5pc1VuZGVmaW5lZChhcmdzLnN0YXJ0VG9wKSA/IGFyZ3Muc3RhcnRUb3AgOiBzdGFydFRvcDtcbiAgICAgICAgICB2ZXJ0aWNhbFNwYWNpbmcgPSAhYW5ndWxhci5pc1VuZGVmaW5lZChhcmdzLnZlcnRpY2FsU3BhY2luZykgPyBhcmdzLnZlcnRpY2FsU3BhY2luZyA6IHZlcnRpY2FsU3BhY2luZztcbiAgICAgICAgICBkdXJhdGlvbiA9ICFhbmd1bGFyLmlzVW5kZWZpbmVkKGFyZ3MuZHVyYXRpb24pID8gYXJncy5kdXJhdGlvbiA6IGR1cmF0aW9uO1xuICAgICAgICAgIGRlZmF1bHRUZW1wbGF0ZVVybCA9IGFyZ3MudGVtcGxhdGVVcmwgPyBhcmdzLnRlbXBsYXRlVXJsIDogZGVmYXVsdFRlbXBsYXRlVXJsO1xuICAgICAgICAgIHBvc2l0aW9uID0gIWFuZ3VsYXIuaXNVbmRlZmluZWQoYXJncy5wb3NpdGlvbikgPyBhcmdzLnBvc2l0aW9uIDogcG9zaXRpb247XG4gICAgICAgICAgY29udGFpbmVyID0gYXJncy5jb250YWluZXIgPyBhcmdzLmNvbnRhaW5lciA6IGNvbnRhaW5lcjtcbiAgICAgICAgICBfdGhpcy5wb3NpdGlvbkNsYXNzID0gYXJncy5wb3NpdGlvbkNsYXNzID8gYXJncy5wb3NpdGlvbkNsYXNzIDogJ25vdGlmeS10b3AtcmlnaHQnO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogQ2xvc2UgYWxsIG9wZW5lZCBOb3RpZmljYXRpb25zXG4gICAgICAgICAqIEBtZXRob2QgY2xvc2VBbGxcbiAgICAgICAgICpcbiAgICAgICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgICAgICogQHJldHVybiB7Vm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIG5vdGlmeS5jbG9zZUFsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGZvciAodmFyIGkgPSBtZXNzYWdlRWxlbWVudHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gbWVzc2FnZUVsZW1lbnRzW2ldO1xuICAgICAgICAgICAgZWxlbWVudC5jc3MoJ29wYWNpdHknLCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHN1Y2Nlc3Mgbm90aWZpY2F0aW9uXG4gICAgICAgICAqIEBtZXRob2Qgc3VjY2Vzc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGFyZ3MgW3RpdGxlLG1lc3NhZ2UsdHlwZS4uLmV0Y11cbiAgICAgICAgICogQHJldHVybiB7Vm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIG5vdGlmeS5zdWNjZXNzID0gZnVuY3Rpb24gc3VjY2VzcyhhcmdzKSB7XG4gICAgICAgICAgX3RoaXMudHlwZSA9ICdub3RpZnktc3VjY2Vzcyc7XG4gICAgICAgICAgX3RoaXMudGl0bGUgPSAnU3VjY2Vzcyc7XG4gICAgICAgICAgbm90aWZ5KGFyZ3MpO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBpbmZvcm1hdGlvbiBub3RpZmljYXRpb25cbiAgICAgICAgICogQG1ldGhvZCBpbmZvXG4gICAgICAgICAqXG4gICAgICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gYXJncyBbdGl0bGUsbWVzc2FnZSx0eXBlLi4uZXRjXVxuICAgICAgICAgKiBAcmV0dXJuIHtWb2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgbm90aWZ5LmluZm8gPSBmdW5jdGlvbiBpbmZvKGFyZ3MpIHtcbiAgICAgICAgICBfdGhpcy50eXBlID0gJ25vdGlmeS1pbmZvJztcbiAgICAgICAgICBfdGhpcy50aXRsZSA9ICdJbmZvcm1hdGlvbic7XG4gICAgICAgICAgbm90aWZ5KGFyZ3MpO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBlcnJvciBub3RpZmljYXRpb25cbiAgICAgICAgICogQG1ldGhvZCBlcnJvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGFyZ3MgW3RpdGxlLG1lc3NhZ2UsdHlwZS4uLmV0Y11cbiAgICAgICAgICogQHJldHVybiB7Vm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIG5vdGlmeS5lcnJvciA9IGZ1bmN0aW9uIGVycm9yKGFyZ3MpIHtcbiAgICAgICAgICBfdGhpcy50eXBlID0gJ25vdGlmeS1lcnJvcic7XG4gICAgICAgICAgX3RoaXMudGl0bGUgPSAnRXJyb3InO1xuICAgICAgICAgIG5vdGlmeShhcmdzKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgd2FybmluZyBub3RpZmljYXRpb25cbiAgICAgICAgICogQG1ldGhvZCB3YXJuaW5nXG4gICAgICAgICAqXG4gICAgICAgICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gYXJncyBbdGl0bGUsbWVzc2FnZSx0eXBlLi4uZXRjXVxuICAgICAgICAgKiBAcmV0dXJuIHtWb2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgbm90aWZ5Lndhcm5pbmcgPSBmdW5jdGlvbiB3YXJuaW5nKGFyZ3MpIHtcbiAgICAgICAgICBfdGhpcy50eXBlID0gJ25vdGlmeS13YXJuaW5nJztcbiAgICAgICAgICBfdGhpcy50aXRsZSA9ICdXYXJuaW5nJztcbiAgICAgICAgICBub3RpZnkoYXJncyk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHdhaXQgbm90aWZpY2F0aW9uXG4gICAgICAgICAqIEBtZXRob2Qgd2FpdFxuICAgICAgICAgKlxuICAgICAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGFyZ3MgW3RpdGxlLG1lc3NhZ2UsdHlwZS4uLmV0Y11cbiAgICAgICAgICogQHJldHVybiB7Vm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIG5vdGlmeS53YWl0ID0gZnVuY3Rpb24gd2FpdChhcmdzKSB7XG4gICAgICAgICAgX3RoaXMudHlwZSA9ICdub3RpZnktd2FpdCc7XG4gICAgICAgICAgX3RoaXMudGl0bGUgPSAnUGxlYXNlIHdhaXQnO1xuICAgICAgICAgIG5vdGlmeShhcmdzKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIG5vdGlmeTtcbiAgICAgIH1cbiAgICBdKTtcbn0pKHdpbmRvdywgZG9jdW1lbnQpOyIsIihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogQG5nZG9jIG92ZXJ2aWV3XG4gICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuQ29tcG9uZW50cy5tb2RhbFxuICAgKiBcbiAgICogQG1vZHVsZSBtb2RhbFxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogRXh0ZW5kcyAkbW9kYWwgc2VydmljZVxuICAgKlxuICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgKi9cbiAgYW5ndWxhci5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuQ29tcG9uZW50cy5tb2RhbCcsIFsndWkuYm9vdHN0cmFwJ10pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogQG5nZG9jIGZhY3RvcnlcbiAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLm1vZGFsLl8kbW9kYWxcbiAgICogXG4gICAqIEBtb2R1bGUgbW9kYWxcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEV4dGVuZHMgJG1vZGFsIHNlcnZpY2VcbiAgICpcbiAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoc2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAqL1xuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLm1vZGFsJylcbiAgICAuZmFjdG9yeSgnXyRtb2RhbCcsIFsnJG1vZGFsJywgZnVuY3Rpb24gKCRtb2RhbCkge1xuXG4gICAgICB2YXIgX21vZGFsID0gX21vZGFsIHx8IHt9LFxuICAgICAgICBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgICBrZXlib2FyZDogdHJ1ZSwgLy8ga2V5Ym9hcmRcbiAgICAgICAgICBiYWNrZHJvcDogdHJ1ZSwgLy8gYmFja2Ryb3BcbiAgICAgICAgICBzaXplOiAnbGcnLCAvLyB2YWx1ZXM6ICdzbScsICdsZycsICdtZCdcbiAgICAgICAgICB3aW5kb3dDbGFzczogJycsXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL21vZGFsL2NvbmZpcm0tbW9kYWwuaHRtbCdcbiAgICAgICAgfTtcblxuXG4gICAgICB2YXIgX3NldE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0cykge1xuICAgICAgICB2YXIgX29wdHMgPSB7fTtcbiAgICAgICAgX29wdHMgPSBvcHRzIHx8IHt9O1xuICAgICAgICBfb3B0cy5rYiA9IChhbmd1bGFyLmlzRGVmaW5lZChvcHRzLmtleWJvYXJkKSkgPyBvcHRzLmtleWJvYXJkIDogZGVmYXVsdE9wdGlvbnMua2V5Ym9hcmQ7IC8vIHZhbHVlczogdHJ1ZSxmYWxzZVxuICAgICAgICBfb3B0cy5iZCA9IChhbmd1bGFyLmlzRGVmaW5lZChvcHRzLmJhY2tkcm9wKSkgPyBvcHRzLmJhY2tkcm9wIDogZGVmYXVsdE9wdGlvbnMuYmFja2Ryb3A7IC8vIHZhbHVlczogJ3N0YXRpYycsdHJ1ZSxmYWxzZVxuICAgICAgICBfb3B0cy53cyA9IChhbmd1bGFyLmlzRGVmaW5lZChvcHRzLnNpemUpICYmIChhbmd1bGFyLmVxdWFscyhvcHRzLnNpemUsICdzbScpIHx8IGFuZ3VsYXIuZXF1YWxzKG9wdHMuc2l6ZSwgJ2xnJykgfHwgYW5ndWxhci5lcXVhbHMob3B0cy5zaXplLCAnbWQnKSkpID8gb3B0cy5zaXplIDogZGVmYXVsdE9wdGlvbnMuc2l6ZTsgLy8gdmFsdWVzOiAnc20nLCAnbGcnLCAnbWQnXG4gICAgICAgIF9vcHRzLndjID0gKGFuZ3VsYXIuaXNEZWZpbmVkKG9wdHMud2luZG93Q2xhc3MpKSA/IG9wdHMud2luZG93Q2xhc3MgOiBkZWZhdWx0T3B0aW9ucy53aW5kb3dDbGFzczsgLy8gYWRkaXRpb25hbCBDU1MgY2xhc3MoZXMpIHRvIGJlIGFkZGVkIHRvIGEgbW9kYWwgd2luZG93XG4gICAgICAgIF9vcHRzLnRlbXBsYXRlVXJsID0gKGFuZ3VsYXIuaXNEZWZpbmVkKG9wdHMudGVtcGxhdGVVcmwpKSA/IG9wdHMudGVtcGxhdGVVcmwgOiBkZWZhdWx0T3B0aW9ucy50ZW1wbGF0ZVVybDtcblxuICAgICAgICByZXR1cm4gX29wdHM7XG4gICAgICB9O1xuXG4gICAgICAvKipcbiAgICAgICAqIENvbmZpcm0gTW9kYWxcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gaGVhZGVyICBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSBtc2cgICBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSBvcHRzICBvYmplY3RcbiAgICAgICAqL1xuICAgICAgX21vZGFsLmNvbmZpcm0gPSBmdW5jdGlvbiAoaGVhZGVyLCBtc2csIG9wdHMpIHtcbiAgICAgICAgdmFyIF9vcHRzID0gX3NldE9wdGlvbnMob3B0cyk7XG5cbiAgICAgICAgcmV0dXJuICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogX29wdHMudGVtcGxhdGVVcmwsXG4gICAgICAgICAgY29udHJvbGxlcjogJ0NvbmZpcm1Nb2RhbENvbnRyb2xsZXInLFxuICAgICAgICAgIGJhY2tkcm9wOiBfb3B0cy5iZCxcbiAgICAgICAgICBrZXlib2FyZDogX29wdHMua2IsXG4gICAgICAgICAgd2luZG93Q2xhc3M6IF9vcHRzLndjLFxuICAgICAgICAgIHNpemU6IF9vcHRzLndzLFxuICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBoZWFkZXI6IGFuZ3VsYXIuY29weShoZWFkZXIpLFxuICAgICAgICAgICAgICAgIG1zZzogYW5ndWxhci5jb3B5KG1zZylcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pOyAvLyBlbmQgbW9kYWwub3BlblxuICAgICAgfTtcbiAgICAgIHJldHVybiBfbW9kYWw7XG5cbiAgfV0pO1xufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgQ29udHJvbGxlclxuICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLkNvbXBvbmVudHMubW9kYWwuQ29uZmlybU1vZGFsQ29udHJvbGxlclxuICAgKiBcbiAgICogQG1vZHVsZSBtb2RhbFxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogSGFuZGxlcyBjb25maXJtIG1vZGFscyBhY3Rpb25zXG4gICAqXG4gICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAqL1xuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLm1vZGFsJylcbiAgICAuY29udHJvbGxlcignQ29uZmlybU1vZGFsQ29udHJvbGxlcicsIFsnJHNjb3BlJyxcbiAgICAgICckbW9kYWxJbnN0YW5jZScsXG4gICAgICAnZGF0YScsXG4gICAgICBmdW5jdGlvbigkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBkYXRhKSB7XG5cbiAgICAgICAgJHNjb3BlLmhlYWRlciA9IChhbmd1bGFyLmlzRGVmaW5lZChkYXRhLmhlYWRlcikgJiYgKGRhdGEuaGVhZGVyICE9PSAnJykpID8gZGF0YS5oZWFkZXIgOiAnUGxlYXNlIGNvbmZpcm0nO1xuICAgICAgICAkc2NvcGUubXNnID0gKGFuZ3VsYXIuaXNEZWZpbmVkKGRhdGEubXNnKSkgPyBkYXRhLm1zZyA6ICdEbyB5b3Ugd2FudCB0byBwZXJmb3JtIHRoaXMgYWN0aW9uPyc7XG5cbiAgICAgICAgJHNjb3BlLm5vID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnbm8nKTtcbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLnllcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCd5ZXMnKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICBdKTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvKipcbiAgICogQG1vZHVsZSBMb2dnZXJcbiAgICogTG9nZ2VyIG1vZHVsZSBpcyB1c2UgZnVsbCBmb3IgZGVidWdnaW5nIGNvZGVcbiAgICpcbiAgICogVXNhZ2UgOlxuICAgKlxuICAgKiBhbmd1bGFyLm1vZHVsZSgnYXBwJykuY29udHJvbGxlcignQ29udHJvbGxlcicsWydMb2dnZXInLCBmdW5jdGlvbihMb2dnZXIpe1xuICAgKlxuICAgKiAgLy9HZXQgYW4gaW5zdGFuY2Ugb2YgQ29udHJvbGxlciB0byB0cmFjayBpbmZvXG4gICAqICB2YXIgbG9nZ2VyID0gTG9nZ2VyLmdldEluc3RhbmNlKCdDb250cm9sbGVyJyk7XG4gICAqICAvL1NpbXBsZSBpbmZvIGxvZ1xuICAgKiAgbG9nZ2VyLmxvZygnVGhpcyBpcyBhIGxvZycpO1xuICAgKiAgLy9JZiB5b3Ugd2FudCB0byBzaG93IGFueSB3YXJuaW5nXG4gICAqICBsb2dnZXIud2Fybignd2FybicsICdUaGlzIGlzIGEgd2FybicpO1xuICAgKiAgLy9TaG93IGVycm9yIGxvZ1xuICAgKiAgbG9nZ2VyLmVycm9yKCdUaGlzIGlzIGEgezB9IGVycm9yISB7MX0nLCBbICdiaWcnLCAnanVzdCBraWRkaW5nJyBdKTtcbiAgICogIC8vRGVidWcgZXJyb3JcbiAgICogIGxvZ2dlci5kZWJ1ZygnZGVidWcnLCAnVGhpcyBpcyBhIGRlYnVnIGZvciBsaW5lIHswfScsIFsgOCBdKTtcbiAgICpcbiAgICogfV0pO1xuICAgKlxuICAgKlxuICAgKiBTaW1pbGFyIGltcGxlbWVudGFpb24gd2l0aCBkaXJlY3RpdmUsIHNlcnZpY2UsIGZhY3RvcnkgZXRjLlxuICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgKiovXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdsb2dnZXInLCBbXSlcbiAgICAucHJvdmlkZXIoJ0xvZ2dlcicsIFtcblxuICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBmbGFnIHRvIGhvbGRzIGJvb2xlYW4gdmFsdWVcbiAgICAgICAgICogQFRydWUge2Jvb2x9XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgaXNFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCBpc0VuYWJsZWQgZmxhZyB0byBbdHJ1ZXxmYWxzZV1cbiAgICAgICAgICogQG1ldGhvZCBlbmFibGVkXG4gICAgICAgICAqIEBwYXJhbSAge1tib29sZWFuXX0gX2lzRW5hYmxlZCBGbGFnIHRvIHNldCBbdHJ1ZXxmYWxzZV1cbiAgICAgICAgICogQHJldHVybiB7W3ZvaWRdfVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5lbmFibGVkID0gZnVuY3Rpb24oX2lzRW5hYmxlZCkge1xuICAgICAgICAgIGlzRW5hYmxlZCA9ICEhX2lzRW5hYmxlZDtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvZ2dlciBwcm92aWRlciBjb25zdHJ1Y3Qgd2hpY2ggcmV0dXJuZWQgd2hpbGUgcHJvdmlkZSBpcyB1c2VkIGluIGNvbnRyb2xsZXJcbiAgICAgICAgICogU2VydmljZXMgYW5kIGZhY3Rvcnkgb3IgZGlyZWN0aXZlXG4gICAgICAgICAqIEByZXF1aXJlcyAkbG9nIEFuZ3VsYXIgJGxvZyBzZXJ2aWNlXG4gICAgICAgICAqIEBUcnVlIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuJGdldCA9IFsnJGxvZycsXG4gICAgICAgICAgZnVuY3Rpb24oJGxvZykge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBMb2dnZXIgY2xhc3NcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIExvZ2dlclxuICAgICAgICAgICAgICogQHBhcmFtICB7W09iamVjdF19IGNvbnRleHQgW2NvbnRyb2xsZXIsIHNlcnZpY2UsIGZhY3RvcnkgZXRjLi4uXVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgTG9nZ2VyID0gZnVuY3Rpb24oY29udGV4dCkge1xuICAgICAgICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogUmV0dXJucyBjb250ZXh0XG4gICAgICAgICAgICAgKiBAbWV0aG9kIGdldEluc3RhbmNlXG4gICAgICAgICAgICAgKiBAcGFyYW0gIHtbT2JqZWN0XX0gY29udGV4dCBbY29udHJvbGxlciwgc2VydmljZSwgZmFjdG9yeSBldGMuLi5dXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIExvZ2dlci5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG5ldyBMb2dnZXIoY29udGV4dCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBSZXR1cm5zIGFuIHN0cmluZyBiYXNlZCBvbiBzdXBwbGllZCBhcmd1bWVudHNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAbWV0aG9kIHN1cHBsYW50XG4gICAgICAgICAgICAgKiBAcGFyYW0gIHtbc3RyaW5nXX0gc3RyIG1lc3NhZ2Ugc3RyaW5nXG4gICAgICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IG8gICB0eXBlXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtbdm9pZF19XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIExvZ2dlci5zdXBwbGFudCA9IGZ1bmN0aW9uKHN0ciwgbykge1xuICAgICAgICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgL1xceyhbXnt9XSopXFx9L2csXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgICAgdmFyIHIgPSBvW2JdO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiByID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgciA9PT0gJ251bWJlcicgPyByIDogYTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBSZXR1cm5zIGxvZ2dlciB0aW1lXG4gICAgICAgICAgICAgKiBAbWV0aG9kIGdldEZvcm1hdHRlZFRpbWVzdGFtcFxuICAgICAgICAgICAgICogQHBhcmFtICB7W3N0cmluZ119ICAgICAgICAgICAgICBkYXRlIGxvZ2dlZCBkYXRlXG4gICAgICAgICAgICAgKiBAcmV0dXJuIHtbdm9pZF19XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIExvZ2dlci5nZXRGb3JtYXR0ZWRUaW1lc3RhbXAgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBMb2dnZXIuc3VwcGxhbnQoJ3swfTp7MX06ezJ9OnszfScsIFtcbiAgICAgICAgICAgICAgICBkYXRlLmdldEhvdXJzKCksXG4gICAgICAgICAgICAgICAgZGF0ZS5nZXRNaW51dGVzKCksXG4gICAgICAgICAgICAgICAgZGF0ZS5nZXRTZWNvbmRzKCksXG4gICAgICAgICAgICAgICAgZGF0ZS5nZXRNaWxsaXNlY29uZHMoKVxuICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIExldHMgYWRkIHNvbWUgbWV0aG9kcyB0byBMb2dnZXIncyBwcm90b3R5cGVcbiAgICAgICAgICAgICAqIEBUcnVlIHtPYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIExvZ2dlci5wcm90b3R5cGUgPSB7XG4gICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgKiBMb2cgbWVzc2FnZXNcbiAgICAgICAgICAgICAgICogQ2hlY2sgaWYgbG9nZ2VyIGVuYWJsZWRcbiAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICogQG1ldGhvZCAgX2xvZ1xuICAgICAgICAgICAgICAgKiBAcGFyYW0gICB7W29iamVjdF19IG9yaWdpbmFsRm4gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICogQHBhcmFtICAge1thcnJheSB8IG9iamVjdF19IGFyZ3MgICAgICAgYXJndW1lbnRzXG4gICAgICAgICAgICAgICAqIEByZXR1cm4gIHtbdm9pZF19XG4gICAgICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICBfbG9nOiBmdW5jdGlvbihvcmlnaW5hbEZuLCBhcmdzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc0VuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgbm93ID0gTG9nZ2VyLmdldEZvcm1hdHRlZFRpbWVzdGFtcChuZXcgRGF0ZSgpKTtcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9ICcnLFxuICAgICAgICAgICAgICAgICAgc3VwcGxhbnREYXRhID0gW107XG4gICAgICAgICAgICAgICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gTG9nZ2VyLnN1cHBsYW50KCd7MH0gLSB7MX06IHsyfScsIFtub3csIHRoaXMuY29udGV4dCwgYXJnc1swXV0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgc3VwcGxhbnREYXRhID0gYXJnc1syXTtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IExvZ2dlci5zdXBwbGFudCgnezB9IC0gezF9Ojp7Mn0oXFwnezN9XFwnKScsIFtub3csIHRoaXMuY29udGV4dCwgYXJnc1swXSwgYXJnc1sxXV0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmdzWzFdID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBMb2dnZXIuc3VwcGxhbnQoJ3swfSAtIHsxfTo6ezJ9KFxcJ3szfVxcJyknLCBbbm93LCB0aGlzLmNvbnRleHQsIGFyZ3NbMF0sIGFyZ3NbMV1dKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBzdXBwbGFudERhdGEgPSBhcmdzWzFdO1xuICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBMb2dnZXIuc3VwcGxhbnQoJ3swfSAtIHsxfTogezJ9JywgW25vdywgdGhpcy5jb250ZXh0LCBhcmdzWzBdXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJGxvZ1tvcmlnaW5hbEZuXS5jYWxsKG51bGwsIExvZ2dlci5zdXBwbGFudChtZXNzYWdlLCBzdXBwbGFudERhdGEpKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAqIExvZyBkZWZhdWx0IG1lc3NhZ2VcbiAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICogQG1ldGhvZCBsb2dcbiAgICAgICAgICAgICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgIGxvZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nKCdsb2cnLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICogTG9nIGluZm8gbWVzc2FnZVxuICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgKiBAbWV0aG9kIGluZm9cbiAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgIGluZm86IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZygnaW5mbycsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgKiBMb2cgd2FybiBtZXNzYWdlXG4gICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAqIEBtZXRob2Qgd2FyblxuICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgd2FybjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nKCd3YXJuJywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAqIExvZyBkZWJ1ZyBtZXNzYWVcbiAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICogQG1ldGhvZCBkZWJ1Z1xuICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgZGVidWc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZygnZGVidWcnLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICogTG9nIGVycm9yIG1lc3NhZ2VcbiAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICogQG1ldGhvZCBlcnJvclxuICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZygnZXJyb3InLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIExvZ2dlcjtcbiAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgICB9XG4gICAgXSk7XG59KSgpOyIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuQ29yZScpXG4gICAgLmZhY3RvcnkoJ0xhbmd1YWdlJywgZnVuY3Rpb24gKCRxLCAkaHR0cCwgJHRyYW5zbGF0ZSwgTEFOR1VBR0VTKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXRDdXJyZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICAgICB2YXIgbGFuZ3VhZ2UgPSAkdHJhbnNsYXRlLnN0b3JhZ2UoKS5nZXQoJ05HX1RSQU5TTEFURV9MQU5HX0tFWScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQobGFuZ3VhZ2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlID0gJ2VuJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGxhbmd1YWdlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRBbGw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoTEFOR1VBR0VTKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KVxuXG4vKlxuIExhbmd1YWdlcyBjb2RlcyBhcmUgSVNPXzYzOS0xIGNvZGVzLCBzZWUgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MaXN0X29mX0lTT182MzktMV9jb2Rlc1xuIFRoZXkgYXJlIHdyaXR0ZW4gaW4gRW5nbGlzaCB0byBhdm9pZCBjaGFyYWN0ZXIgZW5jb2RpbmcgaXNzdWVzIChub3QgYSBwZXJmZWN0IHNvbHV0aW9uKVxuICovXG4gICAgLmNvbnN0YW50KCdMQU5HVUFHRVMnLCBbXG4gICAgICAgICdlbicsICdmcidcbiAgICAgICAgLy9hZGQgbmV3IGxhbmd1YWdlcyBoZXJlXG4gICAgXVxuKTtcblxuXG5cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5Db3JlJylcbiAgICAuY29udHJvbGxlcignTGFuZ3VhZ2VDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHRyYW5zbGF0ZSwgTGFuZ3VhZ2UpIHtcbiAgICAgICAgJHNjb3BlLmNoYW5nZUxhbmd1YWdlID0gZnVuY3Rpb24gKGxhbmd1YWdlS2V5KSB7XG4gICAgICAgICAgICAkdHJhbnNsYXRlLnVzZShsYW5ndWFnZUtleSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgTGFuZ3VhZ2UuZ2V0QWxsKCkudGhlbihmdW5jdGlvbiAobGFuZ3VhZ2VzKSB7XG4gICAgICAgICAgICAkc2NvcGUubGFuZ3VhZ2VzID0gbGFuZ3VhZ2VzO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvKipcbiAgICogQG5nZG9jIG92ZXJ2aWV3XG4gICAqIEBuYW1lIEZpbHRlcnNcbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkNvbXBvbmVudHMuRmlsdGVyc1xuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhpcyBtb2R1bGUgaXMgYSBidW5kbGUgb2YgYWxsIGN1c3RvbSBmaWx0ZXJzXG4gICAqXG4gICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAqL1xuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLkZpbHRlcnMnLCBbXSk7XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyoqXG4gICAgICogQG5nZG9jIEZpbHRlclxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuQ29tcG9uZW50cy5GaWx0ZXJzLnByb3BzRmlsdGVyXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkNvbXBvbmVudHMuRmlsdGVyc1xuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogcHJvcHNGaWx0ZXIgaXMgdXNlZCBmb3IgdWktc2VsZWN0IGNvbXBvbmVudFxuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuQ29tcG9uZW50cy5GaWx0ZXJzJylcbiAgICAgICAgLmZpbHRlcigncHJvcHNGaWx0ZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihpdGVtcywgcHJvcHMpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3V0ID0gW107XG5cbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KGl0ZW1zKSkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtTWF0Y2hlcyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHByb3BzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IHByb3BzW3Byb3BdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW1bcHJvcF0udG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGV4dCkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1NYXRjaGVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbU1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTGV0IHRoZSBvdXRwdXQgYmUgdGhlIGlucHV0IHVudG91Y2hlZFxuICAgICAgICAgICAgICAgICAgICBvdXQgPSBpdGVtcztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLyoqXG4gICAqIEBuZ2RvYyBGaWx0ZXJcbiAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLkZpbHRlcnMudHJ1bmNhdGVXb3Jkc1xuICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuQ29tcG9uZW50cy5GaWx0ZXJzXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiB0cnVuY2F0ZVdvcmRzIGlzIHVzZWQgdG8gdHJ1bmNhdGUgd29yZHMgYnkgZ2l2ZW4gbGVuZ3RoXG4gICAqXG4gICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAqL1xuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLkZpbHRlcnMnKVxuICAgIC5maWx0ZXIoJ3RydW5jYXRlV29yZHMnLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihpbnB1dCwgd29yZHMpIHtcbiAgICAgICAgaWYgKGlzTmFOKHdvcmRzKSkge1xuICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfVxuICAgICAgICBpZiAod29yZHMgPD0gMCkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5wdXQpIHtcbiAgICAgICAgICB2YXIgaW5wdXRXb3JkcyA9IGlucHV0LnNwbGl0KC9cXHMrLyk7XG4gICAgICAgICAgaWYgKGlucHV0V29yZHMubGVuZ3RoID4gd29yZHMpIHtcbiAgICAgICAgICAgIGlucHV0ID0gaW5wdXRXb3Jkcy5zbGljZSgwLCB3b3Jkcykuam9pbignICcpICsgJy4uLic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgIH07XG4gICAgfSk7XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvKipcbiAgICogQG5nZG9jIEZpbHRlclxuICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLkNvbXBvbmVudHMuRmlsdGVycy50cnVuY2F0ZUNoYXJhY3RlcnNcbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkNvbXBvbmVudHMuRmlsdGVyc1xuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogdHJ1bmNhdGVDaGFyYWN0ZXJzIGlzIHVzZWQgdG8gdHJ1bmNhdGUgQ2hhcmFjdGVycyBieSBnaXZlbiBsZW5ndGhcbiAgICpcbiAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICovXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkNvbXBvbmVudHMuRmlsdGVycycpXG4gICAgLmZpbHRlcigndHJ1bmNhdGVDaGFyYWN0ZXJzJywgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oaW5wdXQsIGNoYXJzLCBicmVha09uV29yZCkge1xuICAgICAgICBpZiAoaXNOYU4oY2hhcnMpKSB7XG4gICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGFycyA8PSAwKSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnB1dCAmJiBpbnB1dC5sZW5ndGggPiBjaGFycykge1xuICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyaW5nKDAsIGNoYXJzKTtcblxuICAgICAgICAgIGlmICghYnJlYWtPbldvcmQpIHtcbiAgICAgICAgICAgIHZhciBsYXN0c3BhY2UgPSBpbnB1dC5sYXN0SW5kZXhPZignICcpO1xuICAgICAgICAgICAgLy8gR2V0IGxhc3Qgc3BhY2VcbiAgICAgICAgICAgIGlmIChsYXN0c3BhY2UgIT09IC0xKSB7XG4gICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQuc3Vic3RyKDAsIGxhc3RzcGFjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdoaWxlIChpbnB1dC5jaGFyQXQoaW5wdXQubGVuZ3RoIC0gMSkgPT09ICcgJykge1xuICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cigwLCBpbnB1dC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGlucHV0ICsgJy4uLic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgfTtcbiAgICB9KTtcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZmFjdG9yeVxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuQ29yZS5mYWN0b3J5Lm5vdGlmaWNhdGlvbkludGVyY2VwdG9yXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkNvcmVcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEFuIGludGVyY2VwdG9yIHRvIHJlYWQgdGhlIGhlYWRlciByZXNwb25zZSByZXF1ZXN0XG4gICAgICpcbiAgICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgICAqL1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5Db3JlJylcbiAgICAgICAgLmZhY3RvcnkoJ25vdGlmaWNhdGlvbkludGVyY2VwdG9yJywgWyckcScsICdBbGVydFNlcnZpY2UnLCBmdW5jdGlvbigkcSwgQWxlcnRTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWxlcnRLZXkgPSByZXNwb25zZS5oZWFkZXJzKCdYLWJlYXV0eUNvbGxlY3RpdmUtYWxlcnQnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNTdHJpbmcoYWxlcnRLZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBBbGVydFNlcnZpY2Uuc3VjY2VzcyhhbGVydEtleSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtOiByZXNwb25zZS5oZWFkZXJzKCdYLWJlYXV0eUNvbGxlY3RpdmUtcGFyYW1zJylcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZmFjdG9yeVxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuQ29yZS5mYWN0b3J5LmVycm9ySGFuZGxlckludGVyY2VwdG9yXG4gICAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkNvcmVcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEFuIGludGVyY2VwdG9yIHRvIHJlYWQgdGhlIGVycm9yIHJlc3BvbnNlIG9mIGh0dHAgcmVxdWVzdFxuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuQ29yZScpXG4gICAgICAgIC5mYWN0b3J5KCdlcnJvckhhbmRsZXJJbnRlcmNlcHRvcicsIFsnJHEnLCAnJHJvb3RTY29wZScsIGZ1bmN0aW9uKCRxLCAkcm9vdFNjb3BlKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlRXJyb3I6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHJlc3BvbnNlLnN0YXR1cyA9PSA0MDEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCdCZWF1dHlDb2xsZWN0aXZlLmh0dHBFcnJvcicsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XSk7XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG4gIC8qKlxuICAgKiBAbmdkb2Mgb3ZlcnZpZXdcbiAgICogQG5hbWUgRmFuY3lEcm9wRG93blxuICAgKiBAbW9kdWxlIEZhbmN5RHJvcERvd25cbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEhhcyBjdXN0b20gaW1wbGVtZW50YXRpb24gb2YgZHJvcGRvd25zIGJ1aWx0IGJ5IGFuZ3VsYXIgVUkgVGVhbVxuICAgKlxuICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgKi9cblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnRmFuY3lEcm9wRG93bicsIFtdKTtcblxuICAvKipcbiAgICogQG5nZG9jIERpcmVjdGl2ZVxuICAgKiBAbmFtZSBGYW5jeURyb3BEb3duLkRpcmVjdGl2ZS5mYW5jeURyb3Bkb3duXG4gICAqIEBtb2R1bGUgRmFuY3lEcm9wRG93blxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQWRqdXN0IGRyb3Bkb3duIHVwL2Rvd24gYnkgZGV0ZXJtaW5pbmcgdGhlIHdpbmRvdyBvZmZzZXRzXG4gICAqIFxuICAgKiBFeGFtcGxlXG4gICAqICA8ZGl2IGRyb3Bkb3duPVwiXCIga2V5Ym9hcmQtbmF2PVwiXCIgZmFuY3ktZHJvcGRvd24gY2xvc2Utb24tc2VsZWN0PVwiZmFsc2VcIj5cbiAgICAgICAgPGEgaHJlZj1cIlwiIGlkPVwiY2hvaWNlRHJvcGRvd25cIiBuYW1lPVwiY2hvaWNlRHJvcGRvd25cIiBkcm9wZG93bi10b2dnbGU9XCJkcm9wZG93blwiPlxuICAgICAgICAgIENsaWNrIG1lIGZvciBhIGRyb3Bkb3duLCB5byEgIHt7IHNlbGYuc2VsZWN0aW9uMS5UZXh0IH19XG4gICAgICAgIDwvYT5cbiAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHQgZHJvcGRvd24tbWVudSBmYW5jeS1kcm9wZG93blwiIHJvbGU9XCJtZW51XCIgYXJpYS1sYWJlbGxlZGJ5PVwic2ltcGxlLWJ0bi1rZXlib2FyZC1uYXZcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZyBkcm9wZG93bi1oZWFkaW5nXCI+XG4gICAgICAgICAgICA8c3Bhbj5TZWxlY3QgdGVhbSBtZW1iZXI8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmcgZHJvcGRvd24tZmlsdGVyXCI+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHBsYWNlaG9sZGVyPVwiVGV4dCBpbnB1dFwiIG5nLW1vZGVsPVwicXVlcnlcIiAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5IGRyb3Bkb3duLWJvZHlcIj5cbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtZ3JvdXBcIj5cbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCIgbmctcmVwZWF0PVwiY2hvaWNlIGluIHNlbGYuY2hvaWNlcyB8IGZpbHRlcjpxdWVyeVwiIHJvbGU9XCJtZW51aXRlbVwiIG5nLWNsYXNzPVwieyAnc2VsZWN0ZWQtZHJvcGRvd24taXRlbScgOiBjaG9pY2UuSUQgPT0gc2VsZi5zZWxlY3Rpb24xLklEIH1cIj5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIG5nLWNsaWNrPVwic2VsZi5zZXRDaG9pY2UoY2hvaWNlLklEKVwiPnt7IGNob2ljZS5UZXh0IH19PC9hPlxuICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj4gXG4gICAqIHNlbGYgaXMgeW91ciBjb250cm9sbGVyIGFsaWFzIGluc3RlYWQgb2YgdXNpbmcgc2NvcGUgaW4gY29udHJvbGxlciBcbiAgICogIFxuICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgKi9cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ0ZhbmN5RHJvcERvd24nKVxuICAgIC5kaXJlY3RpdmUoJ2ZhbmN5RHJvcGRvd24nLCBmYW5jeURyb3Bkb3duRGlyZWN0aXZlKTtcblxuICAvKiBAbmdJbmplY3QgKi9cbiAgZnVuY3Rpb24gZmFuY3lEcm9wZG93bkRpcmVjdGl2ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgIHNjb3BlOiB7XG5cbiAgICAgIH0sXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgdmFyIGlzRHJvcFVwID0gZmFsc2UsXG4gICAgICAgICAgY2xvc2VPblNlbGVjdCA9IGF0dHJzLmNsb3NlT25TZWxlY3QgfHwgdHJ1ZTtcblxuICAgICAgICBlbGVtZW50LmJpbmQoJ2NsaWNrJywgVG9nZ2xlRHJvcFVwKVxuXG4gICAgICAgIGZ1bmN0aW9uIFRvZ2dsZURyb3BVcCgkZXZlbnQpIHtcbiAgICAgICAgICB2YXIgZHJvcGRvd25Db250YWluZXIgPSAkZXZlbnQuY3VycmVudFRhcmdldCxcbiAgICAgICAgICAgIHBvc2l0aW9uID0gZHJvcGRvd25Db250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wLFxuICAgICAgICAgICAgYnV0dG9uSGVpZ2h0ID0gZHJvcGRvd25Db250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0LFxuICAgICAgICAgICAgZHJvcGRvd25NZW51ID0gYW5ndWxhci5lbGVtZW50KGRyb3Bkb3duQ29udGFpbmVyKS5maW5kKCcuZHJvcGRvd24tbWVudScpLFxuICAgICAgICAgICAgbWVudUhlaWdodCA9IGRyb3Bkb3duTWVudS5vdXRlckhlaWdodCgpLFxuICAgICAgICAgICAgJHdpbiA9ICQod2luZG93KTtcblxuICAgICAgICAgIGlmIChwb3NpdGlvbiA+IG1lbnVIZWlnaHQgJiYgJHdpbi5oZWlnaHQoKSAtIHBvc2l0aW9uIDwgYnV0dG9uSGVpZ2h0ICsgbWVudUhlaWdodCkge1xuICAgICAgICAgICAgaXNEcm9wVXAgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpc0Ryb3BVcCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpc0Ryb3BVcCA/IGVsZW1lbnQuYWRkQ2xhc3MoJ2Ryb3B1cCcpIDogKGVsZW1lbnQuaGFzQ2xhc3MoJ2Ryb3B1cCcpID8gZWxlbWVudC5yZW1vdmVDbGFzcygnZHJvcHVwJykgOiAnJyk7XG5cbiAgICAgICAgICBpZiAoY2xvc2VPblNlbGVjdCkge1xuICAgICAgICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxufSgpKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvKipcbiAgICogQG5nZG9jIG92ZXJ2aWV3XG4gICAqIEBuYW1lIERpcmVjdHZpZXNcbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkNvbXBvbmVudHMuRGlyZWN0dmllc1xuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhpcyBtb2R1bGUgaXMgYSBidW5kbGUgb2YgYWxsIGN1c3RvbSBEaXJlY3R2aWVzXG4gICAqXG4gICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAqL1xuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLkRpcmVjdHZpZXMnLCBbXSk7XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvKipcbiAgICogQG5nZG9jIERpcmVjdGl2ZVxuICAgKiBAbmFtZSBCZWF1dHlDb2xsZWN0aXZlLkNvbXBvbmVudHMuRGlyZWN0dmllcy5EaXJlY3RpdmUuc2Nyb2xsVG9Ub3BXaGVuXG4gICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLkRpcmVjdHZpZXNcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFNjcm9sbCBhbnkgaHRtbCBFbGVtZW50IHRvIHRhcmdldCBwaXhlbHNcbiAgICpcbiAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICovXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkNvbXBvbmVudHMuRGlyZWN0dmllcycpXG4gICAgLmRpcmVjdGl2ZSgnc2Nyb2xsVG9Ub3BXaGVuJywgU2Nyb2xsVG9Ub3BXaGVuKTtcblxuICAvKiBAbmdJbmplY3QgKi9cbiAgZnVuY3Rpb24gU2Nyb2xsVG9Ub3BXaGVuKCR0aW1lb3V0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgc2NvcGUuJG9uKGF0dHJzLnNjcm9sbFRvVG9wV2hlbiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudClbMF0uc2Nyb2xsVG9wID0gZWxlbWVudC5maW5kKCcudGFyZ2V0JykucHJvcCgnb2Zmc2V0VG9wJyk7XG4gICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLyoqXG4gICAqIEBuZ2RvYyBEaXJlY3RpdmVcbiAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLkRpcmVjdHZpZXMuRGlyZWN0aXZlLnJlc2l6ZUJhY2tncm91bmRcbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkNvbXBvbmVudHMuRGlyZWN0dmllc1xuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQWRqdXN0IHRoZSBiYWNrZ3JvdW5kIGltYWdlIHdoZW4gd2luZG93IGlzIHJlc2l6ZWRcbiAgICpcbiAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICovXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkNvbXBvbmVudHMuRGlyZWN0dmllcycpXG4gICAgLmRpcmVjdGl2ZSgncmVzaXplQmFja2dyb3VuZCcsIFJlc2l6ZUJhY2tncm91bmQpO1xuXG4gIC8qIEBuZ0luamVjdCAqL1xuICBmdW5jdGlvbiBSZXNpemVCYWNrZ3JvdW5kKCR3aW5kb3cpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICB2YXIgJGltZyA9IGVsZW1lbnQuZmluZCgnPiBpbWcnKTtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkaW1nLmF0dHIoJ3N0eWxlJywgJycpO1xuICAgICAgICAgIGlmICgkaW1nLmhlaWdodCgpIDwgZWxlbWVudC5oZWlnaHQoKSkge1xuICAgICAgICAgICAgJGltZy5jc3Moe1xuICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgd2lkdGg6ICdhdXRvJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgLyoqXG4gICAqIEBuZ2RvYyBEaXJlY3RpdmVcbiAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLkRpcmVjdHZpZXMuRGlyZWN0aXZlLnJlbWFpbmluZ0NoYXJhY3RlcnNcbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkNvbXBvbmVudHMuRGlyZWN0dmllcy5cbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIHJlbWFpbmluZ0NoYXJhY3RlcnNcbiAgICogdGhpcyBkaWVjdGl2ZSBpcyB1c2VkIHRvIHNob3cgdGhlIHJlbWFpbmluZyBDaGFyYWN0ZXJzXG4gICAqXG4gICAqIEByZXF1aXJlZCBcbiAgICogbWF4bGVuZ3RoIGF0dHJpYnV0ZSBpcyByZXF1aXJlZFxuICAgKlxuICAgKiBVc2FnZSA6XG4gICAqID1mb3Igc2ltcGxlIGlucHV0IHRleHQgb3IgdGV4dGFyZWFcbiAgICogPGltcHV0IHR5cGU9XCJ0ZXh0XCIgbmctbW9kZWw9XCJtb2RlbG9iamVjdFwiIHJlbWFpbmluZy1jaGFyYWN0ZXJzIGRhdGEtbWF4bGVuZ3RoPVwiMjAwXCIgLz5cbiAgICogPHRleHRhcmVhIG5nLW1vZGVsPVwibW9kZWxvYmplY3RcIiByZW1haW5pbmctY2hhcmFjdGVycyBkYXRhLW1heGxlbmd0aD1cIjIwMFwiID48L3RleHRhcmVhPlxuICAgKiBcbiAgICogPWVkaXRhYmxlIGZpZWxkXG4gICAqIDxzdHJvbmcgZWRpdGFibGUtdGV4dD1cImNoZWNrbGlzdC50aXRsZVwiIGUtbWF4bGVuZ3RoPVwiMzAwXCIgZGF0YS1tYXhsZW5ndGg9XCIzMDBcIiByZW1haW5pbmctY2hhcmFjdGVycyA+dGV4dCBjb250ZW50PC9zdHJvbmc+XG4gICAqL1xuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLkRpcmVjdHZpZXMnKVxuICAgIC5kaXJlY3RpdmUoJ3JlbWFpbmluZ0NoYXJhY3RlcnMnLCBbJyRjb21waWxlJywgZnVuY3Rpb24oJGNvbXBpbGUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIHJlcXVpcmU6ICc/bmdNb2RlbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBpQXR0cnMsIG5nTW9kZWwpIHtcbiAgICAgICAgICB2YXIgbWF4Q2hhcnMgPSBwYXJzZUludChpQXR0cnMubWF4bGVuZ3RoKSxcbiAgICAgICAgICAgIHRlbXBsYXRlID0gJGNvbXBpbGUoJzxwIG5nLXNob3c9XCJpc1Zpc2libGVcIiBjbGFzcz1cImhlbHAtYmxvY2tcIiBzdHlsZT1cImZvbnQtc2l6ZTogMTNweDtmb250LWZhbWlseTppbmhlcml0XCI+e3tyZW1haW5pbmdDaGFyYWN0ZXJzfX0gY2hhcmFjdGVycyByZW1haW5pbmc8L3A+Jykoc2NvcGUpO1xuICAgICAgICAgIHNjb3BlLnJlbWFpbmluZ0NoYXJhY3RlcnMgPSBtYXhDaGFycztcbiAgICAgICAgICBzY29wZS5pc1Zpc2libGUgPSB0cnVlO1xuXG4gICAgICAgICAgZnVuY3Rpb24gZ2V0UmVtYWluaW5nKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudExlbmd0aCA9IHZhbHVlID8gdmFsdWUubGVuZ3RoIDogMDtcbiAgICAgICAgICAgIHNjb3BlLnJlbWFpbmluZ0NoYXJhY3RlcnMgPSAobWF4Q2hhcnMgLSBjdXJyZW50TGVuZ3RoKTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50TGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgc2NvcGUucmVtYWluaW5nQ2hhcmFjdGVycyA9IG1heENoYXJzIC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICBlbGVtZW50LmFmdGVyKHRlbXBsYXRlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudC5hdHRyKCdjbGFzcycpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAoZWxlbWVudC5oYXNDbGFzcygnZWRpdGFibGUtaGlkZScpKSA/XG4gICAgICAgICAgICAoc2NvcGUuaXNWaXNpYmxlID0gdHJ1ZSkgOlxuICAgICAgICAgICAgKGVsZW1lbnQuaGFzQ2xhc3MoJ2VkaXRhYmxlJykgJiYgKHNjb3BlLmlzVmlzaWJsZSA9IGZhbHNlKSlcbiAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIChlbGVtZW50Lmhhc0NsYXNzKCdlZGl0YWJsZScpKSA/IHNjb3BlLiRkYXRhIDogbmdNb2RlbC4kbW9kZWxWYWx1ZTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihuZXdWYWx1ZSkge1xuICAgICAgICAgICAgZ2V0UmVtYWluaW5nKG5ld1ZhbHVlKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJlbmRlcigpO1xuXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfV0pXG5cblxufSkoKTtcbiIsIi8qIGdsb2JhbHMgJCAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZScpXG4gIC5kaXJlY3RpdmUoJ3Nob3dWYWxpZGF0aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICByZXF1aXJlOiAnZm9ybScsXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LmZpbmQoJy5mb3JtLWdyb3VwJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgJGZvcm1Hcm91cCA9ICQodGhpcyk7XG4gICAgICAgICAgdmFyICRpbnB1dHMgPSAkZm9ybUdyb3VwLmZpbmQoJ2lucHV0W25nLW1vZGVsXSx0ZXh0YXJlYVtuZy1tb2RlbF0sc2VsZWN0W25nLW1vZGVsXScpO1xuXG4gICAgICAgICAgaWYgKCRpbnB1dHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgJGlucHV0cy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICB2YXIgJGlucHV0ID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaW5wdXQuaGFzQ2xhc3MoJ25nLWludmFsaWQnKSAmJiAkaW5wdXQuaGFzQ2xhc3MoJ25nLWRpcnR5Jyk7XG4gICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGlzSW52YWxpZCkge1xuICAgICAgICAgICAgICAgICRmb3JtR3JvdXAudG9nZ2xlQ2xhc3MoJ2hhcy1lcnJvcicsIGlzSW52YWxpZCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcblxuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUnKVxuICAuZGlyZWN0aXZlKCd1aVNlbGVjdFJlcXVpcmVkJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbG0sIGF0dHJzLCBjdHJsKSB7XG4gICAgICAgIGN0cmwuJHZhbGlkYXRvcnMudWlTZWxlY3RSZXF1aXJlZCA9IGZ1bmN0aW9uIChtb2RlbFZhbHVlLCB2aWV3VmFsdWUpIHtcblxuICAgICAgICAgICAgIHZhciBkZXRlcm1pbmVWYWw7XG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KG1vZGVsVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgZGV0ZXJtaW5lVmFsID0gbW9kZWxWYWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc0FycmF5KHZpZXdWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBkZXRlcm1pbmVWYWwgPSB2aWV3VmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGRldGVybWluZVZhbC5sZW5ndGggPiAwO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG4gIC8qKlxuICAgKiBAbmdkb2MgRGlyZWN0aXZlXG4gICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuQ29tcG9uZW50cy5EaXJlY3R2aWVzLkRpcmVjdGl2ZS5maWxlTW9kZWxcbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkNvbXBvbmVudHMuRGlyZWN0dmllcy5cbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENoYW5nZSBmaWxlIG1vZGVsIHdoZW4gZmlsZSBpcyBzZWxlY3RlZFxuICAgKlxuICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgKi9cblxuICBhbmd1bGFyLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLkRpcmVjdHZpZXMnKVxuICAgIC5kaXJlY3RpdmUoJ2ZpbGVNb2RlbCcsIFsnJHBhcnNlJyxcbiAgICAgIGZ1bmN0aW9uKCRwYXJzZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICB2YXIgbW9kZWwgPSAkcGFyc2UoYXR0cnMuZmlsZU1vZGVsKTtcbiAgICAgICAgICAgIHZhciBtb2RlbFNldHRlciA9IG1vZGVsLmFzc2lnbjtcblxuICAgICAgICAgICAgZWxlbWVudC5iaW5kKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG1vZGVsU2V0dGVyKHNjb3BlLCBlbGVtZW50WzBdLmZpbGVzWzBdKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgXSk7XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBEaXJlY3RpdmVcbiAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLkRpcmVjdHZpZXMuRGlyZWN0aXZlLmJyb3dzZUZpbGVCdXR0b25cbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkNvbXBvbmVudHMuRGlyZWN0dmllcy5cbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEJyb3dzZSBhIGZpbGUgd2hlbiBjbGljayBvbiBsaW5rKC51cGxvYWRfbGluaykgd2hpY2ggYWdhaW4gdHJpZ2dlciAoLnVwbG9hZF9maWxlKVxuICAgKiBVc2FnZTpcbiAgICogPGRpdiBjbGFzcz1cImFueS1jbGFzc1wiIGJyb3dzZS1maWxlLWJ1dHRvbj5cbiAgICogPGEgaHJlZj1cIiNcIiBjbGFzcz1cInVwbG9hZF9saW5rXCI+VXBsb2FkIEZpbGU8L2E+IDxpbnB1dCB0eXBlPVwiZmlsZVwiIGNsYXNzPVwidXBsb2FkX2ZpbGVcIiAvPlxuICAgKiA8L2Rpdj5cbiAgICpcbiAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICovXG4gICAgYW5ndWxhci5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuQ29tcG9uZW50cy5EaXJlY3R2aWVzJylcbiAgICAuZGlyZWN0aXZlKCdicm93c2VGaWxlQnV0dG9uJywgW1xuICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuZmluZCgnLnVwbG9hZF9saW5rJykuYmluZCgnY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgZWxlbWVudC5maW5kKCcudXBsb2FkX2ZpbGUnKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICBlbGVtZW50LmZpbmQoJy51cGxvYWRfbGluaycpLnVuYmluZCgnY2xpY2snKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICBdKTtcblxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLyoqXG4gICAqIEBuZ2RvYyBEaXJlY3RpdmVcbiAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLkRpcmVjdHZpZXMuRGlyZWN0aXZlLkV4YWN0TGVuZ3RoXG4gICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLkRpcmVjdHZpZXMuXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiB2YWxpZGF0ZSBtb2RlbCBleGFjdCBsZW5ndGggb2YgZmllbGRcbiAgICpcbiAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICovXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkNvbXBvbmVudHMuRGlyZWN0dmllcycpXG4gICAgLmRpcmVjdGl2ZSgnZXhhY3RMZW5ndGgnLCBFeGFjdExlbmd0aCk7XG4gIC8qIEBuZ0luamVjdCAqL1xuICBmdW5jdGlvbiBFeGFjdExlbmd0aCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIGV4YWN0TGVuZ3RoOiAnPSdcbiAgICAgIH0sXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgJGVsZW1lbnQsICRhdHRycywgbmdNb2RlbCkge1xuICAgICAgICAkZWxlbWVudC5vbigna2V5dXAnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBuZ01vZGVsLiRzZXRWYWxpZGl0eSgnZXhhY3RMZW5ndGgnLCAoc2NvcGUuZXhhY3RMZW5ndGggPT09IChuZ01vZGVsLiRtb2RlbFZhbHVlICYmIG5nTW9kZWwuJG1vZGVsVmFsdWUubGVuZ3RoICkpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG4gIC8qKlxuICAgKiBAbmdkb2MgRGlyZWN0aXZlXG4gICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuQ29tcG9uZW50cy5EaXJlY3R2aWVzLkRpcmVjdGl2ZS5zY3JvbGxUb1RvcFdoZW5cbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkNvbXBvbmVudHMuRGlyZWN0dmllc1xuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogU3RvcCBldmVudCBwcm9wb2dhdGlvbnQgdG8gcGFyZW50c1xuICAgKlxuICAgKiBVc2FnZSA6XG4gICAqIDxhIGhyZWY9XCIjXCIgc3RvcC1jbGljay1wcm9wYWdhdGlvbj5IaXQgbWU8L2E+XG4gICAqIFxuICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgKi9cblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLkRpcmVjdHZpZXMnKVxuICAgIC5kaXJlY3RpdmUoJ3N0b3BDbGlja1Byb3BhZ2F0aW9uJywgc3RvcENsaWNrUHJvcGFnYXRpb24pO1xuXG4gIC8qIEBuZ0luamVjdCAqL1xuICBmdW5jdGlvbiBzdG9wQ2xpY2tQcm9wYWdhdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgIGxpbms6IHtcbiAgICAgICAgcG9zdDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgZWxlbWVudC5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmdkb2MgRGlyZWN0aXZlXG4gICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuQ29tcG9uZW50cy5EaXJlY3R2aWVzLkRpcmVjdGl2ZS5wcmV2ZW50RGVmYXVsdFxuICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmUuQ29tcG9uZW50cy5EaXJlY3R2aWVzXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBwcmV2ZW50RGVmYXVsdCBkaXJlY3RpdmUgaXMgdXNlZCB0byBzdG9wIGRlZmF1bHQgYWN0aW9uIG9mIGh0bWwgZWxlbWVudFxuICAgKiBcbiAgICogVXNhZ2UgOlxuICAgKiA8YSBocmVmPVwiI1wiIHByZXZlbnQtZGVmYXVsdD5IaXQgbWU8L2E+XG4gICAqXG4gICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAqL1xuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLkRpcmVjdHZpZXMnKVxuICAgIC5kaXJlY3RpdmUoJ3ByZXZlbnREZWZhdWx0JywgcHJldmVudERlZmF1bHQpO1xuICAvKiBAbmdJbmplY3QgKi9cbiAgZnVuY3Rpb24gcHJldmVudERlZmF1bHQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICBsaW5rOiB7XG4gICAgICAgIHBvc3Q6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgIGVsZW1lbnRbMF0uY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG59KCkpOyIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyoqXG4gICAgICogQG5nZG9jIERpcmVjdGl2ZVxuICAgICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuQ29tcG9uZW50cy5EaXJlY3R2aWVzLkRpcmVjdGl2ZS5tYXRjaFxuICAgICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLkRpcmVjdHZpZXMuXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBwYXNzd29yZCBtYXRjaGluZyBjaGVja1xuICAgICAqXG4gICAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuQ29tcG9uZW50cy5EaXJlY3R2aWVzJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnbWF0Y2gnLCBQYXNzd29yZE1hdGNoKTtcblxuICAgIC8qIEBuZ0luamVjdCovXG4gICAgZnVuY3Rpb24gUGFzc3dvcmRNYXRjaCgkcGFyc2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlcXVpcmU6ICc/bmdNb2RlbCcsXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW0sIGF0dHJzLCBjdHJsKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjdHJsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdNYXRjaCB2YWxpZGF0aW9uIHJlcXVpcmVzIG5nTW9kZWwgdG8gYmUgb24gdGhlIGVsZW1lbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoR2V0dGVyID0gJHBhcnNlKGF0dHJzLm1hdGNoKTtcbiAgICAgICAgICAgICAgICB2YXIgY2FzZWxlc3NHZXR0ZXIgPSAkcGFyc2UoYXR0cnMubWF0Y2hDYXNlbGVzcyk7XG4gICAgICAgICAgICAgICAgdmFyIG5vTWF0Y2hHZXR0ZXIgPSAkcGFyc2UoYXR0cnMubm90TWF0Y2gpO1xuXG4gICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGdldE1hdGNoVmFsdWUsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjdHJsLiQkcGFyc2VBbmRWYWxpZGF0ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY3RybC4kdmFsaWRhdG9ycy5tYXRjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSBnZXRNYXRjaFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBub3RNYXRjaCA9IG5vTWF0Y2hHZXR0ZXIoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhc2VsZXNzR2V0dGVyKHNjb3BlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBhbmd1bGFyLmxvd2VyY2FzZShjdHJsLiR2aWV3VmFsdWUpID09PSBhbmd1bGFyLmxvd2VyY2FzZShtYXRjaCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGN0cmwuJHZpZXdWYWx1ZSA9PT0gbWF0Y2g7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgXj0gbm90TWF0Y2g7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhIXZhbHVlO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBnZXRNYXRjaFZhbHVlKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSBtYXRjaEdldHRlcihzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KG1hdGNoKSAmJiBtYXRjaC5oYXNPd25Qcm9wZXJ0eSgnJHZpZXdWYWx1ZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IG1hdGNoLiR2aWV3VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG4gIC8qKlxuICAgKiBAbmdkb2MgRGlyZWN0aXZlXG4gICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuQ29tcG9uZW50cy5EaXJlY3R2aWVzLkRpcmVjdGl2ZS51c2VySW1hZ2VcbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlLkNvbXBvbmVudHMuRGlyZWN0dmllc1xuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogbG9hZHMgdXNlclxuICAgKlxuICAgKiBVc2FnZSA6XG4gICAqIDx1c2VyLWltYWdlIGRhdGEtdXNlcmlkPVwie3t1c2VyaWR9fVwiPjwvdXNlci1pbWFnZT5cbiAgICogXG4gICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAqL1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlLkNvbXBvbmVudHMuRGlyZWN0dmllcycpXG4gICAgLmRpcmVjdGl2ZSgndXNlckltYWdlJywgYmxvYlRvSW1hZ2VEaXJlY3RpdmUpXG5cbiAgLyogQG5nSW5qZWN0ICovXG4gIGZ1bmN0aW9uIGJsb2JUb0ltYWdlRGlyZWN0aXZlKCRyb290U2NvcGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIHVzZXJpZDogJz0nLFxuICAgICAgICBpbWFnZWNsYXNzOiAnQCdcbiAgICAgIH0sXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiAkcm9vdFNjb3BlLmlzUGhvdG9VcGRhdGVkO1xuICAgICAgICB9LCBmdW5jdGlvbihuZXdWYWwsIG9sZFZhbCkge1xuICAgICAgICAgIGlmKG5ld1ZhbClcbiAgICAgICAgICBzY29wZS5pbWFnZVVybCA9ICdhcGkvdjEvdXNlcnMvJyArIHNjb3BlLnVzZXJpZCArICcvcGhvdG8/cmVmZXJlY2U9JyArIG5ld1ZhbDtcbiAgICAgICAgfSk7XG4gICAgICAgIHNjb3BlLiR3YXRjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gc2NvcGUudXNlcmlkO1xuICAgICAgICB9LCBmdW5jdGlvbihuZXdWYWwsIG9sZFZhbCkge1xuICAgICAgICAgICAgaWYobmV3VmFsKVxuICAgICAgICAgIHNjb3BlLmltYWdlVXJsID0gJ2FwaS92MS91c2Vycy8nICsgc2NvcGUudXNlcmlkICsgJy9waG90bz9yZWZlcmVjZT0nICsgbmV3VmFsO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZTogJzxpbWcgbmctc3JjPVwie3tpbWFnZVVybH19XCIgY2xhc3M9XCJ7e2ltYWdlY2xhc3N9fVwiIC8+J1xuICAgIH07XG4gIH1cbn0oKSk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBEaXJlY3RpdmVcbiAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLkRpcmVjdHZpZXMuRGlyZWN0aXZlLmFkanVzdFdpZHRoXG4gICAqIEBtb2R1bGUgQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLkRpcmVjdHZpZXMuXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBkaXJlY3RpdmUgaXMgdXNlZCBvbiBhY3RpdmUgcnVuIHZpZXdcbiAgICogZGlyZWN0aXZlIGFwcGx5IHdpZHRoIHRvIGVsZW1lbnQgc2FtZSBhcyBwYXJlbnQncyB3aWR0aFxuICAgKlxuICAgKiBAYXV0aG9yIE1vaGFuIFNpbmdoICggZ21haWw6OnNpbmdobW9oYW5jc0BnbWFpbC5jb20sIHNreXBlIDo6IG1vaGFuLnNpbmdoNDIgKVxuICAgKi9cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ0JlYXV0eUNvbGxlY3RpdmUuQ29tcG9uZW50cy5EaXJlY3R2aWVzJylcbiAgICAuZGlyZWN0aXZlKCdhZGp1c3RXaWR0aCcsIFtmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsIC8vIEUgPSBFbGVtZW50LCBBID0gQXR0cmlidXRlLCBDID0gQ2xhc3MsIE0gPSBDb21tZW50XG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgIGVsZW1lbnQud2lkdGgoZWxlbWVudC5wYXJlbnQoKS53aWR0aCgpKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLyoqXG4gICAqIEBuZ2RvYyBmYWN0b3J5XG4gICAqIEBuYW1lIEJlYXV0eUNvbGxlY3RpdmUuZmFjdG9yeS5SZXNwb25zZUhhbmRsZXJcbiAgICogQG1vZHVsZSBCZWF1dHlDb2xsZWN0aXZlXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXNwb25zZUhhbmRsZXIgZmFjdG9yeSBoYW5kbGVzIHJlc3BvbnNlIGZyb20gc2VydmVyXG4gICAqIGhhbmRsZSBzdWNjZXNzIG1lc3NhZ2UgYW5kIGVycm9yIG1lc3NhZ2UgYmFzZWQgb24gcmVzcG9uc2UgZnJvbSBzZXJ2ZXJcbiAgICpcbiAgICogQGF1dGhvciBNb2hhbiBTaW5naCAoIGdtYWlsOjpzaW5naG1vaGFuY3NAZ21haWwuY29tLCBza3lwZSA6OiBtb2hhbi5zaW5naDQyIClcbiAgICovXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdCZWF1dHlDb2xsZWN0aXZlJylcbiAgICAuZmFjdG9yeSgnUmVzcG9uc2VIYW5kbGVyJywgUmVzcG9uc2VIYW5kbGVyRmFjdG9yeSk7XG5cbiAgLyogQG5nSW5qZWN0ICovXG4gIGZ1bmN0aW9uIFJlc3BvbnNlSGFuZGxlckZhY3Rvcnkobm90aWZ5LCAkZmlsdGVyLCAkcSkge1xuXG4gICAgZnVuY3Rpb24gUmVzcG9uc2VIYW5kbGVyRmFjdG9yeSgpIHtcbiAgICAgIHRoaXMubm90aWZ5Q29uZmlnID0ge1xuICAgICAgICB0aXRsZTogJycsXG4gICAgICAgIG1lc3NhZ2U6ICcnXG4gICAgICB9O1xuXG4gICAgICB0aGlzLnNldE5vdGlmeUNvbmZpZyA9IGZ1bmN0aW9uKHRpdGxlLCBtZXNzYWdlKSB7XG4gICAgICAgIHRoaXMubm90aWZ5Q29uZmlnID0ge1xuICAgICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zaG93Tm90aWZpY2F0aW9uID0gZnVuY3Rpb24odHlwZSkge1xuICAgICAgICAoJ2Vycm9yJyA9PT0gdHlwZSkgPyBub3RpZnkuZXJyb3IodGhpcy5ub3RpZnlDb25maWcpOiBub3RpZnkuc3VjY2Vzcyh0aGlzLm5vdGlmeUNvbmZpZylcbiAgICAgIH1cbiAgICB9XG4gICAgUmVzcG9uc2VIYW5kbGVyRmFjdG9yeS5wcm90b3R5cGUuc3VjY2VzcyA9IGZ1bmN0aW9uKHN1Y2Nlc3NPYmosIHNob3dOb3RpZnkpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICBpZiAoIXN1Y2Nlc3NPYmouZGF0YSAmJiAhc3VjY2Vzcy5kYXRhLnR5cGUpIHtcblxuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHtcbiAgICAgICAgICB0eXBlOiAoKHN1Y2Nlc3Muc3RhdHVzID09PSAyMDApICYmIChzdWNjZXNzLnN0YXR1c1RleHQgPT09ICdPSycpKSA/ICdzdWNjZXNzJyA6ICdlcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogc3VjY2Vzcy5zdGF0dXNUZXh0XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgIH1cbiAgICAgIHZhciBzdWNjZXNzRGF0YSA9IHN1Y2Nlc3NPYmouZGF0YSxcbiAgICAgICAgbWVzc2FnZVR5cGUsXG4gICAgICAgIG1lc3NhZ2U7XG4gICAgICBtZXNzYWdlID0gJGZpbHRlcigndHJhbnNsYXRlJykoJ1NFUlZFUi4nICsgc3VjY2Vzc0RhdGEuY29kZSk7XG5cbiAgICAgIHRoaXMuc2V0Tm90aWZ5Q29uZmlnKHN1Y2Nlc3NEYXRhLnR5cGUsIG1lc3NhZ2UpO1xuICAgICAgbWVzc2FnZVR5cGUgPSAoc3VjY2Vzc0RhdGEudHlwZS50b0xvd2VyQ2FzZSgpID09PSAnc3VjY2VzcycpID8gJ3N1Y2Nlc3MnIDogJ2Vycm9yJztcbiAgICAgIGlmIChzaG93Tm90aWZ5KSB7XG4gICAgICAgIHRoaXMuc2hvd05vdGlmaWNhdGlvbihtZXNzYWdlVHlwZSk7XG4gICAgICB9XG5cbiAgICAgIGRlZmVycmVkLnJlc29sdmUoe1xuICAgICAgICB0eXBlOiBtZXNzYWdlVHlwZSxcbiAgICAgICAgbWVzc2FnZTogbWVzc2FnZVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG5cbiAgICBSZXNwb25zZUhhbmRsZXJGYWN0b3J5LnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uKGVycm9yT2JqLCBzaG93Tm90aWZ5KSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgdmFyIG1lc3NhZ2UgPSBlcnJvckRhdGEubWVzc2FnZSB8fCBlcnJvckRhdGEuc3RhdHVzVGV4dDtcbiAgICAgIHRoaXMuc2V0Tm90aWZ5Q29uZmlnKCdFcnJvcicsIG1lc3NhZ2UpO1xuICAgICAgaWYgKHNob3dOb3RpZnkpIHtcbiAgICAgICAgdGhpcy5zaG93Tm90aWZpY2F0aW9uKCdlcnJvcicpO1xuICAgICAgfVxuICAgICAgZGVmZXJyZWQucmVzb2x2ZSh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2VIYW5kbGVyRmFjdG9yeSgpO1xuXG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBAbmdkb2Mgb3ZlcnZpZXdcbiAgICogQG5hbWUgQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzXG4gICAqIFxuICAgKiBAbW9kdWxlIEJlYXV0eUNvbGxlY3RpdmVcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEFwcGxpY2F0aW9uIGNvbXBvbmVudHMgZ29lcyBoZXJlXG4gICAqXG4gICAqIEBhdXRob3IgTW9oYW4gU2luZ2ggKCBnbWFpbDo6c2luZ2htb2hhbmNzQGdtYWlsLmNvbSwgc2t5cGUgOjogbW9oYW4uc2luZ2g0MiApXG4gICAqL1xuICBhbmd1bGFyLm1vZHVsZSgnQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzJywgW1xuICAgICdCZWF1dHlDb2xsZWN0aXZlLkNvbXBvbmVudHMuRmlsdGVycycsXG4gICAgJ0JlYXV0eUNvbGxlY3RpdmUuQ29tcG9uZW50cy5EaXJlY3R2aWVzJyxcbiAgICAnQmVhdXR5Q29sbGVjdGl2ZS5Db21wb25lbnRzLm1vZGFsJyxcbiAgICAnRmFuY3lEcm9wRG93bidcbiAgXSk7XG59KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==