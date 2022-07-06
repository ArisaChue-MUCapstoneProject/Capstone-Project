import * as React from "react"
import { Link } from "react-router-dom"
import "./Navbar.css"

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">
          <p>Log Out</p>
      </Link>
      <Link to="/profile">
          <p>Profile</p>
      </Link>
      <Link to="/recipes">
          <p>Recipes</p>
      </Link>
      <Link to="/pantry">
          <p>Pantry</p>
      </Link>
      <Link to="/shoppingcart">
          <p>Shopping Cart</p>
      </Link>
    </nav>
  )
}
