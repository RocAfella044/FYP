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

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError

def validate_unique_phone(value):
    if value and Profile.objects.filter(phone=value).exists():
        raise ValidationError("This phone number is already in use.")
    return value

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, blank=True, validators=[validate_unique_phone])
    address = models.TextField(blank=True)

    def __str__(self):
        return f'{self.user.username} Profile'

    def save(self, *args, **kwargs):
        # Check for phone uniqueness only when the phone field has a value
        if self.phone:
            existing = Profile.objects.filter(phone=self.phone).exclude(user=self.user).first()
            if existing:
                raise ValidationError({"phone": "This phone number is already in use."})
        super().save(*args, **kwargs)

# Signal to create profile when a user is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

# Signal to save profile when user is saved
@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    try:
        instance.profile.save()
    except Profile.DoesNotExist:
        # Create profile if it doesn't exist
        Profile.objects.create(user=instance)
    
    
class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='ratings')
    value = models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'book')  # A user can only rate a book once
        
    def __str__(self):
        return f"{self.user.username} rated {self.book.book_name} {self.value}/5"

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Comment by {self.user.username} on {self.book.book_name}"
    
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Return the current authenticated user's details."""
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email,  # Add other fields as needed
        'id': user.id
    })