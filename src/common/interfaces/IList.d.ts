import { ICard } from "./ICard";

export interface IList {
    id: number,
    boardId: string | undefined,
    position: number,
    title: string,
    cards: ICard[],
    listsData: IList[]
}