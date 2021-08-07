(function() {
  'use strict';
  /**
   * @ngdoc Service
   * @name BeautyCollective.Account.Service.CategoriesModel
   * @module BeautyCollective.Account
   *
   * @description
   *
   * Data model for Categories
   * Implemenets CURD operation
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Account')
    .service('CategoriesModel', CategoriesModel);

  /* @ngInject */
  function CategoriesModel(CategoriesResource) {
    var model = this;

    /**
     * [categories list]
     * @True {Array}
     */
    model.categories = [];
    model.subCategories = [];

    model.categoryTypes = [];

    /**
     * Get Listing
     * @param id id
     * @return list
     */
    model.get = function(id) {
      return CategoriesResource.find(id).$promise;
    };

    /**
     * [all description]
     * @method all
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     * @param  {[type]}          params [description]
     * @return {[type]}                 [description]
     */
    model.all = function(params, success, fail){
      return CategoriesResource.query(params, success, fail).$promise;
    };


    /**
     * [all description]
     * @method all
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     * @param  {[type]}          params [description]
     * @return {[type]}                 [description]
     */
    model.subcategories = function(params, success, fail){
      return CategoriesResource.subcategories(params, success, fail).$promise;
    };
	
	/**
     * [search categories]
     * @method all
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     * @param  {[type]}          params [description]
     * @return {[type]}                 [description]
     */
    model.searchcategories = function(params, success, fail){
      return CategoriesResource.searchcategories(params, success, fail).$promise;
    };

}
})();