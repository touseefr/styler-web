(function() {
    'use strict';

    /**
     * @ngdoc overview
     * @name GlobalBeautyCollective
     *
     * @module GlobalBeautyCollective
     *
     * @description
     * Configuartion while provider are created
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular.module('BeautyCollective.GlobalBeautyCollective', [
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
        'BeautyCollective.Widgets'

    ]);
})();
