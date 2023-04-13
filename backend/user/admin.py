from django.contrib import admin

# Register your models here.
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .forms import MyUserCreationForm, MyUserChangeForm

User = get_user_model()

class MyUserAdmin(UserAdmin):
    add_form = MyUserCreationForm
    change_form = MyUserChangeForm
    model = User
    list_display = [
        'email',
        'username',
        'is_superuser'
    ]
    
admin.site.register(User, MyUserAdmin)