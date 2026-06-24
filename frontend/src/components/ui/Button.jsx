const Button = ({ children, className = '', type = 'button', ...props }) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition duration-300 hover:scale-[1.01] hover:brightness-110 focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
