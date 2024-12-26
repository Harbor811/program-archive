public class Enemy{
  private String name;
  private int hp;
  private int pow;

  public Enemy(String n, int h, int p){
    name = n;
    hp = h;
    pow = p;
  }
  public String getName(){
    return name;
  }
  public int getHp(){
    return hp;
  }
  public int getPower(){
    return pow;
  }
}