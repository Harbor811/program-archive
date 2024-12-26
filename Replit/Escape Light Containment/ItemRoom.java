import java.util.*;
//It's a room where you must use an item
//Lists all your items, only works with 'itemName'
public class ItemRoom extends Room{
  private String[] itemName = new String[0];
  private Option[] options = new Option[0];
  private Option[] externalO = new Option[0];
  private Option toRun;

  public ItemRoom(String n, String d, String iN){
    super(n, d);
    itemName = new String[]{iN};
  }

  public ItemRoom(String n, String d, String[] iNs){
    super(n, d);
    itemName = new String[iNs.length];
    itemName = iNs;
  }

  public Option[] getOptions(){
    compileOptions();
    return options;
  }

  public int findInArr(String[] arr, String key){
    for(int i = 0; i < arr.length; i++){
      if(arr[i].equals(key)){
        return i;
      }
    }
    return -1;
  }

  @Override
  public void useOption(int ind){
    compileOptions();
    ArrayList<InvComp> inv = Main.getInv();
    if(ind >= inv.size()){
      super.useOption(ind - inv.size());
    }else{
      Writer.write("You used the " + Writer.underline() + options[ind].getOption().substring(4) + Writer.clearFX() + ".");
      if(findInArr(itemName, options[ind].getOption().substring(4)) != -1){
        Writer.write(Writer.bold() + "It worked!" + Writer.clearFX());
        Main.w8();
        toRun.onUse();
      }else{
        Writer.write("Nothing happened.");
        Main.w8();
      }
    }
  }

  @Override
  public void addOption(String o, String f){
    Option tempO = new Option(o, f);
    Option[] replace = new Option[externalO.length + 1];
    for(int i = 0; i < externalO.length; i++){
      replace[i] = externalO[i];
    }
    replace[externalO.length] = tempO;
    externalO = replace;
  }

  public void setToRun(String f){
    toRun = new Option("toRun", f);
  }

  private void compileOptions(){
    ArrayList<InvComp> inv = Main.getInv();
    Option[] tempArr = new Option[inv.size() + externalO.length];
    for(int i = 0; i < inv.size(); i++){
      Option temp = new Option("Use " + inv.get(i).getName(), "");
      tempArr[i] = temp;
    }
    for(int j = 0; j < externalO.length; j++){
      tempArr[inv.size() + j] = externalO[j];
    }
    options = tempArr;
    super.setOptions(externalO);
  }
}