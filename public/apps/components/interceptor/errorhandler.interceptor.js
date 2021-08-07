(function() {
    'use strict';
    /**
     * @ngdoc factory
     * @name BeautyCollective.Core.factory.errorHandlerInterceptor
     * @module BeautyCollective.Core
     *
     * @description
     * An interceptor to read the error response of http request
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Core')
        .factory('errorHandlerInterceptor', ['$q', '$rootScope', function($q, $rootScope) {
            return {
                responseError: function(response) {
                    if (!(response.status == 401)) {
                        $rootScope.$emit('BeautyCollective.httpError', response);
                    }
                    return $q.reject(response);
                }
            };
        }]);
})();
