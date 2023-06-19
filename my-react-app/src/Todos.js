// import React from "react"
// import { useState ,useEffect } from "react"

// const urlPrefix = 'https://jsonplaceholder.typicode.com/';
// const selectPresentTodos = ['Serial', 'Execution', 'Alphabetical', 'Random'];

// export default function Todos() {
    

//     const [listOfTodos, setListOfTodos] = useState([]);
//     const userID = JSON.parse(localStorage["currentUser"]).id;


//     useEffect(() => {
//         fetch(`${urlPrefix}users/${userID}/todos`)
//             .then(res => res.json())
//             .then(data => setListOfTodos(data))
//     }, [])

//     const handleChangeCheckbox = (event) => {
//         let todoId = event.target.id;
//         let currentTodo = listOfTodos.find(obj => obj.id == todoId);
//         console.log(currentTodo);
//         currentTodo = {...currentTodo, completed: !currentTodo.completed};
//         console.log(currentTodo);
//         fetch(`${urlPrefix}todos/${todoId}`, {
//           method: 'PUT',
//           body: JSON.stringify(currentTodo),
//           headers: {
//             'Content-type': 'application/json; charset=UTF-8',
//           },
//         }).then((response) => response.json())
//             .then((data) => {
//                 setListOfTodos(prevItems => prevItems.map(item => item.id == todoId ? data : item));
//             })
//             .catch((error) => {
//             console.error('Error:', error);
//             });
//     }

//     const handleSelect = (event) => {
//         let present = event.target.value;
//         if (present == 'Serial') {
//             //let elementsItems = itemsToElements(content);
//             let items = [...listOfTodos];
//             items.sort((a, b) => (a.id - b.id) );
//             setListOfTodos(items);
//         }else if (present == 'Execution') {
//             let completed = listOfTodos.filter(item => item.completed);
//             let unCompleted = listOfTodos.filter(item => !item.completed);
//             //let elementsItems = itemsToElements([...completed, ...unCompleted]);
//             setListOfTodos([...completed, ...unCompleted]);
//         } else if (present == 'Alphabetical') {
//             let items = [...listOfTodos];
//             items.sort((a, b) => (a.title > b.title) ? 1 : (a.title < b.title) ? -1 : 0);
//             //let elementsItems = itemsToElements(items);
//             setListOfTodos(items);
//         } else {
//             let items = [...listOfTodos];
//             items=shuffleArray(items);
//             //let elementsItems = itemsToElements(items);
//             setListOfTodos(items);
//         }
//     }


//     const itemsToElements =  
//         listOfTodos.map(item =>
//             (<div key={item.id} className="item-container">
//                 <input className="liItem" type="checkbox" id={item.id} checked={item.completed} onChange={handleChangeCheckbox}/>
//                 <label className="checkbox-label" htmlFor={`todo${item.id}`}>
//                     <span className="title">{item.title}</span>
//                 </label>
//             </div>));

//         let selectElement = (
//             <select className="select-option" onChange={handleSelect}>
//                 {selectPresentTodos.map(currentSelect =>
//                 <option key={currentSelect} value={currentSelect}>{currentSelect}</option>)}
//             </select>)
        
    
//     const shuffleArray=(array) => {
//         for (let i = array.length - 1; i > 0; i--) {
//           const j = Math.floor(Math.random() * (i + 1));
//           [array[i], array[j]] = [array[j], array[i]];
//         }
//         return array;
//       }

  
//   return (
//       <div className="content">
//           <h2 c >Your todos:</h2>
//         {selectElement}

//         {itemsToElements}
//     </div>
//   )
// }