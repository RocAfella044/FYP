from django.contrib import admin
from .models import *


admin.site.register(Book)
admin.site.register(Genre)
admin.site.register(Contact)
admin.site.register(Cart)
admin.site.register(WishlistItem)
# admin.site.register(Genre)

# Custom Admin classes (optional, but improves admin interface)
class BookAdmin(admin.ModelAdmin):
    list_display = ("book_name", "book_genre", "book_price")
    search_fields = ("book_name", "book_genre__book_genre")
    list_filter = ("book_genre",)

class GenreAdmin(admin.ModelAdmin):
    list_display = ("book_genre",)
    search_fields = ("book_genre",)

class ContactAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "created_at")
    search_fields = ("name", "email")
    list_filter = ("created_at",)

class CartAdmin(admin.ModelAdmin):
    list_display = ("user", "book", "quantity")
    search_fields = ("user__username", "book__book_name")
    list_filter = ("user",)


# Register models with admin panel, handling duplicates
models_with_admin = [
    (Book, BookAdmin),
    (Genre, GenreAdmin),
    (Contact, ContactAdmin),
    (Cart, CartAdmin),
   
   
]

for model, admin_class in models_with_admin:
    try:
        admin.site.register(model, admin_class)
    except admin.sites.AlreadyRegistered:
        pass  # Prevent duplicate registration errors


    
    