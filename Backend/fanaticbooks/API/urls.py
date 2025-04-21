from django.urls import path, re_path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from django.conf import settings
from .views import book_list
from .views import user_signup, user_login,message
from rest_framework.routers import DefaultRouter
from .views import user_profile
from .views import *



router = DefaultRouter()
router.register(r'cart', CartViewSet, basename='cart')




urlpatterns = [
    path('api/books/', book_list, name="book-list"),
    path("api/books/<int:book_id>/", Getbook.as_view(), name="getbook"),
    path("signup/", user_signup, name="signup"),
    path("login/", user_login, name="login"),
    path('message',message,name="message"),
    path('contact/', ContactCreateView.as_view(), name='contact-create'),
    path('cart/<int:cart_id>/', CartItemDeleteView.as_view(), name='cart-item-delete'),
    path("cart/update/<int:cart_id>/", CartQuantityUpdateView.as_view(), name="cart-update"),
    # path('api/cart/', CartListView.as_view(), name="cart-list"),
    # path('api/cart/add/', AddToCartView.as_view(), name="cart-add"),
    # path('api/cart/update/<int:cart_id>/', UpdateCartView.as_view(), name="cart-update"),
    # path('api/cart/remove/<int:cart_id>/', RemoveFromCartView.as_view(), name="cart-remove"),
    # path('api/new-arrivals/', NewArrivalListView.as_view(), name="new-arrival-list"),
   
    path('api/search/', SearchAPIView.as_view(), name="search"),
    re_path(r'^auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.jwt')),
    path('api/genres/', GenreListView.as_view(), name='genre-list'),
    path('wishlistitem/', WishlistGetApiView.as_view(), name='wishlist-list'),
    path('wishlistitem/<int:pk>/', WishlistApiView.as_view(), name='wishlist-item'),
    # path('wishlistitem/<int:pk>/', WishlistItemDetailView.as_view(), name='wishlist-detail'),
    path('api/user/profile', user_profile, name='user-profile'),
    
    


    
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
]

urlpatterns += router.urls