import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  photo: string[];
  description: string;
  sellerId: string;
};

export type CartItem = {
  _id: string;
  quantity: number;
  product: Product;
};

export type UserType = {
  _id: string;
  name: string;
  email: string;
  role: string;
  cart: CartItem[];
};

type UserSliceState = {
  user: UserType | null;
};

const initialState: UserSliceState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },

    clearUser: (state) => {
      state.user = null;
    },

    updateCart: (state, action: PayloadAction<CartItem[]>) => {
      if (state.user == null) return;
      state.user.cart = action.payload;
    },

    updateRole: (state, action: PayloadAction<string>) => {
      if (!state.user) return;
      state.user.role = action.payload;
    },
  },
});

export const { setUser, clearUser, updateCart, updateRole } = userSlice.actions;
export default userSlice.reducer;
