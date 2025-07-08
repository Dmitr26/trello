import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { IList } from "../../../interfaces/IList";
import { ICard } from "../../../interfaces/ICard";
import { closeEditModal } from "../../../../common/store/modalSlice";
import { fetchBoardData } from '../../../store/boardSlice';
import { postNewCard } from "../../../store/listSlice";

interface NewCardModalProps {
    listsData: IList[],
    cardData: ICard | null,
    onClose: () => void
}

export const CardChangePositionModal: React.FC<NewCardModalProps> = ({ listsData, cardData, onClose }) => {

    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [newListId, setNewListId] = useState(0);
    const [positions, setPositions] = useState(0);
    const [newPosition, setNewPosition] = useState(0);
    const [positionNumbers, setPositionNumbers] = useState<number[]>([]);
    const [warning, setWarning] = useState<string>('');

    const closeChangePositionModal = () => {
        setWarning('');
        onClose();
    }

    const replaceCard = async () => {
        if (newListId !== 0 && newPosition !== 0) {

            let oldPosition = cardData?.position;
            let parentCardList: ICard[] = [];

            listsData.map((list) => {
                if (list.id === cardData?.listid) {
                    parentCardList = list.cards;
                }
            })

            const updatedCardsList = parentCardList
                .filter((card) => card.id !== cardData?.id)
                .map((card) => ({
                    id: card.id,
                    position: card.position > Number(oldPosition) ? card.position - 1 : card.position,
                    list_id: Number(cardData?.listid)
                }));

            dispatch<any>(postNewCard({
                boardId: String(cardData?.parentId), newCard: {
                    id: Number(cardData?.id),
                    title: String(cardData?.title),
                    listid: newListId,
                    position: newPosition,
                    description: String(cardData?.description),
                    custom: {
                        deadline: String(cardData?.custom.deadline)
                    }
                }, newPositions: updatedCardsList
            })).then(() => dispatch<any>(fetchBoardData(String(params.board_id))));
            setWarning('');
            onClose();
            dispatch(closeEditModal());
            navigate(`/board/${cardData?.parentId}`);
            localStorage.removeItem('state');
            localStorage.removeItem('data');
        } else {
            setWarning('Будь ласка, вкажіть назву дошки та позицію картки!');
        }
    }

    const findListId = (listName: string) => {
        listsData.map((list) => {
            if (list.title === listName) {
                setNewListId(list.id);
                setPositions(list.cards.length);
            }
        });
    }

    const listOptions = listsData.slice().sort((a, b) => a.position - b.position).map((list) => (
        <option key={list.title} value={list.title}>{list.title}</option>
    ));

    useEffect(() => {
        let nums = [];
        for (let i = 0; i < positions + 1; i++) nums.push(i);
        setPositionNumbers(nums);
    }, [positions]);

    return <>
        <div className="select-n-label">
            <label htmlFor="lists">Виберіть список:</label>
            <select name="lists" id="lists" className="select-form" onChange={(e) => findListId(e.target.value)}>
                <option key={0} value={0}>Списки</option>
                {listOptions}
            </select>
        </div>
        <div className="select-n-label">
            <label htmlFor="positions">Виберіть позицію картки:</label>
            <select name="positions" id="positions" className="select-form" onChange={(e) => setNewPosition(Number(e.target.value))}>
                <option key={0} value={0}>Позиції</option>
                {positionNumbers && positionNumbers.map((number) => (
                    <option key={number + 1} value={number + 1}>{number + 1}</option>
                ))}
            </select>
        </div>
        <div className="warning">{warning}</div>
        <div className="buttons">
            <button onClick={() => replaceCard()}>Перемістити</button>
            <div className="btn-space"></div>
            <button onClick={() => closeChangePositionModal()}>Закрити</button>
        </div>
    </>
}