// Sample wall art data - Replace with your actual affiliate products
const defaultWallArts = [
    {
        id: 1,
        title: "Elegant Abstract Canvas",
        description: "Modern abstract wall art with gold foil accents, perfect for luxury living spaces",
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        sizes: [
            { size: "5x7 inches", price: "$24.99", amazonLink: "YOUR_AMAZON_AFFILIATE_LINK_1_5x7" },
            { size: "8x10 inches", price: "$39.99", amazonLink: "YOUR_AMAZON_AFFILIATE_LINK_1_8x10" },
            { size: "16x20 inches", price: "$99.99", amazonLink: "YOUR_AMAZON_AFFILIATE_LINK_1_16x20" }
        ]
    },
    {
        id: 2,
        title: "Minimalist Gold Leaf Print",
        description: "Clean, sophisticated design with real gold leaf embellishments",
        image: "https://images.unsplash.com/photo-1577083552431-6e5c019a0f1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        sizes: [
            { size: "4x6 inches", price: "$19.99", amazonLink: "YOUR_AMAZON_AFFILIATE_LINK_2_4x6" },
            { size: "5x5 inches", price: "$24.99", amazonLink: "YOUR_AMAZON_AFFILIATE_LINK_2_5x5" },
            { size: "8x10 inches", price: "$49.99", amazonLink: "YOUR_AMAZON_AFFILIATE_LINK_2_8x10" }
        ]
    },
    {
        id: 3,
        title: "Premium Landscape Art",
        description: "Breathtaking landscape with metallic finish, handcrafted frame available",
        image: "https://images.unsplash.com/photo-1548430094-790652c4dac6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        sizes: [
            { size: "16x20 inches", price: "$89.99", amazonLink: "YOUR_AMAZON_AFFILIATE_LINK_3_16x20" },
            { size: "24x36 inches", price: "$179.99", amazonLink: "YOUR_AMAZON_AFFILIATE_LINK_3_24x36" }
        ]
    },
    {
        id: 4,
        title: "Luxury Square Canvas",
        description: "Modern square wall art with premium texture and depth effects",
        image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        sizes: [
            { size: "12x12 inches", price: "$59.99", amazonLink: "YOUR_AMAZON_AFFILIATE_LINK_4_12x12" },
            { size: "20x20 inches", price: "$99.99", amazonLink: "YOUR_AMAZON_AFFILIATE_LINK_4_20x20" }
        ]
    },
    {
        id: 5,
        title: "Prestige Multi-Panel Art",
        description: "Stunning 3-piece canvas set with coordinated design for grand spaces",
        image: "https://images.unsplash.com/photo-1558882224-dda166733046?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        sizes: [
            { size: "16x20 inches (3 panels)", price: "$199.99", amazonLink: "YOUR_AMAZON_AFFILIATE_LINK_5_16x20_3P" },
            { size: "24x36 inches (3 panels)", price: "$399.99", amazonLink: "YOUR_AMAZON_AFFILIATE_LINK_5_24x36_3P" }
        ]
    }
];

// Create a variable to store all wall arts (sample + user-added)
let allWallArts = [];

// SIMPLIFIED PRODUCT LOADING FUNCTION
function loadProducts() {
    console.log("Loading products...");
    
    try {
        // Try to get from localStorage
        const storedData = localStorage.getItem('wallArts');
        
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                
                if (Array.isArray(parsedData) && parsedData.length > 0) {
                    console.log(`Found ${parsedData.length} products in localStorage`);
                    allWallArts = parsedData;
                    return;
                }
            } catch (parseError) {
                console.error("Error parsing localStorage data:", parseError);
            }
        }
        
        // If we get here, either no data in localStorage or it wasn't valid
        console.log("No valid data in localStorage, using default products");
        allWallArts = [...defaultWallArts];
        
        // Save default products to localStorage for future use
        localStorage.setItem('wallArts', JSON.stringify(defaultWallArts));
        
    } catch (error) {
        console.error("Error loading products:", error);
        
        // Ensure we always have products
        allWallArts = [...defaultWallArts];
    }
}

// Call the loading function immediately
loadProducts();
console.log(`Loaded ${allWallArts.length} products`);

// DOM Elements - Common
const galleryElement = document.getElementById('gallery-grid') || document.querySelector('.gallery.medium-size-banner');
const filterButtons = document.querySelectorAll('.filter-btn');
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const adminLinks = document.querySelectorAll('.admin-link');

// Admin Authentication
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password123"; 

// Check if user is logged in
let isLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';

// Check if current page is admin.html
const isAdminPage = window.location.href.includes('admin.html');

// Admin elements - only used on admin page
const adminLoginSection = document.getElementById('admin-login');
const adminSection = document.getElementById('admin');
const loginForm = document.getElementById('login-form');
const addWallArtBtn = document.getElementById('add-wall-art-btn');
const manageWallArtsBtn = document.getElementById('manage-wall-arts-btn');
const addWallArtForm = document.getElementById('add-wall-art-form');
const manageWallArtsPanel = document.getElementById('manage-wall-arts-panel');
const wallArtForm = document.getElementById('wall-art-form');
const sizesContainer = document.getElementById('sizes-container');
const addSizeBtn = document.getElementById('add-size-btn');
const imageInput = document.getElementById('art-image');
const imagePreview = document.getElementById('image-preview');
const wallArtsList = document.querySelector('.wall-arts-list');

// Ensure the modal exists or create it
let modal = document.getElementById('sizeModal');
let closeModal = document.querySelector('.close-modal');
let modalTitle = document.getElementById('modalTitle');
let sizeOptions = document.getElementById('sizeOptions');

if (!modal) {
    // Create modal HTML for size options
    const modalHTML = `
        <div class="modal" id="sizeModal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-header">
                    <h2 id="modalTitle"></h2>
                </div>
                <div class="modal-body">
                    <div class="size-options" id="sizeOptions"></div>
                </div>
            </div>
        </div>
    `;

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Get modal elements
    modal = document.getElementById('sizeModal');
    closeModal = document.querySelector('.close-modal');
    modalTitle = document.getElementById('modalTitle');
    sizeOptions = document.getElementById('sizeOptions');
}

// Setup admin page functionality
function setupAdminPage() {
    if (!isAdminPage) return;

    console.log("Setting up admin page. Login status:", isLoggedIn);
    
    // Check if admin elements exist before proceeding
    if (!adminLoginSection || !adminSection) {
        console.error("Admin elements not found in the DOM");
        return;
    }

    // Setup visibility based on login status
    if (isLoggedIn) {
        // User is logged in, show admin panel
        adminLoginSection.style.display = 'none';
        adminSection.style.display = 'block';
        
        // Add logout button if not already present
        if (!document.querySelector('.logout-btn')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'logout-btn';
            logoutBtn.textContent = 'Logout';
            logoutBtn.addEventListener('click', handleLogout);
            
            const adminContainer = document.querySelector('.admin-container');
            if (adminContainer) {
                adminContainer.insertAdjacentElement('beforebegin', logoutBtn);
            }
        }
        
        // Setup admin panel event listeners
        setupAdminPanelListeners();
    } else {
        // User is not logged in, show login form
        adminLoginSection.style.display = 'block';
        adminSection.style.display = 'none';
        
        // Add login form listener if form exists
        if (loginForm) {
            // Remove previous listeners to avoid duplicates
            const newLoginForm = loginForm.cloneNode(true);
            loginForm.parentNode.replaceChild(newLoginForm, loginForm);
            newLoginForm.addEventListener('submit', handleLogin);
        }
    }
}

// Setup admin panel event listeners
function setupAdminPanelListeners() {
    if (!addWallArtBtn || !manageWallArtsBtn) return;
    
    // Tab switching in admin panel
    addWallArtBtn.addEventListener('click', () => {
        addWallArtBtn.classList.add('active');
        manageWallArtsBtn.classList.remove('active');
        addWallArtForm.classList.add('active');
        manageWallArtsPanel.classList.remove('active');
    });

    manageWallArtsBtn.addEventListener('click', () => {
        manageWallArtsBtn.classList.add('active');
        addWallArtBtn.classList.remove('active');
        manageWallArtsPanel.classList.add('active');
        addWallArtForm.classList.remove('active');
        renderWallArtsList();
    });

    // Add new size field
    if (addSizeBtn) {
        addSizeBtn.addEventListener('click', addSizeField);
    }

    // Image preview
    if (imageInput && imagePreview) {
        imageInput.addEventListener('input', () => {
            const imageUrl = imageInput.value.trim();
            if (imageUrl) {
                imagePreview.src = imageUrl;
                imagePreview.style.display = 'block';
                // Handle invalid image URL
                imagePreview.onerror = () => {
                    imagePreview.style.display = 'none';
                };
            } else {
                imagePreview.style.display = 'none';
            }
        });
    }

    // Form submission
    if (wallArtForm) {
        wallArtForm.addEventListener('submit', handleWallArtSubmit);
    }

    // Initial size remove button listeners
    setupSizeRemoveListeners();
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('login-error');
    
    console.log("Login attempt:", username);
    
    // Check credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Set login status
        isLoggedIn = true;
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        
        // Show admin panel without reload
        if (adminLoginSection && adminSection) {
            adminLoginSection.style.display = 'none';
            adminSection.style.display = 'block';
            
            // Add logout button
            if (!document.querySelector('.logout-btn')) {
                const logoutBtn = document.createElement('button');
                logoutBtn.className = 'logout-btn';
                logoutBtn.textContent = 'Logout';
                logoutBtn.addEventListener('click', handleLogout);
                
                const adminContainer = document.querySelector('.admin-container');
                if (adminContainer) {
                    adminContainer.insertAdjacentElement('beforebegin', logoutBtn);
                }
            }
            
            // Setup admin panel event listeners
            setupAdminPanelListeners();
        } else {
            // Fallback to page reload if elements can't be found
            window.location.reload();
        }
    } else {
        // Show error message
        if (loginError) {
            loginError.textContent = 'Invalid username or password';
            loginError.style.display = 'block';
        }
    }
}

// Handle logout
function handleLogout() {
    // Clear login status
    isLoggedIn = false;
    sessionStorage.removeItem('isAdminLoggedIn');
    
    // Reload page to reset state
    window.location.reload();
}

// Add a new size input field
function addSizeField() {
    const sizeField = document.createElement('div');
    sizeField.className = 'size-input-group';
    sizeField.innerHTML = `
        <input type="text" placeholder="Size (e.g. 8x10 inches)" class="size-dimension" required>
        <input type="text" placeholder="Price (e.g. $19.99)" class="size-price" required>
        <input type="url" placeholder="Amazon Affiliate Link" class="size-link" required>
        <button type="button" class="remove-size-btn">✕</button>
    `;
    sizesContainer.appendChild(sizeField);
    
    // Add event listener to new remove button
    const removeBtn = sizeField.querySelector('.remove-size-btn');
    removeBtn.addEventListener('click', () => {
        sizeField.remove();
    });
}

// Setup event listeners for size remove buttons
function setupSizeRemoveListeners() {
    document.querySelectorAll('.remove-size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Don't remove if it's the only size field
            if (sizesContainer.children.length > 1) {
                btn.closest('.size-input-group').remove();
            }
        });
    });
}

// Handle wall art form submission
function handleWallArtSubmit(e) {
    e.preventDefault();
    console.log("Form submitted");
    
    // Generate ID
    const newId = allWallArts.length > 0 ? Math.max(...allWallArts.map(art => art.id)) + 1 : 1;
    
    // Collect sizes
    const sizes = [];
    document.querySelectorAll('.size-input-group').forEach(group => {
        sizes.push({
            size: group.querySelector('.size-dimension').value,
            price: group.querySelector('.size-price').value,
            amazonLink: group.querySelector('.size-link').value
        });
    });
    
    // Create new wall art
    const newWallArt = {
        id: newId,
        title: document.getElementById('art-title').value,
        description: document.getElementById('art-description').value,
        image: document.getElementById('art-image').value,
        sizes: sizes
    };
    
    // Add to array and save
    allWallArts.push(newWallArt);
    saveWallArtsToLocalStorage();
    
    // Reset form
    wallArtForm.reset();
    imagePreview.style.display = 'none';
    
    // Keep only one size field after submission
    while (sizesContainer.children.length > 1) {
        sizesContainer.removeChild(sizesContainer.lastChild);
    }
    
    // Show success message
    alert('Wall art added successfully!');
}

// Render wall arts list in manage panel
function renderWallArtsList() {
    if (!wallArtsList) return;
    
    wallArtsList.innerHTML = '';
    
    if (allWallArts.length === 0) {
        wallArtsList.innerHTML = '<p>No wall arts to display</p>';
        return;
    }
    
    allWallArts.forEach(art => {
        const artItem = document.createElement('div');
        artItem.className = 'wall-art-item';
        artItem.innerHTML = `
            <img src="${art.image}" alt="${art.title}" class="wall-art-thumb">
            <div class="wall-art-info">
                <h4>${art.title}</h4>
                <p>${art.description.substring(0, 60)}${art.description.length > 60 ? '...' : ''}</p>
                <p><strong>Sizes:</strong> ${art.sizes.length}</p>
                <div class="wall-art-actions">
                    <button class="edit-btn" data-id="${art.id}">Edit</button>
                    <button class="delete-btn" data-id="${art.id}">Delete</button>
                </div>
            </div>
        `;
        wallArtsList.appendChild(artItem);
    });
    
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDeleteWallArt);
    });
}

// Handle delete button
function handleDeleteWallArt(e) {
    const target = e.target;
    if (target.classList.contains('delete-btn')) {
        const id = parseInt(target.dataset.id);
        
        if (confirm('Are you sure you want to delete this wall art?')) {
            // Remove from array
            const index = allWallArts.findIndex(art => art.id === id);
            if (index !== -1) {
                allWallArts.splice(index, 1);
                saveWallArtsToLocalStorage();
                renderWallArtsList();
            }
        }
    }
}

// Save wall arts to local storage
function saveWallArtsToLocalStorage() {
    try {
        localStorage.setItem('wallArts', JSON.stringify(allWallArts));
        console.log(`Saved ${allWallArts.length} wall arts to localStorage`);
    } catch (e) {
        console.error("Error saving wall arts to localStorage:", e);
        alert("Error saving data. Your browser might have restrictions on local storage.");
    }
}

// Mobile menu toggle - Fixed version with proper display toggle
if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        const navUl = document.querySelector('nav ul');
        if (!navUl) return;
        
        navUl.classList.toggle('active');
        menuBtn.classList.toggle('active');
        
        // Toggle aria-expanded attribute for accessibility
        if (menuBtn.setAttribute) {
            menuBtn.setAttribute('aria-expanded', navUl.classList.contains('active'));
        }
    });
}

// Create gallery items - SIMPLIFIED VERSION WITH MEDIUM BANNER
function createGalleryItem(wallArt) {
    // Ensure all properties exist to prevent errors
    const title = wallArt.title || 'Wall Art';
    const description = wallArt.description || 'Beautiful wall art piece';
    const image = wallArt.image || 'https://via.placeholder.com/300x300?text=No+Image';
    
    return `
        <div class="gallery-item medium-banner" data-id="${wallArt.id}">
            <img src="${image}" alt="${title}" loading="lazy">
            <div class="gallery-item-content">
                <h3>${title}</h3>
                <p>${description}</p>
                <button class="view-sizes-btn">View Available Sizes</button>
            </div>
        </div>
    `;
}

// Show size modal - updated with accessibility
function showSizeModal(wallArt) {
    if (!modal || !modalTitle || !sizeOptions) {
        console.error("Modal elements not found");
        return;
    }
    
    modalTitle.textContent = wallArt.title;
    sizeOptions.innerHTML = wallArt.sizes.map(size => `
        <div class="size-option">
            <div class="size-info">
                <span class="size">${size.size}</span>
                <span class="price">${size.price}</span>
            </div>
            <a href="${size.amazonLink}" target="_blank" rel="noopener noreferrer" class="amazon-link">
                View on Amazon
            </a>
        </div>
    `).join('');
    
    // Show modal with accessibility
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus on close button for keyboard users
    const closeButton = modal.querySelector('.close-modal');
    if (closeButton) {
        setTimeout(() => closeButton.focus(), 100);
    }
}

// Close modal
if (closeModal && modal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// SIMPLIFIED GALLERY INITIALIZATION - Medium size banner with 3D scroll effects
function initializeGallery() {
    // First, find the gallery container - we handle both possible selectors
    const galleryContainer = document.getElementById('gallery-grid') || document.querySelector('.gallery.medium-size-banner');
    
    if (!galleryContainer) {
        console.error("Gallery container not found.");
        return;
    }
    
    console.log(`Initializing gallery with ${allWallArts.length} items`);
    
    // Hide loading indicator if it exists
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
    
    // Make sure there are products to display
    if (allWallArts.length === 0) {
        console.warn("No products to display, loading default products");
        allWallArts = [...defaultWallArts];
        saveWallArtsToLocalStorage();
    }
    
    // Clear gallery and ensure it has the medium-size banner class
    galleryContainer.innerHTML = '';
    galleryContainer.classList.add('medium-size-banner');
    
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768 || 
                     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Use simpler rendering for mobile
    if (isMobile) {
        console.log("Using mobile-optimized gallery rendering");
        // Render all at once for mobile (simpler and often faster on mobile)
        let galleryHTML = '';
        allWallArts.forEach(wallArt => {
            galleryHTML += createGalleryItem(wallArt);
        });
        galleryContainer.innerHTML = galleryHTML;
        
        // Set up interactions after rendering
        setupGalleryInteractions();
        
        // Add mobile class to body for CSS targeting
        document.body.classList.add('mobile-view');
        document.body.classList.remove('desktop-view');
    } else {
        // Desktop rendering with batches
        console.log("Using desktop-optimized gallery rendering with batches");
        document.body.classList.add('desktop-view');
        document.body.classList.remove('mobile-view');
        
        // Create gallery items in batches for better performance
        const batchSize = 5;
        const totalItems = allWallArts.length;
        
        // Function to render items in batches for smoother loading
        function renderBatch(startIndex) {
            // Get the batch of items to render
            const endIndex = Math.min(startIndex + batchSize, totalItems);
            const fragment = document.createDocumentFragment();
            
            for (let i = startIndex; i < endIndex; i++) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = createGalleryItem(allWallArts[i]);
                fragment.appendChild(tempDiv.firstElementChild);
            }
            
            galleryContainer.appendChild(fragment);
            
            // If there are more items to render, schedule the next batch
            if (endIndex < totalItems) {
                window.requestAnimationFrame(() => {
                    renderBatch(endIndex);
                });
            } else {
                // All items rendered, set up interaction handlers
                setupGalleryInteractions();
                
                // Set up 3D scroll effect after a short delay to ensure smooth initial loading
                setTimeout(() => {
                    if (!isLowPoweredDevice()) {
                        setupGallery3DEffect();
                    }
                }, 500);
            }
        }
        
        // Start rendering the first batch
        renderBatch(0);
    }
    
    console.log("Gallery initialization completed");
    return true; // Return success
}

// Set up gallery interactions separately for better performance
function setupGalleryInteractions() {
    const galleryContainer = document.getElementById('gallery-grid') || document.querySelector('.gallery.medium-size-banner');
    if (!galleryContainer) return;
    
    // Use event delegation for better performance
    galleryContainer.addEventListener('click', (e) => {
        // Find the closest button if a child element was clicked
        const button = e.target.closest('.view-sizes-btn');
        if (!button) return;
        
        const galleryItem = button.closest('.gallery-item');
        if (!galleryItem) return;
        
        const itemId = parseInt(galleryItem.dataset.id);
        if (isNaN(itemId)) return;
        
        const wallArt = allWallArts.find(art => art.id === itemId);
        if (wallArt) {
            showSizeModal(wallArt);
        }
    });
    
    console.log("Gallery interactions setup complete");
}

// Helper function to detect low-powered devices
function isLowPoweredDevice() {
    // Check for device memory API
    if (navigator.deviceMemory && navigator.deviceMemory <= 2) return true;
    
    // Check for mobile device with reasonable screen size cutoff
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth < 768;
    
    // If it's a mobile device with a small screen, consider it low-powered
    return isMobile && isSmallScreen;
}

// 3D scroll effect with performance optimizations
function setupGallery3DEffect() {
    const gallery = document.getElementById('gallery-grid') || document.querySelector('.gallery.medium-size-banner');
    if (!gallery) return;
    
    // Get all gallery items
    const items = gallery.querySelectorAll('.gallery-item');
    if (items.length === 0) return;
    
    // Variables for scroll performance
    let lastScrollTop = 0;
    let ticking = false;
    let scrollTimeout;
    
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', () => {
        if (ticking) return;
        
        // Clear previous timeout
        if (scrollTimeout) clearTimeout(scrollTimeout);
        
        ticking = true;
        
        // Use requestAnimationFrame for smoother animation
        window.requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const galleryRect = gallery.getBoundingClientRect();
            
            // Only apply effects when gallery is visible
            if (galleryRect.bottom < 0 || galleryRect.top > window.innerHeight) {
                ticking = false;
                return;
            }
            
            document.body.classList.add('is-scrolling');
            
            const isScrollingDown = scrollTop > lastScrollTop;
            lastScrollTop = scrollTop;
            
            // Process only visible items for better performance
            for (const item of items) {
                const rect = item.getBoundingClientRect();
                
                // Skip items not in viewport
                if (rect.bottom < 0 || rect.top > window.innerHeight) {
                    // Reset transform for out-of-view items to prevent lingering effects
                    item.style.transform = '';
                    item.style.boxShadow = '';
                    continue;
                }
                
                // Calculate distance from center of viewport
                const centerY = rect.top + rect.height / 2;
                const distanceFromCenter = (window.innerHeight / 2 - centerY) / (window.innerHeight / 2);
                
                // Calculate rotation and transform based on scroll direction
                const rotateY = distanceFromCenter * 5 * (isScrollingDown ? 1 : -1); // Reduced rotation for smoother effect
                const scale = 1 + Math.abs(distanceFromCenter) * 0.03;  // Reduced scale for subtler effect
                const translateZ = Math.abs(distanceFromCenter) * 10;   // Reduced translateZ for better performance
                
                // Apply 3D transforms
                item.style.transform = `
                    perspective(1000px)
                    rotateY(${rotateY}deg)
                    scale(${scale})
                    translateZ(${translateZ}px)
                `;
                
                // Add shadow effect
                const shadowBlur = 5 + Math.abs(distanceFromCenter) * 10;
                const shadowOpacity = 0.1 + Math.abs(distanceFromCenter) * 0.05;
                item.style.boxShadow = `0 ${shadowBlur}px ${shadowBlur * 1.5}px rgba(0,0,0,${shadowOpacity})`;
            }
            
            // Reset flag to allow next animation frame
            ticking = false;
            
            // Remove scrolling class after animation completes
            scrollTimeout = setTimeout(() => {
                document.body.classList.remove('is-scrolling');
            }, 100);
        });
    }, { passive: true }); // passive: true improves scroll performance
    
    console.log("3D gallery effects initialized");
}

/**
 * Initialize the 3D banner effects to enhance the digital workspace banner
 * This adds subtle mouse-based parallax effects to create depth
 */
function initializeDigitalWorkspaceBanner() {
    const banner = document.querySelector('.digital-workspace-banner');
    const bannerContent = banner?.querySelector('.hero-banner');
    
    if (!banner || !bannerContent) return;
    
    // Add parallax effect on mouse movement
    banner.addEventListener('mousemove', function(e) {
        // Early exit for mobile devices
        if (window.innerWidth < 768) return;
        
        const rect = banner.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element
        
        // Calculate movement percentage (-5 to 5 pixels)
        const moveX = ((x / rect.width) - 0.5) * 10;
        const moveY = ((y / rect.height) - 0.5) * 10;
        
        // Apply the transform with a subtle movement
        bannerContent.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    });
    
    // Reset on mouse leave
    banner.addEventListener('mouseleave', function() {
        bannerContent.style.transform = 'translate(0, 0) scale(1)';
    });
    
    console.log('Digital workspace banner initialized');
}

// Initialize the application with event listeners for different screen sizes
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded. isAdminPage:", isAdminPage);
    
    // Make sure products are loaded
    if (allWallArts.length === 0) {
        loadProducts();
    }
    
    if (isAdminPage) {
        // Setup admin page
        setupAdminPage();
    } else {
        // Initialize gallery on non-admin pages
        initializeGallery();
    }
    
    // Initialize the digital workspace banner effects
    initializeDigitalWorkspaceBanner();
    
    // Set up resize handler for responsive adjustments
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Debounce resize events for better performance
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Check if we need to reinitialize gallery on major width changes
            const isMobile = window.innerWidth <= 768;
            const wasMobile = document.body.classList.contains('mobile-view');
            
            if (isMobile !== wasMobile) {
                console.log(`Screen size changed from ${wasMobile ? 'mobile' : 'desktop'} to ${isMobile ? 'mobile' : 'desktop'}`);
                // Reinitialize gallery with appropriate settings
                initializeGallery();
                
                // Also ensure mobile nav is properly set up
                const navUl = document.querySelector('nav ul');
                if (navUl) {
                    // Reset nav display when switching between mobile and desktop
                    if (isMobile) {
                        navUl.classList.remove('active');
                    }
                }
            }
        }, 250);
    }, { passive: true });
    
    // Handle page visibility changes to refresh content when tab becomes visible again
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && !isAdminPage) {
            // Check if we need to reload products (e.g., if another tab has updated them)
            try {
                const storedData = localStorage.getItem('wallArts');
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    if (Array.isArray(parsedData) && 
                        JSON.stringify(parsedData) !== JSON.stringify(allWallArts)) {
                        console.log("Product data changed, refreshing gallery");
                        allWallArts = parsedData;
                        initializeGallery();
                    }
                }
            } catch (e) {
                console.error("Error checking for product updates:", e);
            }
        }
    });
    
    // Initial mobile detection
    document.body.classList.toggle('mobile-view', window.innerWidth <= 768);
    document.body.classList.toggle('desktop-view', window.innerWidth > 768);
}); 