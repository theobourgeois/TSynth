import { Screens, useScreen } from "../../utils/screens-utils";
import { ScreenButton } from "./screen-button";
import {
    Background,
    Border,
    Highlight,
    Shadow,
    BlackOutline,
} from "./tv-svg-components";

const TV_WIDTH = 780;
const TV_HEIGHT = 650;

export function TV({ children }: { children: React.ReactNode }) {
    return (
        <div
            style={{
                width: TV_WIDTH,
                height: TV_HEIGHT,
            }}
            className="relative"
        >
            <div className="absolute">
                <Background />
            </div>
            <div className="absolute">
                <Border width={TV_WIDTH} height={TV_HEIGHT} />
                <div className="relative">
                    <Highlight />
                </div>
                <div className="relative">
                    <div className="absolute bottom-[1px] z-[100]">
                        <Border width={TV_WIDTH} height={TV_HEIGHT} />
                    </div>
                </div>
            </div>
            <Shadow />
            <ScreenButtons />
            <BlackOutline>{children}</BlackOutline>
        </div>
    );
}

function ScreenButtons() {
    const { setActiveScreen, activeScreen } = useScreen();

    const handleChangeScreen = (screen: Screens) => () => {
        setActiveScreen(screen);
    };

    return (
        <div className="absolute bottom-4 left-12 flex gap-4 p-2 z-[100]">
            {Object.values(Screens).map((screen) => (
                <ScreenButton
                    isActiveScreen={screen === activeScreen}
                    key={screen}
                    screen={screen}
                    onClick={handleChangeScreen(screen)}
                ></ScreenButton>
            ))}
        </div>
    );
}
