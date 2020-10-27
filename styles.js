import {StyleSheet} from 'react-native';

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
	},
	secondaryText: 
	{
		flex: 1,
		margin: 10,
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "right",
		textAlignVertical: "bottom",
		color: "#242532",
		opacity: 0.5
	},
	primaryText: 
	{
		flex: 1,
		margin: 10,
		fontSize: 32,
		fontWeight: "bold",
		textAlign: "right",
		textAlignVertical: "center",
		color: "#242532"
	}
});
  
module.exports = styles;