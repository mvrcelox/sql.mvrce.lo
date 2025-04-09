"use client";

import { Select, SelectContent, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Switch } from "../components/ui/switch";
import { useToggle } from "react-use";

export default function Selects() {
   const [placeholder, togglePlaceholder] = useToggle(false);

   return (
      <div className="flex flex-col gap-2">
         <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Select</h2>
            <div className="flex items-center gap-1">
               <span className="px-1 text-sm text-gray-600">Placeholder</span>
               <Switch onCheckedChange={togglePlaceholder} />
            </div>
         </div>
         <div className="flex flex-col gap-2 self-stretch md:flex-row md:items-center md:gap-4">
            <div className="flex grow flex-col gap-2 self-stretch">
               <span className="text-sm text-gray-700">Primary</span>
               <Select>
                  <SelectTrigger intent="primary">
                     <SelectValue placeholder={placeholder ? "Select something" : undefined}>
                        Select an option
                     </SelectValue>
                     <SelectContent>
                        <div className="p-4 text-center text-xs text-gray-700">Sorry, it{"'"}s empty</div>
                     </SelectContent>
                  </SelectTrigger>
               </Select>
            </div>
            <div className="flex grow flex-col gap-2 self-stretch">
               <span className="text-sm text-gray-700">Gray</span>
               <Select>
                  <SelectTrigger intent="gray">
                     <SelectValue placeholder={placeholder ? "Select something" : undefined}>
                        Select an option
                     </SelectValue>
                     <SelectContent>
                        <div className="p-4 text-center text-xs text-gray-700">Sorry, it{"'"}s empty</div>
                     </SelectContent>
                  </SelectTrigger>
               </Select>
            </div>
            <div className="flex grow flex-col gap-2 self-stretch">
               <span className="text-sm text-gray-700">Opaque</span>
               <Select>
                  <SelectTrigger intent="opaque">
                     <SelectValue placeholder={placeholder ? "Select something" : undefined}>
                        Select an option
                     </SelectValue>
                     <SelectContent>
                        <div className="p-4 text-center text-xs text-gray-700">Sorry, it{"'"}s empty</div>
                     </SelectContent>
                  </SelectTrigger>
               </Select>
            </div>
         </div>
      </div>
   );
}
