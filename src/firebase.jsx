import { initializeApp } from "firebase/app"
// import "firebase/auth"
import { getAuth } from "firebase/auth"

const app = initializeApp({
    apiKey: "AIzaSyAdCvuzs3nWfmAlaJWPtiykMH9jMu4VLik",
    authDomain: "capstone-project-bfd9d.firebaseapp.com",
    projectId: "capstone-project-bfd9d",
    storageBucket: "capstone-project-bfd9d.appspot.com",
    messagingSenderId: "6267959779",
    appId: "1:6267959779:web:a25dab50d4e330f06a48d6",
    measurementId: "G-RKW8GBMFNP"
  })

export const auth = getAuth(app)
export default app