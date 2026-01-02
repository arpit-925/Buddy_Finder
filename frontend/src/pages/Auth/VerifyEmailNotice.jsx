import { Link } from "react-router-dom";

const VerifyEmailNotice = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        
        <div className="text-5xl mb-4">📧</div>

        <h2 className="text-2xl font-bold mb-2">
          Verify your email
        </h2>

        <p className="text-gray-600 mb-6">
          We’ve sent a verification link to your email address.
          Please check your inbox and verify your email to continue.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Didn’t receive the email?  
          Check your spam folder or try again later.
        </p>

        <Link
          to="/login"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailNotice;
