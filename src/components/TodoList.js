import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  InputLabel,
  Input,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  List,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos"
    );
    setTodos(response.data.slice(0, 10));
  };

  const addTodo = async () => {
    const newTodoItem = {
      id: Math.max(...todos.map((t) => t.id)) + 1,
      title: newTodo,
      completed: false,
    };

    setTodos([...todos, newTodoItem]);
    setNewTodo("");

    try {
      await axios.post(
        "https://jsonplaceholder.typicode.com/todos",
        newTodoItem
      );
    } catch (error) {
      console.error(error);
      setTodos(todos.filter((t) => t.id !== newTodoItem.id));
      // Show an error message to the user
    }
  };

  const updateTodo = async (id) => {
    const todo = todos.find((t) => t.id === id);
    const updatedTodo = { ...todo, completed: !todo.completed };
    setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));

    try {
      await axios.put(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        updatedTodo
      );
    } catch (error) {
      console.error(error);
      setTodos(todos.map((t) => (t.id === id ? todo : t)));
      // Show an error message to the user
    }
  };

  const deleteTodo = async (id) => {
    setTodos(todos.filter((t) => t.id !== id));

    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
    } catch (error) {
      console.error(error);
      setTodos([...todos]);
      // Show an error message to the user
    }
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Todo List
        </Typography>
        <FormControl fullWidth>
          <InputLabel htmlFor="new-todo">Add new todo</InputLabel>
          <Input
            id="new-todo"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
        </FormControl>
        <Box sx={{ my: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={addTodo}
            fullWidth
          >
            Add Todo
          </Button>
        </Box>
        <List>
          {todos.map((todo) => (
            <ListItem key={todo.id} dense button>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={todo.completed}
                  tabIndex={-1}
                  disableRipple
                  onChange={() => updateTodo(todo.id)}
                />
              </ListItemIcon>
              <ListItemText primary={todo.title} />
              <ListItemSecondaryAction>
                <Button
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteTodo(todo.id)}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default TodoList;
