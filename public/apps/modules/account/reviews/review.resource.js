(function() {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Account.Factory.ReviewResource
     * @module BeautyCollective.Account
     *
     * @description
     * Implements CURD operations
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
      .module('BeautyCollective.Account')
      .factory('ReviewResource', ReviewResource);

    /* @ngInject */
    function ReviewResource($resource, APP_CONFIG) {
      /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
      return $resource('review/:id', {
          id: '@id',
        },
        {
        find: {
			  method: 'GET',
			  params: {
				id: '@id',
			  }
        },
        save: {
			method: 'POST'
        },
        update: {
			  method: 'PUT',
			  params: {
				id: 0
			  }
        },
		all: {
			method: 'GET',
			params: {
				id: '@id',
			},
			transformResponse: transformGetResponse,
        },
		requestReview: {
			method: 'POST',
			url:'requestreview'
        },
		delete: {
                method: 'DELETE',
                params: {
                    id: '@id',
				},
        }
      });
    }
	
    function transformGetResponse(data, headersGetter) {
        var _response = {};
        _response.data = angular.fromJson(data);
        return angular.fromJson(_response);
    }

})();