import { useState } from 'react';
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { SubmitHandler } from '../../../SubmitHandler';
import { WordPattern } from '../../../WordPattern';
import { closeBoardNameModal, fetchBoardData, changeBoardName } from '../../../store/boardSlice';

interface BoardNameChangeProps {
    titleToChange: string
}

export const BoardNameChangeModal: React.FC<BoardNameChangeProps> = ({ titleToChange }) => {

    const params = useParams();
    const dispatch = useDispatch();
    const [newTitle, setNewTitle] = useState<string>(titleToChange);
    const [warning, setWarning] = useState<string>('');

    const saveData = async (value: string) => {
        setNewTitle(value);
    }

    const postData = async (data: string) => {

        if (!data.match(WordPattern)) {
            setWarning('Ви можете використовувати цифри, літери, пробіли, тире, крапки та нижні підкреслення!');
            return;
        }

        if (data !== '') {
            dispatch<any>(changeBoardName({ id: String(params.board_id), title: data }))
                .then(() => dispatch<any>(fetchBoardData(String(params.board_id))));
            setWarning('');
            dispatch(closeBoardNameModal());
        } else {
            setWarning('Будь ласка, вкажіть назву для дошки!');
        }
    }

    const postDataByEnter = async (key: string) => {
        if (key === 'Enter') postData(newTitle);
    }

    const postDataOnBlur = async (e: string) => {
        postData(e);
    }

    return <>
        <form className="edit-form" onSubmit={SubmitHandler}>
            <input type="text" defaultValue={newTitle}
                onChange={(e) => saveData(e.target.value)}
                onKeyDown={(e) => postDataByEnter(e.key)}
                onBlur={(e) => postDataOnBlur(e.target.value)}
            />
        </form>
        <div className="warning-top">{warning}</div>
    </>
}