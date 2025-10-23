import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface PetImageUploaderProps {
  petId: number;
  ownerId: string;
  currentImagePath?: string | null;
  onUploadComplete: (newImagePath: string) => void;
}

const PetImageUploader = ({
  petId,
  ownerId,
  currentImagePath,
  onUploadComplete,
}: PetImageUploaderProps) => {
  const [previewUtl, setPreviewUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  const authUid = localStorage.getItem("authUid");

  useEffect(() => {
    if (!currentImagePath) return;

    const fetchSignedUrl = async () => {
      const { data, error } = await supabase.storage
        .from("pet-images")
        .createSignedUrl(currentImagePath, 60);
      if (error) {
        console.error("Signed URL Error:", error.message);
        return;
      }
      setImageUrl(data.signedUrl);
    };

    fetchSignedUrl();
  }, [currentImagePath]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!authUid){
      alert("Auth UIDがありません。ログインしてください。");
      return;
    }
    
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));

    const filePath = `user_${authUid}/pet_${petId}_${file.name}`;

    const { data, error } = await supabase.storage
      .from("pet-images")
      .upload(filePath, file, { upsert: true });

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
    } else {
      onUploadComplete(filePath);

      const { data, error } = await supabase.storage
        .from("pet-images")
        .createSignedUrl(filePath, 60);

      if (!error && data.signedUrl) {
        setImageUrl(data.signedUrl);
      }
    }
  };

  const getSignedUrl = async (path?: string | null) => {
    if (!path) return;

    const { data, error } = await supabase.storage
      .from("pet_images")
      .createSignedUrl(path, 60);

    if (error) {
      console.error("Signed URL Error:", error.message);
      return "";
    }

    return data.signedUrl;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {currentImagePath && (
        <img src={imageUrl} alt="pet" className="w-32 h-32 object-cover mb-2" />
      )}
      {previewUtl && (
        <img
          src={previewUtl}
          alt="preview"
          className="w-[120px] h-[120px] object-cover"
        />
      )}
      <label className="cursor-pointer  px-4 py-2 rounded">
        ファイルを選択
        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default PetImageUploader;
