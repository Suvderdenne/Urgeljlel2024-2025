# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('profile/image/', views.update_profile_image, name='update_profile_image'),
    path('profile/', views.get_user_profile, name='get_user_profile'),
]
