const searchBlock = document.querySelector(".search");
const form = searchBlock.querySelector("form");
const input = searchBlock.querySelector("input");
const labelsList = searchBlock.querySelector(".labels");
const savesList = searchBlock.querySelector(".saves");

let responseArray;

input.addEventListener("input", () => {
  debounce(input.value);
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
});

searchBlock.addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("labels__item")) {
    savesMake(target.dataset.index);
    input.value = "";
    listClean();
  }
  if (target.tagName === "BUTTON") {
    target.closest("div").remove();
  }
});

const debounce = (function () {
  let newCall;
  return function (value) {
    if (!value) {
      listClean();
      clearTimeout(newCall);
      return;
    }
    clearTimeout(newCall);
    newCall = setTimeout(() => getRepos(value), 400);
  };
})();

const getRepos = async function (value) {
  try {
    const data = await fetch(
      `https://api.github.com/search/repositories?q=${value}&sort=stars&per_page=5`
    );
    const response = await data.json();
    listClean();
    labelsMake(response);
    responseArray = response.items;
  } catch {}
};

const labelsMake = function (response) {
  const fragment = document.createDocumentFragment();
  response.items.forEach((item, index) => {
    const title = document.createElement("div");
    title.classList.add("labels__item");
    title.dataset.index = index;

    const content = document.createElement("p");
    content.classList.add("labels__text");
    content.textContent = item.name;

    title.appendChild(content);
    fragment.appendChild(title);
  });

  labelsList.appendChild(fragment);
};

const savesMake = function (elementIndex) {
  const save = document.createElement("div");
  save.classList.add("saves__item");

  const content = document.createElement("div");
  content.classList.add("saves__content");
  const nameTitle = document.createElement("p");
  nameTitle.textContent = `Name: ${responseArray[elementIndex].name}`;
  const ownerTitle = nameTitle.cloneNode(false);
  ownerTitle.textContent = `Owner: ${responseArray[elementIndex].owner.login}`;
  const rateTitle = nameTitle.cloneNode(false);
  rateTitle.textContent = `Stars: ${responseArray[elementIndex].stargazers_count}`;

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("saves__btn", "delete-btn");
  deleteBtn.textContent = "x";

  content.appendChild(nameTitle);
  content.appendChild(ownerTitle);
  content.appendChild(rateTitle);
  save.appendChild(content);
  save.appendChild(deleteBtn);
  savesList.appendChild(save);
};

const listClean = function () {
  labelsList.innerHTML = "";
};
