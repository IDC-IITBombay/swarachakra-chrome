/*
//  This file should be responsible
// for tracking all inputs on a page.
//  and then triggering an event on
//  focus, unfocus that calls / hides the keyboard
*/


$(document).ready(function() {
  // $('body').attr('ng-app', 'Swarachakra'); // adds angular dependancy. Why? TODO!

  var totalinputs = 0; // initialise
  $("input[type='text'], textarea").each( function(index) {
    totoalinputs = totalinputs + 1;
  }).focus( function() {
    if (!$(this).hasClass('swarachakrainputenabled')) {
      $(this).addClass('swarachakrainputenabled'); // Adds the swarachakra Class on focus.
      console.log($(this));
    }
  }).focusout(function() {
    if ($(this).hasClass('swarachakrainputenabled')) {
      $(this).removeClass('swarachakrainputenabled'); // Removes the swarachakra class when out of focus.
    }
  });
});
