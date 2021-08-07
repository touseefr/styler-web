(function() {
    'use strict';
    /**
     * @ngdoc Factory
     * @name BeautyCollective.Account.Factory.AccountFactory
     * @module BeautyCollective.Account
     *
     * @description
     *
     * AccountFactory handles business logic and common features
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Account')
        .service('AccountFactory', AccountFactory);

    /* @ngInject */
    function AccountFactory() {
        var factory = {};

        factory.getDefaultBusinessHours = function() {
            return {
                monday: {
                    open: moment.utc().toDate(),
                    close: moment().add(7, 'hours').utc().toDate()
                },
                tuesday: {
                    open: moment.utc().toDate(),
                    close: moment().add(7, 'hours').utc().toDate()
                },
                wednesday: {
                    open: moment.utc().toDate(),
                    close: moment().add(7, 'hours').utc().toDate()
                },
                thursday: {
                    open: moment.utc().toDate(),
                    close: moment().add(7, 'hours').utc().toDate()
                },
                friday: {
                    open: moment.utc().toDate(),
                    close: moment().add(7, 'hours').utc().toDate()
                },
                saturday: {
                    open: moment.utc().toDate(),
                    close: moment().add(7, 'hours').utc().toDate()
                },
                sunday: {
                    open: moment.utc().toDate(),
                    close: moment().add(7, 'hours').utc().toDate()
                }
            };
        };

        factory.getDefaultBusinessDays = function() {
            return [{
                day: 'monday',
                isOpen: false,
                isClose: false
            }, {
                day: 'tuesday',
                isOpen: false,
                isClose: false
            }, {
                day: 'wednesday',
                isOpen: false,
                isClose: false
            }, {
                day: 'thursday',
                isOpen: false,
                isClose: false
            }, {
                day: 'friday',
                isOpen: false,
                isClose: false
            }, {
                day: 'saturday',
                isOpen: false,
                isClose: false
            }, {
                day: 'sunday',
                isOpen: false,
                isClose: false
            }];
        };

        return factory;
    }
})();
