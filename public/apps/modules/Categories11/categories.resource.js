(function() {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Account.Factory.CategoriesResource
     * @module BeautyCollective.Account
     *
     * @description
     * Implements CURD operations
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Account')
        .factory('CategoriesResource', CategoriesResource);

    /* @ngInject */
    function CategoriesResource($resource, APP_CONFIG) {
        /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
        return $resource('categories/:type', {
            type: '@types'
        }, {
            find: {
                method: 'GET',
                isArray: true,
                params: {
                    id: '@id',
                }
            },
            create: {
                method: 'POST',
                url: 'jobs/save',
                params: {}
            },
            update: {
                method: 'PUT',
                params: {
                    id: '@id'
                }
            },
            findAllByType: {
                method: 'GET',
                isArray: true
            },
            query: {
                method: 'GET',
                transformResponse: transformQueryResponse
            },
            subcategories: {
                method: 'GET',
                transformResponse: transformQueryResponse,
                url:'subcategoriesbytype'
            },
            searchcategories: {
                url:'serviceprovidercategories',
				method: 'GET',
                transformResponse: transformQueryResponse
            }
        });
    }

    function transformQueryResponse(data, headersGetter) {
        var _response = {};
        _response.list = angular.fromJson(data);
        return angular.fromJson(_response);
    }

})();
