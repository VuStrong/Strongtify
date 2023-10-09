"use client";

import * as RadixSlider from "@radix-ui/react-slider";

interface SlideProps {
    value?: number;
    onChange?: (value: number) => void;
    onCommit?: (value: number) => void;
}

const Slider: React.FC<SlideProps> = ({ value = 0, onChange, onCommit }) => {
    return (
        <RadixSlider.Root
            className="relative flex items-center select-none touch-none w-full cursor-pointer"
            defaultValue={[0]}
            value={[value]}
            onValueChange={(newValue: number[]) => {
                onChange?.(newValue[0]);
            }}
            onValueCommit={(newValue) => {
                onCommit?.(newValue[0]);
            }}
            min={0}
            max={100}
            step={1}
        >
            <RadixSlider.Track
                className="bg-neutral-600 relative grow rounded-full h-[3px] hover:h-[6px]"
            >
                <RadixSlider.Range
                    className="absolute bg-white rounded-full h-full"
                />
            </RadixSlider.Track>

            <RadixSlider.Thumb className="block w-[10px] h-[10px] bg-white rounded-full hover:scale-125" />
        </RadixSlider.Root>
    );
};

export default Slider;
