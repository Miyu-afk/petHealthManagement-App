interface MemoProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
}

const Memo = ({ value, onChange }: MemoProps) => {
  return (
    <textarea
      value={value}
      className="border-2 border-solid border-teal-500 rounded-lg resize-none"
      placeholder="ひとことメモ"
      onChange={onChange}
      name="postContent"
    />
  );
};

export default Memo;
