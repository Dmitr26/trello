import { ICard } from "./ICard";

export interface IList {
    id: string,
    title: string;
    cards: ICard[];
}