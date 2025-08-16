import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderHistory } from '../utils/types';

interface OrdersState {
  orders: OrderHistory[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<OrderHistory[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<OrderHistory>) => {
      state.orders.unshift(action.payload);
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: OrderHistory['status'] }>) => {
      const order = state.orders.find(o => o.orderId === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setOrders, addOrder, updateOrderStatus, setLoading, setError } = ordersSlice.actions;
export default ordersSlice.reducer;
