# Generated by Django 5.1.4 on 2025-04-23 23:44

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0025_remove_artist_events_remove_artist_is_verified_and_more'),
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='eventreview',
            unique_together={('event', 'user')},
        ),
        migrations.CreateModel(
            name='GenericReview',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField()),
                ('comment', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('object_id', models.PositiveIntegerField()),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
