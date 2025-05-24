import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../libs/apiCall.js";
import { auth } from "../../libs/firebaseConfiq.js";
import useStore from "../../store";
import { Button } from "../ui/button.js";

export const SocialAuth = ({ isLoading, setLoading }) => {
  const [user] = useAuthState(auth);
  const [selectedProvider, setSelectedProvider] = useState("google");
  const { setCredentials } = useStore((state) => state);
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setSelectedProvider("google");
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      toast.error("Google sign-in failed");
    }
  };

  // Optional Github signin handler
  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    setSelectedProvider("github");
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Github", error);
      toast.error("Github sign-in failed");
    }
  };

  useEffect(() => {
    const saveUserToDb = async () => {
      if (!user) return;

      const userData = {
        name: user.displayName,
        email: user.email,
        provider: selectedProvider,
        uid: user.uid,
      };

      setLoading(true);
      try {
        const { data: res } = await api.post("auth/sign-up", userData);
        if (res?.user) {
          toast.success(res?.message);
          const userInfo = { ...res.user, token: res.token };
          localStorage.setItem("user", JSON.stringify(userInfo));
          setCredentials(userInfo);
          setTimeout(() => {
            navigate("/overview");
          }, 1500);
        }
      } catch (error) {
        console.error("Something went wrong:", error);
        toast.error(error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      saveUserToDb();
    }
  }, [user, selectedProvider, setCredentials, navigate, setLoading]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center dark:bg-gray-900 font-sans">
      <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-sm dark:bg-gray-800">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-100">
          Sign In
        </h2>
        <div className="flex flex-col gap-4">
          <Button
            onClick={signInWithGoogle}
            disabled={isLoading}
            variant="outline"
            className="w-full text-sm font-normal dark:bg-transparent dark:border-gray-800 dark:text-gray-400"
            type="button"
          >
            <FcGoogle className="mr-2 size-5" />
            Continue with Google
          </Button>
        </div>
        {isLoading && (
          <p className="text-center text-sm text-gray-500 mt-4 dark:text-gray-400">
            Loading...
          </p>
        )}
      </div>
    </div>
  );
};
