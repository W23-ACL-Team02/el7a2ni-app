import io from 'socket.io-client';

const serverURL = process.env.REACT_APP_SERVER_URL;
const socket = io.connect(serverURL);

export default socket;