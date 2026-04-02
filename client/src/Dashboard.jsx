import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const refreshData = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_URL}/tasks/${userId}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Refresh failed", err);
    }
  }, [userId]);

  // --- INITIAL LOAD & SECURITY CHECK ---
  useEffect(() => {
    // 1. Check if the user is even logged in
    if (!userId) {
      navigate("/login");
      return; 
    }

    // 2. Define a "One-Time" fetcher inside the effect
    // This stops the cascading render warning
    const loadInitialData = async () => {
      try {
        const res = await axios.get(`${API_URL}/tasks/${userId}`);
        setTasks(res.data);
      } catch (err) {
        console.error("Initial load failed", err);
      }
    };

    loadInitialData();
  }, [userId, navigate]); // Notice: refreshData is REMOVED from here
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await axios.post(`${API_URL}/tasks`, { text: newTask, userId: userId });
      setNewTask("");
      refreshData();
    } catch (err) { console.error(err); }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      refreshData();
    } catch (err) { console.error(err); }
  };

  // Logic for the Progress Bar
  const filteredTasks = tasks.filter(task => 
    task.text.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );
  
  const completedCount = tasks.filter(t => t.completed).length;
  const percent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* HEADER SECTION */}
        <div className="bg-blue-600 p-6 flex justify-between items-center text-white">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Task Master </h1>
            <p className="text-blue-100 text-sm">Organize your big ideas</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition font-medium"
          >
            Logout
          </button>
        </div>
        
        <div className="p-8">
          {/* PROGRESS SECTION */}
          <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-blue-800">Project Progress</span>
              <span className="text-sm font-bold text-blue-800">{percent}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-700 ease-in-out shadow-sm" 
                style={{ width: `${percent}%` }}
              ></div>
            </div>
            <p className="text-xs text-blue-600 mt-2 italic font-medium">
              {percent === 100 ? "All goals achieved! Amazing work. 🎉" : `${completedCount} of ${tasks.length} tasks finished`}
            </p>
          </div>

          {/* ADD TASK FORM */}
          <form onSubmit={addTask} className="flex gap-3 mb-8">
            <input 
              value={newTask} 
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-700"
            />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition active:scale-95"
            >
              Add
            </button>
          </form>

          {/* SEARCH BAR */}
          <div className="relative mb-8">
            <span className="absolute left-4 top-3.5 text-gray-400 font-bold">🔍</span>
            <input 
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition text-gray-600"
            />
          </div>

          {/* TASK LIST DISPLAY */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400 italic">
                  {searchTerm ? "No tasks match your search." : "Your workspace is empty."}
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {filteredTasks.map(task => (
                  <li key={task.id} className="group bg-white border border-gray-100 p-4 flex justify-between items-center rounded-xl hover:shadow-md transition duration-200 border-l-4 border-l-blue-500">
                    <span className="text-gray-700 font-medium">{task.text}</span>
                    <button 
                      onClick={() => deleteTask(task.id)} 
                      className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity font-semibold px-2 py-1"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;