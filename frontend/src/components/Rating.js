import * as React from "react";
import {BlackStar, WhiteStar, HalfStar} from "./Stars"
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//displays star-rating:
const Rating = (probs) => {
    const [rating, setRating] = useState(0);    
    const navigate = useNavigate();

    //get rating:
    useEffect(() => {
        //on servie page, the rating will be part of probs:
        if (probs.hasOwnProperty('ratings')){
                            var s = 0;
                            try{
                                var divisor = probs.ratings.length;
                                if (divisor> 0){
                                    var ratings = probs.ratings;
                                    ratings = ratings.map((val) => val.rating )
                                    ratings = ratings.reduce((a, b) => a + b, 0);
                                    s = ratings / divisor;
                                }
                            }
                            catch (error){
                                navigate("/error")

                            }

                            setRating(s);}
        //otherwise, we get it from the api:
        else{
            const fetchRatings = async () => {
                try {
                    const request = 'http://127.0.0.1:8000/api/getStarRatingByID?' + new URLSearchParams({
                                    service_id: probs.service_id})
        
                                    console.log("Api request: ", request);
                    const res = await axios.get(request,{
                                        headers: {
                                           'Content-Type': 'application/json'
                                        }}) ;
                                   
                setRating(res.data.rating)                      
                                    }      
                catch (error){
                    navigate("/error")
                }
            
                
            }
            fetchRatings(); 


        }
    }, [probs, navigate])
    
    try {
            if (rating === 0){
                return <>no ratings given</>
            }
            //build a list of five stars according to the rating:
            const stars = parseInt(rating); //number of full stars

            var wStars = 5 -stars; //number of empty stars
            var halfStar = 0;
            //chekc if a half star should be displayed:
            if (rating - stars >= 0.5){
                halfStar = 1; 
                wStars =wStars -1;
            }
            const BStarMap = Array(stars).fill(0); 
            const HStarMap = Array(halfStar).fill(0); 
            const WStarMap = Array(wStars).fill(0);     
            //expected output on service page:
            try{
            return <>
            {BStarMap.map((item,index)=>{return <span key={index}><BlackStar /></span>})}
            {HStarMap.map((item,index)=>{return <span key={index}><HalfStar /></span>})}
            {WStarMap.map((item,index)=>{return <span key={index}><WhiteStar /></span>})}
            <p ><small>{probs.ratings.length} user(s) rated.</small></p>
            </>
            }
            //expected output by result list:
            catch (error){
                return <>
                {BStarMap.map((item,index)=>{return <span key={index}><BlackStar /></span>})}
                {HStarMap.map((item,index)=>{return <span key={index}><HalfStar /></span>})}
                {WStarMap.map((item,index)=>{return <span key={index}><WhiteStar /></span>})}
                </>
            }
           
            
       
            
            
          
           

        }
    //output if no ratings a given:
    catch (error){
        console.log(error)
        return <>No ratings</>
    }}
export default Rating