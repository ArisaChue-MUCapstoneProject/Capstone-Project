import * as React from "react"
import { useState, useEffect } from "react"
import Sidebar from "../Sidebar/Sidebar"
import { Alert } from "react-bootstrap" 
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase"
import { useAuth } from "../../contexts/AuthContext"
import "./MarketPlace.css"

export default function MarketPlace(props) {
    // get user data from the database
    const { currentUser } = useAuth()
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isUserInfoLoading, setIsUserInfoLoading] = useState(true)
    const [userProducts, setUserProducts] = useState([])
    const [userCart, setUserCart] = useState([])
    const [userSale, setUserSale] = useState([])
    const [error, setError] = useState("")

    function clearError() {
        setError("")
    }

    // update user data once page loads
    useEffect(() => {
        if (!props.isLoading) {
            const userInfo = props.users.find(u => u.uid === currentUser.uid)
            userInfo.data.products && setUserProducts(userInfo.data.products)
            userInfo.data.cart && setUserCart(userInfo.data.cart)
            userInfo.data.sale && setUserSale(userInfo.data.sale)
            setIsUserInfoLoading(false)
        }
    }, [props.isLoading])

    // update products state
    useEffect(() => {
        // update products in the database
        if (!props.isLoading && userProducts) {
        const docRef = doc(db, "users", currentUser.uid)
        updateDoc(docRef, { products: userProducts })
            .catch(error => {
            setError(error.message)
        })
        }
    }, [userProducts])

    // update sale state
    useEffect(() => {
        // update products on sale in the database
        if (!props.isLoading && userSale) {
        const docRef = doc(db, "users", currentUser.uid)
        updateDoc(docRef, { sale: userSale })
            .catch(error => {
            setError(error.message)
        })
        }
    }, [userSale])

    // open and close sidebar
    const handleOnSidebarToggle = () => {
        if(isSidebarOpen) {
            setIsSidebarOpen(false)
        } else {
            setIsSidebarOpen(true)
        }
    }

    // add item onto user's selling board
    const handleSellItem = (item) => {
        clearError()
        let itemIndex = userProducts.findIndex(prod => prod == item)
        if (itemIndex == -1) {
            setError("cannot sell item since it does not exist")
        } else {
            let newProducts = [...userProducts]
            // records that product is on sale
            newProducts[itemIndex].onSale = true
            const newItem = {...newProducts[itemIndex]}
            let newSale = [...userSale]
            newSale.push(newItem)
            setUserSale(newSale)
            setUserProducts(newProducts)
        }
    }

    // remove item from user's selling board
    const handleRemoveSaleItem = (item) => {
        clearError()
        let itemSaleIndex = userSale.findIndex(prod => prod.name == item.name)
        let itemProductsIndex = userProducts.findIndex(prod => prod.name == item.name)
        if (itemSaleIndex == -1 || itemProductsIndex == -1) {
            setError("cannot remove item since it does not exist")
        } else {
            let newSale = [...userSale]
            newSale.splice(itemSaleIndex, 1)
            setUserSale(newSale)
            let newProducts = [...userProducts]
            // records that product is no longer on sale
            newProducts[itemProductsIndex].onSale = false
            setUserProducts(newProducts)
        }
    }

    return (
        <div className="marketplace">
            {props.isLoading
               ? <>
                    <Sidebar isLoading={isUserInfoLoading} isSidebarOpen={isSidebarOpen} handleOnSidebarToggle={handleOnSidebarToggle} userSale={userSale} userProducts={userProducts} userCart={userCart} handleSellItem={handleSellItem} handleRemoveSaleItem={handleRemoveSaleItem}/>
                    <div className="marketplace-content">
                        <p>Market Place</p>
                    </div>
                </>
                : <p>Loading</p>
            }
        </div>
    )
}
