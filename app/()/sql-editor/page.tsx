import { TextArea } from "@/components/ui/textarea";

export default function Page() {
   return (
      <main className="flex grow flex-col self-stretch">
         <TextArea intent="none" className="bg-background grow resize-none self-stretch rounded-none" />
      </main>
   );
}
