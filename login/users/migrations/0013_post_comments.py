# Generated by Django 4.1.5 on 2023-01-24 18:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0012_post_userswholike'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='comments',
            field=models.ManyToManyField(related_name='myComments', to='users.user'),
        ),
    ]
