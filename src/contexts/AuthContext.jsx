import React, { createContext, useContext, useState, useEffect } from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateEmail, updatePassword, onAuthStateChanged } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth } from "../firebase"
import { db } from "../firebase"

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        return signOut(auth)
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
    }

    function updateUserEmail(email) {
        return updateEmail(auth.currentUser, email)
    }

    function updateUserPassword(password) {
        return updatePassword(auth.currentUser, password)
    }

    // listen for realtime updates on current user that logged in/signed in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            setLoading(false)
        })

        return () => {
            unsubscribe()
        }
    }, [])

    // add new users into the database with doc id as their uid
    useEffect(() => {
        async function addUser() {
          try {
            const docRef = doc(db, "users", currentUser.uid)
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) {
                await setDoc(doc(db, "users", currentUser.uid), {
                    email: currentUser.email,
                    uid: currentUser.uid
                })
            } 
          } catch (error) {
            console.log(error)
          }
        }

        if (currentUser) {
          addUser()
        }
    }, [currentUser])

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        updateUserEmail,
        updateUserPassword
    }

    return (
        <AuthContext.Provider value={ value }>
        {!loading && children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}