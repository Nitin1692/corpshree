import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CompanyState {
    companyid: string
}

const initialState: CompanyState = {
    companyid: ''
}

export const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        setCompanyId: (state, action: PayloadAction<string>) => {
            state.companyid = action.payload
        }
    },
})

export const {setCompanyId} = companySlice.actions;
export default companySlice.reducer;