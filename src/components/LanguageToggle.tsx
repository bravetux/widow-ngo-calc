import { Languages } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      aria-label={language === "en" ? "Switch to Tamil" : "Switch to English"}
      className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-1 py-1 text-sm font-medium shadow-sm transition-all hover:shadow-md hover:border-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
    >
      <Languages className="h-4 w-4 text-teal-600 ml-2 hidden sm:block" />
      <span className="flex items-center rounded-full overflow-hidden">
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
            language === "en"
              ? "bg-teal-600 text-white shadow"
              : "text-teal-700 hover:bg-teal-50"
          }`}
        >
          EN
        </span>
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
            language === "ta"
              ? "bg-teal-600 text-white shadow"
              : "text-teal-700 hover:bg-teal-50"
          }`}
        >
          தமிழ்
        </span>
      </span>
    </button>
  );
}
