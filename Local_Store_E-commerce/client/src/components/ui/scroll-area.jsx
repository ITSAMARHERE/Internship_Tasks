// src/components/ui/scroll-area.jsx
import * as React from "react";

/**
 * ScrollArea component that provides a custom scrollable area
 * This is a simplified implementation based on the component usage in product-details.jsx
 */
export function ScrollArea({ children, className, ...props }) {
  return (
    <div
      className={`relative overflow-auto ${className}`}
      style={{ 
        scrollbarWidth: "thin",
        scrollbarColor: "rgb(203 213 225) transparent"
      }}
      {...props}
    >
      {children}
    </div>
  );
}