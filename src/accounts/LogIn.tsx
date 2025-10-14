import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase  } from '../lib/supabaseClient';

export const Login = ()=> {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('')
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    const { data, error} = await supabase
    .from('users')
    .select('*')
    .eq('id' , userId)
    .eq('pass', password)
    .single();

    if(error || !data){
      setError('ユーザーIDまたはパスワードがちがいます');
      console.error(error);
      return;
    }

    localStorage.setItem('userId', data.id);
    localStorage.setItem('user_name', data.name);
    navigate('/');
  };
  //   axios.post("http://127.0.0.1:3000/accounts/login/", {
  //     owner_id: userId,
  //   }).then((response) => {
  //     localStorage.setItem('userId', response.data.userId);
  //     navigate("/");
  //   }).catch((error) => {
  //     console.error(error);
  //     setError("ログインに失敗しました");
  //   });
  // };

  return(
    <div className='Login flex flex-col items-center mt-20'>
      <p className='font-bold tracking-wide text-teal-500'>みんなの けんこうかんり</p>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3 mt-5'>
        <input 
          type="text"
          value={userId}
          onChange={(e)=> setUserId(e.target.value)}
          placeholder='ユーザーID'
          required
          className='input input-bordered w-64'
           />
        <input
          type='text'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='パスワード'
          required
          className='input input-bordered w-64' />
          <button type="submit" className='btn btn-accent w-64'>ログイン</button>
      </form>
      {error && <p className='text-red-500 me-2'>{error}</p>}
    </div>
  );
};

export default Login;