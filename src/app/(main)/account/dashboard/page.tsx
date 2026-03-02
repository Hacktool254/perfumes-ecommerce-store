import Link from "next/link";
import { ShoppingBag, Heart, MapPin } from "lucide-react";

export default function AccountDashboardPage() {
    return (
        <div className="max-w-4xl pb-10">
            <h1 className="text-[28px] font-bold text-gray-900 leading-tight mb-6">Dashboard</h1>

            <p className="text-gray-500 text-sm mb-8">
                From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/account/orders" className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 focus:ring-2 focus:ring-primary transition-colors group flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-4 group-hover:bg-accent transition-colors">
                        <ShoppingBag size={24} />
                    </div>
                    <h3 className="font-semibold text-card-foreground text-base mb-1">Orders</h3>
                    <p className="text-xs text-muted-foreground">Track, return, or buy things again</p>
                </Link>

                <Link href="/account/addresses" className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 focus:ring-2 focus:ring-primary transition-colors group flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-4 group-hover:bg-accent transition-colors">
                        <MapPin size={24} />
                    </div>
                    <h3 className="font-semibold text-card-foreground text-base mb-1">Addresses</h3>
                    <p className="text-xs text-muted-foreground">Edit addresses for orders</p>
                </Link>

                <Link href="/account/wishlist" className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 focus:ring-2 focus:ring-primary transition-colors group flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-4 group-hover:bg-accent transition-colors">
                        <Heart size={24} />
                    </div>
                    <h3 className="font-semibold text-card-foreground text-base mb-1">Wishlist</h3>
                    <p className="text-xs text-muted-foreground">View your saved items</p>
                </Link>
            </div>
        </div>
    );
}
