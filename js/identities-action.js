/**
 * ===================================================================
 * register-action js
 *
 * -------------------------------------------------------------------
 */

(function ($) {

  "use strict";

  $('#webcamShow').hide();
  var video = document.getElementById('video');
  navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  var webcamStream, socket;
  // $('#loginBtn').prop('disable', true);
  $('#login').hide();

  $('#login').click(function (evt) {
    location.href = "login.html";
  });

  /*---------------------------------------------------- */
	/*	Get URL Param
	------------------------------------------------------ */
  $.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
      return null;
    }
    return decodeURI(results[1]) || 0;
  };

  /*---------------------------------------------------- */
	/*	check identification type
	------------------------------------------------------ */
  $.ajax({
    url: "http://e-agriculture.net:50005/api/identification/type",
    type: "GET",
    success: function (result) {
      // Get result of identification
      console.log(result);
      console.log(navigator.platform);
      $('#identity-types').append('<div id=\"identitySelection\" class=\"selection-box item-wrap\">');
      console.log($.urlParam('t'));
      result.forEach(function (item,i) {
        if (i > 0) {
          if ((i + 1) != $.urlParam('t')) {
            $('#identitySelection').append('<a id=\"type' + result[i].ididentitytype + '\">' + result[i].description + '</a>');
            $('#type' + (i + 1)).click(function (evt) {
              location.href = "identities.html?t=" + (i + 1);
            });
          }
        }
      })
      $('#identity-types').append('</div>');
    },
    error: function () {
      $('#availableIdentityTypes').hide();
    }
  }).done(function () {

    /*----------------------------------------------------*/
  	/*	Modal Popup
  	------------------------------------------------------*/
    $('.item-wrap a').magnificPopup({
      type:'inline',
      fixedContentPos: false,
      removalDelay: 300,
      showCloseBtn: false,
      mainClass: 'mfp-fade'
    });
    $(document).on('click', '.popup-modal-dismiss', function (e) {
      // console.log(e);
      // console.log(e.currentTarget.id);
      $('#submit-loader').fadeOut();
      e.preventDefault();
     	$.magnificPopup.close();
    });

  });

	/*---------------------------------------------------- */
	/* Preloader
	------------------------------------------------------ */
  $(window).load(function () {
    // will first fade out the loading animation
    $("#loader").fadeOut("slow", function(){
      // will fade out the whole DIV that covers the website.
      $("#preloader").delay(300).fadeOut("slow");
    });
  });

	/*----------------------------------------------------- */
	/* Alert Boxes
  ------------------------------------------------------- */
	$('.alert-box').on('click', '.close', function () {
	  $(this).parent().fadeOut(500);
	});

  /*---------------------------------------------------- */
  /* Smooth Scrolling
  ------------------------------------------------------ */
  $('.smoothscroll').on('click', function (e) {
    e.preventDefault();
   	var target = this.hash,
    	  $target = $(target);
    $('html, body').stop().animate({
      'scrollTop': $target.offset().top
    }, 800, 'swing', function () {
      window.location.hash = target;
    });
  });

  /*---------------------------------------------------- */
	/*  Placeholder Plugin Settings
	------------------------------------------------------ */
	$('input, textarea, select').placeholder();

  /*----------------------------------------------------*/
  /*	Function to start webcam
  ------------------------------------------------------*/
  function startWebcam() {
    if (navigator.getUserMedia) {
      navigator.getUserMedia ({
        video: true,
        audio: false
      },
      // successCallback
      function (localMediaStream) {
        webcamStream = localMediaStream;
        video.srcObject = localMediaStream;
      },
      // errorCallback
      function(err) {
        console.log("The following error occured: " + err);
        $('#submit-loader').fadeOut();
        $('#message-warning').html("Something went wrong. Please try again.");
        $('#message-warning').fadeIn();
      });
    } else {
      console.log("getUserMedia is not supported");
      $('#submit-loader').fadeOut();
      $('#message-warning').html("Something went wrong. Please try again.");
      $('#message-warning').fadeIn();
    }
  };

  /*----------------------------------------------------*/
  /*	Function to stop webcam
  ------------------------------------------------------*/
  function stopWebcam() {
    video.srcObject = null;
    webcamStream.getTracks().forEach(function (track) {
      track.stop();
    });
  }

  if ($.urlParam('t') == 2) {
    $('#statusatribute').hide();
    $('#atributvalue').hide();
    $('#webcamShow').show();
    startWebcam();

    /*---------------------------------------------------- */
  	/*	contact form
  	------------------------------------------------------ */
  	/* local validation */
  	$('#contactForm').validate({
      /* submit via ajax */
  		submitHandler: function (form) {
        var sLoader = $('#submit-loader');
        var next;
        var countPhoto = 0;
        function updateToServer(formDataPhoto,index,next) {
          $.ajax({
            url: 'http://e-agriculture.net:50005/api/faceattribute/data',
            type: 'POST',
            // async: false,
            data: formDataPhoto,
            // dataType: 'application/json', // what type of data do we expect back from the server
            contentType: 'application/x-www-form-urlencoded',
            beforeSend: function () {
              sLoader.fadeIn();
    		    },
            success: function (res) {
              console.log(res);
              console.log('idx: ', index);
              if (index < 16) {
                next();
              } else {
                $.ajax({
                  url: 'http://e-agriculture.net:50005/api/faceattribute/model',
                  type: 'POST',
                  // async: false,
                  data: null,
                  // dataType: 'application/json', // what type of data do we expect back from the server
                  contentType: 'application/x-www-form-urlencoded',
                  beforeSend: function () {
                    sLoader.fadeIn();
          		    },
                  success: function (res) {
                    console.log(res);
                    if (res.msg.includes('done')) {
                      stopWebcam();
                      sLoader.fadeOut();
                      $('#contactForm').fadeOut();
                      $('#message-success').append('face successfully registered');
                      $('#message-success').fadeIn();
                      $('#login').show();
                      $('#availableIdentityTypes').hide();
                    } else {
                      sLoader.fadeOut();
                      $('#userName').val("");
                      $('#message-warning').html("Register face failed");
                      $('#message-warning').fadeIn();
                    }
                  },
                  error: function (err) {
                    // console.log('error: ', err);
                    console.log('Submit Photo #' + index + ' Failed');
                    sLoader.fadeOut();
                    $('#userName').val("");
                    $('#message-warning').html("Register face failed");
                    $('#message-warning').fadeIn();
                  }
                });
              }
            },
            error: function (err) {
              // console.log('error: ', err);
              console.log('Submit Photo #' + index + ' Failed');
              sLoader.fadeOut();
              $('#userName').val("");
              $('#message-warning').html("Register failed");
              $('#message-warning').fadeIn();
            }
          });
        }
        if (video.srcObject) {
          next = function () {
            if (countPhoto < 16) {
            // if (countPhoto < 16) {
              countPhoto++;
              var canvas = document.createElement('canvas');
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              canvas.getContext('2d').drawImage(video, 0, 0);
              var dataPhoto = canvas.toDataURL('image/png');
              // console.log(dataPhoto);
              var formIdentificationData = {
                username: $('input[name=userName]').val(),
                atributvalue: dataPhoto
              }
              console.log('count photo: ' + countPhoto);
              updateToServer(formIdentificationData, countPhoto, next);
            }
          }
          next();
        }
    	}
  	})
  } else {
    $('#statusatribute').show();
    $('#atributvalue').show();
    $('#webcamShow').hide();
    // stopWebcam();
    socket = io('http://localhost:' + (60000 + (Number($.urlParam('t')) - 2)).toString());
    socket.on('disconnect', function () {
      // console.log('socket[' + index + ']: ', socket[index]);
      $('#loginBtn').prop('disable', true);
    })
    socket.on('connect', function () {
      // console.log('socket[' + index + '], connected: ', socket[index]);
      $('#loginBtn').prop('disable', false);
    })
    socket.on('data', function (idx,data) {
      // console.log('data: ', data);
      // $('#reader' + (idx + 1)).val(data);
      $.ajax({
        url: "http://e-agriculture.net:50005/api/cardattribute/availability?ididentitytype=" + $.urlParam('t') + "&atributvalue=" + data,
        type: "GET",
        success: function (result) {
          // Get result of card avail
          console.log(result);
          if (result.msg) {
            $('#statusatribute').val('TRUE');
            $('#loginBtn').prop('disable', false);
            $('#atributvalue').val(data);
          } else {
            $('#statusatribute').val('FALSE');
            $('#loginBtn').prop('disable', true);
            $('#atributvalue').val(data);
          }
        },
        error: function (err) {
          console.log(err);
        }
      })
    })

    /*---------------------------------------------------- */
  	/*	contact form
  	------------------------------------------------------ */
  	/* local validation */
  	$('#contactForm').validate({
      /* submit via ajax */
  		submitHandler: function (form) {
        var sLoader = $('#submit-loader');
  			$.ajax({
          method: "POST",
  		    url: "http://e-agriculture.net:50005/api/cardattribute/data",
  		    data: {
            'username': $('input[name=userName]').val(),
            'ididentitytype': $.urlParam('t'),
            'atributvalue': $('input[name=atributvalue]').val()
          },
          contentType: 'application/x-www-form-urlencoded',
  		    beforeSend: function () {
            sLoader.fadeIn();
  		    },
  		    success: function (res) {
            // Message was sent
            console.log(res);
            if (res.msg.toString().includes('successfully')) {
               sLoader.fadeOut();
               $('#message-warning').hide();
               $('#userName').val("");
               $('#statusatribute').val("");
               $('#atributvalue').val("");
               $('#contactForm').fadeOut();
               $('#message-success').append('card successfully registered');
               $('#message-success').fadeIn();
               $('#login').show();
               $('#availableIdentityTypes').hide();
            } else { // There was an error
               sLoader.fadeOut();
               $('#userName').val("");
               $('#statusatribute').val("");
               $('#atributvalue').val("");
               $('#message-warning').html("Register failed");
               $('#message-warning').fadeIn();
            }
  		    },
  		    error: function () {
            sLoader.fadeOut();
            $('#userName').val("");
            $('#statusatribute').val("");
            $('#atributvalue').val("");
            $('#message-warning').html("Register failed");
            $('#message-warning').fadeIn();
  		    }
        });
    	}
  	});
  }

 	/*----------------------------------------------------- */
  /* Back to top
  ------------------------------------------------------- */
	var pxShow = 10; // height on which the button will show
	var fadeInTime = 400; // how slow/fast you want the button to show
	var fadeOutTime = 400; // how slow/fast you want the button to hide
	var scrollSpeed = 300; // how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'
  // Show or hide the sticky footer button
	jQuery(window).scroll(function () {
    if (!( $("#header-search").hasClass('is-visible'))) {
      if (jQuery(window).scrollTop() >= pxShow) {
        jQuery("#go-top").fadeIn(fadeInTime);
			} else {
				jQuery("#go-top").fadeOut(fadeOutTime);
			}
		}
	});

})(jQuery);
