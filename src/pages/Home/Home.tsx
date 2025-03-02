import { useEffect, useState } from 'react';
import './Home.scss';
import { Board } from '../Home/components/Board/Board';
import { IBoard } from '../../common/interfaces/IBoard';
import api from '../../api/request';

export const Home = () => {
    const [boards, setBoards] = useState<IBoard[]>([]);

    const fetchData = async () => {
        try {
            const response = await api.get<IBoard[], { boards: IBoard[] }>('/board');
            setBoards(response.boards);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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