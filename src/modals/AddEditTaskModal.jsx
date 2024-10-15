/* eslint-disable */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import crossIcon from "../assets/icon-cross.svg";
import boardsSlice from "../redux/boardsSlice";
import useDarkMode from "../hooks/useDarkMode";

function AddEditTaskModal({
  type,
  device,
  setOpenAddEditTask,
  setIsTaskModalOpen,
  taskIndex,
  prevColIndex = 0,
}) {
  const board = useSelector((state) => state.boards).find(
    (board) => board.isActive
  );
  const columns = board.columns;
  const col = columns.find((col, index) => index === prevColIndex);
  const task = col ? col.tasks.find((task, index) => index === taskIndex) : [];

  const [status, setStatus] = useState(columns[prevColIndex].name);
  const [newColIndex, setNewColIndex] = useState(prevColIndex);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isValid, setIsValid] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState([
    { title: "", isCompleted: false, id: uuidv4() },
    { title: "", isCompleted: false, id: uuidv4() },
  ]);
  const [theme, setTheme] = useDarkMode();
  const dispatch = useDispatch();

  const onChangeSubtasks = (id, newValue) => {
    setSubtasks((prevState) => {
      const newState = [...prevState];
      const subtask = newState.find((subtask) => subtask.id === id);
      subtask.title = newValue;
      return newState;
    });
  };

  const onChangeStatus = (e) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };

  const validate = () => {
    setIsValid(false);
    if (!title.trim()) {
      return false;
    }

    for (let i = 0; i < subtasks.length; i++) {
      if (!subtasks[i].title.trim()) {
        return false;
      }
    }

    setIsValid(true);
    return true;
  };

  if (type === "edit" && isFirstLoad) {
    setSubtasks(
      task.subtasks.map((subtask) => {
        return { ...subtask, id: uuidv4() };
      })
    );
    setTitle(task.title);
    setDescription(task.description);
    setIsFirstLoad(false);
  }

  const onDelete = (id) => {
    setSubtasks((prevState) => prevState.filter((el) => el.id !== id));
  };

  const onSubmit = (type) => {
    if (type === "add") {
      dispatch(
        boardsSlice.actions.addTask({
          title,
          description,
          subtasks,
          status,
          newColIndex,
        })
      );
    } else {
      dispatch(
        boardsSlice.actions.editTask({
          title,
          description,
          subtasks,
          status,
          taskIndex,
          prevColIndex,
          newColIndex,
        })
      );
    }
  };

  return (
    <div
      className={
        device === "mobile"
          ? "  py-6 px-6 pb-40  absolute overflow-y-scroll  left-0 flex  right-0 bottom-[-100vh] top-0  overflow"
          : "  py-6 px-6 pb-40  absolute overflow-y-scroll  left-0 flex  right-0 bottom-0 top-0  overflow"
      }
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setOpenAddEditTask(false);
      }}
    >
      {" "}
      <div
        className=' scrollbar-hide overflow-y-scroll max-h-[95vh]  my-auto  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold
       shadow-md shadow-[#364e7e1a] max-w-md mx-auto  w-full px-8  py-8 rounded-xl'
      >
        <h3 className=' text-lg '>
          {type === "edit" ? "Edit" : "Add New"} Task
        </h3>

        {/* Task Name */}
        <div className='mt-6 flex flex-col space-y-1'>
          <label className='  text-sm dark:text-white text-gray-500'>
            Task Name
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id='task-name-input'
            type='text'
            className=' bg-transparent  px-4 py-2   focus:outline-gradient outline-1 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-gradient   '
            placeholder=' e.g Take coffee break'
          />
        </div>

        {/* Description */}
        <div className='mt-6 flex flex-col space-y-1'>
          <label className='  text-sm dark:text-white text-gray-500'>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id='task-description-input'
            className=' bg-transparent min-h-[150px]   focus:outline-gradient outline-1 px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600    '
            placeholder="e.g. It's always good to take a break. This 
            15 minute break will  recharge the batteries 
            a little."
          />
        </div>

        {/* Subtasks */}
        <div className='mt-6 flex flex-col space-y-3'>
          <label className='  text-sm dark:text-white text-gray-500'>
            Subtasks
          </label>

          {subtasks.map((subtask, index) => (
            <div key={index} className=' flex items-center w-full '>
              <input
                onChange={(e) => {
                  onChangeSubtasks(subtask.id, e.target.value);
                }}
                type='text'
                value={subtask.title}
                className=' bg-transparent  focus:outline-gradient outline-1 flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-gradient    '
                placeholder=' e.g Take coffee break'
              />
              <img
                src={crossIcon}
                onClick={() => {
                  onDelete(subtask.id);
                }}
                className=' m-4 cursor-pointer '
              />
            </div>
          ))}

          <button
            className=' w-full items-center dark:text-gradient dark:bg-white  text-white bg-gradient py-2 rounded-full '
            onClick={() => {
              setSubtasks((state) => [
                ...state,
                { title: "", isCompleted: false, id: uuidv4() },
              ]);
            }}
          >
            + Add New Subtask
          </button>
        </div>

        {/* current Status  */}
        <div className='mt-6 flex flex-col space-y-3'>
          <label className=' text-sm dark:text-white text-gray-500'>
            Current Status
          </label>
          <select
            value={status}
            onChange={(e) => onChangeStatus(e)}
            className={`select-status flex-grow px-4 py-2 rounded-md text-sm focus:outline-gradient outline-1 border-[1px] ${
              theme === "dark" ? "dark-dropdown" : "light-dropdown"
            }`}
          >
            {columns.map((column, index) => (
              <option key={index}>{column.name}</option>
            ))}
          </select>

          <button
            onClick={() => {
              const isValid = validate();
              if (isValid) {
                onSubmit(type);
                setOpenAddEditTask(false);
              }
            }}
            className=' w-full items-center text-white bg-gradient py-2 rounded-full '
          >
            {type === "edit" ? " save edit" : "Create task"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEditTaskModal;
