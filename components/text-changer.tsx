"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import useMeasure from "react-use-measure";

const variants = {
   initial: { opacity: 0, y: -12, scale: 0.6, filter: "blur(1px)" },
   animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
   exit: { opacity: 0, y: 12, scale: 0.5, filter: "blur(2px)" },
};

function Component({ phrase }: { phrase: string }) {
   const [ref, bounds] = useMeasure();
   return (
      <motion.div
         className="inline-flex"
         initial={{ width: bounds.width || "auto" }}
         animate={{ width: bounds.width || "auto" }}
         transition={{ duration: 0.2 }}
      >
         <AnimatePresence initial={false} mode="popLayout">
            <motion.div
               key={phrase}
               initial="initial"
               animate="animate"
               exit="exit"
               transition={{ staggerChildren: 0.025 }}
            >
               <div ref={ref} className="inline-flex">
                  {phrase.split("").map((letter, index) => (
                     <motion.span key={index} className="relative block" variants={variants} transition={{ bounce: 0 }}>
                        {letter === " " ? "\u00A0" : letter}
                     </motion.span>
                  ))}
                  <motion.span className="relative block" variants={variants} transition={{ bounce: 0 }}>
                     .
                  </motion.span>
               </div>
            </motion.div>
         </AnimatePresence>
      </motion.div>
   );
}

const WORDS = ["security", "speed", "reliability"];
const TIMER_INTERVAL = 5000;

export default function TextChanger() {
   const [phrase, setPhrase] = useState(WORDS[0]);
   useEffect(() => {
      const interval = setInterval(() => {
         setPhrase((prev) => {
            const nextIndex = (WORDS.indexOf(prev) + 1) % WORDS.length;
            return WORDS[nextIndex];
         });
      }, TIMER_INTERVAL);

      return () => clearInterval(interval);
   }, []);

   return <Component phrase={phrase} />;
}
