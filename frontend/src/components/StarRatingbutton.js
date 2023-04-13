//implemented according to https://dev.to/michaelburrows/create-a-custom-react-star-rating-component-5o6
import "./StarRating.css"
import React, { useState, useEffect } from "react";
import axios from "axios";
import {ChangableStar} from "./Stars"
import { useNavigate } from "react-router-dom";

const StarRatingButton = (probs) =>{
    const navigate =useNavigate()

    const serviceId = probs.serviceId;
    //store rating from actual user:
    const [rating, setRating] = useState(0);
    //store hover position:
    const [hover, setHover] = useState(0);

    //get rating given by user from backend:
    useEffect(() => {

      const getUserRating = async () => {
          try {
              const request = 'http://127.0.0.1:8000/api/getUserRating?' + new URLSearchParams({
              user_id: probs.user_id,
              s_id: probs.serviceId
              });
              console.log("Api request: ", request);
              const res = await axios.get(request,{
                  headers: {
                     'Content-Type': 'application/json'
                  }}) ;
                  console.log("rating", res.data.rating)
                  setRating(res.data.rating)
          } catch (error) {
              console.log("error", error); 
              navigate("/error")
          }

      }
      getUserRating();
    },[probs.user_id, probs.serviceId,navigate] )


    //save new rating to backend:
    const StarClickhandler = async (index) =>{
        setRating(index);
        console.log(hover)
        try {
            const request = 'http://127.0.0.1:8000/api/addStarRating/?' + new URLSearchParams({
                user_id: probs.user_id, 
                service_id: serviceId,
                rating: hover
              });
            const res = await axios.post(request);
            console.log("rating response", res.data)
            probs.switch()

            }
        catch (error){
            console.log(error);
            navigate("/error")        
    }

    }
    //build row of 5 stars to give rating:
    return (
      <div className="star-rating">
        <b>Make a rating:</b>
        {[...Array(5)].map((star, index) => {
          index += 1;
          return (
            
            <button 
            type="button"
              key={index }
              className={index <= (hover || rating) ? "btn btn-link on" : "btn btn-link off"}
              onClick={() => StarClickhandler(index)}
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(rating)}
            >
             <ChangableStar />
            </button>
          );
        })}
      </div>
    );
}

export default StarRatingButton;