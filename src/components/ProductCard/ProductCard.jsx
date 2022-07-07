import * as React from "react"
import "./ProductCard.css"

export default function Products(props) {
  const Operations = Object.freeze({
    Add: Symbol("add"),
    Subtract: Symbol("subtract"),
    Erase: Symbol("erase")
  })

  return (
    <div className="product-card">
      <p className="product-name">{props.name}</p>
      <p className="product-quantity">{props.quantity}</p>
      <button className="product-button" onClick={() => props.handleProductQuantity(props.name, Operations.Add)}>+</button>
      <button className="product-button" onClick={() => props.handleProductQuantity(props.name, Operations.Subtract)}>-</button>
      <button className="product-remove" onClick={() => props.handleProductQuantity(props.name, Operations.Erase)}>*</button>
    </div>
  )
}
