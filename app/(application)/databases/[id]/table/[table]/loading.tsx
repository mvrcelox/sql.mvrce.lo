import { Loader2 } from "lucide-react";

export default function Loading() {
   // return (
   //    <main className="relative grid grow place-items-center self-stretch bg-gray-100">
   //       <div className="relative size-10">
   //          {new Array(12).fill(null).map((_, i, arr) => {
   //             const cx = 100 / (arr.length - 1);
   //             const angle = 360 / arr.length;
   //             const offsetX = 50 + 0.5 * 100 * Math.cos((Math.PI / 180) * angle * i);
   //             const offsetY = 50 + 0.5 * 100 * Math.sin((Math.PI / 180) * angle * i);
   //             return (
   //                <div
   //                   style={{
   //                      animationDelay: -0.1 * (arr.length - i) + "s",
   //                      animationDuration: 0.1 * arr.length + "s",
   //                      rotate: `${angle * i}deg`,
   //                      left: `${offsetX}%`,
   //                      top: `${offsetY}%`,
   //                   }}
   //                   className="animate-spinner-spin bg-primary absolute h-[8%] w-[25%] origin-right -translate-x-full -translate-y-1/2"
   //                />
   //             );
   //          })}
   //       </div>
   //       {/* <div className="absolute left-1/2 h-2 w-8 origin-left bg-blue-500 before:absolute before:size-2 before:bg-amber-500" /> */}
   //    </main>
   // );

   return (
      <main className="grid grow place-items-center self-stretch bg-gray-100">
         <Loader2
            className="animate-spin-reverse col-start-1 col-end-1 row-start-1 row-end-1 size-10 shrink-0"
            strokeWidth={1}
         />
         <Loader2 className="text-primary col-start-1 col-end-1 row-start-1 row-end-1 size-5 shrink-0 animate-spin" />
      </main>
   );
}
