import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";

const easing = [0.22, 1, 0.36, 1];

export default function PageTransition({ children }) {
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const transition = { duration: reducedMotion ? 0.01 : 0.19, ease: easing };
  const hidden = reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 };
  const exit = reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location.pathname} initial={hidden} animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }} exit={exit} transition={transition}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
