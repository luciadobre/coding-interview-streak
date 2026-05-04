import Select from "./Select.jsx";

export default function Dropdown({ options, ...props }) {
  return (
    <Select {...props}>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </Select>
  );
}
