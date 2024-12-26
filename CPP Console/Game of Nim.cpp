// C++ Console App, made in Visual Studio

#include <iostream>
#include <Windows.h>
#include <string>
using namespace std;

int main()
{
	// Initialize variables
	int curStones = 0;   // The current amount of stones in the pile
	int curDecr = 0;	 // Current amount of stones to decrement
	bool playerTurn = 0; // Keeps track of whos turn it is
	bool hardmode = 0;   // Determines whether or not hardmode is enabled
	char playerInput;    // For choosing difficulty

	// Generate random num of stones, between 10-21 inclusive
	srand(time(0));
	curStones = (rand() % 12) + 10;

	// Generate random bool for turn
	playerTurn = rand() % 2;

	// Print game rules
	cout << "==================== GAME OF NIM ====================" << endl;
	cout << "Rules of this game:" << endl;
	cout << "* Each player takes turns removing either 1, 2, or 3 stones from the pile." << endl;
	cout << "* The player who makes the final move of the game LOSES!" << endl << endl;

	// Prompt user for easy or hardmode
	cout << "Choose Difficulty:" << endl;
	cout << "Easy Mode (e) or Hard Mode (h): ";
	cin >> playerInput;
	playerInput = tolower(playerInput);

	// Validate Input
	while (!cin || (playerInput != 'h' && playerInput != 'e'))
	{
		cin.clear();
		cin.ignore(100, '\n');
		cout << "Input must be 'e' or 'h'." << endl;
		cout << "Easy Mode (e) or Hard Mode (h): ";
		cin >> playerInput;
		playerInput = tolower(playerInput);
	}

	// Set mode and output
	if (playerInput == 'h')
	{
		hardmode = true;
		cout << "You have chosen hard mode." << endl;
		cout << "Good luck." << endl << endl;
	}
	else // Input validation tells us the input must be 'e'
	{
		hardmode = false;
		cout << "You have chose easy mode." << endl;
		cout << "Good luck!" << endl << endl;
	}

	// Game loop
	while (curStones > 0)
	{
		// Output game stats
		cout << "==================== " << curStones << " STONE(S) REMAIN ====================" << endl;
		if (playerTurn) // Player turn
		{
			// Out game state, and get user information
			cout << "It's your move." << endl;
			cout << "Please remove 1, 2, or 3 stones from the pile: ";
			cin >> curDecr;

			// Check for invalid input
			while (!cin || curDecr < 1 || curDecr > 3 || curDecr > curStones)
			{
				cin.clear();
				cin.ignore(100, '\n');
				cout << curDecr << " is not a valid input." << endl;
				cout << "* Keep in mind your input cannot be more than there are stones in the pile." << endl;
				cout << "Please remove 1, 2, or 3 stones from the pile: ";
				cin >> curDecr;
			}

			cout << "You removed " << curDecr << " stone(s) from the pile." << endl;
		}
		else // Computer turn
		{
			// Out game state, and computer "input"
			cout << "It's the computers turn." << endl;
			cout << "Computer is thinking..." << endl;

			if (!hardmode) // Easy mode
			{
				curDecr = rand() % 3 + 1;

				// Validate computer input
				while (!cin || curDecr < 1 || curDecr > 3 || curDecr > curStones)
				{
					cin.clear();
					cin.ignore(100, '\n');
					curDecr = rand() % 3 + 1; // Generate new random number of stones
					if (curStones == 1) curDecr = 1; // To save time
				}
			}
			else // Hard mode
			{
				if (curStones % 4 == 1)
				{
					// No winning strategy, remove 1 stone
					curDecr = 1;
				}
				else
				{
					// Remove enough stones to leave a multiple of 4 plus 1
					if (curStones % 4 == 0) curDecr = 3;
					if (curStones % 4 == 2) curDecr = 1;
					if (curStones % 4 == 3) curDecr = 2;
				}
			}
			// A little delay to make it think
			Sleep(1000);
			cout << "The computer removes " << curDecr << " stone(s) from the pile." << endl;
		}

		// Progress game - decrement stones and swap turns
		curStones -= curDecr;
		playerTurn = !playerTurn;
		cout << endl;
	}

	// Game has ended, print winner
	//   The winner is actually whos turn it is, because it flips at the end
	cout << "==================== " << curStones << " STONE(S) REMAIN ====================" << endl << endl;
	if (!playerTurn) cout << "* YOU LOSE! :(" << endl;
	if (playerTurn) cout << "* YOU WIN! :)" << endl;
	return 0;
}