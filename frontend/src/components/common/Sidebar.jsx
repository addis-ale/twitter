import XSvg from "../svgs/X";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
const sideBarNavigation = [
  {
    name: "Home",
    icon: MdHomeFilled,
    link: "/",
  },
  {
    name: "Notifications",
    icon: IoNotifications,
    link: "/",
  },
  {
    name: "Profile",
    icon: FaUser,
    link: "/",
  },
];
const Sidebar = () => {
  //TODO: get the user and make the logout ui
  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" />
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          {sideBarNavigation.map((item) => {
            return (
              <li className="flex justify-center md:justify-start">
                <Link
                  to={item.link}
                  className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
                >
                  <item.icon className="w-8 h-8" />
                  <span className="text-lg hidden md:block">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
