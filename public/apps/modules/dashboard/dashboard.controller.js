(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Serviceprovider.Controller.DashboardController
     * @module BeautyCollective.Account
     *
     * @description
     * DashboardController is responsible manage account activities
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */

    /* @ngInject */
    function DashboardController($scope,$state, $window,Laravel) {
        var self = this,roles = [];
        init();

        /**
         * initialize properties
         * 
         * @private
         * @return {void}
         */

        function init() {
            roles = angular.fromJson(Laravel.roles);
			roles = _.map(roles, function(role){
                return (role.name).toLowerCase();
            });
			if($state.current.name === 'account' && $state.current.url === '/'){
                
				if(roles[0]=='individual' || roles[0]=='jobseeker'){
					$state.go('user.detail');
				}else{
					$state.go('settings.details');
				}
			}
        }

        self.hasRole = function(roleName) {
            return roles.indexOf(roleName) >= 0;
        }

        

    }
    //end of controller

    angular
        .module('BeautyCollective.Account')
        .controller('DashboardController', DashboardController);
})();
