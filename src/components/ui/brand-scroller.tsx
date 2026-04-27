import { type ClientBrand } from "@/data/clientBrands";

interface BrandScrollerProps {
    brands: ClientBrand[];
    reverse?: boolean;
    speed?: "slow" | "normal" | "fast";
}

const speedMap = {
    slow: "60s",
    normal: "40s",
    fast: "25s",
};

export const BrandScroller = ({
    brands,
    reverse = false,
    speed = "normal",
}: BrandScrollerProps) => {
    return (
        <div
            className="group flex overflow-hidden py-3 [--gap:2rem] [gap:var(--gap)] flex-row max-w-full [mask-image:linear-gradient(to_right,_rgba(0,_0,_0,_0),rgba(0,_0,_0,_1)_10%,rgba(0,_0,_0,_1)_90%,rgba(0,_0,_0,_0))]"
            style={{ "--marquee-duration": speedMap[speed] } as React.CSSProperties}
        >
            {Array(4)
                .fill(0)
                .map((_, i) => (
                    <div
                        className={`flex shrink-0 justify-around [gap:var(--gap)] ${reverse ? "animate-marquee-reverse" : "animate-marquee"
                            } flex-row`}
                        key={i}
                    >
                        {brands.map((brand) => (
                            <a
                                key={`${brand.name}-${i}`}
                                href={brand.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-36 h-20 bg-white rounded-xl border border-border/50 hover:border-primary/40 hover:shadow-md transition-all duration-200 overflow-hidden p-3 group/item"
                            >
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="max-w-full max-h-full object-contain grayscale opacity-50 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-200"
                                />
                            </a>
                        ))}
                    </div>
                ))}
        </div>
    );
};

export default BrandScroller;
