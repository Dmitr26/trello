import { FC, useCallback, PointerEventHandler, useState, useRef, useEffect } from "react";
import Props from "./DraggableElementProps";
import './DraggableElement.scss';

const DraggableElement: FC<Props> = ({ id, parentId, order, slots, children, onDrop, onDragStart, onDragLeave, onDragEnter }) => {
    const childRef = useRef<HTMLElement>(null);
    const startPointerPosition = useRef<{ top: number, left: number }>(null);
    const [dragging, setDragging] = useState(false);

    let initTop = '';
    let initLeft = '';

    const handleDragStart = useCallback<PointerEventHandler<HTMLElement>>((event) => {

        if (!childRef.current) return;

        const childRect = childRef.current.getBoundingClientRect();
        startPointerPosition.current = {
            top: childRect.top - event.clientY,
            left: childRect.left - event.clientX
        }

        initTop = startPointerPosition.current.top + 'px';
        initLeft = startPointerPosition.current.left + 'px';

        if (document.elementFromPoint(event.clientX, event.clientY)?.classList.value !== 'deleteIcon') {
            onDragStart?.({
                thisid: Number(childRef.current.getAttribute("data-drag-item")),
                position: Number(childRef.current.getAttribute("data-item-order"))
            });
            setDragging(true);
        }

    }, [slots]);

    const HandleDragMove = useCallback((event: PointerEvent) => {

        if (!childRef.current || !startPointerPosition.current) return;

        const { top, left } = startPointerPosition.current;

        childRef.current.style.top = event.clientY + top + 'px';
        childRef.current.style.left = event.clientX + left + 'px';

        const deeperElementUnderItem = document.elementFromPoint(
            event.clientX,
            event.clientY
        );

        if (deeperElementUnderItem?.getAttribute("class") !== 'slot') {
            onDragLeave?.({ thisid: 0 });
        }

        const closestDropContainer = deeperElementUnderItem?.closest('[data-drop-container]');
        const closestDragElement = deeperElementUnderItem?.closest('[data-drag-item]');

        const ContainerId = closestDropContainer?.getAttribute('data-drop-container');
        const closestCard = closestDragElement?.getElementsByClassName('card')[0] as HTMLElement;
        const upOrDown = event.clientY < closestCard?.offsetTop + closestCard?.offsetHeight / 2;

        if (Number(ContainerId) !== parentId) {
            onDragEnter?.({
                thisid: Number(ContainerId),
                order: Number(closestDragElement?.getAttribute('data-item-order')),
                topOrBottomSlot: upOrDown
            });
        }

        if (!closestDropContainer) return;

    }, [slots]);

    const HandleDragEnd = useCallback((event: PointerEvent) => {

        if (!childRef.current || !startPointerPosition.current) return;

        const deeperElementUnderItem = document.elementFromPoint(
            event.clientX,
            event.clientY
        );

        const closestDropContainer = deeperElementUnderItem?.closest('[data-drop-container]');
        const closestDragElement = deeperElementUnderItem?.closest('[data-drag-item]');

        const cardUnderDraggableElement = closestDragElement?.getAttribute('data-item-order');
        const cardsInList = closestDropContainer?.getElementsByClassName("cardWrapper").length;
        const closestHTML = closestDragElement as HTMLElement;
        const upOrDown = event.clientY < closestHTML?.offsetTop + closestHTML?.offsetHeight / 2;
        const bottomOfList = event.clientY >= Number(closestDropContainer?.getElementsByClassName("cardsArea")[0].clientHeight);

        setDragging(false);

        if (!closestDropContainer) {
            childRef.current.style.top = initTop;
            childRef.current.style.left = initLeft;
            return;
        };

        const ContainerId = closestDropContainer.getAttribute('data-drop-container');

        onDrop?.({
            dragItemId: id,
            dropContainerId: Number(ContainerId),
            dragltemOrder: order,
            itemUnderDragItem: Number(cardUnderDraggableElement),
            numberOfCards: Number(cardsInList),
            topOffset: upOrDown,
            topOrBottom: bottomOfList
        });

    }, [onDrop, id, order]);

    useEffect(() => {
        const element = childRef?.current?.children[0] as HTMLElement;

        if (dragging) {
            window.addEventListener('pointermove', HandleDragMove);
            window.addEventListener('pointerup', HandleDragEnd);
            element.style.transform = 'rotate(5deg)';
        }

        return () => {
            window.removeEventListener('pointermove', HandleDragMove);
            window.removeEventListener('pointerup', HandleDragEnd);
            element.style.transform = 'none';
        }
    }, [dragging, HandleDragMove, HandleDragEnd]);

    return children({
        ref: childRef,
        onPointerDown: handleDragStart,
        className: dragging ? 'dragElement' : undefined,
        'data-drag-item': id,
        'data-item-order': String(order)
    });
}

export default DraggableElement;