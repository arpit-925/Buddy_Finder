import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasRun = useRef(false); // ⛔ prevent double run

  useEffect(() => {
    if (!token || token === "undefined" || hasRun.current) return;

    hasRun.current = true;

    const verify = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);
        toast.success("Email verified successfully 🎉");
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Invalid or expired verification link"
        );
      } finally {
        navigate("/login", { replace: true });
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Verifying your email...</p>
    </div>
  );
};

export default VerifyEmail;
