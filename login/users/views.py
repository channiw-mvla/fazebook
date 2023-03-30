from django.shortcuts import render,redirect,HttpResponse
from django.http import JsonResponse
from .models import User,Post,Comment
from django.contrib import messages
from django.contrib.auth.hashers import make_password, check_password
password = 'zack we miss you'
import json
def index(request):
    return redirect("/login")
def login(request):
    if("userid" in request.session):
        return redirect("/feed")
    context={
        "username":"",
        "password":""
    }
    if(request.method=="POST"):
        context["username"]=request.POST["username"]
        context["password"]=request.POST["password"]
        user=User.objects.filter(username=request.POST["username"]).first()
        if user==None or not check_password(request.POST["password"],user.password):
            messages.success(request,"Username or Password not correct")
            return redirect("/login")
        # user=User.objects.filter(username=request.POST["username"],password=request.POST["password"])
        request.session["userid"]=user.id
        return redirect("/feed")
    return render(request,"login.html",context)
def feed(request):
    if("userid" not in request.session):
        return redirect("/login")
    context={
        "posts":Post.objects.all(),
        "liked": User.objects.get(id=request.session["userid"]).likedPosts.all(),
        "currUser":User.objects.get(id=request.session["userid"])
    }
    return render(request,"feed.html",context)
def logout(request):
    request.session.flush()
    return redirect("/login")
def addlike(request):
    if(request.method=="POST"):
        postid=json.loads(request.body)["postid"]
        currUser=request.session["userid"]
        user=User.objects.get(id=currUser)
        post=Post.objects.get(id=postid)
        if(post in user.likedPosts.all()):
            user.likedPosts.remove(post)
        else:
            user.likedPosts.add(post)
        return HttpResponse("Good")
    return redirect("/login")
def getComments(request):
    if(request.method=="POST"):
        commentsOnPost=Post.objects.get(id=json.loads(request.body)["postid"]).comments.all()
        return JsonResponse( list(commentsOnPost.values()),safe=False)
    return redirect("/feed")
def getProfileImage(request):
    if(request.method=="POST"):
        profile=User.objects.get(id=json.loads(request.body)["userid"])
        return JsonResponse( {"img":"/media/"+str(profile.profilePic),"username":profile.username},safe=False)
    return redirect("/feed")
def addComment(request):
    if(request.method=="POST"):
        message=json.loads(request.body)["message"]
        currPost=Post.objects.get(id=json.loads(request.body)["postid"])
        currUser=User.objects.get(id=request.session["userid"])
        Post.objects.get(id=currPost.id).comments.add(Comment.objects.create(message=message,user=currUser,post=currPost))
        return JsonResponse( {"img":"/media/"+str(currUser.profilePic),"username":currUser.username},safe=False)
    return redirect("/feed")
def userProfile(request,username):
    if("userid" not in request.session):
        return redirect("/login")
    user=User.objects.get(username=username)
    context={
        "user":user,
        "currUser":User.objects.get(id=request.session["userid"])
    }
    if(request.session["userid"]!=user.id):
        return render(request,"viewuserProfile.html",context)
    return render(request,"userProfile.html",context)

def updatePost(request):
    if(request.method=="POST"):
        currUser=User.objects.get(id=request.session["userid"])
        # if(len(request.FILES.keys())==0):
        post=currUser.posts.all().get(id=json.loads(request.body)["postid"])
        type=json.loads(request.body)["type"]
        data=json.loads(request.body)["data"]
        # else:
        #     type="img"
        #     post=Post.objects.get(id=request.POST["postid"])
        if(type=="title"):
            post.title=data
            post.save()
        elif(type=="desc"):
            post.desc=data
            post.save()
        # elif(type=="img"):
        #     post.image=request.FILES["file"]
        #     post.save()
    return redirect("/profile/"+currUser.username)
def uploadPostImage(request):
    if(request.method=="POST"):
        currUser=User.objects.get(id=request.session["userid"])
        if(len(request.FILES.keys())==0):
            return redirect("/profile/"+currUser.username+"/myposts")
        if(request.POST["postid"]!=""):
            post=currUser.posts.all().get(id=request.POST["postid"])
            post.image=request.FILES["file"]
            post.save()
        else:
            currUser.profilePic=request.FILES["file"]
            currUser.save()
    return redirect("/profile/"+currUser.username+"/myposts/")

def updateProfile(request):
    if(request.method=="POST"):
        currUser=User.objects.get(id=request.session["userid"])
        currUser.aboutMe=json.loads(request.body)["data"]
        currUser.save()
        return HttpResponse("GOOD")
    return redirect("/profile/"+currUser.username)

def test(request):
    if(request.method=="POST"):
        post=Post.objects.get(title="meow meow")
        post.image=request.FILES["file"]
        post.save()
    return render(request,"test.html")
def myPosts(request,username):
    if("userid" not in request.session):
        return redirect("/login")
    context={
        "user":User.objects.get(id=request.session["userid"])
    }
    typedUser=User.objects.get(username=username)
    if(request.session["userid"]!=typedUser.id):
        return redirect("/profile/"+context["user"].username+"/myposts")
    return render(request,"myposts.html",context)
def likedPosts(request,username):
    if("userid" not in request.session):
        return redirect("/login")
    context={
        "user":User.objects.get(id=request.session["userid"])
    }
    typedUser=User.objects.get(username=username)
    if(request.session["userid"]!=typedUser.id):
        return redirect("/profile/"+context["user"].username+"/likedposts")
    return render(request,"likedposts.html",context)
def myComments(request,username):
    if("userid" not in request.session):
            return redirect("/login")
    context={
        "user":User.objects.get(id=request.session["userid"]),
    }
    typedUser=User.objects.get(username=username)
    if(request.session["userid"]!=typedUser.id):
        return redirect("/profile/"+context["user"].username+"/mycomments")
    return render(request,"myComments.html",context)
def getPost(request):
    if(request.method=="POST"):
        post=Post.objects.get(id=json.loads(request.body)["postid"])
        commentNum=len(post.comments.all())
        likeNum=len(post.usersWhoLike.all())
        currUser=User.objects.get(id=request.session["userid"])
        likeImg="/static/heart.png"
        if(post in currUser.likedPosts.all()):
            likeImg="/static/heart2.png"
        return JsonResponse({"postImage":str(post.image.url),"posterPic":str(post.user.profilePic.url),"poster":post.user.username,"title":post.title,"desc":post.desc,"commentNum":commentNum,"likeNum":likeNum,"likeImg":likeImg})
    return redirect("/feed")
def updateComment(request):
    if(request.method=="POST"):
        currUser=User.objects.get(id=request.session["userid"])
        currComment=currUser.myComments.get(id=json.loads(request.body)["commentid"])
        currComment.message=json.loads(request.body)["message"]
        currComment.save()
        return HttpResponse("Good")
    return redirect("/feed")
def deleteComment(request):
    if(request.method=="POST"):
        currUser=User.objects.get(id=request.session["userid"])
        currComment=currUser.myComments.get(id=json.loads(request.body)["commentid"])
        currComment.delete()
        return HttpResponse("Good")
def deletePost(request):
    if(request.method=="POST"):
        currUser=User.objects.get(id=request.session["userid"])
        currPost=currUser.posts.get(id=json.loads(request.body)["postid"])
        currPost.delete()
        return HttpResponse("Good")
    return redirect("/feed")
def addPost(request,username):
    if("userid" not in request.session):
        return redirect("/login")
    user=User.objects.get(id=request.session["userid"])
    context={
        "user":user
    }
    if(request.method=="POST"):
        image=request.FILES["image"]
        title=request.POST["title"]
        desc=request.POST["desc"]
        newPost=Post.objects.create(image=image,title=title,desc=desc,user=user)
        newPost.save()
        return redirect("/profile/"+user.username+"/myposts")
    return render(request,"addPost.html",context)
def signUp(request):
    if("userid" in request.session):
        return redirect("/feed")
    if (request.method=="POST"):
        if not request.FILES:
            messages.success(request,"Please include an image")
            return redirect("/signup")
        if not request.POST["aboutMe"]:
            messages.success(request,"Please include an About Me")
            return redirect("/signup")
        if not request.POST["username"]:
            messages.success(request,"Please include an Username")
            return redirect("/signup")
        if not request.POST["password"]:
            messages.success(request,"Please include an Password")
            return redirect("/signup")
        user=User.objects.create(profilePic=request.FILES["profilePic"],aboutMe=request.POST["aboutMe"],username=request.POST["username"],password=make_password(request.POST["password"]))
        request.session["userid"]=user.id
        return redirect("/feed")
    return render (request,"signUp.html")

