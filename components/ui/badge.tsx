import { cva } from "class-variance-authority";

export const badgeVariants = cva("flex", {
   variants: {
      intent: {
         opaque: "bg-gray-200 hover:bg-gray-300",
      },
   },
});

export function Badge() {
   return <div className="flex items-center justify-center"></div>;
}
