import * as React from "react"
import { Form, Row, Col, Button, Alert } from "react-bootstrap" 
import { MERCH_TYPE } from "../../utils/conversion"
import "./MerchCard.css"

export default function MerchCard(props) {

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
