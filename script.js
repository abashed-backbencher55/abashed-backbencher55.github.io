// 1. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAI6NQwbADztcK-jfxHMAh1zzZKuGWYESw",
  authDomain: "mediavault-6a259.firebaseapp.com",
  projectId: "mediavault-6a259",
  storageBucket: "mediavault-6a259.firebasestorage.app",
  messagingSenderId: "205208788357",
  appId: "1:205208788357:web:1e317ad612cca6dde8b8ec",
  measurementId: "G-2LXBP0QJKW"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const auth = firebase.auth();

const CLOUD_NAME = "zs17v7x6";
const UPLOAD_PRESET = "ml_default";

// ★ Primary Admin Account Credentials
const ADMIN_EMAIL = "mdsazedulhaque2030@gmail.com";

// --- Internationalization / Language State ---
let currentLang = localStorage.getItem('sdh_lang') || 'en';

const translations = {
  en: {
    bannerText: "Welcome to SDH Media Gallery! High Quality Media Downloads & Exclusive Content. Managed by Sazedul.",
    adminBtn: "Admin Portal",
    logoutBtn: "Logout",
    heroSubtitle: "Explore, stream, and download original full-resolution media assets effortlessly.",
    statPhotos: "Photos",
    statVideos: "Videos",
    statDownloads: "Downloads",
    adminPanelTitle: "Admin Upload Station",
    uploadHeader: "Upload New Asset",
    uploadSubmitBtn: "Publish to Gallery",
    recentUploads: "Featured Downloads",
    filterAll: "All Assets",
    filterImages: "Photos",
    filterVideos: "Videos",
    contactTitle: "Get In Touch",
    contactSubtitle: "Have questions or want to collaborate? Send a direct message!",
    btnSend: "Send Message",
    footerDesc: "Your trusted platform for original high-definition media sharing and downloads.",
    modalTitle: "Admin Authentication",
    modalDesc: "Sign in to unlock media publishing tools."
  },
  bn: {
    bannerText: "SDH মিডিয়া গ্যালারিতে স্বাগতম! হাই কোয়ালিটি ছবি ও ভিডিও ফ্রিতে ডাউনলোড করুন।",
    adminBtn: "এডমিন পোর্টাল",
    logoutBtn: "লগআউট",
    heroSubtitle: "সহজেই হাই-কোয়ালিটি ছবি ও ভিডিও ভিজিট করুন এবং ফ্রিতে ডাউনলোড করুন।",
    statPhotos: "ছবি",
    statVideos: "ভিডিও",
    statDownloads: "ডাউনলোড",
    adminPanelTitle: "এডমিন আপলোড প্যানেল",
    uploadHeader: "নতুন মিডিয়া আপলোড করুন",
    uploadSubmitBtn: "পাবলিশ করুন",
    recentUploads: "জনপ্রিয় ডাউনলোডসমূহ",
    filterAll: "সবগুলো",
    filterImages: "ছবি",
    filterVideos: "ভিডিও",
    contactTitle: "যোগাযোগ করুন",
    contactSubtitle: "যেকোনো সাহায্য বা মতামত পাঠাতে নিচের ফরমটি পূরণ করুন।",
    btnSend: "মেসেজ পাঠান",
    footerDesc: "আপনার বিশ্বস্ত এইচডি মিডিয়া শেয়ারিং ও ডাউনলোডিং প্ল্যাটফর্ম।",
    modalTitle: "এডমিন লগইন",
    modalDesc: "পোস্ট করার সুবিধা পেতে এডমিন হিসেবে সাইন-ইন করুন।"
  }
};

const placeholders = {
  en: {
    titlePlaceholder: "Enter media title or description...",
    searchPlaceholder: "Search media by title...",
    phName: "Your Name",
    phEmail: "Your Email",
    phMsg: "Your Message...",
    phPass: "Password (min 6 chars)"
  },
  bn: {
    titlePlaceholder: "মিডিয়ার শিরোনাম বা বর্ণনা লিখুন...",
    searchPlaceholder: "নাম লিখে সন্ধান করুন...",
    phName: "আপনার নাম",
    phEmail: "আপনার ইমেইল",
    phMsg: "আপনার বার্তা লিখুন...",
    phPass: "পাসওয়ার্ড"
  }
};

// --- DOM Load & Initial Setup ---
document.addEventListener("DOMContentLoaded", () => {
  applyLanguage(currentLang);
  loadMedia();
  
  // Hash listener for direct #login navigation
  if (window.location.hash === "#login") {
    openAdminModal();
  }
});

// --- Toast Notification Helper ---
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info'}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// --- Language Switcher ---
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'bn' : 'en';
  localStorage.setItem('sdh_lang', currentLang);
  applyLanguage(currentLang);
  showToast(currentLang === 'en' ? "Language changed to English" : "ভাষা বাংলায় পরিবর্তন করা হয়েছে", "info");
}

function applyLanguage(lang) {
  // Translate standard text elements
  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      elem.innerText = translations[lang][key];
    }
  });

  // Translate Input Placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(elem => {
    const key = elem.getAttribute('data-i18n-ph');
    if (placeholders[lang] && placeholders[lang][key]) {
      elem.placeholder = placeholders[lang][key];
    }
  });

  document.getElementById('lang-label').innerText = lang === 'en' ? 'EN / BN' : 'বাংলা / EN';
}

// --- Theme Toggle ---
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const btn = document.getElementById('theme-toggle-btn');
  const isLight = document.body.classList.contains('light-mode');
  btn.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

// --- Admin Modal Operations ---
function openAdminModal() {
  document.getElementById('admin-modal').style.display = 'flex';
}

function closeAdminModal() {
  document.getElementById('admin-modal').style.display = 'none';
}

// --- Authentication Handler ---
async function handleAuth() {
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value.trim();
  const status = document.getElementById('auth-status');

  if (!email || !password) {
    status.innerText = currentLang === 'en' ? "Please enter both email & password!" : "দয়া করে ইমেইল ও পাসওয়ার্ড দিন!";
    return;
  }

  status.innerText = currentLang === 'en' ? "Authenticating..." : "যাচাই করা হচ্ছে...";

  try {
    await auth.signInWithEmailAndPassword(email, password);
    closeAdminModal();
    showToast(currentLang === 'en' ? "Welcome back, Admin!" : "স্বাগতম এডমিন!", "success");
  } catch (error) {
    status.innerText = "❌ Error: " + error.message;
  }
}

// --- Monitor Auth State ---
auth.onAuthStateChanged((user) => {
  const uploadPanel = document.getElementById('upload-panel');
  const adminModalBtn = document.getElementById('admin-modal-btn');
  const adminLogoutBtn = document.getElementById('admin-logout-btn');

  if (user && user.email === ADMIN_EMAIL) {
    if (uploadPanel) uploadPanel.style.display = 'block';
    if (adminModalBtn) adminModalBtn.style.display = 'none';
    if (adminLogoutBtn) adminLogoutBtn.style.display = 'flex';
  } else {
    if (uploadPanel) uploadPanel.style.display = 'none';
    if (adminModalBtn) adminModalBtn.style.display = 'flex';
    if (adminLogoutBtn) adminLogoutBtn.style.display = 'none';
  }
});

function logoutAdmin() {
  auth.signOut();
  showToast(currentLang === 'en' ? "Admin logged out successfully." : "এডমিন লগআউট হয়েছে।", "info");
}

// --- Cloudinary Media Upload ---
async function uploadFile() {
  const currentUser = auth.currentUser;
  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    showToast(currentLang === 'en' ? "Access Denied: Admin privileges required." : "শুধুমাত্র এডমিন ফাইল আপলোড করতে পারবেন!", "error");
    return;
  }

  const titleInput = document.getElementById('titleInput');
  const fileInput = document.getElementById('fileInput');
  const status = document.getElementById('status');
  const uploadBtn = document.getElementById('uploadBtn');

  const title = titleInput ? titleInput.value.trim() : "";
  const file = fileInput && fileInput.files ? fileInput.files[0] : null;

  if (!file) {
    showToast(currentLang === 'en' ? "Please select a photo or video to upload." : "দয়া করে একটি ছবি বা ভিডিও নির্বাচন করুন!", "error");
    return;
  }

  if (status) status.innerText = currentLang === 'en' ? "Uploading to cloud server..." : "ক্লাউডে আপলোড হচ্ছে...";
  if (uploadBtn) uploadBtn.disabled = true;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const resourceType = file.type.startsWith('video') ? 'video' : 'image';
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.secure_url) {
      await db.collection('media').add({
        title: title || (resourceType === 'video' ? 'Untitled Video' : 'Untitled Photo'),
        url: data.secure_url,
        type: resourceType,
        uploader: currentUser.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      showToast(currentLang === 'en' ? "Media published successfully!" : "সফলভাবে আপলোড সম্পন্ন হয়েছে!", "success");
      if (status) status.innerText = "";
      if (titleInput) titleInput.value = "";
      if (fileInput) fileInput.value = "";
    } else {
      throw new Error("Upload failed.");
    }
  } catch (error) {
    console.error(error);
    showToast(currentLang === 'en' ? "Failed to upload file." : "আপলোড ব্যর্থ হয়েছে।", "error");
    if (status) status.innerText = "";
  } finally {
    if (uploadBtn) uploadBtn.disabled = false;
  }
}

// --- Load Gallery Media Realtime ---
function loadMedia() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  db.collection('media').orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
    gallery.innerHTML = '';

    let photoCount = 0;
    let videoCount = 0;

    if (snapshot.empty) {
      gallery.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-folder-open" style="font-size: 3rem; margin-bottom: 10px;"></i>
          <p>${currentLang === 'en' ? 'No media files published yet.' : 'এখনো কোনো ফাইল আপলোড করা হয়নি।'}</p>
        </div>
      `;
      updateStats(0, 0);
      return;
    }

    const currentUser = auth.currentUser;
    const isAdmin = currentUser && currentUser.email === ADMIN_EMAIL;

    snapshot.forEach((doc) => {
      const data = doc.data();
      const docId = doc.id;

      if (data.type === 'video') videoCount++;
      else photoCount++;

      const card = document.createElement('div');
      card.classList.add('media-card');
      card.setAttribute('data-type', data.type);

      const mediaElement = data.type === 'video' 
        ? `<video controls preload="metadata"><source src="${data.url}"></video>` 
        : `<img src="${data.url}" alt="${data.title}" loading="lazy">`;

      const deleteBtnHTML = isAdmin 
        ? `<button onclick="deleteMedia('${docId}')" class="delete-btn" title="Delete Media"><i class="fa-solid fa-trash-can"></i></button>` 
        : '';

      card.innerHTML = `
        <div class="media-preview-wrapper">
          ${mediaElement}
          <span class="media-badge"><i class="fa-solid ${data.type === 'video' ? 'fa-video' : 'fa-image'}"></i> ${data.type.toUpperCase()}</span>
        </div>
        <div class="media-info">
          <div class="media-title">${data.title}</div>
          <div class="card-actions">
            <a href="${data.url}" download target="_blank" class="download-btn">
              <i class="fa-solid fa-download"></i> ${currentLang === 'en' ? 'Download' : 'ডাউনলোড'}
            </a>
            ${deleteBtnHTML}
          </div>
        </div>
      `;
      gallery.appendChild(card);
    });

    updateStats(photoCount, videoCount);
  });
}

function updateStats(photos, videos) {
  document.getElementById('stat-photos').innerText = photos;
  document.getElementById('stat-videos').innerText = videos;
  document.getElementById('stat-downloads').innerText = (photos + videos) * 5 + '+';
}

// --- Delete Asset (Admin Only) ---
async function deleteMedia(docId) {
  if (!confirm(currentLang === 'en' ? "Are you sure you want to delete this asset?" : "আপনি কি সত্যিই এটি মুছে ফেলতে চান?")) return;

  try {
    await db.collection('media').doc(docId).delete();
    showToast(currentLang === 'en' ? "Media asset deleted." : "মিডিয়া মুছে ফেলা হয়েছে।", "info");
  } catch (error) {
    showToast("Error deleting: " + error.message, "error");
  }
}

// --- Live Client-side Search ---
function filterGallery() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const cards = document.querySelectorAll('.media-card');

  cards.forEach(card => {
    const title = card.querySelector('.media-title').innerText.toLowerCase();
    if (title.includes(input)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

// --- Category Filter Tabs ---
function filterCategory(category, btnElem) {
  const cards = document.querySelectorAll('.media-card');
  const buttons = document.querySelectorAll('.filter-btn');

  buttons.forEach(btn => btn.classList.remove('active'));
  if (btnElem) btnElem.classList.add('active');

  cards.forEach(card => {
    const type = card.getAttribute('data-type');
    if (category === 'all' || type === category) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

// --- Contact Form Submission ---
function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contactName').value;
  showToast(currentLang === 'en' ? `Thank you ${name}! Message sent successfully.` : `ধন্যবাদ ${name}! আপনার বার্তা পাঠানো হয়েছে।`, "success");
  document.getElementById('contactForm').reset();
}

