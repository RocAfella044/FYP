from django.db import models
from django.contrib.auth.models import User

class Genre(models.Model):
    book_genre = models.CharField(max_length=40, null=True)

    def __str__(self):
        return self.book_genre

class Book(models.Model):
    # user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    book_name = models.CharField(max_length=40)
    book_author = models.CharField(max_length=40, null=True, blank=True)
    book_desc = models.TextField(blank=True, null=True)
    book_genre = models.ForeignKey(Genre, on_delete=models.CASCADE, null=True, blank=True, default=None)
    book_price = models.IntegerField(null=True, blank=True)
    book_image = models.ImageField(upload_to='book_images', null=True, blank=True)

    def __str__(self):
        return self.book_name

class Contact(models.Model):
    # user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Message from {self.name}'

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    

    def __str__(self):
        return f"{self.user.username} - {self.book.book_name} ({self.quantity})"
    



class WishlistItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, null=True, blank=True)
    book_name = models.CharField(max_length=40, null=True, blank=True)
    book_author = models.CharField(max_length=40, null=True, blank=True)
    book_price = models.IntegerField(null=True, blank=True)
    book_image = models.ImageField(upload_to='book_images', null=True, blank=True)

    def __str__(self):
     return self.book_name if self.book_name else f"Wishlist item {self.id}"

