(function () {
  'use strict';

  /**
   * @ngdoc factory
   * @name BeautyCollective.Components.modal._$modal
   * 
   * @module modal
   *
   * @description
   * Extends $modal service
   *
   * @author Mohan Singh (singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Components.modal')
    .factory('_$modal', ['$modal', function ($modal) {

      var _modal = _modal || {},
        defaultOptions = {
          keyboard: true, // keyboard
          backdrop: true, // backdrop
          size: 'lg', // values: 'sm', 'lg', 'md'
          windowClass: '',
          templateUrl: 'components/modal/confirm-modal.html'
        };


      var _setOptions = function (opts) {
        var _opts = {};
        _opts = opts || {};
        _opts.kb = (angular.isDefined(opts.keyboard)) ? opts.keyboard : defaultOptions.keyboard; // values: true,false
        _opts.bd = (angular.isDefined(opts.backdrop)) ? opts.backdrop : defaultOptions.backdrop; // values: 'static',true,false
        _opts.ws = (angular.isDefined(opts.size) && (angular.equals(opts.size, 'sm') || angular.equals(opts.size, 'lg') || angular.equals(opts.size, 'md'))) ? opts.size : defaultOptions.size; // values: 'sm', 'lg', 'md'
        _opts.wc = (angular.isDefined(opts.windowClass)) ? opts.windowClass : defaultOptions.windowClass; // additional CSS class(es) to be added to a modal window
        _opts.templateUrl = (angular.isDefined(opts.templateUrl)) ? opts.templateUrl : defaultOptions.templateUrl;

        return _opts;
      };

      /**
       * Confirm Modal
       *
       * @param header  string
       * @param msg   string
       * @param opts  object
       */
      _modal.confirm = function (header, msg, opts) {
        var _opts = _setOptions(opts);

        return $modal.open({
          templateUrl: _opts.templateUrl,
          controller: 'ConfirmModalController',
          backdrop: _opts.bd,
          keyboard: _opts.kb,
          windowClass: _opts.wc,
          size: _opts.ws,
          resolve: {
            data: function () {
              return {
                header: angular.copy(header),
                msg: angular.copy(msg)
              };
            }
          }
        }); // end modal.open
      };
      return _modal;

  }]);
})();
