import React, { Component,useEffect,useState } from 'react';
import words from './words.json'
import './App.css';
import Grid from './Grid';
import GameOver from './GameOver';


const words_with_5_letters = words.filter(word=>word.length==5);
const initRound = 0
const defaultMatrix = new Array(6).fill(0)
.map(row=>new Array(5).fill(''));
const defaultClassMatrix = new Array(6).fill(0)
.map(row=>new Array(5).fill('cell'));
function App() {

  const [lettersMatrix,setLettersMatrix] = useState(defaultMatrix);
  const [classMatrix,setClassMatrix] = useState(defaultClassMatrix);
  const [round,setRound] = useState(initRound)
  const [selectedKeys,setSelectedKeys] = useState();
  const [word,setWord] = useState(randomWord());
  const [gameState,setGameState] = useState('')


  const renderMatrix = lettersMatrix
  .map((word,row)=>
    word.map((letter,indx)=>{
    return <div key={indx} id={row*6+indx} className={classMatrix[row][indx]}>{letter}</div>
  }))

  function handleRestart(){
      setLettersMatrix(new Array(6).fill(0)
      .map(row=>new Array(5).fill('')))
      setClassMatrix(new Array(6).fill(0)
      .map(row=>new Array(5).fill('cell')))
      setRound(initRound)
      setWord(randomWord())
      setGameState('')
  }

  function handleKeyPress({key,code}){
    console.log(word)
    const matrix = [...lettersMatrix];
    const classesMatrix = [...classMatrix];
    const currentRow = matrix[round];
    const freeSpot = currentRow.indexOf('');

    // Add letter
    if(key!='Enter' && code!="Backspace"){
      if(freeSpot>-1) {
        matrix[round][freeSpot] = key
        classesMatrix[round][freeSpot] = "cell anim"
        setLettersMatrix(matrix)
        setClassMatrix(classesMatrix)
      }
      
    }
    // Remove letter
    else if(code=='Backspace'){
      if(freeSpot>-1){
        matrix[round][freeSpot-1]=''
        classesMatrix[round][freeSpot-1] = "cell"
      }
      else{
        matrix[round][currentRow.length-1]=''
        classesMatrix[round][currentRow.length-1] = "cell"
      }
      setLettersMatrix(matrix)
      setClassMatrix(classesMatrix)
    }
    // Guess word
    else if(key=='Enter'){
      if(freeSpot<0){
        if(!words_with_5_letters.includes(currentRow.join(''))) return

        currentRow.forEach((letter,index)=>{
          let style = ''
          word.charAt(index)==letter?style="cell correct":
          !word.includes(letter)?style="cell incorrect":
          currentRow.indexOf(letter)==currentRow.lastIndexOf(letter)?style="cell different":
          word.indexOf(letter)==word.lastIndexOf(letter)?style="cell different":
          style="cell incorrect"
          // classesMatrix[round][index]=style
          style=="cell incorrect"?style="cell incorrect flip-incorrect":
          style=="cell correct"?style="cell correct flip-correct":
          style="cell different flip-different"
          setTimeout(() => {
            const el = document.getElementById(round*6+index)
            el.className=style
          }, 175*index);
        })


        setTimeout(() => {
          setClassMatrix(classesMatrix)
        }, 1000);

        if(currentRow.join('')==word){
          setGameState('won')
          return
        }

        if(round==5){
          setGameState('lost')
        }
        else{
          setRound((prev)=>prev+1)
        }
      }
    }
  }

  useEffect(()=>{
    window.addEventListener('keydown',handleKeyPress)

    return ()=> window.removeEventListener('keydown',handleKeyPress)
  },[round,gameState])

  return (
    <div className="App">
      <h1 className='logo'>Textle</h1>
      <div className="matrix">
        {renderMatrix}
      </div>
      <GameOver gameState={gameState} attempts={round} handleRestart={()=>handleRestart()} />
    </div>
  );
}

function randomWord(){
  return words_with_5_letters[Math.floor(Math.random()*words_with_5_letters.length)]
}

export default App;
