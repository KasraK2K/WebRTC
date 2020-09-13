var videoArea = document.querySelector('video');
var videoSelect = document.querySelector('#camera');

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
        width: { min: 400, ideal: 640, max: 800 },
        height: { min: 300, ideal: 480, max: 600 },
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
