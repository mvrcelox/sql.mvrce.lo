import * as React from "react";

import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
   required?: boolean;
}

export default function Label({ className, children, required, ...props }: LabelProps) {
   return (
      <label
         aria-required={required}
         className={cn("w-fit max-w-full text-sm font-medium text-gray-600", className)}
         {...props}
      >
         {children}
         {required && <span className="text-red-500 select-none dark:text-red-600">*</span>}
      </label>
   );
}
Label.displayName = "Label";
