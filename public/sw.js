const CACHE = 'fieldtrack-v1'

const PRECACHE = [
  '/',
  '/dashboard',
  '/workers',
  '/messages',
  '/login',
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  // Only handle same-origin GET requests
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return

  // Network first for API/tile requests
  if (e.request.url.includes('openstreetmap') || e.request.url.includes('tile')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    )
    return
  }

  // Cache first for assets, network first for navigation
  e.respondWith(
    e.request.mode === 'navigate'
      ? fetch(e.request).catch(() => caches.match('/'))
      : caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
          if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()))
          return res
        }))
  )
})
