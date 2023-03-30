function userProfile(select){
    likedPosts=document.querySelector(".likedPosts")
    myPosts=document.querySelector(".myPosts")
    myComments=document.querySelector(".myComments")
    if(select.value=="myComments"){
        likedPosts.style.display="none"
        myPosts.style.display="none"
        myComments.style.display="flex"
    }
    else if (select.value=="myPosts") {
        likedPosts.style.display="none"
        myPosts.style.display="flex"
        myComments.style.display="none"
    } else {
        likedPosts.style.display="flex"
        myPosts.style.display="none"
        myComments.style.display="none"
    }

}
function transfer(){

}
function editText(element,postid){
    console.log(element.tagName)
    if(document.querySelector(".editDiv")==null){
        // if(element.tagName=="H5" || element.tagName=="P"){
        if(element.tagName=="IMG"){
            editDiv=document.createElement("form")
            editDiv.action="/uploadPostImage/"
            editDiv.method="POST"
            editDiv.enctype="multipart/form-data"
            // editDiv.onsubmit=function(event){event.preventDefault()}
            csrf=document.querySelector('[name=csrfmiddlewaretoken]')
            editDiv.appendChild(csrf)
            info=document.createElement("input")
            info.type="hidden"
            info.name="postid"
            info.value=postid
            editDiv.appendChild(info)
        }
        else if(element.tagName=="H5" || element.tagName=="P"||element.tagName=="H4"){

            editDiv=document.createElement("div")
        }
        editDiv.classList.add("d-flex","flex-column","justify-content-end","editDiv")
        // editDiv.style.height='0px'
        // editDiv.style.width='0px'
        console.log(editDiv)
        type=""
        if(element.tagName=="H5"){
            editBox=document.createElement("input")
            type="title"
        }
        else if(element.tagName=="P"||element.tagName=="H4"){
            editBox=document.createElement("textarea")
            type="desc"
        }
        else if(element.tagName=="IMG"){
            editBox=document.createElement("input")
            type="img"
            editBox.type="file"
            editBox.name="file"
            editDiv.style.height=element.height+"px"
            editDiv.style.width=element.width+"px"
            editDiv.style.backgroundImage="url("+element.src+")"
            editDiv.style.backgroundSize="contain"
            // console.log(element.height)
            // element.replaceWith(fileinput)
        }
        // if(element.tagName=="H5" || element.tagName=="P"){
            editBox.classList=element.classList
            editBox.classList.add("form-control")
            editBox.value=element.innerText
            editBox.style.cssText=element.style.cssText
            editDiv.appendChild(editBox)
            editButton=document.createElement("Button")
            editButton.innerText="Save"
            editButton.classList.add("btn","btn-primary")
            if(element.tagName=="H5" || element.tagName=="P"){
                editButton.addEventListener('click', e => {

                    element.innerHTML=editBox.value
                    updatePost(postid,type,element.innerHTML)
                    editDiv.replaceWith(element)
                });
            }
            if(element.tagName=="H4"){
                editButton.addEventListener('click', e => {

                    element.innerHTML=editBox.value
                    updateProfile(type,element.innerHTML)
                    editDiv.replaceWith(element)
                });
            }
            editDiv.appendChild(editButton)
            element.replaceWith(editDiv)
        // }
        }
    //     if(element.tagName=="IMG"){
    //         form=document.createElement("form")
    //         form.action="/uploadPostImage/"
    //         form.method="post"
    //         form.enctype="multipart/form-data"
    //         csrf=document.querySelector('[name=csrfmiddlewaretoken]')
    //         info=document.createElement("input")
    //         info.type="hidden"
    //         info.name="postid"
    //         info.value=postid
    //         input=document.createElement("input")
    //         input.type="file"
    //         input.name="file"
    //         button=document.createElement("button")
    //         button.innerText="Submit"
    //         form.appendChild(csrf)
    //         form.appendChild(info)
    //         form.appendChild(input)
    //         form.appendChild(button)
    //         element.replaceWith(form)
    //     }
    // }
} 
function editIcon(element){
    if(document.querySelector(".editDiv")==null){

        form=document.createElement("form")
        form.classList=element.classList
        form.style.cssText=element.style.cssText
        form.style.backgroundImage="url("+element.src+")"
        form.style.backgroundSize="contain"
        form.action="/uploadPostImage/"
        form.method="post"
        form.enctype="multipart/form-data"
        form.classList.add("d-flex","flex-column","justify-content-end")
        csrf=document.querySelector('[name=csrfmiddlewaretoken]')
        info=document.createElement("input")
        info.type="hidden"
        info.name="postid"
        info.value=""
        input=document.createElement("input")
        input.type="file"
        input.name="file"
        input.classList.add("form-control","editDiv")
        button=document.createElement("button")
        button.innerText="Submit"
        button.classList.add("btn","btn-primary")
        form.appendChild(csrf)
        form.appendChild(info)
        form.appendChild(input)
        form.appendChild(button)
        element.replaceWith(form)
    }
}
        

async function updatePost(postid,type,data){
    await fetch("/updatePost/",
    {
        method:"POST",
        headers:{'X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
        body:JSON.stringify({"postid":postid,"type":type,"data":data})
    })
   
}

 async function updateProfile(type,data){
    await fetch("/updateProfile/",
    {
        method:"POST",
        headers:{'X-CSRFToken':document.querySelector('[name=csrfmiddlewaretoken]').value},
        body:JSON.stringify({"type":type,"data":data})
    })
   
}