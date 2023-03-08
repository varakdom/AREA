import { ToastAndroid } from "react-native";

const Fetch = (url, options, callback) => fetch(url, {method: "GET", ...options, credentials: 'include', headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...options.headers }}).then(response => response.json().then(json => callback(json, response)).catch(err => callback(null, response))).catch(err => {ToastAndroid.show(err, ToastAndroid.SHORT); callback(null, null)});

export default Fetch;
