import axios from 'axios';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = ()=> {
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    axios.post("http://127.0.0.1:3000/accounts/login/", {
      owner_id: userId,
    }).then((response) => {
      localStorage.setItem('userId', response.data.userId);
      navigate("/");
    }).catch((error) => {
      console.error(error);
      setError("ログインに失敗しました");
    });
  };

  return(
    <div className='Login'>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          value={userId}
          onChange={(e)=> setUserId(e.target.value)}
          placeholder='ユーザーID'
          required />
          <button type="submit">ログイン</button>
      </form>
    </div>
  );
};

export default Login;