import ThemeToggle from "../components/ThemeToggle";

export default function Topbar() {
  return (
    <header className="w-full h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 transition-colors duration-300">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Welcome to Valiflow
      </h2>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <img
          src="https://ui-avatars.com/api/?name=User"
          alt="User"
          className="w-8 h-8 rounded-full border dark:border-gray-700"
        />
      </div>
    </header>
  );
}
