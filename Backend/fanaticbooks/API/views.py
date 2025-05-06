from django.shortcuts import redirect, render

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


   
    

def logout_view(request):
    logout(request)
    return redirect('home')

def message(request):
    pass
class ContactCreateView(generics.CreateAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [AllowAny]  

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




from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserProfileSerializer
from django.contrib.auth.models import User
from .models import Profile
from django.core.exceptions import ValidationError

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    
    # Ensure user has a profile
    profile, created = Profile.objects.get_or_create(user=user)
    
    if request.method == 'GET':
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Check if phone number already exists
        profile_data = request.data.get('profile', {})
        phone = profile_data.get('phone', '')
        
        if phone:
            existing = Profile.objects.filter(phone=phone).exclude(user=user).first()
            if existing:
                return Response(
                    {"profile": {"phone": ["This phone number is already in use."]}},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data)
            except ValidationError as e:
                return Response(e.message_dict, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Book, Rating, Comment
from .serializers import RatingSerializer, CommentSerializer

# --- RATINGS ---

@api_view(['GET'])
def get_book_ratings(request):
    """Get all ratings for a specific book item."""
    book_id = request.query_params.get('book_id')
    if not book_id:
        return Response({"detail": "book_id parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    book = get_object_or_404(Book, id=book_id)
    ratings = Rating.objects.filter(book=book)
    serializer = RatingSerializer(ratings, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_book_rating(request):
    """Create a new rating for a book (authenticated user)."""
    book_id = request.data.get('book')
    if not book_id:
        return Response({"detail": "book ID is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    book = get_object_or_404(Book, id=book_id)
    
    # Create rating data with book and user
    data = request.data.copy()  # Prepare data for serializer
    
    # Check if rating value is valid (1-5)
    rating_value = data.get('value')
    if not rating_value or not (1 <= int(rating_value) <= 5):
        return Response({"detail": "Rating value must be between 1 and 5"}, status=status.HTTP_400_BAD_REQUEST)
        
    # Check if user already rated this book
    existing_rating = Rating.objects.filter(book=book, user=request.user).first()
    if existing_rating:
        # Update existing rating
        existing_rating.value = int(rating_value)
        existing_rating.save()
        serializer = RatingSerializer(existing_rating)
        return Response(serializer.data)
    
    serializer = RatingSerializer(data=data)
    if serializer.is_valid():
        try:
            # Try to save with book and user association
            rating = serializer.save(book=book, user=request.user)
            # Include username in response
            response_data = serializer.data
            response_data['username'] = request.user.username
            return Response(response_data, status=status.HTTP_201_CREATED)
        except IntegrityError:
            # This happens if there's a unique constraint violation
            return Response(
                {"detail": "You have already rated this book. Please try updating your rating instead."},
                status=status.HTTP_400_BAD_REQUEST
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def update_delete_rating(request, rating_id):
    """Update or delete a rating."""
    rating = get_object_or_404(Rating, id=rating_id)
    
    # Only allow users to update/delete their own ratings
    if rating.user != request.user:
        return Response(
            {"detail": "You don't have permission to edit this rating."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if request.method == 'PUT':
        # Validate rating value
        value = request.data.get('value')
        if not value or not (1 <= int(value) <= 5):
            return Response({"detail": "Rating value must be between 1 and 5"}, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = RatingSerializer(rating, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        rating.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# --- COMMENTS ---

@api_view(['GET'])
def get_book_comments(request):
    """Get all comments for a specific book."""
    book_id = request.query_params.get('book_id')
    if not book_id:
        return Response({"detail": "book_id parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    book = get_object_or_404(Book, id=book_id)
    comments = Comment.objects.filter(book=book).order_by('-created_at')
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_book_comment(request):
    """Create a new comment for a book (authenticated user)."""
    book_id = request.data.get('book')
    if not book_id:
        return Response({"detail": "book ID is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    book = get_object_or_404(Book, id=book_id)
    
    # Create comment data with book and user
    data = request.data.copy()
    
    # Validate comment text
    if not data.get('text') or len(data.get('text').strip()) == 0:
        return Response({"detail": "Comment text cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = CommentSerializer(data=data)
    if serializer.is_valid():
        try:
            # Save comment with book and user association
            comment = serializer.save(book=book, user=request.user)
            # Include username in response
            response_data = serializer.data
            response_data['username'] = request.user.username
            return Response(response_data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {"detail": f"Error creating comment: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def update_delete_comment(request, comment_id):
    """Update or delete a comment."""
    comment = get_object_or_404(Comment, id=comment_id)
    
    # Only allow users to update/delete their own comments
    if comment.user != request.user:
        return Response(
            {"detail": "You don't have permission to edit this comment."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if request.method == 'PUT':
        # Validate comment text
        if not request.data.get('text') or len(request.data.get('text').strip()) == 0:
            return Response({"detail": "Comment text cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = CommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
    
    
    
import stripe
from django.conf import settings
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

stripe.api_key = 'sk_test_51RHd9RFLaNcN5JAOvE6EqzpLaQ9drkdjVemkcgei3e1StN6fpJ6x4prRt9je1FfKUvzDJ8qluPBQ4vgxlqig7OCe00zamhZRCq'

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    try:
        cart_items = request.data.get('cartItems', [])
        total_amount = request.data.get('total_amount', 0)

        # Convert NPR to smallest currency unit (paisa)
        amount_in_paisa = int(total_amount * 100)

        # Create line items for Stripe
        line_items = [
            {
                'price_data': {
                    'currency': 'npr',
                    'product_data': {
                        'name': f'Book {item["book_id"]}',
                    },
                    'unit_amount': int(item['price'] * 100),
                },
                'quantity': item['quantity'],
            }
            for item in cart_items
        ]

        # Create checkout session
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url='http://127.0.0.1:3000/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://127.0.0.1:3000/cart',
        )

        return JsonResponse({'sessionId': session.id})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    try:
        cart_items = request.data.get('cartItems', [])
        total_amount = request.data.get('total_amount', 0)
        
        line_items = [
            {
                'price_data': {
                    'currency': 'npr',
                    'product_data': {
                        'name': item.get('book_name', f'Book {item["book_id"]}'),
                    },
                    'unit_amount': int(item['price'] * 100),
                },
                'quantity': item['quantity'],
            }
            for item in cart_items
        ]

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            customer_email=request.user.email,
            metadata={
                'user_id': request.user.id,
                'cart_items': json.dumps(cart_items)
            },
            success_url='http://localhost:5173/cart?payment=success&session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://localhost:5173/cart?payment=cancelled',
        )

        return JsonResponse({'sessionId': session.id})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_payment_details(request):
    session_id = request.GET.get('session_id')
    if not session_id:
        return Response({'error': 'Session ID is required'}, status=400)
    
    try:
        session = stripe.checkout.Session.retrieve(
            session_id,
            expand=['line_items', 'payment_intent.payment_method']
        )
        
        payment_details = {
            'id': session.id,
            'amount_total': session.amount_total,
            'customer_email': session.customer_email,
            'created': session.created,
            'line_items': session.line_items,
            'payment_method_details': {
                'card': {
                    'brand': session.payment_intent.payment_method.card.brand,
                    'last4': session.payment_intent.payment_method.card.last4
                }
            }
        }
        
        return Response(payment_details)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    try:
        Cart.objects.filter(user=request.user).delete()
        return Response({'message': 'Cart cleared successfully'}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=400)