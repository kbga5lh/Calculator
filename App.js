import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const App = () => {
  const [activeText, setActiveText] = useState("");
  const [history, setHistory] = useState("");

  const scroll = useRef();

  function numberPressed(number) {
    setActiveText(activeText + number);
  }

  function operationPressed(operation) {
    setActiveText(activeText + operation);
  }

  function dotPressed() {
    setActiveText(activeText + ".");
  }

  function bracketPressed(isClosing) {
    setActiveText(activeText + (isClosing ? ")" : "("));
  }

  function parseTree(tokens) {
    const operations = [
      ['+', '-'],
      ['*', '/'],
    ];
    function parseNode(leftIndex, rightIndex) {
      if (tokens[leftIndex] == '(' && tokens[rightIndex] == ')')
        return parseNode(leftIndex + 1, rightIndex - 1);
  
      let openedBrackets = 0;
      for (let w in operations) {
        for (let i = rightIndex; i >= leftIndex; --i) {
          if (tokens[i] == ')')
            openedBrackets++;
          else if (tokens[i] == '(')
            openedBrackets--;
          if (openedBrackets == 0 && operations[w].includes(tokens[i])) {
            let l = parseNode(leftIndex, i - 1);
            let r = parseNode(i + 1, rightIndex);
            return {
              left: l,
              operation: tokens[i],
              right: r
            };
          }
        }
      }
  
      if (leftIndex == rightIndex)
        return parseFloat(tokens[leftIndex]);
      return tokens.slice(leftIndex, rightIndex + 1);
    }
  
    return parseNode(0, tokens.length - 1);
  }
  
  function parseTokens() {
    let isToken = function(c) {
      return ['/', '*', '+', '-', '(', ')'].includes(c);
    }
  
    let result = [];
    let currentValue = "";
    for (let pointer in activeText) {
      if (currentValue && (isToken(activeText[pointer]) || isToken(currentValue))) {
        result.push(currentValue);
        currentValue = "";
      }
      currentValue += activeText[pointer];
    }
    if (currentValue)
      result.push(currentValue);
    return result;
  }
  
  function calculateNode(node) {
    if (typeof node == "number")
      return node;
  
    let l = parseFloat(calculateNode(node.left));
    let r = parseFloat(calculateNode(node.right));
  
    return executeOperation(node.operation, l, r);
  }
  
  function executeOperation(op, l, r) {
    switch (op) {
      case '*':
        return l * r;
      case '/':
        return l / r;
      case '+':
        return l + r;
      case '-':
        return l - r;
      default:
        return new Error("unknown operation: " + node.operation);
    }
  }

  function calculate() {
    let tokens = parseTokens();
    let tree = parseTree(tokens);
    let result = calculateNode(tree);

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
            <Text style={{flex: 1, margin: 10, fontSize: 24, fontWeight: "bold", textAlign: "right", textAlignVertical: "bottom", color: "#242532", opacity: 0.5}}>{history}</Text>
          </ScrollView>
        </View>
        <View style={{backgroundColor: "#E2A682", height: 80}}>
          <TextInput
            editable={false}
            placeholder="0"
            style={{flex: 1, margin: 10, fontSize: 32, fontWeight: "bold", textAlign: "right", textAlignVertical: "center", color: "#242532"}}>
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

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#292B3C",
  },
  darkButton: {
    alignItems: "center",
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#242532",
  },
  uniqueButton: {
    alignItems: "center",
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#AD3740",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  }
});

export default App;