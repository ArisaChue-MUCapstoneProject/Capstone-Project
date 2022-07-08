import * as React from "react"
import "./ProductCard.css"

export default function Products(props) {
  
  return (
    <div className="product-card">
      <p className="product-name">{props.name}</p>
      <p className="product-quantity">{props.quantity}</p>
      <button className="product-button" onClick={() => props.handleProductQuantity(props.name, props.operations.Add)}>+</button>
      <button className="product-button" onClick={() => props.handleProductQuantity(props.name, props.operations.Subtract)}>-</button>
      <button className="product-remove" onClick={() => props.handleProductQuantity(props.name, props.operations.Erase)}>*</button>
    </div>
  )
}
