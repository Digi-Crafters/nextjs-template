"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

interface Item {
  id: string;
  name: string;
  imageUrl?: string | null;
}

const MyItemsPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/item");
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading items...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Items</h1>

      {items.length === 0 ? (
        <p className="text-gray-600">No items available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg shadow-sm p-4 flex flex-col items-center"
            >
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded mb-3"
                  width={500}
                  height={300}
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded mb-3">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}

              <h2 className="text-lg font-semibold text-center">{item.name}</h2>

              <div className="flex gap-2 mt-4 w-full">
                <Link
                  href={`/my-item/${item.id}`}
                  className="flex-1 bg-blue-500 text-white py-2 rounded text-center hover:bg-blue-600"
                >
                  View
                </Link>
                <Link
                  href={`/my-item/${item.id}/edit`}
                  className="flex-1 bg-yellow-500 text-white py-2 rounded text-center hover:bg-yellow-600"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyItemsPage;
