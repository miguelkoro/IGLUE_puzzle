import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from "./GlobalContext";
import './../assets/scss/main.scss';
import SafeBoxDial from './SafeBoxDial.jsx';
import BoxButton from './BoxButton.jsx';
import Number from './Number.jsx';

const MainScreen = (props) => {
  const { escapp, appSettings, Utils, I18n } = useContext(GlobalContext);
  //const [solutionArray, setSolutionArray] = useState([]); // Array para guardar la solución
  //const [currentSolution, setCurrentSolution] = useState([]);
  const [processingSolution, setProcessingSolution] = useState(false);
  const [light, setLight] = useState("off");
  const [containerWidth, setContainerWidth] = useState(0);//
  const [containerHeight, setContainerHeight] = useState(0);//
  const [containerMarginTop, setContainerMarginTop] = useState(0);//
  const [containerMarginLeft, setContainerMarginLeft] = useState(0);//
  const [boxWidth, setBoxWidth] = useState(0);
  const [boxHeight, setBoxHeight] = useState(0);
  const [lightWidth, setLightWidth] = useState(0); //
  const [lightHeight, setLightHeight] = useState(0); //
  const [lightLeft, setLightLeft] = useState(0);//
  const [lightTop, setLightTop] = useState(0);//

  //
  const [rotationAngle, setRotationAngle] = useState(0); // Estado para la rotación
  const [isReseting, setIsReseting] = useState(false); // Estado para saber si se está reiniciando el lock

  //
  const [password, setPassword] = useState("");

  
//

  useEffect(() => {
    handleResize();
  }, [props.appWidth, props.appHeight]);

  function handleResize(){
    if((props.appHeight === 0)||(props.appWidth === 0)){
      return;
    }

    let aspectRatio = 4 / 3;
    let _keypadWidth = Math.min(props.appHeight * aspectRatio, props.appWidth);
    let _keypadHeight = _keypadWidth / aspectRatio;

    let _lockWidth = Math.min(props.appHeight * aspectRatio, props.appWidth) ;
    let _lockHeight = _lockWidth / aspectRatio;

    let _containerWidth = _lockWidth ;
    let _containerHeight = _lockHeight ;


    let _containerMarginLeft=0;
    let _containerMarginTop=0;

    let _boxWidth = _lockWidth * 0.37;
    let _boxHeight = _lockHeight * 0.37;

    let _lightWidth;
    let _lightHeight;
    let _lightLeft;
    let _lightTop;



    switch(appSettings.skin){
      case "RETRO":
        _containerMarginTop = 0;
        _containerHeight = _lockHeight *0.55;
        _lightWidth = _lockWidth * 0.18;
        _lightHeight = _lockHeight *0.18;
        _lightLeft = _lockWidth * 0;
        _lightTop =  _lockHeight * -0.14;
        break;
      case "FUTURISTIC":
        _containerMarginTop = 0;
        _containerHeight = _lockHeight *0.605;
        _lightWidth = _lockWidth*0.9;
        _lightHeight = _lockHeight*0.6;
        _boxHeight = _lockHeight * 0.9;
        _boxWidth = _lockWidth * 0.9;

        break;
      default:
        _lightWidth = _lockWidth * 0.08;
        _lightHeight = _lockHeight * 0.08;
        _lightLeft =  _lockWidth  * 0.33;
        _lightTop =  _lockHeight  * 0.32
    }

    setContainerWidth(_containerWidth);
    setContainerHeight(_containerHeight);
    setContainerMarginTop(_containerMarginTop);
    setContainerMarginLeft(_containerMarginLeft);

    setBoxWidth(_boxWidth);
    setBoxHeight(_boxHeight);

    setLightWidth(_lightWidth);
    setLightHeight(_lightHeight);
    setLightLeft(_lightLeft);
    setLightTop(_lightTop);
  }

  /*const onClickButton = (value) => {
    if (processingSolution) {
      return;
    }
    Utils.log("onClickButton", value);
    setProcessingSolution(true);

    const shortBeep = document.getElementById("audio_beep");
    shortBeep.pause();
    shortBeep.currentTime = 0;
    shortBeep.play();

    setTimeout(() => {
      currentSolution.push(value);
      if (currentSolution.length < appSettings.solutionLength) {
        setCurrentSolution(currentSolution);
        setProcessingSolution(false);
      } else {
        const solution = currentSolution.join((["COLORS","SYMBOLS"].indexOf(appSettings.keysType) !== -1) ? ";" : "");
        setCurrentSolution([]);
        Utils.log("Check solution", solution);
        escapp.checkNextPuzzle(solution, {}, (success, erState) => {
          Utils.log("Check solution Escapp response", success, erState);
          try {
            setTimeout(() => {
              changeBoxLight(success, solution);
            }, 700);
          } catch(e){
            Utils.log("Error in checkNextPuzzle",e);
          }
        });
      }
    }, 300);
  }*/

  const checkSolution = () => {
    setProcessingSolution(true);
    reset(); // Reinicia el lock
    Utils.log("Check solution", password);
    escapp.checkNextPuzzle(password, {}, (success, erState) => {
          Utils.log("Check solution Escapp response", success, erState);
          try {
            setTimeout(() => {
              changeBoxLight(success, password);
            }, 700);
          } catch(e){
            Utils.log("Error in checkNextPuzzle",e);
          }
        });
  }

  const changeBoxLight = (success, solution) => {
    let audio;
    let afterChangeBoxLightDelay = 2000;
    if (success) {      
      setLight("ok");
      audio = document.getElementById("audio_success");
    } else {
      audio = document.getElementById("audio_failure");
      setLight("nok");
      reset(); //
    }

    setTimeout(() => {
      if(!success){
        setLight("off");
        setProcessingSolution(false);
      }
    }, afterChangeBoxLightDelay);

    if(success){
      audio.play();
      setTimeout(() => {     
       // props.onKeypadSolved(solution); //Cambiar
      }, appSettings.delaySoundOk);
    }else
      audio.play();
  }

  //Pone la imagen del fondo
  let backgroundImage = 'url("' + appSettings.background + '")';
  if(appSettings.background && appSettings.background !== "NONE"){
    backgroundImage += ', url("' + appSettings.background + '")';
  }


  const  reset = () =>{
    setPassword("");
    setTimeout(() => {      
      setIsReseting(false);
    }, 2500);
  }

  useEffect(() => { // Comprueba si se ha alcanzado el número máximo de intentos (En local y en API)           
    //console.log("Tries: ", tries, "Solution: ", solutionArray);
      password.length >= appSettings.solutionLength && checkSolution();
      Utils.log("Solution: ", password);
  }, [password]);

  return (
    <div id="screen_main" className={"screen_content"} style={{ backgroundImage: backgroundImage }}>
      <div id="telephoneContainer" className="telephoneContainer" 
        style={{backgroundImage: 'url('+appSettings.backgroundTelephone+')', width: containerWidth, height: containerHeight, }}>
          <div className='numbersContainer' style={{ width: props.boxWidth, height: props.boxHeight, }}>
             <Number value={0}/>
             <Number value={1}/>
             <Number value={2}/>
             <Number value={3}/>
             <Number value={4}/>
             <Number value={5}/>
             <Number value={6}/>
             <Number value={7}/>
             <Number value={8}/>
             <Number value={9}/>
          </div>
          <SafeBoxDial
              boxWidth={boxWidth} boxHeight={boxHeight} checking={processingSolution} 
              rotationAngle={rotationAngle} setRotationAngle={setRotationAngle}
              setPassword={setPassword}/>
              
         <div className="boxLight boxLight_off" style={{ visibility: light === "off" ? "visible" : "hidden", opacity: light === "off" ? "1" : "0", width: lightWidth, height: lightHeight, backgroundImage: 'url("' + appSettings.imageLightOff + '")', left: lightLeft, top: lightTop }} ></div> 
        <div className="boxLight boxLight_nok" style={{ visibility: light === "nok" ? "visible" : "hidden", opacity: light === "nok" ? "1" : "0", width: lightWidth, height: lightHeight, backgroundImage: 'url("' + appSettings.imageLightNok + '")', left: lightLeft, top: lightTop }} ></div> 
        <div className="boxLight boxLight_ok" style={{ visibility: light === "ok" ? "visible" : "hidden", opacity: light === "ok" ? "1" : "0", width: lightWidth, height: lightHeight, backgroundImage: 'url("' + appSettings.imageLightOk + '")', left: lightLeft, top: lightTop }} ></div>
      </div>
        

        <audio id="audio_success" src={appSettings.soundOk} preload="auto"></audio>
        <audio id="audio_failure" src={appSettings.soundNok} preload="auto"></audio>
 
     
    </div>);
};

export default MainScreen;