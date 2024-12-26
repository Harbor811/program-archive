//static fight class!

public class Fight{
  private static String name;
  private static int power;
  private static int enemyHp;
  private static int playerHp = 100;

  public static boolean start(Enemy e) {
    name = e.getName();
    power = e.getPower();
    enemyHp = e.getHp();

    Writer.write("You are fighting against " + name + " with power " + power);
    Writer.write(Writer.bold() + "Your HP: " + playerHp + "\n" + name + "'s HP: " + enemyHp + Writer.clearFX());
    Main.w8();
    while (playerHp > 0 && enemyHp > 0) {
      Writer.clear();
      Writer.write("What do you do?");

      int playerMove = Main.prompt(new String[] {"Attack", "Run", "Hide"}, false) - 1;
      Writer.clear();
      if (playerMove == 0) {
        int damage = (int)(Math.random() * 50 + 1);
        enemyHp -= damage;
        Writer.write("You attacked " + name + " for " + damage + " damage!");
      } else
      if (playerMove == 1) {
        if(name.equals("SCP-939")){
          Writer.write("You open the door, and make a mad dash for your life.\nAs you're running, it grabs you by the feet and absolutely obliterates you.\nYou don't wanna know the details.");
          return false;
        }else{
          Writer.write("You try to run, but your legs just won't work!");
        }
      } else
      if (playerMove == 2){
        if(name.equals("SCP-939")){
          Writer.write("You quickly but quietly hide in a small seperate room.");
          Main.w8();
          Writer.write("It walks around, looking for you.\nIt checks a corner, it checks the other door, and it gets right up in your face.");
          Main.w8();
          Writer.write("It couldn't find you. It walks out the open door, hoping to catch up.");
          return true;
        }else{
          Writer.write("You frantically look around, but there's nowhere to hide.");
        }
      }
      Main.w8();
      if(name.equals("Facility Guard")){
        Writer.write("The facility guard raises his gun, to neutralize the threat.\nAll of a sudden, a strange figure with a white plague mask and a black coat grabs him, knocking him to the ground!\nInstead of the doctor attacking you, he appears to be doing something to the guard?\nYou decide to take this opportunity to leave!");
        Main.w8();
        Writer.write("You manage to squeeze through the door, the fresh air kissing your face.\nTo your right, there is a large forest.\nYou run as fast as you can.");
        Main.setWin();
        return true;
      }
      if (enemyHp > 0) {
        int damage = (int)(Math.random() * power + 1);
        playerHp -= damage;
        Writer.write(name + " attacked you for " + damage + " damage.");
        if(enemyHp < 0){
          enemyHp = 0;
        }
        if(playerHp < 0){
          playerHp = 0;
        }
        Writer.write("Your HP: " + playerHp + "\n" + name + "'s HP: " + enemyHp);
        Main.w8();
      }
    }
    return playerHp > 0;
  }

  //returns true if used, false if not
  public static boolean heal(){
    if(playerHp > 0 && playerHp < 100){
      playerHp += 75;
      if(playerHp > 100){
        playerHp = 100;
      }
      return true;
    }else{
      return false;
    }
  }
}