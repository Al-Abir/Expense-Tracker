import React, { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useStore from "../../store";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Input from "../../components/ui/input";
import { BiLoader } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import api from "../../libs/apiCall";
import { toast } from "sonner";

// ✅ Validation schema
const RegisterSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),

  firstName: z
    .string({ required_error: "Name is required" })
    .min(3, "Name must be at least 3 characters"),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

const SignUp = () => {
  const user = useStore((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ useForm with onChange mode
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",          // 👈 live validation
    reValidateMode: "onChange" // 👈 live re-validation
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const { data: res } = await api.post("/auth/sign-up", data);
      if (res?.user) {
        toast.success("Account created successfully! You can now log in.");
        setTimeout(() => {
          navigate("/sign-in");
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-lg bg-white border border-gray-200">
        <CardHeader className="text-center pt-6">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Sign up
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Google Auth */}
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              // Google Auth handler placeholder
            }}
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="text-sm text-gray-400">Or</span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <Input
                id="firstName"
                placeholder="Your name"
                {...register("firstName")}
                disabled={loading}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                {...register("password")}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-violet-700 hover:bg-violet-800 text-white font-medium h-10 rounded-md"
              disabled={loading}
            >
              {loading ? (
                <BiLoader className="text-xl animate-spin mx-auto" />
              ) : (
                "Create an account"
              )}
            </Button>
          </form>
        </CardContent>

        {/* Footer */}
        <CardFooter className="justify-center gap-2">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <Link
            to="/sign-in"
            className="text-sm font-semibold text-violet-600 hover:underline"
          >
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
