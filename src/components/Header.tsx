
import { Bitcoin } from "lucide-react";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-900 to-blue-700 text-white">
      <div className="flex items-center gap-2">
        <Bitcoin className="h-8 w-8 text-bitcoin" />
        <h1 className="text-2xl font-bold">Bitcoin Future Predictor</h1>
      </div>
      <div className="text-sm">
        Predicting the next 10 years using ML
      </div>
    </header>
  );
};

export default Header;
