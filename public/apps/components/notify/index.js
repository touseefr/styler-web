(function() {
  'use strict';

  /*
   * AngularJS Notify
   * Version: 0.4.12
   *
   * Copyright 2015-2016 Jiri Kavulak.
   * All Rights Reserved.
   * Use, reproduction, distribution, and modification of this code is subject to the terms and
   * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
   *
   * Author: Mohan Singh <singhmohancs@gmail.com>
   */

  angular
    .module('ngNotify', []);

  angular
    .module('ngNotify')
    .factory('notify', ['$timeout', '$http', '$compile', '$templateCache', '$rootScope', '$document',
      function($timeout, $http, $compile, $templateCache, $rootScope, $document) {
        var _this = this;
        var startTop = 5;
        var verticalSpacing = 15;
        var duration = 10000;
        var defaultTemplateUrl = 'components/notify/notify.html';
        var position = 'right';
        var container = $document[0].body;

        _this.positionClass = 'notify-top-right';

        var messageElements = [];

        var notify = function(args) {
          _this.type = _this.type || args.type;
          if (typeof args !== 'object') {
            args = {
              message: args
            };
          }
          args.templateUrl = args.templateUrl ? args.templateUrl : defaultTemplateUrl;
          args.position = args.position ? args.position : position;
          args.container = args.container ? args.container : container;
          args.classes = args.classes ? args.classes : _this.positionClass;
          args.title = args.title ? args.title : (_this.title || 'Notification');

          var scope = args.scope ? args.scope.$new() : $rootScope.$new();
          scope.$message = args.message;
          scope.$classes = args.classes;
          scope.$messageTemplate = args.messageTemplate;
          scope.$type = _this.type;
          scope.$title = args.title;

          $http.get(args.templateUrl, {
            cache: $templateCache
          }).success(function(template) {

            var templateElement = $compile(template)(scope);
            templateElement.bind('webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd', function(e) {
              if (e.propertyName === 'opacity' || e.currentTarget.style.opacity === 0 ||
                (e.originalEvent && e.originalEvent.propertyName === 'opacity')) {

                templateElement.remove();
                messageElements.splice(messageElements.indexOf(templateElement), 1);
                layoutMessages();
              }
            });

            if (args.messageTemplate) {
              var messageTemplateElement;
              for (var i = 0; i < templateElement.children().length; i++) {
                if (angular.element(templateElement.children()[i]).hasClass('cg-notify-message-template')) {
                  messageTemplateElement = angular.element(templateElement.children()[i]);
                  break;
                }
              }
              if (messageTemplateElement) {
                messageTemplateElement.append($compile(args.messageTemplate)(scope));
              } else {
                throw new Error('cgNotify could not find the .cg-notify-message-template element in ' + args.templateUrl + '.');
              }
            }

            angular.element(args.container).append(templateElement);
            messageElements.push(templateElement);

            if (args.position === 'center') {
              $timeout(function() {
                templateElement.css('margin-left', '-' + (templateElement[0].offsetWidth / 2) + 'px');
              });
            }

            scope.$close = function() {
              templateElement.remove();
              layoutMessages();
            };

            var layoutMessages = function() {
              var j = 0;
              var currentY = startTop;
              for (var i = messageElements.length - 1; i >= 0; i--) {
                var shadowHeight = 10;
                var element = messageElements[i];
                var height = element[0].offsetHeight;
                var top = currentY + height + shadowHeight;
                if (element.attr('data-closing')) {
                  top += 20;
                } else {
                  currentY += height + verticalSpacing;
                }
                element.css('top', top + 'px').css('margin-top', '-' + (height + shadowHeight) + 'px').css('visibility', 'visible');
                j++;
              }
            };

            $timeout(function() {
              layoutMessages();
            });

            if (duration > 0) {
              $timeout(function() {
                scope.$close();
              }, duration);
            }

          }).error(function(data) {
            throw new Error('Template specified for cgNotify (' + args.templateUrl + ') could not be loaded. ' + data);
          });

          var retVal = {};

          retVal.close = function() {
            if (scope.$close) {
              scope.$close();
            }
          };
          Object.defineProperty(retVal, 'message', {
            get: function() {
              return scope.$message;
            },
            set: function(val) {
              scope.$message = val;
            }
          });




          return retVal;

        };
        /**
         * addNewNotifyEvent Event handler which is captured
         *
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {Object} $event Captured event data
         * @return {Object} args Data which is attached to addNewNotify event
         */
        var addNewNotifyEvent = $rootScope.$on('addNewNotify', function($event, args) {
          notify.error(args);
        });
        /**
         * Remove event from $rootScope
         */
        $rootScope.$on('$destroy', addNewNotifyEvent);
        /**
         * config Sets Notify congigurations
         * @method config
         *
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {Object} args A object which holds configuration of Notify
         * @return {Void}
         */
        notify.config = function(args) {
          startTop = !angular.isUndefined(args.startTop) ? args.startTop : startTop;
          verticalSpacing = !angular.isUndefined(args.verticalSpacing) ? args.verticalSpacing : verticalSpacing;
          duration = !angular.isUndefined(args.duration) ? args.duration : duration;
          defaultTemplateUrl = args.templateUrl ? args.templateUrl : defaultTemplateUrl;
          position = !angular.isUndefined(args.position) ? args.position : position;
          container = args.container ? args.container : container;
          _this.positionClass = args.positionClass ? args.positionClass : 'notify-top-right';
        };
        /**
         * Close all opened Notifications
         * @method closeAll
         *
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @return {Void}
         */
        notify.closeAll = function() {
          for (var i = messageElements.length - 1; i >= 0; i--) {
            var element = messageElements[i];
            element.css('opacity', 0);
          }
        };
        /**
         * A success notification
         * @method success
         *
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {Object} args [title,message,type...etc]
         * @return {Void}
         */
        notify.success = function success(args) {
          _this.type = 'notify-success';
          _this.title = 'Success';
          notify(args);
        };
        /**
         * A information notification
         * @method info
         *
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {Object} args [title,message,type...etc]
         * @return {Void}
         */
        notify.info = function info(args) {
          _this.type = 'notify-info';
          _this.title = 'Information';
          notify(args);
        };
        /**
         * A error notification
         * @method error
         *
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {Object} args [title,message,type...etc]
         * @return {Void}
         */
        notify.error = function error(args) {
          _this.type = 'notify-error';
          _this.title = 'Error';
          notify(args);
        };
        /**
         * A warning notification
         * @method warning
         *
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {Object} args [title,message,type...etc]
         * @return {Void}
         */
        notify.warning = function warning(args) {
          _this.type = 'notify-warning';
          _this.title = 'Warning';
          notify(args);
        };
        /**
         * A wait notification
         * @method wait
         *
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {Object} args [title,message,type...etc]
         * @return {Void}
         */
        notify.wait = function wait(args) {
          _this.type = 'notify-wait';
          _this.title = 'Please wait';
          notify(args);
        };
        return notify;
      }
    ]);
})(window, document);