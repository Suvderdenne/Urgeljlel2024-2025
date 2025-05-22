# # from rest_framework import serializers
# # from django.contrib.auth import authenticate
# # from .models import CustomUser, Artist, Event, EventDetail, Artwork, Category,EventOrganizer,TicketType,TicketCategory
# # from django.contrib.auth.password_validation import validate_password
# # import base64
# # from io import BytesIO
# # from django.core.files.base import ContentFile
# # import uuid
# # from rest_framework_simplejwt.tokens import RefreshToken


# # # Helper function to decode base64 to image
# # def base64_to_image(base64_string, upload_to):
# #     if base64_string:
# #         format, imgstr = base64_string.split(';base64,')  # Extract format and base64 string
# #         ext = format.split('/')[-1]  # Get file extension
# #         img_data = base64.b64decode(imgstr)  # Decode base64 string
# #         file_name = f"{upload_to}/image.{ext}"  # Define the file name
# #         file = ContentFile(img_data, file_name)  # Create a ContentFile object
# #         return file
# #     return None

# # # Login Serializer

# # class LoginSerializer(serializers.Serializer):
# #     email = serializers.EmailField()
# #     password = serializers.CharField(write_only=True)

# #     def validate(self, data):
# #         email = data.get("email")
# #         password = data.get("password")
        
# #         user = authenticate(email=email, password=password)
        
# #         if user and user.is_active:
# #             refresh = RefreshToken.for_user(user)
# #             return {
# #                 "refresh": str(refresh),
# #                 "access": str(refresh.access_token),
# #                 "user": {
# #                     "id": user.id,
# #                     "username": user.username,
# #                     "email": user.email,
# #                     "is_artist": user.is_artist,
# #                 }
# #             }

# #         raise serializers.ValidationError("Invalid credentials")

# # # User Serializer
# # class UserSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = CustomUser
# #         fields = ["id", "username", "email"]

# # # Register Serializer
# # # class UserRegisterSerializer(serializers.ModelSerializer):
# # #     password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
# # #     password2 = serializers.CharField(write_only=True, required=True)

# # #     class Meta:
# # #         model = CustomUser
# # #         fields = [
# # #             'username', 'email', 'password', 'password2',
# # #             'full_name', 'phone_number', 'location', 'website', 'avatar'
# # #         ]

# # #     def validate(self, attrs):
# # #         if attrs['password'] != attrs['password2']:
# # #             raise serializers.ValidationError({"password": "Passwords don't match!"})
# # #         return attrs

# # #     def create(self, validated_data):
# # #         validated_data.pop('password2')
# # #         user = CustomUser.objects.create_user(**validated_data)
# # #         user.is_artist = False
# # #         user.save()
# # #         return user

# # # class ArtistRegisterSerializer(serializers.ModelSerializer):
# # #     password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
# # #     password2 = serializers.CharField(write_only=True, required=True)

# # #     class Meta:
# # #         model = CustomUser
# # #         fields = [
# # #             'username', 'email', 'password', 'password2',
# # #             'full_name', 'phone_number', 'location', 'website', 'avatar'
# # #         ]

# # #     def validate(self, attrs):
# # #         if attrs['password'] != attrs['password2']:
# # #             raise serializers.ValidationError({"password": "Passwords don't match!"})
# # #         return attrs

# # #     def create(self, validated_data):
# # #         validated_data.pop('password2')
# # #         user = CustomUser.objects.create_user(**validated_data)
# # #         user.is_artist = True
# # #         user.save()
# # #         return user

# # # class UserLoginSerializer(serializers.Serializer):
# # #     username = serializers.CharField()
# # #     password = serializers.CharField(write_only=True)

# # #     def validate(self, data):
# # #         user = authenticate(username=data['username'], password=data['password'])
# # #         if user and user.is_active:
# # #             if user.is_artist:
# # #                 raise serializers.ValidationError("This is an artist account")
# # #             return user
# # #         raise serializers.ValidationError("Invalid credentials")


# # # class ArtistLoginSerializer(serializers.Serializer):
# # #     username = serializers.CharField()
# # #     password = serializers.CharField(write_only=True)

# # #     def validate(self, data):
# # #         user = authenticate(username=data['username'], password=data['password'])
# # #         if user and user.is_active:
# # #             if not user.is_artist:
# # #                 raise serializers.ValidationError("This is a user account")
# # #             return user
# # #         raise serializers.ValidationError("Invalid credentials")

# # class UserRegisterSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = CustomUser
# #         fields = ['id', 'email', 'password']
# #         extra_kwargs = {'password': {'write_only': True}}

# #     def create(self, validated_data):
# #         user = CustomUser.objects.create_user(**validated_data)
# #         user.is_artist = False
# #         user.save()
# #         return user

# # class ArtistRegisterSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = CustomUser
# #         fields = ['id', 'email', 'password']
# #         extra_kwargs = {'password': {'write_only': True}}

# #     def create(self, validated_data):
# #         user = CustomUser.objects.create_user(**validated_data)
# #         user.is_artist = True
# #         user.save()
# #         return user

# # # class LoginSerializer(serializers.Serializer):
# # #     email = serializers.EmailField()
# # #     password = serializers.CharField()
# # class ArtistSerializer(serializers.ModelSerializer):
# #     profile_picture_base64 = serializers.CharField(write_only=True, required=False)

# #     class Meta:
# #         model = Artist
# #         fields = ['id', 'name', 'bio', 'category', 'profile_picture', 'profile_picture_base64', 'artworks']

# #     def create(self, validated_data):
# #         profile_picture_base64 = validated_data.pop('profile_picture_base64', None)
# #         print("Profile Picture Base64:", profile_picture_base64)  # Log base64 string to check
# #         if profile_picture_base64:
# #             validated_data['profile_picture'] = self.base64_to_image(profile_picture_base64, 'artists/')
# #         return super().create(validated_data)

# #     def update(self, instance, validated_data):
# #         profile_picture_base64 = validated_data.pop('profile_picture_base64', None)
# #         if profile_picture_base64:
# #             instance.profile_picture = self.base64_to_image(profile_picture_base64, 'artists/')
# #         return super().update(instance, validated_data)

# #     def base64_to_image(self, base64_string, upload_dir):
# #         try:
# #             format, imgstr = base64_string.split(';base64,')
# #             ext = format.split('/')[-1]
# #             file_name = f"{uuid.uuid4()}.{ext}"
# #             return ContentFile(base64.b64decode(imgstr), name=file_name)
# #         except Exception as e:
# #             raise ValueError("Invalid base64 image string") from e

# # # Artwork Serializer
# # class ArtworkSerializer(serializers.ModelSerializer):
# #     image_base64 = serializers.SerializerMethodField()

# #     class Meta:
# #         model = Artwork
# #         fields = ['id', 'artist', 'title', 'description', 'image', 'price', 'date_created', 'image_base64']

# #     def get_image_base64(self, obj):
# #         if obj.image and hasattr(obj.image, 'path'):
# #             with open(obj.image.path, "rb") as img_file:
# #                 return "data:image/jpeg;base64," + base64.b64encode(img_file.read()).decode()
# #         return ""

# #     def create(self, validated_data):
# #         image_base64 = validated_data.pop('image_base64', None)
# #         if image_base64:
# #             validated_data['image'] = base64_to_image(image_base64, 'artworks/')
# #         return super().create(validated_data)

# #     def update(self, instance, validated_data):
# #         image_base64 = validated_data.pop('image_base64', None)
# #         if image_base64:
# #             instance.image = base64_to_image(image_base64, 'artworks/')
# #         return super().update(instance, validated_data)


# # # Event Serializer
# # class EventSerializer(serializers.ModelSerializer):
# #     image_base64 = serializers.CharField(write_only=True, required=False)

# #     class Meta:
# #         model = Event
# #         fields = [
# #             'id', 'title', 'description', 'image', 'image_base64',
# #             'location', 'date', 'created_at', 'category',
# #         ]

# #     def create(self, validated_data):
# #         image_base64 = validated_data.pop('image_base64', None)
# #         if image_base64:
# #             validated_data['image'] = base64_to_image(image_base64, 'events/')
# #         return super().create(validated_data)

# #     def update(self, instance, validated_data):
# #         image_base64 = validated_data.pop('image_base64', None)
# #         if image_base64:
# #             instance.image = base64_to_image(image_base64, 'events/')
        
# #         return super().update(instance, validated_data)
# #     def base64_to_image(base64_string, path="events/"):
# #         format, imgstr = base64_string.split(';base64,')
# #         ext = format.split('/')[-1]
# #         filename = f"{uuid.uuid4()}.{ext}"
# #         return ContentFile(base64.b64decode(imgstr), name=filename)
# # # EventOrganizer Serializer
# # class EventOrganizerSerializer(serializers.ModelSerializer):
# #     logo_base64 = serializers.SerializerMethodField()

# #     class Meta:
# #         model = EventOrganizer
# #         fields = ['id', 'event', 'name', 'logo', 'logo_base64', 'website']

# #     def get_logo_base64(self, obj):
# #         if obj.logo and hasattr(obj.logo, 'path'):
# #             with open(obj.logo.path, "rb") as img_file:
# #                 return "data:image/jpeg;base64," + base64.b64encode(img_file.read()).decode()
# #         return ""

# #     def create(self, validated_data):
# #         logo_base64 = validated_data.pop('logo_base64', None)
# #         if logo_base64:
# #             validated_data['logo'] = base64_to_image(logo_base64, 'organizers/')
# #         return super().create(validated_data)

# #     def update(self, instance, validated_data):
# #         logo_base64 = validated_data.pop('logo_base64', None)
# #         if logo_base64:
# #             instance.logo = base64_to_image(logo_base64, 'organizers/')
# #         return super().update(instance, validated_data)

# # # EventDetail Serializer
# # class TicketTypeSerializer(serializers.ModelSerializer):
# #     discount_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)

# #     class Meta:
# #         model = TicketType
# #         fields = ['id', 'name', 'subtitle', 'price', 'discount_price', 'discount_until', 'event', 'description']

# #     def validate(self, attrs):
# #         # Хямдралын үнийн шалгалт
# #         price = attrs.get('price')
# #         discount_price = attrs.get('discount_price')

# #         if discount_price is not None and discount_price >= price:
# #             raise serializers.ValidationError({
# #                 'discount_price': 'Discount price must be less than the original price.'
# #             })

# #         # Хямдралын хугацаа байгаа бол дуусах хугацаа байх ёстой
# #         if discount_price and not attrs.get('discount_until'):
# #             raise serializers.ValidationError({
# #                 'discount_until': 'Discount expiration date is required when a discount price is provided.'
# #             })

# #         return attrs

# #     def create(self, validated_data):
# #         return super().create(validated_data)

# #     def update(self, instance, validated_data):
# #         return super().update(instance, validated_data)

# # # TicketCategory Serializer
# # class TicketCategorySerializer(serializers.ModelSerializer):
# #     # Хэрэгтэй бол холбогдох TicketType өгөгдлийг хөрвүүлж авах
# #     ticket_types = TicketTypeSerializer(many=True, read_only=True)

# #     class Meta:
# #         model = TicketCategory
# #         fields = ['id', 'name', 'description', 'ticket_types']  # `ticket_types` нь олон TicketType мэдээллийг харуулах болно

# #     def create(self, validated_data):
# #         return super().create(validated_data)

# #     def update(self, instance, validated_data):
# #         return super().update(instance, validated_data)


# # class EventDetailSerializer(serializers.ModelSerializer):
# #     ticket_type = TicketTypeSerializer(read_only=True)
# #     ticket_type_id = serializers.PrimaryKeyRelatedField(queryset=TicketType.objects.all(), source='ticket_type', write_only=True)

# #     class Meta:
# #         model = EventDetail
# #         fields = ['id', 'event', 'ticket_type', 'ticket_type_id', 'price', 'description']


# #     def create(self, validated_data):
# #         return super().create(validated_data)

# #     def update(self, instance, validated_data):
# #         return super().update(instance, validated_data)
# # # Category Serializer
# # class CategorySerializer(serializers.ModelSerializer):
# #     icon_base64 = serializers.SerializerMethodField()

# #     class Meta:
# #         model = Category
# #         fields = ['id', 'name', 'icon', 'icon_base64']

# #     def get_icon_base64(self, obj):
# #         if obj.icon and hasattr(obj.icon, 'path'):
# #             with open(obj.icon.path, "rb") as img_file:
# #                 return "data:image/jpeg;base64," + base64.b64encode(img_file.read()).decode()
# #         return ""

# #     def create(self, validated_data):
# #         icon_base64 = validated_data.pop('icon_base64', None)
# #         if icon_base64:
# #             validated_data['icon'] = base64_to_image(icon_base64, 'category_icons/')
# #         return super().create(validated_data)

# #     def update(self, instance, validated_data):
# #         icon_base64 = validated_data.pop('icon_base64', None)
# #         if icon_base64:
# #             instance.icon = base64_to_image(icon_base64, 'category_icons/')
# #         return super().update(instance, validated_data)







# ## EVENTX 
# from rest_framework import serializers
# from django.contrib.auth import authenticate
# from .models import CustomUser, Artist, Event, EventDetail, Artwork, Category,EventOrganizer,TicketType,TicketCategory
# from django.contrib.auth.password_validation import validate_password
# import base64
# from io import BytesIO
# from django.core.files.base import ContentFile
# import uuid
# from rest_framework_simplejwt.tokens import RefreshToken

# #👇НЭГДҮГЭЭРТ: EventSerializer-ээ эхэлж зарлана
# class EventSerializer(serializers.ModelSerializer):
#     category = serializers.CharField(source='category.name', read_only=True)

#     class Meta:
#         model = Event
#         fields = ['id', 'title', 'location', 'date', 'image_base64', 'category']

# # 👇 ДАРАА НЬ: UserProfileSerializer-ээ зарлана
# class UserProfileSerializer(serializers.ModelSerializer):
#     events = serializers.SerializerMethodField()
#     artist_profile = serializers.SerializerMethodField()

#     class Meta:
#         model = CustomUser
#         fields = ['id', 'username', 'email', 'phone_number', 'website', 'avatar_base64', 'events', 'artist_profile']

#     # def get_events(self, obj):
#     #     return EventSerializer(obj.events.all(), many=True).data  # related_name='events' байх ёстой
#     def get_events(self, obj):
#         events = obj.events.all()  # events ашиглан бүх холбогдсон үйл явдлууд
#         return EventSerializer(events, many=True).data if events else []

#     def get_artist_profile(self, obj):
#         try:
#             artist = Artist.objects.get(name=obj.username)
#             return {
#                 "name": artist.name,
#                 "bio": artist.bio,
#                 "category": artist.category.name,
#                 "profile_picture_base64": artist.profile_picture_base64
#             }
#         except Artist.DoesNotExist:
#             return None
from django.contrib.auth import authenticate
from django.core.files.base import ContentFile
import base64
from io import BytesIO
from PIL import Image
import uuid
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    CustomUser, Artist, Artwork, Category,
    Event, EventOrganizer, TicketType, TicketCategory,
    EventDetail, ArtistReview, EventReview
)
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import UserDetailsSerializer as UserSerializer


# 📷 base64 зургийг хөрвүүлэх функц
def decode_base64_to_image(base64_str):
    format, imgstr = base64_str.split(';base64,')
    ext = format.split('/')[-1]
    imgdata = base64.b64decode(imgstr)
    image = Image.open(BytesIO(imgdata))
    return ContentFile(imgdata, name=f"{uuid.uuid4()}.{ext}")


# 🔐 CustomUser Serializer
class CustomUserCreateSerializer(RegisterSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'password', 'phone_number', 'website')


class CustomUserSerializer(UserSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'phone_number', 'website', 'avatar_base64')


class CustomUserSignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'phone_number', 'website', 'avatar', 'user_type']

    def create(self, validated_data):
        avatar = validated_data.get('avatar')
        if avatar and isinstance(avatar, str) and avatar.startswith('data:image'):
            avatar_image = decode_base64_to_image(avatar)
            validated_data['avatar'] = avatar_image

        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            phone_number=validated_data.get('phone_number'),
            website=validated_data.get('website'),
            avatar=validated_data.get('avatar'),
            user_type=validated_data.get('user_type')
        )

        user_type = validated_data.get('user_type')
        if user_type == 'artist':
            artist = Artist.objects.create(
                name=validated_data.get('username'),
                bio="Bio for new artist",
                profile_picture=user.avatar,
                is_verified=False
            )
            user.artist = artist
            user.save()

        return user


# 🎨 Category
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['icon_base64']


# 👩‍🎤 Artist
class ArtistSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category', write_only=True)

    class Meta:
        model = Artist
        fields = '__all__'
        read_only_fields = ['profile_picture_base64']


# 🖼️ Artwork
class ArtworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artwork
        fields = '__all__'
        read_only_fields = ['image_base64']


# 📍 Event
class EventSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category', write_only=True)

    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['image_base64', 'status']


# 🎟️ Ticket Category
class TicketCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketCategory
        fields = '__all__'


# 🎫 Ticket Type
class TicketTypeSerializer(serializers.ModelSerializer):
    category = TicketCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=TicketCategory.objects.all(), source='category', write_only=True)

    class Meta:
        model = TicketType
        fields = '__all__'


# 📋 Event Detail
class EventDetailSerializer(serializers.ModelSerializer):
    ticket_type = TicketTypeSerializer(read_only=True)
    ticket_type_id = serializers.PrimaryKeyRelatedField(queryset=TicketType.objects.all(), source='ticket_type', write_only=True)

    class Meta:
        model = EventDetail
        fields = '__all__'


# 👥 Organizer
class EventOrganizerSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventOrganizer
        fields = '__all__'
        read_only_fields = ['logo_base64']


# ⭐ Artist Review
class ArtistReviewSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = ArtistReview
        fields = '__all__'


# ⭐ Event Review
class EventReviewSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = EventReview
        fields = '__all__'


# 🔐 Password Reset
User = get_user_model()

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Таны и-мэйлтэй хэрэглэгч олдсонгүй.")
        return value

    def save(self):
        # Имэйл илгээх логик (дараа хийх боломжтой)
        pass


# 🔐 Password Change
class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Хуучин нууц үг буруу байна.")
        return value

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        # Authenticate user
        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Нэвтрэх нэр эсвэл нууц үг буруу байна.")

        attrs['user'] = user
        return attrs