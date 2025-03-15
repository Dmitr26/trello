import { useState } from 'react';
import { SubmitHandler } from '../common/SubmitHandler';
import { WordPattern } from '../common/WordPattern';
import api from '../api/request';

interface NewListModalProps {
    id: string,
    numberOfLists: number,
    onClose: () => any,
    fetchDataAgain: () => any
}

export const NewListModal: React.FC<NewListModalProps> = ({ id, numberOfLists, onClose, fetchDataAgain }) => {

    const [warning, setWarning] = useState<string>('');
    const [listName, setListName] = useState<string>('');

    const closeModal = () => {
        setListName('');
        setWarning('');
        onClose();
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

        try {
            const response = await api.post('/board/' + id + '/list', {
                title: listName,
                position: numberOfLists
            });
            console.log(response);
            fetchDataAgain();
            closeModal();
        } catch (error) {
            console.error(error);
        }
    }

    return <>
        <form className="modal-form" onSubmit={SubmitHandler}>
            <label>Назва:</label>
            <input className="name-input" type="text" value={listName} onChange={(e) => setListName(e.target.value)} />
        </form>
        <div className="warning">{warning}</div>
        <div className="buttons">
            <button onClick={() => postData()}>Створити список</button>
            <button onClick={() => closeModal()}>Закрити</button>
        </div>
    </>
}