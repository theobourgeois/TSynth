import { useEffect } from "react";
import { Screens, useScreen } from "../../utils/screens-utils";
import { MasterKnob } from "../knob/master-knob";
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
            className="relative select-none"
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
                    <div className="absolute bottom-[1px] z-10">
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

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const screen = params.get("screen");
        if (screen && Object.values(Screens).includes(screen as Screens)) {
            setActiveScreen(screen as Screens);
        }
    }, [setActiveScreen]);

    useEffect(() => {
        window.history.replaceState(null, "", `?screen=${activeScreen}`);
    }, [activeScreen]);

    return (
        <div className="absolute bottom-4 flex w-full justify-between left-12 p-2 z-[100]">
            <div className="flex gap-4">
                {Object.values(Screens).map((screen) => (
                    <ScreenButton
                        isActiveScreen={screen === activeScreen}
                        key={screen}
                        screen={screen}
                        onClick={handleChangeScreen(screen)}
                    ></ScreenButton>
                ))}
            </div>
            <div className="relative">
                <div className="absolute right-28 top-3">
                    <MasterKnob />
                </div>
            </div>
        </div>
    );
}
