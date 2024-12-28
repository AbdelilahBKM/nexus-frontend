// rootReducer.ts
export interface RootState {
    auth: {
      isAuthenticated: boolean;
      acess_token: string;
      user_id: number;
    };
  }
  import { combineReducers } from '@reduxjs/toolkit';
  import authReducer from './authReducer';
  
  export const rootReducer = combineReducers({
    auth: authReducer,
  });
  
  export default rootReducer;
  