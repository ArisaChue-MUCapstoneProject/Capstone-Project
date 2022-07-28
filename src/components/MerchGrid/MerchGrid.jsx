import * as React from "react"
import MerchCard from "../MerchCard/MerchCard"
import { MERCH_TYPE } from "../../utils/conversion"
import "./MerchGrid.css"

export default function MerchGrid(props) {

    return (
        <div className="merch-grid">
            {props.type == MERCH_TYPE.INSTOCK
                // only display products that user has and not on sale (or will be duplicate with selling board)
                ?   props.content.map((item) => (
                        !item.onSale && <MerchCard key={item.name} item={item} type={props.type} isMetric={props.isMetric} handleSellItem={props.handleSellItem} handleRemoveSaleItem={props.handleRemoveSaleItem} getUnits={props.getUnits}/>
                    ))
                :   props.content.map((item) => (
                        <MerchCard key={item.name} item={item} type={props.type} isMetric={props.isMetric} handleSellItem={props.handleSellItem} handleRemoveSaleItem={props.handleRemoveSaleItem} getUnits={props.getUnits}/>
                    ))
            }
        </div>
        
    )
}
