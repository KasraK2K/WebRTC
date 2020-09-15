var videoArea = document.querySelector('video');
var videoSelect = document.querySelector('#camera');
var profilePicCanvas = document.querySelector('#profilePicCanvas');
var profilePictureOutput = document.querySelector('#profilePictureOutput');
var takeProfilePicture = document.querySelector('#takeProfilePicture');
var videoTag = document.querySelector('#videoTag');

takeProfilePicture.addEventListener(
  'click',
  function (event) {
    takeProfilePic();
    event.preventDefault();
  },
  false,
);

var width = 800; // Desire width of the profile picture
var height = 0; // Calculated later base on image retio
var streaming = false; // Useto determine when the video has loaded

videoTag.addEventListener(
  'canplay',
  function (event) {
    if (!streaming) {
      height = videoTag.videoHeight / (videoTag.videoWidth / width);

      if (isNaN(height)) {
        height = width / (4 / 3);
      }

      videoTag.setAttribute('width', width);
      videoTag.setAttribute('height', height);
      profilePicCanvas.setAttribute('width', width);
      profilePicCanvas.setAttribute('height', height);
      streaming = true;
    }
  },
  false,
);

// take a picture from videoTag
function takeProfilePic() {
  var context = profilePicCanvas.getContext('2d');
  if (width && height) {
    profilePicCanvas.width = width;
    profilePicCanvas.height = height;
    context.drawImage(videoTag, 0, 0, width, height);

    var data = profilePicCanvas.toDataURL('image/png');
    profilePictureOutput.setAttribute('src', data);
  }
}

// get video sources and create select source
navigator.mediaDevices
  .enumerateDevices()
  .then(sourceInfos => getCameras(sourceInfos));

videoSelect.onchange = startStream;

startStream();

// create select source
function getCameras(sourceInfos) {
  console.log(sourceInfos);
  for (var i = 0; i !== sourceInfos.length; i++) {
    var sourceInfo = sourceInfos[i];
    if (sourceInfo.kind === 'videoinput') {
      var option = document.createElement('option');
      option.value = sourceInfo.deviceId;
      option.text = sourceInfo.label || 'camera ' + (videoSelect.length + 1);
    }
    videoSelect.appendChild(option);
  }
}

// start stream video
function startStream() {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
  var videoSource = videoSelect.value;
  var constrains = {
    audio: false,
    video: {
      mandatory: {
        width: { min: 240, ideal: 240, max: 240 },
        height: { min: 240, ideal: 240, max: 240 },
      },
      deviceId: videoSource,
    },
  };
  navigator.getUserMedia(constrains, onSuccess, onError);
}

function onSuccess(stream) {
  try {
    videoArea.srcObject = stream;
  } catch (error) {
    videoArea.src = window.URL.createObjectURL(stream);
  }
  videoArea.play();
}

function onError(error) {
  console.log('Error with getUserMedia: ', error);
}

/* screen */
// var screenConstrains = {
//   video: {
//     mediaSource: 'screen',
//   },
// };
// navigator.mediaDevices
//   .getUserMedia(screenConstrains, onSuccess, onError)
//   .then(stream => {
//     videoArea.srcObject = stream;
//   });
