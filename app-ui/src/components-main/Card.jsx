import React from 'react'
import '../css/general.css'

const Card = (props) => {
    const height = props.height
    const width = props.width
    return (
        <div className='card' style={{height: height, width: width}}>
            {props.children}
        </div>
    )
}
export default Card;