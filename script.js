// LocalStorage based Data Store
let mediaItems = JSON.parse(localStorage.getItem('sdh_media')) || [];

// DOM Elements
const mediaGrid = document.getElementById('media-grid');
const uploadForm = document.getElementById('upload-form');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.filter-btn');
const themeToggleBtn = document.getElementById('theme-toggle');

let currentFilter = 'all';

// Theme Toggle Feature
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeToggleBtn.innerHTML = isLight ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
});

// Render Gallery Items
function renderGallery() {
    mediaGrid.innerHTML = '';
    const searchTerm = searchInput.value.toLowerCase();

    const filteredItems = mediaItems.filter(item => {
        const matchesCategory = currentFilter === 'all' || 
                                (currentFilter === 'favorites' ? item.favorite : item.category === currentFilter);
        const matchesSearch = item.title.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    if(filteredItems.length === 0) {
        mediaGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No media files found.</p>';
        return;
    }

    filteredItems.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'media-card';
        
        const mediaHtml = item.category === 'photo' 
            ? `<img src="${item.url}" class="media-preview" onclick="openLightbox('${item.url}', '${item.title}', 'photo')">`
            : `<video src="${item.url}" class="media-preview" controls></video>`;

        card.innerHTML = `
            ${mediaHtml}
            <div class="media-info">
                <div class="media-title">${item.title}</div>
                <div class="media-actions">
                    <span><i class="fa-solid fa-download"></i> ${item.downloads || 0}</span>
                    <div>
                        <button class="btn-icon ${item.favorite ? 'active' : ''}" onclick="toggleFavorite(${item.id})">
                            <i class="fa-solid fa-heart"></i>
                        </button>
                        <button class="btn-icon" onclick="downloadMedia('${item.url}', ${item.id})">
                            <i class="fa-solid fa-file-arrow-down"></i>
                        </button>
                        <button class="btn-icon" onclick="shareMedia('${item.title}')">
                            <i class="fa-solid fa-share-nodes"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        mediaGrid.appendChild(card);
    });
}

// Upload Feature
uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('media-title').value;
    const category = document.getElementById('media-category').value;
    const fileInput = document.getElementById('media-file');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newItem = {
                id: Date.now(),
                title: title,
                category: category,
                url: e.target.result,
                downloads: 0,
                favorite: false
            };
            mediaItems.unshift(newItem);
            saveAndRender();
            uploadForm.reset();
        };
        reader.readAsDataURL(file);
    }
});

// Toggle Favorite Feature
window.toggleFavorite = function(id) {
    mediaItems = mediaItems.map(item => {
        if(item.id === id) item.favorite = !item.favorite;
        return item;
    });
    saveAndRender();
};

// Download Counter Feature
window.downloadMedia = function(url, id) {
    mediaItems = mediaItems.map(item => {
        if(item.id === id) item.downloads = (item.downloads || 0) + 1;
        return item;
    });
    saveAndRender();
    const a = document.createElement('a');
    a.href = url;
    a.download = 'download';
    a.click();
};

// Social Share Feature
window.shareMedia = function(title) {
    if (navigator.share) {
        navigator.share({ title: title, url: window.location.href });
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    }
};

// Lightbox Feature
window.openLightbox = function(url, title, type) {
    const lightbox = document.getElementById('lightbox-modal');
    const container = document.getElementById('lightbox-media-container');
    const caption = document.getElementById('lightbox-caption');

    container.innerHTML = `<img src="${url}">`;
    caption.innerText = title;
    lightbox.style.display = 'flex';
};

document.querySelector('.lightbox-close').addEventListener('click', () => {
    document.getElementById('lightbox-modal').style.display = 'none';
});

// Category Filter Event
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.category;
        renderGallery();
    });
});

// Search Input Event
searchInput.addEventListener('input', renderGallery);

function saveAndRender() {
    localStorage.setItem('sdh_media', JSON.stringify(mediaItems));
    renderGallery();
}

// Initial Load
renderGallery();
                                                  
