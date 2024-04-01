import { NavLink } from "react-router-dom";

const MenuNavs = ({ to, text }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive, isPending }) =>
        [
          isActive
            ? "text-xl pe-6 py-4 z-0 flex overflow-hidden relative after:absolute after:w-10 after:h-[2px] uppercase font-semibold after:bg-green-500 after:-z-[1] after:transition-all cursor-pointer transition-colors duration-150 after:left-0 after:top-1/2 after:translate-x-0 after:translate-y-[1rem] after:rotate-0 hover:text-green-500 text-black rounded-md"
            : "text-xl pe-6 py-4 z-0 flex overflow-hidden relative after:absolute after:w-10 after:h-[2px] uppercase font-semibold after:bg-green-500 after:-z-[1] after:left-0 after:top-1/2 after:transition-all cursor-pointer transition-colors duration-150 after:translate-x-24 after:translate-y-[2.2rem] after:rotate-[-0.2turn] after:opacity-0 hover:text-green-500 hover:rounded-md hover:after:translate-x-0 hover:after:translate-y-[1rem] hover:after:rotate-0 hover:after:opacity-100 after:duration-300",
        ].join(" ")
      }
    >
      {text}
    </NavLink>
  );
};

export default MenuNavs;
