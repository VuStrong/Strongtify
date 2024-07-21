"use client";

import { BiSolidSortAlt } from "react-icons/bi";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DragUpdate,
} from "react-beautiful-dnd";

interface DraggableListProps {
    id: string;
    autoPos?: boolean;
    initialItems: any[];
    formatItem: (item: any, index: number) => React.ReactNode;
    onDrop?: (item: any, from: number, to: number) => Promise<void>;
}

const reOrderItems = (list: any[], startIndex: number, endIndex: number) => {
    const [removed] = list.splice(startIndex, 1);
    list.splice(endIndex, 0, removed);
};

export default function DraggableList({
    id,
    autoPos,
    initialItems,
    formatItem,
    onDrop,
}: DraggableListProps) {
    const onDragEnd = async (result: DragUpdate) => {
        if (
            !result.destination ||
            result.source.index === result.destination.index
        ) {
            return;
        }

        const item = initialItems.find(i => i.id === result.draggableId);

        if (!item) return;

        reOrderItems(
            initialItems,
            result.source.index,
            result.destination.index,
        );

        onDrop && await onDrop(
            item,
            result.source.index,
            result.destination.index,
        );
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={id}>
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
                                        className={`w-full relative ${autoPos && "!left-auto !top-auto"}`}
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
