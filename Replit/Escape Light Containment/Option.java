// A class, telling each "option" what it does
// This is all to simply the Main game loop

public class Option{
  private String option;
  private String function;
  // function key
  // '#' means go to room
  // "#3" would mean goto room 3
  // "#3$RUN!" would goto room 3, and write "RUN!"
  // '$' means to log a String
  // "$Test?" would write "Test?" to console
  // '!' means giving an item, sep name with another !
  // "!Keycard!Literally a keycard" would give the user a Keycard inventory item, with the description "Literally a keycard"
  // '%' means to trigger a fight! sep with %
  // "%name%hp%pow$uh oh!" would trigger a fight with name, has hp, and pow (max dmg) while printing "uh oh!"

  public Option(String o, String f){
    option = o;
    function = f;
  }

  public String getOption(){
    return option;
  }

  public void onUse(){
    if(function.substring(0,1).equals("#")){
      try{
        int r = Integer.parseInt(function.substring(1,2));
        Main.setCurRoom(r);
        if(function.substring(2,3).equals("$")){
          Writer.write(function.substring(3));
        }
      }catch(Exception e){
        System.out.println(e + " Likely an Undefined Room #.");
      }
    }else if(function.substring(0,1).equals("$")){
      Writer.write(function.substring(1));
      Main.w8();
    }else if(function.substring(0,1).equals("!")){
      int endInd = function.substring(1).indexOf("!");
      int strStart = function.length();
      if(function.indexOf("$") != -1){
        strStart = function.indexOf("$");
      }
      InvComp tempItem = new InvComp(function.substring(1, endInd + 1), function.substring(endInd + 2, strStart));
      Main.give(tempItem);
      if(function.indexOf("$") != -1){
        Writer.write(function.substring(strStart + 1));
      }
      function = "$You already looted this!";
    }else if(function.substring(0,1).equals("%")){
      String enemyLet = function.substring(1, 2);
      function = function.substring(2);
      Writer.write(function.substring(function.indexOf("$") + 1));
      Main.w8();
      boolean win = true;
      if(enemyLet.equals("S")){ //Scientist
        win = Fight.start(new Enemy("Scientist", 75, 50));
      }else if(enemyLet.equals("F")){
        win = Fight.start(new Enemy("Facility Guard", 100, 5000));
      }else if(enemyLet.equals("9")){
        win = Fight.start(new Enemy("SCP-939", 3200, 200));
      }
      
      Main.w8();
      if(win){
        Writer.write("You win the fight!");
      }else{
        Writer.write("Your injuries were too extreme, and you died.");
        Main.dead = true;
      }
    }
    if(function.indexOf("You win." + Writer.clearFX() + "\nI do not care.") != -1){
      Main.w8();
      Writer.write("You win!");
      for(int i=0; i<5; i++){
        Main.w8();
        Writer.write("...");
        Room.addTotalTime();
      }
      Main.w8();
      Writer.write("Jk\nPlay the game.");
      Main.getCurRoom().removeOption(4);
      Main.w8();
    }
    if(option.equals("Do nothing")){
      function = "$" + Writer.bold() + "No. Absolutely not." + Writer.clearFX() + "\n'I will not be forced to make a decision', you say to yourself.\nFine.\nYou know what?\n" + Writer.underline() + "You win." + Writer.clearFX() + "\nI do not care.";
    }
  }

  public void setFunc(String f){
    function = f;
  }
}