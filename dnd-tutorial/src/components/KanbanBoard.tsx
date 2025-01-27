import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Column,Id,Task } from "../types";
import { v4 as uuidv4 } from "uuid";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

function KanbanBoard(){
    const [columns,setColumns]= useState<Column[]>([]);
    const columnsId = useMemo(() => columns.map((col) => col.id),[columns]);
    const [activeColumn,setActiveColumn] = useState<Column|null>(null);
    const [tasks,setTask] = useState<Task[]>([]);

    const [activeTask,setActiveTask]= useState<Task | null >(null);

    const sensors= useSensors(useSensor(PointerSensor,
        {
            activationConstraint:{
                distance: 3,
            }
        }));
    
    return(
        <div className="  px-[40px] m-auto w-full flex items-center min-h-screen overflow-y-hidden
         overflow-x-auto ">
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
            <div className=" m-auto flex gap-4">
                <div className=" flex gap-4">
                    <SortableContext items={columnsId}>
                    {columns.map((col =>(<ColumnContainer key={col.id} column={col} 
                    deleteColumn={deleteColumn} updateColumnTitle={updateColumnTitle}
                    createTask={createTask} deleteTask={deleteTask} updateTask={updateTask}
                    tasks={tasks.filter((task)=>task.columnId===col.id)} />)))}
                    </SortableContext>
                </div>
                <button
                 onClick={()=>{createNewColumn()}} className=" h-[64px] w-[250px]
                    min-w-[250px]
                    rounded-lg cursor-pointer bg-mainBackgroundColor
                     border-2 border-coulmnBackroundColor p-4 ring-gray-600
                     hover:ring-2 flex gap-2">
                        <PlusIcon/>Add a Board
                </button>
            </div>

            {createPortal(
            <DragOverlay style={{ position: "absolute", zIndex: 1000 }}>
                {activeColumn && (
                    <ColumnContainer column={activeColumn} deleteColumn={deleteColumn}
                     updateColumnTitle={updateColumnTitle} createTask={createTask}
                     deleteTask={deleteTask} updateTask={updateTask}
                     tasks={tasks.filter((task)=>task.columnId===activeColumn.id)} />
                )}
                {activeTask && <TaskCard deleteTask={deleteTask} updateTask={updateTask} task={activeTask}/>}
            </DragOverlay>,document.body
            )}

            </DndContext>
            
        </div>
    );
    function createNewColumn(){
        const ColumnToAdd: Column={
            id: generateId(), 
            title: `Column ${columns.length + 1}`

        };
        setColumns([...columns,ColumnToAdd]);
    }
    function deleteColumn(id:Id){
        const filteredColumn=columns.filter((col)=>col.id!==id);
        setColumns(filteredColumn);
    }

    function generateId(): string {
        return uuidv4(); // Generates a universally unique ID
    }

    function onDragStart(event: DragStartEvent){
        if(event.active.data.current?.type ==="Column"){
            setActiveColumn(event.active.data.current.column);
            return;
        }
        if(event.active.data.current?.type ==="Task"){
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent){
        setActiveColumn(null);
        setActiveTask(null);
        const {active,over} = event;
        if(!over){
            return;
        }
        const activeColumnId=active.id;
        const overColumnId=over.id;

        if(activeColumnId === overColumnId ) return;

        setColumns((columns) =>{
            const activeColumnIndex = columns.findIndex(
                (col)=> col.id === activeColumnId
            );
            const overColumnIndex = columns.findIndex(
                (col) => col.id === overColumnId);

            return arrayMove(columns,activeColumnIndex,overColumnIndex);
        });
        
        
    }

    function onDragOver(event: DragOverEvent){
        const {active,over} = event;
        if(!over){
            return;
        }
        const activeId=active.id;
        const overId=over.id;

        if(activeId===overId) return;
        const isActiveTask=active.data.current?.type==="Task";
        const isOverATask=over.data.current?.type==="Task";
        //droping task over a task:
        if(!isActiveTask) return;

        if(isActiveTask && isOverATask){
            setTask((tasks) =>{
                const activeIndex= tasks.findIndex((t) => t.id=== activeId);
                const overIndex= tasks.findIndex((t)=> t.id === overId);

                if(tasks[activeIndex].columnId!== tasks[overIndex].columnId){
                    tasks[activeIndex].columnId = tasks[overIndex].columnId;
                }
                return arrayMove(tasks,activeIndex,overIndex);
            })
        }
        //droping task over a column:
        const isOveraColumn = over.data.current?.type==="Column";
        if(isActiveTask && isOveraColumn){
            setTask((tasks) =>{
                const activeIndex= tasks.findIndex((t) => t.id=== activeId);

               tasks[activeIndex].columnId=overId;
                return arrayMove(tasks,activeIndex,activeIndex);
            })
        }


    }
    function updateColumnTitle(id:Id,title:String){
        const newColumns = columns.map((col) =>{
            if(col.id !== id)return col;
            return {...col,title};
        });
        setColumns(newColumns);

    }
    function createTask(columnId: Id){
        const newTask : Task ={
            id: generateId(),
            columnId,
            content: `Task ${tasks.length + 1}`,
        };

        setTask([...tasks,newTask]);
    }

    function deleteTask(id:Id){
        const newTasks = tasks.filter(task => task.id !==id);
        setTask(newTasks);
    }
    function updateTask(id:Id,content:string){
        const newTaskContent= tasks.map( (task) => {
            if(task.id !== id) return task;
            return {...task,content};
        }) 

        setTask(newTaskContent);
    }
}
export default KanbanBoard;