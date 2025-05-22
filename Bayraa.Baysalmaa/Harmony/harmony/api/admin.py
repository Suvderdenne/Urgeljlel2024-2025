# users/admin.py
from django.contrib import admin
from .models import *
# CustomUser-ийг admin-д бүртгэх
@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email',  'phone_number']
    search_fields = ['username', 'email']
    list_filter = ['is_active']

# Artist-ийг admin-д бүртгэх
@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'is_verified', 'profile_picture_preview', 'bio','price')
    search_fields = ('name', 'bio', 'category__name','price')
    list_filter = ('category', 'is_verified')
    ordering = ('name',)

    # Function to preview the profile picture in the admin panel
    def profile_picture_preview(self, obj):
        if obj.profile_picture:
            return mark_safe(f'<img src="{obj.profile_picture.url}" width="50" height="50"/>')
        return "No image"
    profile_picture_preview.short_description = 'Profile Picture'

    # Optionally, you can add custom filters, search, and ordering based on your needs
    fields = ('name', 'bio', 'category', 'profile_picture', 'profile_picture_base64', 'is_verified')
    readonly_fields = ('profile_picture_base64',)  # Make the base64 field read-only

# Artwork-ийг admin-д бүртгэх
@admin.register(Artwork)
class ArtworkAdmin(admin.ModelAdmin):
    list_display = ['title', 'artist', 'price', 'date_created']
    search_fields = ['title', 'artist__name']
    list_filter = ['artist', 'price']

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'date', 'created_at', 'category')
    search_fields = ('title', 'location', 'category__name')
    list_filter = ('date', 'category')
    ordering = ('-date',)

# Register EventOrganizer model
@admin.register(EventOrganizer)
class EventOrganizerAdmin(admin.ModelAdmin):
    list_display = ('name', 'event', 'website')
    search_fields = ('name', 'event__title', 'website')
    list_filter = ('event',)

# Register EventDetail model
@admin.register(EventDetail)
class EventDetailAdmin(admin.ModelAdmin):
    list_display = ('ticket_type', 'price', 'event')
    search_fields = ('ticket_type', 'event__title')
    list_filter = ('event','ticket_type')

# Category-ийг admin-д бүртгэх
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(TicketType)
class TicketTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'discount_price', 'discount_until', 'event', 'category')
    list_filter = ('event', 'category', 'discount_until')
    search_fields = ('name', 'subtitle', 'description')
    ordering = ('-id',)
@admin.register(TicketCategory)
class TicketCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')  # Төвдөө ямар талбаруудыг харуулах вэ
    search_fields = ('name',)  # Нэрээр хайлт хийх боломжийг нэмэх
    list_filter = ('name',)  # Нэрээр шүүх боломжийг нэмэх



class ArtistReviewAdmin(admin.ModelAdmin):
    list_display = ('artist', 'rating', 'review', 'created_at')  # Засварлах үед харах талбарууд
    list_filter = ('artist', 'rating')  # Сортлох боломжтой талбарууд
    search_fields = ('review', 'artist__name')  # Хайлтаар олж болох талбарууд
    ordering = ('-created_at',)  # Захиалгаа тодорхойлох

class EventReviewAdmin(admin.ModelAdmin):
    list_display = ('event', 'rating', 'review', 'created_at')
    list_filter = ('event', 'rating')
    search_fields = ('review', 'event__name')
    ordering = ('-created_at',)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('artist', 'user', 'booking_date', 'booking_time', 'status', 'created_at') # Админ жагсаалтанд харагдах талбарууд
    list_filter = ('status', 'booking_date', 'artist__name', 'user__username') # Статус, огноо, уран бүтээлч, хэрэглэгчээр шүүх
    search_fields = ('artist__name', 'user__username', 'location') # Уран бүтээлч, хэрэглэгч, байршлаар хайх
    # Захиалга үүсгэх/засварлах формын талбаруудын дараалал (Readonly талбаруудыг оруулсан)
    fields = ('artist', 'user', 'booking_date', 'booking_time', 'location', 'duration_hours', 'notes', 'status', 'created_at', 'updated_at')
    readonly_fields = ('user', 'created_at', 'updated_at') # Зөвхөн админ харах боломжтой талбарууд