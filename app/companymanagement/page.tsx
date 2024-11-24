"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { setCompanyId } from "@/lib/features/companyIdSlice";

type Company = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
};

type addCompany = {
    name: string;
    email?: string;
    phone?: string;
    bio?: string;
}

type updateCompany = {
    id?: string; // Make _id optional
    name: string;
    email?: string;
    phone?: string;
    bio?: string;
}
  

export default function CompanyManagement(){
    const dispatch = useAppDispatch();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false); // State to toggle the add form
  const [newCompany, setNewCompany] = useState<addCompany>({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [editCompany, setEditCompany] = useState<updateCompany | null>(null); // For update form
  const router = useRouter();

  // Fetch companies on load
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/company");
      if (!response.ok) {
        throw new Error("Failed to fetch companies");
      }
      const data = await response.json();
      setCompanies(data.companies);
    } catch (err) {
      console.error(err);
      setError("Error fetching companies");
    }
  };

  const handleRead = (company: Company) => {
    if (selectedCompany?._id === company._id) {
      setSelectedCompany(null); // Toggle off details if already selected
      return;
    }
    setSelectedCompany(company);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/deletecompany", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete company");
      }
      const data = await response.json();
      alert(data.message);
      fetchCompanies(); // Refresh company list
    } catch (err) {
      console.error(err);
      setError("Error deleting company");
    }
  };

  const handleCreateCompany = async () => {
    try {
      const response = await fetch("/api/addcompany", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCompany),
      });

      if (!response.ok) {
        throw new Error("Failed to create company");
      }
      const data = await response.json();
      alert(data.message);
      fetchCompanies(); // Refresh company list
      setShowForm(false); // Close the form
    } catch (err) {
      console.error(err);
      setError("Error creating company");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCompany((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async (companyId: string) => {
    // Fetch the company data using the company ID
    const company = companies.find((company) => company._id === companyId);
    if (company && company._id) {  // Ensure _id is defined
      setEditCompany({
        id: company._id,
        name: company.name,
        email: company.email || "",
        phone: company.phone || "",
        bio: company.bio || "",
      });
    }
  };
  
  const handleUpdateCompany = async () => {
    if (!editCompany) return;

    try {
      const response = await fetch("/api/updatecompany", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editCompany),
      });

      if (!response.ok) {
        throw new Error("Failed to update company");
      }
      const data = await response.json();
      alert(data.message);
      fetchCompanies(); // Refresh company list
      setEditCompany(null); // Close the update form
    } catch (err) {
      console.error(err);
      setError("Error updating company");
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editCompany) {
      setEditCompany((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  function handleEmployee(id: string) {
    dispatch(setCompanyId(id))
    console.log(id);
    
    router.push('/employeelist')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* Home and Create Buttons */}
      <div className="absolute top-4 right-4 space-x-4">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Home
        </button>
        <button
          onClick={() => setShowForm(!showForm)} // Toggle form visibility
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Create
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-teal-600">Company Management</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Company Create Form */}
      {showForm && (
        <div className="bg-white p-4 shadow-md rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-teal-600">Create New Company</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateCompany();
            }}
          >
            <div className="mb-4">
              <label htmlFor="name" className="block text-teal-700">Company Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCompany.name}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-lg mt-2 ${newCompany.name ? 'text-blue-700' : ''}`}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-teal-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newCompany.email || ""}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-lg mt-2 ${newCompany.email ? 'text-blue-700' : ''}`}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-teal-700">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={newCompany.phone || ""}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-lg mt-2 ${newCompany.phone ? 'text-blue-700' : ''}`}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="bio" className="block text-teal-700">Bio</label>
              <input
                type="text"
                id="bio"
                name="bio"
                value={newCompany.bio || ""}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-lg mt-2 ${newCompany.bio ? 'text-blue-700' : ''}`}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create Company
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {companies.map((company) => (
          <div key={company._id} className="p-4 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="font-semibold text-blue-500">{company.name}</span>
                {/* Company details will be displayed here */}
                {selectedCompany?._id === company._id && (
                  <div className="p-4 bg-blue-100 rounded-lg mt-2">
                    <p className="text-teal-700">Email: {company.email || "N/A "}</p>
                    <p className="text-teal-700">Phone: {company.phone || "N/A"}</p>
                    <p className="text-teal-700">Bio: {company.bio || "N/A"}</p>
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRead(company)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  {selectedCompany?._id === company._id ? "Hide Details" : "Read"}
                </button>
                <button
                  onClick={() => handleDelete(company._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleUpdate(company._id)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleEmployee(company._id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Employees
                </button>
              </div>
            </div>

            {/* Update Form */}
            {editCompany && editCompany.id === company._id && (
              <div className="bg-white p-4 shadow-md rounded-lg mt-4">
                <h2 className="text-xl font-semibold mb-4 text-teal-600">Update Company</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateCompany();
                  }}
                >
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-teal-700">Company Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editCompany.name}
                      onChange={handleEditInputChange}
                      className={`w-full p-2 border rounded-lg mt-2 ${editCompany.name ? 'text-blue-700' : ''}`}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-teal-700">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editCompany.email}
                      onChange={handleEditInputChange}
                      className={`w-full p-2 border rounded-lg mt-2 ${editCompany.email ? 'text-blue-700' : ''}`}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-teal-700">Phone</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={editCompany.phone}
                      onChange={handleEditInputChange}
                      className={`w-full p-2 border rounded-lg mt-2 ${editCompany.phone ? 'text-blue-700' : ''}`}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="bio" className="block text-teal-700">Bio</label>
                    <input
                      type="text"
                      id="bio"
                      name="bio"
                      value={editCompany.bio}
                      onChange={handleEditInputChange}
                      className={`w-full p-2 border rounded-lg mt-2 ${editCompany.bio ? 'text-blue-700' : ''}`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Update Company
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


