import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const token = localStorage.getItem("TaskGenie")
  ? JSON.parse(localStorage.getItem("TaskGenie")).token
  : null;

//   console.log(token);

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    },
    });

export const register = async (name, email, password) => {
    const { data } = await api.post('/api/user/register', {
        name,
        email,
        password,
    });
    return data;
}
export const login = async (email, password) => {
    const { data } = await api.post("/api/user/login", {
      email,
      password,
    });
    return data;
}

export const getAllTasks = async () => {
    const { data } = await api.get("/api/task");
    return data;
}

export const getUserTask = async (id) => {
    const { data } = await api.get(`/api/task/user/${id} `);
    return data;
}

export const getTask = async (id) => {
    const { data } = await api.get(`/api/task/${id}`);
    return data;
}

export const createTask = async (content, date, important) => {
    const { data } = await api.post("/api/task", {
      content,
      date,
      important,
    });
    return data;
}

export const updateTask = async (id, content, date, important) => {
    const { data } = await api.put(`/api/task/${id}`, {
      content,
      date,
      important,
    });
    return data;
}

export const deleteTask = async (id) => {
    const { data } = await api.delete(`/api/task/${id}`);
    return data;
}



// Path: frontend/src/helpers/auth.js

