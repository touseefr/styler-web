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
      return $resource('account/:id', {
          requestType: '@requestType',
          id: '@id',
        },
        {
        find: {
          method: 'GET',
          url: 'getuser',
          params: {
            id: '@id',
          }
        },
        findJob: {
          method: 'GET',
          url: 'getjobs',
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
          method: 'PUT'
        },
        updatebusiness: {
          url:'business/:id',
          method: 'PUT'
        },
        updatesocialmedia: {
            url:'updatesocialmedia',
            method: 'POST'
        },
        updateIndividualInfo: {
          url:'updateindividualinfo/:id',
          method: 'PUT'
        },
        getJobSeekers: {
          url:'jobseekers',
          method: 'GET',
          isArray:true
        },
        getUsers: {
          url:'getusers',
          method: 'GET',
          isArray:true
        },
        deleteLogo: {
          url:'deletelogo',
          method: 'GET'
        },
        deleteVideo: {
          url:'deletevideo',
          method: 'GET'
        },
        getWatchList: {
          url:'getwatchlist',
          method: 'GET'
        }
      });
    }

    function transformGetResponse(data, headersGetter) {
        var _response = {};
        _response.data = angular.fromJson(data);
        return angular.fromJson(_response);
    }

})();