# Generated by Django 4.1.5 on 2023-01-25 21:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0018_alter_post_userswholike'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='usersWhoLike',
            field=models.ManyToManyField(related_name='likedPosts', to='users.user'),
        ),
    ]
