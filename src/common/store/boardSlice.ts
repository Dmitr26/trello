import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IList } from '../interfaces/IList';
import { IBoard } from '../interfaces/IBoard';
import { toast } from 'react-toastify';
import api from '../../api/request';

interface BoardState {
    isListModalOpen: boolean;
    isBoardNameModalOpen: boolean;
    isBackgroundModalOpen: boolean;
    isLoading: boolean;
    errorMessage: string;
    boardsData: IBoard | null;
    listsData: IList[];
}

const initialState: BoardState = {
    isListModalOpen: false,
    isBoardNameModalOpen: false,
    isBackgroundModalOpen: false,
    isLoading: false,
    errorMessage: '',
    boardsData: null,
    listsData: []
};

type ChangeBackgroundData = {
    id: string;
    bgColor: string;
    bgImage: string;
};

type ChangeBoardNameData = {
    id: string;
    title: string;
};

type NewListData = {
    id: string;
    name: string;
    position: number;
};

export const fetchBoardData = createAsyncThunk(
    'board/fetchBoardData',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.get('/board/' + id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const changeBackground = createAsyncThunk(
    'board/changeBackground',
    async ({ id, bgColor, bgImage }: ChangeBackgroundData) => {
        try {
            await api.put('/board/' + id, {
                custom: {
                    background: bgColor,
                    backgroundImage: bgImage
                }
            });
            toast.success("Стиль дошки змінено");
        } catch (error) {
            console.error(error);
            toast.error("Стиль дошки не вдалося змінити");
        }
    }
);

export const changeBoardName = createAsyncThunk(
    'board/changeBoardName',
    async ({ id, title }: ChangeBoardNameData) => {
        try {
            await api.put('/board/' + id, {
                title: title
            });
            toast.success("Назву дошки змінено");
        } catch (error) {
            console.error(error);
            toast.error("Назву дошки не вдалося змінити");
        }
    }
);

export const createNewList = createAsyncThunk(
    'board/createNewList',
    async ({ id, name, position }: NewListData) => {
        try {
            await api.post('/board/' + id + '/list', {
                title: name,
                position: position
            });
            toast.success(`Список "${name}" успішно створено`);
        } catch (error) {
            console.error(error);
            toast.error("Не вдалося створити новий список");
        }
    }
);

export const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        openListModal: (state) => {
            state.isListModalOpen = true;
        },
        closeListModal: (state) => {
            state.isListModalOpen = false;
        },
        openBoardNameModal: (state) => {
            state.isBoardNameModalOpen = true;
        },
        closeBoardNameModal: (state) => {
            state.isBoardNameModalOpen = false;
        },
        openBackgroundModal: (state) => {
            state.isBackgroundModalOpen = true;
        },
        closeBackgroundModal: (state) => {
            state.isBackgroundModalOpen = false;
        },
        startIsLoading: (state) => {
            state.isLoading = true;
        },
        finishIsLoading: (state) => {
            state.isLoading = false;
        },
        clearBoardData: (state) => {
            state.boardsData = null;
        },
        clearListsData: (state) => {
            state.listsData = [];
        },
        passListsData: (state, action: PayloadAction<{
            data: IList[];
        }>) => {
            state.listsData = action.payload.data;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBoardData.fulfilled, (state, action) => {
            state.boardsData = action.payload;
        });
        builder.addCase(fetchBoardData.rejected, (state, action) => {
            state.errorMessage = 'Не вдалося завантажити цю дошку';
        });
    }
});

export const {
    openListModal,
    closeListModal,
    openBoardNameModal,
    closeBoardNameModal,
    openBackgroundModal,
    closeBackgroundModal,
    startIsLoading,
    finishIsLoading,
    clearBoardData,
    clearListsData,
    passListsData
} = boardSlice.actions;
export default boardSlice.reducer;