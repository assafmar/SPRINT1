'use strict'


// print to console with a flag ON/OFF
function prinT(text, param1, param2, param3) {
    if (gPRINT) console.log(text, param1, param2, param3);
}

function printTime() {
    var time = Math.round((Date.now() - gStartTime) / 1000);
    var elCell = document.querySelector('.time-counter');
    elCell.innerText = time;
    return time;
}

function initTimer() {
    console.log('Init Timer');
    gStartTime = Date.now();
    gInterval = setInterval(printTime, 1000);
}

// gLevel setup by radion buttons
function setLevel() {
    var level = {};
    var selectedLevel = document.querySelector('input[name = "level"]:checked').value;
    prinT('Level is set to: ', level);

    if (selectedLevel === 'beginner') level = { SIZE: 4, MINES: 2 };
    else if (selectedLevel === 'medium') level = { SIZE: 6, MINES: 5 };
    else level = { SIZE: 8, MINES: 15 };
    prinT('RETURN level is set to: ', level);
    return level;
}

function buildBoard(gLevel) {
    var boardSize = gLevel.SIZE;
    var board = [];
    for (var i = 0; i < boardSize; i++) {
        var rndLimit = gLevel.MINES / (gLevel.SIZE * gLevel.SIZE);
        prinT('rndLimit', rndLimit);
        var row = [];
        for (var j = 0; j < boardSize; j++) {
            var itsAMine = (Math.random() < rndLimit);
            if (itsAMine) {
                row.push('X');
                gState.minesCount++;
            }
            else row.push('');
        }
        board.push(row);
    }
    return board;
}

function countNegMines(gBoard, cellI, cellJ) {
    var minesCount = 0;
    var boardSize = gLevel.SIZE;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {

            if (i === cellI && j === cellJ) continue;
            if (i < 0 || i >= boardSize) continue;
            if (j < 0 || j >= boardSize) continue;

            var cell = gBoard[i][j];
            if (cell === 'X') {
                minesCount++;
            }
        }
    }
    return minesCount;
}

function setMinesNegsCount(board) { // changes gBoard
    var size = gLevel.SIZE;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (gBoard[i][j] !== 'X') {
                var negsMines = countNegMines(gBoard, i, j);
                gBoard[i][j] = negsMines;
            }
        }
    }
}


function renderBoard(board, selectorTbl) {
    var strHtml = '';
    board.forEach(function (row, i) {
        strHtml += '<tr>\n';
        row.forEach(function (cell, j) {
            var tdId = 'cell-' + i + '-' + j;

            strHtml += '\t<td ';
            strHtml += '< id="' + tdId + '" ';
            strHtml += 'class="table-cell"';
            strHtml += ' oncontextmenu="cellMarked(this,' + i + ',' + j + ')"';//right click
            strHtml += ' onclick="cellClicked(this,' + i + ',' + j + ')">';
            strHtml += (cell) ? cell : '';
            strHtml += '</td>\n';
        });
        strHtml += '</tr>\n';
    });
    var elTable = document.querySelector(selectorTbl);
    elTable.innerHTML = strHtml;
}


function getSelector(i, j) {
    return '#cell-' + i + '-' + j;
}


function showAll(board) {
    var size = board.length
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            var selector = getSelector(i, j);
            var elCell = document.querySelector(selector);
            elCell.classList.add('shown');
        }
    }
}

