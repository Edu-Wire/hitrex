"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";
import {
  PageTransition,
  FadeInUp,
  SlideInLeft,
  SlideInRight,
} from "@/components/animations";

const blogs = [
  {
    id: "hiking",
    subtitle: "Adventure",
    title: "Hiking",
    description:
      "Discover breathtaking trails and unique experiences on our curated hiking adventures.",
    images: ["/images/hiking-1.avif", "/images/hiking-2.avif", "/images/hiking-3.avif"],
  },
  {
    id: "winter-hiking",
    subtitle: "Snow Adventure",
    title: "Winter Hiking",
    description:
      "Embrace the snow with thrilling winter hikes and stunning frozen landscapes.",
    images: ["/images/winter-1.avif", "/images/winter-2.avif", "/images/winter-3.avif"],
  },
  {
    id: "camping",
    subtitle: "Forest Tours",
    title: "Camping",
    description:
      "Reconnect with nature through immersive camping trips under starry skies.",
    images: ["/images/camping-1.avif", "/images/camping-2.avif", "/images/camping-3.avif"],
  },
];

export default function BlogPage() {
  return (
    <PageTransition>
      <div className="w-full">
        {/* Hero Banner */}
        <div className="relative h-[50vh] sm:h-[60vh] w-full">
          <Image
            src="/images/blog-hero.avif"
            alt="Blogs Banner"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 flex flex-col items-center justify-center text-center px-4">
            <FadeInUp>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 sm:mb-4">
                Blogs
              </h1>
              <p className="text-base sm:text-lg text-gray-200">
                Inspiring stories from the trails
              </p>
            </FadeInUp>
          </div>
        </div>

        {/* Blog Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-20">
          {blogs.map((blog, index) => (
            <div
              key={blog.id}
              className={`flex flex-col ${
                index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              } gap-10 md:gap-16 items-center`}
            >
              {/* Text Section */}
              <div className="w-full md:w-1/2">
                {index % 2 === 0 ? (
                  <SlideInLeft delay={index * 0.2}>
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-green-700 uppercase tracking-wide border-l-4 border-green-700 pl-2 mb-2 sm:mb-3">
                        {blog.subtitle}
                      </h3>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                        {blog.title}
                      </h2>
                      <p className="text-gray-600 mb-5 sm:mb-6 leading-relaxed text-sm sm:text-base">
                        {blog.description}
                      </p>
                      <Link
                        href={`/blogs/${blog.id}`}
                        className="inline-block bg-green-700 hover:bg-green-800 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-all transform hover:scale-105 text-sm sm:text-base"
                      >
                        Read More →
                      </Link>
                    </div>
                  </SlideInLeft>
                ) : (
                  <SlideInRight delay={index * 0.2}>
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-green-700 uppercase tracking-wide border-l-4 border-green-700 pl-2 mb-2 sm:mb-3">
                        {blog.subtitle}
                      </h3>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                        {blog.title}
                      </h2>
                      <p className="text-gray-600 mb-5 sm:mb-6 leading-relaxed text-sm sm:text-base">
                        {blog.description}
                      </p>
                      <Link
                        href={`/blogs/${blog.id}`}
                        className="inline-block bg-green-700 hover:bg-green-800 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-all transform hover:scale-105 text-sm sm:text-base"
                      >
                        Read More →
                      </Link>
                    </div>
                  </SlideInRight>
                )}
              </div>

              {/* Swiper Section */}
              <div className="w-full md:w-1/2">
                {index % 2 === 0 ? (
                  <SlideInRight delay={index * 0.2 + 0.1}>
                    <Swiper
                      modules={[Pagination]}
                      pagination={{ clickable: true }}
                      spaceBetween={15}
                      slidesPerView={1}
                      breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 2 },
                      }}
                    >
                      {blog.images.map((src, idx) => (
                        <SwiperSlide key={idx}>
                          <div className="relative h-52 sm:h-64 md:h-72 w-full rounded-xl overflow-hidden group shadow-lg">
                            <Image
                              src={src}
                              alt={`${blog.title} ${idx + 1}`}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                              <span className="text-white text-sm sm:text-base font-semibold">
                                {blog.title}
                              </span>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </SlideInRight>
                ) : (
                  <SlideInLeft delay={index * 0.2 + 0.1}>
                    <Swiper
                      modules={[Pagination]}
                      pagination={{ clickable: true }}
                      spaceBetween={15}
                      slidesPerView={1}
                      breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 2 },
                      }}
                    >
                      {blog.images.map((src, idx) => (
                        <SwiperSlide key={idx}>
                          <div className="relative h-52 sm:h-64 md:h-72 w-full rounded-xl overflow-hidden group shadow-lg">
                            <Image
                              src={src}
                              alt={`${blog.title} ${idx + 1}`}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                              <span className="text-white text-sm sm:text-base font-semibold">
                                {blog.title}
                              </span>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </SlideInLeft>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
