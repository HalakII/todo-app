import * as basicLightbox from 'basiclightbox';
import '../../node_modules/basiclightbox/dist/basicLightbox.min.css';

const input = document.querySelector('.input-js');
const btn = document.querySelector('.btn-add');
const list = document.querySelector('.todo-list');
const LS_KEY = 'todo';
const todoArr = JSON.parse(localStorage.getItem(LS_KEY)) ?? [];
console.log(todoArr);

btn.addEventListener('click', createObj);
list.addEventListener('click', onListClick);
list.addEventListener('click', onDelClick);

if (todoArr.length) {
  const todosMarkup = todoArr.map(createMarkup).join('');
  //   console.log(todosMarkup);
  list.insertAdjacentHTML('beforeend', todosMarkup);
}

function onListClick(event) {
  //   console.log(event);
  if (event.target.nodeName !== 'LI') {
    return;
  }
  if (event.target.classList.contains('todo')) {
    event.target.classList.remove('todo');
    event.target.classList.add('complete');
    event.target.lastElementChild.classList.remove('btn-update');
    event.target.lastElementChild.classList.add('btn-delete');
  } else {
    event.target.classList.remove('complete');
    event.target.classList.add('todo');
    event.target.lastElementChild.classList.remove('btn-delete');
    event.target.lastElementChild.classList.add('btn-update');
  }
  changeLSStatus(event.target);
}

function onDelClick(event) {
  if (!event.target.classList.contains('btn-delete')) {
    return;
  }
  const dataLS = JSON.parse(localStorage.getItem(LS_KEY));
  const newArr = dataLS.filter(
    item => +event.target.closest('li').id !== item.id
  );
  event.target.closest('li').remove();
  localStorage.setItem(LS_KEY, JSON.stringify(newArr));
  console.log(newArr);
}

function createObj() {
  if (!input.value.trim()) {
    return;
  }
  const object = {
    id: Date.now(),
    status: 'todo',
    text: input.value,
  };

  list.insertAdjacentHTML('beforeend', createMarkup(object));
  todoArr.push(object);
  localStorage.setItem(LS_KEY, JSON.stringify(todoArr));
}

function createMarkup({ id, status, text }) {
  const toggleStatus = status === 'todo' ? 'btn-update' : 'btn-delete';
  return `<li class="${status}" id="${id}">
  <p>${text}</p>
  <button type="button" class="${toggleStatus}"></button>
</li>`;
}

function changeLSStatus(currentEl) {
  const dataLS = JSON.parse(localStorage.getItem(LS_KEY));
  const changeArr = dataLS.map(obj => {
    if (obj.id === Number(currentEl.id)) {
      obj.status = currentEl.classList[0];
    }
    return obj;
  });

  localStorage.setItem(LS_KEY, JSON.stringify(changeArr));
}

// const complete = data.map(item =>
//   item.id === Number(element.id)
//     ? {
//         ...item,
//         cls: item.cls === 'todo' ? 'complete' : 'todo',
//       }
//     : item
// );

//
