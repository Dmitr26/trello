import { useState } from 'react';
import { IList } from "../../../../common/interfaces/IList";
import { Card } from "../Card/Card";
import { Modal } from '../../../../modals/Modal';
import { useParams } from "react-router";
import './List.scss';

interface IFetch extends IList {
    fetchData: () => any
}

export const List: React.FC<IFetch> = ({ id, title, cards, fetchData }) => {

    const params = useParams();
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);

    const cardsComponents = cards.map((card) => <Card
        key={card.id}
        id={card.id}
        title={card.title}
        description={card.description}
        custom={card.custom} />);

    return <div className="list">
        <div className="list-body">
            <div className="listTitle">{title}</div>
            <div className="cardsArea">{cardsComponents}</div>
            <button onClick={() => setIsCardModalOpen(true)}>Додати картку...</button>
        </div>

        <Modal
            content={"NewCard"}
            id={params.board_id}
            numberOfCards={cards.length + 1}
            listid={id}
            isOpen={isCardModalOpen}
            onClose={() => setIsCardModalOpen(false)}
            fetchDataAgain={() => fetchData()} />
    </div>
}