import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const Home = () => {
  const id = useParams();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  // Gets Tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8800/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [id]);

  // Creates Tasks
  const addTask = async () => {
    try {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      const response = await fetch('http://localhost:8800/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          date: formattedDate,
          description,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      setTitle('');
      setDate('');
      setDescription('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Deletes Tasks
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:8800/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className='home-container'>
      <div className="input-container">
        <input 
          required
          type="text" 
          placeholder='Task Name*' 
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <input
          required
          className='date-picker'
          type="date"
          defaultValue={date}
          onChange={(event) => setDate(event.target.value)}
        />
        <input 
          type="text" 
          defaultValue={description}
          placeholder='Description' 
          rows={3} 
          cols={25} 
          onChange={(event) => setDescription(event.target.value)}
        />
        <button className='add-btn' onClick={addTask}>
          Add
        </button>
      </div>

      <div className="data-table">
        <table>
        <tbody>
            <tr>
              <th className='cell-head'>Task</th>
              <th className='cell-head'>Date</th>
              <th className='cell-head'>Description</th>
            </tr>
            {tasks.map(task => (
              <tr key={task.id}>
                <td className='cell-task'>{task.title}</td>
                <td className='cell-task'>{new Date(task.date).toLocaleDateString()}</td>
                <td className='cell-task'>{task.description}</td>
                <td className='button-cell'>
                  <button className='delete-btn' onClick={() => deleteTask(task.id)}>Delete</button>
                  <Link to={`/update/${task.id}`}>
                    <button className='edit-btn'>Edit</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
