import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react"; // Added useContext
import api from "../../services/api";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext"; // Added AuthContext import

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ✅ Initialize login function
  const hasRun = useRef(false);

  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    if (!token || token === "undefined" || hasRun.current) return;

    hasRun.current = true;

    const verify = async () => {
      try {
        // 1. Call the backend API
        const response = await api.get(`/auth/verify-email/${token}`);
        
        // 2. ✅ Auto-login: Pass the backend response (which now includes token/user) to context
        login(response.data); 

        setStatus("success");
        toast.success("Verified! Welcome to Buddy Finder 🎉");

        // 3. ✅ Automatic redirect to dashboard
        setTimeout(() => {
          // navigate("/dashboard", { replace: true }); 
          navigate("/",{replace:true});
        }, 2000);
      } catch (err) {
        setStatus("error");
        toast.error(
          err.response?.data?.message || "Invalid or expired verification link"
        );
      }
    };

    verify();
  }, [token, navigate, login]); // Added login to dependency array

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="p-8 bg-white shadow-lg rounded-xl text-center">
        {status === "verifying" && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Verifying your email...</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Email Verified!</h2>
            <p className="text-gray-500">Taking you to your dashboard now...</p>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
            <p className="text-gray-500 mb-6">The link is invalid or has expired.</p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;