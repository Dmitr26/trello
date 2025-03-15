import { useState } from 'react';
import { SubmitHandler } from '../common/SubmitHandler';
import { WordPattern } from '../common/WordPattern';
import api from '../api/request';
import './Modal.scss';

interface NewBoardModalProps {
    onClose: () => any,
    fetchDataAgain: () => any
}

export const NewBoardModal: React.FC<NewBoardModalProps> = ({ onClose, fetchDataAgain }) => {

    const [boardName, setBoardName] = useState<string>('');
    const [boardColor, setBoardColor] = useState<string>('#0875b0');
    const [warning, setWarning] = useState<string>('');

    const closeModal = () => {
        setBoardName('');
        setWarning('');
        onClose();
    }

    const postData = async () => {

        if (boardName === '') {
            setWarning('Будь ласка, вкажіть назву для дошки!');
            return;
        }

        if (!boardName.match(WordPattern)) {
            setWarning('Ви можете використовувати цифри, літери, пробіли, тире, крапки та нижні підкреслення!');
            return;
        }

        try {
            const response = await api.post('/board', {
                title: boardName,
                custom: {
                    background: boardColor
                }
            });
            console.log(response);
            fetchDataAgain();
            closeModal();
        } catch (error) {
            console.error(error);
        }
    };

    return <>
        <form className="modal-form" onSubmit={SubmitHandler}>
            <label>Назва:</label>
            <input
                className="name-input"
                type="text"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)} />
        </form>
        <form className="modal-form">
            <label>Колір:</label>
            <input
                className="color-input"
                type="color"
                value={boardColor}
                onChange={(e) => setBoardColor(e.target.value)} />
        </form>
        <div className="warning">{warning}</div>
        <div className="buttons">
            <button onClick={() => postData()}>Створити дошку</button>
            <button onClick={() => closeModal()}>Закрити</button>
        </div>
    </>
}