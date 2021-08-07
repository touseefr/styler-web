(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.EmailController
     * @module BeautyCollective.Widgets
     *
     * @description
     * EmailController is responsible for send email to individual user
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .controller('EmailController', EmailController);

    /* @ngInject */

    function EmailController($sanitize,$q, Logger, Spinner, EmailModel,toaster) {

        /**
         * [self description]
         * @type {[type]}
         */
        var self = this;
		init();
        /**
         * [init description]
         * @return {void}
         */
        function init() {
           Logger.getInstance('EmailController').info('Email Controller has initialized');
        }
		
		 
		 /**
		* Save Review
		* @params {Object}
		* @return {id}
		*/
		
		 self.sendEmail = function() {
		   var _message = angular.copy(self.message);
		   Spinner.start();
		   EmailModel.sendMail({
                    'message': _message,
                    'to_user': self.userto,
                    'from_user': self.userfrom,
           }).then(function(responce){
				toaster.pop('success', "Message Sent", "Your message has been Sent successfully.");
				self.message='';
				Spinner.stop();
				},function(error){
				self.message='';
                Spinner.stop();         
            });
		 };
    }
})();
