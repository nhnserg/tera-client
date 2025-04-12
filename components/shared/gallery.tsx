"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "../ui/carousel";

export const Gallery = ({ photos }: { photos: string[] }) => {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbnailApi, setThumbnailApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const mainImage = useMemo(
    () =>
      Array.isArray(photos) &&
      photos.map((photo, index) => (
        <CarouselItem key={index} className="relative aspect-square w-full">
          <Image
            src={photo}
            alt={`Изображение ${index + 1}`}
            fill
            className="rounded object-contain"
          />
        </CarouselItem>
      )),
    [photos]
  );

  const thumbnailImages = useMemo(
    () =>
      Array.isArray(photos) &&
      photos.map((photo, index) => (
        <CarouselItem
          key={index}
          className={`relative aspect-square w-full basis-1/4 h-32 mr-1 last:mr-0 ${
            index === current ? "border-2" : ""
          }`}
          onClick={() => handleClick(index)}
        >
          <Image
            src={photo}
            alt={`Миниатюра ${index + 1}`}
            fill
            className="rounded object-cover"
          />
        </CarouselItem>
      )),
    [photos, current]
  );

  const handleClick = (index: number) => {
    if (!mainApi || !thumbnailApi) return;
    mainApi.scrollTo(index);
    thumbnailApi.scrollTo(index);
    setCurrent(index);
  };

  return (
    <div>
      <Carousel setApi={setMainApi} className="mb-4">
        <CarouselContent className="max-h-96">{mainImage}</CarouselContent>
      </Carousel>
      <Carousel setApi={setThumbnailApi}>
        <CarouselContent>{thumbnailImages}</CarouselContent>
      </Carousel>
    </div>
  );
};
