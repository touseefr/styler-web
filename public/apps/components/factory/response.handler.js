(function() {
  'use strict';
  /**
   * @ngdoc factory
   * @name BeautyCollective.factory.ResponseHandler
   * @module BeautyCollective
   *
   * @description
   * ResponseHandler factory handles response from server
   * handle success message and error message based on response from server
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective')
    .factory('ResponseHandler', ResponseHandlerFactory);

  /* @ngInject */
  function ResponseHandlerFactory(notify, $filter, $q) {

    function ResponseHandlerFactory() {
      this.notifyConfig = {
        title: '',
        message: ''
      };

      this.setNotifyConfig = function(title, message) {
        this.notifyConfig = {
          title: title,
          message: message
        }
      }

      this.showNotification = function(type) {
        ('error' === type) ? notify.error(this.notifyConfig): notify.success(this.notifyConfig)
      }
    }
    ResponseHandlerFactory.prototype.success = function(successObj, showNotify) {
      var deferred = $q.defer();
      if (!successObj.data && !success.data.type) {

        deferred.resolve({
          type: ((success.status === 200) && (success.statusText === 'OK')) ? 'success' : 'error',
          message: success.statusText
        });
        return deferred.promise;
      }
      var successData = successObj.data,
        messageType,
        message;
      message = $filter('translate')('SERVER.' + successData.code);

      this.setNotifyConfig(successData.type, message);
      messageType = (successData.type.toLowerCase() === 'success') ? 'success' : 'error';
      if (showNotify) {
        this.showNotification(messageType);
      }

      deferred.resolve({
        type: messageType,
        message: message
      });

      return deferred.promise;
    };

    ResponseHandlerFactory.prototype.error = function(errorObj, showNotify) {
      var deferred = $q.defer();
      var message = errorData.message || errorData.statusText;
      this.setNotifyConfig('Error', message);
      if (showNotify) {
        this.showNotification('error');
      }
      deferred.resolve({
        type: 'error',
        message: message
      });

      return deferred.promise;
    };
    return new ResponseHandlerFactory();

  }

})();
