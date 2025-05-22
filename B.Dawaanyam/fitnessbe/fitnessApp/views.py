from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import Food, DailyCalories
import json

# Create your views here.

@csrf_exempt
def root_view(request):
    if request.method == 'GET':
        return JsonResponse({
            'message': 'Welcome to Fitness API',
            'endpoints': {
                'register': '/api/register/',
                'login': '/api/login/',
                'logout': '/api/logout/',
                'profile': '/api/profile/',
                'update_profile': '/api/update_profile/',
                'delete_profile': '/api/delete_profile/'
            }
        })
    return JsonResponse({'error': 'Method not allowed'}, status=405)

def handle_options(request):
    response = JsonResponse({})
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
    response["Access-Control-Allow-Credentials"] = "true"
    return response

@csrf_exempt
def register(request):
    if request.method == 'OPTIONS':
        return handle_options(request)
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username', '').strip()
            password = data.get('password', '').strip()
            email = data.get('email', '').strip()

            # Validate username
            if not username:
                return JsonResponse({'error': 'Username is required'}, status=400)
            if len(username) < 3:
                return JsonResponse({'error': 'Username must be at least 3 characters long'}, status=400)
            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already exists'}, status=400)

            # Validate password
            if not password:
                return JsonResponse({'error': 'Password is required'}, status=400)
            if len(password) < 6:
                return JsonResponse({'error': 'Password must be at least 6 characters long'}, status=400)

            # Validate email
            if not email:
                return JsonResponse({'error': 'Email is required'}, status=400)
            if '@' not in email:
                return JsonResponse({'error': 'Invalid email format'}, status=400)
            if User.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email already exists'}, status=400)

            try:
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password
                )
                return JsonResponse({
                    'message': 'User created successfully',
                    'user': {
                        'username': user.username,
                        'email': user.email
                    }
                }, status=201)
            except Exception as e:
                return JsonResponse({'error': f'Error creating user: {str(e)}'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def login_view(request):
    if request.method == 'OPTIONS':
        return handle_options(request)
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            if not username or not password:
                return JsonResponse({'error': 'Username and password are required'}, status=400)

            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                # Generate a token (you might want to use a more secure method in production)
                token = f"Bearer_{user.id}_{int(timezone.now().timestamp())}"
                response = JsonResponse({
                    'message': 'Login successful',
                    'token': token,
                    'username': user.username,
                    'email': user.email
                })
                response["Access-Control-Allow-Origin"] = "*"
                response["Access-Control-Allow-Credentials"] = "true"
                return response
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def logout_view(request):
    if request.method == 'OPTIONS':
        return handle_options(request)
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'message': 'Logged out successfully'})
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
@login_required
def profile(request):
    if request.method == 'OPTIONS':
        return handle_options(request)
    if request.method == 'GET':
        user = request.user
        return JsonResponse({
            'username': user.username,
            'email': user.email,
            'date_joined': user.date_joined
        })
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
@login_required
def update_profile(request):
    if request.method == 'OPTIONS':
        return handle_options(request)
    if request.method == 'PUT':
        data = json.loads(request.body)
        user = request.user
        
        if 'email' in data:
            user.email = data['email']
        if 'password' in data:
            user.set_password(data['password'])
        
        user.save()
        return JsonResponse({'message': 'Profile updated successfully'})
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
@login_required
def delete_profile(request):
    if request.method == 'OPTIONS':
        return handle_options(request)
    if request.method == 'DELETE':
        user = request.user
        user.delete()
        return JsonResponse({'message': 'Profile deleted successfully'})
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
@login_required
def add_food(request):
    if request.method == 'OPTIONS':
        return handle_options(request)
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            food_name = data.get('food_name')
            quantity = data.get('quantity')
            unit = data.get('unit')
            calories = data.get('calories')
            meal_type = data.get('meal_type')
            
            if not all([food_name, quantity, unit, calories, meal_type]):
                return JsonResponse({'error': 'Missing required fields'}, status=400)
            
            # Create new food entry
            food = Food.objects.create(
                user=request.user,
                name=food_name,
                quantity=quantity,
                unit=unit,
                calories=calories,
                meal_type=meal_type
            )
            
            # Update daily calories
            today = timezone.now().date()
            daily_calories, created = DailyCalories.objects.get_or_create(
                user=request.user,
                date=today,
                defaults={'calorie_goal': 2000}
            )
            daily_calories.total_calories += calories
            daily_calories.save()
            
            return JsonResponse({
                'message': 'Food added successfully',
                'food': {
                    'id': food.id,
                    'name': food.name,
                    'quantity': food.quantity,
                    'unit': food.unit,
                    'calories': food.calories,
                    'meal_type': food.meal_type,
                    'date_added': food.date_added
                }
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
@login_required
def get_recent_foods(request):
    if request.method == 'OPTIONS':
        return handle_options(request)
    if request.method == 'GET':
        try:
            recent_foods = Food.objects.filter(user=request.user).order_by('-date_added')[:10]
            
            return JsonResponse({
                'recent_foods': [
                    {
                        'name': food.name,
                        'calories': food.calories,
                        'quantity': food.quantity,
                        'unit': food.unit,
                        'meal_type': food.meal_type,
                        'date_added': food.date_added
                    }
                    for food in recent_foods
                ]
            })
            
        except Exception as e:
            return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
@login_required
def get_daily_calories(request):
    if request.method == 'OPTIONS':
        return handle_options(request)
    if request.method == 'GET':
        try:
            today = timezone.now().date()
            daily_calories, created = DailyCalories.objects.get_or_create(
                user=request.user,
                date=today,
                defaults={'calorie_goal': 2000}
            )
            
            return JsonResponse({
                'total_calories': daily_calories.total_calories,
                'calorie_goal': daily_calories.calorie_goal,
                'remaining_calories': daily_calories.calorie_goal - daily_calories.total_calories
            })
            
        except Exception as e:
            return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
@login_required
def search_foods(request):
    if request.method == 'OPTIONS':
        return handle_options(request)
    if request.method == 'GET':
        try:
            query = request.GET.get('query', '')
            if not query:
                return JsonResponse({'error': 'Search query is required'}, status=400)
            
            # Search in user's food history
            results = Food.objects.filter(
                user=request.user,
                name__icontains=query
            ).distinct().order_by('-date_added')[:10]
            
            return JsonResponse({
                'results': [
                    {
                        'name': food.name,
                        'calories': food.calories,
                        'quantity': food.quantity,
                        'unit': food.unit
                    }
                    for food in results
                ]
            })
            
        except Exception as e:
            return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
