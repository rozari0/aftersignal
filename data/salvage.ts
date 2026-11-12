import { apollo11DescentStage } from "@/data/profiles/apollo-11-descent-stage";
import { apollo11Retroreflector } from "@/data/profiles/apollo-11-retroreflector";
import { ingenuity } from "@/data/profiles/ingenuity";
import { opportunity } from "@/data/profiles/opportunity";
import { sojourner } from "@/data/profiles/sojourner";
import { surveyor3 } from "@/data/profiles/surveyor-3";
import type { EquipmentProfile, SalvageListing } from "@/data/types";

/** Shown on the Upcycle Me page. Listings are speculative; materials are real, component masses are not measured. */
export const SALVAGE_DISCLAIMER =
  "Speculative listings. Materials reflect real flight hardware; per-component masses are engineering estimates that sum to the published total. Nothing at a lunar heritage site should be disturbed.";

const pickupFor = (profile: EquipmentProfile, access: string): SalvageListing["pickup"] => ({
  siteName: profile.telemetry.coordinates.siteName,
  planet: profile.planet,
  coordinates: profile.telemetry.coordinates,
  access,
});

export const salvageListings: SalvageListing[] = [
  {
    id: "salvage-opportunity",
    equipmentId: "opportunity",
    title: "Six-wheel rover, one owner, 45 km, needs a dusting",
    blurb:
      "Available for local pickup at Meridiani Planum: 185 kg of aerospace-grade aluminium, triple-junction solar cells, and copper wiring. Slight dust coating. Odometer is honest.",
    components: [
      { material: "Triple-junction solar arrays (GaInP/GaAs/Ge)", massKg: 25, condition: "Dust-covered, cells intact", reuse: "Clean and re-string as habitat backup power" },
      { material: "Aluminium chassis and warm electronics box", massKg: 75, condition: "Sound", reuse: "Melt stock for tools and brackets" },
      { material: "Aluminium wheels and titanium rocker-bogie", massKg: 35, condition: "Worn, right-front steering stuck", reuse: "Cart and wheelbarrow chassis" },
      { material: "Pancam mast assembly", massKg: 12, condition: "Optics dusty", reuse: "Survey mast for a surface weather station" },
      { material: "Robotic arm with rock abrasion tool", massKg: 20, condition: "Grinding bits worn", reuse: "Regolith sampling for ISRU feedstock assays" },
      { material: "Lithium-ion batteries and copper harness", massKg: 18, condition: "Cells unlikely to hold charge", reuse: "Copper recovery; harness as spare cabling" },
    ],
    totalMassKg: 185,
    condition: "dust-coated",
    conditionNote: "Fourteen years of Meridiani dust. Contains radioisotope heater units — handle by the book.",
    pickup: pickupFor(opportunity, "Approach from the valley floor; do not drive over the tracks."),
    availability: "available",
    isruUses: [
      "Aluminium melt stock to cut mass shipped from Earth",
      "Solar cells as a power source while ISRU oxygen plants start up",
      "Copper recovery for electrical repairs",
    ],
    askingPrice: "Free to a good colony",
    listedAt: "2019-02-13",
    media: opportunity.cover,
  },
  {
    id: "salvage-ingenuity",
    equipmentId: "ingenuity",
    title: "Compact helicopter, flies (did), rotors need attention",
    blurb:
      "Seventy-two flights, low hours by Earth standards. Carbon-fibre rotor blades damaged, solar panel and smartphone-class processor in working order. Collect from Valinor Hills.",
    components: [
      { material: "Coaxial rotor system (carbon-fibre blades)", massKg: 0.35, condition: "Blades broken", reuse: "Carbon fibre for composite patching" },
      { material: "Rotor mast, motors and swashplates", massKg: 0.4, condition: "Functional at last report", reuse: "Precision actuators for small robots" },
      { material: "Fuselage and avionics (Snapdragon 801 processor)", massKg: 0.5, condition: "Operational as a stationary testbed", reuse: "Flight-proven compute board for a weather mast" },
      { material: "Six lithium-ion cells", massKg: 0.27, condition: "Cycling daily", reuse: "Low-power buffer for remote sensors" },
      { material: "Carbon-fibre landing legs", massKg: 0.2, condition: "Intact", reuse: "Lightweight structural struts" },
      { material: "Solar panel", massKg: 0.08, condition: "Partly dust-covered", reuse: "Trickle charger" },
    ],
    totalMassKg: 1.8,
    condition: "battle-scarred",
    conditionNote: "Hard landing on Flight 72. Wright Flyer fabric swatch included at no extra charge — please return to museum.",
    pickup: pickupFor(ingenuity, "Walk in; rotor downwash no longer a hazard."),
    availability: "available",
    isruUses: [
      "Flight-proven electronics for a stationary weather station",
      "Carbon fibre as composite repair stock",
    ],
    askingPrice: "Trade for one working rotor blade",
    listedAt: "2024-01-25",
    media: ingenuity.cover,
  },
  {
    id: "salvage-surveyor-3",
    equipmentId: "surveyor-3",
    title: "Lunar lander, partially disassembled by previous visitors",
    blurb:
      "Camera and scoop already taken (not by me). Remaining: aluminium spaceframe, three legs with crushable footpads, and empty propellant tanks. Has been in direct sunlight since 1967.",
    components: [
      { material: "Aluminium tubular spaceframe", massKg: 60, condition: "Sun-bleached", reuse: "Structural tubing for a pressurised hab" },
      { material: "Landing legs with crushable aluminium honeycomb footpads", massKg: 45, condition: "One footpad partly buried", reuse: "Energy-absorbing pads for cargo landers" },
      { material: "Solar panel and planar array antenna", massKg: 20, condition: "Panel degraded", reuse: "Antenna reflector for a local relay" },
      { material: "Three vernier engines", massKg: 30, condition: "Inert", reuse: "Teaching specimens; nozzle alloys for melt" },
      { material: "Thermal compartments and electronics", massKg: 74, condition: "Cold-soaked", reuse: "Long-exposure materials data before reuse" },
      { material: "Titanium propellant tanks (empty)", massKg: 30, condition: "Vented", reuse: "Pressure vessels for oxygen storage" },
      { material: "Silver-zinc battery", massKg: 27, condition: "Dead since 1967", reuse: "Silver and zinc recovery" },
    ],
    totalMassKg: 286,
    condition: "partially-dismantled",
    conditionNote: "TV camera, scoop and some tubing removed by Apollo 12 in 1969. Seller is still upset about it.",
    pickup: pickupFor(surveyor3, "Land at least 200 m away; the last crew sandblasted me from 180 m."),
    availability: "available",
    isruUses: [
      "Titanium tanks for oxygen storage from regolith processing",
      "Aluminium structure as feedstock for in-situ fabrication",
      "Sixty years of surface-exposure data for materials scientists",
    ],
    askingPrice: "Free. Just bring my camera back.",
    listedAt: "1969-11-20",
    media: surveyor3.cover,
  },
  {
    id: "salvage-eagle",
    equipmentId: "apollo-11-descent-stage",
    title: "Lunar module descent stage with plaque — NOT FOR SALVAGE",
    blurb:
      "Gold foil, four legs, one plaque. Listed for completeness. Tranquility Base is a protected heritage site; the bootprints stay and so do I.",
    components: [
      { material: "Aluminium alloy structure", massKg: 1084, condition: "Sound", reuse: "None — heritage artifact" },
      { material: "Landing gear (four legs, aluminium honeycomb struts)", massKg: 250, condition: "Compressed on touchdown", reuse: "None — heritage artifact" },
      { material: "Silver-zinc batteries", massKg: 240, condition: "Discharged since 1969", reuse: "None — heritage artifact" },
      { material: "Titanium propellant tanks", massKg: 230, condition: "Near empty", reuse: "None — heritage artifact" },
      { material: "Throttleable descent engine", massKg: 180, condition: "Nozzle intact", reuse: "None — heritage artifact" },
      { material: "Kapton and Mylar thermal blankets", massKg: 50, condition: "Torn by ascent-stage blast", reuse: "None — heritage artifact" },
    ],
    totalMassKg: 2034,
    condition: "battle-scarred",
    conditionNote: "Scorched by the ascent engine on 21 July 1969. Plaque legible.",
    pickup: pickupFor(apollo11DescentStage, "No landing within 2 km. Look from orbit."),
    availability: "claimed",
    isruUses: [
      "Navigation landmark for Artemis-era surface surveys",
      "Reference specimen for long-duration exposure studies — observed remotely",
    ],
    askingPrice: "Not for sale. Claimed by history.",
    listedAt: "1969-07-21",
    media: apollo11DescentStage.cover,
  },
  {
    id: "salvage-mirror",
    equipmentId: "apollo-11-retroreflector",
    title: "100 corner-cube reflectors, still in daily use",
    blurb:
      "Fused-silica corner cubes in an aluminium panel. Zero power draw. Currently under contract with lunar laser ranging stations, so the listing is reserved.",
    components: [
      { material: "100 fused-silica corner cubes (3.8 cm)", massKg: 6.5, condition: "Returns somewhat weaker than in 1969, likely from dust", reuse: "Do not reuse — active instrument" },
      { material: "Aluminium array panel", massKg: 12, condition: "Sound", reuse: "Do not reuse — active instrument" },
      { material: "Support legs and pointing mechanism", massKg: 8, condition: "Aligned", reuse: "Do not reuse — active instrument" },
      { material: "Alignment hardware and sun compass", massKg: 3.5, condition: "Sound", reuse: "Do not reuse — active instrument" },
    ],
    totalMassKg: 30,
    condition: "dust-coated",
    conditionNote: "Still bouncing lasers back to Earth. Please do not touch, wipe, or stand in front of it.",
    pickup: pickupFor(apollo11Retroreflector, "No pickup. Aim a laser instead."),
    availability: "reserved",
    isruUses: [
      "Precision geodesy for future lunar navigation networks",
      "Calibration target for new laser ranging stations",
    ],
    askingPrice: "Reserved by every lunar laser ranging station on Earth",
    listedAt: "2019-07-21",
    media: apollo11Retroreflector.cover,
  },
  {
    id: "salvage-sojourner",
    equipmentId: "sojourner",
    title: "Vintage microrover, collector's item, the original",
    blurb:
      "The first Mars rover. 10.6 kg, fits in a cargo bag. Gallium-arsenide solar panel and six wheels. Location approximate: last seen near the lander.",
    components: [
      { material: "Warm electronics box and chassis", massKg: 3.5, condition: "Sound", reuse: "Museum, obviously" },
      { material: "Rocker-bogie suspension", massKg: 2.5, condition: "Original", reuse: "Reference design for every rover since" },
      { material: "Six aluminium wheels with stainless cleats", massKg: 2, condition: "Lightly worn", reuse: "Wheel cleats as small tools" },
      { material: "Gallium-arsenide solar panel", massKg: 1, condition: "Dusty", reuse: "Trickle charger for a sensor post" },
      { material: "Lithium batteries (non-rechargeable)", massKg: 1, condition: "Exhausted", reuse: "Lithium recovery" },
      { material: "Alpha Proton X-ray Spectrometer", massKg: 0.6, condition: "Source decayed", reuse: "Teaching instrument" },
    ],
    totalMassKg: 10.6,
    condition: "dust-coated",
    conditionNote: "Twenty-nine years of Ares Vallis dust. Exact position near the lander unknown.",
    pickup: pickupFor(sojourner, "Search within a few metres of the lander. It is small."),
    availability: "available",
    isruUses: [
      "Heritage display for the first Mars settlement",
      "Small-rover reference hardware for local fabrication",
    ],
    askingPrice: "Priceless. Make an offer.",
    listedAt: "1998-03-10",
    media: sojourner.cover,
  },
];
