import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/app/components/ui/select";

export default function Page() {
   return (
      <div className="mx-auto flex w-full max-w-7xl grow flex-col gap-4 p-4">
         <div className="flex flex-col gap-2">
            <h2 className="text-foreground text-lg font-semibold">Inputs</h2>
            <div className="flex flex-col gap-2 self-stretch">
               <span className="text-foreground text-sm">Primary</span>
               <Input intent="primary" />
            </div>
            <div className="flex flex-col gap-2 self-stretch">
               <span className="text-foreground text-sm">Gray</span>
               <Input intent="gray" />
            </div>
            <div className="flex flex-col gap-2 self-stretch">
               <span className="text-foreground text-sm">Opaque</span>
               <Input intent="opaque" />
            </div>
         </div>
         <div className="flex flex-col gap-2">
            <h2 className="text-foreground text-lg font-semibold">Selects</h2>
            <div className="flex flex-col gap-2 self-stretch">
               <span className="text-foreground text-sm">Primary</span>
               <Select>
                  <SelectTrigger intent="primary">
                     <SelectValue>Select an option</SelectValue>
                     <SelectContent>
                        <div className="p-4 text-center text-xs text-gray-700">Sorry, it{"'"}s empty</div>
                     </SelectContent>
                  </SelectTrigger>
               </Select>
            </div>
            <div className="flex flex-col gap-2 self-stretch">
               <span className="text-foreground text-sm">Gray</span>
               <Select>
                  <SelectTrigger intent="gray">
                     <SelectValue>Select an option</SelectValue>
                     <SelectContent>
                        <div className="p-4 text-center text-xs text-gray-700">Sorry, it{"'"}s empty</div>
                     </SelectContent>
                  </SelectTrigger>
               </Select>
            </div>
            <div className="flex flex-col gap-2 self-stretch">
               <span className="text-foreground text-sm">Opaque</span>
               <Select>
                  <SelectTrigger intent="opaque">
                     <SelectValue>Select an option</SelectValue>
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
