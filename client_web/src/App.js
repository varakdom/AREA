import Login from './Login';
import Register from './Register';
import Home from './Home';
import { createTheme, ThemeProvider } from '@mui/material/styles'; 
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  }, {
    path: "/login",
    element: <Login/>
  }, {
    path: "/register",
    element: <Register/>
  }, {
    path: "*",
    element: <div className="App-logo">404 You're lost</div>
  }
]);

const theme = createTheme({
  palette: {
    primary: {
      main: "#26547c"
    }, secondary: {
      main: "#fffcf9"
    }, success: {
      main: "#06d6a0"
    }, error: {
      main: "#ef476f"
    }
  }
});

function App() {
  return (
    <div style={{background: "url(/background.svg)", backgroundColor: "#DCDCDC", backgroundSize: "cover", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router}/>
      </ThemeProvider>
    </div>
  );
}

export default App;
