import { TextField, Button, Typography, IconButton } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { AccountCircle, Lock } from '@mui/icons-material';
import { useState } from 'react';
import Fetch from './Fetch';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    return (
        <div style={styles.box}>
            <Typography color="primary" fontSize={24} fontWeight="bold">LOGIN</Typography>
            <div style={styles.elem}>
                <TextField mode='outlined' style={{color: 'white'}} type="email" value={mail} onChange={event => setMail(event.target.value)} placeholder={"Email address"} fullWidth={true} InputProps={{ startAdornment: ( <InputAdornment position="start"> <AccountCircle /> </InputAdornment> )}}/> 
            </div>
            <div style={styles.elem}>
                <TextField mode='outlined' type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder={"Password"} fullWidth={true} InputProps={{ startAdornment: ( <InputAdornment position="start"> <Lock /> </InputAdornment> )}}/>
            </div>
            <div style={styles.elem}>
                <Button variant="contained" fullWidth={true} color="primary" disabled={!mail.length || !password.length} onClick={() => Fetch("https://api.zarea.fr/login", { method: "POST", credentials: "include", body: JSON.stringify({email: mail, password: password}) }, (json, response) => { response.status === 200 ? navigate("/") : alert(json?.msg)}) }>LOGIN</Button>
            </div>
            <span style={{ textAlign: "start", width: '100%', marginTop: '5px', color: "grey"}}>
                New ?
                <Button variant="text" style={{ marginBottom: '3px' }} color="primary" onClick={() => navigate("/register")}>
                    REGISTER
                </Button>
            </span>
            <h4 style={{width: "100%", paddingTop: '8px', textAlign: "center", borderBottom: "1px solid #D3D3D3", lineHeight: "0.1em", margin: "10px 0 20px"}}>
                <span style={{backgroundColor: "#F2F2F2", padding: "0 10px", color: "#C0C0C0"}}>OR</span>
            </h4>
            <div style={{ display: "flex", width: '100%', flexDirection: "row", justifyContent: "space-around" }}>
                <IconButton href="https://api.zarea.fr/google_login">
                    <img style={{ width: 40, height: 40 }} src={process.env.PUBLIC_URL + "/GoogleSVG.png"}/>
                </IconButton>
                <IconButton href="https://api.zarea.fr/facebook_login_session">
                    <img style={{ width: 40, height: 40 }} src={process.env.PUBLIC_URL + "/FacebookSVG.png"}/>
                </IconButton>
                <IconButton href="https://api.zarea.fr/azure_login">
                    <img style={{ width: 40, height: 40 }} src={process.env.PUBLIC_URL + "/MicrosoftSVG.png"}/>
                </IconButton>
            </div>
        </div>
    );
}

const styles = {
    elem: {
        width: '100%',
        padding: '8px 0px',
    }, box: {
        backgroundColor: '#F2F2F2',
        padding: '10px 20px',
        borderRadius: '10px',
        display: 'flex',
        width: '250px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
};

export default Login;