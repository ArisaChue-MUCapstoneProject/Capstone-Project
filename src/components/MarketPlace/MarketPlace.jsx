import * as React from "react"
import { useState, useEffect } from "react"
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import Sidebar from "../Sidebar/Sidebar"
import SellerCard from "../SellerCard/SellerCard"
import { Alert } from "react-bootstrap" 
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase"
import { useAuth } from "../../contexts/AuthContext"
import { metricToCustomary } from "../../utils/conversion"
import "./MarketPlace.css"

export default function MarketPlace(props) {
    // unit enum 
    const UNIT_TYPE = Object.freeze({
        VOLUME: 1,
        WEIGHT: 0,
        UNKNOWN: -1
    })
    // get user data from the database
    const { currentUser } = useAuth()
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isUserInfoLoading, setIsUserInfoLoading] = useState(true)
    const [isMetric, setIsMetric] = useState(true)
    const [userProducts, setUserProducts] = useState([])
    const [userCart, setUserCart] = useState([])
    const [userSale, setUserSale] = useState([])
    const [sellers, setSellers] = useState([])
    const [error, setError] = useState("")

    function clearError() {
        setError("")
    }

    // update user data once page loads
    useEffect(() => {
        if (!props.isLoading) {
            console.log(props.users)
            const userInfo = props.users.find(u => u.uid === currentUser.uid)
            userInfo.data.products && setUserProducts(userInfo.data.products)
            userInfo.data.cart && setUserCart(userInfo.data.cart)
            userInfo.data.sale && setUserSale(userInfo.data.sale)
            setSellers(props.users.filter((user) => {return user.uid != currentUser.uid && user.data.sale}))
            setIsUserInfoLoading(false)
        }
    }, [props.isLoading])

    // update database
    useEffect(() => {
        // keep updating the selling board whenever products change
        const newSale = userProducts.filter((item) => {
            return item.onSale
        })
        setUserSale(newSale)

        // update products in the database
        if (!props.isLoading && userProducts) {
        const docRef = doc(db, "users", currentUser.uid)
        updateDoc(docRef, { products: userProducts })
            .catch(error => {
            setError(error.message)
        })
        }
    }, [userProducts])

    // update database
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
            setUserProducts(newProducts)
        }
    }

    // remove item from user's selling board
    const handleRemoveSaleItem = (item) => {
        clearError()
        let itemProductsIndex = userProducts.findIndex(prod => prod.name == item.name)
        if (itemProductsIndex == -1) {
            setError("cannot remove item since it does not exist")
        } else {
            let newProducts = [...userProducts]
            // records that product is no longer on sale
            newProducts[itemProductsIndex].onSale = false
            setUserProducts(newProducts)
        }
    }

    const getUnits = (item, isMetric) => {
        const quantityWithUnits = isMetric ? item.quantity : metricToCustomary(item.quantity, item.unitType)
        var unit
        if (item.unitType == UNIT_TYPE.VOLUME) {
            unit = isMetric ? "milliliters" : "cups"
        } else if (item.unitType == UNIT_TYPE.WEIGHT) {
            unit = isMetric ? "grams" : "ounces"
        } else {
            unit = "counts"
        }
        return `${quantityWithUnits} ${unit}`
    }

    return (
        <div className="marketplace">
            {!props.isLoading
               ? <>
                    <Sidebar isLoading={isUserInfoLoading} isSidebarOpen={isSidebarOpen} handleOnSidebarToggle={handleOnSidebarToggle} userSale={userSale} userProducts={userProducts} userCart={userCart} handleSellItem={handleSellItem} handleRemoveSaleItem={handleRemoveSaleItem} getUnits={getUnits}/>
                    <BootstrapSwitchButton
                        checked={isMetric}
                        onlabel="Metric"
                        onstyle="primary"
                        offlabel="Customary"
                        offstyle="info"
                        width={100}
                        onChange={() => {setIsMetric(!isMetric)}}
                    />
                    <div className="marketplace-sellers">
                        {sellers.length
                            ? props.users.map((user) => (
                                user.uid != currentUser.uid && user.data.sale && <SellerCard key={user.uid} user={user} getUnits={getUnits} isMetric={isMetric}/>
                            ))
                            : <p>No sellers yet</p>
                        }
                    </div>
                </>
                : <p>Loading</p>
            }
        </div>
    )
}
