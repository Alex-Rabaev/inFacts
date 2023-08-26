import React, { useRef, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import './login.css';

export default function Login() {
  const [message, setMessage] = useState('');
  const usernameOrEmailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(false)

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            const res = await fetch('/api/users/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username_or_email: usernameOrEmailRef.current.value,
                    password: passwordRef.current.value
                })
            })
            const data = await res.json();
            if (res.status === 200) {
                setIsFetching(!isFetching);
                const decode = jwt_decode(data.token);
                setMessage(
                    `Welcome ${decode.firstname && decode.lastname ? `${decode.firstname} ${decode.lastname}` : decode.username}!`
                    );
                localStorage.setItem("token", data.token);
                setTimeout(() => {
                    navigate(`/`);
                    window.location.reload();
                }, 3000)
            } else {
                setMessage(data.msg);
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    const handleRegisterButton = async () => {
        // Redirect to the "/login" page
        navigate('/register');
    }
  
  return (
    <div className='login'>
        <div className="loginWrapper">
            <div className="loginLeft">
                <h3 className="loginLogo">inFacts</h3>
                <span className="loginDesc">
                    Discover something new every day <br/>and share with your friends
                </span>
                <h2>{message}</h2>
            </div>
            <div className="loginRight">
                <form className="loginBox">
                    <input placeholder='Email or Username' className="loginInput" required ref={usernameOrEmailRef} type="text" name='username_or_email'/>
                    <input placeholder='Password' className="loginInput" required ref={passwordRef} type="password" name='password'/>
                    <button onClick={submitHandler} className='loginButton' disabled={isFetching}>
                        {isFetching ? <CircularProgress color="success" size={'20px'}/> : "Log in"}
                    </button>
                    <span className="loginForgot">Forgot password or username?</span>
                    <button type={"button"} onClick={handleRegisterButton} className='loginRegisterButton' disabled={isFetching}>
                        {isFetching ? <CircularProgress color="success" size={'20px'}/> : "Create a New Account"}</button>
                </form>
            </div>
        </div>
    </div>
  )
};
