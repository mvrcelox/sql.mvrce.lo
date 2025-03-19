import TableHeader from "../header";

export default function Layout({ children }: React.PropsWithChildren) {
   return (
      <div className="flex grow flex-col self-stretch overflow-hidden">
         <TableHeader />
         {children}
      </div>
   );
}
