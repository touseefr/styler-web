(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Serviceprovider.Controller.ListingController
     * @module BeautyCollective.Listing
     *
     * @description
     * ListingController is responsible manage account activities
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

    /* @ngInject */
    function ListingController($scope, CategoriesModel) {
        var self = this;
        //init();

        /**
         * initialize properties
         * 
         * @private
         * @return {void}
         */

        function init() {
              CategoriesModel.all({
                        type: 'types'
                    }).then(function(response) {
                        CategoriesModel.categoryTypes.length = 0;
                        Array.prototype.push.apply(CategoriesModel.categoryTypes, response.list);
                        deferred.resolve({
                            'categoryType': _.find(CategoriesModel.categoryTypes, function(categoryType) {
                                return (categoryType.type_code.toLowerCase() === $stateParams.listing_type.toLowerCase());
                            })
                        });
                    }, function(error) {
                        deferred.resolve({});
                    });
        }

     }
    //end of controller

    angular
        .module('BeautyCollective.Listing')
        .controller('ListingController', ListingController);
})();
