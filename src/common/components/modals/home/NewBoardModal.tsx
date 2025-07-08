import { useState } from 'react';
import { useDispatch } from "react-redux";
import { SubmitHandler } from '../../../SubmitHandler';
import { WordPattern } from '../../../WordPattern';
import { closeNewBoardModal, fetchBoards, postBoard } from '../../../store/homeSlice';

export const NewBoardModal: React.FC = () => {

    const dispatch = useDispatch();
    const [boardName, setBoardName] = useState<string>('');
    const [boardColor, setBoardColor] = useState<string>('#0875b0');
    const [warning, setWarning] = useState<string>('');

    const closeModal = () => {
        setBoardName('');
        setWarning('');
        dispatch(closeNewBoardModal());
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

        dispatch<any>(postBoard({ name: boardName, color: boardColor })).then(() => dispatch<any>(fetchBoards()));
        closeModal();
    };

    return <>
        <form className="modal-form" onSubmit={SubmitHandler}>
            <label>Назва:</label>
            <input
                type="text"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)} />
        </form>
        <form className="modal-form">
            <label>Колір:</label>
            <input
                type="color"
                value={boardColor}
                onChange={(e) => setBoardColor(e.target.value)} />
        </form>
        <div className="warning">{warning}</div>
        <div className="buttons">
            <button onClick={() => postData()}>Створити дошку</button>
            <div className="btn-space"></div>
            <button onClick={() => closeModal()}>Закрити</button>
        </div>
    </>
}