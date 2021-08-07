(function() {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Listing.Factory.ListingResource
     * @module BeautyCollective.Listing
     *
     * @description
     * Implements CURD operations
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Listing')
        .factory('ListingResource', ListingResource);

    /* @ngInject */
    function ListingResource($resource, APP_CONFIG) {
        /* $resource(API_URL, DEFAULT_PARAMETERS, CONFIGURE_YOUR_CUSTOM_METHODS)*/
        return $resource('listing/:id', {
            id: '@id'
        }, {
            find: {
                method: 'GET',
                params: {
                    id: '@id',
                },
                transformResponse: transformGetResponse
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PUT'
            },
            query: {
                method: 'GET',
                transformResponse: transformQueryResponse
            },
            cancel: {
                method: 'GET',
                params: {
                    id: '@id',
					list_id: '@list_id',
                },
                url: 'cancelimage'
            }

        });
    }

    function transformQueryResponse(data, headersGetter) {
        var _response = {};
        _response.list = angular.fromJson(data);
        return angular.fromJson(_response);
    }

    function transformGetResponse(data, headersGetter) {
        var _response = {};
        _response.data = angular.fromJson(data);
        return angular.fromJson(_response);
    }
})();
