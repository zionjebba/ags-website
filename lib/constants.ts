// Shared constants for events data
export interface EventData {
  title: string;
  venue: string;
  date: string;
  location: string;
  phone: string;
  email: string;
  image: string;
}

export interface Plan {
  name: string;
  price: string;
  amount: number;
  perks: string[];
}

export const eventsData: Record<string, EventData> = {
  "startups-festival-2026": {
    title: "Startups Festival 2026",
    venue: "Berlin centre, Berlin",
    date: "16th June, 2026",
    location: "Berlin, Germany",
    phone: "+42 898 989 8789",
    email: "startupfest@gmail.com",
    image: "/events-festival.png",
  },
  "innovation-startups-awards-2026": {
    title: "Innovation and Startups Awards 2026",
    venue: "Leeds Convention Centre, Leeds",
    date: "16th June, 2026",
    location: "Leeds, England",
    phone: "+44 113 123 4567",
    email: "innovationawards@gmail.com",
    image: "/innovation-awards.png",
  },
};

export const plans: Plan[] = [
  {
    name: "Basic Plan",
    price: "$3,000",
    amount: 3000,
    perks: [
      "Round Economy Trip",
      "Shared Hotel Room",
      "1 Side Attraction",
      "Breakfast and Supper",
    ],
  },
  {
    name: "Premium Plan",
    price: "$4,800",
    amount: 4800,
    perks: [
      "Round Economy Trip",
      "Shared Hotel Room",
      "1 Side Attraction",
      "Breakfast and Supper",
    ],
  },
  {
    name: "Gold Plan",
    price: "$7,000",
    amount: 7000,
    perks: [
      "Round Economy Trip",
      "Shared Hotel Room",
      "1 Side Attraction",
      "Breakfast and Supper",
    ],
  },
];
