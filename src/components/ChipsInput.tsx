import React, { useRef, useState } from "react";
import { Chip, Block } from "konsta/react";

interface ChipsInputProps {
  value: string[];
  onChange: (newValue: string[]) => void;
  placeholder?: string;
}

const ChipsInput: React.FC<ChipsInputProps> = ({
  value,
  onChange,
  placeholder = "Add category…",
}) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addChip = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInput("");
    }
  };

  const removeChip = (chip: string) => {
    onChange(value.filter((c) => c !== chip));
  };

  // Support for backspace-to-delete when input is empty
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addChip();
    } else if (
      e.key === "Backspace" &&
      input.length === 0 &&
      value.length > 0
    ) {
      removeChip(value[value.length - 1]);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 bg-transparent border-0 shadow-none p-0 m-0">
      {value.map((chip) => (
        <Chip
          key={chip}
          className="m-0.5"
          onDelete={() => removeChip(chip)}
          deleteButton
        >
          {chip}
        </Chip>
      ))}
      <input
        ref={inputRef}
        type="text"
        className="min-w-[80px] flex-1 outline-none bg-transparent border-none px-2 py-1 text-sm"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addChip}
      />
    </div>
  );
};

export default ChipsInput;
