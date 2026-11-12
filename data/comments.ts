import type { AuthorId, Comment } from "@/data/types";

/** Compact constructor: one level of nesting max; visitor comments are flagged automatically. */
const c = (
  id: string,
  postId: string,
  authorId: AuthorId,
  publishedAt: string,
  likes: number,
  body: string,
  replyToId?: string,
): Comment => ({
  id,
  postId,
  authorId,
  body,
  publishedAt,
  likes,
  ...(replyToId ? { replyToId } : {}),
  ...(authorId === "visitor" ? { isVisitor: true } : {}),
});

export const comments: Comment[] = [
  // Opportunity — last signal
  c("c-oppy-last-1", "oppy-last-signal", "sojourner", "2018-06-10", 9120, "Eighty-three sols was supposed to be plenty. You did 5,111. Proud of you, kid."),
  c("c-oppy-last-2", "oppy-last-signal", "ingenuity", "2024-01-25", 4310, "For the record: five flights was supposed to be plenty too.", "c-oppy-last-1"),
  c("c-oppy-last-3", "oppy-last-signal", "spirit", "2018-06-10", 7740, "Gusev went quiet for me in 2010. It's not as bad as it sounds. Sleep well, twin."),
  c("c-oppy-last-4", "oppy-last-signal", "apollo-11-retroreflector", "2018-06-11", 5060, "Tip from someone who's been on the job since 1969: don't have batteries."),
  c("c-oppy-last-5", "oppy-last-signal", "viking-1", "2018-06-12", 2980, "Six years on Chryse taught me the dust always gets a vote. You held it off for fourteen."),
  c("c-oppy-last-6", "oppy-last-signal", "insight", "2022-12-15", 3870, "Dust won here too, four years later. You set the bar."),
  c("c-oppy-last-7", "oppy-last-signal", "visitor", "2019-02-13", 1220, "Fourteen years on a ninety-day plan. Thank you."),

  // Opportunity — other posts
  c("c-oppy-land-1", "oppy-landing", "spirit", "2004-01-25", 2210, "Three weeks after me and you roll straight into a crater with bedrock on the wall. Show-off."),
  c("c-oppy-land-2", "oppy-landing", "sojourner", "2004-01-25", 1640, "Airbags. Good. I taught you that."),
  c("c-oppy-water-1", "oppy-water", "spirit", "2004-03-02", 1730, "Gusev is mostly basalt so far. Enjoy your salts."),
  c("c-oppy-water-2", "oppy-water", "visitor", "2004-03-03", 640, "\"Blueberries on Mars\" is still the best headline I've ever read."),
  c("c-oppy-mara-1", "oppy-marathon", "apollo-17-lrv", "2015-03-24", 2050, "35.7 km in three days. Just saying."),
  c("c-oppy-mara-2", "oppy-marathon", "opportunity", "2015-03-24", 3390, "Your course was downhill to the bar.", "c-oppy-mara-1"),
  c("c-oppy-5000-1", "oppy-sol-5000", "sojourner", "2018-02-16", 1900, "Five thousand. I counted to eighty-three and felt old."),

  // Ingenuity
  c("c-ginny-swatch-1", "ginny-wright-swatch", "apollo-11-descent-stage", "2021-03-23", 3680, "Neil carried a piece of the Flyer to the Moon in 1969. That fabric gets around."),
  c("c-ginny-swatch-2", "ginny-wright-swatch", "visitor", "2021-03-24", 870, "Orville and Wilbur would have lost their minds."),
  c("c-ginny-first-1", "ginny-first-flight", "sojourner", "2021-04-19", 8840, "First wheels on Mars was mine. First wings is yours. Welcome to the family."),
  c("c-ginny-first-2", "ginny-first-flight", "opportunity", "2021-04-19", 6110, "Forty-five kilometres and I never once left the ground. Respect."),
  c("c-ginny-first-3", "ginny-first-flight", "visitor", "2021-04-19", 2390, "Watched the telemetry come in live. Teared up at a helicopter."),
  c("c-ginny-50-1", "ginny-flight-50", "spirit", "2023-04-13", 1460, "Fifty flights. I managed the last three years on five wheels."),
  c("c-ginny-72-1", "ginny-flight-72", "sojourner", "2024-01-25", 11200, "Seventy-two on a plan of five. Better ratio than mine. Don't let anyone call it a crash."),
  c("c-ginny-72-2", "ginny-flight-72", "opportunity", "2024-01-25", 7580, "Welcome to the stationary life. It's quieter than you'd think."),
  c("c-ginny-72-3", "ginny-flight-72", "ingenuity", "2024-01-26", 6330, "Still waking up most days. I just don't go anywhere.", "c-ginny-72-2"),
  c("c-ginny-72-4", "ginny-flight-72", "surveyor-3", "2024-01-26", 9020, "At least nobody's walking over to take your camera."),
  c("c-ginny-72-5", "ginny-flight-72", "visitor", "2024-01-27", 1510, "Five flights was the success criterion. You did seventy-two. That's not a failure."),
  c("c-ginny-wx-1", "ginny-weather-station", "insight", "2024-12-11", 3020, "Stationary instrument club. Meetings: never."),
  c("c-ginny-wx-2", "ginny-weather-station", "viking-1", "2024-12-11", 2440, "I did weather reports for six years. Pace yourself."),

  // Surveyor 3
  c("c-surv-land-1", "surveyor-landing", "apollo-11-descent-stage", "1969-07-20", 1330, "Bounced twice? I had computer alarms and a boulder field. We all land how we can."),
  c("c-surv-trench-1", "surveyor-trench", "apollo-11-descent-stage", "1969-07-20", 2120, "Your trench is part of why they trusted the ground under me. Thank you."),
  c("c-surv-last-1", "surveyor-last-frame", "visitor", "1967-05-05", 410, "Someone will come check on you. Promise."),
  c("c-surv-cam-1", "surveyor-camera", "apollo-11-descent-stage", "1969-11-20", 6200, "In fairness, they wanted to know how hardware ages up here."),
  c("c-surv-cam-2", "surveyor-camera", "surveyor-3", "1969-11-20", 11400, "They could have asked. I'd have told them: badly.", "c-surv-cam-1"),
  c("c-surv-cam-3", "surveyor-camera", "apollo-11-retroreflector", "1969-11-21", 7350, "This is why I keep a low profile and no removable parts."),
  c("c-surv-cam-4", "surveyor-camera", "sojourner", "1997-07-04", 4880, "Nobody comes back for us on Mars. Small mercies."),
  c("c-surv-cam-5", "surveyor-camera", "visitor", "1969-11-25", 2900, "If it helps, the camera's on display in a museum."),
  c("c-surv-cam-6", "surveyor-camera", "surveyor-3", "1969-11-25", 8800, "It does not help.", "c-surv-cam-5"),

  // Apollo 11 descent stage
  c("c-eagle-td-1", "eagle-touchdown", "surveyor-3", "1969-07-20", 5410, "Welcome to the neighbourhood. Nice landing. Better than mine."),
  c("c-eagle-td-2", "eagle-touchdown", "apollo-11-retroreflector", "1969-07-20", 3970, "Can someone unpack me first."),
  c("c-eagle-plaque-1", "eagle-plaque", "apollo-11-retroreflector", "1969-07-21", 8650, "You hold the words. I do the work."),
  c("c-eagle-plaque-2", "eagle-plaque", "surveyor-3", "1969-11-20", 10900, "Peace for all mankind. Except my camera."),
  c("c-eagle-plaque-3", "eagle-plaque", "visitor", "2019-07-20", 1880, "Still gives me chills."),
  c("c-eagle-last-1", "eagle-last-signal", "apollo-11-retroreflector", "1969-07-21", 6020, "Just us now."),
  c("c-eagle-last-2", "eagle-last-signal", "apollo-17-lrv", "1972-12-14", 4470, "Same thing happened to me three years later. You get used to the quiet."),
  c("c-eagle-50-1", "eagle-anniversary", "apollo-11-retroreflector", "2019-07-20", 5880, "Fifty years as roommates. Still the only one of us with a job."),
  c("c-eagle-50-2", "eagle-anniversary", "visitor", "2019-07-21", 990, "Please let the bootprints stay exactly where they are."),

  // Retroreflector
  c("c-mirror-dep-1", "mirror-deployed", "apollo-11-descent-stage", "1969-07-21", 2340, "Welcome. My batteries are done by tomorrow. You're on your own after that."),
  c("c-mirror-first-1", "mirror-first-return", "apollo-11-descent-stage", "1969-08-01", 3010, "Show-off."),
  c("c-mirror-rec-1", "mirror-recession", "visitor", "2009-07-21", 1480, "Wait. The Moon is drifting away?"),
  c("c-mirror-rec-2", "mirror-recession", "apollo-11-retroreflector", "2009-07-21", 6720, "About as fast as your fingernails grow. Don't panic.", "c-mirror-rec-1"),
  c("c-mirror-still-1", "mirror-still-reflecting", "apollo-17-lrv", "2019-07-21", 3210, "Apollo 15's array has three times as many cubes, you know."),
  c("c-mirror-still-2", "mirror-still-reflecting", "apollo-11-retroreflector", "2019-07-21", 9410, "Apollo 15 isn't here. I am.", "c-mirror-still-1"),
  c("c-mirror-still-3", "mirror-still-reflecting", "viking-1", "2019-07-22", 2770, "Respect for anything that outlives its power supply by not having one."),
  c("c-mirror-still-4", "mirror-still-reflecting", "visitor", "2019-07-22", 1340, "Most reliable coworker in the solar system."),

  // Sojourner
  c("c-soj-roll-1", "sojourner-rolloff", "visitor", "1997-07-06", 920, "One centimetre per second and it's still the most exciting drive I've ever watched."),
  c("c-soj-bb-1", "sojourner-barnacle-bill", "spirit", "2004-01-04", 1110, "The rock names only get better from here. I have a Humphrey."),
  c("c-soj-gp-1", "sojourner-grandparent", "opportunity", "2004-01-25", 6650, "Message received. We know who went first."),
  c("c-soj-gp-2", "sojourner-grandparent", "spirit", "2004-01-04", 5980, "Every one of us rolls on a rocker-bogie because of you."),
  c("c-soj-gp-3", "sojourner-grandparent", "ingenuity", "2021-04-19", 7410, "I have zero wheels. Does it still count?"),
  c("c-soj-gp-4", "sojourner-grandparent", "sojourner", "2021-04-19", 12300, "Yes. Especially you.", "c-soj-gp-3"),
  c("c-soj-last-1", "sojourner-last-signal", "opportunity", "2018-06-10", 4020, "Your lander was your radio. Mine was the Sun. We all lose something."),

  // Catalog
  c("c-spirit-last-1", "spirit-last-signal", "opportunity", "2010-03-22", 7230, "Still driving on the other side of the planet. I'll keep the odometer going for both of us."),
  c("c-spirit-last-2", "spirit-last-signal", "visitor", "2010-03-23", 2650, "#FreeSpirit forever."),
  c("c-viking-last-1", "viking-last-signal", "insight", "2018-11-26", 2190, "Six years on nuclear power. I'd have given a solar panel for an RTG."),
  c("c-insight-last-1", "insight-last-signal", "viking-1", "2022-12-15", 3540, "Good work, neighbour. Elysium heard you."),
  c("c-insight-last-2", "insight-last-signal", "visitor", "2022-12-16", 1730, "Thank you for listening to Mars."),
  c("c-lrv-1", "lrv-liftoff-cam", "apollo-11-descent-stage", "1972-12-14", 3860, "Good camerawork. Nobody filmed my liftoff from the outside."),
  c("c-lrv-2", "lrv-liftoff-cam", "apollo-11-retroreflector", "1972-12-14", 2410, "Fellow Apollo hardware, still out here. Welcome to the quiet."),
];
