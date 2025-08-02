import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

// ============= LAZY LOADING IMAGE COMPONENT =============

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  return (
    <ImageContainer className={className}>
      <Image
        ref={imgRef}
        src={isInView ? src : placeholder}
        alt={alt}
        loaded={isLoaded}
        hasError={hasError}
        onLoad={handleLoad}
        onError={handleError}
      />
      {!isLoaded && isInView && !hasError && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
      {hasError && (
        <ErrorOverlay>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorText>Failed to load image</ErrorText>
        </ErrorOverlay>
      )}
    </ImageContainer>
  );
};

// Styled Components
const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  background: #00000000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img<{ loaded: boolean; hasError: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
  opacity: ${props => {
    if (props.hasError) return 0;
    return props.loaded ? 1 : 0.7;
  }};
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
`;

const LoadingSpinner = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #667eea;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-width: 280px;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
`;

const ErrorIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const ErrorText = styled.div`
  font-size: 0.875rem;
  text-align: center;
`;

export default LazyImage;
