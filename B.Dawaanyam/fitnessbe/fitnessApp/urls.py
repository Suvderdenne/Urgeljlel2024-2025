from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.root_view, name='root'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('update_profile/', views.update_profile, name='update_profile'),
    path('delete_profile/', views.delete_profile, name='delete_profile'),
    
    # Food tracking endpoints
    path('add_food/', views.add_food, name='add_food'),
    path('get_recent_foods/', views.get_recent_foods, name='get_recent_foods'),
    path('get_daily_calories/', views.get_daily_calories, name='get_daily_calories'),
    path('search_foods/', views.search_foods, name='search_foods'),
]
