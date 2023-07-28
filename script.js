// Global variables
let calledNumbers = [];
let ticketNumbers = [];
let buttonClickSound;
let array = [];

 // Create the button click sound
 buttonClickSound = new Audio('4V2QKN6-vibrant-game-game-touch-5.mp3');
 buttonClickSound.volume = 0.5;


// Function to call a random number and mark the Tambola board and ticket table
function callNumber() {
    const min = 1;
    const max = 90;

    let randomNumber;
    do {
      randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (calledNumbers.includes(randomNumber));

    calledNumbers.push(randomNumber);
    markNumberOnBoard(randomNumber);
    markNumberOnTicket(randomNumber);

    // Save calledNumbers to localStorage
    localStorage.setItem("calledNumbers", JSON.stringify(calledNumbers));

    // Speak the called number
    speakNumber(randomNumber);
  }

  // Function to mark the Tambola board when a number is called
  function markNumberOnBoard(number) {
    const cell = document.querySelector(`td[data-number="${number}"]`);
    if (cell) {
      cell.classList.add("called");
    }
  }

  // Function to mark the ticket table when a number is called
  function markNumberOnTicket(number) {
    const ticketCells = document.querySelectorAll(".ticket .cell");
    ticketCells.forEach((cell) => {
      if (cell.dataset.number === number.toString()) {
        cell.classList.add("ticket-called");
      }
    });
  }

  function newGame() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
        cell.classList.remove("called");
    });

    const ticketCells = document.querySelectorAll(".ticket .cell");
    ticketCells.forEach((cell) => {
        cell.classList.remove("ticket-called");
    });

    // Remove the ticket table
    const ticketContainer = document.querySelector(".tickets");
    if (ticketContainer) {
        const container = document.querySelector(".container");
        container.removeChild(ticketContainer);
    }
 // Play button click sound
 buttonClickSound.play();
 calledNumbers = [];
    // Clear calledNumbers and ticketNumbers from localStorage
    localStorage.removeItem('calledNumbers');
    localStorage.removeItem('ticketNumbers');

    const generateTicketsBtn = document.getElementById('generateTicketsBtn');
    const gen = document.getElementById("ticket-generator")
    const callNumberBtn = document.getElementById('callNumberBtn');
    const newGameBtn = document.getElementById('newGameBtn');
    generateTicketsBtn.style.display = 'none';
    callNumberBtn.style.display = 'none';
    gen.style.display = "none";
    newGameBtn.style.display = 'none';

    // Show the "Start Game" button
    const startGameBtn = document.getElementById('startGameBtn');
    startGameBtn.style.display = 'block';

   
}


  function startGame() {
    // Hide the "Start Game" button and show the other buttons
    const generateTicketsBtn = document.getElementById('generateTicketsBtn');
    const gen = document.getElementById("ticket-generator")
    const callNumberBtn = document.getElementById('callNumberBtn');
    const newGameBtn = document.getElementById('newGameBtn');
    generateTicketsBtn.style.display = 'block';
    callNumberBtn.style.display = 'block';
    gen.style.display = "inline-flex";
    newGameBtn.style.display = 'block';

    // Show the "Start Game" button
    const startGameBtn = document.getElementById('startGameBtn');
    startGameBtn.style.display = 'none';

    // Speak the message "Let's start the game"
    speakMessage("Let's start the game");

}
// Function to show the ticket table on page load and mark the called numbers
function showTicketTable() {
    const container = document.querySelector(".container");
    const ticketContainer = document.querySelector(".tickets");
  
    // Clear any existing ticket table
    if (ticketContainer) {
      container.removeChild(ticketContainer);
    }
  
    // Check if there are generated tickets
    if (ticketNumbers.length > 0) {
      const ticketTables = document.createElement("div");
      ticketTables.classList.add("tickets");
  
      // Create a ticket table for each ticket in ticketNumbers
      for (let i = 0; i < ticketNumbers.length; i++) {
        const ticket = ticketNumbers[i];
        const ticketTable = createTicketElement(ticket);
        ticketTables.appendChild(ticketTable);
  
        // Mark the called numbers on the ticket table
        calledNumbers.forEach((number) => {
          const ticketCells = ticketTable.querySelectorAll(".cell");
          ticketCells.forEach((cell) => {
            if (cell.dataset.number === number.toString()) {
              cell.classList.add("ticket-called");
            }
          });
        });
      }
  
      container.appendChild(ticketTables);
    }
  }

function generateTickets() {
    let numTickets = parseInt(document.getElementById("numTickets").value);
    if (!isNaN(numTickets)) {
        ticketNumbers = []; // Clear existing tickets
        const ticketContainer = document.createElement("div");
        ticketContainer.classList.add("tickets");

        for (let i = 0; i < numTickets; i++) {
            const ticket = generateRandomTicket();
            ticketNumbers.push(ticket);
            const ticketTable = createTicketElement(ticket);
            ticketContainer.appendChild(ticketTable);
        }

        const container = document.querySelector(".container");
        const oldTicketsContainer = document.querySelector(".tickets");
        if (oldTicketsContainer) {
            container.removeChild(oldTicketsContainer);
        }

        container.appendChild(ticketContainer);
        // Save ticketNumbers to localStorage
        localStorage.setItem("ticketNumbers", JSON.stringify(ticketNumbers));
    }

    numTickets = "";
    // Play button click sound
    buttonClickSound.play();
}


function generateRandomTicket() {
    const ticket = [];
    const min = 1;
    const max = 90;
    const numCells = 27; // Each ticket has 27 cells (3x9 layout)
    const numRandomNumbers = 15; // Number of random numbers to generate
  
    // Generate random numbers for the ticket
    while (ticket.length < numRandomNumbers) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!ticket.includes(randomNumber)) {
        ticket.push(randomNumber);
      }
    }
  
    // Fill the rest of the cells with blank cells (-1)
    for (let i = 0; i < numCells - numRandomNumbers; i++) {
      ticket.push(-1);
    }
  
    // Shuffle the ticket array to randomize the placement of numbers and blank cells
    for (let i = ticket.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ticket[i], ticket[j]] = [ticket[j], ticket[i]];
    }
  
    return ticket;
  }



function createTicketElement(ticket) {
    const ticketTable = document.createElement("table");
    ticketTable.classList.add("board");
    ticketTable.classList.add("ticket");

    for (let i = 0; i < 3; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < 9; j++) {
            const cell = document.createElement("td");
            cell.classList.add("cell");
            const index = i * 9 + j;
            cell.dataset.number = ticket[index];
            cell.textContent = ticket[index] !== -1 ? ticket[index] : '';
            row.appendChild(cell);
        }

        ticketTable.appendChild(row);
        array.push(ticketTable)
        
    }
    
   
    return ticketTable;
    
    
}

const generateBoardNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= 90; i++) {
      numbers.push(i);
    }
    return numbers;
  };
  function speakNumber(number) {
    // Check if the browser supports speech synthesis
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`Number ${number}`);
        speechSynthesis.speak(utterance);
    }
}
  // Function to render the Tambola Board
  const renderBoard = () => {
    const boardContainer = document.getElementById('board');
    const numbers = generateBoardNumbers();
    
    for (const number of numbers) {
      const cell = document.createElement('div');
      cell.className = 'board-cell';
      cell.textContent = number;
      boardContainer.appendChild(cell);
      
    }
  };
  // Function to initialize the game
// Function to initialize the game
function initializeGame() {
    // Retrieve calledNumbers from localStorage
    const storedCalledNumbers = JSON.parse(localStorage.getItem('calledNumbers'));
    if (storedCalledNumbers) {
      calledNumbers = storedCalledNumbers;
      // Mark the previously called numbers on the board
      storedCalledNumbers.forEach((number) => {
        markNumberOnBoard(number);
        markNumberOnTicket(number);
      });
    }
  
    // Retrieve ticketNumbers from localStorage
    const storedTicketNumbers = JSON.parse(localStorage.getItem('ticketNumbers'));
    if (storedTicketNumbers) {
      ticketNumbers = storedTicketNumbers;
    }
  
    // Show the ticket table on page load
    showTicketTable();
  }
  // Function to generate the Tambola Board
  function generateBoard() {
    const boardContainer = document.getElementById('board');

    for (let i = 0; i < 9; i++) {
      const row = document.createElement('tr');
      for (let j = 1; j <= 10; j++) {
        const cell = document.createElement('td');
        cell.classList.add('cell')
        const number = i * 10 + j;
        cell.dataset.number = number;
        cell.textContent = number;
        row.appendChild(cell);
         // Check if the number is already called and mark it as yellow
         if (calledNumbers.includes(number)) {
            cell.classList.add("called");
          }
      }
      boardContainer.appendChild(row);
    }
  }
  generateBoard();


// Add this function to initialize the button click sound
function initButtonClickSound() {
    buttonClickSound = document.getElementById('button-click-sound');
    speechSynthesis = window.speechSynthesis || null;


    
    // Add event listener for the "Restart" button click
const restartBtn = document.getElementById('restartBtn');
restartBtn.addEventListener('click', newGame);
}
function speakMessage(message) {
    // Check if the browser supports speech synthesis
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utterance);
    }
}


// Load the initial page state on page load
window.addEventListener("load", () => {
   

     // Show the "Start Game" button
     const startGameBtn = document.getElementById('startGameBtn');
     startGameBtn.style.display = 'none';
      // Hide the other buttons initially
    const generateTicketsBtn = document.getElementById('generateTicketsBtn');
    const gen = document.getElementById("ticket-generator")
    const callNumberBtn = document.getElementById('callNumberBtn');
    const newGameBtn = document.getElementById('newGameBtn');
    generateTicketsBtn.style.display = 'block';
    callNumberBtn.style.display = 'block';
    gen.style.display = "inline-flex";
    newGameBtn.style.display = 'block';
     
  
    
    // Initialize the game
    initializeGame();
  });
   
  
  // Save the current state to LocalStorage on window beforeunload event
  window.addEventListener("beforeunload", () => {
    localStorage.setItem('calledNumbers', JSON.stringify(calledNumbers));
    localStorage.setItem('ticketNumbers', JSON.stringify(ticketNumbers));
  });
  
  
  
  
  
  