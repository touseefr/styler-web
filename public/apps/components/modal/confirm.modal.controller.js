(function() {
  'use strict';

  /**
   * @ngdoc Controller
   * @name BeautyCollective.Components.modal.ConfirmModalController
   * 
   * @module modal
   *
   * @description
   * Handles confirm modals actions
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Components.modal')
    .controller('ConfirmModalController', ['$scope',
      '$modalInstance',
      'data',
      function($scope, $modalInstance, data) {

        $scope.header = (angular.isDefined(data.header) && (data.header !== '')) ? data.header : 'Please confirm';
        $scope.msg = (angular.isDefined(data.msg)) ? data.msg : 'Do you want to perform this action?';

        $scope.no = function() {
          $modalInstance.dismiss('no');
        };
        $scope.yes = function() {
          $modalInstance.close('yes');
        };
      }
    ]);

})();
