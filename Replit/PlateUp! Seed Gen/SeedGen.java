class SeedGen{
  private static String theChars = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private static String foodArr[] = {"Salad", "Pizza", "Pie", "Burger", "Steak"};
  private static String traitArr[] = {"Best", "Worst", "Insane", "Stupid", "WTF", "Shed-sized", "Cracked", "Mid", "F Tier", "S Tier", "LTG", "A Tier", "B Tier", "C Tier", "D Tier", "GOATED", "Made-the-script-crash", "Massive", "Concerning", "Don't play this"};

  public static String getTheChars(){
    return theChars;
  }

  // For seed generation
  
  public static String makeSeed(int len){
    String retStr = "";
    
    for(int i = 1; i <= len; i++){
      int rand = (int) (Math.random() * ((theChars.length() - 1) - 0 + 1));
      retStr += theChars.substring(rand, rand + 1);
    }
    
    return retStr;
  }

  public static String buildSituation(String seed){
    int foodInt = (int) (Math.random() * ((foodArr.length - 1) - 0 + 1));
    int traitInt = (int) (Math.random() * ((traitArr.length - 1) - 0 + 1));
    
    return traitArr[traitInt] + " " + foodArr[foodInt] + " seed: " + seed;
  }

  // For looping seeds

  public static void loopSeed(int numLoops){
    for(int i=0;i<numLoops;i++){
      String cur = makeSeed(8);
      System.out.println(buildSituation(cur));
    }
  }
  public static void loopSeed(long numLoops){
    for(long i=0;i<numLoops;i++){
      String cur = makeSeed(8);
      System.out.println(buildSituation(cur));
    }
  }

  public static void searchFor(String phrase){
    long failsafe = 0;

    // Geting max Num from user
    boolean isNum = false;
    String seedNumAns = "";
    
    while(true){
      Main.clearScreen();
      System.out.println("failsafe:: " + failsafe);
      isNum = true;
      
      System.out.print("\nEnter the amount of Seeds you would like to search.\n(\"MAX\" will work here [REDACTED].)\n\nInput >> ");
      seedNumAns = Main.input.nextLine();
      Main.clearScreen();

      // Checking for correct input
      try{
        failsafe = Integer.parseInt(seedNumAns);
      }catch(NumberFormatException nfe){ // possibly googled
        isNum = false;
      }
      
      if(seedNumAns.toUpperCase().equals("MAX")){
        failsafe = Integer.MAX_VALUE;
        break;
      } else if(seedNumAns.toUpperCase().equals("MAXXX")){
        failsafe = Long.MAX_VALUE;
        break;
      } else if(isNum){
        failsafe = Integer.parseInt(seedNumAns);
        break;
      } else{
        System.out.println("\n" + seedNumAns + " is not a valid input. Please try again.\n");
        String temp = Main.input.nextLine();
      }
    }
    
    // Asking if user wants to see
    boolean seesString = false;
    while(true){
      Main.clearScreen();
      System.out.println("\nWould you like to see the seeds as they generate?\n(This will take a lot longer!)");
      System.out.print("\n(y/n) >> ");
      String ans = Main.input.nextLine();
      
      if(ans.toLowerCase().substring(0,1).equals("y")){
        seesString = true;
        break;
      }else if(ans.toLowerCase().substring(0,1).equals("n")){
        seesString = false;
        break;
      }else{
        Main.clearScreen();
        System.out.println("\n\"" + ans + "\" is not a valid input.\nPlease enter \"y\" or \"n\".");
        String temp = Main.input.nextLine();
      }
    }
    
    // Searching for seed
    String cur = "";
    Main.updateLoading(phrase);
    
    while(failsafe > 0){
      cur = SeedGen.makeSeed(8);
      if(cur.indexOf(phrase.toUpperCase()) != -1){
        if(seesString){
          Main.clearScreen();
        }
        System.out.println("\nPhrase has been found!\n" + buildSituation(cur));
        break;
      }
      
      if(!seesString && failsafe % 500000 == 0){
        Main.updateLoading(phrase);
      }else if(seesString){
        System.out.println(buildSituation(cur));
      }
      failsafe--;
    }
    
    // If phrase was not found
    if(failsafe <= 0){
      System.out.println("\nThere was no \"" + phrase.toUpperCase() + "\" found. Please try again.");
    }
  }
}