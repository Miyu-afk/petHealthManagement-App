interface UsersInfo {
  id: number;
  name: string;
}

interface HeaderProps {
  userInfo: UsersInfo | null;
}

const PetHealthHeader = ({ userInfo }: HeaderProps) => {
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("user_name");
    window.location.href = "/";
  };

  return (
    <header className="bg-teal-500 h-35">
      <button className="absolute top-5 left-5" onClick={handleLogout}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="size-6 text-white"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
          />
        </svg>
      </button>
      <div className="flex items-center justify-center">
        <p className="absolute top-5 text-white">みんなの けんこうかんり</p>
      </div>
      {userInfo && (
        <div className="flex items-center justify-center">
          <p className="absolute top-10 text-white">user id : {userInfo.id}</p>
          <p className="absolute top-15 text-white">
            お名前 : {userInfo.name} さん
          </p>
        </div>
      )}
      <div className="flex justify-center items-center p-8px">
        <div className="w-[120px] h-[120px] object-cover flex justify-center items-center mt-22">
          <img src="http://localhost:8080/cat.png"></img>
        </div>
      </div>
    </header>
  );
};

export default PetHealthHeader;
