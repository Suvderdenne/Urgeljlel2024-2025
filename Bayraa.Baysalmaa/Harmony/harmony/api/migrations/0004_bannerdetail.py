# Generated by Django 5.2 on 2025-04-15 09:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_artist_banner'),
    ]

    operations = [
        migrations.CreateModel(
            name='BannerDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('category', models.CharField(max_length=100)),
                ('image', models.ImageField(upload_to='banners/')),
                ('description', models.TextField()),
            ],
        ),
    ]
