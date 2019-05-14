import React from 'react';
// import './App.css';

const url="http://localhost:2001/messages";
const NAME = "nilkun";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      currentMessage: ""
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
      const name = NAME === "" ? "Nameless individual" : NAME // No nameless people allowed
      const message = { name: name, message: this.messageTag.value };
      this.update(message);
      this.setState({ currentMessage: "" });
    }
  }

  handleChange(event) {
    if(event.target.value!=="\n") this.setState({ currentMessage: event.target.value });
  }

  keyPressed(e) {
    // e.preventDefault();
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
          Simple chat client
        </header>
        <div className="container">
          <div className="send">Send message</div>
          <input type="text" placeholder="Enter name of chatroom"/>
          <input type="text" placeholder="Enter your username"/>
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
          <button className="clearChatWindow" onClick={() => this.clearChatWindow() }>Clear chat</button>
          <button 
            className="btn" 
            onClick={() => this.clickedButton() }
          >
              Send
          </button>
          <div id="messages"></div>
          <div className="reacted">{this.getChatWindow()}</div>
        </div>
      </div>
    );
  }
}

export default App;
