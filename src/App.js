import  React, {Component}  from 'react';
import './index.css';


var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

const Numbers = (props) => {

  const getClassName = (number)=> {

      if(props.usedNumbers.indexOf(number) >=0 ){
        return 'selected';
      }
      if(props.selectedNumbers.indexOf(number)>=0){
        return 'disabled';
      }
  }
    return (
        <div className= "card text-center">
            <div className="numbers">
              {Numbers.list.map((number,i) =>
                  <span  onClick={() => props.clickHandler(number)} className={getClassName(number)} key={i}> {number} </span>
              )}
            </div>

        </div>

    )

}
Numbers.list = [1,2,3,4,5,6,7,8,9,10];
 const Buttons = (props) =>{
   let button ;
   switch (props.isCorrectAnswer){
      case true:
        button =  <button className="btn btn-success"
         onClick = {props.updateUsedNumbers}> <i className="fa fa-check" /></button>
         break;
       case false :
          button =  <button className="btn btn-danger"
          > <i className="fa fa-times"/> </button>
        break;
        default :
          button =  <button className="btn btn-primary" disabled = {props.selectedNumbers.length === 0 }
           onClick = {props.checkAnswer}> = </button>

   }
  return (
      <div className= "col-md-2">
        {button}
        <br/><br/>
        <button className ="btn btn-warning " onClick={props.redraw} disabled ={props.redrawCount === 0 }>
        <i className="fa fa-refresh"/>{props.redrawCount} </button>
      </div>

  )

}

const Stars = (props) => {

     let stars = [];
     for (let i=0; i < props.starsCount; i++){
        stars.push(<i key = {i} className="fa fa-star"/>);
     }
    return (
        <div className= "stars col-md-5">
            {stars}
        </div>
    )
}

const Answer = (props) => {
    return (
        <div className="numbers col-md-5">
          {props.selectedNumbers.map( (number,i) =>
              <span key={i} onClick = {() => props.handleUnselect(number)}>{number}
              </span>
          )}
        </div>
    )

}

const Done = (props) => {
    return (
        <div className="text-center">
          <h1>{props.doneStatus}</h1>
            <button onClick={props.resetHandler}>Reset Game</button>
          </div>
    )
}
class Game extends Component{
  static randomNum = () => 1 + Math.floor(Math.random()* 9);
  static initialState = () => ({
    selectedNumbers : [],
    randomNoOfStars : Game.randomNum(),
    isCorrectAnswer : null,
    usedNumbers : [],
    redraws :5,
    doneStatus : null
  });
  state = Game.initialState();
   isSumPossible = ({randomNoOfStars , usedNumbers}) => {
      const possibleNumbers = Game.list.filter(number => usedNumbers.indexOf(number) === -1 );
      return possibleCombinationSum( possibleNumbers, randomNoOfStars);

  }

  resetHandler = () => this.setState( Game.initialState() );

  updateDoneStatus = () => {
      this.setState(  prevState => {
          if( this.state.usedNumbers.length === 10 ){
              return { doneStatus : 'You Won!'} ;
          }
          else if ( this.state.redraws ===0 && !this.isSumPossible(prevState) ){
              return {doneStatus : 'Game Over'}
          }
      } );

  }
  redraw = () => {
    if(this.state.redraws === 0 ) return ;
    this.setState( (prevState )=> ({
        randomNoOfStars :  Game.randomNum(),
        isCorrectAnswer :null,
        selectedNumbers : [],
        redraws : prevState.redraws - 1

    }), this.updateDoneStatus );
  }
  handleClick = (number) => {
        this.setState( (prevState) => {
              let newState = [];
              if(this.state.selectedNumbers.indexOf(number) < 0)
                    newState = prevState.selectedNumbers.concat(number);
              else
                    newState = prevState.selectedNumbers;
              return {
                  selectedNumbers : newState,
                  isCorrectAnswer: null
              }
        });
  }

  checkAnswer = () => {
      this.setState( (prevState) => ({
          isCorrectAnswer : prevState.randomNoOfStars ===
                  prevState.selectedNumbers.reduce( (prev,curr) =>  prev+ curr , 0 )
      }))

  }


  unSelect = (unselectedNumber) => {
      this.setState( (prevState) => ({
          selectedNumbers : prevState.selectedNumbers.filter( (number)=> number !== unselectedNumber),
          isCorrectAnswer: null
      }))
  }

  updateUsedNumbers = () => {
      this.setState ( (prevState) => ({
          usedNumbers : prevState.usedNumbers.concat(prevState.selectedNumbers),
          selectedNumbers : [],
          isCorrectAnswer : null,
          randomNoOfStars : Game.randomNum()

      }),this.updateDoneStatus  );
  }
  render(){
    const { selectedNumbers, randomNoOfStars,
       isCorrectAnswer,usedNumbers,redraws, doneStatus } = this.state;
    return (
        <div className = "container">
            <h3>Play Nine</h3>
            <hr/>
            <div className = "row">
              <Stars  starsCount ={randomNoOfStars}/>
              <Buttons selectedNumbers = {selectedNumbers }
                checkAnswer = {this.checkAnswer}
                isCorrectAnswer = {isCorrectAnswer}
                updateUsedNumbers = {this.updateUsedNumbers }
                redraw = {this.redraw}
                redrawCount = {redraws}
              />
              <Answer selectedNumbers = {selectedNumbers}  handleUnselect={this.unSelect}/>
            </div>
            <hr/>
            {doneStatus ?
              <Done doneStatus = {doneStatus } resetHandler ={this.resetHandler}/>  :
              <Numbers selectedNumbers = {selectedNumbers} clickHandler={this.handleClick}
                usedNumbers = {usedNumbers} />
            }


        </div>

    );
  }
}
Game.list = [1,2,3,4,5,6,7,8,9];
class App extends Component {
  render() {
    return (
      <div>
          <Game/>
      </div>
    );
  }
}

export default App;
