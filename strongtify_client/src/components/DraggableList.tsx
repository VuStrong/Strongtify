"use client";

import { BiSolidSortAlt } from "react-icons/bi";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DragUpdate,
} from "react-beautiful-dnd";

interface DraggableListProps {
    initialItems: any[];
    formatItem: (item: any, index: number) => React.ReactNode;
    onDrop: (item: any, index: number, items: any[]) => Promise<void>;
}

const reOrderItems = (list: any[], startIndex: number, endIndex: number) => {
    const [removed] = list.splice(startIndex, 1);
    list.splice(endIndex, 0, removed);
};

const DraggableList: React.FC<DraggableListProps> = ({
    initialItems,
    formatItem,
    onDrop,
}) => {
    const onDragEnd = async (result: DragUpdate) => {
        if (
            !result.destination ||
            result.source.index === result.destination.index
        ) {
            return;
        }

        reOrderItems(
            initialItems,
            result.source.index,
            result.destination.index,
        );

        await onDrop(
            {
                id: result.draggableId,
            },
            result.destination.index + 1,
            initialItems,
        );
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <div
                        className="w-full"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {initialItems?.map((item, index) => (
                            <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <div
                                        className="w-full relative"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                    >
                                        <div
                                            {...provided.dragHandleProps}
                                            className="absolute text-gray-300 cursor-pointer w-fit top-1/2 -translate-y-1/2"
                                        >
                                            <BiSolidSortAlt size={24} />
                                        </div>

                                        <div className="ml-6">
                                            {formatItem(item, index)}
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}

                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default DraggableList;
