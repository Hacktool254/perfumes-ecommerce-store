"use client";

import { useState } from "react";
import { usePaginatedQuery, useMutation, useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import {
    Plus,
    Search,
    MoreHorizontal,
    Pencil,
    Trash2,
    ExternalLink,
    Filter,
    Package,
    AlertTriangle,
    Tag,
    ChevronRight,
    ShoppingBag
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
import { cn } from "@/lib/utils";
import { AdminStatCard } from "@/components/admin/admin-stat-card";

export default function AdminProductsPage() {
    const [selectedCategoryId, setSelectedCategoryId] = useState<Id<"categories"> | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const categories = useQuery(api.categories.list);
    const { results: products, status, loadMore } = usePaginatedQuery(
        api.products.list,
        { 
            categoryIds: selectedCategoryId ? [selectedCategoryId] : undefined 
        },
        { initialNumItems: 20 }
    );

    const isLoading = status === "LoadingFirstPage";
    const softDeleteProduct = useMutation(api.products.softDelete);

    const handleDelete = async (id: Id<"products">) => {
        if (!confirm("Are you sure you want to retire this product from the boutique?")) return;
        try {
            await softDeleteProduct({ id });
        } catch (error) {
            console.error("Failed to delete product", error);
        }
    };

    // Derived stats for the top cards (ideally these come from a query, but we can compute or use mock for now)
    const stats = {
        total: products.length,
        lowStock: products.filter(p => p.stock <= 5).length,
        outOfStock: products.filter(p => p.stock === 0).length
    };

    return (
        <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-1000">
            {/* Elegant Header */}
            <div className="flex items-end justify-between border-b border-border/40 pb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-[1px] bg-primary/40 rounded-full" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-muted-foreground/60">Inventory Curation</p>
                    </div>
                    <h1 className="text-5xl font-extrabold text-foreground tracking-tighter leading-none">
                        VAULT <span className="text-primary italic font-serif font-medium">MANAGEMENT</span>
                    </h1>
                </div>
                <Link href="/products/new">
                    <button className="flex items-center gap-3 h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-extrabold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 group">
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                        <span>Curate Product</span>
                    </button>
                </Link>
            </div>

            {/* Product Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AdminStatCard
                    title="Active Spirits"
                    value={stats.total.toString()}
                    icon={<Package size={20} />}
                    className="bg-surface-container-lowest"
                />
                <AdminStatCard
                    title="Low Supply"
                    value={stats.lowStock.toString()}
                    trend={{ value: "Priority Needed", positive: false }}
                    icon={<AlertTriangle size={20} className="text-amber-500" />}
                    className="bg-surface-container-lowest"
                />
                <AdminStatCard
                    title="Categories"
                    value={categories?.length.toString() || "0"}
                    icon={<Tag size={20} />}
                    className="bg-surface-container-lowest"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
                {/* Visual Category Sidebar */}
                <div className="space-y-8">
                    <div>
                        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-6 px-4">Collections</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => setSelectedCategoryId(null)}
                                className={cn(
                                    "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 group",
                                    selectedCategoryId === null 
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                        : "bg-surface-container/50 text-muted-foreground hover:bg-surface-container hover:text-foreground"
                                )}
                            >
                                <span className="text-sm font-bold tracking-tight">All Essences</span>
                                <ChevronRight size={14} className={cn("transition-transform", selectedCategoryId === null ? "opacity-100" : "opacity-0")} />
                            </button>
                            {categories?.map((cat) => (
                                <button
                                    key={cat._id}
                                    onClick={() => setSelectedCategoryId(cat._id as Id<"categories">)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 group",
                                        selectedCategoryId === cat._id 
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                            : "bg-surface-container/50 text-muted-foreground hover:bg-surface-container hover:text-foreground"
                                    )}
                                >
                                    <span className="text-sm font-bold tracking-tight">{cat.name}</span>
                                    <ChevronRight size={14} className={cn("transition-transform", selectedCategoryId === cat._id ? "opacity-100" : "opacity-0")} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-surface-container/30 border border-border/50 rounded-[32px] p-8 text-center space-y-4">
                        <ShoppingBag size={32} className="mx-auto text-primary/40" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Operational Tip</p>
                        <p className="text-xs font-medium text-muted-foreground/80 leading-relaxed italic">
                            Seasonal restocking ensures the continuity of luxury scents.
                        </p>
                    </div>
                </div>

                {/* Main Product Console */}
                <div className="space-y-6">
                    {/* Search & Global Filter */}
                    <div className="flex gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Scan the fragrance vault..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-14 h-16 bg-surface-container-lowest border-none rounded-[24px] text-sm font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all placeholder:text-muted-foreground/40"
                            />
                        </div>
                        <Button variant="ghost" className="w-16 h-16 rounded-[24px] bg-surface-container-lowest border border-border/50 hover:bg-surface-container shadow-sm">
                            <Filter size={20} className="text-muted-foreground" />
                        </Button>
                    </div>

                    {/* Editorial Product Table */}
                    <div className="bg-surface-container-lowest border border-border/50 rounded-[48px] shadow-xl shadow-surface-container/20 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-surface-container/30">
                                <TableRow className="hover:bg-transparent border-border/50 h-20">
                                    <TableHead className="w-[120px] pl-10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Spirit</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Definition</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Acquisition</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Availability</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</TableHead>
                                    <TableHead className="text-right pr-10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Protocol</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    [1, 2, 3, 4, 5].map((i) => (
                                        <TableRow key={i} className="border-border/50 h-24 animate-pulse">
                                            <TableCell className="pl-10"><div className="w-16 h-16 bg-surface-container rounded-2xl" /></TableCell>
                                            <TableCell><div className="h-4 w-40 bg-surface-container rounded" /></TableCell>
                                            <TableCell><div className="h-4 w-24 bg-surface-container rounded" /></TableCell>
                                            <TableCell><div className="h-4 w-20 bg-surface-container rounded" /></TableCell>
                                            <TableCell><div className="h-4 w-24 bg-surface-container rounded" /></TableCell>
                                            <TableCell className="pr-10 text-right"><div className="h-10 w-10 bg-surface-container rounded-full ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : products.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-40 text-muted-foreground/40 font-serif italic text-xl">
                                            No artifacts found in this collection.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.map((product) => (
                                        <TableRow key={product._id} className="border-border/50 h-24 hover:bg-surface-container/20 transition-all duration-500 group">
                                            <TableCell className="pl-10">
                                                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-surface-container p-2 border border-border/20 group-hover:scale-110 transition-transform duration-500">
                                                    <Image
                                                        src={product.images[0] || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=100&auto=format&fit=crop"}
                                                        alt={product.name}
                                                        fill
                                                        className="object-contain p-1"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-extrabold text-lg text-foreground tracking-tight group-hover:text-primary transition-colors">{product.name}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60">{product.brand || "Original Essence"}</p>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-extrabold text-lg text-foreground tracking-tighter">KES {product.price.toLocaleString()}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-2">
                                                    <div className={cn(
                                                        "h-1.5 w-20 rounded-full bg-surface-container overflow-hidden",
                                                    )}>
                                                        <div className={cn(
                                                            "h-full rounded-full transition-all duration-1000",
                                                            product.stock > 10 ? "bg-emerald-500" : product.stock > 0 ? "bg-amber-400" : "bg-rose-500"
                                                        )} style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }} />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{product.stock} Units</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#B07D5B33]" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">Active</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-10">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="w-12 h-12 rounded-2xl bg-surface-container/50 border border-transparent hover:border-primary/20 hover:bg-surface-container p-0">
                                                            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-[24px] bg-surface-container-lowest border border-border/50 text-foreground shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/products/${product._id}/edit`} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer hover:bg-surface-container transition-colors">
                                                                <Pencil className="w-4 h-4 text-primary" />
                                                                <span className="text-sm font-bold">Refine Details</span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/product/${product._id}`} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer hover:bg-surface-container transition-colors">
                                                                <ExternalLink className="w-4 h-4 text-primary" />
                                                                <span className="text-sm font-bold">View Presence</span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <div className="h-[1px] bg-border/40 my-2" />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(product._id)}
                                                            className="flex items-center gap-4 p-4 rounded-xl text-destructive focus:text-destructive focus:bg-destructive/5 cursor-pointer"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            <span className="text-sm font-bold">Retire Essence</span>
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

                    {/* Pagination Context */}
                    {status === "CanLoadMore" && (
                        <div className="flex justify-center pt-8">
                            <button
                                className="px-10 py-5 rounded-[24px] bg-surface-container-lowest border border-border/50 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-surface-container hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
                                onClick={() => loadMore(20)}
                            >
                                Expands Vault
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
