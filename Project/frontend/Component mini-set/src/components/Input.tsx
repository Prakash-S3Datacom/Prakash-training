
interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number";
  error?: string;
}

function Input({
  label,
  value,
  onChange,
  placeholder = "Enter value",
  type = "text",
  error,
}: InputProps) {
  return (
    <div className="input-group">
      <label>{label}</label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />

      {error && <p className="input-error">{error}</p>}
    </div>
  );
}

export default Input;
