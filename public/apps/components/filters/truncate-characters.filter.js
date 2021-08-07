(function() {
  'use strict';
  /**
   * @ngdoc Filter
   * @name BeautyCollective.Components.Filters.truncateCharacters
   * @module BeautyCollective.Components.Filters
   *
   * @description
   * truncateCharacters is used to truncate Characters by given length
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Components.Filters')
    .filter('truncateCharacters', function() {
      return function(input, chars, breakOnWord) {
        if (isNaN(chars)) {
          return input;
        }
        if (chars <= 0) {
          return '';
        }
        if (input && input.length > chars) {
          input = input.substring(0, chars);

          if (!breakOnWord) {
            var lastspace = input.lastIndexOf(' ');
            // Get last space
            if (lastspace !== -1) {
              input = input.substr(0, lastspace);
            }
          } else {
            while (input.charAt(input.length - 1) === ' ') {
              input = input.substr(0, input.length - 1);
            }
          }
          return input + '...';
        }
        return input;
      };
    });
})();