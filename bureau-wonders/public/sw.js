/**
 * Service Worker for Progressive Enhancement
 * Handles caching, offline support, and performance optimization
 */

const CACHE_NAME = 'bureau-wonders-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const IMAGE_CACHE = 'images-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  // Add critical CSS and JS files here
];

// Assets to cache on first request
const DYNAMIC_ASSETS = [
  '/about',
  '/services',
  '/blog',
  '/contact',
  '/careers',
];

// Image optimization and caching
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'];
const MAX_IMAGE_CACHE_SIZE = 50; // Maximum number of images to cache
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
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
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Handle different types of requests
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isPageRequest(request)) {
    event.respondWith(handlePageRequest(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

// Check if request is for an image
function isImageRequest(request) {
  const url = new URL(request.url);
  return IMAGE_EXTENSIONS.some(ext => url.pathname.toLowerCase().includes(ext));
}

// Check if request is for a static asset
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.includes('/_next/static/') || 
         url.pathname.includes('/static/') ||
         STATIC_ASSETS.includes(url.pathname);
}

// Check if request is for a page
function isPageRequest(request) {
  const url = new URL(request.url);
  return request.headers.get('accept')?.includes('text/html') ||
         DYNAMIC_ASSETS.includes(url.pathname);
}

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Check if cached image is still fresh
      const cacheDate = cachedResponse.headers.get('sw-cache-date');
      if (cacheDate && Date.now() - parseInt(cacheDate) < MAX_CACHE_AGE) {
        return cachedResponse;
      }
    }
    
    // Fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(IMAGE_CACHE);
      
      // Add cache date header
      const responseToCache = new Response(networkResponse.body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: {
          ...Object.fromEntries(networkResponse.headers.entries()),
          'sw-cache-date': Date.now().toString(),
        },
      });
      
      // Manage cache size
      await manageCacheSize(cache, MAX_IMAGE_CACHE_SIZE);
      await cache.put(request, responseToCache.clone());
      
      return networkResponse;
    }
    
    // Return cached version if network fails
    return cachedResponse || new Response('Image not found', { status: 404 });
  } catch (error) {
    console.error('Service Worker: Image request failed', error);
    
    // Try to return cached version
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Image not available', { status: 404 });
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Static asset request failed', error);
    
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Asset not available', { status: 404 });
  }
}

// Handle page requests with network-first strategy
async function handlePageRequest(request) {
  try {
    // Try network first for fresh content
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    // Fall back to cache if network fails
    const cachedResponse = await caches.match(request);
    return cachedResponse || createOfflinePage();
  } catch (error) {
    console.error('Service Worker: Page request failed', error);
    
    // Return cached version or offline page
    const cachedResponse = await caches.match(request);
    return cachedResponse || createOfflinePage();
  }
}

// Handle other dynamic requests
async function handleDynamicRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Dynamic request failed', error);
    
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Content not available', { status: 404 });
  }
}

// Manage cache size by removing oldest entries
async function manageCacheSize(cache, maxSize) {
  const keys = await cache.keys();
  
  if (keys.length >= maxSize) {
    // Sort by cache date and remove oldest entries
    const entries = await Promise.all(
      keys.map(async (key) => {
        const response = await cache.match(key);
        const cacheDate = response?.headers.get('sw-cache-date') || '0';
        return { key, date: parseInt(cacheDate) };
      })
    );
    
    entries.sort((a, b) => a.date - b.date);
    
    // Remove oldest entries
    const toRemove = entries.slice(0, entries.length - maxSize + 1);
    await Promise.all(toRemove.map(entry => cache.delete(entry.key)));
  }
}

// Create offline page response
function createOfflinePage() {
  const offlineHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - Bureau of Wonders</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 2rem;
          text-align: center;
          background: #faf9f7;
          color: #2d251a;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
        }
        .icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1rem;
          opacity: 0.5;
        }
        h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        p {
          font-size: 1.125rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .button {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: #d4af37;
          color: #2d251a;
          text-decoration: none;
          border-radius: 0.375rem;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <h1>You're Offline</h1>
        <p>
          It looks like you're not connected to the internet. 
          Don't worry, you can still browse the cached content or try again when you're back online.
        </p>
        <a href="/" class="button">Go to Homepage</a>
      </div>
    </body>
    </html>
  `;
  
  return new Response(offlineHTML, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

// Sync contact form submissions when back online
async function syncContactForm() {
  try {
    // Get pending form submissions from IndexedDB
    const pendingSubmissions = await getPendingSubmissions();
    
    for (const submission of pendingSubmissions) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submission.data),
        });
        
        if (response.ok) {
          await removePendingSubmission(submission.id);
          console.log('Service Worker: Form submission synced');
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync form submission', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// IndexedDB helpers for offline form storage
async function getPendingSubmissions() {
  // Simplified implementation - in a real app, use IndexedDB
  return [];
}

async function removePendingSubmission(id) {
  // Simplified implementation - in a real app, use IndexedDB
  return Promise.resolve();
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: data.data,
    actions: data.actions || [],
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action) {
    // Handle action buttons
    handleNotificationAction(event.action, event.notification.data);
  } else {
    // Handle notification click
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    );
  }
});

function handleNotificationAction(action, data) {
  switch (action) {
    case 'view':
      clients.openWindow(data?.url || '/');
      break;
    case 'dismiss':
      // Just close the notification
      break;
    default:
      clients.openWindow('/');
  }
}

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_REPORT') {
    console.log('Service Worker: Performance report received', event.data.metrics);
    // In a real app, you might send this to an analytics service
  }
});

console.log('Service Worker: Loaded and ready');