import * as React from "react"
import Avatar from '@mui/material/Avatar';
import { kmToMiles } from "../../utils/distance"
import { stringAvatar } from "../../utils/design"
import "./SellerCard.css"

export default function SellerCard(props) {

    return (
        <div className="seller-card">
            <div className="seller-heading">
                <Avatar {...stringAvatar('Arisa Chue')} />
                <div className="seller-info">
                    <div>
                        <p id="seller-name">Preeti Nag</p>
                        <p id="seller-email">{props.user.account.data.email}</p>
                    </div>
                    <p id="seller-dis">{props.user.distance ? props.isMetric ? `${props.user.distance} km` : `${kmToMiles(props.user.distance)} mi` : "N/A" } away</p>
                </div>
            </div>
            <div className="seller-card-grid">
                {
                    props.user.account.data.sale.map((item, indx) => (
                        
                        <div key={item.name} className={`item-sell-card c${indx%3}`}>
                            <p id="item-name">{item.name.substring(0, 1).toUpperCase()+item.name.substring(1)}</p>
                            <p id="item-amount">{props.getUnits(item, props.isMetric)}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
