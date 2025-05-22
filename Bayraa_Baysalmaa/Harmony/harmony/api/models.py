import base64
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.files.base import ContentFile
from django.contrib.auth.models import AbstractUser
from django.utils.timezone import now
import logging
logger = logging.getLogger(__name__)
# 🧠 Зураг руу base64 хөрвүүлэх
def image_to_base64(image_field):
    if image_field:
        try:
            image_field.file.seek(0)
            return base64.b64encode(image_field.file.read()).decode('utf-8')
        except Exception as e:
            logger.error(f"Image to base64 conversion error: {e}")
    return None

# 👤 Custom User
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    avatar_base64 = models.TextField(blank=True, null=True)
    artist = models.OneToOneField("Artist", null=True, blank=True, on_delete=models.SET_NULL)
    user_type = models.CharField(max_length=20, choices=[('regular', 'Regular User'), ('artist', 'Artist')], default='regular')

    def save(self, *args, **kwargs):
        # If an avatar exists, convert it to base64
        if self.avatar:
            self.avatar_base64 = image_to_base64(self.avatar)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

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

# 👩‍🎤 Artist
class Artist(models.Model):
    name = models.CharField(max_length=255)
    bio = models.TextField(default="", blank=True)
    category = models.ForeignKey(Category, related_name='artist_categories', on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='artists/', null=True, blank=True)
    profile_picture_base64 = models.TextField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    # Change the related_name for the Many-to-Many relation
    events = models.ManyToManyField("Event", related_name="event_artists", blank=True)

    def save(self, *args, **kwargs):
        if self.profile_picture:
            self.profile_picture_base64 = image_to_base64(self.profile_picture)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

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

# 📢 Event
class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='events/', blank=True, null=True)
    image_base64 = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(Category, related_name='events', on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=EVENT_STATUS_CHOICES, default='upcoming')

    # Change the related_name for the Many-to-Many relation
    artists = models.ManyToManyField(Artist, related_name="event_artists", blank=True)

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
    rating = models.PositiveIntegerField(default=5, validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} → {self.artist.name} ({self.rating}★)"

# ⭐ Event Review
class EventReview(models.Model):
    event = models.ForeignKey(Event, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=5, validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} → {self.event.title} ({self.rating}★)"
