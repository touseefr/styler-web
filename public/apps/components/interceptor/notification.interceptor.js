(function() {
    'use strict';
    /**
     * @ngdoc factory
     * @name BeautyCollective.Core.factory.notificationInterceptor
     * @module BeautyCollective.Core
     *
     * @description
     * An interceptor to read the header response request
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Core')
        .factory('notificationInterceptor', ['$q', 'AlertService', function($q, AlertService) {
            return {
                response: function(response) {
                    var alertKey = response.headers('X-beautyCollective-alert');
                    if (angular.isString(alertKey)) {
                        AlertService.success(alertKey, {
                            param: response.headers('X-beautyCollective-params')
                        });
                    }
                    return response;
                }
            };
        }]);
})();
