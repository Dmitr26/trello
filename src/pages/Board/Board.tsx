import { useEffect, useState } from 'react';
import { IBoard } from '../../common/interfaces/IBoard';
import { IList } from '../../common/interfaces/IList';
import { ReactComponent as EditIcon } from '../../common/edit_icon.svg';
import { ReactComponent as BGIcon } from '../../common/background_icon.svg';
import { List } from './components/List/List';
import { Modal } from '../../modals/Modal';
import { useParams } from "react-router";
import { toast } from 'react-toastify';
import api from '../../api/request';
import './Board.scss';

export const Board = () => {

    const params = useParams();
    const [title, setTitle] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
    const [backgroundImage, setBackgroundImage] = useState<string>("");
    const [lists, setLists] = useState<IList[]>([]);

    const fetchData = async () => {
        try {
            const response = await api.get<{ title: string, lists: IList[] }, IBoard>('/board/' + params.board_id);
            setTitle(response.title);
            setBackgroundColor(response.custom.background);
            if (typeof response.custom.backgroundImage !== 'undefined') {
                setBackgroundImage(response.custom.backgroundImage);
            }
            if (typeof response.lists !== 'undefined') {
                setLists(response.lists);
            }
            toast.success(`Вітаємо на дошці ${response.title}`);

            // This is a temporary structure that I am using for now to remove lists and cards.

            // const del = await api.delete('/board/' + params.board_id + '/list/' + 1741613586492);
            // const del = await api.delete('/board/' + params.board_id + '/card/' + 1741613909574);

        } catch (error) {
            console.error(error);
            toast.error("Не вдалося завантажити цю дошку");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const listComponents = lists.map((list) => <List
        key={list.id}
        id={list.id}
        title={list.title}
        cards={list.cards}
        fetchData={() => fetchData()} />);

    return <div className="board" style={{
        backgroundColor: backgroundColor,
        backgroundImage: backgroundImage !== "" ? `url(${backgroundImage})` : undefined,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    }}>
        <div className='header'>
            <div className="title">{title + ' '}
                <button className="edit" onClick={() => setIsModalOpen(true)}><EditIcon /></button>
                <button className="edit" onClick={() => setIsBackgroundModalOpen(true)}><BGIcon /></button>
            </div>
            <button onClick={() => setIsListModalOpen(true)}>Створити новий список</button>
        </div>
        <div className="lists">
            {listComponents}
        </div>
        <Modal
            content={"BoardNameChange"}
            titleToChange={title}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            fetchDataAgain={() => fetchData()} />

        <Modal
            content={"BoardBackgroundChange"}
            bgColorToChange={backgroundColor}
            isOpen={isBackgroundModalOpen}
            onClose={() => setIsBackgroundModalOpen(false)}
            fetchDataAgain={() => fetchData()} />

        <Modal
            content={"NewList"}
            id={params.board_id}
            numberOfLists={lists.length + 1}
            isOpen={isListModalOpen}
            onClose={() => setIsListModalOpen(false)}
            fetchDataAgain={() => fetchData()} />
    </div>
}