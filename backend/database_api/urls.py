from django.urls import path, include
from . import views

urlpatterns = [
    #get requests:
    path("getServices/", views.GetServices.as_view(), name="getServices"),
    path("getServicesBySector/", views.GetServiceBySector.as_view() , name="getServicesBySector"),
    path("getServiceById/", views.GetServiceById.as_view() , name="getServiceById"),
    path("getStarRatingByID/", views.GetStarRatingByServiceID.as_view() , name="getStarRatingByID"),
    path("getUserRating/", views.GetStarRatingByUserID.as_view() , name="getUserRating"),
    path("getUserName/", views.GetUserName.as_view() , name="getUserName"),    
    #post requests:
    path("addServices/", views.AddService.as_view() , name="addServices"),
    path("addReview/", views.AddReview.as_view() , name="addReview"),
    path("addStarRating/", views.AddStarRatingToService.as_view() , name="addStarRating"),
    path("addUsefullness/", views.UpdateUsefullnessRate.as_view() , name="addUsefullness"),
    path("add_new_user/", views.AddNewUser.as_view() , name="add_new_user"),
]
