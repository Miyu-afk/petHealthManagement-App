import PetImageUploader from "./PetImageUploader";

interface Pet {
  id: number;
  name: string;
  mood: boolean | null;
  poop: boolean | null;
  meal: boolean | null;
  vitality: number | null;
  record: string | null;
  memo: string | null;
  owner_id: number;
  pet_id: number;
  image_path?: string | null;
}

interface UsersInfo {
  id: number;
  name: string;
}

interface HeaderProps {
  userInfo: UsersInfo | null;
  selectedPet: Pet | null;
  ownerId: string | null | undefined;
  handleSetPets: React.Dispatch<React.SetStateAction<Pet[] | null>>;
}

const PetHealthHeader = ({
  userInfo,
  selectedPet,
  ownerId,
  handleSetPets,
}: HeaderProps) => {
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
      <div className="flex items-center justify-center mt-22 p-8px">
        {selectedPet && (
        <PetImageUploader
          petId={selectedPet ? selectedPet.pet_id : 0}
          ownerId={ownerId!}
          currentImagePath={selectedPet ? selectedPet.image_path : ""}
          onUploadComplete={(newPath: string) => {
            if (selectedPet) {
              handleSetPets((prev) =>
                prev
                  ? prev?.map((p) =>
                      p.pet_id === selectedPet.pet_id
                        ? { ...p, image_path: newPath }
                        : p
                    )
                  : prev
              );
            }
          }}
        />
        )}
            </div>
    </header>
  );
};

export default PetHealthHeader;
