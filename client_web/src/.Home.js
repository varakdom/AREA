import { Typography, Switch, TextField, Button, CircularProgress, Dialog, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Fetch from './Fetch';

function AddDialog(props) {
    const { onClose, open, data } = props;
    const [action, setAction] = useState(null);
    const [params, setParams] = useState({});
    const [provider, setProvider] = useState(null);
    const [reaction, setReaction] = useState(null);
    const [rparams, setRParams] = useState({});
    const [loading, setLoading] = useState(false);

    return (
        <Dialog onClose={() => onClose({provider: data.provider, action: action, params: params})} open={open}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", padding: "15px" }}>
                <Typography color="primary" fontSize={24} fontWeight="bold" style={{marginBottom: '5px'}}>Add {data?.provider} action</Typography>
                    <TextField select label="Action" style={{margin: '5px 0px'}} placeholder="Select an action" value={action} onChange={(event) => setAction(event.target.value)}>
                        {
                            data?.actions ? Object.keys(data.actions).map(act => <MenuItem value={act}>{data.actions[act].title}</MenuItem>) : null
                        }
                    </TextField>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
                    { action ? <Typography color="primary" fontSize={24} fontWeight="bold" style={{margin: '5px 0px'}}>Action parameter(s)</Typography> : null }
                    {
                        data?.actions[action]?.input?.map(input => <TextField value={params[input.value]} onChange={(event) => setParams({...params, [input.value]: event.target.value})} label={input.title} style={{margin: '5px 0px'}}/>)
                    }
                </div>
                <Typography color="primary" fontSize={24} fontWeight="bold" style={{margin: '5px 0px'}}>Reaction</Typography>
                <TextField select label="Provider" placeholder="Select a provider" value={provider} style={{margin: '5px 0px'}} onChange={(event) => setProvider(event.target.value)}>
                    {
                        data?.services ? Object.keys(data.services).map(service => <MenuItem value={service} disabled={!data.services[service].connected || !Object.keys(data.services[service].reactions)?.length}>{service.charAt(0).toUpperCase() + service.slice(1)}</MenuItem>) : null
                    }
                </TextField>
                { provider ? <TextField select label="Reaction" placeholder="Select a reaction" value={reaction} onChange={(event) => setReaction(event.target.value)} style={{margin: '5px 0px'}}>
                    {
                        data?.services[provider]?.reactions ? Object.keys(data.services[provider].reactions).map(react => <MenuItem value={react}>{data.services[provider].reactions[react].title}</MenuItem>) : null
                    }
                </TextField> : null }
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
                    { reaction ? <Typography color="primary" fontSize={24} fontWeight="bold" style={{margin: '5px 0px'}}>Reaction parameter(s)</Typography> : null }
                    {
                    data?.services[provider]?.reactions[reaction]?.input?.map(input => <TextField value={rparams[input.value]} onChange={(event) => setRParams({...rparams, [input.value]: event.target.value})} label={input.title} style={{margin: '5px 0px'}}/>)
                    }
                </div>
                {
                    loading ? <CircularProgress/> : <Button variant="contained" style={{ marginTop: '5px' }} onClick={() => { setLoading(true); Fetch("https://api.zarea.fr/area", { method: "POST", credentials: "include", body: JSON.stringify({provider: data.provider, action: action, params: params, rprovider: provider, reaction: reaction, rparams: rparams})}, (json, response) => response.status !== 201 ? alert(response.status + " - " + json?.msg) : onClose()); }} disabled={!action || data.actions[action].input.some(input => !params[input.value]) || !reaction || !provider || data.services[provider].reactions[reaction].input.some(input => !rparams[input.value])}>Add action</Button>
                }
            </div>
        </Dialog>
    );
}

function getServices(setLoading, setServices, navigate)
{
    Fetch("https://api.zarea.fr/services", { method: "GET", credentials: "include" }, (json, response) => { if (response.status === 401) navigate("/login"); setLoading(false); setServices(json); });
}

function getActions(setLoading, setActions, navigate)
{
    Fetch("https://api.zarea.fr/actions", { method: "GET", credentials: "include"}, (json, response) => { if (response.status === 401) navigate("/login"); setLoading(false); setActions(json);});
}

const Home = () => {
    const [services, setServices] = useState({});
    const [actions, setActions] = useState({});
    const [profile, setProfile] = useState(null);
    const [open, setOpen] = useState(false); 
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [dialogData, setDialogData] = useState(null);

    useEffect(() => {
        getServices(setLoading, setServices, navigate);
        getActions(setLoading, setActions, navigate);
        Fetch("https://api.zarea.fr/profile", { method: "GET", credentials: "include" }, (json, response) => { if (response.status === 401) navigate("/login"); setProfile(json); });
    }, []);
    return (
        <div style={profile && Object.keys(services).length ? undefined : styles.box}>
            <AddDialog open={open} data={dialogData} onClose={() => setOpen(false)}/>
            <img src={process.env.PUBLIC_URL + "/zarea.svg"} style={{ width: '500px', height: '120px', resizeMode: 'stretch', position: 'absolute', top: '13%', left: '50%', transform: 'translate(-50%, -50%)' }}/>
            { profile && Object.keys(services).length ?
                <div style={styles.box}>
                    <Typography color="primary" fontSize={24} fontWeight="bold" style={{marginBottom: '5px'}}>Welcome {profile}</Typography>
                    {Object.keys(services).sort((a, b) => a.localeCompare(b)).map(service =>
                        <div key={service} style={{backgroundColor: "white", display: "flex", flexDirection: "column", borderRadius: '10px', margin: '5px 0px', padding: '5px 0px', width: '100%'}}>
                            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                <img style={{ width: 214, height: 38, resizeMode: 'stretch' }} src={process.env.PUBLIC_URL + `/zarea-${service}.png`}/>
                                <Switch disabled={loading} checked={services[service].connected} onChange={(event) => {
                                    setLoading(true);
                                    if (event.target.checked)
                                        window.location.replace(`https://api.zarea.fr/${service}_login`);
                                    else
                                        Fetch("https://api.zarea.fr/service", { method: "DELETE", credentials: "include", body: JSON.stringify({service: service}) }, (json, response) => {
                                            if (response.status !== 200)
                                                alert(response.status + " - " + json?.msg);
                                            else
                                                getServices(setLoading, setServices, navigate);
                                         });
                                    }}/>
                            </div>
                            { services[service].connected && services[service].actions && Object.keys(services[service].actions).length ?
                                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "5px 10px"}}>
                                    <Button fullWidth variant="contained" onClick={() => { setDialogData({provider: service, actions: services[service].actions, services: services}); setOpen(true) }}>Add an action</Button>
                                </div>
                                : null }
                            { actions[service] ?
                                <div>
                                    { Object.keys(actions[service]).map(key =>
                                    <div key={key} style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "5px 5px"}}>
                                        <div>
                                            <h>{actions[service][key].type}</h>
                                            <Button size="small" variant="contained" color="error" onClick={() => {
                                                Fetch(`https://api.zarea.fr/delete/${service}?id=${key}`, { method: "DELETE", credentials: "include", headers: {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Headers': 'Content-Type'}, body: JSON.stringify(actions[service][key].params) }).then((req, res) => {
                                                    console.log(res.status);
                                                })
                                            }}>DELETE</Button>
                                        </div>
                                    </div>
                                    )}
                                </div> : null}
                        </div>
                    )}
                </div> : <CircularProgress/>
            }
            <div>
                <Button onClick={() => getActions(setLoading, setActions, navigate)}>
                    GetActions
                </Button>
            </div>
        </div>
    );
}

const styles = {
    elem: {
        width: '100%',
        padding: '8px 0px'
    }, box: {
        backgroundColor: '#F2F2F2',
        padding: '15px 15px',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
};    

export default Home;
