'use strict'
console.log('Mine Sweeper');

var gBoard = [];
var gBoardNegs;

var timerOn = true; // trun to false when not required
var gStartTime;
var gInterval;

var gLevel = { SIZE: 4, MINES: 2 }; // definition of the board 
var gState = {};

var gPRINT = true; // debug and tracking prints to console


function initGame() {
    prinT('GAME INIT');
    if (timerOn) initTimer();
    gState = { isGameOn: true, shownCount: 0, markedCount: 0, secsPassed: 0, minesCount: 0, gameOverReason: 'notOver' };
    var elCell = document.querySelector('.result');
    elCell.innerText = '';
    gLevel = setLevel();
    gBoard = buildBoard(gLevel);
    console.table(gBoard);
    setMinesNegsCount(gBoard);
    console.table(gBoard);
    renderBoard(gBoard, '#board');
}


function gameOver(reason) {
    console.log('GAME OVER');
    gState.gameOverReason = reason;
    window.clearInterval(gInterval);
    showAll(gBoard);

    var elCell = document.querySelector('.result');
    if (gState.gameOverReason === 'mineClicked')
        elCell.innerText = 'GAME OVER: Unfortunately a MINE was clicked';
    else if (gState.gameOverReason === 'resolved')
        elCell.innerText = 'GAME OVER: HORRAY! you marked all MINES and cleared around them';
    else
        elCell.innerText = 'GAME OVER: You clicked the "STOP" button. ';

    gState.isGameOn = false;
}


function changeAppearance(el, className) { // can only be Either SHOWN or MARKED
    el.classList.add(className);

    if (className === 'shown') {
        gState.shownCount++;
    }
    else if (className === 'marked') {
        gState.markedCount++;
    }
    if ((gState.shownCount + gState.markedCount === gLevel.SIZE * gLevel.SIZE) &&
        (gState.markedCount === gState.minesCount)) {
        gameOver('resolved');
    }
}


function unsetClass(el, className) { // used for MARKED
    el.classList.remove(className);
    if (className === 'marked') {
        gState.markedCount--;
        var elCell = document.querySelector('.marked-cells-counter');
        elCell.innerText = gState.markedCount;
    }
}


function cellClicked(elCell, i, j) {

    if (gState.isGameOn === false)
        return false;

    if (gBoard[i][j] === 'X') {
        elCell.classList.add('bomb-touched');
        gameOver('mineClicked');
    }
    else {
        var el = document.querySelector(getSelector(i, j));
        var marked = el.classList.contains('marked');
        var shown = el.classList.contains('shown');

        if (!marked && !shown) {
            changeAppearance(elCell, 'shown');
            if (gBoard[i][j] === 0)
                expandShown(gBoard, elCell, i, j);
        }
    }
}


function expandShown(board, elCell, cellI, cellJ) {
    // TBD 2 layers
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (i < 0 || i >= board.length) continue;
            if (j < 0 || j >= board.length) continue;
            if (board[i][j] !== "X") {
                var el = document.querySelector(getSelector(i, j));
                var marked = el.classList.contains('marked');
                var shown = el.classList.contains('shown');
                if (!marked && !shown) {
                    changeAppearance(el, 'shown');
                    if (board[i][j] === 0) expandShown(board, el, i, j); // expand to all empty
                }
            }
        }
    }
}

function cellMarked(elCell, i, j) {
    if (gState.isGameOn === false) return false;
    var marked = elCell.classList.contains('marked');
    var shown = elCell.classList.contains('shown');
    if (!marked && !shown) changeAppearance(elCell, 'marked');
    else if (marked && !shown) unsetClass(elCell, 'marked');
}








