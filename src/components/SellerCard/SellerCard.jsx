import * as React from "react"
import { kmToMiles } from "../../utils/distance"
import "./SellerCard.css"

export default function SellerCard(props) {
    // unit enum 
    const UNIT_TYPE = Object.freeze({
        VOLUME: 1,
        WEIGHT: 0,
        UNKNOWN: -1
    })

    return (
        <div className="seller-card">
            <p>{props.user.account.data.email}</p>
            <p>Distance Away: {props.user.distance ? props.isMetric ? `${props.user.distance} km` : `${kmToMiles(props.user.distance)} mi` : "not found" }</p>
            <div className="seller-card-grid">
                {
                    props.user.account.data.sale.map((item) => (
                        
                        <div key={item.name} className="item-sell-card">
                            <p>{item.name}</p>
                            <p>{props.getUnits(item, props.isMetric)}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
