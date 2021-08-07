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
})();