import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBackendUrl } from "@/context/BackendProvider";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearUser, updateRole } from "@/redux/slices/user.slice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

const UserDropdown: React.FC<Props> = ({ open, setOpen, children }) => {
  const dispatch = useAppDispatch();
  const backendUrl = useBackendUrl();
  const user = useAppSelector((store) => store.user.user);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/logout`, {
        withCredentials: true,
      });

      if (data.success) {
        toast.success("Logged out");
        dispatch(clearUser());
        navigate("/");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  const goToOrders = () => navigate("/orders");

  const becomeSeller = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/upgrade`,
        {},
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success("you are now a shopx seller");
        dispatch(updateRole("admin"));
      }
    } catch (error) {
      toast.error("something went wrong");
      console.log(error);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Open account menu"
          className="flex items-center gap-2 rounded-full px-3 py-1 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/10"
        >
          {children}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="end"
        className={
          "mt-2 w-56 rounded-2xl shadow-xl border border-gray-100 bg-white p-2 ring-1 ring-black/5"
        }
      >
        {/* Label */}
        <div className="px-3 py-2">
          <DropdownMenuLabel className="text-sm font-medium text-gray-700">
            My Account
          </DropdownMenuLabel>
          {user && (
            <div className="mt-1 text-xs text-gray-500 truncate">
              {user.name} • {user.email}
            </div>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Menu items — improved spacing and hover states */}
        <div className="py-1">
          <DropdownMenuItem
            className="px-3 py-2 text-sm rounded-md hover:bg-gray-50 cursor-pointer"
            onSelect={(e) => {
              e.preventDefault();
              goToOrders();
              setOpen(false);
            }}
          >
            Orders
          </DropdownMenuItem>

          {/* Become a seller opens a dialog — use DialogTrigger asChild so markup stays valid */}
          {user?.role === "user" && (
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  className="px-3 py-2 text-sm rounded-md hover:bg-gray-50 cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  Become a seller
                </DropdownMenuItem>
              </DialogTrigger>

              <DialogContent className="max-w-md flex flex-col gap-10">
                <DialogHeader>
                  <DialogTitle>Become a seller</DialogTitle>
                  <DialogDescription>
                    By clicking on this button you are agreeing to become a
                    seller on this app.
                  </DialogDescription>
                </DialogHeader>

                <Button
                  className="bg-blue-600 hover:bg-blue-400"
                  onClick={becomeSeller}
                >
                  Become a seller
                </Button>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <DropdownMenuSeparator />

        <div className="px-2 py-2">
          <DropdownMenuItem
            className="px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50 cursor-pointer"
            onSelect={(e) => {
              e.preventDefault();
              logoutHandler();
              setOpen(false);
            }}
          >
            Logout
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
