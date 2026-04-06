import { TrackForm } from "@/components/track/track-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Track My Order | Ummie's Essence",
    description: "Track the status of your order at Ummie's Essence.",
};

export default function TrackPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 pt-16 pb-32 max-w-2xl text-center flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-serif text-[#1c2e36] mb-8">
                    Track My Order
                </h1>
                
                <div className="bg-[#C69C6D] text-white w-full py-3 px-4 font-bold tracking-wider text-[13px] md:text-sm mb-16 rounded-sm uppercase">
                    FREE SHIPPING IN ORDERS OVER KES 5,000
                </div>

                <TrackForm />
            </div>
        </div>
    );
}
