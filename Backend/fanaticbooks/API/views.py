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
from .models import Book, Cart, Trending
from .serializers import CartSerializer
from rest_framework.viewsets import ModelViewSet
from .serializers import CartSerializer
from .serializers import TrendingSerializer
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
        
from .models import NewArrival
from .serializers import NewArrivalSerializer

class NewArrivalListView(generics.ListAPIView):
    queryset = NewArrival.objects.all().order_by('-arrival_date')
    serializer_class = NewArrivalSerializer

class AddNewArrivalView(APIView):
    def post(self, request):
        serializer = NewArrivalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "New Arrival added!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TrendingListView(generics.ListAPIView):
    queryset = Trending.objects.all().order_by('-arrival_date')
    serializer_class = TrendingSerializer

class AddTrendingView(APIView):
    def post(self, request):
        serializer = TrendingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Trending added!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

