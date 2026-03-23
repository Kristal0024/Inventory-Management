from django.urls import path
from .views import sign_up, login_view

urlpatterns = [
    path("auth/signup/",sign_up, name="signup"),
    path("auth/login/", login_view, name="login"),
]