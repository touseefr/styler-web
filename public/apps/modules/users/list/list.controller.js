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

  } //end of controller

  angular
    .module('BeautyCollective.Users')
    .controller('UsersListController', UsersListController);
})();
