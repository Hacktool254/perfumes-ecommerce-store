"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
    Package,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw
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

export default function AdminInventoryPage() {
    const { results: products } = usePaginatedQuery(api.products.list, {}, { initialNumItems: 50 });

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">Inventory Control</h1>
                    <p className="text-neutral-400">Monitor stock levels and manage warehouse arrivals.</p>
                </div>
                <Button variant="outline" className="border-neutral-800 bg-neutral-900 text-neutral-300 gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Reload Data
                </Button>
            </div>

            {/* Inventory Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
                    <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest mb-1">Low Stock Items</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-serif text-red-500">4</p>
                        <AlertCircle className="w-8 h-8 text-neutral-800" />
                    </div>
                </div>
                <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
                    <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest mb-1">Total Warehouse Value</p>
                    <p className="text-3xl font-serif text-white">KES 4.2M</p>
                </div>
                <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
                    <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest mb-1">Stock Turn Rate</p>
                    <div className="flex items-center gap-2">
                        <p className="text-3xl font-serif text-white">84%</p>
                        <span className="text-xs text-green-500 flex items-center">
                            <ArrowUpRight className="w-3 h-3" /> 2%
                        </span>
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 shadow-xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-neutral-800/50">
                        <TableRow className="hover:bg-transparent border-neutral-800">
                            <TableHead className="text-neutral-300">Fragrance</TableHead>
                            <TableHead className="text-neutral-300">Category</TableHead>
                            <TableHead className="text-neutral-300">In Stock</TableHead>
                            <TableHead className="text-neutral-300">Threshold</TableHead>
                            <TableHead className="text-neutral-300">Last Refill</TableHead>
                            <TableHead className="text-right text-neutral-300">Quick Update</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products?.map((product) => (
                            <TableRow key={product._id} className="border-neutral-800 hover:bg-neutral-800/30 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-10 rounded bg-neutral-800 flex items-center justify-center">
                                            <Package className="w-4 h-4 text-neutral-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{product.name}</p>
                                            <p className="text-[10px] text-neutral-500 uppercase tracking-tighter">SKU: {product._id.slice(-6).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-neutral-400 text-sm">
                                    {product.categoryId || "General"}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "font-mono font-bold",
                                            product.stock < 5 ? "text-red-500" : product.stock < 15 ? "text-yellow-500" : "text-green-500"
                                        )}>
                                            {product.stock}
                                        </span>
                                        <span className="text-[10px] text-neutral-600 font-mono">units</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-neutral-400 text-sm font-mono">
                                    10 units
                                </TableCell>
                                <TableCell className="text-neutral-500 text-sm">
                                    14 days ago
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Input
                                            type="number"
                                            defaultValue={0}
                                            className="w-16 h-8 bg-neutral-800 border-neutral-700 text-center text-xs"
                                        />
                                        <Button size="sm" className="h-8 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 px-3 text-xs font-bold uppercase tracking-widest">
                                            Restock
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
