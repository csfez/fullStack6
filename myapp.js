const https = require('https');
const mysql = require('mysql2');

// Fonction pour récupérer les données JSON depuis l'URL
function getJSONData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', error => {
      reject(error);
    });
  });
}

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Motdepasse17',
  database: 'mydb',
});

    connection.connect(function(err) {
      if (err) throw err;
      console.log('Connected to MySQL!');
    
      const table='todos'

      connection.query(`SELECT * FROM ${table} WHERE userId = 1 AND completed = 1`, (err, rows) => {
        if (err) {
          console.error('Erreur lors de l\'exécution de la requête :', err);
        } else {
          // Traitez les résultats
          rows.forEach((todo) => {
            console.log('ID :', todo.id);
            console.log('title :', todo.title);
            console.log('Completed :', todo.completed);

            
          });
        }
        connection.end(); 
      });
});

// // Récupération des données JSON depuis les URLs
// Promise.all([
//   getJSONData('https://jsonplaceholder.typicode.com/users'),
//   getJSONData('https://jsonplaceholder.typicode.com/todos'),
//   getJSONData('https://jsonplaceholder.typicode.com/photos'),
//   getJSONData('https://jsonplaceholder.typicode.com/comments'),
//   getJSONData('https://jsonplaceholder.typicode.com/albums'),
//   getJSONData('https://jsonplaceholder.typicode.com/posts')
// ])
//   .then(([users, todos, photos, comments, albums, posts]) => {
//     // Connexion à MySQL
//     const connection = mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'Motdepasse17',
//       database: 'mydb',
//     });

//     connection.connect(function(err) {
//       if (err) throw err;
//       console.log('Connected to MySQL!');

//       // Création de la table "users"
//       const createUsersTableQuery = `CREATE TABLE users (
//         id INT PRIMARY KEY,
//         name VARCHAR(255),
//         username VARCHAR(255),
//         email VARCHAR(255),
//         address VARCHAR(255),
//         phone VARCHAR(255),
//         website VARCHAR(255),
//         company VARCHAR(255)
//       )`;

//       connection.query(createUsersTableQuery, function(err, result) {
//         if (err) throw err;
//         console.log('Table "users" created');

//         // Insertion des données JSON dans la table "users"
//         const insertUsersQuery = 'INSERT INTO users (id, name, username, email, address, phone, website, company) VALUES ?';
//         const usersValues = users.map(user => [
//           user.id,
//           user.name,
//           user.username,
//           user.email,
//           user.address.street,
//           user.phone,
//           user.website,
//           user.company.name
//         ]);

//         connection.query(insertUsersQuery, [usersValues], function(err, result) {
//           if (err) throw err;
//           console.log(`Inserted ${result.affectedRows} rows into table "users"`);
//         });
//       });

//       // Création de la table "todos"
//       const createTodosTableQuery = `CREATE TABLE todos (
//         userId INT,
//         id INT PRIMARY KEY,
//         title VARCHAR(255),
//         completed BOOLEAN
//       )`;

//       connection.query(createTodosTableQuery, function(err, result) {
//         if (err) throw err;
//         console.log('Table "todos" created');

//         // Insertion des données JSON dans la table "todos"
//         const insertTodosQuery = 'INSERT INTO todos (userId, id, title, completed) VALUES ?';
//         const todosValues = todos.map(todo => [
//           todo.userId,
//           todo.id,
//           todo.title,
//           todo.completed
//         ]);

//         connection.query(insertTodosQuery, [todosValues], function(err, result) {
//           if (err) throw err;
//           console.log(`Inserted ${result.affectedRows} rows into table "todos"`);
//         });
//       });

//       // Création de la table "photos"
//       const createPhotosTableQuery = `CREATE TABLE photos (
//         id INT PRIMARY KEY,
//         albumId INT,
//         title VARCHAR(255),
//         url VARCHAR(255),
//         thumbnailUrl VARCHAR(255)
//       )`;

//       connection.query(createPhotosTableQuery, function(err, result) {
//         if (err) throw err;
//         console.log('Table "photos" created');

//         // Insertion des données JSON dans la table "photos"
//         const insertPhotosQuery = 'INSERT INTO photos (id, albumId, title, url, thumbnailUrl) VALUES ?';
//         const photosValues = photos.map(photo => [
//           photo.id,
//           photo.albumId,
//           photo.title,
//           photo.url,
//           photo.thumbnailUrl
//         ]);

//         connection.query(insertPhotosQuery, [photosValues], function(err, result) {
//           if (err) throw err;
//           console.log(`Inserted ${result.affectedRows} rows into table "photos"`);
//         });
//       });

//       // Création de la table "comments"
//       const createCommentsTableQuery = `CREATE TABLE comments (
//         id INT PRIMARY KEY,
//         postId INT,
//         name VARCHAR(255),
//         email VARCHAR(255),
//         body TEXT
//       )`;

//       connection.query(createCommentsTableQuery, function(err, result) {
//         if (err) throw err;
//         console.log('Table "comments" created');

//         // Insertion des données JSON dans la table "comments"
//         const insertCommentsQuery = 'INSERT INTO comments (id, postId, name, email, body) VALUES ?';
//         const commentsValues = comments.map(comment => [
//           comment.id,
//           comment.postId,
//           comment.name,
//           comment.email,
//           comment.body
//         ]);

//         connection.query(insertCommentsQuery, [commentsValues], function(err, result) {
//           if (err) throw err;
//           console.log(`Inserted ${result.affectedRows} rows into table "comments"`);
//         });
//       });

//       // Création de la table "albums"
//       const createAlbumsTableQuery = `CREATE TABLE albums (
//         id INT PRIMARY KEY,
//         userId INT,
//         title VARCHAR(255)
//       )`;

//       connection.query(createAlbumsTableQuery, function(err, result) {
//         if (err) throw err;
//         console.log('Table "albums" created');

//         // Insertion des données JSON dans la table "albums"
//         const insertAlbumsQuery = 'INSERT INTO albums (id, userId, title) VALUES ?';
//         const albumsValues = albums.map(album => [
//           album.id,
//           album.userId,
//           album.title
//         ]);

//         connection.query(insertAlbumsQuery, [albumsValues], function(err, result) {
//           if (err) throw err;
//           console.log(`Inserted ${result.affectedRows} rows into table "albums"`);
//         });
//       });

//       // Création de la table "posts"
//       const createPostsTableQuery = `CREATE TABLE posts (
//         id INT PRIMARY KEY,
//         userId INT,
//         title VARCHAR(255),
//         body TEXT
//       )`;

//       connection.query(createPostsTableQuery, function(err, result) {
//         if (err) throw err;
//         console.log('Table "posts" created');
      
//         // Insertion des données JSON dans la table "posts"
//         const insertPostsQuery = 'INSERT INTO posts (id, userId, title, body) VALUES ?';
//         const postsValues = posts.map(post => [
//           post.id,
//           post.userId,
//           post.title,
//           post.body
//         ]);

//         connection.query(insertPostsQuery, [postsValues], function(err, result) {
//           if (err) throw err;
//           console.log(`Inserted ${result.affectedRows} rows into table "posts"`);
//         });
//       });

//       // Création de la table "users_password"
//       const createUsersPasswordTableQuery = `CREATE TABLE users_password (
//         id INT PRIMARY KEY,
//         username VARCHAR(255),
//         password INT,
//         access VARCHAR(255)
//       )`;

//       connection.query(createUsersPasswordTableQuery, function(err, result) {
//         if (err) throw err;
//         console.log('Table "users_password" created');

//         // Insertion des données JSON dans la table "users_password"
//         const insertUsersPasswordQuery = 'INSERT INTO users_password (id, username, password, access) VALUES ?';
//         const usersPasswordValues = users.map(user => [
//           user.id,
//           user.username,
//           parseInt(user.address.geo.lat.substring(user.address.geo.lat.length - 4)),
//           'restricted'
//         ]);

//         connection.query(insertUsersPasswordQuery, [usersPasswordValues], function(err, result) {
//           if (err) throw err;
//           console.log(`Inserted ${result.affectedRows} rows into table "users_password"`);

//           connection.end(); // Ferme la connexion avec MySQL
//         });
//       });
//     });
//   })
//   .catch(error => {
//     console.error('Une erreur s\'est produite lors de la récupération des données JSON :', error);
//   });
