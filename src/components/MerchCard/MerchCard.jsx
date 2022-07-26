import * as React from "react"
import { Form, Row, Col, Button, Alert } from "react-bootstrap" 
import { metricToCustomary } from "../../utils/conversion"
import "./MerchCard.css"

export default function MerchCard(props) {
    // merch enum 
    const MERCH_TYPE = Object.freeze({
        ONSALE: 1,
        INSTOCK: 0,
        WISHLIST: -1
    })

    return (
        <div className="merchcard">
            <p>{props.item.name}</p>
            <p>{props.getUnits(props.item, props.isMetric)}</p>
            {props.type == MERCH_TYPE.INSTOCK &&
               <Button onClick={() => props.handleSellItem(props.item)}>Sell</Button> 
            }
            {props.type == MERCH_TYPE.ONSALE &&
               <Button onClick={() => props.handleRemoveSaleItem(props.item)}>Remove</Button> 
            }
        </div>
    )
}
