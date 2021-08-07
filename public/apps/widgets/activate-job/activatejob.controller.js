(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.ActivatejobController
     * @module BeautyCollective.Widgets
     *
     * @description
     * ActivatejobController is responsible for activating job
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .controller('ActivatejobController', ActivatejobController);

    /* @ngInject */

    function ActivatejobController($sanitize,$q, Logger, Spinner, ActivatejobModel,toaster) {

        /**
         * [self description]
         * @type {[type]}
         */
        var self = this;

		self.showlink = (parseInt(self.status) && parseInt(self.daysleft)>=0) ? false : true ;
		init();
        /**
         * [init description]
         * @return {void}
         */
        function init() {
    		Logger.getInstance('ActivatejobController').info('Activatejob Controller has initialized');
		}
		
		  
	  self.activateJob= function() {
		ActivatejobModel.ActivateJob({
			},{id:self.id,action:self.showlink}).then(function(responce){
				if(responce.status){
					self.showlink = !self.showlink;
                    toaster.pop('success',responce.title,responce.message);
				}else{
					toaster.pop('error',responce.title, "There are some issues to activate your job.");
				}
			},function(){
		});
	  };
    }
})();
