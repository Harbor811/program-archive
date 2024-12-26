//A Static Writer, for slow writing & clearing

class Writer{
  public static void write(String prompt, int ms){
    int startTime = (int)System.currentTimeMillis();
    int index = 0;
    while (index < prompt.length()) {
      int currentTime = (int)System.currentTimeMillis();
      if (currentTime - startTime >= ms) {
        System.out.print(prompt.charAt(index));
        index++;
        startTime = currentTime;
      }
    }
    System.out.println();
  }

  public static void write(String prompt){
    try{
      for(int i=0; i<prompt.length(); i++){
        System.out.print(prompt.substring(i, i+1));
        Thread.sleep(10);
      }
    }
    catch(Exception e){}
    System.out.println();
  }

  public static void deconWarn(int i){
    if(i == 15){
      write("Suddenly, you hear a loud chime over the global speakers!\nYou listen to what it has to say:");
      write(inverseCols() + "ATTENTION, ALL PERSONNEL: THE LIGHT CONTAINMENT ZONE DECONTAMINATION PROCESS WILL OCCUR IN " + bold() + "T-" + i + " MINUTES." + clearFX() + inverseCols() + "\nALL BIOLOGICAL SUBSTANCES MUST BE REMOVED IN ORDER TO AVOID DESTRUCTION." + clearFX(), 100);
    }else{
      write("Suddenly, you hear the same loud chime, this time lower pitched.\nYou listen:");
      write(inverseCols() + "DANGER: LIGHT CONTAINMENT ZONE OVERALL DECONTAMINATION IN" + bold() + " T-" + i+ " MINUTE(S)." + clearFX(), 100);
    }
  }
  
  public static void clear(){
    System.out.print("\033[H\033[2J");  
    System.out.flush();
  }

  public static String clearFX(){
    return "\033[0m\033[25m";
  }
  public static String inverseCols(){
    return "\033[7m";
  }
  public static String underline(){
    return "\033[4m";
  }
  public static String bold(){
    return "\033[1m";
  }
  public static String strikethrough(){
    return "\033[9m";
  }
}