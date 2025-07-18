"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AES } from "crypto-js";

export default function Page() {
   const [value, setValue] = useState("");
   const encrypt = AES.encrypt(value, "secret").toString();
   return (
      <>
         <Input value={value} onChange={(e) => setValue(e.target.value)} />
         {encrypt.toString()}
      </>
   );
}
