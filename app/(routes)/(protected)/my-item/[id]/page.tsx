"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
}

interface Item {
  id: string;
  name: string;
  description?: string | null;
  price?: string | null;
  imageUrl?: string | null;
  rating?: string | null;
  category?: Category | null;
}

const ItemDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [item, setItem] = useState<Item | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Editable fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const fetchItem = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/item/${id}`);
      if (res.data.success) {
        const data = res.data.data;
        setItem(data);
        setName(data.name || "");
        setDescription(data.description || "");
        setPrice(data.price || "");
        setRating(data.rating || "");
        setImageUrl(data.imageUrl || "");
        setCategoryId(data.category?.id || "");
      }
    } catch (error) {
      console.error("Error fetching item:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/category");
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleUpdate = async () => {
    if (!item) return;
    try {
      const res = await axios.put(`/api/item/${item.id}`, {
        name,
        description,
        price,
        rating,
        imageUrl,
        categoryId: categoryId || null,
      });
      if (res.data.success) {
        alert("Item updated successfully!");
        setItem(res.data.data);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDelete = async () => {
    if (!item) return;
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await axios.delete(`/api/item/${item.id}`);
      if (res.data.success) {
        router.push("/my-items");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    fetchItem();
    fetchCategories();
  }, [fetchItem, id]);

  if (loading) return <div className="p-6 text-gray-500">Loading item...</div>;
  if (!item) return <div className="p-6 text-red-500">Item not found.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Item</h1>

      {/* Current Image Preview */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={name}
          className="w-full h-60 object-cover rounded mb-4"
          width={500}
          height={300}
        />
      )}

      {/* Editable Form */}
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Price</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Rating</label>
          <input
            type="text"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleUpdate}
          className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Delete Item
        </button>
      </div>
    </div>
  );
};

export default ItemDetailsPage;
