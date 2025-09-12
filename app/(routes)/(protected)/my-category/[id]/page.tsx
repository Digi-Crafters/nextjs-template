"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";

interface Item {
  id: string;
  name: string;
  description?: string | null;
  price?: string | null;
  imageUrl?: string | null;
  rating?: string | null;
}

interface Category {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  price?: string | null;
  rating?: string | null;
  items: Item[];
}

const SingleCategoryPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/category/${id}`);
      if (res.data.success) {
        setCategory(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching category:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCategory();
  }, [id]);

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!category) return <div className="p-6 text-red-500">Category not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      {category.description && <p className="mb-4 text-gray-600">{category.description}</p>}

      {/* Items Section */}
      <h2 className="text-2xl font-semibold mb-3">Items</h2>
      {category.items.length === 0 ? (
        <p className="text-gray-500">No items found in this category.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {category.items.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded mb-3"
                  height={100}
                  width={100}
                />
              )}
              <h3 className="text-lg font-bold">{item.name}</h3>
              {item.description && (
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              )}
              {item.price && (
                <p className="text-sm font-semibold">Price: {item.price}</p>
              )}
              {item.rating && (
                <p className="text-sm text-yellow-600">⭐ {item.rating}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleCategoryPage;
