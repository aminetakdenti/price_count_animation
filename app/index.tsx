import { useState } from "react";
import { Button, Text, type TextProps, View } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";

const numbersToNice = [...Array(10).keys()];
const _lineHeight = 1.2;

const Digit = ({
  children,
  fontSize,
  style,
  ...rest
}: TextProps & { fontSize: number }) => {
  return (
    <View style={{height: fontSize, borderWidth: 1}}>
      <Text
        {...rest}
        style={[
          style,
          {
						flex: 1,
            fontSize: fontSize,
            lineHeight: fontSize * 1.0,
            fontVariant: ["tabular-nums"],
            backgroundColor: "red",
            textAlign: "center",
            fontWeight: "900",
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const DigitList = ({
  value,
  fontSize,
  index,
}: {
  value: number;
  index: number;
  fontSize: number;
}) => {
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(-value * fontSize * 1, {
            duration: 400,
            easing: Easing.out(Easing.quad),
          }),
        },
      ],
    };
  });

  return (
    <View style={{ height: fontSize, overflow: "hidden" }}>
      <Animated.View style={animatedStyles}>
        {numbersToNice.map((digit) => (
          <Digit key={`digit-item-${digit}`} fontSize={fontSize}>
            {digit}
          </Digit>
        ))}
      </Animated.View>
    </View>
  );
};

const CustomAnimatedPrice = ({
  number,
  fontSize = 24,
}: {
  number: string;
  fontSize?: number;
}) => {
  const digits = number.split("");

  return (
    <View>
      <Text>old fontsize: {fontSize} </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {digits.map((digit, index) => {
          if (!Number.isNaN(parseInt(digit, 10))) {
            return (
              <DigitList
                key={`digit-item-${index}`}
                value={parseInt(digit, 10)}
                index={index}
                fontSize={fontSize}
              />
            );
          }
          return (
            <Digit key={`digit-item-${index}`} fontSize={fontSize}>
              {digit}
            </Digit>
          );
        })}
      </View>
    </View>
  );
};

export default function Index() {
  const [number, setNumber] = useState(988885);

  const onClick = () => {
    setNumber(Math.floor(Math.random() * 10000));
  };

  const intlNumber = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(number);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Animated Price: {intlNumber}
      </Text>
      <CustomAnimatedPrice number={intlNumber} fontSize={100} />
      <Button title="Increase" onPress={onClick} />
    </View>
  );
}
