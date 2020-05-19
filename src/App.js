import React, {Component} from 'react';
import update from 'immutability-helper';

import { Button, Container, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, Checkbox, IconButton} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import axios from 'axios';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.saveTodo = this.saveTodo.bind(this);
    this.editTodo = this.editTodo.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    
    this.state = {
        todos: [],
        currentTodo: '',
        isUpdate: false,
        updateIndex: 0,
        buttonName: 'Add',
        loading: false
    }
  }

  componentDidMount() {
      this.setState({ loading: true }, () => {
        axios.get('https://9a359bc9-7192-4771-8430-2eab99c00d85.mock.pstmn.io/todos')
        .then(response => 
            this.setState({
              loading: false,
              todos: [...response.data.data],
            })
        )
        .catch(error => {
          console.log(error);
        });
    });
  }

  saveTodo = () => e => {
    if(!this.state.currentTodo) { return; }
    if(this.state.isUpdate) {
      const updatedTodoList = update(this.state.todos, {[this.state.updateIndex]: {title: {$set: this.state.currentTodo}}});
      this.setState({
        todos: [...updatedTodoList]
      });
    } else {
      const newTodo = {
        title: this.state.currentTodo,
        isComplete: false
      }
      this.setState({
        todos: [...this.state.todos, newTodo]
      });
    }
    this.setState({
      currentTodo: '',
      buttonName: 'Add',
      isUpdate: false
    });
   e.preventDefault();
  }

  editTodo = (todoIndex) => e => {
    this.setState({
      currentTodo: this.state.todos[todoIndex].title,
      isUpdate: true,
      updateIndex: todoIndex,
      buttonName: 'Update'
    });
    e.preventDefault();
  }

  deleteTodo = (todoIndex) => e => {
    const updatedTodoList = update(this.state.todos, { $splice: [[todoIndex, 1]] } );
    this.setState({
        todos: [...updatedTodoList]
      });
    e.preventDefault();
  }

  handleInputChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
    e.preventDefault();
  }

  handleToggle = (todoIndex) => e => {
    const updatedTodoList = update(this.state.todos, {[todoIndex]: {isComplete: {$set: !this.state.todos[todoIndex].isComplete}}});
    this.setState({
      todos: [...updatedTodoList]
    });
  }

  render() {
    return (
        <Container maxWidth="sm" className="App">
          <TextField id="currentTodo" label="your todo"
          multiline
          rowsMax={5}
          value={this.state.currentTodo}
          onChange={this.handleInputChange}
          variant="outlined" /><br/>
          <Button variant="contained" color="primary" className="button"
          onClick={this.saveTodo()}>
            {this.state.buttonName}
          </Button>
          {this.state.loading? <p>loading existing todos...</p>: ''}
              <List className="list">
              {this.state.todos.map((value, index) => (
                <ListItem key={index} button>
                  <ListItemText id={`checkbox-list-secondary-label-${index}`} primary={value.title} />
                  <ListItemSecondaryAction>
                    <Checkbox
                    edge="end"
                    checked={value.isComplete}
                    onChange={this.handleToggle(index)}
                    />
                    <IconButton edge="end" aria-label="edit" onClick={this.editTodo(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={this.deleteTodo(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
        </Container>
    );
  }
}

export default App;
