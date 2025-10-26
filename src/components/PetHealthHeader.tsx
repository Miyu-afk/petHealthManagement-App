import PetImageUploader from "./PetImageUploader";
import { supabase } from "../lib/supabaseClient";
import { useState } from "react";

interface Pet {
  id: number;
  name: string;
  mood: boolean | null;
  poop: boolean | null;
  meal: boolean | null;
  vitality: number | null;
  record: string | null;
  memo: string | null;
  owner_id: string;
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

  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null);

  const handlePetSelect = async (petId: number) => {
    setSelectedPetId(petId);

    const { data, error } = await supabase
      .from("pets")
      .select("image_path")
      .eq("pet_id", petId)
      .single();

    if (error) {
      console.error(error);
      setCurrentImagePath(null);
    } else {
      setCurrentImagePath(data.image_path);
    }
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
          <p className="absolute top-10 text-white">
            お名前 : {userInfo.name} さん
          </p>
        </div>
      )}

      <div className="flex items-center justify-center mt-18 p-8px">
        {selectedPet && (
          <PetImageUploader
            petId={selectedPet ? selectedPet.pet_id : 0}
            currentImagePath={selectedPet.image_path ?? ""}
             onUploadComplete={(newPath) => setCurrentImagePath(newPath)} />
        )}
      </div>
    </header>
  );
};

export default PetHealthHeader;
