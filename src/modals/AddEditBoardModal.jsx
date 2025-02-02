/* eslint-disable */

import React, { useState } from "react";
import boardsSlice from "../redux/boardsSlice";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";

function AddEditBoardModal({ setIsBoardModalOpen, type }) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isValid, setIsValid] = useState(true);
  const [newColumns, setNewColumns] = useState([
    { name: "Todo", tasks: [], id: uuidv4() },
    { name: "In Progress", tasks: [], id: uuidv4() },
    { name: "Completed", tasks: [], id: uuidv4() },
  ]);

  const board = useSelector((state) => state.boards).find(
    (board) => board.isActive
  );

  const validate = () => {
    setIsValid(false);
    if (!name.trim()) {
      return false;
    }

    setIsValid(true);
    return true;
  };

  if (type === "edit" && isFirstLoad) {
    setNewColumns(
      board.columns.map((col) => {
        return { ...col, id: uuidv4() };
      })
    );

    setName(board.name);
    setIsFirstLoad(false);
  }

  const onSubmit = (type) => {
    setIsBoardModalOpen(false);
    if (type === "add") {
      dispatch(boardsSlice.actions.addBoard({ name, newColumns }));
    } else {
      dispatch(boardsSlice.actions.editBoard({ name, newColumns }));
    }
  };

  return (
    <div
      className='  fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide  z-50 left-0 bottom-0 justify-center items-center flex overflow '
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setIsBoardModalOpen(false);
      }}
    >
      <div
        className=' scrollbar-hide overflow-y-scroll max-h-[95vh]  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold
         shadow-md shadow-[#364e7e1a] max-w-md mx-auto my-auto w-full px-8  py-8 rounded-xl'
      >
        <h3 className=' text-lg '>
          {type === "edit" ? "Edit" : "Add New"} Board
        </h3>
        {/* Board Name */}
        <div className='mt-8 flex flex-col space-y-1'>
          <label className='  text-sm dark:text-white text-gray-500'>
            {" "}
            Board Name
          </label>
          <input
            className=' bg-transparent  px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-gradient outline-1  ring-0  '
            placeholder=' e.g Web Design'
            value={name}
            onChange={(e) => setName(e.target.value)}
            id='board-name-input'
          />
        </div>
        {/* Board Columns */}
        <div className='mt-8 flex flex-col space-y-3'>
          <label className=' text-sm dark:text-white text-gray-500'>
            Board Columns
          </label>
          <div className='bg-transparent flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-gradient outline-[1px]'>
            Todo
          </div>
          <div className='bg-transparent flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-gradient outline-[1px]'>
            In Progress
          </div>
          <div className='bg-transparent flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-gradient outline-[1px]'>
            Completed
          </div>
        </div>
        {/* buttons */}
        <div>
          <button
            onClick={() => {
              const isValid = validate();
              if (isValid === true) onSubmit(type);
            }}
            className=' w-full items-center hover:opacity-70 dark:text-white dark:bg-gradient mt-8 relative  text-white bg-gradient py-2 rounded-full'
          >
            {type === "add" ? "Create New Board" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default AddEditBoardModal;
