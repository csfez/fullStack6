import React, { useState, useEffect } from 'react';
import { Link,useParams } from 'react-router-dom';

function Photos() {
    const [photos, setPhotos] = useState([]);
    const [newPhotoTitle, setNewPhotoTitle] = useState('');
    const [updatePhotoTitle, setUpdatePhotoTitle] = useState('');

    const [newPhotoCompleted, setNewPhotoCompleted] = useState(false);
    const [showformPhotos, setshowformPhotos] = useState(false);
    
    const userId = JSON.parse(localStorage["currentUser"]).id;
  const [showformUpdate,setShowformUpdate]=useState(false);
  const [updatePhotoId, setUpdatePhotoId] = useState(null);
  const { albumId } = useParams();
    
    async function fetchPhotos(userId) {
        try {
          const response = await fetch(`http://localhost:3001/albums/${albumId}/photos`);
          const data = await response.json();
          setPhotos(data);
        } catch (error) {
          console.error('Erreur lors de la récupération des photos:', error);
        }
      }

      useEffect(() => {
        fetchPhotos(userId);
      }, []);

      // function handleCheckboxChange(photoId, completed) {
      //   const updatedPhotos = photos.map(photo => {
      //     if (photo.id === photoId) {
      //       return { ...photo, completed: !completed };
      //     }
      //     return photo;
      //   });
      //   setPhotos(updatedPhotos);
      //   updatePhotoOnServer(photoId, !completed);
      // }

      function handleTitleChange(photoId, newTitle) {
        const updatedPhotos = photos.map(photo => {
          if (photo.id === photoId) {
            return { ...photo, title: newTitle };
          }
          return photo;
        });
        setPhotos(updatedPhotos);
      }
      

      // async function updatePhotoOnServer(photoId, completed) {
      //   try {
      //     const response = await fetch(`http://localhost:3001/photos/${photoId}`, {
      //       method: 'PUT',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify({ completed }),
      //     });
      
      //     if (!response.ok) {
      //       console.error('Erreur lors de la mise à jour du photo sur le serveur');
      //     }
      //   } catch (error) {
      //     console.error('Erreur lors de la mise à jour du photo:', error);
      //   }
      // }

      function handleAddClick() {
        // const newPhoto = {
        //   title: newPhotoTitle,
        //   completed: newPhotoCompleted
        // };
      
        // fetch(`http://localhost:3001/albums/:albumId/photos`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(newPhoto)
        // })
        // .then(response => {
        //   if (response.ok) {
        //     return response.json();
        //   } else {
        //     throw new Error('Erreur lors de l\'ajout du photo sur le serveur');
        //   }
        // })
        // .then(data => {
        //   setPhotos([...photos, data]);
        //   setNewPhotoTitle('');
        //   setNewPhotoCompleted(false);
        // })
        // .catch(error => {
        //   console.error('Erreur lors de l\'ajout du photo:', error);
        // });
      }

      function showFormPhotosClick() {
        setshowformPhotos(true);
      }

      function handleSubmit(event) {
        event.preventDefault();
        handleAddClick();
      }

      function handleDeleteClick(item){
        // const requestOptions = {
        //     method: 'DELETE',
        //   };
          
        //   fetch(`http://localhost:3001/photos/${item.id}`, requestOptions)
        //     .then(res => {
        //       if (res.ok || res.status == 204) {
        //         alert(`photo ${item.id} was deleted successfully`);
        //         setPhotos(prevItems => prevItems.filter(photo => photo.id !== item.id));
    
        //       } else {
        //         console.error(`Request failed with status code ${res.statusCode}`);
        //         throw new Error('Something went wrong');
        //       }
        //     })
        //     .catch(error => {
        //       console.error('An error occurred:', error);
        //     });  
      }
      
      // function handleUpdateClick(item){
      //   setShowformUpdate(true);
      //   setUpdatePhotoId(item.id);
      // }

      // function handleSubmitUpdate(event, item) {
      //   event.preventDefault(); // Prevent page reload
      
      //   const newTitle = updatePhotoTitle;
      //   item.title = newTitle;
      //   fetch(`http://localhost:3001/photosTitle/${item.id}`, {
      //     method: 'PUT',
      //     headers: {
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({ newTitle })
      //   })
      //     .then(response => {
      //       if (response.ok) {
      //         handleTitleChange(item.id, newTitle);
      //         setUpdatePhotoTitle('');
      //         setShowformUpdate(false); // Hide the update form
      //       } else {
      //         throw new Error('Error updating photo on server');
      //       }
      //     })
      //     .catch(error => {
      //       console.error('Error updating photo:', error);
      //     });
      // }
      
      const handleInputChange = (event) => {
        const { value } = event.target;
        setUpdatePhotoTitle(value);
      };
    
      const handleCancel = () => {
        setShowformUpdate(false);
        setUpdatePhotoTitle('');
      };

      return (
        <div>
          <h1>Liste des photos</h1>
          {/* <button id="addPhotosButton" onClick={showFormPhotosClick}>ADD NEW PHOTOS</button>
          {showformPhotos && (
             <form onSubmit={handleSubmit}>
                <input
                type="text"
                value={newPhotoTitle}
                onChange={event => setNewPhotoTitle(event.target.value)}
                placeholder="Nouveau Photo"
                required
                />

                {/* <input
                type="checkbox"
                checked={newPhotoCompleted}
                onChange={event => setNewPhotoCompleted(event.target.checked)}
                /> 
                <button type="submit">Add</button>
            </form>
            )} */}
          {photos.length === 0 ? (
            <p>no photo found</p>
          ) : (
            <div>
            {photos.map((photo) => (
                <img key={photo.id} src={photo.thumbnailUrl} alt={photo.title} />
            ))}
            </div>
          )}
        </div>
      );
                  
  }
export default Photos;
  


