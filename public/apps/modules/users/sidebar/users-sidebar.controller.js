(function () {
  'use strict';
  /**
   * @ngdoc Controller
   * @name UsersSidebarController
   * @module BeautyCollective.Users
   *
   * @description
   * UsersSidebarController is used to maintain the ui state for sidebar
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  /* @ngInject */
  function UsersSidebarController(Principal, Logger, AclService, $scope) {
    var self = this;


    function init() {
      Logger.getInstance('UsersSidebarController').info('Controller has initialized');
    }

    Principal.identity(true).then(function (data) {
      self.user = data;
      self.profilePic = (data.profilePictureUrl !== '') ? data.profilePictureUrl : 'img/avatar.png';
    });
    init();
   
    $scope.can = AclService.can;
  } //end of controller

  angular
    .module('BeautyCollective.Users')
    .controller('UsersSidebarController', UsersSidebarController);
})();
