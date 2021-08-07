(function() {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Widgets.Factory.EmailResource
     * @module BeautyCollective.Widgets
     *
     * @description
     * Implements CURD operations
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
      .module('BeautyCollective.Widgets')
      .factory('EmailResource', EmailResource);

    /* @ngInject */
    function EmailResource($resource, APP_CONFIG) {
      /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
      return $resource('sendemail', {
	  },{
		sendMail: {
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