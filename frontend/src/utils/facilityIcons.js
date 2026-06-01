import {
  ParkingCircle, Car, ChefHat, UtensilsCrossed, WashingMachine,
  Tv, Wifi, Wind, Eye, Flower2, Waves, Trees, Sun,
  Dumbbell, Thermometer, AirVent, ShieldCheck, Dog, Baby,
  Accessibility, Coffee, Bike, Droplets, Package, Home,
  Check, Bed, Languages, BookOpen,
} from 'lucide-react'

export const FACILITY_ICON_MAP = {
  'parking': ParkingCircle,
  'free parking': ParkingCircle,
  'free on-site parking': ParkingCircle,
  'private parking': Car,
  'parking on site': ParkingCircle,
  'valet parking': Car,
  'kitchen': ChefHat,
  'kitchenette': UtensilsCrossed,
  'washing machine': WashingMachine,
  'dishwasher': UtensilsCrossed,
  'microwave': Thermometer,
  'refrigerator': Package,
  'coffee maker': Coffee,
  'coffee machine': Coffee,
  'flat-screen tv': Tv,
  'flat screen tv': Tv,
  'television': Tv,
  'tv': Tv,
  'wifi': Wifi,
  'internet': Wifi,
  'free wifi': Wifi,
  'cable tv': Tv,
  'balcony': Wind,
  'view': Eye,
  'garden view': Flower2,
  'sea view': Waves,
  'pool view': Waves,
  'terrace': Sun,
  'garden': Trees,
  'outdoor pool': Waves,
  'indoor pool': Waves,
  'swimming pool': Waves,
  'hot tub': Droplets,
  'gym': Dumbbell,
  'fitness center': Dumbbell,
  'sauna': Thermometer,
  'air conditioning': AirVent,
  'heating': Thermometer,
  'elevator': Accessibility,
  'concierge': ShieldCheck,
  'security': ShieldCheck,
  '24/7 security': ShieldCheck,
  'pet friendly': Dog,
  'pets allowed': Dog,
  'family friendly': Baby,
  'bicycle rental': Bike,
  'storage': Package,
  'laundry': WashingMachine,
  'entire place': Home,
  'the entire place is yours': Home,
  'library': BookOpen,
  'reading room': BookOpen,
}

export const CATEGORY_ICON_MAP = {
  'parking': ParkingCircle,
  'kitchen': ChefHat,
  'internet': Wifi,
  'media': Tv,
  'media & technology': Tv,
  'technology': Tv,
  'outdoors': Trees,
  'outdoor': Trees,
  'outdoor & view': Eye,
  'view': Eye,
  'miscellaneous': Package,
  'great for your stay': Home,
  'general': Home,
  'fitness': Dumbbell,
  'languages': Languages,
  'languages spoken': Languages,
  'safety': ShieldCheck,
  'accessibility': Accessibility,
  'bathroom': Droplets,
  'bedroom': Bed,
  'living area': Sun,
}

export function getFacilityIcon(name) {
  if (!name) return Check
  const key = name.toLowerCase().trim()
  for (const [k, Icon] of Object.entries(FACILITY_ICON_MAP)) {
    if (key.includes(k) || k.includes(key)) return Icon
  }
  return Check
}

export function getCategoryIcon(name) {
  if (!name) return Package
  const key = name.toLowerCase().trim()
  for (const [k, Icon] of Object.entries(CATEGORY_ICON_MAP)) {
    if (key === k || key.includes(k) || k.includes(key)) return Icon
  }
  return Package
}
