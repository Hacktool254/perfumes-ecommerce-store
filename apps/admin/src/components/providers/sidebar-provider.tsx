"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
    isCollapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    toggleCollapsed: () => void;
    toggleOpen: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("sidebar-collapsed");
        if (saved !== null) {
            setIsCollapsed(saved === "true");
        }
        setMounted(true);
    }, []);

    const setCollapsed = (collapsed: boolean) => {
        setIsCollapsed(collapsed);
        localStorage.setItem("sidebar-collapsed", String(collapsed));
    };

    const toggleCollapsed = () => setCollapsed(!isCollapsed);
    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <SidebarContext.Provider 
            value={{ 
                isCollapsed, 
                setCollapsed, 
                isOpen, 
                setOpen: setIsOpen,
                toggleCollapsed,
                toggleOpen 
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}
