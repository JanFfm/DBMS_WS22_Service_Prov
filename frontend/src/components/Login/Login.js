import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from "axios";

import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
async function loginUser(credentials) {
    return fetch('http://localhost:8000/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}
/*
partly according to: https://medium.com/@ronakchitlangya1997/jwt-authentication-with-react-js-and-django-c034aae1e60d



*/



export default function LoginPage({ setToken }) {
    /*
    const [user, setUser] = useState("");
    const [passw, setPassw] = useState("");
    //const [isAnon, setIsAnon] = useState(false);
        */
    const [username, setUsername] = useState('');     
    const [password, setPassword] = useState('');
    const submitThis = async e => {
        const user = {
            username: username,
            password: password
           };          // Create the POST requuest
      const {data} = await                                                                            
                     axios.post('http://localhost:8000/token/',
                     user ,{headers: 
                    {'Content-Type': 'application/json'}},
                     {ithCredentials: true});
     // Initialize the access & refresh token in localstorage.      
    localStorage.clear();         
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);         
    axios.defaults.headers.common['Authorization'] =  `Bearer ${data['access']}`;
    console.log(data)         
    window.location.href = '/'}


    return (

        <div >
            <div class="row">
                <h2 class="header-login">Web application to review service providers</h2> <hr></hr>
            </div>



            <div class="login-form">
                <form onSubmit={submitThis}>
                    <h1>Login</h1>
                    <div class="content">
                        <div class="input-field">
                            <label htmlFor="user">Username</label>
                            <input type="text" name="user" id="user" value={username} onChange={e => setUsername(e.target.value)} />
                        </div>
                        <div class="input-field">
                            <label htmlFor="passw">Password </label><br />
                            <input type="password" name="passw" id="passw" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div class="action">
                        <button type="submit"> Login</button>
                    </div>
                </form>

                <div class="link_user_page text-center">
                    <Link class="new-user-box-link" to="/new_user"> Create a new User Account </Link>
                </div>


            </div>


        </div>


    )
}
//                        <input type="checkbox" id="anon" checked={isAnon} onChange={(e) => setIsAnon(!isAnon)} /> <span>Log In Anonymous</span><br />

LoginPage.propTypes = {
    setToken: PropTypes.func.isRequired
}

