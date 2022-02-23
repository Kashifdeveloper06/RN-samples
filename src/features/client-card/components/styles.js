import { StyleSheet, Platform } from "react-native";

export const CELL_SIZE = 70;
export const CELL_BORDER_RADIUS = 8;
export const DEFAULT_CELL_BG_COLOR = "#fff";
export const NOT_EMPTY_CELL_BG_COLOR = "#3557b7";
export const ACTIVE_CELL_BG_COLOR = "#f7fafe";

export default StyleSheet.create({
  inputWrapper: {
    textAlign: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
  },

  inputLabel: {
    paddingTop: 50,
    color: "#FB7300",
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
    paddingBottom: 40,
    fontFamily: "Montserrat-SemiBold",
  },

  icon: {
    width: 217 / 2.4,
    height: 158 / 2.4,
    marginLeft: "auto",
    marginRight: "auto",
  },
  inputSubLabel: {
    paddingTop: 30,
    color: "#000",
    textAlign: "center",
    fontFamily: "Montserrat-Regular",
  },
  inputWrapStyle: {
    height: CELL_SIZE,
    marginTop: 30,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },

  input: {
    margin: 0,
    height: CELL_SIZE,
    width: CELL_SIZE,
    lineHeight: 55,
    ...Platform.select({
      web: {
        lineHeight: 65,
      },
    }),
    fontSize: 30,
    borderRadius: CELL_BORDER_RADIUS,
    color: "#3759b8",
    backgroundColor: NOT_EMPTY_CELL_BG_COLOR,

    // IOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    // Android
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },

  nextButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00355F",
    padding: 18,
    width: "100%",
    marginTop: 20,
  },

  nextButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
    color: "#fff",
  },
});
