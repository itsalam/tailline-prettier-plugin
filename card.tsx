"use client";

import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/themes";
import { motion } from "framer-motion";
import { ComponentProps } from "react";

export default function ExperienceCard(
  props: ComponentProps<typeof motion.div>
) {

  return (
                <Separator
                  className={cn({
                    "opacity-25": j !== 0,
                    "opacity-100": j === 0,
                  })}
                  size="4"
                />
                
  );
}
