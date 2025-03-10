from rest_framework import serializers
from .models import Book, Genre, Contact, Cart

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['book_genre']

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

class CartSerializer(serializers.ModelSerializer):
    book = BookSerializer()

    class Meta:
        model = Cart
        fields = ['id', 'book', 'quantity']
