import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: React.SVGAttributes<SVGElement>) {
   return (
      <svg
         viewBox="0 0 16 16"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         className={cn("size-5 shrink-0 fill-primary", className)}
         {...props}
      >
         <path d="M14 2L8 0L2 2L0 8L2 14L8 16L14 14L16 8L14 2Z" />
         {/* <path
            d="M14 2L8 0L2 2L0 8L2 14L8 16L14 14L16 8L14 2Z"
            // fill="url(#paint0_radial_582_162)"
         />
         <defs>
            <radialGradient
               id="paint0_radial_582_162"
               cx="0"
               cy="0"
               r="1"
               gradientUnits="userSpaceOnUse"
               gradientTransform="translate(8 1.5) rotate(90) scale(14.5)"
            >
               <stop stop-color="#FF9D00" />
               <stop offset="0.6" stop-color="#FF0000" />
               <stop offset="1" stop-color="#5600B3" />
            </radialGradient>
         </defs> */}
      </svg>
   );
}
