const Fetch = (url, options, callback) => fetch(url, {...options, credentials: 'include', headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...options.headers }}).then(response => response.json().then(json => callback(json, response)).catch(err => alert(err))).catch(err => alert(err));

export default Fetch;
