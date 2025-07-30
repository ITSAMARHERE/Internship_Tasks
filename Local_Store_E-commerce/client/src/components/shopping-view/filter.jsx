import { filterOptions } from "@/config";
import { Fragment, useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

function ProductFilter({ filters, handleFilter }) {
    const [expandedSections, setExpandedSections] = useState(Object.keys(filterOptions).reduce((acc, key) => {
        acc[key] = true; // Start with all sections expanded
        return acc;
    }, {}));

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Count active filters per section
    const getActiveFilterCount = (section) => {
        if (!filters || !filters[section]) return 0;
        return filters[section].length;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 border border-gray-200">
            <div className="pb-3 flex items-center justify-between">
                
                
            </div>
            
            <div className="py-2 space-y-3 md:space-y-4">
                {Object.keys(filterOptions).map((keyItem, index) => {
                    const activeCount = getActiveFilterCount(keyItem);
                    
                    return (
                        <Fragment key={index}>
                            <div className="border border-gray-100 rounded-md overflow-hidden bg-gray-50">
                                {/* Section Header - Clickable */}
                                <button 
                                    className="w-full p-2 md:p-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                                    onClick={() => toggleSection(keyItem)}
                                >
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm md:text-base font-medium text-gray-800">
                                            {keyItem}
                                        </h3>
                                        {activeCount > 0 && (
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                                {activeCount}
                                            </span>
                                        )}
                                    </div>
                                    {expandedSections[keyItem] ? 
                                        <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                                        <ChevronDown className="w-4 h-4 text-gray-500" />
                                    }
                                </button>
                                
                                {/* Filter Options - Collapsible */}
                                {expandedSections[keyItem] && (
                                    <div className="p-2 md:p-3 bg-white border-t border-gray-100">
                                        <div className="grid gap-2">
                                            {filterOptions[keyItem].map((option, idx) => (
                                                <Label 
                                                    key={idx} 
                                                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer p-1 rounded hover:bg-gray-50"
                                                >
                                                    <Checkbox
                                                        checked={
                                                            filters && 
                                                            Object.keys(filters).length > 0 && 
                                                            filters[keyItem] && 
                                                            filters[keyItem].indexOf(option.id) > -1
                                                        }
                                                        onCheckedChange={() => handleFilter(keyItem, option.id)} 
                                                        className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                                    />
                                                    <span className="flex-1">{option.label}</span>
                                                </Label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {index !== Object.keys(filterOptions).length - 1 && 
                                <Separator className="border-gray-100 my-1" />
                            }
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
}

export default ProductFilter;