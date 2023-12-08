import React, { useState } from 'react'
import {checkLength, checkSymbol} from '../functions/validatePassword'

export default function PasswordValidityBox(props= {password: ''}) {
    let colorLength = (checkLength(props.password)) ? 'green':'red';
    let colorSymbol = (checkSymbol(props.password)) ? 'green':'red';

    return (
        <div className='container-main'>
            <ul>
                <li id='validPasswordLength' style={{color: colorLength}}>At least 8 characters long.</li>
                <li id='validPasswordSymbol' style={{color: colorSymbol}}>At least 1 symbol (#?!@$ %^&*-)</li>
            </ul>
        </div>
    )
}