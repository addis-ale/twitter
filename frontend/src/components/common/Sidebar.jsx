import XSvg from "../svgs/X";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
const sideBarNavigation = [
  {
    name: "Home",
    icon: MdHomeFilled,
    link: "/",
  },
  {
    name: "Notifications",
    icon: IoNotifications,
    link: "/notifications",
  },
  {
    name: "Profile",
    icon: FaUser,
    link: "/profile",
  },
];
const Sidebar = () => {
  const queryClient = useQueryClient();
  const { mutate: logOut } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          const message = data.error.message || "Something went wrong!";
          throw new Error(message);
        }
        return data;
      } catch (error) {
        toast.error(error.message);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Logged Out!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
  const { data } = useQuery({ queryKey: ["authUser"] });
  console.log("the data of the user from sidebar", data);
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
        {data && (
          <Link
            to={`/profile/${data.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img src={data?.profileImg || "/avatar-placeholder.png"} />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {data?.fullName}
                </p>
                <p className="text-slate-500 text-sm">@{data?.username}</p>
              </div>
              <BiLogOut
                className="w-5 h-5 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  logOut();
                }}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
