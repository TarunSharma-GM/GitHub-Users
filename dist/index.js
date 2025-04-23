"use strict";
const getUsername = document.querySelector("#user");
const formSubmit = document.querySelector("#form");
const main_container = document.querySelector(".main_container");
const GITHUBURL = "https://api.github.com/users";
async function myCustomFetcher(url, options) {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}
const showResultUI = (singleUser) => {
    const { avatar_url, login, html_url } = singleUser;
    main_container.insertAdjacentHTML("beforeend", `<div class='card'>
        <img src=${avatar_url} alt=${login}/>
        <hr />
        <div class="card-footer">
        <img src="${avatar_url}" alt=${login}" />
        <p>${login}</p>
        <a href=${html_url}> Github </a>
        </div>
        </div>
        `);
};
function fetchUserData(url) {
    myCustomFetcher(url, {}).then((userInfo) => {
        for (const singleUser of userInfo) {
            showResultUI(singleUser);
        }
    });
}
fetchUserData(GITHUBURL);
formSubmit.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchTerm = getUsername.value.toLowerCase();
    if (searchTerm.length === 0) {
        main_container?.querySelector(".empty-msg")?.remove();
        fetchUserData(GITHUBURL);
    }
    else {
        try {
            let allUserData = await myCustomFetcher(`${GITHUBURL}/${searchTerm}`, {});
            console.log(allUserData);
            main_container.innerHTML = "";
            if (allUserData.status === '404') {
                main_container?.insertAdjacentHTML("beforeend", `<p class="empty-msg">No matching user found. Please provide exact username</p>`);
            }
            else {
                showResultUI(allUserData);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
});
