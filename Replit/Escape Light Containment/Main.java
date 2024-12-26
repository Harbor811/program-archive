import java.util.*;

class Main{
  static Scanner input = new Scanner(System.in);
  static ArrayList<InvComp> inv = new ArrayList<InvComp>();
  static String last = ""; // For re-writing the last line
  static Room[] roomArr;
  static boolean hasEscaped = false;
  static Room curRoom;
  static public boolean dead = false;
  
  public static void compileRoomArr(){
    Room fourWay = new Room("fourWay", "Standing at a four-way intersection, you analyze the ways you can go.");
    fourWay.addOption("Go left, labeled 'EX-B'", "#2$" + Writer.bold() + "You walk through the doorway" + Writer.clearFX() + ", only to be met with a gianormous metal wall, with a small keypad on the side."); // exit door
    fourWay.addOption("Go right, labeled 'PC-15'", "#1$" + Writer.bold() + "You walk into the doorway." + Writer.clearFX() + "\nInside, there is a large containment chamber.\nIt's labeled 'PC-15'\nThe large door is open!"); // PC-15
    fourWay.addOption("Go straight", "#3$" + Writer.bold() + "You open the door" + Writer.clearFX() + ", revealing a red room."); // Airlock
    fourWay.addOption("D-Hallway", "$" + Writer.bold() + "You press the button" + Writer.clearFX() + ", to no avail.\nThe button stays red, the door doesn't open.\nYou stop trying after about 10 presses."); // back to tut room, its locked permanently
    fourWay.addOption("Do nothing", "$" + Writer.bold() + "You stand there" + Writer.clearFX() + ", absolutely appalled at the fact you must make a decision.\nHow could they do that?\nWhy can't I just press 'enter' over and over and win?\nAs you come to your senses, you realize this isn't a game.\nThis is real life, pal.");

    Room pc = new Room("pc", "You find yourself standing in 'PC-15', with a small glass container inside.\nTo the right, there is a shelf, as well as a small table.\nThere is also a locker, in the corner of the room.");
    pc.addOption("Go back", "#0$" + Writer.bold() + "You exit the large room" + Writer.clearFX() + ", and walk back to the 4 way intersection.");
    pc.addOption("Check shelves", "!Yellow Keycard!A yellow keycard, reads 'SCIENTIST ACCESS'.\n" + Writer.bold() + "Does this open certain containment chambers?" + Writer.clearFX() + "$" + Writer.bold() + "Rummaging through the shelves" + Writer.clearFX() + ", you find a yellow keycard!");
    pc.addOption("Check lockers", "!Medkit!A red bag with a distinct white plus.\nHopefully I never get injured in here...$" + Writer.bold() + "Opening the lockers" + Writer.clearFX() + ", you manage to find a medkit!");

    Room exit = new ItemRoom("exit", "There's something uneasy about the massive room.", "Black Keycard");
    exit.setToRun("%F$The doors open, revealing an exit!\nYou walk to the final exit door, dramatically.\nSuddenly, the door opens, with a facility guard in front of you!");
    exit.addOption("Touch the keypad", "$" + Writer.bold() + "You touch the keypad with your hand." + Writer.clearFX() + "\nIt feels warm from the gentle light.\nThe metal is soft to the touch, yet strong.\n" + Writer.underline() + "Oh yeah, and it does nothing." + Writer.clearFX());
    exit.addOption("Wait", "$" + Writer.bold() + "You wait" + Writer.clearFX() + " for some time.\nThen for some more time.\nThen a little more time.\nYou realize that nobody is coming to save you.");
    exit.addOption("Go back", "#0$" + Writer.bold() + "You head back" + Writer.clearFX() + " to the intersection.");
    
    Room al = new Room("al", "You find yourself standing in a red airlock room. There's nowhere to go but straight from here.");
    al.addOption("Go to intersection", "#0$You exit the airlock, " + Writer.bold() + "going back into the intersection." + Writer.clearFX());
    al.addOption("Go to chamber, labeled '#914'", "#4$You exit the airlock, " + Writer.bold() + "going into the containment chamber." + Writer.clearFX());

    
    Room nof = new ItemRoom("nof", "You find yourself standing in front of a large metal door labeled '#914.'\nThere is a keypad on the right.", new String[] {"Yellow Keycard", "Black Keycard"});
    nof.setToRun("#5$After a second, the massive metal door comes to life.\nMachines aggressively whir, as the giant double doors slide open.\nEventually, they hit the walls with a ground-shaking thud.");
    nof.addOption("Enter the airlock", "#3$You go back into the airlock room.");
    nof.addOption("Touch the keypad", "$" + Writer.bold() + "You press on the keypad" + Writer.clearFX() + ", with no luck.\nThe door doesn't budge.");
    nof.addOption("Knock on the door", "$" + Writer.bold() + "You pound on the door" + Writer.clearFX() + ", and wait. You hear some noises inside, but no answer.");
    
    Room nofInside = new Room("nofInside", "Standing in front of the large machine, you contemplate your options.");
    nofInside.addOption("Leave", "#4$You exit the large #914 room, going back into the airlock.");
    nofInside.addOption("Inspect the machine", "!Black Keycard!A black keycard, reads '05 TIER ACCESS'.\n" + Writer.bold() + "05 Council? Aren't those the guys who operate the entire facility?" + Writer.clearFX() + "$" + Writer.bold() + "You inspect the machine" + Writer.clearFX() + ". There's a lot of complicated buttons and switches.\nThere is an input and output area.\nYou check the output area, and you find a black keycard!");
    nofInside.addOption("Use the machine", "$You go up to the machine, and read it.\nUh...\nWhat?\nI don't know how to use this!");
        
    roomArr = new Room[]{fourWay, pc, exit, al, nof, nofInside};
  }

  public static void setCurRoom(int r){
    curRoom = roomArr[r];
    curRoom.addEntrance(); //adds 1 to num
  }

  public static Room getCurRoom(){
    return curRoom;
  }

  public static void main(String[] args){
    int ans;
    compileRoomArr();

    Writer.clear();
    last = Writer.bold() + "You wake up in a cramped, enclosed room." + Writer.clearFX() + "\nTo your left, theres a small table with nothing on it.\nYou're sitting on a hard, slightly yellowed mattress.\nYou don't remember much, but there is one obvious thing.";
    Writer.write(last, 50);
    Writer.write(Writer.bold() + "You've got to get out of here." + Writer.clearFX(), 250);
    w8();

    //This first room works different than the rest!
    //Because its not stored in room arr, only entered once
    last = "You sit up straight, destined to get out of this place.\nHow convenient! The door has a button.\nYou push it, and it glows green, gently sliding open.\nOutside, there is a long hallway with identical cells, with only one open, labeled \"CELL#08.\"\nFarther down there is another door of similar style.";
    Writer.write(last);
    
    ans = prompt(new String[] {"Enter CELL#08", "Enter the door at the end"}, true);
    Writer.clear();
    if(ans == 1){
      Writer.write(Writer.bold() + "You enter the open containment room." + Writer.clearFX() + "\nThe room is identical to the room you came out of.\nThis room has a coin on the desk! You pick it up.");
      w8();
      InvComp coin = new InvComp("Coin", "A 25 cent piece, with the head of the first United States president.");
      inv.add(coin);
      Writer.write("Having nothing else to do, " + Writer.bold() + "you approach the door" + Writer.clearFX() + " in the hallway.\n");
    }
    Writer.write("You push the button on the door.\nIt glows green, and slides open.\nBeyond it is a 4-way intersection.");
    Writer.write("As you pass through it, however, it slams shut!", 5);
    w8();
    Writer.clear();
    
    // !! Main game loop starts here !!
    
    setCurRoom(0);
    while(!hasEscaped && !dead){ // very pro I know
      last = curRoom.getDesc();
      Writer.write(last);
      ans = prompt(curRoom.getOptions());
      Writer.clear();
      Room.addTotalTime();
      
      //Forced Events Here
      if(curRoom.getName().equals("nofInside") && curRoom.getEntrances() == 1){ //Scientist fight
        curRoom.forceOption("%S$As the machine comes to a stop, a scientist steps out, ready to fight you.");
        w8();
        curRoom.addEntrance();
      }
      if(curRoom.getName().equals("al") && curRoom.getEntrances() == 2){
        curRoom.forceOption("%9$Suddenly, you hear a strange noise. You stop.\nListening closer, it's clearly some sort of animal.\nAll of a sudden, the door opens, revealing this large, red dog-like figure!\nYou notice that it has no eyes.");
      }
      
      if(dead){
        break;
      }else if(hasEscaped){
        break;
      }
      curRoom.useOption(ans-1);
    }
    
    
    Writer.clear();
    Writer.write("Game Over!");
  }

  public static void give(InvComp item){
    inv.add(item);
  }
  
  public static int prompt(Option[] options){
    String[] temp = new String[options.length];
    for(int i = 0; i < options.length; i++){
      temp[i] = options[i].getOption();
    }
    return prompt(temp, false);
  }
  
  public static int prompt(String[] options, boolean isInv){
    //Printing Options
    System.out.println("\nYou...");
    for(int i = 1; i <= options.length; i++){
      System.out.println("< " + i + " " + options[i-1]);
    }
    if(!isInv){
      System.out.println("- i Access your Inventory");
    }
    System.out.println();
    
    //Getting Answer
    System.out.print(" > ");
    String ret = input.nextLine();
    ret = ret.trim().toLowerCase();
    System.out.println(Writer.clearFX());
    if(!(ret.equals("i") && !isInv)){
      try{
        if(Integer.parseInt(ret) > 0 && Integer.parseInt(ret) <= options.length){
          return Integer.parseInt(ret); //return 'ret' as valid num
        }
      }catch (Exception e){}
      //if 'ret' is not listed
      Writer.clear();
      System.out.println(last);
      return prompt(options, isInv);
    }
    //ret is 'i'
    Writer.clear();
    return openInventory(options);
  }
  
  public static void w8(){
    System.out.print("\n<Enter>");
    input.nextLine();
    Writer.clear();
  }

  public static int openInventory(String[] options){
    Writer.clear();
    //this method is a little funky
    //  it returns a String because its in prompt, 
    //  takes options[] to recall prompt with

    if(inv.size() == 0){
      Writer.write("You feel your pockets, but there's nothing in them!");
      w8();
      System.out.println(last);
      return prompt(options, false);
    }
    System.out.println(Writer.underline() + "Inventory                \n" + Writer.clearFX());
    for(int i = 1; i <= inv.size(); i++){
      Writer.write(i + " < " + inv.get(i - 1).getName());
    }
    Writer.write("-1 < Exit\n");

    System.out.print("Inspect > ");
    String ret = input.nextLine();
    ret = ret.trim().toLowerCase();
    
    if(!ret.equals("-1")){
      try{
        if(Integer.parseInt(ret) > 0 && Integer.parseInt(ret) <= inv.size()){
          int ind = Integer.parseInt(ret) - 1;
          InvComp curItem = inv.get(ind);
          Writer.clear();
          
          System.out.println("It's a(n) " + curItem.getName() + "\n");
          Writer.write(curItem.getDesc());
          int todo = prompt(new String[] {"Back", "Use"}, true);
          Writer.clear();
          
          if(todo == 2){
            Room.addTotalTime();
            if(dead){
              return 0;
            }
            if(curItem.getName().equals("Medkit")){
              boolean used = Fight.heal();
              if(used){
                Writer.write("You apply the medkit.\nIt heals your wounds.");
                inv.remove(ind);
              }else{
                Writer.write("You're already at full HP!");
                w8();
              }
            }else
            if(curItem.getName().equals("Coin")){
              String flip = "Heads";
              if(Math.random() * 10 > 5){flip = "Tails";}
              Writer.write("You flip the coin.\nIt's " + flip + "!");
            }else
            if(curItem.getName().indexOf("Keycard") != -1){
              Writer.write("You press the " + curItem.getName() + " to your forehead.\nMaybe you're a D-Class for a reason.");
            }

            w8();
          }
          
          return openInventory(options);
        }
      }catch(Exception e){}
      Writer.clear();
      System.out.println("\nUnknown answer: " + ret);
      return openInventory(options);
    }
    Writer.clear();
    System.out.println(last);
    return prompt(options, false);
  }
  
  public static ArrayList<InvComp> getInv(){
    return inv;
  }

  public static void setWin(){
    hasEscaped = true;
  }
}