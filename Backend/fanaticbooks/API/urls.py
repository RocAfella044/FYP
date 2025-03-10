from django.urls import path

from django.conf import settings
from .views import book_list
from .views import user_signup, user_login,message, Contact
from .views import ContactCreateView
from .views import CartListView, AddToCartView, UpdateCartView, RemoveFromCartView


urlpatterns = [
    path('api/books/', book_list, name="book-list"),
    path("signup/", user_signup, name="signup"),
    path("login/", user_login, name="login"),
    path('message',message,name="message"),
    path('contact/', ContactCreateView.as_view(), name='contact-create'),
    path('api/cart/', CartListView.as_view(), name="cart-list"),
    path('api/cart/add/', AddToCartView.as_view(), name="cart-add"),
    path('api/cart/update/<int:cart_id>/', UpdateCartView.as_view(), name="cart-update"),
    path('api/cart/remove/<int:cart_id>/', RemoveFromCartView.as_view(), name="cart-remove")
    
]

