import { useState } from 'react';
import './Board.scss';
import { List } from './components/List/List';

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
    const [title, setTitle] = useState(boardData.title);
    const [lists, setLists] = useState(boardData.lists);

    const listComponents = lists.map((list) => <List key={list.id} title={list.title} cards={list.cards} />);

    return <div className="board">
        <div className='top'>
            <div className="title">{title}</div>
            <button>Створити новий список</button>
        </div>
        <div className="lists">
            {listComponents}
        </div>
    </div>
}