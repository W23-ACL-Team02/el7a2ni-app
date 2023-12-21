import React, { useState } from 'react'

export default function ErrorBox(props= {errors: []}) {
    const hasErrors = (props?.errors?.length > 0)
    if (!hasErrors) return null;

    return (
        <div className='container-errors' style={{display: hasErrors ? "block":"none"}}>
            {props.errors.map((error, index) => (
                    <p key={index}>{error}</p>
                ))}
        </div>
    )
}