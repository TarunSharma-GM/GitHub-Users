const getUsername = document.querySelector("#user") as HTMLInputElement;
const formSubmit = document.querySelector("#form") as HTMLFormElement;
const main_container = document.querySelector(".main_container") as HTMLElement;
const GITHUBURL = "https://api.github.com/users";

interface UserData {
    id:number;
    login:string;
    avatar_url:string;
    location:string;
    html_url:string;
    status?:string;
}

async function myCustomFetcher<T>(url:string, options?:RequestInit):Promise<T>{
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

const showResultUI = (singleUser:UserData) => {
    const {avatar_url, login, html_url} = singleUser;
    main_container.insertAdjacentHTML(
        "beforeend",
        `<div class='card'>
        <img src=${avatar_url} alt=${login}/>
        <hr />
        <div class="card-footer">
        <img src="${avatar_url}" alt=${login}" />
        <p>${login}</p>
        <a href=${html_url}> Github </a>
        </div>
        </div>
        `
    );
}

function fetchUserData(url:string){
    myCustomFetcher<UserData[]>(url,{}).then((userInfo)=>{
        for(const singleUser of userInfo) {
            showResultUI(singleUser);
        }
    });
}

fetchUserData(GITHUBURL);

formSubmit.addEventListener("submit", async(e)=>{
    e.preventDefault();
    const searchTerm = getUsername.value.toLowerCase();
    if(searchTerm.length === 0){
        main_container?.querySelector(".empty-msg")?.remove();
        fetchUserData(GITHUBURL);
    }
    else{
        try{
            let allUserData = await myCustomFetcher<UserData>(`${GITHUBURL}/${searchTerm}`,{});
            console.log(allUserData)
            main_container.innerHTML = "";
            if(allUserData.status === '404'){
                main_container?.insertAdjacentHTML(
                    "beforeend",
                    `<p class="empty-msg">No matching user found. Please provide exact username</p>`
                )
            }
            else{
                    showResultUI(allUserData);
            }
        } 
        catch(error) {
            console.log(error)
        }
    }
});