import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
    Link,
    useParams,
    useNavigate
  } from "react-router-dom";

import Rating from "../components/Rating"  
import DetailsButton from "../components/DetailsButton"  
import FuzzyWordsList from "../components/FuzzyWordList"


//shows a list of search results
const GetServices = () =>{
    const navigate =useNavigate()

    const {type, keyword} = useParams(); //given params to perform query
    const [services, setServices] = useState([]); //Database response
    console.log(type, keyword)

    //api request:
    useEffect(() => {
            const fetchAllServices = async () => {
                try {
                    var request = ""
                    if (type==="name"){
                        request = 'http://127.0.0.1:8000/api/getServices?' + new URLSearchParams({
                            name: keyword,
                            });                    
                    }

                    else if (type==="sector") {
                        request = 'http://127.0.0.1:8000/api/getServicesBySector?' + new URLSearchParams({
                            sector: keyword,
                            });

                        }
         
                    console.log("Api request: ", request);
                    const res = await axios.get(request,{
                        headers: {
                           'Content-Type': 'application/json'
                        }}) ;

                    console.log("res", res)
                    setServices(res.data)}                    
                     
                 catch (error) {
                    console.log("error", error); 
                    navigate("/error")

                }

            }
            fetchAllServices();
    },[type, keyword, navigate] ); 


    //show result list:
    try{  
            return <div>
                <h1>Your results for the {type} "{keyword}":</h1>
                <br />
                <div>
                <table class="table table-striped">
                    <thead  class="thead-light">
                        <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Sector</th>
                        <th>Address</th>
                        <th>Rating</th>
                        <th></th>
                        </tr>
                </thead>
                <tbody>
                {services.data[0].map((s) =><tr><td>{s.sid}</td><td>{s.name}</td><td>{s.sector}</td><td>{s.address[0].street} {s.address[0].number}, {s.address[0].city}</td><td><Rating service_id={s.sid}/></td><td><DetailsButton id={s.sid}/></td></tr>  )}
                </tbody>
                </table>
                </div> 
                </div>
    }
    //if no nersices found, show error msg and similar keywords
    catch (error) {
        console.log(error)
        console.log(typeof services)
        return <><h2>No services found</h2>
        <FuzzyWordsList queryType={type} response={services.data}></FuzzyWordsList>
        <br /><br />
        <p><Link to ="/search"><button type="button" class="btn btn-secondary">Go back</button></Link>   <Link to ="/addService"><button type="button" class="btn btn-secondary">Create a new service</button></Link><br />
        </p> </>
    }
    }
export default GetServices;
