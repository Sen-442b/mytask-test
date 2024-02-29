import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [searchTerm, sortBy, sortOrder, currentPage]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/customers/search?q=${searchTerm}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${currentPage}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setCustomers(data.customers);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors here
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      <h1>Customer Details</h1>
      <div className="search">
        <input
          type="text"
          placeholder="Search by name or location"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="sort">
        <label>Sort By:</label>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="created_at">Date</option>
          <option value="time">Time</option>
        </select>
        <select value={sortOrder} onChange={handleSortOrderChange}>
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.customer_name}</td>
              <td>{customer.age}</td>
              <td>{customer.phone}</td>
              <td>{customer.location}</td>
              <td>{customer.created_at.split(' ')[0]}</td>
              <td>{customer.created_at.split(' ')[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
        ))}
      </div>
    </div>
  );
}

export default App;
