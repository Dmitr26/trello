import { useState } from 'react';
import './Home.scss';
import { Board } from '../Home/components/Board/Board';

const boardArray = [
    { id: 1, title: "покупки", custom: { background: "red" } },
    { id: 2, title: "підготовка до весілля", custom: { background: "green" } },
    { id: 3, title: "розробка інтернет-магазину", custom: { background: "blue" } },
    { id: 4, title: "курс по просуванню у соцмережах", custom: { background: "grey" } }
]

export const Home = () => {
    const [boards, setBoards] = useState(boardArray);

    const boardComponents = boards.map((board) => <Board key={board.id} id={board.id} title={board.title} custom={board.custom} />);

    return <div className="home">
        <div className='header'>
            <div className="title">Мої завдання</div>
            <button>Створити нову дошку завдання</button>
        </div>
        <div className="empty-block"></div>
        <div className="boards">{boardComponents}</div>
    </div>
}