import { useState } from 'react';
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { closeBackgroundModal, fetchBoardData, changeBackground } from '../../../store/boardSlice';

interface BoardNameChangeProps {
    bgColorToChange: string
}

export const BoardBackgroundChangeModal: React.FC<BoardNameChangeProps> = ({ bgColorToChange }) => {

    const params = useParams();
    const dispatch = useDispatch();
    const [backgroundColor, setBackgroundColor] = useState<string>(bgColorToChange);
    const [backgroundImage, setBackgroundImage] = useState<string>('');

    const getBase64 = (file: Blob) => {
        let reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
            reader.onload = async function () {
                setBackgroundImage(reader.result as string);
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        }
    }

    const postData = async () => {
        dispatch<any>(changeBackground({ id: String(params.board_id), bgColor: backgroundColor, bgImage: backgroundImage }))
            .then(() => dispatch<any>(fetchBoardData(String(params.board_id))));
        dispatch(closeBackgroundModal());
    }

    return <>
        <form className="modal-form">
            <label>Колір:</label>
            <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)} />
        </form>
        <div className="info">{"Ви можете завантажити на сайт картинку та використовувати її як фоновий малюнок. Не завантажуйте зображення занадто великого розміру або зображення з високою роздільною здатністю (сайт може не прийняти таку картинку)!"}</div>
        <form className="modal-form">
            <label>Зображення:</label>
            <input
                type="file"
                className="img-input"
                onChange={(event) => { if (event.target.files) getBase64(event.target.files[0]) }}
            />
        </form>
        <div className="buttons">
            <button onClick={() => postData()}>Змінити колір</button>
            <button onClick={() => dispatch(closeBackgroundModal())}>Закрити</button>
        </div>
    </>
}