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
})();
