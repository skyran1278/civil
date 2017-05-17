const express = require('express');
const Todo = require('./db');

const router = express.Router();

router.get('/', function(req, res, next) {
  Todo.find({}, function(error, todos) {
    res.render('index', { title: 'TodoApp', todos: todos });
  });
});

function writeAccountData(id, title, type, number, date) {
    const accountRef = database.ref(`skyran/${id}`);
    accountRef.set({
        title,
        type,
        number,
        date,
    });
    accountRef.on('value', () => {
        window.location = './index.html';
    });
}

function updateBtnListener() {
    const updateBtns = document.querySelectorAll('.update-btn');
    for (let i = 0; i < updateBtns.length; i += 1) {
        updateBtns[i].addEventListener('click', (e) => {
            const id = updateBtns[i].getAttribute('data-id');
            e.preventDefault();
            const accountRef = database.ref(`skyran/${id}`);
            accountRef.on('value', (snapshot) => {
                // window.location = '/update.html?id=' + id +
                // '&title=' + snapshot.val().title + '&type=' + snapshot.val().type +
                // '&number=' + snapshot.val().number + '&date=' + snapshot.val().date;
                window.location = `/update.html?id=${id}&title=${snapshot.val().title}&type=${snapshot.val().type}&number=${snapshot.val().number}&date=${snapshot.val().date}`;
            });
        });
    }
}

function deleteData(id) {
    const accountRef = database.ref(`skyran/${id}`);
    accountRef.remove();
    accountRef.on('value', () => {
        // let str =
        //             `
        //     <div class="alert alert-warning alert-dismissible" role="alert">
        //         <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        // <span aria-hidden="true">&times;</span></button>
        //         <strong>Warning!</strong> Better check yourself, you're not looking too good.
        //     </div>
        // `;
        // document.querySelector('#messenge').innerHTML = str;
        window.location = './index.html';
    });
}

function deleteBtnListener() {
    const deleteBtns = document.querySelectorAll('.delete-btn');
    for (let i = 0; i < deleteBtns.length; i += 1) {
        deleteBtns[i].addEventListener('click', (e) => {
            const id = deleteBtns[i].getAttribute('data-id');
            e.preventDefault();
            // if (confirm('確認刪除？')) {
            //     deleteData(id);
            // } else {
            //     alert('你按下取消');
            // }
            deleteData(id);
        });
    }
}

function readAccountData() {
    let str = `
        <thead>
            <tr>
                <th class="col-md-1"></th>
                <th class="col-md-1">大梁</th>
                <th class="col-md-1">小梁</th>
                <th class="col-md-1">柱</th>
                <th class="col-md-1">樓板</th>
                <th class="col-md-1">地下室外牆</th>
                <th class="col-md-1">基礎版</th>
                <th class="col-md-1">大地梁</th>
                <th class="col-md-1">小地梁</th>
                <th class="col-md-1"></th>
            </tr>
        </thead>
    `;

    for (let i = 30 - 1; i >= 0; i -= 1) {
        str +=
            `
        <tr>
            <td></td>
            <td>
                <button type="button" class="btn btn-danger delete-btn" data-id="${i}">${i}</button>
            </td>
            <td>
                <button type="button" class="btn btn-danger delete-btn" data-id="${i}">${i}</button>
            </td>
            <td>
                <button type="button" class="btn btn-danger delete-btn" data-id="${i}">${i}</button>
            </td>
            <td>
                <button type="button" class="btn btn-primary update-btn" data-id="${i}">${i}</button>
            </td>
            <td>
                <button type="button" class="btn btn-primary update-btn" data-id="${i}">${i}</button>
            </td>
            <td>
                <button type="button" class="btn btn-primary update-btn" data-id="${i}">${i}</button>
            </td>
            <td>
                <button type="button" class="btn btn-primary update-btn" data-id="${i}">${i}</button>
            </td>
            <td>
                <button type="button" class="btn btn-primary update-btn" data-id="${i}">${i}</button>
            </td>
            <td></td>
        </tr>
        `;
    }


    document.querySelector('#data-table').innerHTML = str;
    updateBtnListener();
    deleteBtnListener();
}

function readFormData() {
    const params = window.location.search.replace('?', '').split('&');
    const addFormRef = document.querySelector('#add-form');
    addFormRef.title.value = decodeURI(params[1].split('=')[1]);
    addFormRef.type.value = params[2].split('=')[1];
    addFormRef.number.value = params[3].split('=')[1];
    addFormRef.date.value = params[4].split('=')[1];
}

function updateData(id, title, type, number, date) {
    const accountRef = database.ref(`skyran/${id}`);
    accountRef.update({
        title,
        type,
        number,
        date,
    });
    accountRef.on('value', () => {
        window.location = './read.html';
    });
}

function submitListener(submitType) {
    const addFormRef = document.querySelector('#add-form');
    addFormRef.addEventListener('submit', (e) => {
        e.preventDefault();
        let id = uuid.v4(); // random
        const title = addFormRef.title.value;
        const type = addFormRef.type.value;
        const number = addFormRef.number.value;
        const date = addFormRef.date.value;
        if (submitType === 'create') {
            writeAccountData(id, title, type, number, date);
        } else {
            const params = window.location.search.replace('?', '').split('&');
            id = params[0].split('=')[1];
            updateData(id, title, type, number, date);
        }
    });
}

const path = window.location.pathname;
// console.log(path);
switch (path) {
case '/overview.html':
    readAccountData();
    break;
case '/create.html':
    submitListener('create');
    break;
case '/update.html':
    readFormData();
    submitListener('update');
    break;
case '/read.html':
    readAccountData();
    break;
default:
}
