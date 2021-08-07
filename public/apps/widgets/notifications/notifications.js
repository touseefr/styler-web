'use strict';
angular
  .module('BeautyCollective.Widgets')
  .directive('notifications',function(){
		return {
        templateUrl:'widgets/notifications/notifications.html',
        restrict: 'E',
        replace: true,
    	};
	});


