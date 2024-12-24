import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id } from "../types";
import { v4 as uuidv4 } from "uuid";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
function KanbanBoard(){
    const [columns,setColumns]= useState<Column[]>([]);
    const columnsId = useMemo(() => columns.map((col) => col.id),[columns]);
    const [activeColumn,setActiveColumn] = useState<Column|null>(null);

    const sensors= useSensors(useSensor(PointerSensor,
        {
            activationConstraint:{
                distance: 3,
            }
        }));
    
    return(
        <div className="  px-[40px] m-auto w-full flex items-center min-h-screen overflow-y-hidden
         overflow-x-auto ">
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <div className=" m-auto flex gap-4">
                <div className=" flex gap-4">
                    <SortableContext items={columnsId}>
                    {columns.map((col =>(<ColumnContainer key={col.id} column={col} 
                    deleteColumn={deleteColumn} updateColumnTitle={updateColumnTitle}/>)))}
                    </SortableContext>
                </div>
                <button onClick={()=>{createNewColumn()}} className=" h-[64px] w-[250px]
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
                    <ColumnContainer column={activeColumn} deleteColumn={deleteColumn} updateColumnTitle={updateColumnTitle}/>
                )}
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
    }

    function onDragEnd(event: DragEndEvent){
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
    function updateColumnTitle(id:Id,title:String){
        const newColumns = columns.map((col) =>{
            if(col.id !== id)return col;
            return {...col,title};
        });
        setColumns(newColumns);

    }
}
export default KanbanBoard;