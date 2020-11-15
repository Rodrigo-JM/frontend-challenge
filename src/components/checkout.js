import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { changeItemQuantity, createNewCart } from "../store";
import Modal from "react-modal";

const modalStyle = {
  content: {
    width: "560px",
    height: "fit-content",
    opacity: "100%",
    position: "absolute",
    backgroundColor: "#353535",
    borderRadius: "10px",
  },
};

Modal.setAppElement(document.getElementById("root"));

export const Checkout = (props) => {
  const [modalOpen, toggleModal] = useState(false);

  const [goingBack, goBack] = useState(false);

  const checkoutOrder = () => {
    toggleModal(false);

    props.createNewCart();

    goBack(true)

    setTimeout(() => {
      props.selectScreen("shop");
    }, 360);
  };

  const {getTimeRemaining} = props

  return (
    <div>
      <div>
        <span onClick={() => props.selectScreen("shop")}>Go to Shop</span>
        <header className="header">
          <span>Shop 4 all things</span>
        </header>
      </div>

      <Modal
        isOpen={modalOpen}
        style={modalStyle}
        transparent={true}
        onRequestClose={() => checkoutOrder()}
      >
        <div>
          <h2>Thank you for you purchase</h2>
          <button onClick={() => checkoutOrder()}>Close</button>
        </div>
      </Modal>

      {goingBack ? (
        <div>
          <h2>Redirecting to store...</h2>
        </div>
      ) : (
        <div>
          <h2> Checkout your order </h2>

          {props.cart.length ? (
            <div>
              <TimerCard endTime={props.endTime} getTimeRemaining={getTimeRemaining}/>
              <div>
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
                <div>
                  <span>Total</span>
                  <span>
                    R$ {calculateTotalCart(props.cart, props.items).toFixed(2)}
                  </span>
                </div>
              </div>

              <button onClick={() => toggleModal(true)}>Checkout Order</button>
            </div>
          ) : (
            <div>
              <h4>You don't have any items in your cart!</h4>
              <button onClick={() => props.selectScreen("shop")}>
                Go back to the store
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TimerCard = (props) => {
    const [minutes, setMinutes] = useState(0)

    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        let timer = setTimeout(() => {
            let {minutes,seconds} = props.getTimeRemaining(props.endTime);

            setMinutes(minutes);
            setSeconds(seconds);
        }, 1000)
        return () => clearTimeout(timer)
      })
    
    return <p>{`00:${minutes}:${seconds}`} time remaining</p>;
};

const CheckoutItemCard = (props) => {
  const { name } = getItem(props.item.itemId, props.items);

  return (
    <div>
      <div>
        <span
          onClick={() =>
            props.changeItemQuantity(props.item.itemId, "decrease")
          }
        >
          ------------
        </span>
        <span>{props.item.qt}</span>
        <span
          onClick={() =>
            props.changeItemQuantity(props.item.itemId, "increase")
          }
        >
          ++++++++++++
        </span>
      </div>
      <span>{name}</span>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
