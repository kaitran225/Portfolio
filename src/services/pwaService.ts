// PWA Service Worker Registration and Management
import { useState, useEffect } from 'react';

interface PWAInstallPrompt {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: Event & {
      preventDefault(): void;
      prompt(): Promise<void>;
      userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
    };
  }
}

class PWAService {
  private registration: ServiceWorkerRegistration | null = null;
  private installPrompt: PWAInstallPrompt | null = null;
  private isInstallable = false;
  private isInstalled = false;
  private isSupported = false;

  constructor() {
    this.checkSupport();
    this.initialize();
  }

  private checkSupport() {
    this.isSupported = 'serviceWorker' in navigator && 'caches' in window;
    this.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true;
  }

  private async initialize() {
    if (!this.isSupported) {
      console.warn('PWA features not supported in this browser');
      return;
    }

    await this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupUpdateHandling();
    this.setupOfflineHandling();
  }

  private async registerServiceWorker() {
    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      console.log('Service Worker registered successfully');

      // Handle different registration states
      if (this.registration.installing) {
        this.trackInstallProgress(this.registration.installing);
      } else if (this.registration.waiting) {
        this.showUpdateAvailable();
      } else if (this.registration.active) {
        console.log('Service Worker active and ready');
      }

      // Listen for updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration!.installing;
        if (newWorker) {
          this.trackInstallProgress(newWorker);
        }
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  private trackInstallProgress(worker: ServiceWorker) {
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // New update available
          this.showUpdateAvailable();
        } else {
          // First time install
          console.log('Content cached for offline use');
          this.showOfflineReady();
        }
      }
    });
  }

  private setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.installPrompt = event as any;
      this.isInstallable = true;
      this.showInstallPrompt();
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed successfully');
      this.isInstalled = true;
      this.hideInstallPrompt();
      this.trackInstallation();
    });
  }

  private setupUpdateHandling() {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Reload the page when new service worker takes control
      window.location.reload();
    });
  }

  private setupOfflineHandling() {
    window.addEventListener('online', () => {
      this.showConnectionStatus('online');
    });

    window.addEventListener('offline', () => {
      this.showConnectionStatus('offline');
    });
  }

  // Public methods for app integration
  async installApp(): Promise<boolean> {
    if (!this.installPrompt) {
      console.warn('Install prompt not available');
      return false;
    }

    try {
      await this.installPrompt.prompt();
      const choice = await this.installPrompt.userChoice;
      
      if (choice.outcome === 'accepted') {
        console.log('User accepted PWA installation');
        return true;
      } else {
        console.log('User dismissed PWA installation');
        return false;
      }
    } catch (error) {
      console.error('Installation failed:', error);
      return false;
    }
  }

  async updateApp(): Promise<void> {
    if (!this.registration || !this.registration.waiting) {
      console.warn('No update available');
      return;
    }

    // Tell the waiting service worker to skip waiting
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  async getCacheInfo(): Promise<{
    cacheSize: number;
    cacheCount: number;
    isOfflineReady: boolean;
  }> {
    if (!this.registration) {
      return { cacheSize: 0, cacheCount: 0, isOfflineReady: false };
    }

    try {
      const cacheNames = await caches.keys();
      let totalSize = 0;
      
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        
        for (const key of keys) {
          const response = await cache.match(key);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
          }
        }
      }

      return {
        cacheSize: totalSize,
        cacheCount: cacheNames.length,
        isOfflineReady: totalSize > 0
      };
    } catch (error) {
      console.error('Failed to get cache info:', error);
      return { cacheSize: 0, cacheCount: 0, isOfflineReady: false };
    }
  }

  async clearCache(): Promise<void> {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  getInstallationStatus(): {
    isSupported: boolean;
    isInstallable: boolean;
    isInstalled: boolean;
  } {
    return {
      isSupported: this.isSupported,
      isInstallable: this.isInstallable,
      isInstalled: this.isInstalled
    };
  }

  // UI notification methods (to be implemented by the app)
  private showInstallPrompt() {
    // Dispatch custom event for app to handle
    window.dispatchEvent(new CustomEvent('pwa:installable', {
      detail: { canInstall: true }
    }));
  }

  private hideInstallPrompt() {
    window.dispatchEvent(new CustomEvent('pwa:installable', {
      detail: { canInstall: false }
    }));
  }

  private showUpdateAvailable() {
    window.dispatchEvent(new CustomEvent('pwa:updateavailable', {
      detail: { hasUpdate: true }
    }));
  }

  private showOfflineReady() {
    window.dispatchEvent(new CustomEvent('pwa:offlineready', {
      detail: { isReady: true }
    }));
  }

  private showConnectionStatus(status: 'online' | 'offline') {
    window.dispatchEvent(new CustomEvent('pwa:connectionchange', {
      detail: { status }
    }));
  }

  private trackInstallation() {
    // Track installation with analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'pwa_install', {
        event_category: 'PWA',
        event_label: 'App Installation'
      });
    }
  }

  // Offline form submission
  async submitFormOffline(formData: any, endpoint: string): Promise<void> {
    if ('indexedDB' in window) {
      // Store form data in IndexedDB for later sync
      try {
        const request = indexedDB.open('PortfolioPWA', 1);
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('pendingForms')) {
            db.createObjectStore('pendingForms', { keyPath: 'id' });
          }
        };

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['pendingForms'], 'readwrite');
          const store = transaction.objectStore('pendingForms');
          
          store.add({
            id: Date.now(),
            endpoint,
            data: formData,
            timestamp: new Date().toISOString()
          });
        };

        // Register for background sync
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
          const registration = await navigator.serviceWorker.ready;
          await (registration as any).sync.register('contact-form-sync');
        }
      } catch (error) {
        console.error('Failed to store offline form:', error);
      }
    }
  }
}

// React Hook for PWA integration
export const usePWA = () => {
  const [pwaService] = useState(() => new PWAService());
  const [isInstallable, setIsInstallable] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online');

  useEffect(() => {
    const handleInstallable = (event: any) => {
      setIsInstallable(event.detail.canInstall);
    };

    const handleUpdate = (event: any) => {
      setHasUpdate(event.detail.hasUpdate);
    };

    const handleOfflineReady = (event: any) => {
      setIsOfflineReady(event.detail.isReady);
    };

    const handleConnectionChange = (event: any) => {
      setConnectionStatus(event.detail.status);
    };

    window.addEventListener('pwa:installable', handleInstallable);
    window.addEventListener('pwa:updateavailable', handleUpdate);
    window.addEventListener('pwa:offlineready', handleOfflineReady);
    window.addEventListener('pwa:connectionchange', handleConnectionChange);

    return () => {
      window.removeEventListener('pwa:installable', handleInstallable);
      window.removeEventListener('pwa:updateavailable', handleUpdate);
      window.removeEventListener('pwa:offlineready', handleOfflineReady);
      window.removeEventListener('pwa:connectionchange', handleConnectionChange);
    };
  }, []);

  return {
    pwaService,
    isInstallable,
    hasUpdate,
    isOfflineReady,
    connectionStatus,
    installApp: pwaService.installApp.bind(pwaService),
    updateApp: pwaService.updateApp.bind(pwaService),
    getCacheInfo: pwaService.getCacheInfo.bind(pwaService),
    clearCache: pwaService.clearCache.bind(pwaService),
    getInstallationStatus: pwaService.getInstallationStatus.bind(pwaService),
    submitFormOffline: pwaService.submitFormOffline.bind(pwaService),
  };
};

export default PWAService;
