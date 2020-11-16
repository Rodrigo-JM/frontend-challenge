import React, { Component } from "react";
import { connect } from "react-redux";
import { getItems, getCategories, createNewCart, clearTimer, startTimer } from "./store";
import Bouncer from "react-data-bouncer";
import { CSSTransition } from "react-transition-group";
import Shop from "./components/shop";
import Checkout from "./components/checkout";

export class App extends Component {
  constructor() {
    super();
    this.state = {
      screen: "shop",
    };

    this.selectScreen = this.selectScreen.bind(this);
    this.initializeClock = this.initializeClock.bind(this);
  }

  componentDidMount() {
    this.props.getCategories();
    this.props.getItems();
  }

  initializeClock() {
    const oldDate = new Date();
    const endtime = new Date(oldDate.getTime() + 1 * 60000);

    this.props.startTimer(endtime)

    function updateClock() {
      const t = this.getTimeRemaining(endtime);

      if (t.total <= 0) {
        clearInterval(timeinterval);
        this.props.createNewCart();
        this.props.clearTimer();
      }
    }

    updateClock = updateClock.bind(this)

    updateClock();
    const timeinterval = setInterval(updateClock, 1000);

    return timeinterval;
  }

  getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    
    return {
      total,
      minutes,
      seconds
    };
  }


  selectScreen(screen) {
    this.setState({ screen });
  }

  render() {
    return (
      <Bouncer>
        <div className="app">
          <CSSTransition
            in={this.state.screen === "shop"}
            timeout={500}
            classNames="menu-primary"
            unmountOnExit
          >
            {/*component for header with cart and product list and filter*/}
            <Shop selectScreen={this.selectScreen} initializeClock={this.initializeClock} />
          </CSSTransition>
          <CSSTransition
            in={this.state.screen === "checkout"}
            timeout={500}
            classNames="menu-secondary"
            unmountOnExit
          >
            {/*component for checkout page*/}
            <Checkout selectScreen={this.selectScreen} getTimeRemaining={this.getTimeRemaining}/>
          </CSSTransition>
        </div>
      </Bouncer>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  getItems: () => dispatch(getItems()),
  getCategories: () => dispatch(getCategories()),
  createNewCart: () => dispatch(createNewCart()),
  clearTimer: () => dispatch(clearTimer()),
  startTimer: (endTime) => dispatch(startTimer(endTime))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
