(() => {

  const GameBoard = (() => {

    let gameScore = ['', '', '',
                     '', '', '', 
                     '', '', '']
    
    // Possible WINS

    // HORIZONTAL:
      // top row = 0, 1, 2 OK
      // middle row = 3, 4, 5 OK
      // bottom row = 6, 7, 8 OK

    // VERTICAL:
      // left row = 0, 3, 6 OK
      // middle row = 1, 4, 7 OK
      // right row = 2, 5, 8 OK
    
    // DIAGONAL:
      // diagonal left right = 0, 4, 8
      // diagonal right left = 2, 4, 6

    // Algorithm to check the winner:
      // Store the possible winning sequences in an array inside an object
        // Check to se if it is a valid win
          // return a X or O value

    const winner = gameScore => {

      // loop the defined intervals of each possible win and stores it in the respective array X or O
      const winLoop = (index, maxValue, incrementation, arrayX, arrayO) => {
        for (index; index <= maxValue; index += incrementation) {
          if (gameScore[index] == 'X') {
            arrayX.push('X')
          } else if (gameScore[index] == 'O') {
            arrayO.push('O')
          }
        }
      }

      // Function checkWin to check if the data entered is a Win
        //Return a boolean if the X or O has been entered 3 times in the array created by the 
      const checkWinX = winData => {
        if (winData.length == 3) {
            return true
        }
      }

      const checkWinO = winData => {
        if (winData.length == 3) {
          return true
        }
      }

      // Return the final winner value
      const whoWins = (arrayX, arrayO) => {
        if (checkWinX(arrayX)) {
          return 'X'
        }
        if (checkWinO(arrayO)) {
          return 'O'
        }
      }

      const horizontal = {
        topRow: () => {

          let data = {
            X: [],
            O: [],
          }
          winLoop(0, 2, 1, data.X, data.O)
          return whoWins(data.X, data.O)
        },
        middleRow: () => {

          let data = {
            X: [],
            O: []
          }
          winLoop(3, 5, 1, data.X, data.O)
          return whoWins(data.X, data.O)
        },
        bottomRow: () => {

          let data = {
            X: [],
            O: []
          }
          winLoop(6, 8, 1, data.X, data.O)
          return whoWins(data.X, data.O)
        }
      }

      const vertical = {
        leftRow: () => {

          let data = {
            X: [],
            O: []
          }

          winLoop(0, 6, 3, data.X, data.O)
          return whoWins(data.X, data.O)
        },
        middleRow: () => {

          let data = {
            X: [],
            O: []
          }

          winLoop(1, 7, 3, data.X, data.O)
          return whoWins(data.X, data.O)
        },
        rightRow: () => {
          let data = {
            X: [],
            O: []
          }

          winLoop(2, 8, 3, data.X, data.O)
          return whoWins(data.X, data.O)
        }
      }

      const diagonal = {
        left: () => {
          let data = {
            X: [],
            O: []
          }

          winLoop(0, 8, 4, data.X, data.O)
          return whoWins(data.X, data.O)
        },
        right: () => {
          let data = {
            X: [],
            O: []
          }

          winLoop(2, 6, 2, data.X, data.O)
          return whoWins(data.X, data.O)
        }
      }

      
      let validateWinner = weapon => {
        if (
          horizontal.topRow() == weapon ||
          horizontal.middleRow() == weapon ||
          horizontal.bottomRow() == weapon ||
          vertical.leftRow() == weapon ||
          vertical.middleRow() == weapon ||
          vertical.rightRow() == weapon ||
          diagonal.left() == weapon ||
          diagonal.right() == weapon)
          {
          return true
        }
      }

      // If there is a winnner the winner() function returns a value of X or O

      if (validateWinner('X')) {
        return 'X'
      } else if (validateWinner('O')) {
        return 'O'
      }

    }

    const Game = (playerOne, playerTwo, roundNumber, gameEnded) => {

      // Objects that defines which turn it is

      let playerTurn = {
        playerOne: true,
        playerTwo: false,
      }

      // Listen to any click on the table


      displayController.tableClickListen(squareID => {

        if (!gameEnded) { // Check to see if the game has ended

          

          //Validate if it's the player turn
          if (playerOne.name && playerTwo.name) {
            displayController.gameDisplay.currentTurn(playerOne.name, playerTwo.name, roundNumber)

            if (playerTurn.playerOne && roundNumber < 9) {
              playerOne.play(squareID)
              displayController.updateDisplay()
    
              // Validate if a valid play has ben added to the GameBoard
              if (GameBoard.gameScore[squareID] == playerOne.weapon) {
                roundNumber++
                playerTurn = {
                playerOne: false,
                playerTwo: true,
                }
              }
            } 
    
            if (playerTurn.playerTwo && roundNumber < 9) { 
              playerTwo.play(squareID)
              displayController.updateDisplay()
    
              if (GameBoard.gameScore[squareID] == playerTwo.weapon) {
                roundNumber++
                playerTurn = {
                  playerOne: true,
                  playerTwo: false,
                }
              }
            }
          } 
            
  
          if (winner(gameScore) == 'X') {
            displayController.gameDisplay.updateWinner(playerOne.name) // Show Winner
            gameEnded = true
          } else if(winner(gameScore) == 'O') {
            displayController.gameDisplay.updateWinner(playerTwo.name)
            gameEnded = true
          } else if (roundNumber >= 9) {
            displayController.gameDisplay.tie()
            gameEnded = true
          }

          
        }
      }) 
    }

    return {
      gameScore,
      Game,
    }
  })()
  
  
// Factory function to create a player and its habilities

  const Player = (name, weapon) => {

    // Feeds the Gameboard with the player Weapon
    const play = (squareID) => {
      if (GameBoard.gameScore[squareID] == '') { // Validates if the position on the gameboard is empty
        GameBoard.gameScore[squareID] = weapon
      } else {
      }
    }

    return { name, weapon, play }
  }



  // Constrols the display
  const displayController = (() => {

    // Listen to the click on the game table
    let squareID = 0
    const tableClickListen = (callback) => {
      
      let square = document.querySelectorAll('th')
      square.forEach(Element => {
          Element.addEventListener('click', () => {
            squareID = Element.id - 1
            callback(squareID)
        })      
      })
    }

    let buttonClickListen = {
      start: callback => {
        let startButton = document.getElementById('startButton')
        startButton.addEventListener('click', () => {
        callback()
        })
      },
      reset: callback => {
        let resetButton = document.getElementById('resetButton')
        resetButton.addEventListener('click', () => {
          callback()
        })
      }
    }

    // Updates the display with the current Gameboard values
    const updateDisplay = () => { 
      let index = 1
      GameBoard.gameScore.forEach(Element => {
        let square = document.getElementById(index)
        let textNode = document.createTextNode(Element)
        if (square.textContent == '') {
          square.appendChild(textNode)
        } else {}
        index++
      })
    }

    const resetDisplay = () => {
      for(let i = 1; i <= 9; i++) {
        let square = document.getElementById(i)
        square.textContent = ''
      }
      }
        

    let getName = {
      playerOne: () => {
        let playerNode = document.getElementById('playerOneName')
        return playerNode.value
      },
      playerTwo: () => {
        let playerNode = document.getElementById('playerTwoName')
        return playerNode.value
      }
    }

    const gameDisplay = {
      currentTurn: (playerOneName, playerTwoName, roundNumber) => {
        let gameDisplay = document.getElementById('gameDisplay')
        if (roundNumber % 2 != 0) {
          gameDisplay.textContent = `${playerOneName} turn (X)`
        } else {
          gameDisplay.textContent = `${playerTwoName} turn (O)`
        }
      },

      updateWinner: playerName => {
        const gameDisplay = document.getElementById('gameDisplay')
        gameDisplay.textContent = `${playerName} is the winner!`
      },

      tie: () => {
        const gameDisplay = document.getElementById('gameDisplay')
        gameDisplay.textContent = `It's a tie!`
      },
      reset: () => {
        const gameDisplay = document.getElementById('gameDisplay')
        gameDisplay.textContent = `Click START to begin`
      }

    }

    
    return { 
      updateDisplay, 
      tableClickListen, 
      buttonClickListen, 
      getName,
      gameDisplay,
      resetDisplay,
    }
  })()



  // Start the game

  displayController.buttonClickListen.start(() => {
    playerOne = Player(
      displayController.getName.playerOne(),
      'X'
    )
    
    playerTwo = Player(
      displayController.getName.playerTwo(),
      'O'
    )
    


    GameBoard.Game(playerOne, playerTwo, 0, false) // Start the game logic

    if (playerOne.name && playerTwo.name) {
      displayController.gameDisplay.currentTurn(playerOne.name, playerTwo.name)
    } else {
      alert("Insert players names")
    }
    

    
  })

  // Reset the game

  displayController.buttonClickListen.reset(() => {
    
    for (let i = 0; i < GameBoard.gameScore.length; i++) {
      GameBoard.gameScore[i] = ''
    }
    displayController.resetDisplay()
    displayController.gameDisplay.reset()

  })


})()