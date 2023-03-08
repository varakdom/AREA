import { TextField, Button, Typography } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { AccountCircle, Lock, AlternateEmail } from '@mui/icons-material';
import { useState } from 'react';
import Fetch from './Fetch';
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [mail, setMail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmed, setConfirmed] = useState("");
    const navigate = useNavigate();

    return (
        <div style={styles.box}>
            <Typography color="primary" fontSize={24} fontWeight="bold">REGISTER</Typography>
            <div style={styles.elem}>
                <TextField mode='outlined' style={{color: 'white'}} value={name} onChange={event => setName(event.target.value)} placeholder={"Displayname"} fullWidth={true} InputProps={{ startAdornment: ( <InputAdornment position="start"> <AccountCircle /> </InputAdornment> )}}/> 
            </div>
            <div style={styles.elem}>
                <TextField mode='outlined' style={{color: 'white'}} type="email" value={mail} onChange={event => setMail(event.target.value)} placeholder={"Email address"} fullWidth={true} InputProps={{ startAdornment: ( <InputAdornment position="start"> <AlternateEmail /> </InputAdornment> )}}/> 
            </div>
            <div style={styles.elem}>
                <TextField mode='outlined' type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder={"Password"} fullWidth={true} InputProps={{ startAdornment: ( <InputAdornment position="start"> <Lock /> </InputAdornment> )}}/>
            </div>
            <div style={styles.elem}>
                <TextField mode='outlined' error={password !== confirmed} helperText={password.length && password !== confirmed ? "Passwords do not match" : ""} type="password" value={confirmed} onChange={event => setConfirmed(event.target.value)} placeholder={"Confirmed password"} fullWidth={true} InputProps={{ startAdornment: ( <InputAdornment position="start"> <Lock /> </InputAdornment> )}}/>
            </div>
            <div style={styles.elem}>
                <Button variant="contained" fullWidth={true} color="primary" disabled={!mail.length || !password.length || (password !== confirmed) || !name.length} onClick={() => Fetch("https://api.zarea.fr/register", { method: "POST", body: JSON.stringify({email: mail, password: password, name: name}) }, (json, response) => response.status === 201 ? navigate("/login") : alert(json?.msg)) }>REGISTER</Button>
            </div>
            <span style={{ textAlign: "start", width: '100%', marginTop: '5px', color: "grey"}}>
                Already registered ?
                <Button variant="text" style={{ marginBottom: '3px' }} color="primary" onClick={() => navigate("/login")}>
                    LOGIN
                </Button>
            </span>
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
    }, h2: { 
        color: '#ff3333',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    }
};

export default Register;