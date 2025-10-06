const destinations = [
  {
    id: "tour-du-mont-blanc",
    name: "Tour du Mont Blanc",
    location: "France/Italy/Switzerland",
    image: "/images/monatc.avif",
    description: "Classic long-distance trek circling Mont Blanc with stunning alpine views."
  },
  {
    id: "eiger-trail",
    name: "Eiger Trail",
    location: "Switzerland",
    image: "/images/siegr.avif",
    description: "Iconic trek along the base of the Eiger mountain in the Swiss Alps."
  },
  {
    id: "dolomites-trek",
    name: "Dolomites Trek",
    location: "Italy",
    image: "/images/Dolomites-Trek.avif",
    description: "Breathtaking trek through jagged peaks and alpine meadows."
  },
  {
    id: "black-forest",
    name: "Black Forest Trails",
    location: "Germany",
    image: "/images/black.avif",
    description: "Peaceful forest trekking with picturesque villages and dense greenery."
  },
//   {
//     id: "lofoten-islands-trek",
//     name: "Lofoten Islands Trek",
//     location: "Norway",
//     image: "/images/Lofoten.avif",
//     description: "Stunning coastal trekking with fjords, mountains, and Arctic landscapes."
//   },
//   {
//     id: "camino-de-santiago",
//     name: "Camino de Santiago",
//     location: "Spain",
//     image: "/images/camino-santiago.jpg",
//     description: "Historic pilgrimage route across northern Spain through towns and mountains."
//   },
//   {
//     id: "tour-of-the-anns",
//     name: "Tour of the Ann Mountains",
//     location: "Austria",
//     image: "/images/ann-mountains.jpg",
//     description: "Challenging alpine trekking with gorgeous meadows and peaks."
//   },
//   {
//     id: "grossglockner-high-alpine",
//     name: "Grossglockner High Alpine Trail",
//     location: "Austria",
//     image: "/images/grossglockner.jpg",
//     description: "High-altitude trail along Austria's highest peak."
//   },
//   {
//     id: "fjadrargljufur-canyon",
//     name: "Fjaðrárgljúfur Canyon Trek",
//     location: "Iceland",
//     image: "/images/fjord-canyon.jpg",
//     description: "Trek along dramatic canyon landscapes in Iceland."
//   },
//   {
//     id: "kinabalu-peak",
//     name: "Mount Kinabalu Trek",
//     location: "Malaysia",
//     image: "/images/kinabalu.jpg",
//     description: "Trek to the highest peak of Borneo with sunrise views."
//   },
//   {
//     id: "inca-trail",
//     name: "Inca Trail",
//     location: "Peru",
//     image: "/images/inca-trail.jpg",
//     description: "Famous trail to Machu Picchu through the Andes."
//   },
//   {
//     id: "torres-del-paine",
//     name: "Torres del Paine Circuit",
//     location: "Chile",
//     image: "/images/torres-paine.jpg",
//     description: "Patagonia trek with glaciers, mountains, and turquoise lakes."
//   },
//   {
//     id: "w-trek",
//     name: "W Trek",
//     location: "Chile",
//     image: "/images/w-trek.jpg",
//     description: "Iconic short trek in Torres del Paine with breathtaking views."
//   },
//   {
//     id: "patagonian-explorer",
//     name: "Patagonian Explorer Trek",
//     location: "Argentina/Chile",
//     image: "/images/patagonia.jpg",
//     description: "Long-distance trek through glaciers, mountains, and open plains."
//   },
//   {
//     id: "mount-rainier",
//     name: "Mount Rainier Trek",
//     location: "USA",
//     image: "/images/rainier.jpg",
//     description: "Challenging alpine trek in Washington state with glacier views."
//   },
//   {
//     id: "appalachian-trail",
//     name: "Appalachian Trail",
//     location: "USA",
//     image: "/images/appalachian.jpg",
//     description: "Historic long-distance trail along the eastern US mountains."
//   },
//   {
//     id: "grand-canyon-rim-to-rim",
//     name: "Grand Canyon Rim-to-Rim",
//     location: "USA",
//     image: "/images/grand-canyon.jpg",
//     description: "Epic trek across the Grand Canyon from North Rim to South Rim."
//   },
//   {
//     id: "kilimanjaro",
//     name: "Mount Kilimanjaro Trek",
//     location: "Tanzania",
//     image: "/images/kilimanjaro.jpg",
//     description: "Africa's highest peak trek with varied ecosystems."
//   },
//   {
//     id: "rwanda-volcanoes",
//     name: "Rwanda Volcanoes Trek",
//     location: "Rwanda",
//     image: "/images/rwanda-volcanoes.jpg",
//     description: "Trek the Virunga volcanoes with mountain gorilla experience."
//   },
//   {
//     id: "annapurna-circuit",
//     name: "Annapurna Circuit",
//     location: "Nepal",
//     image: "/images/annapurna.jpg",
//     description: "Classic Himalayan trek with diverse landscapes and villages."
//   },
//   {
//     id: "everest-base-camp",
//     name: "Everest Base Camp",
//     location: "Nepal",
//     image: "/images/everest-base.jpg",
//     description: "The legendary trek to the base of Mount Everest."
//   },
//   {
//     id: "gore-tex-ladakh",
//     name: "Markha Valley Trek",
//     location: "Ladakh, India", 
//     image: "/images/markha.jpg",
//     description: "High-altitude trekking with stunning Himalayan valleys." 
//   },
//   {
//     id: "alps-haute-route",
//     name: "Haute Route",
//     location: "France/Switzerland",
//     image: "/images/haute-route.jpg",
//     description: "Classic high-mountain trek connecting Chamonix to Zermatt."
//   },
//   {
//     id: "lyngen-alps",
//     name: "Lyngen Alps Trek",
//     location: "Norway",
//     image: "/images/lyngen.jpg",
//     description: "Arctic alpine trekking with fjords and glaciers."
//   },
//   {
//     id: "madeira-coastal",
//     name: "Madeira Coastal Trail",
//     location: "Portugal",
//     image: "/images/madeira.jpg",
//     description: "Scenic coastal trek with cliffs, waterfalls, and ocean views."
//   },
//   {
//     id: "cordillera-blanca",
//     name: "Cordillera Blanca Trek",
//     location: "Peru",
//     image: "/images/cordillera-blanca.jpg",
//     description: "High-altitude Andean trek with snow-capped peaks and lakes."
//   },
//   {
//     id: "sierra-nevada",
//     name: "Sierra Nevada Trek",
//     location: "Spain",
//     image: "/images/sierra-nevada.jpg",
//     description: "Trekking in southern Spain with mountain peaks and valleys."
//   },
//   {
//     id: "banff-lakes-trek",
//     name: "Banff Lakes Trek",
//     location: "Canada",
//     image: "/images/banff-lakes.jpg",
//     description: "Rocky Mountains trek with alpine lakes and forests."
//   },
//   {
//     id: "jotunheimen",
//     name: "Jotunheimen Trek",
//     location: "Norway",
//     image: "/images/jotunheimen.jpg",
//     description: "Scenic trek through Norway's highest mountains and glaciers."
//   },
//   {
//     id: "grossglockner",
//     name: "Grossglockner High Alpine Trail",
//     location: "Austria",
//     image: "/images/grossglockner.jpg",
//     description: "High-altitude trek along Austria's tallest peak."
//   }
];

export default destinations;
