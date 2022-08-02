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
import { metricToCustomary, UNIT_TYPE } from "../../utils/conversion"
import { getDistance, kmToMiles } from "../../utils/distance"


export default function MarketPlace(props) {

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
    const [maxDis, setMaxDis] = useState(50)
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
        if (isSidebarOpen) {
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
            const newItem = { ...newProducts[itemIndex] }
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

    const getSellerOrder = (curUsers, maxDistance) => {
        // sellerNumProducts structure: {seller index in users, num of ingredients matching}
        let sellerNumProducts = curUsers.map((user, indx) => {
            if (user.uid != currentUser.uid && user.data.sale) {
                // get number of how many ingredients seller and user share
                let sellerCount = user.data.sale.filter((item) => {
                    return userCart.find(prod => prod.name == item.name)
                }).length
                const res = {
                    index: indx,
                    count: sellerCount
                }
                return res
            }
        }).filter(val => val)
        // sort descending order from max matching num to least
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
                    <Sidebar isLoading={isUserInfoLoading} isSidebarOpen={isSidebarOpen} handleOnSidebarToggle={handleOnSidebarToggle} userSale={userSale} userProducts={userProducts} userCart={userCart} handleSellItem={handleSellItem} handleRemoveSaleItem={handleRemoveSaleItem} />
                    <div className="marketplace-heading-container">
                        <h1 className="marketplace-heading">Marketplace</h1>
                        <p className="marketplace-heading-sub">Sellers near you, sorted by those who can best check off your grocery list to save you the extra trips.</p>
                    </div>
                    <div className="marketplace-content">
                            <div className="marketplace-sellers">
                                {sellers.length
                                    ? sellers.map((user) => (
                                        user.account.uid != currentUser.uid && user.account.data.sale && user.account.data.sale.length > 0 && <SellerCard key={user.account.uid} user={user} isMetric={isMetric} />
                                    ))
                                    : <p>No sellers yet</p>
                                }
                            </div>
                        <div className="marketplace-side-content">
                            <div className="marketplace-switch">
                                <p>Unit Display:</p>
                                <BootstrapSwitchButton
                                    checked={isMetric}
                                    onlabel="Metric"
                                    onstyle="primary"
                                    offlabel="Customary"
                                    offstyle="info"
                                    width={150}
                                    onChange={() => { setIsMetric(!isMetric) }}
                                />
                            </div>
                            <div className="marketplace-slider">
                                <p className="distance-heading">Maximum Distance from Sellers: <p id="distance" style={{ color: isMetric ? "#6b705c" : "#b2967d", fontWeight: "bold" }}>{maxDis} ({isMetric ? "km" : "mi"})</p></p>
                                <div id="slider">
                                    <Slider
                                        aria-label="Always visible"
                                        defaultValue={80}
                                        value={maxDis}
                                        size="small"
                                        sx={{
                                            color: isMetric ? "#6b705c" : "#b2967d",
                                        }}
                                        onChange={handleDistanceFilterChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                : <p>Loading</p>
            }
        </div>
    )
}
