import * as React from "react"
import { Link } from "react-router-dom"
import recipeBook from "../../icons/recipe-book.png"
import "./Navbar.css"

export default function Navbar() {
  return (
    <nav className="navbar" id="navbar-overrides">
      <Link to="/">
          <p>Log Out</p>
      </Link>
      <Link to="/profile">
          <p>Profile</p>
      </Link>
      <Link to="/recipes">
          <img className="nav-recipes" src={ recipeBook } alt="recipe book icon" />
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
