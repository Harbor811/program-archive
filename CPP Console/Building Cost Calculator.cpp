// C++ Console App, made in Visual Studio
// To be honest I have no idea what this project does nor do I care, it was for a class project and I coded what I was told to lmao

#include <iostream>
#include <fstream>
#include <vector>
#include <string>
using namespace std;

const double SOCIAL_COST_CO2_MT = 236.16; // per metric ton of CO2
//EPA SOCIAL COST OF CARBON 2024 Dollars
// $236.16 per metric ton co2
const double KWH_TO_CO2O_MT = 0.0004;
const double KWH_M2_SV_SLOPE = 41.8; //kWh/m?;

class Building;

void SetupVec(vector<Building>& buildings, string fileName);
void OutputNewTable(vector<Building> buildings, string fileName, double& totalfloorArea, double& totalSurfaceArea,
	double& totalVolume, double& totalKWH, double& totalHcvKWH, double& totalEnergyCosts,
	double& totalEnergyHcvCosts, double& totalWastedKWH, double& totalSurfaceAreaIdeal,
	double& totalSurfaceAreaDelta, double& totalCO2e_real_MT, double& totalCO2e_ideal_MT,
	double& totalCO2e_wasted_MT, double& totalCO2e_wasted_cost, double& totalCO2o_wasted_MT,
	double& totalCO2o_wasted_cost);
double calcSurfaceAreaIdeal(double inVolume, double inSurfaceArea);
double calcWastedKWH(double inSurfaceArea, double inVolume, double inHcvKWH, double inbldArea);
double calcEmbodiedCO2_MT_real(double inSurfaceArea, double inSurfaceAreaIdeal);
double calcEmbodiedCO2_MT_ideal(double inSurfaceArea, double inSurfaceAreaIdeal);

int main()
{
	//// CONSTANTS
	//// INPUT MUST BE METERS
	const string UNITS = "Meters"; // or "Feet" if its Feet.
	const double UNITSCALE = 1; //case Units == "Meters" : 1 else: 3.28084

	// If Meters the scale is 1, otherwise we convert to feet
	const double AREASCALE = 1; //case Units == "Meters" : 1 else: 10.7639	

	// If Meters the scale is 1, otherwise we convert square meters to square feet
	const double VOLUMESCALE = 1; //case Units == "Meters" : 1 else: 35.3147
	const double HEIGHTSCALE = 1; //case Units == "Meters" : 1	 else: 3.28084	

	ofstream outFS;
	string fileName;

	// Initialize summary variables to track totals
	double totalWastedKWH = 0.0;
	double totalSurfaceAreaIdeal = 0.0;
	double totalfloorArea = 0.0;
	double totalSurfaceArea = 0.0;
	double totalVolume = 0.0;
	double totalKWH = 0.0;
	double totalHcvKWH = 0.0;
	double totalEnergyCosts = 0.0;
	double totalEnergyHcvCosts = 0.0;
	double totalOutWastedKWH = 0.0;
	double totalOutSurfaceAreaIdeal = 0.0;
	double totalSurfaceAreaDelta = 0.0;
	double totalOutCO2e_real_MT = 0.0;
	double totalOutCO2e_ideal_MT = 0.0;
	double totalOutCO2e_wasted_MT = 0.0;
	double totalOutCO2e_wasted_cost = 0.0;
	double totalOutCO2o_wasted_MT = 0.0;
	double totalOutCO2o_wasted_cost = 0.0;
	double totalWastedKWH_Pct = 0.0;
	double totalWastedCost = 0.0;
	double totalRealEnergyIntensity = 0.0;
	double totalRdealEnergyIntensity = 0.0;

	vector<Building> buildings;

	cout << "Please enter the name of your spreadsheet:\nFORMAT: ID\tFloorArea\tSurfaceArea\tVolume\tKWH\tHcvKWH\tEnergyCosts\tEnergyHcvCosts\n > ";
	cin >> fileName;

	// Set up vector with data in given txt file
	SetupVec(buildings, fileName);

	// Output new txt file with caclulations
	OutputNewTable(buildings, fileName, totalfloorArea, totalSurfaceArea,
		totalVolume, totalKWH, totalHcvKWH, totalEnergyCosts,
		totalEnergyHcvCosts, totalWastedKWH, totalSurfaceAreaIdeal,
		totalSurfaceAreaDelta, totalOutCO2e_real_MT, totalOutCO2e_ideal_MT,
		totalOutCO2e_wasted_MT, totalOutCO2e_wasted_cost, totalOutCO2o_wasted_MT,
		totalOutCO2o_wasted_cost);

	return 0;
}

class Building
{
private:
	int bID;
	double floorArea;
	double surfaceArea;
	double volume;
	double KWH;
	double hcvKWH;
	double energyCosts;
	double energyHcvCosts;
	double outSurfaceAreaIdeal;
	double outSurfaceAreaDelta;
	double outWastedKWH;
	double outCO2e_real_MT;
	double outCO2e_ideal_MT;
	double outCO2e_wasted_MT;
	double outCO2e_wasted_cost;
	double outCO2o_wasted_MT;
	double outCO2o_wasted_cost;
	double wastedKWH_Pct;
	double outWastedCost;
	double realEnergyIntensity;
	double idealEnergyIntensity;

public:
	Building(int bID, double floorArea, double surfaceArea,
		double volume, double KWH, double hcvKWH, double energyCosts,
		double energyHcvCosts)
	{
		this->bID = bID;
		this->floorArea = floorArea;
		this->surfaceArea = surfaceArea;
		this->volume = volume;
		this->KWH = KWH;
		this->hcvKWH = hcvKWH;
		this->energyCosts = energyCosts;
		this->energyHcvCosts = energyHcvCosts;

		outSurfaceAreaIdeal = 0.0;
		outSurfaceAreaDelta = 0.0;
		outWastedKWH = 0.0;
		outCO2e_real_MT = 0.0;
		outCO2e_ideal_MT = 0.0;
		outCO2e_wasted_MT = 0.0;
		outCO2e_wasted_cost = 0.0;
		outCO2o_wasted_MT = 0.0;
		outCO2o_wasted_cost = 0.0;
		wastedKWH_Pct = 0.0;
		outWastedCost = 0.0;
		realEnergyIntensity = 0.0;
		idealEnergyIntensity = 0.0;
	}
	Building()
	{
		bID = 0;
		floorArea = 0.0;
		surfaceArea = 0.0;
		volume = 0.0;
		KWH = 0.0;
		hcvKWH = 0.0;
		energyCosts = 0.0;
		energyHcvCosts = 0.0;

		outSurfaceAreaIdeal = 0.0;
		outSurfaceAreaDelta = 0.0;
		outWastedKWH = 0.0;
		outCO2e_real_MT = 0.0;
		outCO2e_ideal_MT = 0.0;
		outCO2e_wasted_MT = 0.0;
		outCO2e_wasted_cost = 0.0;
		outCO2o_wasted_MT = 0.0;
		outCO2o_wasted_cost = 0.0;
		wastedKWH_Pct = 0.0;
		outWastedCost = 0.0;
		realEnergyIntensity = 0.0;
		idealEnergyIntensity = 0.0;
	}
	// sick
	int getID()
	{
		return bID;
	}
	double getFloorArea()
	{
		return floorArea;
	}
	double getSurfaceArea()
	{
		return surfaceArea;
	}
	double getVolume()
	{
		return volume;
	}
	double getKWH()
	{
		return KWH;
	}
	double getHcvKWH()
	{
		return hcvKWH;
	}
	double getEnergyCosts()
	{
		return energyCosts;
	}
	double getEnergyHcvCosts()
	{
		return energyHcvCosts;
	}
	double getWastedKWH()
	{
		return outWastedKWH;
	}
	double getIdealSurfaceArea()
	{
		return outSurfaceAreaIdeal;
	}
	double getSurfaceAreaDelta()
	{
		return outSurfaceAreaDelta;
	}
	double getRealCO2eMT()
	{
		return outCO2e_real_MT;
	}
	double getIdealCO2eMT()
	{
		return outCO2e_ideal_MT;
	}
	double getWastedCO2eMT()
	{
		return outCO2e_wasted_MT;
	}
	double getWastedCO2eCost()
	{
		return outCO2e_wasted_cost;
	}
	double getWastedCO2oMT()
	{
		return outCO2o_wasted_MT;
	}
	double getWastedCO2oCost()
	{
		return outCO2o_wasted_cost;
	}
	double getWastedKWHPercent()
	{
		return wastedKWH_Pct;
	}
	double getWastedCost()
	{
		return outWastedCost;
	}
	double getRealEnergyIntensity()
	{
		return realEnergyIntensity;
	}
	double getIdealEnergyIntensity()
	{
		return idealEnergyIntensity;
	}

	void calculateOutputs()
	{
		outWastedKWH = calcWastedKWH(surfaceArea, volume, hcvKWH, floorArea);
		outSurfaceAreaIdeal = calcSurfaceAreaIdeal(volume, surfaceArea);
		outSurfaceAreaDelta = surfaceArea - outSurfaceAreaIdeal;
		outCO2e_real_MT = calcEmbodiedCO2_MT_real(surfaceArea, outSurfaceAreaIdeal);
		outCO2e_ideal_MT = calcEmbodiedCO2_MT_ideal(surfaceArea, outSurfaceAreaIdeal);
		outCO2e_wasted_MT = outCO2e_real_MT - outCO2e_ideal_MT; 		// wasted CO2 embodied (from building materials)
		outCO2e_wasted_cost = outCO2e_wasted_MT * SOCIAL_COST_CO2_MT; 	// social cost of additional embodied CO2
		outCO2o_wasted_MT = outWastedKWH * KWH_TO_CO2O_MT; 				// wasted operational kWh (from hvac)
		outCO2o_wasted_cost = outCO2o_wasted_MT * SOCIAL_COST_CO2_MT; 	// wasted operational CO2 (from hvac)
		wastedKWH_Pct = outWastedKWH / hcvKWH; 							// percentage of wasted energy
		outWastedCost = wastedKWH_Pct * energyHcvCosts; 				// apply % wasted energy to energy cost
		realEnergyIntensity = hcvKWH / floorArea;
		idealEnergyIntensity = (hcvKWH - outWastedKWH) / floorArea;
	}

	string getAllVars()
	{
		return to_string(bID) + "\t" + to_string(floorArea) + "\t" + to_string(surfaceArea) + "\t" + to_string(volume) +
			"\t" + to_string(KWH) + "\t" + to_string(hcvKWH) + "\t" + to_string(energyCosts) + "\t" + to_string(energyHcvCosts) +
			"\t" + to_string(outWastedKWH) + "\t" + to_string(outSurfaceAreaIdeal) + "\t" + to_string(outSurfaceAreaDelta) +
			"\t" + to_string(outCO2e_real_MT) + "\t" + to_string(outCO2e_ideal_MT) + "\t" + to_string(outCO2e_wasted_MT) +
			"\t" + to_string(outCO2e_wasted_cost) + "\t" + to_string(outCO2o_wasted_MT) + "\t" + to_string(outCO2o_wasted_cost) +
			"\t" + to_string(wastedKWH_Pct) + "\t" + to_string(outWastedCost) + "\t" + to_string(realEnergyIntensity) +
			"\t" + to_string(idealEnergyIntensity) + "\t" + to_string(45) + "\n";
	}
};

void SetupVec(vector<Building>& buildings, string fileName)
{
	ifstream inFS;

	int curID = 0;
	double curFloorArea = 0.0;
	double curSurfaceArea = 0.0;
	double curVolume = 0.0;
	double curKWH = 0.0;
	double curHcvKWH = 0.0;
	double curEnergyCosts = 0.0;
	double curEnergyHcvCosts = 0.0;
	Building curBuilding;

	// Open file
	inFS.open(fileName + ".txt");

	// Make sure file opened properly
	if (!inFS.is_open())
	{
		cout << "There was an error opening the file.\n(is \"" << fileName << "\" in the containing folder?)";
		return;
	}
	else
	{
		cout << "File opened successfully!\nReading data into vector...\n(This may take some time)\n";
	}

	// Read data from input file, and assign it to a Building object
	while (!inFS.eof())
	{

		// Get bID, Area and Volume
		inFS >> curID;
		inFS >> curFloorArea;
		inFS >> curSurfaceArea;
		inFS >> curVolume;
		inFS >> curKWH;
		inFS >> curHcvKWH;
		inFS >> curEnergyCosts;
		inFS >> curEnergyHcvCosts;

		curBuilding = Building(curID, curFloorArea, curSurfaceArea, curVolume, curKWH, curHcvKWH, curEnergyCosts, curEnergyHcvCosts);

		curBuilding.calculateOutputs();

		buildings.push_back(curBuilding);
	}

	cout << "All buildings successfully set up and put into vector!\nClosing file...\n";

	inFS.close();
}

void OutputNewTable(vector<Building> buildings, string fileName, double& totalfloorArea, double& totalSurfaceArea,
	double& totalVolume, double& totalKWH, double& totalHcvKWH, double& totalEnergyCosts,
	double& totalEnergyHcvCosts, double& totalWastedKWH, double& totalSurfaceAreaIdeal,
	double& totalSurfaceAreaDelta, double& totalCO2e_real_MT, double& totalCO2e_ideal_MT,
	double& totalCO2e_wasted_MT, double& totalCO2e_wasted_cost, double& totalCO2o_wasted_MT,
	double& totalCO2o_wasted_cost)
{
	ofstream outFS;
	ofstream outSummaryFS;
	double totalWastedEnergyPct = 0.0;
	double totalWastedCost = 0.0;
	double totalRealEnergyIntensity = 0.0;
	double totalIdealEnergyIntensity = 0.0;
	double totalUNEnergyIntensity = 45.0;


	// Open output file
	outFS.open(fileName + "_output.txt");

	// Check file
	if (!outFS.is_open())
	{
		cout << "Could not open output file (even though we're supposed to be creating it???" << endl;
		return;
	}

	// Put header output
	// Here are the already included inputs
	outFS << "ID\tFloor Area\tSurface Area\tVolume\tKWH\tHCV KWH\tEnergy Costs\tNRG HCV Costs\t";
	// Here are our new outputs
	outFS << "Wasted KWH\tIdeal Surface Area\tReal CO2e MT\tIdeal CO2e MT\tWasted CO2e MT\tWasted CO2e $\t";
	outFS << "Wasted CO2o MT\tWasted CO2o $\tWasted KWH%\tWasted KWH $\tReal NRG Intensity\tIdeal NRG Intensity\t";
	outFS << "UN NRG Intensity" << endl;

	for (Building& building : buildings)
	{
		outFS << building.getAllVars();
		// Update accumulators for summary report
		totalfloorArea += building.getFloorArea();
		totalSurfaceArea += building.getSurfaceArea();
		totalVolume += building.getVolume();
		totalKWH += building.getKWH();
		totalHcvKWH += building.getHcvKWH();
		totalEnergyCosts += building.getEnergyCosts();
		totalEnergyHcvCosts += building.getEnergyHcvCosts();
		totalWastedKWH += building.getWastedKWH();
		totalSurfaceAreaIdeal += building.getIdealSurfaceArea();
		totalSurfaceAreaDelta += building.getSurfaceAreaDelta();
		totalCO2e_real_MT += building.getRealCO2eMT();
		totalCO2e_ideal_MT += building.getIdealCO2eMT();
		totalCO2e_wasted_MT += building.getWastedCO2eMT();
		totalCO2e_wasted_cost += building.getWastedCO2eCost();
		totalCO2o_wasted_MT += building.getWastedCO2oMT();
		totalCO2o_wasted_cost += building.getWastedCO2oCost();
	}
	outFS.close();
	cout << "Closed Output Report." << endl;

	//CREATE SUMMARY TABLE
	outSummaryFS.open(fileName + "_SummaryOutput.txt");
	if (!outSummaryFS.is_open()) {
		cout << "Could not open summary output file!" << endl;
		return;
	}

	totalRealEnergyIntensity = totalHcvKWH / totalfloorArea;
	totalIdealEnergyIntensity = (totalHcvKWH - totalWastedKWH) / totalfloorArea;
	totalWastedEnergyPct = totalWastedKWH / totalHcvKWH;
	totalWastedCost = totalWastedEnergyPct * totalEnergyHcvCosts;

	// Write summary table header
	outSummaryFS << "Total Floor Area M2\tTotal Surface Area M2\tTotal Volume M3\t";
	outSummaryFS << "Total KWH\tTotal HCV KWH\tTotal NRG $\tTotal HCV NRG $\t";
	outSummaryFS << "Total Wasted KWH\tTotal Surface Area Ideal\tTotal Surface Area Delta\t";
	outSummaryFS << "Total CO2e Real (MT)\tTotal CO2e Ideal (MT)\tTotal CO2e Wasted (MT)\t";
	outSummaryFS << "Total CO2e Wasted $\tTotal CO2o Wasted (MT)\tTotal CO2o Wasted $\t";
	outSummaryFS << "Total Wasted KWH Percent\tTotal Wasted $\tReal NRG Intensity\t";
	outSummaryFS << "Ideal NRG Intensity\tUN NRG Intensity" << endl;

	// Write accumulated values
	outSummaryFS << totalfloorArea << "\t" << totalSurfaceArea << "\t" << totalVolume << "\t";
	outSummaryFS << totalKWH << "\t" << totalHcvKWH << "\t" << totalEnergyCosts << "\t";
	outSummaryFS << totalEnergyHcvCosts << "\t" << totalWastedKWH << "\t" << totalSurfaceAreaIdeal << "\t";
	outSummaryFS << totalSurfaceAreaDelta << "\t" << totalCO2e_real_MT << "\t" << totalCO2e_ideal_MT << "\t";
	outSummaryFS << totalCO2e_wasted_MT << "\t" << totalCO2e_wasted_cost << "\t" << totalCO2o_wasted_MT << "\t";
	outSummaryFS << totalCO2o_wasted_cost << "\t" << totalWastedEnergyPct << "\t" << totalWastedCost << "\t";
	outSummaryFS << totalRealEnergyIntensity << "\t" << totalIdealEnergyIntensity << "\t" << totalUNEnergyIntensity << endl;

	outSummaryFS.close();
	cout << "Closed Summary Report";
}

double calcSurfaceAreaIdeal(double inVolume, double inSurfaceArea)
{
	double sArea_ideal = (6.0 * pow(inVolume, (2.0 / 3.0)));//based on a cube
	return sArea_ideal;
}

double calcWastedKWH(double inSurfaceArea, double inVolume, double inHcvKWH, double inbldArea)
{
	// hcv = heating cooling ventilation
	// slope M = (x2-x1) / (y2 -y1)
	double slope = KWH_M2_SV_SLOPE;
	//Calculate the existing building's S/V ratio (S/V_existing) 
	//by dividing its surface area by its volume:
	double x2 = inSurfaceArea / inVolume; // surface to volume ratio REAL;
	double x1 = calcSurfaceAreaIdeal(inVolume, inSurfaceArea) / inVolume; // surface to volume ration IDEAL;
	// Calculate the deviation from the optimal S/V ratio (delta_S/V) 
	// by subtracting the optimal value from the existing value:
	double xD = x2 - x1;
	double y2 = inHcvKWH / inbldArea; // kwh_m2
	double y1 = y2 - (slope * (xD));
	//Calculate the additional kWh due to the non-optimal form 
	//(kWh_additional) by multiplying the deviation in 
	//S/V ratio (delta_S/V) by the slope and 
	//the existing building's surface area:
	double sv_added_kwh = slope * xD * inSurfaceArea;

	return sv_added_kwh;
}

double calcEmbodiedCO2_MT_real(double inSurfaceArea, double inSurfaceAreaIdeal)
{
	/*
	Industry Targets for CARBON
	1.  LETI Average Building 2020 - 950 kgCO2e/m2
	1a. LETI Average Commercial Building 2020 - 1000 kgCO2e/m2
	1b. LETI Average Residential Building 2020 - 800 kgCO2e/m2	
	*/

	double CO2e_MT;
	return CO2e_MT = (1000 * (inSurfaceArea - inSurfaceAreaIdeal)) / 1000;

}

double calcEmbodiedCO2_MT_ideal(double inSurfaceArea, double inSurfaceAreaIdeal)
{
	/*
	Industry Targets for CARBON
	LETI Design Target 2030 ? 350 kgCO2e/m2
	*/

	double CO2e_MT;
	return CO2e_MT = (350 * (inSurfaceArea - inSurfaceAreaIdeal)) / 1000;
}