import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { IList } from '../../common/interfaces/IList';
import { ReactComponent as EditIcon } from '../../common/icons/edit_icon.svg';
import { ReactComponent as BGIcon } from '../../common/icons/background_icon.svg';
import { ReactComponent as ReturnIcon } from '../../common/icons/return_icon.svg';
import { List } from './components/List/List';
import { Modal } from '../../common/components/modals/Modal';
import { BoardNameChangeModal } from '../../common/components/modals/board/BoardNameChangeModal';
import { BoardBackgroundChangeModal } from '../../common/components/modals/board/BoardBackgroundChangeModal';
import { NewListModal } from '../../common/components/modals/board/NewListModal';
import { CardEditingModal } from '../../common/components/modals/board/CardEditingModal';
import { RootState } from '../../common/store/store';
import { removeBoard } from '../../common/store/homeSlice';
import { openListModal, openBoardNameModal, openBackgroundModal, fetchBoardData } from '../../common/store/boardSlice';
import { setSlots, setSingleSlots, updateCardModal } from '../../common/store/listSlice';
import { toast } from 'react-toastify';
import './Board.scss';

export const Board = () => {

    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const initialized = useRef(false);

    const { isEditModalOpen, cardData } = useSelector((state: RootState) => state.modal);
    const {
        isListModalOpen,
        isBoardNameModalOpen,
        isBackgroundModalOpen,
        isLoading,
        listsData,
        boardsData,
        errorMessage
    } = useSelector((state: RootState) => state.board);

    const serializedState = localStorage.getItem('state');
    const parsedSerializedState = serializedState ? JSON.parse(serializedState) : null;

    const [lists, setLists] = useState<IList[]>([]);
    const [boardData, setBoardData] = useState({
        title: "",
        backgroundColor: "#ffffff",
        backgroundImage: ""
    });

    const RemoveBoard = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch<any>(removeBoard({ id: String(params.board_id), title: boardData.title })).then(() => window.location.reload());
        navigate('/', { replace: true });
    };

    const createSlotPositions = (lists: IList[]) => {
        if (lists) {
            const arr = lists.reduce((accumulator: { [id: string]: boolean[] }, currentValue: IList) => {
                accumulator[currentValue.id] = currentValue.cards.map(() => false);
                return accumulator;
            }, {});
            dispatch(setSlots({ data: arr }));
        }
    }

    const createSingleSlots = (lists: IList[]) => {
        if (lists) {
            const singleArr = lists.reduce((accumulator: { [id: string]: boolean }, currentValue: IList) => {
                accumulator[currentValue.id] = false;
                return accumulator;
            }, {});
            dispatch(updateCardModal({ data: singleArr }));
            dispatch(setSingleSlots({ data: singleArr }));
        }
    }

    const setListsWithSlots = (lists: IList[]) => {
        setLists(lists);
        createSlotPositions(lists);
        createSingleSlots(lists);
    }

    useEffect(() => {
        dispatch<any>(fetchBoardData(String(params.board_id)));
    }, []);

    useEffect(() => {
        if (boardData.title) {
            if (!initialized.current) {
                initialized.current = true;
                toast.success(`Вітаємо на дошці ${boardData.title}`);
            }
        }
    }, [boardData]);

    useEffect(() => {
        if (errorMessage !== '') toast.error(errorMessage);
    }, [errorMessage]);

    useEffect(() => {
        if (boardsData !== null) {
            setBoardData({
                title: boardsData.title,
                backgroundColor: boardsData.custom.background,
                backgroundImage: boardsData.custom.backgroundImage !== undefined ? boardsData.custom.backgroundImage : ""
            });
            if (boardsData?.lists) setListsWithSlots([...boardsData.lists]);
        }
    }, [boardsData]);

    useEffect(() => {
        if (listsData) setListsWithSlots([...listsData]);
    }, [listsData]);

    const listComponents = lists.sort((a, b) => a.position - b.position).map((list) => <List
        key={list.id}
        id={list.id}
        boardId={params.board_id}
        position={list.position}
        title={list.title}
        cards={list.cards}
        listsData={lists} />);

    return <div className="board" style={{
        backgroundColor: boardData.backgroundColor,
        backgroundImage: boardData.backgroundImage !== "" ? `url(${boardData.backgroundImage})` : undefined,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    }}>
        <div className='header'>
            <button onClick={() => navigate(`/`)}><ReturnIcon /></button>
            <div className="title">{boardData.title + ' '}
                <button className="edit" onClick={() => dispatch(openBoardNameModal())}><EditIcon /></button>
                <button className="edit" onClick={() => dispatch(openBackgroundModal())}><BGIcon /></button>
            </div>
            <div className="buttons">
                <button onClick={() => dispatch(openListModal())}>Створити новий список</button>
                <button onClick={(e) => RemoveBoard(e)}>Видалити дошку</button>
            </div>

        </div>
        <div className="lists">
            {listComponents}
            {isLoading && <div className="loading">
                <span className="loader"></span>
            </div>}
        </div>

        <Modal isOpen={isBoardNameModalOpen}>
            <BoardNameChangeModal
                titleToChange={boardData.title} />
        </Modal>

        <Modal isOpen={isBackgroundModalOpen}>
            <BoardBackgroundChangeModal
                bgColorToChange={boardData.backgroundColor} />
        </Modal>

        <Modal isOpen={isListModalOpen}>
            <NewListModal
                numberOfLists={lists.length + 1} />
        </Modal>

        <Modal isOpen={isEditModalOpen || parsedSerializedState}>
            <CardEditingModal isEditModalOpen={isEditModalOpen} cardData={cardData} listsData={lists} />
        </Modal>
    </div>
}