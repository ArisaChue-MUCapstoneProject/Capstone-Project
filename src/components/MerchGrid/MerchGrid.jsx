import * as React from "react"
import MerchCard from "../MerchCard/MerchCard"
import "./MerchGrid.css"

export default function MerchGrid(props) {
    // merch enum 
    const MERCH_TYPE = Object.freeze({
        ONSALE: 1,
        INSTOCK: 0,
        WISHLIST: -1
    })
    return (
        <div className="merch-grid">
            {props.type == MERCH_TYPE.INSTOCK
                // only display products that user has and not on sale (or will be duplicate with selling board)
                ?   props.content.map((item) => (
                        !item.onSale && <MerchCard key={item.name} item={item} type={props.type} isMetric={props.isMetric} handleSellItem={props.handleSellItem} handleRemoveSaleItem={props.handleRemoveSaleItem}/>
                    ))
                :   props.content.map((item) => (
                        <MerchCard key={item.name} item={item} type={props.type} isMetric={props.isMetric} handleSellItem={props.handleSellItem} handleRemoveSaleItem={props.handleRemoveSaleItem}/>
                    ))
            }
        </div>
        
    )
}
