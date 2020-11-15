import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import { itemsList, categoriesList } from "./db";
const GOT_CATEGORIES = "GOT_CATEGORIES";
const GOT_ITEMS = "GOT_ITEMS";
const SELECTED_CATEGORY = "SELECTED_CATEGORY";
const CREATED_NEW_CART = "CREATED_NEW_CART";
const ADDED_ITEM = "ADDED_ITEM";
const CHANGED_ITEM_QUANTITY = "CHANGED_ITEM_QUANTITY"

export const changeItemQuantity = (itemId, operator) => {
    return {
        type: CHANGED_ITEM_QUANTITY,
        itemId, 
        operator
    }
}

export const selectCategory = (categoryId) => {
  return {
    type: SELECTED_CATEGORY,
    categoryId,
  };
};

export const addItem = (itemId) => {
  return {
    type: ADDED_ITEM,
    itemId,
  };
};

export const createNewCart = () => {
  let cart = {
    items: [],
  };

  return {
    type: CREATED_NEW_CART,
    cart,
  };
};

export const getCategories = () => {
  let categories = [...categoriesList];

  return {
    type: GOT_CATEGORIES,
    categories,
  };
};

export const getItems = () => {
  let items = [...itemsList];

  let totalPages =
    items.length % 10 > 0 ? Math.trunc(items.length / 20) + 1 : items.length;
  return {
    type: GOT_ITEMS,
    items,
    totalPages,
  };
};

const initialState = {
  items: [],
  categories: [],
  selectedCategory: -1,
  cart: [],
  page: 0,
  totalPages: 0,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_ITEMS:
      return {
        ...state,
        items: action.items,
        totalPages: action.totalPages,
      };

    case GOT_CATEGORIES:
      return {
        ...state,
        categories: action.categories,
      };

    case SELECTED_CATEGORY:
      return {
        ...state,
        selectedCategory: action.categoryId,
      };

    case CREATED_NEW_CART:
      return {
        ...state,
        cart: action.cart,
      };

    case ADDED_ITEM:
        return {
            ...state,
            cart: [...state.cart, {itemId: action.itemId, qt: 1}]
        }  

    case CHANGED_ITEM_QUANTITY:
        return {
            ...state,
            cart: [...state.cart.reduce((newCart, item) => {
                if (item.itemId === action.itemId) {
                    if (action.operator === "decrease") {
                        if (item.qt - 1 === 0) {
                            return newCart
                        } else {
                            newCart.push({...item, qt: item.qt - 1})
                        }
                    } else {
                        newCart.push({...item, qt: item.qt + 1})
                    }

                    return newCart;
                } else {
                    newCart.push(item)
                    return newCart
                }
            }, [])]
        }
    default:
      return state;
  }
};

const store = createStore(
  appReducer,
  applyMiddleware(createLogger({ collapsed: true }))
);

export default store;
