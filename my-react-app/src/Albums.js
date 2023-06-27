import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom';


function Albums() {
    const [albums, setAlbums] = useState([]);
    const [newAlbumTitle, setNewAlbumTitle] = useState('');
    const [updateAlbumTitle, setUpdateAlbumTitle] = useState('');

    const [newAlbumCompleted, setNewAlbumCompleted] = useState(false);
    const [showformAlbums, setshowformAlbums] = useState(false);
    
    const userId = JSON.parse(localStorage["currentUser"]).id;
  const [showformUpdate,setShowformUpdate]=useState(false);
  const [updateAlbumId, setUpdateAlbumId] = useState(null);
    
    async function fetchAlbums(userId) {
        try {
          const response = await fetch(`http://localhost:3001/${userId}/albums`);
          const data = await response.json();
          setAlbums(data);
        } catch (error) {
          console.error('Erreur lors de la récupération des albums:', error);
        }
      }

      useEffect(() => {
        fetchAlbums(userId);
      }, []);

      // function handleCheckboxChange(albumId, completed) {
      //   const updatedAlbums = albums.map(album => {
      //     if (album.id === albumId) {
      //       return { ...album, completed: !completed };
      //     }
      //     return album;
      //   });
      //   setAlbums(updatedAlbums);
      //   updateAlbumOnServer(albumId, !completed);
      // }

      function handleTitleChange(albumId, newTitle) {
        const updatedAlbums = albums.map(album => {
          if (album.id === albumId) {
            return { ...album, title: newTitle };
          }
          return album;
        });
        setAlbums(updatedAlbums);
      }
      

      // async function updateAlbumOnServer(albumId, completed) {
      //   try {
      //     const response = await fetch(`http://localhost:3001/albums/${albumId}`, {
      //       method: 'PUT',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify({ completed }),
      //     });
      
      //     if (!response.ok) {
      //       console.error('Erreur lors de la mise à jour du album sur le serveur');
      //     }
      //   } catch (error) {
      //     console.error('Erreur lors de la mise à jour du album:', error);
      //   }
      // }

      function handleAddClick() {
        const newAlbum = {
          title: newAlbumTitle,
          completed: newAlbumCompleted
        };
      
        fetch(`http://localhost:3001/${userId}/album`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newAlbum)
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Erreur lors de l\'ajout du album sur le serveur');
          }
        })
        .then(data => {
          setAlbums([...albums, data]);
          setNewAlbumTitle('');
          setNewAlbumCompleted(false);
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout du album:', error);
        });
      }

      function showFormAlbumsClick() {
        setshowformAlbums(true);
      }

      function handleSubmit(event) {
        event.preventDefault();
        handleAddClick();
      }

      function handleDeleteClick(item){
        const requestOptions = {
            method: 'DELETE',
          };
          
          fetch(`http://localhost:3001/albumsAndPhotos/${item.id}`, requestOptions)
            .then(res => {
              if (res.ok || res.status == 204) {
                alert(`album ${item.id} was deleted successfully`);
                setAlbums(prevItems => prevItems.filter(album => album.id !== item.id));
    
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
        setUpdateAlbumId(item.id);
      }

      function handleSubmitUpdate(event, item) {
        event.preventDefault(); // Prevent page reload
      
        const newTitle = updateAlbumTitle;
        item.title = newTitle;
        fetch(`http://localhost:3001/albumsTitle/${item.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ newTitle })
        })
          .then(response => {
            if (response.ok) {
              handleTitleChange(item.id, newTitle);
              setUpdateAlbumTitle('');
              setShowformUpdate(false); // Hide the update form
            } else {
              throw new Error('Error updating album on server');
            }
          })
          .catch(error => {
            console.error('Error updating album:', error);
          });
      }
      
      const handleInputChange = (event) => {
        const { value } = event.target;
        setUpdateAlbumTitle(value);
      };
    
      const handleCancel = () => {
        setshowformAlbums(false);
        setUpdateAlbumTitle('');
      };

      return (
        <div>
          <h1>Liste des albums</h1>
          <button id="addAlbumsButton" onClick={showFormAlbumsClick}>ADD NEW ALBUMS</button>
          {showformAlbums && (
             <form onSubmit={handleSubmit}>
                <input
                type="text"
                value={newAlbumTitle}
                onChange={event => setNewAlbumTitle(event.target.value)}
                placeholder="Nouveau Album"
                required
                />

                {/* <input
                type="checkbox"
                checked={newAlbumCompleted}
                onChange={event => setNewAlbumCompleted(event.target.checked)}
                /> */}
                <button type="submit">ADD</button>
                <button onClick={handleCancel}>CANCEL</button>
            </form>
            )}
          {albums.length === 0 ? (
            <p>no album found</p>
          ) : (
            <ul>
              {albums.map(album => (
                <li key={album.id}>
                  {/* <input
                    type="text"
                    // checked={album.completed}
                    // onChange={() => handleCheckboxChange(album.id, album.completed)}
                    /> */}
                  <span>
                    <Link to={`${album.id}/photos`}>{album.title}</Link>
                  </span>
                  <button onClick={() =>handleDeleteClick(album)}>DELETE</button>
                  <button onClick={() =>handleUpdateClick(album)}>UPDATE</button>
                  {showformUpdate && updateAlbumId === album.id &&(
                    <form onSubmit={event => handleSubmitUpdate(event, album)}>

                    <input
                    type="text"
                    className="inputTypeIn"
                    value={updateAlbumTitle===''?album.title:updateAlbumTitle}
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
export default Albums;
  

