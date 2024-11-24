"use client";
import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";

type User = {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    bio?: string;
    companyId?: string;
};

type addUser = {
    name: string;
    email?: string;
    phone?: string;
    bio?: string;
    Id: string;
}

type updateUser = {
    name: string;
    email?: string;
    phone?: string;
    bio?: string;
    id?: string;
    companyId?: string;
}

export default function EmployeeList() {
    const { companyid } = useAppSelector((state) => state.company);
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [companyName, setCompanyName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [newUser, setNewUser] = useState<addUser>({
        name: "",
        email: "",
        phone: "",
        bio: "",
        Id: companyid || ""
    });
    const [modifiedUser, setModifiedUser] = useState<updateUser | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined' && companyid) {
            fetchEmployees();
        }
    }, [companyid]);

    const fetchEmployees = async () => {
        try {
            const response = await fetch("/api/companies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ companyId: companyid }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch employees");
            }

            const data = await response.json();
            setUsers(data.users);
        } catch (error) {
            console.log(error);
            setError("Error Fetching Users");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const fetchCompanyName = async (companyId: string) => {
        try {
            const response = await fetch("/api/companyname", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: companyId }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch company name");
            }
            const data = await response.json();
            return data.companies.name;
        } catch (err) {
            console.error(err);
            setError("Error fetching company name");
            return null;
        }
    };

    const handleRead = async (user: User) => {
        if (selectedUser?._id === user._id) {
            setSelectedUser(null); 
            setCompanyName(null);
            return;
        }

        setSelectedUser(user);
        if (user.companyId) {
            const companyName = await fetchCompanyName(user.companyId);
            setCompanyName(companyName);
        } else {
            setCompanyName("N/A");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch("/api/deleteuser", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete user");
            }
            const data = await response.json();
            alert(data.message);
            fetchEmployees();
        } catch (err) {
            console.error(err);
            setError("Error deleting user");
        }
    };

    const handleCreateUser = async () => {
        try {
            const response = await fetch("/api/adduser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                throw new Error("Failed to create user");
            }
            const data = await response.json();
            alert(data.message);
            fetchEmployees(); 
            setShowForm(false); 
        } catch (err) {
            console.error(err);
            setError("Error creating user");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleUpdate = async (userId: string) => {
        const user = users.find((user) => user._id === userId);
        if (user && user._id) { 
            setModifiedUser({
                id: user._id || "",
                name: user.name,
                email: user.email || "",
                phone: user.phone || "",
                bio: user.bio || "",
                companyId: user.companyId || ""
            });
        }
    };

    const handleUpdateUser = async () => {
        if (!modifiedUser) return;
    
        try {
          const response = await fetch("/api/updateuser", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(modifiedUser),
          });
    
          if (!response.ok) {
            throw new Error("Failed to update user");
          }
          const data = await response.json();
          alert(data.message);
          fetchEmployees(); 
          setModifiedUser(null); 
        } catch (err) {
          console.error(err);
          setError("Error updating user");
        }
      };
    
      const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (modifiedUser) {
          setModifiedUser((prevState) => ({
            ...prevState,
            [name]: value,
          }));
        }
      };

    return (
        <div className="min-h-screen bg-gray-100 p-6 relative">
            <div className="absolute top-4 right-4 space-x-4">
                <button
                    onClick={() => router.push("/")}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Home
                </button>
                <button
                    onClick={() => setShowForm(!showForm)} 
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                    Create
                </button>
            </div>
            <h1 className="text-2xl font-bold mb-6 text-teal-600">Employee List</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {showForm && (
                <div className="bg-white p-4 shadow-md rounded-lg mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-teal-600">Create New User</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateUser();
                        }}
                    >
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-teal-700">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={newUser.name}
                                onChange={handleInputChange}
                                className={`w-full p-2 border rounded-lg mt-2 ${newUser.name ? 'text-blue-700' : ''}`}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-teal-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={newUser.email || ""}
                                onChange={handleInputChange}
                                className={`w-full p-2 border rounded-lg mt-2 ${newUser.email ? 'text-blue-700' : ''}`}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-teal-700">Phone</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={newUser.phone || ""}
                                onChange={handleInputChange}
                                className={`w-full p-2 border rounded-lg mt-2 ${newUser.phone ? 'text-blue-700' : ''}`}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="bio" className="block text-teal-700">Bio</label>
                            <input
                                type="text"
                                id="bio"
                                name="bio"
                                value={newUser.bio || ""}
                                onChange={handleInputChange}
                                className={`w-full p-2 border rounded-lg mt-2 ${newUser.bio ? 'text-blue-700' : ''}`}
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Create User
                        </button>
                    </form>
                </div>
            )}
            <div className="space-y-4">
                {users.map((user) => (
                    <div key={user._id} className="p-4 bg-white shadow-md rounded-lg">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="font-semibold text-blue-500">{user.name}</span>
                                {selectedUser?._id === user._id && (
                                    <div className="p-4 bg-blue-100 rounded-lg mt-2">
                                        <p className="text-teal-700">Email: {user.email || "N/A "}</p>
                                        <p className="text-teal-700">Phone: {user.phone || "N/A"}</p>
                                        <p className="text-teal-700">Bio: {user.bio || "N/A"}</p>
                                        <p className="text-teal-700">Company Name: {companyName || "Fetching..."}</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleRead(user)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    {selectedUser?._id === user._id ? "Hide Details" : "Read"}
                                </button>
                                <button
                                    onClick={() => handleDelete(user._id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleUpdate(user._id)}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                >
                                    Update
                                </button>
                            </div>
                        </div>

                        {/* Update Form */}
                        {modifiedUser && modifiedUser.id === user._id && (
                            <div className="bg-white p-4 shadow-md rounded-lg mt-4">
                                <h2 className="text-xl font-semibold mb-4 text-teal-600">Update Company</h2>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleUpdateUser();
                                    }}
                                >
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-teal-700">Company Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={modifiedUser.name}
                                            onChange={handleEditInputChange}
                                            className={`w-full p-2 border rounded-lg mt-2 ${modifiedUser.name ? 'text-blue-700' : ''}`}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-teal-700">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={modifiedUser.email}
                                            onChange={handleEditInputChange}
                                            className={`w-full p-2 border rounded-lg mt-2 ${modifiedUser.email ? 'text-blue-700' : ''}`}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="phone" className="block text-teal-700">Phone</label>
                                        <input
                                            type="text"
                                            id="phone"
                                            name="phone"
                                            value={modifiedUser.phone}
                                            onChange={handleEditInputChange}
                                            className={`w-full p-2 border rounded-lg mt-2 ${modifiedUser.phone ? 'text-blue-700' : ''}`}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="bio" className="block text-teal-700">Bio</label>
                                        <input
                                            type="text"
                                            id="bio"
                                            name="bio"
                                            value={modifiedUser.bio}
                                            onChange={handleEditInputChange}
                                            className={`w-full p-2 border rounded-lg mt-2 ${modifiedUser.bio ? 'text-blue-700' : ''}`}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        Update User
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
