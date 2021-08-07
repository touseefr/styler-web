(function() {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Core.main.Factory.utilFactory
     * @module BeautyCollective.Core
     *
     * @description
     * util factory contains all generic methods
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Core')
        .factory('utilFactory', utilFactory)
        .filter('parseDate', function() {
            return function(value) {
                return Date.parse(value);
            };
        });;

    /* @ngInject */
    function utilFactory() {
        var util = {},
            bgColors;
        /**
         * [getBgColors description]
         * @method getBgColors
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @return {[type]}    [description]
         */
        util.getBgColors = function() {
            return bgColors;
        };
        /**
         * [getStatus description]
         * @method getStatus
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}  statusCode [description]
         * @return {[type]}             [description]
         */
        util.getStatus = function(statusCode) {
            var colorCode = '',
                _statusCode = angular.isDefined(statusCode) ? statusCode.toLowerCase() : '',
                label;
            switch (_statusCode) {
                case 'ontrack':
                    colorCode = 'success';
                    label = 'On Track';
                    break;
                case 'aheadoftrack':
                    colorCode = 'blue';
                    label = 'Ahead Of Track';
                    break;
                case 'behindtrack':
                    colorCode = 'danger';
                    label = 'Behind Track';
                    break;
                case 'notstarted':
                    colorCode = 'danger';
                    label = 'Not Started';
                    break;

            }
            return {
                colorCode: colorCode,
                label: label
            };
        };

        /**
         * [getNotificationTypeLable description]
         * @method getNotificationTypeLable
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}                 eventType [description]
         * @return {[type]}                           [description]
         */
        util.getNotificationTypeLable = function(eventType) {
            var notificationLable = '';
            switch (eventType) {
                case 0:
                    notificationLable = 'added';
                    break;
                case 1:
                    notificationLable = 'updated';
                    break;
            }
            return notificationLable;
        };
        /**
         * [getFileType description]
         * @method getFileType
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}  fileType [description]
         * @return {Boolean}          [description]
         */
        util.getFileType = function(fileType) {
            var _imageTypes = ['jpg', 'gif', 'png', 'bmp', 'jpeg', 'tif'],
                _videoTypes = ['3g2', '3gp', 'asf', 'asx', 'avi', 'flv', 'mov', 'mp4', 'mpg', 'rm', 'swf', 'vob', 'wmv'],
                _fileString;
            if (!fileType) {
                fileType = '';
            }

            var _fileType = fileType.toLowerCase();

            if (_imageTypes.indexOf(_fileType) >= 0) {
                return {
                    'type': 'image',
                    'icon': 'fa fa-camera bg-purple'
                };
            } else if (_videoTypes.indexOf(_fileType) >= 0) {
                return {
                    'type': 'video',
                    'icon': 'fa fa-video-camera bg-maroon'
                };
            } else {
                return {
                    'type': 'doc',
                    'icon': 'fa fa-file-code-o bg-green'
                };
            }
        };

        /**
         * addTime
         * helper function to add time in given date
         * @param {[type]} date [description]
         */
        util.addTime = function(date) {
            date.hours(moment().hours());
            date.minutes(moment().minutes());
            date.seconds(moment().seconds());
            date.milliseconds(moment().milliseconds());
            return date;
        };

        util.getCurrentUtcDate = function() {
            return moment.utc().format('YYYY-MM-DD HH:mm:ss');
        };

        util.readCookie = function(name) {
            var cookie_start = document.cookie.indexOf(name);
            var cookie_end = document.cookie.indexOf(";", cookie_start);
            return cookie_start == -1 ? '' : decodeURIComponent(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
        };

        return util;
    }
})();
