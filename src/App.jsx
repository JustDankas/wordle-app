import React, { Component,useEffect,useState } from 'react';
import words from './words.json'
import './App.css';
import Grid from './Grid';
import GameOver from './GameOver';
import {BsFillBackspaceFill} from 'react-icons/bs'

const words_with_5_letters = words.filter(word=>word.length==5);
const initRound = 0
const defaultMatrix = new Array(6).fill(0)
.map(row=>new Array(5).fill(''));
const defaultClassMatrix = new Array(6).fill(0)
.map(row=>new Array(5).fill('cell'));

const lettersArray = ['q','w','e','r','t','y','u','i','o','p',
'a','s','d','f','g','h','j','k','l','Enter',
'z','x','c','v','b','n','m','Backspace'];

const lettersRowArray = [['q','w','e','r','t','y','u','i','o','p'],
['a','s','d','f','g','h','j','k','l'],['Enter',
'z','x','c','v','b','n','m','Backspace']];

const initLettersObj = {}
lettersArray.forEach((letter)=>letter=='Enter' || letter=='Backspace'?
initLettersObj[letter]=letter:initLettersObj[letter]='undefined')

function App() {

  const [lettersMatrix,setLettersMatrix] = useState(defaultMatrix);
  const [classMatrix,setClassMatrix] = useState(defaultClassMatrix);
  const [round,setRound] = useState(initRound)
  const [chosenLetters,setChosenLetters] = useState(initLettersObj);
  const [word,setWord] = useState(randomWord());
  const [gameState,setGameState] = useState('')



  const renderMatrix = lettersMatrix
  .map((word,row)=>
    word.map((letter,indx)=>{
    return <div key={indx} id={row*6+indx} className={classMatrix[row][indx]}>{letter}</div>
  }))

  function HandleClickLetter(letter){
      handleKeyPress(letter)

  }

  function handleRestart(){
      setLettersMatrix(new Array(6).fill(0)
      .map(row=>new Array(5).fill('')))
      setClassMatrix(new Array(6).fill(0)
      .map(row=>new Array(5).fill('cell')))
      setRound(initRound)
      setWord(randomWord())
      setGameState('')
      const dummyLettersObj = {}
      lettersArray.forEach((letter)=>letter=='Enter' || letter=='Backspace'?
      dummyLettersObj[letter]=letter:dummyLettersObj[letter]='undefined')

      setChosenLetters(Object.assign(dummyLettersObj))
  }

  function handleKeyPress(param){
    let key
    let code
    if(typeof param === "object" && !Array.isArray(param)){
      key = param.key
      code = param.code
    }
    else{
      key=param
      code=param
    }
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

        const chosenLettersObj = Object.assign(chosenLetters)

        currentRow.forEach((letter,index)=>{
          let style = ''
          if(word.charAt(index)==letter) style="cell correct flip-correct"
          else if(!word.includes(letter)) style="cell incorrect flip-incorrect"
          else if(word.indexOf(letter)==word.lastIndexOf(letter) && currentRow.indexOf(letter)==index) style="cell different flip-different"
          else if(word.indexOf(letter)!=word.lastIndexOf(letter)) style="cell different flip-different"
          else style="cell incorrect flip-incorrect"
          setTimeout(() => {
            const el = document.getElementById(round*6+index)
            el.className=style
            if(style=="cell incorrect flip-incorrect"){
              if(chosenLettersObj[letter]=='undefined'){
                chosenLettersObj[letter]='incorrect'
              }
            }
            else if(style=="cell different flip-different"){
              if(chosenLettersObj[letter]!='correct'){
                chosenLettersObj[letter]='different'
              }
            }
            else{
              chosenLettersObj[letter] = 'correct'
            }
          }, 175*index);
        })


        setTimeout(() => {
          setClassMatrix(classesMatrix)

          setChosenLetters(chosenLettersObj)
          
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
      <div className="matrix-c">
        <div className="matrix">
          {renderMatrix}
        </div>
      </div>
      <div className="letters-c">
        {lettersRowArray.map((row)=>(
          <div className="row-c">
            {row.map((letter,index)=>(
                <button key={index} 
                className={chosenLetters[letter]=='Enter'?"enter-btn":
                chosenLetters[letter]=='Backspace'?"backspace-btn": 
                chosenLetters[letter]=='undefined'?"letter":
                chosenLetters[letter]=="correct"?"letter correct":
                chosenLetters[letter]=="incorrect"?"letter incorrect":
                "letter different"
              } 
                onClick={()=>HandleClickLetter(letter)}>{letter=="Backspace"?<BsFillBackspaceFill/>:letter}</button>
            ))}
          </div>
        ))}
      </div>
      <GameOver word={word} gameState={gameState} attempts={round} handleRestart={()=>handleRestart()} />
    </div>
  );
}

function randomWord(){
  return words_with_5_letters[Math.floor(Math.random()*words_with_5_letters.length)]
}

export default App;
