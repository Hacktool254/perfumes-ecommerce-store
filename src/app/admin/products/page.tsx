"use client";

import { usePaginatedQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
    Plus,
    Search,
    MoreHorizontal,
    Pencil,
    Trash2,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";

export default function AdminProductsPage() {
    const { results: products, status, loadMore } = usePaginatedQuery(
        api.products.list,
        {},
        { initialNumItems: 20 }
    );

    const isLoading = status === "LoadingFirstPage";

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">Product Management</h1>
                    <p className="text-neutral-400">Manage your fragrance catalog, prices, and stock levels.</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-full px-6">
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <Input
                        placeholder="Search products..."
                        className="pl-10 bg-neutral-900 border-neutral-800 focus-visible:ring-primary/50 h-11"
                    />
                </div>
                <Button variant="outline" className="border-neutral-800 hover:bg-neutral-900 text-neutral-300">
                    Filters
                </Button>
            </div>

            {/* Products Table */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 shadow-xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-neutral-800/50">
                        <TableRow className="hover:bg-transparent border-neutral-800">
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead className="text-neutral-300">Name</TableHead>
                            <TableHead className="text-neutral-300">Category</TableHead>
                            <TableHead className="text-neutral-300">Price</TableHead>
                            <TableHead className="text-neutral-300">Stock</TableHead>
                            <TableHead className="text-neutral-300">Status</TableHead>
                            <TableHead className="text-right text-neutral-300">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Loading skeletons
                            [1, 2, 3, 4, 5].map((i) => (
                                <TableRow key={i} className="border-neutral-800 animate-pulse">
                                    <TableCell><div className="w-12 h-12 bg-neutral-800 rounded-lg" /></TableCell>
                                    <TableCell><div className="h-4 w-32 bg-neutral-800 rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-20 bg-neutral-800 rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-16 bg-neutral-800 rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-12 bg-neutral-800 rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-16 bg-neutral-800 rounded" /></TableCell>
                                    <TableCell><div className="h-8 w-8 bg-neutral-800 rounded ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20 text-neutral-500 font-serif italic">
                                    No fragrances found in the essence vault.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product._id} className="border-neutral-800 hover:bg-neutral-800/30 transition-colors group">
                                    <TableCell>
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-neutral-800">
                                            <Image
                                                src={product.images[0] || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=100&auto=format&fit=crop"}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-medium text-white group-hover:text-primary transition-colors">{product.name}</p>
                                        <p className="text-xs text-neutral-500">Slug: {product.slug}</p>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs px-2 py-1 rounded bg-neutral-800 text-neutral-400">
                                            {product.categoryId || "Fragrance"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">
                                        KES {product.price.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "w-2 h-2 rounded-full",
                                                product.stock > 10 ? "bg-green-500" : product.stock > 0 ? "bg-yellow-500" : "bg-red-500"
                                            )} />
                                            <span className="text-sm">{product.stock}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-tighter">
                                            Active
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="w-8 h-8 p-0 hover:bg-neutral-800 hover:text-white">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800 text-neutral-300">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/products/${product._id}/edit`} className="flex items-center gap-2 cursor-pointer">
                                                        <Pencil className="w-3.5 h-3.5" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/product/${product._id}`} className="flex items-center gap-2 cursor-pointer">
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                        View Live
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center gap-2 text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Load More */}
            {status === "CanLoadMore" && (
                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        className="border-neutral-800 hover:bg-neutral-900 text-neutral-300"
                        onClick={() => loadMore(20)}
                    >
                        Load More Products
                    </Button>
                </div>
            )}
        </div>
    );
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}
