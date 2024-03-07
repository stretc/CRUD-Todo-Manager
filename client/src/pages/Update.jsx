import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Update = () => {
  const { id } = useParams();

  const [task, setTask] = useState({
    title: '',
    date: '',
    description: ''
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/update/${id}`);
        const { title = '', date = '', description = '' } = response.data;
        setTask({ title, date, description });
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };
    fetchTask();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTask({
      ...task,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:8800/tasks/${id}`, task);
      // Navigate to the home page after the task has been updated
      window.location.href = '/';
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const { title, date, description } = task;

  return (
    <div className='up-container'>
      <h1>Update Entry:</h1>
      <form onSubmit={handleSubmit}>
        <input
          required
          type="text"
          name="title"
          placeholder='Task Name*'
          value={title}
          onChange={handleInputChange}
        />
        <input
          required
          className='date-picker'
          type="date"
          name="date"
          value={date}
          onChange={handleInputChange}
        />
        <input
          required
          type="text"
          name="description"
          value={description}
          placeholder='Description*'
          rows={3}
          cols={25}
          onChange={handleInputChange}
        />
        <button className='up-btn' type="submit">Update</button>
      </form>
    </div>
  );
};

export default Update;
