import { forwardRef, useEffect, useState } from "react";
import { animate, motion, useMotionTemplate, useMotionValue } from "framer-motion";

import { cn } from "@/lib/utils";

import Button, { ButtonProps } from "./button";

const INITIAL = 100;

interface ConfirmButtonProps extends ButtonProps {
   duration?: number;
   onConfirm?: () => void;
   onStopConfirm?: (confirmed?: boolean) => void;
}
export const ConfirmButton = forwardRef<HTMLButtonElement, ConfirmButtonProps>(
   ({ onConfirm, onStopConfirm, duration = 1, className, children, ...props }, ref) => {
      const clip = useMotionValue(INITIAL);
      const [confirmed, setConfirmed] = useState(false);

      useEffect(() => {
         const unsubscribe = clip.on("change", (latest) => {
            if (confirmed) return;
            const isConfirmed = latest <= 0;

            if (!isConfirmed) return;
            setConfirmed(true);
            onConfirm?.();
         });
         return () => unsubscribe();
      }, [confirmed, clip, onConfirm]);

      function startConfirm() {
         animate(clip, 0, {
            ease: "linear",
            duration,
         });
      }

      function stopConfirm() {
         animate(clip, INITIAL, {
            type: "spring",
            stiffness: 500,
            damping: 50,
         });
      }

      function handleStopConfirm() {
         if (onStopConfirm) onStopConfirm(confirmed);
         stopConfirm();
      }

      const clipPath = useMotionTemplate`inset(0px ${clip}% 0px 0px round 0px)`;

      return (
         <Button
            className={cn("relative overflow-hidden", className)}
            {...props}
            ref={ref}
            onPointerDown={startConfirm}
            onPointerUp={handleStopConfirm}
            onMouseLeave={handleStopConfirm}
            onKeyDown={(e) => {
               if (e.key === "Escape") {
                  setConfirmed(false);
                  stopConfirm();
                  return;
               }
               if (e.key === "Enter") {
                  startConfirm();
               }
            }}
            onKeyUp={(e) => {
               if (e.key === "Enter") handleStopConfirm();
            }}
         >
            <span className="[display:inherit] [align-items:inherit] [justify-content:inherit] gap-[inherit] rounded-[inherit] bg-transparent">
               {children}
            </span>

            <motion.div
               key="bar"
               aria-hidden
               className="pointer-events-none absolute inset-0 [display:inherit] size-full [align-items:inherit] [justify-content:inherit] gap-[inherit]"
               style={{ clipPath }}
            >
               <span className="bg-primary relative z-2 [display:inherit] size-full flex-nowrap [align-items:inherit] [justify-content:inherit] gap-[inherit] text-neutral-100">
                  {children}
               </span>
            </motion.div>
         </Button>
      );
   },
);
ConfirmButton.displayName = "ConfirmButton";
