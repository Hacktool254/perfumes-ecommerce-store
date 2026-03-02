"use client";

import { MapPin, Plus } from "lucide-react";

export default function AddressesPage() {
    return (
        <div className="max-w-4xl pb-10">
            <h1 className="text-[28px] font-bold text-foreground leading-tight mb-6">Addresses</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Default Address Card */}
                <div className="bg-card border text-left border-border rounded-lg p-6 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="inline-block px-2.5 py-1 bg-muted text-card-foreground text-xs font-semibold rounded-md mb-3">Default</span>
                            <h3 className="font-semibold text-card-foreground">Test User</h3>
                        </div>
                        <div className="space-x-3 text-sm">
                            <button className="text-muted-foreground hover:text-foreground font-medium transition-colors">Edit</button>
                            <button className="text-destructive hover:text-destructive/80 font-medium transition-colors">Remove</button>
                        </div>
                    </div>

                    <div className="text-sm text-muted-foreground space-y-1 mb-6">
                        <p>123 Fashion Avenue</p>
                        <p>Suit 450</p>
                        <p>Nairobi, Nairobi County, 00100</p>
                        <p>Kenya</p>
                        <p className="mt-2 text-muted-foreground/80">Phone: +254 712 345 678</p>
                    </div>
                </div>

                {/* Add New Address Button/Card */}
                <button className="bg-muted/30 border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-muted transition-all min-h-[220px]">
                    <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mb-4 shadow-sm">
                        <Plus size={20} />
                    </div>
                    <span className="font-semibold">Add New Address</span>
                </button>
            </div>
        </div>
    );
}
