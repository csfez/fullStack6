const https = require('https');
const mysql = require('mysql2');
const express = require('express')
const app = express()
const cors = require('cors');

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

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Motdepasse17',
  database: 'mydb',
};

const connection = mysql.createConnection(dbConfig);

connection.connect(function(err) {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données :', err);
  } else {
    console.log('Connecté à la base de données MySQL');
  }
});

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

      // const table='todos'

      // connection.query(`SELECT * FROM ${table} WHERE userId = 1 AND completed = 1`, (err, rows) => {
      //   if (err) {
      //     console.error('Erreur lors de l\'exécution de la requête :', err);
      //   } else {
      //     // Traitez les résultats
      //     rows.forEach((todo) => {
      //       console.log('ID :', todo.id);
      //       console.log('title :', todo.title);
      //       console.log('Completed :', todo.completed);

            
      //     });
      //   }
      //   connection.end(); 
      // });
//});

app.get('/users/:id', (req, res) => {
  const userId = req.params.id;

  connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, rows) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      res.status(500).send('Erreur lors de la récupération des informations de l\'utilisateur');
    } else {
      if (rows.length === 0) {
        res.status(404).send('User no found');
      } else {
        const user = rows[0]; // Première ligne de résultats
        const userInfo = {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          address:user.address,
          phone:user.phone,
          website:user.website,
          company: user.company

        };
        console.log(userInfo);
        res.json(userInfo);
      }
    }
    // connection.end();
  });
});

//register

app.post('/:username/users', (req, res) => {
  const user = req.body; // Récupérer les données de l'utilisateur depuis la requête
  console.log("user register");
  console.log(user);

  // if (user) {
  // Vérifier si le nom d'utilisateur est déjà utilisé
  connection.query('SELECT * FROM users WHERE username = ?', [user.username], (err, rows) => {
    if (err) {
      console.error('Error while executing the query: ', err);
      res.status(500).send('Error checking username');
    } else {
      if (rows.length > 0) {
        res.status(400).send('Username is already in use');
      } else {
        const userToAdd = {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          address: user.address,
          phone: user.phone,
          website: user.website,
          company: user.company
        };

        connection.query('INSERT INTO users SET ?', [userToAdd], (err, result) => {
          if (err) {
            console.error('Error while executing the query: ', err);
            res.status(500).send('Error checking username');
          } else {
            const userId = result.insertId; // ID de l'utilisateur ajouté

            // Insérer les informations dans la table users_password
            const userData = {
              id: userId,
              username: user.username,
              password: user.password
            };

            connection.query('INSERT INTO users_password SET ?', [userData], (err, result) => {
              if (err) {
                console.error('Error while executing the query: ', err);
                res.status(500).send('Error checking username');
              } else {
                res.status(201).send(`User added with ID : ${userId}`);
              }
            });
          }
        });
      }
    }
  })
  // } else {
  //   res.status(400).send('Invalid user data');
  // };
  
});



app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body; // Récupérer les données mises à jour de l'utilisateur depuis la requête
  
  connection.query('UPDATE users SET ? WHERE id = ?', [updatedUser, userId], (err, result) => {
    if (err) {
      console.error('Error while executing the query: ', err);
      res.status(500).send('Error updating user');
    } else {
      res.send('Utilisateur mis à jour avec succès');
    }
  });
});

//delete all tables
app.delete('/:table/:id', (req, res) => {
  const Id = req.params.id;
  const table=req.params.table;
  connection.query('DELETE FROM ?? WHERE id = ?', [table,Id], (err, result) => {
    if (err) {
      console.error('Error while executing the query: ', err);
      res.status(500).send(`Error deleting ${table} `);
    } else {
      res.send(`${table} deleted successfully`);
    }
  });
});

//show posts
app.get('/:userid/posts', (req, res) => {
  const userId = req.params.userid;

  connection.query('SELECT * FROM posts WHERE userId = ?', [userId], (err, rows) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      res.status(500).send('Erreur lors de la récupération des informations de l\'utilisateur');
    } else {
      if (rows.length === 0) {
        res.status(404).send('posts not found');
      } else {
        const posts = rows.map(post => ({
          id: post.id,
          title: post.title,
          body: post.body,
        }));
        res.json(posts);
      }
    }
    // connection.end();
  });
});

//add post
app.post('/:userId/posts', (req, res) => {
  const userId = req.params.userId;
  const post = req.body;

  const postToAdd = {
    title: post.title,
    body: post.body,
    userId: userId
  };

  connection.query('INSERT INTO posts SET ?', [postToAdd], (err, result) => {
    if (err) {
      console.error('Error while executing the query: ', err);
      res.status(500).send('Error adding the post');
    } else {
      const postId = result.insertId;
      const addedPost = {
        id: postId,
        title: post.title,
        body: post.body,
        userId: userId
      };
      res.status(201).json(addedPost);
    }
  });
});

//have the users and passwords
app.get('/users_password', (req, res) => {
  const userName = req.query.username;
  const password = req.query.password;
  console.log("username in login ", userName);
  console.log("password in login ", password);

  connection.query('SELECT * FROM users_password WHERE username = ? AND password = ?', [userName, password], (err, rows) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      res.status(500).send('Erreur lors de la récupération des informations de l\'utilisateur');
    } else {
      if (rows.length === 0) {
        res.status(404).send('User not found');
      } else {
        const user = rows[0];
        connection.query('SELECT * FROM users WHERE username = ?', [userName], (err, rows) => {
          if (err) {
            console.error('Erreur lors de l\'exécution de la requête :', err);
            res.status(500).send('Erreur lors de la récupération des informations de l\'utilisateur');
          } else {
            if (rows.length === 0) {
              res.status(404).send('User no found');
            } else {
              const userfromUers = rows[0]; // Première ligne de résultats
              const userInfo = {
                id: userfromUers.id,
                name: userfromUers.name,
                username: userfromUers.username,
                email: userfromUers.email,
                address:userfromUers.address,
                phone:userfromUers.phone,
                website:userfromUers.website,
                company: userfromUers.company
      
              };
              console.log(userInfo);
              res.json(userInfo);
            }
          }
        });
      }
    }
  });
});

  // connection.query('SELECT users.*, users_password.* FROM users INNER JOIN users_password ON users.username = ? AND users_password.password = ?', [  userName, password], (err, rows) => {
  //   if (err) {
  //     console.error('Erreur lors de l\'exécution de la requête :', err);
  //     res.status(500).send('Erreur lors de la récupération des informations de l\'utilisateur');
  //   } else {
  //     if (rows.length === 0) {
  //       res.status(404).send('User not found');
  //     } else {
  //       const user = rows[0];
  //       const userInfo = {
  //         id: user.id,
  //         name: user.name,
  //         username: user.username,
  //         email: user.email,
  //         address: user.address,
  //         phone: user.phone,
  //         website: user.website,
  //         company: user.company
  //       };
  //       console.log(userInfo);
  //       res.json(userInfo);
  //     }
  //   }
  // });
// });


//show the todos
app.get('/:userId/todos', (req, res) => {
  const userId = req.params.userId;

  connection.query('SELECT * FROM todos WHERE userId = ?', [userId], (err, rows) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      res.status(500).send('Erreur lors de la récupération des todos');
    } else {
      if (rows.length === 0) {
        res.status(404).send('Aucun todos trouvé');
      } else {
        const todos = rows.map(todo => ({
          id: todo.id,
          title: todo.title,
          completed: todo.completed
        }));
        res.json(todos);
      }
    }
    // connection.end();
  });
});

//update todos completed
app.put('/todos/:Id', (req, res) => {
  const Id = req.params.Id;
  const { completed } = req.body;
  console.log("completed",completed);
  connection.query(
    'UPDATE todos SET completed = ? WHERE id = ?',
    [completed, Id],
    (err, result) => {
      if (err) {
        console.error('Erreur lors de la mise à jour du todo :', err);
        res.status(500).send('Erreur lors de la mise à jour du todo');
      } else {
        res.sendStatus(200);
      }
    }
  );
});

//update todo title  //dans le body il faut avoir le meme nom que on envois dans le client
app.put('/todosTitle/:Id', (req, res) => {
  const Id = req.params.Id;
  const { newTitle  } = req.body;
  console.log("title ",newTitle );

  connection.query(
    'UPDATE todos SET title = ? WHERE id = ?',
    [newTitle , Id],
    (err, result) => {
      if (err) {
        console.error('Error updating todo :', err);
        res.status(500).send('Error updating todo');
      } else {
        res.sendStatus(200);
      }
    }
  );
});


//update posts
app.put('/posts/:Id', (req, res) => {
  const Id = req.params.Id;
  const title = req.body.title;
  const body = req.body.body;

  connection.query(
    'UPDATE posts SET title = ?, body = ? WHERE id = ?',
    [title, body, Id],
    (err, result) => {
      if (err) {
        console.error('Erreur lors de la mise à jour du post :', err);
        res.status(500).send('Erreur lors de la mise à jour du post');
      } else {
        res.sendStatus(200);
      }
    }
  );
});

//update comment
app.put('/comments/:Id', (req, res) => {
  const Id = req.params.Id;
  const name = req.body.name;
  const body = req.body.body;

  connection.query(
    'UPDATE comments SET name = ?, body = ? WHERE id = ?',
    [name, body, Id],
    (err, result) => {
      if (err) {
        console.error('Erreur lors de la mise à jour du post :', err);
        res.status(500).send('Erreur lors de la mise à jour du post');
      } else {
        res.sendStatus(200);
      }
    }
  );
});


//add todo
app.post('/:userId/todos', (req, res) => {
  const userId = req.params.userId;
  const todo = req.body;

  const todoToAdd = {
    userId: userId,
    title: todo.title,
    completed: todo.completed
  };

  connection.query('INSERT INTO todos SET ?', [todoToAdd], (err, result) => {
    if (err) {
      console.error('Error while executing the query: ', err);
      res.status(500).send('Error adding the todo');
    } else {
      const todoId = result.insertId;
      const addedTodo = {
        id: todoId,
        userId: userId,
        title: todo.title,
        completed: todo.completed
      };
      res.status(201).json(addedTodo);
    }
  });
});

//have comments //work
app.get('/posts/:postid/comments', (req, res) => {
  const postId = req.params.postid;

  connection.query('SELECT * FROM comments WHERE postId = ?', [postId], (err, rows) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      res.status(500).send('Erreur lors de la récupération des comments');
    } else {
      if (rows.length === 0) {
        res.status(404).send('No comments found');
      } else {
        const comments = rows.map(comment => ({
          id: comment.id,
          postId:comment.postId,
          name: comment.name,
          email: comment.email,
          body:comment.body
        }));
        res.json(comments);
      }
    }
    // connection.end();
  });
});

//add comment //work //jai change comment en commentToAdd a la fin
app.post('/:postId/:email/comments', (req, res) => {
  const postId = req.params.postId;
  const email=req.params.email;
  const comment = req.body;
  console.log("postId ",postId);
  console.log("email ",email);
  console.log("comment ",comment);

  const commentToAdd = {
    postId:postId,
    name: comment.name,
    body: comment.body,
    email: email
  };

  connection.query('INSERT INTO comments SET ?', [commentToAdd], (err, result) => {
    if (err) {
      console.error('Error while executing the query: ', err);
      res.status(500).send('Error adding the comment');
    } else {
      const commentId = result.insertId;
      const addedComment = {
        id: commentId,
        postId:commentToAdd.postId,
        name: commentToAdd.name,
        email:commentToAdd.email,
        body: commentToAdd.body
       
      };

      console.log("addedComment ",addedComment);
      
      res.status(201).json(addedComment);
    }
  });
});


app.get('/:userid/albums', (req, res) => {
  const userId = req.params.userid;

  connection.query('SELECT * FROM albums WHERE userId = ?', [userId], (err, rows) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      res.status(500).send('Erreur lors de la récupération des albums');
    } else {
      if (rows.length === 0) {
        res.status(404).send('No albums found');
      } else {
        const albums = rows.map(album => ({
          id: album.id,
          userId:album.userId,
          title:album.title
        }));
        res.json(albums);
      }
    }
    // connection.end();
  });
});


app.get('/albums/:albumId/photos', (req, res) => {
  const albumId = req.params.albumId;

  connection.query('SELECT * FROM photos WHERE albumId = ?', [albumId], (err, rows) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      res.status(500).send('Erreur lors de la récupération des photos');
    } else {
      if (rows.length === 0) {
        res.status(404).send('No photos found');
      } else {
        const photos = rows.map(photo => ({
          id: photo.id,
          albumId: photo.albumId,
          title: photo.title,
          url: photo.url,
          thumbnailUrl: photo.thumbnailUrl
        }));
        res.json(photos);
      }
    }
  });
});


app.listen(3001, () => {
  console.log('Server is running on port 3000');
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
