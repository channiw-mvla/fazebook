async function like(element,postid){
    likey=document.querySelector(".likes"+postid)
    if(element.src.includes("heart2")){
        element.src="/static/heart.png"
        likey.innerHTML=Number(likey.innerHTML)-1
    }
    else{
        element.src="/static/heart2.png"
        likey.innerHTML=Number(likey.innerHTML)+1
    }
    await fetch("/addlike/",
    {
        method:"POST",
        headers:{'X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
        body:JSON.stringify({"postid":postid})
    })
}
async function getComments(postid){
    commentIcon=document.querySelector(".commentIcon"+postid)
    if(commentIcon.src.includes("comment3")){
        commentIcon.src="/static/comment.png"
        document.querySelector(".commentBox"+postid).innerHTML=""
        document.querySelector(".notification"+postid).style.visibility="visible"
    }
    else{
        comments="<div class='comments"+postid+"'>"
        await fetch("/getcomments/",
        {
            method:"POST",
            headers:{'X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
            body:JSON.stringify({"postid":postid})
        })
        .then(res=>res.json())
        .then(async data=>{
            // commentBox=document.querySelector(".commentBox"+postid)
            commentIcon.src="/static/comment3.png"
            if(data.length!=0){
                postid=data[0]["post_id"]
                for(i in data){
                    await fetch("/getprofileimage/",
                    {
                        method:"POST",
                        headers:{'X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
                        body:JSON.stringify({"userid":data[i]["user_id"]})
                    }).then(resp=>resp.json())
                    .then(result=>
                        { 
                            comments+=`
                                <div class='d-flex align-items-center mt-2'>
                                    <img class='img-fluid img-thumbnail rounded-circle' style='height:50px;width:50px;margin-right:5px;' src='`+result["img"]+`'>
                                    <h5 class='card-text card-title'>`+result["username"]+`</h5>
                                </div>`
                        })
                        message=data[i]["message"]
                        comments+=`<p class='card-text' style='margin-left:5px; margin-bottom:0px'>`+message+`</p>`;
                    }
                }
            })
            comments+=`
            </div>
            <div class='d-flex flex-column align-items-end mt-1'>
                <img src='/static/message.png' class='img-fluid img-thumbnail' style='height:40px;width:40px;cursor:pointer;' onclick='addCommentBox(this,`+postid+`)'>
            </div>
            `
            document.querySelector(".notification"+postid).style.visibility="hidden"
            document.querySelector(".commentBox"+postid).innerHTML=comments+"</div>"
    }
}
function addCommentBox(element,postid){
    commentBox=document.querySelector(".commentBox"+postid) 
    addCommentForm=`
        <div class='d-flex flex-column align-items-end mt-2 addCommentBox`+postid+`'>
            <textarea class='form-control message`+postid+`' type='text' style='resize:none;'rows="3" name='message'></textarea>
            <button class='btn btn-primary btn-sm mt-1' onclick='addComment(`+postid+`)'>Add Comment</button>
        </div>
    `
    if(element.src.includes("message1")){
        element.src="/static/message.png"
        document.querySelector('.addCommentBox'+postid).remove()
    }
    else{
        element.src="/static/message1.png"
        commentBox.innerHTML+=addCommentForm
    }
}
async function addComment(postid){
    message=document.querySelector(".message"+postid).value
    document.querySelector(".message"+postid).value=""
    comments=document.querySelector(".comments"+postid)
    await fetch("/addcomment/",
    {
        method:"POST",
        headers:{'X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
        body:JSON.stringify({"message":message,"postid":postid})
    })
    .then(resp=>resp.json())
                    .then(result=>
                        { 
                            comments.innerHTML+=`
                            <div class='d-flex align-items-center mt-2'>
                                <img class='img-fluid img-thumbnail rounded-circle' style='height:50px;width:50px;margin-right:5px;' src='`+result["img"]+`'>
                                <h5 class='card-text card-title'>`+result["username"]+`</h5>
                            </div>`
                        })
                        comments.innerHTML+=`<p class='card-text' style='margin-left:5px; margin-bottom:0px'>`+message+`</p>`;
    noti=document.querySelector(".notification"+postid)
    noti.innerHTML=Number(noti.innerHTML)+1
    // document.querySelector(".commentIcon"+postid).src="/static/comment.png"
    // getComments(postid)
}
async function getPost(postid,username){
    await fetch("/getPost/",
    {
        method:"POST",
        headers:{'X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
        body:JSON.stringify({"postid":postid})
    })    .then(resp=>resp.json())
    .then(result=>
        { 
            document.querySelector(".postDisplay").innerHTML=`
    <div class="d-flex flex-column align-items-center mb-3">
        <div class="card mt-3" style="width: 18rem;">
            <img src="`+result["postImage"]+`" alt="">
            <div class="card-body pt-0 d-flex flex-column">
                <img class="img-fluid img-thumbnail rounded-circle" style="height:75px;width:75px; position: relative; bottom:37.5px;" src="`+result["posterPic"]+`" alt="">
                <h5 class="card-text card-title" style="position: relative; bottom:75px; left: 80px">`+result["poster"]+`</h5>
              <h5 class="card-title"style="margin-top: -75px;">`+result["title"]+`</h5>
              <p class="card-text mb-1">`+result["desc"]+`</p>
                <p class="card-text mb-0 notification`+postid+` bg-primary" style="
                position: relative;
                top: 13px;
                left: 25px;
                padding: 0px 7px;
                border-radius: 50%;
                color: white;
                align-self: start;
                visibility: visible;
                ">`+result["commentNum"]+`</p>
              <div class="controls d-flex justify-content-between">
                <div class="d-flex align-items-center img-fluid img-thumbnail">
                  <img onclick="getComments(`+postid+`)"src="/static/comment.png" class=" commentIcon`+postid+`" style="height: 30px;width: 30px; cursor: pointer;" alt="">
                </div>
                <div class="d-flex align-items-center img-fluid img-thumbnail">
                  <p class="card-text mb-0 likes`+postid+`">`+result["likeNum"]+`</p>
                    <img onclick="like(this,'`+postid+`')"  style="height: 30px;width: 30px; cursor: pointer;" src="`+result["likeImg"]+`">
                </div>
              </div>
              <div class="commentBox`+postid+`"></div>
              </div>
          </div>
      </div>
    </div>
    `
})
}
function editComment(commentid,element){
    editBox=document.createElement("div")
    textArea=document.createElement("textarea")
    textArea.style.resize="none"
    textArea.classList.add("form-control","mt-1")
    textArea.innerText=element.innerText
    button=document.createElement("button")
    button.innerText="Save"
    button.onclick=function(){
        element.innerText=textArea.value
        editBox.replaceWith(element)
        updateComment(commentid,textArea.value)
    }
    button.classList.add("btn","btn-primary","mt-1")
    editBox.appendChild(textArea)
    editBox.appendChild(button)
    element.replaceWith(editBox)
}
async function updateComment(commentid,message){
    await fetch("/updateComment/",
    {
        method:"POST",
        headers:{'X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
        body:JSON.stringify({"commentid":commentid,"message":message})
    }) 
}
async function deleteComment(commentid,element){
    if(document.querySelector(".deleteOptions")==null){
        div=document.createElement("div")
        div.classList.add("d-flex","flex-column","align-items-center","deleteOptions")
        text=document.createElement("p")
        text.innerText="Delete?"
        text.classList.add("mb-0")
        buttons=document.createElement("div")
        yes=document.createElement("button")
        yes.innerText="Yes"
        yes.onclick= async function(){
            await fetch("/deleteComment/",
            {
                method:"POST",
                headers:{'X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
                body:JSON.stringify({"commentid":commentid})
            }) 
            document.querySelector(".comment"+commentid).remove()
            document.querySelector(".myComments").innerHTML=""
        }
        yes.classList.add("btn","btn-danger","btn-sm")
        yes.style.marginRight="5px"
        no=document.createElement("button")
        no.innerText="No"
        no.onclick=function(){
            div.replaceWith(element)
        }
        no.classList.add("btn","btn-primary","btn-sm")
        buttons.appendChild(yes)
        buttons.appendChild(no)
        div.appendChild(text)
        div.appendChild(buttons)
        element.replaceWith(div)
    }
}

async function deletePost(postid,element){
    if(document.querySelector(".deleteOptions")==null){
        div=document.createElement("div")
        div.classList.add("d-flex","flex-column","align-items-end","deleteOptions")
        text=document.createElement("p")
        text.innerText="Delete?"
        text.classList.add("mb-0")
        buttons=document.createElement("div")
        yes=document.createElement("button")
        yes.innerText="Yes"
        yes.onclick= async function(){
            await fetch("/deletePost/",
            {
                method:"POST",
                headers:{'X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
                body:JSON.stringify({"postid":postid})
            }) 
            document.querySelector(".post"+postid).remove()
        }
        yes.classList.add("btn","btn-danger","btn-sm")
        yes.style.marginRight="5px"
        no=document.createElement("button")
        no.innerText="No"
        no.onclick=function(){
            div.replaceWith(element)
        }
        no.classList.add("btn","btn-primary","btn-sm")
        buttons.appendChild(yes)
        buttons.appendChild(no)
        div.appendChild(text)
        div.appendChild(buttons)
        element.replaceWith(div)
    }
}