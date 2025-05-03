const howto = document.querySelector(".howto");
const toDoInput = howto.querySelector("input");
const toDoDay = document.querySelector(".toDoDay");

function creatToDo(toDo) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.innerHTML = toDo;
  li.appendChild(span);

  toDoDay.appendChild(li);
}

function shildToDo(event) {
  event.preventDefault();

  const toDo = toDoInput.value;

  creatToDo(toDo);
  toDoInput.value = "";
}
function init() {
  howto.addEventListener("submit", shildToDo);
}
init();
