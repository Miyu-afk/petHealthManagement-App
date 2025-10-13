const PetHealthHeader = () => {
  return (
    <header className="bg-teal-500 h-20">
      <div className="flex justify-center items-center p-8px">
        <div className="w-[120px] h-[120px] object-cover flex justify-center items-center mt-8px">
          <img src="http://localhost:8080/cat.png"></img>
        </div>
      </div>
    </header>
  );
};

export default PetHealthHeader;
