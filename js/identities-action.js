/**
 * ===================================================================
 * register-action js
 *
 * -------------------------------------------------------------------
 */

(function ($) {

  "use strict";

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
	$('input, textarea, select').placeholder()

  /*---------------------------------------------------- */
	/*	contact form
	------------------------------------------------------ */
	/* local validation */
	$('#contactForm').validate({
    /* submit via ajax */

    /*
     *

		submitHandler: function (form) {
      var sLoader = $('#submit-loader');
			$.ajax({
        method: "POST",
		    url: "http://e-agriculture.net:50005/api/user/data",
		    data: {
          'username': $('input[name=userName]').val(),
          'nim': $('input[name=nim]').val()
        },
        contentType: 'application/x-www-form-urlencoded',
		    beforeSend: function () {
          sLoader.fadeIn();
		    },
		    success: function (res) {
          // Message was sent
          console.log(res);
          $.ajax({
            method: "POST",
    		    url: "http://e-agriculture.net:50005/api/keyboardattribute/data",
    		    data: {
              'username': $('input[name=userName]').val(),
              'atributvalue': $('input[name=userPass]').val(),
              'ididentitytype': 1
            },
            contentType: 'application/x-www-form-urlencoded',
    		    success: function (result) {
              // Message was sent
              console.log(result);
    	        if (result.msg.toString().includes('successfully')) {
    	           sLoader.fadeOut();
    	           $('#message-warning').hide();
    	           $('#contactForm').fadeOut();
                 $('#message-success').append('user successfully registered');
    	           $('#message-success').fadeIn();
                 $('#login').show();
                 $('#availableIdentityTypes').hide();
    	        } else { // There was an error
    	           sLoader.fadeOut();
                 $('#userName').val("");
                 $('#userPass').val("");
                 $('#nim').val("");
    	           $('#message-warning').html("Register failed");
    		         $('#message-warning').fadeIn();
    	        }
    		    },
    		    error: function () {
              sLoader.fadeOut();
              $('#userName').val("");
              $('#userPass').val("");
              $('#nim').val("");
              $('#message-warning').html("Register failed");
              $('#message-warning').fadeIn();
    		    }
          });
		    },
		    error: function () {
          sLoader.fadeOut();
          $('#userName').val("");
          $('#userPass').val("");
          $('#nim').val("");
          $('#message-warning').html("Register failed");
          $('#message-warning').fadeIn();
		    }
      });
  	}

     *
     */

	});

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
