// 3D Carousel for Luxury Wall Arts - Performance Optimized
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/controls/OrbitControls.js';

class ArtCarousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container element not found');
            return;
        }
        
        // Check for WebGL support
        if (!this.isWebGLSupported()) {
            this.showFallback();
            return;
        }

        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.artworks = [];
        this.currentIndex = 0;
        this.isAnimating = false;
        this.isUserInteracting = false;
        this.isMobile = window.innerWidth < 768;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.dragThreshold = 50; // Minimum drag distance to trigger carousel movement
        this.autoRotateSpeed = this.isMobile ? 0.001 : 0.003; // Slower rotation on mobile
        this.detailsVisible = false;
        this.frameCount = 0; // For FPS monitoring
        this.lastFpsUpdate = Date.now();
        this.fpsThreshold = 30; // Min acceptable FPS
        
        // Create a loading message
        this.showLoading();
        
        // Initialize with a slight delay to show loading indicator
        setTimeout(() => {
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupLights();
            this.setupControls();
            this.setupEventListeners();
            
            // Get artworks data and initialize carousel
            this.initializeCarousel();
            
            // Performance monitoring
            this.setupPerformanceMonitoring();
        }, 100);
        
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
    }
    
    isWebGLSupported() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }
    
    showFallback() {
        console.log('WebGL not supported, showing fallback gallery');
        this.container.innerHTML = '';
        this.container.classList.add('fallback-gallery');
        document.body.classList.add('no-webgl');
    }
    
    showLoading() {
        const loading = this.container.querySelector('.carousel-loading');
        if (loading) {
            loading.style.display = 'flex';
        }
    }
    
    hideLoading() {
        const loading = this.container.querySelector('.carousel-loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        // Use a simpler background for better performance
        this.scene.background = new THREE.Color(0xf5f5f5);
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
        this.camera.position.set(0, 0, 10);
        this.cameraTarget = new THREE.Vector3(0, 0, 0);
        this.camera.lookAt(this.cameraTarget);
    }
    
    setupRenderer() {
        // Create renderer with optimized settings
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: !this.isMobile, // Disable antialiasing on mobile
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(this.width, this.height);
        
        // Set pixel ratio but cap it for performance
        const pixelRatio = Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2);
        this.renderer.setPixelRatio(pixelRatio);
        
        // Enable shadows only on desktop
        this.renderer.shadowMap.enabled = !this.isMobile;
        if (!this.isMobile) {
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
        
        this.container.appendChild(this.renderer.domElement);
    }
    
    setupLights() {
        // Simpler lighting for mobile
        if (this.isMobile) {
            // Just use ambient light for mobile
            this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
            this.scene.add(this.ambientLight);
            
            // Add a basic directional light without shadows
            this.mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
            this.mainLight.position.set(5, 5, 5);
            this.scene.add(this.mainLight);
        } else {
            // Full lighting for desktop
            this.mainLight = new THREE.DirectionalLight(0xffffff, 1);
            this.mainLight.position.set(5, 5, 5);
            this.mainLight.castShadow = true;
            this.scene.add(this.mainLight);
            
            this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            this.scene.add(this.ambientLight);
            
            this.rimLight = new THREE.DirectionalLight(0xf5e1c0, 0.3);
            this.rimLight.position.set(-5, 2, -5);
            this.scene.add(this.rimLight);
        }
    }
    
    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.rotateSpeed = 0.5;
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
        
        // Limiting the vertical rotation
        this.controls.minPolarAngle = Math.PI / 3;
        this.controls.maxPolarAngle = Math.PI / 1.5;
        
        this.controls.enabled = false; // Initially disabled
    }
    
    setupEventListeners() {
        // Use passive listeners for better performance
        const options = { passive: true };
        
        // Mouse events
        this.container.addEventListener('mousedown', this.onMouseDown.bind(this), options);
        document.addEventListener('mousemove', this.onMouseMove.bind(this), options);
        document.addEventListener('mouseup', this.onMouseUp.bind(this), options);
        
        // Touch events 
        this.container.addEventListener('touchstart', this.onTouchStart.bind(this), options);
        document.addEventListener('touchmove', this.onTouchMove.bind(this), options);
        document.addEventListener('touchend', this.onTouchEnd.bind(this), options);
        
        // Buttons
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', this.prevArtwork.bind(this));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', this.nextArtwork.bind(this));
        }
    }
    
    setupPerformanceMonitoring() {
        // Monitor performance and degrade gracefully if needed
        this.performanceMonitor = setInterval(() => {
            const now = Date.now();
            const elapsed = (now - this.lastFpsUpdate) / 1000;
            const fps = this.frameCount / elapsed;
            
            // If FPS is low and not already in low-quality mode
            if (fps < this.fpsThreshold && !this.lowQualityMode) {
                console.log(`Low FPS detected (${fps.toFixed(1)}), switching to low-quality mode`);
                this.enableLowQualityMode();
            }
            
            // Reset counters
            this.frameCount = 0;
            this.lastFpsUpdate = now;
        }, 3000); // Check every 3 seconds
    }
    
    enableLowQualityMode() {
        this.lowQualityMode = true;
        
        // Reduce pixel ratio
        this.renderer.setPixelRatio(1);
        
        // Disable shadows
        this.renderer.shadowMap.enabled = false;
        
        // Reduce auto-rotation speed
        this.autoRotateSpeed = this.autoRotateSpeed * 0.5;
        
        // Disable animations by simplifying
        if (this.carouselGroup) {
            this.carouselGroup.children.forEach(child => {
                child.userData.originalPosition = {
                    x: child.position.x,
                    y: child.position.y,
                    z: child.position.z
                };
            });
        }
    }
    
    initializeCarousel() {
        try {
            // Load artwork data for the carousel
            this.loadArtworks(allWallArts);
            
            // Start animation when everything is ready
            this.startAnimation();
            
            setTimeout(() => {
                this.hideLoading();
                this.container.classList.add('carousel-loaded');
            }, 500);
        } catch (error) {
            console.error('Error initializing carousel:', error);
            this.showFallback();
        }
    }
    
    handleResize() {
        if (!this.camera || !this.renderer) return;
        
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        
        // Update camera
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        
        // Update renderer
        this.renderer.setSize(this.width, this.height);
    }
    
    onMouseDown(event) {
        this.isUserInteracting = true;
        this.controls.enabled = true;
    }
    
    onMouseMove(event) {
        // Only track if user is interacting
    }
    
    onMouseUp(event) {
        this.isUserInteracting = false;
        setTimeout(() => {
            this.controls.enabled = false;
        }, 1500); // Give time for damping to finish
    }
    
    onTouchStart(event) {
        this.isUserInteracting = true;
        this.touchStartX = event.touches[0].clientX;
        
        // Briefly enable controls for touch rotation
        if (event.touches.length === 1) {
            this.controls.enabled = true;
        }
    }
    
    onTouchMove(event) {
        // Just track touch position for swipe detection
        if (event.touches.length === 1) {
            this.touchEndX = event.touches[0].clientX;
        }
    }
    
    onTouchEnd(event) {
        this.isUserInteracting = false;
        
        // Handle swipe navigation
        const swipeDistance = this.touchStartX - this.touchEndX;
        
        if (Math.abs(swipeDistance) > this.dragThreshold) {
            if (swipeDistance > 0) {
                this.nextArtwork();
            } else {
                this.prevArtwork();
            }
        }
        
        // Disable controls after a short delay
        setTimeout(() => {
            this.controls.enabled = false;
        }, 500);
    }
    
    prevArtwork() {
        if (this.isAnimating || this.artworks.length === 0) return;
        
        this.isAnimating = true;
        const newIndex = (this.currentIndex - 1 + this.artworks.length) % this.artworks.length;
        this.animateToIndex(newIndex);
    }
    
    nextArtwork() {
        if (this.isAnimating || this.artworks.length === 0) return;
        
        this.isAnimating = true;
        const newIndex = (this.currentIndex + 1) % this.artworks.length;
        this.animateToIndex(newIndex);
    }
    
    animateToIndex(newIndex) {
        if (this.artworks.length === 0) return;
        
        const currentFrame = this.artworks[this.currentIndex].frame;
        const targetFrame = this.artworks[newIndex].frame;
        
        const startRotation = currentFrame.rotation.y;
        let targetRotation = targetFrame.rotation.y;
        
        // Ensure we rotate in the shortest direction
        if (targetRotation - startRotation > Math.PI) {
            targetRotation -= Math.PI * 2;
        } else if (startRotation - targetRotation > Math.PI) {
            targetRotation += Math.PI * 2;
        }
        
        // Animation parameters - faster on mobile
        const duration = this.isMobile ? 700 : 1000; // ms
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease in-out function (simplified for mobile)
            const easeProgress = this.isMobile 
                ? progress // Linear easing for mobile
                : progress < 0.5 
                    ? 2 * progress * progress 
                    : -1 + (4 - 2 * progress) * progress;
            
            // Rotate entire carousel
            this.carouselGroup.rotation.y = startRotation + (targetRotation - startRotation) * easeProgress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.currentIndex = newIndex;
                this.isAnimating = false;
                
                // Update info panel if it exists
                this.updateInfoPanel();
                
                // Update indicators
                this.updateIndicators();
            }
        };
        
        animate();
    }
    
    updateInfoPanel() {
        const infoPanel = document.querySelector('.carousel-info');
        if (!infoPanel) return;
        
        const artwork = this.artworks[this.currentIndex];
        if (!artwork) return;
        
        // Update info content
        const titleEl = infoPanel.querySelector('.carousel-title');
        const descEl = infoPanel.querySelector('.carousel-description');
        const priceEl = infoPanel.querySelector('.carousel-price');
        
        if (titleEl) titleEl.textContent = artwork.title;
        if (descEl) descEl.textContent = artwork.description;
        
        if (priceEl && artwork.sizes && artwork.sizes.length > 0) {
            // Calculate minimum price
            const prices = artwork.sizes.map(size => parseFloat(size.price.replace('$', '')));
            const minPrice = '$' + Math.min(...prices).toFixed(2);
            priceEl.textContent = `From ${minPrice}`;
        }
    }
    
    updateIndicators() {
        const indicators = document.querySelectorAll('.carousel-indicator');
        if (indicators.length === 0) return;
        
        indicators.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    loadArtworks(artworksData) {
        if (!artworksData || artworksData.length === 0) {
            console.error('No artwork data provided');
            return;
        }
        
        // Create a group for the entire carousel
        this.carouselGroup = new THREE.Group();
        this.scene.add(this.carouselGroup);
        
        // Adjust radius based on screen size and number of artworks
        const isManyArtworks = artworksData.length > 8;
        const radius = this.isMobile 
            ? (isManyArtworks ? 7 : 6) 
            : (isManyArtworks ? 9 : 8);
            
        const artAngle = (2 * Math.PI) / artworksData.length;
        
        // Track loaded textures for progress
        let loadedCount = 0;
        const totalArtworks = artworksData.length;
        
        // Create indicators
        this.createIndicators(totalArtworks);
        
        // Use smaller textures on mobile
        const maxTextureSize = this.isMobile ? 512 : 1024;
        
        // Load textures and create frames for each artwork
        artworksData.forEach((art, index) => {
            const textureLoader = new THREE.TextureLoader();
            
            // Load artwork texture with optimized settings
            textureLoader.load(
                art.image, 
                (texture) => {
                    // Optimize texture
                    texture.minFilter = THREE.LinearFilter;
                    texture.generateMipmaps = !this.isMobile;
                    
                    // Limit texture size for performance
                    if (texture.image) {
                        const maxDim = Math.max(texture.image.width, texture.image.height);
                        if (maxDim > maxTextureSize) {
                            const scale = maxTextureSize / maxDim;
                            texture.repeat.set(scale, scale);
                        }
                    }
                    
                    // Calculate frame dimensions based on texture aspect ratio
                    const aspectRatio = texture.image ? texture.image.width / texture.image.height : 1;
                    const frameWidth = 4;
                    const frameHeight = frameWidth / aspectRatio;
                    
                    // Create frame geometry and material with optimized settings
                    const frameGeometry = new THREE.PlaneGeometry(frameWidth, frameHeight);
                    const frameMaterial = new THREE.MeshStandardMaterial({
                        map: texture,
                        side: THREE.FrontSide, // Only render front for performance
                        roughness: 0.8,
                        metalness: 0.2
                    });
                    
                    // Create frame mesh
                    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
                    
                    // Position frame in a circle
                    const angle = index * artAngle;
                    frame.position.x = radius * Math.sin(angle);
                    frame.position.z = radius * Math.cos(angle);
                    
                    // Rotate frame to face center
                    frame.rotation.y = Math.PI - angle;
                    
                    // Add frame to carousel group
                    this.carouselGroup.add(frame);
                    
                    // Add to artworks array with extra data
                    this.artworks.push({
                        ...art,
                        frame,
                        angle
                    });
                    
                    // Track loading progress
                    loadedCount++;
                    this.updateLoadingProgress(loadedCount, totalArtworks);
                    
                    // Sort artworks by angle so they're in the right order
                    if (loadedCount === totalArtworks) {
                        this.artworks.sort((a, b) => a.angle - b.angle);
                        this.updateInfoPanel();
                        this.updateIndicators();
                    }
                },
                // Progress callback
                (xhr) => {
                    // Can optionally show individual loading progress
                },
                // Error callback
                (error) => {
                    console.error(`Error loading texture for ${art.title}:`, error);
                    loadedCount++;
                    this.updateLoadingProgress(loadedCount, totalArtworks);
                }
            );
        });
    }
    
    createIndicators(count) {
        const indicatorsContainer = document.querySelector('.carousel-indicators');
        if (!indicatorsContainer) return;
        
        indicatorsContainer.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            if (i === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => {
                if (i !== this.currentIndex && !this.isAnimating) {
                    this.isAnimating = true;
                    this.animateToIndex(i);
                }
            });
            
            indicatorsContainer.appendChild(indicator);
        }
    }
    
    updateLoadingProgress(loaded, total) {
        const progress = loaded / total;
        // Could update a progress bar here if needed
    }
    
    startAnimation() {
        this.animate();
    }
    
    animate() {
        if (!this.renderer || !this.scene || !this.camera) return;
        
        requestAnimationFrame(this.animate.bind(this));
        
        // Count frames for FPS monitoring
        this.frameCount++;
        
        // Auto-rotate when not interacting, with reduced calculation in low-quality mode
        if (!this.isUserInteracting && !this.isAnimating) {
            this.carouselGroup.rotation.y += this.autoRotateSpeed;
        }
        
        // Update controls only when enabled
        if (this.controls && this.controls.enabled) {
            this.controls.update();
        }
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    // Utility function to debounce events
    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
}

// Initialize carousel when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        const carouselContainer = document.getElementById('art-carousel');
        
        if (carouselContainer) {
            window.artCarousel = new ArtCarousel('art-carousel');
        }
    } catch (error) {
        console.error('Error initializing 3D carousel:', error);
        
        // Show fallback gallery on error
        const container = document.getElementById('art-carousel');
        if (container) {
            container.innerHTML = '';
            container.classList.add('fallback-gallery');
            document.body.classList.add('no-webgl');
        }
    }
}); 