import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Board } from '../Home/components/Board/Board';
import { NoBoards } from './components/No-boards/NoBoards';
import { Modal } from '../../common/components/modals/Modal';
import { NewBoardModal } from '../../common/components/modals/home/NewBoardModal';
import { RootState } from '../../common/store/store';
import { openNewBoardModal, fetchBoards } from '../../common/store/homeSlice';
import { toast } from 'react-toastify';
import api from '../../api/request';
import './Home.scss';

export const Home = () => {

    const dispatch = useDispatch();
    const [isSpinner, setIsSpinner] = useState(true);
    const { isNewBoardModalOpen, boards, errorMessage } = useSelector((state: RootState) => state.home);

    useEffect(() => {
        dispatch<any>(fetchBoards());
        api.interceptors.request.use((config) => {
            setIsSpinner(true);
            return config;
        });
        api.interceptors.response.use((response) => {
            setIsSpinner(false);
            return response;
        });

    }, []);

    useEffect(() => {
        if (errorMessage !== '') toast.error(errorMessage);
    }, [errorMessage]);

    const boardComponents = boards.map((board) => <Board
        key={board.id}
        id={board.id}
        title={board.title}
        custom={board.custom} />);

    return <div className="home">
        <div className='header'>
            <div className="title">Мої завдання</div>
            <button onClick={() => dispatch(openNewBoardModal())}>Створити нову дошку завдання</button>
        </div>
        {isSpinner && <div className="loading">
            <span className="loader"></span>
        </div>}
        <div className="boards">
            {!isSpinner && boards.length !== 0 && boardComponents}
            {!isSpinner && boards.length === 0 && <NoBoards />}
        </div>

        <Modal isOpen={isNewBoardModalOpen}>
            <NewBoardModal />
        </Modal>
    </div >
}