import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styling/Inventory.css'; // Include your custom styles
import '../styling/ListStyle.css'; // Include your custom styles
import Modal from 'react-modal'; // Using react-modal
import { toast } from 'react-toastify';

Modal.setAppElement('#root');

const Inventory = () => {
  const token = localStorage.getItem('token'); // Get the token from localStorage
  const [isOpen, setIsOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); // For edit modal
  const [selectedProduct, setSelectedProduct] = useState(null); // Selected product to edit
  const [products, setProducts] = useState([]); // Store product list

  // Fetch all products from the API
  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://order-backend-olive.vercel.app/api/inventory/all-products', {
        headers: {
          'x-auth-token': token
        }
      });
      setProducts(res.data); // Set products to state
      console.log('Fetched products:', res.data); // Log products after fetching
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []); // Empty dependency array ensures this runs once on mount

  const [formData, setFormData] = useState({
    name: '',
    price: '', // Initialize as empty string
    description: '',
    category: '',
    stock: '' // Initialize as empty string
  });

  const [error, setError] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle form submission (Add Product)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price), // Convert to number
      stock: parseInt(formData.stock, 10) // Convert to integer
    };

    try {
      const res = await axios.post(
        'https://order-backend-olive.vercel.app/api/inventory/add-product',
        productData,
        {
          headers: {
            'x-auth-token': token
          }
        }
      );
      toast.success('Product added successfully:', res.data);
      setIsOpen(false); // Close the modal after adding the product
      setFormData({ name: '', price: '', description: '', category: '', stock: '' }); // Reset form
      fetchProducts(); // Refresh product list
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Error adding product. Please try again.');
    }
  };

  // Function to handle the edit button click
  const handleEditClick = (product) => {
    setSelectedProduct(product); // Set the selected product to edit
    setFormData({
      name: product.name,
      price: product.price.toString(), // Convert to string to display in the input
      description: product.description,
      category: product.category,
      stock: product.stock.toString()
    });
    setEditModalOpen(true); // Open the edit modal
  };

  // Function to handle update product submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedProductData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10)
    };

    try {
      const res = await axios.put(
        `https://order-backend-olive.vercel.app/api/inventory/update-product/${selectedProduct._id}`,
        updatedProductData,
        {
          headers: {
            'x-auth-token': token
          }
        }
      );
      toast.success('Product updated successfully:', res.data);
      setEditModalOpen(false); // Close the modal after updating the product
      setSelectedProduct(null); // Clear the selected product
      fetchProducts(); // Refresh the product list
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Error updating product. Please try again.');
    }
  };

  // Function to handle the delete button click with confirmation
  const handleDeleteClick = async (productId) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (confirmed) {
      try {
        await axios.delete(`https://order-backend-olive.vercel.app/api/inventory/delete-product/${productId}`, {
          headers: {
            'x-auth-token': token
          }
        });
        toast.success('Product deleted successfully');
        fetchProducts(); // Refresh the product list after deletion
      } catch (err) {
        console.error('Error deleting product:', err);
        toast.error('Error deleting product. Please try again.');
      }
    }
  };

  // Open and close modal functions
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const closeEditModal = () => setEditModalOpen(false);

  return (
    <div className="inventory-container">
      <h1>Inventory</h1>

      {/* List of products */}
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <h3>{product.name}</h3>
              <p>Price: {product.price}</p>
              <p>Description: {product.description}</p>
              <p>Category: {product.category}</p>
              <p>Stock: {product.stock}</p>
              <button onClick={() => handleEditClick(product)}>Edit</button>
              <button onClick={() => handleDeleteClick(product._id)}>Delete</button> {/* Delete button */}
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {/* Floating Add Button */}
      <button className="add-button" onClick={openModal}>
        +
      </button>

      {/* Modal for adding new product */}
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Add Product Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Add New Product</h2>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={formData.stock}
            onChange={handleChange}
            required
          />
          <button type="submit">Add Product</button>
        </form>
        <button className="close-button" onClick={closeModal}>
          Close
        </button>
      </Modal>

      {/* Modal for editing product */}
      <Modal
        isOpen={editModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Product Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Edit Product</h2>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={formData.stock}
            onChange={handleChange}
            required
          />
          <button type="submit">Update Product</button>
        </form>
        <button className="close-button" onClick={closeEditModal}>
          Close
        </button>
      </Modal>
    </div>
  );
};

export default Inventory;
