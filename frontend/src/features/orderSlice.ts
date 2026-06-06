import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface OrderItem { productId: string; name: string; price: number; quantity: number; }
interface OrderState { tableId: string | null; tableName: string | null; items: OrderItem[]; }

const initialState: OrderState = { tableId: null, tableName: null, items: [] };

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setTable: (state, action: PayloadAction<{id: string, number: string}>) => { 
        state.tableId = action.payload.id; 
        state.tableName = action.payload.number;
        state.items = []; 
    },
    addItem: (state, action: PayloadAction<Omit<OrderItem, 'quantity'>>) => {
      const existing = state.items.find(i => i.productId === action.payload.productId);
      if (existing) existing.quantity += 1;
      else state.items.push({ ...action.payload, quantity: 1 });
    },
    increaseQuantity: (state, action: PayloadAction<string>) => {
        const item = state.items.find(i => i.productId === action.payload);
        if (item) item.quantity += 1;
    },
    decreaseQuantity: (state, action: PayloadAction<string>) => {
        const item = state.items.find(i => i.productId === action.payload);
        if (item && item.quantity > 1) item.quantity -= 1;
    },
    removeItem: (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(i => i.productId !== action.payload);
    },
    clearOrder: (state) => { state.items = []; state.tableId = null; state.tableName = null; }
  }
});

export const { setTable, addItem, increaseQuantity, decreaseQuantity, removeItem, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
