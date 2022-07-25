import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { Form, Row, Col, Button, Alert } from "react-bootstrap" 
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import arrow from "../../icons/arrow.png"
import MerchGrid from "../MerchGrid/MerchGrid"
import "./Sidebar.css"

export default function Sidebar(props) {
    const [isMetric, setIsMetric] = useState(true)

    if (props.isSidebarOpen && props.isLoading) {
        return <p>Loading</p>
    }
    // merch enum 
    const MERCH_TYPE = Object.freeze({
        ONSALE: 1,
        INSTOCK: 0,
        WISHLIST: -1
    })

    const sidebarProperties = props.isSidebarOpen ? "sidebar open" : "sidebar"
    const buttonProperties = props.isSidebarOpen ? "toggle-button button-open" : "toggle-button"
    return (
        <div className={ sidebarProperties }>
            {props.isSidebarOpen
                ?   <div>
                        <button className={buttonProperties} onClick={props.handleOnSidebarToggle}>
                            <img className="arrow-img" src={ arrow } alt="arrow icon" />
                        </button>
                        <BootstrapSwitchButton
                            checked={isMetric}
                            onlabel="Metric"
                            onstyle="primary"
                            offlabel="Customary"
                            offstyle="info"
                            width={100}
                            onChange={() => {setIsMetric(!isMetric)}}
                        />
                        <p>Selling Right Now</p>
                            {props.userSale.length 
                                ? <MerchGrid content={props.userSale} type={MERCH_TYPE.ONSALE} isMetric={isMetric} handleSellItem={props.handleSellItem} handleRemoveSaleItem={props.handleRemoveSaleItem}/>
                                : <p>Your market is empty. Add ingredients from your pantry below.</p>
                            }
                        <p>Ingredients You Have</p>
                            {props.userProducts.length 
                                ?  <MerchGrid content={props.userProducts} type={MERCH_TYPE.INSTOCK} isMetric={isMetric} handleSellItem={props.handleSellItem} handleRemoveSaleItem={props.handleRemoveSaleItem}/>
                                : <p>Your pantry is empty. Add more ingredients to your pantry.</p>
                            }
                        <p>Ingredients You Want</p>
                            {props.userCart.length 
                                ? <MerchGrid content={props.userCart} type={MERCH_TYPE.WISHLIST} isMetric={isMetric} handleSellItem={props.handleSellItem} handleRemoveSaleItem={props.handleRemoveSaleItem}/>
                                : <p>Your wishlist is empty. Add more ingredients to your shopping cart.</p>
                            }
                    </div>
                :   <button className={buttonProperties} onClick={props.handleOnSidebarToggle}>
                        <img className="arrow-img" src={ arrow }  alt="arrow icon" />
                    </button>
            }
        </div>
    )
}
