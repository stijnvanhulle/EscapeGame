import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "button": {
        "color": "white",
        "backgroundColor": "#3b3e4b",
        "fontWeight": "400",
        "textAlign": "center",
        "borderRadius": 3,
        "paddingTop": 10,
        "paddingRight": 10,
        "paddingBottom": 10,
        "paddingLeft": 10
    },
    "buttonDisabled": {
        "color": "white",
        "backgroundColor": "#3b3e4b",
        "fontWeight": "400",
        "textAlign": "center",
        "borderRadius": 3,
        "paddingTop": 10,
        "paddingRight": 10,
        "paddingBottom": 10,
        "paddingLeft": 10,
        "opacity": 0.8
    },
    "row": {
        "paddingTop": 8,
        "paddingRight": 8,
        "paddingBottom": 16,
        "paddingLeft": 8
    },
    "smallText": {
        "fontSize": 11
    },
    "bgFill": {
        "backgroundColor": "black",
        "position": "absolute",
        "top": 0,
        "left": 0
    }
});