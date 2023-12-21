import React, { useState } from 'react'

export default function ErrorBox(props= {errors: []}) {
    const hasErrors = (props?.errors?.length > 0)
    if (!hasErrors) return null;

    let errorNum = 0;
    return (
        <div className='container-errors' style={{display: hasErrors ? "block":"none"}}>
            {props.errors.map((error) => (
                    <p key={errorNum++}>{error}</p>
                ))}
        </div>
    )
}