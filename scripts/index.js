let main = document.querySelector("main");
cats.forEach(function (cat) {
    let card = `<div class="${cat.favourite ? "card like" : "card"}" style="background-image: url(${cat.img_link})">
        <span>${cat.name}</span>
    </div>`;
    main.innerHTML += card;
});

const updCards = function (data) {
    data.forEach(function (cat) {
        if (cat.id) {
            let card = `<div class="${cat.favourite ? "card like" : "card"}" style="background-image: url(${cat.img_link || "images/cat.jpg"})">
                <span>${cat.name}</span>
            </div>`;
            main.innerHTML += card;
        }
    });
    let cards = document.getElementsByClassName("card");
    for (let i = 0, cnt = cards.length; i < cnt; i++) {
        const width = cards[i].offsetWidth;
        cards[i].style.height = width * 0.6 + "px";
    }
}

let addBtn = document.querySelector("#add");
let popupForm = document.querySelector("#popup-form");
let closePopupForm = popupForm.querySelector(".popup-close");
addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!popupForm.classList.contains("active")) {
        popupForm.classList.add("active");
        popupForm.parentElement.classList.add("active");
    }
});

closePopupForm.addEventListener("click", () => {
    popupForm.classList.remove("active");
    popupForm.parentElement.classList.remove("active");
})

let sign = document.querySelector("#sign");
let authForm = document.querySelector("#auth-form");
let closeAuthForm = authForm.querySelector(".auth-close");
sign.addEventListener("click", (e) => {
    e.preventDefault();
    if (!authForm.classList.contains("active")) {
        authForm.classList.add("active");
        authForm.parentElement.classList.add("active");
    }
});

closeAuthForm.addEventListener("click", () => {
    authForm.classList.remove("active");
    authForm.parentElement.classList.remove("active");
})

const api = new Api("nikitasid");

let form = document.forms[0];
form.img_link.addEventListener("change", (e) => {
    form.firstElementChild.style.backgroundImage = `url(${e.target.value})`
})
form.img_link.addEventListener("input", (e) => {
    form.firstElementChild.style.backgroundImage = `url(${e.target.value})`
})
form.addEventListener("submit", e => {
    e.preventDefault();
    let body = {};
    for (let i = 0; i < form.elements.length; i++) {
        let inp = form.elements[i];
        if (inp.type === "checkbox") {
            body[inp.name] = inp.checked;
        } else if (inp.name && inp.value) {
            if (inp.type === "number") {
                body[inp.name] = +inp.value;
            } else {
                body[inp.name] = inp.value;
            }
        }
    }
    console.log(body);
    api.addCat(body)
        .then(res => res.json())
        .then(data => {
            if (data.message === "ok") {
                form.reset();
                closePopupForm.click();
                api.getCat(body.id)
                    .then(res => res.json())
                    .then(cat => {
                        if (cat.message === "ok") {
                            catsData.push(cat.data);
                            localStorage.setItem("cats", JSON.stringify(catsData));
                            getCats(api, catsData);
                            location.reload(true);
                        } else {
                            console.log(cat);
                        }
                    })
            } else {
                console.log(data);
                api.getIds().then(r => r.json()).then(d => console.log(d));
            }
        })
})

let catsData = localStorage.getItem("cats");
catsData = catsData ? JSON.parse(catsData) : [];
const getCats = function (api, store) {
    if (!store.length) {
        api.getCats()
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.message === "ok") {
                    localStorage.setItem("cats", JSON.stringify(data.data));
                    catsData = [...data.data];
                    updCards(data.data);
                }
            })
    } else {
        updCards(store);
    }
}
getCats(api, catsData);

function setCookies()
{
  let email = document.getElementById('email').value;
  let pass = document.getElementById('pass').value;
  document.cookie="user=" + email;
  document.cookie="password=" + pass;
  location.reload();  
}

let submit = document.getElementById('submit')
submit.addEventListener('click', setCookies)

