// C++ Console App, made in Visual Studio

#include <iostream>
#include <string>
#include <cstring>
using namespace std;

// Converts coordinate NUMBER to board row index
int c2ToASCII(string coordinate2);

// Converts coordinate LETTER to board column index
int c1ToASCII(string coordinate1);

// Parameters:  A Coordinate spot in the format "A-H" + "1-8", and the 2D board array
// Output:      The string held in the board at the coordinates
// Description: This function takes coordinates and returns the string in those board coordinates. If coordinates are out of bounds, returns "X"
string coordsToBoard(string coordinates, string board[8][8]);

// Sets the board spot at pToReplace as pReplacer. Puts as empty when pReplacer == " "
void setBoardSpot(string pToReplace, string pReplacer, string board[8][8]);

// Overloaded function, in case you have coordinates and not the spot as a string. I promise this is helpful
void setBoardSpot(int row, int col, string pReplacer, string board[8][8]);

// Moves pSelected to pRequested, removing a middle piece if there's a jump. This is mostly for organization purposes
void movePiece(string pSelected, string pRequested, string board[8][8]);

// Pauses the program until the user presses 'Enter'
void wait();

// Prints the rules page of the game
void printRules();

// Prints the help page of the game
void printHelp();

// Prints the board out
void printBoard(string board[8][8]);

// A function to initialize the game
void initGame(string board[8][8]);

int main()
{
	// Initialize Variables
	string board[8][8];
	string input; // This is the user's input, to be rewritten every game loop
	string player = "O";

	// Track pieces taken, theres 12 of each.
	int OsTaken = 0;
	int SsTaken = 0;

	// For piece moving
	string selectedPiece;
	string requestedSpot;
	int selectedCol;
	int selectedRow;
	int requestedCol;
	int requestedRow;
	int distHorz;
	int distVert;
	string currentPiece;
	string middlePiece;
	int pMiddleRow;
	int pMiddleCol;
	
	// Setting initial board with pieces
	initGame(board);

	cout << "* Welcome to Checkers!\n*  By [REDACTED] & John" << endl;
	wait();

	// Game Loop 
	do {
		system("CLS");
		printBoard(board);

		cout << "\nPlayer (" << player << ") to move.\n";

		// Get user input
		cout << "\n > ";
		getline(cin, input);

		// Help Command
		if (input == "help") printHelp();

		// Rules Command
		else if (input == "rules") printRules();

		// Quit Command
		else if (input == "quit") break;

		// Game Logic
		else if (input.substr(0, 4) == "move" && input.size() == 10)
		{
			selectedPiece = input.substr(5, 2);
			requestedSpot = input.substr(8, 2);
			
			selectedCol = c1ToASCII(selectedPiece.substr(0, 1));
			selectedRow = c2ToASCII(selectedPiece.substr(1, 1));
			requestedCol = c1ToASCII(requestedSpot.substr(0, 1));
			requestedRow = c2ToASCII(requestedSpot.substr(1, 1));
			
			distHorz = abs(requestedCol - selectedCol);
			distVert = abs(requestedRow - selectedRow);
			
			currentPiece = coordsToBoard(selectedPiece, board);
			
			pMiddleRow;
			pMiddleCol;

			// Finding the middle spot to delete (if the move is a jump)
			if (requestedCol > selectedCol) // Jump is to the right
			{
				pMiddleCol = requestedCol - 1;
			}
			else							// Jump is to the left
			{
				pMiddleCol = requestedCol + 1;
			}

			if (requestedRow < selectedRow) // Jump is upward
			{
				pMiddleRow = requestedRow + 1;
			}
			else							// Jump is downward
			{
				pMiddleRow = requestedRow - 1;
			}

			if (pMiddleRow <= 7 && pMiddleCol <= 7 && pMiddleRow >= 0 && pMiddleCol >= 0)
			{
				middlePiece = board[pMiddleRow][pMiddleCol];
			}
			
			// -- incoming input validation holy -- 
			
			// Check if spots are in bounds
			if (currentPiece == "X" || coordsToBoard(requestedSpot, board) == "X")
			{
				cout << endl << "* This input is invalid." << endl << endl;
				cout << " Move was not detected on the board." << endl;
				wait();
			}
			// Make sure piece is moving forward, with respect to piece
			else if ((requestedRow <= selectedRow && currentPiece == "S")
				  || (requestedRow >= selectedRow && currentPiece == "O"))
			{
				cout << endl << "* This input is invalid." << endl << endl;
				cout << " Cannot move backwards." << endl;
				wait();
			}
			// Make sure move is diagonal
			else if (distVert != distHorz)
			{
				cout << endl << "* This input is invalid." << endl << endl;
				cout << " Move must be horizontal." << endl;
				wait();
			}
			// Make sure move piece is the current players piece
			else if ((currentPiece == "S") && player == "O" || (currentPiece == "O") && player == "S"
				  || (currentPiece == "$") && player == "O" || (currentPiece == "0") && player == "S")
			{
				cout << endl << "* This input is invalid." << endl << endl;
				cout << " Cannot move a piece that is not yours." << endl;
				wait();
			}
			// Make sure spot to move is blank
			else if (coordsToBoard(requestedSpot, board) != " ")
			{
				cout << endl << "* This input is invalid" << endl << endl;
				cout << " Another piece was in that spot." << endl;
				wait();
			}
			// Check if the move is over an enemy piece
			else if ((distHorz == 2) && 
				   (middlePiece == "O" && player == "O" || middlePiece == "0" && player == "O"
				||  middlePiece == "S" && player == "S" || middlePiece == "$" && player == "S"
				||  middlePiece == " "))
			{
				cout << endl << "* This input is invalid" << endl << endl;
				cout << " Piece being jumped over does not belong to the opponent." << endl;
				wait();
			}
			// Make sure move is only 1 or 2 spaces
			else if (distHorz > 2)
			{
				cout << endl << "* This input is invalid" << endl << endl;
				cout << " Piece cannot move more than 2 spaces at a time." << endl;
				wait();
			}
			// All input validation succeeded
			else {
				// This is to move the piece
				movePiece(selectedPiece, requestedSpot, board);

				// This is to swap the turn
				if (player == "S")
				{
					player = "O";
					if (distHorz == 2) OsTaken++;
				}
				else
				{
					player = "S";
					if (distHorz == 2) SsTaken++;
				}

				// Check if game was won
				if (SsTaken == 12 || OsTaken == 12)
				{
					cout << endl;
					if (player == "S") cout << "------ Player O Wins! ------";
					if (player == "O") cout << "------ Player S Wins! ------";

					cout << endl << "Play again? (y/n): ";
					getline(cin, input);
					if (input.substr(0, 1) == "y")
					{
						// Restarting game
						
						player = "O";
						OsTaken = 0;
						SsTaken = 0;

						initGame(board);
					}
					else break;
				}
			}
		}

		// Unrecognized Command
		else if (input != "q")
		{
			system("CLS");
			cout << "\n\"" << input << "\" is not a command on the list.\nType \"help\" for help.\n";
			
			// player tip
			if (input.substr(0, 4) == "move") cout << " Make sure 'move' is in format 'move A8 B1'\n (must have exactly 10 characters)\n";

			wait();
		}
	} while (input != "q");

	cout << "* Thank you for playing appreciate it have a wonderful day!" << endl;

	return 0;
}

int c2ToASCII(string coordinate2) {
	int row;
	
	if (coordinate2 < "1" || coordinate2 > "8") return -1;

	row = abs((coordinate2.at(0) % 49) - 7);
	// 7 is subtracted because the indexes are backwards to the coordinates. "8" is ind 0, "1" is ind 7.

	return row;
}

int c1ToASCII(string coordinate1)
{
	int col;
	
	coordinate1 = toupper(coordinate1.at(0));
	if (coordinate1 < "A" || coordinate1 > "H") return -1;
	
	col = coordinate1.at(0) % 65;

	return col;
}

string coordsToBoard(string coordinates, string board[8][8])
{
	int col = c1ToASCII(coordinates.substr(0, 1));
	int row = c2ToASCII(coordinates.substr(1, 1));

	// Check in bounds
	if (row > 7 || col > 7 || row < 0 || col < 0) return "X";

	return board[row][col];
}

void setBoardSpot(string pToReplace, string pReplacer, string board[8][8])
{
	int col = c1ToASCII(pToReplace.substr(0, 1));
	int row = c2ToASCII(pToReplace.substr(1, 1));
	string pieceToSet; // once we decipher pReplacer

	// Check in bounds
	if (row > 7 || col > 7 || row < 0 || col < 0) return;

	if (pReplacer == " ")
	{
		pieceToSet = " ";
	}
	else if (pReplacer != "$" && pReplacer != "0")
	{
		pieceToSet = coordsToBoard(pReplacer, board);
	}
	else pieceToSet = pReplacer;

	board[row][col] = pieceToSet;
}

void setBoardSpot(int row, int col, string pReplacer, string board[8][8])
{
	string pieceToSet; // once we decipher pReplacer

	// Check in bounds
	if (row > 7 || col > 7 || row < 0 || col < 0) return;

	if (pReplacer == " ")
	{
		pieceToSet = " ";
	}
	else
	{
		pieceToSet = coordsToBoard(pReplacer, board);
	}

	board[row][col] = pieceToSet;
}

void movePiece(string pSelected, string pRequested, string board[8][8])
{
	int selectedCol = c1ToASCII(pSelected.substr(0, 1));
	int selectedRow = c2ToASCII(pSelected.substr(1, 1));
	int requestedCol = c1ToASCII(pRequested.substr(0, 1));
	int requestedRow = c2ToASCII(pRequested.substr(1, 1));

	int pMiddleRow;
	int pMiddleCol;

	// First, check to see if it's a jump or a simple move
	if (abs(selectedRow - requestedRow) > 1 && abs(selectedCol - requestedCol) > 1) // It's a jump
	{
		// Finding the middle spot to delete
		if (requestedCol > selectedCol) // Jump is to the right
		{
			pMiddleCol = requestedCol - 1;
		}
		else							// Jump is to the left
		{
			pMiddleCol = requestedCol + 1;
		}

		if (requestedRow < selectedRow) // Jump is upward
		{
			pMiddleRow = requestedRow + 1;
		}
		else							// Jump is downward
		{
			pMiddleRow = requestedRow - 1;
		}

		// Check if the piece reached the end of the board
		if (coordsToBoard(pSelected, board) == "S" && requestedRow == 7)
		{
			setBoardSpot(pRequested, "$", board);
		}
		else if (coordsToBoard(pSelected, board) == "O" && requestedRow == 0)
		{
			setBoardSpot(pRequested, "0", board);
		}
		else
		{
			setBoardSpot(pRequested, pSelected, board);		// Put the piece in place
		}

		setBoardSpot(pMiddleRow, pMiddleCol, " ", board);	// Delete the middle piece
		setBoardSpot(pSelected, " ", board);				// Put the old spot as blank
	}
	else // This is a move
	{
		// Check if the piece reached the end of the board
		if (coordsToBoard(pSelected, board) == "S" && requestedRow == 7)
		{
			setBoardSpot(pRequested, "$", board);
		}
		else if (coordsToBoard(pSelected, board) == "O" && requestedRow == 0)
		{
			setBoardSpot(pRequested, "0", board);
		}
		else setBoardSpot(pRequested, pSelected, board);	// Put the piece in place
		setBoardSpot(pSelected, " ", board);
	}
}

void wait()
{
	string temp;

	cout << endl << " > Press Enter to continue" << endl;
	getline(cin, temp);
}

void printRules()
{
	system("CLS");
	cout << "\n---------------- RULES --------------------\n";
	cout << "1. To move a piece type in the collum and number of row you want your piece to move. Ex. G 4\n\n";
	cout << "2. Pieces are only allowed to move forward at any given time.\n\n";
	cout << "3. Pieces are only allowed to move diagonal from where they are at on the board.\n    Unless there is 2 enemy checkers blocking the move.\n\n";
	cout << "4. If a enemy piece is diagonal from your piece and does not have another piece \n    diagonal to it you are allowed to move two sqaures diagonal to take the other players piece.\n\n";
	cout << "5. Once a piece reaches the end of the board that piece is now a King.\n\n";
	cout << "6. Kings are allowed to move forwards and backwards on the board.\n\n";
	cout << "-------------------------------------------\n";

	wait();
}

void printHelp()
{
	system("CLS");
	cout << "\n---------------- HELP --------------------\n";
	cout << " > \"help\" to open this menu\n";
	cout << " > \"rules\" to open the rule menu\n";
	cout << " > \"quit\" to end the game\n";
	cout << " > \"move X0 Z9\" to move piece X0 to space Z9\n";
	cout << "   * Use A-H for column, and 1-8 for the row.\n";
	cout << "------------------------------------------\n";

	wait();
}

void printBoard(string board[8][8])
{
	cout << "\nCurrent board:" << endl;

	cout << "-----------------------------------------" << endl <<
		"/X|-A-|-B-|-C-|-D-|-E-|-F-|-G-|-H-\\" << endl <<
		"|-|---|---|---|---|---|---|---|---|" << endl <<
		"|8| " << board[0][0] << " |   | " << board[0][2] << " |   | " << board[0][4] << " |   | " << board[0][6] << " |   |" << endl <<
		"|-|---|---|---|---|---|---|---|---|" << endl <<
		"|7|   | " << board[1][1] << " |   | " << board[1][3] << " |   | " << board[1][5] << " |   | " << board[1][7] << " |" << endl <<
		"|-|---|---|---|---|---|---|---|---|" << endl <<
		"|6| " << board[2][0] << " |   | " << board[2][2] << " |   | " << board[2][4] << " |   | " << board[2][6] << " |   |" << endl <<
		"|-|---|---|---|---|---|---|---|---|" << endl <<
		"|5|   | " << board[3][1] << " |   | " << board[3][3] << " |   | " << board[3][5] << " |   | " << board[3][7] << " |" << endl <<
		"|-|---|---|---|---|---|---|---|---|" << endl <<
		"|4| " << board[4][0] << " |   | " << board[4][2] << " |   | " << board[4][4] << " |   | " << board[4][6] << " |   |" << endl <<
		"|-|---|---|---|---|---|---|---|---|" << endl <<
		"|3|   | " << board[5][1] << " |   | " << board[5][3] << " |   | " << board[5][5] << " |   | " << board[5][7] << " |" << endl <<
		"|-|---|---|---|---|---|---|---|---|" << endl <<
		"|2| " << board[6][0] << " |   | " << board[6][2] << " |   | " << board[6][4] << " |   | " << board[6][6] << " |   |" << endl <<
		"|-|---|---|---|---|---|---|---|---|" << endl <<
		"|1|   | " << board[7][1] << " |   | " << board[7][3] << " |   | " << board[7][5] << " |   | " << board[7][7] << " |" << endl <<
		"\\-L---L---L---L---L---L---L---L---/" << endl;
}

void initGame(string board[8][8])
{
	int i;
	int j;

	for (i = 0; i < 8; i++)
	{
		for (j = 0; j < 8; j++)
		{
			if ((i + j) % 2 == 0)
			{
				if (i <= 2)
				{
					board[i][j] = "S";
				}
				else if (i >= 5)
				{
					board[i][j] = "O";
				}
				else board[i][j] = " ";
			}
			else
			{
				board[i][j] = " ";
			}
		}
	}
}