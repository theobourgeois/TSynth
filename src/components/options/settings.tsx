import { useThemeStore, ThemeTypes, themes } from "../../utils/theme-utils";
import { Label, Select } from "../screen/inputs";
import { useMIDI } from "../../providers/midi-provider";

export function Settings() {
    const themeName = useThemeStore((state) => state.themeName);
    const setTheme = useThemeStore((state) => state.setTheme);
    const { selectedMIDIDevice, setSelectedMIDIDevice, MIDIDevices } =
        useMIDI();

    const handleChangeTheme = (themeName: string) => {
        setTheme(themeName as ThemeTypes);
    };

    const handleChangeMIDIDevice = (deviceId: string) => {
        const device = MIDIDevices.find((device) => device.id === deviceId);
        if (device) {
            setSelectedMIDIDevice(device);
        }
    };

    return (
        <div className="grid grid-cols-2 items-center gap-2">
            <div className="flex-grow">
                <Label>Theme</Label>
                <Select
                    value={themeName}
                    onChange={handleChangeTheme}
                    options={Object.keys(themes).map((themeName) => ({
                        value: themeName,
                        label: themeName,
                    }))}
                />
            </div>
            <div className="flex-grow">
                <Label>MIDI input device</Label>
                <Select
                    value={selectedMIDIDevice?.id ?? ""}
                    onChange={handleChangeMIDIDevice}
                    options={MIDIDevices.map((device) => ({
                        value: device.id,
                        label: device.name || "Unnamed device",
                    }))}
                />
            </div>
        </div>
    );
}
