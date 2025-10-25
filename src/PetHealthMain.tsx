import PetHealthBody from "./components/PetHealthBody";
import PetHealthFooter from "./components/PetHealthFooter";
import PetHealthHeader from "./components/PetHealthHeader";
import SuccessModal from "./components/SuccessModal";
import { useState, useEffect } from "react";
import React from "react";
import { supabase } from "./lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import PetImageUploader from "./components/PetImageUploader";

// const API_URL = "http://localhost:3000/pets";

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

const PetHealthMain: React.FC = () => {
  const [petsData, setPetsData] = useState<Pet[] | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [newPet, setNewPet] = useState<Pet | null>(null);
  const [ownerId, setOwnerId] = useState<string | null | undefined>();
  const [userInfo, setUserInfo] = useState<UsersInfo | null>(null);

  const navigate = useNavigate();


  const openModal = () => {
    const modal = document.getElementById("modal") as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };
  const authId = localStorage.getItem("authUid");

  const fetchPets = async () => {
    const ownerId = localStorage.getItem("userId");
    setOwnerId(ownerId);

    if (!authId && location.pathname !== "/") {
      navigate("/");
      return;
    }
    

    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("owner_id", authId);
      
    if (error) {
      console.error("Supabase Fetch Error:", error.message);
      alert("データ取得に失敗しました。");
      return;
    }
    setPetsData(data as Pet[]);
  };
  

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchUsers = async () => {
    if(!authId) return;

    const { data, error } = await supabase
      .from("users")
      .select("id, name, auth_user_id")
      .eq("auth_user_id", authId)
      .single();
    if (error) {
      console.error("Supabase Fetch Error:", error.message);
      alert("データ取得に失敗しました。");
      return;
    }
    setUserInfo(data as UsersInfo);
  };

  useEffect(() => {
    if (authId) {
      fetchUsers();
    }
  }, [authId]);

  const addHealth = async (newHealthData: Partial<Pet>) => {
    const { error } = await supabase.from("pets").insert([newHealthData]);
    if (error) {
      console.error("Supabase Insert Error:", error.message);
      alert("登録に失敗しました。");
    } else {
      await fetchPets();
    }
  };

  const addPet = async (newPetData: Partial<Pet>) => {
    const { data, error } = await supabase
      .from("pets")
      .insert([newPetData])
      .select()
      .single();

    if (error) {
      console.error("Supabase Insert Error:", error.message);
      alert("新しいペットの登録に失敗しました。");
      return null;
    }

    setNewPet(data);

    await fetchPets();
  };

  const handlePetSelected = (pet: Pet) => {
    setSelectedPet(pet);
  };


  

  return (
    <>
      <PetHealthHeader userInfo={userInfo} selectedPet={selectedPet} ownerId={ownerId} handleSetPets={setPetsData}/>
      <PetHealthBody
        SuccessModalOpen={openModal}
        addHealth={addHealth}
        petsData={petsData}
        onChildSelectedPet={handlePetSelected}
        onChildAddPet={addPet}
        newPet={newPet}
        ownerId={ownerId}
      />
      <SuccessModal
        SuccessModalOpen={openModal}
        petsData={petsData}
        selectedPet={selectedPet}
      />
      <PetHealthFooter />
    </>
  );
};

export default PetHealthMain;
