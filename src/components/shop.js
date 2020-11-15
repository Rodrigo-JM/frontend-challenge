import React, { Component } from "react";
import { connect } from "react-redux";
import { addItem, selectCategory } from "./../store";

export const Shop = (props) => {
  return (
    <div>
      <header className="header">
        <span>Shop 4 all things</span>
        <span onClick={() => props.selectScreen("checkout")}>Go to Carter</span>
      </header>

      <div>
        <select
          onChange={(e) => props.selectCategory(parseInt(e.target.value, 10))}
        >
          <option value={-1}>Filter by Category</option>
          {props.categories.map((category) => {
            return (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            );
          })}
        </select>
      </div>

      <div>
        <h3>Our Products</h3>
        {props.selectedCategory === -1
          ? props.items.map((item) => {
              return (
                <ItemCard
                  initializeClock={props.initializeClock}
                  addItem={props.addItem}
                  key={item.id}
                  item={item}
                  cart={props.cart}
                />
              );
            })
          : props.items
              .filter((i) => i.idCategory === props.selectedCategory)
              .map((item) => {
                return (
                  <ItemCard
                    initializeClock={props.initializeClock}
                    addItem={props.addItem}
                    key={item.id}
                    item={item}
                    cart={props.cart}
                  />
                );
              })}
      </div>
    </div>
  );
};

const ItemCard = (props) => {
  return (
    <div>
      <span>{props.item.name}</span>
      <span>{props.item.price}</span>
      {props.cart.find((item) => item.itemId === props.item.id) ? (
        <span>Item already added to cart!</span>
      ) : (
        <button
          onClick={function () {
            if (props.cart.length === 0) {// if the cart is empty, then we need to start the timer
              props.initializeClock();
              props.addItem(props.item.id);
            } else {
              props.addItem(props.item.id);
            }
          }}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  selectCategory: (categoryId) => dispatch(selectCategory(categoryId)),
  addItem: (itemId) => dispatch(addItem(itemId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Shop);
