import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        setTimeout(() => Navigate('/auth/login'), 1000);
      } else {
        toast.error(data?.payload?.message);
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-8 px-4 sm:px-0">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Welcome Back
        </h1>
        <p className="mt-3 text-gray-500">
          Sign in to your account to continue
        </p>
      </div>
      
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
        <CommonForm
          formControls={loginFormControls}
          buttonText={"Sign In"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
              to="/auth/register"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-500 flex items-center justify-center mt-6">
        <svg className="h-4 w-4 mr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Secure Authentication
      </div>
    </div>
  );
}

export default AuthLogin;