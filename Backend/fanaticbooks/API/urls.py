from django.urls import path, re_path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from django.conf import settings
from .views import book_list
from .views import user_signup, user_login,message
from rest_framework.routers import DefaultRouter
from .views import user_profile
from .views import *
from . import views



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
   
   
    path('api/search/', SearchAPIView.as_view(), name="search"),
    re_path(r'^auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.jwt')),
    path('api/genres/', GenreListView.as_view(), name='genre-list'),
    path('wishlistitem/', WishlistGetApiView.as_view(), name='wishlist-list'),
    path('wishlistitem/<int:pk>/', WishlistApiView.as_view(), name='wishlist-item'),
    path('api/user/profile', views.user_profile, name='user_profile'),
    
    path('ratings/', views.get_book_ratings, name='get-book-ratings'),
    path('ratings/', views.create_book_rating, name='create-book-rating'),
    path('ratings/<int:rating_id>/', views.update_delete_rating, name='update-delete-rating'),
    
    # Comment URLs
    path('api/current-user/', views.current_user, name='current_user'),
    path('get_book_ratings/', views.get_book_ratings, name='get_book_ratings'),
    path('get_book_comments/', views.get_book_comments, name='get_book_comments'),
    path('create_book_rating/', views.create_book_rating, name='create_book_rating'),
    path('update_delete_rating/<int:rating_id>/', views.update_delete_rating, name='update_delete_rating'),
    path('create_book_comment/', views.create_book_comment, name='create_book_comment'),
    path('update_delete_comment/<int:comment_id>/', views.update_delete_comment, name='update_delete_comment'),
    
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('create-checkout-session/', views.create_checkout_session, name='create-checkout-session'),
    path('get-payment-details/', views.get_payment_details, name='get-payment-details'),
    path('cart/clear/', views.clear_cart, name='clear-cart'),
]

urlpatterns += router.urls