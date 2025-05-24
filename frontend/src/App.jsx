import {  useState } from "react"
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import SignIn from "./pages/auth/SignIn"
import SignUp from "./pages/auth/SignUp"
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings"
import  useStore  from "./store/index.js";
import {setAuthToken} from './libs/apiCall.js'
import{Toaster} from "sonner"

const RootLayout = ()=>{
 const {user}= useStore((state) => state);
  setAuthToken(user?.token || " ")
  return !user ? <Navigate to="/sign-in" replace={true}></Navigate> : <>  <div className="min-h-cal(h-screen-100px)]">
    <Outlet></Outlet>
  </div></>


}

function App() {

  return (
      <main>

           <div className="w-full min-h-screen px-6 bg-gray-100 md:px-20 dark:bg-slate-900">
            <Routes>
               <Route element={<RootLayout/>}>
                 <Route path="/" element={<Navigate to="/overview" />} />
                 <Route path="/overview" element={<Dashboard />} />
                  <Route path="/transactions" element={<Transactions/>} />
                   <Route path="/settings" element={<Settings />} />
               </Route>
                <Route path="/sign-in" element={<SignIn></SignIn>}> </Route>
                 <Route path="/sign-up" element={<SignUp></SignUp>}> </Route>
            </Routes>
           </div>
           <Toaster richColors position="top-center"></Toaster>
      </main>
  )
}

export default App
