// Service Worker for Portfolio PWA
// Enhanced with workbox-style patterns and background-sync capabilities
const CACHE_NAME = 'portfolio-v1.0.0';
const STATIC_CACHE_NAME = 'static-v1.0.0';
const RUNTIME_CACHE_NAME = 'runtime-v1.0.0';
const BACKGROUND_SYNC_TAG = 'contact-form-sync';

// Workbox-compatible cache strategies implemented with native APIs

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  // Add other critical assets
];

// Runtime caching strategies
const RUNTIME_CACHE_URLS = [
  // API endpoints
  '/api/',
  // External resources
  'https://fonts.googleapis.com/',
  'https://fonts.gstatic.com/',
  // GitHub API
  'https://api.github.com/',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== RUNTIME_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle different types of requests
  if (request.method !== 'GET') {
    return; // Only cache GET requests
  }
  
  // Static assets strategy: Cache first, fallback to network
  // workbox equivalent: StaleWhileRevalidate for static assets
  if (isStaticAsset(request)) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then((response) => {
              // Clone response before caching
              const responseClone = response.clone();
              
              caches.open(STATIC_CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
              
              return response;
            });
        })
        .catch(() => {
          // Return offline fallback for critical assets
          if (request.destination === 'document') {
            return caches.match('/offline.html');
          }
        })
    );
    return;
  }
  
  // API requests strategy: Network first, fallback to cache
  if (isApiRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // Return generic error response for API failures
              return new Response(
                JSON.stringify({ error: 'Network unavailable' }),
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        })
    );
    return;
  }
  
  // External resources strategy: Stale while revalidate
  if (isExternalResource(request)) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          const fetchPromise = fetch(request)
            .then((response) => {
              const responseClone = response.clone();
              caches.open(RUNTIME_CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
              return response;
            })
            .catch(() => cachedResponse); // Fallback to cache on network error
          
          // Return cached version immediately if available, then update cache
          return cachedResponse || fetchPromise;
        })
    );
    return;
  }
  
  // Default: Network first
  event.respondWith(
    fetch(request)
      .catch(() => {
        // Fallback strategies for different request types
        if (request.destination === 'document') {
          return caches.match('/offline.html');
        }
        
        if (request.destination === 'image') {
          return caches.match('/images/offline-placeholder.svg');
        }
        
        return new Response('Network error', { 
          status: 408, 
          statusText: 'Request Timeout' 
        });
      })
  );
});

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.includes('/static/') ||
         url.pathname.includes('/assets/') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.ico') ||
         url.pathname.endsWith('.png') ||
         url.pathname.endsWith('.jpg') ||
         url.pathname.endsWith('.webp');
}

function isApiRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') ||
         url.hostname === 'api.github.com';
}

function isExternalResource(request) {
  const url = new URL(request.url);
  return url.hostname === 'fonts.googleapis.com' ||
         url.hostname === 'fonts.gstatic.com' ||
         url.hostname === 'cdn.jsdelivr.net' ||
         url.hostname === 'unpkg.com';
}

// Background sync for contact form submissions
// Implementation follows workbox background-sync patterns
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForms());
  }
});

async function syncContactForms() {
  try {
    // Get pending contact form submissions from IndexedDB
    const pendingForms = await getPendingContactForms();
    
    for (const form of pendingForms) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form.data),
        });
        
        if (response.ok) {
          // Remove from pending queue
          await removePendingContactForm(form.id);
          console.log('Contact form synced successfully');
        }
      } catch (error) {
        console.error('Failed to sync contact form:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// IndexedDB operations for offline functionality
async function getPendingContactForms() {
  // Mock implementation - would use IndexedDB in real app
  return [];
}

async function removePendingContactForm(id) {
  // Mock implementation - would use IndexedDB in real app
  console.log('Removing pending form:', id);
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    actions: [
      {
        action: 'view',
        title: 'View Portfolio',
        icon: '/icons/view-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-icon.png'
      }
    ],
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then((size) => {
      event.ports[0].postMessage({ cacheSize: size });
    });
  }
});

async function getCacheSize() {
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
  
  return totalSize;
}

console.log('Service Worker: Loaded successfully');
