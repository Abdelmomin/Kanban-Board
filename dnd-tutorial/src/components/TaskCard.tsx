import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import { Id, Task } from "../types";
interface Props{
    task:Task;
    deleteTask:(id:Id)=>void;
    updateTask:(id:Id,content:string)=>void;
}

function TaskCard({task,deleteTask,updateTask}: Props){
    const [mouseisOver,setMouseisOver]=useState(false);
    const [editMode,setEditMode]= useState(false);
    const toogleEditMode= () =>{
        setEditMode((prev)=>(!prev));
        setMouseisOver(false);
    }

    if(editMode){
        return(
            <div className=" bg-mainBackgroundColor h-[100px] rounded-xl p-2.5 min-h-[100px]
             items-center flex text-left hover:ring-2 hover:ring-inset
              hover: ring-rose-500 cursor-grab relative">
                <textarea className=" h-[100%] w-full resize-none border-none rounded bg-transparent
                text-white focus:outline-none"
                value={task.content}
                autoFocus
                placeholder="Task content here"
                onBlur={toogleEditMode}
                onKeyDown={(e)=>{
                    if (e.key==="Enter" && e.shiftKey) toogleEditMode();
                }}
                onChange={ (e)=> updateTask(task.id,e.target.value)}
                ></textarea>
            </div>
        )
    }
    return (
        <div onClick={toogleEditMode}  onMouseEnter={()=>setMouseisOver(true)} onMouseLeave={()=>setMouseisOver(false)}
         className=" bg-mainBackgroundColor h-[100px] rounded-xl p-2.5 min-h-[100px]
         items-center flex text-left hover:ring-2 hover:ring-inset
          hover: ring-rose-500 cursor-grab relative task">
            <p className=" my-auto h-[90%] w-full overflow-y-auto overflow-x-auto
            whitespace-pre-wrap">{task.content}</p>
            { mouseisOver &&<button onClick={()=>{deleteTask(task.id)}} 
                className=" stroke-gray-500 hover:stroke-white
                hover:bg-coulmnBackroundColor rounded-full px-1 
                py-2 absolute right-4 top-1/2
                -translate-y-1/2"><TrashIcon/>
            </button>}
        </div>
    )
}
export default TaskCard;