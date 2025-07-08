import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICard } from '../interfaces/ICard';
import { IBoard } from '../interfaces/IBoard';
import { toast } from 'react-toastify';
import api from '../../api/request';

interface ModalState {
    isEditModalOpen: boolean;
    cardData: ICard | null;
    boardsData: IBoard | null;
}

const initialState: ModalState = {
    isEditModalOpen: false,
    cardData: null,
    boardsData: null
};

type CreatedCardData = {
    boardId: string;
    cardId: number;
    cardData: {
        title: string,
        description: string,
        custom: {
            deadline: string
        },
        list_id: number
    }
};

export const updateCard = createAsyncThunk(
    'list/removeList',
    async ({ boardId, cardId, cardData }: CreatedCardData) => {
        try {
            await api.put('/board/' + boardId + '/card/' + cardId, {
                title: cardData.title,
                description: cardData.description,
                custom: {
                    deadline: cardData.custom.deadline
                },
                list_id: cardData.list_id
            });
        } catch (error) {
            console.error(error);
            toast.error("Виникли неполадки! Зміни можуть не зберегтися!");
        }
    }
);

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openEditModal: (state, action: PayloadAction<{
            cardData: ICard
        }>) => {
            state.isEditModalOpen = true;
            state.cardData = action.payload.cardData;
        },
        closeEditModal: (state) => {
            state.isEditModalOpen = false;
            state.cardData = null;
        },
    }
});

export const { openEditModal, closeEditModal } = modalSlice.actions;
export default modalSlice.reducer;