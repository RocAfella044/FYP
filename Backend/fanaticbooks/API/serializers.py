from rest_framework import serializers
from .models import *


# class BookSerializer(serializers.ModelSerializer):
#     book_genre = serializers
#     class Meta:
#         model = Book
#         fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    book_genre = serializers.CharField(source='book_genre.book_genre', read_only=True)

    class Meta:
        model = Book
        fields = '__all__'


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'


class CartSerializer(serializers.ModelSerializer):from rest_framework import serializers
from .models import Book, Genre, Contact, Cart


# class BookSerializer(serializers.ModelSerializer):
#     book_genre = serializers
#     class Meta:
#         model = Book
#         fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    book_genre = serializers.CharField(source='book_genre.book_genre', read_only=True)

    class Meta:
        model = Book
        fields = '__all__'


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'


class CartSerializer(serializers.ModelSerializer):
    book_name = serializers.CharField(source='book.book_name', read_only=True)
    book_price = serializers.IntegerField(source='book.book_price', read_only=True)
    book_author = serializers.CharField(source='book.user.username', read_only=True)  
    book_image = serializers.ImageField(source='book.book_image', read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'book','book_image', 'book_name', 'book_price', 'book_author', 'quantity']

    def create(self, validated_data):
        user = self.context['request'].user
        Cart.objects.create(user=user, **validated_data)
        return validated_data


class WishlistPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = WishlistItem
        fields = ['id', 'book']
    
    def create(self, validated_data):
        user = validated_data.pop('user')
        book = validated_data.pop('book')
        wishlist_item = WishlistItem.objects.create(user=user, book=book, **validated_data)
        return wishlist_item


class WishlistItemSerializer(serializers.ModelSerializer):
    book_name = serializers.CharField(source='book.book_name')
    book_image = serializers.ImageField(source='book.book_image', allow_null=True)
    book_price = serializers.DecimalField(source='book.book_price', max_digits=10, decimal_places=2)
    book_author = serializers.CharField(source='book.book_author', allow_null=True)
    
    class Meta:
        model = WishlistItem
        fields = ['id', 'book', 'book_name', 'book_image', 'book_price', 'book_author']

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']
    
    # Allow updating fields that are normally read-only
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
