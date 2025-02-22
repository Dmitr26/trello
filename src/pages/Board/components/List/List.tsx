import { IList } from "../../../../common/interfaces/IList"
import './List.scss';

export const List: React.FC<IList> = ({ title, cards }) => {
    return <div className="list">
        <div className="list-body">
            <div className="listTitle">{title}</div>
            <div className="cards">Bla-bla-bla</div>
        </div>
    </div>
}