import React from "react"
import { Link, Outlet,useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import NewPost from './NewPost';

// import Comments from "./Comments";

// לשמור את מספר המשתמש
//const { currentVan } = useOutletContext()

const selectedPostStyle = { color: '#a85d5d', fontWeight: 'bold', fontSize: '1.2em' };

export default function Posts() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage["currentUser"]);
  const [postsItems, setPostsItems] = useState([]);
  const [currentPostID, setCurrentPostID] = useState('');
  // const [currentPostComments, setCurrentPostComments] = useState('');
  const [selectedItemComments, setSelectedItemComments] = useState(null);
  const [showAddPostForm, setShowAddPostForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Ajout d'une variable d'état pour le chargement
  // const [onePostInputs, setOnePostInputs] = useState({});
  const [selectedItemUpdate, setSelectedItemUpdate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const showCommentsLabel = "SHOW COMMENTS";
  const hideCommentsLabel = "HIDE COMMENTS";

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`http://localhost:3001/${currentUser.id}/posts`);
            console.log(`Status: ${response.status}`);
            console.log("Response headers:", response.headers);
    
            if (response.status === 200) {
              const data = await response.json();
              console.log("Posts:", data);
              setPostsItems([...data]);
            } else {
              console.error(`Request failed with status code ${response.status}`);
              alert("Sorry, there was an error. Try again");
            }
          } catch (error) {
            console.error("An error occurred:", error);
          } finally {
            setIsLoading(false); // Met à jour isLoading à false une fois que les données sont récupérées
          }
        };
    
        fetchData();
      }, []);
    

      if (postsItems.length === 0) {
        return <div>Loading...</div>;
      }
    
    const handleClick = (event, id) => {

    }

    const handleCommentsClick  = (item) => {
      if (selectedItemComments === item) {
        setSelectedItemComments(null);
        navigate(`/users/${currentUser.username}/posts`);
      } else {
        setSelectedItemComments(item);
        navigate(`/users/${currentUser.username}/posts/${item.id}/comments`);
      }
    };

     
    const handleAddClick = (event) => {
      setShowAddPostForm(true);
    };

    const handleAddNewPostClick = (item) => {
      
        console.log("New post data:", item);

          let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          };
    
          fetch(`http://localhost:3001/${currentUser.id}/posts`, requestOptions)
            .then(res => {
              if (res.ok) {
                return res.json();
              } else {
                console.error(`Request failed with status code ${res.statusCode}`);
                throw new Error('Something went wrong');
              }
            })
            .then(data => {
              // Traitement des données du post créé
              setPostsItems(prevItems => [...prevItems, data]);
              alert(`The post was created successfully`);
              console.log('The post was created successfully:', data);
              // setOnePost(false);
              // setOnePostInputs({});
            })
            .catch(error => {
              alert("Sorry, there was an error. Try again");
              console.error('An error occurred:', error);
            });
        }
  
  
  
    const handleDeleteClick = (item) => {
      
      const requestOptions = {
        method: 'DELETE',
      };
      
      fetch(`http://localhost:3001/posts/${item.id}`, requestOptions)
        .then(res => {
          if (res.ok || res.status == 204) {
            alert(`Post #${item.id} was deleted successfully`);
            setPostsItems(prevItems => prevItems.filter(post => post.id !== item.id));

          } else {
            console.error(`Request failed with status code ${res.statusCode}`);
            throw new Error('Something went wrong');
          }
        })
        .catch(error => {
          console.error('An error occurred:', error);
        });  
    }
  
    const handleUpdateClick = (item) => {
      setSelectedItemUpdate(item);
    }

   const handleUpdatePost = (updatedPost) => {
    setPostsItems((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === updatedPost.id) {
          return updatedPost; // Mettre à jour le post correspondant
        }
        return post; // Renvoyer les autres posts inchangés
      })
    );
  };

    const handleCancel = () => {
      setShowAddPostForm(false);
    };

    const showPosts =
        
        postsItems.map(item =>(
        <div>
            <li key={item.id} style={currentPostID === item.id ? selectedPostStyle : {}}>
                           
                <h3 className="postTitle" id={`title${item.id}`}
                    onClick={(e) => handleClick(e, item.id)}>
                    {item.title} </h3>
                <p className="postBody" id={`body${item.id}`}> {item.body} </p>
                <button className='post-buttons' onClick={() => handleCommentsClick(item)}>
                {currentPostID === item.id ? hideCommentsLabel : showCommentsLabel} </button>
                <button id={`deletePostButton_${item.id}`} onClick={() =>handleDeleteClick(item)}>DELETE</button>
                <button id={`updatePostButton_${item.id}`} onClick={() =>handleUpdateClick(item)}>UPDATE</button>              
                {item === selectedItemUpdate && (
                  <>
                    <NewPost
                      post={item}
                      onSave={handleUpdatePost}
                      onCancel={handleCancel}
                    />
                    <button onClick={handleCancel}>CANCEL</button>
                  </>
                )}
                {item === selectedItemComments ? <Outlet  /> : null}

                </li>
               </div>));



    return (
        <section className="content">
            <h2 className="second-title">Your posts</h2>
            <button id="addPostButton" onClick={handleAddClick}>ADD NEW POST</button>
            <div>
            {showAddPostForm && (
             <>
             <NewPost
               onSave={(newPostData) => {
                //  if (isEditing) {
                //    handleUpdatePostClick(newPostData);
                //  } else {
                   handleAddNewPostClick(newPostData);
                //  }
                 setShowAddPostForm(false);
               }}
               onCancel={handleCancel}
               isUpdate={isEditing} // isEditing est un booléen indiquant si vous êtes en mode édition
              //  post={selectedPost} // selectedPost est le post que vous éditez, peut être null si vous êtes en mode création
             />
           </>
            )}
                { postsItems.length > 0 ? (
                        <section>
                            <ul>
                               {showPosts}
                            </ul>
                        </section>

                    ) : (
                            <h2>Loading...</h2>
                        )
                }
            </div>
            {/* <Outlet /> */}
        </section>
    )
}
