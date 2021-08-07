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
})();
