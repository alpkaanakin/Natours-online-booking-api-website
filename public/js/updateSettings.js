/* eslint-disable */
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/users/updatepassword'
        : '/api/users/updateMe';

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
