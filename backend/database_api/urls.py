from django.urls import path, include
from . import views

urlpatterns = [
    #get requests:
    path("getServices/", views.GetServices.as_view(), name="getServices"),
    path("getServicesBySector/", views.getServicesBySector , name="getServicesBySector"),
    path("getServiceById/", views.GetServiceById.as_view() , name="getServiceById"),
    path("getStarRatingByID/", views.get_star_rating_by_service_id , name="getStarRatingByID"),
    path("getUserRating/", views.get_star_rating_by_user_id , name="getUserRating"),
    path("getUserName/", views.get_user_name , name="getUserName"),    
    #post requests:
    path("addServices/", views.addServices , name="addServices"),
    path("addReview/", views.add_review , name="addReview"),
    path("addStarRating/", views.add_star_rating_to_service , name="addStarRating"),
    path("addUsefullness/", views.update_usefulness_rate , name="addUsefullness"),
    path("add_new_user/", views.add_new_user , name="add_new_user"),
]
