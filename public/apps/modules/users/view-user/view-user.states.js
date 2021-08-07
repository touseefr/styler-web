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
})();
