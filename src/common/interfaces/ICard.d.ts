export interface ICard {
    id: number,
    listid: number,
    position: number,
    title: string,
    description: string,
    // onDragStart: (e: DragEvent<HTMLDivElement>) => void,
    custom: {
        deadline: string
    }
}