import axios from 'axios';

const apiUrl = 'http://localhost:5001/comments';

// Function to get all comments from the server
export const getComments = () => axios.get(`${apiUrl}/getAllComments`);

// Function to add a new comment. 
// The `comment` object is the data being posted and `token` is the JWT used for authorization.
export const addComment = (comment, token) =>
  axios.post(`${apiUrl}/userComment`, comment, {
    headers: {
      Authorization: `Bearer ${token}`, // Attaching the token to the request header for authorization
    },
  });

// Function to delete a comment by its ID
export const deleteComment = (id) => axios.delete(`${apiUrl}/${id}`);
