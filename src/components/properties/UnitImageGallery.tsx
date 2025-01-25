import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnitImage {
  id: string;
  image_url: string;
}

interface UnitImageGalleryProps {
  unitId: string;
  images: UnitImage[];
}

export const UnitImageGallery = ({ images }: UnitImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5 text-blue-600" />
            Unit Images
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 bg-muted/10">
          <p className="text-muted-foreground">No images available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5 text-blue-600" />
          Unit Images
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <img
              src={images[currentImageIndex].image_url}
              alt={`Unit image ${currentImageIndex + 1}`}
              className="object-cover w-full h-full"
            />
          </div>
          
          {images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <Button
                variant="secondary"
                size="icon"
                onClick={previousImage}
                className="rounded-full bg-white/80 hover:bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={nextImage}
                className="rounded-full bg-white/80 hover:bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-center">
          <p className="text-sm text-muted-foreground">
            Image {currentImageIndex + 1} of {images.length}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};