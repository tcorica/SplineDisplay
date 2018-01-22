import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Image;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.*;
import javax.swing.JPanel;

/**
 * Panel to display background image and path from spline file
 * @author tcorica
 *
 * TO DO: Fix width/height constants, adjust scaling factors to match
 * Send data file name in constructor?
 * Consider sending image file name rather than image to constructor - 
 *    Seems like a cleaner design.
 * Change lines array to ArrayList?  Saves the weird toArray() call.
 *
 */
class SplineDisplay extends JPanel {

	private Image fieldImg;
	private String DATAFILENAME = "Gear_Red.txt";
	private int FIRSTDATALINE = 2;
	private String [] lines;
	private int numPoints;

	public SplineDisplay(Image img) {
		lines = loadStrings(DATAFILENAME);
		numPoints = Integer.parseInt(lines[1]);

		this.fieldImg = img;
		System.out.println(img.getWidth(null)+"---"+img.getHeight(null));

		Dimension size = new Dimension(img.getWidth(null), img.getHeight(null));
		setPreferredSize(size);
		setMinimumSize(size);
		setMaximumSize(size);
		setSize(size);
		setLayout(null);
	}

	public void paintComponent(Graphics g) {
		g.drawImage(fieldImg, 0, 0, null);
		drawPath(g);
	}

	private String [] loadStrings(String filename) 
	{
		ArrayList<String> lineList = new ArrayList<String>();
		Scanner scan = null;

		try 
		{
			scan = new Scanner (new File (filename));
		} catch (FileNotFoundException e) 
		{
			e.printStackTrace();
		}

		String line;
		while (scan.hasNext()) 
		{
			line = scan.nextLine();
			lineList.add(line); //word.length() - 1 gets rid of the slash...         
		}
		scan.close();
		String [] foo = new String[1];
		System.out.println(lineList.size());
		return lineList.toArray(foo);
	}

	PVector worldToPixel(PVector w)
	{
		// field size is 27 x 27 feet; image is 330 x 326
		return new PVector(w.x*(330/27.0), 326-w.y*(326/27.0));
	}

//	private PVector pixelToWorld(PVector p)
//	{
//		return new PVector(p.x/(330/27.0), p.y/(330/27.0));
//	}

	/**
	 * Line from data file; assumes x/y position in columns 6 and 7
	 */
	private PVector getXY(String line)
	{
		String [] parts = line.split(" ");
		return new PVector(Float.parseFloat(parts[6]),Float.parseFloat(parts[7]));
	}

	private void drawPath(Graphics g)
	{
		g.setColor(Color.BLACK);
		for (int currSpot = FIRSTDATALINE; currSpot < numPoints; currSpot++)
		{
			// Left wheel
			PVector lSpot = getXY(lines[currSpot]);
			PVector lPixelSpot = worldToPixel(lSpot);
			g.drawOval((int)lPixelSpot.x,(int)lPixelSpot.y,5,5);

			// Right wheel
			PVector rSpot = getXY(lines[currSpot+numPoints]);
			PVector rPixelSpot = worldToPixel(rSpot);
			g.drawOval((int)rPixelSpot.x,(int)rPixelSpot.y,5,5);
		}
	}
}
