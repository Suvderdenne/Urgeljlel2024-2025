from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):                                                                   # Хэрэглэгчийн профайл мэдээллийг сериализ хийж өгөх сериализер
    profile_image_url = serializers.SerializerMethodField()                                                           # Профайл зургийн линкийг динамикаар авах тусгай field

    class Meta:
        model = User                                                                                                 # Аль model дээр сериализер ажиллахыг заана
        fields = ('id', 'username', 'email', 'profile_image', 'profile_image_url')                                   # Сериализад орох талбарууд
        read_only_fields = ('id', 'profile_image_url')                                                                # Эдгээр талбаруудыг зөвхөн унших боломжтой

    def get_profile_image_url(self, obj):     
        return obj.profile_image_url

class RegisterSerializer(serializers.ModelSerializer): 
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email')

    def validate(self, attrs):         # password ба password2 талбарууд ижил эсэхийг шалгана
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user 