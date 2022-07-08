import * as React from "react"
import { Form, Row, Col, Button } from "react-bootstrap" 
import "bootstrap/dist/css/bootstrap.min.css";

import ProductCard from "../ProductCard/ProductCard"
import "./Pantry.css"

export default function Pantry(props) {
    var products = props.products
  return (
    <div className="pantry">
        <h2 className="pantry-heading">Products</h2>
        <Form className="product-form">
          <Row>
            <Col xs={7}>
              <Form.Group className="mb-3" controlId="formGroupName">
                <Form.Label>Product name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" name="name" value={props.productForm.name} onChange={props.handleOnProductFormChange}/>
              </Form.Group>
            </Col>
            <Col xs={3}>
              <Form.Group className="mb-3" controlId="formGroupNumber">
                <Form.Label>Quantity</Form.Label>
                <Form.Control type="number" placeholder="Enter number" name="quantity" value={props.productForm.quantity} onChange={props.handleOnProductFormChange}/>
              </Form.Group>
            </Col>
            <Col className="product-submit">
              <Button variant="primary" onClick={props.handleOnSubmitProductForm}>Submit</Button>
            </Col>
          </Row>
        </Form>
    {
      products.map((product) => (
        <ProductCard key={product.name} name={product.name} quantity={product.quantity} operations={props.operations} handleProductQuantity={props.handleProductQuantity}/>
      ))
    }
    </div>
  )
}
