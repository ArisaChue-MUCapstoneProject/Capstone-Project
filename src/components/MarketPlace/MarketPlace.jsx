import * as React from "react"
import { useState, useEffect } from "react"
import "./MarketPlace.css"
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import Slider from '@mui/material/Slider';
import Sidebar from "../Sidebar/Sidebar"
import SellerCard from "../SellerCard/SellerCard"
import { Alert } from "react-bootstrap" 
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase"
import { useAuth } from "../../contexts/AuthContext"
import { metricToCustomary } from "../../utils/conversion"
import { getDistance, kmToMiles } from "../../utils/distance"


export default function MarketPlace(props) {
    // unit enum 
    const UNIT_TYPE = Object.freeze({
        VOLUME: 1,
        WEIGHT: 0,
        UNKNOWN: -1,
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
    const [userLocation, setUserLocation] = useState({})
    const [maxDis, setMaxDis] = useState(10)
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
            userInfo.data.location && setUserLocation(userInfo.data.location)
            setIsUserInfoLoading(false)
        }
    }, [props.isLoading])

    useEffect(() => {
        if (!isUserInfoLoading) {
            setSellers(getSellerOrder(props.users, maxDis))
        }
    }, [isUserInfoLoading, userCart, maxDis])

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

    const getSellerOrder = (curUsers, maxDistance) => {
        let sellerNumProducts = curUsers.map((user, indx) => {
            if (user.uid != currentUser.uid && user.data.sale) {
                let sellerCount = 0
                user.data.sale.forEach((item) => {
                    // TODO: better nlp algo to match names
                    if (userCart.find(prod => prod.name == item.name)) {
                        sellerCount += 1
                    }
                })
                const res = {
                    index: indx,
                    count: sellerCount
                }
                return res
            }
        }).filter(val => val)
        sellerNumProducts.sort((seller1, seller2) => {
            return seller2.count - seller1.count
        })
        // return seller order and distance to each seller
        const newOrder = sellerNumProducts.map((seller) => {
            var sellerInfo
            if (!userLocation || !curUsers[seller.index].data.location) {
                sellerInfo = {
                    account: curUsers[seller.index],
                    distance: null
                }
            } else {
                let dis = getDistance(userLocation.latitude, userLocation.longitude, curUsers[seller.index].data.location.latitude, curUsers[seller.index].data.location.longitude)
                if (isMetric && dis > maxDistance) {
                    return
                }
                else if (!isMetric && kmToMiles(dis) > maxDistance) {
                    return
                }
                sellerInfo = {
                    account: curUsers[seller.index],
                    distance: Number(dis).toFixed(2)
                }
            }
            return sellerInfo
        }).filter(val => val)
        return newOrder
    }

    const handleDistanceFilterChange = (event) => {
        setMaxDis(event.target.value)
    }

    return (
        <div className="marketplace">
            {!props.isLoading && !isUserInfoLoading
               ? <>
                    <Sidebar isLoading={isUserInfoLoading} isSidebarOpen={isSidebarOpen} handleOnSidebarToggle={handleOnSidebarToggle} userSale={userSale} userProducts={userProducts} userCart={userCart} handleSellItem={handleSellItem} handleRemoveSaleItem={handleRemoveSaleItem} getUnits={getUnits}/>
                    <div className="marketplace-content">
                        <BootstrapSwitchButton
                            checked={isMetric}
                            onlabel="Metric"
                            onstyle="primary"
                            offlabel="Customary"
                            offstyle="info"
                            width={100}
                            onChange={() => {setIsMetric(!isMetric)}}
                        />
                        <p>Maximum Distance from Sellers: ({isMetric ? "km" : "mi"})</p>
                        <Slider
                            aria-label="Always visible"
                            defaultValue={80}
                            value={maxDis}
                            valueLabelDisplay="on"
                            onChange={handleDistanceFilterChange}
                        />
                        <div className="marketplace-sellers">
                            {sellers.length
                                ? sellers.map((user) => (
                                    user.account.uid != currentUser.uid && user.account.data.sale && user.account.data.sale.length > 0 && <SellerCard key={user.account.uid} user={user} getUnits={getUnits} isMetric={isMetric}/>
                                ))
                                : <p>No sellers yet</p>
                            }
                        </div>
                    </div>
                </>
                : <p>Loading</p>
            }
        </div>
    )
}
