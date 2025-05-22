"""
URL configuration for kioskBack project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from kioskapp.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', kiosk_login, name="kiosk_login"),
    path('kiosk/guilgee/', guilgee_view, name='guilgee'),
    path('kiosk/logout/', kiosk_logout, name='kiosk_logout'),
    path('kiosk/orlogo/', kiosk_orlogo, name='kiosk_orlogo'),
    path('kiosk/zarlaga/', kiosk_zarlaga, name='kiosk_orlogo'),
    path('kiosk/khuulga/', kiosk_khuulga, name='kiosk_khuulga'),
    path('kiosk/uldegdel/', kiosk_dansuldegdel, name='kiosk_dansuldegdel'),
    # path('kiosk/sendpdf/', kiosk_sendkhuulgapdf, name='kiosk_sendkhuulgapdf'),
    path('kiosk/recipient/', recipient_info_view),
    path('kiosk/account-info/', account_info_view),
]
