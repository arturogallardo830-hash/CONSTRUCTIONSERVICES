const FIREBASE_ENABLED = true

const firebaseConfig = {
  apiKey: "AIzaSyDplCj5QATMvn6xpanR5nz-ehgGonjcjZQ",
  authDomain: "fieldtrack-55214.firebaseapp.com",
  databaseURL: "https://fieldtrack-55214-default-rtdb.firebaseio.com",
  projectId: "fieldtrack-55214",
  storageBucket: "fieldtrack-55214.firebasestorage.app",
  messagingSenderId: "134432793888",
  appId: "1:134432793888:web:6a4f3a3d5bc1340377a345",
  measurementId: "G-9Y6VVK53SW"
}

let db = null

if (FIREBASE_ENABLED) {
  try {
    const { initializeApp } = await import('firebase/app')
    const { getDatabase } = await import('firebase/database')
    const app = initializeApp(firebaseConfig)
    db = getDatabase(app)
  } catch (e) {
    console.warn('Firebase init failed, using local simulation:', e.message)
  }
}

export { db, FIREBASE_ENABLED }

/*
Firebase Realtime Database structure:
/workers/{workerId}/
  lat: number
  lng: number
  speed: number
  status: string
  battery: number
  timestamp: number

/sos/{alertId}/
  workerId: string
  lat: number
  lng: number
  time: number
  acknowledged: boolean
*/
