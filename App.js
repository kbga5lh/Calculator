import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as styles from './styles.js';
import * as calculator from './calculator.js';

const App = () => {
  const [activeText, setActiveText] = useState("");
  const [history, setHistory] = useState("");

  const scroll = useRef();

  function getLastNumberPosition(text) {
    for (let i = text.length - 1; i >= 0; --i) {
      if (calculator.isToken(text[i]))
        return i + 1;
    }
    return 0;
  }

  function numberPressed(number) {
    let result = activeText;
    result += number;
    setActiveText(result);
  }

  function operationPressed(operation) {
    let result = activeText;

    if (result.length == 0 && operation != '-') { // '+' => '0+'
      result = "0";
    }

    if (result.length > 0 && calculator.isOperation(result[result.length - 1])) { // '*+' => '*'
      return;
    }

    if (result.length > 0 && result[result.length - 1] == '.') { // '0.' => '0'
      result = result.substr(0, result.length - 1);
    }

    result += operation;
    setActiveText(result);
  }

  function dotPressed() {
    let result = activeText;
    let lastNumber = activeText.substring(getLastNumberPosition(activeText), activeText.length);

    if (lastNumber.length == 0) { // '.' => '0.'
      result += '0';
      lastNumber += '0';
    }

    if (!lastNumber.includes('.')) {
      result += '.';
      setActiveText(result);
    }
  }

  function bracketPressed(isClosing) {
    let result = activeText;
    if (activeText.length > 0 && activeText[activeText.length - 1] == '.') { // '0.' => '0'
      result = activeText.substr(0, activeText.length - 1);
    }
    result += (isClosing ? ")" : "(");
    setActiveText(result);
  }

  function calculate() {
    let tokens = calculator.parseTokens(activeText);
    let tree = calculator.parseTree(tokens);
    let result = calculator.calculateNode(tree);

    setHistory(history + "\n" + activeText + "=" + result);
    setActiveText(result.toString());
    setTimeout(() => scroll.current.scrollToEnd(), 1);
  }

  function backspace() {
    setActiveText(activeText.substr(0, activeText.length - 1));
  }

  function clear() {
    if (!activeText)
      setHistory("");
    else
      setActiveText("");
  }

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 2}}>
        <View style={{backgroundColor: "#F2B591", flex: 1}}>
          <ScrollView ref={scroll}>
            <Text style={styles.secondaryText}>{history}</Text>
          </ScrollView>
        </View>
        <View style={{backgroundColor: "#E2A682", height: 80}}>
          <TextInput
            editable={false}
            placeholder="0"
            style={styles.primaryText}>
            {activeText}
          </TextInput>
        </View>
      </View>
      <View style={{flex: 3}}>
        <View style={{flex: 1, flexDirection: "row"}}>
          <TouchableOpacity style={styles.button} activeOpacity={0.9} delayPressIn={0} delayPressOut={0} delayLongPress={0}
            onPress={() => numberPressed(1)}>
            <Text style={styles.buttonText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} activeOpacity={0.9} delayPressIn={0} delayPressOut={0} delayLongPress={0}
            onPress={() => numberPressed(2)}>
            <Text style={styles.buttonText}>2</Text>
          </TouchableOpacity>            
          <TouchableOpacity style={styles.button} activeOpacity={0.9} delayPressIn={0} delayPressOut={0} delayLongPress={0}
            onPress={() => numberPressed(3)}>
            <Text style={styles.buttonText}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.darkButton} activeOpacity={0.9} delayPressIn={0} delayPressOut={0} delayLongPress={0}
            onPress={() => operationPressed("/")}>
            <Text style={styles.buttonText}>/</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, flexDirection: "row"}}>
          <TouchableOpacity style={styles.button} activeOpacity={0.9} delayPressIn={0} delayPressOut={0} delayLongPress={0}
            onPress={() => numberPressed(4)}>
            <Text style={styles.buttonText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} activeOpacity={0.9} delayPressIn={0} delayPressOut={0} delayLongPress={0}
            onPress={() => numberPressed(5)}>
            <Text style={styles.buttonText}>5</Text>
          </TouchableOpacity>            
          <TouchableOpacity style={styles.button} activeOpacity={0.9} delayPressIn={0} delayPressOut={0} delayLongPress={0}
            onPress={() => numberPressed(6)}>
            <Text style={styles.buttonText}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.darkButton} activeOpacity={0.9} delayPressIn={0} delayPressOut={0} delayLongPress={0}
            onPress={() => operationPressed("*")}>
            <Text style={styles.buttonText}>*</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, flexDirection: "row"}}>
          <TouchableOpacity style={styles.button} activeOpacity={0.9} delayPressIn={0} delayPressOut={0} delayLongPress={0}
            onPress={() => numberPressed(7)}>
            <Text style={styles.buttonText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} activeOpacity={0.9} delayPressIn={0} delayPressOut={0} delayLongPress={0}
            onPress={() => numberPressed(8)}>
            <Text style={styles.buttonText}>8</Text>
          </TouchableOpacity>            
          <TouchableOpacity style={styles.button} activeOpacity={0.9} delayPressIn={0} delayPressOut={0} delayLongPress={0}
            onPress={() => numberPressed(9)}>
            <Text style={styles.buttonText}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.darkButton} activeOpacity={0.9} delayPressIn={0} delayPressOut={0} delayLongPress={0}
            onPress={() => operationPressed("+")}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, flexDirection: "row"}}>
          <TouchableOpacity style={styles.button} activeOpacity={0.9} delayPressIn={0} delayPressOut={0} delayLongPress={0}
            onPress={() => bracketPressed(false)}>
            <Text style={styles.buttonText}>(</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} activeOpacity={0.9} delayPressIn={0} delayPressOut={0} delayLongPress={0}
            onPress={() => numberPressed(0)}>
            <Text style={styles.buttonText}>0</Text>
          </TouchableOpacity>            
          <TouchableOpacity style={styles.button} activeOpacity={0.9} delayPressIn={0} delayPressOut={0} delayLongPress={0}
            onPress={() => bracketPressed(true)}>
            <Text style={styles.buttonText}>)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.darkButton} activeOpacity={0.9} delayPressIn={0} delayPressOut={0} delayLongPress={0}
            onPress={() => operationPressed("-")}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, flexDirection: "row"}}>
          <TouchableOpacity style={styles.darkButton} activeOpacity={0.9} delayPressIn={0} delayPressOut={0} delayLongPress={0}
            onPress={() => clear()}>
            <Text style={styles.buttonText}>C</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.darkButton} activeOpacity={0.9} delayPressIn={0} delayPressOut={0} delayLongPress={0}
            onPress={() => dotPressed()}>
            <Text style={styles.buttonText}>.</Text>
          </TouchableOpacity>            
          <TouchableOpacity style={styles.darkButton} activeOpacity={0.9} delayPressIn={0} delayPressOut={0} delayLongPress={0}
            onPress={() => backspace()}>
            <Text style={styles.buttonText}>{"<<"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uniqueButton} activeOpacity={0.9} delayPressIn={0} delayPressOut={0} delayLongPress={0}
            onPress={() => {calculate()}}>
            <Text style={styles.buttonText}>=</Text>
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

export default App;