import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//form to wirte comments for service provider
const WriteComment =(probs) =>{
    const navigate =useNavigate()
    //save comment text
    const [comment, setComment] = useState({
        commentText:""
      });
    const changeHandler = (e) =>{

                setComment(prev=>({...prev, [e.target.name]: e.target.value }))
                

      };
      //push comment to backend
    const clickHander = async(e) =>{
        e.preventDefault();    
        if (comment.commentText !== ""){
        try {
            const request = 'http://127.0.0.1:8000/api/addReview?' + new URLSearchParams({
                text: comment.commentText,     
                service_id: probs.service_id,
                user_id: probs.user_id 
                });
                console.log(request)
                document.getElementById("commentInputfield").value="";
              const respone = await axios.post(request);
              console.log(respone);
              probs.switch()
              //window.location.reload();

        }
        catch (error) {
            console.log(error);
            navigate("/error")
        }
      }
    }
    //comment writing form:
    return    <>      
    <h3>Write a new comment:</h3>
    
      <form>
      <Container className="Form">
      <Row>
        <Col md={4}>
      <input class="form-control" id="commentInputfield"type="text" name="commentText" required onChange={changeHandler}/></Col><Col><Button variant="btn btn-secondary" type="submit" onClick={clickHander}>Send</Button></Col>
      </Row>
    </Container>
    
    </form>

    </> 

}

export default WriteComment;