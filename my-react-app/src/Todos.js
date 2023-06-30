import React, { useState, useEffect } from 'react';

function Todos() {
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [uncompletedTodos, setUncompletedTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [updateTodoTitle, setUpdateTodoTitle] = useState('');

  const [newTodoCompleted, setNewTodoCompleted] = useState(false);
  const [showformTodos, setshowformTodos] = useState(false);
  const [showCompletedTodos, setShowCompletedTodos] = useState(false);
  const [showUncompletedTodos, setShowUncompletedTodos] = useState(false);

  const [showTodos, setShowTodos] = useState(true);
  const [currentTodosList, setCurrentTodosList] = useState([]);

  const userId = JSON.parse(localStorage["currentUser"]).id;
  const [showformUpdate, setShowformUpdate] = useState(false);
  const [updateTodoId, setUpdateTodoId] = useState(null);

  async function fetchTodos(userId) {
    try {
      const response = await fetch(`http://localhost:3001/${userId}/todos`);
      const data = await response.json();
      setTodos(data);
      setCurrentTodosList(data);
      // setCompletedTodos(data.filter(todo => todo.completed));
      // setUncompletedTodos(data.filter(todo => !todo.completed));
    } catch (error) {
      console.error('Error retrieving todos:', error);
    }
  }

  useEffect(() => {
    fetchTodos(userId);
  }, []);

  function handleTitleChange(todoId, newTitle) {
    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        return { ...todo, title: newTitle };
      }
      return todo;
    });
    setTodos(updatedTodos);
    setCompletedTodos(updatedTodos.filter(todo => todo.completed));
    setUncompletedTodos(updatedTodos.filter(todo => !todo.completed));
    if (showCompletedTodos) {
      setCurrentTodosList(updatedTodos.filter(todo => todo.completed));
    } else if (showUncompletedTodos) {
      setCurrentTodosList(updatedTodos.filter(todo => !todo.completed));
    } else {
      setCurrentTodosList(updatedTodos);
    }
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
      if (response.ok) {
        const updatedTodos = todos.map(todo => {
          if (todo.id === todoId) {
            return { ...todo, completed: !completed };
          }
          return todo;
        });


        // setCompletedTodos(prevItems => prevItems.filter(todo => todo.id !== item.id));
        // setUncompletedTodos(prevItems => prevItems.filter(todo => todo.id !== item.id));
        // setCurrentTodosList(prevItems => prevItems.filter(todo => todo.id !== item.id));

        setTodos(updatedTodos);
        // let clist=updatedTodos.filter(todo => todo.completed);
        if(completed===true){
          setUncompletedTodos(uncompletedTodos.filter(todo=>todo.id!==todoId));
        }
        else if(completed===false){
          setCompletedTodos(completedTodos.filter(todo=>todo.id!==todoId));
        }
        // let unlist=updatedTodos.filter(todo => !todo.completed);
        // setUncompletedTodos(unlist);
        // setCurrentTodosList(updatedTodos);

        if (showCompletedTodos) {
          setCurrentTodosList(completedTodos.filter(todo=>todo.id!==todoId));
        } else if (showUncompletedTodos) {
          setCurrentTodosList(uncompletedTodos.filter(todo=>todo.id!==todoId));
        } else {
          setCurrentTodosList(updatedTodos);
        }
      }
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
        data.completed?setCompletedTodos(prevItems=>[...prevItems,data]):setUncompletedTodos(prevItems=>[...prevItems,data]);        
        if(showCompletedTodos && data.completed){
          setCurrentTodosList(prevItems=>[...prevItems,data]);
        }else if(showUncompletedTodos && !data.completed){
          setCurrentTodosList(prevItems=>[...prevItems,data]);
        }else{
          setCurrentTodosList(prevItems=>[...prevItems,data]);
        }
        // setCurrentTodosList(prevItems=>[...prevItems,data]);
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
  
    if (showCompletedTodos) {
      setCurrentTodosList(completedTodos);
    } else if (showUncompletedTodos) {
      setCurrentTodosList(uncompletedTodos);
    } else {
      setCurrentTodosList(todos);
    }
  }

  function handleDeleteClick(item) {
    const requestOptions = {
      method: 'DELETE',
    };

    fetch(`http://localhost:3001/todos/${item.id}`, requestOptions)
      .then(res => {
        if (res.ok || res.status == 204) {
          alert(`todo ${item.id} was deleted successfully`);
          setTodos(prevItems => prevItems.filter(todo => todo.id !== item.id));
          setCompletedTodos(prevItems => prevItems.filter(todo => todo.id !== item.id));
          setUncompletedTodos(prevItems => prevItems.filter(todo => todo.id !== item.id));
          setCurrentTodosList(prevItems => prevItems.filter(todo => todo.id !== item.id));
        } else {
          console.error(`Request failed with status code ${res.statusCode}`);
          throw new Error('Something went wrong');
        }
      })
      .catch(error => {
        console.error('An error occurred:', error);
      });
  }

  function handleUpdateClick(item) {
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
          // setCurrentTodosList(todos);
  
          // if (showCompletedTodos) {
          //   setCurrentTodosList(completedTodos);
          // } else if (showUncompletedTodos) {
          //   setCurrentTodosList(uncompletedTodos);
          // } else {
          //   setCurrentTodosList(todos);
          // }
        } else {
          throw new Error('Error updating todo on server');
        }
      })
      .catch(error => {
        console.error('Error updating todo:', error);
      });
  }
  
  useEffect(() => {
    showPartOfTodos();
  }, [showCompletedTodos, showUncompletedTodos]);

  function setButtonChoice(event) {
    let type = event.target.innerText;
    if (type === "SHOW UNCOMPLETED TODOS") {
      setShowUncompletedTodos(true);
      setShowCompletedTodos(false);
      setCurrentTodosList(uncompletedTodos);
    } else {
      setShowCompletedTodos(true);
      setShowUncompletedTodos(false);
      setCurrentTodosList(completedTodos);
    }
  }

  async function showPartOfTodos() {
    if((showCompletedTodos && completedTodos.length===0) || (showUncompletedTodos && uncompletedTodos.length===0)){
    const fetchUrl = showCompletedTodos
      ? `http://localhost:3001/${userId}/todos?&completed=true`
      : `http://localhost:3001/${userId}/todos?&completed=false`;

    try {
      const response = await fetch(fetchUrl, {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        if (showCompletedTodos) {
          setCompletedTodos(data);
          setShowCompletedTodos(true);
          setShowUncompletedTodos(false);
          setShowTodos(false);
          setCurrentTodosList(data);
        } else {
          setUncompletedTodos(data);
          setShowCompletedTodos(false);
          setShowUncompletedTodos(true);
          setShowTodos(false);
          setCurrentTodosList(data);
        }
        } else if(response.status!==404){
          throw new Error('Error retrieving todos from server');
        }      
      } catch (error) {
        console.error('Erreur lors de la récupération des todos:', error);
      }
   }
  }

  const handleInputChange = (event) => {
    const { value } = event.target;
    setUpdateTodoTitle(value);
  };

  const handleCancel = () => {
    setshowformTodos(false);
    setNewTodoTitle('');
  };

  const handleCancelUpdate = () => {
    setShowformUpdate(false);
    setUpdateTodoTitle('');
  };

  const showAllTodos = () => {
    setShowTodos(true);
    setShowCompletedTodos(false);
    setShowUncompletedTodos(false);
    setCurrentTodosList(todos);
  };

  return (
    <div>
      <h1>List todos</h1>
      <button id="addTodosButton" onClick={showFormTodosClick}>ADD NEW TODOS</button>
      <button onClick={setButtonChoice}>
        {(showCompletedTodos) ? "SHOW UNCOMPLETED TODOS" : "SHOW COMPLETED TODOS"}</button>
      <button onClick={showAllTodos}>SHOW ALL TODOS</button>

      {showformTodos && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newTodoTitle}
            onChange={event => setNewTodoTitle(event.target.value)}
            placeholder="New Todo"
            required
          />

          <input
            type="checkbox"
            checked={newTodoCompleted}
            onChange={event => setNewTodoCompleted(event.target.checked)}
          />
          <label>completed</label>
          <button type="submit">ADD</button>
          <button onClick={handleCancel}>CANCEL</button>

        </form>
      )}
      {todos.length === 0 ? (
        <p>no todo found</p>
      ) : (
        <ul>
          {currentTodosList===[]?'No todos found' :( currentTodosList.map(todo => (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => updateTodoOnServer(todo.id, todo.completed)}
              />
              <span>{todo.title}</span>
              <button onClick={() => handleDeleteClick(todo)}>DELETE</button>
              <button onClick={() => handleUpdateClick(todo)}>UPDATE</button>
              {showformUpdate && updateTodoId === todo.id && (
                <form onSubmit={event => handleSubmitUpdate(event, todo)}>

                  <input
                    type="text"
                    className="inputTypeIn"
                    value={updateTodoTitle === '' ? todo.title : updateTodoTitle}
                    onChange={handleInputChange}
                    required
                  />
                  <button type="submit">SAVE</button>
                  <button onClick={handleCancelUpdate}>CANCEL</button>

                </form>
              )}
            </li>
          )))
        }
        </ul>
      )}
    </div>
  );
}

export default Todos;
