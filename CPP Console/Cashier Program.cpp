// C++ Console App, made in Visual Studio

#include <iostream>
#include <limits>
#include <iomanip>
#include <cmath>
#include <string>
using namespace std;

int main()
{
	// Initializing variables to be input
	string item1;
	string item2;
	string item3;
	double price1;
	double price2;
	double price3;
	double taxRate;
	int quantity1;
	int quantity2;
	int quantity3;

	// Initialize variables for change
	double amountGiven;
	double change;
	int numBills;

	// Initialize variables for cost summary
	double cost1;
	double cost2;
	double cost3;
	double totalCost;
	double totalTax;
	double finalCost;

	// Header
	cout << "--------------- John's Cashier's Program ---------------" << endl << endl;

	// Get info about Item 1
	cout << "Enter the name of item 1: ";
	getline(cin, item1);

	cout << "Enter the price of " << item1 << ": $";
	cin  >> price1;
	
	while (!cin) {
		cin.clear();
		cin.ignore(numeric_limits<streamsize>::max(), '\n');
		cout << "Bad input, reenter: ";
		cin >> price1;
	}

	cout << "Enter the quantity of " << item1 << ": ";
	cin  >> quantity1;

	while (!cin) {
		cin.clear();
		cin.ignore(numeric_limits<streamsize>::max(), '\n');
		cout << "Bad input, reenter: ";
		cin >> quantity1;
	}

	// Get info about Item 2
	cout << endl << "Enter the name of item 2: ";
	cin.ignore();
	getline(cin, item2);

	cout << "Enter the price of " << item2 << ": $";
	cin  >> price2;

	while (!cin) {
		cin.clear();
		cin.ignore(numeric_limits<streamsize>::max(), '\n');
		cout << "Bad input, reenter: ";
		cin >> price2;
	}

	cout << "Enter the quantity of " << item2 << ": ";
	cin  >> quantity2;

	while (!cin) {
		cin.clear();
		cin.ignore(numeric_limits<streamsize>::max(), '\n');
		cout << "Bad input, reenter: ";
		cin >> quantity2;
	}

	// Get info about Item 3
	cout << endl << "Enter the name of item 3: ";
	cin.ignore();
	getline(cin, item3);

	cout << "Enter the price of " << item3 << ": $";
	cin  >> price3;

	while (!cin) {
		cin.clear();
		cin.ignore(numeric_limits<streamsize>::max(), '\n');
		cout << "Bad input, reenter: ";
		cin >> price3;
	}

	cout << "Enter the quantity of " << item3 << ": ";
	cin  >> quantity3;

	while (!cin) {
		cin.clear();
		cin.ignore(numeric_limits<streamsize>::max(), '\n');
		cout << "Bad input, reenter: ";
		cin >> quantity3;
	}

	// Get the tax rate from user
	cout << endl << "Enter tax rate (%): ";
	cin  >> taxRate;

	while (!cin || taxRate < 0 || taxRate > 100) {
		cin.clear();
		cin.ignore(numeric_limits<streamsize>::max(), '\n');
		cout << "Bad input, reenter: ";
		cin >> taxRate;
	}
	
	// Calculate the cost summary
	cost1	  = (double)price1 * quantity1;
	cost2	  = (double)price2 * quantity2;
	cost3	  = (double)price3 * quantity3;
	totalCost = cost1 + cost2 + cost3;
	totalTax  = round(totalCost * (taxRate / 100.0) * 100) / 100.0;
	finalCost = totalCost + totalTax;

	// Print out the cost summary
	cout << endl << "--------------- Cost Summary ---------------" << endl << endl;
	
	cout << left << setw(13) << "Item" << setw(12) << "Unit Price" << setw(10) << "Quantity" << right << setw(9) << "Cost"      << endl;
	cout << left << setw(13) << "----" << setw(12) << "----------" << setw(10) << "--------" << setw(15)	     << "---------" << endl;
	
	cout << left << setw(13) << item1 << "$" << right << setw(9) << setprecision(4) << price1 << setw(10) << quantity1 << setw(3) << "$" << right << setw(8) << setprecision(4) << cost1 << endl;
	cout << left << setw(13) << item2 << "$" << right << setw(9) << setprecision(4) << price2 << setw(10) << quantity2 << setw(3) << "$" << right << setw(8) << setprecision(4) << cost2 << endl;
	cout << left << setw(13) << item3 << "$" << right << setw(9) << setprecision(4) << price3 << setw(10) << quantity3 << setw(3) << "$" << right << setw(8) << setprecision(4) << cost3 << endl;

	cout << "--------------------------------------------" << endl;

	cout << left << setw(35) << "Total before tax: " << "$" << right << setw(8) << setprecision(4) << totalCost << endl;
	cout << left << setw(35) << "Tax: "				 << "$" << right << setw(8) << setprecision(4) << totalTax  << endl;

	cout << "--------------------------------------------" << endl;

	cout << left << setw(35) << "Total Cost: "		 << "$" << right << setw(8) << setprecision(4) << finalCost << endl << endl;

	// Get input for change
	cout << "Tell the customer the total cost." << endl;
	cout << "How much money did the customer give you?: $";
	cin	 >> amountGiven;

	while (!cin || amountGiven < finalCost) {
		cin.clear();
		cin.ignore(numeric_limits<streamsize>::max(), '\n');
		cout << "Bad input, reenter: ";
		cin >> amountGiven;
	}

	// Calculate change
	change = amountGiven - finalCost;

	cout << endl << "-------------------------" << endl;
	cout << "Change: $" << right << setw(16) << setprecision(4) << change;
	cout << endl << "-------------------------" << endl;

	cout << endl << "Denominations..." << endl;

	// Number of 100's
	numBills = (int)(change   / 100);
	change  -= numBills * 100.0;
	cout << "$100 bills: " << right << setw(13) << numBills << endl;

	// Number of 20's
	numBills = (int)(change   / 20);
	change  -= numBills * 20.0;
	cout << "$20 bills: "  << right << setw(14) << numBills << endl;

	// Number of 5's
	numBills = (int)(change   / 5);
	change  -= numBills * 5.0;
	cout << "$5 bills: "   << right << setw(15) << numBills << endl;

	// Number of 1's
	numBills = (int)change;
	change -= numBills;
	cout << "$1 dollars: " << right << setw(13) << numBills << endl;

	// Number of quarters
	numBills = (int)(change / 0.25);
	change -= numBills * 0.25;
	cout << "Quarters: "   << right << setw(15) << numBills << endl;

	// Number of dimes
	numBills = (int)(change / 0.10);
	change -= numBills * 0.10;
	cout << "Dimes: "	   << right << setw(18) << numBills << endl;

	// Number of nickels
	numBills = (int)(change / 0.05);
	change -= numBills * 0.05;
	cout << "Nickels: "	   << right << setw(16) << numBills << endl;

	// Number of pennies
	numBills = (int)(change / 0.01);
	change -= numBills * 0.01;
	cout << "Pennies: "    << right << setw(16) << numBills << endl;

	// Test input : Chicken 5.01 6 Salmon 10.45 2 Soda 4 4 8
	
	return 0;
}