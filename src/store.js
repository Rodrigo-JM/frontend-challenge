import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import { itemsList, categoriesList } from "./db";

const GOT_CATEGORIES = "GOT_CATEGORIES";
const GOT_ITEMS = "GOT_ITEMS";
const SELECTED_CATEGORY = "SELECTED_CATEGORY";
const CREATED_NEW_CART = "CREATED_NEW_CART";
const ADDED_ITEM = "ADDED_ITEM";
const CHANGED_ITEM_QUANTITY = "CHANGED_ITEM_QUANTITY";
const STARTED_TIMER = "STARTED_TIMER";
const CLEAR_TIMER = "CLEAR_TIMER";
const CHANGE_PAGE = "CHANGE_PAGE";

export const changeItemQuantity = (itemId, operator) => {
  return {
    type: CHANGED_ITEM_QUANTITY,
    itemId,
    operator,
  };
};

export const selectCategory = (categoryId) => {
  let items = [...itemsList];
  return {
    type: SELECTED_CATEGORY,
    categoryId,
    items
  };
};

export const startTimer = (endTime) => {
  return {
    type: STARTED_TIMER,
    endTime,
  };
};

export const clearTimer = () => {
  return {
    type: CLEAR_TIMER,
  };
};

export const addItem = (itemId) => {
  return {
    type: ADDED_ITEM,
    itemId,
  };
};

export const createNewCart = () => {
  let cart = [];

  return {
    type: CREATED_NEW_CART,
    cart
  };
};

export const getCategories = () => {
  let categories = [...categoriesList];

  return {
    type: GOT_CATEGORIES,
    categories,
  };
};

export const changePage = (direction) => {
  return {
    type: CHANGE_PAGE,
    direction,
  };
};

export const getItems = () => {
  let items = [...itemsList];

  let totalPages =
    items.length % 7 > 0 ? Math.trunc(items.length / 7) + 1 : items.length / 7;

  return {
    type: GOT_ITEMS,
    items,
    totalPages,
    selectedCategory: -1
  };
};

const initialState = {
  items: [],
  categories: [],
  selectedCategory: -1,
  cart: [],
  page: 1,
  totalPages: 1,
  endTime: -1,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_ITEMS:
      return {
        ...state,
        items: action.items,
        totalPages: action.totalPages,
        selectedCategory: action.selectedCategory,
        page: 1
      };

    case GOT_CATEGORIES:
      return {
        ...state,
        categories: action.categories,
      };

    case SELECTED_CATEGORY:
      let filteredItems = [
        ...action.items.filter((i) =>
          action.categoryId === -1
            ? true
            : i.idCategory === action.categoryId
        ),
      ]

      let totalPages = filteredItems.length % 7 > 0 ? Math.trunc(filteredItems.length / 7) + 1 : filteredItems.length / 7;

      return {
        ...state,
        selectedCategory: action.categoryId,
        items: filteredItems,
        totalPages,
        page: 1
      };

    case CREATED_NEW_CART:
      return {
        ...state,
        cart: action.cart
      };

    case ADDED_ITEM:
      return {
        ...state,
        cart: [...state.cart, { itemId: action.itemId, qt: 1 }],
      };

    case CHANGE_PAGE:
      return {
        ...state,
        page: state.page + action.direction,
      };

    case CHANGED_ITEM_QUANTITY:
      return {
        ...state,
        cart: [
          ...state.cart.reduce((newCart, item) => {
            if (item.itemId === action.itemId) {
              if (action.operator === "decrease") {
                if (item.qt - 1 === 0) {
                  return newCart;
                } else {
                  newCart.push({ ...item, qt: item.qt - 1 });
                }
              } else {
                newCart.push({ ...item, qt: item.qt + 1 });
              }

              return newCart;
            } else {
              newCart.push(item);
              return newCart;
            }
          }, []),
        ],
      };

    case STARTED_TIMER:
      return {
        ...state,
        endTime: action.endTime,
      };
    case CLEAR_TIMER:
      return {
        ...state,
        endTime: -1,
      };
    default:
      return state;
  }
};

const store = createStore(
  appReducer,
  applyMiddleware(createLogger({ collapsed: true }))
);

export default store;
