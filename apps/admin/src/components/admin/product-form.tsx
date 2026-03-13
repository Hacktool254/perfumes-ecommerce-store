"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Id } from "@workspaceRoot/convex/_generated/dataModel";

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    price: z.preprocess((val) => Number(val), z.number().min(0, "Price must be at least 0")),
    stock: z.preprocess((val) => Number(val), z.number().min(0, "Stock must be at least 0")),
    categoryId: z.string().min(1, "Category is required"),
    brand: z.string().min(1, "Brand is required"),
    gender: z.enum(["men", "women", "unisex"]),
    isActive: z.boolean().default(true),
    description: z.string().min(10, "Description should be at least 10 characters"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const categories = useQuery(api.categories.list);

    const createProduct = useMutation(api.products.create);
    const updateProduct = useMutation(api.products.update);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: initialData ? {
            name: initialData.name,
            slug: initialData.slug,
            price: initialData.price,
            stock: initialData.stock,
            categoryId: initialData.categoryId,
            brand: initialData.brand || "Ummie's Essence",
            gender: initialData.gender || "unisex",
            isActive: initialData.isActive ?? true,
            description: initialData.description,
        } : {
            name: "",
            slug: "",
            price: 0,
            stock: 0,
            categoryId: "",
            brand: "Ummie's Essence",
            gender: "unisex",
            isActive: true,
            description: "",
        },
    });

    const onSubmit = async (data: ProductFormValues) => {
        try {
            const payload = {
                ...data,
                categoryId: data.categoryId as Id<"categories">,
                images,
            };
            if (initialData) {
                await updateProduct({
                    id: initialData._id,
                    ...payload,
                });
            } else {
                await createProduct(payload);
            }
            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            console.error("Failed to save product", error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/products">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-neutral-800">
                                <ArrowLeft className="w-5 h-5 text-neutral-400" />
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-serif font-bold text-white">
                            {initialData ? "Edit Fragrance" : "Add New Fragrance"}
                        </h1>
                    </div>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-full px-8">
                        <Save className="w-4 h-4" />
                        {initialData ? "Update product" : "Save product"}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Main Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="bg-neutral-900 border-neutral-800">
                            <CardHeader>
                                <CardTitle className="text-lg font-serif">General Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-neutral-400">Product Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="bg-neutral-800 border-neutral-700 focus-visible:ring-primary/50" placeholder="e.g. Golden Sands Edition" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-neutral-400">URL Slug</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-neutral-800 border-neutral-700 font-mono text-sm" placeholder="golden-sands-edition" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="categoryId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-neutral-400">Category</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-neutral-800 border-neutral-700">
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                                                        {categories?.map((cat) => (
                                                            <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="brand"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-neutral-400">Brand</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-neutral-800 border-neutral-700 focus-visible:ring-primary/50" placeholder="e.g. Ummie's Essence" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-neutral-400">Gender</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-neutral-800 border-neutral-700">
                                                            <SelectValue placeholder="Select gender" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                                                        <SelectItem value="men">Men</SelectItem>
                                                        <SelectItem value="women">Women</SelectItem>
                                                        <SelectItem value="unisex">Unisex</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-neutral-400">Description</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} className="bg-neutral-800 border-neutral-700 focus-visible:ring-primary/50 min-h-[150px] leading-relaxed" placeholder="Describe the olfactory journey..." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card className="bg-neutral-900 border-neutral-800">
                            <CardHeader>
                                <CardTitle className="text-lg font-serif">Product Imagery</CardTitle>
                                <FormDescription className="text-neutral-500">Add up to 5 high-resolution images. First image will be the primary cover.</FormDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {images.map((src, i) => (
                                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-700 group">
                                            <Image src={src} alt="Product preview" fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                                                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {images.length < 5 && (
                                        <button
                                            type="button"
                                            className="aspect-square rounded-xl border-2 border-dashed border-neutral-800 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 text-neutral-500 hover:text-primary group"
                                        >
                                            <Upload className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] uppercase font-bold tracking-widest">Upload</span>
                                        </button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Inventory & Status */}
                    <div className="space-y-8">
                        <Card className="bg-neutral-900 border-neutral-800">
                            <CardHeader>
                                <CardTitle className="text-lg font-serif">Inventory & Pricing</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-neutral-400">Price (KES)</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">KES</span>
                                                    <Input {...field} type="number" className="bg-neutral-800 border-neutral-700 pl-12 focus-visible:ring-primary/50" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="stock"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-neutral-400">Initial Stock</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" className="bg-neutral-800 border-neutral-700 focus-visible:ring-primary/50" />
                                            </FormControl>
                                            <FormDescription className="text-[10px] text-neutral-500">Available units in the warehouse.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <Card className="bg-neutral-900 border-neutral-800 overflow-hidden">
                                    <div className="p-4 bg-primary/5 border-b border-primary/10">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Visibility</h3>
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-white">Publicly Visible</p>
                                                <p className="text-xs text-neutral-500">Show this product in the shop catalog.</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => field.onChange(!field.value)}
                                                className={cn(
                                                    "w-10 h-6 rounded-full flex items-center p-1 transition-colors",
                                                    field.value ? "bg-primary justify-end" : "bg-neutral-700 justify-start"
                                                )}
                                            >
                                                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        />
                    </div>
                </div>
            </form>
        </Form>
    );
}
