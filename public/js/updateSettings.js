/* eslint-disable */
import { showAlert } from './alerts';
import axios from 'axios';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/users/updatepassword'
        : 'http://127.0.0.1:3000/api/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });
    console.log(data)

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
