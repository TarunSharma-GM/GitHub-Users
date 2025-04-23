const getUsername = document.querySelector("#user") as HTMLInputElement;
const formSubmit = document.querySelector("#form") as HTMLFormElement;
const main_container = document.querySelector(".main_container") as HTMLElement;
const GITHUBURL = "https://api.github.com/users";

interface UserData {
    id:number;
    login:string;
    avatar_url:string;
    location:string;
    html_url:string
}

async function myCustomFetcher<T>(url:string, options?:RequestInit):Promise<T>{
    const response = await fetch(url, options);
    if(!response.ok) {
        throw new Error(`Network Response was not ok - status:${response.status}`);
    }
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
        fetchUserData(GITHUBURL);
    }
    else{
        try{
            const allUserData = await myCustomFetcher<UserData>(`${GITHUBURL}/${searchTerm}`,{});
            main_container.innerHTML = "";
            if(!allUserData){
                main_container?.insertAdjacentHTML(
                    "beforeend",
                    `<p class="empty-msg">No matchingusers found. Provide exact username.</p>`
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