"use client";

import { Box } from "lucide-react";

export function Product3DViewer() {
    return (
        <div className="relative w-full aspect-square bg-secondary/10 border border-border/50 rounded-lg flex flex-col items-center justify-center p-8 text-center mb-12">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Box className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-xl mb-2">Interactive 3D View</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                A Three.js interactive canvas would load here, allowing users to rotate and inspect the perfume bottle from all angles.
            </p>
            <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/50 backdrop-blur px-2 py-1 rounded">
                Optional Feature
            </div>
        </div>
    );
}
