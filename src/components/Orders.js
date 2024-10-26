import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // Import Modal
import '../styling/Orders.css'; // Import the CSS file for styling
import io from 'socket.io-client';

Modal.setAppElement('#root'); // Setting root for accessibility

const Orders = () => {
  const [orders, setOrders] = useState([]); // State to store orders
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state
  const [selectedOrder, setSelectedOrder] = useState(null); // To store the currently selected order
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal visibility state

  const token = localStorage.getItem('token'); // Get the token from localStorage

  const socket = io('https://order-backend-olive.vercel.app/', { auth: { token } }); // Connect with auth token

  useEffect(() => {
    socket.on('newOrder', (data) => {
      console.log('New order notification:', data);
     
      fetchOrders(); // Refetch orders on new order
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('https://order-backend-olive.vercel.app/api/orders/shop/orders', {
        headers: { 'x-auth-token': token },
      });
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      setError(`Error fetching orders. Please try again. ${err}`);
      setLoading(false);
    }
  };

  // Function to update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      console.log(orderId, status);
      await axios.patch(`https://order-backend-olive.vercel.app/api/orders/order/${orderId}/${status}`, {}, {
        headers: { 'x-auth-token': token },
      });
      fetchOrders(); // Refetch the orders after status update
      closeModal(); // Close the modal after update
    } catch (err) {
      setError('Error updating order status.');
    }
  };

  // Function to open modal with selected order
  const openModal = (order) => {
    setSelectedOrder(order);
    setModalIsOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedOrder(null);
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Loading state
  if (loading) {
    return <p>Loading orders...</p>;
  }

  // Error state
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Orders</h2>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <h3>Order ID: {order._id}</h3>
            <p>Status: <button onClick={() => openModal(order)}>{order.status}</button></p>
            <p>Total Price: RS: {order.totalPrice.toFixed(2)}</p>
            <p>Ordered At: {new Date(order.createdAt).toLocaleString()}</p>
            <h4>Items:</h4>
            <ul>
              {order.items.map((item) => (
                <li key={item.productId._id}>
                  {item.productId.name} - ${item.price} x {item.quantity}
                </li>
              ))}
            </ul>
            <hr />
          </div>
        ))
      ) : (
        <p>No orders found for this shop.</p>
      )}

      {/* Modal for updating order status */}
      {selectedOrder && (
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Update Order Status">
          <h2>Update Status for Order ID: {selectedOrder._id}</h2>
          <div className="modal-content">
            <button onClick={() => updateOrderStatus(selectedOrder._id, 'accept')}>Accept</button>
            <button onClick={() => updateOrderStatus(selectedOrder._id, 'reject')}>Reject</button>
            <button onClick={() => updateOrderStatus(selectedOrder._id, 'pack')}>Pack</button>
            <button onClick={() => updateOrderStatus(selectedOrder._id, 'out-for-delivery')}>Out for Delivery</button>
            <button onClick={() => updateOrderStatus(selectedOrder._id, 'delivered')}>Delivered</button>
          </div>
          <button onClick={closeModal} className="close-modal">Close</button>
        </Modal>
      )}
    </div>
  );
};

export default Orders;
