(function() {
    'use strict';
    /**
     * @ngdoc overview
     * @name BeautyCollective.Dashboard
     * @module BeautyCollective.Dashboard
     *
     * @description
     * Dashboard task module
     * @see Dashboard.model.js
     * @see Dashboard.resource.js
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Dashboard', ['ui.bootstrap',
            'BeautyCollective.Core',
            'BeautyCollective.Components',
            'BeautyCollective.Widgets',
            'BeautyCollective.Dashboard',
            'BeautyCollective.Pages',
            'BeautyCollective.Users',
            'BeautyCollective.Account',
            'BeautyCollective.Listing',
            'BeautyCollective.Suburbs'
        ]);
})();
