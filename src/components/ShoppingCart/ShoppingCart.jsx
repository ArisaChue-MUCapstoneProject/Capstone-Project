import * as React from "react"
import { useState, useEffect } from "react"
import { Form, Row, Col, Button, Alert } from "react-bootstrap"
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { doc, updateDoc } from "firebase/firestore"
import "bootstrap/dist/css/bootstrap.min.css";

import ShoppingCartCard from "../ShoppingCartCard/ShoppingCartCard"
import { useAuth } from "../../contexts/AuthContext"
import { db } from "../../firebase"
import { units, basicUnits, convertToStandard, updateStandardAmount, isVolumeUnit, basicCategories } from "../../utils/conversion"
import "./ShoppingCart.css"

export default function ShoppingCart(props) {
  // get user data from the database
  const { currentUser } = useAuth()

  //enum 
  const Operations = Object.freeze({
    Add: Symbol("add"),
    Subtract: Symbol("subtract"),
    Erase: Symbol("erase")
  })

  const basicShoppingForm = {
    name: "",
    quantity: ""
  }
  const [shoppingCartForm, setShoppingCartForm] = useState(basicShoppingForm)
  const [userCart, setUserCart] = useState([])
  const [userCartByCategory, setUserCartByCategory] = useState({})
  const [curUnit, setCurUnit] = useState(basicUnits[0])
  const [curCategory, setCurCategory] = useState(basicCategories[0])
  const [isMetric, setIsMetric] = useState(true)
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(true)
  const [error, setError] = useState("")

  // update user data once page loads
  useEffect(() => {
    if (!props.isLoading) {
      var userInfo = props.users.find(u => u.uid === currentUser.uid)
      userInfo.data.cart && setUserCart(userInfo.data.cart)
      setIsUserInfoLoading(false)
    }
  }, [props.isLoading])

  // separate products into categories once it loads
  useEffect(() => {
    if (!props.isLoading && !isUserInfoLoading) {
      let newCategories = {}
      userCart.forEach((val) => {
        let curCat = val.category
        curCat in newCategories ? newCategories[curCat].push(val) : newCategories[curCat] = [val]
      })
      setUserCartByCategory(newCategories)
    }
  }, [isUserInfoLoading, userCart])


  // update carts state
  useEffect(() => {
    // update carts in the database
    if (!props.isLoading && userCart) {
      const docRef = doc(db, "users", currentUser.uid)
      updateDoc(docRef, { cart: userCart })
        .catch(error => {
          setError(error.message)
        })
    }
  }, [userCart])

  function clearError() {
    setError("")
  }

  // changes shopping cart item quantity based on button click
  const handleCartQuantity = (itemName, operation) => {
    let itemIndex = userCart.findIndex(item => item.name === itemName)
    let newCart = userCart.map(i => ({ ...i }))
    clearError()

    // edit item quantity
    if (itemIndex === -1) {
      setError("item does not exist in your cart")
    }
    else if (operation === Operations.Add) {
      newCart[itemIndex].quantity += 1
    }
    else if (operation === Operations.Subtract) {
      newCart[itemIndex].quantity -= 1
      if (newCart[itemIndex].quantity == 0) {
        newCart.splice(itemIndex, 1)
      }
    } else if (operation === Operations.Erase) {
      newCart.splice(itemIndex, 1)
    } else {
      setError("action could not be executed because operation does not exist")
    }

    setUserCart(newCart)
  }

  // adds new shopping cart item when submit button is clicked
  const handleOnSubmitCartForm = () => {
    // submitted info from form
    let itemName = shoppingCartForm.name.toLowerCase()
    let itemIndex = userCart.findIndex(item => item.name === itemName)

    let newCart = userCart.map(i => ({ ...i }))
    clearError()
    // add new item to cart
    if (shoppingCartForm.quantity < 1) {
      setError("Quantity must be positive whole number")
    }
    else if (itemIndex === -1) {
      // TODO: check if user filled entire form out
      // keep all database quantities to standard
      const unitType = isVolumeUnit(curUnit)
      const quantityAmount = convertToStandard(curUnit, Number(shoppingCartForm.quantity))
      let newItem = {
        name: itemName,
        quantity: quantityAmount[1],
        unitType: unitType,
        category: curCategory
      }
      newCart.push(newItem)
      setShoppingCartForm(basicShoppingForm)
      setUserCart(newCart)
      setCurUnit(basicUnits[0])
      setCurCategory(basicCategories[0])
    } else {
      // if user submitted an item that already exists, just change quantity
      const unitType = isVolumeUnit(curUnit)
      if (newCart[itemIndex].unitType != unitType) {
        setError("please make sure measurement is correct")
      } else {
        const quantityAmount = convertToStandard(curUnit, Number(shoppingCartForm.quantity))
        newCart[itemIndex].quantity += quantityAmount[1]
        setUserCart(newCart)
      }
      setShoppingCartForm(basicShoppingForm)
      setCurUnit(basicUnits[0])
      setCurCategory(basicCategories[0])
    }
  }

  // when the inputs of products form changes
  const handleOnCartFormChange = (event) => {
    let key = event.target.name
    let val = event.target.value
    // deep copy of product form
    let newShoppingCartForm = {
      name: shoppingCartForm.name,
      quantity: shoppingCartForm.quantity
    }
    // update with the change (either item name or quantity)
    newShoppingCartForm[key] = val
    setShoppingCartForm(newShoppingCartForm)
  }

  const handleUnitChange = (event) => {
    setCurUnit(event.target.value)
  }

  const handleCategoryChange = (event) => {
    setCurCategory(event.target.value)
  }

  return (
    <div className="shopping-cart">
      {error && <Alert variant="danger">{error}</Alert>}
      <h1 className="cart-heading heading">Grocery List</h1>
      <p className="cart-heading-sub">Tracking list of products you need, so your next grocery trip can be care-free.</p>
      <div className="cart-content">
        <div className="cart-categories">
          <p className="category-select">Categories:</p>
          {
            basicCategories.map((category, indx) => (
              indx > 0 && <a key={category} className="category-sub-select" href={`#${category}-heading`}>{category.substring(0, 1).toUpperCase() + category.substring(1).toLowerCase()}</a>
            ))
          }
        </div>
        <div className="cart-list-container">
        {userCart && userCartByCategory &&
          <div className="cart-list">
            {
              basicCategories.map((category, indx) => (
                indx > 0 &&
                <div key={category}>
                  {userCartByCategory[category] &&
                    <div>
                      <h4 className="category-headings" id={`${category}-heading`}>{category.substring(0, 1).toUpperCase() + category.substring(1).toLowerCase()}</h4>
                      {
                        userCartByCategory[category].map((cart) => (
                          <ShoppingCartCard key={cart.name} item={cart} isMetric={isMetric} operations={Operations} handleCartQuantity={handleCartQuantity} />
                        ))
                      }
                    </div>
                  }
                </div>

              ))
            }
          </div>
        }
        </div>
        <div className="cart-side-content">
          <div className="cart-switch">
            <p>Unit Display:</p>
            <BootstrapSwitchButton
              checked={isMetric}
              onlabel="Metric"
              onstyle="primary"
              offlabel="Customary"
              offstyle="info"
              width={150}
              onChange={() => { setIsMetric(!isMetric) }}
            />
          </div>
          <Form className="cart-form">
            <Col>
              <Row>
                <Form.Group className="mb-3" controlId="formGroupName">
                  <Form.Label>Product name</Form.Label>
                  <Form.Control type="text" placeholder="Enter name" name="name" value={shoppingCartForm.name} onChange={handleOnCartFormChange} />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className="mb-3" controlId="formGroupNumber">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control type="number" placeholder="Enter number" name="quantity" value={shoppingCartForm.quantity} onChange={handleOnCartFormChange} style={{color: "var(--fontContent"}}/>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className="mb-3" controlId="formGroupNumber">
                  <Form.Label>Unit</Form.Label>
                  <Form.Select value={curUnit} onChange={handleUnitChange} style={curUnit==basicUnits[0] ? {color: "gray"} : {color: "var(--fontContent"}}>
                    {basicUnits.map((val, ind) => (
                      <option key={val} value={val} disabled={ind == 0} hidden={ind == 0}>{val}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className="mb-3" controlId="formGroupNumber">
                  <Form.Label>Category</Form.Label>
                  <Form.Select value={curCategory} onChange={handleCategoryChange} style={curCategory==basicCategories[0] ? {color: "gray"} : {color: "var(--fontContent"}}>
                    {basicCategories.map((val, ind) => (
                      <option key={val} value={val} disabled={ind == 0} hidden={ind == 0}>{val}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row className="cart-submit">
                <Button variant="primary" onClick={handleOnSubmitCartForm}>Submit</Button>
              </Row>
            </Col>
          </Form>
        </div>
      </div>

    </div>
  )
}
