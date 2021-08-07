(function() {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Widgets.Factory.BookingResource
     * @module BeautyCollective.Widgets
     *
     * @description
     * Implements CURD operations
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
      .module('BeautyCollective.Widgets')
      .factory('BookingResource',BookingResource);
	
	/* @ngInject */
    function BookingResource($resource, APP_CONFIG) {
      /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
      return $resource('../bookappointment', {},
        {
        saveAppointment: {
          method: 'POST'
        },
		    getServices: {
		      url:'services',
          method: 'GET',
		      isArray:true
        }
      });
    }
})();