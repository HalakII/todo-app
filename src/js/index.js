import * as basicLightbox from 'basiclightbox';
import '../../node_modules/basiclightbox/dist/basicLightbox.min.css';

const input = document.querySelector('.input-js');
const btn = document.querySelector('.btn-add');
const list = document.querySelector('.todo-list');
const LS_KEY = 'todo';

const todoArr = JSON.parse(localStorage.getItem(LS_KEY)) ?? [];
console.log(todoArr);

let modalWindow = {};
let btnModalClose = null;
let btnModalUpdate = null;
let inputModal = null;
let editId = null;

btn.addEventListener('click', addTodo);
list.addEventListener('click', onListClick);
list.addEventListener('click', onDelClick);
list.addEventListener('click', onEditClick);

if (todoArr.length) {
  const todosMarkup = todoArr.map(todoMarkup).join('');
  //   console.log(todosMarkup);
  list.insertAdjacentHTML('beforeend', todosMarkup);
}

// const instance = basicLightbox.create(
//   document.querySelector('.modal-container')
// );
// instance.show();

function addTodo() {
  if (!input.value.trim()) {
    return;
  }
  const object = {
    id: Date.now(),
    status: 'todo',
    text: input.value,
  };

  list.insertAdjacentHTML('beforeend', todoMarkup(object));
  todoArr.push(object);
  localStorage.setItem(LS_KEY, JSON.stringify(todoArr));
}

function onListClick(event) {
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

function onEditClick(event) {
  if (!event.target.classList.contains('btn-update')) {
    return;
  }
  console.dir(event.target.closest('li'));
  editId = +event.target.closest('li').id;
  const dataLS = JSON.parse(localStorage.getItem(LS_KEY));

  const todoObj = dataLS.find(obj => obj.id === editId);

  console.log(todoObj);
  modalWindow = basicLightbox.create(createModalTemplate(todoObj), {
    onShow: () => {},
    onClose: modalWindow => {
      btnModalClose.removeEventListener('click', onModalCloseClick);
      btnModalUpdate.removeEventListener('click', onModalUpdate);
    },
  });

  btnModalClose = modalWindow.element().querySelector('.btn-close-modal');
  btnModalClose.addEventListener('click', onModalCloseClick);

  btnModalUpdate = modalWindow.element().querySelector('.btn-update-modal');
  btnModalUpdate.addEventListener('click', onModalUpdate);
  inputModal = modalWindow.element().querySelector('.input-modal');

  modalWindow.show();
}

function onModalUpdate() {
  if (!inputModal.value.trim()) {
    return;
  }

  const dataLS = JSON.parse(localStorage.getItem(LS_KEY));
  const changeArr = dataLS.map(obj =>
    obj.id === editId ? { ...obj, text: inputModal.value } : obj
  );

  console.log(changeArr);
  localStorage.setItem(LS_KEY, JSON.stringify(changeArr));
  modalWindow.close();
  console.log('M update');
  document.getElementById(editId).firstElementChild.textContent =
    inputModal.value;
}

function onModalCloseClick() {
  console.log('M close');
  modalWindow.close();
}

function createModalTemplate({ text }) {
  return `<div class="modal-container">
      <div class="input-container">
        <input type="text" class="input-modal"  value="${text}" />
        <button type="button" class="btn-update-modal">Update todo</button>
      </div>
      <button type="button" class="btn-close-modal"></button>
    </div>`;
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

function todoMarkup({ id, status, text }) {
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

// import * as basicLightbox from 'basiclightbox';
// import '../../node_modules/basiclightbox/dist/basicLightbox.min.css';
