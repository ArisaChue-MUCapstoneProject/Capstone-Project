import * as React from "react"
import Avatar from '@mui/material/Avatar'
import { getUnits } from "../../utils/conversion"
import { kmToMiles } from "../../utils/distance"
import { stringAvatar, capitalizeName } from "../../utils/design"
import "./SellerCard.css"

export default function SellerCard(props) {

    return (
        <div className="seller-card">
            <div className="seller-heading">
                <Avatar {...stringAvatar(props.user.account.data.name)} />
                <div className="seller-info">
                    <div>
                        <p id="seller-name">{capitalizeName(props.user.account.data.name)}</p>
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
                            <p id="item-amount">{getUnits(item, props.isMetric)}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
