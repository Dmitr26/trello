import { useEffect, useState } from 'react';
import { submitHandler } from '../../../../common/SubmitHandler';
import { useParams } from "react-router";
import api from '../../../../api/request';
import './Modal.scss';

interface ButtonProps {
    titleToChange: string,
    isOpen: boolean,
    onClose: () => any,
    fetchDataAgain: () => any
}

export const Modal: React.FC<ButtonProps> = ({ titleToChange, isOpen, onClose, fetchDataAgain }) => {

    const params = useParams();
    const [newTitle, setNewTitle] = useState<string>('');
    const [warning, setWarning] = useState<string>('');

    const saveData = async (value: string) => {
        setNewTitle(value);
    }

    const postData = async (data: string) => {
        if (data !== '') {
            try {
                const response = await api.put('/board/' + params.board_id, {
                    title: data
                });
                fetchDataAgain();
                onClose();
            } catch (error) {
                console.error(error);
            }
            setWarning('');
            onClose();
        } else {
            setWarning('Будь ласка, вкажіть назву для дошки!');
        }
    }

    const postDataByEnter = async (key: string) => {
        if (key === 'Enter') {
            postData(newTitle);
        }
    }

    const postDataOnBlur = async (e: string) => {
        postData(e);
    }

    useEffect(() => {
        if (newTitle === '') {
            setNewTitle(titleToChange);
        }
    }, [titleToChange]);

    return <>
        {isOpen && (
            <div className="modal">
                <div className="modal-wrapper">
                    <div className="modal-content">
                        <form className="edit-form" onSubmit={submitHandler}>
                            <input type="text" defaultValue={newTitle}
                                onChange={(e) => saveData(e.target.value)}
                                onKeyDown={(e) => postDataByEnter(e.key)}
                                onBlur={(e) => postDataOnBlur(e.target.value)}
                            />
                        </form>
                        <div className="warning">{warning}</div>
                    </div>
                </div>
            </div>
        )}
    </>
}