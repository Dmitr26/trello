import { useState } from 'react';
import './Board.scss';

const boardData = {
    title: "Моя тестова дошка",
    lists: [
        {
            id: 1,
            title: "Плани",
            cards: [
                { id: 1, title: "помити кота" },
                { id: 2, title: "приготувати суп" },
                { id: 3, title: "сходити в магазин" }
            ]
        },
        {
            id: 2,
            title: "В процесі",
            cards: [
                { id: 4, title: "подивитися серіал" }
            ]
        },
        {
            id: 3,
            title: "Зроблено",
            cards: [
                { id: 5, title: "зробити домашку" },
                { id: 6, title: "погуляти з собакой" }
            ]
        }
    ]
}

export const Board = () => {
    const [title, setTutle] = useState(boardData.title);
    const [lists, setLists] = useState(boardData.lists);

    return <div className="board">{title}</div>
}