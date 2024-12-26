// Just a joke program that generates random seeds, no rhyme or reason to them

import java.util.Scanner;

class Main {
  public static Scanner input = new Scanner(System.in);
  private static int dotCt = 0;

  public static void clearScreen() {  
    System.out.print("\033[H\033[2J");  
    System.out.flush();
  }

  public static void updateLoading(String search){
    clearScreen();
    System.out.print("\nSearching for phrase \"" + search.toUpperCase() + "\" in seed");
    for(int i = 0; i < dotCt; i++){
      System.out.print(".");
    }
    System.out.print("\n");
    
    dotCt++;
    if(dotCt > 3){
      dotCt = 0;
    }
  }

  public static boolean hasInvalidChar(String str){
    for(int i = 0; i < str.length(); i++){
      if(SeedGen.getTheChars().indexOf(str.toUpperCase().substring(i, i+1)) == -1){
        return true;
      }
    }
    return false;
  }
  
  public static void main(String[] args) {
    clearScreen();
    boolean isNum = true;
    int numBuilds = 0;
    String search = "";

    System.out.println("\nWelcome to the PlateUp! Seed Generator\n");
    System.out.println("Enter the amount of seeds you would like to generate, or:");
    System.out.println("Enter \"MAX\" for the maximum amount.\nEnter \"SEARCH\" to find a phrase within a seed.");

    isNum = true;
    System.out.print("\nInput >> ");
    String theInput = input.nextLine();
    clearScreen();

    try{
      numBuilds = Integer.parseInt(theInput);
    }catch (NumberFormatException nfe){
      isNum = false;
    }
    long loopNum;
    if (theInput.length() >= 3 && theInput.toUpperCase().substring(0,3).equals("MAX")) {
      if(theInput.toUpperCase().substring(0,theInput.length()).equals("MAXXX")){
        loopNum = Long.MAX_VALUE;
      }else{
        loopNum = Integer.MAX_VALUE;
      }
      System.out.print("\nAre you sure? (this is " + loopNum + "!!)\n(y/n): ");
      String isSure = input.nextLine();
      clearScreen();
      
      if (isSure.equals("true") || isSure.substring(0,1).toLowerCase().equals("y")){
        SeedGen.loopSeed(loopNum);
      }
      
    }else if(theInput.toUpperCase().equals("SEARCH")){
      System.out.print("\nPlease enter a phrase to search for\nor type -1 to go back.\n\nInput >> ");
      search = input.nextLine();
      clearScreen();
        
      if(!search.equals("-1") && search.length() <= 8 && !hasInvalidChar(search)){
        SeedGen.searchFor(search);
      }else{
        System.out.println("\nExiting. Phrase length may be greater than 8.\n");
        System.out.println("Enter the amount of seeds you would like to generate, or:");
        System.out.println("Enter \"MAX\" for the maximum amount.\nEnter \"SEARCH\" to find a phrase within a seed.");
        
        search = "";
      }
    }else if(!isNum){
      clearScreen();
      System.out.println("\nThat is not a valid input. Try again.\n");
      System.out.println("Enter the amount of seeds you would like to generate, or:");
      System.out.println("Enter \"MAX\" for the maximum amount.\nEnter \"SEARCH\" to find a phrase within a seed.");
    }else {
      numBuilds = Integer.parseInt(theInput);       
    }
  }
}