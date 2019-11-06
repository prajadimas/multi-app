/**
 * ===================================================================
 * index-action js
 *
 * -------------------------------------------------------------------
 */

(function ($) {

  var video = document.getElementById('video');
  navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  var webcamStream;
  var socket = [null,null];

  /*---------------------------------------------------- */
	/*	check identification type
	------------------------------------------------------ */
  $.ajax({
    url: "https://e-agriculture.net:50005/api/identification/type",
    type: "GET",
    success: function (result) {
      // Get result of identification
      var indexID = 1;
      console.log(result);
      console.log(navigator.platform);
      $('#identity-types').append('<div id=\"identitySelection\" class=\"selection-box item-wrap\">');
      for (var i = 0; i < result.length; i++) {
        if (i == 1) {
          $('#identitySelection').append('<a id=\"type' + result[i].ididentitytype + '\" href=\"#modal-' + result[i].ididentitytype + '\">' + result[i].description + '</a>');
        } else if (i > 1) {
          $('#identitySelection').append('<a id=\"type' + result[i].ididentitytype + '\" href=\"#modal-' + result[i].ididentitytype + '\">' + result[i].description + '</a>');
          socket.push(io('http://localhost:' + result[i].port));
          if (result[i].description.toString().toUpperCase().includes('CARD')) {
            $('#top').append('<div id=\"modal-' + result[i].ididentitytype + '\" class=\"popup-modal slider mfp-hide\"><div class=\"description-box\"><div class=\"form-field\"><input name=\"reader' + result[i].ididentitytype + '\" type=\"text\" id=\"reader' + result[i].ididentitytype + '\" placeholder=\"UID CARD\" value=\"\" minlength=\"2\" required=\"\" readonly></div></div><div class=\"selection-box\"><a id=\"modal-' + result[i].ididentitytype + '-dismiss\" href=\"#\" class=\"popup-modal-dismiss\">Close</a></div></div>');
          }
        }
      }
      $('#identity-types').append('</div>');
      for (var i = 2; i < result.length; i++) {
        $('#type' + (i + 1)).hide();
      }
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
      if (e.currentTarget.id) {
        // console.log(e.currentTarget.id.split('-')[1]);
        $('#reader' + (e.currentTarget.id.split('-')[1])).val('');
      }
      e.preventDefault();
     	$.magnificPopup.close();
    });

    /*----------------------------------------------------*/
  	/*	Check camera availability
  	------------------------------------------------------*/
    function detectWebcam(callback) {
      let md = navigator.mediaDevices;
      if (!md || !md.enumerateDevices) return callback(false);
      md.enumerateDevices().then(devices => {
        callback(devices.some(device => 'videoinput' === device.kind));
      });
    };
    detectWebcam(function (hasWebcam) {
      // console.log('Webcam: ' + (hasWebcam ? 'yes' : 'no'));
      if (!hasWebcam) {
        $('#type2').hide();
      } else {
        $('#type2').show();
      }
    });

    /*----------------------------------------------------*/
  	/*	Check another identity type
  	------------------------------------------------------*/
    // console.log('socket length: ', socket.length);
    socket.forEach(function (item,index) {
      if (index > 1) {
        if (socket[index]) {
          socket[index].on('disconnect', function () {
            // console.log('socket[' + index + ']: ', socket[index]);
            $('#type' + (index + 1)).hide();
          })
          socket[index].on('connect', function () {
            // console.log('socket[' + index + '], connected: ', socket[index]);
            $('#type' + (index + 1)).show();
          })
          socket[index].on('data', function (idx,data) {
            // console.log('data: ', data);
            $('#reader' + (idx + 1)).val(data);
          })
        }
      }
    })

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
  	  webcamStream.getTracks().forEach(function(track) {
        track.stop();
      });
    }

    /*----------------------------------------------------*/
  	/*	Face Recognition Identity Types click event
  	------------------------------------------------------*/
    $('#type2').click(function (evt) {
      // console.log(evt);
      // console.log($('.mfp-content'));
      $('#submit-loader').fadeIn();
      startWebcam();
    });

    $('#modal-2-dismiss').click(function (evt) {
      $('#submit-loader').fadeOut();
      stopWebcam();
    });

  });

})(jQuery);
