import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  const [status, setStatus] = useState("verifying"); // verifying | success | error

  useEffect(() => {
    if (!token || token === "undefined" || hasRun.current) return;

    hasRun.current = true;

    const verify = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);

        setStatus("success");
        toast.success("Email verified successfully 🎉");

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2500);
      } catch (err) {
        setStatus("error");
        toast.error(
          err.response?.data?.message || "Invalid or expired verification link"
        );
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {status === "verifying" && (
        <p className="text-lg">🔄 Verifying your email...</p>
      )}

      {status === "success" && (
        <p className="text-lg text-green-600">
          ✅ Email verified! Redirecting to login...
        </p>
      )}

      {status === "error" && (
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">
            ❌ Verification failed or link expired
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
