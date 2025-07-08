import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBoard } from '../interfaces/IBoard';
import { ICard } from '../interfaces/ICard';
import { toast } from 'react-toastify';
import api from '../../api/request';

interface ListState {
    isCardModalOpen: { [id: string]: boolean };
    topOrBottom: boolean;
    slots: { [id: string]: boolean[] };
    singleSlots: { [id: string]: boolean };
    boardsData: IBoard | null;
}

const initialState: ListState = {
    isCardModalOpen: {},
    topOrBottom: false,
    slots: {},
    singleSlots: {},
    boardsData: null
};

type RemoveListData = {
    boardId: string;
    listId: number;
    listName: string;
    newPositions: { id: number; position: number }[];
};

type RemoveCardData = {
    boardId: string;
    cardId: number;
    newPositions: { id: number; position: number }[];
};

type CreatedCardData = {
    boardId: string;
    newCard: ICard;
};

type PostedCardData = {
    boardId: string;
    newCard: ICard;
    newPositions: { id: number; position: number, list_id: number }[];
};

export const createNewCard = createAsyncThunk(
    'list/postNewCard',
    async ({ boardId, newCard }: CreatedCardData) => {
        try {
            await api.post('/board/' + boardId + '/card', {
                title: newCard.title,
                list_id: newCard.listid,
                position: newCard.position,
                description: newCard.description,
                custom: {
                    deadline: newCard.custom.deadline
                }
            });
            toast.success(`Картку "${newCard.title}" успішно створено`);
        } catch (error) {
            console.error(error);
            toast.error("Не вдалося створити нову картку");
        }
    }
);

export const postNewCard = createAsyncThunk(
    'list/postNewCard',
    async ({ boardId, newCard, newPositions }: PostedCardData) => {
        try {
            await api.post('/board/' + boardId + '/card', {
                title: newCard.title,
                list_id: newCard.listid,
                position: newCard.position,
                description: newCard.description,
                custom: {
                    deadline: newCard.custom.deadline
                }
            }).then(async () => {
                await api.delete('/board/' + boardId + '/card/' + newCard.id);
            }).then(async () => {
                await api.put('/board/' + boardId + '/card', newPositions);
            });
        } catch (error) {
            console.error(error);
            toast.error("Виникли неполадки! Зміни можуть не зберегтися!");
        }
    }
);

export const removeList = createAsyncThunk(
    'list/removeList',
    async ({ boardId, listId, listName, newPositions }: RemoveListData) => {
        try {
            await api.delete('/board/' + boardId + '/list/' + listId).then(async () => {
                await api.put('/board/' + boardId + '/list', newPositions);
            });
            toast.success(`Список ${listName} було видалено`);
        } catch (error) {
            console.error(error);
            toast.error("Не вдалося видалити список!");
        }
    }
);

export const removeCard = createAsyncThunk(
    'list/removeCard',
    async ({ boardId, cardId, newPositions }: RemoveCardData) => {
        try {
            await api.delete('/board/' + boardId + '/card/' + cardId).then(async () => {
                await api.put('/board/' + boardId + '/card', newPositions);
            });
        } catch (error) {
            console.error(error);
            toast.error("Виникли неполадки! Зміни можуть не зберегтися!");
        }
    }
);

export const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
        updateCardModal: (state, action: PayloadAction<{
            data: { [id: string]: boolean }
        }>) => {
            state.isCardModalOpen = action.payload.data;
        },
        openThisCardModal: (state, action: PayloadAction<{
            id: string;
        }>) => {
            state.isCardModalOpen = { ...state.isCardModalOpen, [action.payload.id]: true };;
        },
        closeThisCardModal: (state, action: PayloadAction<{
            id: string;
        }>) => {
            state.isCardModalOpen = { ...state.isCardModalOpen, [action.payload.id]: false };;
        },
        setTopOrBottom: (state, action: PayloadAction<{
            data: boolean
        }>) => {
            state.topOrBottom = action.payload.data;
        },
        setSlots: (state, action: PayloadAction<{
            data: { [id: string]: boolean[] }
        }>) => {
            state.slots = action.payload.data;
        },
        setSingleSlots: (state, action: PayloadAction<{
            data: { [id: string]: boolean }
        }>) => {
            state.singleSlots = action.payload.data;
        }
    }
});

export const {
    updateCardModal,
    openThisCardModal,
    closeThisCardModal,
    setTopOrBottom,
    setSlots,
    setSingleSlots
} = listSlice.actions;
export default listSlice.reducer;