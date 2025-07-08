import { useState } from 'react';
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { SubmitHandler } from '../../../SubmitHandler';
import { WordPattern } from '../../../WordPattern';
import { closeListModal, fetchBoardData, createNewList } from '../../../store/boardSlice';

interface NewListModalProps {
    numberOfLists: number
}

export const NewListModal: React.FC<NewListModalProps> = ({ numberOfLists }) => {

    const params = useParams();
    const dispatch = useDispatch();
    const [warning, setWarning] = useState<string>('');
    const [listName, setListName] = useState<string>('');

    const closeModal = () => {
        setListName('');
        setWarning('');
        dispatch(closeListModal());
    }

    const postData = async () => {
        if (listName === '') {
            setWarning('Будь ласка, вкажіть назву для списка!');
            return;
        }

        if (!listName.match(WordPattern)) {
            setWarning('Ви можете використовувати цифри, літери, пробіли, тире, крапки та нижні підкреслення!');
            return;
        }

        dispatch<any>(createNewList({ id: String(params.board_id), name: listName, position: numberOfLists }))
            .then(() => dispatch<any>(fetchBoardData(String(params.board_id))));
        dispatch(closeListModal());
    }

    return <>
        <form className="modal-form" onSubmit={SubmitHandler}>
            <label>Назва:</label>
            <input type="text" value={listName} onChange={(e) => setListName(e.target.value)} />
        </form>
        <div className="warning">{warning}</div>
        <div className="buttons">
            <button onClick={() => postData()}>Створити список</button>
            <div className="btn-space"></div>
            <button onClick={() => closeModal()}>Закрити</button>
        </div>
    </>
}