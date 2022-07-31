import * as React from "react"
import { getUnits } from "../../utils/conversion"
import "./ShoppingCartCard.css"

export default function ShoppingCartCard(props) {
  
  return (
    <div className="cart-card">
      <p className="cart-name">{props.item.name}</p>
      <p id="cart-quantity">{getUnits(props.item, props.isMetric)}</p>
      <button className="cart-button" onClick={() => props.handleCartQuantity(props.item.name, props.operations.Add)}>+</button>
      <button className="cart-button" onClick={() => props.handleCartQuantity(props.item.name, props.operations.Subtract)}>-</button>
      <button className="cart-button" onClick={() => props.handleCartQuantity(props.item.name, props.operations.Erase)}>*</button>
    </div>
  )
}
