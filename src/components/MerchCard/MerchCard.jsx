import * as React from "react"
import { Form, Row, Col, Button, Alert } from "react-bootstrap" 
import { MERCH_TYPE } from "../../utils/conversion"
import "./MerchCard.css"

export default function MerchCard(props) {

    return (
        <div className="merchcard">
            <p id="merch-name">{props.item.name.substring(0, 1).toUpperCase()+props.item.name.substring(1)}</p>
            <p id="merch-amount">{props.getUnits(props.item, props.isMetric)}</p>
            <div className="merch-button">
                {props.type == MERCH_TYPE.INSTOCK &&
                <Button variant="secondary" onClick={() => props.handleSellItem(props.item)}>Sell</Button> 
                }
                {props.type == MERCH_TYPE.ONSALE &&
                <Button variant="secondary" onClick={() => props.handleRemoveSaleItem(props.item)} className="my-btn">Keep</Button> 
                }
            </div>
        </div>
    )
}
