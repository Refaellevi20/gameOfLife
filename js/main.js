'use strict'

const GAME_FREQ = 1000
const LIFE = '🎃'
const SUPER_LIFE = '👽'

// The Model
var gBoard
var gGameInterval


function onInit() {
    gBoard = createBoard()
    console.table(gBoard)
    renderBoard(gBoard)
    // play()
}

function onToggleGame(elBtn) {
    // console.log('gGameInterval:', gGameInterval)

    if (gGameInterval) {
        clearInterval(gGameInterval)
        gGameInterval = null
        elBtn.innerText = 'Start'

    } else {
        gGameInterval = setInterval(play, GAME_FREQ)
        elBtn.innerText = 'Pause'
    }
}

function play() {
    gBoard = runGeneration(gBoard)
    renderBoard(gBoard)
}

function createBoard() {
    var board = []
    for (var i = 0; i < 8; i++) {
        board.push([])
        for (var j = 0; j < 8; j++) {
            board[i][j] = (Math.random() > 0.5) ? LIFE : ''
        }
    }
    return board
}

function renderBoard(board) {
    // console.table(board)
    // render the board in table
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var className = (currCell) ? 'occupied' : ''
            var strData = `data-i="${i}" data-j="${j}"`

            strHTML += `<td class="${className}" ${strData}
                            onclick="onCellClicked(this,${i},${j})">
                            ${currCell}
                        </td>`
        }

        strHTML += '</tr>'
    }

    // console.log('strHTML:', strHTML)

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, cellI, cellJ) {
    // console.log('cellI, cellJ:', cellI, cellJ)
    // console.log('elCell:', elCell)
    // if (elCell.classList.contains('occupied')) {
    // if (elCell.innerText === LIFE) {
    if (gBoard[cellI][cellJ] === LIFE) {
        // console.log('Click!')

        // Update the model:
        gBoard[cellI][cellJ] = SUPER_LIFE // [[]]

        // Update the dom:
        elCell.innerText = SUPER_LIFE // <td></td>

        blowUpNegs(cellI, cellJ, gBoard)

    }

}

function blowUpNegs(cellI, cellJ, mat) {
    // console.log('cellI,cellJ:', cellI, cellJ)

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[0].length) continue
            if (mat[i][j] === LIFE) {
                // console.log('i,j', i, j)

                // Update the model:
                mat[i][j] = ''

                // Update the dom:
                var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                elCell.innerText = ''
                elCell.classList.remove('occupied')
            }
        }
    }



}

function runGeneration(board) {
    var newBoard = copyMat(board)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var count = countNegs(i, j, board)
            if ((count > 2) && (count < 6)) {
                if (board[i][j] === '') newBoard[i][j] = LIFE
            } else if (board[i][j] === LIFE) newBoard[i][j] = ''
        }
    }
    return newBoard
}

function countNegs(cellI, cellJ, mat) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) negsCount++
        }
    }
    return negsCount
}
