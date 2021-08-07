(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.AuthController
     * @module BeautyCollective.Widgets
     *
     * @description
     * AuthController is responsible for login implementation
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .controller('AuthController', AuthController);

    /* @ngInject */
    function AuthController($sanitize, $http, Logger, Spinner, SuburbsModel) {
        /**
         * [self description]
         * @type {[type]}
         */
        var self = this;
        /**
         * [userSchema description]
         * @type {Object}
         */
        self.userSchema = {
            name: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            password_confirmation: '',
            contact_number: '',
            business_name: '',
            account_type: 'individual',
            suburb: ''
        };
        /**
         * [login description]
         * @type {Object}
         */
        self.login = {
            email: '',
            password: ''
        };
        /**
         * [error description]
         * @type {String}
         */
        self.error = '';
        /**
         * [user description]
         * @type {Object}
         */
        self.user = angular.copy(self.userSchema);
        /**
         * [account_type description]
         * @type {String}
         */
        self.user_type = '';
        /**
         * [form description]
         * @type {String}
         */
        self.form = '';
        self.suburbList = [];

        init();
        /**
         * [init description]
         * @return {void}
         */
        function init() {
            Logger.getInstance('AuthController').info('Controller has initialized');
            self.isShown = true;
        }
        /**
         * [sanitizeCredentials description]
         * @author Mohan Singh <mslogicmaster@gmail.com>
         * @param  {[type]} credentials [description]
         * @return {[type]}             [description]
         */
        var sanitizeCredentials = function(credentials) {
            return {
                email: $sanitize(credentials.email),
                password: $sanitize(credentials.password)
            };
        };
        /**
         * [authentication description]
         * @author Mohan Singh <mslogicmaster@gmail.com>
         * @param  {[type]} credentials [description]
         * @return {[type]}             [description]
         */
        self.authentication = function() {
            Spinner.start();

            var login = $http.post("/auth/login", sanitizeCredentials(self.login));
            login.success(function(response) {
                window.location.href = '/account';
                Spinner.stop();
            });
            login.error(function(errorResponse) {
                self.errors = formartErrors(errorResponse);
                Spinner.stop();
            });
        };
        self.registerAccount = function() {
            if(self.user.terms_condition){
				Spinner.start();
				var user;
				self.user.name = self.user.name || (self.user.firstName + ' ' + self.user.lastName);
				user = angular.copy(self.user);
				user.account_type = self.activeForm;
				user.suburb = user.locations.location;
                user.state = user.locations.state;
                user.postcode =  user.locations.postcode;
                user.latitude =  user.locations.latitude;
                user.longitude = user.locations.longitude;

				var register = $http.post("/auth/register", user);
				register.success(function(response) {
					resetForm();
					self.errors = [];
					self.successMsg = 'Your account was successfully created. We have sent you an e-mail to confirm your account';
					Spinner.stop();
				});
				register.error(function(errorResponse) {
					self.errors = formartErrors(errorResponse);
					self.successMsg = '';
					Spinner.stop();
				});
			}else{
				self.userRegister.terms_condition.$invalid = true;
				self.userRegister.terms_condition.$pristine = false;
			}
        };

        function formartErrors(errors) {
            var errorLabels = [];
            if (angular.isObject(errors) && !errors.hasOwnProperty('success')) {
                for (var error in errors) {
                    for (var i = 0; i < errors[error].length; i++) {
                        errorLabels.push(errors[error][i]);
                    };
                }
            }
            if (errors.hasOwnProperty('success')) {
                if (errors.hasOwnProperty('error')) {
                    errorLabels.push(errors.error);
                }
            }
            return errorLabels;
        }

        /**
         * [dropdown description]
         * @type {Object}
         */
        self.dropdown = {
            login: {
                isopen: false,
                toggle: function() {
                    resetForm();
                    resetFlash();
                },
                toggleDropdown: function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    self.dropdown.login.isopen = !self.dropdown.login.isopen;
                }
            },
            register: {
                isopen: false,
                toggle: function() {
                    resetForm();
                    resetFlash();
                },
                toggleDropdown: function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    self.dropdown.register.isopen = !self.dropdown.register.isopen;
                }
            }

        };

        self.setUserType = function(userType) {
            resetForm();
            self.user_type = userType;
            self.user.account_type = userType;
        };


        function resetForm() {
            self.user = angular.copy(self.userSchema);
            self.userRegister ? self.userRegister.$setPristine() : angular.noop;
            self.userLogin ? self.userLogin.$setPristine() : angular.noop;
        }

        function resetFlash() {
            self.errors = [];
            self.successMsg = '';
        }
        /**
         * [selectForm description]
         * @param  {[type]} formName [description]
         * @return {[type]}          [description]
         */
        self.selectForm = function(formName) {
            self.activeForm = formName;
            resetForm();
            resetFlash();
        };

        /**
         * @param  {[type]}
         * @return {[type]}
         */
        self.getLocation = function(val) {
            if (val.length < 3) {
                return;
            }
            Spinner.start('search_location');
            SuburbsModel
                .findLocation({
                    'q': val
                }).then(function(successResponse) {
                    self.suburbList = successResponse.list;
                    Spinner.stop('search_location');
                }, function(errorResponse) {
                    console.log('Saving Details:', errorResponse);
                    Spinner.stop('search_location');
                });

        };

        self.modelOptions = {
            debounce: {
                default: 500
            },
            getterSetter: true
        };

    }
})();
