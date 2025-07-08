import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IBoard } from '../interfaces/IBoard';
import { toast } from 'react-toastify';
import api from '../../api/request';

interface HomeState {
    isNewBoardModalOpen: boolean;
    errorMessage: string;
    boards: IBoard[];
}

const initialState: HomeState = {
    isNewBoardModalOpen: false,
    errorMessage: '',
    boards: []
};

type PostBoardData = {
    name: string;
    color: string;
};

type RemoveBoardData = {
    id: string;
    title: string;
};

export const postBoard = createAsyncThunk(
    'modal/postBoard',
    async ({ name, color }: PostBoardData) => {
        try {
            await api.post('/board', {
                title: name,
                custom: {
                    background: color
                }
            });
            toast.success(`Дошку "${name}" успішно створено`);
        } catch (error) {
            console.log(error);
            toast.error("Не вдалося створити нову дошку");
        }
    }
);

export const fetchBoards = createAsyncThunk(
    'home/fetchBoards',
    async () => {
        const response = await api.get<IBoard[], { boards: IBoard[] }>('/board');
        return response.boards;
    }
);

export const removeBoard = createAsyncThunk(
    'home/removeBoard',
    async ({ id, title }: RemoveBoardData) => {
        try {
            await api.delete('/board/' + id);
            toast.success(`Дошку ${title} було видалено`);
        } catch (error) {
            console.error(error);
            toast.error(`Не вдалося видалити дошку ${title}`);
        }
    }
);

export const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        openNewBoardModal: (state) => {
            state.isNewBoardModalOpen = true;
        },
        closeNewBoardModal: (state) => {
            state.isNewBoardModalOpen = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBoards.fulfilled, (state, action) => {
            if (action.payload) state.boards = action.payload;
        });
        builder.addCase(fetchBoards.rejected, (state) => {
            state.errorMessage = 'Не вдалося завантажити дошки';
        });
    },
});

export const { openNewBoardModal, closeNewBoardModal } = homeSlice.actions;
export default homeSlice.reducer;