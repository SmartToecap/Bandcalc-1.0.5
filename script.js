// script.js fuer
// Bandbreiten Rechner 2024 (quasi Dreisatz)
// programmiert von Robin Neff 
// Version 1.0.5 | Funktionalitaet und Fehlerfreiheit getestet in: 
// Firefox 127.0.2, Edge 126.0.2592.87, Chrome 126.0.6478.127
// essentielle Dateien: index.html, style.css, script.js
// optional: button_gradient.png 
// (1x90px Farbuebergang von oben weiss zu unten schwarz. 
//  Alpha Wert obere und untere Kante 255, in der Mitte 0.) 
//  Zweck ist Glanz und Schattierung auf Buttons.

// ++ Initialisieren der Globalen Variablen ++ 
// Welche Groesse beim Aufruf von submitData zu bestimmen ist 
let toBeDetermined = '';
// Die jeweils letzten Resultate der Berechnung der drei Groessen
let resultBandwidth = 0;
let resultDataAmount = 0;
let resultTime = 0;
// Die Faktoren mit denen die Eingaben bei default Einheiten auf die jeweils 
// kleinste Einheit multipliziert werden koennen
let refactorBandwidth = 1000;
let refactorDataAmount = 1000000;
let refactorTime = 60;
// Die Variablen in denen die Benutzereingaben in den input- und 
// select-Elementen gespeichert werden.
let inputBandwidth = '';
let inputDataAmount = '';
let inputTime = '';
let selectBandwidthUnit = '';
let selectDataAmountUnit = '';
let selectTimeUnit = '';
// Die Variablen in denen die zum Zweck des Algorithmus refaktorierten 
// Benutzereingaben in den input- und select-Elementen gespeichert werden.
let inputBandwidthRefactored = '';
let inputDataAmountRefactored = '';
let inputTimeRefactored = '';

let resultsDecimals = 1;

// Diese Funktion benoetigt die Mitgabe einer Variable vom Typ String und gibt 
// in Abhaengigkeit der Laenge des Strings einen BOOLEAN zurueck; Falls der 
// String genau 0 Zeichen lang ist, ist dies true, andernfalls false. 
// (Dies funktioniert auch mit Variablen vom Typ Number, diese werden von der 
// Funktion als String interpretiert.)
function isEmptyString(str) {
  return str.length === 0;
}
// Diese Funktion benoetigt die Mitgabe einer Variable vom Typ Number und gibt 
// in Abhaengigkeit des Inhaltes derer einen BOOLEAN zurueck; Falls die Nummer 
// leer oder gleich 0 ist, ist dies true, andernfalls false.
// Bedingung fuer die Funktion ist die Existenz einer Funktion isEmptyString, 
// die einen BOOLEAN zurueckgibt.
function isEmptyOrZeroVar(number) {
  return (isEmptyString(number) || number == 0)
}

// Diese Funktion liest die Benutzeneingaben aus den Formularfeldern aus und
// speichert diese in den dafuer vorgesehenen Variablen.
// Bedingung fuer die Funktion ist die Existenz der HTML Elemente mit den 
// entsprechenden IDs
function setUserInputVariables() {
  inputBandwidth = document.getElementById('inputBandwidth').value;
  inputDataAmount = document.getElementById('inputDataAmount').value;
  inputTime = document.getElementById('inputTime').value;
  selectBandwidthUnit =   document.getElementById('selectBandwidthUnit').value;
  selectDataAmountUnit = document.getElementById('selectDataAmountUnit').value;
  selectTimeUnit = document.getElementById('selectTimeUnit').value;
}

// Diese Funktion fuehrt eine Fallentscheidung durch und setzt den Wert des
// Refaktors der entsprechenden Groesse entsprechend der mitgegebenen 
// Einheit.
function setUserInputVariablesRefactor(unit) {
  switch (unit) {
    case 'bitps':
      refactorBandwidth = 1;
      break;
    case 'kbitps':
      refactorBandwidth = 1000;
      break;
    case 'mbitps':
      refactorBandwidth = (1000*1000);
      break;
    case 'gbitps':
      refactorBandwidth = (1000*1000*1000);
      break;
    case 'byte':
      refactorDataAmount = 8;
      break;
    case 'kilobyte':
      refactorDataAmount = (8*1000);
      break;
    case 'megabyte':
      refactorDataAmount = (8*1000*1000);
      break;
    case 'gigabyte':
      refactorDataAmount = (8*1000*1000*1000);
      break;
    case 'terabyte':
      refactorDataAmount = (8*1000*1000*1000*1000);
      break; 
    case 'msecs':
      refactorTime = .001;
      break;
    case 'secs':
      refactorTime = 1;
      break;
    case 'mins':
      refactorTime = 60;
      break;
    case 'hrs':
      refactorTime = (60*60);
      break;
    case 'days':
      refactorTime = (60*60*24);
      break;
    case 'weeks':
      refactorTime = (60*60*24*7);
      break;
    case 'months':
      refactorTime = (60*60*24*30);
      break;
    case 'years':
      refactorTime = (60*60*24*365);
      break;    
  };
}

// Diese Funktion konvertiert die als String ausgelesenen und in Variablen 
// gespeicherten Benutzereingaben zu Numbers zum zweck arithmetischer 
// Operationen
function setUserInputStringsToNumbers() {
  Number(inputBandwidth);
  Number(inputDataAmount);
  Number(inputTime);
}

// Diese Funktion schaltet die Sichtbarkeit der Instruktionen ein und aus
function showInstructions() {
  // document.getElementById('instructions').blur();
  if (document.getElementById('instructions').className === 'screen') {
    document.getElementById('instructions').classList.add('hidden');
  }
  else {
    document.getElementById('instructions').classList.remove('hidden');
  }
}

// Diese Funktion schaltet die applikationseigene Darkmode ein und aus
function darkMode() {
  // document.getElementById('enter-data-screen').blur();
  if (document.getElementById('enter-data-screen').className === 'screen') {
    document.getElementById('enter-data-screen').classList.add('darkMode');
  }
  else {
    document.getElementById('enter-data-screen').classList.remove('darkMode');
  }
}

// Diese Funktion ist das Rueckgrat der Applikation. Sie wird vom Button 
// 'submit-data' aufgerufen und veranlasst die Fallentscheidung, welche 
// Kalkulation durchgefuehrt werden muss, fuehrt diese durch und traegt das 
// Resultat in das entsprechende Feld ein.
// Bedingung fuer das Funktionieren ist die Existenz von input-Elementen mit den
// ids 'inputBandwidth', 'inputDataAmount' sowie 'inputTime' sowie 
// select-Elementen mit den ids '', 'selectDataAmountUnit',
// 'selectTimeUnit'
function submitData() {
  // document.getElementById('button-submit-data').blur();
  setUserInputVariables();
  
  // Die aus den input Elementen ausgelesenen Zahlen sind aktuell noch Strings und
  // wir wandeln diese zum Zweck arithmetischer Operationen in Numbers um.
  setUserInputStringsToNumbers();

  // Wir refaktorieren die ausgelesene Eingabe der Bandbreite zu 'Bit pro Sekunde'
  // entsprechend der ausgewaehlten Masseinheit fuer die Bandbreiten
  setUserInputVariablesRefactor(selectBandwidthUnit);
  inputBandwidthRefactored = inputBandwidth*refactorBandwidth;
  inputBandwidthRefactored = inputBandwidth*refactorBandwidth;
  
  // Wir refaktorieren die ausgelesene Eingabe der Datenmenge zu Bits entsprechend
  // der ausgewaehlten Masseinheit fuer die Datenmenge   
  setUserInputVariablesRefactor(selectDataAmountUnit);
  inputDataAmountRefactored = inputDataAmount*refactorDataAmount;
  
  // Wir refaktorieren die ausgelesene Eingabe der Zeit zu Sekunden entsprechend 
  // der ausgewaehlten Masseinheit fuer die Zeitdauer  
  setUserInputVariablesRefactor(selectTimeUnit);
  inputTimeRefactored = inputTime*refactorTime;

  // Konsolen Statement zum Zweck des Debugging: (selbsterklaerend)
  console.log(`If this message appears in the console, submitData is running.`);

  // Konsolen Statement zum Zweck des Debugging: (selbsterklaerend)
  // Ausgabe der ausgelesenen Benutzereingaben
  console.log(
    `inputBandwidth = ${inputBandwidth} | inputDataAmount = `
    + `${inputDataAmount} | inputTime = ${inputTime}`
  );

  // Konsolen Statement zum Zweck des Debugging: (selbsterklaerend)
  // Ausgabe der refaktorierten Benutzereingaben
  console.log(
    `inputBandwidthRefactored = ${inputBandwidthRefactored} bitps | `
    + `inputDataAmountRefactored = ${inputDataAmountRefactored} bit | `
    + `inputTimeRefactored = ${inputTimeRefactored} sec`
  );
    
  // ++ IF Entscheidungsbaum zur Feststellung, welche Groesse bestimmt werden muss
  // Falls das input Feld fuer die Bandbreite leer ist oder als 0 eingetragen 
  // wurde und die beiden anderen Felder NICHT leer sind, wird die Bandbreite 
  // errechnet, die noetig ist um die eingegebene Datenmenge im eingegebenen 
  // Zeitraum zu uebertragen. Anschliessend wird das Ergebnis vor der Anzeige 
  // wieder durch den Faktor geteilt, mit dem die Eingabe im vorigen Schritt 
  // multipliziert wurde, um das Ergebnis in die richtige Einheit umzurechnen, 
  // um das Ergebnis korrekt auszugeben.
  // Bedingung fuer die Funktion ist die Existenz folgender:
  // HTML (input-)Element mit der id 'inputBandwidth', 
  // Funktionen 'isEmptyOrZeroVar', 'checkBestUnit', 'convertDisplayUnit'
  // Variablen: 'inputBandwidth', 'inputDataAmount, 'inputTime'
  // 'selectDataAmountUnit', 'selectBandwidthUnit', 'selectTimeUnit'
  // 'resultBandwidth'
  if (
    isEmptyOrZeroVar(inputBandwidth)
    && (!isEmptyOrZeroVar(inputDataAmount))
    && (!isEmptyOrZeroVar(inputTime))
  ) {
      
    // Konsolen Statement zum Zweck des Debugging der if else Bedingungen:
    console.log(`inputBandwidth is empty and to be determined.`);

    // Speichern welche Groesse als zu berechnen festgestellt wurde (Bandbreite)
    toBeDetermined = 'bandwidth';

    // Berechnung der zu berechnenden Groesse (Bandbreite):
    resultBandwidth = (
      (inputDataAmountRefactored / inputTimeRefactored) / refactorBandwidth
    );

    // Ausgabe des Berechnungsergebnisses in das entsprechende Feld:
    document.getElementById('inputBandwidth').value = (
      (Math.round(resultBandwidth * (Math.pow(10, resultsDecimals)))) / 
      (Math.pow(10, resultsDecimals))
    ); 

    // Konsolen Statement des Berechnungsergebnisses als vollstaendiger Satz
    console.log(
      `In order to transfer ${inputDataAmount} ${selectDataAmountUnit} `
      + `of data in exactly ${inputTime} ${selectTimeUnit} you need a `
      + `connection with a bandwidth of ${resultBandwidth} `
      + `${selectBandwidthUnit}`
    );
    // Konsolen Statement Ergebnis der Einheitenwahl fuer optimale Darstellung    
    console.log(
      `${resultBandwidth} ${selectBandwidthUnit} would best be displayed as ` 
      + `${convertDisplayUnit(
        resultBandwidth,
        selectBandwidthUnit,    
        checkBestUnit(resultBandwidth,selectBandwidthUnit)
      )}`
      + `${checkBestUnit(resultBandwidth,selectBandwidthUnit)}`
    );
  }

  // Falls das input Feld fuer die Datenmenge leer ist oder als 0 eingetragen 
  // wurde und die beiden anderen Felder NICHT leer sind, wird die Datenmenge 
  // errechnet, die ueber die eingegebene Bandbreite im eingegebenen Zeitraum 
  // uebertragen werden kann. Anschliessend wird das Ergebnis vor der Anzeige 
  // wieder durch den Faktor geteilt, mit dem die Eingabe im vorigen Schritt 
  // multipliziert wurde, um das Ergebnis in die richtige Einheit umzurechnen.
  // Bedingung fuer die Funktion ist die Existenz folgender:
  // HTML (input-)Element mit der id 'inputDataAmount', 
  // Funktionen 'isEmptyOrZeroVar', 'checkBestUnit', 'convertDisplayUnit'
  // Variablen: 'inputBandwidth', 'inputDataAmount, 'inputTime'
  // 'selectDataAmountUnit', 'selectBandwidthUnit', 'selectTimeUnit'
  // 'resultDataAmount'
  else if (
    isEmptyOrZeroVar(inputDataAmount) 
    && (!isEmptyOrZeroVar(inputTime)) 
    && (!isEmptyOrZeroVar(inputBandwidth))) {
            
    // Konsolen Statement zum Zweck des Debugging der if else Bedingungen:
    console.log(`inputDataAmount is empty and to be determined.`);
    
    // Speichern welche Groesse als zu berechnen festgestellt wurde (Datenmenge):
    toBeDetermined = 'data';
    
    // Berechnung der zu berechnenden Groesse (Datenmenge):   
    resultDataAmount = 
    (inputTimeRefactored * inputBandwidthRefactored) / refactorDataAmount;
    
    // Ausgabe des Berechnungsergebnisses in das entsprechende Feld
    document.getElementById('inputDataAmount').value = 
      (Math.round(resultDataAmount * (Math.pow(10,resultsDecimals)))) / 
      (Math.pow(10,resultsDecimals)); 

    // Konsolen Statement zum Zweck des Debugging der Rundung      
    console.log(
      `${resultDataAmount} ${selectDataAmountUnit} rounded to ` 
      + `${resultsDecimals} decimals is ` 
      + `${
        (Math.round(resultDataAmount * (Math.pow(10,resultsDecimals)))) / 
        (Math.pow(10,resultsDecimals))
      }`
    );
    
    // Konsolen Statement des Berechnungsergebnisses als vollstaendiger (Drei)Satz
    console.log(
      `Via a connection with ${inputBandwidth} ${selectBandwidthUnit} ` 
      + `bandwidth, ${inputTime} ${selectTimeUnit} is enough time to to ` 
      + `transfer ${resultDataAmount} ${selectDataAmountUnit} of data.`
    );

    // Konsolen Statement Ergebnis der Einheitenwahl fuer optimale Darstellung:
    console.log(
      `${resultDataAmount} ${selectDataAmountUnit} would best be displayed ` 
      + `as ` 
      + `${convertDisplayUnit(
        resultDataAmount,
        selectDataAmountUnit,
        checkBestUnit(resultDataAmount,selectDataAmountUnit)
      )}` 
      + `${checkBestUnit(resultDataAmount,selectDataAmountUnit)}`
    );
  }
    
  // Falls das input Feld fuer den Zeitrahmen leer ist oder als 0 eingetragen 
  // wurde und die beiden anderen Felder NICHT leer sind, wird der Zeitrahmen 
  // errechnet, der noetig ist um die angegebene Datenmenge im angegebenen 
  // Zeitrahmen zu uebertragen. Anschliessend wird das Ergebnis vor der Anzeige
  // wieder durch den Faktor geteilt, mit dem die Eingabe im vorigen Schritt 
  // multipliziert wurde, um das Ergebnis in die richtige Einheit umzurechnen.
  // Bedingung fuer die Funktion ist die Existenz folgender:
  // HTML (input-)Element mit der id 'inputTime', 
  // Funktionen 'isEmptyOrZeroVar', 'checkBestUnit', 'convertDisplayUnit'
  // Variablen: 'inputBandwidth', 'inputDataAmount, 'inputTime'
  // 'selectDataAmountUnit', 'selectBandwidthUnit', 'selectTimeUnit'
  // 'resultTime'
  else if (
    isEmptyOrZeroVar(inputTime)
    && (!isEmptyOrZeroVar(inputDataAmount))
    && (!isEmptyOrZeroVar(inputBandwidth))
  ) {
      
    // Konsolen Statement zum Zweck des Debugging der if else Bedingungen
    console.log(`inputTime is empty and to be determined.`)
    
    // Speichern welche Groesse als zu berechnen festgestellt wurde (Zeit)
    toBeDetermined = 'time';

    // Berechnung der zu berechnenden Groesse (Zeit)  
    resultTime = 
    (inputDataAmountRefactored/inputBandwidthRefactored)/refactorTime;
    
    // Ausgabe des Berechnungsergebnisses in das entsprechende Feld
    document.getElementById('inputTime').value = 
      (Math.round(resultTime*(Math.pow(10,resultsDecimals)))) / 
      (Math.pow(10,resultsDecimals)); 

    // Konsolen Statement des Berechnungsergebnisses als vollstaendiger Satz
    console.log(
      `In order to transfer ${inputDataAmount} ${selectDataAmountUnit} ` 
      + `of data via a connection with ${inputBandwidth} ` 
      + `${selectBandwidthUnit} bandwidth, you need ${resultTime} ` 
      + `${selectTimeUnit} time.`
    );

    // Konsolen Statement Ergebnis der Einheitenwahl fuer optimale Darstellung
    console.log(
      `${resultTime} ${selectTimeUnit} would best be displayed as ` 
      + `${convertDisplayUnit(
          resultTime, 
          selectTimeUnit, 
          checkBestUnit(resultTime,selectTimeUnit)
      )}` 
      + `${checkBestUnit(resultTime,selectTimeUnit)}`
    )
  }
   
  // Falls keines der drei Eingabefelder leer ist, berechnen wir ggf. die 
  // zuletzt berechnete Groesse erneut. Hierzu nutzen wir den Inhalt der 
  // Variable 'toBeDetermined', die zuvor entweder als 'bandwidth', 'data' oder 
  // 'time' gesetzt wurde. Wenn dies noch nicht passiert ist, da zuvor keine 
  // Kalkulation durchgefuehrt wurde, ist der Inhalt der Variable bei ihrer 
  // Einfuehrung als leer ('') gesetzt worden. Falls letzteres festgestellt 
  // wird, geben wir eine Fehlermeldung aus, die den Nutzer auf die korrekte 
  // Nutzung der Applikation hinweist.
  // Bedingung fuer die Funktion ist die Existenz folgender:
  // HTML (input-)Element mit der id 'inputBandwidth', 
  // Funktionen 'isEmptyOrZeroVar', 'checkBestUnit', 'convertDisplayUnit'
  // Variablen: 'inputBandwidth', 'inputDataAmount, 'inputTime'
  // 'selectDataAmountUnit', 'selectBandwidthUnit', 'selectTimeUnit'
  // 'resultBandwidth'
  else if (
    !isEmptyOrZeroVar(inputDataAmount) 
    && (!isEmptyOrZeroVar(inputBandwidth))
    && (!isEmptyOrZeroVar(inputTime))
  ) {
      
    // Konsolen Statement zum Zweck des Debugging der if else Bedingungen      
    console.log(
      `None of the three inputs was empty. If a calculation has been done ` 
      + `previously, will update most recent result now.`
    )

    // Im Falle, dass zuletzt die Bandbreite berechnet wurde, berechnen wir 
    // diese erneut. Diese Info wird auch als Konsolen Statement ausgegeben.  
    if (toBeDetermined === 'bandwidth') {
      console.log(
        `Calculating most recently calculated factor again: ${toBeDetermined}`
      );
      
      // Berechnung der zu berechnenden Groesse (Bandbreite):        
      resultBandwidth = 
      (inputDataAmountRefactored/inputTimeRefactored)/refactorBandwidth;
      
      // Ausgabe des Berechnungsergebnisses in das entsprechende Feld: 
      document.getElementById('inputBandwidth').value = 
        (Math.round(resultBandwidth*(Math.pow(10,resultsDecimals)))) / 
        (Math.pow(10,resultsDecimals));;  

      // Konsolen Statement des Berechnungsergebnisses als vollstaendiger Satz
      console.log(
        `In order to transfer ${inputDataAmount} ${selectDataAmountUnit} of ` 
        + `data in exactly ${inputTime} ${selectTimeUnit} you need a ` 
        + `connection with a bandwidth of at least ${resultBandwidth} `
        + `${selectBandwidthUnit}`
      );
      
      // Konsolen Statement Ergebnis der Einheitenwahl fuer optimale Darstellung
      console.log(
        `${resultBandwidth} ${selectBandwidthUnit} would best be displayed ` 
        + `as ` 
        + `${convertDisplayUnit(
          resultBandwidth,
          selectBandwidthUnit,
          checkBestUnit(resultBandwidth,selectBandwidthUnit)
        )} ` 
        + `${checkBestUnit(resultBandwidth,selectBandwidthUnit)}`
      );
    }
    
    // Im Falle, dass zuletzt die Datenmenge berechnet wurde, berechnen wir 
    // diese erneut. Diese Info wird auch als Konsolen Statement ausgegeben.   
    if (toBeDetermined === 'data') {
      console.log(
        `Calculating most recently calculated factor again: ${toBeDetermined}`
      );
     
      // Berechnung der zu berechnenden Groesse (Datenmenge):       
      resultDataAmount = 
      (inputTimeRefactored*inputBandwidthRefactored)/refactorDataAmount;
      
      // Ausgabe des Berechnungsergebnisses in das entsprechende Feld: 
      document.getElementById('inputDataAmount').value = 
        (Math.round(resultDataAmount * (Math.pow(10,resultsDecimals))))
        / (Math.pow(10,resultsDecimals));
 
      // Konsolen Statement des Berechnungsergebnisses als vollstaendiger Satz 
      console.log(
        `Via a connection with ${inputBandwidth} ${selectBandwidthUnit} ` 
        + `bandwidth, ${inputTime} ${selectTimeUnit} is enough time to to ` 
        + `transfer ${resultDataAmount} ${selectDataAmountUnit} of data.`
      );

      // Konsolen Statement Ergebnis der Einheitenwahl fuer optimale Darstellung 
      console.log(
        `${resultDataAmount} ${selectDataAmountUnit} would best be displayed ` 
        + `as `
        + `${convertDisplayUnit(
          resultDataAmount,
          selectDataAmountUnit,
          checkBestUnit(resultDataAmount,selectDataAmountUnit)
        )}` 
        + `${checkBestUnit(resultDataAmount, selectDataAmountUnit)}`
      );
    }
    
    // Im Falle, dass zuletzt die Zeit berechnet wurde, berechnen wir diese
    // erneut. Diese Info wird auch als Konsolen Statement ausgegeben.      
    if (toBeDetermined === 'time') {
      console.log(
        `Calculating most recently calculated factor again: ${toBeDetermined}`
      );
      
      // Berechnung der zu berechnenden Groesse (Zeit):        
      resultTime = 
        (inputDataAmountRefactored / inputBandwidthRefactored) / refactorTime;
      document.getElementById('inputTime').value = 
        (Math.round(resultTime * (Math.pow(10,resultsDecimals)))) 
        / (Math.pow(10,resultsDecimals));
  

      // Konsolen Statement des Berechnungsergebnisses als vollstaendiger Satz 
      console.log(
        `In order to transfer ${inputDataAmount} ${selectDataAmountUnit} of ` 
        + `data via a connection with ${inputBandwidth} ` 
        + `${selectBandwidthUnit} bandwidth, you need ${resultTime} ` 
        + `${selectTimeUnit} time.`
      );
      // Konsolen Statement Ergebnis der Einheitenwahl fuer optimale Darstellung 
      console.log(
        `${resultTime} ${selectTimeUnit} would best be displayed as ` 
        + `${convertDisplayUnit(
          resultTime,
          selectTimeUnit,
          checkBestUnit(resultTime,selectTimeUnit)
        )} ` 
        + `${checkBestUnit(resultTime, selectTimeUnit)}`
      );
    }
    
    // Im Falle, dass noch keine Berechnung erfolgt ist (aber keines der Felder 
    // frei oder 0 ist) koennen wir keine Berechnung durchfuehren. Die Info wird
    // sowohl als Error Alert auch als Konsolen Statement ausgegeben.
    if (toBeDetermined === '') {
      alert(
        `Fehler: Alle Eingabefelder sind ausgef${String.fromCharCode(252)}` 
        + `llt und es wurde keine vorherige Berechnung ` 
        + `durchgef${String.fromCharCode(252)}hrt. Bitte den Inhalt desjenigen ` 
        + `Eingabefeldes entfernen, das zu der Gr${String.fromCharCode(246)}` 
        + `${String.fromCharCode(0x00DF)}e geh${String.fromCharCode(246)}rt, ` 
        + `die berechnet werden soll.`
      );
      console.log(
        `Error: All input fields are filled in and no previous calculation ` 
        + `took place. Please remove the content of the input field that ` 
        + `belongs to the quantity you would like to be calculated`
      );
    }
  }
  
  // Im Falle, dass keiner der vorigen Faelle zutrifft, da weder ein einzelnes
  // Feld frei blieb, noch eine vorige Berechnung wiederholt werden kann, wird 
  // der Nutzer mit einer Fehlermeldung darauf hingewiesen,  
  // Die Info wird sowohl als Error Alert auch als Konsolen Statement ausgegeben
  else {
    alert(
      `Fehler: Unvollst${String.fromCharCode(228)}ndige Eingabe.\nBitte ` 
      + `sicherstellen, dass zwei von drei Gr${String.fromCharCode(246)}` 
      + `${String.fromCharCode(0x00DF)}en in den entsprechenden ` 
      + `Eingabefeldern eingetragen sind und ein drittes leer bleibt oder ` 
      + `mit 0 angegeben ist, sodass eine Berechnung ` 
      + `durchgef${String.fromCharCode(252)}hrt werden kann.`
    );
    console.log(
      `Error: missing input`
    );
  } 
  // Funktion Ende  
}

// Diese Funktion setzt beim Aufruf die Eingaben der HTML input-Elemente 
// (Eingabefelder) und select Elemente (Dropdownfelder) auf die Ursprungswerte 
// zurueck. 
// Bedingung fuer die Funktion ist die Existenz folgender:
//   HTML (input-)Elemente mit den folgenden ids:
//     'inputBandwidth', 'inputDataAmount' sowie 'inputTime'
//   HTML (select-)Elemente mit den folgenden ids:
//     'selectBandwidthUnit', 'selectDataAmountUnit', 'selectTimeUnit'
function resetData() { 
  // document.getElementById('button-reset-data').blur();
  document.getElementById('inputBandwidth').value = ''; 
  document.getElementById('inputDataAmount').value = '';
  document.getElementById('inputTime').value = ''; 
  document.getElementById('selectBandwidthUnit').selectedIndex = 1;
  document.getElementById('selectDataAmountUnit').selectedIndex = 2;
  document.getElementById('selectTimeUnit').selectedIndex = 2;
  toBeDetermined = '';
}

// Diese Funktion prueft einen mitgegebenen Wert sowie die dazugehoerige Einheit
// und gibt anschliessend die bestmoegliche Einheit (von den verfuegbaren) fuer 
// die Darstellung des Wertes in einem String zurueck
// Bedingung fuer die Funktion ist die Mitgabe eines Zahlenwertes (value) und 
// einer Einheit als String (z.B. ='megabyte')
// Die Einheit muss tatsaechlich existieren; moegliche Einheiten sind:
// 'bitps', 'kbitps', 'mbitps', 'gbitps',
// 'byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte' 
// 'msecs', 'secs', 'mins', 'hrs', 'days', 'weeks', 'months', 'years'
// Zurueckgegeben wird eine Einheit als String (z.B. ='gigabyte')
function checkBestUnit(value, valueUnit) {
  if (
    valueUnit == 'bitps' 
    && value >= (1000*1000*1000)
  ) {
    return 'gbitps'
  }
  else if (
    valueUnit == 'bitps' 
    && value >= (1000*1000)
  ) {
    return 'mbitps'
  }
  else if (
    valueUnit == 'bitps' 
    && value >= 1000
  ) {
    return 'kbitps'
  }
  else if (
    valueUnit == 'bitps'
    ) {
    return 'bitps'
  };
  
  if (
    valueUnit == 'kbitps' 
    && value >= (1000*1000)
  ) {
    return 'gbitps'
  }
  else if (
    valueUnit == 'kbitps' 
    && value >= 1000
  ) {
    return 'mbitps'
  }
  else if (
    valueUnit == 'kbitps' 
    && value <= (1/100)
  ) {
    return 'bitps'
  }
  else if (
    valueUnit == 'kbitps'
  ) {
    return 'kbitps'
  };
  
  if (
    valueUnit == 'mbitps' 
    && value <= (1/(100*1000))
  ) {
    return 'bitps'
  }
  else if (
    valueUnit == 'mbitps' 
    && value <= (1/100)
  ) {
    return 'kbitps'
  }
  else if (
    valueUnit == 'mbitps' 
    && value >= 1000
  ) {
    return 'gbitps'
  }
  else if (
    valueUnit == 'mbitps'
  ) {
    return 'mbitps'
  };  
  
  if (
    valueUnit == 'gbitps' 
    && value <= (1/(100*1000*1000))
  ) {
    return 'bitps'
  }
  else if (
    valueUnit == 'gbitps' 
    && value <= (1/(100*1000))
  ) {
    return 'kbitps'
  }
  else if (
    valueUnit == 'gbitps' 
    && value <= (1/100)
  ) {
    return 'mbitps'
  }
  else if (
    valueUnit == 'gbitps'
  ) {
    return 'gbitps'
  };
  
  if (
    valueUnit == 'byte' 
    && value >= (1000*1000*1000*1000)
  ) {
    return 'terabyte'
  }
  else if (
    valueUnit == 'byte' 
    && value >= (1000*1000*1000)
  ) {
    return 'gigabyte'
  }
  else if (
    valueUnit == 'byte' 
    && value >= (1000*1000)
  ) {
    return 'megabyte'
  }
  else if (
    valueUnit == 'byte' 
    && value >= 1000
  ) {
    return 'kilobyte'
  }
  else if (
    valueUnit == 'byte'
  ) {
    return 'byte'
  };
  
  if (
    valueUnit == 'kilobyte' 
    && value <= (1/100)
  ) {
    return 'byte'
  }
  else if (
    valueUnit == 'kilobyte' 
    && value >= (1000*1000*1000)
  ) {
    return 'terabyte'
  }
  else if (
    valueUnit == 'kilobyte' 
    && value >= (1000*1000)
  ) {
    return 'gigabyte'
  }
  else if (
    valueUnit == 'kilobyte' && value >= 1000
  ) {
    return 'megabyte'
  }
  else if (
    valueUnit == 'kilobyte'
  ) {
    return 'kilobyte'
  };
  
  if (
    valueUnit == 'megabyte' 
    && value <= (1/(100*1000))
  ) {
    return 'byte'
  }
  else if (
    valueUnit == 'megabyte' 
    && value <= (1/100)
  ) {
    return 'kilobyte'
  }
  else if (
    valueUnit == 'megabyte' 
    && value >= (1000*1000)
  ) {
    return 'terabyte'
  }
  else if (
    valueUnit == 'megabyte' 
    && value >= 1000
  ) {
    return 'gigabyte'
  }
  else if (
    valueUnit == 'megabyte'
  ) {
    return 'megabyte'
  };
  
  if (
    valueUnit == 'gigabyte' 
    && value <= (1/(100*1000))
  ) {
    return 'byte'
  }
  else if (
    valueUnit == 'gigabyte' 
    && value <= (1/100)
  ) {
    return 'kilobyte'
  }
  else if (
    valueUnit == 'gigabyte' 
    && value <= 1
  ) {
    return 'megabyte'
  }
  else if (
    valueUnit == 'gigabyte' 
    && value >= 1000
  ) {
    return 'terabyte'
  }
  else if (
    valueUnit == 'gigabyte'
  ) {
    return 'gigabyte'
  };

  if (
    valueUnit == 'terabyte' 
    && value <= (1/(100*1000*1000))
  ) {
    return 'byte'
  }
  else if (
    valueUnit == 'terabyte' 
    && value <= (1/(100*1000))
  ) {
    return 'kilobyte'
  }
  else if (
    valueUnit == 'terabyte' 
    && value <= (1/100)
  ) {
    return 'megabyte'
  }
  else if (
    valueUnit == 'terabyte' 
    && value <= 1
  ) {
    return 'gigabyte'
  }
  else if (
    valueUnit == 'terabyte'
  ) {
    return 'terabyte'
  };
  
  if (
    valueUnit == 'msecs' 
    && value >= (3*365*24*60*60*1000)
  ) {
    return 'years'
  }
  else if (
    valueUnit == 'msecs' 
    && value >= (3*30*24*60*60*1000)
  ) {
    return 'months'
  }
  else if (
    valueUnit == 'msecs' 
    && value >= (3*7*24*60*60*1000)
  ) {
    return 'weeks'
  }
  else if (
    valueUnit == 'msecs' 
    && value >= (3*24*60*60*1000)
  ) {
    return 'days'
  }
  else if (
    valueUnit == 'msecs' 
    && value >= (3*60*60*1000)
  ) {
    return 'hrs'
  }
  else if (
    valueUnit == 'msecs' 
    && value >= (3*60*60*1000)
  ) {
    return 'mins'
  }
  else if (
    valueUnit == 'msecs' 
    && value >= 1000
  ) {
    return 'secs'
  }
  else if (
    valueUnit == 'msecs'
  ) {
    return 'msecs'
  };
  
  if (
    valueUnit == 'secs' 
    && value >= (3*365*24*60*60)
  ) {
    return 'years'
  }
  else if (
    valueUnit == 'secs' 
    && value >= (3*30*24*60*60)
  ) {
    return 'months'
  }
  else if (
    valueUnit == 'secs' 
    && value >= (3*7*24*60*60)
  ) {
    return 'weeks'
  }
  else if (
    valueUnit == 'secs' 
    && value >= (3*24*60*60)
  ) {
    return 'days'
  }
  else if (
    valueUnit == 'secs' 
    && value >= (3*60*60)
  ) {
    return 'hrs'
  }
  else if (
    valueUnit == 'secs' 
    && value >= (3*60)
  ) {
    return 'mins'
  }
  else if (
    valueUnit == 'secs' 
    && value < 1
  ) {
    return 'msecs'
  }
  else if (
    valueUnit == 'secs'
  ) {
    return 'secs'
  };
  
  if (
    valueUnit == 'mins' 
    && value >= (3*365*24*60)
  ) {
    return 'years'
  }
  else if (
    valueUnit == 'mins' 
    && value >= (3*30*24*60)
  ) {
    return 'months'
  }
  else if (
    valueUnit == 'mins' 
    && value >= (3*7*24*60)
  ) {
    return 'weeks'
  }
  else if (
    valueUnit == 'mins' 
    && value >= (3*24*60)
  ) {
    return 'days'
  }
  else if (
    valueUnit == 'mins' 
    && value >= (3*60)
  ) {
    return 'hrs'
  }
  else if (
    valueUnit == 'mins' 
    && value < (3/60)
  ) {
    return 'msecs'
  }
  else if (
    valueUnit == 'mins' 
    && value < 3
  ) {
    return 'secs'
  }
  else if (
    valueUnit == 'mins'
  ) {
    return 'mins'
  };
  
  if (
    valueUnit == 'hrs' 
    && value >= (3*365*24)
  ) {
    return 'years'
  }
  else if (
    valueUnit == 'hrs' 
    && value >= (3*30*24)
  ) {
    return 'months'
  }
  else if (
    valueUnit == 'hrs' 
    && value >= (3*7*24)
  ) {
    return 'weeks'
  }
  else if (
    valueUnit == 'hrs' 
    && value >= (3*24)
  ) {
    return 'days'
  }
  else if (
    valueUnit == 'hrs' 
    && value < (3/(1000*60))
  ) {
    return 'msecs'
  }
  else if (
    valueUnit == 'hrs' 
    && value < (3/60)
  ) {
    return 'secs'
  }
  else if (
    valueUnit == 'hrs' 
    && value < (3)
  ) {
    return 'mins'
  }
  else if (
    valueUnit == 'hrs'
  ) {
    return 'hrs'
  };
  
  if (
    valueUnit == 'days' 
    && value >= (3*365)
  ) {
    return 'years'
  }
  else if (
    valueUnit == 'days' 
    && value >= (3*30)
  ) {
    return 'months'
  }
  else if (
    valueUnit == 'days' 
    && value >= (3*7)
  ) {
    return 'weeks'
  }
  else if (
    valueUnit == 'days' 
    && value < (3/(24*60*60))
  ) {
    return 'msecs'
  }
  else if (
    valueUnit == 'days' 
    && value < (3/(24*60))
  ) {
    return 'secs'
  }
  else if (
    valueUnit == 'days' 
    && value < (3/(60))
  ) {
    return 'mins'
  }
  else if (
    valueUnit == 'days' 
    && value < (3)
  ) {
    return 'hrs'
  }
  else if (
    valueUnit == 'days'
  ) {
    return 'days'
  };
  
  if (
    valueUnit == 'weeks' 
    && value >= (3*52)
  ) {
    return 'years'
  }
  else if (
    valueUnit == 'weeks' 
    && value >= (3*(30/7))
  ) {
    return 'months'
  }
  else if (
    valueUnit == 'weeks' 
    && value < (3/(7*24*60*60))
  ) {
    return 'msecs'
  }
  else if (
    valueUnit == 'weeks' 
    && value < (3/(7*24*60))
  ) {
    return 'secs'
  }
  else if (
    valueUnit == 'weeks' 
    && value < (3/(7*24))
  ) {
    return 'mins'
  }
  else if (
    valueUnit == 'weeks' 
    && value < (3/7)
  ) {
    return 'hrs'
  }
  else if (
    valueUnit == 'weeks' 
    && value < 3
  ) {
    return 'days'
  }
  else if (
    valueUnit == 'weeks'
  ) {
    return 'weeks'
  };
  
  if (
    valueUnit == 'months' 
    && value >= (3*12)
  ) {
    return 'years'
  }
  else if (
    valueUnit == 'months' 
    && value < (3/(24*60*60*1000))
  ) {
    return 'msecs'
  }
  else if (
    valueUnit == 'months' 
    && value < (3/(24*60*60))
  ) {
    return 'secs'
  }
  else if (
    valueUnit == 'months' 
    && value < (3/(24*60))
  ) {
    return 'mins'
  }
  else if (
    valueUnit == 'months' 
    && value < (3/24)
  ) {
    return 'hrs'
  }
  else if (
    valueUnit == 'months' 
    && value < 3
  ) {
    return 'days'
  }
  else if (
    valueUnit == 'months' 
    && value < (3*7/30)
  ) {
    return 'weeks'
  }
  else if (
    valueUnit == 'months'
  ) {
    return 'months'
  };
  
  if (
    valueUnit == 'years' 
    && value < (3/(365*24*60*60*1000))
  ) {
    return 'msecs'
  }
  else if (
    valueUnit == 'years' 
    && value < (3/(365*24*60*60))
  ) {
    return 'secs'
  }
  else if (
    valueUnit == 'years' 
    && value < (3/(365*24*60))
  ) {
    return 'mins'
  }
  else if (
    valueUnit == 'years' 
    && value < (3/(365*24))
  ) {
    return 'hrs'
  }
  else if (
    valueUnit == 'years' 
    && value < (3/365)
  ) {
    return 'days'
  }
  else if (
    valueUnit == 'years' 
    && value < (3*(30/365))
  ) {
    return 'weeks'
  }
  else if (
    valueUnit == 'years' 
    && value < 3
  ) {
    return 'months'
  }
  else if (
    valueUnit == 'years'
  ) {
    return 'years'
  };
}

// Diese Funktion konvertiert einen Wert(value) in einer bestimmten 
// Einheit(valueUnit) in einen Wert in einer weiteren Einheit(newUnit) und gibt 
// den neuen Wert zurueck.
// Bedingung fuer die Funktion ist die Mitgabe eines Zahlenwertes (value) und 
// zweier Einheiten als String(valueUnit und newUnit) 
// (z.B. 'megabyte' und 'gigabyte') 
// Beide Einheiten muessen vom selben Typ sein und tatsaechlich gelistet sein.
// (z.B. 'petabyte' wuerde nicht funktionieren)
// (moegliche Einheiten sind:
// 'bitps', 'kbitps', 'mbitps', 'gbitps',
// 'byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte' 
// 'msecs', 'secs', 'mins', 'hrs', 'days', 'weeks', 'months', 'years'

function convertDisplayUnit(value, valueUnit, newUnit) {
  Number(value);
  if (
    valueUnit == 'bitps' 
    && newUnit == 'kbitps'
  ) {
    return (value*.001)
  };
  if (
    valueUnit == 'bitps' 
    && newUnit == 'mbitps'
  ) {
    return (value*.000001)
  };
  if (
    valueUnit == 'bitps' 
    && newUnit == 'gbitps'
  ) {
    return (value*.000000001)
  };
  if (
    valueUnit == 'bitps' 
    && newUnit == 'bitps'
  ) {
    return value
  };

  if (
    valueUnit == 'kbitps' 
    && newUnit == 'bitps'
  ) {
    return (value*1000)
  };
  if (
    valueUnit == 'kbitps' 
    && newUnit =='mbitps'
  ) {
    return (value*.001)
  };
  if (
    valueUnit  == 'kbitps' 
    && newUnit =='gbitps'
  ) {
    return (value*.000001)
  };
  if (
    valueUnit  == 'kbitps' 
    && newUnit =='kbitps'
  ) {
    return value
  };
  
  if (
    valueUnit  == 'mbitps' 
    && newUnit =='bitps'
  ) {
    return (value*1000000)
  };
  if (
    valueUnit  == 'mbitps' 
    && newUnit =='kbitps'
  ) {
    return (value*1000)
  };
  if (
    valueUnit  == 'mbitps' 
    && newUnit =='gbitps'
  ) {
    return (value*.001)
  };
  if (
    valueUnit  == 'mbitps' 
    && newUnit =='mbitps'
  ) {
    return value
  };  
  
  if (
    valueUnit  == 'gbitps' 
    && newUnit =='bitps'
  ) {
    return (value*1000000000)
  };
  if (
    valueUnit  == 'gbitps' 
    && newUnit =='kbitps'
  ) {
    return (value*1000000)
  };
  if (
    valueUnit  == 'gbitps' 
    && newUnit =='mbitps'
  ) {
    return (value*1000)
  };
  if (
    valueUnit  == 'gbitps' 
    && newUnit =='gbitps'
  ) {
    return value
  };
  
  if (
    valueUnit  == 'byte' 
    && newUnit =='kilobyte'
  ) {
    return (value*.001)
  };
  if (
    valueUnit  == 'byte' 
    && newUnit =='megabyte'
  ) {
    return (value*.000001)
  };
  if (
    valueUnit  == 'byte' 
    && newUnit =='gigabyte'
  ) {
    return (value*.000000001)
  };
  if (
    valueUnit  == 'byte' 
    && newUnit =='terabyte'
  ) {
    return (value*.000000000001)
  };
  if (
    valueUnit  == 'byte' 
    && newUnit =='byte'
  ) {
    return value
  };
  
  if (
    valueUnit  == 'kilobyte' 
    && newUnit =='megabyte'
  ) {
    return (value*.001)
  };
  if (
    valueUnit  == 'kilobyte' 
    && newUnit =='gigabyte'
  ) {
    return (value*.000001)
  };
  if (
    valueUnit  == 'kilobyte' 
    && newUnit =='terabyte'
  ) {
    return (value*.000000001)
  };
  if (
    valueUnit  == 'kilobyte' 
    && newUnit =='byte'
  ) {
    return (value*1000)
  };
  if (
    valueUnit  == 'kilobyte' 
    && newUnit =='kilobyte'
  ) {
    return value
  };
  
  if (
    valueUnit  == 'megabyte' 
    && newUnit =='byte'
  ) {
    return (value*1000000)
  };
  if (
    valueUnit  == 'megabyte' 
    && newUnit =='kilobyte'
  ) {
    return (value*1000)
  };
  if (
    valueUnit  == 'megabyte' 
    && newUnit =='gigabyte'
  ) {
    return (value*.001)
  };
  if (
    valueUnit  == 'megabyte' 
    && newUnit =='terabyte'
  ) {
    return (value*.000001)
  };
  if (
    valueUnit  == 'megabyte' 
    && newUnit =='megabyte'
  ) {
    return value
  };
  
  if (
    valueUnit  == 'gigabyte' 
    && newUnit =='byte'
  ) {
    return (value*1000000000)
  };
  if (
    valueUnit  == 'gigabyte' 
    && newUnit =='kilobyte'
  ) {
    return (value*1000000)
  };
  if (
    valueUnit  == 'gigabyte' 
    && newUnit =='megabyte'
  ) {
    return (value*1000)
  };
  if (
    valueUnit  == 'gigabyte' 
    && newUnit =='terabyte'
  ) {
    return (value*.001)
  };
  if (
    valueUnit  == 'gigabyte' 
    && newUnit =='gigabyte'
  ) {
    return value
  };

  if (
    valueUnit  == 'terabyte' 
    && newUnit =='byte'
  ) {
    return (value*1000000000000)
  };
  if (
    valueUnit  == 'terabyte' 
    && newUnit =='kilobyte'
  ) {
    return (value*1000000000)
  };
  if (
    valueUnit  == 'terabyte' 
    && newUnit =='megabyte'
  ) {
    return (value*1000000)
  };
  if (
    valueUnit  == 'terabyte' 
    && newUnit =='gigabyte'
  ) {
    return (value*1000)
  };
  if (
    valueUnit  == 'terabyte' 
    && newUnit =='terabyte'
  ) {
    return value
  };
  
  if (
    valueUnit  == 'msecs' 
    && newUnit =='secs'
  ) {
    return (value*.001)
  };
  if (
    valueUnit  == 'msecs' 
    && newUnit =='mins'
  ) {
    return (value/60000)
  };
  if (
    valueUnit  == 'msecs' 
    && newUnit =='hrs'
  ) {
    return (value/3600000)
  };
  if (
    valueUnit  == 'msecs' 
    && newUnit =='days'
  ) {
    return (value/86400000)
  };
  if (
    valueUnit  == 'msecs' 
    && newUnit =='weeks'
  ) {
    return (value/604800000)
  };
  if (
    valueUnit  == 'msecs' 
    && newUnit =='months'
  ) {
    return (value/2592000000)
  };
  if (
    valueUnit  == 'msecs' 
    && newUnit =='years'
  ) {
    return (value/31536000000)
  };
  if (
    valueUnit  == 'msecs' 
    && newUnit =='msecs'
  ) {
    return value
  };
  
  if (
    valueUnit  == 'secs' 
    && newUnit =='msecs'
  ) {
    return (value*1000)
  };
  if (
    valueUnit  == 'secs' 
    && newUnit =='mins'
  ) {
    return (value/60)
  };
  if (
    valueUnit  == 'secs' 
    && newUnit =='hrs'
  ) {
    return (value/3600)
  };
  if (
    valueUnit  == 'secs' 
    && newUnit =='days'
  ) {
    return (value/86400)
  };
  if (
    valueUnit  == 'secs' 
    && newUnit =='weeks'
  ) {
    return (value/604800)
  };
  if (
    valueUnit  == 'secs' 
    && newUnit =='months'
  ) {
    return (value/2592000)
  };
  if (
    valueUnit  == 'secs' 
    && newUnit =='years'
  ) {
    return (value/31536000)
  };
  if (
    valueUnit  == 'secs' 
    && newUnit =='secs'
  ) {
    return value
  };
  
  if (
    valueUnit  == 'mins' 
    && newUnit =='msecs'
  ) {
    return (value*60000)
  };
  if (
    valueUnit  == 'mins' 
    && newUnit =='secs'
  ) {
    return (value*60)
  };
  if (
    valueUnit  == 'mins' 
    && newUnit =='hrs'
  ) {
    return (value/60)
  };
  if (
    valueUnit  == 'mins' 
    && newUnit =='days'
  ) {
    return (value/1440)
  };
  if (
    valueUnit  == 'mins' 
    && newUnit =='weeks'
  ) {
    return (value/10080)
  };
  if (
    valueUnit  == 'mins' 
    && newUnit =='months'
  ) {
    return (value/43200)
  };
  if (
    valueUnit  == 'mins' 
    && newUnit =='years'
  ) {
    return (value/525600)
  };
  if (
    valueUnit  == 'mins' 
    && newUnit =='mins'
  ) {
    return value
  };
  
  if (
    valueUnit  == 'hrs' 
    && newUnit =='msecs'
  ) {
    return (value*3600000)
  };
  if (
    valueUnit  == 'hrs' 
    && newUnit =='secs'
  ) {
    return (value*3600)
  };
  if (
    valueUnit  == 'hrs' 
    && newUnit =='mins'
  ) {
    return (value*6)
  };
  if (
    valueUnit  == 'hrs' 
    && newUnit =='days'
  ) {
    return (value/24)
  };
  if (
    valueUnit  == 'hrs' 
    && newUnit =='weeks'
  ) {
    return (value/168)
  };
  if (
    valueUnit  == 'hrs' 
    && newUnit =='months'
  ) {
    return (value/720)
  };
  if (
    valueUnit  == 'hrs' 
    && newUnit =='years'
  ) {
    return (value/8760)
  };
  if (
    valueUnit  == 'hrs' 
    && newUnit =='hrs'
  ) {
    return value
  };
  
  if (
    valueUnit  == 'days' 
    && newUnit =='msecs'
  ) {
    return (value*86400000)
  };
  if (
    valueUnit  == 'days' 
    && newUnit =='secs'
  ) {
    return (value*86400)
  };
  if (
    valueUnit  == 'days' 
    && newUnit =='mins'
  ) {
    return (value*1440)
  };
  if (
    valueUnit  == 'days' 
    && newUnit =='hrs'
  ) {
    return (value*24)
  };
  if (
    valueUnit  == 'days' 
    && newUnit =='weeks'
  ) {
    return (value/7)
  };
  if (
    valueUnit  == 'days' 
    && newUnit =='months'
  ) {
    return (value/30)
  };
  if (
    valueUnit  == 'days' 
    && newUnit =='years'
  ) {
    return (value/365)
  };
  if (
    valueUnit  == 'days' 
    && newUnit =='days'
  ) {
    return value
  };
  
  if (
    valueUnit  == 'weeks' 
    && newUnit =='msecs'
  ) {
    return (value*604800000)
  };
  if (
    valueUnit  == 'weeks' 
    && newUnit =='secs'
  ) {
    return (value*604800)
  };
  if (
    valueUnit  == 'weeks' 
    && newUnit =='mins'
  ) {
    return (value*10080)
  };
  if (
    valueUnit  == 'weeks' 
    && newUnit =='hrs'
  ) {
    return (value*168)
  };
  if (
    valueUnit  == 'weeks' 
    && newUnit =='days'
  ) {
    return (value*7)
  };
  if (
    valueUnit  == 'weeks' 
    && newUnit =='months'
  ) {
    return (value*(7/30))
  };
  if (
    valueUnit  == 'weeks' 
    && newUnit =='years'
  ) {
    return (value*(7/365))
  };
  if (
    valueUnit  == 'weeks' 
    && newUnit =='weeks'
  ) {
    return value
  };
  
  if (
    valueUnit  == 'months' 
    && newUnit =='msecs'
  ) {
    return (value*2592000000)
  };
  if (
    valueUnit  == 'months' 
    && newUnit =='secs'
  ) {
    return (value*2592000)
  };
  if (
    valueUnit  == 'months' 
    && newUnit =='mins'
  ) {
    return (value*43200)
  };
  if (
    valueUnit  == 'months' 
    && newUnit =='hrs'
  ) {
    return (value*720)
  };
  if (
    valueUnit  == 'months' 
    && newUnit =='days'
  ) {
    return (value*30)
  };
  if (
    valueUnit  == 'months' 
    && newUnit =='weeks'
  ) {
    return (value*(30/7))
  };
  if (
    valueUnit  == 'months' 
    && newUnit =='years'
  ) {
    return (value*(30/365))
  };
  if (
    valueUnit  == 'months' 
    && newUnit =='months'
  ) {
    return value
  };
  
  if (
    valueUnit  == 'years' 
    && newUnit =='msecs'
  ) {
    return (value*31536000000)
  };
  if (
    valueUnit  == 'years' 
    && newUnit =='secs'
  ) {
    return (value*31536000)
  };
  if (
    valueUnit  == 'years' 
    && newUnit =='mins'
  ) {
    return (value*525600)
  };
  if (
    valueUnit  == 'years' 
    && newUnit =='hrs'
  ) {
    return (value*8760)
  };
  if (
    valueUnit  == 'years' 
    && newUnit =='days'
  ) {
    return (value*365)
  };
  if (
    valueUnit  == 'years' 
    && newUnit =='weeks'
  ) {
    return (value*(365/7))
  };
  if (
    valueUnit == 'years' 
    && newUnit =='months'
  ) {
    return (value*(365/30))
  };
  if (
    valueUnit == 'years' 
    && newUnit == 'years'
  ) {
    return value
  };
}