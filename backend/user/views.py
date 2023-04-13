from django.urls import reverse_lazy
from django.shortcuts import render
from django.views import generic

from .forms import MyUserCreationForm

# Create your views here.
class SignUpPageView(generic.CreateView):
    form_class =MyUserCreationForm
    success_url = reverse_lazy("login")
    template_name = "registration/signup.html"