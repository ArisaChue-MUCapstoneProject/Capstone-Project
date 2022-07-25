import * as React from "react"
import { metricToCustomary } from "../../utils/conversion"
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
      <p className="product-name">{props.name}</p>
      <p className="product-quantity">{quantityWithUnits}</p>
      <p className="product-unit">{unit}</p>
      <button className="product-button" onClick={() => props.handleProductQuantity(props.name, props.operations.Add)}>+</button>
      <button className="product-button" onClick={() => props.handleProductQuantity(props.name, props.operations.Subtract)}>-</button>
      <button className="product-remove" onClick={() => props.handleProductQuantity(props.name, props.operations.Erase)}>*</button>
    </div>
  )
}
