import * as React from "react"
import heart from "../../icons/heart.png"
import "./HeartIcon.css"

export default function HeartIcon(props) {
    // TODO: add onClick function to save to favorites
    return (
        <img className="heart-img" src={ heart } alt="heart icon" />
    )
}
