import React, { useState, useEffect } from 'react';
import portfolioData from '../data/portfolioImages.json';

interface ImageGalleryProps {
  folder: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ folder }) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Get images for the current folder from our data
    const folderImages = portfolioData[folder as keyof typeof portfolioData] || [];
    setImages(folderImages);
  }, [folder]);

  useEffect(() => {
    // Auto-rotate images every 3 seconds
    const interval = setInterval(() => {
      if (images.length > 0) {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) {
    return <div className="no-images">No images available</div>;
  }

  const currentImage = images[currentImageIndex];
  const isVideo = currentImage.endsWith('.mp4');

  return (
    <div className="image-gallery">
      {isVideo ? (
        <video autoPlay loop muted>
          <source src={`${process.env.PUBLIC_URL}/assets/${folder}/${currentImage}`} type="video/mp4" />
        </video>
      ) : (
        <img 
          src={`${process.env.PUBLIC_URL}/assets/${folder}/${currentImage}`} 
          alt={`${folder} ${currentImageIndex}`} 
        />
      )}
    </div>
  );
};

export default ImageGallery; 