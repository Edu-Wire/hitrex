"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";
import { PageTransition, FadeInUp, SlideInLeft, SlideInRight } from "@/components/animations";

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
      <div>
        {/* Hero Banner */}
        <div className="relative h-96 w-full">
          <Image
            src="/images/blog-hero.avif"
            alt="Blogs Banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 flex flex-col items-center justify-center">
            <FadeInUp>
              <h1 className="text-5xl font-bold text-white mb-4">Blogs</h1>
              <p className="text-lg text-gray-200">Inspiring stories from the trails</p>
            </FadeInUp>
          </div>
        </div>

        {/* Blog Sections */}
        <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">
          {blogs.map((blog, index) => (
            <div
              key={blog.id}
              className={`grid md:grid-cols-2 gap-10 items-center ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Text Section */}
              {index % 2 === 0 ? (
                <SlideInLeft delay={index * 0.2}>
                  <div>
                    <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide border-l-4 border-green-700 pl-2 mb-3">
                      {blog.subtitle}
                    </h3>
                    <h2 className="text-3xl font-bold mb-4">{blog.title}</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">{blog.description}</p>
                    <Link
                      href={`/blogs/${blog.id}`}
                      className="inline-block bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-lg transition-all transform hover:scale-105"
                    >
                      Read More →
                    </Link>
                  </div>
                </SlideInLeft>
              ) : (
                <SlideInRight delay={index * 0.2}>
                  <div>
                    <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide border-l-4 border-green-700 pl-2 mb-3">
                      {blog.subtitle}
                    </h3>
                    <h2 className="text-3xl font-bold mb-4">{blog.title}</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">{blog.description}</p>
                    <Link
                      href={`/blogs/${blog.id}`}
                      className="inline-block bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-lg transition-all transform hover:scale-105"
                    >
                      Read More →
                    </Link>
                  </div>
                </SlideInRight>
              )}

              {/* Swiper Section */}
              {index % 2 === 0 ? (
                <SlideInRight delay={index * 0.2 + 0.1}>
                  <div>
                    <Swiper
                      modules={[Pagination]}
                      pagination={{ clickable: true }}
                      spaceBetween={20}
                      slidesPerView={1}
                      breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 2 },
                      }}
                    >
                      {blog.images.map((src, idx) => (
                        <SwiperSlide key={idx}>
                          <div className="relative h-64 w-full rounded-lg overflow-hidden group">
                            <Image
                              src={src}
                              alt={`${blog.title} ${idx + 1}`}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                              <span className="text-white font-semibold">{blog.title}</span>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </SlideInRight>
              ) : (
                <SlideInLeft delay={index * 0.2 + 0.1}>
                  <div>
                    <Swiper
                      modules={[Pagination]}
                      pagination={{ clickable: true }}
                      spaceBetween={20}
                      slidesPerView={1}
                      breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 2 },
                      }}
                    >
                      {blog.images.map((src, idx) => (
                        <SwiperSlide key={idx}>
                          <div className="relative h-64 w-full rounded-lg overflow-hidden group">
                            <Image
                              src={src}
                              alt={`${blog.title} ${idx + 1}`}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                              <span className="text-white font-semibold">{blog.title}</span>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </SlideInLeft>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
