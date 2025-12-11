/**
 * Service Worker Registration and Management
 * Handles SW registration, updates, and offline functionality
 */

export interface ServiceWorkerConfig {
  enabled: boolean;
  updateCheckInterval: number;
  showUpdateNotification: boolean;
  enableBackgroundSync: boolean;
  enablePushNotifications: boolean;
}

class ServiceWorkerManager {
  private config: ServiceWorkerConfig = {
    enabled: true,
    updateCheckInterval: 60000, // 1 minute
    showUpdateNotification: true,
    enableBackgroundSync: true,
    enablePushNotifications: false,
  };

  private registration: ServiceWorkerRegistration | null = null;
  private updateAvailable = false;
  private updateCallbacks: Array<() => void> = [];
  private offlineCallbacks: Array<(isOffline: boolean) => void> = [];

  constructor() {
    this.detectOnlineStatus();
  }

  // Register service worker
  async register(): Promise<void> {
    if (!this.config.enabled || typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.log('Service Worker: Not supported or disabled');
      return;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker: Registered successfully');

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        this.handleUpdate();
      });

      // Check for existing updates
      if (this.registration.waiting) {
        this.updateAvailable = true;
        this.notifyUpdateAvailable();
      }

      // Listen for controller changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      // Set up periodic update checks
      this.setupUpdateChecks();

      // Set up message handling
      this.setupMessageHandling();

    } catch (error) {
      console.error('Service Worker: Registration failed', error);
    }
  }

  // Handle service worker updates
  private handleUpdate(): void {
    if (!this.registration) return;

    const newWorker = this.registration.installing;
    if (!newWorker) return;

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        this.updateAvailable = true;
        this.notifyUpdateAvailable();
      }
    });
  }

  // Notify about available updates
  private notifyUpdateAvailable(): void {
    if (this.config.showUpdateNotification) {
      this.showUpdateNotification();
    }
    
    this.updateCallbacks.forEach(callback => callback());
  }

  // Show update notification
  private showUpdateNotification(): void {
    const notification = document.createElement('div');
    notification.className = 'sw-update-notification';
    notification.innerHTML = `
      <div>
        <strong>Update Available</strong>
        <p>A new version of the website is available. Refresh to get the latest features and improvements.</p>
        <div class="sw-update-notification__actions">
          <button class="sw-update-notification__button" onclick="this.closest('.sw-update-notification').dispatchEvent(new CustomEvent('update'))">
            Update Now
          </button>
          <button class="sw-update-notification__button sw-update-notification__button--secondary" onclick="this.closest('.sw-update-notification').dispatchEvent(new CustomEvent('dismiss'))">
            Later
          </button>
        </div>
      </div>
      <button class="sw-update-notification__close" onclick="this.closest('.sw-update-notification').dispatchEvent(new CustomEvent('dismiss'))" aria-label="Close">
        ×
      </button>
    `;

    // Handle notification actions
    notification.addEventListener('update', () => {
      this.applyUpdate();
      notification.remove();
    });

    notification.addEventListener('dismiss', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });

    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.dispatchEvent(new CustomEvent('dismiss'));
      }
    }, 10000);
  }

  // Apply service worker update
  async applyUpdate(): Promise<void> {
    if (!this.registration || !this.registration.waiting) return;

    // Tell the waiting service worker to skip waiting
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  // Set up periodic update checks
  private setupUpdateChecks(): void {
    setInterval(async () => {
      if (this.registration) {
        try {
          await this.registration.update();
        } catch (error) {
          console.error('Service Worker: Update check failed', error);
        }
      }
    }, this.config.updateCheckInterval);
  }

  // Set up message handling between SW and main thread
  private setupMessageHandling(): void {
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, data } = event.data;

      switch (type) {
        case 'CACHE_UPDATED':
          console.log('Service Worker: Cache updated', data);
          break;
        case 'OFFLINE_READY':
          console.log('Service Worker: Offline functionality ready');
          break;
        case 'BACKGROUND_SYNC_SUCCESS':
          console.log('Service Worker: Background sync completed', data);
          break;
        default:
          console.log('Service Worker: Unknown message', event.data);
      }
    });
  }

  // Detect online/offline status
  private detectOnlineStatus(): void {
    const updateOnlineStatus = () => {
      const isOffline = !navigator.onLine;
      this.offlineCallbacks.forEach(callback => callback(isOffline));
      
      if (isOffline) {
        document.body.classList.add('offline');
      } else {
        document.body.classList.remove('offline');
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial check
    updateOnlineStatus();
  }

  // Cache important resources
  async cacheResources(urls: string[]): Promise<void> {
    if (!this.registration) return;

    try {
      const cache = await caches.open('user-cache-v1');
      await cache.addAll(urls);
      console.log('Service Worker: Resources cached', urls);
    } catch (error) {
      console.error('Service Worker: Failed to cache resources', error);
    }
  }

  // Clear all caches
  async clearCaches(): Promise<void> {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('Service Worker: All caches cleared');
    } catch (error) {
      console.error('Service Worker: Failed to clear caches', error);
    }
  }

  // Get cache usage
  async getCacheUsage(): Promise<{ used: number; quota: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          quota: estimate.quota || 0,
        };
      } catch (error) {
        console.error('Service Worker: Failed to get cache usage', error);
      }
    }
    
    return { used: 0, quota: 0 };
  }

  // Background sync for form submissions
  async scheduleBackgroundSync(tag: string, data: any): Promise<void> {
    if (!this.config.enableBackgroundSync || !this.registration) return;

    try {
      // Store data for background sync
      await this.storeForSync(tag, data);
      
      // Register background sync
      await this.registration.sync.register(tag);
      console.log('Service Worker: Background sync scheduled', tag);
    } catch (error) {
      console.error('Service Worker: Background sync failed', error);
      throw error;
    }
  }

  // Store data for background sync
  private async storeForSync(tag: string, data: any): Promise<void> {
    // In a real implementation, this would use IndexedDB
    // For now, we'll use localStorage as a fallback
    const syncData = {
      id: Date.now().toString(),
      tag,
      data,
      timestamp: Date.now(),
    };
    
    const existingData = JSON.parse(localStorage.getItem('sw-sync-data') || '[]');
    existingData.push(syncData);
    localStorage.setItem('sw-sync-data', JSON.stringify(existingData));
  }

  // Send performance metrics to service worker
  sendPerformanceMetrics(metrics: any): void {
    if (this.registration && this.registration.active) {
      this.registration.active.postMessage({
        type: 'PERFORMANCE_REPORT',
        metrics,
      });
    }
  }

  // Subscribe to update notifications
  onUpdateAvailable(callback: () => void): () => void {
    this.updateCallbacks.push(callback);
    
    return () => {
      const index = this.updateCallbacks.indexOf(callback);
      if (index > -1) {
        this.updateCallbacks.splice(index, 1);
      }
    };
  }

  // Subscribe to offline status changes
  onOfflineStatusChange(callback: (isOffline: boolean) => void): () => void {
    this.offlineCallbacks.push(callback);
    
    return () => {
      const index = this.offlineCallbacks.indexOf(callback);
      if (index > -1) {
        this.offlineCallbacks.splice(index, 1);
      }
    };
  }

  // Get current configuration
  getConfig(): ServiceWorkerConfig {
    return { ...this.config };
  }

  // Update configuration
  updateConfig(updates: Partial<ServiceWorkerConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  // Check if service worker is supported and active
  isActive(): boolean {
    return !!(this.registration && navigator.serviceWorker.controller);
  }

  // Check if update is available
  isUpdateAvailable(): boolean {
    return this.updateAvailable;
  }
}

// Singleton instance
export const serviceWorkerManager = new ServiceWorkerManager();

// Utility functions
export const registerServiceWorker = () => {
  return serviceWorkerManager.register();
};

export const isServiceWorkerSupported = () => {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
};

export const cacheResources = (urls: string[]) => {
  return serviceWorkerManager.cacheResources(urls);
};

export const clearAllCaches = () => {
  return serviceWorkerManager.clearCaches();
};

// React hooks
import { useState, useEffect } from 'react';

export const useServiceWorker = () => {
  const [isActive, setIsActive] = useState(serviceWorkerManager.isActive());
  const [updateAvailable, setUpdateAvailable] = useState(serviceWorkerManager.isUpdateAvailable());
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const unsubscribeUpdate = serviceWorkerManager.onUpdateAvailable(() => {
      setUpdateAvailable(true);
    });

    const unsubscribeOffline = serviceWorkerManager.onOfflineStatusChange((offline) => {
      setIsOffline(offline);
    });

    // Check active status periodically
    const interval = setInterval(() => {
      setIsActive(serviceWorkerManager.isActive());
    }, 5000);

    return () => {
      unsubscribeUpdate();
      unsubscribeOffline();
      clearInterval(interval);
    };
  }, []);

  const applyUpdate = () => {
    serviceWorkerManager.applyUpdate();
    setUpdateAvailable(false);
  };

  return {
    isActive,
    updateAvailable,
    isOffline,
    applyUpdate,
    cacheResources: serviceWorkerManager.cacheResources.bind(serviceWorkerManager),
    clearCaches: serviceWorkerManager.clearCaches.bind(serviceWorkerManager),
    getCacheUsage: serviceWorkerManager.getCacheUsage.bind(serviceWorkerManager),
  };
};

export const useOfflineForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submitForm = async (data: any, endpoint: string) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (navigator.onLine) {
        // Submit directly if online
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Submission failed');
        }

        return await response.json();
      } else {
        // Schedule for background sync if offline
        await serviceWorkerManager.scheduleBackgroundSync('contact-form', {
          endpoint,
          data,
        });

        return { success: true, message: 'Form will be submitted when you\'re back online' };
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitForm,
    isSubmitting,
    submitError,
  };
};