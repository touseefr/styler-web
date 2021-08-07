(function() {
    'use strict';
    /**
     * @ngdoc Service
     * @name BeautyCollective.Widgets.Service.EmailModel
     * @module BeautyCollective.Widgets
     *
     * @description
     *
     * Data model for jobtask module
     * Implemenets CURD operation
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .service('EmailModel', EmailModel);

    /* @ngInject */
    function EmailModel(EmailResource) {
        var model = this;
        /**
         * Send email to user
         * @param message message
         * @return message send
         */
        model.sendMail = function(message) {
            return EmailResource.sendMail(message).$promise;
        };
    }
})();
