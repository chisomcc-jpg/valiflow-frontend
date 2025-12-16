export default function NotFound() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center px-6">
      <h1 className="text-6xl font-extrabold text-blue-600 dark:text-blue-500 mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Sidan kunde inte hittas
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        Oj! Sidan du letar efter verkar inte finnas. Kolla länken eller gå
        tillbaka till startsidan.
      </p>

      <a
        href={isLoggedIn ? "/dashboard" : "/"}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {isLoggedIn ? "Tillbaka till dashboard" : "Tillbaka till startsidan"}
      </a>
    </div>
  );
}
