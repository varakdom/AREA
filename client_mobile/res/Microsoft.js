import Svg, { Path } from "react-native-svg";

const SVGComponent = (props) => (
  <Svg
    enableBackground="new 0 0 2499.6 2500"
    viewBox="0 0 2499.6 2500"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path d="m1187.9 1187.9h-1187.9v-1187.9h1187.9z" fill="#f1511b" />
    <Path d="m2499.6 1187.9h-1188v-1187.9h1187.9v1187.9z" fill="#80cc28" />
    <Path d="m1187.9 2500h-1187.9v-1187.9h1187.9z" fill="#00adef" />
    <Path d="m2499.6 2500h-1188v-1187.9h1187.9v1187.9z" fill="#fbbc09" />
  </Svg>
);

export default SVGComponent;
