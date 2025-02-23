import { IList } from "../../../../common/interfaces/IList"
import { Card } from "../Card/Card";
import './List.scss';

export const List: React.FC<IList> = ({ title, cards }) => {

    const cardsComponents = cards.map((card) => <Card key={card.id} id={card.id} title={card.title} />);

    return <div className="list">
        <div className="list-body">
            <div className="listTitle">{title}</div>
            <div className="cardsArea">{cardsComponents}</div>
            <button>Додати картку...</button>
        </div>
    </div>
}