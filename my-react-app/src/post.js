
import React from "react"
import { Link, Outlet } from "react-router-dom"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
// // import Comments from "./Comments";

// // לשמור את מספר המשתמש
// //const { currentVan } = useOutletContext()

const selectedPostStyle = { color: '#a85d5d', fontWeight: 'bold', fontSize: '1.2em' };

export default function Posts() {
  
  const userID = JSON.parse(localStorage["currentUser"]).id;
  const [postsItems, setPostsItems] = useState([]);
  const [currentPostID, setCurrentPostID] = useState('');
  const [currentPostComments, setCurrentPostComments] = useState('');
  //const [isDataFetched, setIsDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Ajout d'une variable d'état pour le chargement
  const [onePost, setOnePost] = useState(false);
  const [oneComment, setOneComment] = useState(false);
  const [onePostInputs, setOnePostInputs] = useState({});
  const [oneCommentInputs, setOneCommentInputs] = useState({});
  const [onePostForm, setOnePostForm] = useState('');
  const [oneCommentForm, setOneCommentForm] = useState('');

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
    

    //   if (postsItems.length === 0) {
    //     return <div>Loading...</div>;
    //   }
    
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
    let addType = event.target.id;
    let requestOptions;
    // if it is adding of a post
    if (addType == "addPostButton" || addType == "submitAddPostButton") {
      // if the user pressed to send the post details
      if (onePost) {
        requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(onePostInputs)
        };

        fetch(`http://localhost:3001/posts`, requestOptions)
          .then(res => {
            if (res.ok) {
              return res.json();
            } else {
              console.error(`Request failed with status code ${res.statusCode}`);
              throw new Error('Something went wrong');
            }
          })
          .then(data => {
            // to check what to do with the updated post
            alert(`The post was created successfully`);
            console.log('The post was created successfully:', data);
            setOnePost(false);
            setOnePostInputs({});
          })
          .catch(error => {
            alert("Sorry, there was an error. Try again");
            console.error('An error occurred:', error);
          });  

      }// if the user pressed to add a post
      else {
        createPostForm(-1, handleAddClick, "submitAddPostButton");
        setOnePost(true);
      }
    }
    // if it is adding of a comment
    else {
      //if the user pressed to send the comment details 
      if (oneComment) {
        requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(oneCommentInputs)
        };

      fetch(`http://localhost:3001/comments`, requestOptions)
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            console.error(`Request failed with status code ${res.statusCode}`);
            throw new Error('Something went wrong');
          }
        })
        .then(data => {
          // to check what to do with the updated post
          alert(`Comment was created successfully`);
          console.log('The comment was created successfully:', data);
          setOneComment(false);
          setOneCommentInputs({});
        })
        .catch(error => {
          alert("Sorry, there was an error. Try again");
          console.error('An error occurred:', error);
        });  
      
      // if the user pressed to add a comment
      } else {
        createCommentForm(-1, handleAddClick, "submitAddCommentButton");
        setOneComment(true);
      }
    }   
    }

    const handleDeleteClick = (event) => {
        let deleteType = event.target.id.split("_")[0];
        let id = event.target.id.split("_")[1];
        
      if (deleteType == "deletePostButton") {
        const requestOptions = {
          method: 'DELETE',
        };
        
        fetch(`http://localhost:3001/posts/${id}`, requestOptions)
          .then(res => {
            if (res.ok || res.status == 204) {
              alert(`Post #${id} was deleted successfully`);
            } else {
              console.error(`Request failed with status code ${res.statusCode}`);
              throw new Error('Something went wrong');
            }
          })
          .catch(error => {
            console.error('An error occurred:', error);
          });  

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
      } else {
        const requestOptions = {
          method: 'DELETE',
        };
        
        fetch(`http://localhost:3001/comments/${id}`, requestOptions)
          .then(res => {
            if (res.ok || res.status == 204) {
              alert(`Comment #${id} was deleted successfully`);
            } else {
              console.error(`Request failed with status code ${res.statusCode}`);
              throw new Error('Something went wrong');
            }
          })
          .catch(error => {
            console.error('An error occurred:', error);
          }); 

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
        //                 alert(`Comment #${id} was deleted successfully`);
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
        }   
    }

    const handleUpdateClick = (event) => {
        let updateType = event.target.id.split("_")[0];
        let id = event.target.id.split("_")[1];
      let requestOptions;
      if (updateType == "updatePostButton" || updateType == "submitUpdatePostButton") {
        // if the user pressed to send the post details
        if (onePost) {
          requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(onePostInputs)
          };

          fetch(`http://localhost:3001/posts/${id}`, requestOptions)
            .then(res => {
              if (res.ok) {
                return res.json();
              } else {
                console.error(`Request failed with status code ${res.statusCode}`);
                throw new Error('Something went wrong');
              }
            })
            .then(data => {
              // to check what to do with the updated post
              alert(`Post #${id} was updated successfully`);
              console.log('The post was updated successfully:', data);
              setOnePost(false);
              setOnePostInputs({});
            })
            .catch(error => {
              alert("Sorry, there was an error. Try again");
              console.error('An error occurred:', error);
            });  

        }// if the user pressed to update a post
        else {
          createPostForm(id, handleUpdateClick, "submitUpdatePostButton");
          setOnePost(true);
        }
          
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
      } else {
          //if the user pressed to send the comment details 
        if (oneComment) {
          requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(oneCommentInputs)
          };

          fetch(`http://localhost:3001/comments/${id}`, requestOptions)
            .then(res => {
              if (res.ok) {
                return res.json();
              } else {
                console.error(`Request failed with status code ${res.statusCode}`);
                throw new Error('Something went wrong');
              }
            })
            .then(data => {
              // to check what to do with the updated post
              alert(`Comment #${id} was updated successfully`);
              console.log('The comment was updated successfully:', data);
              setOneComment(false);
              setOneCommentInputs({});
            })
            .catch(error => {
              alert("Sorry, there was an error. Try again");
              console.error('An error occurred:', error);
            });  
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
          // if the user pressed to update a comment
          } else {
            createCommentForm(id, handleUpdateClick, "submitUpdateCommentButton");
            setOneComment(true);
          }
        }   
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
  
  const handlePostChange = ({target}) => {
    const {name, value} = target;
      setOnePostInputs(values => ({...values, [name]: value}))
  }

  const handleCommentChange = ({target}) => {
    const {name, value} = target;
      setOneCommentInputs(values => ({...values, [name]: value}))
  }

  const createPostForm = (postID, submitFunc, buttonType) => {
    let title='', body='';
    if (postID != -1) {
      const post = postsItems.find(item => item.id === postID);
      if (post) {
        title = post.title;
        body = post.body;
      } 
    }
    
    const postForm = (<div className="addOrUpdateDiv">
      <form onSubmit={submitFunc} className="post-form">
                        <label>Title:</label>
                        <input 
                          className="inputTypeIn"
                          id="titleInput"
                          type="text" 
                          name="title" 
                          value={onePostInputs.title || title} 
                          onChange={handlePostChange}
                          required
                        />
                        <label>Body:</label>
                        <input
                          id="bodyInput"
                          className="inputTypeIn"
                          type="text" 
                          name="body" 
                          value={onePostInputs.body || body} 
                          onChange={handlePostChange}
                        required
                      />
                      <input id={`${buttonType}_${postID}`} type="submit" name="submit" value="SUBMIT" />
                      <button onClick={handleCancel}>CANCEL</button>
    </form>
    </div>
      );
    setOnePostForm(postForm);
  }

  const createCommentForm = (commentID, submitFunc, buttonType) => {
    let name='', email='', body='';
    if (commentID != -1) {
      const comment = currentPostComments.find(item => item.id === commentID);
      if (comment) {
        name = comment.name;
        email = comment.email;
        body = comment.body;
      } 
    }
    
    const commentForm = (<div className="addOrUpdateDiv">
      <form onSubmit={submitFunc} className="post-form">
                        <label>Name:</label>
                        <input 
                          className="inputTypeIn"
                          id="commentNameInput"
                          type="text" 
                          name="name" 
                          value={onePostInputs.name || name} 
                          onChange={handleCommentChange}
                          placeholder="Enter comment name"
                          required
                        />
                        <label>Email:</label>
                        <input 
                          className="inputTypeIn"
                          id="commentEmailInput"
                          type="email" 
                          name="email" 
                          value={onePostInputs.email || email} 
                          onChange={handleCommentChange}
                          placeholder="Enter comment email"
                          required
                        />
                        <label>Body:</label>
                        <input
                          id="commentBodyInput"
                          className="inputTypeIn"
                          type="text" 
                          name="body" 
                          value={onePostInputs.body || body} 
                          onChange={handleCommentChange}
                          placeholder="Enter comment body"
                          required
                      />
                      <input id={`${buttonType}_${commentID}`} type="submit" name="submit" value="SUBMIT" />
                      <button onClick={handleCancel}>CANCEL</button>
    </form>
    </div>
      );
    setOneCommentForm(commentForm);
  }

  const handleCancel = () => {
    setOnePost(false);
    setOneComment(false);
    setOnePostInputs({});
    setOneCommentInputs({});
  }
  

    return (
      <section className="content">
        {onePost ?
          <div>
            <h2>Enter post details:</h2>
            {onePostForm}
          </div>
          : (oneComment?
            <div>
            <h2>Enter comment details:</h2>
            {oneCommentForm}
            </div>
            : <div>
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
            </div>
          )}
            
        </section>
    )

 }