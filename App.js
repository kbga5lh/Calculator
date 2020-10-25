import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as styles from './styles.js';
import * as calculator from './calculator.js';

const App = () => {
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState("");

  const scroll = useRef();

  const [openBracketsCount, setOpenBracketsCount] = useState(0);

  function getLastNumberPosition(text) {
    for (let i = text.length - 1; i >= 0; --i) {
      if (calculator.isToken(text[i]))
        return i + 1;
    }
    return 0;
  }

  function numberPressed(number) {
    let result = expression;

    if (result.length > 0 && result[result.length - 1] == ')') { // ')0' => ')'
      return;
    }

    let lastNumber = expression.substring(getLastNumberPosition(expression), expression.length);

    if (lastNumber.length == 1) { // '01' => '1'
      if (lastNumber[0] == '0') {
        result = result.substring(0, result.length - 1);
      }
    }

    result += number;
    setExpression(result);
  }

  function operationPressed(operation) {
    let result = expression;

    if (result.length == 0 && operation != '-') { // '+' => '0+'
      result = "0";
    }

    if (result.length > 0) {
      if (calculator.isOperation(result[result.length - 1])) { // '*+' => '*'
        return;
      }

      if (result[result.length - 1]  == '(') { // '(+' => '('
        return;
      }

      if (result[result.length - 1] == '.') { // '0.' => '0'
        result = result.substr(0, result.length - 1);
      }
    }

    result += operation;
    setExpression(result);
  }

  function dotPressed() {
    let result = expression;
    let lastNumber = expression.substring(getLastNumberPosition(expression), expression.length);

    if (lastNumber.length == 0) { // '.' => '0.'
      result += '0';
      lastNumber += '0';
    }

    if (!lastNumber.includes('.')) {
      result += '.';
      setExpression(result);
    }
  }

  function bracketPressed(isClosing) {
    let result = expression;
    if (expression.length > 0 && expression[expression.length - 1] == '.') { // '0.' => '0'
      result = expression.substr(0, expression.length - 1);
    }

    if (isClosing) {
      if (expression.length == 0 || openBracketsCount == 0 || calculator.isToken(result[result.length - 1])) {
        return;
      }
      setOpenBracketsCount(openBracketsCount - 1);
      result += ")";
    } else {
      if (expression.length != 0 && !calculator.isOperation(result[result.length - 1])) {
        return;
      }
      setOpenBracketsCount(openBracketsCount + 1);
      result += "(";
    }

    setExpression(result);
  }

  function calculate() {
    let correctedExpression = expression;

    if (expression.length > 0) {
      let correctedOpenBracketsCount = openBracketsCount;
      if (correctedExpression[correctedExpression.length - 1] == '(') { // 'expr(' => 'expr'
        correctedExpression = correctedExpression.substring(0, correctedExpression.length - 1);
        correctedOpenBracketsCount -= 1;
      }
      if (calculator.isOperation(correctedExpression[correctedExpression.length - 1])) { // 'expr+' => 'expr'
        correctedExpression = correctedExpression.substring(0, correctedExpression.length - 1);
      }
      if (correctedOpenBracketsCount > 0) { // '(0' => '(0)'
        for (let i = 0; i < correctedOpenBracketsCount; ++i) {
          correctedExpression += ')';
        }
        correctedOpenBracketsCount = 0;
      }
    }
    if (correctedExpression.length == 0) {
      correctedExpression = "0";
    }

    clearState();

    let tokens = calculator.parseTokens(correctedExpression);
    let tree = calculator.parseTree(tokens);
    let result = calculator.calculateNode(tree).toString();

    setHistory(history + "\n" + correctedExpression + "=" + result);
    if (result.includes("Infinity") || result.includes("NaN")) {
      result = "";
    }
    setExpression(result.toString());
    setTimeout(() => scroll.current.scrollToEnd(), 1);
  }

  function backspace() {
    if (expression.length > 0) {
      if (expression[expression.length - 1] == ')') {
        setOpenBracketsCount(openBracketsCount + 1);
      } else if (expression[expression.length - 1] == '(') {
        setOpenBracketsCount(openBracketsCount - 1);
      }
    }
    setExpression(expression.substr(0, expression.length - 1));
  }

  function clearState() {
    setOpenBracketsCount(0);
  }

  function clear() {
    clearState();
    if (!expression)
      setHistory("");
    else
      setExpression("");
  }

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 2}}>
        <View style={{backgroundColor: "#F2B591", flex: 1}}>
          <ScrollView ref={scroll} contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
            <Text style={styles.secondaryText}>{history}</Text>
          </ScrollView>
        </View>
        <View style={{backgroundColor: "#E2A682", height: 80}}>
          <TextInput
            editable={false}
            placeholder="0"
            style={styles.primaryText}>
            {expression}
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