import * as React from "react"
import { useState } from "react"
import "./CustomTooltip.css"

export default function CustomTooltip(props) {

    const [isHovering, setIsHovering] = useState(false)

    function handleMouseOver() {
        setIsHovering(true)
    }
    function handleMouseOut() {
        setIsHovering(false)
    }
    
    return (
        <div className="customtooltip">
            <button className="tooltip-button" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>?</button>
            <div className="dialogue-container">
                {isHovering && <p className="dialogue">{props.dialogue}</p>}
            </div>
        </div>
    )
}
