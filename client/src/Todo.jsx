import React, { useState } from "react";

function Todo() {

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = () => {

    if(task === "") return;

    setTasks([...tasks, task]);
    setTask("");
  };

  const deleteTask = (index) => {

    const newTasks = tasks.filter((t,i)=> i !== index);
    setTasks(newTasks);
  };

  return (
    <div style={{width:"400px", margin:"50px auto"}}>

      <h2>Todo List</h2>

      <input
        type="text"
        placeholder="Enter task"
        value={task}
        onChange={(e)=>setTask(e.target.value)}
      />

      <button onClick={addTask}>Add</button>

      <ul>

        {tasks.map((t,index)=>(
          <li key={index}>
            {t}
            <button onClick={()=>deleteTask(index)}>Delete</button>
          </li>
        ))}

      </ul>

    </div>
  );
}

export default Todo;