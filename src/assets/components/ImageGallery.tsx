import React, { useState, useEffect, useRef } from 'react';
import portfolioData from '../../data/portfolioImages.json';
import '../../styles/ImageGallery.css';

interface ImageGalleryProps {
  folder: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ folder }) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    // Get images for the current folder from our data
    const folderImages = portfolioData[folder as keyof typeof portfolioData] || [];
    setImages(folderImages);
    // Reset index when folder changes to avoid out-of-bounds issues
    setCurrentImageIndex(0);
  }, [folder]);

  // Handle scrolling and snapping
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || images.length === 0) return;

    // Scroll to the current image when index changes
    const scrollToCurrentImage = () => {
      const imageElements = scrollContainer.querySelectorAll('.gallery-item');
      if (imageElements[currentImageIndex]) {
        const imageElement = imageElements[currentImageIndex] as HTMLElement;
        scrollContainer.scrollTo({
          left: imageElement.offsetLeft - (scrollContainer.offsetWidth / 2) + (imageElement.offsetWidth / 2),
          behavior: 'smooth'
        });
      }
    };

    // Initial scroll to current image
    scrollToCurrentImage();

    // Set up intersection observer for lazy loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target as HTMLImageElement;
          if (lazyImage.dataset.src) {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.removeAttribute('data-src');
            observer.unobserve(lazyImage);
          }
        }
      });
    }, {
      root: scrollContainer,
      rootMargin: '0px',
      threshold: 0.1
    });

    // Observe all images
    const imageElements = scrollContainer.querySelectorAll('img[data-src]');
    imageElements.forEach(img => observer.observe(img));

    // Clean up observer
    return () => {
      observer.disconnect();
    };
  }, [currentImageIndex, images.length, folder]);

  // Handle automatic scrolling if not manually scrolling
  useEffect(() => {
    if (isScrolling || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images, isScrolling]);

  // Handle manual scrolling and snapping
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (!isScrolling) {
        setIsScrolling(true);
      }
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
        
        // Find the image closest to the center and snap to it
        const containerCenter = scrollContainer.scrollLeft + scrollContainer.offsetWidth / 2;
        const imageElements = Array.from(scrollContainer.querySelectorAll('.gallery-item'));
        
        let closestImage = null;
        let minDistance = Infinity;
        
        imageElements.forEach((img, index) => {
          const imgEl = img as HTMLElement;
          const imgCenter = imgEl.offsetLeft + imgEl.offsetWidth / 2;
          const distance = Math.abs(containerCenter - imgCenter);
          
          if (distance < minDistance) {
            minDistance = distance;
            closestImage = index;
          }
        });
        
        if (closestImage !== null && closestImage !== currentImageIndex) {
          setCurrentImageIndex(closestImage);
        }
      }, 150); // Debounce time after scrolling stops
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentImageIndex, images.length]);

  if (images.length === 0) {
    return <div className="no-images">No images available for {folder}</div>;
  }

  // Ensure index is within bounds
  if (currentImageIndex >= images.length) {
    setCurrentImageIndex(0);
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="image-gallery-container">
      <div className="image-gallery-scroll" ref={scrollContainerRef}>
        {images.map((image, index) => {
          const isVideo = typeof image === 'string' && image.endsWith('.mp4');
          const isActive = index === currentImageIndex;
          
          // Special case for Calantha.mp4, which is in the root of public/assets
          const imagePath = isVideo && image === 'Calantha.mp4' 
            ? `/assets/${image}` 
            : `/assets/${folder}/${image}`;
            
          return (
            <div 
              key={index} 
              className={`gallery-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(index)}
            >
              {isVideo ? (
                <video 
                  className="gallery-media"
                  autoPlay 
                  loop 
                  muted
                  playsInline
                >
                  <source src={imagePath} type="video/mp4" />
                </video>
              ) : (
                <img 
                  className="gallery-media"
                  src={index === currentImageIndex || index === (currentImageIndex + 1) % images.length || index === (currentImageIndex - 1 + images.length) % images.length ? imagePath : ''}
                  data-src={imagePath} 
                  alt={`${folder} ${index}`} 
                  loading="lazy"
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="gallery-dots">
        {images.map((_, index) => (
          <span 
            key={index} 
            className={`gallery-dot ${index === currentImageIndex ? 'active' : ''}`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery; 