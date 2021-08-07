(function() {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Widgets.Service.BookingModel
     * @module BeautyCollective.Widgets
     *
     * @description
     *
     * Data model for Booking module
     * Implemenets CURD operation
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .service('BookingModel', BookingModel);

    /* @ngInject */
    function BookingModel(BookingResource) {
        var model = this;
       
		/**
         * [saveBooking description]
         * @method saveBooking
         * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
         * @param  {[type]}          params [description]
         * @return {[type]}                 [description]
         */
		
		model.saveAppointment = function(params, success, fail) {
            return BookingResource.saveAppointment(params, success, fail).$promise;
        };
		
		model.getServices = function(params, success, fail) {
            return BookingResource.getServices(params, success, fail).$promise;
        };
        
    }
})();
