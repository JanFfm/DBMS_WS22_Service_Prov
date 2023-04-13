import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AddService = () => {
  const navigate = useNavigate()

  //save form state:
  const [Service, setService] = useState({
    name: "", sector: "", street: "", no: "", city: "", zip: "",additionalInfo: []
  });
  const [exists, setExists] = useState(false)  //to display status msg if user adds an existing provider



  //handles form state
  const changeHandler = (e) => {
    setService(prev => ({ ...prev, [e.target.name]: e.target.value }))
    console.log(Service)

  };

  //push new service to backend:
  const clickHander = async (e) => {
    e.preventDefault();

    try {
      //cleans list of additional infos and create info string:
      var additionalInfo_cleaned = Service.additionalInfo.filter((elem) => {return elem.name !== "" && elem.value !== ""});
      additionalInfo_cleaned = additionalInfo_cleaned.map((elem) =>{
        return String(elem.name) + "|~|" + String(elem.value)

      }).join('~~~');

      const request = 'http://127.0.0.1:8000/api/addServices?' + new URLSearchParams({
        name: Service.name,
        sector: Service.sector,
        street: Service.street,
        no: Service.no,
        city: Service.city,
        zip: Service.zip,
        additional_info: additionalInfo_cleaned
      });
      console.log(request)
      const response = await axios.post(request);
      console.log(response.data);
      if (response.data.status === "Service allready exists") {
        console.log(exists)

        setExists(true);
        console.log(exists)
      }
      else {
        setExists(false);
        if (response.data.status === "OK")
          try {
            const link = "/service/" + response.data.service_id
            navigate(link);
          }
          catch (error) {

          }
      }
    } catch (error) {
      console.log(error);
      navigate("/error")

    }

  }

  //Build fields for additional infos and set state:
  const addFieldChangeHandler = (event) =>{

      var index =  event.target.id.split("_")[1]
      console.log(index, event.target.name)
      if (Service.additionalInfo[index] === undefined){
        Service.additionalInfo[index] = {id:index, name: "", value: ""}
      } 

      if (event.target.name ==="Fieldname"){
        Service.additionalInfo[index].name = event.target.value;        
      }
      else{
        Service.additionalInfo[index].value = event.target.value;   
      }
      setService(Service)

      console.log(Service.additionalInfo)
      
      
  }
  //remove additional info field as onClick-method:
  const removeField = (event) =>{
    event.preventDefault();
    var index =  event.target.id.split("_")[2]
    console.log("formgroup_"+ index)
    try {
      Service.additionalInfo[index].name = "";
      Service.additionalInfo[index].value = "";
    }
    catch (error){

    }
    setService(Service)
    document.getElementById("formgroup_"+ index).remove()

  }

  //dynamic fields for additional infos:  
  const [fields, setFields] = useState(0);
  const fieldList = []; // as a state var?
  for (let i=0; i<fields; i++){
      
      fieldList.push(<Form.Group key={i} onChange={addFieldChangeHandler} id={"formgroup_"+i}><span><Form.Control type="text" num={i} placeholder="Fieldname" name="Fieldname" id={"additinalNameField_"+i} required  /><Form.Control id={"additinalValueField_"+i} type="text" placeholder="Value" name="value" required />
    <Button  id={"delete_utton_"+i} variant="btn btn-light" onClick={removeField}>Remove field</Button></span>

    <br/><br/></ Form.Group >)
      }


  return (
    <Container>
      <Row>
        <h2>Add a new service</h2>
      </Row>
      <Row className="Form">
        <Form onSubmit={clickHander}>
          <Form.Group className="mb-3" controlId="formName">

            <Col md={4}>
              <Form.Control type="text" placeholder="Name" name="name" required onChange={changeHandler} />
            </Col>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formName">
            <Col md={4}>
              <Form.Control type="text" placeholder="Sector" name="sector" required onChange={changeHandler} />
            </Col>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formName">
            <Col md={4}>
              <Form.Control type="text" placeholder="Street" name="street" required onChange={changeHandler} />
            </Col>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formName">
            <Col md={4}>
              <Form.Control type="number" placeholder="Street number" name="no" min="0" required onChange={changeHandler} />

            </Col>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formName">

            <Col md={4}>
              <Form.Control type="text" placeholder="City" name="city" required onChange={changeHandler} />
            </Col>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formName">

            <Col md={4}>
              <Form.Control type="number" placeholder="ZIP code" name="zip" min="0" required onChange={changeHandler} />
            </Col>
          </Form.Group>

            <Col md={4}>

            {fieldList}

            <Form.Group className="mb-3" controlId="formName">
            <Button variant="btn btn-secondary" onClick={() =>{setFields(fields + 1)}}>Add a new field</ Button >
            </Form.Group>

            </Col>
  
          <Form.Group className="mb-3" controlId="formName">

            <Col md={4}>
              <Button type="submit" variant="btn btn-secondary" >Add to database</Button>
            </Col>
          </Form.Group>
        
        </Form>
        {exists && <b>This service already exists.</b>}
      </Row>


    </Container>
  );
}

export default AddService;