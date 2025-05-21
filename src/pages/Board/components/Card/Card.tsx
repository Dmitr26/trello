import { useEffect, useState } from 'react';
import { ICard } from "../../../../common/interfaces/ICard"
import './Card.scss';

export const Card: React.FC<ICard> = ({ id, title, description, custom, listid }) => {

    // const [initialId, setInitialId] = useState(0);
    // const [initialListId, setInitialListId] = useState("");

    // function dragOverHandler(e: React.FormEvent<EventTarget>) {
    //     e.preventDefault();
    //     // setInitialId(id);
    //     // setInitialListId(listid);
    //     if ((e.target as Element).classList.contains('card')) {
    //         console.log("BAAAAAAAAARF!");
    //     }
    // }

    // function dragStartHandler(e: React.FormEvent<EventTarget>) {
    //     console.log(e);
    // }

    // function dropHandler(e: React.FormEvent<EventTarget>, listid: string, id: number) {
    //     e.preventDefault();
    //     console.log(initialId);
    //     console.log(initialListId);
    //     console.log(listid);
    //     console.log(id);
    // }

    // useEffect(() => {
    //     setInitialId(id);
    //     setInitialListId(listid);
    // }, []);

    return <div
        className="card"
        draggable={true}
    // onDragOver={(e: React.FormEvent<EventTarget>) => dragOverHandler(e)}
    // onDragStart={(e: React.FormEvent<EventTarget>) => dragStartHandler(e)}
    // onDrop={(e: React.FormEvent<EventTarget>) => dropHandler(e, listid, id)}
    >
        <div className="cardTitle">{title}</div>
        <div className="cardDescription">{description}</div>
        <div className="CardDeadline"> <span className="ddln">Дедлайн:</span> {custom.deadline}</div>
    </div>
}