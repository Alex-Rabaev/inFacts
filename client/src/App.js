import Home from "./pages/home/Home";
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Messenger from "./pages/messenger/Messenger";
import jwt_decode from 'jwt-decode';
import Profile from "./pages/profile/Profile";
import Topics from "./pages/topics/Topics";
import { useEffect, useState } from "react";
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'


function App() {
    
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const [user, setUser] = useState({});
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedData = jwt_decode(token);
                setUserData(decodedData);
            } catch (error) {
                console.error("Error decoding the token:", error);
            }
        }
    }, []);

    
    useEffect(() => {
        const fetchUser = async () => {
            if (!userData?.username) return;
    
            try {
                const res = await axios.get(`${BASE_URL}/api/users?username=${userData.username}`);
                setUser(res.data[0]);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        userData && fetchUser();
    }, [BASE_URL, userData]);

  return( 
  <>
    <Routes>
      <Route path="/" element={Object.keys(user).length ? <Home user = {user}/> : <Navigate to="/login" />}/>
      <Route path="/login" element={Object.keys(user).length ? <Navigate to="/" /> : <Login />}/>
      <Route path="/register" element={Object.keys(user).length ? <Navigate to="/" /> : <Register/>}/>
      <Route path="/messenger" element={<Messenger currentUser = {user}/>}/>
      <Route path="/topics" element={<Topics user = {user}/>}/>
      {Object.keys(user).length && (
          <Route
            path="/profile/:username"
            element={<Profile currentUser = {user} key={uuidv4()}/>}
          />
        )}
    </Routes>
    
  </>
  );
}

export default App;
