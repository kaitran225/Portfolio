import React, { useState, useCallback, memo, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// ============= OPTIMIZED IMAGE COMPONENT =============

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
}

const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  onLoad,
  onError,
  style
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const [webpSupported, setWebpSupported] = useState<boolean | null>(null);

  // Check WebP support
  useEffect(() => {
    const checkWebPSupport = () => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        setWebpSupported(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    };

    checkWebPSupport();
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  // Generate optimized src
  const getOptimizedSrc = useCallback((originalSrc: string) => {
    // If WebP is supported and we have a local image, try to serve WebP version
    if (webpSupported && originalSrc.startsWith('/') && !originalSrc.includes('.svg')) {
      const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      return webpSrc;
    }
    return originalSrc;
  }, [webpSupported]);

  // Generate srcSet for responsive images
  const generateSrcSet = useCallback((originalSrc: string) => {
    if (!width || originalSrc.includes('http') || originalSrc.includes('.svg')) {
      return undefined;
    }

    const base = originalSrc.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    const ext = webpSupported ? 'webp' : originalSrc.match(/\.(jpg|jpeg|png)$/i)?.[0] || '.jpg';
    
    const sizes = [
      { size: Math.round(width * 0.5), descriptor: '0.5x' },
      { size: width, descriptor: '1x' },
      { size: Math.round(width * 1.5), descriptor: '1.5x' },
      { size: Math.round(width * 2), descriptor: '2x' }
    ];

    return sizes
      .map(({ size, descriptor }) => `${base}-${size}w${ext} ${descriptor}`)
      .join(', ');
  }, [width, webpSupported]);

  // Default blur placeholder
  const defaultBlurDataURL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZjNmNGY2O3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlNWU3ZWI7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIgLz4KPC9zdmc+';

  if (hasError) {
    return (
      <ErrorContainer className={className} style={style}>
        <ErrorIcon>📷</ErrorIcon>
        <ErrorText>Image not available</ErrorText>
      </ErrorContainer>
    );
  }

  return (
    <ImageContainer className={className} style={style} ref={imgRef}>
      {placeholder === 'blur' && isLoading && (
        <PlaceholderBlur
          $backgroundImage={blurDataURL || defaultBlurDataURL}
          $show={isLoading}
        />
      )}
      
      {isLoading && (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      )}

      {(isInView || priority) && (
        <StyledImage
          src={getOptimizedSrc(src)}
          srcSet={generateSrcSet(src)}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          $isLoading={isLoading}
        />
      )}
    </ImageContainer>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// ============= ADVANCED IMAGE GALLERY COMPONENT =============

interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
  }>;
  layout?: 'grid' | 'masonry' | 'carousel';
  lazy?: boolean;
  onImageClick?: (index: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = memo(({
  images,
  layout = 'grid',
  lazy = true,
  onImageClick
}) => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  }, []);

  return (
    <GalleryContainer $layout={layout}>
      {images.map((image, index) => (
        <GalleryItem
          key={index}
          $layout={layout}
          $isLoaded={loadedImages.has(index)}
          onClick={() => onImageClick?.(index)}
        >
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority={!lazy && index < 3}
            onLoad={() => handleImageLoad(index)}
            style={{ 
              width: '100%', 
              height: layout === 'masonry' ? 'auto' : '100%',
              objectFit: 'cover'
            }}
          />
          {image.caption && (
            <ImageCaption>{image.caption}</ImageCaption>
          )}
        </GalleryItem>
      ))}
    </GalleryContainer>
  );
});

ImageGallery.displayName = 'ImageGallery';

// Animations
const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Styled Components
const ImageContainer = styled.div`
  position: relative;
  display: inline-block;
  overflow: hidden;
  background: var(--background-secondary);
`;

const StyledImage = styled.img<{ $isLoading: boolean }>`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
  opacity: ${props => props.$isLoading ? 0 : 1};
  
  &:hover {
    transform: scale(1.02);
    transition: transform 0.3s ease;
  }
`;

const PlaceholderBlur = styled.div<{ $backgroundImage: string; $show: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.$backgroundImage});
  background-size: cover;
  background-position: center;
  filter: blur(20px);
  transform: scale(1.1);
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: ${shimmer} 1.5s infinite;
  }
`;

const LoadingContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-text-tertiary);
  border-top: 2px solid var(--color-purple-primary);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--background-secondary);
  color: var(--color-text-secondary);
  padding: 2rem;
  text-align: center;
  min-height: 200px;
`;

const ErrorIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
`;

const ErrorText = styled.div`
  font-size: 0.9rem;
`;

const GalleryContainer = styled.div<{ $layout: string }>`
  display: ${props => props.$layout === 'grid' ? 'grid' : 'flex'};
  gap: 1rem;
  
  ${props => props.$layout === 'grid' && `
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  `}
  
  ${props => props.$layout === 'masonry' && `
    flex-direction: column;
    flex-wrap: wrap;
    height: 600px;
  `}
  
  ${props => props.$layout === 'carousel' && `
    overflow-x: auto;
    scroll-snap-type: x mandatory;
  `}
`;

const GalleryItem = styled.div<{ $layout: string; $isLoaded: boolean }>`
  position: relative;
  cursor: pointer;
  animation: ${props => props.$isLoaded ? fadeIn : 'none'} 0.5s ease;
  
  ${props => props.$layout === 'grid' && `
    aspect-ratio: 4/3;
  `}
  
  ${props => props.$layout === 'carousel' && `
    flex: 0 0 300px;
    scroll-snap-align: start;
  `}
  
  ${props => props.$layout === 'masonry' && `
    width: calc(50% - 0.5rem);
    margin-bottom: 1rem;
  `}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
  }
`;

const ImageCaption = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 1rem;
  font-size: 0.9rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  
  ${GalleryItem}:hover & {
    transform: translateY(0);
  }
`;

export { OptimizedImage, ImageGallery };
export default OptimizedImage;
