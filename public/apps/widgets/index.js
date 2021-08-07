(function() {
  'use strict';
  /*global angular: false */

  angular.module('BeautyCollective.Widgets', ['BeautyCollective.Core','BeautyCollective.Suburbs', 'BeautyCollective.Components.Directvies','BeautyCollective.Account','flow']);
  
  angular
        .module('BeautyCollective.Widgets').config(['flowFactoryProvider','CSRF_TOKEN', function(flowFactoryProvider, CSRF_TOKEN) {
            // Can be used with different implementations of Flow.js
            // flowFactoryProvider.factory = fustyFlowFactory;
        }]);
}());