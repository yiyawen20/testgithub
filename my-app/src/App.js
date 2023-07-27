import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';

// import DangerButton from "./component/DangerButton";

class App extends Component{
  render(){
    return <Router>
      <Index>
        <Route path="about" component={About} />
        <Route path="inbox" component={Inbox}>
          <Route path="messages/:id" component={Message} />
        </Route>
      </Index>
    </Router>
  }
}

class Index extends Component {
  render(){
    return (<div>
      <h1>App</h1>
      <ul>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/inbox">Inbox</Link></li>
      </ul>
      {this.props.children}
    </div>)
  }
}

class About extends Component{
  render() {
    return <h3>About</h3>
  }
}

class Inbox extends Component{
  render() {
    return (
      <div>
        <h2>Inbox</h2>
        {this.props.children || "Welcome to your Inbox"}
      </div>
    )
  }
}

class Message extends Component{
  render() {
    return <h3>Message {this.props.params.id}</h3>
  }
}


/*function Idx(){
  return (
    <div className="App">
      <header className="App-header">
        <DangerButton />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}*/

export default App;
