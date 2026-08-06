
const Button = ({
  text,
  type="button",
  onClick,
  loading = false
}) => {
  return (
    <div>
      <button type={type} onClick={onClick} disabled={loading}  
      className="
        w-full
        rounded-xl
        bg-blue-600
        px-4
        py-3
        text-white
        font-semibold
        transition-all
        duration-300
        hover:bg-blue-700
        disabled:opacity-50
        disabled:cursor-not-allowed
      " >
        {loading? "loading....":text}
      </button>
    </div>
  );
}

export default Button;
