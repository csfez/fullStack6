import React from "react"
import { Link, Outlet } from "react-router-dom"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
// import Comments from "./Comments";

// לשמור את מספר המשתמש
//const { currentVan } = useOutletContext()

const selectedPostStyle = { color: '#a85d5d', fontWeight: 'bold', fontSize: '1.2em' };

export default function Posts() {
    // const https = require('https');

  
    const userID = JSON.parse(localStorage["currentUser"]).id;
    const [postsItems, setPostsItems] = useState([]);
    const [currentPostID, setCurrentPostID] = useState('');
    const [currentPostComments, setCurrentPostComments] = useState('');
    //const [isDataFetched, setIsDataFetched] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Ajout d'une variable d'état pour le chargement
    
    const showCommentsLabel = "SHOW COMMENTS";
    const hideCommentsLabel = "HIDE COMMENTS";

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`http://localhost:3001/${userID}/posts`);
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
        if (currentPostID === '' || currentPostID !== id) {
            setCurrentPostID(id);
            setCurrentPostComments('');
        } else {
            setCurrentPostID('');
        }
    }

    const handleCommentsClick = async (event) => {
        const postId = event.target.id.split("_")[1];
        
        if (currentPostID !== postId) {
          try {
            const response = await fetch(`http://localhost:3001/posts/${postId}/comments`);
            console.log(`Status: ${response.status}`);
            console.log("Response headers:", response.headers);
            
            if (response.status === 200) {
              const data = await response.json();
              console.log('Comments:', data);
              setCurrentPostID(postId);
              setCurrentPostComments([...data]);
            } else {
              console.error(`Request failed with status code ${response.status}`);
              alert("Sorry, there was an error. Try again");
            }
          } catch (error) {
            console.error("An error occurred:", error);
            alert("Sorry, there was an error. Try again");
          }
        } else {
          setCurrentPostID('');
        }
      };
      
    const handleAddClick = (event) => {

    }

    const handleDeleteClick = (event) => {
        // let deleteType = event.target.id.split("_")[0];
        // let id = event.target.id.split("_")[1];
        
        // if (deleteType == "deletePostButton") {
        //     const options = {
        //         hostname: 'localhost',
        //         port: 3000,
        //         path: `posts/${id}`,
        //         method: 'DELETE',
        //         headers: {
        //         'Content-Type': 'application/json'
        //         }
        //     };
            
        //     const req = https.request(options, (res) => {
        //         console.log(`Status: ${res.statusCode}`);
        //         console.log('Response headers:', res.headers);
            
        //         let data = '';
            
        //         res.on('data', (chunk) => {
        //         data += chunk;
        //         });
            
        //         res.on('end', () => {
        //             if (res.statusCode === 204) {
        //                 alert(`Post #${id} was deleted successfully`)
        //             } else {
        //               console.error(`Request failed with status code ${res.statusCode}`);
        //               alert("Sorry, there was an error. Try again")
        //             }
        //             console.log('Response data:', data);
        //         });
        //     });
            
        //     req.on('error', (error) => {
        //         console.error('An error occurred:', error);
        //     });
            
        //     req.end();
        // } else {
        //     const options = {
        //         hostname: 'localhost',
        //         port: 3000,
        //         path: `comments/${id}`,
        //         method: 'DELETE',
        //         headers: {
        //         'Content-Type': 'application/json'
        //         }
        //     };
            
        //     const req = https.request(options, (res) => {
        //         console.log(`Status: ${res.statusCode}`);
        //         console.log('Response headers:', res.headers);
            
        //         let data = '';
            
        //         res.on('data', (chunk) => {
        //         data += chunk;
        //         });
            
        //         res.on('end', () => {
        //             if (res.statusCode === 204) {
        //                 alert(`Comment #${id} was deleted successfully`)
        //             } else {
        //               console.error(`Request failed with status code ${res.statusCode}`);
        //               alert("Sorry, there was an error. Try again")
        //             }
        //             console.log('Response data:', data);
        //         });
        //     });
            
        //     req.on('error', (error) => {
        //         console.error('An error occurred:', error);
        //     });
            
        //     req.end();
        // }   
    }

    const handleUpdateClick = (event) => {
        // let updateType = event.target.id.split("_")[0];
        // let id = event.target.id.split("_")[1];
        
        // if (updateType == "updatePostButton") {
        //     const options = {
        //         hostname: 'localhost',
        //         port: 3000,
        //         path: `posts/${id}`,
        //         method: 'PUT',
        //         headers: {
        //         'Content-Type': 'application/json'
        //         },
        //         data: {}
        //     };
            
        //     const req = https.request(options, (res) => {
        //         console.log(`Status: ${res.statusCode}`);
        //         console.log('Response headers:', res.headers);
            
        //         let data = '';
            
        //         res.on('data', (chunk) => {
        //         data += chunk;
        //         });
            
        //         res.on('end', () => {
        //             if (res.statusCode === 204) {
        //                 alert(`Post #${id} was deleted successfully`)
        //             } else {
        //               console.error(`Request failed with status code ${res.statusCode}`);
        //               alert("Sorry, there was an error. Try again")
        //             }
        //             console.log('Response data:', data);
        //         });
        //     });
            
        //     req.on('error', (error) => {
        //         console.error('An error occurred:', error);
        //     });
        //     req.write(options.data);
        //     req.end();
        // } else {
        //     const options = {
        //         hostname: 'localhost',
        //         port: 3000,
        //         path: `comments/${id}`,
        //         method: 'DELETE',
        //         headers: {
        //         'Content-Type': 'application/json'
        //         }
        //     };
            
        //     const req = https.request(options, (res) => {
        //         console.log(`Status: ${res.statusCode}`);
        //         console.log('Response headers:', res.headers);
            
        //         let data = '';
            
        //         res.on('data', (chunk) => {
        //         data += chunk;
        //         });
            
        //         res.on('end', () => {
        //             if (res.statusCode === 204) {
        //                 alert(`Comment #${id} was deleted successfully`)
        //             } else {
        //               console.error(`Request failed with status code ${res.statusCode}`);
        //               alert("Sorry, there was an error. Try again")
        //             }
        //             console.log('Response data:', data);
        //         });
        //     });
            
        //     req.on('error', (error) => {
        //         console.error('An error occurred:', error);
        //     });
            
        //     req.end();
        // }   
    }

    //<Link to={`${item.id}/comments`}>Comments</Link>
    const showPosts =
        
        postsItems.map(item =><div>
            <li key={item.id} style={currentPostID === item.id ? selectedPostStyle : {}}>
                           
                <h3 className="postTitle" id={`title${item.id}`}
                    onClick={(e) => handleClick(e, item.id)}>
                    {item.title} </h3>
                <p className="postBody" id={`body${item.id}`}> {item.body} </p>
                <button id={`commentsButton_${item.id}`} onClick={handleCommentsClick}>
                    {currentPostID === item.id ? hideCommentsLabel : showCommentsLabel}</button>
                <button id={`deletePostButton_${item.id}`} onClick={handleDeleteClick}>DELETE</button>
                <button id={`updatePostButton_${item.id}`} onClick={handleUpdateClick}>UPDATE</button>              
            </li>
            {currentPostID === item.id && <button id="addCommentButton" onClick={handleAddClick}>ADD NEW COMMENT</button>
                &&
                <ul>
                    {currentPostComments.map(item =>
                        <li key={item.id}>{item.name}
                            <button id={`deleteCommentButton_${item.id}`} onClick={handleDeleteClick}>DELETE</button>
                            <button id={`updateCommentButton_${item.id}`} onClick={handleUpdateClick}>UPDATE</button>
                        </li>)}   
                </ul>}
            {/* {currentPostID == item.id && <Link className="link-comment" to={`${item.id}/comments`}>Comments</Link>} */}
        </div>);


    return (
        <section className="content">
            <h2 className="second-title">Your posts</h2>
            <button id="addPostButton" onClick={handleAddClick}>ADD NEW POST</button>
            <div>
                {
                    postsItems.length > 0 ? (
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
            <Outlet />
        </section>
    )
}

