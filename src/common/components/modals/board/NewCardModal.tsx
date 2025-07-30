import { useId, useState } from 'react';
import { useDispatch } from "react-redux";
import { SubmitHandler } from '../../../SubmitHandler';
import { WordPattern } from '../../../patterns/WordPattern';
import { fetchBoardData } from '../../../store/boardSlice';
import { closeThisCardModal, createNewCard } from '../../../store/listSlice';

interface NewCardModalProps {
    id: string | undefined,
    listid: number,
    numberOfCards: number
}

export const NewCardModal: React.FC<NewCardModalProps> = ({ id, listid, numberOfCards }) => {

    const dispatch = useDispatch();
    const postTextAreaId = useId();
    const [warning, setWarning] = useState<string>('');
    const [cardName, setCardName] = useState<string>('');
    const [cardDescription, setCardDescription] = useState<string>('');
    const [cardDeadline, setCardDeadline] = useState<string>('');

    const closeModal = () => {
        setCardName('');
        setCardDescription('');
        setCardDeadline('');
        setWarning('');
        dispatch(closeThisCardModal({ id: String(listid) }));
    }

    const postData = async () => {
        if (cardName === '') {
            setWarning('Будь ласка, вкажіть назву для картки!');
            return;
        }

        if (!cardName.match(WordPattern)) {
            setWarning('Ви можете використовувати цифри, літери, пробіли, тире, крапки та нижні підкреслення!');
            return;
        }

        if (cardDescription === '') {
            setWarning('Будь ласка, додайте опис для картки!');
            return;
        }

        if (cardDeadline === '') {
            setWarning('Будь ласка, вкажіть дедлайн для картки!');
            return;
        }

        dispatch<any>(createNewCard({
            boardId: String(id), newCard: {
                id: 0,
                title: cardName,
                listid: listid,
                position: numberOfCards,
                description: cardDescription,
                custom: {
                    deadline: cardDeadline.replace(/T/g, ' ')
                }
            }
        })).then(() => dispatch<any>(fetchBoardData(String(id))));
        closeModal();
    }

    return <>
        <form className="modal-form" onSubmit={SubmitHandler}>
            <label>Назва:</label>
            <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} />
        </form>
        <div className="label-margin"><label className="description-label" htmlFor={postTextAreaId}>Опис:</label></div>
        <textarea
            id={postTextAreaId}
            className="description-field"
            value={cardDescription}
            onChange={(e) => setCardDescription(e.target.value)} />
        <form className="modal-form" onSubmit={SubmitHandler}>
            <label>Дедлайн:</label>
            <input
                type="datetime-local"
                value={cardDeadline}
                onChange={(e) => setCardDeadline(e.target.value)} />
        </form>
        <div className="warning">{warning}</div>
        <div className="buttons">
            <button onClick={() => postData()}>Створити картку</button>
            <div className="btn-space"></div>
            <button onClick={() => closeModal()}>Закрити</button>
        </div>
    </>
}