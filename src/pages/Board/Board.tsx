import { useEffect, useState } from 'react';
import './Board.scss';
import { List } from './components/List/List';
import { useParams } from "react-router";
import { IBoard } from '../../common/interfaces/IBoard';
import { ReactComponent as EditIcon } from '../../common/edit_icon.svg';
import { Modal } from './components/Modal/Modal';
import api from '../../api/request';

// const boardData = {
//     title: "Моя тестова дошка",
//     lists: [
//         {
//             id: 1,
//             title: "Плани",
//             cards: [
//                 { id: 1, title: "помити кота" },
//                 { id: 2, title: "приготувати суп" },
//                 { id: 3, title: "сходити в магазин" }
//             ]
//         },
//         {
//             id: 2,
//             title: "В процесі",
//             cards: [
//                 { id: 4, title: "подивитися серіал" }
//             ]
//         },
//         {
//             id: 3,
//             title: "Зроблено",
//             cards: [
//                 { id: 5, title: "зробити домашку" },
//                 { id: 6, title: "погуляти з собакой" }
//             ]
//         }
//     ]
// }

export const Board = () => {

    const params = useParams();
    const [title, setTitle] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const response = await api.get<{ title: string }, IBoard>('/board/' + params.board_id);
            setTitle(response.title);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // const [lists, setLists] = useState(boardData.lists);

    // const listComponents = lists.map((list) => <List key={list.id} title={list.title} cards={list.cards} />);

    return <div className="board">
        <div className='header'>
            <div className="title">{title} <button className="edit-title" onClick={() => setIsModalOpen(true)}><EditIcon /></button></div>
            <button>Створити новий список</button>
        </div>
        <div className="lists">
            {/* {listComponents} */}
        </div>
        <Modal titleToChange={title} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} fetchDataAgain={() => fetchData()} />
    </div>
}