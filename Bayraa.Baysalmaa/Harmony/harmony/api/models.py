import base64
from django.db import models
from django.core.files.base import ContentFile
from django.contrib.auth.models import AbstractUser
from django.utils.timezone import now
from django.utils import timezone
from django.utils.html import mark_safe

from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


# 🧠 Image-ийг base64 руу найдвартай хөрвүүлэх функц
# 🧠 Зураг руу base64 хөрвүүлэх
def image_to_base64(image_field):
    if image_field:
        try:
           
            image_field.file.seek(0)
            return base64.b64encode(image_field.file.read()).decode('utf-8')
        except Exception as e:
            print("Image to base64 conversion error:", e)
    return None


# 👤 Custom User
class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, username, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)  # Энэ мөрийг үлдээнэ
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = CustomUserManager()

    def __str__(self):
        return self.email
# 🎨 Category model
# 🎨 Category
class Category(models.Model):
    name = models.CharField(max_length=100)
    icon = models.ImageField(upload_to='category_icons/')
    icon_base64 = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.icon:
            self.icon_base64 = image_to_base64(self.icon)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

# 👩‍🎤 Artist model
# 👩‍🎤 Artist
class Artist(models.Model):
    name = models.CharField(max_length=255)
    bio = models.TextField(default="", blank=True)
    category = models.ForeignKey(Category, related_name='artist_categories', on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='artists/', null=True, blank=True)
    profile_picture_base64 = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_verified = models.BooleanField(default=False)  # ✅ Баталгаажуулалт

    def save(self, *args, **kwargs):
        if self.profile_picture:
            self.profile_picture_base64 = image_to_base64(self.profile_picture)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

# 🖼️ Artwork model
# 🖼️ Artwork
class Artwork(models.Model):
    artist = models.ForeignKey(Artist, related_name='artworks', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='artworks/', null=True, blank=True)
    image_base64 = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    date_created = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.image:
            self.image_base64 = image_to_base64(self.image)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

# 🎟️ Ticket Category
class TicketCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

# 📅 Event Status сонголт
EVENT_STATUS_CHOICES = (
    ('upcoming', 'Ирэх арга хэмжээ'),
    ('ongoing', 'Болж байгаа'),
    ('completed', 'Дууссан'),
)

# 📢 Event зохион байгуулалт
# 📢 Event
class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='events/', blank=True, null=True)
    image_base64 = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255)
    latitude = models.FloatField(null=True, blank=True)     # 📍 Гео
    longitude = models.FloatField(null=True, blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(Category, related_name='events', on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=EVENT_STATUS_CHOICES, default='upcoming')

    def save(self, *args, **kwargs):
        if self.image:
            self.image_base64 = image_to_base64(self.image)
        self.update_status()
        super().save(*args, **kwargs)

    def update_status(self):
        today = now().date()
        if self.date > today:
            self.status = 'upcoming'
        elif self.date == today:
            self.status = 'ongoing'
        else:
            self.status = 'completed'

    def __str__(self):
        return self.title

# 👥 Зохион байгуулагчийн мэдээлэл
# 👥 Event Organizer
class EventOrganizer(models.Model):
    event = models.ForeignKey(Event, related_name='organizers', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='organizers/', blank=True, null=True)
    logo_base64 = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)  # ✅ Баталгаажуулалт

    def save(self, *args, **kwargs):
        if self.logo:
            self.logo_base64 = image_to_base64(self.logo)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    


# 🎟️ Ticket Type
class TicketType(models.Model):
    
    name = models.CharField(max_length=100)
    subtitle = models.CharField(max_length=100, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount_until = models.DateField(null=True, blank=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='tickets')
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(TicketCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='ticket_types')

    def __str__(self):
        return f"{self.name} - {self.event.title}"


# 🎟️ Тасалбарын дэлгэрэнгүй
# 📋 Event Detail
class EventDetail(models.Model):
    event = models.ForeignKey(Event, related_name='details', on_delete=models.CASCADE)
    ticket_type = models.ForeignKey(TicketType, on_delete=models.SET_NULL, null=True, related_name='event_details')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        ticket_name = self.ticket_type.name if self.ticket_type else "(No Ticket Type)"
        return f"{ticket_name} - {self.price}₮"

# ⭐ Artist Review
class ArtistReview(models.Model):
    artist = models.ForeignKey(Artist, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=5)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.artist.name} - {self.rating}⭐ by {self.user.username}"

# 🌟 Event Review
# ⭐ Event Review



# 🔄 Generic Review
class GenericReview(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

# 📝 Simple Review
class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    event = models.ForeignKey('Event', on_delete=models.CASCADE)
    review_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.event.title} by {self.user.username}"

class EventReview(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=5)  # 1-5 одны үнэлгээ
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.event.title} ({self.rating}★)"
class Booking(models.Model):
    """
    Represents a booking made by a user for an artist.
    """
    # Захиалга хийсэн хэрэглэгч (Django-ийн үндсэн User моделтой холбоно)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='bookings')

    # Захиалга хийгдэж буй уран бүтээлч (Таны Artist моделтой холбоно)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='bookings')

    # Захиалгын огноо
    booking_date = models.DateField()

    # Захиалгын цаг
    booking_time = models.TimeField()

    # Захиалга хийх байршил (Хаяг)
    location = models.CharField(max_length=255)

    # Захиалга үргэлжлэх хугацаа (цагаар)
    duration_hours = models.PositiveIntegerField() # Эсвэл PositiveIntegerField, FloatField

    # Нэмэлт тайлбар эсвэл шаардлага
    notes = models.TextField(blank=True, null=True) # Заавал биш талбар

    # Захиалгын статус (Хүлээгдэж байгаа, Баталгаажсан, Цуцлагдсан гэх мэт)
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
    )

    # Захиалга үүсгэгдсэн болон шинэчлэгдсэн огноо/цаг
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Хамгийн сүүлд үүсгэгдсэн захиалгыг эхэнд харуулах
        ordering = ['-created_at']
        # Хэрэв та User болон Artist-ийн нэгдэлээр захиалга давхцахыг хориглох бол (ховор тохиолдолд)
        # unique_together = [['user', 'artist', 'booking_date', 'booking_time']]


    def __str__(self):
        # Admin panel болон бусад газарт харагдах нэр
        return f"Booking for {self.artist.name} by {self.user.username} on {self.booking_date}"

    # Нэмэлт функцуудыг энд нэмж болно (жишээ нь, нийт үнийг тооцоолох)
    # def calculate_total_price(self):
    #    if self.artist.price and self.duration_hours:
    #        return self.artist.price * self.duration_hours
    #    return 0

