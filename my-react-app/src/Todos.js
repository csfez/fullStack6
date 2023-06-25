import React, { useState, useEffect } from 'react';
function Todos() {
    const [todos, setTodos] = useState([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [updateTodoTitle, setUpdateTodoTitle] = useState('');

    const [newTodoCompleted, setNewTodoCompleted] = useState(false);
    const [showformTodos, setshowformTodos] = useState(false);
    
    const userId = JSON.parse(localStorage["currentUser"]).id;
  const [showformUpdate,setShowformUpdate]=useState(false);
  const [updateTodoId, setUpdateTodoId] = useState(null);

    
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

      function handleTitleChange(todoId, newTitle) {
        const updatedTodos = todos.map(todo => {
          if (todo.id === todoId) {
            return { ...todo, title: newTitle };
          }
          return todo;
        });
        setTodos(updatedTodos);
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
      
      function handleUpdateClick(item){
        setShowformUpdate(true);
        setUpdateTodoId(item.id);
      }

      function handleSubmitUpdate(event, item) {
        event.preventDefault(); // Prevent page reload
      
        const newTitle = updateTodoTitle;
        item.title = newTitle;
        fetch(`http://localhost:3001/todosTitle/${item.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ newTitle })
        })
          .then(response => {
            if (response.ok) {
              handleTitleChange(item.id, newTitle);
              setUpdateTodoTitle('');
              setShowformUpdate(false); // Hide the update form
            } else {
              throw new Error('Error updating todo on server');
            }
          })
          .catch(error => {
            console.error('Error updating todo:', error);
          });
      }
      
      const handleInputChange = (event) => {
        const { value } = event.target;
        setUpdateTodoTitle(value);
      };
    
      const handleCancel = () => {
        setShowformUpdate(false);
        setUpdateTodoTitle('');
      };

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
                <button type="submit">Add</button>
            </form>
            )}
          {todos.length === 0 ? (
            <p>no todo found</p>
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
                  <button onClick={() =>handleUpdateClick(todo)}>Update</button>
                  {showformUpdate && updateTodoId === todo.id &&(
                    <form onSubmit={event => handleSubmitUpdate(event, todo)}>

                    <input
                    type="text"
                    className="inputTypeIn"
                    value={updateTodoTitle===''?todo.title:updateTodoTitle}
                    onChange={handleInputChange}
                    required
                    />
                   <button type="submit">SAVE</button>
                   <button onClick={handleCancel}>CANCEL</button>

                    </form>
                    )}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
                  
  }
export default Todos;
  