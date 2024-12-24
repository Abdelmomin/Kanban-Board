import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import { Id, Task } from "../types";
interface Props{
    task:Task;
    deleteTask:(id:Id)=>void;
}

function ColumnContainer({task,deleteTask}: Props){
    const [mouseisOver,setMouseisOver]=useState(false);


    return (
        <div onMouseEnter={()=>setMouseisOver(true)} onMouseLeave={()=>setMouseisOver(false)} className=" bg-mainBackgroundColor h-[100px] rounded-xl p-2.5 min-h-[100px]
         items-center flex text-left hover:ring-2 hover:ring-inset
          hover: ring-rose-500 cursor-grab relative">{task.content}
            { mouseisOver &&<button onClick={()=>{deleteTask(task.id)}} 
                className=" stroke-gray-500 hover:stroke-white
                hover:bg-coulmnBackroundColor rounded-full px-1 
                py-2 absolute right-4 top-1/2
                -translate-y-1/2"><TrashIcon/>
            </button>}
        </div>
    )
}
export default ColumnContainer;