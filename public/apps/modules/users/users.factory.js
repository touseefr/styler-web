(function() {
  'use strict';
  /**
   * @ngdoc Factory
   * @name BeautyCollective.Users.Factory.UsersFactory
   * @module BeautyCollective.Users
   *
   * @description
   *
   * UsersFactory handles business logic and common features
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Users')
    .service('UsersFactory', UsersFactory);

  /* @ngInject */
  function UsersFactory(notify, ResponseHandler, UsersModel, $q, Spinner) {
    var factory = {};

    /**[errorHandler description]
     * @param  {[type]} errorResponse [description]
     * @return {[type]}               [description]
     */
    factory.errorHandler = function(errorResponse) {
      notify.error({
        title: 'Error ' + errorResponse.data ? errorResponse.data.code : errorResponse.status,
        message: errorResponse.data ? errorResponse.data.message : errorResponse.statusText
      })
    };

    /**
     * get All Users
     *
     * @requires page
     * @requires per_page
     * @requires sort_query
     * 
     * @private
     * @return {[type]} [description]
     */
    factory.getUsers = function(options) {
      var deferred = $q.defer(),
        _sortBy = options.isSortReverse ? '-' : '';

      UsersModel.findAll({
        'page': options.page,
        'per_page': options.per_page,
        'sort_query': _sortBy + options.predicate
      }).then(function(successResponse) {
        UsersModel.totalCounts = successResponse.totalCount;
        parseResponse(successResponse.list);
        deferred.resolve(successResponse);
      }).catch(function(error) {
        ResponseHandler.error(error);
        deferred.resolve(null);
      });
      /**
       * parse getUsers response
       * @param  {Array|Object} responseData
       *
       * @private
       * @return {Void}
       */
      function parseResponse(responseData) {
        Spinner.hide();
        UsersModel.userslist.length = 0;
        if (responseData.length === 0) {
          return;
        }
        Array.prototype.push.apply(UsersModel.userslist, responseData);
      }

      return deferred.promise;
    }

    return factory;
  }
})();
