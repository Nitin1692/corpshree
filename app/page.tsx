"use client"

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  function handleuser(event: { preventDefault: () => void; }) {
    event.preventDefault(); 
    router.push('/usermanagement')
  }

  function handlecompany(event: { preventDefault: () => void; }){
    event.preventDefault();
    router.push('/companymanagement')
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center space-y-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Management Portal
        </h1>
        <div className="flex space-x-6 justify-center">
          <a
            className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 cursor-pointer"
            onClick={handleuser}
          >
            User Management
          </a>
          <a
            href="/companymanagement"
            className="px-8 py-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 cursor-pointer"
            onClick={handlecompany}
          >
            Company Management
          </a>
        </div>
      </div>
    </div>
  );
}
