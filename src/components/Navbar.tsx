import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

interface NavbarProps {
  showTrackingButton?: boolean;
}

const Navbar = ({ showTrackingButton = true }: NavbarProps) => {
  return (
    <header className="bg-white border-b py-3 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              {/* Tournament Logo */}
              <img
                src="/logo.jpeg"
                alt="Tournament Logo"
                className="h-12 w-auto rounded-lg shadow-sm"
              />
              {/* RCGC Logo */}
              <img
                src="/rcgc.jpeg"
                alt="RCGC Logo"
                className="h-12 w-auto rounded-lg shadow-sm"
              />
            </div>
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <div>
                <h1 className="text-xl md:text-2xl font-serif font-bold text-gray-900">
                  38th Merchants Cup
                </h1>
                <p className="text-sm text-gray-600">2025-26</p>
              </div>
            </Link>
          </div>          <div className="flex items-center gap-3">
            <Link to="/track">
              <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <Search className="w-4 h-4 mr-2" />
                Track Your Registration
              </Button>
            </Link>
            <Link to="/">
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                Register Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
