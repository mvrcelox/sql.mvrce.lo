"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React from "react";

export function SlideInRoot({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
   return <div {...props} className={cn("-my-2 inline-block overflow-hidden py-2", className)} />;
}

interface SlideInProps extends React.ComponentPropsWithoutRef<typeof motion.div> {
   tag?: React.ElementType;
   from?: "top" | "right" | "bottom" | "left";
   duration?: number;
   delay?: number;
}

const directions = {
   top: "translate(0%,-130%)",
   right: "translate(130%,0%)",
   bottom: "translate(0%,130%)",
   left: "translate(-130%,0%)",
};

export function SlideInContent({ from = "bottom", duration = 0.25, delay = 0, className, ...props }: SlideInProps) {
   // return <div className="bg-blue-500"></div>;
   // const Component = motion[tag];
   return (
      <motion.span
         {...props}
         className={cn("block w-max", className)}
         initial={{ transform: directions[from] }}
         animate={{ transform: "translate(0%,0%)" }}
         transition={{ type: "spring", duration, delay }}
      />
   );
}

// const SlideIn = {
//    Root: SlideInRoot,
//    Content: SlideInContent,
// };

export default {
   Root: SlideInRoot,
   Content: SlideInContent,
};
