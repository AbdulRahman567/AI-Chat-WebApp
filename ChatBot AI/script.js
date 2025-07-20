let prompt =document.querySelector("#prompt");
let submit =document.querySelector("#submit");
let chatContainer =document.querySelector(".chat-container");
let imageBtn = document.querySelector("#image");
let image = document.querySelector("#image img"); // This is icon image
let imageinput = document.querySelector("#image input");



const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBEVBPPNOs-yKLRwqZK_fkMDAdzAZbr_2A" 

let user={
    message:null,
    file : {
        mime_type:null,
        data:null
    }
}
async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chatarea")
    let requestOption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [
                {parts: [{text: user.message },(user.file.data?[{"inline_data":user.file}]:[])
            ]
            }]
        })
    };
    try{
        let response = await fetch(Api_Url, requestOption);
        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim(); 
        text.innerHTML=apiResponse;
        
    }
    catch(error){
        console.log(error);
    }
finally {
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

    // Reset icon image and remove selected image
    image.src = "image.png";
    image.classList.remove("choose");
    user.file = {};
}


}

function createChatBox(html , classes){
    let div = document.createElement("div");
    div.innerHTML=html;
    div.classList.add(classes);
    return div;
}


function handleChatResponse(userMessage) {
    user.message = userMessage
    let html = `<img src="user.png" alt="" id="userImage" width="8%">
            <div class="user-chatarea">
                ${user.message}
                ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg"/>` : ""}
            </div>`;

    prompt.value = "";
    let userChatBox = createChatBox(html, "user-chatbox");
    chatContainer.appendChild(userChatBox);

    chatContainer.scrollTo({top : chatContainer.scrollHeight , behavior: "smooth"});

    setTimeout(() => {
        let aiHtml = `<img src="ai.png" alt="" id="aiImage" width="10%">
                      <div class="ai-chatarea">
                          <img src="loading.webp" alt="" class="load" width="50px">
                      </div>`;
        let aiChatBox = createChatBox(aiHtml, "ai-chatbox");
        chatContainer.appendChild(aiChatBox);
        generateResponse(aiChatBox)

    }, 500);
}

prompt.addEventListener("keydown" , (e)=>{

    if(e.key == "Enter"){
        handleChatResponse(prompt.value)
    }    
})
submit.addEventListener("click" , ()=>{
    handleChatResponse(prompt.value)
})

imageinput.addEventListener("change", () => {
    const file = imageinput.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = (e) => {
        let base64string = e.target.result.split(",")[1];
        user.file = {
            mime_type: file.type,
            data: base64string
        };

        // Replace icon with selected image
        image.src = `data:${user.file.mime_type};base64,${user.file.data}`;
        image.classList.add("choose"); // Optional styling
    };

    reader.readAsDataURL(file);
});





image.addEventListener("click" , ()=>{
    imageBtn.querySelector("input").click();
})