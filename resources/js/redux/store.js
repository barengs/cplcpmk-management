import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import masterDataReducer from './masterDataSlice';
import rpsBuilderReducer from './rpsBuilderSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        masterData: masterDataReducer,
        rpsBuilder: rpsBuilderReducer,
    },
});
