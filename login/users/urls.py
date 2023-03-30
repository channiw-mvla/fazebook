from django.urls import path
from . import views
urlpatterns = [
    path('',views.index),
    path('login/',views.login),
    path('feed/',views.feed),
    path('logout/',views.logout),
    path('addlike/',views.addlike),
    path('getcomments/',views.getComments),
    path('getprofileimage/',views.getProfileImage),
    path('addcomment/',views.addComment),
    path('profile/<str:username>/myprofile',views.userProfile),
    path('profile/<str:username>/myposts/',views.myPosts),
    path('profile/<str:username>/likedposts/',views.likedPosts),
    path('profile/<str:username>/mycomments/',views.myComments),
    path('updatePost/',views.updatePost),
    path('uploadPostImage/',views.uploadPostImage),
    path('updateProfile/',views.updateProfile),
    path('getPost/',views.getPost),
    path('updateComment/',views.updateComment),
    path('deleteComment/',views.deleteComment),
    path('deletePost/',views.deletePost),
    path('profile/<str:username>/addpost/',views.addPost),
    path('test/',views.test),
    path('signup/',views.signUp)
]