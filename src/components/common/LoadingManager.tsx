import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ============= LOADING MANAGER CONTEXT =============

interface LoadingState {
  isLoading: boolean;
  loadingText: string;
  progress: number;
  error?: string;
}

interface LoadingContextType {
  loadingState: LoadingState;
  setLoading: (isLoading: boolean, text?: string) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  addLoadingTask: (id: string) => void;
  removeLoadingTask: (id: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// ============= LOADING ANIMATIONS =============

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// ============= STYLED COMPONENTS =============

const LoadingOverlay = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: all 0.3s ease;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  animation: ${props => props.show ? css`${slideIn} 0.3s ease` : 'none'};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 400px;
  padding: 2rem;
  text-align: center;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 3px solid rgba(0, 255, 255, 0.1);
  border-top: 3px solid #00ffff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const LoadingSubtext = styled.p`
  color: #888;
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 1rem;
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #00ffff 0%, #0099ff 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`;

const ErrorContainer = styled.div`
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid #ff4444;
  border-radius: 8px;
  padding: 1rem;
  color: #ff6666;
  max-width: 100%;
  margin-top: 1rem;
`;

const ErrorTitle = styled.h3`
  color: #ff4444;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
`;

const ErrorMessage = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const RetryButton = styled.button`
  background: linear-gradient(135deg, #00ffff 0%, #0099ff 100%);
  color: #000;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

// ============= LOADING MANAGER PROVIDER =============

interface LoadingManagerProps {
  children: ReactNode;
}

export const LoadingManager: React.FC<LoadingManagerProps> = ({ children }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    loadingText: 'Loading...',
    progress: 0,
    error: undefined
  });

  useEffect(() => {
    // Hide initial loading screen once React app is ready
    const hideInitialLoading = () => {
      const loadingElement = document.getElementById('portfolio-loading');
      if (loadingElement) {
        loadingElement.style.opacity = '0';
        setTimeout(() => {
          loadingElement.style.display = 'none';
        }, 500);
      }
    };

    // Wait for a brief moment to ensure everything is loaded
    const timer = setTimeout(hideInitialLoading, 100);

    return () => clearTimeout(timer);
  }, []);

  const setLoading = (isLoading: boolean, text = 'Loading...') => {
    setLoadingState(prev => ({
      ...prev,
      isLoading,
      loadingText: text,
      error: undefined
    }));
  };

  const setProgress = (progress: number) => {
    setLoadingState(prev => ({
      ...prev,
      progress: Math.max(0, Math.min(100, progress))
    }));
  };

  const setError = (error: string | null) => {
    setLoadingState(prev => ({
      ...prev,
      error: error || undefined,
      isLoading: error ? false : prev.isLoading
    }));
  };

  const addLoadingTask = (id: string) => {
    setLoading(true);
  };

  const removeLoadingTask = (id: string) => {
    setLoading(false);
  };

  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  const contextValue: LoadingContextType = {
    loadingState,
    setLoading,
    setProgress,
    setError,
    addLoadingTask,
    removeLoadingTask
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      <LoadingOverlay show={loadingState.isLoading || !!loadingState.error}>
        <LoadingContainer>
          {loadingState.error ? (
            <ErrorContainer>
              <ErrorTitle>Something went wrong</ErrorTitle>
              <ErrorMessage>{loadingState.error}</ErrorMessage>
              <RetryButton onClick={handleRetry}>
                Try Again
              </RetryButton>
            </ErrorContainer>
          ) : (
            <>
              <Spinner />
              <LoadingText>{loadingState.loadingText}</LoadingText>
              <LoadingSubtext>
                Please wait while we prepare your portfolio experience
              </LoadingSubtext>
              {loadingState.progress > 0 && (
                <ProgressBarContainer>
                  <ProgressBar progress={loadingState.progress} />
                </ProgressBarContainer>
              )}
            </>
          )}
        </LoadingContainer>
      </LoadingOverlay>
    </LoadingContext.Provider>
  );
};

// ============= CUSTOM HOOK =============

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingManager');
  }
  return context;
};

// ============= ASYNC LOADING HOOK =============

export const useAsyncLoading = () => {
  const { setLoading, setError, setProgress } = useLoading();

  const executeWithLoading = async <T,>(
    asyncOperation: () => Promise<T>,
    loadingText = 'Processing...',
    progressCallback?: (progress: number) => void
  ): Promise<T> => {
    try {
      setLoading(true, loadingText);
      setProgress(0);

      if (progressCallback) {
        progressCallback(25);
        setProgress(25);
      }

      const result = await asyncOperation();

      if (progressCallback) {
        progressCallback(100);
        setProgress(100);
      }

      // Brief delay to show completion
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setLoading(false);
      return result;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      throw error;
    }
  };

  return { executeWithLoading };
};

export default LoadingManager;
