import * as React from "react"
import { metricToCustomary, getUnits } from "../../utils/conversion"
import { Button } from "react-bootstrap" 
import { AiOutlinePlus, AiOutlineMinus, AiOutlineClose } from 'react-icons/ai'
import { GiFruitBowl } from 'react-icons/gi'
import "./ProductCard.css"

export default function Products(props) {
  
  return (
    <div className="product-card">
      <div className="product-content">
        <div className="product-name-container">
          <div className="product-icon">
            <GiFruitBowl className="product-svg" />
          </div>
          <p className="product-name">{props.item.name.substring(0, 1).toUpperCase() + props.item.name.substring(1).toLowerCase()}</p>
        </div>
        <div className="product-value">
          <Button className="my-product-button" onClick={() => props.handleProductQuantity(props.item.name, props.operations.Add)}><AiOutlinePlus /></Button>
          <div className="product-value-inner">
            <p className="product-quantity">{getUnits(props.item, props.isMetric)}</p>
          </div>
          <Button className="my-product-button" onClick={() => props.handleProductQuantity(props.item.name, props.operations.Subtract)}><AiOutlineMinus /></Button>
        </div>
      </div>
      <Button className="product-remove my-product-button" onClick={() => props.handleProductQuantity(props.item.name, props.operations.Erase)}><AiOutlineClose /></Button>
    </div>
  )
}
