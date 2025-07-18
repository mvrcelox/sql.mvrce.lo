"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function CustomTextArea() {
   const [text, setText] = useState("");
   const [selection, setSelection] = useState({ start: 0, end: 0 }); // Changed from caretIndex
   const [caretCoords, setCaretCoords] = useState({ top: 0, left: 0 });
   const textareaRef = useRef<HTMLTextAreaElement>(null);
   const mirrorRef = useRef<HTMLDivElement>(null);
   const caretSpanRef = useRef<HTMLSpanElement>(null);

   const updateCaretPosition = () => {
      const textarea = textareaRef.current;
      const mirror = mirrorRef.current;
      const caretSpan = caretSpanRef.current;
      if (!textarea || !mirror || !caretSpan) return;

      // Synchronize scroll positions
      mirror.scrollTop = textarea.scrollTop;
      mirror.scrollLeft = textarea.scrollLeft;

      const { selectionStart, selectionEnd } = textarea; // Get both start and end
      setSelection({ start: selectionStart, end: selectionEnd });

      // Atualiza posição após render do espelho
      requestAnimationFrame(() => {
         const spanRect = caretSpan.getBoundingClientRect();
         const mirrorRect = mirror.getBoundingClientRect();
         setCaretCoords({
            top: spanRect.top - mirrorRect.top,
            left: spanRect.left - mirrorRect.left,
         });
      });
   };

   // Function to clear text selection
   const clearSelection = () => {
      const textarea = textareaRef.current;
      if (textarea) {
         const currentPosition = textarea.selectionEnd; // Collapse selection to its current end point
         textarea.selectionStart = currentPosition;
         textarea.selectionEnd = currentPosition;

         // Call updateCaretPosition to synchronize state and UI
         updateCaretPosition();
      }
   };

   useEffect(() => {
      updateCaretPosition();
   }, [text]); // Keep this to update on text change

   return (
      <div style={{ position: "relative", width: 400, height: 200 }}>
         <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
               setText(e.target.value);
               setTimeout(updateCaretPosition, 0);
            }}
            onClick={updateCaretPosition}
            onKeyUp={updateCaretPosition}
            onScroll={updateCaretPosition}
            onSelect={updateCaretPosition} // Added onSelect handler
            onBlur={clearSelection} // Added onBlur handler to clear selection
            className="bg-gray-50 text-base leading-6 outline-none selection:text-transparent selection:[text-shadow:none]" // You can add 'no-scrollbar' here later
            style={{
               position: "absolute",
               top: 0,
               left: 0,
               width: "100%",
               height: "100%",
               // background: "transparent",
               color: "transparent", // Changed from "" to "transparent"
               caretColor: "transparent",
               resize: "none",
               padding: "8px",

               overflow: "auto", // Added to enable scrolling
            }}
         />

         {/* Texto espelho */}
         <div
            ref={mirrorRef}
            className="text-base leading-6" // You can add 'no-scrollbar' here later
            style={{
               position: "absolute",
               top: 0,
               left: 0,
               width: "100%", // Added
               height: "100%", // Added
               padding: "9px",
               whiteSpace: "pre-wrap",
               wordBreak: "break-word",
               pointerEvents: "none",
               color: "#000",
               overflow: "auto", // Added to enable scrolling
            }}
         >
            {/* Text before selection */}
            {text.slice(0, selection.start)}
            {/* Highlighted selected text */}

            {textareaRef.current?.selectionDirection == "backward" && (
               <motion.span ref={caretSpanRef} className="h-full w-0" />
            )}

            {selection.start !== selection.end && (
               <span
                  className="inline"
                  style={{ backgroundColor: "rgba(173, 216, 230, 0.7)" }} // Light blue highlight
               >
                  {text.slice(selection.start, selection.end)}
               </span>
            )}
            {/* Caret measuring span, positioned at the end of the selection */}
            {textareaRef.current?.selectionDirection != "backward" && (
               <motion.span ref={caretSpanRef} className="h-full w-0" />
            )}
            {/* Text after selection end */}
            {text.slice(selection.end)}
         </div>

         {/* Custom caret animado */}
         <motion.span
            className="bg-primary absolute h-[21px] w-0.5 rounded-sm opacity-100"
            style={{
               top: Math.max(8, caretCoords.top), // Removed +8
               left: Math.max(8, caretCoords.left), // Removed +8
            }}
         />
      </div>
   );
}
