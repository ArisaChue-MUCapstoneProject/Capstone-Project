import * as React from "react"
import { Form, Row, Col, Button, Alert } from "react-bootstrap" 
import { metricToCustomary } from "../../utils/conversion"
import "./MerchCard.css"

export default function MerchCard(props) {
    // unit enum 
    const UNIT_TYPE = Object.freeze({
        VOLUME: 1,
        WEIGHT: 0,
        UNKNOWN: -1
    })
    // merch enum 
    const MERCH_TYPE = Object.freeze({
        ONSALE: 1,
        INSTOCK: 0,
        WISHLIST: -1
    })
    const quantityWithUnits = props.isMetric ? props.item.quantity : metricToCustomary(props.item.quantity, props.item.unitType)
    var unit
    if (props.item.unitType == UNIT_TYPE.VOLUME) {
        unit = props.isMetric ? "milliliters" : "cups"
    } else if (props.item.unitType == UNIT_TYPE.WEIGHT) {
        unit = props.isMetric ? "grams" : "ounces"
    } else {
        unit = "count"
    }
    return (
        <div className="merchcard">
            <p>{props.item.name}</p>
            <p>{quantityWithUnits}</p>
            <p>{unit}</p>
            {props.type == MERCH_TYPE.INSTOCK &&
               <Button onClick={() => props.handleSellItem(props.item)}>Sell</Button> 
            }
            {props.type == MERCH_TYPE.ONSALE &&
               <Button onClick={() => props.handleRemoveSaleItem(props.item)}>Remove</Button> 
            }
        </div>
    )
}
