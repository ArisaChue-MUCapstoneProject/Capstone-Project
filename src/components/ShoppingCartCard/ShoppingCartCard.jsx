import * as React from "react"
import { Button } from "react-bootstrap" 
import { getUnits } from "../../utils/conversion"
import { AiOutlinePlus, AiOutlineMinus, AiOutlineClose } from 'react-icons/ai'
import { RiShoppingBasketLine } from 'react-icons/ri'
import "./ShoppingCartCard.css"

export default function ShoppingCartCard(props) {
  
  return (
    <div className="cart-card">
      <div className="cart-card-content">
        <div className="cart-card-name-container">
          <div className="cart-icon">
            <RiShoppingBasketLine className="cart-svg" />
          </div>
          <p className="cart-card-name">{props.item.name.substring(0, 1).toUpperCase() + props.item.name.substring(1).toLowerCase()}</p>
        </div>
        <div className="cart-card-value">
          <Button className="my-cart-button" onClick={() => props.handleCartQuantity(props.item.name, props.operations.Add)}><AiOutlinePlus /></Button>
          <p className="cart-card-quantity">{getUnits(props.item, props.isMetric)}</p>
          <Button className="my-cart-button" onClick={() => props.handleCartQuantity(props.item.name, props.operations.Subtract)}><AiOutlineMinus /></Button>
        </div>
      </div>
      <Button className="cart-remove my-cart-button" onClick={() => props.handleCartQuantity(props.item.name, props.operations.Erase)}><AiOutlineClose /></Button>
    </div>
  )
}
