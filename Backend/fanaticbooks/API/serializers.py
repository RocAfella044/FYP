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
from .models import Book, Genre, Contact, Cart, NewArrival, Trending


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


class NewArrivalSerializer(serializers.ModelSerializer):
    book_genre_name = serializers.CharField(source='book_genre.book_genre', read_only=True)

    class Meta:
        model = NewArrival
        fields = ['id', 'book_name', 'book_desc', 'book_genre', 'book_genre_name', 'book_price', 'book_image', 'arrival_date']

class TrendingSerializer(serializers.ModelSerializer):
    book_genre_name = serializers.CharField(source='book_genre.book_genre', read_only=True)

    class Meta:
        model = Trending
        fields = ['id', 'book_name', 'book_desc', 'book_genre', 'book_genre_name', 'book_price', 'book_image', 'arrival_date']


    class Meta:
        model = Cart
        fields = ['id', 'book', 'quantity']

    def create(self, validated_data):
        user = self.context['request'].user
        Cart.objects.create(user=user, **validated_data)
        return validated_data
    


class NewArrivalSerializer(serializers.ModelSerializer):
    book_genre_name = serializers.CharField(source='book_genre.book_genre', read_only=True)

    class Meta:
        model = NewArrival
        fields = ['id', 'book_name', 'book_desc', 'book_genre', 'book_genre_name', 'book_price', 'book_image', 'arrival_date']

class TrendingSerializer(serializers.ModelSerializer):
    book_genre_name = serializers.CharField(source='book_genre.book_genre', read_only=True)

    class Meta:
        model = Trending
        fields = ['id', 'book_name', 'book_desc', 'book_genre', 'book_genre_name', 'book_price', 'book_image', 'arrival_date']


class WishlistItemSerializer(serializers.ModelSerializer):
    book_name = serializers.CharField(source='book.book_name')
    book_image = serializers.ImageField(source='book.book_image', allow_null=True)
    book_price = serializers.DecimalField(source='book.book_price', max_digits=10, decimal_places=2)
    
    class Meta:
        model = WishlistItem
        fields = ['id', 'book', 'book_name', 'book_image', 'book_price']
