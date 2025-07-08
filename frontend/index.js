let uploadedImage = null;
let databaseLoaded = false;

const uploadSection = document.getElementById('uploadSection');
const fileInput = document.getElementById('imageUpload');
const host = window.location.hostname;

uploadSection.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadSection.classList.add('dragover');
});

uploadSection.addEventListener('dragleave', () => {
    uploadSection.classList.remove('dragover');
});

uploadSection.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadSection.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

function handleFileSelect(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImage = e.target.result;
            displayUploadedImage(uploadedImage);
            updateIdentifyButton();
        };
        reader.readAsDataURL(file);
    }
}

function updateIdentifyButton() {
    const hasImage = uploadedImage !== null;
    document.getElementById('identifyBtn').disabled = !(databaseLoaded && hasImage);
}

function displayUploadedImage(imageSrc) {
    const results = document.getElementById('results');

    results.innerHTML = `
        <div class="card uploaded-image-card">
            <div class="card-header">
                <h3>📸 Uploaded Image</h3>
            </div>
            <div class="card-content">
                <div class="uploaded-image-section">
                    <img src="${imageSrc}" alt="Uploaded tiger" class="uploaded-image">
                </div>
            </div>
        </div>
    `;

    window.requestAnimationFrame(() => {
        results.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

function showStatus(message, type = 'success') {
    const statusDiv = document.getElementById('status');
    statusDiv.innerHTML = `<div class="status ${type}">${message}</div>`;
    setTimeout(() => {
        statusDiv.classList.add('fadeout');
    }, 3500)
    setTimeout(() => {
        statusDiv.innerHTML = '';
    }, 4000);
}

function showToast(message, type, duration = 3000) {
    const container = document.getElementById('toastbar');
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    if (type === 'error') {
        toast.classList.add('error');
    } else {
        toast.classList.add('success');
    }

    toast.innerHTML = `
        <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" class="toast-icon ${type}">
        <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
        </svg>
        <p class="toast-text">${message}</p>
        `;
    
    container.insertBefore(toast, container.firstChild);
    
    setTimeout(() => {
        toast.classList.add('fadeout');
    }, duration - 500);
    
    setTimeout(() => {
        container.removeChild(toast);
    }, duration);
}


function showLoadingModal() {
    const modal = document.createElement('div');
    modal.className = 'loading-modal';
    modal.id = 'loadingModal';
    
    modal.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <div class="loading-text">Processing Tiger Identification</div>
            <div class="loading-subtext">
                Analyzing stripe patterns and features within database...<br>
                Please wait while the system compares your image.
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function hideLoadingModal() {
    const modal = document.getElementById('loadingModal');
    if (modal) {
        modal.remove();
    }
}

async function loadDatabase() {
    showStatus('🔄 Loading tiger database using computer vision...', 'success');
    showToast('Loading tiger database', 'success', 3000);
    document.getElementById('loadDbBtn').disabled = true;
    
    try {
        const response = await fetch(`http://${host}:5000/load_database`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const result = await response.json();
        
        if (result.success) {
            databaseLoaded = true;
            showStatus('✅ Tiger database loaded successfully using SIFT feature extraction', 'success');
            showToast('Tiger database loaded successfully!', 'success');
            document.getElementById('loadDbBtn').innerHTML = '✅ Database Loaded';
            document.getElementById('loadDbBtn').className = 'btn btn-success';
            updateIdentifyButton();
        } else {
            showStatus(`❌ Error: ${result.error}`, 'error');
            showToast(`Error: ${result.error}`, 'error', 5000);
            document.getElementById('loadDbBtn').disabled = false;
        }
    } catch (error) {
        showStatus('❌ Error: Could not connect to Python backend. Make sure the server is running on port 5000.', 'error');
        showToast('Could not connect to Python backend. Make sure the server is running on port 5000.', 'error', 5000);
        document.getElementById('loadDbBtn').disabled = false;
    }
}

async function identifyTiger() {
    if (!uploadedImage || !databaseLoaded) {
        showStatus('❌ Please upload an image and load the database first.', 'error');
        showToast('Please upload an image and load the database first.', 'error', 3000);
        return;
    }

    // Show loading modal
    showLoadingModal();

    try {
        const response = await fetch(`http://${host}:5000/identify_tiger`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image_data: uploadedImage
            })
        });

        const result = await response.json();
        
        // Hide loading modal
        hideLoadingModal();
        
        if (result.success) {
            displayResults(result.matches);
            showStatus('🎯 Tiger identification complete!', 'success');
            showToast('Tiger identification complete!', 'success', 3000);
        } else {
            showStatus(`❌ Error: ${result.error}`, 'error');
            showToast(`Error: ${result.error}`, 'error', 5000);
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = `
                <div class="card uploaded-image-card">
                    <div class="card-header">
                        <h3>Uploaded Image</h3>
                    </div>
                    <div class="card-content">
                        <div class="uploaded-image-section">
                            <img src="${uploadedImage}" alt="Uploaded tiger" class="uploaded-image">
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-content">
                        <div class="no-match">${result.error}</div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error(error);
        hideLoadingModal();
        showStatus('❌ Error: Could not connect to Python backend for identification.', 'error');
        showToast('Could not connect to Python backend for identification. Make sure the server is running on port 5000.', 'error', 5000);
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `
            <div class="card uploaded-image-card">
                <div class="card-header">
                    <h3>Uploaded Image</h3>
                </div>
                <div class="card-content">
                    <div class="uploaded-image-section">
                        <img src="${uploadedImage}" alt="Uploaded tiger" class="uploaded-image">
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-content">
                    <div class="no-match">Connection error. Make sure the Python server is running.</div>
                </div>
            </div>
        `;
    }
}

function displayResults(matches) {
    const resultsDiv = document.getElementById('results');
    
    let html = `
        <div class="card uploaded-image-card" id="matchesCard">
            <div class="card-header">
                <h3>📸 Uploaded Image</h3>
            </div>
            <div class="card-content">
                <div class="uploaded-image-section">
                    <img src="${uploadedImage}" alt="Uploaded tiger" class="uploaded-image">
                </div>
            </div>
        </div>
    `;

    if (!matches || matches.length === 0) {
        html += `
            <div class="card">
                <div class="card-content">
                    <div class="no-match">No matching tigers found in the database</div>
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="card matches-card">
                <div class="card-header">
                    <h3>🎯 We Found Several Matches!</h3>
                </div>
                <div class="card-content">
                    <div class="matches-section">
        `;
        
        matches.forEach((match, index) => {
            const confidenceWidth = Math.min(match.stripe_similarity, 100);
            
            html += `
                <div class="tiger-match">
                    <img src="data:Image/jpeg;base64,${match.image}" alt="Matched tiger" class="match-image" onclick="showComparisonModal('${uploadedImage}', '${match.image_path}', ${match.stripe_similarity.toFixed(1)})">
                    <div class="tiger-info">
                        <div class="confidence">Similarity: ${match.stripe_similarity.toFixed(1)}%</div>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${confidenceWidth}%"></div>
                        </div>
                        <div class="match-details">
                            Uploaded Stripes: ${match.uploaded_stripe_count}<br>
                            Database Stripes: ${match.database_stripe_count}<br>
                            Tiger Name: ${match.tiger_name}
                        </div>
                        <div class="match-badge">Database Match</div>
                    </div>
                </div>
            `;
        });
        
        html += `
                    </div>
                </div>
            </div>
        `;
    }

    window.requestAnimationFrame(() => {
        document.getElementById('matchesCard').scrollIntoView({behavior: "smooth", block: "start" });
    });
    
    resultsDiv.innerHTML = html;
}

function showComparisonModal(uploadedImg, matchedImg, similarity) {
    const modal = document.createElement('div');
    modal.className = 'comparison-modal';
    modal.id = 'comparisonModal';
    
    modal.innerHTML = `
        <div class="comparison-content">
            <div class="comparison-header">
                <h2>🔍 Side-by-Side Comparison</h2>
                <div class="similarity-score">${similarity}% Similarity</div>
            </div>
            <div class="comparison-images">
                <div class="comparison-image-container uploaded">
                    <h3>📤 Your Uploaded Image</h3>
                    <img src="${uploadedImg}" alt="Uploaded tiger">
                    <div class="comparison-path">Uploaded Image</div>
                </div>
                <div class="comparison-image-container matched">
                    <h3>📊 Database Match</h3>
                    <img src="${matchedImg}" alt="Matched tiger">
                    <div class="comparison-path">${matchedImg}</div>
                </div>
            </div>
            <div class="comparison-actions">
                <button class="btn-close-modal" onclick="closeComparisonModal()">✕ Close Comparison</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking on background
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeComparisonModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeComparisonModal();
        }
    });
}

function closeComparisonModal() {
    const modal = document.getElementById('comparisonModal');
    if (modal) {
        modal.remove();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    showStatus('Welcome to the Tiger Identification System. Load the database first, then upload a tiger image.', 'success');
});