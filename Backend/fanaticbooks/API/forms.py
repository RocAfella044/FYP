from django import forms 
from .models import Book

class BookForm(forms.ModelForm):
    
    class Meta:
        model = Book
        fields = ["book_name","book_desc","book_image"]

        labels = {
            'book_name': 'Enter name',
            'book_desc': 'Enter description',
            'book_image': 'Enter book image'
        }
        widgets={"book_name": forms.TextInput(attrs={'class':"forms-control"}),
                 "book_desc": forms.Textarea(attrs={'class':"forms-control form-control-sm"}),
                 "book_image": forms.FileInput(attrs={'class':"forms-control"})
                 }