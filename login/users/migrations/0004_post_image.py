# Generated by Django 4.1.5 on 2023-01-23 22:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_post'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='image',
            field=models.ImageField(default='defalut.jpg', upload_to='', verbose_name='static/images'),
            preserve_default=False,
        ),
    ]
