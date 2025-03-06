import { useState } from 'react';
import { submitHandler } from '../../../../common/SubmitHandler';
import api from '../../../../api/request';
import './Modal.scss';

interface ButtonProps {
    isOpen: boolean,
    onClose: () => any,
    fetchDataAgain: () => any
}

export const Modal: React.FC<ButtonProps> = ({ isOpen, onClose, fetchDataAgain }) => {

    const [boardName, setBoardName] = useState<string>('');
    const [boardColor, setBoardColor] = useState<string>('');
    const [warning, setWarning] = useState<string>('');

    const pattern = /^[a-zA-Zа-яА-Яії0-9\s_.-]*$/;

    const postData = async () => {

        if (boardName === '') {
            setWarning('Будь ласка, вкажіть назву для дошки!');
            return;
        }

        if (!boardName.match(pattern)) {
            setWarning('Ви можете використовувати цифри, літери, пробіли, тире, крапки та нижні підкреслення!');
            return;
        }

        if (boardColor === '') {
            setWarning('Будь ласка, вкажіть колip для дошки!');
            return;
        }

        try {
            const response = await api.post('/board', {
                // id: 0,
                title: boardName,
                custom: {
                    background: boardColor
                }
            });
            console.log(response);
            fetchDataAgain();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return <>
        {isOpen && (
            <div className="modal">
                <div className="modal-wrapper">
                    <div className="modal-content">
                        <form className="modal-form" onSubmit={submitHandler}>
                            <label>Ім'я:</label>
                            <input className="name-input" type="text" value={boardName} onChange={(e) => setBoardName(e.target.value)} />
                        </form>
                        <form className="modal-form">
                            <label>Колір:</label>
                            <input className="color-input" type="color" value={boardColor} onChange={(e) => setBoardColor(e.target.value)} />
                        </form>
                        <div className="warning">{warning}</div>
                        <div className="buttons">
                            <button onClick={() => postData()}>Створити дошку</button>
                            <button onClick={() => onClose()}>Закрити</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>
}