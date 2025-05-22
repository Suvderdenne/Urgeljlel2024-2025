from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate

from .models import *

# 👤 CustomUser Serializer
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
        read_only_fields = ['avatar_base64']

    def validate_username(self, value):
        # Check if username is already taken
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Хэрэглэгчийн нэр аль хэдийнэ бүртгэгдсэн байна.")
        return value


# 🎨 Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['icon_base64']


# 👩‍🎤 Artist Serializer
class ArtistSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    class Meta:
        model = Artist
        fields = ['id', 'name', 'bio', 'category', 'category_id', 'profile_picture', 'profile_picture_base64','price', 'is_verified']
        read_only_fields = ['profile_picture_base64']


# 🖼️ Artwork Serializer
class ArtworkSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only=True)
    artist_id = serializers.PrimaryKeyRelatedField(
        queryset=Artist.objects.all(), source='artist', write_only=True
    )

    class Meta:
        model = Artwork
        fields = ['id', 'artist', 'artist_id', 'title', 'description', 'image', 'image_base64', 'price', 'date_created']
        read_only_fields = ['image_base64', 'date_created']


# 📅 Event Serializer
class EventSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'image', 'image_base64', 'location', 'latitude', 'longitude', 'date',
                  'created_at', 'category', 'category_id', 'status']
        read_only_fields = ['image_base64', 'created_at', 'status']


# 👥 Event Organizer Serializer
class EventOrganizerSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    event_id = serializers.PrimaryKeyRelatedField(
        queryset=Event.objects.all(), source='event', write_only=True
    )

    class Meta:
        model = EventOrganizer
        fields = ['id', 'event', 'event_id', 'name', 'logo', 'logo_base64', 'website', 'is_verified']
        read_only_fields = ['logo_base64']


# 🎟️ Ticket Category Serializer
class TicketCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketCategory
        fields = '__all__'


# 🎟️ Ticket Type Serializer
class TicketTypeSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    event_id = serializers.PrimaryKeyRelatedField(
        queryset=Event.objects.all(), source='event', write_only=True
    )
    category = TicketCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=TicketCategory.objects.all(), source='category', write_only=True, allow_null=True
    )

    class Meta:
        model = TicketType
        fields = ['id', 'name', 'subtitle', 'price', 'discount_price', 'discount_until', 'event', 'event_id',
                  'description', 'category', 'category_id']

class TicketTypeSerializer(serializers.ModelSerializer):
    event_name = serializers.CharField(source='event.name', read_only=True)

    class Meta:
        model = TicketType
        fields = ['id', 'name', 'price', 'discount_price', 'discount_until', 'event', 'event_name']

# 📋 Event Detail Serializer
class EventDetailSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    event_id = serializers.PrimaryKeyRelatedField(
        queryset=Event.objects.all(), source='event', write_only=True
    )
    ticket_type = TicketTypeSerializer(read_only=True)
    ticket_type_id = serializers.PrimaryKeyRelatedField(
        queryset=TicketType.objects.all(), source='ticket_type', write_only=True, allow_null=True
    )

    class Meta:
        model = EventDetail
        fields = ['id', 'event', 'event_id', 'ticket_type', 'ticket_type_id', 'price', 'description']


# ⭐ Artist Review Serializer
class ArtistReviewSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only=True)
    artist_id = serializers.PrimaryKeyRelatedField(
        queryset=Artist.objects.all(), source='artist', write_only=True
    )
    user = CustomUserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), source='user', write_only=True
    )

    class Meta:
        model = ArtistReview
        fields = ['id', 'artist', 'artist_id', 'user', 'user_id', 'rating', 'comment']


# ⭐ Event Review Serializer
class EventReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventReview
        fields = ['id', 'event', 'user', 'rating', 'review_text', 'created_at']

class GenericReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = GenericReview
        fields = '__all__'

# 📝 Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'password', 'password2')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Нууц үг хоорондоо таарахгүй байна"})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data)
        return user


# 🛠️ Custom Token Serializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        # Use custom authentication
        user = authenticate(request=self.context.get('request'), email=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        data = super().validate(attrs)
        data['user_id'] = user.id  # You can add more data if needed
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# 👤 Custom Auth Token Serializer
class CustomAuthTokenSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        # Authenticate using email
        user = authenticate(request=self.context.get('request'), email=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        attrs['user'] = user
        return attrs

class BookingSerializer(serializers.ModelSerializer):
    """
    Serializer for the Booking model.
    """
    # Frontend-ээс User-ийн ID эсвэл User object-г шууд хүлээж авахгүй,
    # харин хүсэлт илгээсэн User-ийг автоматаар холбоно.
    # Artist-ийн ID-г frontend-ээс хүлээж авна.

    class Meta:
        model = Booking
        # API-аар дамжуулах талбарууд болон frontend-ээс хүлээн авах талбарууд
        # 'user' талбарыг Read Only болгож, create үед автоматаар тохируулна.
        fields = [
            'id', # Booking-ийн ID (read-only)
            'user', # Захиалга хийсэн хэрэглэгч (read-only)
            'artist', # Захиалга хийгдэж буй уран бүтээлч (frontend-ээс artist.id-г илгээнэ)
            'booking_date', # Захиалгын огноо (frontend-ээс илгээнэ)
            'booking_time', # Захиалгын цаг (frontend-ээс илгээнэ)
            'location', # Байршил (frontend-ээс илгээнэ)
            'duration_hours', # Үргэлжлэх хугацаа (frontend-ээс илгэнэ)
            'notes', # Нэмэлт тайлбар (frontend-ээс илгэнэ)
            'status', # Захиалгын статус (read-only, backend defaults to 'pending')
            'created_at', # Үүсгэсэн огноо (read-only)
            'updated_at', # Шинэчилсэн огноо (read-only)
        ]
        # Зөвхөн backend-ээс унших боломжтой талбарууд
        read_only_fields = ['id', 'user', 'status', 'created_at', 'updated_at']


    def create(self, validated_data):
        # Захиалга үүсгэх үед хүсэлт илгээсэн хэрэглэгчийг 'user' талбарт автоматаар оруулна.
        # request object-г serializer context-д дамжуулсан байх ёстой.
        user = self.context['request'].user
        # Backend-ээс Artist object-г validated_data дотор Artist ID-ээр авна.
        # Frontend-ээс ирсэн artist ID-г модел object болгон хувиргана.
        # 'artist' талбар ModelSerializer-т зөв тохируулагдсан бол Django REST Framework өөрөө үүнийг хийдэг.

        booking = Booking.objects.create(user=user, **validated_data)
        return booking
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser # CustomUser моделтой ажиллана
        # Профайл дээр харуулах болон шинэчлэх боломжтой талбарууд
        # Таны CustomUser моделийн талбаруудыг оруулна.
        # first_name, last_name AbstractBaseUser дээр байдаг талбарууд юм.
        fields = ('id', 'username', 'email', 'phone_number')
        # Зөвхөн унших боломжтой талбарууд
        read_only_fields = ('id', 'username') # Жишээ нь, username-г шинэчлэхийг хориглож болно.
