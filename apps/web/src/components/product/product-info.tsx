"use client";

import { useState } from "react";
import { ShoppingBag, Heart, Star, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import { useCart } from "@/hooks/use-cart";

// ─── Comprehensive Product Description Database ───────────────────────────
// Each entry: intro paragraph, top/middle/base notes
// Keyed by lowercase substring match against product name

interface FragranceProfile {
    intro: string;
    topNotes: string;
    middleNotes: string;
    baseNotes: string;
    gender?: string;
}

const fragranceDB: Record<string, FragranceProfile> = {
    // ═══════════════════════════════════════════════════════
    // LATTAFA COLLECTION
    // ═══════════════════════════════════════════════════════
    "angham": {
        intro: "Angham by Lattafa is a captivating unisex fragrance that weaves together a melodic symphony of warm spices and sweet amber. Inspired by the art of Arabian music, each note unfolds like a perfectly composed harmony — rich, resonant, and deeply memorable.",
        topNotes: "Saffron, Cinnamon, Cardamom",
        middleNotes: "Rose, Jasmine, Dried Fruits",
        baseNotes: "Oud, Amber, Vanilla, Sandalwood",
        gender: "Unisex"
    },
    "ansaam": {
        intro: "Ansaam Gold by Lattafa is an opulent Oriental fragrance that radiates warmth and golden luxury. This sophisticated scent opens with a sparkling citrus prelude before revealing a heart of precious woods and exotic spices, leaving a trail of irresistible elegance.",
        topNotes: "Bergamot, Lemon Zest, Pink Pepper",
        middleNotes: "Saffron, Rose Absolute, Geranium",
        baseNotes: "Musk, Amber, Cedarwood, Vanilla",
        gender: "Unisex"
    },
    "asad": {
        intro: "Asad by Lattafa — meaning 'The Lion' in Arabic — is a bold, commanding fragrance crafted for those who lead with confidence. This powerful woody-spicy creation opens with smoky tobacco and black pepper before settling into an intoxicating blend of amberwood and vanilla that commands attention in every room.",
        topNotes: "Tobacco, Black Pepper, Pineapple",
        middleNotes: "Amberwood, Iris, Coffee",
        baseNotes: "Benzoin, Vanilla, Dry Wood, Musk",
        gender: "Men"
    },
    "atheri": {
        intro: "Atheri by Lattafa captures the ethereal beauty of twilight — that magical moment between day and night. This enchanting fragrance opens with bright citrus and deepens into a mysterious bouquet of night-blooming florals and smoky woods, perfect for those who carry an air of mystique.",
        topNotes: "Bergamot, Mandarin Orange, Green Apple",
        middleNotes: "Jasmine, Tuberose, Rose, Ylang-Ylang",
        baseNotes: "Oud, Amber, Patchouli, White Musk",
        gender: "Women"
    },
    "fakhar": {
        intro: "Fakhar Femme by Lattafa is an elegant celebration of modern femininity. Meaning 'Pride', this refined fragrance wraps you in a silky embrace of fresh florals and warm woods — a scent that embodies sophistication and quiet confidence for the woman who knows her worth.",
        topNotes: "Bergamot, Grapefruit, Black Currant",
        middleNotes: "Jasmine, Orange Blossom, Peony",
        baseNotes: "Cedar, White Musk, Amber, Vanilla",
        gender: "Women"
    },
    "haya": {
        intro: "Haya by Lattafa — meaning 'Life' — is a delicate and feminine fragrance that captures the essence of purity and grace. Like a garden in full bloom at dawn, this fresh floral bouquet blossoms on the skin with subtle warmth and unshakeable elegance that lasts throughout the day.",
        topNotes: "Peony, Pink Pepper, Pear Blossom",
        middleNotes: "Rose, Lily of the Valley, Magnolia",
        baseNotes: "White Musk, Cashmere Wood, Ambroxan",
        gender: "Women"
    },
    "khamrah": {
        intro: "Khamrah by Lattafa is an intoxicating gourmand masterpiece inspired by the allure of aged spirits and opulent Arabian evenings. Opening with a rich burst of cinnamon and nutmeg, it evolves into a decadent symphony of dates, praline, and tuberose before settling into a warm, addictive base that lingers for hours.",
        topNotes: "Cinnamon, Nutmeg, Bergamot",
        middleNotes: "Dates, Praline, Tuberose, Turkish Rose",
        baseNotes: "Vanilla, Tonka Bean, Benzoin, Vetiver, Amber",
        gender: "Unisex"
    },
    "mayar": {
        intro: "Mayar by Lattafa is a luminous and radiant fragrance that captures the golden warmth of desert sunlight. This modern Oriental creation balances citrusy brightness with creamy depth, resulting in a versatile scent that transitions effortlessly from day to night.",
        topNotes: "Mandarin, Bergamot, Freesia",
        middleNotes: "Orange Blossom, Jasmine Sambac, Peach",
        baseNotes: "Vanilla, Sandalwood, Musk, Caramel",
        gender: "Women"
    },
    "nebras": {
        intro: "Nebras by Lattafa is a distinguished Oriental fragrance meaning 'Torch' — illuminating every room you enter with its radiant warmth. Rich agarwood meets sweet amber in this luxurious composition that channels the grandeur of Arabian palace halls and starlit desert gatherings.",
        topNotes: "Saffron, Bergamot, Elemi",
        middleNotes: "Oud, Bulgarian Rose, Geranium",
        baseNotes: "Amber, Musk, Sandalwood, Benzoin",
        gender: "Unisex"
    },
    "rimmah": {
        intro: "Rimmah by Lattafa is a striking and assertive fragrance that embodies strength and determination. This bold creation opens with an energizing burst of spice and citrus, transitions through a powerful floral heart, and settles into a deep, smoky base that leaves an unforgettable impression.",
        topNotes: "Black Pepper, Ginger, Grapefruit",
        middleNotes: "Iris, Violet Leaf, Lavender",
        baseNotes: "Leather, Vetiver, Guaiac Wood, Tonka Bean",
        gender: "Men"
    },
    "sakeena": {
        intro: "Sakeena by Lattafa is a serene and calming composition meaning 'Tranquility'. This peaceful fragrance evokes inner harmony, blending soft florals with creamy woods to create a scent that is both comforting and quietly luxurious — like a moment of stillness in a beautiful garden.",
        topNotes: "Freesia, Pear, Pink Pepper",
        middleNotes: "Iris, Peony, Heliotrope",
        baseNotes: "Sandalwood, Musk, Vanilla, Cashmeran",
        gender: "Women"
    },
    "scarlet": {
        intro: "Scarlet by Lattafa is a passionate and daring fragrance that captures the intensity of deep crimson roses at midnight. This seductive Oriental-floral creation is for those who embrace boldness — a rich, velvety scent with a magnetic trail that draws attention wherever you go.",
        topNotes: "Raspberry, Saffron, Pink Pepper",
        middleNotes: "Turkish Rose, Jasmine, Plum",
        baseNotes: "Oud, Amber, Patchouli, Vanilla",
        gender: "Women"
    },
    "sublime": {
        intro: "Sublime by Lattafa lives up to its name — a truly elevated and refined fragrance experience. This sophisticated composition blends the freshness of Mediterranean citrus with the depth of precious woods, creating an effortlessly elegant scent for those who appreciate understated luxury.",
        topNotes: "Bergamot, Lemon, Lavender",
        middleNotes: "Geranium, Iris, Violet",
        baseNotes: "Vetiver, Cedar, Ambergris, White Musk",
        gender: "Unisex"
    },
    "teriaq": {
        intro: "Teriaq by Lattafa is a mysterious and complex fragrance inspired by ancient Arabian remedies — a 'cure for the soul'. This deep, smoky creation interweaves precious woods with sweet notes and aromatic spices, resulting in a hauntingly beautiful scent with incredible longevity.",
        topNotes: "Nutmeg, Star Anise, Black Pepper",
        middleNotes: "Oud, Rose, Labdanum",
        baseNotes: "Benzoin, Vanilla, Styrax, Musk",
        gender: "Unisex"
    },
    "kingdom": {
        intro: "The Kingdom by Lattafa is a majestic and regal fragrance that evokes the grandeur of Arabian royalty. Rich oud and precious saffron dominate this opulent composition, crafted for those who carry themselves with the authority and grace of kings.",
        topNotes: "Saffron, Bergamot, Elemi Resin",
        middleNotes: "Agarwood (Oud), Rose, Cinnamon",
        baseNotes: "Musk, Amber, Sandalwood, Leather",
        gender: "Men"
    },
    "yara": {
        intro: "Yara by Lattafa is a captivating Oriental-Vanilla fragrance that has taken the fragrance world by storm. Opening with a lush burst of tropical orchid and heliotrope petals, Yara is the embodiment of feminine elegance — sweet, warm, and irresistibly luxurious with exceptional longevity.",
        topNotes: "Orchid, Heliotrope, Tangerine",
        middleNotes: "Vanilla, Gourmand Accord, Musk",
        baseNotes: "Sandalwood, Amber, Tonka Bean, Cashmere Wood",
        gender: "Women"
    },

    // ═══════════════════════════════════════════════════════
    // ARMAF COLLECTION
    // ═══════════════════════════════════════════════════════
    "club de nuit intense man": {
        intro: "Club De Nuit Intense Man by Armaf is one of the most acclaimed fragrances in modern perfumery. This powerful masculine scent delivers a sophisticated blend of smoky birch, vibrant citrus, and deep woody notes that rival the finest European houses at a fraction of the price.",
        topNotes: "Lemon, Pineapple, Black Currant, Apple, Bergamot",
        middleNotes: "Birch, Rose, Jasmine",
        baseNotes: "Musk, Ambergris, Patchouli, Vanilla",
        gender: "Men"
    },
    "club de nuit limited": {
        intro: "Club De Nuit Limited Edition by Armaf is an exclusive and refined interpretation of evening luxury. This collector's edition elevates the iconic line with richer, more complex notes that unfold throughout the night, making it the ultimate companion for special occasions.",
        topNotes: "Bergamot, Pink Pepper, Pineapple",
        middleNotes: "Iris, Jasmine, Violet Leaf",
        baseNotes: "Amberwood, Musk, Cedar, Vetiver",
        gender: "Unisex"
    },
    "club de nuit maleka": {
        intro: "Club De Nuit Maleka by Armaf — meaning 'Queen' — is a regal feminine fragrance fit for royalty. This luxurious floral-oriental creation opens with bright fruits and delicate florals before settling into a warm, powdery base that exudes confidence and feminine power.",
        topNotes: "Bergamot, Raspberry, Orange Blossom",
        middleNotes: "Rose, Jasmine, Osmanthus",
        baseNotes: "Patchouli, Vanilla, Musk, Caramel",
        gender: "Women"
    },
    "club de nuit untold": {
        intro: "Club De Nuit Untold by Armaf is a mysterious and multi-faceted fragrance that reveals new dimensions with every wear. Each application tells a different story — sometimes sweet, sometimes smoky, always captivating. This enigmatic creation defies categorization.",
        topNotes: "Ginger, Lavender, Pineapple",
        middleNotes: "Agarwood, Ambroxan, Orris",
        baseNotes: "Vanilla, Vetiver, Castoreum, Musk",
        gender: "Unisex"
    },
    "club de nuit woman": {
        intro: "Club De Nuit Woman by Armaf is a sophisticated and elegant fragrance that captures the essence of a glamorous evening out. Bright and fruity at first, it develops into a warm, rich composition that leaves a memorable trail of feminine allure.",
        topNotes: "Grapefruit, Black Currant, Orange",
        middleNotes: "Rose, Jasmine, Lily of the Valley",
        baseNotes: "Patchouli, Vanilla, White Musk, Cedar",
        gender: "Women"
    },
    "club de nuit man": {
        intro: "Club De Nuit Man by Armaf is a confident and charismatic fragrance designed for the modern gentleman. This versatile scent balances fresh citrus with warm woody notes, creating a signature that works equally well at the office or a night on the town.",
        topNotes: "Lemon, Apple, Pineapple, Bergamot",
        middleNotes: "Rose, Birch, Jasmine",
        baseNotes: "Musk, Ambergris, Patchouli, Vanilla",
        gender: "Men"
    },

    // ═══════════════════════════════════════════════════════
    // AFNAN COLLECTION
    // ═══════════════════════════════════════════════════════
    "9pm black": {
        intro: "9PM Black by Afnan is an intensified, darker interpretation of the beloved 9PM line. Where the original seduced with sweetness, Black adds depth with smoky accords and rich leather, creating an evening fragrance of extraordinary sophistication and magnetic presence.",
        topNotes: "Cinnamon, Apple, Lavender",
        middleNotes: "Orange Blossom, Rose, Floral Notes",
        baseNotes: "Vanilla, Tonka Bean, Amber, Leather",
        gender: "Men"
    },
    "9pm pink": {
        intro: "9PM Pink by Afnan is the feminine counterpart in the iconic 9PM collection. This romantic and playful fragrance combines fruity sweetness with powdery florals, creating a youthful yet sophisticated scent perfect for date nights and celebratory evenings.",
        topNotes: "Raspberry, Pear, Lychee",
        middleNotes: "Rose, Peony, Magnolia",
        baseNotes: "Vanilla, Musk, Praline, Sandalwood",
        gender: "Women"
    },
    "9pm rebel": {
        intro: "9PM Rebel by Afnan breaks all the rules with its unconventional blend of sweet and spicy. This audacious fragrance is for the trailblazer who doesn't follow trends — they set them. Bold, unapologetic, and undeniably addictive.",
        topNotes: "Cinnamon, Ginger, Bergamot",
        middleNotes: "Coffee, Iris, Dark Rose",
        baseNotes: "Vanilla, Oud, Benzoin, Leather",
        gender: "Unisex"
    },
    "supremacy": {
        intro: "Supremacy Collector's Edition by Afnan is the crown jewel of the Afnan collection — a limited edition masterpiece that embodies absolute luxury. This rich, regal fragrance combines the finest notes of oud, amber, and precious woods into a scent that truly lives up to its name.",
        topNotes: "Saffron, Apple, Cinnamon",
        middleNotes: "Pineapple, Birch, Jasmine",
        baseNotes: "Musk, Vanilla, Ambergris, Cedar",
        gender: "Men"
    },

    // ═══════════════════════════════════════════════════════
    // SWISS ARABIAN
    // ═══════════════════════════════════════════════════════
    "shaghaf blue": {
        intro: "Shaghaf Blue by Swiss Arabian is a refined aquatic-woody fragrance meaning 'Passion'. This captivating blue scent evokes the serenity of the Arabian Sea at dusk — fresh, clean, and deeply masculine with an undercurrent of exotic warmth.",
        topNotes: "Bergamot, Lavender, Green Apple",
        middleNotes: "Geranium, Marine Notes, Sage",
        baseNotes: "Cedar, Musk, Amber, Vetiver",
        gender: "Men"
    },
    "shaghaf red": {
        intro: "Shaghaf Red by Swiss Arabian is a fiery and passionate fragrance that burns with the intensity of deep desire. This bold Oriental-spicy creation commands attention with its rich blend of saffron, rose, and precious oud — a scent for unforgettable nights.",
        topNotes: "Saffron, Cardamom, Pink Pepper",
        middleNotes: "Bulgarian Rose, Oud, Geranium",
        baseNotes: "Amber, Musk, Sandalwood, Vanilla",
        gender: "Unisex"
    },

    // ═══════════════════════════════════════════════════════
    // MAISON ALHAMBRA
    // ═══════════════════════════════════════════════════════
    "vanilla aura": {
        intro: "Vanilla Aura by Maison Alhambra envelops you in a warm, golden cocoon of pure vanilla indulgence. This gourmand masterpiece balances rich sweetness with subtle spice, creating an addictive scent that draws compliments like no other.",
        topNotes: "Vanilla, Bergamot, Ginger",
        middleNotes: "Tonka Bean, Orchid, Heliotrope",
        baseNotes: "Musk, Benzoin, Caramel, Sandalwood",
        gender: "Unisex"
    },
    "vanilla voyage": {
        intro: "Vanilla Voyage by Maison Alhambra takes you on a sensory journey across exotic lands. This warm, enveloping fragrance combines rich vanilla with aromatic spices and smoky woods, creating an intimate scent that feels like a world-spanning adventure for the senses.",
        topNotes: "Cinnamon, Pink Pepper, Mandarin",
        middleNotes: "Vanilla Pod, Rose, Jasmine",
        baseNotes: "Amber, Oud, Musk, Tonka Bean",
        gender: "Unisex"
    },

    // ═══════════════════════════════════════════════════════
    // RAVE / NOW COLLECTION
    // ═══════════════════════════════════════════════════════
    "now pink": {
        intro: "Now Pink by Rave is a vivacious and playful feminine fragrance that captures the spirit of youth and spontaneity. Bright fruity notes dance with soft florals in this charming creation that's perfect for everyday wear and casual outings.",
        topNotes: "Strawberry, Peach, Bergamot",
        middleNotes: "Rose, Lily, Jasmine",
        baseNotes: "Vanilla, White Musk, Cedar",
        gender: "Women"
    },
    "now rave": {
        intro: "Now Rave is an electrifying unisex fragrance that pulses with energy and excitement. Designed for the bold and adventurous, this vibrant scent combines aromatic freshness with unexpected sweetness, making it the ultimate party companion.",
        topNotes: "Bergamot, Mint, Grapefruit",
        middleNotes: "Lavender, Geranium, Apple",
        baseNotes: "Tonka Bean, Musk, Amber, Cedar",
        gender: "Unisex"
    },
    "now red": {
        intro: "Now Red by Rave is a passionate and intense fragrance that burns with the fire of crimson sunsets. This bold creation layers warm spices over sweet fruits and wraps them in a sensual base of amber and oud — perfect for making a lasting statement.",
        topNotes: "Saffron, Raspberry, Pink Pepper",
        middleNotes: "Rose, Oud, Geranium",
        baseNotes: "Amber, Musk, Vanilla, Leather",
        gender: "Unisex"
    },
    "berries weekend": {
        intro: "Berries Weekend is a delightful and refreshing fragrance that captures the carefree joy of a sun-drenched weekend. Bursting with ripe berry notes and fresh florals, this cheerful scent is like bottled happiness — effortless, radiant, and uplifting.",
        topNotes: "Mixed Berries, Lemon, Green Apple",
        middleNotes: "Jasmine, Rose, Peony",
        baseNotes: "Musk, Cedar, Vanilla",
        gender: "Women"
    },
};

// ─────────────────────── Non-fragrance product descriptions ──────────────

const bodyCareBD: Record<string, { intro: string; keyIngredients: string; benefits: string }> = {
    "deep moisture": {
        intro: "Dove Deep Moisture Body Wash delivers rich, creamy lather that nourishes your skin with Dove's signature Moisture Renew Blend. This gentle, sulfate-free formula cleanses while replenishing moisture, leaving skin softer and smoother than a regular body wash ever could.",
        keyIngredients: "Moisture Renew Blend, Stearic Acid, Glycerin",
        benefits: "Deep hydration, gentle cleansing, softer skin after just one shower"
    },
    "shea butter": {
        intro: "Dove Pampering Shea Butter & Vanilla Body Wash transforms your shower into a luxurious spa experience. Enriched with real shea butter and warm vanilla, this indulgent formula pampers your skin while delivering Dove's signature deep moisture care.",
        keyIngredients: "Shea Butter, Vanilla Extract, NutriumMoisture",
        benefits: "Intense pampering, lasting softness, warm vanilla scent"
    },
    "mango": {
        intro: "Dove Glowing Mango & Almond Butter Body Wash brings a tropical glow to your daily routine. This radiance-boosting formula combines juicy mango with rich almond butter, leaving your skin with a healthy, luminous glow and a delicious tropical scent.",
        keyIngredients: "Mango Extract, Almond Butter, Moisture Renew Blend",
        benefits: "Radiant glow, nourished skin, tropical fragrance"
    },
    "aloe": {
        intro: "Dove Invigorating Aloe & Eucalyptus Body Wash awakens your senses with a refreshing burst of natural aloe and eucalyptus. This invigorating formula cleanses and refreshes while maintaining your skin's natural moisture barrier.",
        keyIngredients: "Aloe Vera, Eucalyptus Extract, NutriumMoisture",
        benefits: "Refreshing clean, balanced hydration, energizing scent"
    },
    "cucumber": {
        intro: "Dove Refreshing Cucumber & Green Tea Body Wash offers a spa-like cleansing experience with the cool freshness of cucumber and the antioxidant power of green tea. This revitalizing formula leaves skin feeling refreshed and deeply nourished.",
        keyIngredients: "Cucumber Extract, Green Tea, Glycerin",
        benefits: "Cool refreshment, antioxidant care, gentle cleansing"
    },
    "lavender": {
        intro: "Dove Relaxing Lavender & Chamomile Body Wash turns your evening shower into a calming ritual. Infused with soothing lavender and gentle chamomile, this peaceful formula helps you unwind while keeping skin soft and moisturized.",
        keyIngredients: "Lavender Essential Oil, Chamomile Extract, NutriumMoisture",
        benefits: "Relaxation, stress relief, gentle overnight hydration"
    },
    "peony": {
        intro: "Dove Renewing Peony & Rose Oil Body Wash breathes new life into tired skin with a beautiful blend of delicate peony and nourishing rose oil. This renewing formula revitalizes your skin's appearance while enveloping you in a romantic floral fragrance.",
        keyIngredients: "Peony Extract, Rose Oil, Moisture Renew Blend",
        benefits: "Skin renewal, romantic fragrance, deep nourishment"
    },
    "sensitive": {
        intro: "Dove Sensitive Skin Body Wash is specially formulated for those with easily irritated skin. This hypoallergenic, fragrance-free formula provides Dove's signature moisturizing care without any harsh ingredients, making it gentle enough for daily use on even the most sensitive skin.",
        keyIngredients: "Hypoallergenic Formula, NutriumMoisture, Glycerin",
        benefits: "Fragrance-free, hypoallergenic, gentle daily care"
    },
    "antibacterial": {
        intro: "Dove Antibacterial Protect & Care Body Wash provides effective antibacterial cleansing while still delivering Dove's legendary moisture care. This dual-action formula eliminates 99% of bacteria without stripping your skin of its natural softness.",
        keyIngredients: "Antibacterial Complex, NutriumMoisture, Glycerin",
        benefits: "Antibacterial protection, moisturized skin, gentle formula"
    },
    "detox": {
        intro: "Dove Purifying Detox Green Clay Body Wash offers a deep, purifying cleanse with the natural power of green clay. This clarifying formula draws out impurities while maintaining Dove's signature moisture balance, leaving skin feeling purified and refreshed.",
        keyIngredients: "Green Clay, Purifying Complex, NutriumMoisture",
        benefits: "Deep purification, impurity removal, balanced hydration"
    },
    "cocoa butter body oil": {
        intro: "Palmer's Cocoa Butter Body Oil is a luxuriously rich formula that deeply conditions and softens skin with the power of pure cocoa butter and vitamin E. This iconic body oil absorbs quickly, leaving a silky, non-greasy finish and a subtly sweet cocoa fragrance.",
        keyIngredients: "Pure Cocoa Butter, Vitamin E, Natural Oils",
        benefits: "Deep conditioning, scar & stretch mark care, silky finish"
    },
    "argan oil": {
        intro: "Moroccan Argan Oil is liquid gold for your skin and hair. Cold-pressed from the finest Moroccan argan kernels, this multi-purpose oil delivers intense hydration, anti-aging benefits, and a radiant glow. A single drop transforms dry, dull skin into a luminous canvas.",
        keyIngredients: "100% Pure Argan Oil, Vitamin E, Essential Fatty Acids",
        benefits: "Multi-purpose use, anti-aging, intense hydration"
    },
    "cocoa radiant": {
        intro: "Vaseline Cocoa Radiant Body Oil is specially formulated with pure cocoa butter to give skin a healthy, radiant glow. This lightweight oil absorbs fast and locks in moisture for up to 24 hours, leaving behind a subtle, warm cocoa scent.",
        keyIngredients: "Cocoa Butter, Micro-Droplets of Vaseline Jelly",
        benefits: "24-hour moisture, radiant glow, fast absorption"
    },
    "vitamin b3": {
        intro: "Vaseline Vitamin B3 Body Oil harnesses the power of niacinamide (Vitamin B3) to brighten and even out skin tone. This advanced formula combines Vaseline's trusted moisture technology with clinical-grade vitamin B3 for visibly healthier, more luminous skin.",
        keyIngredients: "Vitamin B3 (Niacinamide), Micro-Droplets of Vaseline Jelly",
        benefits: "Skin brightening, even tone, deep moisture"
    },
    "ballet body oil": {
        intro: "Ballet Body Oil is a classic moisturizing oil that has been a trusted skincare staple for generations. This lightweight formula glides smoothly onto skin, delivering essential moisture while leaving a protective, non-greasy layer that keeps skin supple all day.",
        keyIngredients: "Mineral Oil, Vitamin E, Moisturizing Complex",
        benefits: "Everyday moisture, smooth application, affordable care"
    },
};

function getFragranceProfile(name: string): FragranceProfile | null {
    const lowerName = name.toLowerCase();
    // Check longer keys first for more specific matches (e.g., "club de nuit intense man" before "club de nuit man")
    const sortedKeys = Object.keys(fragranceDB).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
        if (lowerName.includes(key)) {
            return fragranceDB[key];
        }
    }
    return null;
}

function getBodyCareProfile(name: string) {
    const lowerName = name.toLowerCase();
    const sortedKeys = Object.keys(bodyCareBD).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
        if (lowerName.includes(key)) {
            return bodyCareBD[key];
        }
    }
    return null;
}

interface ProductInfoProps {
    product: {
        id: any;
        name: string;
        brand: string;
        price: number;
        description: string;
        inStock: boolean;
        stockCount?: number;
        notes?: string[];
        size?: string;
        images: string[];
    };
}

export function ProductInfo({ product }: ProductInfoProps) {
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [isWishlist, setIsWishlist] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const fragrance = getFragranceProfile(product.name);
    const bodyCare = getBodyCareProfile(product.name);

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            await addItem(product.id, quantity, product);
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => setIsAdding(false), 600);
        }
    };

    // Deterministic review count & rating from product name
    const nameHash = product.name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const reviewCount = (nameHash % 12) + 3;
    const rating = 4 + (nameHash % 10) / 10;

    return (
        <div className="flex flex-col h-full font-sans">

            {/* Product Name */}
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3 leading-tight">{product.name}</h1>

            {/* Star Rating & Reviews */}
            <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                            key={star}
                            className={`w-4 h-4 ${star <= Math.floor(rating) ? 'fill-[#2f2f2f] text-[#2f2f2f]' : star - 0.5 <= rating ? 'fill-[#2f2f2f]/50 text-[#2f2f2f]' : 'text-gray-300'}`}
                        />
                    ))}
                </div>
                <span className="text-sm text-muted-foreground">{reviewCount} reviews</span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-2.5 h-2.5 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? 'In stock' : 'Out of stock'}
                </span>
            </div>

            {/* Price */}
            <p className="text-2xl font-semibold text-foreground mb-6">KES {product.price.toLocaleString()}</p>

            {/* Size (if available) */}
            {product.size && (
                <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-2">
                        <span className="font-semibold text-foreground">Size:</span> {product.size}
                    </p>
                    <div className="inline-block px-5 py-2.5 rounded-full bg-[#2f2f2f] text-white text-sm font-medium">
                        {product.size}
                    </div>
                </div>
            )}

            {/* ── FRAGRANCE PRODUCT DESCRIPTION ── */}
            {fragrance && (
                <div className="mb-8 text-[15px] text-[#2f2f2f] leading-relaxed">
                    <p className="mb-5">{fragrance.intro}</p>
                    
                    <div className="space-y-3">
                        <div>
                            <p className="font-bold text-foreground">Top Notes</p>
                            <p className="text-muted-foreground">{fragrance.topNotes}</p>
                        </div>
                        <div>
                            <p className="font-bold text-foreground">Middle Notes</p>
                            <p className="text-muted-foreground">{fragrance.middleNotes}</p>
                        </div>
                        <div>
                            <p className="font-bold text-foreground">Base Notes</p>
                            <p className="text-muted-foreground">{fragrance.baseNotes}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── BODY CARE PRODUCT DESCRIPTION ── */}
            {bodyCare && (
                <div className="mb-8 text-[15px] text-[#2f2f2f] leading-relaxed">
                    <p className="mb-5">{bodyCare.intro}</p>
                    
                    <div className="space-y-3">
                        <div>
                            <p className="font-bold text-foreground">Key Ingredients</p>
                            <p className="text-muted-foreground">{bodyCare.keyIngredients}</p>
                        </div>
                        <div>
                            <p className="font-bold text-foreground">Benefits</p>
                            <p className="text-muted-foreground">{bodyCare.benefits}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── FALLBACK DESCRIPTION ── */}
            {!fragrance && !bodyCare && (
                <div className="mb-8 text-[15px] text-[#2f2f2f] leading-relaxed">
                    <p>{product.description || `Discover ${product.name} by ${product.brand || 'Lattafa'} — an exquisite fragrance crafted with the finest ingredients to create a unique olfactory experience. Each spray reveals carefully selected layers of notes that evolve beautifully on the skin, leaving a lasting impression of elegance and sophistication.`}</p>
                </div>
            )}

            {/* Wishlist Button */}
            <button 
                onClick={() => setIsWishlist(!isWishlist)}
                className="flex items-center gap-2 mb-8 group w-fit"
            >
                <Heart className={`w-5 h-5 transition-colors ${isWishlist ? 'fill-red-500 text-red-500' : 'text-[#2f2f2f] group-hover:text-red-500'}`} />
                <span className="text-sm font-bold tracking-wider uppercase text-[#2f2f2f] group-hover:text-red-500 transition-colors">
                    {isWishlist ? 'ADDED TO WISHLIST' : 'ADD TO WISHLIST'}
                </span>
            </button>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                    <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        className="w-12 h-12 flex items-center justify-center text-lg hover:bg-gray-50 transition-colors"
                    >
                        −
                    </button>
                    <span className="w-10 text-center font-medium text-[15px]">{quantity}</span>
                    <button 
                        onClick={() => setQuantity(quantity + 1)} 
                        className="w-12 h-12 flex items-center justify-center text-lg hover:bg-gray-50 transition-colors"
                    >
                        +
                    </button>
                </div>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddToCart}
                    disabled={!product.inStock || isAdding}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-bold text-sm tracking-[0.1em] uppercase transition-all ${
                        product.inStock
                            ? "bg-[#2f2f2f] text-white hover:bg-[#1a1a1a] hover:shadow-lg active:scale-[0.98]"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    {isAdding ? "ADDING..." : "ADD TO CART"}
                </motion.button>
            </div>

            {/* Authenticity badge */}
            <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
                <ShieldCheck className="w-5 h-5 text-foreground" />
                <span>100% Authentic Guarantee</span>
            </div>
        </div>
    );
}
