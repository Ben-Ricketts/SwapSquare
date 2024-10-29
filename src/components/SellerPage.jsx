import React, { useState, useEffect } from 'react';
import ItemsList from './ItemsList';
import ItemForm from './ItemForm';
import { getItems } from '../services/itemService';

const SellerPage = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await getItems();
    setItems(response.data);
  };

  return (
    <div>
      <h2>Seller Dashboard</h2>
      <ItemForm editingItem={editingItem} setEditingItem={setEditingItem} fetchItems={fetchItems} />
      <ItemsList setEditingItem={setEditingItem} items={items} fetchItems={fetchItems} />
    </div>
  );
};

export default SellerPage;
