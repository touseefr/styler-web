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
})();
