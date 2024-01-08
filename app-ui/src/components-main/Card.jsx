import React from 'react'
import styles from './General.module.css'

const Card = (props) => {
    const height = props.height
    const width = props.width
    return (
        <div className={styles.card} style={{height: height, width: width}}>
            {props.children}
        </div>
    )
}
export default Card;