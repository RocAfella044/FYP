from django.shortcuts import redirect, render

# Create your views here.
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Book
from .forms import BookForm
from .serializers import BookSerializer
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth import  authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from .models import Contact
from .serializers import ContactSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import WishlistPostSerializer
from .serializers import CartSerializer
from rest_framework.viewsets import ModelViewSet
from .serializers import CartSerializer






class CartViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request  # Include request context
        return context
    
# views.py
class CartItemDeleteView(APIView):
    def delete(self, request, cart_id):
        try:
            cart_item = Cart.objects.get(id=cart_id, user=request.user)
            cart_item.delete()
            return Response({"message": "Item removed from cart"}, status=status.HTTP_204_NO_CONTENT)
        except Cart.DoesNotExist:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

class CartQuantityUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, cart_id):
        try:
            cart_item = Cart.objects.get(id=cart_id, user=request.user)
        except Cart.DoesNotExist:
            return Response({"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)

        quantity = request.data.get("quantity")
        if quantity is None or int(quantity) < 1:
            return Response({"error": "Invalid quantity"}, status=status.HTTP_400_BAD_REQUEST)

        cart_item.quantity = quantity
        cart_item.save()
        return Response({"message": "Quantity updated", "quantity": cart_item.quantity}, status=status.HTTP_200_OK)


    

#     serializer_class = CartSerializer

#     def get_queryset(self):
#         return Cart.objects.filter(user=self.request.user)

# class AddToCartView(APIView):
#     def post(self, request):
#         book_id = request.data.get("book_id")
#         quantity = request.data.get("quantity", 1)

#         book = get_object_or_404(Book, id=book_id)
#         cart_item, created = Cart.objects.get_or_create(user=request.user, book=book)

#         if not created:
#             cart_item.quantity += quantity
#             cart_item.save()

#         return Response({"message": "Book added to cart"}, status=status.HTTP_201_CREATED)

# class UpdateCartView(APIView):
#     def patch(self, request, cart_id):
#         cart_item = get_object_or_404(Cart, id=cart_id, user=request.user)
#         cart_item.quantity = request.data.get("quantity", cart_item.quantity)
#         cart_item.save()

#         return Response({"message": "Cart updated successfully"}, status=status.HTTP_200_OK)

# class RemoveFromCartView(APIView):
#     def delete(self, request, cart_id):
#         cart_item = get_object_or_404(Cart, id=cart_id, user=request.user)
#         cart_item.delete()

#         return Response({"message": "Item removed from cart"}, status=status.HTTP_204_NO_CONTENT)

class Getbook(APIView):
    def get(self,request, book_id):
        try:
            book = Book.objects.filter(id=book_id)
            serializer = BookSerializer(book, many=True, context={'request': request})
            return Response(serializer.data)
        except Exception as ex:
            return Response({"error": str(ex)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
def user_signup(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            email = data.get("email")
            password1 = data.get("password1")
            password2 = data.get("password2")

            if password1 != password2:
                return JsonResponse({"success": False, "error": "Passwords do not match"}, status=400)

            if User.objects.filter(username=username).exists():
                return JsonResponse({"success": False, "error": "Username already taken"}, status=400)

            if User.objects.filter(email=email).exists():
                return JsonResponse({"success": False, "error": "Email already registered"}, status=400)

            user = User.objects.create_user(username=username, email=email, password=password1)
            user.last_name = ""  # ✅ Explicitly setting last_name to avoid NOT NULL error
            user.save()

            return JsonResponse({"success": True, "message": "Account created successfully!"}, status=201)

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)


@csrf_exempt
def user_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")

            user = authenticate(username=username, password=password)

            if user is not None:
                login(request, user)
                return JsonResponse({"success": True, "token": "dummy-token"}, status=200)  # Token handling is optional
            else:
                return JsonResponse({"success": False, "error": "Invalid credentials"}, status=401)

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)


def handlelogout(request):
    logout(request)
    messages.success(request, "Successfully logged out")
    return redirect('home')

@api_view(['GET', 'POST'])
def book_list(request):
    if request.method == 'GET':
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@login_required        
def Update_book(request,id):
    obj = Book.objects.get(id=id)
    if request.method == "POST":
        upobj = BookForm(request.POST, request.FILES, instance = obj)
        if upobj.is_valid():
            upobj.save()
        else:
            print(upobj.errors)   
        return redirect('home')

    
    form = BookForm(instance = obj)
    context = {'form' : form, 'book' : obj} 
    return render(request, 'create_updatebooks.html',context)

def delete_book(request, id):
    obj=Book.objects.get(id=id)
    obj.delete()
    objs=Book.objects.all()

    context={'books':objs}
    return redirect('home')



def login_view(request):
    if request.method =='POST':
        Username=request.POST.get('Username')
        password=request.POST.get('password')
        user= authenticate(username=Username,
                                password=password)
        
        if user is None:
            messages.info(request,'User not found.')
            return redirect('login')
        else:
            login(request,user)
            return redirect('home')
        
    return render(request,'login.html')

    
    

def signup_view(request):
    if request.method =='POST':
        Username=request.POST.get('Username')
        email=request.POST.get('Email')
        password=request.POST.get('Password')
        password1=request.POST.get('Password1')
        user=user.objects.filter(username=Username)

        

        if user.exists():
            messages.info(request,'User is taken')
            return redirect('signup')
        
        if password == password1:
            user= user.objects.create(username=Username,
                                      email=email,
                                      )
            user.set_password(password)
            user.save()
            return redirect('login')
            
        else:
            messages.info(request,'Password is not matching')


    return render(request,'signup.html')


    # print(request.POST)
    

def logout_view(request):
    logout(request)
    return redirect('home')

def message(request):
    pass
class ContactCreateView(generics.CreateAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [AllowAny]  # Allows non-authenticated users to submit

    def perform_create(self, serializer):
        serializer.save()
        


    
    



class SearchAPIView(APIView):
    def get(self, request):
        query = request.GET.get('query', '')
        print(query)
        if query:
            books = Book.objects.filter(book_name__icontains=query)
            serializer = BookSerializer(books, many=True)
            return Response(serializer.data)
        else:
            return Response({"error": "No search query provided"}, status=status.HTTP_400_BAD_REQUEST)
        
class GenreListView(APIView):
    def get(self, request):
        genres = Genre.objects.values_list('book_genre', flat=True).distinct()
        return Response(genres)
    
from .models import WishlistItem
from .serializers import WishlistItemSerializer


# class WishlistView(generics.ListCreateAPIView):
#     serializer_class = WishlistItemSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return WishlistItem.objects.filter(user=self.request.user)

# def post(self, request, *args, **kwargs):
#     book_id = request.data.get('book')
#     if not book_id:
#         return Response({'error': 'Book ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

#     try:
#         book = Book.objects.get(id=book_id)
#         wishlist_item, created = WishlistItem.objects.get_or_create(
#             user=request.user, 
#             book=book,
#             defaults={
#                 'book_name': book.book_name,
#                 'book_author': book.book_author,
#                 'book_price': book.book_price,
#                 'book_image': book.book_image
#             }
#         )
#         if not created:
#             return Response({'message': 'Book already in wishlist.'}, status=status.HTTP_200_OK)

#         serializer = self.get_serializer(wishlist_item)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     except Book.DoesNotExist:
#         return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)


class WishlistApiView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        try:
            book = get_object_or_404(Book, pk=pk)
            print(book, '''''''''''''''''''''''''''''''''''''''''')
            serialzer = WishlistPostSerializer(data=request.data, context={'request': request})
            serialzer.is_valid(raise_exception=True)
            serialzer.save(user=request.user, book=book)
            return Response({"message": "Book added to wishlist"}, status=status.HTTP_201_CREATED)
    
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        try:
            wishlist_item = WishlistItem.objects.get(book=pk, user=request.user)
            wishlist_item.delete()
            return Response({"message": "Wishlist item deleted"}, status=status.HTTP_204_NO_CONTENT)
        except WishlistItem.DoesNotExist:
            return Response({"error": "Wishlist item not found"}, status=status.HTTP_404_NOT_FOUND)
        
class WishlistGetApiView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk=None):
        if pk:
            item = get_object_or_404(WishlistItem, pk=pk, user=request.user)
            serializer = WishlistItemSerializer(item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            items = WishlistItem.objects.filter(user=request.user)
            serializer = WishlistItemSerializer(items, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

# class WishlistItemDetailView(generics.RetrieveUpdateDestroyAPIView):
#     serializer_class = WishlistItemSerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         return WishlistItem.objects.filter(user=self.request.user)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import UserProfileSerializer
from .models import Profile
from django.contrib.auth.models import User

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user

    if request.method == 'GET':
        # Return current user profile data
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Update user profile data
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()  # Save the updated user information
            # Also update the Profile model if there are additional fields like phone/address
            profile_data = request.data.get('profile', {})
            profile, created = Profile.objects.get_or_create(user=user)
            if 'phone' in profile_data:
                profile.phone = profile_data['phone']
            if 'address' in profile_data:
                profile.address = profile_data['address']
            profile.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=400)


import json
from django.shortcuts import redirect, render
import uuid
import requests
# Create your views here.
def home(request):
    id = uuid.uuid4()
    print(id)
    return render(request,'myapp/index.html',{'uuid':id})

def initkhalti(request):
    url = "https://a.khalti.com/api/v2/epayment/initiate/"
    return_url = request.POST.get('return_url')
    website_url = request.POST.get('return_url')
    amount = request.POST.get('amount')
    purchase_order_id = request.POST.get('purchase_order_id')


    print("url",url)
    print("return_url",return_url)
    print("web_url",website_url)
    print("amount",amount)
    print("purchase_order_id",purchase_order_id)
    payload = json.dumps({
        "return_url": return_url,
        "website_url": website_url,
        "amount": amount,
        "purchase_order_id": purchase_order_id,
        "purchase_order_name": "test",
        "customer_info": {
        "name": "Bibek Dahal",
        "email": "test@khalti.com",
        "phone": "9800000001"
        }
    })

    # put your own live secet for admin
    headers = {
        'Authorization': 'key b885cd9d8dc04eebb59e6f12190aoo90',
        'Content-Type': 'application/json',
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    print(json.loads(response.text))

    print(response.text)
    new_res = json.loads(response.text)
    # print(new_res['payment_url'])
    print(type(new_res))
    return redirect(new_res['payment_url'])
    return redirect("home")

def verifyKhalti(request):
    url = "https://a.khalti.com/api/v2/epayment/lookup/"
    if request.method == 'GET':
        headers = {
            'Authorization': 'key b885cd9d8dc04eebb59e6f12190ae017',
            'Content-Type': 'application/json',
        }
        pidx = request.GET.get('pidx')
        data = json.dumps({
            'pidx':pidx
        })
        res = requests.request('POST',url,headers=headers,data=data)
        print(res)
        print(res.text)

        new_res = json.loads(res.text)
        print(new_res)
        

        if new_res['status'] == 'Completed':
            # user = request.user
            # user.has_verified_dairy = True
            # user.save()
            # perform your db interaction logic
            pass
        
        # else:
        #     # give user a proper error message
        #     raise BadRequest("sorry ")

        return redirect('home')
    

        