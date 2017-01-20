/**
 * @Author: Stijn Van Hulle <stijnvanhulle>
 * @Date:   2016-02-24T15:17:14+01:00
 * @Email:  me@stijnvanhulle.be
* @Last modified by:   stijnvanhulle
* @Last modified time: 2016-10-28T19:37:25+02:00
 * @License: stijnvanhulle.be
 */
import $ from 'jquery';
var Vm = {};

let checkOverlay = () => {
  let overlay = $('body #overlay');
  if (!overlay || overlay.length == 0) {
    $('body').append('<div id="overlay"><aside><aside></div>');
  }
  return overlay;
};

Vm.showMessage = function(title, msg, sec) {
  checkOverlay();

  if (sec == null) {
    sec = 5000 + 400;
  }
  if (msg == null) {
    msg = "";
  }

  $('#overlay.message aside').empty();
  $('#overlay').removeClass('message');

  $('#overlay').addClass('message');
  $('#overlay.message aside').html("<h1>" + title + "</h1><div>" + msg + "</div> ");
  $('#overlay.message').css('animation-direction', 'normal');

  setTimeout(function() {
    $('#overlay.message').css('animation', 'fadeInUp_R .4s ease-in-out both');
  }, sec);

  setTimeout(function() {
    $('#overlay.message').css('animation', '');
    $('#overlay.message').css('animation-direction', '');
    $('#overlay').removeClass('message');
  }, sec + 400);
};
Vm.hideMessage = () => {
  checkOverlay();

  $('#overlay.message aside').empty();
  $('#overlay').removeClass('message');
};
Vm.showLoading = function(isLoading, text) {
  checkOverlay();
  var sec = 1000;
  if (text == null) {
    text = "Loading";
  }
  var msg = '';
  if (isLoading == true) {
    $('#overlay.message aside').empty();
    $('#overlay').addClass('message');
    $('#overlay #loading').css('background', '');
    $('#overlay.message aside').html("<h1>" + text + "</h1><div><aside id='loading'></aside>" + msg + "</div> ");
    $('#overlay.message').css('animation-direction', 'normal');
  } else {
    $('#overlay.message aside').empty();
    $('#overlay.message aside').html("<h1>" + text + "</h1><div><aside id='loading'></aside>" + msg + "</div> ");
    $('#overlay #loading').css('animation', '');
    $('#overlay #loading').css('background', 'none');

    setTimeout(function() {
      $('#overlay.message').css('animation', 'fadeInUp_R .4s ease-in-out both');
    }, sec);
    setTimeout(function() {
      $('#overlay.message').css('animation', '');
      $('#overlay.message').css('animation-direction', '');
      $('#overlay #loading').css('background', '');
      $('#overlay').removeClass('message');
      $('#overlay.message aside').empty();
    }, sec + 400);
  }
};

Vm.showPrompt = function(title, msg, cb) {
  checkOverlay();
  var sec = 1000;
  if (msg == null) {
    msg = "";
  }
  if (cb == null) {
    cb = msg;
    msg = "";
  }
  $('#overlay.prompt aside').empty();
  $('#overlay').removeClass('prompt');

  $('#overlay').addClass('prompt');
  $('#overlay.prompt aside').html("<h1>" + title + "</h1><div>" + msg + "</div>" + "<div class='buttons'> <button class='ui primary button yes'>Yes</button><button class='ui button no gray'>No</button></div>");

  $('#overlay.prompt').css('animation-direction', 'normal');
  $("#overlay.prompt .buttons .yes").click(function() {
    //hide();
    cb(null, true);
  });
  $("#overlay.prompt .buttons .no").click(function() {
    hide();
    cb(null, false);
  });
  var hide = function() {
    $('#overlay.prompt').css('animation', 'fadeInUp_R .4s ease-in-out both');

    setTimeout(function() {
      $('#overlay.prompt').css('animation', '');
      $('#overlay.prompt').css('animation-direction', '');
      $('#overlay').removeClass('prompt');
    }, 400);
  };

};
Vm.hidePrompt = function() {
  checkOverlay();
  var hide = function() {
    $('#overlay.prompt').css('animation', 'fadeInUp_R .4s ease-in-out both');

    setTimeout(function() {
      $('#overlay.prompt').css('animation', '');
      $('#overlay.prompt').css('animation-direction', '');
      $('#overlay').removeClass('prompt');
    }, 400);
  };

  hide();
};

//ko

export default Vm;
