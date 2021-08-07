(function() {
  'use strict';
  /**
   * @ngdoc Service
   * @name BeautyCollective.Suburbs.Service.PriorityModel
   * @module BeautyCollective.Priority
   *
   * @description
   *
   * Data model for Suburbs module
   * Implemenets CURD operation
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Suburbs')
    .service('SuburbsModel', SuburbsModel);

  /* @ngInject */
  function SuburbsModel(SuburbsResource) {
    var model = this;
    /**
     * [jobList description]
     * @True {Array}
     */
    model.cities = [];
    /**
     * [findAll description]
     * @method findAll
     * @return {[type]} [description]
     */
    model.findAll = function(params, callback) {
      return SuburbsResource.findAll(params);
    };

    model.findLocation = function(params, callback) {
      return SuburbsResource.findAll(params).$promise;
    };
  }
})();