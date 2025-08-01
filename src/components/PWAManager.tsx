import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// ============= PWA MANAGER COMPONENT =============

interface PWAManagerProps {
  showInstallPrompt?: boolean;
  enableOfflineMode?: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAManager: React.FC<PWAManagerProps> = ({ 
  showInstallPrompt = true,
  enableOfflineMode = true 
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const installEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(installEvent);
      setIsInstallable(true);
      
      // Show install banner after 10 seconds for HR quick access
      setTimeout(() => {
        if (!isInstalled && showInstallPrompt) {
          setShowInstallBanner(true);
        }
      }, 10000);
    };

    // Handle successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      console.log('PWA installed successfully');
    };

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    checkInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isInstalled, showInstallPrompt]);

  // Handle install button click
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  // Dismiss install banner
  const dismissInstallBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Check if should show banner (not dismissed before)
  useEffect(() => {
    const isDismissed = localStorage.getItem('pwa-install-dismissed') === 'true';
    if (isDismissed) {
      setShowInstallBanner(false);
    }
  }, []);

  return (
    <>
      {/* Install Banner for HR Quick Access */}
      {showInstallBanner && isInstallable && !isInstalled && (
        <InstallBanner>
          <BannerContent>
            <InstallIcon>📱</InstallIcon>
            <BannerText>
              <BannerTitle>Quick Access for HR</BannerTitle>
              <BannerDescription>
                Install this portfolio for instant access - perfect for quick candidate reviews
              </BannerDescription>
            </BannerText>
            <BannerActions>
              <InstallButton onClick={handleInstallClick}>
                Install App
              </InstallButton>
              <DismissButton onClick={dismissInstallBanner}>
                ✕
              </DismissButton>
            </BannerActions>
          </BannerContent>
        </InstallBanner>
      )}

      {/* Offline Status Indicator */}
      {enableOfflineMode && !isOnline && (
        <OfflineIndicator>
          <OfflineIcon>📡</OfflineIcon>
          <OfflineText>
            <strong>Offline Mode</strong><br />
            Portfolio cached for HR review
          </OfflineText>
        </OfflineIndicator>
      )}

      {/* PWA Status Indicator (bottom right) */}
      {isInstalled && (
        <PWAStatusBadge>
          <StatusIcon>✅</StatusIcon>
          <StatusText>PWA Ready</StatusText>
        </PWAStatusBadge>
      )}
    </>
  );
};

// Styled Components
const InstallBanner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  color: white;
  z-index: 10000;
  padding: 1rem;
  box-shadow: var(--shadow-medium);
  animation: slideDown 0.5s ease-out;

  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
`;

const InstallIcon = styled.div`
  font-size: 2rem;
  flex-shrink: 0;
`;

const BannerText = styled.div`
  flex: 1;
  min-width: 0;
`;

const BannerTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const BannerDescription = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
  line-height: 1.4;
`;

const BannerActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const InstallButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const DismissButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  opacity: 0.7;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const OfflineIndicator = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--background-secondary);
  border: 2px solid #ffa502;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow-large);
  z-index: 9999;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
`;

const OfflineIcon = styled.div`
  font-size: 2rem;
  opacity: 0.7;
`;

const OfflineText = styled.div`
  color: var(--color-text-primary);
  font-size: 0.9rem;
  line-height: 1.4;
`;

const PWAStatusBadge = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  background: var(--background-secondary);
  border: 2px solid #2ed573;
  border-radius: 25px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: var(--shadow-small);
  z-index: 1000;
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    bottom: 70px;
    right: 10px;
    padding: 0.4rem 0.8rem;
  }
`;

const StatusIcon = styled.div`
  font-size: 0.9rem;
`;

const StatusText = styled.div`
  color: var(--color-text-primary);
  font-size: 0.8rem;
  font-weight: 600;
`;

export default PWAManager;
