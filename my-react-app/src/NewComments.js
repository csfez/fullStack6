import React, { useState } from 'react';

export default function NewComment({ comment, onSave, onCancel ,isUpdate,postId}) {
    const [formData, setFormData] = useState({
        name: comment? comment.name:'',
        body: comment? comment.name:'',
        id: comment? comment.id:'',
        email: comment? comment.email:''
        });
    const currentUser = JSON.parse(localStorage["currentUser"]);

        
        const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        };
   
      const handleSubmit = async (event) => {
       event.preventDefault();
        if(isUpdate){
          try {
            const requestOptions = {
                method:'PUT' , // Utiliser PUT pour la mise à jour et POST pour la création
                headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
            };
        

            const url = `http://localhost:3001/comments/${comment.id}`;
            const response = await fetch(url, requestOptions);

            if (response.ok) {
              const updatedComment = formData;
              onSave(updatedComment);
            } else 
            {
              if(!isUpdate){
              }
              console.error(`Request failed with status code ${response.status}`);
              throw new Error('Something went wrong');
            }
          } catch (error) {
            console.error('An error occurred:', error);
            // Handle error scenario appropriately
          }
        }
        else{
          onSave(formData);
          
        }
      };


    
    return (
        <div className="addOrUpdateDiv">
        <form onSubmit={handleSubmit} className="post-form">
          <label>Name:</label>
          <input
            className="inputTypeIn"
            id="commentNameInput"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter comment name"
            required
          />
          <label>Body:</label>
          <input
            id="commentBodyInput"
            className="inputTypeIn"
            type="text"
            name="body"
            value={formData.body}
            onChange={handleInputChange}
            placeholder="Enter comment body"
            required
          />
          <button type="submit">{isUpdate ? 'UPDATE' : 'SAVE'}</button>
          <button onClick={onCancel}>CANCEL</button>
        </form>
      </div>
    );
  }
  