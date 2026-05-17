import { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import API from "../services/api";

import TaskCard from "../components/TaskCard";

import CreateTask from "../components/CreateTask";

function Dashboard() {
  const { user, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");
  // protect route
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      fetchTasks();
    }
  }, []);

  // fetch tasks
  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/tasks", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  // create task
  const createTask = async (taskData) => {
    try {
      const { data } = await API.post("/tasks", taskData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setTasks([data, ...tasks]);
    } catch (error) {
      console.log(error);
    }
  };

  // logout
  const logoutHandler = () => {
    localStorage.removeItem("user");

    setUser(null);

    navigate("/");
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold">Team Task Manager</h1>

          <p className="text-gray-600 mt-2">Welcome {user?.name}</p>
        </div>

        <button
          onClick={logoutHandler}
          className="bg-red-500 text-white px-5 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter("All")}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          All
        </button>

        <button
          onClick={() => setFilter("Todo")}
          className="bg-yellow-200 px-4 py-2 rounded"
        >
          Todo
        </button>

        <button
          onClick={() => setFilter("In Progress")}
          className="bg-blue-200 px-4 py-2 rounded"
        >
          Progress
        </button>

        <button
          onClick={() => setFilter("Completed")}
          className="bg-green-200 px-4 py-2 rounded"
        >
          Completed
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded border"
        />
      </div>

      {/* Create Task */}
      {user.role === "admin" && (
        <CreateTask onCreate={createTask} token={user.token} />
      )}

      {/* Tasks */}
      <div className="grid md:grid-cols-2 lg:grid-cols-1 grid-cols-3 gap-5">
        {tasks
          .filter((task) => {
            const matchesSearch = task.title
              .toLowerCase()
              .includes(search.toLowerCase());

            const matchesFilter =
              filter === "All" ? true : task.status === filter;

            return matchesSearch && matchesFilter;
          })
          .map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              token={user.token}
              refreshTasks={fetchTasks}
            />
          ))}
      </div>
    </div>
  );
}

export default Dashboard;
