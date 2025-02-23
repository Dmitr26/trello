import { ICard } from "../../../../common/interfaces/ICard"
import './Card.scss';

export const Card: React.FC<ICard> = ({ title }) => {
    return <div className="card">
        <div className="cardTitle">{title}</div>
    </div>
}