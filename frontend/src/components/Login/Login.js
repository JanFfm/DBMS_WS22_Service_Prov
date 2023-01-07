import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import md5 from 'md5-hash'
async function loginUser(credentials) {
    return fetch('/auth/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}

export default function LoginPage({ setToken }) {
    const [user, setUser] = useState("");
    const [passw, setPassw] = useState("");
    const [isAnon, setIsAnon] = useState(false);
    const submitThis = async e => {
        e.preventDefault();
        const token = await loginUser({
            user,
            passw,
            isAnon
        });
        //this will create a session key for anon:
        //if (token.token===1){
        //    token.token= 10000000000000000// {user_id:0,key: md5(Date())}
        //}
       
        console.log("token", token)
        setToken(token);
        window.location.reload(false);
    }
    return (

        <div class="bg-image background ">
            <div class="row">
                <h2 class="header-login">Welcome!</h2> <hr></hr>
            </div>
            <div class="row">
                <div className='new-user-box '> <Link class="btn new-user-box-link" to="/new_user"> Create a new User Account </Link> </div>

                <div className="login-wrapper">
                    <form onSubmit={submitThis}>
                        <div>
                            <label htmlFor="user">Username</label> <br />
                            <input type="text" name="user" id="user" value={user} onChange={(e) => setUser(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="passw">Password</label><br />
                            <input type="text" name="passw" id="passw" value={passw} onChange={(e) => setPassw(e.target.value)} />
                        </div>


                        <hr></hr>
                        <input type="checkbox" id="anon" checked={isAnon} onChange={(e) => setIsAnon(!isAnon)} />
                        <span>Log In Anonymous</span><br />
                        <button class="button-login" type="submit" >Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

LoginPage.propTypes = {
    setToken: PropTypes.func.isRequired
}

