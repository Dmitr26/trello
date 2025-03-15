import { NewBoardModal } from './NewBoardModal';
import { BoardNameChangeModal } from './BoardNameChangeModal';
import { BoardBackgroundChangeModal } from './BoardBackgroundChangeModal';
import { NewListModal } from './NewListModal';
import { NewCardModal } from './NewCardModal';
import './Modal.scss';

interface ModalProps {
    content: string,
    isOpen: boolean,
    onClose: () => any,
    fetchDataAgain: () => any,
    titleToChange?: string,
    bgColorToChange?: string,
    id?: string,
    numberOfLists?: number,
    numberOfCards?: number,
    listid?: string
}

export const Modal: React.FC<ModalProps> = ({
    content,
    isOpen,
    onClose,
    fetchDataAgain,
    titleToChange,
    bgColorToChange,
    id,
    numberOfLists,
    listid,
    numberOfCards }) => {
    return <>
        {isOpen && (
            <div className="modal">
                <div className="modal-wrapper">
                    <div className="modal-content">

                        {content === "NewBoard" && <NewBoardModal
                            onClose={onClose}
                            fetchDataAgain={fetchDataAgain} />}

                        {content === "BoardNameChange" && titleToChange && <BoardNameChangeModal
                            titleToChange={titleToChange}
                            onClose={onClose}
                            fetchDataAgain={fetchDataAgain} />}

                        {content === "BoardBackgroundChange" && bgColorToChange && <BoardBackgroundChangeModal
                            bgColorToChange={bgColorToChange}
                            onClose={onClose}
                            fetchDataAgain={fetchDataAgain} />}

                        {content === "NewList" && id && numberOfLists && <NewListModal
                            id={id}
                            numberOfLists={numberOfLists}
                            onClose={onClose}
                            fetchDataAgain={fetchDataAgain} />}

                        {content === "NewCard" && id && listid && numberOfCards && <NewCardModal
                            id={id}
                            listid={listid}
                            numberOfCards={numberOfCards}
                            onClose={onClose}
                            fetchDataAgain={fetchDataAgain} />}

                    </div>
                </div>
            </div>
        )}
    </>
}