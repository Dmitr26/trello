import { ICard } from "../../../../common/interfaces/ICard"
import './Card.scss';

export const Card: React.FC<ICard> = ({ title, description, custom }) => {
    return <div className="card">
        <div className="cardTitle">{title}</div>
        <div className="cardDescription">{description}</div>
        <div className="CardDeadline"> <span className="ddln">Дедлайн:</span> {custom.deadline}</div>
    </div>
}