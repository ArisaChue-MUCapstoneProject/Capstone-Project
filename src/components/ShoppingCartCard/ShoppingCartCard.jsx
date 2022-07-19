import * as React from "react"
import "./ShoppingCartCard.css"

export default function ShoppingCartCard(props) {
  
  return (
    <div className="cart-card">
      <p className="cart-name">{props.name}</p>
      <p className="cart-quantity">{props.quantity}</p>
      <button className="cart-button" onClick={() => props.handleCartQuantity(props.name, props.operations.Add)}>+</button>
      <button className="cart-button" onClick={() => props.handleCartQuantity(props.name, props.operations.Subtract)}>-</button>
      <button className="cart-button" onClick={() => props.handleCartQuantity(props.name, props.operations.Erase)}>*</button>
    </div>
  )
}
