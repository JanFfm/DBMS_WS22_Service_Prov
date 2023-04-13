import React, { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


//display welcome msg on frontpage:
const  FrontPage = (probs) => {
  const [username, setUsername] = useState("");
  const navigate =useNavigate();

  //get user name from backend
  useEffect(() => {    
  const getUserName = async () => {
    try {
      const request = 'http://127.0.0.1:8000/api/getUserName?' + new URLSearchParams({
        user_id: probs.token,
        });
        const res = await axios.get(request,{
          headers: {
             'Content-Type': 'application/json'
          }}) ;
     
          setUsername(res.data.username)

    } catch (error) {
      console.log("error", error); 
      navigate("/error")
  }

  }
  getUserName();
}, [probs, navigate])

return (
  <>
  <h2>Hello {username}!</h2>
  </>
);
}

export default FrontPage;