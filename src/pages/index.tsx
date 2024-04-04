import MissionCard from "@/components/missions/missioncard";
import Login from "@/components/auth/login/login";

export default function Home() {
  return (
    <div className="max-w-screen-2xl mx-auto h-full">
      <Login />
      {/* Header */}
      <header className="bg-gray-900 text-white py-4 px-6 h-1/4 rounded-b-lg">
        {/* Your header content goes here */}
        <h1>Music Guess App</h1>
      </header>

      {/* Body */}
      <div className="flex mt-4 h-[90vh]">
        {/* Left Side */}
        <aside className="w-1/4 bg-gray-800 p-4 rounded-l-lg">
          {/* Your left side content goes here */}
          <h2>Left Side</h2>
        </aside>

        {/* Main Content */}
        <main className="w-1/2 bg-gray-700 p-4">
          {/* Your main content goes here */}
          <h2>Main Content</h2>
        </main>

        {/* Right Side */}
        <aside className="w-1/4 bg-gray-800 p-4 rounded-r-lg flex flex-col gap-3">
          {/* Your right side content goes here */}
          <h2>Missons</h2>
          <MissionCard missions={[
            {
              id: 1,
              title: "Müzik Ustası",
              description: "10 şarkıyı doğru tahmin et",
              missionToComplete: 10,
              missionCompleted: 5,
            },
            {
              id: 2,
              title: "Virtüöz",
              description: "20 şarkıyı doğru tahmin et",
              missionToComplete: 20,
              missionCompleted: 10,
            },
          ]} />
        </aside>
      </div>
    </div>
  );
}