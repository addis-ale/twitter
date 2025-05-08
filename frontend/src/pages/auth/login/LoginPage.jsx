import { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import XSvg from "../../../components/svgs/X";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          let message;
          if (data.errorCode === 3003) {
            message = data?.error?.error[0]?.message;
          } else {
            message = data?.errorMessage || "Something went wrong!";
          }
          throw new Error(message);
        }
        return data;
      } catch (error) {
        toast.error(error.message);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Welcome Back!");
    },
  });
  const handleInputChange = (e) => {
    e.preventDefault(e);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };
  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex justify-center items-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          action=""
          onSubmit={handleSubmit}
          className="lg:w-2/3 mx-auto md:mx-20 flex flex-col gap-4"
        >
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-white text-4xl font-extrabold">Let&apos;s go.</h1>
          <label
            htmlFor=""
            className="input input-bordered rounded flex items-center gap-2 "
          >
            <MdOutlineMail />
            <input
              type="text"
              className="grow"
              placeholder="username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>
          <label
            htmlFor=""
            className="input input-bordered rounded flex items-center gap-2 "
          >
            <MdPassword />
            <input
              type="text"
              className="grow"
              placeholder="password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? "Loading" : "login"}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex flex-col gap-2 mt-4">
            <p className="text-white text-lg">{"Don't"} have an account?</p>
            <Link to="/signup">
              <button className="btn rounded-full btn-primary text-white btn-outline w-full">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
