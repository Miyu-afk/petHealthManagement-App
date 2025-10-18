import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .eq("pass", password)
      .eq("name", userName)
      .single();

    if (error || !data) {
      setError("ユーザーIDまたはパスワードがちがいます");
      console.error(error);
      return;
    }

    localStorage.setItem("userId", data.id);
    localStorage.setItem("user_name", data.name);
    localStorage.setItem("userName", data.name);
    navigate("/");
  };

  const handleNewCreateUser = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const { data, error } = await supabase
      .from("users")
      .insert([{ pass: password, name: userName }])
      .select()
      .single();
      

    if (error || !data) {
      setError("新規作成に失敗しました");
      console.error(error);
      return;
    }

    localStorage.setItem("userId", data.id);
    navigate("/");
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

  return (
    <div className="Login flex flex-col items-center mt-20">
      <p className="font-bold tracking-wide text-teal-500">
        みんなの けんこうかんり
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-5">
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="ユーザーID"
          required
          className="input input-bordered w-64"
        />
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          required
          className="input input-bordered w-64"
        />
        <button type="submit" className="btn btn-accent w-64">
          ログイン
        </button>
      </form>

      <button className="btn w-64 mt-5" onClick={() => setShowCreateForm(true)}>
        新しく作る
      </button>

      {showCreateForm && (
        <form
          onSubmit={handleNewCreateUser}
          className="flex flex-col gap-3 mt-5"
        >
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="お名前"
            required
            className="input input-bordered w-64"
          />
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            required
            className="input input-bordered w-64"
          />

          <button type="submit" className="btn btn-accent w-64">
            作成してログイン
          </button>
        </form>
      )}

      {error && <p className="text-red-500 me-2">{error}</p>}
    </div>
  );
};

export default Login;
