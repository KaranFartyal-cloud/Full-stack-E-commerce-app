import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const ProductDetailsSkeleton = () => {
  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* LEFT SIDE IMAGE SKELETON */}
      <div>
        <Skeleton className="w-full h-80 rounded-lg" />
      </div>

      {/* RIGHT SIDE DETAILS */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-2/3" /> {/* title */}
        <Skeleton className="h-6 w-1/3" /> {/* price */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/4" /> {/* category */}
        <Skeleton className="h-12 w-full rounded-lg" /> {/* button */}
      </div>
    </motion.div>
  );
};

export default ProductDetailsSkeleton;
