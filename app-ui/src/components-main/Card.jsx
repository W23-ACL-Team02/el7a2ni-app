import React from 'react'
import styles from './General.module.css'

const Card = ({height, width}) => {
    return (
        <div className={styles.card} style={{height: height, width: width}}></div>
    )
}
export default Card;