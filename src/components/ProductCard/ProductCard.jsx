import * as React from "react"
import "./ProductCard.css"

export default function Products(props) {
  return (
    <div className="product-card">
      <p className="product-name">{props.name}</p>
      <p className="product-quantity">{props.quantity}</p>
      <button className="product-button" onClick={() => props.handleProductQuantity(props.name, "add")}>+</button>
      <button className="product-button" onClick={() => props.handleProductQuantity(props.name, "minus")}>-</button>
      <button className="product-remove" onClick={() => props.handleProductQuantity(props.name, "remove")}>*</button>
    </div>
  )
}
