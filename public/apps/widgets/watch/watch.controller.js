(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.AddtowatchController
     * @module BeautyCollective.Widgets
     *
     * @description
     * AddtowatchController is responsible for booking appointments
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .controller('AddtowatchController', AddtowatchController);

    /* @ngInject */

    function AddtowatchController($sanitize,$q, Logger, Spinner, AddtowatchModel,toaster) {

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
    		//Logger.getInstance('ShortlistjobController').info('AddtowatchList Controller has initialized');
		}
		
		  
	  self.AddtowatchList= function() {
		Spinner.start();
		AddtowatchModel.AddtowatchList({
			},{id:self.id}).then(function(responce){
				if(responce.status){
                    toaster.pop('success', self.type+" Saved", responce.message);
				}else{
					toaster.pop('error', self.type+" Already Saved", responce.message);
				}
				Spinner.stop();
			},function(){
			Spinner.stop();
		});
	  };

		
	}
})();
