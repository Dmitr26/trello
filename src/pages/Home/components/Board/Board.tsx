import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { IBoard } from "../../../../common/interfaces/IBoard";
import CloseIcon from '../../../../common/icons/close_icon.svg';
import { removeBoard, fetchBoards } from '../../../../common/store/homeSlice';
import './Board.scss';

export const Board: React.FC<IBoard> = ({ id, title, custom }) => {

    const dispatch = useDispatch();

    const RemoveBoard = async (e: React.MouseEvent<HTMLImageElement>) => {
        e.preventDefault();
        dispatch<any>(removeBoard({ id: String(id), title: title })).then(() => dispatch<any>(fetchBoards()));
    };

    return <Link className="board-link" to={"/board/" + id} >
        <div className="task-board" style={{ backgroundColor: custom.background }}>
            {title}
            <div>
                <img
                    className="deleteIcon"
                    src={CloseIcon}
                    style={{ height: 22, width: 22, cursor: 'pointer' }}
                    alt="No img"
                    onClick={(e) => RemoveBoard(e)} />
            </div>
        </div>
    </Link>
}