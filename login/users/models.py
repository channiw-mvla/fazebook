from django.db import models
class User(models.Model):
    profilePic = models.ImageField(upload_to="images/")
    aboutMe=models.TextField()
    username = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.username

class Post(models.Model):
    image = models.ImageField(upload_to="images/")
    title=models.CharField(max_length=30)
    desc=models.TextField()
    usersWhoLike = models.ManyToManyField(User, related_name="likedPosts")
    user=models.ForeignKey(User, related_name="posts", on_delete = models.CASCADE)
    def __str__(self):
        return self.user.username+" : "+self.title
class Comment(models.Model):
    message=models.TextField()
    user=models.ForeignKey(User, related_name="myComments", on_delete = models.CASCADE)
    post=models.ForeignKey(Post, related_name="comments", on_delete = models.CASCADE,null=True)
    def __str__(self):
        return self.user.username+" : "+self.message