(function() {
  'use strict';
  /**
   * @ngdoc Filter
   * @name BeautyCollective.Components.Filters.truncateWords
   * @module BeautyCollective.Components.Filters
   *
   * @description
   * truncateWords is used to truncate words by given length
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Components.Filters')
    .filter('truncateWords', function() {
      return function(input, words) {
        if (isNaN(words)) {
          return input;
        }
        if (words <= 0) {
          return '';
        }
        if (input) {
          var inputWords = input.split(/\s+/);
          if (inputWords.length > words) {
            input = inputWords.slice(0, words).join(' ') + '...';
          }
        }
        return input;
      };
    });
})();