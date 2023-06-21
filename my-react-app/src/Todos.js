import React, { useState, useEffect } from 'react';
function Todos() {
    const [todos, setTodos] = useState([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [newTodoCompleted, setNewTodoCompleted] = useState(false);
    const [showformTodos, setshowformTodos] = useState(false);
    const userId = JSON.parse(localStorage["currentUser"]).id;

    
    async function fetchTodos(userId) {
        try {
          const response = await fetch(`http://localhost:3001/${userId}/todos`);
          const data = await response.json();
          setTodos(data);
        } catch (error) {
          console.error('Erreur lors de la récupération des todos:', error);
        }
      }

      useEffect(() => {
        fetchTodos(userId);
      }, []);

      function handleCheckboxChange(todoId, completed) {
        const updatedTodos = todos.map(todo => {
          if (todo.id === todoId) {
            return { ...todo, completed: !completed };
          }
          return todo;
        });
        setTodos(updatedTodos);
        updateTodoOnServer(todoId, !completed);
      }

      async function updateTodoOnServer(todoId, completed) {
        try {
          const response = await fetch(`http://localhost:3001/todos/${todoId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed }),
          });
      
          if (!response.ok) {
            console.error('Erreur lors de la mise à jour du todo sur le serveur');
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour du todo:', error);
        }
      }

      function handleAddClick() {
        const newTodo = {
          title: newTodoTitle,
          completed: newTodoCompleted
        };
      
        fetch(`http://localhost:3001/${userId}/todos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newTodo)
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Erreur lors de l\'ajout du todo sur le serveur');
          }
        })
        .then(data => {
          setTodos([...todos, data]);
          setNewTodoTitle('');
          setNewTodoCompleted(false);
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout du todo:', error);
        });
      }

      function showFormTodosClick() {
        setshowformTodos(true);
      }

      function handleSubmit(event) {
        event.preventDefault();
        handleAddClick();
      }

      function handleDeleteClick(item){
        const requestOptions = {
            method: 'DELETE',
          };
          
          fetch(`http://localhost:3001/todos/${item.id}`, requestOptions)
            .then(res => {
              if (res.ok || res.status == 204) {
                alert(`todo ${item.id} was deleted successfully`);
                setTodos(prevItems => prevItems.filter(todo => todo.id !== item.id));
    
              } else {
                console.error(`Request failed with status code ${res.statusCode}`);
                throw new Error('Something went wrong');
              }
            })
            .catch(error => {
              console.error('An error occurred:', error);
            });  
      }
      
      return (
        <div>
          <h1>Liste des todos</h1>
          <button id="addTodosButton" onClick={showFormTodosClick}>ADD NEW TODOS</button>
          {showformTodos && (
             <form onSubmit={handleSubmit}>
                <input
                type="text"
                value={newTodoTitle}
                onChange={event => setNewTodoTitle(event.target.value)}
                placeholder="Nouveau Todo"
                required
                />

                <input
                type="checkbox"
                checked={newTodoCompleted}
                onChange={event => setNewTodoCompleted(event.target.checked)}
                />
                <label>Complété</label>
                <button type="submit">Ajouter</button>
            </form>
            )}
          {todos.length === 0 ? (
            <p>Aucun todo trouvé.</p>
          ) : (
            <ul>
              {todos.map(todo => (
                <li key={todo.id}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleCheckboxChange(todo.id, todo.completed)}
                    />
                  <span>{todo.title}</span> 
                  <button onClick={() =>handleDeleteClick(todo)}>DELETE</button>

                </li>
              ))}
            </ul>
          )}
        </div>
      );
                  
  }
export default Todos;
  