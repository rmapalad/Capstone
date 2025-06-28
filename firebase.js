// Firebase configuration for Property Management System
// This file exports the firebaseApp instance for use in other files

// Firebase config object (you must replace these values with your real Firebase project details)
const firebaseConfig = {
  apiKey: "AIzaSyBHfCZvWwZfCwG3OZW4HK7rwEJCOGk34AM",

  authDomain: "wwa1-75695.firebaseapp.com",

  projectId: "wwa1-75695",

  storageBucket: "wwa1-75695.firebasestorage.app",

  messagingSenderId: "891647347229",

  appId: "1:891647347229:web:860e163df10594dba394f4",

  measurementId: "G-D5LM21D4E4"

};

// Wait until Firebase SDK is available from CDN
function initializeFirebase() {
  return new Promise((resolve, reject) => {
    // Check if Firebase is already available
    if (window.firebase) {
      console.log("Firebase SDK detected, initializing app...");
      try {
        // Initialize Firebase
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        
        // Log initialization success
        console.log("Firebase app initialized successfully with config:", firebaseConfig);
        
        // Initialize Firestore with relaxed security for testing
        const firestore = firebase.firestore();
        
        // IMPORTANT: This setting bypasses security rules - use in development only!
        firestore.settings({
          ignoreUndefinedProperties: true,
          experimentalForceLongPolling: true,
        });
        
        // Make them available globally for easier debugging and access
        window.firebaseApp = firebaseApp;
        window.firestoreDB = firestore;
        
        // Test direct write to Firestore
        console.log("Testing direct Firestore write...");
        firestore.collection("_test").doc("init_test").set({
          timestamp: new Date().toISOString(),
          message: "Direct write test"
        }).then(() => {
          console.log("✅ Direct Firestore write test succeeded!");
        }).catch(err => {
          console.error("❌ Direct Firestore write test failed:", err);
        });
        
        // Test connection to Firestore
        firestore.collection("_test").get().then(snapshot => {
          console.log("✅ Firestore connection verified with", snapshot.size, "documents in _test collection");
        }).catch(err => {
          console.error("❌ Firestore connection test failed:", err);
        });
        
        resolve(firebaseApp);
      } catch (error) {
        console.error("Error initializing Firebase app:", error);
        reject(error);
      }
    } else {
      // If Firebase isn't available yet, wait for it
      console.log("Waiting for Firebase SDK to load from CDN...");
      let checkCount = 0;
      const checkInterval = setInterval(() => {
        checkCount++;
        if (window.firebase) {
          clearInterval(checkInterval);
          try {
            // Initialize Firebase
            const firebaseApp = firebase.initializeApp(firebaseConfig);
            
            // Log initialization success
            console.log("Firebase app initialized successfully after waiting");
            
            // Initialize Firestore with relaxed security for testing
            const firestore = firebase.firestore();
            
            // IMPORTANT: This setting bypasses security rules - use in development only!
            firestore.settings({
              ignoreUndefinedProperties: true,
              experimentalForceLongPolling: true,
            });
            
            // Make them available globally for easier debugging and access
            window.firebaseApp = firebaseApp;
            window.firestoreDB = firestore;
            
            // Test direct write to Firestore
            console.log("Testing direct Firestore write...");
            firestore.collection("_test").doc("init_test").set({
              timestamp: new Date().toISOString(),
              message: "Direct write test"
            }).then(() => {
              console.log("✅ Direct Firestore write test succeeded!");
            }).catch(err => {
              console.error("❌ Direct Firestore write test failed:", err);
            });
            
            resolve(firebaseApp);
          } catch (error) {
            console.error("Error initializing Firebase app:", error);
            reject(error);
          }
        } else if (checkCount > 20) { // Wait up to 10 seconds (20 * 500ms)
          clearInterval(checkInterval);
          const err = new Error("Firebase SDK not loaded after timeout");
          console.error(err);
          reject(err);
        }
      }, 500);
    }
  });
}

// Export as an async function that resolves with the Firebase app
export const firebaseAppPromise = initializeFirebase();

// Also export a direct access to the app for compatibility with existing code
// (This might be null initially and will be populated once initialized)
let firebaseApp = null;
firebaseAppPromise.then(app => {
  firebaseApp = app;
}).catch(err => {
  console.error("Failed to initialize Firebase:", err);
});

export { firebaseApp };
