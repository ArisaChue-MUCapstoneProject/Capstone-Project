import * as React from "react"
import "./Navbar.css"
import { Link } from "react-router-dom"
import recipeBook from "../../icons/recipe-book.png"
import store from "../../icons/store.png"

export default function Navbar() {
  return (
    <nav className="navbar" id="navbar-overrides">
      <Link to="/">
          <p id="navbar-links">Log Out</p>
      </Link>
      <Link to="/marketplace">
        <p id="navbar-links">Marketplace</p>
      </Link>
      <Link to="/profile">
          <p id="navbar-links">Profile</p>
      </Link>
      <Link to="/recipes">
          <p id="navbar-links">Recipes</p>
      </Link>
      <Link to="/pantry">
          <p id="navbar-links">Pantry</p>
      </Link>
      <Link to="/shoppingcart">
          <p id="navbar-links">Shopping Cart</p>
      </Link>
    </nav>
  )
}
