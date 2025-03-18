export default function Layout({ children }: React.PropsWithChildren) {
   return (
      <div className="flex grow flex-col self-stretch overflow-hidden">
         <div className="h-[calc(2.5rem+1px)] border-b"></div>
         {children}
      </div>
   );
}
