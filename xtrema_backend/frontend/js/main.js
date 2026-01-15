/* =========================
   GLOBAL HELPERS
========================= */

const API_URL = "http://127.0.0.1:8000/api";

// Simple page redirect helper
function goTo(page) {
    window.location.href = page;
}

/* =========================
   LOGIN PAGE LOGIC
========================= */

function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    console.log("Attempting login with:", email);
    console.log("API URL:", API_URL + "/login/");

    fetch(API_URL + "/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => {
            console.log("Response status:", res.status);
            return res.json();
        })
        .then(response => {
            console.log("Response data:", response);
            if (response.status === "success") {
                localStorage.setItem("user_id", response.user_id);
                localStorage.setItem("user_email", response.email);
                alert(response.message);
                console.log("Redirecting to upload.html");
                goTo("upload.html");
            } else {
                alert("Login failed: " + response.message);
            }
        })
        .catch(err => {
            console.error("Login error:", err);
            alert("Login error: " + err);
        });
}

/* =========================
   IMAGE UPLOAD PAGE
========================= */

let uploadedImages = [];

function handleFileUpload(files) {
    if (!files || files.length === 0) {
        alert("No files selected");
        return;
    }

    uploadedImages = Array.from(files);
    console.log("Starting file upload. Total files:", files.length);

    // Store images as Base64 in localStorage
    const imageDataArray = [];
    let filesProcessed = 0;

    Array.from(files).forEach((file, index) => {
        console.log("Processing file " + (index + 1) + ":", file.name, "Size:", file.size);

        // Compress image before storing
        compressImage(file, (compressedData) => {
            console.log("File " + (index + 1) + " compressed");
            imageDataArray.push(compressedData);
            filesProcessed++;
            console.log("File " + (index + 1) + " processed. Progress: " + filesProcessed + "/" + files.length);

            if (filesProcessed === files.length) {
                console.log("All files processed. Saving to localStorage");
                try {
                    localStorage.setItem("uploadedImages", JSON.stringify(imageDataArray));
                    const saved = localStorage.getItem("uploadedImages");
                    console.log("Successfully saved to localStorage. Size:", saved.length, "bytes");
                    alert(files.length + " image(s) uploaded successfully");
                } catch (e) {
                    console.error("LocalStorage error:", e);
                    alert("Error: " + e.message + "\nTry uploading smaller images");
                }
            }
        });
    });
}

function compressImage(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Create canvas and compress
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            // Compress to JPEG quality 0.7
            const compressedData = canvas.toDataURL("image/jpeg", 0.7);
            console.log("Original size:", e.target.result.length, "bytes. Compressed size:", compressedData.length, "bytes");
            callback(compressedData);
        };
        img.src = e.target.result;
    };
    reader.onerror = function(err) {
        console.error("Error reading file:", err);
    };
    reader.readAsDataURL(file);
}

function generateReport() {
    const imageData = localStorage.getItem("uploadedImages");

    if (!imageData || JSON.parse(imageData).length === 0) {
        alert("Please upload at least one image");
        return;
    }

    // For now → static AI output (as shown in PDF)
    // Later replace with Google Vision API
    localStorage.setItem("report", JSON.stringify({
        plastic: 50,
        glass: 10,
        cardboard: 25,
        metal: 75,
        trash: 15
    }));

    goTo("report.html");
}

/* =========================
   REPORT PAGE LOGIC
========================= */

function loadReport() {
    const report = JSON.parse(localStorage.getItem("report"));
    if (!report) return;

    // Update bar widths and percentages
    setBar("plastic-bar", report.plastic, "plastic-percent");
    setBar("glass-bar", report.glass, "glass-percent");
    setBar("cardboard-bar", report.cardboard, "cardboard-percent");
    setBar("metal-bar", report.metal, "metal-percent");
    setBar("trash-bar", report.trash, "trash-percent");

    // Load uploaded images
    displayUploadedImages();
}

function setBar(id, value, percentId) {
    const bar = document.getElementById(id);
    const percent = document.getElementById(percentId);
    if (bar) {
        bar.style.width = value + "%";
        bar.innerText = value + "%";
    }
    if (percent) {
        percent.innerText = value + "%";
    }
}

function displayUploadedImages() {
    const imageData = localStorage.getItem("uploadedImages");
    const mainImage = document.getElementById("mainImage");
    const noImageText = document.getElementById("noImageText");

    if (!imageData || JSON.parse(imageData).length === 0) {
        mainImage.style.display = "none";
        noImageText.style.display = "block";
        return;
    }

    const images = JSON.parse(imageData);

    // Display first image as main image
    mainImage.src = images[0];
    mainImage.style.display = "block";
    noImageText.style.display = "none";
}

/* =========================
   PICKUP PAGE (BACKEND CONNECTED)
========================= */

function bookPickup() {
    const address = document.getElementById("address").value;
    const pincode = document.getElementById("pincode").value;
    const state = document.getElementById("state").value;
    const landmark = document.getElementById("landmark").value;
    const pickup_date = document.getElementById("date").value;
    const garbageType = document.getElementById("garbageType").value;

    if (!address || !pincode || !state || !landmark || !pickup_date || !garbageType) {
        alert("Please fill all fields");
        return;
    }

    const data = {
        address: address,
        pincode: pincode,
        state: state,
        landmark: landmark,
        pickup_date: pickup_date,
        plastic_kg: 3,
        metal_kg: 1,
        glass_kg: 0.5,
        wood_kg: 0.2,
        trash_kg: 0.3
    };

    fetch(API_URL + "/pickup/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(response => {
            if (response.status === "success") {
                localStorage.setItem("points", response.points || 0);

                // Store waste data for profile
                const wasteData = {
                    plastic_kg: data.plastic_kg,
                    metal_kg: data.metal_kg,
                    glass_kg: data.glass_kg,
                    wood_kg: data.wood_kg,
                    trash_kg: data.trash_kg,
                    total_kg: data.plastic_kg + data.metal_kg + data.glass_kg + data.wood_kg + data.trash_kg
                };

                // Get existing pickups or create new array
                let pickups = JSON.parse(localStorage.getItem("pickups")) || [];
                pickups.push(wasteData);
                localStorage.setItem("pickups", JSON.stringify(pickups));

                showModal();
            } else {
                alert("Pickup booking failed: " + JSON.stringify(response));
            }
        })
        .catch(err => {
            console.error(err);
            alert("Pickup booking error: " + err);
        });
}

/* =========================
   PICKUP SUCCESS POPUP
========================= */

function showModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/* =========================
   POINTS PAGE
========================= */

function loadPoints() {
    const points = localStorage.getItem("points") || 0;
    const el = document.getElementById("points-value");
    if (el) el.innerText = points;
}

/* =========================
   PROFILE PAGE
========================= */

function loadProfile() {
    const userEmail = localStorage.getItem("user_email");
    const points = localStorage.getItem("points") || 0;

    // Get email from login
    if (userEmail) {
        document.getElementById("profile-email").innerText = userEmail;
    }

    // Extract name from email (part before @)
    const userName = userEmail ? userEmail.split("@")[0].toUpperCase() : "User";
    document.getElementById("profile-name").innerText = userName;

    // Calculate total waste contribution from all pickups
    const pickups = JSON.parse(localStorage.getItem("pickups")) || [];
    let totalWaste = 0;

    pickups.forEach(pickup => {
        totalWaste += pickup.total_kg || 0;
    });

    document.getElementById("profile-waste").innerText = totalWaste.toFixed(1) + " kg";

    // Handle pickup button click to send data to backend
    const scheduleBtn = document.getElementById('scheduleBtn');
    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            bookPickup();
        });
    }
});

// Close modal when clicking outside the modal content
window.onclick = function(event) {
    const modal = document.getElementById('successModal');
    if (modal && event.target == modal) {
        modal.style.display = 'none';
    }
};