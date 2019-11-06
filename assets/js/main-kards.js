/**
 * ===================================================================
 * main js
 *
 * -------------------------------------------------------------------
 */

(function ($) {

  "use strict";

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

	/*----------------------------------------------------- */
	/*	Modal Popup
	------------------------------------------------------- */
  /*-----------------------------------------------------
  $('.item-wrap a').magnificPopup({
    type:'inline',
    fixedContentPos: false,
    removalDelay: 300,
    showCloseBtn: false,
    mainClass: 'mfp-fade'
  });
  $(document).on('click', '.popup-modal-dismiss', function (e) {
    e.preventDefault();
   	$.magnificPopup.close();
  });
  ------------------------------------------------------ */

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
		submitHandler: function (form) {
      var sLoader = $('#submit-loader');
			$.ajax({
        method: "POST",
		    url: "http://localhost:8000",
		    data: {
          'username': $('input[name=userName]').val(),
          'atributevalue': $('input[name=userPass]').val(),
          'ididentitytype': 1
        },
		    beforeSend: function () {
          console.log({
            'username': $('input[name=userName]').val(),
            'atributevalue': $('input[name=userPass]').val(),
            'ididentitytype': 1
          });
          sLoader.fadeIn();
		    },
		    success: function (result) {
          // Message was sent
	        if (result == 'OK') {
	           sLoader.fadeOut();
	           $('#message-warning').hide();
	           $('#contactForm').fadeOut();
	           $('#message-success').fadeIn();
	        } else { // There was an error
	           sLoader.fadeOut();
	           $('#message-warning').html(msg);
		         $('#message-warning').fadeIn();
	        }
		    },
		    error: function () {
          sLoader.fadeOut();
		      $('#message-warning').html("Something went wrong. Please try again.");
		      $('#message-warning').fadeIn();
		    }
      });
  	}
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
