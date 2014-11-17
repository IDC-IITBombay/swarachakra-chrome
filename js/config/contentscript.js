/*
//  This file should be responsible
// for tracking all inputs on a page.
//  and then triggering an event on
//  focus, unfocus that calls / hides the keyboard
*/


$(document).ready(function() {
  $('body').attr('ng-app', 'Swarachakra');

  var totalinputs = 0; // initialise
  $("input[type='text']").each( function(index) {
     totalinputs = totalinputs + 1;
     console.log(totalinputs);
  });
  console.log(totalinputs);
});
