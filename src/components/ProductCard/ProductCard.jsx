import * as React from "react"
import { metricToCustomary } from "../../utils/conversion"
import { Button } from "react-bootstrap" 
import { AiOutlinePlus, AiOutlineMinus, AiOutlineClose } from 'react-icons/ai'
import { GiKnifeFork } from 'react-icons/gi'
import "./ProductCard.css"

export default function Products(props) {
  const quantityWithUnits = props.isMetric ? props.quantity : metricToCustomary(props.quantity, props.unitType)
  var unit
  if (props.unitType == 1) {
    unit = props.isMetric ? "milliliters" : "cups"
  } else if (props.unitType == 0) {
    unit = props.isMetric ? "grams" : "ounces"
  } else {
    unit = "count"
  }
  
  return (
    <div className="product-card">
      <div className="product-content">
        <div className="product-name-container">
          <div className="bullet-icon">
            <GiKnifeFork />
          </div>
          <p className="product-name">{props.name.substring(0, 1).toUpperCase() + props.name.substring(1).toLowerCase()}</p>
        </div>
        <div className="product-value">
          <Button className="my-product-button" onClick={() => props.handleProductQuantity(props.name, props.operations.Add)}><AiOutlinePlus /></Button>
          <div className="product-value-inner">
            <p className="product-quantity">{quantityWithUnits}</p>
            <p className="product-unit">{unit}</p>
          </div>
          <Button className="my-product-button" onClick={() => props.handleProductQuantity(props.name, props.operations.Subtract)}><AiOutlineMinus /></Button>
        </div>
      </div>
      <Button className="product-remove my-product-button" onClick={() => props.handleProductQuantity(props.name, props.operations.Erase)}><AiOutlineClose /></Button>
    </div>
  )
}
