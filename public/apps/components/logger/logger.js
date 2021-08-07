(function() {
  'use strict';
  /**
   * @module Logger
   * Logger module is use full for debugging code
   *
   * Usage :
   *
   * angular.module('app').controller('Controller',['Logger', function(Logger){
   *
   *  //Get an instance of Controller to track info
   *  var logger = Logger.getInstance('Controller');
   *  //Simple info log
   *  logger.log('This is a log');
   *  //If you want to show any warning
   *  logger.warn('warn', 'This is a warn');
   *  //Show error log
   *  logger.error('This is a {0} error! {1}', [ 'big', 'just kidding' ]);
   *  //Debug error
   *  logger.debug('debug', 'This is a debug for line {0}', [ 8 ]);
   *
   * }]);
   *
   *
   * Similar implementaion with directive, service, factory etc.
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   **/
  angular
    .module('logger', [])
    .provider('Logger', [

      function() {
        /**
         * flag to holds boolean value
         * @True {bool}
         */
        var isEnabled = true;
        /**
         * Set isEnabled flag to [true|false]
         * @method enabled
         * @param  {[boolean]} _isEnabled Flag to set [true|false]
         * @return {[void]}
         */
        this.enabled = function(_isEnabled) {
          isEnabled = !!_isEnabled;
        };
        /**
         * Logger provider construct which returned while provide is used in controller
         * Services and factory or directive
         * @requires $log Angular $log service
         * @True {Array}
         */
        this.$get = ['$log',
          function($log) {
            /**
             * Logger class
             *
             * @method Logger
             * @param  {[Object]} context [controller, service, factory etc...]
             */
            var Logger = function(context) {
              this.context = context;
            };
            /**
             * Returns context
             * @method getInstance
             * @param  {[Object]} context [controller, service, factory etc...]
             */
            Logger.getInstance = function(context) {
              return new Logger(context);
            };
            /**
             * Returns an string based on supplied arguments
             *
             * @method supplant
             * @param  {[string]} str message string
             * @param  {[type]} o   type
             * @return {[void]}
             */
            Logger.supplant = function(str, o) {
              return str.replace(
                /\{([^{}]*)\}/g,
                function(a, b) {
                  var r = o[b];
                  return typeof r === 'string' || typeof r === 'number' ? r : a;
                }
              );
            };
            /**
             * Returns logger time
             * @method getFormattedTimestamp
             * @param  {[string]}              date logged date
             * @return {[void]}
             */
            Logger.getFormattedTimestamp = function(date) {
              return Logger.supplant('{0}:{1}:{2}:{3}', [
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
              ]);
            };
            /**
             * Lets add some methods to Logger's prototype
             * @True {Object}
             */
            Logger.prototype = {
              /**
               * Log messages
               * Check if logger enabled
               *
               * @method  _log
               * @param   {[object]} originalFn callback function
               * @param   {[array | object]} args       arguments
               * @return  {[void]}
               * @private
               */
              _log: function(originalFn, args) {
                if (!isEnabled) {
                  return;
                }

                var now = Logger.getFormattedTimestamp(new Date());
                var message = '',
                  supplantData = [];
                switch (args.length) {
                  case 1:
                    message = Logger.supplant('{0} - {1}: {2}', [now, this.context, args[0]]);
                    break;
                  case 3:
                    supplantData = args[2];
                    message = Logger.supplant('{0} - {1}::{2}(\'{3}\')', [now, this.context, args[0], args[1]]);
                    break;
                  case 2:
                    if (typeof args[1] === 'string') {
                      message = Logger.supplant('{0} - {1}::{2}(\'{3}\')', [now, this.context, args[0], args[1]]);
                    } else {
                      supplantData = args[1];
                      message = Logger.supplant('{0} - {1}: {2}', [now, this.context, args[0]]);
                    }
                    break;
                }

                $log[originalFn].call(null, Logger.supplant(message, supplantData));
              },
              /**
               * Log default message
               *
               * @method log
               * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
               */
              log: function() {
                this._log('log', arguments);
              },
              /**
               * Log info message
               *
               * @method info
               */
              info: function() {
                this._log('info', arguments);
              },
              /**
               * Log warn message
               *
               * @method warn
               */
              warn: function() {
                this._log('warn', arguments);
              },
              /**
               * Log debug messae
               *
               * @method debug
               */
              debug: function() {
                this._log('debug', arguments);
              },
              /**
               * Log error message
               *
               * @method error
               */
              error: function() {
                this._log('error', arguments);
              }
            };
            return Logger;
          }
        ];
      }
    ]);
})();