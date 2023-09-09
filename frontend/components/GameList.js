import React from 'react'

import '../css/gamelist.css'

const games = [
    {
        id: 1,
        game: 'Minesweeper',
        construction: true,
        image: 'https://is2-ssl.mzstatic.com/image/thumb/Purple1/v4/12/2a/9b/122a9b30-0bfd-f7d8-3831-f125dbfea919/source/512x512bb.jpg',
        genre: [
            'Logic',
            'Puzzle'
        ],
        creator: 'Robert Donner and Curt Johnson',
        by: 'delimmaemma and Tito2point0'
    },
    {
        id: 2,
        game: 'Tic-Tac-Toe', // Have gamemode of ultimate which is a three by three grid of three games. The winner of that marks that square as an X or O until three games are won in a row
        construction: true,
        image: 'https://cdn0.iconfinder.com/data/icons/web-ui-vol-4/64/tic_tac_toe-512.png',
        genre: 'Paper-and-Pencil',
        creator: 'Unknown, originated in the Ancient Roman Empire - first century BC',
        by: 'delimmaemma',
        evenOut: 1
    },
    {
        id: 3,
        game: 'Concentration',
        construction: true,
        image: 'https://www.play.vg/g2_imgs/g2_52.gif',
        genre: 'Card Game',
        creator: 'Unknown',
        by: 'delimmaemma',
        evenOut: 2
    },
    {
        id: 4,
        game: 'Black Jack',
        construction: true,
        image: 'https://is4-ssl.mzstatic.com/image/thumb/Purple123/v4/98/32/16/98321621-d9c3-42b9-4382-cfbe85f59fa2/source/512x512bb.jpg',
        genre: [
            'Card Game', 
            'Casino Game'
        ],
        creator: 'Unknown, likely Spanish origin',
        by: 'delimmaemma',
        evenOut: 2
    },
    {
        id: 5,
        game: '2048',
        construction: true,
        image: 'http://gabrielecirulli.github.io/2048/meta/og_image.png',
        genre: 'Puzzle',
        creator: 'Gabriele Cirulli',
        by: 'delimmaemma',
        evenOut: 2
    },
    {
        id: 6,
        game: 'Monopoly',
        construction: true,
        image: 'https://is2-ssl.mzstatic.com/image/thumb/Purple125/v4/f4/7d/64/f47d6402-c01f-ecf5-c800-a63f0c3555ea/source/512x512bb.jpg',
        genre: 'Board',
        creator: 'Lizzie Magie and Charles Darrow',
        by: 'delimmaemma',
        evenOut: 1
    }
]

const GameList = () => {

    const onClick = (game) => {
        console.error(`${game.toUpperCase()} IS UNDER CONSTRUCTION!`)
    }
    return (
        <div className='game-select'>
          {games.map((game) => (
            <div 
                key={game.id} 
                className={`selection ${game.construction ? 'construction' : ''}`} 
                style={{ cursor: !game.construction ? 'pointer' : 'default' }} // If construction is false, able to click
                onClick={!game.construction ? () => onClick(game.game) : null} // If construction is false, next statements run
            >
              <div className='image-container'>
                <img
                  className='image'
                  src={game.image}
                  alt={game.game}
                />
              </div>
              {game.construction && (
                <div className='construction-overlay'>
                  <p className='construction-text'>Under Construction</p>
                </div>
              )}
              <div className='info-container'>
                <p className='title'>{game.game}</p>
                <p className='info'>Genre: {game.genre.length === 2 ? `${game.genre[0]} | ${game.genre[1]}` : game.genre}</p>
                <p className='info'>Creator: {game.creator}</p>
                <p className='info'>Coded by: {game.by}</p>
              </div>
              {game.evenOut && game.evenOut === 2 ? <><br/><br/></> : null}
              {game.evenOut && game.evenOut === 1 ? <><br/></> : null}
            </div>
          ))}
        </div>
      );
      
      
      
}

export default GameList