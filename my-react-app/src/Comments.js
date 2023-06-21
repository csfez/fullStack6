import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NewComment from './NewComments';

const Comments = () => {
  const currentUser = JSON.parse(localStorage["currentUser"]);
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [showAddCommentForm, setShowAddCommentForm] = useState(false);
  const [commentInputs, setCommentInputs] = useState({
    name: '',
    email: currentUser.email,
    body: ''
  });
  const [commentsItems, setCommentsItems] = useState([]);
  const [selectedItemUpdate, setSelectedItemUpdate] = useState(null);

  const handleCommentChange = (event) => {
    const { name, value } = event.target;
    setCommentInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/comments`);
      console.log(`Status: ${response.status}`);
      console.log('Response headers:', response.headers);

      if (response.status === 200) {
        const data = await response.json();
        console.log('Comments:', data);
        setComments(data);
      } else {
        console.error(`Request failed with status code ${response.status}`);
        alert('Sorry, there was an error. Try again');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('Sorry, there was an error. Try again');
    }
  };

  const handleAddNewCommentClick = () => {
    setShowAddCommentForm(true);
  };

  const handleCancel = () => {
    setShowAddCommentForm(false);
  };

  const handleAddNewCommentSubmit = (event) => {
    event.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentInputs)
    };

    fetch(`http://localhost:3001/${postId}/${currentUser.email}/comments`, requestOptions)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          console.error(`Request failed with status code ${res.statusCode}`);
          throw new Error('Something went wrong');
        }
      })
      .then((data) => {
        setComments((prevItems) => [...prevItems, data]);
        alert(`The comment was created successfully`);
        console.log('The comment was created successfully:', data);
        setShowAddCommentForm(false);
        setCommentInputs({
          name: '',
          email: currentUser.email,
          body: ''
        });
      })
      .catch((error) => {
        alert('Sorry, there was an error. Try again');
        console.error('An error occurred:', error);
      });
  };

  const handleDeleteClick = (comment) => {
    const requestOptions = {
      method: 'DELETE'
    };

    fetch(`http://localhost:3001/comments/${comment.id}`, requestOptions)
      .then((res) => {
        if (res.ok || res.status === 204) {
          alert(`Comment #${comment.id} was deleted successfully`);
          setComments((prevItems) => prevItems.filter((item) => item.id !== comment.id));
        } else {
          console.error(`Request failed with status code ${res.statusCode}`);
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };

  const handleUpdateClick = (comment) => {
    setSelectedItemUpdate(comment);

  };

  useEffect(() => {
    fetchComments();
  }, []);

 
  const handleUpdateComments = (updatedComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === updatedComment.id) {
          return updatedComment; // Mettre à jour le commentaire correspondant
        }
        return comment; // Renvoyer les autres commentaires inchangés
      })
    );
    setShowAddCommentForm(false);
    setCommentInputs({
      name: '',
      email: '',
      body: ''
    });
  };

  return (
    <div className="comments">
      <button id="addCommentButton" onClick={handleAddNewCommentClick}>
        ADD NEW COMMENT
      </button>
      {showAddCommentForm && (
          <> 
          <NewComment
            onSave={(newCommentData) => {
              handleAddNewCommentSubmit(newCommentData);
              setShowAddCommentForm(false);
            }}
          />
          </>
      )}
      {comments.map((comment) => (
        <div key={comment.id}>
          <strong>
            {comment.email}: {comment.name}
          </strong>
          <pre>{comment.body}</pre>
          <button onClick={() => handleDeleteClick(comment)}>DELETE</button>
          <button onClick={() => handleUpdateClick(comment)}>UPDATE</button>
          {comment === selectedItemUpdate && (
            <>
              <NewComment
                comment={comment}
                onSave={handleUpdateComments}
                onCancel={handleCancel}
              />
              <button onClick={handleCancel}>CANCEL</button>
            </>
                )}
        </div>
      ))}
    </div>
  );
};

export default Comments;
