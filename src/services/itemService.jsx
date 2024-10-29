import axios from 'axios';

const apiUrl = 'http://localhost:5001/items';
// const apiUrl = process.env.REACT_APP_API_URL + '/items'; // Use this for production with environment variables

// Function to get all items from the server
export const getItems = () => axios.get(apiUrl);

// Function to get a specific item by its ID
export const getItem = (id) => axios.get(`${apiUrl}/${id}`);

// Function to get items created by the logged-in user
// The `token` is the JWT used for authorization
export const getUserItems = (token) => 
  axios.get(`${apiUrl}/my-items`, {
    headers: {
      Authorization: `Bearer ${token}`, // Attaching the token to the request header for authorization
    },
  });

// Function to add a new item. 
// The `item` object is the data being posted and `token` is the JWT used for authorization.
export const addItem = (item, token) => 
  axios.post(apiUrl, item, {
    headers: {
      Authorization: `Bearer ${token}`, // Attaching the token to the request header for authorization
    },
  });

// Function to update an existing item by its ID
export const updateItem = (id, item) => axios.put(`${apiUrl}/${id}`, item);

// Function to update multiple items based on a filter and update criteria
export const updateManyItems = (filter, update) => 
  axios.put(`${apiUrl}/many`, { filter, update });

// Function to delete an item by its ID
export const deleteItem = (id) => axios.delete(`${apiUrl}/${id}`);

// Function to delete multiple items based on a filter
export const deleteManyItems = (filter) => 
  axios.delete(`${apiUrl}/many`, { data: filter });
