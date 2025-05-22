import React, { useEffect, useState } from 'react'
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; 
import useStore from "../../store"; 
import { useNavigate } from 'react-router-dom';
import {Card, CardHeader, CardTitle} from "../../components/ui/card"
const RegisterSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  firstName: z.string({ required_error: "Name is required" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

const SignUp = () => {
   const user = useStore((state) => state.user); // Accessing the user state specifically

  // Initialize react-hook-form with zod resolver for validation
  const {
    register, // Function to register input fields
    handleSubmit, // Function to handle form submission
    formState: { errors }, // Object containing form errors
  } = useForm({
    resolver: zodResolver(RegisterSchema), // Use zodResolver for schema validation
  });


 const navigate = useNavigate()
 const [loading,setLoading]= useState()


 useEffect(()=>{
   user && navigate("/")
 })
  const onSubmit = (data) => {
    console.log("Form data submitted:", data);
    // Here you would typically handle user registration, e.g., make an API call
  };

  return (
    <div className='flex items-center justify-center w-full min-h-screen py-10'>

       <Card className="w-[400px] bg-white dark:bg-black/20  shadow-md overflow-hidden">
         <div className='p-6 md:-8'>
           <CardHeader className="py-0">
              <CardTitle className="mb-8 text-center dark:text-white">
                Create Account
              </CardTitle>

           </CardHeader>

         </div>

       </Card>
    </div>
  )
}

export default SignUp
