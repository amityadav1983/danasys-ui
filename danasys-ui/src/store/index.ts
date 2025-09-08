import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart'
import modalReducer from './modal'
import uiReducer from './ui'
import ordersReducer from './orders'
import modeReducer from './mode'

const store = configureStore({
  reducer: {
    ui: uiReducer,
    cart: cartReducer,
    modal: modalReducer,
    orders: ordersReducer,
    mode: modeReducer
  }
})

store.subscribe(() => {
  const state = store.getState();
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentMode', state.mode.currentMode);
  }
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
