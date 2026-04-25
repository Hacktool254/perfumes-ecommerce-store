"use client";

import { useEffect, useRef } from "react";
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
import { X, Save, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Id } from "@workspaceRoot/convex/_generated/dataModel";
import { ImageUploader } from "@/components/admin/image-uploader";

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
    const [generatingDesc, setGeneratingDesc] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const categories = useQuery(api.categories.list);

    const createProduct = useMutation(api.products.create);
    const updateProduct = useMutation(api.products.update);
    const generateDescription = useAction(api.adminActions.generateProductDescription);

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

    const name = form.watch("name");
    const brand = form.watch("brand");
    const gender = form.watch("gender");
    const categoryId = form.watch("categoryId");

    useEffect(() => {
        if (!initialData && name) {
            const generatedSlug = name
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, "")
                .replace(/[\s_-]+/g, "-")
                .replace(/^-+|-+$/g, "");
            form.setValue("slug", generatedSlug, { shouldValidate: true });
        }
    }, [name, form, initialData]);

    // Auto-generate description when name is long enough (debounced, new products only)
    useEffect(() => {
        if (initialData) return; // don't overwrite existing descriptions
        if (!name || name.trim().length < 3) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            const categoryName = categories?.find(c => c._id === categoryId)?.name;
            try {
                setGeneratingDesc(true);
                const desc = await generateDescription({
                    name: name.trim(),
                    brand: brand || undefined,
                    gender: gender || undefined,
                    categoryName: categoryName || undefined,
                });
                if (desc) form.setValue("description", desc, { shouldValidate: true });
            } catch {
                // Fail silently — user can still type manually
            } finally {
                setGeneratingDesc(false);
            }
        }, 1200); // wait 1.2s after user stops typing

        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, brand, gender, categoryId]);

    async function handleRegenerateDescription() {
        if (!name || name.trim().length < 3) return;
        const categoryName = categories?.find(c => c._id === categoryId)?.name;
        try {
            setGeneratingDesc(true);
            const desc = await generateDescription({
                name: name.trim(),
                brand: brand || undefined,
                gender: gender || undefined,
                categoryName: categoryName || undefined,
            });
            if (desc) form.setValue("description", desc, { shouldValidate: true });
        } catch {
            // Fail silently
        } finally {
            setGeneratingDesc(false);
        }
    }

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
            router.push("/products");
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
                        <Link href="/products">
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
                                            <div className="flex items-center justify-between mb-1.5">
                                                <FormLabel className="text-neutral-400 mb-0">Description</FormLabel>
                                                <button
                                                    type="button"
                                                    onClick={handleRegenerateDescription}
                                                    disabled={generatingDesc || !name || name.trim().length < 3}
                                                    className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    {generatingDesc ? (
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : (
                                                        <Sparkles className="w-3 h-3" />
                                                    )}
                                                    {generatingDesc ? "Generating..." : "AI Generate"}
                                                </button>
                                            </div>
                                            <FormControl>
                                                <div className="relative">
                                                    <Textarea
                                                        {...field}
                                                        className={cn(
                                                            "bg-neutral-800 border-neutral-700 focus-visible:ring-primary/50 min-h-[150px] leading-relaxed transition-opacity",
                                                            generatingDesc && "opacity-50"
                                                        )}
                                                        placeholder="Describe the olfactory journey..."
                                                    />
                                                    {generatingDesc && (
                                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                            <div className="flex items-center gap-2 bg-neutral-900/80 px-3 py-1.5 rounded-full">
                                                                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                                                                <span className="text-xs text-neutral-300 font-serif italic">Writing description...</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
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
                                <p className="text-sm text-neutral-500">Add up to 5 high-resolution images. First image will be the primary cover.</p>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                                    {images.map((src, i) => (
                                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-700 group ring-1 ring-white/5">
                                            <Image src={src} alt="Product preview" fill className="object-cover transition-transform group-hover:scale-110 duration-500" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                                                    className="p-2 rounded-full bg-red-500 text-white shadow-lg transform hover:scale-110 transition-transform"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {i === 0 && (
                                                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary/90 text-[8px] font-bold text-primary-foreground rounded uppercase tracking-widest">
                                                    Primary
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {images.length < 5 && (
                                    <ImageUploader
                                        maxFiles={5 - images.length}
                                        onUploadComplete={(urls) => {
                                            setImages(prev => [...prev, ...urls].slice(0, 5));
                                        }}
                                    />
                                )}
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
