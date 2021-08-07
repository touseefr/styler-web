'use strict';

angular.module('BeautyCollective')
  .config(function($stateProvider) {
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
  });