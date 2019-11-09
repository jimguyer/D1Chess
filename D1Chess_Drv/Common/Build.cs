using System;
using System.Collections.Generic;
using System.Text;

namespace D1Chess_Srv.Common
{
    public static class Build
    {
        public static string UserIdFromEmailAddress(string pEmailAddress)
        {
            var UserId = new StringBuilder();
            foreach (char c in pEmailAddress)
            {
                if ((int)c >= 65 && (int)c <= 90) { UserId.Append(c); continue; }
                if ((int)c >= 97 && (int)c <= 122) { UserId.Append(c); continue; }
                if ((int)c == 46) { UserId.Append("_"); continue; }
                if ((int)c == 64) break;
            }
            return UserId.ToString();
        }
        public static string UserId()
        {
            #region var adjectives = new List<string>()
            var adjectives = new List<string>() {
                "Black", "Blue", "Red", "Purple", "Gray", "Grey", "Dark", "White",
                "East", "North", "South", "West", "Fire", "Wind", 
                "First", "Top", "High","Low", "Hot", 
                "Flat", "Rigid", "Straight", "Stiff",
                "Acid", "Blood", "Ice", "Icy", "Fire", "Water", "Smoke", "Snow",
                "Alpha", "Beta", "Delta", "Zeta", "Lamba", "Omega", 
                "Big", "Deep","Epic", "Fast","Strong", "Wild",
                "Elder", "First", "Speed", "Swift", 
                "Bark", "Jaz", "Jax", "Blaze", "Drift", 
                "Coal", "Chrome" ,"Clay", "Gold", "Golden", "Iron", "Jade", "Mox", "Opal", "Pearl", "Ruby", "Silver", "Steel", "Rock", "Stone", 
                "Magic", "Mind", "Time", "Wish",
                "Dawn", "Solar", "Night",
                "Bitter", "Power", "Ready", "Slip", "Sour", "Sweet", "Crux", 
            };
            #endregion

            #region var nouns = new List<string>()
            var nouns = new List<string>() {
                "Ace", "King", "Queen", "Jack", "Rook", "Bishop", "Knight","Guard", "Fighter", "Warrior",
                "Cleric", "Druid", "Mage", "Oracle", "Paladin", "Slayer", "Stiker",
                "Bard", "Boss", "Chief", "Duke", "Pirate", "Hero", "Hulk", "Man", "Minstrel", "Monarch", "Mr", "Ninja","Thug", "Zulu",
                "Spider", "Hornet", "Wasp", 
                "Ape", "Bat", "Bear", "Boar", "Eel", "Elk", "Fox", "Dragon", "Horse", "Lion", "Mule", "Rooster", "Snake", "Steed", "Tiger", "Wolf",
                "Albino", "Elf", "Dwarf",
                "Goblin", "Golem","Harpy", "Hulk","Hydra", "Kobold", "Giant", "Hobbit", "Orc", "Troll", "Wight","Wraith","Yeti","Zombie",
                "Bird", "Crow", "Dove", "Falcon", "Eagle", "Hawk", "Raven", 
                "Orca", "Shark", 
                "Bone", "Eye", "Eyes", "Fist", "Hand", "Hands", "Halo","Jinx", "Muse", "Riff",
                "Armor", "Axe", "Blade", "Dagger", "Dart", "Edge", "Knife", "Stick", "Sword",
                "Bomb", "Bottle", "Coin", "Drum", "Fife", "Razor",
                "Atom", "Axis", "Comet", "Moon", "Nova", "Sun", "Star", "Vega",
                "Leaf", "Moss", "Root", "Rose", "Seed", "Thorn",
                "Barb", "Box", "Cube", "Dice", "Drum", "Gate", "Peak","Spike", "Stick",
                "Heat", "Risk", "Surf", "Trap", "Spring", 
                "Cape", "Clan", "Mask",
                "Lust", "Mood", "Rage", "Riot","Trek", "Vibe",
                "Slip", "Snap", "Spike","Sting", "Strike", "Omen", "Opus", "Wisp", "Vamp",
                "Branch", "Leaf", "Tree", "Trunk", "Wood", "Root", "Limb", "Rod", "Fork", 
                "Bomb", "Thunder", 
            };
            #endregion


            var random = new Random();

            return adjectives[random.Next(adjectives.Count)] + nouns[random.Next(nouns.Count)];
            //return "1234";
        }
        public static string Password()
        {
            #region  var syllables = new List<string>()
            var syllables = new List<string>() {
                "Add", "Age", "Air", "Ant", "Any", "Ape", "Arm", "Art", "Ate", "Axe", //010
                "Bad", "Bag", "Bar", "Bat", "Bed", "Bee", "Beg", "Bid", "Big", "Boa", //020
                "Bow", "Box", "Boy", "Bra", "Bud", "Bug", "Bum", "Bun", "Bus", "Buy", //030
                "Cab", "Can", "Cap", "Car", "Cat", "Cop", "Cow", "Cry", "Cup", "Cut", //040
                "Dam", "Dee", "Den", "Dew", "Dig", "Dim", "Dip", "Doc", "Dog", "Dry", //050
                "Ear", "Eat", "Eel", "Egg", "Ego", "Elf", "Elk", "End", "Eon", "Eye", //060
                "Fab", "Fad", "Fan", "Far", "Fat", "Fax", "Fed", "Fee", "Few", "Fig", //070
                "Fin", "Fit", "Fix", "Fly", "Foe", "Fog", "Fox", "Fry", "Fun", "Fur", //080
                "Gap", "Gas", "Gee", "Gel", "Gem", "Goo", "Gum", "Gun", "Gut", "Guz", //090
                "Hag", "Ham", "Hay", "Hee", "Hen", "Hex", "Hip", "Hit", "Hoe", "Hog", //100
                "Hop", "Hot", "Hug", "Hum", "Ice", "Imp", "Ink", "Jab", "Jam", "Jar", //110
                "Jaw", "Jee", "Jig", "Job", "Jog", "Jot", "Joy", "Jug", "Jub", "Jut", //120
                "Kee", "Key", "Kid", "Kin", "Lab", "Lad", "Law", "Lee", "Leg", "Lid", //130
                "Lip", "Lug", "Lum", "Mad", "Man", "Map", "Mat", "May", "Mee", "Men", //140
                "Met", "Mix", "Mob", "Mow", "Mud", "Mug", "Net", "New", "Nip", "Nod", //150
                "Now", "Nut", "Nak", "Nar", "Nat", "Oil", "Old", "One", "Orb", "Orc", //160
                "Ore", "Out", "Owl", "Own", "Pad", "Pal", "Pan", "Pat", "Paw", "Pay", //170
                "Pea", "Peg", "Pen", "Pic", "Pie", "Pig", "Pin", "Pit", "Pod", "Pop", //180
                "Pot", "Pub", "Pug", "Pup", "Rad", "Rag", "Ram", "Rat", "Red", "Ree", //190
                "Ree", "Ref", "Rib", "Rig", "Rim", "Rip", "Rod", "Rot", "Row", "Rub", //200
                "Rug", "Rum", "Run", "Rut", "Sad", "Sag", "Sap", "Saw", "Sax", "Sea", //210
                "See", "Set", "sew", "sex", "She", "Shy", "Sir", "Sis", "Sit", "Six", //220
                "Ski", "Sky", "Sly", "Sob", "Sod", "Sox", "Soy", "Spa", "Sun", "Suv", //230
                "Tab", "Tag", "Tan", "Tap", "Tar", "Tax", "Tea", "Tee", "Tie", "Tin", //240
                "Tip", "Toe", "Ton", "Top", "Tot", "Tow", "Toy", "Tub", "Tug", "Two", //250
                "Urn", "Vac", "Van", "Vat", "Vee", "Vet", "Vex", "Vow", "Wad", "Wag", //260
                "Wax", "Way", "Web", "Wet", "Who", "Why", "Wig", "Wii", "Win", "Won", //270
                "Xag", "Xam", "Xan", "Xar", "Xat", "Yea", "Yee", "Yeh", "Yep", "Yes", //280
                "Yet", "Yip", "You", "Zad", "Zag", "Zam", "Zap", "Zar", "Zat", "Zax", //290
                "Zed", "Zee", "Zen", "Zet", "Zid", "Zig", "Zim", "Zip", "Zod", "Zoo"  //300
            };
            #endregion

            var random = new Random();

            return syllables[random.Next(300)] + syllables[random.Next(300)];
            //return "1234";
        }
    }
}
