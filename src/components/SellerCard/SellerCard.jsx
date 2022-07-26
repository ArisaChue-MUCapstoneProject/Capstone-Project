import * as React from "react"
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
            <p>{props.user.data.email}</p>
            <div className="seller-card-grid">
                {
                    props.user.data.sale.map((item) => (
                        
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
