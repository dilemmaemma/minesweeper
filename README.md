# Minesweeper JavaScript Clone

## About

Minesweeper is a logic puzzle video game genre generally played on personal computers. The game features a grid of clickable squares, with hidden "mines" scattered throughout the board. The objective is to clear the board without detonating any mines, with help from clues about the number of neighboring mines in each field.

## Controls

- Left-click: reveal square
- Right-click: flag square
- Middle-click, shift + enter, or shift + space: reveal all neighboring squares
- F2: start new game

## Tools

- Node >= 16.x
- NPM >= 8.x (update NPM executing `npm i -g npm`)
- Unix-like shell (Gitbash/bash/zsh)

## Libraries Used

- Node.js
- Express
- React.js
- Cors
- SQLite3
- Axios

## Description

This project is composed using JavaScript to help strengthen both front-end and back-end skills. 
The API was built from scratch and is used to communicate to the server to find the forbidden square, pick certain locations for bombs to deploy, and send messages to the client. 
This project was a two person collaboration to help showcase expertise in state management, database management, React, and more.

### Required Dependencies - For Dev Purposes Only

The project needs some additional NPM dependencies in order to work.

### Required Back-End Endpoints - For Dev Purposes Only

- [ ] `[GET] /api/location`
  - Example of response body: `[{"face":smiley,"response":null,"bombs_left":99}]`
  - 
- [ ] `[POST] /api/location`
  - Example of response body: `{face:"dead","response":"You Lost! Play again?","bombs_left":1}`
     
### Required Front-End Endpoints - For Dev Purposes Only

- [X] `Function for recording seconds elapsed`
      
- [ ] `Function for recording x and y coordinates`

- [ ] `Function for recording square pressed`

- [ ] `Function for recording randomization of grid unearthing`

- [ ] `Etc`


