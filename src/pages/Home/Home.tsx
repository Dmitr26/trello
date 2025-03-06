import { useEffect, useState } from 'react';
import './Home.scss';
import { Board } from '../Home/components/Board/Board';
import { IBoard } from '../../common/interfaces/IBoard';
import { Modal } from './components/Modal/Modal';
import api from '../../api/request';

export const Home = () => {
    const [boards, setBoards] = useState<IBoard[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const response = await api.get<IBoard[], { boards: IBoard[] }>('/board');
            setBoards(response.boards);

            // This is a temporary structure that I am using for now to remove the boards.

            // for (let el of response.boards) {
            //     const del = await api.delete('board/' + el.id);
            // }

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
            <button onClick={() => setIsModalOpen(true)}>Створити нову дошку завдання</button>
        </div>
        <div className="empty-block"></div>
        <div className="boards">{boardComponents}</div>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} fetchDataAgain={() => fetchData()} />
    </div>
}