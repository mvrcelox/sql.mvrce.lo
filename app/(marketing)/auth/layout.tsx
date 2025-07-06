import AuthAside from "./auth-aside";

export default function Layout({ children }: React.PropsWithChildren) {
   return (
      <div className="my-auto flex flex-col justify-center gap-4 max-lg:items-center lg:flex-row">
         <AuthAside />
         {children}
      </div>
   );
}
