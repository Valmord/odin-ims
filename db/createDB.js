const { Client } = require("pg");

const process = require("node:process");
require("dotenv").config();
const { DATABASE, DB_USER, DB_PASS, DB_HOST, DB_PORT } = process.env;

const createTablesSQL = `
CREATE TABLE IF NOT EXISTS categories  (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 category_name VARCHAR (30),
 friend_name VARCHAR (50)
);

CREATE TABLE IF NOT EXISTS items (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 name VARCHAR (255),
 description TEXT,
 price DECIMAL(10, 2),
 inventory int,
 category_id INT,
 FOREIGN KEY (category_id) references categories(id)
);
`;

const populateCategoriesSQL = `
  INSERT INTO categories (category_name) VALUES 
  ('strategy', 'Strategy Games'), ('rpg', 'Role Playing Games'), ('party', 'Party Games'), ('minis', 'Miniatures'), ('dice', 'Dice Sets'), ('misc', 'Misc. Items');
`;

const populateStrategyGameSQL = `
  INSERT INTO items (name, description, price, inventory, category_id) VALUES
  ('Chess', 'A classic two-player game where the goal is to checkmate the opponent''s king.', 19.99, 200, 1),
  ('Catan', 'A strategy game where players collect resources and use them to build settlements and cities on the island of Catan.', 34.99, 150, 1),
  ('Ticket to Ride', 'A railroad-themed game where players try to complete routes across a map while competing against others.', 39.99, 180, 1),
  ('Risk', 'A classic game of global domination, where players use armies and strategy to conquer continents and defeat their opponents.', 29.99, 120, 1),
  ('Pandemic', 'A cooperative game where players work together to stop global disease outbreaks.', 44.99, 100, 1),
  ('7 Wonders', 'A card drafting game where players build civilizations and compete for victory points.', 39.99, 140, 1),
  ('Carcassonne', 'A tile-placement game where players build cities, roads, and fields to score points.', 29.99, 170, 1),
  ('Twilight Struggle', 'A two-player game about the Cold War, where players control either the USA or the USSR and try to gain influence over the world.', 49.99, 80, 1),
  ('The Settlers of Catan', 'A classic resource management and settlement building game where players trade resources to build roads and settlements.', 39.99, 150, 1),
  ('Agricola', 'A farming game where players manage a farm and try to earn points by raising animals and planting crops.', 59.99, 60, 1),
  ('Dominion', 'A deck-building game where players try to create the best deck by acquiring cards from a central pool.', 24.99, 130, 1),
  ('Power Grid', 'A game where players build power plants and try to supply energy to cities while managing resources.', 44.99, 90, 1),
  ('Puerto Rico', 'A game where players manage plantations and construct buildings to earn victory points in colonial Puerto Rico.', 39.99, 120, 1),
  ('Splendor', 'A game about collecting gems and using them to buy development cards, which grant points and special abilities.', 34.99, 110, 1),
  ('Twilight Imperium', 'A grand strategy game of space exploration, political intrigue, and warfare.', 99.99, 50, 1),
  ('Eclipse', 'A game that blends exploration, resource management, and epic space battles.', 59.99, 70, 1),
  ('Small World', 'A game where players control different fantasy races trying to conquer territory in a world that is too small for them.', 34.99, 140, 1),
  ('Terraforming Mars', 'A game where players work to terraform Mars, managing resources and building cities.', 49.99, 130, 1),
  ('Star Realms', 'A fast-paced deck-building game where players build powerful combos to defeat each other.', 19.99, 160, 1),
  ('Tigris & Euphrates', 'A game of ancient Mesopotamian civilization-building, involving strategy, alliances, and conflict.', 39.99, 100, 1),
  ('The Resistance: Avalon', 'A hidden role game where players work as a team or deceive others to complete missions.', 29.99, 150, 1),
  ('7 Wonders: Duel', 'A two-player version of 7 Wonders, where players build civilizations through drafting cards and engaging in battles.', 29.99, 170, 1),
  ('Hive', 'A two-player abstract strategy game where players try to surround the opponent''s queen bee while avoiding being surrounded themselves.', 19.99, 180, 1),
  ('Through the Ages: A New Story of Civilization', 'A civilization-building game where players develop their societies by acquiring technology, military strength, and culture.', 59.99, 90, 1),
  ('Shogun', 'A Japanese-themed strategy game where players compete for control over feudal Japan by using armies and politics.', 44.99, 80, 1),
  ('Lord of the Rings: The Confrontation', 'A two-player strategy game where one player controls the forces of good and the other controls the forces of evil in Middle-earth.', 29.99, 150, 1),
  ('Stone Age', 'A worker-placement game set in the prehistoric age, where players gather resources and build their civilizations.', 39.99, 120, 1),
  ('Memoir 44', 'A World War II strategy game that allows players to recreate famous battles from history.', 49.99, 70, 1),
  ('Twilight Imperium: Fourth Edition', 'A grand space strategy game where players control unique factions and compete for galactic dominance.', 99.99, 60, 1),
  ('Cosmic Encounter', 'A game where players use unique alien powers to negotiate, deceive, and conquer the galaxy.', 44.99, 140, 1);
`;

const populateRpgGameSQL = `
INSERT INTO items (name, description, price, inventory, category_id) VALUES
('Dungeons & Dragons', 'A classic tabletop role-playing game where players create characters and embark on adventures in a fantasy world.', 49.99, 200, 2),
('Pathfinder', 'A fantasy role-playing game based on Dungeons & Dragons, offering deep character customization and exploration.', 59.99, 150, 2),
('Shadowrun', 'A cyberpunk-themed role-playing game set in a dystopian future where players navigate corporations, hackers, and magic.', 44.99, 120, 2),
('Star Wars RPG', 'A role-playing game set in the Star Wars universe, where players create characters and participate in epic space adventures.', 39.99, 100, 2),
('Cyberpunk 2020', 'A tabletop RPG set in a futuristic world of high-tech, low-life, where players take on the role of mercenaries or hackers.', 49.99, 130, 2),
('Warhammer Fantasy Roleplay', 'A dark fantasy RPG set in the Warhammer world, where players take on roles in a gritty, war-torn setting.', 59.99, 90, 2),
('Fiasco', 'A role-playing game focused on collaborative storytelling where players build a story and deal with its tragic consequences.', 24.99, 150, 2),
('GURPS (Generic Universal RolePlaying System)', 'A flexible role-playing system that allows players to create characters in any setting or genre.', 39.99, 110, 2),
('Dungeon World', 'A fantasy role-playing game inspired by the classics, with fast, flexible rules for storytelling and combat.', 29.99, 120, 2),
('Call of Cthulhu', 'A horror role-playing game where players confront the madness and terror of the Cthulhu Mythos.', 44.99, 80, 2),
('Blades in the Dark', 'A role-playing game where players form a crew of criminals in a dark fantasy city, completing heists and dealing with the consequences.', 39.99, 140, 2),
('Mutants & Masterminds', 'A superhero-themed role-playing game where players create characters with superpowers and fight crime or evil forces.', 54.99, 150, 2),
('Savage Worlds', 'A fast-paced role-playing system that allows players to create characters and adventures in a variety of genres.', 34.99, 130, 2),
('Exalted', 'A high-fantasy RPG where players take on the role of powerful demigods in an epic struggle against the forces of darkness.', 59.99, 100, 2),
('The One Ring', 'A role-playing game set in J.R.R. Tolkien''s Middle-earth, where players take on the roles of adventurers in the land of the hobbits and elves.', 49.99, 110, 2),
('Eclipse Phase', 'A sci-fi role-playing game set in a post-apocalyptic world where players explore transhumanism, conspiracy, and mystery.', 59.99, 80, 2),
('Starfinder', 'A space-fantasy role-playing game where players explore the stars and battle monsters, pirates, and intergalactic evil forces.', 49.99, 130, 2),
('Vampire: The Masquerade', 'A gothic horror role-playing game where players take on the role of vampires, navigating a world of political intrigue and dark secrets.', 44.99, 150, 2),
('Dark Heresy', 'A grimdark RPG where players take on the role of acolytes working for the Inquisition in the Warhammer 40K universe.', 49.99, 120, 2),
('Monster of the Week', 'A role-playing game inspired by supernatural TV shows, where players hunt down monsters and solve mysteries.', 24.99, 140, 2),
('Mage: The Ascension', 'A role-playing game set in a world where magic is real and players take on the role of mages with supernatural abilities.', 54.99, 90, 2),
('Legend of the Five Rings', 'A samurai-themed RPG set in a fictional world inspired by feudal Japan, with a focus on honor, politics, and warfare.', 49.99, 120, 2),
('Pendragon', 'A role-playing game set in Arthurian Britain, where players take on the role of knights striving to uphold their honor and serve King Arthur.', 39.99, 150, 2),
('Fellowship', 'A cooperative storytelling RPG where players take on the role of adventurers embarking on a quest in a dangerous world.', 29.99, 130, 2),
('Hero System', 'A flexible RPG system where players create superheroes or adventurers in any genre by building their own powers and abilities.', 44.99, 100, 2),
('Star Wars: Edge of the Empire', 'A Star Wars RPG where players take on the roles of smugglers, bounty hunters, or rebels in the Star Wars universe.', 49.99, 110, 2),
('Tales from the Loop', 'A sci-fi role-playing game inspired by the art of Simon Stålenhag, where players take on the role of kids in an alternate 1980s.', 34.99, 120, 2),
('Iron Kingdoms RPG', 'A steampunk-themed RPG where players navigate a world of magic, technology, and warfare.', 39.99, 140, 2),
('The Sprawl', 'A cyberpunk RPG where players take on the roles of hackers, mercenaries, and rebels in a dystopian future.', 34.99, 100, 2),
('The Burning Wheel', 'A fantasy RPG with a strong focus on character development and intricate role-playing.', 49.99, 120, 2),
('Torchbearer', 'A medieval fantasy RPG that focuses on survival, resource management, and exploring dangerous ruins and dungeons.', 39.99, 130, 2),
('Lancer', 'A sci-fi RPG where players pilot giant mechs and battle in a galaxy-spanning war.', 59.99, 70, 2);
`;

const PopulatePartyGameSQL = `
INSERT INTO items (name, description, price, inventory, category_id) VALUES
('Cards Against Humanity', 'A party game for horrible people, where players fill in the blanks of sentences with humorous and often inappropriate answers.', 29.99, 200, 3),
('Codenames', 'A word-based party game where players give one-word clues to help their team guess the right words on the board.', 19.99, 150, 3),
('Exploding Kittens', 'A party card game where players try to avoid drawing an exploding kitten card, or else they are out of the game.', 24.99, 180, 3),
('What Do You Meme?', 'A party game where players compete to create the funniest memes using caption cards and photo cards.', 29.99, 120, 3),
('Telestrations', 'A drawing and guessing game where players alternately draw a word and guess what it is based on the previous person''s drawing.', 34.99, 100, 3),
('Monopoly Deal', 'A fast-paced card game version of the classic Monopoly game, where players collect properties and try to avoid getting bankrupt.', 14.99, 150, 3),
('Pictionary', 'A classic drawing game where players sketch clues to help their teammates guess the word or phrase.', 19.99, 200, 3),
('Uno', 'A popular card game where players try to get rid of all their cards by matching them to the top card in the discard pile.', 9.99, 250, 3),
('Taboo', 'A word-guessing party game where players try to get their teammates to guess the word on the card without using certain forbidden words.', 24.99, 170, 3),
('Catchphrase', 'A fast-paced party game where players try to get their teammates to guess a word or phrase based on clues given by the other player.', 29.99, 140, 3),
('Tigris & Euphrates', 'A strategy-based party game where players build civilizations, but must carefully balance conflicts and resource management.', 39.99, 80, 3),
('Jenga', 'A classic game where players take turns removing wooden blocks from a stack without toppling the tower.', 19.99, 200, 3),
('The Resistance', 'A party game of deception and deduction, where players try to figure out who the spies are before they sabotage the mission.', 24.99, 120, 3),
('Charades', 'A classic party game where players act out words or phrases without speaking, while others try to guess what they are acting out.', 14.99, 180, 3),
('Heads Up!', 'A guessing game where players hold a phone on their forehead and guess the word displayed based on clues from their teammates.', 19.99, 150, 3),
('Spaceteam', 'A cooperative game where players must shout out technical jargon to help keep their spaceship running while fixing random issues.', 29.99, 100, 3),
('Pictionary: Card Game', 'A new twist on the classic Pictionary game, where players sketch and guess pictures on cards to complete their mission.', 19.99, 130, 3),
('Smart Ass', 'A trivia game where the first person to shout out the correct answer gets the point, but there are no boring questions!', 24.99, 160, 3),
('Sequence', 'A combination of cards and boards, where players try to form sequences by placing chips on a grid of face-up cards.', 27.99, 110, 3),
('Clue', 'A mystery-solving game where players gather clues to figure out who committed the crime, with what weapon, and in which room.', 29.99, 150, 3),
('King of Tokyo', 'A dice game where players take on the role of giant monsters trying to destroy the city and defeat each other.', 39.99, 90, 3),
('Sushi Go!', 'A fast-paced card game where players try to collect the best combination of sushi dishes to win the most points.', 19.99, 200, 3),
('Dixit', 'A storytelling game where players use abstract illustrations on cards to tell stories, while others guess which card matches the story.', 34.99, 120, 3),
('Beat the Parents', 'A party game where kids try to answer questions their parents might not know, while parents try to guess the answers kids would give.', 24.99, 140, 3),
('Balderdash', 'A game of bluffing and creativity, where players try to come up with the most convincing definitions of obscure words.', 29.99, 100, 3),
('Wavelength', 'A party game of perception where players try to guess where a hidden target is on a spectrum between two extremes.', 29.99, 150, 3),
('Pitchstorm', 'A party game where players try to pitch movie ideas, using cards for characters, plots, and twists.', 24.99, 120, 3),
('Cranium', 'A party game that combines trivia, drawing, acting, and word puzzles to challenge players in various ways.', 39.99, 90, 3),
('Criss Cross', 'A competitive word game where players try to complete a grid of intersecting words by guessing letters.', 19.99, 180, 3),
('Munchkin', 'A humorous card game where players battle monsters, gain treasures, and try to be the first to reach level 10.', 24.99, 110, 3),
('Liars Dice', 'A game of deception where players roll dice and bluff about their results, trying to avoid being caught in a lie.', 14.99, 160, 3),
('Risk', 'A classic game of global domination, where players use armies and strategy to conquer continents and defeat their opponents.', 29.99, 120, 3),
('Monopoly', 'The classic game of buying properties, building houses, and bankrupting your opponents.', 29.99, 250, 3),
('The Game of Life', 'A family board game where players navigate through life’s milestones, including jobs, marriage, and children.', 24.99, 200, 3),
('Tigris & Euphrates', 'A game of ancient Mesopotamian civilization-building, involving strategy, alliances, and conflict.', 39.99, 100, 3),
('Taco Cat Goat Cheese Pizza', 'A fast-paced card game where players try to be the first to slap the deck in the correct sequence based on the cards shown.', 12.99, 170, 3),
('Superfight', 'A party game where players create absurd characters and battle to see who would win in a fight, using ridiculous cards.', 24.99, 130, 3),
('Rory’s Story Cubes', 'A storytelling game where players roll dice with pictures on them to create fun stories.', 19.99, 140, 3),
('Puzzling Adventures', 'A cooperative puzzle-solving game where players must work together to solve riddles and puzzles under time pressure.', 29.99, 100, 3),
('Happy Salmon', 'A fast-paced card game where players try to complete actions and high-five each other before anyone else.', 19.99, 150, 3),
('Twister', 'The classic physical game where players must twist their bodies into different positions on a mat according to the colors they are told.', 19.99, 220, 3),
('Boggle', 'A word search game where players try to find as many words as possible in a grid of random letters.', 14.99, 180, 3),
('Activity', 'A party game that mixes drawing, miming, and word guessing to keep everyone engaged and laughing.', 29.99, 110, 3),
('Scattergories', 'A game where players try to name things within specific categories starting with a given letter, but with a time limit.', 24.99, 160, 3),
('Chameleon', 'A party game where players must find the hidden chameleon who is pretending to be someone else.', 19.99, 150, 3),
('Loopin’ Louie', 'A fast-paced game where players try to protect their chickens from Louie as he flies around in a plane.', 24.99, 100, 3),
('Cranium Turbo', 'A fast-paced version of Cranium where players race to complete tasks and solve challenges before their opponents.', 29.99, 120, 3),
('Wits & Wagers', 'A trivia game where players bet on the best answers to questions in various categories.', 29.99, 140, 3),
('Clue Jr.', 'A kid-friendly version of the classic Clue game where players try to figure out who stole the cookies from the cookie jar.', 19.99, 170, 3);
`;

const populateMiniaturesSQL = `
INSERT INTO items (name, description, price, inventory, category_id) VALUES
('Medieval Knight', 'A highly detailed medieval knight miniature, perfect for RPG games.', 9.99, 150, 4),
('Fantasy Elf Archer', 'An elf archer miniature, ideal for fantasy role-playing games.', 7.99, 130, 4),
('Dwarf Warrior', 'A dwarf warrior miniature, great for RPG or tabletop strategy games.', 8.49, 120, 4),
('Dragon Figurine', 'A miniature dragon figurine for use in fantasy RPG games.', 19.99, 80, 4),
('Wizard Miniature', 'A wizard miniature with a magical staff, perfect for wizard characters in RPGs.', 10.99, 90, 4),
('Orc Warrior', 'An orc warrior miniature for your tabletop RPGs, with detailed armor and weapon.', 7.99, 150, 4),
('Zombie Horde Set', 'A set of zombie miniatures for horror-themed RPG campaigns.', 15.99, 100, 4),
('Elf Mage', 'An elegant elf mage miniature, suitable for high-fantasy role-playing games.', 12.99, 110, 4),
('Goblin Scout', 'A mischievous goblin scout miniature for RPG encounters.', 6.99, 140, 4),
('Undead Knight', 'An undead knight miniature for dark fantasy RPG settings.', 13.99, 60, 4),
('Berserker Barbarian', 'A barbarian berserker miniature, perfect for high-adventure tabletop games.', 11.99, 100, 4),
('Dragonborn Fighter', 'A dragonborn fighter miniature with armor and a weapon for your campaigns.', 14.99, 85, 4),
('Troll Monster', 'A giant troll miniature to be used as a monstrous enemy in RPGs.', 18.99, 75, 4),
('Halfling Rogue', 'A halfling rogue miniature with a dagger, ideal for stealthy RPG adventures.', 8.49, 120, 4),
('Giant Spider', 'A large spider miniature for creepy RPG dungeon encounters.', 9.99, 95, 4),
('Knight of the Realm', 'A knight of the realm miniature, perfect for heroic campaigns.', 11.99, 60, 4),
('Fairy Princess', 'A delicate fairy princess miniature for whimsical RPG settings.', 12.49, 110, 4),
('Vampire Lord', 'A dark vampire lord miniature for gothic-themed RPG campaigns.', 16.99, 80, 4),
('Lich King', 'A Lich King miniature, a powerful and sinister figure for high-level campaigns.', 17.99, 70, 4),
('Giant Troll', 'A towering troll miniature, ideal for giant-themed campaigns in your RPG.', 21.99, 40, 4);
`;

const populateDiceSetsSQL = `
INSERT INTO items (name, description, price, inventory, category_id) VALUES
('Standard 7-Die RPG Set', 'A standard 7-die set for RPGs, includes d4, d6, d8, d10, d12, d20, and a percentile die.', 9.99, 150, 5),
('Gemini 7-Die RPG Set', 'Gemini dice set featuring multi-color swirls. Perfect for your next RPG session.', 12.99, 130, 5),
('Chessex Translucent Polyhedral Dice Set', 'A translucent 7-die set for RPGs, with clear and vibrant colors.', 11.99, 140, 5),
('Metal Dice Set (Silver)', 'A set of metal dice with a sleek silver finish, ideal for a more premium RPG experience.', 29.99, 80, 5),
('Metal Dice Set (Gold)', 'A gold-plated metal dice set for RPGs, perfect for those looking for something fancy.', 34.99, 70, 5),
('Glow-in-the-Dark Dice Set', 'A set of glow-in-the-dark dice, perfect for night-time RPG gaming.', 14.99, 100, 5),
('Wooden Dice Set', 'A set of wooden dice with carved numbers. Great for a more natural feel in tabletop games.', 19.99, 50, 5),
('Pearlized Dice Set', 'A pearlized dice set with beautiful swirls. Great for RPG enthusiasts looking for a unique look.', 15.99, 110, 5),
('Dice Set for Dungeons & Dragons', 'A custom 7-die set tailored for Dungeons & Dragons. Includes standard polyhedral dice.', 13.99, 120, 5),
('Metallic 7-Die Dice Set', 'A shiny, metallic 7-die set that''s perfect for those who love premium feel dice.', 16.99, 90, 5),
('Rainbow Dice Set', 'A vibrant rainbow-colored set of dice, perfect for adding color to your RPG experience.', 12.49, 140, 5),
('Classic 7-Die RPG Set (Black and White)', 'A simple black and white 7-die RPG set, ideal for classic RPG games.', 8.99, 150, 5),
('Frosted Dice Set', 'A frosted, semi-transparent 7-die set, perfect for your next epic adventure.', 10.99, 130, 5),
('Shadow Dice Set', 'A shadowy set of dice with black and silver accents. Perfect for mysterious RPG characters.', 13.49, 100, 5),
('Infinity Dice Set', 'A futuristic-looking dice set designed for sci-fi RPGs, includes all 7 dice.', 18.99, 80, 5),
('RPG Dice Set (Metal Green)', 'A set of green metallic dice designed for use in tabletop RPGs.', 27.99, 60, 5),
('Chessex Opaque 7-Die RPG Set', 'A solid-colored opaque dice set. Reliable and simple, with no frills for RPG players.', 10.99, 140, 5),
('Polyhedral Dice Set (Transparent Red)', 'A transparent red polyhedral set of dice, great for RPG use.', 13.99, 120, 5),
('Dice Set for Pathfinder', 'A 7-die set designed specifically for Pathfinder RPGs. Includes extra dice for those special rolls.', 14.99, 110, 5),
('Blacklight Dice Set', 'A set of dice that glow under blacklight. Fun for late-night RPG sessions and conventions.', 16.99, 90, 5);
`;

const populateMiscItemsSQL = `
INSERT INTO items (name, description, price, inventory, category_id) VALUES
('Dice Tray', 'A leather dice tray for rolling dice without losing them on the table.', 19.99, 150, 6),
('Game Master Screen', 'A Game Master screen for RPGs, useful for keeping secrets from your players.', 24.99, 100, 6),
('Custom Dice Bags', 'A set of custom embroidered dice bags to carry your dice in style.', 14.99, 120, 6),
('Deck Box', 'A high-quality box to store your collectible card game decks safely and securely.', 12.99, 130, 6),
('Tabletop Game Timer', 'A sand timer or digital timer designed to help keep your tabletop games on track.', 9.99, 110, 6),
('RPG Miniature Base Inserts', 'A set of miniature base inserts for RPG figures, helps customize your miniatures.', 7.99, 150, 6),
('Portable Game Mat', 'A roll-up portable game mat for use in RPGs and tabletop games.', 29.99, 80, 6),
('Card Sleeves (100 pack)', 'A 100-pack of high-quality card sleeves to protect your cards during play and storage.', 5.99, 200, 6),
('Miniature Paint Set', 'A set of paints specifically designed for painting RPG miniatures.', 19.99, 90, 6),
('Game Night Snack Pack', 'A fun snack pack to enjoy during your game nights, includes chips, candy, and drinks.', 15.99, 60, 6),
('Board Game Storage Solution', 'A customizable storage solution for your board games, designed to organize pieces and cards.', 25.99, 50, 6),
('Tabletop RPG Bookstand', 'A bookstand for RPG books to hold your rulebooks open while you play.', 12.99, 120, 6),
('D20 Shaped Keychain', 'A keychain shaped like a D20 die, perfect for any RPG enthusiast.', 6.99, 180, 6),
('Board Game Expansion Pack', 'An expansion pack for popular strategy board games to enhance your gaming experience.', 19.99, 70, 6),
('RPG Character Sheets', 'A set of blank RPG character sheets for your next adventure.', 2.99, 200, 6),
('Miniature Storage Case', 'A compact case for storing your painted RPG miniatures safely.', 22.99, 50, 6),
('RPG Dice Tower', 'A dice tower to roll your dice in a fun and organized way, reducing dice rolls interference.', 18.99, 90, 6),
('Board Game Organizer Trays', 'Organize your board game pieces with these insert trays for easy sorting and storage.', 14.99, 130, 6),
('Dungeon Tiles Set', 'A set of modular dungeon tiles for RPG campaigns, perfect for creating custom dungeons.', 29.99, 60, 6),
('Game Night Party Pack', 'A fun collection of party games and accessories to make your game night unforgettable.', 39.99, 40, 6);
`;

async function setupDatabase() {
  console.log("...seeding");

  const client = new Client({
    connectionString: `postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DATABASE}`,
  });
  try {
    await client.connect();
    await client.query(createTablesSQL);
    await client.query(populateCategoriesSQL);
    await client.query(populateStrategyGameSQL);
    await client.query(populateRpgGameSQL);
    await client.query(PopulatePartyGameSQL);
    await client.query(populateMiniaturesSQL);
    await client.query(populateDiceSetsSQL);
    await client.query(populateMiscItemsSQL);

    console.log("Table created and data inserted successfully!");
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await client.end();
  }
  console.log("done");
}

setupDatabase();
