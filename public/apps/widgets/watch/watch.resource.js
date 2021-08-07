(function() {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Widgets.Factory.AddtowatchResource
     * @module BeautyCollective.Widgets
     *
     * @description
     * Implements CURD operations
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
      .module('BeautyCollective.Widgets')
      .factory('AddtowatchResource',AddtowatchResource);
	
	/* @ngInject */
    function AddtowatchResource($resource, APP_CONFIG) {
      /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
      return $resource('../addtowatchlist', {},
        {
        AddtowatchList: {
          method: 'POST'
        }
      });
    }
})();