const CACHE_NAME = 'todo-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Archivos en caché');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Service Worker: Error al cachear archivos', error);
      })
  );
  
  // Forzar la activación inmediata
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Eliminando caché antigua', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  
  // Tomar control inmediato de las páginas
  return self.clients.claim();
});

// Interceptar peticiones (estrategia Cache First)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si está en caché, devolverlo
        if (response) {
          return response;
        }
        
        // Si no está en caché, hacer fetch a la red
        return fetch(event.request)
          .then((response) => {
            // Verificar si es una respuesta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clonar la respuesta
            const responseToCache = response.clone();
            
            // Guardar en caché
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Si falla la red y no está en caché, mostrar página offline
            return caches.match('/index.html');
          });
      })
  );
});

// Escuchar mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Sincronización en segundo plano (opcional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tasks') {
    event.waitUntil(syncTasks());
  }
});

// Función para sincronizar tareas (placeholder)
async function syncTasks() {
  console.log('Service Worker: Sincronizando tareas...');
  // Aquí podrías implementar lógica para sincronizar con un servidor
}
