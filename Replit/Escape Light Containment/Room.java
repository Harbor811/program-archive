public class Room{
  private static int totalTime;
  private String name;
  private String desc;
  private Option[] options = new Option[0];
  private int numEntrances = 0;

  public Room(String name, String desc){
    this.name = name;
    this.desc = desc;
  }
  public Room(String name, String desc, Option[] o){
    this.name = name;
    this.desc = desc;
    this.options = new Option[o.length];
    for(int i = 0; i < options.length; i++){
      this.options[i] = o[i];
    }
  }

  public void addEntrance(){
    numEntrances++;
  }

  public void removeEntrance(){
    numEntrances--;
  }

  public int getEntrances(){
    return numEntrances;
  }
  
  public void setOptions(Option[] o){
    options = o;
  }

  public void addOption(String o, String f){
    Option[] tempO = new Option[options.length + 1];
    for(int i = 0; i < options.length; i++){
      tempO[i] = options[i];
    }
    Option cur = new Option(o, f);
    tempO[options.length] = cur;
    options = tempO;
  }

  public void forceOption(String f){
    Option forced = new Option("Forced Event!", f);
    forced.onUse();
  }

  public void removeOption(int ind){
    Option[] tempO = new Option[options.length - 1];
    int counter = 0; //must be seperate from 'i'
    for(int i = 0; i < options.length; i++){
      if(i == ind){
        continue;
      }
      tempO[counter] = options[i];
      counter++;
    }
    options = tempO;
  }

  public String getName(){
    return name;
  }

  public String getDesc(){
    return desc;
  }
  
  public Option[] getOptions(){
    return options;
  }

  public Option getOption(int ind){
    return options[ind];
  }

  public void useOption(int ind){
    options[ind].onUse();
  }
  public void setToRun(String s){
    System.out.println("toRun \"" + s + "\" called on a Room?");
  }

  public static void addTotalTime(){
    totalTime++;
    if(totalTime == 2){
      Writer.deconWarn(15);
      Writer.write("\nWhat was that?");
      Main.w8();
    }else if(totalTime == 10){
      Writer.deconWarn(10);
      Writer.write("\nMaybe you should get going.");
      Main.w8();
    }else if(totalTime == 18){
      Writer.deconWarn(5);
      Writer.write("\nYou better wrap it up, fast.");
      Main.w8();
    }else if(totalTime == 26){
      Writer.deconWarn(1);
      Writer.write(Writer.bold() + "\n\n\n...Uh oh." + Writer.clearFX());
      Main.w8();
    }else if(totalTime == 27){
      Writer.write(Writer.inverseCols() + "5 SECONDS.\n" + Writer.clearFX());
    }else if(totalTime == 28){
      Writer.write(Writer.inverseCols() + "4.\n" + Writer.clearFX());
    }else if(totalTime == 29){
      Writer.write(Writer.inverseCols() + "3.\n" + Writer.clearFX());
    }else if(totalTime == 30){
      Writer.write(Writer.inverseCols() + "2.\n" + Writer.clearFX());
    }else if(totalTime == 31){
      Writer.write(Writer.inverseCols() + "1.\n" + Writer.clearFX());
    }else if(totalTime >= 32){
      Writer.write("Suddenly, all of the doors surronding you turn red, and lock!\nThe air gets filled with a sort of greenish gas.\nAs you start gagging, all you can hear is...\n" + Writer.inverseCols() + "LIGHT CONTAINMENT ZONE IS LOCKED DOWN AND READY FOR DECONTAMINATION.\nTHE REMOVAL OF ORGANIC SUBSTANCES HAS NOW BEGUN." + Writer.clearFX());
      Main.w8();
      Main.dead = true;
    }
  }
}