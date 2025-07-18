import TerminalsSidebar from "@/components/sidebars/terminals-sidebar";
import Editor from "./editor";

export default function Page() {
   return (
      <section className="flex grow self-stretch">
         <TerminalsSidebar />
         <Editor />
         {/* <div
            className="bg-background caret-primary h-full grow self-stretch p-4 px-1 py-2 text-sm whitespace-pre outline-none"
            contentEditable
            onChange={(e) => {
               console.log(e.currentTarget.textContent);
            }}
         /> */}
         {/* <TextArea
            intent="none"
            className="bg-background caret-primary h-full grow resize-none self-stretch rounded-none px-1"
         /> */}
      </section>
   );
}
