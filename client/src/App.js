import React from 'react';
import "./App.scss";

const url="http://localhost:2001/messages";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      currentMessage: "",
      username: ""
    }
  this.counter = 0; // to give all messages an individual local key, but should get _id instead.
  this.messageTag = ""; // The message to be sent
  this.messagesTag = []; // Array of all chat messages
  }
  
  componentDidMount = () => {
    // These don't exist until after first rendering.
    this.messagesTag = document.querySelector("#messages");
    this.messageTag = document.querySelector("#message");
    this.update();
  }

  clickedButton() {
    if(this.messageTag.value!=="") { // No empty messages allowed
      const name = this.state.username === "" ? "Nameless individual" : this.state.username // No nameless people allowed
      const message = { name: name, message: this.messageTag.value };
      this.update(message);
      this.setState({ currentMessage: "" });
    }
  }

  handleChange(event) {
    if(event.target.value!=="\n") this.setState({ currentMessage: event.target.value });
  }

  keyPressed(e) {
    if(e.key==="Enter") this.clickedButton();
  }

  clearChatWindow() {
    console.log("Clearing database");
    fetch(url, { method: "delete" })
    .catch(error => console.log("Something went wrong\n", error));
    console.log("Clearing local chat");
    this.setState({messages: []});
  }

  getChatWindow() { // Chat window
    return(
      this.state.messages.map(message => 
        <div key={this.counter++}>
          { message.name }: { message.message }
        </div>
      )
    )
  }
  updateUsername(event) {
    this.setState( {username: event.target.value})
  }

  update(message = undefined) {
    let params = {}; // only used for post request
    if(message) { // run if there is a message to send
      console.log("Sending message to server")
      params = {
        headers: {
          "content-type": "application/json"
        },
        method: "post",    
        body: JSON.stringify(message),
      }
    }
    fetch(url, params) // does the post / get request, and then sets the state to the response
    .then(res => res.json()) // json() consumed
    .then(res => this.setState({messages: res.reverse()}))
    .catch(error => console.log("Something went wrong\n", error))  
  }

  render() { 
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <div className="container">
          <div className="intro">
            Simple Chat App - MERN Demo
          </div>
          <div className="userData">
            <input className="chatroom" name="chatroom" onChange={ e => this.findChatroom(e) } type="text" placeholder="Enter name of chatroom"/>
            <input className="username" name="username" onChange={ e => this.updateUsername(e) } type="text" placeholder="Enter your username"/>
          </div>
          <textarea 
            name="message" 
            id="message" 
            cols="30" 
            rows="10" 
            placeholder="Enter message"
            onKeyPress = { e => this.keyPressed(e) }
            onChange = { e => this.handleChange(e) }
            value = {this.state.currentMessage}
          />
          <div className="buttons">
            <button className="btn clearChatWindow" onClick={() => this.clearChatWindow() }>Clear chat</button>
            <button 
              className="btn sendMessage" 
              onClick={() => this.clickedButton() }
            >
                Send
            </button>          
          </div>

          <div className="chatWindow">{this.getChatWindow()}</div>
        </div>
      </div>
    );
  }
}

export default App;
