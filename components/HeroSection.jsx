export default function HeroSection() {
  return (
    <div className="bg-[url('https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center rounded-md w-full h-screen flex items-center justify-center">
      <div className="bg-black/75 p-10 rounded-lg text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
        Explore the World with HITREX
      </h1>
      <p className="text-lg md:text-2xl text-white mb-8">
        Your Adventure Starts Here
      </p>
      <a
        href="/page/destination"
        className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition"
      >
        Discover Treks
      </a>
      </div>
    </div>
  );
}
