import React, { useState } from 'react'
import {checkLength, checkSymbol,checkCapitalLetter,checkNumber} from '../functions/validatePassword'

export default function PasswordValidityBox(props= {password: ''}) {
    let colorLength = (checkLength(props.password)) ? 'green':'red';
    let colorSymbol = (checkSymbol(props.password)) ? 'green':'red';
    let colorCapital = (checkCapitalLetter(props.password)) ? 'green' : 'red';
    let colorNumber = (checkNumber(props.password)) ? 'green' : 'red';

    return (
        <div className='container-main'>
            <ul>
                <li id='validPasswordLength' style={{color: colorLength}}>At least 8 characters long.</li>
                <li id='validPasswordSymbol' style={{color: colorSymbol}}>At least 1 symbol (#?!@$ %^&*-)</li>
                <li id='validPasswordCapital' style={{ color: colorCapital }}>At least 1 capital letter.</li>
                <li id='validPasswordNumber' style={{ color: colorNumber }}>At least 1 number.</li>
            </ul>
        </div>
    )
}