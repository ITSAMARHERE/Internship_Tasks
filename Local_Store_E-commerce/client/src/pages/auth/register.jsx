import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner"; 

const initialState = {
    userName: '',
    email: '',
    password: ''
}

function AuthRegister() {
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function onSubmit(event) {
        event.preventDefault();
        dispatch(registerUser(formData)).then((data) => {
            console.log("Response Data:", data); 

            if (data?.payload?.success) {
                toast.success(data?.payload?.message); 
                setTimeout(() => navigate('/auth/login'), 1000); 
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                    Create Account
                </h1>
                <p className="mt-3 text-gray-500">
                    Join our community today
                </p>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
                <CommonForm
                    formControls={registerFormControls}
                    buttonText={"Create Account"}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={onSubmit}
                />
                
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link
                            className="font-semibold text-primary hover:text-primary/80 transition-colors"
                            to="/auth/login"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
            
            <div className="text-center text-xs text-gray-500 mt-6">
                <p>By creating an account, you agree to our</p>
                <p className="mt-1">
                    <span className="font-medium hover:underline cursor-pointer">Terms of Service</span>
                    {" & "}
                    <span className="font-medium hover:underline cursor-pointer">Privacy Policy</span>
                </p>
            </div>
        </div>
    );
}

export default AuthRegister;