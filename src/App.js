import React, {Component} from "react";
import Stock from "./Stock";
import History from "./History";
import Landing from "./Landing";
import { BrowserRouter, Switch, Route} from "react-router-dom";
import "./styles.css";
import { Navbar, Nav, NavItem, NavLink } from 'reactstrap';


class App extends Component {
 
  render() {
    return (
      <div>
        <BrowserRouter>
          <div className="container">
            <Navbar color="light" light expand="md">
              <Nav className="mr-auto" navbar>
                <NavItem>
                  <NavLink href="/">Home</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/stock">Stock</NavLink>
                </NavItem>
              </Nav>
            </Navbar>
          </div>
          
          <Switch>
            <Route exact path="/" component = {Landing}/>
            <Route exact path="/stock" component = {Stock}/>
            <Route exact path="/:stock" component = {History}/>
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

export default App;
