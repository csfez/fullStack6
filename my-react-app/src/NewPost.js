import React, { useState } from 'react';
export default function NewPost({ post, onSave, onCancel, isUpdate }) {
  const [formData, setFormData] = useState({
    title: post ? post.title : '',
    body: post ? post.body : '',
    id: post ? post.id : ''
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
          method: 'PUT' , // Utiliser PUT pour la mise à jour et POST pour la création
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        };

        const url = `http://localhost:3001/posts/${post.id}`;
        const response = await fetch(url, requestOptions);
        if (response.ok) {
          const updatedPost = formData;
          onSave(updatedPost);
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
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          className="inputTypeIn"
          id="titleInput"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <label>Body:</label>
        <input
          id="bodyInput"
          className="inputTypeIn"
          type="text"
          name="body"
          value={formData.body}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{isUpdate ? 'UPDATE' : 'SAVE'}</button>
        <button onClick={onCancel}>CANCEL</button>
      </form>
    </div>
  );
}
