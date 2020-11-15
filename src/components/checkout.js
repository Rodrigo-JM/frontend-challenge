import React, { Component } from "react";
import { connect } from "react-redux";

export const Checkout = (props) => {
  return (
    <div>
      <div>
        <span onClick={() => props.selectScreen("shop")}>Go to Shop</span>
        <header className="header">
          <span>Shop 4 all things</span>
        </header>
      </div>
      <div>
        <h2> Checkout your order </h2>
        
      </div>
    </div>
  );
};

const TimerCard = () => {
    return (<p>Future timer</p>)
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
