import * as React from "react"
import chickenDish from "../../icons/chicken_dish.png"
import tofuDish from "../../icons/tofu_dish.png"
import salmonDish from "../../icons/salmon_dish.png"
import "./RecipesHero.css"

export default function RecipesHero(props) {
  return (
    <div className="recipes-hero">
          <div className="recipes-hero-heading">
              <h1 className="recipes-hero-title">Recipes Just For You</h1>
              <h3 className="recipes-hero-sub">Curated recipes based on what you have in your pantry, so you won't have to waste a single thing.</h3>
              <div className="recipes-hero-sub-container">
                <p className="recipes-hero-sub">Ingredients we are currently looking for:</p>
                <div className="recipes-hero-ingreds">
                    {
                        props.userProducts.map((item) => (
                            <p key={item.name} className="recipes-hero-item">{item.name}</p>
                        ))
                    }
                </div>
              </div>
          </div>
          <div className="recipes-hero-img">
            <div className="recipes-sub-dishes">
                <img className="chicken-img" src={ chickenDish } alt="chicken dish picture" />    
                <img className="tofu-img" src={ tofuDish } alt="tofu dish picture" /> 
            </div>
            <img className="salmon-img" src={ salmonDish } alt="salmon dish picture" /> 
          </div>     
    </div>
  )
}