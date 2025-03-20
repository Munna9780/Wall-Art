// Fallback script for browsers without WebGL
document.addEventListener('DOMContentLoaded', function() {
    // Check if WebGL is available
    function isWebGLAvailable() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                     (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }
    
    // If WebGL is not available or the 3D carousel failed to initialize
    if (!isWebGLAvailable() || typeof ArtCarousel === 'undefined') {
        console.log('WebGL not available or 3D carousel failed to load. Using fallback slider.');
        
        // Get the carousel container
        const container = document.getElementById('art-carousel');
        if (!container) return;
        
        // Clear loading spinner
        const spinner = container.querySelector('.carousel-loading');
        if (spinner) spinner.style.display = 'none';
        
        // Create a fallback slider
        let currentIndex = 0;
        
        // Create slider elements
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'fallback-slider';
        sliderWrapper.innerHTML = `
            <div class="fallback-slider-inner"></div>
            <div class="fallback-controls">
                <button class="fallback-prev"><i class="fas fa-chevron-left"></i></button>
                <button class="fallback-next"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="fallback-indicators"></div>
        `;
        
        // Add slider to container
        container.appendChild(sliderWrapper);
        
        // Add slider styles inline (in case the CSS file failed to load)
        const style = document.createElement('style');
        style.textContent = `
            .fallback-slider {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
                z-index: 5;
                overflow: hidden;
                background: linear-gradient(to bottom, #f8f8f8, #f2f2f2);
                border-radius: 8px;
            }
            
            .fallback-slider-inner {
                display: flex;
                transition: transform 0.5s ease;
                height: 100%;
                width: 100%;
            }
            
            .fallback-slide {
                flex: 0 0 100%;
                height: 100%;
                background-size: cover;
                background-position: center;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                align-items: center;
                padding: 20px;
                box-sizing: border-box;
                color: #333;
                text-align: center;
            }
            
            .fallback-slide-content {
                background-color: rgba(255,255,255,0.9);
                padding: 20px;
                border-radius: 8px;
                max-width: 500px;
                margin-bottom: 20px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            
            .fallback-controls {
                position: absolute;
                bottom: 20px;
                right: 20px;
                display: flex;
                z-index: 10;
            }
            
            .fallback-prev, .fallback-next {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: white;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                margin: 0 5px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            }
            
            .fallback-indicators {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                z-index: 10;
            }
            
            .fallback-indicator {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: rgba(0,0,0,0.3);
                margin: 0 5px;
                cursor: pointer;
            }
            
            .fallback-indicator.active {
                background-color: #b8860b;
                transform: scale(1.2);
            }
            
            .gallery .fallback-slide h2 {
                font-family: 'Playfair Display', serif;
                margin-bottom: 10px;
                color: #333;
                font-size: 24px;
            }
            
            .gallery .fallback-slide p {
                margin-bottom: 15px;
                line-height: 1.6;
                color: #666;
                font-family: 'Montserrat', sans-serif;
            }
            
            .gallery .fallback-slide .price {
                font-family: 'Playfair Display', serif;
                font-size: 20px;
                color: #b8860b;
                margin-bottom: 20px;
                display: block;
            }
            
            .gallery .fallback-slide .view-sizes-btn {
                display: inline-block;
                background-color: #b8860b;
                color: white;
                padding: 10px 20px;
                border-radius: 30px;
                font-family: 'Montserrat', sans-serif;
                font-weight: 500;
                text-decoration: none;
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .gallery .fallback-slide .view-sizes-btn:hover {
                background-color: #a67c0b;
                transform: translateY(-2px);
            }
            
            @media (max-width: 768px) {
                .fallback-slide-content {
                    padding: 15px;
                    max-width: 90%;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Get slider elements
        const sliderInner = sliderWrapper.querySelector('.fallback-slider-inner');
        const prevButton = sliderWrapper.querySelector('.fallback-prev');
        const nextButton = sliderWrapper.querySelector('.fallback-next');
        const indicators = sliderWrapper.querySelector('.fallback-indicators');
        
        // Load slides from the existing wallArts data
        if (typeof allWallArts !== 'undefined' && allWallArts.length > 0) {
            allWallArts.forEach((art, index) => {
                // Create slide
                const slide = document.createElement('div');
                slide.className = 'fallback-slide';
                slide.style.backgroundImage = `url('${art.image}')`;
                
                // Calculate minimum price
                const prices = art.sizes.map(size => parseFloat(size.price.replace('$', '')));
                const minPrice = '$' + Math.min(...prices).toFixed(2);
                
                // Add content
                slide.innerHTML = `
                    <div class="fallback-slide-content">
                        <h2>${art.title}</h2>
                        <p>${art.description}</p>
                        <span class="price">From ${minPrice}</span>
                        <button class="view-sizes-btn" data-id="${art.id}">View Sizes</button>
                    </div>
                `;
                
                // Add slide to slider
                sliderInner.appendChild(slide);
                
                // Add indicator
                const indicator = document.createElement('div');
                indicator.className = 'fallback-indicator';
                if (index === 0) indicator.classList.add('active');
                indicator.dataset.index = index;
                indicators.appendChild(indicator);
                
                // Add event listener to indicator
                indicator.addEventListener('click', () => {
                    goToSlide(index);
                });
                
                // Add event listener to view sizes button
                const viewSizesBtn = slide.querySelector('.view-sizes-btn');
                viewSizesBtn.addEventListener('click', () => {
                    if (typeof showSizeModal === 'function') {
                        showSizeModal(art);
                    }
                });
            });
            
            // Set initial position
            updateSliderPosition();
            
            // Add event listeners to buttons
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + allWallArts.length) % allWallArts.length;
                updateSliderPosition();
            });
            
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % allWallArts.length;
                updateSliderPosition();
            });
            
            // Auto-advance timer
            let autoAdvanceTimer = setInterval(() => {
                currentIndex = (currentIndex + 1) % allWallArts.length;
                updateSliderPosition();
            }, 5000);
            
            // Pause auto-advance on hover
            sliderWrapper.addEventListener('mouseenter', () => {
                clearInterval(autoAdvanceTimer);
            });
            
            sliderWrapper.addEventListener('mouseleave', () => {
                autoAdvanceTimer = setInterval(() => {
                    currentIndex = (currentIndex + 1) % allWallArts.length;
                    updateSliderPosition();
                }, 5000);
            });
            
            // Touch events for swiping
            let touchStartX = 0;
            let touchEndX = 0;
            
            sliderWrapper.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            }, { passive: true });
            
            sliderWrapper.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].clientX;
                handleSwipe();
            }, { passive: true });
            
            function handleSwipe() {
                const swipeDistance = touchEndX - touchStartX;
                const threshold = 50;
                
                if (swipeDistance > threshold) {
                    // Swipe right (previous)
                    currentIndex = (currentIndex - 1 + allWallArts.length) % allWallArts.length;
                } else if (swipeDistance < -threshold) {
                    // Swipe left (next)
                    currentIndex = (currentIndex + 1) % allWallArts.length;
                }
                
                updateSliderPosition();
            }
            
            // Go to slide function
            function goToSlide(index) {
                currentIndex = index;
                updateSliderPosition();
            }
            
            // Update slider position
            function updateSliderPosition() {
                sliderInner.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                // Update indicators
                const allIndicators = indicators.querySelectorAll('.fallback-indicator');
                allIndicators.forEach((ind, i) => {
                    if (i === currentIndex) {
                        ind.classList.add('active');
                    } else {
                        ind.classList.remove('active');
                    }
                });
            }
        }
    }
});

// Performance optimization and device detection for gallery effects
document.addEventListener('DOMContentLoaded', function() {
    // Device and capability detection
    const isMobile = window.innerWidth <= 768;
    const isLowPoweredDevice = isMobile && navigator.deviceMemory && navigator.deviceMemory <= 4;
    
    // Check if 3D transforms are supported
    function is3DSupported() {
        // Check for transform-style: preserve-3d support
        const el = document.createElement('div');
        el.style.transformStyle = 'preserve-3d';
        return el.style.transformStyle === 'preserve-3d';
    }
    
    // Apply appropriate classes based on device capabilities
    if (!is3DSupported() || isLowPoweredDevice) {
        console.log('Using simplified visuals for better performance');
        document.body.classList.add('no-3d-support');
        
        // Add fallback styles optimized for performance
        const style = document.createElement('style');
        style.textContent = `
            /* Fallback styles for better performance */
            body.no-3d-support .gallery-grid {
                transform: none !important;
                perspective: none !important;
            }
            
            body.no-3d-support .gallery-item {
                transition: transform 0.3s ease, box-shadow 0.3s ease !important;
                transform-style: flat !important;
                will-change: opacity;
                transform: none !important;
            }
            
            body.no-3d-support .gallery-item:hover {
                transform: translateY(-5px) !important;
                box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
            }
            
            body.no-3d-support .gallery-item.active {
                transform: translateY(-3px) !important;
                box-shadow: 0 8px 16px rgba(0,0,0,0.15) !important;
            }
            
            body.no-3d-support .gallery-item-content {
                transform: none !important;
            }
            
            body.no-3d-support .gallery-item.fade-in {
                animation: none !important;
                opacity: 1 !important;
                transform: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Optimize scroll performance
    let ticking = false;
    let lastScrollTop = 0;
    const gallery = document.querySelector('.gallery-grid');
    
    if (gallery) {
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const scrollingDown = currentScrollTop > lastScrollTop;
                    
                    // Add scrolling class only when gallery is in viewport
                    const rect = gallery.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        gallery.classList.add('is-scrolling');
                        
                        // Only update item transforms if 3D is supported and it's not a low-powered device
                        if (is3DSupported() && !isLowPoweredDevice && !isMobile) {
                            updateItemsTransform(scrollingDown);
                        }
                        
                        setTimeout(() => {
                            gallery.classList.remove('is-scrolling');
                        }, 100);
                    }
                    
                    lastScrollTop = currentScrollTop;
                    ticking = false;
                });
                
                ticking = true;
            }
        });
    }
    
    // Optimized function to update item transforms
    function updateItemsTransform(scrollingDown) {
        const items = document.querySelectorAll('.gallery-item');
        const viewportHeight = window.innerHeight;
        
        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            
            // Only transform items in the viewport
            if (rect.top < viewportHeight && rect.bottom > 0) {
                const centerY = rect.top + (rect.height / 2);
                const distanceFromCenter = (viewportHeight / 2 - centerY) / (viewportHeight / 2);
                const direction = scrollingDown ? 1 : -1;
                
                // Reduced 3D effect for better performance
                const rotateY = distanceFromCenter * 10 * direction;
                const translateZ = Math.abs(distanceFromCenter) * 15;
                
                item.style.transform = `
                    rotateY(${rotateY}deg)
                    translateZ(${translateZ}px)
                `;
            }
        });
    }
    
    // Handle gallery item interactions efficiently
    document.querySelectorAll('.gallery-item').forEach(item => {
        // Use event delegation for efficiency
        item.addEventListener('click', function() {
            // Get the corresponding wall art
            let itemId = parseInt(this.getAttribute('data-id'));
            if (isNaN(itemId)) {
                const title = this.querySelector('h3')?.textContent;
                if (title) {
                    const wallArt = allWallArts.find(art => art.title === title);
                    if (wallArt) {
                        itemId = wallArt.id;
                        this.setAttribute('data-id', itemId);
                    }
                }
            }
            
            if (itemId) {
                const wallArt = allWallArts.find(art => art.id === itemId);
                if (wallArt) {
                    showArtDetails(wallArt, this);
                }
            }
        });
    });
    
    // Optimize the display of art details
    function showArtDetails(wallArt, item) {
        const detailsPanel = document.getElementById('art-details');
        if (!detailsPanel) return;
        
        // Set details content
        document.getElementById('details-title').textContent = wallArt.title;
        document.getElementById('details-description').textContent = wallArt.description;
        
        // Calculate minimum price
        const prices = wallArt.sizes.map(size => parseFloat(size.price.replace('$', '')));
        const minPrice = '$' + Math.min(...prices).toFixed(2);
        document.getElementById('details-price').textContent = `From ${minPrice}`;
        
        // Show details panel
        detailsPanel.classList.add('active');
        
        // Add active class to selected item
        document.querySelectorAll('.gallery-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    }
    
    // Make sure view sizes buttons work properly
    document.querySelectorAll('.view-sizes-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering parent click
            
            let wallArt;
            const parent = this.closest('.gallery-item');
            if (parent) {
                const itemId = parseInt(parent.getAttribute('data-id'));
                wallArt = allWallArts.find(art => art.id === itemId);
            } else {
                // For details panel button
                const title = document.getElementById('details-title')?.textContent;
                if (title) {
                    wallArt = allWallArts.find(art => art.title === title);
                }
            }
            
            if (wallArt && typeof showSizeModal === 'function') {
                showSizeModal(wallArt);
                
                // Hide details panel if it's open
                const detailsPanel = document.getElementById('art-details');
                if (detailsPanel?.classList.contains('active')) {
                    detailsPanel.classList.remove('active');
                }
            }
        });
    });
    
    // Add intersection observer for fade-in effect (more efficient than scroll listeners)
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.gallery-item').forEach(item => {
            observer.observe(item);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.classList.add('fade-in');
        });
    }
}); 