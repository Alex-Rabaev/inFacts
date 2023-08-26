import React, { useRef, useState } from 'react';
import './register.css';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    

    const usernameRef = useRef();
    const emailRef = useRef();
    const firstnameRef = useRef();
    const lastnameRef = useRef();
    const passwordRef = useRef();
    const passwordAgainRef = useRef();
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        // const username = usernameRef.current.value;
        // const email = emailRef.current.value;
        // const firstname = firstnameRef.current.value;
        // const lastname = lastnameRef.current.value;
        // const password = passwordRef.current.value;
        // const passwordAgain = passwordAgainRef.current.value;
        
        // console.log(password !== passwordAgain);

        if (passwordRef.current.value !== passwordAgainRef.current.value) {
            setMessage("Passwords don't match");
        } else {
            setMessage("");
            const user = JSON.stringify({
                username: usernameRef.current.value,
                email: emailRef.current.value,
                firstname: firstnameRef.current.value,
                lastname: lastnameRef.current.value,
                password: passwordRef.current.value
            })
            try {
                const res = await fetch('http://localhost:3030/api/users/register', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: user
                });
                const data = await res.json();
                if (res.status === 200) {
                    setMessage(
                        `Welcome ${firstnameRef.current.value && lastnameRef.current.value ? `${firstnameRef.current.value} ${lastnameRef.current.value}` : usernameRef.current.value}!`
                        );
                    navigate("/login");
                } else {
                    setMessage(data.msg);
                }
            } catch (error) {
                console.log(error)
            }
        }

    }
    const handleLoginButtonClick = async () => {
        // Redirect to the "/login" page
        navigate('/login');
    }

  return (
    <div className='register'>
        <div className="registerWrapper">
            <div className="registerLeft">
                <h3 className="registerLogo">inFacts</h3>
                <span className="registerDesc">
                    Discover something new every day <br/>and share with your friends
                </span>
                <h2>{message}</h2>
            </div>
            <form className="registerRight" onSubmit={handleSubmit}>
                <div className="registerBox">
                    <input placeholder='Username' required ref={usernameRef} className="registerInput" />
                    <input placeholder='Email' type='email' required ref={emailRef} className="registerInput" />
                    <div className="namesBlock">
                        <input placeholder='First Name' ref={firstnameRef} className="registerInput" />
                        <input placeholder='Last Name' ref={lastnameRef} className="registerInput" />
                    </div>
                    <input placeholder='Password' type='password' required ref={passwordRef} className="registerInput" />
                    <input placeholder='Password Again' type='password' required ref={passwordAgainRef} className="registerInput" />
                    <button type='submit' className='registerButton'>Sign Up</button>
                    <span className="ifRegistered">Already have an account?</span>
                    <button type='button' onClick={handleLoginButtonClick} className='registerLoginButton'>Log in</button>
                </div>
            </form>
        </div>
    </div>
  )
};
