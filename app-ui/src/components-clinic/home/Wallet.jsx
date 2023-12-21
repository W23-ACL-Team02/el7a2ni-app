import axios from 'axios';

const baseURL = `http://localhost:3000`

export default function Wallet({balance}) {
    return (
        <div className='container-main'>
            <p>Balance: {balance}</p>
        </div>
    )
}