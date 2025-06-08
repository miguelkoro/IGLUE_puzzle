import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from "./GlobalContext";
import './../assets/scss/main.scss';
import Dial from './Dial.jsx';
import BoxButton from './BoxButton.jsx';
import Ray from './Ray.jsx';

const MainScreen = (props) => {
  const { escapp, appSettings, Utils, I18n } = useContext(GlobalContext);
  const [tries, setTries] = useState(0); // Contador de intentos
  const [solutionArray, setSolutionArray] = useState([]); // Array para guardar la solución
  const [currentSolution, setCurrentSolution] = useState([]);
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

  const dialSpacing = boxWidth * 0.19; // Espaciado horizontal entre los diales
  const initialPosition = props.appwidth / 2 + boxWidth / 2  * -0.4; // Posición inicial del primer dial desde la derecha

  const [frequency, setFrequency] = useState(0);
  const [wavelength, setWavelength] = useState(0);
  const [amplitude, setAmplitude] = useState(0);
 

  const [checking, setChecking] = useState(false);//Cambiar

  const mapRange = (value, min1, max1, min2, max2) => {
    return min2 + ((value - min1) * (max2 - min2)) / (max1 - min1);
  };
  // 0 a 120 son los valoreas que devuelven los diales, el resto son los rangos de valores que estoy dispuesto a poner
  const frequencyMapped = mapRange(frequency/3, 0, 120, 0.4, 1); // Frecuencia entre 0.6 y 4.2
  const wavelengthMapped = mapRange(wavelength/3, 0, 120, 10, 100); // Wavelength entre 10 y 100
  const amplitudeMapped = mapRange(amplitude/3, 0, 120, 25, 100); // Amplitud entre 25 y 250

  //
  const [rotationAngle, setRotationAngle] = useState(0); // Estado para la rotación
  const [isReseting, setIsReseting] = useState(false); // Estado para saber si se está reiniciando el lock

  //

  const styles ={
    "STANDARD": {
      //lock: "../images/standard/lock_classic.png",
      //dial: "images/standard/dial_classic.png",
      //dial_size: 0.4,
      //dial_sound: "sounds/spin.wav",
      dial_text_color: "#000000",
      dial_text_size: "13vmin",
      //dial_text_zIndex: 1,
    },
    "RETRO": {
      //lock: "images/lock_old.png",
      //dial: "images/dial_old.png",
      //dial_size: 0.5,
      //dial_sound: "sounds/spin_old2.wav",
      dial_text_color:  "#FFFFFF",
      dial_text_size: "10vmin",
      //dial_text_zIndex: 1,
    },
    "FUTURISTIC": {
      //lock: "images/lock_modern.png",
      //dial: "images/dial_modern.png",
      //dial_size: 0.6,
      dial_sound: "sounds/spin.wav",
      dial_text_color: "#59c2ca",
     // dial_text_size: "11vmin",
      //dial_text_zIndex: -1,
    }
  }
  const defaultStyle = styles["STANDARD"];
  const style = styles[appSettings.skin] || styles["STANDARD"];
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

    let _containerWidth = _lockWidth *0.8;
    let _containerHeight = _lockHeight *0.8;


    let _containerMarginLeft=0.1 * _lockWidth;
    let _containerMarginTop=0.68 * _lockHeight;

    let _boxWidth = _lockWidth * 0.7;
    let _boxHeight = _lockHeight * 0.7;

    let _lightWidth;
    let _lightHeight;
    let _lightLeft;
    let _lightTop;



    switch(appSettings.skin){
      case "RETRO":
        _containerMarginTop = 0;
       // _containerMarginLeft = 0;
        //_containerWidth = _lockWidth *0.45;
        _containerHeight = _lockHeight *0.55;
        _lightWidth = _lockWidth * 0.18;
        _lightHeight = _lockHeight *0.18;
        _lightLeft = _lockWidth * 0;
        _lightTop =  _lockHeight * -0.14;
        break;
      case "FUTURISTIC":
        _containerMarginTop = 0;//_lockHeight*0;
        //_containerMarginLeft = _lockWidth * -0.065;
       // _containerWidth = _lockWidth *0.;
        _containerHeight = _lockHeight *0.605;
         _lightWidth = _lockWidth*0.9;
        _lightHeight = _lockHeight*0.6;
        //_lightLeft = props.appWidth / 2 + _lockWidth / 2 * 0;
        //_lightTop = props.appHeight / 2 - _lockHeight / 2 * 0.9;
        _boxHeight = _lockHeight * 0.9;
        _boxWidth = _lockWidth * 0.9;

        break;
      default:
        //Standard skin
       // _containerMarginTop = 0;
        //_containerMarginLeft = _keypadWidth * 0;
        _lightWidth = _lockWidth * 0.08;
        _lightHeight = _lockHeight * 0.08;
        _lightLeft =  _lockWidth  * 0.75;
        _lightTop =  _lockHeight  * 0.05
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
    if (processingSolution) {
      return;
    }
    setProcessingSolution(true);
    Utils.log("Check solution", [ frequency/3, wavelength/3, amplitude/3]);
    const solution = [ frequency/3, wavelength/3, amplitude/3].join(';');
    //const solution="12315"
    reset(); // Reinicia el lock
    console.log("Check solution", solution);
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

  const changeBoxLight = (success, solution) => {
    let audio;
    let afterChangeBoxLightDelay = 1000;
    //appSettings.skin === "RETRO" ? afterChangeBoxLightDelay = 4500 : afterChangeBoxLightDelay = 1500;

    if (success) {
      audio = document.getElementById("audio_success");
      setLight("ok");
      //afterChangeBoxLightDelay = (appSettings.skin === "RETRO" ? 4500 : 1500);
    } else {
      audio = document.getElementById("audio_failure");
      setLight("nok");
      reset(); //
    }

    setTimeout(() => {
      if(!success){
        setLight("off");
        setProcessingSolution(false);
      }else{
        //props.onKeypadSolved(solution); //Cambiar
      }
    }, afterChangeBoxLightDelay);

    audio.play();
  }

  //Pone la imagen del fondo
  //let backgroundImage = 'url("' + appSettings.backgroundKeypad + '")';
  let backgroundImage = 'url("' + appSettings.background + '")';
  if(appSettings.background && appSettings.background !== "NONE"){
    backgroundImage += ', url("' + appSettings.background + '")';
  }


  const  reset = () =>{
    //console.log("Solution: ", solutionArray);
    setIsReseting(true);
    //setRotationAngle(0); // Reinicia el ángulo de rotación
    //setSolutionArray([]);
    setAmplitude(0); // Reinicia la amplitud
    setFrequency(0); // Reinicia la frecuencia
    setWavelength(0); // Reinicia la longitud de onda
    //setTries(0);
    setTimeout(() => {      
      setIsReseting(false);
    }, 2500);
    //setChecking(false);
  }

 /* useEffect(() => { // Comprueba si se ha alcanzado el número máximo de intentos (En local y en API)           
    //console.log("Tries: ", tries, "Solution: ", solutionArray);
      solutionArray.length >= appSettings.solutionLength && checkSolution();
      console.log("Solution: ", solutionArray);
  }, [solutionArray]);*/

  return (
    <div id="screen_main" className={"screen_content"} style={{ backgroundImage: backgroundImage }}>
      {/*<div id="lockContainer" className="lockContainer" 
        style={{backgroundImage: 'url('+appSettings.backgroundLock+')', width: containerWidth, 
          height: containerHeight, marginTop: containerMarginTop, marginLeft: containerMarginLeft ,
          display: "flex", alignItems: "center", 
          justifyContent: "center", flexDirection: "column"
        }}>*/}
        <div className="lockContainer" style={{backgroundImage: 'url('+appSettings.backgroundLock+')', width: containerWidth, 
          height: containerHeight,  }}>
          <div style={{  display: "flex",alignItems: "center",marginTop: containerMarginTop, marginLeft: containerMarginLeft }}>
              <Dial id={"dial-frequency"} boxWidth={boxWidth} boxHeight={boxHeight} checking={processingSolution} 
                rotationAngle={frequency} setRotationAngle={setFrequency} isReseting={isReseting}
                xPosition={boxWidth*appSettings.dialsGap*1} name={appSettings.dialsNames[0]}/>
              <Dial id={"dial-wavelength"}  boxWidth={boxWidth} boxHeight={boxHeight} checking={processingSolution} 
                rotationAngle={wavelength} setRotationAngle={setWavelength} isReseting={isReseting} 
                xPosition={boxWidth*appSettings.dialsGap*2 } name={appSettings.dialsNames[1]}/>
              <Dial id={"dial-amplitude"}  boxWidth={boxWidth} boxHeight={boxHeight} checking={processingSolution} 
                rotationAngle={amplitude} setRotationAngle={setAmplitude} isReseting={isReseting}
                xPosition={boxWidth*appSettings.dialsGap*3} name={appSettings.dialsNames[2]}/>              
          </div>    
          <Ray boxHeight={boxHeight} boxWidth={boxWidth} checking={processingSolution} 
                frequency={frequencyMapped} amplitude={amplitudeMapped} wavelength={wavelengthMapped}/>
      <div className="boxLight boxLight_off" style={{ visibility: light === "off" ? "visible" : "hidden", opacity: light === "off" ? "1" : "0", width: lightWidth, height: lightHeight, backgroundImage: 'url("' + appSettings.imageLightOff + '")', left: lightLeft, top: lightTop }} ></div> 
      <div className="boxLight boxLight_nok" style={{ visibility: light === "nok" ? "visible" : "hidden", opacity: light === "nok" ? "1" : "0", width: lightWidth, height: lightHeight, backgroundImage: 'url("' + appSettings.imageLightNok + '")', left: lightLeft, top: lightTop }} ></div> 
      <div className="boxLight boxLight_ok" style={{ visibility: light === "ok" ? "visible" : "hidden", opacity: light === "ok" ? "1" : "0", width: lightWidth, height: lightHeight, backgroundImage: 'url("' + appSettings.imageLightOk + '")', left: lightLeft, top: lightTop }} ></div>
     {/* <BoxButton value={0} position={initialPosition - dialSpacing} boxWidth={boxWidth} 
        boxHeight={boxHeight} onClick={checkSolution} appwidth={props.appwidth}  appheight={props.appheight}/>*/}
         <div className={"boxButton boxButton"} onClick={() => !processingSolution && checkSolution()} 
        style={{ width: boxWidth *0.12 , height: boxHeight *0.12,
          marginLeft: initialPosition - dialSpacing, marginTop: boxHeight * -0.05, marginLeft: boxWidth * 0.8,
          backgroundImage: 'url("' + appSettings.backgroundKey + '")', position: "absolute",
        //left: props.appwidth / 2 + props.boxWidth / 2 *0.4,
        //bottom: props.appheight / 2 - props.boxHeight / 2 *0.8,
        cursor: "pointer",
        }}> </div>
</div>
      {/*<div id="keypad" style={{ width: containerWidth, height: containerHeight, marginTop: containerMarginTop, marginLeft: containerMarginLeft }}>
        <audio id="audio_beep" src={appSettings.soundBeep} autostart="false" preload="auto" />
        <audio id="audio_failure" src={appSettings.soundNok} autostart="false" preload="auto" />
        <audio id="audio_success" src={appSettings.soundOk} autostart="false" preload="auto" />
        <div id="row1" className="row">
          <BoxButton value={appSettings.keys[0]} position={1} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
          <BoxButton value={appSettings.keys[1]} position={2} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
          <BoxButton value={appSettings.keys[2]} position={3} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
        </div>
        <div id="row2" className="row">
          <BoxButton value={appSettings.keys[3]} position={4} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
          <BoxButton value={appSettings.keys[4]} position={5} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
          <BoxButton value={appSettings.keys[5]} position={6} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
        </div>
        <div id="row3" className="row">
          <BoxButton value={appSettings.keys[6]} position={7} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
          <BoxButton value={appSettings.keys[7]} position={8} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
          <BoxButton value={appSettings.keys[8]} position={9} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
        </div>
        <div id="row4" className="row">
          <BoxButton value={appSettings.keys[9]} position={10} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
          <BoxButton value={appSettings.keys[10]} position={11} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
          <BoxButton value={appSettings.keys[11]} position={12} onClick={onClickButton} boxHeight={boxHeight} boxWidth={boxWidth} />
        </div>
        <div className="boxLight boxLight_off" style={{ visibility: light === "off" ? "visible" : "hidden", opacity: light === "off" ? "1" : "0", width: lightWidth, height: lightHeight, backgroundImage: 'url("' + appSettings.imageLightOff + '")', left: lightLeft, top: lightTop }} ></div> 
        <div className="boxLight boxLight_nok" style={{ visibility: light === "nok" ? "visible" : "hidden", opacity: light === "nok" ? "1" : "0", width: lightWidth, height: lightHeight, backgroundImage: 'url("' + appSettings.imageLightNok + '")', left: lightLeft, top: lightTop }} ></div> 
        <div className="boxLight boxLight_ok" style={{ visibility: light === "ok" ? "visible" : "hidden", opacity: light === "ok" ? "1" : "0", width: lightWidth, height: lightHeight, backgroundImage: 'url("' + appSettings.imageLightOk + '")', left: lightLeft, top: lightTop }} ></div> 
      </div>*/}
        {/*<SafeBoxDial styles={style}
              boxWidth={boxWidth} boxHeight={boxHeight} checking={processingSolution} 
              rotationAngle={rotationAngle} setRotationAngle={setRotationAngle}
              setSolutionArray={setSolutionArray} isReseting={isReseting}/>*/}
        <div className="data-show-container" style={{marginTop: boxHeight * 0.22, alignItems:"center", justifyContent: "center", height: boxHeight, width: boxWidth, }}>
              <p className='data-show'style={{transform: "rotate(6deg)"}}>{appSettings.dialsNames[0]}:{frequency/3}</p>
              <p className='data-show' style={{marginTop: "6%"}}>{appSettings.dialsNames[1]}:{wavelength/3}</p>
              <p className='data-show' style={{transform: "rotate(-6deg)"}}>{appSettings.dialsNames[2]}:{amplitude/3}</p>
        </div>        

      <audio id="audio_beep" src={appSettings.soundBeep} autostart="false" preload="auto" />
      <audio id="audio_failure" src={appSettings.soundNok} autostart="false" preload="auto" />
      <audio id="audio_success" src={appSettings.soundOk} autostart="false" preload="auto" />
      {/*</div>*/}

      {/*{appSettings.lightBack==="true" && <div className='lockFuture' style={{ zIndex:4 , backgroundImage: 'url('+appSettings.backgroundLock+')', width: containerWidth, height: containerHeight,}}></div>}
      <p id="rotationNum" className='rotationNum' onDragStart={(event) => event.preventDefault()} 
            style={{color: appSettings.dialTextColor, fontSize:appSettings.dialTextSize, zIndex:5}}
            >{rotationAngle/6}</p> */}
 
    </div>);
};

export default MainScreen;