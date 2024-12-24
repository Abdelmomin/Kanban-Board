import { Task } from "../types";
interface Props{
    task:Task;
}

function ColumnContainer({task}: Props){
    return (
        <div className=" bg-mainBackgroundColor h-[100px] rounded-xl p-2.5 min-h-[100px] items-center fmex text-left hover:ring-2 hover:ring-inset hover: ring-rose-500">{task.content}</div>
    )
}
export default ColumnContainer;