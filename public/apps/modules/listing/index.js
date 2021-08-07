(function() {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Listing
     * @module BeautyCollective.Listing
     *
     * @description
     * Listing task module
     * @see Listing.model.js
     * @see Listing.resource.js
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Listing', ['ui.bootstrap', 'flow'])

    angular
        .module('BeautyCollective.Listing').config(['flowFactoryProvider','CSRF_TOKEN', function(flowFactoryProvider, CSRF_TOKEN) {
            // Can be used with different implementations of Flow.js
             flowFactoryProvider.factory = fustyFlowFactory;
        }]);
})();