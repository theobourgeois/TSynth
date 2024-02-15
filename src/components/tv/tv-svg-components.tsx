import { useTheme } from "../../utils/theme-utils";

export function BlackOutline({ children }: { children: React.ReactNode }) {
    const theme = useTheme();

    return (
        <div
            className="absolute top-[64px] left-[55px] z-[1000]"
            style={{
                width: 665,
                height: 460,
                border: `22px solid ${theme.tvScreenOutline}`,
                borderRadius: 11,
            }}
        >
            {children}
        </div>
    );
}

export function Border({ width, height }: { width: number; height: number }) {
    const theme = useTheme();
    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter0_i_23_5264)">
                <mask id="path-1-inside-1_23_5264" fill="white">
                    <rect width={width} height={height} rx="9" />
                </mask>
                <rect
                    width={width}
                    height={height}
                    rx="9"
                    stroke={theme.tvBorder}
                    strokeWidth="30"
                    mask="url(#path-1-inside-1_23_5264)"
                />
            </g>
            <defs>
                <filter
                    id="filter0_i_23_5264"
                    x="0"
                    y="-4"
                    width={width}
                    height={height + 4}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dy="-4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                    />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect1_innerShadow_23_5264"
                    />
                </filter>
            </defs>
        </svg>
    );
}

export function Background() {
    const theme = useTheme();
    const width = 780;
    const height = 635;

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <mask id="path-1-inside-1_23_5261" fill="white">
                <rect width={width} height={height} rx="24" />
            </mask>
            <rect
                width={width}
                height={height}
                rx="24"
                stroke={theme.tvBackground}
                strokeWidth="128"
                mask="url(#path-1-inside-1_23_5261)"
            />
        </svg>
    );
}

export function Highlight() {
    const theme = useTheme();
    const width = 715;
    const height = 149;

    return (
        <svg
            className="scale-x-[1.08] absolute left-5 bottom-0"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter0_f_23_5263)">
                <path
                    d="M714.681 140C714.343 140 716.263 137.448 715.524 134.89L679.994 11.8899C679.499 10.1783 677.933 9 676.151 9H59.7813C58.1228 9 56.6362 10.0235 56.0445 11.573L9.0725 134.573C8.07249 137.192 10.0062 140 12.8093 140H711.681Z"
                    fill={theme.tvHighlight}
                />
            </g>
            <defs>
                <filter
                    id="filter0_f_23_5263"
                    x="0.205542"
                    y="0.4"
                    width={width}
                    height={height}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur
                        stdDeviation="4.3"
                        result="effect1_foregroundBlur_23_5263"
                    />
                </filter>
            </defs>
        </svg>
    );
}

export function Shadow() {
    const theme = useTheme();
    return (
        <svg
            className="absolute top-0 scale-x-[1.08] left-7"
            width="714"
            height="78"
            viewBox="0 0 714 78"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter0_f_23_5262)">
                <path
                    d="M700.786 9C703.927 9 705.843 12.4544 704.179 15.1187L671.707 67.1187C670.976 68.289 669.694 69 668.314 69H56.4186C55.2251 69 54.0938 68.467 53.334 67.5466L10.4046 15.5466C8.25102 12.9379 10.1065 9 13.4893 9H700.786Z"
                    fill={theme.tvShadow}
                />
            </g>
            <defs>
                <filter
                    id="filter0_f_23_5262"
                    x="0.881689"
                    y="0.4"
                    width="712.511"
                    height="77.2"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur
                        stdDeviation="4.3"
                        result="effect1_foregroundBlur_23_5262"
                    />
                </filter>
            </defs>
        </svg>
    );
}
