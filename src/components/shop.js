import React, { Component } from "react";
import { connect } from "react-redux";
import { addItem, changePage, getItems, selectCategory } from "./../store";

export const Shop = (props) => {
  return (
    <div className="main">
      <header className="header">
        <span></span>
        <span className="logo">Shop4allthings</span>
        <span className="cart" onClick={() => props.selectScreen("checkout")}>
          <span>
            <img className="cart-icon" src="./cart.png" />
            {props.cart.length ? (
              <HoverList items={props.items} cart={props.cart} />
            ) : (
              ""
            )}
          </span>
          {props.cart.length ? (
            <span className="items-on-cart">
              {getCartTotalItems(props.cart)}
            </span>
          ) : (
            ""
          )}
        </span>
      </header>

      <div className="select-category">
        <select
          onChange={(e) =>
            parseInt(e.target.value, 10) === -1
              ? props.getItems()
              : props.selectCategory(parseInt(e.target.value, 10))
          }
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

      <div className="items-container">
        {props.items
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
          })
          .slice((props.page - 1) * 7, props.page * 7)}
        <Pagination
          page={props.page}
          totalPages={props.totalPages}
          items={props.items}
          changePage={props.changePage}
        />
      </div>
    </div>
  );
};

const HoverList = (props) => {
  return (
    <div className="hover-list">
      {props.cart.map((i) => {
        return (
          <div key={i.itemId}>
            <span>{i.itemName}</span> <span>qtd: {i.qt}</span>
          </div>
        );
      })}
    </div>
  );
};

const getItem = (itemId, items) => {
  return items.find((i) => i.id === itemId);
};

const ItemCard = (props) => {
  return (
    <div className="items-card">
      <span className="item-name">{props.item.name}</span>
      <span>
        {" "}
        {props.cart.find((item) => item.itemId === props.item.id)
          ? ``
          : `$${props.item.price.toFixed(2)}`}
      </span>
      {props.cart.find((item) => item.itemId === props.item.id) ? (
        <span>Item already added to cart!</span>
      ) : (
        <button
          onClick={function () {
            if (props.cart.length === 0) {
              // if the cart is empty, then we need to start the timer
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

export const Pagination = (props) => {
  return (
    <div className="pagination">
      <span>
        {(props.page - 1) * 7 + 1 <= props.items.length
          ? (props.page - 1) * 7 + 1
          : props.items.length}
        -
        {props.page * 7 <= props.items.length
          ? props.page * 7
          : props.items.length}{" "}
        of {props.items.length}
      </span>
      <div>
        <button
          disabled={props.page - 1 > 0 ? false : true}
          onClick={() => props.changePage(-1)}
        >
          <span>Back</span>
        </button>
        <button
          disabled={props.page + 1 <= props.totalPages ? false : true}
          onClick={() => props.changePage(1)}
        >
          <span>Forward</span>
        </button>
      </div>
    </div>
  );
};

const getCartTotalItems = (cart) => {
  return cart.reduce((accum, item) => {
    accum += 1 * item.qt;
    return accum;
  }, 0);
};

const mapStateToProps = (state) => ({
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  selectCategory: (categoryId) => dispatch(selectCategory(categoryId)),
  addItem: (itemId) => dispatch(addItem(itemId)),
  changePage: (direction) => dispatch(changePage(direction)),
  getItems: () => dispatch(getItems()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Shop);
