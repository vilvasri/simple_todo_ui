import React, {Component} from 'react';
import update from 'immutability-helper';

import { Button, Container, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, Checkbox, IconButton} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import axios from 'axios';
import API from './api';

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
        API.get('todo/to-do-list/v1/list/2')
        .then(response => {
          if(response.status === 200) {
            this.setState({
              loading: false,
              todos: [...response.data.data],
            })
          } else {
            console.log(response.statusMessage);
            this.setState({loading: false});
          }
        }
        )
        .catch(error => {
          console.log(error);
        });
    });
  }

  saveTodo = () => e => {
    if(!this.state.currentTodo) { return; }
    if(this.state.isUpdate) {
      const updatedTodoList = update(this.state.todos, {[this.state.updateIndex]: {taskItem: {$set: this.state.currentTodo}}});
      
      /*
      API.put(`todo/to-do-list/v1/list/${userId}/todo/${this.state.todos[this.state.updateIndex].taskId}`,
        null, { params: {
          taskItem: this.state.currentTodo
        }})
        .then(response => {
          if(response.status === 200) {
            this.setState({
              todos: [...updatedTodoList]
            });
          } else {
            console.log(response.statusMessage);
            this.setState({loading: false});
          }
        }
        )
        .catch(error => {
          console.log(error);
        });
      */

      // Added inside axios callback
      this.setState({
        todos: [...updatedTodoList]
      });
    } else {
      const newTodo = {
        taskItem: this.state.currentTodo,
        completed: false
      }

      /*
      API.post(`todo/to-do-list/v1/list/${userId}`,
        null, { params: {
          taskItem: this.state.currentTodo
        }})
        .then(response => {
          if(response.status === 200) {
            this.setState({
              todos: [...this.state.todos, newTodo]
            });
          } else {
            console.log(response.statusMessage);
            this.setState({loading: false});
          }
        }
        )
        .catch(error => {
          console.log(error);
        });
      */

      // Added inside axios callback
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
      currentTodo: this.state.todos[todoIndex].taskItem,
      isUpdate: true,
      updateIndex: todoIndex,
      buttonName: 'Update'
    });
    e.preventDefault();
  }

  deleteTodo = (todoIndex) => e => {
    const updatedTodoList = update(this.state.todos, { $splice: [[todoIndex, 1]] } );

    /*
      API.delete(`todo/to-do-list/v1/list/${userId}/todo/${this.state.todos[todoIndex].taskId}`)
        .then(response => {
          if(response.status === 200) {
            this.setState({
              todos: [...updatedTodoList]
            });
          } else {
            console.log(response.statusMessage);
            this.setState({loading: false});
          }
        }
        )
        .catch(error => {
          console.log(error);
        });
      */

      // Added inside axios callback
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
    const updatedTodoList = update(this.state.todos, {[todoIndex]: {completed: {$set: !this.state.todos[todoIndex].completed}}});
    
    /*
      API.patch(`todo/to-do-list/v1/list/${userId}/todo/${this.state.todos[todoIndex].taskId}`,
        null, { params: {
          complete: !this.state.todos[todoIndex].completed
        }})
        .then(response => {
          if(response.status === 200) {
            this.setState({
              todos: [...updatedTodoList]
            });
          } else {
            console.log(response.statusMessage);
            this.setState({loading: false});
          }
        }
        )
        .catch(error => {
          console.log(error);
        });
      */

      // Added inside axios callback
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
                  <ListItemText id={`checkbox-list-secondary-label-${index}`} primary={value.taskItem} />
                  <ListItemSecondaryAction>
                    <Checkbox
                    edge="end"
                    checked={value.completed}
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
