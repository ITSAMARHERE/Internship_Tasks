import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

function ShoppingProducTile({ product, handleGetProductDetails, handleAddtoCart }) {
  return (
    <Card className="w-full max-w-md mx-auto border border-gray-200 border-t-0 transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg overflow-hidden rounded-2xl pt-0">
      <div onClick={() => handleGetProductDetails(product?._id)} >
        {/* Image Section - Attached perfectly to top */}
        <div className="relative w-full rounded-t-2xl overflow-hidden">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[220px] object-cover block"
          />
          {
            product?.totalStock === 0 ?
              <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-400 text-white font-semibold">
                Out of Stock
              </Badge>
              :
              product?.totalStock < 10 ?
                <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-400 text-white font-semibold">
                  {`Only ${product?.totalStock} item left`}
                </Badge> :
                product?.salePrice > 0 && (
                  <Badge className="absolute top-2 left-2 bg-orange-300 hover:bg-orange-400 text-white font-semibold">
                    Sale
                  </Badge>
                )}
        </div>

        {/* Content Section */}
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2 truncate">{product?.title}</h2>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>{categoryOptionsMap[product?.category]}</span>
            <span>{brandOptionsMap[product?.brand]}</span>
          </div>

          {/* Prices */}
          <div className="flex justify-between items-center">
            <span
              className={`${product?.salePrice > 0 ? "line-through text-gray-500" : "text-primary"
                } text-base font-semibold`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-base font-bold text-primary">
                ${product?.salePrice}
              </span>
            )}
          </div>
        </CardContent>
      </div>
      {/* Add to Cart Button */}
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProducTile;
