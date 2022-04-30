/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const signUp = async (email, username, password,passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/users/signup',
      data: {
        email,
        name:username,
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};