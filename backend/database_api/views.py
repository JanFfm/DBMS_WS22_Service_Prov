from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions

from bson import json_util
import re


from .DatabaseAPI import Database
from  .serializers import ServiceSerializer
db = Database()



class GetServices(APIView):
    def get(self, request, *args, **kwargs):
        """get a lsit of service providers with name

        Returns:
            json: service list
        """
        print(request.GET['name'])
        if request.GET['name'] != None:        
            response =  db.get_service_prov(request.GET['name'])
            #if type(response[0]) == list:
            response = response[0]
            
        else:
            response = {"status": "error"}   
        #response = json_util.dumps(response)     
        response =ServiceSerializer(response, many = True).data
        print("response", response)
        return Response(response, status=status.HTTP_200_OK)
    






def getServicesBySector(request):
    """Gets list of services by sector

    Returns:
        json: service list
    """
    try:   
        response =  db.get_service_prov_by_sector(request.GET['sector'][0])
    except:
        response = {"status": "error"}   
    response = json_util.dumps(response)
    return response  
   

class GetServiceById(APIView):
    def get(self, request, *args, **kwargs):
            
        """Gets a service provider by id and aggregats with reviews

        Returns:
            json: service provider
        """
        try:
            response = db.get_service_prov_by_id(int(request.GET['service_id'])) 
            response = list(response)[0]
            ip_hash = {"ip_hash": db.convert_uid(1, request.remote_addr)}
            response.update(ip_hash)
            response = json_util.dumps(response)
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            response = {"status": "error", "message": str(e)}   
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

            
 
def get_star_rating_by_service_id(request):
        """Get all star ratings for a service provider

        Returns:
            Returns:
            json: status msg
        """
        service_id = int(request.GET['service_id'][0])
        ratings  = db.get_star_ratings(service_id)
        ratings_sum = 0
        for i in ratings:
            ratings_sum += i['rating']
        try: 
            rating = ratings_sum/len(ratings)
            return {"rating": rating, "num_ratings": len(ratings)}
        except ZeroDivisionError:
            print(ZeroDivisionError)
            return {"rating": 0, "num_ratings": 0}
        except:
            return {"message": "error"}



def get_star_rating_by_user_id(request):
    """Get star-rating of a certain user
    Returns:
        json: user credentials
    """
    service_id = int(request.GET['s_id'][0])
    user_id =  int(request.GET['user_id'][0])
    rating = db.get_user_rating(user_id, service_id, request.remote_addr)
    return{"rating":rating}


def get_user_name(request):
    """query a user by id

    Returns:
        json: user credentials
    """
    response = db.get_user_by_id(int(request.GET['user_id'][0]))
    print(response)
    return {"username": response['login']}



def addServices(request):
    """Add a new service provider to db

    Returns:
        json: status msg
    """
    keys = ['name', 'street', 'no', 'zip', 'city', 'sector', 'additional_info']
    for k in keys:
        if request.POST[k][0] =='' and k !='additional_info':
            return {"status": "error", "val": k}   
    
    info_dict = dict()
    try:
        try:
            additional_info = request.POST['additional_info'][0].split("~~~")
            for i in additional_info:
                k,v = i.split("|~|")
                info_dict[k] = v
        except:
            pass
        
        result = db.set_service_prov(request.POST['name'][0], {"street":request.POST['street'][0],"number": request.POST['no'][0], "area_code":request.POST['zip'][0],"city":request.POST['city'][0] },request.POST['sector'][0], additional_info=info_dict )
        if result is None:
            return {"status": "Service allready exists"}
        return {"status": "OK", "service_id": result}
    except:
        return {"status": "unable to write to db." }  
    
    
    

def add_review(request):
    """
        adds comments to a service provider
    Returns:
        json: status msg
    """
    try:
        db.add_new_review(int(request.POST['service_id'][0]),int(request.POST['user_id'][0]),request.POST['text'][0])
        return {"status": "OK" }  
    except:
        return {"status": "unable to write to db." }  


    

def add_star_rating_to_service(request):
    """add or update star review to a service provider

    Returns:
        json: status msg
    """
    try:
        user_id = int(request.POST['user_id'][0])
        service_id = int(request.POST['service_id'][0])
        rating = int(request.POST['rating'][0])
        print(user_id, service_id, rating)
        db.add_star_rating(user_id, service_id, rating, request.remote_addr)
        print("done")
        return {
            "status": "OK",            
        }
    except Exception as err:
        return {
            "status": "error",
            "message": str(err)
        }

def update_usefulness_rate(request):
    """update the usefullness rate of a comment
    """
    try:
        r_id = request.POST['r_id'][0]    
        user_id = request.POST['user_id'][0]
        db.update_review_usefulness_rate(int(r_id),int(user_id), request.remote_addr)
        return{"status": "success"}
    except:
        return{"status": "error"}

"""
@website.after_request
def after_request(response):
 
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

"""

def password_insecure(password_candidate:str) -> bool:
    """Checks whether password contains 1 uppercase letter, 1 lower case letter and 1 number.
        Checks whether password is at least 8 characters long.
    """
    password_insecure = False
    if len(password_candidate) > 8 and re.search(r'[0-9]', password_candidate
        )  and re.search(r'[a-z]', password_candidate) and re.search(
            r'[A-Z]', password_candidate):
        password_insecure = False
    else:
        password_insecure = True
    return password_insecure


# routine for adding a new user when they try to register
def add_new_user(request):
    if request.method == 'POST':
        username = str(request.json["user"])
        password = str(request.json["passw"])
        """
        # checking password security:
        if password_insecure(password):
            return jsonify({"user_status": "passw_error"})
        is_user_set = db.set_user(username, password)
        # checking if login name already in use
        if is_user_set:
            return jsonify({"user_status": "success"})
        else:
            return jsonify({"user_status": "name_error"})
        """