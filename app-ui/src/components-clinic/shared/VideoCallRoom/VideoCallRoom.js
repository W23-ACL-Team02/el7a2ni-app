import axios from 'axios'
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import PhoneIcon from "@mui/icons-material/Phone"
import CircleIcon from '@mui/icons-material/Circle';
import React, { useEffect, useRef, useState } from "react"
import Peer from "simple-peer"
import io from "socket.io-client"
import styles from './VideoCallRoom.module.css'
import '../../../process.js';
import socket from "../../../socketManager.js"
const serverURL = process.env.REACT_APP_SERVER_URL;
//const socket = io.connect(serverURL);

const VideoCallRoom = () => {
	const [currUser, setCurrUser] = useState({});
    const [ me, setMe ] = useState("")
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [ stream, setStream ] = useState()
	const [ receivingCall, setReceivingCall ] = useState(false)
	const [ caller, setCaller ] = useState("")
	const [ callerSignal, setCallerSignal ] = useState()
	const [ callAccepted, setCallAccepted ] = useState(false)
	const [ idToCall, setIdToCall ] = useState("")
	const [ callEnded, setCallEnded] = useState(false)
	const [ name, setName ] = useState("")
	const myVideo = useRef()
	const userVideo = useRef()
	const connectionRef= useRef()

	useEffect(() => {
		const fetchData = async () =>{
			try{
				const user = await getCurrUser(); 
				console.log(user.username)
				handleSetUsername(user);
				
				if(user){
					socket.on('onlineDoctors', (users) => {
						if(user.type != "doctor"){
							setOnlineUsers(users);
							if(users.length != 0){
								setIdToCall(users[0].id)
							}
						}		
					});
		
					socket.on('onlinePatients', (users) => {
						if(user.type != "patient"){
							setOnlineUsers(users);
							if(users.length != 0){
								setIdToCall(users[0].id)
							}
						}		
					});
				}

			}catch(error){
				console.log(error)
			} 

		}	

		console.log("About to get user media");
		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				console.log("Got user media");
				setStream(stream);
				setTimeout(() => {myVideo.current.srcObject = stream}, 200);
			})
			.catch((error) => {
				console.error("Error accessing user media:", error);
			});

		socket.on("me", (id) => {
				setMe(id)
		})

		socket.on("callUser", (data) => {
			setReceivingCall(true)
			setCaller(data.from)
			setName(data.name)
			setCallerSignal(data.signal)
		})

		socket.on("endCall", () => {
			console.log("entered call ended socket")
			setCallEnded(true);
			setCallAccepted(false)
			if (connectionRef.current) {
				connectionRef.current.destroy();
			}
			if (userVideo.current) {
				userVideo.current.srcObject = null;
			}
		});

		fetchData();
		 
	}, [])

	const getCurrUser =  async () => {
		const response = await axios.get(`${serverURL}/clinic/private/user/getSelfUser`, {withCredentials:true})
		const user = response.data;
		setCurrUser(user);
		return user;  
	}	

	const handleSetUsername = (user) => {
		socket.emit('setUsername', {username: user.username, userType: user.type});
	  };

	const callUser = (id) => {
		if (callEnded) {
			setCallEnded(false);
			setCallAccepted(false);
		}
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("callUser", {
				userToCall: id,
				signalData: data,
				from: me,
				name: currUser.username
			})
		})
		peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream
		})
		peer.on('close', () => { console.log('peer closed'); socket.off("callAccepted"); });

		socket.on("callAccepted", (signal) => {
			setCallAccepted(true)
			peer.signal(signal)
		})

		connectionRef.current = peer
	}

	const answerCall =() =>  {
		if (callEnded) {
			setCallEnded(false)
		}
		setCallAccepted(true)
		setReceivingCall(false)
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("answerCall", { signal: data, to: caller })
		})
		peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream
		})
		peer.on('close', () => { console.log('peer closed'); socket.off("callAccepted"); });
		peer.signal(callerSignal)
		connectionRef.current = peer
	}

	const leaveCall = () => {
		setCallEnded(true)
		setCallAccepted(false)
		if (connectionRef.current) {
			connectionRef.current.destroy();
		}

		console.log(`me: ${me}`)
		console.log(`caller: ${caller}`)
		console.log(`whoever answered: ${idToCall}`)
		if(caller === ""){
			socket.emit("endCall", { to: idToCall });
		}else{
			socket.emit("endCall", { to: caller });
		}
		

		if (userVideo.current) {
			userVideo.current.srcObject = null;
		}
	}

	const handleChange = (event) => {
		setIdToCall(event.target.value);
		console.log(event.target.value);
	}

    return (
        <div className={styles.mainContainer}>
			<h1 style={{ textAlign: "center", color: '#000' }}>Clinic Video Chat Room</h1>
			<div className={styles.container}>
				<div className={styles.video_container}>
					<div className={styles.video}>
						{stream &&  <video playsInline muted ref={myVideo} autoPlay style={{ width: "700px" , height: '600px'}} />}
					</div>
					<div className={styles.video}>
						{callAccepted && !callEnded ?
						<video playsInline ref={userVideo} autoPlay style={{ width: "700px", height: '600px'}} />:
						null}
					</div>
				</div>
				<div className={styles.call_container}>
					{/* <label
						id="filled-basic"
						label="Name"
						variant="filled"
						style={{ marginBottom: "20px" , color: '#000'}}
					> {name} </label>
					<CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
						<Button variant="contained" color="primary" startIcon={<AssignmentIcon fontSize="large" />}>
							Copy ID
						</Button>
					</CopyToClipboard> */}
					<div>
						<div className={styles.UsersLabel}>
							<CircleIcon fontSize="small" style={{ color:"green"}}/>
							<h3>Online Users:</h3>
						</div>
						<div className={styles.OnlineUsers}>
							<select defaultValue={idToCall} id="named-select" name="user-select"  onChange={handleChange} style={{ width: '180px'}}>
								{onlineUsers.map((user) => (
									<option value={user.id}>
										{user.username}
									</option>
								))}
							</select>
						</div>
					</div>		
					<div className={styles.call_button}>
						{callAccepted && !callEnded ? (
							<Button variant="contained" color="secondary" onClick={leaveCall}>
								End Call
							</Button>
						) : (
							<IconButton color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
								<PhoneIcon fontSize="large" />
							</IconButton>
						)}
						{/* {idToCall} */}
					</div>
				</div>
				<div>
					{receivingCall && !callAccepted ? (
						<div className={styles.caller}>
							<h1 style={{fontSize:'22px', width:'350px'}}>{name} is calling...</h1>
							<Button variant="contained" color="primary" style={{width:'100px', height:'40px', marginTop:'5px'}} onClick={answerCall}>
								Answer
							</Button>
						</div>
					) : null}
				</div>
			</div>
		</div>
    )
}

export default VideoCallRoom;