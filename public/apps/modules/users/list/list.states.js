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

  angular
    .module('BeautyCollective.Users')
    .config(UsersListState);
})();
