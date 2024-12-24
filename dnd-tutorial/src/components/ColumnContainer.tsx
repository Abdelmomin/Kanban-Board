import { useSortable } from "@dnd-kit/sortable";
import PlusIcon from "../icons/PlusIcon";
import TrashIcon from "../icons/TrashIcon";
import { Column, Id, Task } from "../types";
import {CSS} from "@dnd-kit/utilities";
import { useState } from "react";
import TaskCard from "./TaskCard";
interface Props{
    column:Column;
    deleteColumn:(id:Id)=>void;
    updateColumnTitle:(id:Id,title:string)=>void;
    createTask:(columnId: Id)=>void;
    deleteTask:(id:Id) => void;
    updateTask:(id:Id,content:string) =>void;
    tasks:Task[];
}
function ColumnContainer(props: Props){
    const {column,deleteColumn,updateColumnTitle,createTask,tasks,deleteTask,updateTask}= props;
    const[editTitle,setTitle]=useState(false);


    const {setNodeRef,attributes,listeners,transform,transition,isDragging}= 
    useSortable ({
        id: column.id,
        data:{
            type:"Column",
            column,
        },
        disabled:editTitle,
    });

    const style = {
        transition: transition || "transform 200ms ease",
        transform: CSS.Transform.toString(transform) || "none",
    };
    
    if (isDragging) {
        return (
            <div ref={setNodeRef} style={style}
                className="bg-black w-[350px] h-[500px] max-h-[500px] flex flex-col rounded-md"
            ></div>
        );
    }

    
    

    return <div style={style} ref={setNodeRef} className=" bg-coulmnBackroundColor w-[350px] h-[500px] max-h-[500px]
    flex flex-col rounded-md">
        {/*Column Title*/}
        <div onClick={()=>{
            setTitle(true);
        }} {...attributes} {...listeners} className="bg-mainBackgroundColor h-[60px] cursor-grab rounded-md rounded-b-none
        font-bold text-md p-3 border-coulmnBackroundColor border-4 flex items-center justify-between">
                <div className=" flex gap-2">
                    <div className=" rounded-full flex justify-center items-center bg-coulmnBackroundColor px-2 py-1
                    text-sm">0</div>
                    {!editTitle && column.title}
                    {editTitle &&
                     <input 
                      onBlur={()=> setTitle(false)}
                      value={column.title}
                      onChange={(e)=> updateColumnTitle(column.id,e.target.value)}
                      autoFocus 
                      className=" bg-black outline-none px-2 rounded focus:border-rose-500 border"
                      onKeyDown={(e)=>
                      {if(e.key !=="Enter")return;
                      setTitle(false);}}>
                        </input>}
                </div>

                <div onClick={()=>{deleteColumn(column.id)}} className=" stroke-gray-500 hover:stroke-white
                 hover:bg-coulmnBackroundColor
                rounded-full px-1 py-2 "><TrashIcon/></div>
        </div>
        {/*Column Container*/}
        <div className=" flex flex-grow flex-col gap-4 overflow-x-hidden overflow-y-auto p-2">
            {tasks.map((task)=>(
                <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}/>
            ))}
        </div>
        {/*Column footer*/}
        <footer className=" h-[60px]">
            <button
            onClick={()=>{createTask(column.id)}}
            className=" bg-mainBackgroundColor w-full h-full max-h-[60px] flex items-center p-2
            ring-gray-600 hover:ring-2 rounded rounded-t-none gap-2 hover:text-pink-500 border"><PlusIcon></PlusIcon>Add a task</button>
        </footer>
    </div>
}
export default ColumnContainer;