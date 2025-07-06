"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToggle } from "react-use";

export default function Inputs() {
   const [placeholder, togglePlaceholder] = useToggle(false);

   return (
      <div className="flex flex-col gap-2">
         <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Input</h2>
            <div className="flex items-center gap-1">
               <span className="px-1 text-sm text-gray-600">Placeholder</span>
               <Switch onCheckedChange={togglePlaceholder} />
            </div>
         </div>
         <div className="flex flex-col gap-2 self-stretch md:flex-row md:items-center md:gap-4">
            <div className="flex grow flex-col gap-2 self-stretch">
               <span className="text-sm text-gray-700">Primary</span>
               <Input intent="primary" placeholder={placeholder ? "Type something" : undefined} />
            </div>
            <div className="flex grow flex-col gap-2 self-stretch">
               <span className="text-sm text-gray-700">Gray</span>
               <Input intent="gray" placeholder={placeholder ? "Type something" : undefined} />
            </div>
            <div className="flex grow flex-col gap-2 self-stretch">
               <span className="text-sm text-gray-700">Opaque</span>
               <Input intent="opaque" placeholder={placeholder ? "Type something" : undefined} />
            </div>
         </div>
      </div>
   );
}
