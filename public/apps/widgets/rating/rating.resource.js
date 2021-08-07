(function() {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Widgets.Factory.RatingResource
     * @module BeautyCollective.Widgets
     *
     * @description
     * Implements CURD operations
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
      .module('BeautyCollective.Widgets')
      .factory('RatingResource', RatingResource);

    /* @ngInject */
    function RatingResource($resource, APP_CONFIG) {
      /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
      return $resource('../rating', {
		  requestType :'@requestType'
	   },
        {
        saveRating: {
          method: 'POST'
        },
		save: {
			url:'review',
			method: 'POST'
        }
      });
    }
	
	function transformQueryResponse(data, headersGetter) {
        var _response = {};
        _response.list = angular.fromJson(data);
        return angular.fromJson(_response);
    }

})();