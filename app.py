from flask import Flask, render_template, request, redirect, url_for, g, session, flash, jsonify
from DatabaseAPI import Database
from flask_cors import cross_origin #for api-access from react

db = Database()
website = Flask(__name__)



@website.route("/")
def show_user(user_name = "user1"):
    user = db.get_user_data(login=user_name, pw=user_name)
    return render_template("test_page.html", data=user)


@website.route("/api/getServices/", methods=['GET'])
@cross_origin(allow_headers=['Content-Type']) # to allow api-access to this route
def getServices():
    if request.values['name'] != None:
        name = request.values['name']
    else:
        name = "error"
    if request.values['name'] != None:
        sector = request.values['sector']
    else:
        sector="error"
    response = jsonify({'name': name, 'sector':sector})
    #response.headers.add('Access-Control-Allow-Origin', '*')
    return response


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