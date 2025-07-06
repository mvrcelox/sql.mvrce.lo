"use client";

import { useRef, useState } from "react";

type Direction = "forward" | "backward" | "none";

const keywords = ["SELECT", "FROM", "WHERE", "INSERT", "UPDATE", "DELETE"];

export default function Editor() {
   // const caret = useRef<HTMLSpanElement>(null);
   const textArea = useRef<HTMLTextAreaElement>(null);

   const [value, setValue] = useState("");
   const [selection, setSelection] = useState<{ start: number; end: number; direction: Direction }>({
      start: 0,
      end: 0,
      direction: "forward",
   });

   const caretPos = selection.direction === "backward" ? selection.start : selection.end;
   const top = caretPos
      ? value
           .split("\n")
           .reduce(
              (acc, line) => (caretPos - acc[1] > line.length ? [acc[0] + 1, acc[1] + line.length] : acc),
              [0, 0],
           )[0] * 20
      : 0;

   const left = value.split("\n").reduce((acc, line) => {
      // console.log({
      //    caretPos,
      //    acc,
      //    line,
      //    length: line.length,
      // });
      if (caretPos - acc > line.length) {
         // console.log("bigger");
         return acc + line.length + 1; // +1 for the space
      }
      // console.log("smaller");
      return Math.max(caretPos - acc, 0);
   }, 0);

   return (
      <div className="relative flex grow self-stretch">
         <textarea
            className="absolute inset-0 font-mono text-transparent caret-transparent opacity-0"
            ref={textArea}
            onChange={(e) => {
               const target = e.currentTarget;
               console.log("onChange", target.value, target.selectionStart, target.selectionEnd);
               setValue(target.value);
            }}
            onSelect={(e) => {
               const target = e.currentTarget;
               const start = target.selectionStart;
               const end = target.selectionEnd;
               const direction: Direction = start < end ? "forward" : start > end ? "backward" : "none";

               console.log("onSelect", { start, end, direction });
               console.log(
                  "line",
                  target.value.split("\n").reduce((acc, line) => {
                     if (start - acc > line.length) {
                        return acc + line.length + 1; // +1 for the space
                     }
                     return Math.max(start - acc, 0);
                  }, 0),
               );

               setSelection({
                  start: target.selectionStart,
                  end: target.selectionEnd,
                  direction,
               });
            }}
         />
         <div className="flex h-fit flex-col px-1 py-2">
            {value.split("\n").map((line, index) => {
               return (
                  <span key={index} className="block text-sm text-gray-500">
                     {index + 1}
                  </span>
               );
            })}
         </div>
         <div
            className="bg-background pointer-events-none relative h-full w-full grow cursor-text self-stretch p-4 px-1 py-2 text-sm whitespace-pre outline-none"
            onClick={() => textArea.current?.focus()}
         >
            {value?.split("\n").map((line, index) => {
               let characters = 0;
               return (
                  <p key={index}>
                     {line.split(" ").map((word, wordIndex) => {
                        characters += word.length + 1; // +1 for the space
                        if (word === "=") {
                           return (
                              <span key={wordIndex} className="font-mono text-fuchsia-400 dark:text-fuchsia-600">
                                 {word}{" "}
                              </span>
                           );
                        }
                        if (keywords.includes(word.toUpperCase())) {
                           return (
                              <span key={wordIndex} className="text-primary font-mono">
                                 {word}{" "}
                              </span>
                           );
                        }
                        return (
                           <span key={wordIndex} className="font-mono">
                              {word}{" "}
                           </span>
                        );
                     })}
                     {/* {index < value.split("\n").length - 1 && <br />} */}
                  </p>
               );
            })}
            <span
               style={{
                  top: 8,
                  left: 4 + left,
               }}
               className="bg-primary absolute block h-5 w-px"
            />
         </div>
      </div>
   );
}
