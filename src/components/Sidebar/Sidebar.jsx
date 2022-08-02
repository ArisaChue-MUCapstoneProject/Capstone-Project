import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { Form, Row, Col, Button, Alert } from "react-bootstrap" 
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import arrow from "../../icons/arrow.png"
import MerchGrid from "../MerchGrid/MerchGrid"
import { MERCH_TYPE } from "../../utils/conversion"
import "./Sidebar.css"

export default function Sidebar(props) {
    const [isMetric, setIsMetric] = useState(true)

    if (props.isSidebarOpen && props.isLoading) {
        return <p>Loading</p>
    }

    const sidebarProperties = props.isSidebarOpen ? "sidebar open" : "sidebar"
    const buttonProperties = props.isSidebarOpen ? "toggle-button button-open" : "toggle-button"
    return (
        <div className={ sidebarProperties }>
            {props.isSidebarOpen
                ?   <div>
                        <button className={buttonProperties} onClick={props.handleOnSidebarToggle}>
                            <img className="arrow-img" src={ arrow } alt="arrow icon" />
                        </button>
                        <div className="sidebar-title">
                            <h1 className="heading">Dashboard</h1>
                            <div className="sidebar-switch">
                                <BootstrapSwitchButton
                                    checked={isMetric}
                                    onlabel="Metric"
                                    onstyle="success"
                                    offlabel="Customary"
                                    offstyle="warning"
                                    width={90}
                                    onChange={() => {setIsMetric(!isMetric)}}
                                />
                            </div>
                        </div>
                        <p className="sidebar-heading">Selling Right Now</p>
                            {props.userSale.length 
                                ? <MerchGrid content={props.userSale} type={MERCH_TYPE.ONSALE} isMetric={isMetric} handleSellItem={props.handleSellItem} handleRemoveSaleItem={props.handleRemoveSaleItem} />
                                : <p className="empty-message">Your market is empty. Add ingredients from your pantry below.</p>
                            }
                        <p className="sidebar-heading">Ingredients You Have</p>
                            {props.userProducts.length 
                                ?  <MerchGrid content={props.userProducts} type={MERCH_TYPE.INSTOCK} isMetric={isMetric} handleSellItem={props.handleSellItem} handleRemoveSaleItem={props.handleRemoveSaleItem} />
                                : <p className="empty-message">Your pantry is empty. Add more ingredients to your pantry.</p>
                            }
                        <p className="sidebar-heading">Ingredients You Want</p>
                            {props.userCart.length 
                                ? <MerchGrid content={props.userCart} type={MERCH_TYPE.WISHLIST} isMetric={isMetric} handleSellItem={props.handleSellItem} handleRemoveSaleItem={props.handleRemoveSaleItem} />
                                : <p className="empty-message">Your wishlist is empty. Add more ingredients to your shopping cart.</p>
                            }
                    </div>
                :   <button className={buttonProperties} onClick={props.handleOnSidebarToggle}>
                        <img className="arrow-img" src={ arrow }  alt="arrow icon" />
                    </button>
            }
        </div>
    )
}
