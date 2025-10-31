import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [hideButton, setHideButton] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const email = `${userEmail}`;

      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError || !authData.user) {
        setError("Authログインに失敗しました。");
        console.error(authError);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_email", userEmail)
        .eq("pass", password)
        .single();

      if (error || !data) {
        setError("ユーザーIDまたはパスワードがちがいます");
        console.error(error);
        return;
      }

      localStorage.setItem("userId", data.id.toString());
      localStorage.setItem("userName", data.name);
      localStorage.setItem("authUid", authData.user.id);
      navigate("/main");
    } catch (err) {
      console.error(err);
      setError("ログイン中にエラーが発生しました。しました。");
    }
  };

  const handleNewOrLogin = () => {
    setShowLoginForm(false);
    setShowCreateForm(true);
    setHideButton(true);
  };

  const handleShowLoginForm = () => {
    setShowLoginForm(true);
    setShowCreateForm(false);
    setHideButton(false);
  };

  const handleNewCreateUser = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const email = `${userEmail}`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError || !authData.user) {
        setError("Auth登録に失敗しました。");
        console.error(authError);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            pass: password,
            name: userName,
            auth_user_id: authData.user?.id,
            user_email: userEmail,
          },
        ])
        .select()
        .single();

      if (error || !data) {
        setError("新規作成に失敗しました");
        console.error(error);
        return;
      }

      localStorage.setItem("userId", data.id);
      localStorage.setItem("userName", userName);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("authUid", authData.user?.id);
      navigate("/main");
    } catch (err) {
      console.error(err);
      setError("新規作成中にエラーが発生しました。");
    }
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
      {showLoginForm && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-5">
          <input
            type="text"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Emailアドレス"
            required
            className="input input-bordered w-64"
          />
          <input
            type="password"
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
      )}

      {!hideButton && (
        <button
          className="btn w-64 mt-5 bg-gray-200"
          onClick={handleNewOrLogin}
        >
          新しく作る
        </button>
      )}

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
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Emailアドレス"
            required
            className="input input-bordered w-64"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            required
            className="input input-bordered w-64"
          />

          <button type="submit" className="btn btn-accent w-64">
            作成してログイン
          </button>
          <button
            className="btn bg-gray-200 w-64"
            onClick={handleShowLoginForm}
          >
            戻る
          </button>
        </form>
      )}

      {error && <p className="text-red-500 me-2">{error}</p>}
    </div>
  );
};

export default Login;
