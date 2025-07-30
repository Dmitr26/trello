import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { IList } from "../../../../common/interfaces/IList";
import { ICard } from '../../../../common/interfaces/ICard';
import { Card } from "../Card/Card";
import CloseIcon from '../../../../common/icons/close_icon.svg';
import { Modal } from '../../../../common/components/modals/Modal';
import { NewCardModal } from '../../../../common/components/modals/board/NewCardModal';
import DraggableElement from '../../../../common/components/drag-drop/DraggableElement/DraggableElement';
import DropContainer from '../../../../common/components/drag-drop/DropContainer/DropContainer';
import {
    DropHandler,
    DragStartHandler,
    DragEnterHandler,
    DragLeaveHandler
} from '../../../../common/components/drag-drop/DraggableElement/DraggableElementProps';
import { RootState } from '../../../../common/store/store';
import { startIsLoading, finishIsLoading, passListsData, fetchBoardData, clearBoardData } from '../../../../common/store/boardSlice';
import {
    openThisCardModal,
    setTopOrBottom,
    setSlots,
    setSingleSlots,
    removeList,
    postNewCard
} from '../../../../common/store/listSlice';
import classNames from 'classnames';
import './List.scss';

export const List: React.FC<IList> = ({
    id,
    boardId,
    position,
    title,
    cards,
    listsData
}) => {

    const dispatch = useDispatch();
    const { isCardModalOpen, topOrBottom, slots, singleSlots } = useSelector((state: RootState) => state.list);

    const [slotsToChange, setSlotsToChange] = useState<{ [id: string]: boolean[] }>(slots);
    const [dragStartSlot, setDragStartSlot] = useState(false);
    const [dragStartSlotPosition, setDragStartSlotPosition] = useState(0);
    const [slotToClose, setSlotToClose] = useState(0);

    const RemoveList = () => {

        let oldPosition = position;

        const updatedListPositions = listsData
            .filter((list) => list.id !== id)
            .map((list) => ({
                id: list.id,
                position: list.position > Number(oldPosition) ? list.position - 1 : list.position
            }));

        dispatch<any>(removeList({
            boardId: String(boardId),
            listId: id,
            listName: title,
            newPositions: updatedListPositions
        })).then(() => {
            dispatch<any>(fetchBoardData(String(boardId)));
        });
    }

    const defineOrder = (
        under: number | undefined,
        topOffset: boolean,
        cardsInList: number | undefined,
        topBottom: boolean
    ): number => {
        let num = 0;

        if (!under) {
            if (!cardsInList) {
                num = 1;
            } else {
                num = topBottom ? cardsInList + 1 : 1;
            }
        } else {
            num = topOffset ? under : under + 1;
        }

        return num;
    }

    const resetSlotsToFalse = (slotArray: boolean[]): boolean[] => {
        let resetSlots = [...slotArray];
        resetSlots.map((_, i: number) => {
            return resetSlots[i] = false;
        });
        return resetSlots;
    }

    const HandleDragStart: DragStartHandler = ({ thisid, position }) => {
        if (thisid) {
            setDragStartSlot(true);
            setDragStartSlotPosition(position);
        }
    }

    const HandleDragLeave: DragLeaveHandler = ({ thisid }) => {
        if (thisid === 0) {
            setDragStartSlot(false);
            setDragStartSlotPosition(0);
        }
    }

    const HandleDragEnter: DragEnterHandler = ({ thisid, order, topOrBottomSlot }) => {

        if (thisid) {
            if (slots[thisid]) {

                if (slots[thisid].length === 0) {
                    const newSingleSlots: { [id: string]: boolean } = { ...singleSlots };
                    newSingleSlots[thisid] = true;
                    dispatch(setSingleSlots({ data: newSingleSlots }));
                }

                setSlotToClose(Number(thisid));
                let slotToOpen = [...slotsToChange[thisid]];
                if (typeof slotToOpen != "undefined") {
                    slotToOpen.map((_, i: number) => {
                        return slotToOpen[i] = (i === (Number(order) - 1)) ? true : false;
                    });
                    dispatch(setSlots({ data: { ...slots, [thisid]: slotToOpen } }));
                    dispatch(setTopOrBottom({ data: topOrBottomSlot }));
                }
            }
        } else {

            Object.entries(singleSlots).map(([key]) => {
                if (singleSlots[key]) {
                    const singleSlotsFalse = { ...singleSlots, [key]: false };
                    dispatch(setSingleSlots({ data: singleSlotsFalse }));
                }
            })

            if (slotToClose !== 0) {
                let resetSlots = resetSlotsToFalse(slots[slotToClose]);
                dispatch(setSlots({ data: { ...slots, [slotToClose]: resetSlots } }));
                setSlotToClose(0);
            }
        }
    }

    const HandleCardPositionChange: DropHandler = async ({
        dropContainerId,
        dragItemId,
        dragltemOrder,
        itemUnderDragItem,
        numberOfCards,
        topOffset,
        topOrBottom
    }) => {

        if (id === dropContainerId) {
            let resetSlots = resetSlotsToFalse(slotsToChange[id]);
            setSlotsToChange({ ...slotsToChange, [id]: resetSlots });
            setDragStartSlot(false);
            setDragStartSlotPosition(0);
            return;
        }

        cards.map(async (card) => {

            if (card.id === dragItemId) {

                let newCard: ICard = {
                    id: dragItemId,
                    title: card.title,
                    listid: Number(dropContainerId),
                    position: defineOrder(itemUnderDragItem, topOffset, numberOfCards, topOrBottom),
                    description: card.description,
                    custom: {
                        deadline: card.custom.deadline
                    }
                }

                const listsDataParse = JSON.parse(JSON.stringify(listsData));

                const newListsData = listsDataParse.reduce((accumulator: IList[], currentValue: IList) => {
                    if (currentValue.id === id) {
                        const newCards = currentValue.cards.filter(card => card.id !== dragItemId);
                        currentValue.cards = newCards;
                        currentValue.cards.map((card) => {
                            card.position = card.position > Number(dragltemOrder) ? card.position - 1 : card.position;
                        });
                    }
                    if (currentValue.id === dropContainerId) {
                        currentValue.cards.map((card) => {
                            card.position = card.position >= newCard.position ? card.position + 1 : card.position;
                        });
                        currentValue.cards.push(newCard);
                    }
                    accumulator.push(currentValue);
                    return accumulator;
                }, []);

                dispatch(passListsData({ data: newListsData }));
                dispatch(startIsLoading());

                const updatedCardsList = cards
                    .filter((card) => card.id !== dragItemId)
                    .map((card) => ({
                        id: card.id,
                        position: card.position > Number(dragltemOrder) ? card.position - 1 : card.position,
                        list_id: id
                    }));

                dispatch<any>(postNewCard({
                    boardId: String(boardId), newCard: newCard, newPositions: updatedCardsList
                })).then(() => {
                    dispatch<any>(fetchBoardData(String(boardId)));
                    dispatch(finishIsLoading());
                });
            }
        });
        setSlotToClose(0);
    }

    useEffect(() => {
        setSlotsToChange(slots);
    }, [slots]);

    useEffect(() => {
        setDragStartSlot(false);
    }, [listsData]);

    const cardsComponents = cards.slice().sort((a, b) => a.position - b.position).map((card) => (
        <div className="card-with-slot" key={card.id}>
            <DraggableElement
                id={card.id}
                parentId={id}
                key={card.id}
                order={card.position}
                slots={slotsToChange}
                onDrop={HandleCardPositionChange}
                onDragStart={HandleDragStart}
                onDragLeave={HandleDragLeave}
                onDragEnter={HandleDragEnter} >
                {(props) => <div {...props} className={classNames('cardWrapper', props.className)}>
                    {Object.values(slotsToChange[id])[card.position - 1] && topOrBottom && <div className="slot"></div>}
                    <Card
                        key={card.id}
                        id={card.id}
                        listid={id}
                        position={card.position}
                        title={card.title}
                        description={card.description}
                        custom={card.custom}
                        cardData={card} />
                    {Object.values(slotsToChange[id])[card.position - 1] && !topOrBottom && <div className="slot"></div>}
                </div>}
            </DraggableElement>
            {dragStartSlot && (card.position === dragStartSlotPosition) && <div className="slot"></div>}
        </div>));

    return <div className="list">
        <div className="list-body">
            <div className="listTop">
                <div className="listTitle">{title}</div>
                <div>
                    <img
                        className="deleteIcon"
                        src={CloseIcon}
                        style={{ height: 22, width: 22, cursor: 'pointer' }}
                        alt="No img"
                        onClick={RemoveList} />
                </div>
            </div>

            <DropContainer id={id} key={id}>
                {(props) => (
                    <div {...props} className={classNames('listContent', props.className)}>
                        {singleSlots[id] && <div className="slot"></div>}
                        <div className="cardsArea">
                            {cardsComponents}
                        </div>
                    </div>
                )}
            </DropContainer>
            <button onClick={() => dispatch(openThisCardModal({ id: String(id) }))}>Додати картку...</button>
        </div>

        <Modal isOpen={isCardModalOpen[id]}>
            <NewCardModal
                id={boardId}
                numberOfCards={cards.length + 1}
                listid={id} />
        </Modal>
    </div>
}