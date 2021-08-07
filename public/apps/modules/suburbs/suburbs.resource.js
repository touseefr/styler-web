(function() {
  'use strict';
  /**
   * @ngdoc Factory
   * @name BeautyCollective.Suburbs.Factory.SuburbsResource
   * @module BeautyCollective.Suburbs
   *
   * @description
   * Implements CURD operations
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Suburbs')
    .factory('SuburbsResource', SuburbsResource);

  /* @ngInject */
  function SuburbsResource($resource, APP_CONFIG) {
    return $resource('/locations/:id', {}, {
      findAll: {
        method: "GET",
        transformResponse: transformQueryResponse
      },
      findById: {
        method: "GET",
        params: {
          id: "@id"
        }
      },
      save: {
        method: "POST",
        params: {}
      },
      delete: {
        method: "DELETE",
        params: {
          id: "@id"
        }
      },
      update: {
        method: "PUT",
        params: {
          id: 0
        }
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