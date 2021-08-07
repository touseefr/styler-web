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
})();