import { ICard } from "../../../../common/interfaces/ICard"
import CloseIcon from '../../../../common/icons/close_icon.svg';
import { useParams } from "react-router";
import api from '../../../../api/request';
import './Card.scss';

interface IFetch extends ICard {
    fetchData: () => any
}

export const Card: React.FC<IFetch> = ({ id, title, description, custom, fetchData }) => {

    const params = useParams();

    const RemoveCard = async () => {
        await api.delete('/board/' + params.board_id + '/card/' + id);
        fetchData();
    }

    return <div className="card" draggable={true} >
        <div className="cardTop">
            <div className="cardTitle">{title}</div>
            <div>
                <img className="deleteIcon" src={CloseIcon} style={{ height: 18, width: 18, cursor: 'pointer' }} alt="No img" onClick={RemoveCard} />
            </div>
        </div>
        <div className="cardDescription">{description}</div>
        <div className="CardDeadline"> <span className="ddln">Дедлайн:</span> {custom.deadline}</div>
    </div>
}