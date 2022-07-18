import Navbar from "../Navbar/Navbar"
import SignUp from "../SignUp/SignUp"
import LogIn from "../LogIn/LogIn"
import ForgotPass from "../ForgotPass/ForgotPass"
import PrivateRoute from "../PrivateRoute/PrivateRoute"
import Profile from "../Profile/Profile"
import UpdateProfile from "../UpdateProfile/UpdateProfile"
import Recipes from "../Recipes/Recipes"
import Pantry from "../Pantry/Pantry"
import ShoppingCart from "../ShoppingCart/ShoppingCart"
import { AuthProvider } from "../../contexts/AuthContext";
import { db } from "../../firebase"
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import { collection, onSnapshot } from "firebase/firestore"

export default function App() {
  // state variables
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // listen for realtime updates and update users
  useEffect(() => {
    const userCollectionRef = collection(db, "users")
    const unsubscribe = onSnapshot(userCollectionRef, snapshot => {
      setUsers(snapshot.docs.map(doc => ({
        uid: doc.id,
        data: doc.data()
      })))
      setIsLoading(false)
    })

    return () => {
        unsubscribe()
    }
  }, [])



  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <main>
            <Navbar />
            <Routes>
              <Route path="/signup" element={<SignUp />}/>
              <Route path="/login" element={<LogIn />}/>
              <Route path="/forgot-password" element={<ForgotPass />}/>
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>}/>
              <Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>}/>
              <Route path="/recipes" element={<PrivateRoute><Recipes users={users} isLoading={isLoading}/></PrivateRoute>}/>
              <Route path="/pantry" element={<PrivateRoute><Pantry setProducts={setProducts} users={users} isLoading={isLoading}/></PrivateRoute>}/>
              <Route path="/shoppingcart" element={<PrivateRoute><ShoppingCart /></PrivateRoute>}/>
            </Routes>
          </main>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
