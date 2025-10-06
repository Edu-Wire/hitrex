import Image from "next/image";

export default function DestinationCard({ destination }) {
    // console.log(destination);
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition transform">
      <div className="relative h-48 w-full">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold">{destination.name}</h3>
        <p className="text-gray-500">{destination.location}</p>
        <p className="text-gray-600 mt-2 text-sm">{destination.description}</p>
      </div>
    </div>
  );
}
