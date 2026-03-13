"use client";

import { useState } from "react";
import { usePaginatedQuery, useMutation, useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import {
    Package,
    AlertCircle,
    ArrowUpRight,
    RefreshCw,
    Search
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
import { cn } from "@/lib/utils";
import { Id } from "@workspaceRoot/convex/_generated/dataModel";

export default function AdminInventoryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { results: products, status } = usePaginatedQuery(api.products.list, {}, { initialNumItems: 50 });
    const stats = useQuery(api.orders.getStats);
    const updateStock = useMutation(api.products.updateStock);
    const [updateAmounts, setUpdateAmounts] = useState<Record<string, number>>({});

    const handleRestock = async (productId: Id<"products">) => {
        const amount = updateAmounts[productId] || 0;
        if (amount === 0) return;

        try {
            await updateStock({ id: productId, increment: amount });
            setUpdateAmounts(prev => ({ ...prev, [productId]: 0 }));
        } catch (error) {
            console.error("Failed to update stock", error);
        }
    };

    const filteredProducts = products?.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalWarehouseValue = products?.reduce((acc, p) => acc + (p.price * p.stock), 0) || 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Inventory Control</h1>
                    <p className="text-muted-foreground">Monitor stock levels and manage warehouse arrivals.</p>
                </div>
                <Button variant="outline" className="border-border bg-card text-foreground gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Reload Data
                </Button>
            </div>

            {/* Inventory Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Low Stock Items</p>
                    <div className="flex items-end justify-between">
                        <p className={cn("text-3xl font-serif font-bold", (stats?.lowStockCount || 0) > 0 ? "text-rose-500" : "text-emerald-500")}>
                            {stats?.lowStockCount || 0}
                        </p>
                        <AlertCircle className="w-8 h-8 text-muted/20" />
                    </div>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Total Warehouse Value</p>
                    <p className="text-3xl font-serif font-bold text-foreground">
                        KES {(totalWarehouseValue / 1000000).toFixed(1)}M
                    </p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Total Products</p>
                    <div className="flex items-center gap-2">
                        <p className="text-3xl font-serif font-bold text-foreground">{products?.length || 0}</p>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">SKUs</span>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search inventory..."
                    className="pl-10 bg-card border-border h-11"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Inventory Table */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden min-h-[400px]">
                {!products ? (
                    <div className="flex items-center justify-center h-[400px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow className="hover:bg-transparent border-border">
                                <TableHead className="text-foreground">Product</TableHead>
                                <TableHead className="text-foreground text-center">In Stock</TableHead>
                                <TableHead className="text-foreground text-center">Status</TableHead>
                                <TableHead className="text-right text-foreground">Quick Update</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts?.map((product) => (
                                <TableRow key={product._id} className="border-border hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-10 rounded bg-muted flex items-center justify-center overflow-hidden border border-border">
                                                {product.images?.[0] ? (
                                                    <img src={product.images[0]} alt="" className="object-cover w-full h-full" />
                                                ) : (
                                                    <Package className="w-4 h-4 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground text-sm">{product.name}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                                    {product.brand || "Ummie's Essence"} • {product.gender}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-mono font-bold text-lg">
                                        {product.stock}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={cn(
                                            "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                            product.stock < 10
                                                ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                                : product.stock < 25
                                                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                    : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                        )}>
                                            {product.stock < 10 ? "Low Stock" : product.stock < 25 ? "Moderate" : "In Stock"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Input
                                                type="number"
                                                value={updateAmounts[product._id] || 0}
                                                onChange={(e) => setUpdateAmounts(prev => ({
                                                    ...prev,
                                                    [product._id]: parseInt(e.target.value) || 0
                                                }))}
                                                className="w-16 h-8 bg-muted border-border text-center text-xs font-bold"
                                            />
                                            <Button
                                                size="sm"
                                                onClick={() => handleRestock(product._id)}
                                                className="h-8 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 px-3 text-xs font-bold uppercase tracking-widest"
                                            >
                                                Update
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
