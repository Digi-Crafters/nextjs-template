"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  price?: string | null;
  rating?: string | null;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/category");
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle update
  const handleUpdate = async (
    id: string,
    updatedCategory: Partial<Category>
  ) => {
    try {
      const res = await axios.put(`/api/category/${id}`, updatedCategory); // ✅ singular
      if (res.data.success) {
        fetchCategories(); // refresh list
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/category/${id}`); // ✅ singular
      if (res.data.success) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading)
    return <div className="p-6 text-gray-500">Loading categories...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col md:flex-row gap-3 items-center border p-4 rounded-lg shadow-sm"
          >
            {/* Editable fields */}
            <input
              type="text"
              value={cat.name}
              onChange={(e) =>
                setCategories((prev) =>
                  prev.map((c) =>
                    c.id === cat.id ? { ...c, name: e.target.value } : c
                  )
                )
              }
              className="border p-2 rounded w-full md:w-40"
            />
            <input
              type="text"
              value={cat.description || ""}
              placeholder="Description"
              onChange={(e) =>
                setCategories((prev) =>
                  prev.map((c) =>
                    c.id === cat.id ? { ...c, description: e.target.value } : c
                  )
                )
              }
              className="border p-2 rounded w-full md:w-60"
            />
            <input
              type="text"
              value={cat.price || ""}
              placeholder="Price"
              onChange={(e) =>
                setCategories((prev) =>
                  prev.map((c) =>
                    c.id === cat.id ? { ...c, price: e.target.value } : c
                  )
                )
              }
              className="border p-2 rounded w-24"
            />
            <input
              type="text"
              value={cat.rating || ""}
              placeholder="Rating"
              onChange={(e) =>
                setCategories((prev) =>
                  prev.map((c) =>
                    c.id === cat.id ? { ...c, rating: e.target.value } : c
                  )
                )
              }
              className="border p-2 rounded w-24"
            />

            {/* Actions */}
            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                onClick={() => handleUpdate(cat.id, cat)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
              <Link
                href={`/my-category/${cat.id}`}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
