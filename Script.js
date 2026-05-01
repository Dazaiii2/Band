const startButton = document.getElementById('startButton');
const statusDiv = document.getElementById('status');
const remoteAudio = document.getElementById('remoteAudio');

let localStream;
let peerConnection;

// Ultra-low latency audio constraints
const audioConstraints = {
    audio: {
        echoCancellation: false, // Disabling this reduces delay significantly
        noiseSuppression: false,
        autoGainControl: false,
        latency: 0,
        sampleRate: 48000
    },
    video: false
};

startButton.onclick = async () => {
    try {
        localStream = await navigator.mediaDevices.getUserMedia(audioConstraints);
        statusDiv.innerText = "Status: Mic Enabled. Connecting to Peer...";
        setupPeerConnection();
    } catch (err) {
        console.error("Error accessing mic:", err);
        statusDiv.innerText = "Error: Could not access microphone.";
    }
};

function setupPeerConnection() {
    const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    peerConnection = new RTCPeerConnection(config);

    // Add our mic track to the connection
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    // When we receive audio from a friend, play it
    peerConnection.ontrack = (event) => {
        remoteAudio.srcObject = event.streams[0];
        statusDiv.innerText = "Status: Connected! Playing Audio.";
    };
}

