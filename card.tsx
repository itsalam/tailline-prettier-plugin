"use client";
import { useDebounce } from "@/lib/clientUtils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ComponentPropsWithoutRef,
  Dispatch,
  ElementRef,
  SetStateAction,
  forwardRef,
  useMemo,
} from "react";
import DigitSpinner, { DIRECTION } from "./motion/DigitSpinner";

const Loading = forwardRef<
  ElementRef<typeof motion.div>,
  ComponentPropsWithoutRef<typeof motion.div> & {
    prog: number;
    setLoading: Dispatch<SetStateAction<boolean>>;
  }
>((props, ref) => {
  const { prog, setLoading, ...motionProps } = props;
  const debounceProg = useDebounce<number>(prog, 900, 200);

  const Spinner = useMemo(() => {
    const handleAnimationComplete = () => {
      if (debounceProg >= 100) {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    return (
      <>
        <DigitSpinner
          key="hundreds"
          digit={~~(debounceProg / 100)}
          onAnimationComplete={handleAnimationComplete}
        />
        <DigitSpinner
          key="tens"
          direction={DIRECTION.DOWN}
          digit={~~(debounceProg / 10) % 10}
        />
        <DigitSpinner key="units" digit={~~debounceProg % 10} />
      </>
    );
  }, [debounceProg, setLoading]);

  return (
    <motion.div
      ref={ref}
      className={cn(
        "absolute", // basicStyles
        "right-10 bottom-4 flex h-36", // positioning, sizing
        "items-start justify-center gap-1 overflow-hidden", // layout, overflowControl
        "font-favorit text-8xl text-[--gray-a7]" // textStyles
      )}
      {...motionProps}
    >
      {Spinner}
    </motion.div>
  );
});

Loading.displayName = "Loading";

export default Loading;
