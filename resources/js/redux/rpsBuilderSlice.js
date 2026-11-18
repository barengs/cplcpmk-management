import { createSlice } from '@reduxjs/toolkit';

const rpsBuilderSlice = createSlice({
    name: 'rpsBuilder',
    initialState: {
        step: 1,
        header: {},
        cpmkList: [],
        weeklyPlan: [],
        assessmentRubric: [],
    },
    reducers: {
        setStep: (state, action) => {
            state.step = action.payload;
        },
        updateHeader: (state, action) => {
            state.header = { ...state.header, ...action.payload };
        },
        updateWeeklyPlan: (state, action) => {
            state.weeklyPlan = action.payload;
        },
    },
});

export const { setStep, updateHeader, updateWeeklyPlan } = rpsBuilderSlice.actions;
export default rpsBuilderSlice.reducer;
