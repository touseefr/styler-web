(function() {
    'use strict';
    if (typeof _.contains === 'undefined') {
        _.contains = _.includes;
        _.prototype.contains = _.includes;
    }
    if (typeof _.object === 'undefined') {
        _.object = _.zipObject;
    }
    /**
     * @ngdoc overview
     * @name BeautyCollective
     *
     * @module BeautyCollective
     *
     * @description
     * Configuartion while provider are created
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular.module('BeautyCollective', [
        /*
         * Order is not important. Angular makes a
         * pass to register all of the modules listed
         */

        /*
         * Everybody has access to these.
         * We could place these under every feature area,
         * but this is easier to maintain.
         */
        'BeautyCollective.Core',
        'BeautyCollective.Components.Directvies'

    ]);

    angular.element(document).ready(function() {
        var location = window.location;
        if (location.pathname == '/account') {
            console.info('BeautyCollective.Dashboard is running......');
            angular.bootstrap(document, ['BeautyCollective.Dashboard']);
        } else {
            angular.bootstrap(document, ['BeautyCollective.GlobalBeautyCollective']);
            console.info('BeautyCollective.GlobalBeautyCollective is running......');
        }
    });
})();
