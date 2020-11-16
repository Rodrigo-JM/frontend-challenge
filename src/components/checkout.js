import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { changeItemQuantity, createNewCart, getItems } from "../store";
import Modal from "react-modal";

const modalStyle = {
  content: {
    height: "55%",
    maxWidth: "600px",
    opacity: "100%",
    position: "absolute",
    margin: "auto",
    backgroundColor: "white",
    borderRadius: "10px",
    display: "grid",
    placeItems: "center",
  },
};

Modal.setAppElement(document.getElementById("root"));

export const Checkout = (props) => {
  let getItems = props.getItems;

  useEffect(() => {
    getItems();
  }, [getItems]);

  const [modalOpen, toggleModal] = useState(false);

  const [goingBack, goBack] = useState(false);

  const checkoutOrder = () => {
    toggleModal(false);

    props.createNewCart();

    goBack(true);

    setTimeout(() => {
      props.selectScreen("shop");
    }, 360);
  };

  const { getTimeRemaining } = props;

  return (
    props.selectedCategory === -1 && (
      <div className="main">
        <header className="header">
          <span onClick={() => props.selectScreen("shop")}>
            <img className="cart-icon" src="./back-arrow.png" />
          </span>
          <span>
            <span className="logo">Shop4allthings</span>
          </span>
          <span></span>
        </header>

        <Modal
          isOpen={modalOpen}
          style={modalStyle}
          transparent={true}
          onRequestClose={() => checkoutOrder()}
        >
          <div className="confirmation-modal">
            <img className="qtd-icon" src="./confirmation.png" />
            <h2>Thank you for you purchase</h2>
            <button onClick={() => checkoutOrder()}>Close</button>
          </div>
        </Modal>

        {goingBack ? (
          <div>
            <h2>Redirecting to store...</h2>
          </div>
        ) : (
          <div className="checkout-container">
            <h2> Checkout your order </h2>

            {props.cart.length ? (
              <div className="checkout-items">
                <TimerCard
                  endTime={props.endTime}
                  getTimeRemaining={getTimeRemaining}
                />
                <div className="checkout-items-list">
                  {props.cart.map((item) => {
                    return (
                      <CheckoutItemCard
                        items={props.items}
                        key={item.itemId}
                        item={item}
                        changeItemQuantity={props.changeItemQuantity}
                      />
                    );
                  })}
                </div>
                <div className="total">
                  <span>Total:</span>
                  <span>
                    R$ {calculateTotalCart(props.cart, props.items).toFixed(2)}
                  </span>
                </div>

                <button
                  className="checkout-btn"
                  onClick={() => toggleModal(true)}
                >
                  Checkout Order
                </button>
              </div>
            ) : (
              <div className="no-items">
                <h4>You don't have any items in your cart!</h4>
                <button onClick={() => props.selectScreen("shop")}>
                  Go back to the store
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    )
  );
};

const TimerCard = (props) => {
  let time = props.getTimeRemaining(props.endTime)

  const [minutes, setMinutes] = useState(time.minutes);

  const [seconds, setSeconds] = useState(time.seconds);

  useEffect(() => {
    let timer = setTimeout(() => {
      let { minutes, seconds } = props.getTimeRemaining(props.endTime);

      setMinutes(minutes);
      setSeconds(seconds);
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <p>
      {`00:${minutes < 10 ? "0" + minutes : minutes}:${
        seconds < 10 ? "0" + seconds : seconds
      }`}{" "}
      time remaining
    </p>
  );
};

const CheckoutItemCard = (props) => {
  const { name, price } = getItem(props.item.itemId, props.items);

  return (
    <div className="items-card">
      <div className="qtd-container">
        <span
          className="qtd-btn"
          onClick={() =>
            props.changeItemQuantity(props.item.itemId, "decrease")
          }
        >
          <img className="qtd-icon" src="./minus.png" />
        </span>
        <span>{props.item.qt}</span>
        <span
          className="qtd-btn"
          onClick={() =>
            props.changeItemQuantity(props.item.itemId, "increase")
          }
        >
          <img className="qtd-icon" src="./plus.png" />
        </span>
      </div>
      <span>{name}</span>
      <span>{`$${price.toFixed(2)}`}</span>
    </div>
  );
};

const getItem = (itemId, items) => {
  return items.find((i) => i.id === itemId);
};

const calculateTotalCart = (cart, items) => {
  return cart.reduce((accum, item) => {
    accum += getItem(item.itemId, items).price * item.qt;
    return accum;
  }, 0);
};

const mapStateToProps = (state) => ({
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  changeItemQuantity: (itemId, operator) =>
    dispatch(changeItemQuantity(itemId, operator)),
  createNewCart: () => dispatch(createNewCart()),
  getItems: () => dispatch(getItems()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
