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

})();