import { buttonVariants } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Notifications() {
   return (
      <DropdownMenu>
         <DropdownMenuTrigger
            className={buttonVariants({
               intent: "ghost",
               className: "group aria-expanded:text-foreground relative size-10 p-0 aria-expanded:bg-gray-200",
            })}
         >
            <span className="flex size-5 shrink-0 flex-col items-center gap-0.5">
               <svg
                  width="20"
                  height="17"
                  viewBox="0 0 20 17"
                  fill="transparent"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current"
               >
                  <path
                     className="stroke-gray-400 group-hover:stroke-gray-500 group-aria-expanded:stroke-gray-500"
                     d="M1.37208 15.8375C1.2082 15.7316 1.07894 15.5807 1 15.4034C1 15.4034 3.2443 10.404 3.94221 7C4.60705 3.75736 5.71641 2.75736 5.71641 2.75736C5.71641 2.75736 6.97072 1 9.9997 1C13.0287 1 14.283 2.75736 14.283 2.75736C14.283 2.75736 15.2926 3.75736 16.0572 7C16.8549 10.3829 19 15.4045 19 15.4045C18.9209 15.5817 18.7914 15.7324 18.6274 15.8381C18.4635 15.9438 18.272 16.0001 18.0763 16H1.92305C1.72738 15.9999 1.53596 15.9434 1.37208 15.8375Z"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
                  <path
                     d="M8 1.29077C6.40678 1.79009 5.71641 2.75733 5.71641 2.75733C5.71641 2.75733 4.60705 3.75733 3.94221 6.99997C3.2443 10.404 1 15.4034 1 15.4034C1.07894 15.5807 1.2082 15.7315 1.37208 15.8375C1.53596 15.9434 1.72738 15.9998 1.92305 16H18.0763C18.272 16 18.4635 15.9438 18.6274 15.8381C18.7914 15.7324 18.9209 15.5817 19 15.4045C19 15.4045 18.1263 13.3592 17.2868 11"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
               </svg>
               <svg
                  width="6"
                  height="2"
                  viewBox="0 0 6 2"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto stroke-current"
               >
                  <path d="M1 1L3 1L5 1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
            </span>
            <span className="bg-primary absolute top-2 left-5 z-10 size-2.5 rounded-full duration-150" />
         </DropdownMenuTrigger>
         <DropdownMenuContent></DropdownMenuContent>
      </DropdownMenu>
   );
}
