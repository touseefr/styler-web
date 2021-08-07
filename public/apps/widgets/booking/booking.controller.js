(function () {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.BookingController
     * @module BeautyCollective.Widgets
     *
     * @description
     * BookingController is responsible for booking appointments
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
            .module('BeautyCollective.Widgets')
            .controller('BookingController', BookingController);

    /* @ngInject */

    function BookingController($sanitize, $q, Logger, Spinner, BookingModel, uibDateParser, toaster) {

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
            Logger.getInstance('BookingController').info('Booking Controller has initialized');
            self.serviceprovidercategories = (self.categories) ? angular.fromJson(self.categories) : [];
            self.services = [];
        }

        self.today = function () {
            self.appointmentdate = new Date();
        };
        self.today();

        self.clear = function () {
            self.appointmentdate = null;
        };

        // Disable weekend selection
        self.disabled = function (date, mode) {
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        };

        self.toggleMin = function () {
            self.minDate = self.minDate ? null : new Date();
        };

        self.toggleMin();
        self.maxDate = new Date(2020, 5, 22);

        self.open1 = function () {
            self.popup1.opened = true;
        };

        self.setDate = function (year, month, day) {
            self.appointmentdate = new Date(year, month, day);
        };

        self.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        self.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        self.format = self.formats[0];
        self.altInputFormats = ['M!/d!/yyyy'];

        self.popup1 = {
            opened: true
        };

        self.appointmenttime = new Date();

        self.hstep = 1;
        self.mstep = 5;

        self.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        self.ismeridian = true;
        self.toggleMode = function () {
            self.ismeridian = !self.ismeridian;
        };

        self.appointmentservices = [{
                index: 1,
                category: null,
                service: null
            }];
        self.removeService = function (index) {
            //var index = self.services.indexOf($file.id);
            for (var item in self.appointmentservices) {
                if (self.appointmentservices[item].index == index) {
                    self.appointmentservices.splice(item, 1);
                    break;
                }
            }
        };
        self.addService = function (last) {
            self.appointmentservices.push({
                index: last + 1,
                category: null,
                service: null
            });
        };
        self.bookAppointment = function () {
            Spinner.start();
            var _data = {'appointmentdate': self.appointmentdate,
                'appointmenttime': self.appointmenttime,
                'appointmentservices': angular.toJson(self.appointmentservices),
                'touser': self.userto
            }
            if (self.appointmenttime < new Date()) {
                toaster.pop('error', 'Invalid Date', 'You can\'t select past time.');
                Spinner.stop();
            } else {
                BookingModel.saveAppointment({
                }, _data).then(function (responce) {
                    self.appointmentservices = [{
                            index: 1,
                            category: null,
                            service: null
                        }];
                    Spinner.stop();
                    toaster.pop('success', 'Appointment Booked', 'Your appointment has been booked successfully.');
                }, function () {
                    Spinner.stop();
                    toaster.pop('error', 'Appointment Booked', 'Something went worng! we can\'t book your appointment.');
                });
            }
        };
        self.selectCategory = function (item, id) {
            self.services[id] = [];
            BookingModel.getServices({
                'id': item.id
            }).then(function (responce) {
                self.services[id].serviceproviderServices = responce;
            }, function () {
            });
        }
    }
})();
