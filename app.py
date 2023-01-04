import auth
from flask import Flask, render_template, request, redirect, url_for, g, session, flash, jsonify
from DatabaseAPI import Database
from flask_cors import cross_origin #for api-access from react
from bson import json_util

db = Database()
website = Flask(__name__)
website.register_blueprint(auth.auth)
website.secret_key = 'this is a very secret key'


    
@website.route("/")
def show_user(user_name = "user1"):
    user = db.get_user_data(login=user_name, pw=user_name)
    return render_template("test_page.html", data=user)


@website.route("/api/getServices/", methods=['GET'])
@cross_origin(allow_headers=['Content-Type']) # to allow api-access to this route
def getServices():
    if request.values['name'] != None:        
        response =  db.get_service_prov(request.values['name'])
    else:
        response = {"status": "error"}   
    response = json_util.dumps(response)
    return response



@website.route("/api/getServicesBySector/", methods=['GET'])
@cross_origin(allow_headers=['Content-Type']) # to allow api-access to this route
def getServicesBySector():
    if request.values['sector'] != None:        
        response =  db.get_service_prov_by_sector(request.values['sector'])
    else:
        response = {"status": "error"}   
    response = json_util.dumps(response)
    return response  
   
   
   
@website.route("/api/getServiceById/", methods=['GET'])
@cross_origin(allow_headers=['Content-Type']) 
def get_service_by_id():    
    try:
        response = db.get_service_prov_by_id(int(request.values['service_id']))    
        response = json_util.dumps(response)
        return response
    except:
        response = {"status": "error"}   
    
@website.route("/api/getReviewsByID/", methods=['GET'])
@cross_origin(allow_headers=['Content-Type']) 
def get_reviews_by_id():    
    try:
        response = db.get_reviews(int(request.values['service_id']))    
        response = json_util.dumps(response)
        return response
    except:
        response = {"status": "error"}   
    
    


@website.route("/api/addServices/", methods=['POST'])
@cross_origin(allow_headers=['Content-Type']) 
def addServices():
    keys = ['name', 'street', 'no', 'zip', 'city', 'sector']
    for k in keys:
        if request.values[k] =='':
            return {"status": "error", "val": k}   
    
    try:
        result = db.set_service_prov(request.values['name'], {"street":request.values['street'],"number": request.values['no'], "area_code":request.values['zip'],"city":request.values['city'] },request.values['sector'] )
        return {"status": "sucess"}
    except:
        return {"status": "unable to write to db." }  
    
    
    
@website.route("/api/addReview/", methods=['POST'])
@cross_origin(allow_headers=['Content-Type']) 
def add_review():
    try:
        db.add_new_review(int(request.values['service_id']),int(request.values['user_id']),request.values['text'])
        return {"status": "OK" }  
    except:
        return {"status": "unable to write to db." }  


@website.after_request
def after_request(response):
    """Buids request Header for CORS response
    by https://kurianbenoy.com/2021-07-04-CORS/
    Args:
        response (_type_): _description_
    Returns:
        _type_: _description_
    """
    allowed_origins= ['http://127.0.0.1:3000','http://localhost']
    if allowed_origins == "*":
            response.headers['Access-Control-Allow-Origin'] = "*"
    else:
            assert request.headers['Host']
            if request.headers.get("Origin"):
                response.headers["Access-Control-Allow-Origin"]  = request.headers["Origin"]
            else:
                for origin in allowed_origins:
                    if origin.find(request.headers["Host"]) != -1:
                        response.headers["Access-Control-Allow-Origin"] = origin
    return response