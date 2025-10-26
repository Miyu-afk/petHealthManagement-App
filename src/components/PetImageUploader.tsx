import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import CheckButton from "./CheckButton";

interface PetImageUploaderProps {
  petId: number;
  currentImagePath?: string | null;
  onUploadComplete: (newImagePath: string) => void;
}

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

const PetImageUploader = ({
  petId,
  currentImagePath,
  onUploadComplete,
}: PetImageUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [previewSet, setPreviewSet] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const [currentImgControl, setCurrentImgControl] = useState(false);

  useEffect(() => {
    const loadCurrentImage = async () => {
      if (!currentImagePath) {
        setCurrentImageUrl("");
        setCurrentImgControl(false);
        setPreviewSet(false);
        return;
      }

      const path = currentImagePath.replace(/^\/?pet-images\//, "");

      const { data, error } = await supabase.storage
        .from("pet-images")
        .createSignedUrl(path, 60);

      if (error) {
        console.error("Signed URL Error:", error.message);
        setCurrentImageUrl("");
        return;
      }

      if (data?.signedUrl) {
        setCurrentImageUrl(data.signedUrl);
        setCurrentImgControl(false);
        setPreviewSet(false);
      }
    };

    loadCurrentImage();
  }, [currentImagePath]);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.id) {
        setUserId(data.session.user.id);
      }
    };
    getUser();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPreviewSet(true);
    setCurrentImgControl(true);
  };

  const handleUpload = async () => {
    if (!userId || !selectedFile)
      return alert("ファイルかログインがありません。");

    const filePath = `user_${userId}/pet_${petId}_${selectedFile.name}`;
    if (!selectedFile) return;

    const { error } = await supabase.storage
      .from("pet-images")
      .upload(filePath, selectedFile, { upsert: true });

    if (error) {
      console.error("Upload Error:", error.message);
      alert("画像アップロードに失敗しました");
      return;
    }

    const { error: dbError } = await supabase
      .from("pets")
      .update({ image_path: filePath })
      .eq("pet_id", petId);

    if (dbError) {
      console.error("DB Update Error:", dbError.message);
      return;
    }

    const { data: newPets } = await supabase
      .from("pets")
      .select("*")
      .eq("pet_id", petId)
      .single();

    if (!newPets) return;

    const { data: signedData, error: signedError } = await supabase.storage
      .from("pet-images")
      .createSignedUrl(newPets.image_path, 60);

    if (signedData?.signedUrl) {
      setCurrentImageUrl(signedData.signedUrl);
      setPreviewUrl("");
      setSelectedFile(null);
      setPreviewSet(false);
      setCurrentImgControl(false);
    }

    onUploadComplete(filePath);
    alert("アップロードしました。");
  };

  //     const { data: signedData, error: signedError } = await supabase.storage
  //       .from("pet-images")
  //       .createSignedUrl(filePath, 60);

  //     if (signedError) {
  //       console.error("Signed URL Error:", signedError.message);
  //       return;
  //     }
  //     setImageUrl(signedData.signedUrl);
  // };

  return (
    <div className="flex flex-col items-center justify-center">
      {currentImageUrl && !currentImgControl && (
        <img
          src={currentImageUrl}
          alt="current pet"
          className="w-32 h-32 object-cover mb-2"
        />
      )}
      {previewUrl && (
        <img
          src={previewUrl}
          alt="preview"
          className="w-[120px] h-[120px] object-cover"
        />
      )}
      <div className="flex">
        <label className="cursor-pointer px-4 py-2 rounded">
          ファイルを選択
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        {previewSet && (
          <button onClick={handleUpload}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default PetImageUploader;
