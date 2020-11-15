import React, { Component } from "react";
import { connect } from "react-redux";
import { getItems, getCategories } from "./store";
import Bouncer from "react-data-bouncer";
import { CSSTransition } from "react-transition-group";
import Shop from "./components/shop";
import { Checkout } from "./components/checkout";

export class App extends Component {
  constructor() {
    super();
    this.state = {
      screen: "shop",
    };

    this.selectScreen = this.selectScreen.bind(this);
  }

  componentDidMount() {
    this.props.getCategories();
    this.props.getItems();
  }

  selectScreen(screen) {
    this.setState({ screen });
  }

  render() {
    return (
      <Bouncer>
        <div className="App">
          <CSSTransition
            in={this.state.screen === "shop"}
            timeout={500}
            classNames="menu-primary"
            unmountOnExit
          >
            {/*component for header with cart and product list and filter*/}
            <Shop selectScreen={this.selectScreen} />
          </CSSTransition>
          <CSSTransition
            in={this.state.screen === "checkout"}
            timeout={500}
            classNames="menu-secondary"
            unmountOnExit
          >
              {/*component for checkout page*/}
            <Checkout selectScreen={this.selectScreen}/>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
