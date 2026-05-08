"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Upload, X, ImagePlus } from "lucide-react";
import { createListingSchema, type CreateListingInput } from "@gharka/shared";
import { CATEGORY_DISPLAY_NAMES, type FoodCategory } from "@gharka/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ListingCard } from "./listing-card";
import { useLocationStore } from "@/store/location-store";
import { cn } from "@/lib/utils";

interface ListingFormProps {
  onSubmit: (data: CreateListingInput) => void;
  isLoading?: boolean;
  initialData?: Partial<CreateListingInput>;
}

export function ListingForm({
  onSubmit,
  isLoading,
  initialData,
}: ListingFormProps) {
  const { latitude, longitude } = useLocationStore();
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    initialData?.images || []
  );
  const [dragOver, setDragOver] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateListingInput>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      quantity: initialData?.quantity || 1,
      category: initialData?.category || "OTHER",
      images: initialData?.images || [],
      location: {
        latitude: latitude || 0,
        longitude: longitude || 0,
      },
    },
  });

  const watchedTitle = watch("title");
  const watchedPrice = watch("price");
  const watchedCategory = watch("category");

  const handleImageUpload = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      // In production, upload to Cloudinary/S3. Here we create object URLs as placeholders.
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      const all = [...uploadedImages, ...newImages].slice(0, 5);
      setUploadedImages(all);
      setValue("images", all);
    },
    [uploadedImages, setValue]
  );

  const removeImage = (index: number) => {
    const updated = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updated);
    setValue("images", updated);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const submitHandler = (data: CreateListingInput) => {
    onSubmit({
      ...data,
      images: uploadedImages,
      location: {
        latitude: latitude || 0,
        longitude: longitude || 0,
      },
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium font-body text-charcoal">
            Photos (up to 5)
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={cn(
              "relative rounded-xl border-2 border-dashed transition-colors p-6",
              dragOver
                ? "border-turmeric bg-turmeric-light/30"
                : "border-mist hover:border-ash"
            )}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Upload food photos"
            />
            <div className="flex flex-col items-center gap-2 text-center">
              <Upload className="h-8 w-8 text-ash" />
              <p className="text-sm font-body text-slate">
                Drag photos here or{" "}
                <span className="text-turmeric font-medium">browse</span>
              </p>
            </div>
          </div>

          {uploadedImages.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-3">
              {uploadedImages.map((url, i) => (
                <div key={i} className="relative h-20 w-20 rounded-xl overflow-hidden group">
                  <img
                    src={url}
                    alt={`Upload ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-charcoal/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove image ${i + 1}`}
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
              {uploadedImages.length < 5 && (
                <label className="relative h-20 w-20 rounded-xl border-2 border-dashed border-mist flex items-center justify-center cursor-pointer hover:border-ash transition-colors">
                  <ImagePlus className="h-6 w-6 text-ash" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="sr-only"
                    aria-label="Add another photo"
                  />
                </label>
              )}
            </div>
          )}
          {errors.images && (
            <p className="text-sm text-error">{errors.images.message}</p>
          )}
        </div>

        <Input
          label="Dish Name"
          placeholder="e.g., Homemade Biryani"
          error={errors.title?.message}
          {...register("title")}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium font-body text-charcoal">
            Description
          </label>
          <textarea
            placeholder="Tell buyers about your dish - ingredients, taste, serving size..."
            rows={3}
            className={cn(
              "flex w-full rounded-xl border border-mist bg-white px-4 py-3 font-body text-base text-charcoal placeholder:text-ash",
              "transition-all duration-200 resize-none",
              "focus:outline-none focus:ring-2 focus:ring-turmeric/40 focus:border-turmeric",
              errors.description && "border-error"
            )}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-error">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price (INR)"
            type="number"
            placeholder="e.g., 150"
            error={errors.price?.message}
            {...register("price", { valueAsNumber: true })}
          />
          <Input
            label="Quantity"
            type="number"
            placeholder="e.g., 10"
            error={errors.quantity?.message}
            {...register("quantity", { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium font-body text-charcoal">
            Category
          </label>
          <select
            className="flex h-11 w-full rounded-xl border border-mist bg-white px-4 py-2 font-body text-base text-charcoal focus:outline-none focus:ring-2 focus:ring-turmeric/40 focus:border-turmeric"
            {...register("category")}
          >
            {Object.entries(CATEGORY_DISPLAY_NAMES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-error">{errors.category.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
        >
          {initialData ? "Update Listing" : "Create Listing"}
        </Button>
      </form>

      {/* Live Preview */}
      <div className="hidden lg:block">
        <p className="text-sm font-body text-slate mb-3">Live Preview</p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-xs"
        >
          <Card>
            <CardContent className="p-0">
              <ListingCard
                id="preview"
                title={watchedTitle || "Your dish name"}
                images={uploadedImages}
                price={watchedPrice || 0}
                category={watchedCategory || "OTHER"}
                sellerName="You"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
