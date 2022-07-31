import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { Form, Row, Col, Button, Alert } from "react-bootstrap" 
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { doc, updateDoc } from "firebase/firestore"
import "bootstrap/dist/css/bootstrap.min.css";

import ProductCard from "../ProductCard/ProductCard"
import { useAuth } from "../../contexts/AuthContext"
import { units, basicUnits, convertToStandard, updateStandardAmount, isVolumeUnit, basicCategories } from "../../utils/conversion"
import { db } from "../../firebase"
import "./Pantry.css"

export default function Pantry(props) {
  // get user data from the database
  const { currentUser } = useAuth()

  // operations enum 
  const Operations = Object.freeze({
    Add: Symbol("add"),
    Subtract: Symbol("subtract"),
    Erase: Symbol("erase")
  })

  const basicProductForm = {
    name: "",
    quantity: ""
  }

  const [productForm, setProductForm] = useState(basicProductForm)
  const [userProducts, setUserProducts] = useState([])
  const [userProductsByCategory, setUserProductsByCategory] = useState({})
  const [curUnit, setCurUnit] = useState(basicUnits[0])
  const [curCategory, setCurCategory] = useState(basicCategories[0])
  const [isMetric, setIsMetric] = useState(true)
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(true)
  const [error, setError] = useState("")

  // update user data once page loads
  useEffect(() => {
    if (!props.isLoading) {
      var userInfo = props.users.find(u => u.uid === currentUser.uid)
      userInfo.data.products && setUserProducts(userInfo.data.products)
      setIsUserInfoLoading(false)
    }
  }, [props.isLoading])

  // separate products into categories once it loads
  useEffect(() => {
    if (!props.isLoading && !isUserInfoLoading) {
      let newCategories = {}
      userProducts.forEach((val) => {
        let curCat = val.category
        curCat in newCategories ? newCategories[curCat].push(val) : newCategories[curCat] = [val]
      })
      setUserProductsByCategory(newCategories)
    }
  }, [isUserInfoLoading, userProducts])
  
  // update products state
  useEffect(() => {
    // update products in the database
    if (!props.isLoading && userProducts) {
      const docRef = doc(db, "users", currentUser.uid)
      updateDoc(docRef, {products: userProducts})
        .catch(error => {
          setError(error.message)
      })
    }
  }, [userProducts])

  function clearError() {
    setError("")
  }

  // changes product item quantity based on button click
  const handleProductQuantity = (productName, operation) => {
    let itemIndex = userProducts.findIndex(item => item.name === productName)
    let newProducts = [...userProducts]
    clearError()

    // edit item quantity
    if (itemIndex === -1) {
      setError("item does not exist in your products")
    }
    else if (operation === Operations.Add) {
      newProducts[itemIndex].quantity += 1
    } 
    else if (operation === Operations.Subtract) {
      newProducts[itemIndex].quantity -= 1
      if (newProducts[itemIndex].quantity == 0) {
        newProducts.splice(itemIndex, 1)
      }
    } else if (operation === Operations.Erase) {
      newProducts.splice(itemIndex, 1)
    } else {
      setError("action could not be executed because operation does not exist")
    }

    setUserProducts(newProducts)
  }

  // adds new product item when submit button is clicked
  const handleOnSubmitProductForm = () => {
    // submitted info from form
    let itemName = productForm.name.toLowerCase()
    let itemIndex = userProducts.findIndex(item => item.name === itemName)

    let newProducts = [...userProducts]
    clearError()
    // add new item to products
    if (productForm.quantity < 1) {
      setError("Quantity must be positive whole number")
    }
    else if (itemIndex === -1) {
      // TODO: check if user filled entire form out
      // keep all database quantities to standard
      const unitType = isVolumeUnit(curUnit)
      const quantityAmount = convertToStandard(curUnit, Number(productForm.quantity))
      let newItem = {
        name: itemName,
        quantity: quantityAmount[1],
        unitType: unitType,
        category: curCategory
      }
      newProducts.push(newItem)
      setUserProducts(newProducts)
      setProductForm(basicProductForm)
      setCurUnit(basicUnits[0])
      setCurCategory(basicCategories[0])
    } else {
      // if user submitted an item that already exists, just change quantity
      const unitType = isVolumeUnit(curUnit)
      if (newProducts[itemIndex].unitType != unitType) {
        setError("please make sure measurement is correct")
      } else {
        const quantityAmount = convertToStandard(curUnit, Number(productForm.quantity))
        newProducts[itemIndex].quantity += quantityAmount[1]
        setUserProducts(newProducts)
      }
      setProductForm(basicProductForm)
      setCurUnit(basicUnits[0])
      setCurCategory(basicCategories[0])
    }
  }

  // when the inputs of products form changes
  const handleOnProductFormChange = (event) => {
    let key = event.target.name
    let val = event.target.value
    // deep copy of product form
    let newProductForm = {
      name: productForm.name,
      quantity: productForm.quantity
    }
    // update with the change (either item name or quantity)
    newProductForm[key] = val
    setProductForm(newProductForm)
  }

  const handleUnitChange = (event) => {
    setCurUnit(event.target.value)
  }

  const handleCategoryChange = (event) => {
    setCurCategory(event.target.value)
  }

  return (
    <div className="pantry">
      <h1 className="pantry-heading heading">Products</h1>
      <p className="pantry-heading-sub">Tracking list of products you have at home, so you won't have to remember them.</p>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="pantry-content">
            <div className="pantry-categories">
              <p className="category-select">Categories:</p>
              {
                basicCategories.map((category, indx) => (
                  indx > 0 && <a key={category} className="category-sub-select" href={`#${category}-heading`}>{category.substring(0,1).toUpperCase()+category.substring(1).toLowerCase()}</a>
                ))
              }
            </div>
          {userProducts && userProductsByCategory &&
          <div className="products-list">
            {
              basicCategories.map((category, indx) => (
                indx > 0 &&
                  <div key={category}>
                    {userProductsByCategory[category] &&
                      <div>
                        <h4 className="category-headings" id={`${category}-heading`}>{category.substring(0,1).toUpperCase()+category.substring(1).toLowerCase()}</h4>
                        {
                          userProductsByCategory[category].map((product) => (
                            <ProductCard key={product.name} name={product.name} quantity={product.quantity} unitType={product.unitType} isMetric={isMetric} operations={Operations} handleProductQuantity={handleProductQuantity}/>
                          ))
                        }
                      </div>
                    }
                </div>
                
              ))
            }
          </div>
          }
          <div className="pantry-side-content">
            <div className="pantry-switch">
              <p>Unit Display:</p>
              <BootstrapSwitchButton
                  checked={isMetric}
                  onlabel="Metric"
                  onstyle="primary"
                  offlabel="Customary"
                  offstyle="info"
                  width={150}
                  onChange={() => {setIsMetric(!isMetric)}}
              />
            </div>
            <Form className="product-form">
              <Col>
                <Row>
                  <Form.Group className="mb-3" controlId="formGroupName">
                    <Form.Label>Product name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" name="name" value={productForm.name} onChange={handleOnProductFormChange}/>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mb-3" controlId="formGroupNumber">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control type="number" placeholder="Enter number" name="quantity" value={productForm.quantity} onChange={handleOnProductFormChange}/>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mb-3" controlId="formGroupNumber">
                    <Form.Label>Unit</Form.Label>
                      <Form.Select value={curUnit} onChange={handleUnitChange}>
                        {basicUnits.map((val, ind) => (
                          <option key={val} value={val} disabled={ind == 0} hidden={ind == 0}>{val}</option>
                        ))}
                      </Form.Select>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mb-3" controlId="formGroupNumber">
                    <Form.Label>Category</Form.Label>
                      <Form.Select value={curCategory} onChange={handleCategoryChange}>
                        {basicCategories.map((val, ind) => (
                          <option key={val} value={val} disabled={ind == 0} hidden={ind == 0}>{val}</option>
                        ))}
                      </Form.Select>
                  </Form.Group>
                </Row>
                <Row className="product-submit">
                  <Button variant="primary" onClick={handleOnSubmitProductForm}>Submit</Button>
                </Row>
              </Col>
            </Form>
          </div>
        </div>
    </div>
  )
}
