const videoElement = document.getElementById("video");
const resultDiv = document.getElementById("result");

navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
        videoElement.srcObject = stream;
        videoElement.play();
        console.log('Camera stream started');
        requestAnimationFrame(scanQRCode);
    })
    .catch(error => {
        console.error("Error accessing camera: ", error);
        resultDiv.textContent = "Error accessing camera.";
    });

function scanQRCode() {
    // Create a canvas and set its size to match the video element's size
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Update canvas dimensions based on video element dimensions
    const videoWidth = videoElement.videoWidth || videoElement.clientWidth;
    const videoHeight = videoElement.videoHeight || videoElement.clientHeight;

    if (videoWidth && videoHeight) {
        canvas.width = videoWidth;
        canvas.height = videoHeight;
    } else {
        console.log("Unable to get video dimensions.");
        resultDiv.textContent = "Unable to get video dimensions.";
        return;
    }

    // Draw the video frame onto the canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Get the image data from the canvas
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Use jsQR to scan the QR code from the image data
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code) {
        // QR Code detected
        console.log('QR Code detected:', code.data);
        resultDiv.textContent = `QR Code Data: ${code.data}`;
    } else {
        // No QR code detected
        console.log('No QR code detected');
        resultDiv.textContent = "Scanning...";
    }

    // Call the scanQRCode function recursively to keep scanning
    requestAnimationFrame(scanQRCode);
}
