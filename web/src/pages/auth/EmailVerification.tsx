import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    const checkVerification = async () => {
      if (!user) return;

      try {
        const { isVerified } = await authApi.checkEmailVerification();
        setIsVerified(isVerified);
      } catch (error) {
        console.error("Error checking verification status:", error);
      }
    };

    checkVerification();
  }, [user]);

  const handleVerify = async () => {
    if (!token) {
      setError("Invalid verification token");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await authApi.verifyEmail({ token });
      setMessage("Email verified successfully");
      setIsVerified(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to verify email");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) {
      setError("No email address found");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await authApi.sendVerificationEmail({ email: user.email });
      setMessage("Verification email sent successfully");
    } catch (error: any) {
      setError(
        error.response?.data?.error || "Failed to send verification email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
          <p className="mt-2 text-gray-600">
            {isVerified
              ? "Your email has been verified successfully."
              : "Please verify your email address to continue."}
          </p>
        </div>

        {message && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!isVerified && (
          <div className="space-y-4">
            {token ? (
              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            ) : (
              <button
                onClick={handleResendVerification}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Resend Verification Email"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
