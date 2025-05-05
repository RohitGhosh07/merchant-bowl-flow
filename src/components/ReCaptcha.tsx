
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

interface ReCaptchaProps {
  onVerify: () => void;
}

const ReCaptcha = ({ onVerify }: ReCaptchaProps) => {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // This is a mock implementation of reCAPTCHA verification
  const handleVerify = () => {
    setLoading(true);
    
    // Simulate verification delay
    setTimeout(() => {
      setVerified(true);
      setLoading(false);
      onVerify();
    }, 1500);
  };

  return (
    <div className="border rounded-md p-4 w-full max-w-sm bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 mr-2 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            <span className="transform -rotate-45">↺</span>
          </div>
          <span className="font-medium text-gray-700">reCAPTCHA</span>
        </div>
        <span className="text-xs text-gray-500">Privacy - Terms</span>
      </div>

      <div className="border-t pt-3">
        <div className="flex items-center">
          {verified ? (
            <>
              <div className="w-5 h-5 mr-2 bg-green-500 rounded-full flex items-center justify-center text-white">
                <CheckIcon size={12} />
              </div>
              <span className="text-green-500 text-sm">I'm not a robot</span>
            </>
          ) : (
            <>
              <input
                type="checkbox"
                id="not-robot"
                className="mr-2"
                checked={verified}
                onChange={() => {}}
                disabled={loading}
              />
              <label htmlFor="not-robot" className="text-gray-700 text-sm">
                I'm not a robot
              </label>
            </>
          )}

          {!verified && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleVerify}
              disabled={loading || verified}
              className="ml-auto text-xs"
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReCaptcha;
