const express = require("express");
const path = require("path");
const PORT = 5005;
const app = express();
const mongoose = require('mongoose')
const db = 'mongodb+srv://Muhammed:123123123@cluster0.fqbsrbu.mongodb.net/project-muha?retryWrites=true&w=majority&appName=Cluster0'
const Post = require('./models/post')
const Contact = require('./models/contacts')

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log('Connected to DB'))
  .catch((error) => console.log(error));
// Установка EJS в качестве шаблонизатора
app.set("view engine", "ejs");

// Middleware для обработки данных из формы
app.use(express.urlencoded({ extended: false }));

// Middleware для статических файлов (стили, скрипты и т.д.)
app.use(express.static(path.join(__dirname, 'public')));

// Функция для создания пути до шаблонов EJS
const createPath = (page) =>
  path.resolve(__dirname, "ejs-views", `${page}.ejs`);

// Маршрут для главной страницы
app.get("/", (req, res) => {
  res.render(createPath("index"));
});

// Маршрут для страницы с постами
app.get("/posts", (req, res) => {
  const title = 'Posts';
  Post.find()
    .sort({ createdAt: -1 }) // Assuming `createdAt` is the field you want to sort by
    .then((posts) => { // Corrected the variable name to `posts`
      console.log("Posts found:", posts);
      res.render(createPath("posts"), { title, posts });
    })
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    });
});

// Маршрут для страницы создания поста
app.get("/add-post", (req, res) => {
  res.render(createPath("add-post")); // Замените "add-post" на имя вашего шаблона, где находится форма создания поста
});

// Обработчик POST запроса для добавления поста
app.post('/add-post', (req, res) => {
  // Получаем данные из тела запроса
  const { id, title, text, date, author } = req.body;

  // Создаем новый объект поста
  const newPost = {
    id,
    title,
    text,
    date,
    author
  };
  const post = new Post({ title, author, text });
  post
    .save()
    .then((result) => {
      console.log("Post saved:", result);
      // Редирект на страницу с постами после добавления
      res.redirect('/posts');
    })
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    });
});

// Маршрут для страницы с контактами
app.get('/contacts', (req, res) => {
  const title = 'Contacts';
  Contact
    .find()
    .then((contacts) => res.render(createPath('contacts'), { contacts, title }))
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    })
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
