import React, { useState, useEffect } from "react";
import Task from "./Task";
import { getAllTasks, deleteTask, updateTask } from "../helpers/api";
import { toast } from "react-toastify";

const TaskShow = ({ tasks, setTasks }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOption, setFilterOption] = useState("newest");
  const [selectedTask, setSelectedTask] = useState(null); // Selected task for updating
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const tasksPerPage = 3;

  const refreshTasks = async () => {
    try {
      const response = await getAllTasks();
      setTasks(response);
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async (taskId) => {
    try {
      await deleteTask(taskId);

      toast.success("Task Deleted Successfully");

      refreshTasks();
    } catch (error) {
      toast.error("Error Deleting Task");
      console.log(error.response.data.message);
    }
  };

  const onUpdate = async (updatedTask) => {
    console.log(updatedTask);
    try {
      await updateTask(updatedTask.id, updatedTask);

      toast.success("Task Updated Successfully");
      // Refresh tasks after updating
      refreshTasks();
    } catch (error) {
      toast.error("Error Updating Task");
      console.log(error.response.data.message);
    }
  };

  const handleUpdateClick = (task) => {
    setSelectedTask(task);
    setShowUpdateModal(true);
  };

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  // Filtered tasks based on filter option
  let filteredTasks = [...tasks];
  if (filterOption === "oldest") {
    filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else if (filterOption === "newest") {
    filteredTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  } else if (
    filterOption === "to-do" ||
    filterOption === "in-progress" ||
    filterOption === "done"
  ) {
    filteredTasks = tasks.filter((task) => task.status === filterOption);
  }

  // Calculate the tasks to be displayed on the current page
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  // Calculate total pages
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex-1 flex flex-col rounded-lg">
      <div className="p-4 bg-gray-100 rounded-t-lg">
        <label htmlFor="filter" className="text-sm font-semibold">
          Filter:
        </label>
        <select
          id="filter"
          className="px-2 py-1 border rounded ml-2"
          value={filterOption}
          onChange={handleFilterChange}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="to-do">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      {tasks.length === 0 ? (
        <h1 className="text-center text-2xl font-semibold mt-4">
          No Tasks Found
        </h1>
      ) : (
        <div className="mx-auto p-5 flex w-full flex-col gap-4">
          {currentTasks.map((task, index) => (
            <Task
              key={index}
              task={task}
              onDelete={() => onDelete(task.id)}
              onUpdate={() => handleUpdateClick(task)}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center items-center mt-auto space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2  rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Update Task Modal */}
      {showUpdateModal && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Update Task</h2>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-4xl item-center text-black"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdate(selectedTask);
                setShowUpdateModal(false);
              }}
            >
              <input
                type="text"
                value={selectedTask?.title}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, title: e.target.value })
                }
                className="p-3 border rounded-md w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Task Title"
              />
              <textarea
                value={selectedTask?.description}
                onChange={(e) =>
                  setSelectedTask({
                    ...selectedTask,
                    description: e.target.value,
                  })
                }
                className="p-3 border rounded-md w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Task Description"
              />
              <select
                value={selectedTask?.status}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, status: e.target.value })
                }
                className="p-3 border rounded-md w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="to-do">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <input
                type="date"
                value={selectedTask?.dueDate}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, dueDate: e.target.value })
                }
                className="p-3 border rounded-md w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Due Date"
              />
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white text-lg rounded-md hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskShow;
