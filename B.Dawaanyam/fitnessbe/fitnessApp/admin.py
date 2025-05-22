from django.contrib import admin
from .models import UserProfile, WorkoutPlan, MealPlan, WeightLog, ProjectedWeightLoss, DailyCalories, Food
# Register your models here.
admin.site.register(UserProfile)
admin.site.register(WorkoutPlan)
admin.site.register(MealPlan)
admin.site.register(WeightLog)
admin.site.register(ProjectedWeightLoss)
admin.site.register(DailyCalories)  
admin.site.register(Food)
