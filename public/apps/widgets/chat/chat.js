'use strict';
angular
  .module('BeautyCollective.Widgets')
  .directive('chat',function(){
		return {
        templateUrl:'/apps/widgets/chat/chat.html',
        restrict: 'E',
        replace: true,
    	};
	});


