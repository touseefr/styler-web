(function() {
  'use strict';
  /**
   * @ngdoc Factory
   * @name BeautyCollective.Users.Factory.UsersResource
   * @module BeautyCollective.Users
   *
   * @description
   * Implements CURD operations
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Users')
    .factory('UsersResource', UsersResource);

  /* @ngInject */
  function UsersResource($resource, APP_CONFIG) {
    /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
    return $resource('macros/', {
      action: '@action',
      action_value : '@action_value'
    }, {
      find: {
        method: 'GET',
        params: {
          id: '@id',
        }
      },
      create: {
        method: 'POST'
      },
      update: {
        method: 'PUT',
        params: {
          id: '@id'
        }
      },
      updateStatus: {
        method: 'PUT',
        params: {
          id: '@id',
          action: '@status'
        }
      },
      query: {
        method: 'GET',
        transformResponse: transformQueryResponse
      },
      getPhoto: {
        method: 'GET',
        params: {
          id: '@id',
          action: '@action'
        }
      },
      savePhoto: {
        url: 'api/v1/users/upload/photo/:user_id',
        method: 'POST',
        params: {
          user_id: '@user_id',
        }, headers: {
          'Content-Type': undefined
        },
        transformRequest: function(data) {
          var formData = new FormData();
          //need to convert our json object to a string version of json otherwise
          // the browser will do a 'toString()' on the object which will result 
          // in the value '[Object object]' on the server.
          formData.append("photo",data);
          
          return formData;
        }
      },
      searchUsers : {
        url : 'api/v1/users/list',
        method :'GET',
         transformResponse: transformQueryResponse
      }
    });

    function transformQueryResponse(data, headersGetter) {
      var _response = {};
      _response.list = angular.fromJson(data);
      _response.totalCount = parseInt(headersGetter('x-total-count'));
      return angular.fromJson(_response);
    }
  }

})();
