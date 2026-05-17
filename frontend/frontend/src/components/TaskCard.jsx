import API from "../services/api";

function TaskCard({ task, token, refreshTasks }) {
  const updateStatus = async (status) => {
    try {
      await API.put(
        `/tasks/${task._id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      refreshTasks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white shadow-md p-5 rounded-lg">
      <h2 className="text-xl font-bold">{task.title}</h2>

      <p className="mt-2 text-gray-600">{task.description}</p>

      <div className="mt-4">
        <span
          className={`px-3 py-1 rounded text-sm font-semibold
  ${
    task.status === "Todo"
      ? "bg-yellow-200"
      : task.status === "In Progress"
        ? "bg-blue-200"
        : "bg-green-200"
  }`}
        >
          {task.status}
        </span>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Assigned To:
        <span className="font-bold ml-1">
          {task.assignedTo?.name || "Unassigned"}
        </span>
      </div>

      {/* Buttons */}
      <div className="mt-5 flex gap-2">
        <button
          onClick={() => updateStatus("Todo")}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          Todo
        </button>

        <button
          onClick={() => updateStatus("In Progress")}
          className="bg-blue-200 px-3 py-1 rounded"
        >
          Progress
        </button>

        <button
          onClick={() => updateStatus("Completed")}
          className="bg-green-200 px-3 py-1 rounded"
        >
          Complete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
