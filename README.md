# Live Football Score

## Available Scripts

In the project directory, you can run:

### `npm install`

To install all the dependencies.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

Following project displays a list of teams available for the match , as you select the teams ( which is 2 teams ) ,only then you can start a match. 
Once the match is started , you can update the score from `Update Score` board.

On click of `Update` button, the scores will be updated for that particular matchi n the scoreboard.

On click of `gameover` the match will be removed the scoreboard and the teams will be available again for a new match.

The scores in the scoreboard are sorted as per the total score of match. if more than 1 team has same total score then they are sorted based on how recently the match was started.

