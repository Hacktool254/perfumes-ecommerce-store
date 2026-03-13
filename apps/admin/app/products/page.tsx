"use client";

import { usePaginatedQuery, useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
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
import { Id } from "@workspaceRoot/convex/_generated/dataModel";

export default function AdminProductsPage() {
    const { results: products, status, loadMore } = usePaginatedQuery(
        api.products.list,
        {},
        { initialNumItems: 20 }
    );

    const isLoading = status === "LoadingFirstPage";

    const softDeleteProduct = useMutation(api.products.softDelete);

    const handleDelete = async (id: Id<"products">) => {
        if (!confirm("Are you sure you want to move this product to the vault? (Soft delete)")) return;
        try {
            await softDeleteProduct({ id });
        } catch (error) {
            console.error("Failed to delete product", error);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Product Management</h1>
                    <p className="text-muted-foreground">Manage your fragrance catalog, prices, and stock levels.</p>
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
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        className="pl-10 bg-card border-border focus-visible:ring-primary/50 h-11"
                    />
                </div>
                <Button variant="outline" className="border-border hover:bg-muted text-foreground">
                    Filters
                </Button>
            </div>

            {/* Products Table */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead className="text-foreground">Name</TableHead>
                            <TableHead className="text-foreground">Category</TableHead>
                            <TableHead className="text-foreground">Price</TableHead>
                            <TableHead className="text-foreground">Stock</TableHead>
                            <TableHead className="text-foreground">Status</TableHead>
                            <TableHead className="text-right text-foreground">Actions</TableHead>
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
                                <TableRow key={product._id} className="border-border hover:bg-muted/30 transition-colors group">
                                    <TableCell>
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border">
                                            <Image
                                                src={product.images[0] || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=100&auto=format&fit=crop"}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">{product.name}</p>
                                        <p className="text-xs text-muted-foreground">Slug: {product.slug}</p>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
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
                                                <Button variant="ghost" className="w-8 h-8 p-0 hover:bg-muted hover:text-foreground">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-card border-border text-card-foreground">
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
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(product._id)}
                                                    className="flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                                                >
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
                        className="border-border hover:bg-muted text-foreground"
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
