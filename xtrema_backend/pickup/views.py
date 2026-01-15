from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import PickupRequest, UserLogin
from .serializers import PickupSerializer, UserLoginSerializer
from .utils import export_pickup_to_csv, export_login_to_csv


@api_view(['POST'])
def user_login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"status": "error", "message": "Email and password required"}, status=400)

    # Check if user exists
    user = UserLogin.objects.filter(email=email).first()
    
    if user:
        # If user exists, just authenticate (in production use proper password hashing)
        if user.password == password:
            export_login_to_csv()
            return Response({
                "status": "success",
                "message": "Login successful",
                "user_id": user.id,
                "email": user.email
            })
        else:
            return Response({"status": "error", "message": "Invalid password"}, status=401)
    else:
        # Create new user if doesn't exist (sign-up on first login)
        serializer = UserLoginSerializer(data={'email': email, 'password': password})
        if serializer.is_valid():
            user = serializer.save()
            export_login_to_csv()
            return Response({
                "status": "success",
                "message": "User registered successfully",
                "user_id": user.id,
                "email": user.email
            })
        return Response(serializer.errors, status=400)


@api_view(['POST'])
def create_pickup(request):
    data = request.data.copy()

    # Calculate points based on plastic contribution
    plastic = float(data.get('plastic_kg', 0))
    data['total_points'] = int(plastic * 20)

    serializer = PickupSerializer(data=data)
    if serializer.is_valid():
        serializer.save()

        # Export to CSV
        export_pickup_to_csv()

        return Response({
            "status": "success",
            "points": data['total_points'],
            "message": "Pickup scheduled successfully"
        })

    print("Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=400)


