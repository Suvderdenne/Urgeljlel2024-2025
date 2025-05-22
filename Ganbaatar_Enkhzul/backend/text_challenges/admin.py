from django.contrib import admin
from .models import Language, TextChallenge, ChallengeAttempt

@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ('language_code', 'language_name', 'is_active')
    list_filter = ('is_active',)      
    search_fields = ('language_code', 'language_name')     

@admin.register(TextChallenge)
class TextChallengeAdmin(admin.ModelAdmin):
    list_display = ('challenge_id', 'difficulty_level', 'language', 'recommended_time', 'word_count')
    list_filter = ('difficulty_level', 'language')
    search_fields = ('content',)

@admin.register(ChallengeAttempt)
class ChallengeAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'challenge', 'correct_word_count', 'wrong_word_count', 'duration_seconds', 'created_at')
    list_filter = ('challenge', 'user')
    search_fields = ('user__username', 'challenge__content')


