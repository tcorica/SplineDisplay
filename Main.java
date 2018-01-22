import javax.swing.ImageIcon;
import javax.swing.JFrame;

public class Main extends JFrame {

	private String IMAGEFILENAME = "FRC2018FieldDiagramHalf.PNG";

	
	public static void main(String args[])
	{
		new Main().start();
	}

	public void start()
	{
//		ShowSplineMain panel = new ShowSplineMain(new ImageIcon("FRC2018FieldDiagramHalf.png").getImage());
		SplineDisplay panel = new SplineDisplay(new ImageIcon(IMAGEFILENAME).getImage());
		System.out.println(panel);
		add(panel);
		setVisible(true);
		setSize(340,326+80);
		System.out.println(panel.getWidth()+" "+panel.getHeight());
		setDefaultCloseOperation(EXIT_ON_CLOSE);
	}
}









