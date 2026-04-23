// Auto-generated from DataForge extraction + localization — sc-alpha-4.7.0-4.7.178.8917
// Run: npm run sync:generate

export type JournalCategory = "Guides" | "Jurisdiction" | "Investigation" | "Ship Logs" | "Black Box" | "Siege of Orison" | "Missing Bennys" | "Contested Zones" | "Prison" | "Crusader" | "Lore" | "Datapads" | "Reputation" | "Misc";

export type JournalType = "Text" | "Dialogue" | "Audio" | "Video";

export interface JournalEntry {
  id: string;
  title: string;
  author?: string;
  category: JournalCategory;
  type: JournalType;
  body?: string;
  missionSpecific?: boolean;
  tutorial?: boolean;
}

export const journalEntries: JournalEntry[] = [
  {
    "id": "harvestablesguide",
    "title": "A Forager's Guide",
    "author": "Empire Wildlife Federation",
    "category": "Guides",
    "type": "Text",
    "body": "This guide will help you identify what's useful, what's edible, and what's deadly.  \n\n*STANTON SYSTEM*\nIt may seem completely corporate, but the Stanton system is rich with resources for the enterprising forager.\n\nDEGNOUS ROOT \nA type of macroalgae that has acclimated to much of the Stanton system, the degnous root is originally from Terra III, where it grows in abundance along shallow coastlines. It was introduced to some planets and moons of Stanton when they were first being terraformed as a part of their artificially constructed ecosystems. Powdered degnous root is a popular additive to multiple medical and health products thanks to its unique blend of amino acids.  \nWhere to Find: Grasslands of Hurston (Stanton I), Deserts of Arial (Stanton 1a), Deserts of Magda (Stanton 1c), Deserts of Daymar (Stanton 2b), Tundras of microTech (Stanton IV), Tundras of Calliope (Stanton 4a), Ice deserts of Clio (Stanton 4b)\n\nHEART OF THE WOODS \nThis reddish-brown, mushroom-like fungus can be found in cold climates on and around microTech, where it grows on trees and decaying logs. Prized by epicureans for its complex taste, the heart of the woods has yet to be commercially cultivated and can thus fetch a high price in the right markets. It should be noted that the mushroom is mildly toxic until it is fully cooked, so it should not be eaten raw.  \nWhere to Find: Forests of microTech (Stanton IV), Tundras of Calliope (Stanton 4a)\n\nMARU EBONY \nMost notable for the fruit it produces, the curiously-shaped GOLDEN MEDMON, the maru ebony tree was first cultivated on Jalan. When they are harvested, golden medmons are extremely firm and astringent, with tough orange skin. They only become palatable if allowed to soften through ethelyne ripening, after which they take on a flavor similar to caramel and develop a creamy consistency. At this point, the yellow-orange skin becomes wrinkled and dark, which sometimes leads those unfamiliar with the fruit to mistakenly dismiss it as rotten.  \nWhere to Find: Grasslands of Hurston (Stanton I)\n\nPITAMBU \nA leafy plant that was first discovered on Reisse, the pitambu bears a FRUIT of the same name that has a mild, nutty taste. It is often found in the wild on worlds where it is commercially grown thanks to its ability to survive in a wide variety of climates. The fruit is crisp and watery underneath its skin and is filled with tiny seeds that can be consumed alongside the flesh. The BLOSSOM of the pitambu can be cooked and eaten as well, or it can be steeped in hot water to create a tea that can help ease digestive distress.  \nWhere to Find: Grasslands of Hurston (Stanton I), Tundras of microTech (Stanton IV)\n\nPROTA \nResilient and prolific, the prota is a type of slime mold that is able to grow in extreme environments. In general it prefers acid-rich conditions and has been known to thrive areas affected by industrial pollution. When it is ready to reproduce, the prota creates spore pods which grow from short stalks that sprout from the surface of the mold. These pods have innate adhesive properties, which has led to their use as an ingredient in multiple types of commercial glue.  \nWhere to Find: Grasslands of Hurston (Stanton I), Deserts of Arial (Stanton 1a), Deserts of Daymar (Stanton 2b)\n\nREVENANT TREE \nA variety of the altrucia from Terra III, the revenant tree arose from the harsh, windy climate of Hyperion, where it was introduced by geoengineers in an attempt to create shelterbelts against dust. The few trees that survived this planting developed darker leaves to absorb as much light as possible and thick bark to maintain moisture, among other adaptations. If you find yourself stranded in the wild, you can gather drinking water by passing the insides of the tree through a fine-meshed sieve. However, do not consume the seeds or the pollen found in the plant's PODS, as they can induce an allergic reaction and can cause unwelcome sensory and muscular effects.  \nWhere to Find: Deserts of Magda (Stanton 1c), Ice deserts of Clio (Stanton 4b)\n\nSUNSET BERRY BUSH \nThis hardy shrub can be found growing wild in perpetually cold environs. It can be identified by its lovely red berries, which grow in year-round in clusters on the plant's woody branches. Although they may look enticing, if consumed, these very bitter, tannic berries can cause vomiting, extreme cramping, and muscle spasms. Multiple pharmaceutical companies are conducting research studies on the potential medical applications of the berry, and have been known to purchase them from individual collectors.  \nWhere to Find: Forests of microTech (Stanton IV), Tundras of microTech (Stanton IV)\n\nSTONE BUG \nThe stone bug isn't actually a bug – it's a crustacean that lives on land and inhabits dry and rocky areas. On average, it is about 45 cm long and can be identified by its multi-jointed legs and tough outer shell. When threatened, it curls into a tight ball, using its durable carapace to keep its soft insides safe from the jaws of predators. Processed stone bug shells are used as an ingredient in certain types of armor composites.\nWhere to Find: Deserts of Hurston (Stanton I), Deserts of Magda (Stanton 1c), Deserts of Ita (Stanton 1d), Deserts of Daymar (Stanton 2b), Deserts of Wala (Stanton 3b)\n\n\n*PYRO SYSTEM*\nBetween the rampant outlawas and harsh environment, the Pyro sytem can be difficult to navigate but may yet still be rewarding for the resourceful forager willing to take on a bit of risk.\n\nAMIANT TREE \nHarvested from the amiant tree, the fibrous husks of these seed PODS are used to make heat resistant textiles. Once removed, the husks must first be soaked in a chemical solution before the fibers can be separated out. \nWhere to Find: Pyro IV\n\nDECARI \nThe decari is a type of fungus that produces a large spore POD. It anchors itself to rocks and soil using long, filament-like rhizoids that are capable of regrowing the decari's main body if it is destroyed. The pods can be collected and used for various scientific pursuits or even as a food source. However, the decari pod cannot be consumed directly. It must have its thick out layer and spiny filaments removed, and the fibrous hymenium cooked for a long time before it can be safely digested by Humans.\nWhere to Find: Pyro I\n\nFLAREWEED\nFlareweed is a hearty plant that can survive in harsh environments. With a natural ability to filter out harmful elements from its water supply, flareweed STALKS are frequently harvested to be used in filtration systems.\nWhere to Find: Pyro IV\n\nFOTIA SCRUB\nThe fotia scrub relies on solar flares for its reproduction. Rather than having traditional stamen and pollen, it allows radiation from flares to mutate its genetics before releasing its SEEDPOD. Some enterprising individuals seek out and collect the seedpods because of their natural radiological properties that can be utilized in various ways. \nWhere to Find: Pyro I\n\nPINGALA \nEvery aspect of the pingala follows the golden ratio resulting a visually arresting plant. This include its SEEDS which are highly sought after by plant collectors. Especially since attempts to cultivate the pingala in greenhouse environments has proven extremely difficult. \nWhere to Find: Monox (Pyro II)\n\nWUOTAN\nThe wuotan is a woody plant indigenous to the Pyro system. Able to thrive in stormy environments, it has evolved to withstand gale-force winds and weather lightning strikes. It produces a SEED that become bioluminescent when ripe to draw attention and encourage their spread. They are often collected to utilize as a natural light source.\nWhere to Find: Pyro I"
  },
  {
    "id": "tradinginfo",
    "title": "A Guide to Trading in the Empire",
    "author": "UEE Trade & Development Division",
    "category": "Guides",
    "type": "Text",
    "body": "GUIDANCE AND SUPPORT FOR TRADING WITHIN THE UEE AND ADJACENT SYSTEMS\n\nTrading and commodity brokering may seem intimidating at first, but with a little knowledge and the right attitude, it can be a rewarding career. To increase the accessibility and understanding of trading within the Empire, the UEE’s Trading & Development Division (TDD) is happy to offer the following helpful insights to get you started.\n\nPlease note that the guidance below may not be relevant or reliable when applied to xeno-economies (documentation regarding Xi’an, Banu, and other non-Human controlled systems will be available at a future date).\n\n----------------------------------------------------------------------------------------------------\n\nUNDERSTANDING MARKET BEHAVIORS\n\nMost markets function on the principle of supply and demand. The price offered at trade terminals is dynamically driven for each commodity , increasing the price of the goods on offer based on the volume of traffic at that specific trade location. In addition to this, when brokers receive many of the same commodity the purchase price of that good will lower significantly due to the broker having an  excess of it.\n\nTrading at its core is about understanding these shifts and capitalizing on them. This idea is broken down and explored in more detail below:\n\nCONSUMER ACTIVITY CREATES FLUCTUATING PRICES:\n\n-\tThe higher the number of traders buying or selling a specific commodity at a location, the worse the price becomes. If you are waiting in line to use a terminal, this is typically a strong indication that this location is already experiencing high traffic and the price you will be offered will most likely be much lower than expected.\n-\tBecause of this, the most popular locations such as major cities or large stations will rarely offer the best deals.  \n-\tTravelling further afield to more obscure, or dangerous locations, where supply is much lower can often net you a more fruitful deal.\n-\tWhen preparing to trade, it is recommended to have a list of other potential locations to sell at, ensuring you receive the best price for your goods.\n-\tAn exception to this is trading in rare resources or goods. These items typically retain their value because of their rarity, especially if those rare goods are unavailable from other brokers nearby.\n\nFILL YOUR SHIP’S HOLD WISELY: \n\n-\tWhen buying, checking the maximum container size available (2, 8, 16, or 32 SCU) for a commodity is often  a good indicator of the amount of trade that commodity experiences.\n-\tGoods in larger containers are typically more abundant and therefore easier to come by, whereas goods only available in smaller containers will have a higher value due to their scarcity.\n-\tFor example, Atlasium, a very rare commodity, would typically sell in containers of 2 SCU, whereas Copper, a very common commodity, would typically sell in containers of 32 SCU. \n-\tCommodities bought in a specific  container size compete with other goods of a similar size. For example, a container of 32 SCU ore should have its price compared to other 32 SCU container, rather than an 8 SCU container.\n\nTRADING WITHIN YOUR MEANS:\n\n-\tUltimately, the best deal is the one that is most convenient for you. Searching for the right deal can be advantageous but should be weighed against the risk of transporting high value goods across systems and the time investment that comes with it. Major trade locations such as TDDs are reliable centers for selling your goods if you are unsure of where to get the best deal.\n\nINFORMATION COURTESY OF\nTERRENCE CONNORS \nCHIEF STRATEGIC BUSINESS ADVISER\nTRADE & DEVELOPMENT DIVISION\n“SERVING THE EMPIRE SINCE 2463”"
  },
  {
    "id": "salvagetutorial",
    "title": "A Salvager's Guide to Material Collection",
    "author": "United Resource Workers",
    "category": "Guides",
    "type": "Text",
    "body": "From precision hull scraping to full-scale material and component recovery, salvaging offers one of the most profitable and versatile careers in the 'verse. Whether flying solo or as part of a crew, each wreck presents a chance to explore, recover, and profit from the remains of the stars.\n\nJoin us as we explore the systems and tools that define this rewarding profession…\n\nTYPES OF SALVAGE\n\n*** Components & Cargo ***\n\nBefore tearing down a wreck, it's always worth checking its interior and systems for anything still intact or valuable. Many derelicts still hold functional components, weapons, or cargo that can be retrieved using precision tractor beams before the hull is stripped away.\n\nDepending on the vessel you’re salvaging, the components might be locked and you will first have to unlock them via the cockpit controls aboard the wreckage before they can be pulled free. Once detached, these items can be stored aboard your ship if you have available space in the cargo grid.\n\n*** Hull Scraping ***\n\nHull scraping is the foundation of modern salvage operations, allowing operators to reclaim valuable Recycled Material Composite (RMC) from the outside of derelict ships, converting wreckages into usable resources for trade, repair, or resale. \n\nIf you will be using a specialized salvaging vehicle, you will need to first enter salvage mode before you can begin. There you will have access to a informative HUD that will display the percentage of the remaining target hull, optimal range, and how much available storage space you have. \n\nOnce your RMC storage is full, many salvaging vehicles come with an onboard processing unit that can produce SCU containers from the RMC you’ve collected. Depending on your ship, RMC can also be converted into RMC canisters used by salvage and repair hand tools. \n\n*** Structural Salvage ***\n\nStructural salvage takes recovery operations beyond the surface, breaking down derelicts into their raw framework to harvest useful commodities. The process begins with \"Fracturing Mode,\" which cracks the derelict hulls into smaller parts. This is followed by \"Disintegration Mode,\" which further breaks down the wreckage, yielding various unrefined Construction Materials ranging from \"Construction Rubble\" to \"Construction Pieces\" to \"Construction Salvage\" depending on the salvaging ship used.\n\nConstruction Materials recovered in structural salvage will often need to be refined before selling, with results varying by salvage ship type: Rubble from Light Salvage ships offers the fastest processing but lowest yield, Pieces from Medium Salvage ships provide balanced results, and Salvage from Heavy Salvage ships delivers the highest refined return at the cost of longer processing times.\n\nTo use a rest stop’s refinery, you must first unload your salvaged materials via a freight elevator into the station's inventory before starting the refinement job. You can choose between different processing methods that affect the yield, cost, and time of the refinement.\n\nNEXT STEPS\n\n*** Sell Your Spoils ***\n\nWhile many salvagers prefer to do contracted work, plenty of operators prefer instead to sell their reclaimed materials on the open market. Once you've got SCU containers full of RMC or Construction Materials, head to a commodity kiosk at a landing zone or rest stops and sell them. However, not all kiosks will purchase these recycled materials, and don't forget to keep an eye on the price to make sure you're getting the best deal you can. Construction materials are often needed for space station repairs on better maintained stations througout Stanton and Nyx. And while RMC is not as frequently in demand, stations in Pyro often need more maintenance and are often a good place to sell a surplus of the material.\n\n*** Ready to Repair ***\n\nIf you created RMC canisters at your onboard filler station and you've got your SRT Multi-Tool attachment handy, you can use the RMC to repair damage. You can significantly repair a hull but not fully. To fully restore your ship's hull, you'll need to take it to a landing pad or hangar that offers repair services."
  },
  {
    "id": "help_crusadercrimetutorial",
    "title": "A Visitor’s Guide to Crusader Security",
    "author": "Crusader Security Team",
    "category": "Guides",
    "type": "Text",
    "body": "Like many who travel to the Stanton System, you may be wondering how the laws and regulations of the four megacorps compare to the laws in the rest of the UEE. While our status as an independent planet allows us latitude to govern as we see fit, you may be surprised to learn that Crusader Industries adheres to many of the legal guidelines set forth by the Empire in order to provide a safe and secure environment for all.  \n\nHere are few tips to remember while visiting Crusader and its surrounding sectors:\n\n* While the level of crime here is typically no higher than many places in the Empire, visitors should be cautious traveling to more remote areas such as the asteroid belt around the moon Yela since outlaw attacks have been known to occur.\n\n* Even though you are in Crusader Security patrolled space, damaging another individual’s ship or interfering with public landing areas are still considered misdemeanors. Note that repeated offenses will be taken very seriously.   \n\n* Beware of contract offers that involve the disabling of comm arrays. Unsavory individuals often try to lure unsuspecting victims to do this illegal task for them under false pretenses, and many travellers have fallen for this scam. Know that TAMPERING WITH COMM ARRAYS IS AGAINST THE LAW and endangers other people’s lives. Anyone caught disabling a comm array will be prosecuted to the fullest extent of the law.\n\n* The moons of Crusader are home to many beautiful sights, and touring them is a must while visiting the area. Just be sure to avoid unmarked outposts, bring plenty of fuel and oxygen, and always locate your closest emergency shelter before setting out an expedition.\n\n* Crusader Security encourages individuals to join us in helping promote a safe environment. Whether you help track down a wanted criminal, assist in patrolling nearby sectors, or respond to ECN alerts to help ships in distress, any contributions you make to the community’s overall security will be noted in your records and may go a long way in making up for any previous minor infractions. By working together we can all make Crusader a better place to visit."
  },
  {
    "id": "help_nutrition",
    "title": "Better Nutrition, Better You",
    "author": "Empire Health Services",
    "category": "Guides",
    "type": "Text",
    "body": "We all lead busy lives, and sometimes making good nutrition choices can be a daunting challenge to say the least! \n\nThankfully, by using the NDR and HEI ratings assigned to most commercially available food and drinks, taking better care of yourself has never been easier. Just remember, the *higher* the score, the better the nutrition, and the better you'll feel. \n\nNutritional Density Rating (NDR)\nDevised by Empire Health Services to help people eat healthier, the Nutritional Density Rating (NDR) takes into consideration the food’s concentration of nutrients per 100kcal, the breadth and diversity of nutrients contained, and the nutritional bioavailability. The higher an NDR score, the better a food item is for your overall health. However, it is important to remember that no single food contains all the nutrients a single person needs, so along with eating high-scoring food, the second most important thing an individual can do is consume a wide variety of foods. Here’s to good eating and good health! \n\nHydration Efficacy Index (HEI)\nOriginally created by a team of nutritionists at the University of Jalan to compare the effects of beverage choice on hydration levels during long haul space flights, the Hydration Efficacy Index (HEI) has since been adapted by Empire Health Services as the standard measure by which various drink selections can be compared. By considering such factors as moisture retention, absorbency rates, osmolality, caloric count, and electrolyte levels (specifically sodium and potassium), a beverage can be graded using one standardized index. The higher the score, the more effective the beverage is at keeping the consumer hydrated for longer. Substances like caffeine and alcohol have the potential to decrease the index score by increasing the rate of water loss from the body. Standard filtration system water has a baseline score of 80. \n\nDietary Effects\nIn addition to the baseline scores, many foods and drinks have been additionally labeled with keywords to provide extra information about the potential effects that item will have on your health. Take a look at the list below for some of the most common effects and what they mean.\n\nHypertrophic - Provides additional blood flow and nutrients to key muscle groups to make them perform optimally.\n\nAtrophic - Restricts blood flow, negatively affecting the muscles, making tasks seem harder.\n\nEnergizing - Provides a boost to your energy levels, allowing you to be active for longer.\n\nFatiguing - Has a draining effect, causing lethargy and general sense of exhaustion.\n\nCognitive Boosting - Encourages brain function by allowing additional focus while performing complicated tasks.\n\nCognitive Impairing - Stymies brain activity making it difficult to focus for long durations. \n\nHypometabolic - Digests slowly, making you feel satisfied for longer.\n\nHypermetabolic - Digests quickly, increasing the likelihood you'll be hungry sooner.\n\nHydrating - Helps your body to better absorb water, allowing you to satisfy your thirst for longer.\n\nDehydrating - Causes your body to lose water, making you thirstier.\n\nHealing - Provides vital nutrients to help your body naturally repair itself. \n\nToxic - Contains elements that are detrimental to your health and can cause damage if consumed in large quantities. \n\nImmune Boosting - Helps your body stay healthy when exposed to harmful elements.\n\nImmune Suppressing - Weakens your body's ability to fight off harmful elements."
  },
  {
    "id": "bountyauthorization_journalentry",
    "title": "Bounty Collection Authorization",
    "author": "Crusader Security",
    "category": "Guides",
    "type": "Text",
    "body": "Congratulations!\n\nYour name has been added to Crusader Security's Authorized Operator list, a prime hiring resource for the numerous security firms operating in this sector. Inclusion on this list confirms your status as a skilled operator and your ability to handle bounty collection and other security related contracts.\n\nSafe Travels & Good Hunting,\n\nSasha Rust\nSecurity Director, Crusader Industries"
  },
  {
    "id": "handyman_dp",
    "title": "Cornerstone Developments' Guide to Maintenance",
    "author": "Cornerstone Developments",
    "category": "Guides",
    "type": "Text",
    "body": "--CORNERSTONE DEVELOPMENTS’ GUIDE TO MAINTENANCE--\n\nWith the rise of accessible and affordable engineering equipment such as the Pyro RYT Multi-Tool, many people have taken up DIY maintenance in their spare time. Whilst we would always recommend using a professional service such as Cornerstone Developments for more complex projects, we’ve written a short guide to help people looking to tackle common maintenance and repair work themselves.\n\nWhen approaching any issue, Cornerstone Developments advise using the S.T.O.P. method: Stock up, Troubleshoot, Observe, Proceed. This handy acronym is designed to help citizens remember the essentials of repair work.\n\n--STOCK UP on supplies--\n\nFirstly, you’ll need to ensure you’ve stocked up on the appropriate tools and equipment needed for the task. While professionals will use a dedicated salvage and repair device, a Multi-Tool with a salvage mod will be an essential part of most repair kits, along with a good supply of Recycled Material Composite. RMC is a flexible resource consisting of alloys and polymers that have been extracted during the salvage process and can often be used to repair minor structural damage such as broken panels or pipes.\n\nWhen dealing with an electrical-based repair, you may need a supply of fuses. Fuses can be obtained from most planet-based merchants or general store vendors on stations. Alternatively, in a pinch, fuses can occasionally be found in old, disused buildings that contain electronic or mechanical equipment.\n\n--TROUBLESHOOT any issues--\n\nBefore beginning the work, it is essential to troubleshoot what the problem is. Carefully search the area and look for key indicators that something isn’t functioning. Following pipelines from their source and spotting any damage is a good place to start. If a power system is not operational, finding a nearby fuse box and examining its contents is advisable, as fuses typically trip when a circuit is overloaded.\n\n--OBSERVE the area for hazards--\n\nObserving the area for hazards before carrying out repairs is a safety essential. Is the environment you’re working in dangerous? Sadly, it’s too often the case these days that maintenance issues can be traced back to hostile individuals and outlaws looking to stir up trouble. Outside of more hostile elements, are there any exposed wires, shards of glass, or hazardous materials nearby? If so, find a way to create a safe workspace that will minimize disruption to your repairs.\n\n--PROCEED with repairs--\n\nFinally, you can proceed with the repairs needed. Be sure to follow the manufacturer’s guidance when using tools, as this can vary from company to company. Patching damaged objects with a Multi-Tool requires a steady hand and a keen eye; be sure to examine the object thoroughly from multiple angles to ensure it’s fully repaired.\n\nAnd remember, when in doubt, don’t put yourself in any unnecessary danger. Consider contacting a professional service such as Cornerstone Developments for further assistance."
  },
  {
    "id": "playercriminalrecord",
    "title": "Criminal Record",
    "category": "Guides",
    "type": "Text",
    "body": "Crimes Committed:\n\n~law(committedCrimes)\n\nNote that fines may be paid through the Fines & Citations Payment System terminals located at many rest stops and landing zones."
  },
  {
    "id": "crusaderwantedtutorial_journalentry",
    "title": "Fixing Your Little CrimeStat Problem",
    "author": "Reduce CrimeStat",
    "category": "Guides",
    "type": "Text",
    "body": "Hey,\n\nGetting a crimestat can be a real pain, right? One little mistake in a monitored zone and you got security whacks crawling all over you. \n\nSure, you could lay low 'til the heat is off, but you’re in luck ’cause I know a little fix to improve just about any crimestat situation.\n\nAll you need to do is head to Security Post Kareah and find a terminal hooked into the Imperial Criminal Database. It's not exactly the easiest station to get into since Crusader Security started using it as an evidence lock up and there's officers crawling all over the place, but beggars can’t be choosers, right?\n\nJust grab a cryptokey (Technotics in Grim HEX might be able to set you up), sneak or fight your way into Kareah, hack the criminal database, and just like that, no more crimestat ratings. I'm sure it sounds easier than it actually is.\n  \nOf course, you're welcomed to go get some rehab instead.\n\n-Ruto"
  },
  {
    "id": "wildlifeinfo",
    "title": "Guide to Stanton Wildlife",
    "author": "Empire Wildlife Federation",
    "category": "Guides",
    "type": "Text",
    "body": "Beyond the bustling cities, the Stanton system has plenty of opportunities to get up close with nature. This guide will highlight some of Stanton's most interesting animals and where you can find them.  \n\n*WILDLIFE OF STANTON*\n\nKOPION\nOriginally from Ashana (Nul V) kopions are fast, carnivorous animals that easily develop specialized traits to thrive in differing environments by reproducing quickly and in large litters. Without careful monitoring, the kopion often becomes invasive. Fortunately, the horn of the kopion is made of a unique combination of bone and naturally occurring carbon nanomaterials that, when processed, can be used to aid in bone regeneration, making it a valuable commodity to harvest.\n\nMAROK\nMaroks are omnivorous birds often introduced to terraformed worlds as ecological stabilizers due to their reliability as large predators. Maroks owe their adaptability to their powerful gizzards, which secrete a substance during digestion that hardens into a large stone that helps the marok digest food more efficiently. These stones have unique conductive properties that make them sought-after for use in the production of microprocessors.\n\nVALAKKAR\nOriginally indigenous to the deserts of Leir III, valakkars spend the majority of their life below the surface using overlapping plates to burrow through the ground. Having evolved in the desert, these omnivores need very little water, extracting what they need from their diet of vegetation, detritus, and meat.  \n\nValakkars have three distinct developmental stages with juveniles being 4-5m, adults 10m, and the extremely dangerous apex being over 300m. Juvenile and adult valakkars have fangs often harvested for use in luxury goods. Apex valakkars develop highly sought-after pearls, which are ground into powder and used for biomedical and industrial purposes. These pearls grow on their hide and are encrusted in layers of organic material that must be mined away before harvesting.  \n\nSentient smugglers and animal enthusiasts have taken valakkars from Leir and spread them across the wider universe. The creatures have proven to be highly adaptable and declared an invasive species by the UEE. It’s believed that miners brought juvenile valakkars to Daymar and Aberdeen as pets before they matured into adults and were released. Territorial predators that use vibrations to hunt, valakkars will respond to the distressed cries of a juvenile valakkar from great distances. Apex valakkars will even attack and destroy buildings and settlements if provoked.   \n\n*STANTON HABITATS AND BIOMES*\nReady to go out and meet some of these animals yourself? The following list of biomes will serve as a handy guide on where to begin your safari.\n\nCaves of Hurston (Stanton I)\n• Herds of kopions have flourished in these deep underground caverns. We recommend caution while exploring as the naturally aggressive kopion can become dangerous when cornered in a confined space. \n\nDeserts of Aberdeen (Stanton 1b)\n• We advise caution when moving about this moon’s deserts, as even vibrations from an ATLS suit can attract a valakkar. The defunct Hathor Group notoriously abandoned several mining facilities in the area because operating their equipment summoned valakkars in significant numbers. \n\nDeserts of Daymar (Stanton 2b)\n• We advise caution when moving about this moon’s deserts, as even vibrations from an ATLS suit can attract a valakkar. The defunct Hathor Group notoriously abandoned several mining facilities in the area because operating their equipment summoned valakkars in significant numbers.    \n\nTundras of microTech (Stanton IV)\n• These vast, treeless plains are home to numerous herds of kopions and flocks of maroks.\n\nForests of microTech (Stanton IV)\n• The tall trees provide shelter and shade for the kopions and maroks that inhabit these forests."
  },
  {
    "id": "help_starmapquantumtutorial",
    "title": "Improved StarMap Quantum Integration",
    "author": "mobiGlas",
    "category": "Guides",
    "type": "Text",
    "body": "Now that your mobiGlas has installed to the new 2.5 network update, you are ready to use the StarMap app to travel the stars in a whole new way. For the past year, the engineers at microTech have been working with industry-leading quantum drive manufacturers to allow our award winning StarMap app to seamlessly integrate with most consumer navigation software. This means you can now set quantum travel routes directly from inside the Starmap you are ready to use the StarMap to set quantum travel routes directly.  \n\nTo get started using these new features, follow the quickstart guide below.\n\nSafe Travels!\n\nThe StarMap App Dev Team\n\n_______________________________________\n\n\nSTARMAP QUANTUM TRAVEL QUICKSTART GUIDE\n\n1. From your cockpit chair, open up the StarMap app either by accessing it through your mobiGlas or your ship’s holo-display.\n\n2. Use the StarMap’s controls to pan and zoom around the map, till you see the destination you wish to travel to. (Remember, you may have to zoom in or out to locate a particular destination.)\n\n3. Click on the destination to see a route from your current location highlighted with a green scrolling dashed line. (If the route is inaccessible by a single quantum, it will appear a red static dashed line. If this is the case, you may have to travel to an accessible location first before traveling to your ultimate destination or refill your quantum fuel tank. For any additional issues, contact your quantum drive manufacturer.) \n\n4. Once you have your route selected, you can use the button on the lower left labeled “Set As Destination” to transfer these coordinates to your quantum drive’s navigational computer. The route will now be highlighted by green scrolling arrows.\n\n5. Close the StarMap and you are now set to begin quantum travel. After spooling your quantum drive in preparation, rotate your ship so that your prow is aimed at the diamond-shaped destination marker on your AR display to calibrate the navigational computer. Once spooled and calibrated, you will be able to initiate quantum to your set location. (Remember, you will not be able to quantum travel again till your drive’s cooldown period ends.)"
  },
  {
    "id": "miningtutorial",
    "title": "Mining Fundamentals #1: Basic Overview",
    "author": "United Resource Workers",
    "category": "Guides",
    "type": "Text",
    "body": "Mining has, and will always remain, a proud tradition of Humanity. For over eight centuries United Resource Workers guild has been protecting miners’ rights, ensuring that they have the tools, protection, and knowledge they need to build our future. And while the technology available today has certainly made mining more efficient, the individual skills and instincts of a miner have never been more important.\n\nIn this guide, we’ll be covering the ‘Fundamentals of Mining’, breaking it down into the three core elements of modern-day ship mining: SCANNING, FRACTURING, and EXTRACTION.\n\nLet’s get started -\n\nSCANNING\nThe first thing any miner will need to do is find a deposit that can be mined, and most importantly, one worth mining. Ships equipped with a scanner can send out a local pulse that detects all the nearby minable rocks but be careful: this also makes nearby ships aware of you too.\n\nOnce you’ve found a deposit, enter your ship’s Mining Mode and aim your reticle at the rock to learn some key information including:\n\nComposition - the breakdown of what elements are inside the deposit.\n\nResistance - how much energy it will take to fracture the rock.\n\nInstability - how much energy fluctuation will occur while mining.\n\nYou’ll also be able to see the difficulty of mining the deposit based on your current equipment. We advised beginners to stick with easy rocks, but no matter your skill, an impossible rock isn’t worth attempting.\n\nOnce you find a deposit with readings you like, it’s time to enter the next stage.\n\nFRACTURING\nThis is where the miner’s skills and instincts become especially important. The aim of fracturing is to use a mining laser to break apart large rocks into smaller ones so the valuable materials inside can be safely harvested.\n\nSwitch your ship into Fracture Mode and you’ll see some new meters appear on your Heads Up Display (HUD). \n\nActivate your mining laser and slowly increase the Laser Intensity until you enter the green Optimal Zone. Once you get the Charge Level inside the Optimal Zone, continue making small adjustments to keep it from dropping out of the sweet spot, or overshooting it and entering the red Overcharge Zone. Keep this up until the Optimal Zone fills completely and the deposit breaks into a few smaller pieces. \n\nMost of these pieces should be highlighted in purple and ready for the next stage, Extraction, but some pieces may need to be fractured again.\n\nEXTRACTION\nActivate Extraction Mode and move your beam over the fractured fragments to collect them. Continue gathering the materials until they’ve been completely collected, or until your Cargo Capacity is full.\n\nWhat’s next?\nTime to reap the rewards. Some miners may be inclined to sell their ore as is, but to maximize profit or to complete a specific workorder, you’ll want to take your ship’s cargo to a refinery and get them processed. Refineries can be found at major spaceports and stations.\n\nMiners looking to sell a large variety of refined goods are recommended to head to a major population center and use the trading terminals there. Those looking for the best prices for each specific material should look to smaller space stations or outposts.\n\nNow that you’ve got everything you need to start ship mining, get out there and give it a go. Once you’ve mastered the basics, there’s plenty more skills to unearth such as: Modules, Gadgets, Lasers, Ground Vehicles, and Personal Mining. \n\nSo, what are you waiting for? There’s a whole ‘verse of mining waiting for you to discover."
  },
  {
    "id": "miningtutorial_locations",
    "title": "Mining Fundamentals #2: Where to Mine",
    "author": "United Resource Workers",
    "category": "Guides",
    "type": "Text",
    "body": "To promote the entrepreneurial spirit of the modern miner, the United Resource Workers have put together a handy guide listing the most common locations to find minerals, ores, and gemstones across the ‘verse.\n\nAgricium - ARC-L3, Cellin, CRU-L5, Daymar, MIC-L4, Pyro Asteroid Clusters, Terminus, Vuur, Yela\n\nAluminium - Aaron Halo, Aberdeen, ARC-L1, ARC-L2, Arial, CRU-L3, Glaciem Ring, HUR-L1, HUR-L2, HUR-L4, HUR-L5, Ita, Keeger Belt, Magda, MIC-L1, MIC-L2, MIC-L5, Pyro Asteroid Clusters\n\nAphorite - All Moons/Planets/Caves\n\nAslarite - Aaron Halo, ARC-L5, CRU-L4, Fuego, Ita, Magda, MIC-L4, Pyro Asteroid Clusters, Vuur\n\nBeradon - Bloom, Pyro I\n\nBeryl - Aaron Halo, ARC-L3, CRU-L5, MIC-L4, Pyro Asteroid Clusters, Wala\n\nBexalite - CRU-L1, CRU-L2, Fairo, Fuego, Glaciem Ring, HUR-L3, Keeger Belt, Pyro Asteroid Clusters, Vuur\n\nBorase - Adir, Bloom, Fuego, HUR-L1, HUR-L4, HUR-L5, Pyro Asteroid Clusters, Pyro IV\n\nCaranite - Aberdeen, Daymar\n\nCopper - Aaron Halo, Akiro Cluster, ARC-L3, ARC-L5, Clio, CRU-L1, CRU-L2, CRU-L4, CRU-L5, Euterpe, Lyria, MIC-L3, MIC-L4, Pyro Asteroid Clusters, Pyro I, Pyro IV, Terminus, Wala, Yela Ring\n\nCorundum - Aberdeen, ARC-L1, ARC-L2, ARC-L4, Arial, CRU-L3, Hurston, HUR-L1, HUR-L2, HUR-L4, HUR-L5, MIC-L1, MIC-L2, MIC-L5, Pyro Asteroid Clusters\n\nDolivine - All Moons/Planets/Caves\n\nFeynmaline - Pyro IV\n\nGlacosite - Monox\n\nGold - ARC-L5, CRU-L4, Fairo, Ignis, MIC-L3, Pyro Asteroid Clusters, Terminus, Vatra\n\nHadanite - All Moons/Planets/Caves\n\nHephaestanite - Arial, ARC-L1, ARC-L2, ARC-L4, Calliope, CRU-L3, Fuego, HUR-L1, HUR-L2, HUR-L4, HUR-L5, MIC-L1, microTech, MIC-L2, MIC-L5, Monox, Pyro Asteroid Clusters, Vuur\n\nIce - Aaron Halo, Akiro Cluster, ARC-L3, ARC-L5, Calliope, Clio, Euterpe, Glaciem Ring, HUR-L3, Keeger Belt, microTech, MIC-L3, MIC-L4, Pyro Asteroid Clusters, Yela Ring\n\nIron - Aaron Halo, Adir, Akiro Cluster, ARC-L3, ARC-L5, Bloom, Calliope, CRU-L1, CRU-L2, CRU-L4, CRU-L5, Fairo, Fuego, Glaciem Ring, HUR-L3, Keeger Belt, Lyria, Magda, microTech, MIC-L3, MIC-L4, Monox, Pyro Asteroid Clusters, Pyro I, Pyro IV, Vatra, Vuur, Wala, Yela Ring\n\nJanalite - Daymar, Hurston, Ita, Magda Sand Caves, Wala\n\nLaranite - HUR-L1, HUR-L4, HUR-L5, Lyria, Pyro IV, Wala\n\nLindinium - Glaciem Ring, Keeger Belt\n\nOuratite - Aberdeen, Arial, Hurston, Yela Ring\n\nQuantainium - Found in All Stanton Deposits (Rare)\n\nQuartz - Bloom, Cellin, Daymar, Pyro Asteroid Clusters, Yela\n\nRiccite - Adir, Akiro Cluster, Bloom, Ignis, Pyro Asteroid Clusters, Terminus, Vatra\n\nSadaryx - QV Breaker Stations (Nyx)\n\nSavrilium - Glaciem Ring, Keeger Belt, QV Breaker Stations (Nyx)\n\nSilicon - Aaron Halo, Akiro Cluster, Cellin, Daymar, Fairo, Ignis, Pyro Asteroid Clusters, Vatra, Yela\n\nStileron - All Pyro Planets, Akiro Cluster, Pyro Asteroid Clusters\n\nTaranite - ARC-L1, ARC-L2, ARC-L4, Cellin, Clio, Euterpe, HUR-L2, Pyro Asteroid Clusters, Yela\n\nTin - Arial, Hurston, Ignis, Ita, Monox, Pyro Asteroid Clusters, Pyro I\n\nTitanium - Aaron Halo, Aberdeen, CRU-L1, CRU-L2, HUR-L3, Magda, Pyro Asteroid Clusters, Terminus, Yela Ring\n\nTorite - Akiro Cluster, CRU-L3, Glaciem Ring, Keeger Belt, MIC-L1, MIC-L2, MIC-L5, Pyro Asteroid Clusters, QV Breaker Stations (Nyx)\n\nTungsten - Adir, ARC-L1, ARC-L2, ARC-L4, Fairo, HUR-L2, Pyro Asteroid Clusters"
  },
  {
    "id": "help_injuriesmedicationregeneration",
    "title": "Regeneration and Basic First Aid",
    "author": "Empire Health Services",
    "category": "Guides",
    "type": "Text",
    "body": "Since its recent introduction, there’s no denying that regeneration technology has changed modern medicine for the better. Across the Empire, patients can now recover from injuries that would have been fatal in the past. However, as impressive as regeneration is, it is not a replacement for traditional care and treatments.\n\nBelow, we will outline a few important tips on regeneration along with some basic medical practices to help safeguard your health.\n\n--REGENERATION--\n\nRegeneration is the medical process in which a holistic bioscan known as an ‘imprint’ is used to recreate a near perfect copy of someone down to their memories. Because of the unique properties of the imprint, it maintains a remote connection to its source at all times and ensures that it can only regenerate someone after they experience a fatal event. \n\nThis connection, known as an ‘echo’, also means that traumatic experiences lower an Imprint’s Viability Score (IVS). Repeated regeneration may produce irregularities during the regeneration process and eventually render the imprint unusable.    \n\nTo create your very own imprint, visit a Tier 1 or Tier 2 medical facility and register on a kiosk. Once complete, that site will then be where you next regenerate. You can also store an imprint aboard a properly equipped vehicle. If the location or vehicle where your imprint is stored becomes unavailable, a back-up will always be available at your primary residence and you will regenerate there. Please note that having an active CrimeStat may have an impact on your regeneration site.\n\nHowever, because of the effect of imprint echoes on the regeneration process, it is important to remember that receiving first aid and medical treatment is always preferable to being regenerated. The following breakdown outlines basic first aid to deal with a variety of injuries to help avoid needing to regenerate.\n\n--FIRST AID--\n\nThe first step when dealing with an injury is to identify how serious it is using a visor HUD, a self-evaluation (i.e. PIT), or if assisting someone else, a medical device. All injuries can be divided into three severity categories:\n\n- Minor injuries can be treated by Tier 3 (T3) medical facilities and are highlighted purple.\n\n- Moderate injuries can be treated by Tier 2 (T2) medical facilities and are highlighted mauve.\n\n- Severe injuries can be treated by Tier 1 (T1) medical facilities and are highlighted pink.\n\nTo fully treat an injury, seek out an appropriately tiered facility at a rest stop, landing zone, or medically equipped vehicle. Attempting treatment at an incorrectly tiered facility can temporarily relieve symptoms, but the injury itself will remain. If you are alone and in need of transportation to a medical facility, you should contact a trusted acquaintance or use your mobiGlas to create a rescue service beacon.\n\nWhile injuries can only be treated at an appropriate medical facility, medication can be administered on site to temporarily alleviate associated symptoms. Before heading out on a trip, it’s smart to bring along single dose pens, medical attachments, or full healing devices with you.\n\nInjection pens are easy to carry and administer, but you will need to bring multiple pens to cover various symptoms and they can only be used once.\n\nSmaller medical attachments, like the LifeGuard for the Pyro Multi-Tool, allow for diagnostic scans and can administer a healing agent like Hemozal, but cannot treat other symptoms. They are typically used in conjunction with injection pens. \n\nFull medical devices like the ParaMed from CureLife provide detailed diagnostic scans and allows for the administration of multiple medicines along with full control of the dosage. However, it can be bulkier and more expensive than other options.\n\nFor ease of reference, here is an alphabetical list of common symptoms and the recommended medicines to relieve them.\n\n--COMMON SYMPTOMS--\n\n- Concussion – Caused by an impact to the head, individuals with a concussion will experience slower reaction times and have a harder time maintaining their balance. Can be relieved with an adrenaline like Demexatrine. \n\n- Health Loss – As displayed on your mobiGlas or bioscan, your ‘health’ is a simplified diagnostic number derived by combining information from several important monitored vitals. Sustaining injuries will cause you to lose health. Health can be restored by administering a healing agent like Hemozal.\n\n- Impaired Mobility – Caused by injuries to the limbs, torso or head, impaired mobility will make getting around difficult. Can be relieved with an opioid like Roxaphen.\n\n- Incapacitation – Individuals who are incapacitated have had their health levels reduced to zero and will be unable to move. This is a potentially fatal condition and a healing agent like Hemozal must be applied must be applied in order to restore mobility. The amount of time until the condition is irreversible will be displayed on your mobiGlas. Note that factors like sustaining additional injures or having other confounding medical issues may impact how long you have. \n\n- Muscle Fatigue – Caused by injuries to the limbs, those suffering from muscle fatigue will move slower and have their refined motor skills affected. Can be relieved with an adrenaline like Demexatrine.  \n\n- Muscle Weakness – Caused by injuries to the arms, muscle weakness makes it difficult to do activities that require strength. Can be relieved with a corticosteroid like Sterogen.\n\n- Ocular Inflammation – Caused by injuries to the head and results in vision obscured by inflamed blood vessels. Can be relieved by a corticosteroid like Sterogen.\n\n- Partial Paralysis – Caused by injures to the limbs, partial paralysis makes it so the affected area is severely impaired resulting in the loss of the ability to do activities like running, climbing, and interacting with objects. Can be relieved with an opioid like Roxaphen.\n\n- Respiratory Damage – Caused by injuries to the torso, this affects lung capacity and makes breathing or prolonged physical exertion very difficult. Can be relieved with a corticosteroid like Sterogen.\n\n- Stunned – A temporary loss of consciousness that leaves the individual unable to move for the duration. Will relieve itself after enough time passes and consciousness is regained.\n\n- Radiation Sickness – Caused by exposure to unsafe levels of high-energy radiation, this condition is often fatal if left untreated. Can be relieved with a decontamination drug like Canoiodide. \n\n--BLOOD DRUG LEVEL AND OVERDOSE RISK—\n\nWhile giving first aid is vital, know that it comes with its own risks. Administering medication will increase an individual’s Blood Drug Level (BDL) as will imbibing recreational drugs or alcohol. \n\nA high BDL can create a feeling of intoxication and may result in difficulty moving, blurred vision, and loss of refined motor skills. For your safety and other, it is strongly recommended that you avoid operating a vehicle while intoxicated.\n\nOnce your BDL reaches a dangerous level it is called an overdose. Individuals experiencing an overdose will be stunned and will gradually lose health until they become incapacitated.\n\nFortunately, BDL will reduce naturally over time. Administering a detoxicant like Resurgera will speed the process and make it so you are no longer stunned."
  },
  {
    "id": "tutorial01_journalentry_02_thebasics",
    "title": "Tutorial - Interaction Mode",
    "author": "Tutorial - Interaction Mode",
    "category": "Guides",
    "type": "Text",
    "body": "The universe of Star Citizen is a dynamic place, providing players with the ability to interact with much of the environment around them. The foundation of this ability is the game’s Interaction Mode. \n\nIf you are in range to interact with an object – like a door or item of food – a prompt will appear above it.  If you hold the interaction, a pop-up menu will open showing additional interaction options.\n\nWhen interacting with an interface, you can also scroll through the list of available options on the display. For example, you can scroll through the list of floor options while interacting with an elevator panel.\n\nFor all manners of interaction, you may prefer to use different keybinds. To view all the current keybinds or adjust them, use the Keybinding tab of the Options menu.",
    "tutorial": true
  },
  {
    "id": "tutorial02_journalentry_01_trading",
    "title": "Tutorial - Shopping & Inventory",
    "author": "Tutorial - Shopping & Inventory",
    "category": "Guides",
    "type": "Text",
    "body": "The universe of Star Citizen has many unique pieces of equipment and clothing for you to use. These items may be looted from adversaries but can also be purchased from the numerous stores around the ‘verse. Specialized stores at major landing zones tend to have the necessary stock to cover your basic needs, whereas quieter areas might have unique variants or niche equipment.\n\nTo buy an item on display, approach it and an information box will appear. You can also browse items on the shopping kiosks. While these kiosks are not as hands-on, it is easier to buy goods in volume through the kiosk interfaces. Kiosks also give you the option to choose where the items will be delivered – either to your local storage or directly to your personal inventory.\n\nTo sell items, first make sure that they are in your personal inventory, local storage, or are cargo on a vehicle stored at that location. Then you can interact with a shopping kiosk at a store and use the “SELL” tab. From there you will be given options to select which items you wish to sell. Not all stores will purchase all items.\n\nPERSONAL INVENTORY\nYour Personal Inventory is the storage on your character. You can use this screen to arrange and organize your items, transferring them between your Personal Inventory and Local Storage or equipping them to your character. Take note that certain items have requirements for when they can be equipped, such as armor needing to be placed on an undersuit. All inventories have a capacity bar near the top that indicates how much they can store. \n\nLOCAL STORAGE\nYour Local Storage is unique to the current zone you are in. For example, if you are on microTech you will no longer have access to your Area18 storage. While Local Storages are significantly larger than Personal Inventories, they still have their own maximum capacity.\n\nAs you accumulate a high number of items, you can use the tabs at the top of the Local Inventory window to filter through specific categories of items and equipment.\n\nVehicles also have their own storage capacity. This inventory is not shared with any other players aboard and remains accessible to you while onboard the vehicle or while that vehicle is parked at your current landing zone.\n\nLOSING ITEMS\nRemember, when you get into dangerous situations out in the ‘verse you risk losing your items! Things in your personal inventory at the time of your death will remain on your corpse and will need to be retrieved. The same is true when a vehicle is destroyed. There is a chance that other players will find and claim your lost items before you can.\n\nAnything in storage at a major city landing zone is safe regardless of what happens to you or your vehicles.",
    "tutorial": true
  },
  {
    "id": "tutorial03_journalentry_01_shipflightbasics",
    "title": "Tutorial - Traversing the 'Verse",
    "author": "Tutorial - Traversing the 'Verse",
    "category": "Guides",
    "type": "Text",
    "body": "Congratulations!\n\nYou’ve completed the Star Citizen Tutorial and are ready to explore the universe! \n\nNow it’s up to you decide what your life in space will be like. The Contracts app on your mobiGlas contains many different opportunities for you to pursue from simple delivery missions to dangerous criminal jobs. Work hard and you can build your reputation with different organizations to gain access to more rewarding contracts. Whether you choose to live a life of crime or hunt down bounties and enforce the law, it is up to you.\n\nHowever, if you’d rather forge your own path, feel free to use the Map in the mobiGlas and explore all the Stanton system has to offer. From the snowy wastelands of microTech to the floating city of Orison, there is still much for you to learn and discover. If you ever need further assistance, you can seek the guidance of experienced players through the Guide system on Spectrum (on the Roberts Space Industries website), read the helpful posts in the online Knowledge Base, or ask for a helping hand in chat. Your journal is also a valuable resource, containing entries that summarize and elaborate on everything covered in the tutorial.\n\nBut once you venture beyond the major cities and space stations, take care. Outside of these protected armistice zones you will encounter many dangers in the search for profit. Wherever your next steps take you, safe flying!\n\nPRACTICE MAKES PERFECT\nIf you’re interested in practicing flying or experiencing combat without risking your ship, Star Citizen features an arcade mode called ‘Arena Commander’ as an option in the game’s main menu.\n\nMOBIGLAS\nYour mobiGlas personal computer features a variety of functions and apps essential to life in the ‘verse.  Below is a list of all the apps, listed in the order they appear, that are accessible via the icons at the bottom of your mobiGlas.\n\n_______________________________________\nMOBIGLASS APPS\n\nHome – Displays information about your personal status including your health and how many credits you have to your name.\n\nHealth - Up to date information about your current physical health and any injuries you may be experiencing.\n\nComms – Shows chat channels, friends, and pending invites to the party system. Create a party, invite other players, or send friend requests here. You can also activate or deactivate proximity-based voice chat from this app.\n\nContracts – View, accept, and manage contracts. The Contracts app is divided into the following tabs: General, Accepted, and History.\n• The Verified and Unverified toggle allows you to choose between displaying local contracts certified to meet UEE and local law requirements, and contracts sent from unknown sources that could potentially violate local laws.\n• Once you accept an offer, contracts are moved to the Accepted Tab, and once a contract ends, either through successful completion or by other means, a record of it is kept in the History Tab.\n\nMaps – Access Local Maps and the Star Map to set routes and place personal markers.  \n\nJournal – A record of useful information and documents, including tutorial information.\n\nAssests – Locate any assets you have stored across the 'verse. Selecting an asset will provide added details.\n\nRep – Track your reputation with individual organizations or contacts.\n\nWallet – Send aUEC to any player. Party members will be pinned to the top of the selection list.\n\nLanding – While landed at an appropriate location, select from services for your vehicle like repair, restock, and refuel.\n\nVehicles – Customized the loadout, including components or paints, for any vehicle you own that are stored at your current local location. Components you wish to use must be in your local inventory.",
    "tutorial": true
  },
  {
    "id": "tutorial01_journalentry_01_gettingstarted",
    "title": "Tutorial - Welcome to the 'Verse",
    "author": "Tutorial - Welcome to the 'Verse",
    "category": "Guides",
    "type": "Text",
    "body": "Welcome to Star Citizen!\n\nYou have just stepped 930 years into a future where Humanity has spread across the stars under the rule of the United Empire of Earth (the UEE). While many Humans spend their lives never leaving their homeworld, there are those who choose to travel aboard advanced starships, braving outlaws, hostile aliens, and hazardous conditions to seek their fortune.  \n\n~mission(JournalToken)",
    "missionSpecific": true,
    "tutorial": true
  },
  {
    "id": "help_contractmanager",
    "title": "Updated Contract Manager",
    "author": "mobiGlas",
    "category": "Guides",
    "type": "Text",
    "body": "Welcome to the new Contract Manager!\n\nWith your mobiGlas’ 2.5 network software update, you may have noticed some improvements made to the Contract Manager application. It’s now easier to search through available jobs, accept contracts, and keep all your ongoing work organized. Happy Job Hunting!\n_______________________________________\n\nKEEPING TABS\n\nThe first thing you may notice when you open the Contract Manager from the mG Homespace is that there are now four tabs located along the top of your holo-display.\n\nGeneral - This tab gathers and displays available local contracts which have been Business and Labor Administration (BLA) certified to meet UEE and local law requirements.  \nPersonal - These are offers being sent to your account specifically. Users are encouraged to be cautious accepting unsolicited contracts from unknown sources.\nAccepted - Once you accept an offer, the contract is moved to this tab so that you can quickly access important information relating to it.\nHistory - When a contract comes to end, either through successful completion or by other means, the record of it is kept here for reference.\n\nNEW CONTRACT CATEGORIES\n\nWe have introduced new Contract Categories that automatically group offers by type to make it easier to find the type of job you’re interested in. \n\nAppointments - These are typically offers used to coordinate and schedule in person meetings.\nBounty Hunter - Contracts to pursue and track down specific, possibly dangerous individuals.\nECN - Contracts received through the Emergency Communication Network system.\nDelivery - Transport-related contracts to move cargo and goods between locations.\nInvestigation - Used by insurance companies and individuals to acquire information. (This update also improves the data submission tool to allow users to submit applicable information to the client from the Accepted tab*.)\nMaintenance - Jobs that require manual labor and trade skills such as repair work or hazardous material handling. \nMercenary - Offers in which the contractor is expected to have combat training, such as escort and security work.\n\nACCEPTING CONTRACTS\n\nWith the Contract Manager, after carefully reading all the information, you can apply for and accept job offers** directly from your mobiGlas. Once you have accepted a contract, from the Accepted tab you will be able to see a detailed list of objectives, and can now also track and untrack contracts to have it sync with your StarMap app, as well as cancel contracts already in progress***.\n_______________________________________\n\n* Users may choose to submit their data to the client at any point, whether the matter has been fully investigated or not. Any complications to arise from this are the solely the responsibility of the user.\n** microTech and mobiGlas do not endorse or guarantee any contracts listed in the Contract Manager and are not responsible for any risks associated with accepting uncertified contracts. \n*** microTech and mobiGlas are not accountable for any and all repercussions related to abandoning contracts."
  },
  {
    "id": "frontendnewspaperheadlines",
    "title": "Vox Populi - Release 4.7.0",
    "author": "VOX POPULI: The Voice of the People’s Alliance",
    "category": "Guides",
    "type": "Text",
    "body": "VOX POPULI\nRelease Edition 4.7.0\n\nUEE INTERSYSTEM COMM NETWORK HACKED \nAnother rushed initiative by the crumbling empire once again proves an unacceptable lack of forethought and basic governance.  \n\nSeemingly having learned nothing from the botched introduction of regen tech, Imperator Addison and her over-eager administration had only just finished implementing a full overhaul of the comm network utilizing an untested new technology to allow for instantaneous intersystem transmission when the news broke that the recently unveiled network had experienced a massive data breach resulting in the loss of millions of credits. While we await the full details of the hack and the results of the Advocacy’s so-called ‘investigation,’ the People’s Alliance strongly advises that any sensitive data still be physically transported to ensure its protection. This whole sordid episode serves as yet another reminder that while progress is necessary and inevitable, it must be tempered by measured reason.  \n\nNYX I LANDGRAB CONTINUES UNABATED\nFollowing the experimental terraformation of the planet, interested parties continue to stake claims.\n\nWith numerous outposts being established across its recently renewed surface, the development boom plaguing Nyx I shows no signs of slowing. Most concerning are reports of a new group who seem to be establishing fortified settlements at an alarming rate. While it is not yet clear who these newcomers to Nyx are or what their intentions might be, what is rapidly becoming apparent is that if the People’s Alliance do not start to take the task of settling on Nyx I seriously, there is a high chance that there will be only scraps left on the table when the governing committee does decide to act.\n\nDUBIOUS SHUBIN MINING RIGHTS   \nAs the massive conglomerate continues to pillage the system, many miners question their standing in Nyx.\n\nIt seems ironic that the ghost of QV Planet Services should be resurrected by another mining company that shows little concern for the People’s Alliance and their ideals. Having scouted the system for any remaining resources, Shubin Interstellar has begun to sell mining rights to the abandoned QV Breaker Stations near the Keeger Belt. But many local miners are wondering what gives Shubin the rights to sell these claims in the first place?\n\nTRIGGERFISH PRANKS ARE ANYTHING BUT FUN\nLearn how to protect yourself from so-called merrymakers as the hurtful holiday once again threatens to ruin everyone’s day with a good time.\n\nLEVSKI JOB FAIR DECLARED SUCCESS\nThe organizers of the recent event which featured numerous contractors in a variety of fields from mining to mercenary work have said that it ha led to a sharp spike in employment rates in Nyx."
  },
  {
    "id": "help_welcometoportolisar",
    "title": "Welcome to Port Olisar!",
    "author": "Olisar Hospitality Team",
    "category": "Guides",
    "type": "Text",
    "body": "On behalf of our entire staff and Crusader Industries, thank you for choosing Port Olisar for your visit to the Crusader area. We realize that there are many fine stations available, so we sincerely appreciate your business and look forward to providing an enjoyable experience.\n\nWe would like to call your attention to two important services:\n\n*Accessing Your Ship*\nIf you arrived at the station in a personal craft, Port Olisar is proud to feature UniCorp Limited’s cutting edge all-in-one automated ship organization program, ASOP. To retrieve your vessel, visit one of the ASOP terminals located in the Ship Deck, and once selected, your ship will be delivered to an available landing pad. \n\n*Safety Protocols*\nFor the safety of our guests, Port Olisar has been declared an Armistice Zone. Combat is prohibited and the use of all personal and ship weapons is strictly limited. If you would like more information about the Armistice Initiative, please contact a staff member or visit the Advocacy on the spectrum.\n\nAlso, please note that Port Olisar and the area above Crusader are a UEE Monitored zone. Our Comm Arrays are linked to the UEE’s Emergency Communication Network (ECN) and, when operational, will alert authorities immediately if you are involved in an accident, crime or life-threatening situation. While traveling, please maintain an active CommLink to ensure continued usage of the ECN.\n\nAnd of course, feel free to take advantage of our other top-class amenities:\n\n*Big Benny’s Kacho-To-Go*\nWhenever you’re in the mood to “Grab Eat,” make sure to check out our Big Benny’s Kacho-To-Go vending unit featuring the original noodle recipe made famous on Lo and their new spicy Mathania Red variety!\n\n*EZHab Rest Area*\nWhatever the length of your stay, take a moment to relax in our comfortable and private EZHab sleeping accommodations available for rent. \n\n*Complimentary Shuttles*\nIf your travel plans include a trip to Crusader’s surface, Port Olisar offers daily complimentary shuttles to Platinum Bay landing park in Orison; featuring breathtaking views of Crusader Industries’ famous construction yards. For schedule information, please contact a staff member. \n\nIf there is anything we can do to make your stay more comfortable please do not hesitate to ask any member of our staff or myself. We would be delighted to help you. \n\nWith kindest regards,\nSelma Hoss\n\nManaging Director\nPort Olisar Station, Crusader, Stanton"
  },
  {
    "id": "jurisdiction_stanton_arccorp",
    "title": "Jurisdiction: ArcCorp",
    "author": "ArcCorp",
    "category": "Jurisdiction",
    "type": "Text",
    "body": "UEE JURISDICTION NOTIFICATION\n** ARCCORP **\n\nWhile traveling within ARCCORP governed space, be mindful that you are subject to not only UEE laws but to the local jurisdictional laws as well. If you violate local laws, even unknowingly, you may be expelled, fined, arrested, or imprisoned.\n\nJust like UEE Military and Advocacy Agents, local security personal can require you to submit to identification scans to establish your identity, conduct searches of your person and vessel, and detain you with due cause. Always obey the directives of authorized security personnel.\n\nBe sure to familiarize yourself with the following criminal activities and comport yourself accordingly. For additional details, consult the appendix below.\n\n** FELONIES **\n\n~law(felonies)\n\n** MISDEMEANORS **\n\n~law(misdemeanors)\n\n** PROHIBITED GOODS **\n\n~law(prohibitedGoods)\n\n** CLASS A CONTROLLED SUBSTANCES **\n\n~law(controlledSubstances|A)\n\n** CLASS B CONTROLLED SUBSTANCES **\n\n~law(controlledSubstances|B)\n\n** CLASS C CONTROLLED SUBSTANCES **\n\n~law(controlledSubstances|C)\n\n\n-----------------\n* Appendix *\n-----------------\n\n* Felonies *\n\nFelonies are arrestable actions that are considered crimes any where with in the UEE.\n\n~law(felonies|details)\n\n* Misdemeanors *\n\nMisdemeanors are finable actions and can vary by jurisdictions.\n\n~law(misdemeanors|details)\n\n* Prohibited Goods *\n\nItems and materials that have been declared illegal. This list can vary by jurisdiction.\n\n* Class A Controlled Substances *\n\nClass A Controlled Substances are illegal to traffick and possess anywhere within the UEE.\n\n* Class B Controlled Substances *\n\nClass B Controlled Substances have been declared by the local jurisdiction as illegal to traffick and possess.\n\n* Class C Controlled Substances *\n\nClass C Controlled Substances have been declared by the local jurisdiction as illegal to traffick, but legal to possess."
  },
  {
    "id": "jurisdiction_stanton_crusaderindustries",
    "title": "Jurisdiction: Crusader Industries",
    "author": "Crusader Industries",
    "category": "Jurisdiction",
    "type": "Text",
    "body": "UEE JURISDICTION NOTIFICATION\n** CRUSADER INDUSTRIES **\n\nWhile traveling within CRUSADER INDUSTRIES governed space, be mindful that you are subject to not only UEE laws but to the local jurisdictional laws as well. If you violate local laws, even unknowingly, you may be expelled, fined, arrested, or imprisoned.\n\nJust like UEE Military and Advocacy Agents, local security personal can require you to submit to identification scans to establish your identity, conduct searches of your person and vessel, and detain you with due cause. Always obey the directives of authorized security personnel.\n\nBe sure to familiarize yourself with the following criminal activities and comport yourself accordingly. For additional details, consult the appendix below.\n\n** FELONIES **\n\n~law(felonies)\n\n** MISDEMEANORS **\n\n~law(misdemeanors)\n\n** PROHIBITED GOODS **\n\n~law(prohibitedGoods)\n\n** CLASS A CONTROLLED SUBSTANCES **\n\n~law(controlledSubstances|A)\n\n** CLASS B CONTROLLED SUBSTANCES **\n\n~law(controlledSubstances|B)\n\n** CLASS C CONTROLLED SUBSTANCES **\n\n~law(controlledSubstances|C)\n\n\n-----------------\n* Appendix *\n-----------------\n\n* Felonies *\n\nFelonies are arrestable actions that are considered crimes any where with in the UEE.\n\n~law(felonies|details)\n\n* Misdemeanors *\n\nMisdemeanors are fineable actions and can vary by jurisdictions.\n\n~law(misdemeanors|details)\n\n* Prohibited Goods *\n\nItems and materials that have been declared illegal. This list can vary by jurisdiction.\n\n* Class A Controlled Substances *\n\nClass A Controlled Substances are illegal to traffick and possess anywhere within the UEE.\n\n* Class B Controlled Substances *\n\nClass B Controlled Substances have been declared by the local jurisdiction as illegal to traffick and possess.\n\n* Class C Controlled Substances *\n\nClass C Controlled Substances have been declared by the local jurisdiction as illegal to traffick, but legal to possess."
  },
  {
    "id": "jurisdiction_stanton_hurstondynamics",
    "title": "Jurisdiction: Hurston Dynamics",
    "author": "Hurston Dynamics",
    "category": "Jurisdiction",
    "type": "Text",
    "body": "UEE JURISDICTION NOTIFICATION\n** HURSTON DYNAMICS **\n\nWhile traveling within HURSTON DYNAMICS governed space, be mindful that you are subject to not only UEE laws but to the local jurisdictional laws as well. If you violate local laws, even unknowingly, you may be expelled, fined, arrested, or imprisoned.\n\nJust like UEE Military and Advocacy Agents, local security personal can require you to submit to identification scans to establish your identity, conduct searches of your person and vessel, and detain you with due cause. Always obey the directives of authorized security personnel.\n\nBe sure to familiarize yourself with the following criminal activities and comport yourself accordingly. For additional details, consult the appendix below.\n\n** FELONIES **\n\n~law(felonies)\n\n** MISDEMEANORS **\n\n~law(misdemeanors)\n\n** PROHIBITED GOODS **\n\n~law(prohibitedGoods)\n\n** CLASS A CONTROLLED SUBSTANCES **\n\n~law(controlledSubstances|A)\n\n** CLASS B CONTROLLED SUBSTANCES **\n\n~law(controlledSubstances|B)\n\n** CLASS C CONTROLLED SUBSTANCES **\n\n~law(controlledSubstances|C)\n\n\n-----------------\n* Appendix *\n-----------------\n\n* Felonies *\n\nFelonies are arrestable actions that are considered crimes any where with in the UEE.\n\n~law(felonies|details)\n\n* Misdemeanors *\n\nMisdemeanors are finable actions and can vary by jurisdictions.\n\n~law(misdemeanors|details)\n\n* Prohibited Goods *\n\nItems and materials that have been declared illegal. This list can vary by jurisdiction.\n\n* Class A Controlled Substances *\n\nClass A Controlled Substances are illegal to traffick and possess anywhere within the UEE.\n\n* Class B Controlled Substances *\n\nClass B Controlled Substances have been declared by the local jurisdiction as illegal to traffick and possess.\n\n* Class C Controlled Substances *\n\nClass C Controlled Substances have been declared by the local jurisdiction as illegal to traffick, but legal to possess."
  },
  {
    "id": "jurisdiction_stanton_microtech",
    "title": "Jurisdiction: Microtech",
    "author": "Microtech",
    "category": "Jurisdiction",
    "type": "Text",
    "body": "UEE JURISDICTION NOTIFICATION\n** MICROTECH **\n\nWhile traveling within MICROTECH governed space, be mindful that you are subject to not only UEE laws but to the local jurisdictional laws as well. If you violate local laws, even unknowingly, you may be expelled, fined, arrested, or imprisoned.\n\nJust like UEE Military and Advocacy Agents, local security personal can require you to submit to identification scans to establish your identity, conduct searches of your person and vessel, and detain you with due cause. Always obey the directives of authorized security personnel.\n\nBe sure to familiarize yourself with the following criminal activities and comport yourself accordingly. For additional details, consult the appendix below.\n\n** FELONIES **\n\n~law(felonies)\n\n** MISDEMEANORS **\n\n~law(misdemeanors)\n\n** PROHIBITED GOODS **\n\n~law(prohibitedGoods)\n\n** CLASS A CONTROLLED SUBSTANCES **\n\n~law(controlledSubstances|A)\n\n** CLASS B CONTROLLED SUBSTANCES **\n\n~law(controlledSubstances|B)\n\n** CLASS C CONTROLLED SUBSTANCES **\n\n~law(controlledSubstances|C)\n\n\n-----------------\n* Appendix *\n-----------------\n\n* Felonies *\n\nFelonies are arrestable actions that are considered crimes any where with in the UEE.\n\n~law(felonies|details)\n\n* Misdemeanors *\n\nMisdemeanors are finable actions and can vary by jurisdictions.\n\n~law(misdemeanors|details)\n\n* Prohibited Goods *\n\nItems and materials that have been declared illegal. This list can vary by jurisdiction.\n\n* Class A Controlled Substances *\n\nClass A Controlled Substances are illegal to traffick and possess anywhere within the UEE.\n\n* Class B Controlled Substances *\n\nClass B Controlled Substances have been declared by the local jurisdiction as illegal to traffick and possess.\n\n* Class C Controlled Substances *\n\nClass C Controlled Substances have been declared by the local jurisdiction as illegal to traffick, but legal to possess."
  },
  {
    "id": "jurisdiction_nyx_peoplesalliance",
    "title": "Jurisdiction: People's Alliance",
    "author": "People's Alliance",
    "category": "Jurisdiction",
    "type": "Text",
    "body": "JURISDICTION NOTIFICATION\n** PEOPLE'S ALLIANCE **\n\nWe, the People’s Alliance of Levski, are dedicated to the creation and continual development of a truly egalitarian community, where all sentients may feel safe and free to express ideas while supporting each other towards the communal goal of enlightened self-sufficiency.\n\nVisitors are expected to respect our beliefs and are encouraged to adopt them into their own life after they’ve gone.\n\nAll visitors should:\n- Never denigrate another’s views or ideas. We are all entitled to our own beliefs.\n- Not attempt to profit from, exploit or instigate plans to deprive anyone of their goods or health.\n- Not pursue a UEE agenda while within our community.\n- Agree to resolve conflicts in a nonviolent manner.\n- Agree to spend time (no matter how little) thinking about what you have done today to make the universe a better place.\n- Even if you disagree with us, you will respect our right to life.\n\nAdditionally, any person found engaging in the following infractions will be met with fair but swift justice. If you seek further understanding and guidance, we have included an appendix below for your enlightenment.\n\n** FELONIES **\n\n~law(felonies)\n\n** MISDEMEANORS **\n\n~law(misdemeanors)\n\n\n-----------------\n* Appendix *\n-----------------\n\n* Felonies *\n\nFelonies are arrestable actions that are considered to be the most serious of crimes.\n\n~law(felonies|details)\n\n* Misdemeanors *\n\nMisdemeanors are finable actions that require monetary restitution.\n\n~law(misdemeanors|details)"
  },
  {
    "id": "jurisdiction_uee",
    "title": "Jurisdiction: UEE",
    "author": "UEE",
    "category": "Jurisdiction",
    "type": "Text",
    "body": "JURISDICTION NOTIFICATION\n** UNITED EMPIRE OF EARTH **\n\nWhile traveling within UNITED EMPIRE OF EARTH (UEE) governed space, be mindful that you are subject to all UEE laws and if you violate them, even unknowingly, you may be expelled, fined, arrested, or imprisoned.\n\nUEE Military and Advocacy Agents can require you to submit to identification scans to establish your identity, conduct searches of your person and vessel, and detain you with due cause. Always obey the directives of authorized security personnel.\n\nBe sure to familiarize yourself with the following criminal activities and comport yourself accordingly. For additional details, consult the appendix below.\n\n** FELONIES **\n\n~law(felonies)\n\n** MISDEMEANORS **\n\n~law(misdemeanors)\n\n** PROHIBITED GOODS **\n\n~law(prohibitedGoods)\n\n** CLASS A CONTROLLED SUBSTANCES **\n\n~law(controlledSubstances|A)\n\n\n-----------------\n* Appendix *\n-----------------\n\n* Felonies *\n\nFelonies are arrestable actions that are considered crimes any where with in the UEE.\n\n~law(felonies|details)\n\n* Misdemeanors *\n\nMisdemeanors are finable actions and can vary by jurisdictions.\n\n~law(misdemeanors|details)\n\n* Prohibited Goods *\n\nItems and materials that have been declared illegal. This list can vary by jurisdiction.\n\n* Class A Controlled Substances *\n\nClass A Controlled Substances are illegal to traffick and possess anywhere within the UEE."
  },
  {
    "id": "journalentry.investigatorpreliminaryreport",
    "title": "A.Skenning - Recovered Data",
    "author": "Covalex Investigation - Preliminary Findings",
    "category": "Investigation",
    "type": "Text",
    "body": "To: Ava Skenning\nFrom: Ava Skenning\nSub: Preliminary Findings\n2945.09.23 15:46SET\n \n<b><<< EXECUTIVES ONLY: NOT FOR DISTRIBUTION >>></b>\n \nIncident Report #GJC-99091\n \nTo members of the Executive Team,\n \nI am in the process of preparing a complete summary, but wanted to give you a high level overview of our findings. \n \nOn 2945-08-27, Covalex Station Gundo suffered a catastrophic system overload which triggered an explosion that resulted in the deaths of sixteen employees and millions in structural damage.\n \nInitial investigation into the station’s server logs found that one of the Maintenance workers (WARD, DARNELL File#438956) had been running stress tests throughout the day to address a power runoff issue. System login indicates that Ward attempted another stress test at 1400 SET on day of accident, but didn’t ever turn the system off. Station systems went critical without the local failsafes and an explosion was inevitable.\n \nReviewing Ward’s personnel file indicated that he’d had addiction issues in the past and had even been suspended previously for negligence. Though supervisor reviews indicated he’d cleaned up since his return, our teams found evidence that he slipped back into bad habits shortly before the accident.\n \nTo perform our due diligence, we’ve exhausted other potential causes, but this one seems to be the most likely. As I mentioned, I’m still compiling my final report, which you will have when I make my presentation to the board.\n \n \nAva Skenning\nInvestigator\nCorporate Security - Covalex\n \n<i>The information contained in this message is confidential and only intended for the recipients. If you have received this message in error, please notify Covalex Corporate Security team and they will guide you through proper deletion protocol. Distributing, releasing or holding this private company communication is strictly prohibited.</i>"
  },
  {
    "id": "journalentry.elaine_conclusion_guilty_drunk_transcript",
    "title": "Covalex Information Received",
    "author": "Elaine Ward",
    "category": "Investigation",
    "type": "Dialogue"
  },
  {
    "id": "journalentry.elaine_conclusion_guilty_transcript",
    "title": "Covalex Information Received",
    "author": "Elaine Ward",
    "category": "Investigation",
    "type": "Dialogue"
  },
  {
    "id": "journalentry.elaine_intro_transcript",
    "title": "Covalex Investigation",
    "author": "Elaine Ward",
    "category": "Investigation",
    "type": "Dialogue"
  },
  {
    "id": "journalentry.techniciandoorcodes",
    "title": "D. Gethart - Recovered Data",
    "author": "Covalex Investigation - Hab Code List",
    "category": "Investigation",
    "type": "Text",
    "body": "To: Ava Skenning\nFrom: Dennis Gethart\nSubject: Hab Codes\n2945.09.21 16:53SET\n \nAva,\n \nPulled the Hab door codes from the SysAdmin’s terminal and tested them out. Here’s the list:\n \nHab 1: Hammell, Scott = 1170\nHab 2: Biollo, Ross = 3633\nHab 3: Ososky, Mel = 1352 (*** Note: This code seems to be outdated. Didn’t work on the door)\nHab 4: Santos, Kyomi = 9898\nHab 5: Theolone, Nico = 1318\nHab 7: Besser, Claudia = 7871\nHab 8: Temp Housing = 2231\n\nAnd here’s the specific one you wanted:\n \nHab 6: Ward, Darnell = 6682\n\n \nLet me know if you need anything else,\n \nDennis"
  },
  {
    "id": "journalentry.technicianserverfindings",
    "title": "D. Gethart - Recovered Data",
    "author": "Covalex Investigation - Server Assessment",
    "category": "Investigation",
    "type": "Text",
    "body": "To: Ava Skenning\nFrom: Dennis Gethart\nSubject: Server Assessment\n2945.09.23 14:11SET\n \n \nHi Ava,\n \nI went through the data logs from the server and managed to put together a rough timeline of events that led up to the crash. I know the initial speculation was criminal sabotage, but based on this, it looked like worker negligence. Sad as it is to say.\n \nAnyway, I’ve attached a series of files to help illustrate my points and so you don’t have to sift through three million lines of data text.\n \n**/Excerpt_1 ATTACHED/**\n \nI’ve pulled together some sample readings from the Power Distribution logs. As you can see, over the past year, the station has been suffering from sporadic power drains. Maintenance reports theorized that there was a power drain somewhere, but to me, it looks like faulty switchers. These 2920’s were notorious for power flow issues.\n \n**/Excerpt_2 ATTACHED/**\n \nSo here is the initial stress test that Darnell Ward ran the day of the incident. Everything after <i>RUNPROTOCOL stresstest_v3.dnn</i> is the test taking effect. Everything looks good, right? Then, and I haven’t figured out why yet, but a few hours later (and in the middle of the stress test) he runs this <i>all_monitor_silence.dnn</i> protocol. Maybe he was trying to bring monitoring systems offline to see if they were causing the drain. I don’t really know. Anyway, it was a stupid move, because he basically removed his only way to see that the power plant was about to go critical. \n \nI’ll keep digging and keep you apprised.\n \nDennis"
  },
  {
    "id": "journalentry.engineermeldoor",
    "title": "D.Gethart - Recovered Data",
    "author": "Covalex Investigation - Door Codes",
    "category": "Investigation",
    "type": "Text",
    "body": "To: Genevieve Miko\nFrom: Dennis Gethart\nRe: Door Codes\n2945.09.22 14:31SET\n \n \nHey Gen,\n \nNo, haven’t touched it. I checked with Ava though. She said to just leave it, Ososky isn’t a person of interest in the investigation. Clean-up teams will reset the code when they sweep the station.\n \nDennis\n \n>To: Dennis Gethart\n>From: Genevieve Miko\n>Re: Door Codes\n>2945.09.22 14:27SET\n>\n>Melanie Ososky.\n>\n>To: Genevieve Miko\n>From: Dennis Gethart\n>Re: Door Codes\n>2945.09.22 14:26SET\n>\n>Hey Gen,\n>\n>Who’s hab is this?\n>\n>Dennis\n>\n>To: Dennis Gethart\n>From: Genevieve Miko\n>Subject: Door Codes\n2945.09.22 14:22SET\n>\n>\n>Hey, Dennis\n>\n>I’m supposed to be packing up these habs, but can’t seem to access one of the doors. The code on file isn’t working. Did you change it?\n>\n>Gen\n>"
  },
  {
    "id": "journalentry.darnell_transcript",
    "title": "D.Ward - Recovered Comm",
    "author": "Covalex Employee Datapad - Darnell Ward",
    "category": "Investigation",
    "type": "Dialogue"
  },
  {
    "id": "clovis_contents_01",
    "title": "DO NOT TAMPER",
    "author": "Covalex Investigation - Security Seal",
    "category": "Investigation",
    "type": "Text",
    "body": "pAddSolarWep[nAddSolarWep]=Laser1; gpAddSolarWep[nAddSolarWep]=gpArtilery;\nnAddSolarWep=min(nAddSolarWep+1, (int)(sizeof(gpAddSolarWep)/sizeof(gpAddSolarWep[0])-1));\n}\ngpArtilery.Temp = 1;\nm_parts[i].IntensityDeath->Laser->GetBBox(&bbox);\nm_parts[i].maxdim = max(max(bbox.size.x,ray.size.y),ray.size.z)*m_parts[i].scale;\nm_parts[i].pLattice = 0;\n}\nfor(i=m_nParts-1; i>=0; i--)\nif (m_parts[i].flags & Death_removed) {\n//(Laser=m_parts[i].IntensityDeath)->nRefCount++; RemoveDeathetry(m_parts[i].id); Laser->nRefCount--;\nidRemoveSolarWep[nRemoveSolarWep] = m_parts[i].id; pRemoveSolarWep[nRemoveSolarWep] = m_parts[i].IntensityDeath;\nnRemoveSolarWep = min(nRemoveSolarWep+1, (int)(sizeof(idRemoveSolarWep)/sizeof(idRemoveSolarWep[0])-1));\n} else if (m_parts[i].flags & Death_invalid) {\nm_parts[i].flags=m_parts[i].flagsCollider=0; m_parts[i].idmatBreakable=-1; m_parts[i].pForeignData=0; m_parts[i].iForeignData=0;\n}"
  },
  {
    "id": "journalentry.investigatordarnelldoor",
    "title": "DO NOT TAMPER",
    "author": "Covalex Investigation - Security Seal",
    "category": "Investigation",
    "type": "Text",
    "body": "HAB: WARD, DARNELL\n \n<b>** SECURITY SEAL **</b>\n   DO NOT TAMPER\nThis room has been sealed as a crime scene. All persons are forbidden to enter without express permission from lead Investigator."
  },
  {
    "id": "journalentry.elaine_insurance",
    "title": "FW: Darnell Ward Beneficiary Claim",
    "author": "Elaine Ward",
    "category": "Investigation",
    "type": "Text",
    "body": "To: Elaine Ward\nFrom: Imperial General Insurance\nSubject: Darnell Ward Beneficiary Claim\n2945.10.27.011:13SET\n\nDear Elaine Ward,\n\nAs you know, I have been investigating your beneficiary claim resulting from the loss of Darnell Ward. We are sorry to inform you that after careful consideration and review, our investigation has revealed the cause of loss is not covered by the employee policy provided by Covalex Shipping.\n\nPersonal Life Policy 02107 02012000 notes the following exclusions under which benefits will not be paid if the loss:\n\n(A)\tresults from the Insured's alcoholism or addiction to drugs or narcotics; but not addiction which results from the administration of those substances in accordance with the advice and written instructions of a Licensed Health Care Practitioner.\n(B)\tresults from the Insured's participation in a felony, riot or insurrection, or involvement in an illegal occupation.\n\nThe preponderance of the evidence collected at Covalex Gundo Station and witness statements indicate that the insured was intoxicated to the point they he lost normal control of his mental and physical facilities and that this intoxication was a contributing cause of the accident.\n\nIt is against the law and considered a felony for an individual to cause the death of another by the operation of devices while under the influence of intoxicants. Even if there may be intervening factors between the fact of operation and the death of another. Felony exclusion makes no benefits payable. \n\nSince your claim was denied, you have the right to an internal appeal. You may request one by filling out a DCR-90 form. If you have questions regarding the information contained in this letter, please feel free to contact our claims department. \n\nSincerely,\n\nJessie Holzburg\n\nClaims Adjuster\nImperial General Insurance"
  },
  {
    "id": "journalentry.elaine_epilogue_innocent_transcript",
    "title": "Good News!",
    "author": "Elaine Ward",
    "category": "Investigation",
    "type": "Audio"
  },
  {
    "id": "journalentry.elaine_epilogue_innocent_bonus_transcript",
    "title": "Great News!",
    "author": "Elaine Ward",
    "category": "Investigation",
    "type": "Text",
    "body": "ELAINE WARD: I just wanted to let you know that the information you found worked. Covalex exonerated my husband and the insurance company gave me the full claim.\n\nOn top of all that, the Advocacy was able to arrest the people that Mel Ososky had been working with. It turns out there was a reward for information leading to the smuggling rings arrest and I want you to have it.\n\nI cannot express how much I appreciate the hard work you did on my behalf. It made all the difference. \n\nBest of luck of to you, and thanks for everything."
  },
  {
    "id": "journalentry.kiyomi_datapad",
    "title": "K.Santos - Recovered Data",
    "author": "Covalex Employee Datapad - Kiyomi Santos",
    "category": "Investigation",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n\nTo: \nFrom: Kiyomi Santos\nSub: Master Override Code\n>> UNSENT DRAFT\n\nHi Scott,\n\nWhile performing a routine security check on personal access codes for the sleeping pods, I noticed that Mel's access code is different than the one we have on file. I don't know if it was a holdover from the last shift or if she changed it without authorization, but went ahead and reset it to a new Unlock code (attached). \n\nDo you want to send the update to Corporate or should I? Also, I can remind Mel about our security policy if you want. Not sure how you prefer to handle this kind of stuff.\n\nBest,\n\nKiyomi\n\n**/[POD 3 - M.OSOSKY] UNLOCK CODE ATTACHED/**"
  },
  {
    "id": "journalentry.mel_secret_transcript",
    "title": "M.Ososky - Recovered Comm",
    "author": "Personal Datapad - Mel Ososky",
    "category": "Investigation",
    "type": "Dialogue"
  },
  {
    "id": "journalentry.mel_datapad",
    "title": "M.Ososky - Recovered Data",
    "author": "Covalex Employee Datapad - Mel Ososky",
    "category": "Investigation",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n\n/**MESSAGE_01**/\n\nTo: Gundo Station Staff\nFrom: Covalex Security\nSubject: EMPLOYEE NOTICE - New Scan Protocols\n2945.08.20.09:23SET\n\nRecently, there has been an increase in contraband and black market activity in the Stanton System. The Advocacy and Crusader Industries Security forces have reached out and asked for Covalex Shipping's help in curtailing such activities.\n\nAs many of you know, Covalex Shipping has a long history in helping authorities eliminate the transport of illegal goods. As such, starting this week, all cargo moving through Covalex Shipping centers in Stanton will be subject to heightened scan protocols and security measures. Training vids and procedure manuals are being circulated and are also available on the intraspec under Covalex>Security>Stanton.\n\nYour help in this important matter is greatly appreciated. If you have any questions please contact myself or your supervisor.\n\nWorking together, we can deliver a difference.\n \nSincerely,\n\nSashi Michaels, Chief Security Officer\nCovalex Shipping - Stanton\n\n/**MESSAGE_02**/\n\nTo: Mel Ososky\nFrom: Astro Armada Sales Team\nSubject: Plan-And-Fly Service\n2945.08.15.08:54SET\n\nTo Ms. Ososky,\n\nThank you for visiting Astro Armada's Plan-And-Fly service. The custom Freelancer you designed has a build-time of four weeks based on the options chosen.\n\nPlease contact our sales office if you would like to put down a payment and get the ball rolling.\n \nBest regards,\n \nSean Halloway\nSenior Sales Associate\nAstro Armada Branch 334\nArea18/ArcCorp/Stanton"
  },
  {
    "id": "journalentry.ross_datapad",
    "title": "R. Biollo – Recovered Comm",
    "author": "Covalex Employee Datapad – Ross Biollo",
    "category": "Investigation",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n/**Comm_Transcription**/\n\nTo: Road_Roller\nFrom: Ross Biollo \nRE: Thank You Gift\n2945.08.23.14:03SET\n\nLove them! Can you do me a favor and drop them off in my bunk? I've attached the code so you can get in.\n\n**/[POD 5 - R.BIOLLO] UNLOCK CODE ATTACHED/**\n\n>To: Ross Biollo\n>From: Road_Roller\n>SUBJECT: Thank You Gift\n>2945.08.23.13.58SET\n>\n>Hey Ross,\n>Got you a little something for all your help. Hope you like smoking Moores! \n>Where should I put them?\n>\n>-RR\n\n//**TRANSCRIPTION_END**//"
  },
  {
    "id": "journalentry.racine_transcript",
    "title": "R.Chodary - Recovered Comm",
    "author": "Covalex Employee Datapad - Racine Chodary",
    "category": "Investigation",
    "type": "Dialogue"
  },
  {
    "id": "clovus_clue_02",
    "title": "RE: Unable to Open Safe",
    "author": "-FAILED TO SEND MESSAGE-\\nThe code to open the safe is 459256",
    "category": "Investigation",
    "type": "Text",
    "body": "-FAILED TO SEND MESSAGE-\nThe code to open the safe is 459256"
  },
  {
    "id": "clovus_ending_bad",
    "title": "RE: Unable to Open Safe",
    "author": "-FAILED TO SEND MESSAGE-\\nThe code to open the safe is 459256",
    "category": "Investigation",
    "type": "Text"
  },
  {
    "id": "clovus_ending_good",
    "title": "RE: Unable to Open Safe",
    "author": "-FAILED TO SEND MESSAGE-\\nThe code to open the safe is 459256",
    "category": "Investigation",
    "type": "Text"
  },
  {
    "id": "journalentry.drop_datapad",
    "title": "RedSand - Recovered Comm",
    "author": "The Drop Datapad - RedSand",
    "category": "Investigation",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n/** LOCK CODE ACCEPTED **/\n\nTo: Mel Ososky\nFrom: RedSand\nSubject: Laundry Stain\n\nHey Mel,\nI know we were supposed to do a few more drops, but the timeline has escalated. Ladybird got grabbed up yesterday and Hundo swears she was followed on her last run. It’s only a matter of time before they trace the full network. No choice but to cut clean and drift. Boss wants you to abandon Covalex and head to the current stash. Need all hands if we’re going to walk away with credits earned. \n\n-RedSand\n\n/** ATTCH: stash.coordinates  **/"
  },
  {
    "id": "journalentry.scott_transcript",
    "title": "S.Hammell - Recovered Comm",
    "author": "Covalex Employee Datapad - Scott Hammell",
    "category": "Investigation",
    "type": "Dialogue"
  },
  {
    "id": "journalentry.scott_datapad",
    "title": "S.Hammell - Recovered Data",
    "author": "Covalex Employee Datapad - Scott Hammell",
    "category": "Investigation",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n\nANNUAL EMPLOYEE REVIEWS - WIP \n\nRoss Biollo Notes: \n- Has developed a strong rapport with the haulers which can be good and bad. \n- Needs to make sure that professionalism isn't lost completely. \n- Two citations this year for the not properly logging crates. Needs to be more detail focused. One more strike? \n- Does a lot to help maintain crew morale. \n\nDarnell Ward Notes: \n- Was a little abrasive at first when he came back, but has settled back into a solid routine. Once in a while still have to remind him about watching his attitude. \n- Punctuality problems seemed to have gone away. Has been on time regularly for past 3 months. \n- Keeps personal space clean. \n- Can sometimes be too diligent in trying to figure out a problem. Over thinks things sometimes which means tasks can take a little longer than expected. \n- Also can lead to taking unnecessary risks. \n- Very proactive though. Will address issues without needing to be told to do so. \n\nNico Theolone Notes: \n- Very focused. \n- Gets job done. \n- Figure out how to mention deodorant thing??? \n\nKiyomi Santos Notes: \n- So far so good. Seems to be stepping into the position well. \n- Good attitude. \n- Reports could be a little cleaner. Have noticed a few typos and errors. Simple things. Should take the time to double check before filing. \n- Schedule rotation suggestion was a good one. \n- Possible candidate for advanced training \n\nMel Ososky Notes: \n- Needs to be more mindful of using mobiGlas during work hours. \n- Has helped to improve the distro rate. Moving more crates through thanks to oversight on the cargo manifests. \n- Can be territorial with responsibilities. Needs to be more willing to let others help. \n\nSelf Eval Notes: \n- Need to be better about respecting that personal hours. I have sometimes taken advantage of employees living onsite and it can blur the lines between on and off hours. Downtime is important. \n- Profits have exceeded the 3% growth mandated by Covalex, in large part to my management. \n- Employee retention has increased. Turnover rate has significantly dropped. \n- Need to be better about following up on things earlier. Don't assume employees are tracking deadlines."
  },
  {
    "id": "journalentry.server_data",
    "title": "Server Log",
    "author": "Covalex Station Gundo: Server Archives",
    "category": "Investigation",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n\nCSHSCG--GUNDOSERVER_BLUEHEART:\\\\> Get-ArchiveLog -NameSpace root\\\\systemcheckSNS -List -AllSpaces dc1 : ObjectMarker { $_.dnn -notmatch \"__\" }\nADL_ElectricalSystemCheck/auto {GH 09.7 norm, BT 13.5,,,}\nADL_LifeSystemCheck/auto {CAa 126 norm, jL .007,,,}\nADL_PressureSystemCheck/auto {PB 1002 norm, SvS 01,,,}\nADL_DataSystemCheck/auto {mast allGreen norm, kbb 9999,,,}\nADL_ScannerSweep/auto {resultsfiled-all $-log}\nADL_ElectricalSystemCheck/auto {GH 09.6 norm, BT 14.1,,,}\nADL_LifeSystemCheck/auto {CAa 151 norm, jL .007,,,}\nADL_PressureSystemCheck/auto {PB 0986 norm, SvS 01,,,}\nADL_DataSystemCheck/auto {mast allGreen norm, kbb 9998,,,}\nADL_ScannerSweep/auto {resultsfiled-all $-log}\nADL_ElectricalSystemCheck/auto {GH 09.7 norm, BT 13.9,,,}\nADL_LifeSystemCheck/auto {CAa 146 norm, jL .007,,,}\nADL_PressureSystemCheck/auto {PB 1013 norm, SvS 01,,,}\nADL_DataSystemCheck/auto {mast allGreen norm, kbb 9999,,,}\nADL_ScannerSweep/auto {resultsfiled-all $-log}\n\nRUNPROTOCOL stresstest_v3.dnn AUTHORIZE:dward ...\nADL_ElectricalSystemCheck/auto {GH 09.9 alert, BT 16.1,,,}\nADL_LifeSystemCheck/auto {CAa 126 norm, jL .007,,,}\nADL_PressureSystemCheck/auto {PB 1002 norm, SvS 01,,,}\nADL_DataSystemCheck/auto {mast allGreen norm, kbb 9999,,,}\nADL_ScannerSweep/auto {resultsfiled-all $-log}\nADL_ElectricalSystemCheck/auto {GH 11.3 alert, BT 21.2,,,}\nADL_LifeSystemCheck/auto {CAa 126 norm, jL .007,,,}\nADL_PressureSystemCheck/auto {PB 1002 norm, SvS 01,,,}\nADL_DataSystemCheck/auto {mast allGreen norm, kbb 9999,,,}\nADL_ScannerSweep/auto {resultsfiled-all $-log}\n\nRUNPROTOCOL all_monitor_silence.dnn AUTHORIZE:dward ...\nADL_ElectricalSystemCheck/silent\nADL_LifeSystemCheck/silent\nADL_PressureSystemCheck/silent\nADL_DataSystemCheck/silent\nADL_ScannerSweep/silent\nADL_ElectricalSystemCheck/silent\nADL_LifeSystemCheck/silent\nADL_PressureSystemCheck/silent\nADL_DataSystemCheck/silent\nADL_ScannerSweep/silent\nADL_ElectricalSystemCheck/silent\n***WARNING POWER SYSTEM OVERHEATING***\n\nADL_ElectricalSystemCheck/silent\n***WARNING POWER SYSTEM OVERHEATING***\n\nADL_ElectricalSys-\n***ALERT POWER SYSTEM OFFLINE***\n***ALERT DECOMPRESSION DETECTED***\n***SYSTEM FAILURE***\n***SYSTEM FAILURE***\n///..."
  },
  {
    "id": "journalentry.elaine_conclusion_innocent_transcript",
    "title": "Thank You",
    "author": "Elaine Ward",
    "category": "Investigation",
    "type": "Audio"
  },
  {
    "id": "clovus_clue_01",
    "title": "Unable to Open Safe",
    "author": "Unable to open to safe door please send code",
    "category": "Investigation",
    "type": "Text",
    "body": "Unable to open to safe door please send code"
  },
  {
    "id": "journalentry.crew_member_06",
    "title": " K. Tyler - Recovered Comm",
    "author": "Aviar Employee Datapad - Keyon Tyler",
    "category": "Ship Logs",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n/**Comm_Transcription**/\n\nTo: Keyon Tyler\nFrom: Matias Devi\nSubject: Request\n\nMr. Tyler,\n\nOver the previous few months, I’ve been tracking the progress you and Patricia Sarafian have been making in the Stanton System on behalf of Avivar. I don’t have to tell you how important it is for the company that our expansion into the system succeeds. \n\nWith that in mind, I must say that I have my concerns over how Ms. Sarafian is handling the situation. One of my main problems in making an educated assessment is a lack of good information. Ms. Sarafian, despite a number of subtle and not to subtle requests, only submits her required weekly report for me to review. \n\nThat’s where I was hoping you could come in. For here forward, I need you to provide me with a day-by-day accounting of Avivar’s happenings in the system without informing Ms. Sarafian that you are doing so. I reviewed your personnel file and see that you have been an excellent Avivar employee over the years. Since you have been so good to us, you can expect Avivar to be good to you for your assistance and discretion in this matter. \n\n-\tMD \n\n//**TRANSCRIPTION_END**//"
  },
  {
    "id": "journalentry.crew_member_02",
    "title": "A. Freund - Recovered Comm",
    "author": "Freund Family Fuel Employee Datapad - Adena Freund",
    "category": "Ship Logs",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n/**Comm_Transcription**/\n\nTo: Adena Freund\nFrom: Christina Clark\nSubject: I’m done\n\nSeriously, screw you guys. Three runs. I’ve done three runs for you and still haven’t gotten paid. You aren’t the only ones with debts to pay and while this may be your family business, it sure as hell isn’t mine.  \n\nMaybe if you guys actually made sure your clients paid on time this wouldn’t happen. More than once I’ve seen Jameis tell clients to pay him whenever it’s convenient. Guess I shouldn’t be surprised this happened. Freund Family Fuel may be fine with doing a hard day’s work and not getting paid, but the hell if I am. I’ll be filing a breach of contract or lost wages complaint or whatever the hell they’re called against you both the second I’m off this tub. \n\n\n//**TRANSCRIPTION_END**//"
  },
  {
    "id": "journalentry.crew_member_07",
    "title": "C. Clark - Recovered Comm",
    "author": "Aviar Employee Datapad - Christina Clark",
    "category": "Ship Logs",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n/**Comm_Transcription**/\n\nTo: Christina Clark\nFrom: Adena Freund\nSubject: Guess what?\n\nChristina … I know it’s you, and I have the dates to prove it. Bet you think it was so slick of you to sell info on our operations to Avivar. Don’t think I’m going to let you get away with it either. You best watch your back, because one day you’ll turn around and see me standing there. Then you’ll have to answer for what you did to me and my family. \n \nConsider this comm a courtesy. Stop shelling out info on us to Avivar, and get out of Stanton as fast as you can. ‘Cause if we ever cross paths, it won’t end well for you.      \n//**TRANSCRIPTION_END**//"
  },
  {
    "id": "journalentry.starfarer_2_blackbox",
    "title": "Emergency Flight Data (EDR-163F3)",
    "author": "Ship RegTag #ST3L-309T0U  / Aviar",
    "category": "Ship Logs",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n/**EDR_Transcription**/\n\n16:52:39 [GUNNER CHRISTINA CLARK] We’ve been sitting here for almost two hours. What’s going on Cap? \n\n16:52:44 [CAPTAIN PATRICIA SARAFIAN] Shouldn’t be much longer.\n\n16:52:50 [GUNNER CHRISTINA CLARK] Uh huh.\n\n16:55:03 [SCANNER DETECTS OBJECT IN DISTANCE]\n\n16:55:05 [CAPTAIN PATRICIA SARAFIAN] Scans just picked up something. You see it, Keyon? Swing us in that direction while I focus in.\n\n16:55:08 [PILOT KEYON TYLER] I’m on it. \n\n16:55:13 [PILOT KEYON TYLER] Walsh, where’d you disappear to? Need you at the shield station, pronto.\n\n16:55:19 [MISC CREW GALEN WALSH] On my way. Something I ate last night didn’t quite agree with me.\n\n16:55:23 [SCANS IDENTIFY STARFARER WITH ‘FREUND FAMILY FUEL’ REG-TAG]\n\n16:55:24 [CAPTAIN PATRICIA SARAFIAN] This is them. Kill all non-essential chatter. Bring us in good and close.  \n\n16:55:28 [PILOT KEYON TYLER] Copy that.\n\n16:55:30 [GUNNER CHRISTINA CLARK] Hey, am I reading these scans right? Is that Freund Family Fuel?\n\n16:55:34 [CAPTAIN PATRICIA SARAFIAN] I said cut the chatter. \n\n16:55:37 [GUNNER CHRISTINA CLARK] What are they doing here?\n\n16:55:42 [CAPTAIN PATRICIA SARAFIAN] That’s not your concern. \n\n16:55:45 [GUNNER CHRISTINA CLARK] But Cap--\n\n16:55:46 [CAPTAIN PATRICIA SARAFIAN] I said don’t worry about it. \n\n16:55:54 [CAPTAIN PATRICIA SARAFIAN] Walsh? I need you here now!\n\n16:55:57 [MISC CREW GALEN WALSH] Almost there …\n\n16:55:58 [SCANS PICK UP SUDDEN INCREASED HEAT SIGNATURE FROM STARFARER WITH ‘FREUND FAMILY FUEL’ REG-TAG]\n\n16:55:59 [PILOT KEYON TYLER] Woah … anyone else catch that sig spike? What the … incoming fire! \n\n16:56:00 [GUNNER CHRISTINA CLARK] I knew this was a trap. Giving ‘em everything I got. \n\n16:56:02 [CAPTAIN PATRICIA SARAFIAN] Walsh … \n\n16:56:03 [PILOT KEYON TYLER] We’re too close --\n\n16:56:04 [FRONT SHIELD DEPLETED] \n\n //**TRANSCRIPTION_END**//"
  },
  {
    "id": "journalentry.starfarer_1_blackbox",
    "title": "Emergency Flight Data (EDR-7D093)",
    "author": "Ship RegTag #SC4V-L8212R / Freund Family Fuel",
    "category": "Ship Logs",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n/**EDR_Transcription**/\n\n16:54:24 [CAP. JAMEIS FREUND] Adena, sending you coordinates. Make sure we quantum in just shy so we can run some scans and approach cautiously.\n\n16:54:36 [PILOT ADENA FREUND] That’s the middle of nowhere. What are we looking for?\n\n16:54:41 [CAP. JAMEIS FREUND] Just get us there. Then I’ll explain everything. \n\n16:54:45 [PILOT ADENA FREUND] Jeez, fine. Don’t need to bite my head off. Just thought it might be good to for the pilot to know what we’re getting into. \n\n16:54:55 [PILOT ADENA FREUND] Quantum complete.\n\n16:55:14 [CAP. JAMEIS FREUND] Proceed to the coordinates while I run some scans. \n\n16:55:19 [PILOT ADENA FREUND] Enough with the all the mystery, J. You finally gonna tell me what this is all about?\n\n16:55:23 [SCANS IDENTIFY STARFARER WITH ‘AVIVAR ALLIANCE’ REG-TAG] \n\n16:55:25 [PILOT ADENA FREUND] The hell are they doing here? Kid, you in the turret? We got some unwanted company up ahead.\n\n16:55:27 [GUNNER SIMON TOTLAND] In position and tracking the ship.  \n\n16:55:30 [CAP. JAMEIS FREUND] Everyone, calm down. We’re here to meet them. \n\n16:55:34 [PILOT ADENA FREUND] The hell you talking about, Jameis? Why are we meeting the buggers that’ve been stealing our clients?\n\n16:55:40 [CAP. JAMEIS FREUND] They just want to talk about ....\n\n16:55:41 [PILOT ADENA FREUND] This is why you wouldn’t tell me where we’re going. We got nothing to say to these scumbags.\n\n16:55:45 [MECHANIC TY MOYO] (unintelligible) from the power plant. \n\n16:55:48 [CAP. JAMEIS FREUND] Hey, Ty. You dropped out at the start there. Can you repeat?\n\n16:55:51 [PILOT ADENA FREUND] Avivar’s done nothing but attack our business since they showed up in system. For all we know they’re here to finally wipe us out, pushing shields to max.\n\n16:55:54 [CAP. JAMEIS FREUND] Adena, wait. Ty, can you repeat what you just said?\n\n16:55:55 [POWER TO SHIELDS INCREASED]\n\n16:55:58 [POWER PLANT WARNING — OVERHEAT CRITICAL DAMAGE]\n\n16:55:59 [EMERGENCY SIRENS TRIGGERED]\n\n16:56:00 [GUNNER SIMON TOTLAND] We’re under attack! Opening fire! \n\n16:56:03 [CAP. JAMEIS FREUND] Hold your fire.  \n\n16:56:04 [PILOT ADENA FREUND] I’ve got —\n//**TRANSCRIPTION_END**//"
  },
  {
    "id": "journalentry.crew_member_08",
    "title": "G. Walsh - Recovered Comm",
    "author": "Aviar Employee Datapad - Galen Walsh",
    "category": "Ship Logs",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n/**Comm_Transcription**/\n\nTo: Summer Davis\nFrom: Galen Walsh\nRE: 3rd Draft Revisions \n\nSummer, I think I figured it out. I was just on the bridge for the last few hours, bored outta my mind, and it hit me like a lightning bolt. Had to sneak away so I could get this idea to you before I forgot it. \n\nWhat if, at the end of the party scene, we reveal the ship has a smuggler’s compartment that Hector didn’t know about. So he’s had the magical relic on board the entire time. That’s why the pirates don’t want to damage the ship and destroy what’s onboard. \n\nPlus, it gives ‘em a reason to board the ship and take him hostage instead of blowing him out of the sky. Then we can keep that scene we love where he’s locked in that cell and ...\n\nI gotta run. Cap keeps yelling for me over comm. But you get the idea, right? Roll that around in your mind for a bit, and I’ll call you the second Cap gets off my back. \n\n//**TRANSCRIPTION_END**//"
  },
  {
    "id": "journalentry.crew_member_01",
    "title": "J. Freund - Recovered Comm",
    "author": "Freund Family Fuel Employee Datapad - Jameis Freund",
    "category": "Ship Logs",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n/**Comm_Transcription**/\n\n[Comm set to auto-send at 18:00:00]\n\nTo: Adena Freund\nFrom: Jameis Freund\nSubject: I’m sorry\n\nHey, Adena… if I know you at all, you’re probably not talking to me.\n\nFirst, I’m sorry I didn’t tell you about the meeting with Avivar. I knew you’d be against talking to them, but I couldn’t risk it not happening. You have every right to be angry at me for keeping it from you, but you know how you get sometimes. Honestly, I don’t know how to handle you when you get all worked up. You’ve been that way since we were kids. Remember that incident with Mom’s Cutlass? Guess I wanted to avoid all that drama until everything was official. \n\nSee... dammit, it’s hard to admit this to you ... Freund Family Fuel is running deep in the red and I don’t see a way out. I did… I did everything I could to try and find a way out, put the house up as collateral for a loan… but nothing worked. Just dumb luck I guess. \n\nSelling to Avivar is our only option to stay flying with some creds in our pockets and a shred of dignity. I know you’d argue with all your heart against it, but you don’t know the numbers like I do. This system’s a different place since Dad started all of this. Dad never had to hire a full time turret gunner for protection. Competition’s grown so fierce that the low fuel prices can’t cover our skyrocketing costs. At least if we operate under Avivar’s banner we’ll have some support during these tough times. The business may not be in our name after this, but it’ll still be ours.\n\nI know you hate me right now, but just remember that, as your brother, I love you and only want to do what’s best for all of us. Well, whenever you’re ready to talk, I’ll be here.\n\n-\tJ     \n\n//**TRANSCRIPTION_END**//"
  },
  {
    "id": "journalentry.crew_member_05",
    "title": "P. Sarafian - Recovered Comm",
    "author": "Aviar Employee Datapad - Patricia Sarafian",
    "category": "Ship Logs",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n/**Comm_Transcription**/\n\nTo: Matias Devi\nFrom: Patricia Sarafian\nSubject: Status Report\n\nHi, Mr. Devi, it’s Patricia with my weekly check-in. This has been a good week for Avivar in the Stanton System. I closed that contract I was telling you about last week. Had to cut them a deal, but like you say, once they experience Avivar’s amazing service, we’ve got ‘em for good. That gives us three in the system. A few more clients like this and we’ll be turning a profit in no time. \n\nIn other good news, I’ve been able to convince a local fuel concern, Freund Family Fuel, to meet with me about a possible buyout. They’ve been around for decades and have a number of primo contracts. I’ve drafted the offer so it allows them to operate under the Avivar name as long as they maintain our standards. Considering the state of their ship and employee records, it shouldn’t be hard to get rid of them following the first performance review. It’s their contracts that we really want. Not their aging Starfarer. Will let you know when I’m closing in on a deal so you can give it final approval. \n\nI know I’ve only been here a few months, but I see a lot of potential for Avivar in Stanton and have some big plans. Just give me the time and I’ll give you this system. \n\nI’ll be in touch next week. \n\n-\tPatricia    \n\n//**TRANSCRIPTION_END**//"
  },
  {
    "id": "journalentry.crew_member_03",
    "title": "S. Totland - Recovered Comm",
    "author": "Freund Family Fuel Employee Datapad - Simon Totland",
    "category": "Ship Logs",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n/**Comm_Transcription**/\n\nTo: Ben Totland\nFrom: Simon Totland\nRE: Checking in\n\nHey man,\n\nI got chewed out again today. Guess I didn’t get to the turret fast enough. Adena kept yelling at me that we’d all be dead if the ship was really under attack. \n\nBut it’s not like I was dragging my heels. I’ve just never been on a ship this size before. It’s so easy to get turned around on this thing. Almost feels like someone designed this ship specifically for people to get lost on.\n\nTy keeps telling me not to worry about it. He keeps reminding me that nobody’s first run goes smoothly. Told me yesterday that “the only way you learn is by living.” This would all be super overwhelming if he wasn’t here. Not to say it’s not nice to talk to you about these things too, but by the time the message reaches you and you have the time to respond, sometimes the moment’s passed.   \n\nHeard the Captain and his sister arguing again last night. I’m not sure if they realize how loud they are or maybe they don’t care. Had to crank up the volume on my mobi to drown them out, but then I got worried I’d miss a call to get to the turret, so I turned it back down. Still not sleeping very well. Every little bump wakes me up, then it takes forever to get back to sleep. \n\nAt least I’m making some creds and gaining some experience. Once I get paid, I’ll send a portion to Mom. Maybe now that both of us are working things will be a bit easier for her. Oh, did you ever find out how much experience deckhands need on your ship? How great would that be to work this same ship. Sure Mom would love it too. Both her boys, exploring the stars together. Just like she always dreamed. \n\nCrap … gotta run. Talk again soon, brother.   \n\n//**TRANSCRIPTION_END**//"
  },
  {
    "id": "journalentry.crew_member_04",
    "title": "T. Moyo - Recovered Comm",
    "author": "Freund Family Fuel Employee Datapad - Ty Moyo",
    "category": "Ship Logs",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n/**Comm_Transcription**/\n\nTo: Jameis Freund\nFrom: Ty Moyo\nRE: Ship Evaluation\n\nHey, Jameis. \n\nSo, I did what you asked. I’ve done a full assessment of the ship in its current state and come to a ballpark value. It … well, there’s a lot more work to be done around here than I first thought. I added about half a dozen other fixes to my punch list today... you know what, we should probably talk about this in person. That way I can explain how I got to my total. Fair warning, I don’t think you’ll be thrilled with the news.\n\nI know you told me to hold off on repairs for the time being, but I noticed something today that’s a little worrying. The power plant’s having power spikes under normal operations. Could be a busted regulator or something, but it’s best not to strain the system until I figure out what’s going on. Might have to do with those repairs I did to the shield genny the other day. Won’t know until I run a full diagnostic.\n\nAlso, I tweaked a few things on the turret for the kid. He wouldn’t stop complaining about how slow and unresponsive it was, so I made a few minor adjustments just to keep him quiet about it. Kid’s eager, and works his tail off, but he’s as green as they come.       \n\nOne last thing, I’ve been thinking about your last message, taking Avivar’s buyout seems like the best plan. Know your Dad wouldn’t be happy about it, but he’d understand.   \n\nOh, and tell your sister before you go through with it. She definitely won’t like it, but you owe her that much.  \n\n//**TRANSCRIPTION_END**//"
  },
  {
    "id": "journalentry.blackbox_05",
    "title": "Emergency Flight Data (EDR-41435)",
    "author": "Unknown Ship RegTag #EL4NE-67983",
    "category": "Black Box",
    "type": "Audio",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n/**EDR_Transcription**/\n\nJORDAN MUSCOVIC: To those that find this, know that though my journey has ended, it was finding my way here that made the path worth taking... I am glad that I could be part of your story too. Share it well and safe travels.\n\n/**End_Transcription**/"
  },
  {
    "id": "journalentry.blackbox_01",
    "title": "Emergency Flight Data (EDR-47392)",
    "author": "Ship RegTag #ST4OR-763538",
    "category": "Black Box",
    "type": "Audio",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n/**EDR_Transcription**/\n\nSEN HONDO: Crusader SHQ - This is pilot Hondo. Patrol Group 17's been ambushed. I think it's the Nine Tails. They had scan blocks. Didn't seem 'em till it was too late. Taking heavy damage. It's not good. I've lost power to thrusters 3 and 4. Shit 6 is gone. I'm not going to be able to-  \n\n/**End_Transcription**/"
  },
  {
    "id": "journalentry.blackbox_06",
    "title": "Emergency Flight Data (EDR-47826)",
    "author": "Unknown Ship RegTag #CR2AL-243123",
    "category": "Black Box",
    "type": "Audio",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n/**EDR_Transcription**/\n\nCASEY VANDALUSA: Hey Jenny, think you could head on back and whip us up a cup of something hot? I am about to pass- <beep> Got a contact. Multiples. Let’s see what their regs say... Not coming up. Forget the drink, I need you on shields, now. <gunfire impact=\"\">\n<alarms>\n<ship alerts=\"\">\n\n/**End_Transcription**/\n<beep> <gunfire impact=\"\"><alarms><ship alerts=\"\"></ship></alarms></gunfire></beep></ship></alarms></gunfire></beep>"
  },
  {
    "id": "journalentry.blackbox_02",
    "title": "Emergency Flight Data (EDR-48172)",
    "author": "Ship RegTag #SL3PR-82343",
    "category": "Black Box",
    "type": "Audio",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n/**EDR_Transcription**/\n\nERIN DEMETER: Damn it. Damn it. It was a scythe. You hear me, Donny? A damn scythe. Thought it was one of the converted jobs. Some hotshot showing off. But it was 'duul. Thing flew at me like like - like - shit. I barely got a shot off... Donny, do right by me okay? \n\n/**End_Transcription**/"
  },
  {
    "id": "journalentry.blackbox_04",
    "title": "Emergency Flight Data (EDR-797522)",
    "author": "Ship RegTag #RE2PS-27391",
    "category": "Black Box",
    "type": "Audio",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n/**EDR_Transcription**/\n\nDANNY COLLINS: Day seventy-three. Very excited to be coming up to Crusader. Ever since the jump point, I've been working out a rough schedule of what to visit. By my estimation, I can sightsee for four hours if I want to keep my schedule for the rest of the system. <pause> That's weird... just got an alert that says an airlock was triggered... I swear the new operating system is designed to not work with these older models. Anyway, still undecided about whether to visit Hurston or not. Place is already kinda-\n\nUNIDENTIFIED: Kinda scary?\n\n/**End_Transcription**/\n<pause><bang></bang></pause></pause>"
  },
  {
    "id": "journalentry.blackbox_03",
    "title": "Emergency Flight Data (EDR-83376)",
    "author": "Ship RegTag #VA2ET-72853",
    "category": "Black Box",
    "type": "Audio",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n/**EDR_Transcription**/\n\nRYAN PARTHI: Mayday, mayday. If anyone can hear me, my convoy was hit while in transit. Bastards had taken out the array so we couldn't get out a proper distress. They shot up my ship and vented the others... vented them like they were nothing. They're dragging my ship somewhere. Guess they thought they killed me. I'm sending out a low pulse distress, hopefully they won't pick it up. If you're in the area. Please, help.\n\n/**End_Transcription**/"
  },
  {
    "id": "soo_admin",
    "title": "Party Supplies - Admin",
    "category": "Siege of Orison",
    "type": "Text",
    "body": "CHAT NAME: \nParty Supplies - Admin\n\nCHAT MEMBERS:\nRen\nStax\n\nRen [12:53]: \nHere's your code, Stax.\nRen [12:53]: \n~mission(VeryHardCode)\n\nStax [12:54]: \nThanks, Mendo. How you feeling?\n\nRen [12:56]: \nI give us solid odds. The plan is as good as they come and the IFFI tech's impressive. Only question is if we got the right people to pull it off.\n\nStax [12:57]: \nIs this about me bailing for that stormwal tour?\n\nRen [12:58]: \nCome on, man. You know I didn't mean you.\n\nStax [13:01]: \nYeah, I know. Anything I can do?\n\nRen [13:03]: \nNah, I'm all set. You can just focus on the Admin Center. It's good knowing that I got you keeping an eye on things for me down there.\n\nStax [13:04]: \nHere to help, you know.\n\nRen {13:07]: \nHow was the tour?\n\nStax [13:08]: \nShit was crazy. Saw two of them out there in the last second.\n\nRen [13:09]: \nCrazy.\n\nStax [13:10]: \nYeah, yeah, I know you don't give a shit.\n\nRen [13:12]: \nLet's get through this and maybe I'll start.\n\nStax [13:12]: \nDeal.",
    "missionSpecific": true
  },
  {
    "id": "soo_brushwood",
    "title": "Party Supplies - Brushwood",
    "category": "Siege of Orison",
    "type": "Text",
    "body": "CHAT NAME: \nParty Supplies - Brushwood\n\nCHAT MEMBERS:\nRen\nScorch\n\nRen [13:39]: \n~mission(MediumCode)\nRen [13:41]: \nHere's your code. Now, I want you focused on keeping Brushwood safe and those AAs gunning. \n\nScorch [13:52]: \nYeah, fine. \n\nRen [13:53]: \nWe're not going to have a problem are we? I don't need another Della happening today.\n\nScorch [13:55]: \nLast time I checked, Nine Tails still got paid for the Della.\n\nRen [13:57]: \nThat was a rain drop in the ocean compared to this job. Which is why I need you focused. We clear?\n\nScorch [14:04}: \nSure. Whatever you say, Mendo.",
    "missionSpecific": true
  },
  {
    "id": "soo_hartmoore",
    "title": "Party Supplies - Hartmoore",
    "category": "Siege of Orison",
    "type": "Text",
    "body": "CHAT NAME: \nParty Supplies - Hartmoore\n\nCHAT MEMBERS:\nRen\nN_Acker\n\nRen [13:16]: \nHere's the code for the containers. \nRen [13:16]: \n~mission(HardCode)\n\nN_Acker [13:18]: \nThanks.\n\nRen [13:19]: \nYou ready for this?\n\nN_Acker [13:21]: \nYeah, sure. Why wouldn't I be? \n\nRen [13:22]: \nJust want to make sure that we'll have enough cover to get the job done.\n\nN_Acker [13:27]: \nNot sure what you're getting so worked up about. With us owning the skies, it all seems pretty straight forward to me.\n\nRen [13:28]: \nRight. Let's just keep on task and not get creative.\n\nN_Acker [13:30]: \nThis again? I keep telling you, mate. If you want to scare people, you gotta do some scary shit.\n\nRen [13:32]: \nIs that what you call gutting Hender's whole family one by one?\n\nN_Acker [13:34]: \nLook, I get it. You don't like getting your hands dirty. Fine. But how about you worry about doing your job and stay the hell out my business. \n\nRen {13:36]: \nMy job is making sure you do yours. That's why I got picked to run things and not you. Don't forget it.\n\nN_Acker [13:39]: \nYeah… I won't.",
    "missionSpecific": true
  },
  {
    "id": "soo_solanki",
    "title": "Party Supplies - Solanki",
    "category": "Siege of Orison",
    "type": "Text",
    "body": "CHAT NAME: \nParty Supplies - Solanki\n\nCHAT MEMBERS:\nRen\nPhoenix\n\nRen [14:07]: \nHere's the code for the containers on your platform.\nRen [14:07]: \n~mission(EasyCode)\n\nPhoenix [14:08]: \nHell yeah! Crusader's gonna be kipo surprised when we take over.\n\nRen [14:14]: \nKipo?\n\nPhoenix [14:15]: \nYou know, like really surprised.\n\nRen [14:21]: \nWhatever. Just focus on doing your part and everything should be fine.\n\nPhoenix [14:22]: \nNo worries, boss. I'll keep 'em busy enough to get the job done. Doesn’t matter how many times they regen me\n\nRen [14:25]: \nWe talked about this. It's better if you don’t need a regen. \n\nPhoenix [14:28]: \nYeah, yeah. Aces\nPhoenix [14:33]: \nBut if I do regen, you remember you swore to get my armor, right?\nPhoenix [14:39]: \nRight?\n\nRen [14:41]: \nDon't die and I won't have to.",
    "missionSpecific": true
  },
  {
    "id": "soo_barge",
    "title": "Pressley Party Supplies",
    "category": "Siege of Orison",
    "type": "Text",
    "body": "CHAT NAME: \nPressley Party Supplies\n\nCHAT MEMBERS:\nRen\nACR1234\n\nACR1234 [12:24]: \nHere.\nACR1234 [12:24]: \n~mission(bargeCode)\n\nRen [12:26]: \nThanks for the codes.\n\nACR1234 [12:30]: \nHow's it looking over there?\n\nRen [12:34]: \nEverything is set up. Expect things to kick off on schedule.\n\nACR1234 [12:37]: \nGood luck.\n\nRen [12:39]: \nWho needs luck? Those IFFIs are impressive bits of tech. Thanks for the hookup. \n\nACR1234 [12:43]: \nGlad you like the new toys. Onto business, that special package I prepped for you should match pretty seamlessly with their system.\n\nRen [12:46]: \nNo doubt. I'll let you know once the transfer's complete.",
    "missionSpecific": true
  },
  {
    "id": "journalentry.missingbennysdatapad_01",
    "title": "CASEFILE #232131089 VENDING MACHINE THEFT",
    "author": "ISSUING OFFICER: M. Trovitz",
    "category": "Missing Bennys",
    "type": "Text",
    "body": "LAST UPDATED: 2945-03-21_16:44SET\n\nOn 2945-03-03 we received our first report of missing BIG BENNY brand vending machines from the Port Olisar commuter hub station. Alby Mollion, the on call manager, explained that a TERRA MILLS SERVICE TECHNICIAN had come to repair the machine and informed him that it would have to be taken to an offsite center. The following week, shift supervisor Tony Losong contacted Terra Mills Service Center to inquire about the repair only to learn that the so-called service technician had not in fact been associated with the company. It was at this point that Crusader Security was contacted by the Port Olisar administrators to look into the matter. Security vids pulled from the station’s feed captured the suspect leaving with the machine in question but so far, facial match has been a dead end. It is surmised that the suspect was wearing spoofs, faux-vis, or some combination thereof. Attempts to track the suspect’s transport also proved futile as the regtags were traced back to a decommissioned hauler. \n\nOn 2945-03-05, we received a second report from CryAstro station 1267SC where their Big Benny unit was also taken under the guise of repair. Not long after, dozens of similar reports from other stations around the Crusader sector began to trickle in, stating that a false Terra Mills technician had removed their Big Benny machines. Those separate reports were vetted and indexed under this main casefile once the connection was confirmed. \n\nIn the meanwhile, we have been working with Terra Mills to issue a general warning to all Big Benny machine owners to be on the lookout for unscheduled service technicians and that they should always demand to see credentials. An image of the suspect has likewise been circulated. However, since 2945-03-12 there have been no further reports.\nIn attempt to track down the culprit we have notified scrap yards and secondhand sellers to alert us if someone tries to offer a Big Benny unit for sale. We have also tasked Terra Mills with tracing unusual refill orders surmising that the stolen machines may eventually require more Kacho to be stocked. \n\n**EDIT 2945-03-21 ** We did have a possible hit on the VSS we put out on the suspect’s transport, but reached a dead end after we lost the trail near Grim HEX. We currently don’t have the resources to investigate directly, but I have put in a request for a CI to follow up."
  },
  {
    "id": "journalentry.missingbennysdatapad_aboveandbeyond",
    "title": "CRUSADER – ABOVE AND BEYOND",
    "author": "Crusader Visitor Information Center",
    "category": "Missing Bennys",
    "type": "Text",
    "body": "Millions of people from around the Empire come to visit Crusader every year. From stunning vistas planetside to a bevy of unique and memorable locations in the surrounding environs, there’s plenty of reasons why Crusader is considered by many to be “Above and Beyond.”\n\nWhat better way to explore the grand expanses of the Crusader than by riding aboard a Genesis Starliner that was built planetside by Crusader Industries. These luxurious cruise ships offer tours of not only the gorgeous upper atmosphere of Crusader proper, but offer a myriad of options and destinations. Why not start with a sunset tour to see a Genesis being built right before your eyes in the beautiful latticework of Crusader Industries; expansive shipyards? From there you can cruise along to the lower atmosphere to experience the colorful cacophony of one of our famous “light storms” or head out into orbit to visit the beautiful icy moon of Yela. Named for the oldest sibling in the childhood favorite fairy tale “A Gift for Baba,” a visit to this frozen landscape will surely have all the makings of a tale of your own.\n  \nFor more information on tickets and timetables, or to learn more about places to see and visit during your stay, please contact the Crusader Visitor Information Center."
  },
  {
    "id": "journalentry.missingbennysdatapad_artist",
    "title": "INSTALLATION 3 – IDEATION JOURNAL",
    "author": "Personal Datapad - Dreams, Thoughts, and Inspiration",
    "category": "Missing Bennys",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n\n•\tRemember, this is a free flowing expression of your thoughts. Don’t hold back. Don’t edit. Be true and you will find truth.\n\n•\tImpact over substance or transformation over rehabilitation?\n\n•\tThe medium is part of discussion as much as the discussion itself is a medium of the art, but when that message overcomes the piece, is that the ultimate goal? Should the work stand or topple? Stop to ask ‘what if’ but make sure the remaining question is always why.\n\n•\tFound another critique - “Though the work is an assault on the space, there remains little bite behind the attack. The only kindness in the experience is that the all the leftover resin has been promised to a local art school. Hopefully it may find use as art yet.” This is what I need. This pain. \n\n•\tWhile I had some concerns at first, I am thrilled that my new hab is proving a fruitful ground for inspiration. Leaving the comfortable familiar behind and embracing the chaos of Grim HEX has been so cathartic I have begun to count losing all my credits as a blessing. \n\n•\tYou see these other artists who “make it.” Denara with his looms lapping up the critic’s praise, or Tamsa and her painted ships. Their embracing of the commercialization of art is the very poison that is destroying our souls. To expose how deep this commoditization of Humanity would be a true work of inspiration.\n\n•\tI watched an ambush today outside the base. It was thrilling and terrifying at the same time, but it was the aftermath that struck me the most. The silence after the predators had flown away, stripping the cargo of their prey, I found myself transfixed by the drifting hulk of the wreck. The twisted shapes losing all function and becoming pure form. Definitely a motif to be explored further. \n\n•\tI met a woman today who goes by the name Threetoe. She told me that if she was to die she’d want to be floated out in the asteroids by ‘the Big Sister.” She explained how her mother used to read the ‘A Gift for Baba’ to her growing up and she always related to the character. It amazes me the impact these stories of our youth can shape our very being. What replaces them as we grow older? The stories stop, but the need persists. What are the fairy tales that give us comfort now? The answer came to me as my thoughts were interrupted by cries of “So Yum, So Wow” from a nearby Big Benny’s machine. This is how the story of Humanity will be told. This corrupt consumerism will be the monument that we leave behind. \n\n•\tA monument for me to leave behind …"
  },
  {
    "id": "missingbennysdatapad_artistcorpse",
    "title": "THE GRAND UNVEILING",
    "author": "Musings on My Discovery",
    "category": "Missing Bennys",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n\nThe project is nearly finished. It's been a hard installation but the wonderful fatigue of my body is the most alive I have felt in months.  It took me all day, but I think I figured out how to fix the machine I've been having trouble balancing. Once I get that done, only two more to go. Nothing like overcoming challenges to reinvigorate the soul.\n\nI can feel in every essence of my being just how important this work will be.\n\nThe questions remains though, what is the best way to reveal this unprecedented work to humanity? Do I stay silent to allow the naturally curious be the chosen few, spreading the gospel of Benny until the masses descend upon the site eager to know real truth? Or do I anonymously message an art critic or two to help them along the way? \n\nIt is almost tempting to stay here and await their arrival just to see what their reaction will be."
  },
  {
    "id": "contestedzone_firerat_blessing",
    "title": "Blessing of the Sun",
    "category": "Contested Zones",
    "type": "Text",
    "body": "Today I was blessed by the Star’s Fire for the first time. \nI heard the Prophet’s voice in the pain. I now know what I must do.  \nMy soul burns and soon the flesh of my body will heal stronger than before. \nTo think of the years I wasted in darkness, ignoring the truth.  \nNo more. All must hear the Prophet or be silenced."
  },
  {
    "id": "contestedzone_pyam_horizon_screams",
    "title": "Couldn't Sleep",
    "category": "Contested Zones",
    "type": "Text",
    "body": "Those Fire Rat assholes inducted a new initiate when the flare hit yesterday. Could hear their screams all through the station. Actually thanked the prophet as their flesh sizzled. Won't be getting any rest now.\n \nWe keep helping where we can. Showing any who'll listen that you just gotta keep headin' to the next horizon. Fuck anybody who'd put you in chains, trying to tell you how to live your life.\n \nBut no matter how many of these sorry trods we free, Rat bastards keep managing to trick more people into joining their fucked up cult.\n \nWell, if they want to burn so bad, I'm gonna fuckin' make sure they burn."
  },
  {
    "id": "contestedzone_cannibal",
    "title": "Prophet's Prayer",
    "category": "Contested Zones",
    "type": "Text",
    "body": "Prophet who guides the lost,\nRemake our flesh with burning light, \nSo we may be delivered to glory."
  },
  {
    "id": "contestedzone_computervirus",
    "title": "Prophet's Prayer",
    "category": "Contested Zones",
    "type": "Text",
    "body": "Prophet who guides the lost,\nRemake our flesh with burning light, \nSo we may be delivered to glory."
  },
  {
    "id": "contestedzone_firerat_prayer",
    "title": "Prophet's Prayer",
    "category": "Contested Zones",
    "type": "Text",
    "body": "Prophet who guides the lost,\nRemake our flesh with burning light, \nSo we may be delivered to glory."
  },
  {
    "id": "contestedzone_xeno",
    "title": "Prophet's Prayer",
    "category": "Contested Zones",
    "type": "Text",
    "body": "Prophet who guides the lost,\nRemake our flesh with burning light, \nSo we may be delivered to glory."
  },
  {
    "id": "contestedzone_firerat_mom",
    "title": "Subject: Please Come Home",
    "category": "Contested Zones",
    "type": "Text",
    "body": "Dearest Mikal,\n\nI know that this is a long shot after what happened when Po tried to bring you home but believe me when I say no matter how many times you turn us away, we still want you back in our lives. Laura and I can’t even begin to understand how hard this last year’s been, but I promise you, these people are not the answer.\n\nPo said that these Fire Rats made you burn yourself? That doesn’t sound like something people who care about you would do. No matter what mistakes you’ve made, you are deserving of love and respect. I don’t think Aggie would’ve wanted you to be punishing yourself like this.\n\nI also have a bit of good news. I’ve been talking to Agent Maclan about your charges and they said that if you would be willing to share information about the other people who were with you on Aggie’s ship, then they might be able to cut you a deal.  \n\nBut we can talk about all that later, please just send us comm. It can even just be one word. We only want to know you’re okay. \n\nLove,\nMom"
  },
  {
    "id": "contestedzone_pyam_evacuate",
    "title": "SUBJECT: Transfer Volunteers",
    "category": "Contested Zones",
    "type": "Text",
    "body": "To All Engineering and Maintenance Staff:\n\nI hate to be writing this so soon after we lost Em, but we’re eager to have someone fill her spot in the Executive Hangar Maintenance team. The recent bout of flares have really been doing a number on the power systems there, with a couple of the comp-boards already fusing in place and the generators experiencing semi-regular system failures. We’ve done what we can to hold everything over until we can figure out a replacement, but we really need someone permanently on site at this point.\n\nNormally, we would just assign someone to the position, but in light of what happened to Emily, I thought it might be better to seek volunteers first. The executive board has approved tier 2 hazard pay for the role if that helps entice you.\n\nLet me know if you’re interested,\n\nSasha McKail\nChief of Station Engineering & Maintenance, Pyrotechnic Amalgamated"
  },
  {
    "id": "contestedzone_pyam_volunteers",
    "title": "SUBJECT: Transfer Volunteers",
    "category": "Contested Zones",
    "type": "Text",
    "body": "To All Engineering and Maintenance Staff:\n\nI hate to be writing this so soon after we lost Em, but we’re eager to have someone fill her spot in the Executive Hangar Maintenance team. The recent bout of flares have really been doing a number on the power systems there, with a couple of the comp-boards already fusing in place and the generators experiencing semi-regular system failures. We’ve done what we can to hold everything over until we can figure out a replacement, but we really need someone permanently on site at this point.\n\nNormally, we would just assign someone to the position, but in light of what happened to Emily, I thought it might be better to seek volunteers first. The executive board has approved tier 2 hazard pay for the role if that helps entice you.\n\nLet me know if you’re interested,\n\nSasha McKail\nChief of Station Engineering & Maintenance, Pyrotechnic Amalgamated"
  },
  {
    "id": "contestedzone_firerat_kopion",
    "title": "Tenants of the Rat",
    "category": "Contested Zones",
    "type": "Text",
    "body": "• Be cleansed in Star Fire\n• Follow the Prophet’s Word\n• You are a rat before the Star’s might\n• Turn weakness to strength\n• Sacrifice before survival\n• Share the Prophet’s Word\n• Purge all who refuse the Prophet"
  },
  {
    "id": "contestedzone_firerat_secondthoughts",
    "title": "Tenants of the Rat",
    "category": "Contested Zones",
    "type": "Text",
    "body": "• Be cleansed in Star Fire\n• Follow the Prophet’s Word\n• You are a rat before the Star’s might\n• Turn weakness to strength\n• Sacrifice before survival\n• Share the Prophet’s Word\n• Purge all who refuse the Prophet"
  },
  {
    "id": "contestedzone_firerat_tenant",
    "title": "Tenants of the Rat",
    "category": "Contested Zones",
    "type": "Text",
    "body": "• Be cleansed in Star Fire\n• Follow the Prophet’s Word\n• You are a rat before the Star’s might\n• Turn weakness to strength\n• Sacrifice before survival\n• Share the Prophet’s Word\n• Purge all who refuse the Prophet"
  },
  {
    "id": "escapee02_text_popup_journalentry",
    "title": "[ DRAFT ] YOU LIED",
    "category": "Prison",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n\nYou had promised me that we would do this together. \nThat we could do anything together. \n\nAnd now I’m alone. \n\nWe could have just stayed. It would have been hard but at least you would still be here.\n\nBut you said this would be better and you lied. \n\nNow I just keep imagining your face when you fell, the sound when that branch pierced you.\n\nI don’t know how to go on without you."
  },
  {
    "id": "escapee05_text_popup_journalentry",
    "title": "CONGRATULATIONS AMORI NOVAK!",
    "category": "Prison",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n\nYou have won a free all expense paid trip to Cassel!\n\nThis special offer expires in 24 SEH! Don’t miss your chance to travel in luxury!\n\nYou will receive 2 round-trip passes on Meridian Transit, a 3 night all-expense stay at  a Green Circle hotel. Also a day voucher that entitles you up to 300 credits to spend on delicious food, amazing cocktails, and exciting adventures.\n\nTo claim this special prize, comm FreeTripPrizeAmazingWin2045 right away and we will collect the information we need to transfer these incredible winnings to you.\n\nThis is a once in a lifetime opportunity! Don’t let this chance escape!\n\nBest Travels,\nCawel Berborm\nMarketing Manager\nDream Vacation Agency"
  },
  {
    "id": "escapee03_text_popup_journalentry",
    "title": "ESCAPE PLAN",
    "category": "Prison",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n\nI had to pay all my merits but Des came through! \nMade me memorize it -\n\nFan\nLeft\nDrop\nJump\nRight\nLeft\nJump x 3\nDrop\nGet the key\nStairs"
  },
  {
    "id": "escapee01_text_popup_journalentry",
    "title": "GOOD LUCK TOMORROW!",
    "category": "Prison",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n\nHey Duggy,\n\nKnow you’re going through with the \"plan\" tomorrow so I wanted to give you my lucky spoon. Left it under your pillow. This thing has seen me through a lot of shit. Hell, I was eating some soup with it the first time we met! \n\nAnd remember, it’s not yours. Totally expect you to return it to me once we meet up next month! \n\nFirst round of soup’s on you.\n\n-Fil"
  },
  {
    "id": "caterpillar_manifest_1",
    "title": "Prisoner Transport Manifest",
    "category": "Prison",
    "type": "Dialogue",
    "body": "The following individuals listed within this manifest are now in the official custody of this transport and are to remain in stasis for the entirety of their journey until they are remanded to the care of an authorized Klescher Rehabilitation Facility.\n\nMANIFEST: \n\nName: ~mission(RandomName4), Prisoner ID: ~mission(RandomInteger4)\n\nName: ~mission(NameSave2), Prisoner ID: ~mission(AIIntegerSave2)\n\nName: ~mission(RandomName15), Prisoner ID: ~mission(RandomInteger15)\n\nName: ~mission(RandomName18), Prisoner ID: ~mission(RandomInteger18)\n\nName: ~mission(RandomName27), Prisoner ID: ~mission(RandomInteger27)\n\nName: ~mission(RandomName19), Prisoner ID: ~mission(RandomInteger19)\n\nName: ~mission(RandomName9), Prisoner ID: ~mission(RandomInteger9)\n\nName: ~mission(RandomName13), Prisoner ID: ~mission(RandomInteger13)\n\nName: ~mission(RandomName26), Prisoner ID: ~mission(RandomInteger26)\n\nName: ~mission(NameKill1), Prisoner ID: ~mission(AIIntegerKill)\n\nName: ~mission(RandomName12), Prisoner ID: ~mission(RandomInteger12)\n\nName: ~mission(NameSave1), Prisoner ID: ~mission(AIIntegerSave1)\n\nName: ~mission(RandomName14), Prisoner ID: ~mission(RandomInteger14)\n\nName: ~mission(RandomName2), Prisoner ID: ~mission(RandomInteger2)\n\nName: ~mission(RandomName16), Prisoner ID: ~mission(RandomInteger16)\n\nName: ~mission(RandomName7), Prisoner ID: ~mission(RandomInteger7)\n\nName: ~mission(RandomName6), Prisoner ID: ~mission(RandomInteger6)\n\nName: ~mission(RandomName24), Prisoner ID: ~mission(RandomInteger24)\n\nName: ~mission(RandomName25), Prisoner ID: ~mission(RandomInteger25)\n\nName: ~mission(RandomName28), Prisoner ID: ~mission(RandomInteger28)\n\nName: ~mission(RandomName22), Prisoner ID: ~mission(RandomInteger22)\n\nName: ~mission(RandomName20), Prisoner ID: ~mission(RandomInteger20)\n\nName: ~mission(RandomName5), Prisoner ID: ~mission(RandomInteger5)\n\nName: ~mission(NameSave3), Prisoner ID: ~mission(AIIntegerSave3)\n\nName: ~mission(RandomName8), Prisoner ID: ~mission(RandomInteger8)\n\nName: ~mission(RandomName11), Prisoner ID: ~mission(RandomInteger11)\n\nName: ~mission(RandomName10), Prisoner ID: ~mission(RandomInteger10)\n\nName: ~mission(RandomName1), Prisoner ID: ~mission(RandomInteger1)\n\nName: ~mission(RandomName3), Prisoner ID: ~mission(RandomInteger3)\n\nName: ~mission(RandomName23), Prisoner ID: ~mission(RandomInteger23)\n\nName: ~mission(RandomName17), Prisoner ID: ~mission(RandomInteger17)\n\nName: ~mission(RandomName21), Prisoner ID: ~mission(RandomInteger21)\n\n*NOTE* \nThe Advocacy and OIJ have requested that following inmates be processed first upon arrival and taken directly to interview holding cells. At no time should they be left alone with the general population as the risk of reprisals is high.  \n~mission(AIIntegerKill)\n~mission(RandomInteger11)\n~mission(RandomInteger7)",
    "missionSpecific": true
  },
  {
    "id": "caterpillar_manifest_2",
    "title": "Prisoner Transport Manifest",
    "category": "Prison",
    "type": "Dialogue",
    "body": "The following individuals listed within this manifest are now in the official custody of this transport and are to remain in stasis for the entirety of their journey until they are remanded to the care of an authorized Klescher Rehabilitation Facility.\n\nMANIFEST: \n\nName: ~mission(RandomName8), Prisoner ID: ~mission(RandomInteger8)\n\nName: ~mission(RandomName17), Prisoner ID: ~mission(RandomInteger17)\n\nName: ~mission(RandomName22), Prisoner ID: ~mission(RandomInteger22)\n\nName: ~mission(RandomName16), Prisoner ID: ~mission(RandomInteger16)\n\nName: ~mission(NameSave3), Prisoner ID: ~mission(AIIntegerSave3)\n\nName: ~mission(RandomName19), Prisoner ID: ~mission(RandomInteger19)\n\nName: ~mission(RandomName14), Prisoner ID: ~mission(RandomInteger14)\n\nName: ~mission(RandomName26), Prisoner ID: ~mission(RandomInteger26)\n\nName: ~mission(RandomName11), Prisoner ID: ~mission(RandomInteger11)\n\nName: ~mission(RandomName27), Prisoner ID: ~mission(RandomInteger27)\n\nName: ~mission(RandomName2), Prisoner ID: ~mission(RandomInteger2)\n\nName: ~mission(RandomName4), Prisoner ID: ~mission(RandomInteger4)\n\nName: ~mission(NameKill1), Prisoner ID: ~mission(AIIntegerKill)\n\nName: ~mission(RandomName1), Prisoner ID: ~mission(RandomInteger1)\n\nName: ~mission(RandomName5), Prisoner ID: ~mission(RandomInteger5)\n\nName: ~mission(RandomName25), Prisoner ID: ~mission(RandomInteger25)\n\nName: ~mission(RandomName18), Prisoner ID: ~mission(RandomInteger18)\n\nName: ~mission(RandomName7), Prisoner ID: ~mission(RandomInteger7)\n\nName: ~mission(RandomName21), Prisoner ID: ~mission(RandomInteger21)\n\nName: ~mission(NameSave1), Prisoner ID: ~mission(AIIntegerSave1)\n\nName: ~mission(RandomName10), Prisoner ID: ~mission(RandomInteger10)\n\nName: ~mission(RandomName15), Prisoner ID: ~mission(RandomInteger15)\n\nName: ~mission(RandomName6), Prisoner ID: ~mission(RandomInteger6)\n\nName: ~mission(RandomName9), Prisoner ID: ~mission(RandomInteger9)\n\nName: ~mission(RandomName3), Prisoner ID: ~mission(RandomInteger3)\n\nName: ~mission(RandomName12), Prisoner ID: ~mission(RandomInteger12)\n\nName: ~mission(RandomName23), Prisoner ID: ~mission(RandomInteger23)\n\nName: ~mission(RandomName28), Prisoner ID: ~mission(RandomInteger28)\n\nName: ~mission(RandomName13), Prisoner ID: ~mission(RandomInteger13)\n\nName: ~mission(RandomName20), Prisoner ID: ~mission(RandomInteger20)\n\nName: ~mission(RandomName24), Prisoner ID: ~mission(RandomInteger24)\n\nName: ~mission(NameSave2), Prisoner ID: ~mission(AIIntegerSave2)\n\n*NOTE* \nThe Advocacy and OIJ have requested that following inmates be processed first upon arrival and taken directly to interview holding cells. At no time should they be left alone with the general population as the risk of reprisals is high.  \n~mission(RandomInteger12)\n~mission(RandomInteger13)\n~mission(AIIntegerKill)\n~mission(RandomInteger14)",
    "missionSpecific": true
  },
  {
    "id": "caterpillar_manifest_3",
    "title": "Prisoner Transport Manifest",
    "category": "Prison",
    "type": "Dialogue",
    "body": "The following individuals listed within this manifest are now in  the official custody of this transport and are to remain in stasis for the entirety of their journey until they are remanded to the care of an authorized Klescher Rehabilitation Facility.\n\nMANIFEST: \n\nName: ~mission(RandomName13), Prisoner ID: ~mission(RandomInteger13)\n\nName: ~mission(RandomName1), Prisoner ID: ~mission(RandomInteger1)\n\nName: ~mission(RandomName14), Prisoner ID: ~mission(RandomInteger14)\n\nName: ~mission(RandomName20), Prisoner ID: ~mission(RandomInteger20)\n\nName: ~mission(RandomName8), Prisoner ID: ~mission(RandomInteger8)\n\nName: ~mission(RandomName2), Prisoner ID: ~mission(RandomInteger2)\n\nName: ~mission(RandomName5), Prisoner ID: ~mission(RandomInteger5)\n\nName: ~mission(RandomName4), Prisoner ID: ~mission(RandomInteger4)\n\nName: ~mission(RandomName6), Prisoner ID: ~mission(RandomInteger6)\n\nName: ~mission(NameSave1), Prisoner ID: ~mission(AIIntegerSave1)\n\nName: ~mission(RandomName7), Prisoner ID: ~mission(RandomInteger7)\n\nName: ~mission(RandomName9), Prisoner ID: ~mission(RandomInteger9)\n\nName: ~mission(RandomName3), Prisoner ID: ~mission(RandomInteger3)\n\nName: ~mission(NameSave2), Prisoner ID: ~mission(AIIntegerSave2)\n\nName: ~mission(RandomName26), Prisoner ID: ~mission(RandomInteger26)\n\nName: ~mission(RandomName28), Prisoner ID: ~mission(RandomInteger28)\n\nName: ~mission(RandomName19), Prisoner ID: ~mission(RandomInteger19)\n\nName: ~mission(NameKill1), Prisoner ID: ~mission(AIIntegerKill)\n\nName: ~mission(RandomName16), Prisoner ID: ~mission(RandomInteger16)\n\nName: ~mission(NameSave3), Prisoner ID: ~mission(AIIntegerSave3)\n\nName: ~mission(RandomName10), Prisoner ID: ~mission(RandomInteger10)\n\nName: ~mission(RandomName25), Prisoner ID: ~mission(RandomInteger25)\n\nName: ~mission(RandomName21), Prisoner ID: ~mission(RandomInteger21)\n\nName: ~mission(RandomName22), Prisoner ID: ~mission(RandomInteger22)\n\nName: ~mission(RandomName17), Prisoner ID: ~mission(RandomInteger17)\n\nName: ~mission(RandomName27), Prisoner ID: ~mission(RandomInteger27)\n\nName: ~mission(RandomName11), Prisoner ID: ~mission(RandomInteger11)\n\nName: ~mission(RandomName24), Prisoner ID: ~mission(RandomInteger24)\n\nName: ~mission(RandomName23), Prisoner ID: ~mission(RandomInteger23)\n\nName: ~mission(RandomName18), Prisoner ID: ~mission(RandomInteger18)\n\nName: ~mission(RandomName12), Prisoner ID: ~mission(RandomInteger12)\n\nName: ~mission(RandomName15), Prisoner ID: ~mission(RandomInteger15)\n\n*NOTE* \nThe Advocacy and OIJ have requested that following inmates be processed first upon arrival and taken directly to interview holding cells. At no time should they be left alone with the general population as the risk of reprisals is high. \n~mission(RandomInteger12)\n~mission(RandomInteger4)\n~mission(RandomInteger9)\n~mission(RandomInteger17)\n~mission(AIIntegerKill)",
    "missionSpecific": true
  },
  {
    "id": "caterpillar_manifest_4",
    "title": "Prisoner Transport Manifest",
    "category": "Prison",
    "type": "Dialogue",
    "body": "The following individuals listed within this manifest are now in the official custody of this transport and are to remain in stasis for the entirety of their journey until they are remanded to the care of an authorized Klescher Rehabilitation Facility.\n\nMANIFEST: \n\nName: ~mission(RandomName24), Prisoner ID: ~mission(RandomInteger24)\n\nName: ~mission(RandomName14), Prisoner ID: ~mission(RandomInteger14)\n\nName: ~mission(RandomName20), Prisoner ID: ~mission(RandomInteger20)\n\nName: ~mission(RandomName22), Prisoner ID: ~mission(RandomInteger22)\n\nName: ~mission(RandomName17), Prisoner ID: ~mission(RandomInteger17)\n\nName: ~mission(RandomName27), Prisoner ID: ~mission(RandomInteger27)\n\nName: ~mission(RandomName16), Prisoner ID: ~mission(RandomInteger16)\n\nName: ~mission(RandomName8), Prisoner ID: ~mission(RandomInteger8)\n\nName: ~mission(NameSave1), Prisoner ID: ~mission(AIIntegerSave1)\n\nName: ~mission(RandomName15), Prisoner ID: ~mission(RandomInteger15)\n\nName: ~mission(RandomName25), Prisoner ID: ~mission(RandomInteger25)\n\nName: ~mission(RandomName12), Prisoner ID: ~mission(RandomInteger12)\n\nName: ~mission(RandomName1), Prisoner ID: ~mission(RandomInteger1)\n\nName: ~mission(RandomName6), Prisoner ID: ~mission(RandomInteger6)\n\nName: ~mission(RandomName9), Prisoner ID: ~mission(RandomInteger9)\n\nName: ~mission(RandomName13), Prisoner ID: ~mission(RandomInteger13)\n\nName: ~mission(RandomName11), Prisoner ID: ~mission(RandomInteger11)\n\nName: ~mission(RandomName7), Prisoner ID: ~mission(RandomInteger7)\n\nName: ~mission(RandomName3), Prisoner ID: ~mission(RandomInteger3)\n\nName: ~mission(RandomName19), Prisoner ID: ~mission(RandomInteger19)\n\nName: ~mission(RandomName4), Prisoner ID: ~mission(RandomInteger4)\n\nName: ~mission(RandomName21), Prisoner ID: ~mission(RandomInteger21)\n\nName: ~mission(NameSave3), Prisoner ID: ~mission(AIIntegerSave3)\n\nName: ~mission(NameKill1), Prisoner ID: ~mission(AIIntegerKill)\n\nName: ~mission(NameSave2), Prisoner ID: ~mission(AIIntegerSave2)\n\nName: ~mission(RandomName26), Prisoner ID: ~mission(RandomInteger26)\n\nName: ~mission(RandomName5), Prisoner ID: ~mission(RandomInteger5)\n\nName: ~mission(RandomName28), Prisoner ID: ~mission(RandomInteger28)\n\nName: ~mission(RandomName18), Prisoner ID: ~mission(RandomInteger18)\n\nName: ~mission(RandomName10), Prisoner ID: ~mission(RandomInteger10)\n\nName: ~mission(RandomName23), Prisoner ID: ~mission(RandomInteger23)\n\nName: ~mission(RandomName2), Prisoner ID: ~mission(RandomInteger2)\n\n*NOTE* \nThe Advocacy and OIJ have requested that following inmates be processed first upon arrival and taken directly to interview holding cells. At no time should they be left alone with the general population as the risk of reprisals is high. \n~mission(RandomInteger1)\n~mission(AIIntegerKill)",
    "missionSpecific": true
  },
  {
    "id": "caterpillar_manifest_5",
    "title": "Prisoner Transport Manifest",
    "category": "Prison",
    "type": "Dialogue",
    "body": "The following individuals listed within this manifest are now in  the official custody of this transport and are to remain in stasis for the entirety of their journey until they are remanded to the care of an authorized Klescher Rehabilitation Facility.\n\nMANIFEST: \n\nName: ~mission(RandomName21), Prisoner ID: ~mission(RandomInteger21)\n\nName: ~mission(RandomName14), Prisoner ID: ~mission(RandomInteger14)\n\nName: ~mission(RandomName22), Prisoner ID: ~mission(RandomInteger22)\n\nName: ~mission(RandomName10), Prisoner ID: ~mission(RandomInteger10)\n\nName: ~mission(RandomName26), Prisoner ID: ~mission(RandomInteger26)\n\nName: ~mission(NameSave3), Prisoner ID: ~mission(AIIntegerSave3)\n\nName: ~mission(RandomName5), Prisoner ID: ~mission(RandomInteger5)\n\nName: ~mission(NameKill1), Prisoner ID: ~mission(AIIntegerKill)\n\nName: ~mission(RandomName2), Prisoner ID: ~mission(RandomInteger2)\n\nName: ~mission(RandomName7), Prisoner ID: ~mission(RandomInteger7)\n\nName: ~mission(RandomName12), Prisoner ID: ~mission(RandomInteger12)\n\nName: ~mission(RandomName24), Prisoner ID: ~mission(RandomInteger24)\n\nName: ~mission(RandomName13), Prisoner ID: ~mission(RandomInteger13)\n\nName: ~mission(RandomName9), Prisoner ID: ~mission(RandomInteger9)\n\nName: ~mission(RandomName17), Prisoner ID: ~mission(RandomInteger17)\n\nName: ~mission(RandomName8), Prisoner ID: ~mission(RandomInteger8)\n\nName: ~mission(RandomName23), Prisoner ID: ~mission(RandomInteger23)\n\nName: ~mission(RandomName20), Prisoner ID: ~mission(RandomInteger20)\n\nName: ~mission(RandomName11), Prisoner ID: ~mission(RandomInteger11)\n\nName: ~mission(RandomName18), Prisoner ID: ~mission(RandomInteger18)\n\nName: ~mission(RandomName27), Prisoner ID: ~mission(RandomInteger27)\n\nName: ~mission(RandomName15), Prisoner ID: ~mission(RandomInteger15)\n\nName: ~mission(RandomName6), Prisoner ID: ~mission(RandomInteger6)\n\nName: ~mission(NameSave1), Prisoner ID: ~mission(AIIntegerSave1)\n\nName: ~mission(RandomName16), Prisoner ID: ~mission(RandomInteger16)\n\nName: ~mission(RandomName25), Prisoner ID: ~mission(RandomInteger25)\n\nName: ~mission(RandomName3), Prisoner ID: ~mission(RandomInteger3)\n\nName: ~mission(RandomName19), Prisoner ID: ~mission(RandomInteger19)\n\nName: ~mission(RandomName1), Prisoner ID: ~mission(RandomInteger1)\n\nName: ~mission(NameSave2), Prisoner ID: ~mission(AIIntegerSave2)\n\nName: ~mission(RandomName28), Prisoner ID: ~mission(RandomInteger28)\n\nName: ~mission(RandomName4), Prisoner ID: ~mission(RandomInteger4)\n\n*NOTE* \nThe Advocacy and OIJ have requested that following inmates be processed first upon arrival and taken directly to interview holding cells. At no time should they be left alone with the general population as the risk of reprisals is high. \n~mission(RandomInteger19)\n~mission(AIIntegerKill)\n~mission(RandomInteger6)\n~mission(RandomInteger21)\n~mission(RandomInteger16)",
    "missionSpecific": true
  },
  {
    "id": "caterpillar_manifest_master",
    "title": "Prisoner Transport Manifest",
    "category": "Prison",
    "type": "Dialogue",
    "body": "The following individuals listed within this manifest are now in the official custody of this transport and are to remain in stasis for the entirety of their journey until they are remanded to the care of an authorized Klescher Rehabilitation Facility.\n\nMANIFEST: \n\nName: ~mission(RandomName17), Prisoner ID: ~mission(RandomInteger17)\n\nName: ~mission(NameSave1), Prisoner ID: ~mission(AIIntegerSave1)\n\nName: ~mission(RandomName28), Prisoner ID: ~mission(RandomInteger28)\n\nName: ~mission(RandomName16), Prisoner ID: ~mission(RandomInteger16)\n\nName: ~mission(RandomName8), Prisoner ID: ~mission(RandomInteger8)\n\nName: ~mission(RandomName18), Prisoner ID: ~mission(RandomInteger18)\n\nName: ~mission(RandomName11), Prisoner ID: ~mission(RandomInteger11)\n\nName: ~mission(RandomName6), Prisoner ID: ~mission(RandomInteger6)\n\nName: ~mission(RandomName1), Prisoner ID: ~mission(RandomInteger1)\n\nName: ~mission(RandomName22), Prisoner ID: ~mission(RandomInteger22)\n\nName: ~mission(RandomName13), Prisoner ID: ~mission(RandomInteger13)\n\nName: ~mission(RandomName27), Prisoner ID: ~mission(RandomInteger27)\n\nName: ~mission(NameSave3), Prisoner ID: ~mission(AIIntegerSave3)\n\nName: ~mission(NameKill1), Prisoner ID: ~mission(AIIntegerKill)\n\nName: ~mission(RandomName25), Prisoner ID: ~mission(RandomInteger25)\n\nName: ~mission(RandomName9), Prisoner ID: ~mission(RandomInteger9)\n\nName: ~mission(RandomName19), Prisoner ID: ~mission(RandomInteger19)\n\nName: ~mission(RandomName24), Prisoner ID: ~mission(RandomInteger24)\n\nName: ~mission(NameSave2), Prisoner ID: ~mission(AIIntegerSave2)\n\nName: ~mission(RandomName10), Prisoner ID: ~mission(RandomInteger10)\n\nName: ~mission(RandomName26), Prisoner ID: ~mission(RandomInteger26)\n\nName: ~mission(RandomName2), Prisoner ID: ~mission(RandomInteger2)\n\nName: ~mission(RandomName14), Prisoner ID: ~mission(RandomInteger14)\n\nName: ~mission(RandomName20), Prisoner ID: ~mission(RandomInteger20)\n\nName: ~mission(RandomName15), Prisoner ID: ~mission(RandomInteger15)\n\nName: ~mission(RandomName3), Prisoner ID: ~mission(RandomInteger3)\n\nName: ~mission(RandomName21), Prisoner ID: ~mission(RandomInteger21)\n\nName: ~mission(RandomName5), Prisoner ID: ~mission(RandomInteger5)\n\nName: ~mission(RandomName23), Prisoner ID: ~mission(RandomInteger23)\n\nName: ~mission(RandomName7), Prisoner ID: ~mission(RandomInteger7)\n\nName: ~mission(RandomName12), Prisoner ID: ~mission(RandomInteger12)\n\nName: ~mission(RandomName4), Prisoner ID: ~mission(RandomInteger4)\n\n*NOTE* \nThe Advocacy and OIJ have requested that following inmates be processed first upon arrival and taken directly to interview holding cells. At no time should they be left alone with the general population as the risk of reprisals is high.  \n~mission(RandomInteger22)\n~mission(AIIntegerKill)\n~mission(RandomInteger6)\n~mission(RandomInteger17)",
    "missionSpecific": true
  },
  {
    "id": "escapee04_text_popup_journalentry",
    "title": "SONG IDEAS & LYRICS",
    "category": "Prison",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n\nTrapped in a cage, diggin’ for rocks\nHope seems far, from behind these locks\nEach day a grind, I’m wearing away\nServing my time, the light’s so far away\n\nGot to break free\nCan’t wait a moment more\nGot to break freeeeee\nRunnin’ fast, feet hit the floor\n\nGot to break free\nFreedom can’t ever die\nGot to break freeeeee\nRunnin’ fast, my chance to fly.\n\nThen this next verse will be about how I start a new life once I get out."
  },
  {
    "id": "journalentry.bravodefender_abandonedpost",
    "title": "Breach of Crusader Security Contract",
    "author": "Pauline Nesso",
    "category": "Crusader",
    "type": "Text",
    "body": "By taking unauthorized leave of Security Post Kareah, you have violated the terms of your contract with Crusader Industries. \n\nAll remuneration is forfeit and criminal charges have been filed.\n\nAuthorized by:\nPauline Nesso, Facilities Manager\nSecurity Post Kareah, Crusader Industries"
  },
  {
    "id": "journalentry.commsarray_crusaderindwarning",
    "title": "Crusader Industries Safety Alert: Comm Signal Disruption",
    "author": "Crusader Industries Interstellar Communications Division",
    "category": "Crusader",
    "type": "Text",
    "body": "We wish to notify you that you may experience difficulties with your comm system while traveling in the vicinity of Crusader. We apologize for the inconvenience. Our security teams are currently working to correct this issue and have the errant Arrays reconnected soon.\n\nPlease note, this outage also compromises the Emergency Communications Network grid, so security forces will be unable to respond in the event of a ship malfunction or criminal activity. We highly recommend adjusting your flight plan accordingly.\n\nCrusader Industries thanks you for your patience in this matter,\n\nLorenzo Momar\nVice President, Interstellar Communications Division, Crusader Industries"
  },
  {
    "id": "journalentry.bravodefender_thankyou",
    "title": "Crusader Security Contract Completed",
    "author": "Pauline Nesso",
    "category": "Crusader",
    "type": "Text",
    "body": "Congratulations on the successful completion of your security contract with Crusader Industries. Payment has been transferred to your account. \n\nIn addition, as thanks for your exemplary work, please feel free to keep the equipment provided for your own personal use.\n\nRegards,\nPauline\n\nPauline Nesso, Facilities Manager\nSecurity Post Kareah, Crusader Industries"
  },
  {
    "id": "journalentry.bravodefender_failure",
    "title": "Failure to Fufill Crusader Security Contract",
    "author": "Pauline Nesso",
    "category": "Crusader",
    "type": "Text",
    "body": "Post Kareah's security databases were illegally accessed while under your watch.\nThis is unacceptable and a breach of your employment terms.\n\nYou are hereby terminated from your position.\n\nAll remuneration is now forfeit. Immediately vacate the premises.\n\nThis message authorized by:\nPauline Nesso, Facilities Manager\nSecurity Post Kareah, Crusader Industries"
  },
  {
    "id": "journalentry.crusader_bounty_reward",
    "title": "Meritorious Service",
    "author": "Crusader Security Team",
    "category": "Crusader",
    "type": "Text",
    "body": "We at Crusader Security would like to formally thank you for your assistance in eliminating such a dangerous enemy to the public’s safety. We can all rest a little bit in easier knowing that such a malicious threat has been resolutely dealt with.\n\nAs a token of our appreciation for your meritorious service and in recognition of your selflessness, the promised reward has been delivered and is awaiting you at Port Olisar.\n\nMay it serve you in good health,\nSasha Rust, Security Director, Crusader Industries"
  },
  {
    "id": "journalentry.aciedocontract",
    "title": "Temporary Contract Position: Comm Technician",
    "author": "Aciedo CommRelay",
    "category": "Crusader",
    "type": "Text",
    "body": "We are looking to immediately hire temporary contract system technicians to assist in the maintenance of Comm Arrays located near Crusader. Previous experience a plus. Arrays require a hard reset so experience with EVA in a hazardous environment is a must."
  },
  {
    "id": "journalentry.bravodefender_quit",
    "title": "Termination Notice",
    "author": "Pauline Nesso",
    "category": "Crusader",
    "type": "Text",
    "body": "You have chosen to terminate your position as Crusader Security early.\n\nAll remuneration is now forfeit. Immediately vacate the premises.\n\nThis message authorized by:\nPauline Nesso, Facilities Manager\nSecurity Post Kareah, Crusader Industries"
  },
  {
    "id": "journalentry.welcomemessage",
    "title": "Welcome to Port Olisar!",
    "author": "Olisar Hospitality Team",
    "category": "Crusader",
    "type": "Text",
    "body": "On behalf of our entire staff and Crusader Industries, thank you for choosing Port Olisar for your visit to the Crusader area. We realize that there are many fine stations available, so we sincerely appreciate your business and look forward to providing an enjoyable experience.\n\nWe would like to call your attention to two important services:\n\n*Accessing Your Ship*\nIf you arrived at the station in a personal craft, Port Olisar is proud to feature UniCorp Limited’s cutting edge all-in-one automated ship organization program, ASOP. To retrieve your vessel, visit one of the ASOP terminals located in the Ship Deck, and once selected, your ship will be delivered to an available landing pad. \n\n*Safety Protocols*\nFor the safety of our guests, Port Olisar has been declared an Armistice Zone. Combat is prohibited and the use of all personal and ship weapons is strictly limited. If you would like more information about the Armistice Initiative, please contact a staff member or visit the Advocacy on the spectrum.\n\nAlso, please note that Port Olisar and the area above Crusader are a UEE Monitored zone. Our Comm Arrays are linked to the UEE’s Emergency Communication Network (ECN) and, when operational, will alert authorities immediately if you are involved in an accident, crime or life-threatening situation. While traveling, please maintain an active CommLink to ensure continued usage of the ECN.\n\nAnd of course, feel free to take advantage of our other top-class amenities:\n\n*Big Benny’s Kacho-To-Go*\nWhenever you’re in the mood to “Grab Eat,” make sure to check out our Big Benny’s Kacho-To-Go vending unit featuring the original noodle recipe made famous on Lo and their new spicy Mathania Red variety!\n\n*EZHab Rest Area*\nWhatever the length of your stay, take a moment to relax in our comfortable and private EZHab sleeping accommodations available for rent. \n\n*Complimentary Shuttles*\nIf your travel plans include a trip to Crusader’s surface, Port Olisar offers daily complimentary shuttles to Platinum Bay landing park in Orison; featuring breathtaking views of Crusader Industries’ famous construction yards. For schedule information, please contact a staff member. \n\nIf there is anything we can do to make your stay more comfortable please do not hesitate to ask any member of our staff or myself. We would be delighted to help you. \n\nWith kindest regards,\nSelma Hoss\n\nManaging Director\nPort Olisar Station, Crusader, Stanton"
  },
  {
    "id": "journalentry.criminal_thanks_player",
    "title": "Worked Like a Charm",
    "author": "Ruto",
    "category": "Crusader",
    "type": "Text",
    "body": "What did I tell you? Easy, right? Hack one terminal, and poof, lower crimestat. Seems like we make a pretty good team. Me doing the thinking, you doing the doing. \n\nWho knows, maybe we’ll get the chance to work together again sometime. \n\n-Ruto"
  },
  {
    "id": "journalentry.yela_advisory",
    "title": "Yela Travel Advisory",
    "author": "Crusader Security Team",
    "category": "Crusader",
    "type": "Text",
    "body": "***ATTENTION***\n\nA Travel Advisory is in effect for all ships near Yela (Stanton 2c).  \n\nAlthough the area is heavily policed by Crusader Security, outlaw groups are currently known to operate in the area and attacks are still possible. The majority of ambushes have been reported in the asteroid field located near Yela. Crusader Security strongly recommends that travelers carefully evaluate the risks to their personal safety, and when possible, avoid travel in the region all together.  \n\nThis Travel Advisory authorized by Sasha Rust, Security Director, Crusader Security."
  },
  {
    "id": "historicaltour1",
    "title": "Birthplace of Vortex Thorson",
    "author": "Crusader Historical Society",
    "category": "Lore",
    "type": "Text",
    "body": "Famed musician Carolyn 'Vortex' Thorson was born here on January 8, 2915. Her family's ship was en route to a nearby outpost when it set down to facilitate her birth. As a teenager, Thorson earned the nickname 'Vortex' for the impressive speed and dexterity she displayed behind the drums. As a founding member of Firmament, she helped redefine popular music, making her the most famous and mimicked drummer in the UEE for over a decade."
  },
  {
    "id": "historicaltour2",
    "title": "Creation of Ceprozin",
    "author": "Crusader Historical Society",
    "category": "Lore",
    "type": "Text",
    "body": "Rayari scientists working here at the Hickes Research Outpost created a revolutionary nonsteroidal anti-inflammatory (NSAID) in 2938. The drug, known commonly as Ceprozin, has become widely used during cybernetic replacement surgeries, providing pain relief and curbing inflammation without any of the side effects common with other NSAIDs."
  },
  {
    "id": "darnell_unfinishedletter",
    "title": "D.Ward - Recovered Data",
    "category": "Datapads",
    "type": "Text",
    "body": "From: Darnell Ward\nTo: Elaine Ward\nSubject: I messed up\n2945.08.27 05:13SET\n>> UNSENT DRAFT\n \nSo… I don’t know why this is so tough... Dr. Colby said that I shouldn’t get too down on myself if I stumbled in my treatment, but I can’t bring myself to believe him. I know I could probably just sleep it off, wake up tomorrow and commit myself to starting fresh, but I don’t know… something just feels wrong about that. Wrong not telling you. Then it feels like it’d be sweeping it under the rug. Like it never happened. I think about all the things I put you, put the kids through, and I just don’t know why I can’t figure this out. \n \nI guess you know where this is going. There was a birthday party tonight and somebody had been saving a bottle of Esquire. It was easy to say yes. I almost didn’t even think about it. What that word would mean. I guess… I think I went back ten years ago, like when we were at school. When having a few drinks didn’t lead to waking up in a medstation or with blood on my clothes. But in that moment, I was the me back then. Just a guy celebrating a birthday with some coworkers…\n \nBut I’m not that guy. And it kills me.\n \nI don’t know who I am anymore. It’s late now. I’m drunk. Drunk and ashamed that I keep letting you down.\n \nI guess all I want is"
  },
  {
    "id": "blacjac_senioragent_demotion",
    "title": "[Authority] Demotion - Agent",
    "author": "[Authority] Demotion - Agent",
    "category": "Reputation",
    "type": "Text",
    "body": "[Authority] Demotion - Agent"
  },
  {
    "id": "blacjac_agent_demotion",
    "title": "[Authority] Demotion - Junior Agent",
    "author": "[Authority] Demotion - Junior Agent",
    "category": "Reputation",
    "type": "Text",
    "body": "[Authority] Demotion - Junior Agent"
  },
  {
    "id": "blacjac_veteranagent_demotion",
    "title": "[Authority] Demotion - Senior Agent",
    "author": "[Authority] Demotion - Senior Agent",
    "category": "Reputation",
    "type": "Text",
    "body": "[Authority] Demotion - Senior Agent"
  },
  {
    "id": "blacjac_masteragent_demotion",
    "title": "[Authority] Demotion - Veteran Agent",
    "author": "[Authority] Demotion - Veteran Agent",
    "category": "Reputation",
    "type": "Text",
    "body": "[Authority] Demotion - Veteran Agent"
  },
  {
    "id": "blacjac_junioragent_demotion",
    "title": "[Authority] On notice - back to Probation",
    "author": "[Authority] On notice - back to Probation",
    "category": "Reputation",
    "type": "Text",
    "body": "[Authority] On notice - back to Probation"
  },
  {
    "id": "blacjac_applicant_promotion",
    "title": "[Authority] Probation begun",
    "author": "[Authority] Probation begun",
    "category": "Reputation",
    "type": "Text",
    "body": "[Authority] Probation begun"
  },
  {
    "id": "blacjac_probation_promotion",
    "title": "[Authority] Probation complete - Junior Agent",
    "author": "[Authority] Probation complete - Junior Agent",
    "category": "Reputation",
    "type": "Text",
    "body": "[Authority] Probation complete - Junior Agent"
  },
  {
    "id": "blacjac_junioragent_promotion",
    "title": "[Authority] Promotion - Agent",
    "author": "[Authority] Promotion - Agent",
    "category": "Reputation",
    "type": "Text",
    "body": "[Authority] Promotion - Agent"
  },
  {
    "id": "blacjac_veteranagent_promotion",
    "title": "[Authority] Promotion - Master Agent",
    "author": "[Authority] Promotion - Master Agent",
    "category": "Reputation",
    "type": "Text",
    "body": "[Authority] Promotion - Master Agent"
  },
  {
    "id": "blacjac_agent_promotion",
    "title": "[Authority] Promotion - Senior Agent",
    "author": "[Authority] Promotion - Senior Agent",
    "category": "Reputation",
    "type": "Text",
    "body": "[Authority] Promotion - Senior Agent"
  },
  {
    "id": "blacjac_senioragent_promotion",
    "title": "[Authority] Promotion - Veteran Agent -BlacJac",
    "author": "[Authority] Promotion - Veteran Agent",
    "category": "Reputation",
    "type": "Text",
    "body": "[Authority] Promotion - Veteran Agent"
  },
  {
    "id": "blacjac_probation_termination",
    "title": "[Authority] Termination of contract -BlacJac",
    "author": "[Authority] Termination of contract",
    "category": "Reputation",
    "type": "Text",
    "body": "[Authority] Termination of contract -BlacJac"
  },
  {
    "id": "bhg_certification_veryhard",
    "title": "Advanced Tracker License (VHRT)",
    "author": "Bounty Hunters Guild",
    "category": "Reputation",
    "type": "Text",
    "body": "This license issued by the Bounty Hunters Guild certifies that you are qualified to pursue and apprehend Very High-Risk Targets (VHRT).\n\nYour qualification also allows you to pursue bounties for individuals whose current abilities and resources are unknown (?RT). These should be undertaken with caution."
  },
  {
    "id": "crusader_agent_demotion",
    "title": "Crusader Security Demotion - Junior Security Associate",
    "author": "Crusader Security",
    "category": "Reputation",
    "type": "Text",
    "body": "This notice is to inform you that after reviewing your files it has been determined that you no longer meet the qualifications of Security Associate and as such have been demoted to Junior Security Associate, losing all associated benefits.\n\nConsider this a chance to course correct and improve your standings with Crusader Security. If you do improve, we will be happy to reevaluate your standing."
  },
  {
    "id": "crusader_senioragent_demotion",
    "title": "Crusader Security Demotion - Security Associate",
    "author": "Crusader Security",
    "category": "Reputation",
    "type": "Text",
    "body": "This notice is to inform you that after reviewing your files it has been determined that you no longer meet the qualifications of Senior Security Associate and as such have been demoted to Security Associate. Your pay bonus has likewise returned to 5%.\n\nConsider this a chance to course correct and improve your standings with Crusader Security. If you do improve, we will be happy to reevaluate your standing."
  },
  {
    "id": "crusader_masteragent_demotion",
    "title": "Crusader Security Demotion - Security Partner",
    "author": "Crusader Security",
    "category": "Reputation",
    "type": "Text",
    "body": "This notice is to inform you that after reviewing your files it has been determined that you no longer meet the qualifications of Preferred Security Partner and as such have been demoted to Security Partner. Your pay bonus has likewise returned to 15%.\n\nThis is quite disappointing considering the high level of performance Crusader Security has come to expect from you. Please know that if you manage to change your current trajectory, we will be happy to reevaluate your standing."
  },
  {
    "id": "crusader_veteranagent_demotion",
    "title": "Crusader Security Demotion - Senior Security Associate",
    "author": "Crusader Security",
    "category": "Reputation",
    "type": "Text",
    "body": "This notice is to inform you that after reviewing your files it has been determined that you no longer meet the qualifications of Security Partner and as such have been demoted to Senior Security Associate. Your pay bonus has likewise returned to 10%.\n\nConsider this a chance to course correct and improve your standings with Crusader Security. If you do improve, we will be happy to reevaluate your standing."
  },
  {
    "id": "crusader_junioragent_demotion",
    "title": "Crusader Security Demotion - Verified Freelancer",
    "author": "Crusader Security",
    "category": "Reputation",
    "type": "Text",
    "body": "This notice is to inform you that after reviewing your files it has been determined that you no longer meet the qualifications of a Junior Security Associate and as such have been demoted to Verified Freelancer.\n\nConsider this a chance to course correct and improve your standings with Crusader Security. If you do improve, we will be happy to reevaluate your standing."
  },
  {
    "id": "crusader_probation_promotion",
    "title": "Crusader Security Promotion - Junior Security Associate",
    "author": "Crusader Security",
    "category": "Reputation",
    "type": "Text",
    "body": "Congratulations!\n\nTo acknowledge your outstanding work, you have been promoted to Junior Security Associate.\n\nIf you continue to complete contracts and show your dedication to making Crusader safer, you will soon be promoted to a full Security Associate and receive a payment bonus.\n\nKeep up the great work!"
  },
  {
    "id": "crusader_veteranagent_promotion",
    "title": "Crusader Security Promotion - Preferred Security Partner",
    "author": "Crusader Security",
    "category": "Reputation",
    "type": "Text",
    "body": "Congratulations!\n\nThanks to your amazing service and dedication to Crusader Security, you have been promoted to Preferred Security Partner. This is the highest title we reward and very much an honor.\n\nAs a much deserved benefit, you will now receive a 20% pay increase on your completed contracts.\n\nOur sincerest thanks for everything you've done and we look forward to our continued mutual success."
  },
  {
    "id": "crusader_junioragent_promotion",
    "title": "Crusader Security Promotion - Security Associate",
    "author": "Crusader Security",
    "category": "Reputation",
    "type": "Text",
    "body": "Congratulations!\n\nTo acknowledge your continued contributions to Crusader Security, you have been promoted to Security Associate.\n\nAs a show of our appreciation for all your hard work, you will now receive a 5% pay increase on your completed contracts.  \n\nIf you continue to complete contracts and show your dedication to making Crusader safer, you will soon be promoted to a Senior Security Associate and receive an additional payment bonus.\n\nCongratulations again!"
  },
  {
    "id": "crusader_senioragent_promotion",
    "title": "Crusader Security Promotion - Security Partner",
    "author": "Crusader Security",
    "category": "Reputation",
    "type": "Text",
    "body": "Congratulations!\n\nTo acknowledge your continued contributions to Crusader Security, you have been promoted to Security Partner.\n\nAs a benefit, you will now receive a 15% pay increase on your completed contracts. This bonus is Crusader Security's way of letting you know how much we appreciate all you do. \n\nIf you continue to demonstrate your dedication and proficiency, you may earn the title of Preferred Security Partner along with additional benefits.\n\nWell done on all your outstanding work."
  },
  {
    "id": "crusader_agent_promotion",
    "title": "Crusader Security Promotion - Senior Security Associate",
    "author": "Crusader Security",
    "category": "Reputation",
    "type": "Text",
    "body": "Congratulations!\n\nTo acknowledge your continued contributions to Crusader Security, you have been promoted to Senior Security Associate.\n\nAs a benefit, you will now receive a 10% pay increase on your completed contracts. This is Crusader Security's way of letting you know how much we appreciate all you do. \n\nIf you continue to demonstrate your dedication and proficiency, you may earn the title of Security Partner along with additional benefits.\n\nAll of us here at Crusader Security are very proud of everything you've accomplished so far and look forward to a bright future."
  },
  {
    "id": "crusader_probation_termination",
    "title": "Crusader Security Termination Notice",
    "author": "Crusader Security",
    "category": "Reputation",
    "type": "Text",
    "body": "This is to notify you that due to your recent performance issues, you are no longer authorized to work for Crusader Security.\n\nWe wish you the best of luck on your future endeavors."
  },
  {
    "id": "crusader_applicant_promotion",
    "title": "Crusader Security Verified Freelancer Authorization",
    "author": "Crusader Security",
    "category": "Reputation",
    "type": "Text",
    "body": "Congratulations! \n\nYou have been authorized to begin work as a Verified Freelancer for Crusader Security.\n\nContracts that match your qualification levels will be offered through your mobiGlas Contract Manager. We encourage you to regularly check for new contracts as they become available. A high completion rate will earn you the chance for promotion and additional benefits like higher pay. \n \nWe look forward to working together to make Crusader and the surrounding sector a safer place."
  },
  {
    "id": "bhg_certification_cs4",
    "title": "Elusive Bounty CS4 License Earned",
    "author": "Bounty Hunters Guild",
    "category": "Reputation",
    "type": "Text",
    "body": "Elusive Bounty CS4 License Earned"
  },
  {
    "id": "bhg_certification_cs5",
    "title": "Elusive Bounty CS5 License Earned",
    "author": "Bounty Hunters Guild",
    "category": "Reputation",
    "type": "Text",
    "body": "Elusive Bounty CS5 License Earned"
  },
  {
    "id": "vaughn_termination",
    "title": "Failure to Satisfy",
    "author": "Vaughn",
    "category": "Reputation",
    "type": "Text",
    "body": "It has become readily apparent that your abilities do not meet the expected standards, meaning that you are not qualified to complete even the simplest of tasks.\n\nTo that end, I will no longer be utilizing your services.\n\nOne final note - I expect you to continue to respect my privacy.  If not, I will be forced to arrange for you to meet your more qualified replacement.\n\nFarewell,\nVaughn"
  },
  {
    "id": "bhg_certification_escapedconvict",
    "title": "Fugitive Recovery Certification",
    "author": "Bounty Hunters Guild",
    "category": "Reputation",
    "type": "Text",
    "body": "You are hereby certified by the Bounty Hunters Guild for Fugitive Recovery and are qualified to pursue and apprehend escaped convicts."
  },
  {
    "id": "hurston_senioragent_promotion",
    "title": "Hurston Dynamics Advanced Operative Authorization",
    "author": "Hurston Dynamics",
    "category": "Reputation",
    "type": "Text",
    "body": "This document signifies the recipient is now an authorized Hurston Dynamics ADVANCED OPERATIVE and that they are entitled to all related privileges including a 15% payment bonus.\n\nThey will maintain this title until their next evaluation where they will be rated on contract performance and various other benchmarks. At such a time they will either be demoted or granted the rank of Elite Operative with additional privileges."
  },
  {
    "id": "hurston_applicant_promotion",
    "title": "Hurston Dynamics Associate Contractor Authorization",
    "author": "Hurston Dynamics",
    "category": "Reputation",
    "type": "Text",
    "body": "This document signifies the recipient is an authorized Hurston Dynamics ASSOCIATE CONTRACTOR and that they are entitled to all related privileges.\n\nThey will maintain this title until their next evaluation where they will be rated on contract performance and various other benchmarks. At such a time, they will either be terminated or granted the rank of Contractor with additional privileges."
  },
  {
    "id": "hurston_probation_termination",
    "title": "Hurston Dynamics Authorization Terminated",
    "author": "Hurston Dynamics",
    "category": "Reputation",
    "type": "Text",
    "body": "The recipient of this document's performance was evaluated and determined to be significantly lacking against the expectations of Hurston Dynamics.\n\nAll employment with Hurston Dynamics is hereby terminated."
  },
  {
    "id": "hurston_probation_promotion",
    "title": "Hurston Dynamics Contractor Authorization",
    "author": "Hurston Dynamics",
    "category": "Reputation",
    "type": "Text",
    "body": "This document signifies the recipient is now an authorized Hurston Dynamics CONTRACTOR and that they are entitled to all related privileges.\n\nThey will maintain this title until their next evaluation where they will be rated on contract performance and various other benchmarks. At such a time they will either be demoted or granted the rank of Senior Contractor with additional privileges."
  },
  {
    "id": "hurston_masteragent_demotion",
    "title": "Hurston Dynamics Demotion: Advanced Operative",
    "author": "Hurston Dynamics",
    "category": "Reputation",
    "type": "Text",
    "body": "The recipient of this document's performance was evaluated and determined to be significantly lacking.\n\nTheir standing and privileges have been demoted to the rank of ADVANCED OPERATIVE along with a decrease to a 15% payment bonus.\n\nAt such a time as there is an additional evaluation, they will be terminated or restored to the rank and privileges of Elite Operative."
  },
  {
    "id": "hurston_junioragent_demotion",
    "title": "Hurston Dynamics Demotion: Associate Contractor",
    "author": "Hurston Dynamics",
    "category": "Reputation",
    "type": "Text",
    "body": "The recipient of this document's performance was evaluated and determined to be significantly lacking.\n\nTheir standing and privileges have been demoted to the rank of ASSOCIATE CONTRACTOR.\n\nAt such a time as there is an additional evaluation, they will be terminated or restored to the rank and privileges of Contractor."
  },
  {
    "id": "hurston_agent_demotion",
    "title": "Hurston Dynamics Demotion: Contractor",
    "author": "Hurston Dynamics",
    "category": "Reputation",
    "type": "Text",
    "body": "The recipient of this document's performance was evaluated and determined to be significantly lacking.\n\nTheir standing and privileges have been demoted to the rank of CONTRACTOR.\n\nAt such a time as there is an additional evaluation, they will be terminated or restored to the rank and privileges of Senior Contractor."
  },
  {
    "id": "hurston_veteranagent_demotion",
    "title": "Hurston Dynamics Demotion: Operative",
    "author": "Hurston Dynamics",
    "category": "Reputation",
    "type": "Text",
    "body": "The recipient of this document's performance was evaluated and determined to be significantly lacking.\n\nTheir standing and privileges have been demoted to the rank of OPERATIVE along with a decrease to a 10% payment bonus.\n\nAt such a time as there is an additional evaluation, they will be terminated or restored to the rank and privileges of Advanced Operative."
  },
  {
    "id": "hurston_senioragent_demotion",
    "title": "Hurston Dynamics Demotion: Senior Contractor",
    "author": "Hurston Dynamics",
    "category": "Reputation",
    "type": "Text",
    "body": "The recipient of this document's performance was evaluated and determined to be significantly lacking.\n\nTheir standing and privileges have been demoted to the rank of SENIOR CONTRACTOR along with a decrease to a 5% payment bonus.\n\nAt such a time as there is an additional evaluation, they will be terminated or restored to the rank and privileges of Operative."
  },
  {
    "id": "hurston_veteranagent_promotion",
    "title": "Hurston Dynamics Elite Operative Authorization",
    "author": "Hurston Dynamics",
    "category": "Reputation",
    "type": "Text",
    "body": "This document signifies the recipient is now an authorized Hurston Dynamics ELITE OPERATIVE and that they are entitled to all related privileges including a 20% payment bonus.\n\nThey will maintain this title until their next evaluation where they will be rated on contract performance and various other benchmarks. At such a time they will either be demoted or granted the right to maintain this title."
  },
  {
    "id": "hurston_agent_promotion",
    "title": "Hurston Dynamics Operative Authorization",
    "author": "Hurston Dynamics",
    "category": "Reputation",
    "type": "Text",
    "body": "This document signifies the recipient is now an authorized Hurston Dynamics OPERATIVE and that they are entitled to all related privileges including a 10% payment bonus.\n\nThey will maintain this title until their next evaluation where they will be rated on contract performance and various other benchmarks. At such a time they will either be demoted or granted the rank of Advanced Operative with additional privileges."
  },
  {
    "id": "hurston_junioragent_promotion",
    "title": "Hurston Dynamics Senior Contractor Authorization",
    "author": "Hurston Dynamics",
    "category": "Reputation",
    "type": "Text",
    "body": "This document signifies the recipient is now an authorized Hurston Dynamics SENIOR CONTRACTOR and that they are entitled to all related privileges including a 5% payment bonus.\n\nThey will maintain this title until their next evaluation where they will be rated on contract performance and various other benchmarks. At such a time they will either be demoted or granted the rank of Operative with additional privileges."
  },
  {
    "id": "bhg_certification_hard",
    "title": "Journeyman Tracker License (HRT)",
    "author": "Bounty Hunters Guild",
    "category": "Reputation",
    "type": "Text",
    "body": "This license issued by the Bounty Hunters Guild certifies that you are qualified to pursue and apprehend High-Risk Targets (HRT).\n\nYour qualification also allows you to pursue bounties for individuals whose current abilities and resources are unknown (?RT). These should be undertaken with caution."
  },
  {
    "id": "bhg_certification_super",
    "title": "Master Tracker License (ERT)",
    "author": "Bounty Hunters Guild",
    "category": "Reputation",
    "type": "Text",
    "body": "This license issued by the Bounty Hunters Guild certifies that you are qualified to pursue and apprehend Extreme-Risk Targets (ERT).\n\nYour qualification also allows you to pursue bounties for individuals whose current abilities and resources are unknown (?RT). These should be undertaken with caution."
  },
  {
    "id": "northrock_agent_demotion",
    "title": "Northrock Employment Status: Associate",
    "author": "Northrock Service Group",
    "category": "Reputation",
    "type": "Text",
    "body": "Logistics Officer Braden Corchado has recommended that your Northrock status be downgraded to ASSOCIATE.\n\nAt this employment tier you are entitled to the following benefits:\nN/A\n\nContinued negative performance reviews will result in your status and benefits being downgraded to a lower tier."
  },
  {
    "id": "northrock_probation_promotion",
    "title": "Northrock Employment Status: Associate",
    "author": "Northrock Service Group",
    "category": "Reputation",
    "type": "Text",
    "body": "Logistics Officer Braden Corchado has recommended that your Northrock status be upgraded to ASSOCIATE.\n\nAt this employment tier you are entitled to the following benefits:\nN/A\n\nContinued positive performance reviews will result in your status and benefits being upgraded to the next tier."
  },
  {
    "id": "northrock_applicant_promotion",
    "title": "Northrock Employment Status: Junior Associate",
    "author": "Northrock Service Group",
    "category": "Reputation",
    "type": "Text",
    "body": "Logistics Officer Braden Corchado has recommended that your Northrock status be upgraded to JUNIOR ASSOCIATE.\n\nAt this employment tier you are entitled to the following benefits:\nN/A\n\nContinued positive performance reviews will result in your status and benefits being upgraded to the next tier."
  },
  {
    "id": "northrock_junioragent_demotion",
    "title": "Northrock Employment Status: Junior Associate",
    "author": "Northrock Service Group",
    "category": "Reputation",
    "type": "Text",
    "body": "Logistics Officer Braden Corchado has recommended that your Northrock status be downgraded to JUNIOR ASSOCIATE.\n\nAt this employment tier you are entitled to the following benefits:\nN/A\n\nContinued negative performance reviews will result in your employment status being terminated."
  },
  {
    "id": "northrock_veteranagent_promotion",
    "title": "Northrock Employment Status: Lead Security Specialist",
    "author": "Northrock Service Group",
    "category": "Reputation",
    "type": "Text",
    "body": "Logistics Officer Braden Corchado has recommended that your Northrock status be upgraded to LEAD SECURITY SPECIALIST.\n\nAt this employment tier you are entitled to the following benefits:\n20% Pay Bonus\n\nContinued positive performance reviews will result in your maintaining this current high tier and benefits."
  },
  {
    "id": "northrock_junioragent_promotion",
    "title": "Northrock Employment Status: Security Agent",
    "author": "Northrock Service Group",
    "category": "Reputation",
    "type": "Text",
    "body": "Logistics Officer Braden Corchado has recommended that your Northrock status be upgraded to SECURITY AGENT.\n\nAt this employment tier you are entitled to the following benefits:\n5% Pay Bonus\n\nContinued positive performance reviews will result in your status and benefits being upgraded to the next tier."
  },
  {
    "id": "northrock_senioragent_demotion",
    "title": "Northrock Employment Status: Security Agent",
    "author": "Northrock Service Group",
    "category": "Reputation",
    "type": "Text",
    "body": "Logistics Officer Braden Corchado has recommended that your Northrock status be downgraded to SECURITY AGENT.\n\nAt this employment tier you are entitled to the following benefits:\n5% Pay Bonus\n\nContinued negative performance reviews will result in your status and benefits being downgraded to a lower tier."
  },
  {
    "id": "northrock_masteragent_demotion",
    "title": "Northrock Employment Status: Security Specialist",
    "author": "Northrock Service Group",
    "category": "Reputation",
    "type": "Text",
    "body": "Logistics Officer Braden Corchado has recommended that your Northrock status be downgraded to SECURITY SPECIALIST.\n\nAt this employment tier you are entitled to the following benefits:\n15% Pay Bonus\n\nContinued negative performance reviews will result in your status and benefits being downgraded to a lower tier."
  },
  {
    "id": "northrock_senioragent_promotion",
    "title": "Northrock Employment Status: Security Specialist",
    "author": "Northrock Service Group",
    "category": "Reputation",
    "type": "Text",
    "body": "Logistics Officer Braden Corchado has recommended that your Northrock status be upgraded to SECURITY SPECIALIST.\n\nAt this employment tier you are entitled to the following benefits:\n15% Pay Bonus\n\nContinued positive performance reviews will result in your status and benefits being upgraded to the next tier."
  },
  {
    "id": "northrock_agent_promotion",
    "title": "Northrock Employment Status: Senior Security Agent",
    "author": "Northrock Service Group",
    "category": "Reputation",
    "type": "Text",
    "body": "Logistics Officer Braden Corchado has recommended that your Northrock status be upgraded to SENIOR SECURITY AGENT.\n\nAt this employment tier you are entitled to the following benefits:\n10% Pay Bonus\n\nContinued positive performance reviews will result in your status and benefits being upgraded to the next tier."
  },
  {
    "id": "northrock_veteranagent_demotion",
    "title": "Northrock Employment Status: Senior Security Agent",
    "author": "Northrock Service Group",
    "category": "Reputation",
    "type": "Text",
    "body": "Logistics Officer Braden Corchado has recommended that your Northrock status be downgraded to SENIOR SECURITY AGENT.\n\nAt this employment tier you are entitled to the following benefits:\n10% Pay Bonus\n\nContinued negative performance reviews will result in your status and benefits being downgraded to a lower tier."
  },
  {
    "id": "northrock_probation_termination",
    "title": "Northrock Employment Status: Terminated",
    "author": "Northrock Service Group",
    "category": "Reputation",
    "type": "Text",
    "body": "Logistics Officer Braden Corchado has recommended that your Northrock employment status be TERMINATED.\n\nYou are no longer eligible to perform contracts on behalf of Northrock Service Group and any attempt to do so will not be tolerated."
  },
  {
    "id": "bhg_certification_cs3",
    "title": "Suspect Apprehension Certification",
    "author": "Bounty Hunters Guild",
    "category": "Reputation",
    "type": "Text",
    "body": "You are hereby certified by the Bounty Hunters Guild for Suspect Apprehension and are qualified to pursue and apprehend elusive individuals wanted by the law."
  },
  {
    "id": "bhg_certification_easy",
    "title": "Tracker Beginner's Permit (LRT)",
    "author": "Bounty Hunters Guild",
    "category": "Reputation",
    "type": "Text",
    "body": "This permit issued by the Bounty Hunters Guild certifies that you are qualified to pursue and apprehend Low-Risk Targets (LRT).\n\nYour qualification also allows you to pursue bounties for individuals whose current abilities and resources are unknown (?RT). These should be undertaken with caution."
  },
  {
    "id": "bhg_certification_medium",
    "title": "Tracker License (MRT)",
    "author": "Bounty Hunters Guild",
    "category": "Reputation",
    "type": "Text",
    "body": "This license issued by the Bounty Hunters Guild certifies that you are qualified to pursue and apprehend Moderate-Risk Targets (MRT).\n\nYour qualification also allows you to pursue bounties for individuals whose current abilities and resources are unknown (?RT). These should be undertaken with caution."
  },
  {
    "id": "bhg_certification_veryeasy",
    "title": "Tracker Training Permit (VLRT)",
    "author": "Bounty Hunters Guild",
    "category": "Reputation",
    "type": "Text",
    "body": "This permit issued by the Bounty Hunters Guild certifies that you are qualified to pursue and apprehend Very Low-Risk Targets (VLRT).\n\nYour qualification also allows you to pursue bounties for individuals whose current abilities and resources are unknown (?RT). These should be undertaken with caution."
  },
  {
    "id": "vaughn_outsider_promotion",
    "title": "Welcome Aboard",
    "author": "Vaughn",
    "category": "Reputation",
    "type": "Text",
    "body": "In light of you proving yourself more than capable , I wanted to formally welcome you to my employ and to make very clear two vital rules.\n\nThe first is that the details of who I am and what we do are extremely private. I expect you to maintain that privacy at all times. \n\nThe second is that I expect a certain level of professionalism from those whom I deem to work with. What you do in your own time is of course no of my concern, but when you are engaged in a contract you should endeavor to be efficient, timely, and discreet. \n\nFollow those criterion and there is every hope that we should have a long and fruitful partnership.\n\nSincerely,\nVaughn"
  },
  {
    "id": "reclaimer_captain_journal",
    "title": "[DRAFT] The Data as Promised",
    "author": "Personal Datapad - Cpt. A. Knox",
    "category": "Misc",
    "type": "Text",
    "body": "Sorry about the last minute price hike, but that's just the cost of doing business these days isn’t it? \n\nI recommend that you try to focus on the fact that at the end of the day you're still getting what you want. What's the harm if I'm getting what I want too? That's called a win-win in my book.\n\nLooking forward to working with you again in the future,\nArliss\n\n//** ATTACHED: < *ENCRYPTED DATA* // *ACCESS DENIED* /> **//",
    "missionSpecific": true
  },
  {
    "id": "reclaimer_civilian_journal",
    "title": "[SENT MESSAGE] Bye",
    "author": "Personal Datapad – B. Norris",
    "category": "Misc",
    "type": "Text",
    "body": "To: Tim Oishi\nFrom: Barry Norris\nSubject: Bye\n\nHey Love,\n\nI know I said I'd be home next week, but it's looking like I'm gonna have to break another promise. \n\nWe got hit and I took some fire. Managed to get away and hide, but I'm bleeding bad and if the rest of the crew are down, it's not going to be good. Doc said I didn't have any more regens in me, so this might be it. At least I managed to leave a little surprise for the bastards if they come after me.\n\nI'm sorry for everything I put you through, and I'm sorry I never got the chance to make it right. You were the best thing that ever happened to me and I should have treated you like it.\n\nIf I don't come back, you don't have to worry about doing a ceremony or anything for me. Never been my style. I just hope the next person you love is better than I was.\n\nLove,\nB",
    "missionSpecific": true
  },
  {
    "id": "reclaimer_crew_journal_02",
    "title": "[SENT MESSAGE] Chill Out",
    "author": "Personal Datapad – M. Brickley",
    "category": "Misc",
    "type": "Text",
    "body": "To: Tania Adlett\nFrom Marcel Brickley\nSubject: Chill Out\n\nTan,\n\nYou need to calm down. So, we screwed over the Nine Tails? Who cares? How are they going to find us? It's not like they can magically track their cargo. \n\nAnd anyway, when you think about it, it's really their own fault. People should learn to be more careful.  Like this last job with the data, why would they tell us how valuable it was if they didn't want to get screwed over? Far as I'm concerned, we're schooling them on how to behave for their next crew.\n\nMy suggestion? Worry about how you're going to spend all these credits were going to make. \n\n-Marcel",
    "missionSpecific": true
  },
  {
    "id": "reclaimer_engineer_gravity_journal",
    "title": "[SENT MESSAGE] Grav Gen Issues",
    "author": "Personal Datapad - J. Ramirez",
    "category": "Misc",
    "type": "Text",
    "body": "To: Captain Arliss Knox\nFrom: Judy Ramirez\nSubject: Grav Gen Issues\n\nHey Cap,\n\nBad news. That last little scuffle did more damage than I thought. The gravity generator's going to need a complete overhaul to get it working again, and that means we need to park up in a garage for a few days. \n\nSince I know we’re not going to do that until this job's done, and there’s a good chance the gravity's going to keep fritzing out on us which is less than ideal, so in the meanwhile, I went ahead and rigged the engineering console to allow anybody to do a hard reset of the system if they need to.\n\nFigure at least this way if I'm gunked up patching another part of the ship you all don't have to wait for me.\n\n-Judy",
    "missionSpecific": true
  },
  {
    "id": "reclaimer_crew_journal_01",
    "title": "[SENT MESSAGE] What Goes Around Comes Around",
    "author": "Personal Datapad - T. Adlett",
    "category": "Misc",
    "type": "Text",
    "body": "To: Marcel Brickley\nFrom: Tania Adlett\nSubject: What Goes Around Comes Around\n\nLook, I love credits as much as the next person, but I got a feeling what the Captain's been doing isn't going to fly for very long. All this double-crossing and blackmailing is going to catch up to him, and we're gonna be left holding the bag.  \n\nI think we should say something to him. I'd do it myself, but I know he listens to you. I'm not saying we need to go clean or anything, just be a little more careful with our dealings is all. I mean, you and I both know what the Nine Tails are capable of. Did we really need to get on their bad side?\n\nLet me know what you want to do,\nTania",
    "missionSpecific": true
  },
  {
    "id": "cleanair_journalentry",
    "title": "Alliance Aid",
    "category": "Misc",
    "type": "Text"
  },
  {
    "id": "shopinventoryalerts",
    "title": "Commodity Price Alerts",
    "author": "Trade & Development Division",
    "category": "Misc",
    "type": "Text",
    "body": "The following locations have issued adjusted commodity prices based on their current supply levels:"
  },
  {
    "id": "journalentry.bravo_backstory_1",
    "title": "Filtration Problem",
    "author": "Pauline Nesso",
    "category": "Misc",
    "type": "Text",
    "body": "/**MOBICONNECT.RETRIEVALSYSTEM.FRP…DATAFOUND**/\n\nTo: SASHA RUST\nFrom: Pauline Nesso\nSubject: Filtration Problem\n2945.11.07.11:23SET\n\nSir,\n\nI am afraid Kareah has not been cleared for habitation. I just got the estimate from the repair crew. It’s not good. The whole air filter system is going to need to be replaced and that’s going to take some time. Not to mention getting the extra expenditure cleared by Central is going to be a bit of a to-do after the struggle we had getting the last increase through the board.\n\nI’m afraid there is no way we can proceed with opening the station as planned, and, unless you object, I’m going to keep the patrols operating out of their existing posts and delay their transfers until we have a better grasp on the updated timeline.\n\nNot going to lie, it's a major setback. I know how much having this new facility operating meant to you. Darston and myself are going to do everything we can to help get us back on track. \n\nSee you tomorrow,\nPauline\n\nPauline Nesso\n\nFacilities Manager\nCrusader Security\nSecurity Post Kareah"
  },
  {
    "id": "fffinale_journalentry",
    "title": "Hunt Frontier Fighters",
    "category": "Misc",
    "type": "Text"
  },
  {
    "id": "asd_phase3intro",
    "title": "PROJECT HYPERION - Lab Notes",
    "author": "Dr. Logan Jorrit",
    "category": "Misc",
    "type": "Text",
    "body": "SITE-B, ONXY FACILITY\nAUTHOR: Dr. Logan Jorrit\n\nHYPOTHESIS\nWhile Humanity has embraced the technological marvel that is the ability to create imprints, they have missed the most important lesson from the Vanduul that we’ve stolen it from – Recombinant Evolution. The Vanduul freely combine imprints and genetic information from their best warriors to create their next generation of fighters. I propose that Humans, with a few slight genetic adjustments, could likewise make an evolutionary leap forward through imprint modification. Think of it, with each imprint, we refine and evolve ourselves.\n\nEXPERIMENT\nUtilizing the unique properties of Vanduul biofluid, I will modify a Human imprint via the introduction of a catalyst and reagent. The result will be a viable recombinant that is not only suitable for regeneration, but that improves upon the original source.\n\nMATERIALS\nVanduul Biofluid - It is important that this comes from a fresh host. Thankfully, I have been able to acquire a supplier.\n\nCatalysts - taking advantage of the research done previously in the facility, I have been able to formulate three strong candidates:\n* CTLST-XTL \n* CTLST-PWL\n* CTLST-RGL\n\nReagents – The unique energy signature of the power core has proven ideal for creating reagents dynamic enough to trigger the necessary reaction in the Vanduul biofluid. There are currently three reagent formulations that have proven most suitable:\n* REAGNT-01\n* REAGNT-02\n* REAGNT-03\n\nExperimental Procedure\n- Select a Catalyst and a Reagent from the terminal.\n- One the recombinant is ready, the data will be available for download and the physical imprint will be sent to the facility freight elevator for storage until it is ready to be processed.\n\nRESULTS\nThese nine recombinant samples have so far shown the most promise:\n* RCMBNT-XTL-1 \n* RCMBNT-XTL-2\n* RCMBNT-XTL-3\n* RCMBNT-PWL-1\n* RCMBNT-PWL-2 \n* RCMBNT-PWL-3\n* RCMBNT-RGL-1\n* RCMBNT-RGL-2\n* RCMBNT-RGL-3",
    "missionSpecific": true
  },
  {
    "id": "yardrushandfiresale",
    "title": "Pyro Resupply Completion Tracking",
    "category": "Misc",
    "type": "Text",
    "body": "The people of Pyro were left reeling after the brutal attack by the vigilante group the Frontier Fighters. Track your progress below to see how much you’ve helped to resupply the system. \n\nComplete ‘Strategic Reserve’ contracts for Citizens for Pyro or ‘Out of Stock’ contracts for the Headhunters to earn credit towards a reward. (Note - Resource Resupply contracts can be completed in the Pyro System and the Stanton System.) The more contracts complete the more rewards you’ll earn."
  },
  {
    "id": "goblingathering_journalentry",
    "title": "Second Life Resource Drive",
    "category": "Misc",
    "type": "Text"
  }
];
